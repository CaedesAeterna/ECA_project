<?php
// ECA CMS — a single auth-protected endpoint that manages the site's content
// (resource PDFs, event galleries and event report texts) by editing files on
// disk and media/manifest.json. No database. See README-cms.md for deployment.
require __DIR__ . '/cms_lib.php';

const MAX_PDF = 31457280;   // 30 MB
const MAX_IMG = 15728640;   // 15 MB
const CATEGORY_LABELS = [
  'handbook' => 'Handbook', 'curriculum' => 'Curriculum', 'lesson_plan' => 'Lesson plans',
  'worksheet' => 'Worksheets', 'hw' => 'Homework', 'questions' => 'Question collection',
];
const COUNTRY_LABELS = ['hu' => 'Hungary', 'pl' => 'Poland'];

cms_boot();
$configured = cms_config() !== null;
$do = $_POST['do'] ?? '';
$isPost = $_SERVER['REQUEST_METHOD'] === 'POST';

// ---------------------------------------------------------------------------
// First-run setup (only reachable while no config exists)
// ---------------------------------------------------------------------------
if (!$configured) {
  $setupError = null;
  $manualConfig = null;
  if ($isPost && $do === 'setup') {
    $user = trim($_POST['user'] ?? '');
    $pw = (string) ($_POST['password'] ?? '');
    $pw2 = (string) ($_POST['password2'] ?? '');
    if ($user === '' || strlen($pw) < 8) {
      $setupError = 'Pick a username and a password of at least 8 characters.';
    } elseif ($pw !== $pw2) {
      $setupError = 'The two passwords do not match.';
    } else {
      $hash = password_hash($pw, PASSWORD_DEFAULT);
      $body = "<?php\nreturn " . var_export(['user' => $user, 'hash' => $hash], true) . ";\n";
      $outside = dirname(__DIR__) . '/eca-cms-config.php';
      $inside = __DIR__ . '/config.php';
      $target = is_writable(dirname($outside)) ? $outside : $inside;
      if (@file_put_contents($target, $body) !== false) {
        @chmod($target, 0600);
        flash_set('Admin account created. Please log in.');
        cms_redirect();
      } else {
        $manualConfig = $body; // could not write — show it to paste manually
        $setupError = 'Could not write the config file automatically.';
      }
    }
  }
  render_head('ECA CMS — setup');
  echo '<h1>Set up the ECA CMS</h1>';
  echo '<p class="muted">This runs once. It creates the single admin account. Do it immediately after upload.</p>';
  if ($setupError) echo '<p class="flash err">' . h($setupError) . '</p>';
  if ($manualConfig) {
    echo '<p>Create a file named <code>eca-cms-config.php</code> in the folder <em>above</em> your web root (or <code>config.php</code> next to this file) with:</p>';
    echo '<pre>' . h($manualConfig) . '</pre>';
  }
  echo '<form method="post" class="card" style="max-width:22rem">';
  echo '<input type="hidden" name="do" value="setup">';
  echo '<label>Username<input name="user" value="' . h($_POST['user'] ?? 'admin') . '" autocomplete="username"></label>';
  echo '<label>Password<input type="password" name="password" autocomplete="new-password"></label>';
  echo '<label>Repeat password<input type="password" name="password2" autocomplete="new-password"></label>';
  echo '<button type="submit">Create admin</button>';
  echo '</form>';
  render_foot();
  exit;
}

// ---------------------------------------------------------------------------
// Login / logout
// ---------------------------------------------------------------------------
$loginError = null;
if ($isPost && $do === 'login') {
  if (cms_login(trim($_POST['user'] ?? ''), (string) ($_POST['password'] ?? ''))) {
    flash_set('Welcome.');
    cms_redirect();
  }
  usleep(700000); // slow brute force a little
  $loginError = 'Invalid username or password.';
}
if ($isPost && $do === 'logout') {
  require_csrf();
  cms_logout();
  cms_redirect();
}

if (!cms_is_logged_in()) {
  render_head('ECA CMS — sign in');
  echo '<h1>ECA CMS</h1>';
  if ($loginError) echo '<p class="flash err">' . h($loginError) . '</p>';
  echo '<form method="post" class="card" style="max-width:20rem">';
  echo '<input type="hidden" name="do" value="login">';
  echo '<label>Username<input name="user" autocomplete="username"></label>';
  echo '<label>Password<input type="password" name="password" autocomplete="current-password"></label>';
  echo '<button type="submit">Sign in</button>';
  echo '</form>';
  render_foot();
  exit;
}

// ---------------------------------------------------------------------------
// Authenticated mutations (Post/Redirect/Get)
// ---------------------------------------------------------------------------
if ($isPost && $do !== '') {
  require_csrf();
  try {
    handle_action($do);
  } catch (Throwable $e) {
    flash_set($e->getMessage(), 'err');
  }
  cms_redirect();
}

render_dashboard();

// ===========================================================================
// Actions
// ===========================================================================
function handle_action(string $do): void {
  $m = manifest_load();
  switch ($do) {
    case 'res_upload': {
      $cat = $_POST['cat'] ?? '';
      $lang = $_POST['lang'] ?? '';
      if (!in_array($cat, CMS_CATEGORIES, true) || !in_array($lang, CMS_LANGS, true)) {
        throw new RuntimeException('Unknown category or language.');
      }
      $group = trim($_POST['group'] ?? '');
      $orig = $_FILES['file']['name'] ?? 'file.pdf';
      $stem = pathinfo($orig, PATHINFO_FILENAME);
      $destDir = 'resources/' . $cat . '/' . $lang . ($group !== '' ? '/' . cms_slug($group) : '');
      $rel = cms_store_upload($_FILES['file'], $destDir, $stem, ['pdf'], MAX_PDF);
      $title = trim($_POST['title'] ?? '');
      if ($title === '') $title = preg_replace('/^ECA[\s_-]*/i', '', str_replace('_', ' ', $stem));
      $doc = ['file' => $rel, 'title' => $title, 'download' => $orig];
      if ($group !== '') $doc['group'] = $group;
      $m['resources'][$cat][$lang][] = $doc;
      res_sort($m['resources'][$cat][$lang]);
      manifest_save($m);
      flash_set('Uploaded to ' . $cat . ' / ' . $lang . '.');
      break;
    }
    case 'res_title': {
      $file = $_POST['file'] ?? '';
      $title = trim($_POST['title'] ?? '');
      foreach ($m['resources'] as &$langs) {
        foreach ($langs as &$docs) {
          foreach ($docs as &$d) if (($d['file'] ?? '') === $file && $title !== '') $d['title'] = $title;
        }
      }
      unset($langs, $docs, $d);
      manifest_save($m);
      flash_set('Title updated.');
      break;
    }
    case 'res_delete': {
      $file = $_POST['file'] ?? '';
      foreach ($m['resources'] as &$langs) {
        foreach ($langs as &$docs) {
          $docs = array_values(array_filter($docs, fn($d) => ($d['file'] ?? '') !== $file));
        }
      }
      unset($langs, $docs);
      cms_delete_media($file);
      manifest_save($m);
      flash_set('File deleted.');
      break;
    }
    case 'event_save': {
      $country = $_POST['country'] ?? '';
      if (!in_array($country, CMS_COUNTRIES, true)) throw new RuntimeException('Unknown country.');
      $id = $_POST['id'] ?? '';
      $entry = [
        'date' => trim($_POST['date'] ?? ''),
        'title' => ['hu' => trim($_POST['title_hu'] ?? ''), 'en' => trim($_POST['title_en'] ?? '')],
        'body' => [
          'hu' => text_to_blocks((string) ($_POST['body_hu'] ?? '')),
          'en' => text_to_blocks((string) ($_POST['body_en'] ?? '')),
        ],
      ];
      $list = &$m['events'][$country];
      $idx = event_index($list, $id);
      if ($idx === null) {
        // create
        $entry['id'] = unique_event_id($list, cms_slug($entry['title']['hu'] ?: $entry['title']['en'] ?: $entry['date']) ?: 'event');
        $entry['images'] = [];
        $list[] = $entry;
        flash_set('Event created.');
      } else {
        $entry['id'] = $list[$idx]['id'];
        $entry['images'] = $list[$idx]['images'] ?? [];
        $list[$idx] = $entry;
        flash_set('Event saved.');
      }
      unset($list);
      manifest_save($m);
      break;
    }
    case 'event_delete': {
      $country = $_POST['country'] ?? '';
      if (!in_array($country, CMS_COUNTRIES, true)) throw new RuntimeException('Unknown country.');
      $id = $_POST['id'] ?? '';
      $list = &$m['events'][$country];
      $idx = event_index($list, $id);
      if ($idx !== null) {
        cms_rmtree('gallery/events/' . $country . '/' . $id);
        array_splice($list, $idx, 1);
      }
      unset($list);
      manifest_save($m);
      flash_set('Event deleted.');
      break;
    }
    case 'image_upload': {
      $country = $_POST['country'] ?? '';
      if (!in_array($country, CMS_COUNTRIES, true)) throw new RuntimeException('Unknown country.');
      $id = $_POST['id'] ?? '';
      $list = &$m['events'][$country];
      $idx = event_index($list, $id);
      if ($idx === null) throw new RuntimeException('Event not found.');
      $files = $_FILES['images'] ?? null;
      if (!$files || !is_array($files['name'])) throw new RuntimeException('No images selected.');
      $destDir = 'gallery/events/' . $country . '/' . $id;
      $count = count($files['name']);
      $added = 0;
      for ($i = 0; $i < $count; $i++) {
        if (($files['error'][$i] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) continue;
        $one = [
          'name' => $files['name'][$i], 'type' => $files['type'][$i], 'tmp_name' => $files['tmp_name'][$i],
          'error' => $files['error'][$i], 'size' => $files['size'][$i],
        ];
        $n = count($list[$idx]['images']) + $added + 1;
        $rel = cms_store_upload($one, $destDir, $id . '-' . $n, ['jpg', 'jpeg', 'png', 'webp'], MAX_IMG);
        $list[$idx]['images'][] = $rel;
        $added++;
      }
      unset($list);
      manifest_save($m);
      flash_set($added . ' image(s) added.');
      break;
    }
    case 'image_delete': {
      $country = $_POST['country'] ?? '';
      if (!in_array($country, CMS_COUNTRIES, true)) throw new RuntimeException('Unknown country.');
      $id = $_POST['id'] ?? '';
      $file = $_POST['file'] ?? '';
      $list = &$m['events'][$country];
      $idx = event_index($list, $id);
      if ($idx !== null) {
        $list[$idx]['images'] = array_values(array_filter($list[$idx]['images'] ?? [], fn($p) => $p !== $file));
        cms_delete_media($file);
      }
      unset($list);
      manifest_save($m);
      flash_set('Image removed.');
      break;
    }
    default:
      throw new RuntimeException('Unknown action.');
  }
}

function res_sort(array &$list): void {
  usort($list, function ($a, $b) {
    $g = strnatcasecmp($a['group'] ?? '', $b['group'] ?? '');
    return $g !== 0 ? $g : strnatcasecmp($a['title'] ?? '', $b['title'] ?? '');
  });
}

function event_index(array $list, string $id): ?int {
  foreach ($list as $i => $e) if (($e['id'] ?? '') === $id) return $i;
  return null;
}

function unique_event_id(array $list, string $base): string {
  $id = $base;
  $n = 2;
  while (event_index($list, $id) !== null) $id = $base . '-' . $n++;
  return $id;
}

// ===========================================================================
// Views
// ===========================================================================
function render_dashboard(): void {
  $m = manifest_load();
  render_head('ECA CMS');
  echo '<div class="topbar"><h1>ECA CMS</h1>';
  echo '<form method="post">' . csrf_field() . '<input type="hidden" name="do" value="logout"><button class="ghost">Sign out</button></form></div>';
  $f = flash_get();
  if ($f) echo '<p class="flash ' . h($f['type']) . '">' . h($f['msg']) . '</p>';

  // ---- Resources -----------------------------------------------------------
  echo '<h2>Resources</h2>';
  foreach (CMS_CATEGORIES as $cat) {
    echo '<section class="card">';
    echo '<h3>' . h(CATEGORY_LABELS[$cat]) . '</h3>';
    foreach (CMS_LANGS as $lang) {
      $docs = $m['resources'][$cat][$lang] ?? [];
      if (!$docs) continue;
      echo '<div class="lang"><span class="tag">' . strtoupper($lang) . '</span><ul class="files">';
      foreach ($docs as $d) {
        echo '<li>';
        echo '<a href="media/' . h($d['file']) . '" target="_blank" rel="noopener">' . h($d['title'] ?? $d['file']) . '</a>';
        if (!empty($d['group'])) echo ' <span class="muted">· ' . h($d['group']) . '</span>';
        echo '<form method="post" class="inline" onsubmit="return confirm(\'Delete this file?\')">' . csrf_field();
        echo '<input type="hidden" name="do" value="res_delete"><input type="hidden" name="file" value="' . h($d['file']) . '">';
        echo '<button class="link danger">delete</button></form>';
        echo '<form method="post" class="inline" title="Rename">' . csrf_field();
        echo '<input type="hidden" name="do" value="res_title"><input type="hidden" name="file" value="' . h($d['file']) . '">';
        echo '<input name="title" value="' . h($d['title'] ?? '') . '" size="24"><button class="link">save</button></form>';
        echo '</li>';
      }
      echo '</ul></div>';
    }
    // upload form
    echo '<form method="post" enctype="multipart/form-data" class="upload">' . csrf_field();
    echo '<input type="hidden" name="do" value="res_upload"><input type="hidden" name="cat" value="' . h($cat) . '">';
    echo '<select name="lang">';
    foreach (CMS_LANGS as $l) echo '<option value="' . $l . '">' . strtoupper($l) . '</option>';
    echo '</select>';
    echo '<input name="title" placeholder="Title (optional)">';
    if ($cat === 'lesson_plan') echo '<input name="group" placeholder="Group (optional)">';
    echo '<input type="file" name="file" accept="application/pdf" required>';
    echo '<button>Upload PDF</button>';
    echo '</form>';
    echo '</section>';
  }

  // ---- Events --------------------------------------------------------------
  echo '<h2>Events</h2>';
  echo '<p class="muted legend">Report text markers — <code>## heading</code>, <code>- bullet</code>, <code>* lead paragraph</code>, <code>-- signature</code>; a blank line starts a new paragraph.</p>';
  foreach (CMS_COUNTRIES as $country) {
    $events = $m['events'][$country] ?? [];
    echo '<section class="card">';
    echo '<h3>' . h(COUNTRY_LABELS[$country]) . ' <span class="muted">(' . count($events) . ')</span></h3>';
    foreach ($events as $e) render_event_editor($country, $e);
    echo '<details class="new"><summary>+ New event</summary>';
    render_event_form($country, null);
    echo '</details>';
    echo '</section>';
  }
  render_foot();
}

function render_event_editor(string $country, array $e): void {
  echo '<details class="event">';
  echo '<summary><b>' . h($e['date'] ?? '') . '</b> — ' . h($e['title']['hu'] ?? $e['title']['en'] ?? $e['id']) . '</summary>';
  render_event_form($country, $e);
  // images
  echo '<div class="images"><h4>Images</h4><div class="thumbs">';
  foreach (($e['images'] ?? []) as $img) {
    echo '<div class="thumb"><img src="media/' . h($img) . '" alt="">';
    echo '<form method="post" onsubmit="return confirm(\'Remove image?\')">' . csrf_field();
    echo '<input type="hidden" name="do" value="image_delete"><input type="hidden" name="country" value="' . h($country) . '">';
    echo '<input type="hidden" name="id" value="' . h($e['id']) . '"><input type="hidden" name="file" value="' . h($img) . '">';
    echo '<button class="link danger">remove</button></form></div>';
  }
  echo '</div>';
  echo '<form method="post" enctype="multipart/form-data" class="upload">' . csrf_field();
  echo '<input type="hidden" name="do" value="image_upload"><input type="hidden" name="country" value="' . h($country) . '">';
  echo '<input type="hidden" name="id" value="' . h($e['id']) . '">';
  echo '<input type="file" name="images[]" accept="image/jpeg,image/png,image/webp" multiple required><button>Add images</button></form>';
  echo '</div>';
  // delete event
  echo '<form method="post" class="danger-row" onsubmit="return confirm(\'Delete this whole event and its images?\')">' . csrf_field();
  echo '<input type="hidden" name="do" value="event_delete"><input type="hidden" name="country" value="' . h($country) . '">';
  echo '<input type="hidden" name="id" value="' . h($e['id']) . '"><button class="link danger">Delete event</button></form>';
  echo '</details>';
}

function render_event_form(string $country, ?array $e): void {
  echo '<form method="post" class="event-form">' . csrf_field();
  echo '<input type="hidden" name="do" value="event_save"><input type="hidden" name="country" value="' . h($country) . '">';
  echo '<input type="hidden" name="id" value="' . h($e['id'] ?? '') . '">';
  echo '<label>Date<input name="date" value="' . h($e['date'] ?? '') . '" placeholder="2026.04.02"></label>';
  echo '<div class="two">';
  echo '<label>Title (HU)<input name="title_hu" value="' . h($e['title']['hu'] ?? '') . '"></label>';
  echo '<label>Title (EN)<input name="title_en" value="' . h($e['title']['en'] ?? '') . '"></label>';
  echo '</div><div class="two">';
  echo '<label>Report (HU)<textarea name="body_hu" rows="10">' . h(blocks_to_text($e['body']['hu'] ?? [])) . '</textarea></label>';
  echo '<label>Report (EN)<textarea name="body_en" rows="10">' . h(blocks_to_text($e['body']['en'] ?? [])) . '</textarea></label>';
  echo '</div>';
  echo '<button>' . ($e ? 'Save event' : 'Create event') . '</button>';
  echo '</form>';
}

function render_head(string $title): void {
  echo '<!doctype html><html lang="en"><head><meta charset="utf-8">';
  echo '<meta name="viewport" content="width=device-width,initial-scale=1"><title>' . h($title) . '</title>';
  echo '<style>' . cms_css() . '</style></head><body><div class="wrap">';
}

function render_foot(): void {
  echo '</div></body></html>';
}

function cms_css(): string {
  return <<<CSS
  :root{--brand:#e0765a;--ink:#333;--muted:#6b6b6b;--line:#e5e0dc;--bg:#fbf6f3}
  *{box-sizing:border-box}
  body{margin:0;font:15px/1.5 system-ui,sans-serif;color:var(--ink);background:var(--bg)}
  .wrap{max-width:940px;margin:0 auto;padding:1.5rem 1rem 4rem}
  h1{font-size:1.5rem;margin:.2rem 0}h2{margin:2rem 0 .5rem;border-bottom:2px solid var(--brand);padding-bottom:.2rem}
  h3{margin:.2rem 0 .6rem}h4{margin:.8rem 0 .3rem}
  a{color:var(--brand)}.muted{color:var(--muted)}.legend code{background:#fff;border:1px solid var(--line);border-radius:4px;padding:0 .3rem}
  .topbar{display:flex;align-items:center;justify-content:space-between}
  .card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:1rem 1.1rem;margin:.8rem 0}
  label{display:block;margin:.5rem 0;font-weight:600}
  input,select,textarea{width:100%;font:inherit;padding:.45rem .55rem;border:1px solid var(--line);border-radius:8px;background:#fff}
  input[size]{width:auto}
  textarea{font:13px/1.5 ui-monospace,monospace;resize:vertical}
  button{font:inherit;font-weight:700;background:var(--brand);color:#fff;border:0;border-radius:8px;padding:.5rem .9rem;cursor:pointer}
  button.ghost{background:#fff;color:var(--ink);border:1px solid var(--line)}
  button.link{background:none;color:var(--brand);padding:.1rem .3rem;font-weight:600}
  button.link.danger,.danger{color:#c0392b}
  .flash{padding:.6rem .8rem;border-radius:8px;background:#e8f5e9}.flash.err{background:#fdecea;color:#8a1c12}
  .lang{display:flex;gap:.6rem;align-items:flex-start;margin:.3rem 0}
  .tag{background:var(--brand);color:#fff;border-radius:6px;padding:.05rem .4rem;font-size:.75rem;font-weight:700;margin-top:.35rem}
  ul.files{list-style:none;margin:0;padding:0;flex:1}
  ul.files li{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;padding:.25rem 0;border-bottom:1px dashed var(--line)}
  .inline{display:inline}.inline input{display:inline-block}
  form.upload{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin-top:.7rem;padding-top:.7rem;border-top:1px solid var(--line)}
  form.upload input,form.upload select{width:auto}
  .two{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}
  @media(max-width:640px){.two{grid-template-columns:1fr}}
  details.event,details.new{border:1px solid var(--line);border-radius:8px;padding:.5rem .8rem;margin:.5rem 0}
  details.event summary,details.new summary{cursor:pointer;font-weight:600}
  .event-form{margin-top:.6rem}
  .thumbs{display:flex;flex-wrap:wrap;gap:.6rem}
  .thumb{width:130px}.thumb img{width:130px;height:90px;object-fit:cover;border-radius:6px;border:1px solid var(--line)}
  .danger-row{margin-top:.6rem}
  pre{background:#fff;border:1px solid var(--line);border-radius:8px;padding:.8rem;overflow:auto}
  CSS;
}
