<?php
// ECA CMS — a single auth-protected endpoint that manages the site's content
// (resource PDFs, event galleries and event report texts) by editing files on
// disk and media/manifest.json. No database. See README-cms.md for deployment.
require __DIR__ . '/cms_lib.php';

const MAX_PDF = 31457280;   // 30 MB
const MAX_IMG = 15728640;   // 15 MB
const CATEGORY_LABELS = [
  'handbook' => 'Handbook', 'curriculum' => 'Curriculum', 'practice' => 'Best practice',
  'lesson_plan' => 'Lesson plans', 'worksheet' => 'Worksheets', 'hw' => 'Homework',
  'questions' => 'Question collection',
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
    // ---- Appearance --------------------------------------------------------
    case 'theme_save': {
      // The free-text hex wins when filled in; otherwise take the colour picker.
      $hex = cms_hex_color($_POST['hex'] ?? '') ?? cms_hex_color($_POST['background'] ?? '');
      if (($_POST['hex'] ?? '') !== '' && cms_hex_color($_POST['hex']) === null) {
        throw new RuntimeException('Not a valid colour — use the form #rrggbb (e.g. #fce9e3).');
      }
      if (!is_array($m['theme'] ?? null)) $m['theme'] = [];
      $m['theme']['background'] = $hex;
      manifest_save($m);
      flash_set($hex ? ('Background colour set to ' . $hex . '.') : 'Background colour saved.');
      break;
    }
    case 'theme_reset': {
      // An explicit null (rather than a missing key) also clears the colour for
      // visitors who cached the previous one.
      if (!is_array($m['theme'] ?? null)) $m['theme'] = [];
      $m['theme']['background'] = null;
      manifest_save($m);
      flash_set('Background colour reset to the default.');
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

  render_theme_section((array) ($m['theme'] ?? []));
  render_foot();
}

// ---- Appearance -----------------------------------------------------------
function render_theme_section(array $theme): void {
  $current = cms_hex_color($theme['background'] ?? null);
  $shown = $current ?? CMS_DEFAULT_BG;
  echo '<h2>Appearance — background colour</h2>';
  echo '<p class="muted">The page background for the whole site. Pick a colour, watch the preview, then save — visitors get it on their next page load, with no rebuild or redeploy.</p>';
  echo '<section class="card">';
  echo '<form method="post" id="themeForm" data-current="' . h($shown) . '">' . csrf_field();
  echo '<input type="hidden" name="do" value="theme_save">';
  echo '<div class="th-grid">';

  // Live preview: a small mock of the real page.
  echo '<div>';
  echo '<div class="th-label">Preview</div>';
  echo '<div class="th-preview" id="pvPage">';
  echo   '<div class="pv-bar"><span class="pv-logo">ECA</span><span class="pv-nav"><i class="pv-pill"></i><i></i><i></i><i></i></span></div>';
  echo   '<div class="pv-hero">Emotion · Cognition · Action</div>';
  echo   '<div class="pv-body">';
  echo     '<div class="pv-card"><b>White content card</b><span>Body text sits on this white surface.</span><span class="pv-btn">Download</span></div>';
  echo     '<div class="pv-card"><b>Resources</b><span>Handbook · Curriculum · Lesson plans</span></div>';
  echo   '</div>';
  echo   '<div class="pv-foot"></div>';
  echo '</div>';
  echo '</div>';

  // Controls.
  echo '<div class="th-controls">';
  echo '<div class="th-label">Colour</div>';
  echo '<div class="th-row">';
  echo   '<span class="swatch" id="thBig" style="background:' . h($shown) . '"></span>';
  echo   '<div class="th-fields">';
  echo     '<label class="inline-lbl">Hex<input name="hex" id="thHex" value="' . h($shown) . '" size="9" maxlength="7" spellcheck="false"></label>';
  echo     '<label class="inline-lbl">Picker<input type="color" name="background" id="thPick" value="' . h($shown) . '"></label>';
  echo     '<button type="button" class="ghost small" id="thDrop" hidden>Pick from screen</button>';
  echo   '</div>';
  echo '</div>';

  echo '<div class="th-label">RGB</div><div class="th-sliders">';
  foreach ([['R', 255], ['G', 255], ['B', 255]] as [$k, $max]) {
    echo '<div class="th-slider"><span>' . $k . '</span>';
    echo '<input type="range" min="0" max="' . $max . '" id="th' . $k . '">';
    echo '<output id="th' . $k . 'v">0</output></div>';
  }
  echo '</div>';

  echo '<div class="th-label">HSL</div><div class="th-sliders">';
  foreach ([['H', 360], ['S', 100], ['L', 100]] as [$k, $max]) {
    echo '<div class="th-slider"><span>' . $k . '</span>';
    echo '<input type="range" min="0" max="' . $max . '" id="th' . $k . '">';
    echo '<output id="th' . $k . 'v">0</output></div>';
  }
  echo '</div>';

  echo '<div class="th-label">Presets</div><div class="th-swatches">';
  foreach (CMS_SWATCHES as [$hex, $name]) {
    echo '<button type="button" class="sw" data-c="' . $hex . '" title="' . h($name) . ' — ' . $hex . '" style="background:' . $hex . '"></button>';
  }
  echo '</div>';

  echo '<p class="th-status" id="thStatus"></p>';
  echo '<div class="th-actions">';
  echo   '<button>Save colour</button>';
  echo   '<button type="button" class="ghost" id="thRevert">Undo changes</button>';
  echo '</div>';
  echo '</div>'; // .th-controls

  echo '</div>'; // .th-grid
  echo '</form>';

  if ($current) {
    echo '<form method="post" class="danger-row">' . csrf_field();
    echo '<input type="hidden" name="do" value="theme_reset">';
    echo '<button class="link">Reset to the default (' . CMS_DEFAULT_BG . ')</button></form>';
  } else {
    echo '<p class="muted" style="margin:.6rem 0 0">Currently using the built-in default (' . CMS_DEFAULT_BG . ').</p>';
  }
  echo '</section>';
  echo '<script>' . cms_theme_js() . '</script>';
}

// Client-side wiring for the colour picker: keeps hex / native picker / RGB /
// HSL / swatches in sync and repaints the preview. Plain vanilla JS — the CMS
// loads no external assets. Without JS the hex field and the native colour
// input still submit a valid colour on their own.
function cms_theme_js(): string {
  return <<<'JS'
(function () {
  var form = document.getElementById('themeForm');
  if (!form) return;
  var START = form.getAttribute('data-current');
  var $ = function (id) { return document.getElementById(id); };
  var hexIn = $('thHex'), pick = $('thPick'), big = $('thBig'),
      page = $('pvPage'), status = $('thStatus');
  var rgbIds = ['thR', 'thG', 'thB'], hslIds = ['thH', 'thS', 'thL'];
  var lock = false; // guards the two-way sync

  function clamp(v, hi) { return Math.max(0, Math.min(hi, v)); }
  function toHex(r, g, b) {
    return '#' + [r, g, b].map(function (v) {
      return clamp(Math.round(v), 255).toString(16).padStart(2, '0');
    }).join('');
  }
  function parse(v) {
    v = String(v || '').trim().toLowerCase();
    if (/^[0-9a-f]{3}$/.test(v) || /^[0-9a-f]{6}$/.test(v)) v = '#' + v;
    if (/^#[0-9a-f]{3}$/.test(v)) v = '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3];
    return /^#[0-9a-f]{6}$/.test(v) ? v : null;
  }
  function toRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0, s = 0, l = (mx + mn) / 2;
    if (d) {
      s = d / (1 - Math.abs(2 * l - 1));
      h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60; if (h < 0) h += 360;
    }
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
  }
  function hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
    var t = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
          : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return [(t[0] + m) * 255, (t[1] + m) * 255, (t[2] + m) * 255];
  }

  // Paint everything from one colour. `from` names the control that changed, so
  // it is not written back to (which would fight the user's typing/dragging).
  function apply(hex, from) {
    if (lock) return;
    lock = true;
    var rgb = toRgb(hex), hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);

    if (from !== 'hex') hexIn.value = hex;
    if (from !== 'pick') pick.value = hex;
    if (from !== 'rgb') rgbIds.forEach(function (id, i) { $(id).value = rgb[i]; });
    if (from !== 'hsl') hslIds.forEach(function (id, i) { $(id).value = hsl[i]; });
    rgbIds.forEach(function (id, i) { $(id + 'v').value = rgb[i]; });
    hslIds.forEach(function (id, i) { $(id + 'v').value = hsl[i] + (i ? '%' : '°'); });

    big.style.background = hex;
    page.style.background = hex;
    hexIn.classList.remove('bad');
    status.textContent = hex + (hex.toLowerCase() === String(START).toLowerCase()
      ? '  ·  saved' : '  ·  not saved yet');
    lock = false;
  }

  hexIn.addEventListener('input', function () {
    var v = parse(hexIn.value);
    if (v) apply(v, 'hex'); else hexIn.classList.add('bad');
  });
  hexIn.addEventListener('blur', function () { apply(parse(hexIn.value) || START, 'none'); });
  pick.addEventListener('input', function () { apply(parse(pick.value) || START, 'pick'); });
  rgbIds.forEach(function (id) {
    $(id).addEventListener('input', function () {
      apply(toHex(+$('thR').value, +$('thG').value, +$('thB').value), 'rgb');
    });
  });
  hslIds.forEach(function (id) {
    $(id).addEventListener('input', function () {
      apply(toHex.apply(null, hslToRgb(+$('thH').value, +$('thS').value, +$('thL').value)), 'hsl');
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll('.th-swatches .sw'), function (b) {
    b.addEventListener('click', function () { apply(b.getAttribute('data-c'), 'none'); });
  });
  $('thRevert').addEventListener('click', function () { apply(START, 'none'); });

  // Chrome's screen eyedropper, when available.
  if (window.EyeDropper) {
    var drop = $('thDrop');
    drop.hidden = false;
    drop.addEventListener('click', function () {
      new window.EyeDropper().open().then(function (r) {
        var v = parse(r.sRGBHex); if (v) apply(v, 'none');
      }).catch(function () {});
    });
  }

  apply(parse(START) || '#fce9e3', 'none');
})();
JS;
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
  .swatch{width:54px;height:54px;border-radius:10px;border:1px solid var(--line);display:inline-block;flex:0 0 auto}
  .inline-lbl{display:inline-flex;align-items:center;gap:.4rem;margin:0;white-space:nowrap;font-size:.9rem;font-weight:600}
  .inline-lbl input{width:auto}
  input[type=color]{padding:.1rem;height:2.2rem;width:3.2rem;cursor:pointer}
  button.small{padding:.3rem .6rem;font-size:.85rem}
  .th-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1.2rem;align-items:start}
  @media(max-width:820px){.th-grid{grid-template-columns:1fr}}
  .th-label{font-weight:700;font-size:.78rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);margin:.9rem 0 .35rem}
  .th-grid .th-label:first-child{margin-top:0}
  .th-row{display:flex;gap:.8rem;align-items:center}
  .th-fields{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}
  #thHex{font-family:ui-monospace,monospace;text-transform:lowercase}
  #thHex.bad{border-color:#c0392b;background:#fdecea}
  .th-sliders{display:grid;gap:.3rem}
  .th-slider{display:grid;grid-template-columns:1.1rem 1fr 3rem;align-items:center;gap:.5rem}
  .th-slider span{font-weight:700;color:var(--muted);font-size:.85rem}
  .th-slider input[type=range]{width:100%;accent-color:var(--brand)}
  .th-slider output{font-family:ui-monospace,monospace;font-size:.82rem;color:var(--muted);text-align:right}
  .th-swatches{display:flex;flex-wrap:wrap;gap:.4rem}
  .th-swatches .sw{width:30px;height:30px;padding:0;border-radius:8px;border:1px solid var(--line);cursor:pointer}
  .th-swatches .sw:hover{outline:2px solid var(--brand);outline-offset:1px}
  .th-status{font-family:ui-monospace,monospace;font-size:.82rem;color:var(--muted);margin:.9rem 0 .5rem}
  .th-actions{display:flex;gap:.6rem;align-items:center}
  /* Mini mock of the real page, so the colour can be judged in context. */
  .th-preview{border:1px solid var(--line);border-radius:12px;overflow:hidden;font-size:.72rem;line-height:1.35}
  .pv-bar{background:#fff;border-bottom:1px solid var(--line);padding:.45rem .6rem;display:flex;justify-content:space-between;align-items:center}
  .pv-logo{font-weight:800;color:#e0765a;letter-spacing:.06em}
  .pv-nav{display:flex;gap:.3rem;align-items:center}
  .pv-nav i{width:22px;height:6px;border-radius:99px;background:#e2e2e2;display:block}
  .pv-nav i.pv-pill{background:#e0765a;width:30px}
  .pv-hero{background:#fff;text-align:center;color:#e0765a;font-weight:700;font-size:.95rem;padding:.9rem 0 1.1rem;border-bottom:1px solid #f0f0f0}
  .pv-body{padding:.7rem;display:grid;gap:.55rem}
  .pv-card{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:9px;padding:.6rem .7rem;display:grid;gap:.25rem}
  .pv-card span{color:#6b6b6b}
  .pv-btn{justify-self:start;background:#e0765a;color:#fff;font-weight:700;border-radius:99px;padding:.22rem .7rem;margin-top:.2rem}
  .pv-foot{background:#333;height:26px}
  pre{background:#fff;border:1px solid var(--line);border-radius:8px;padding:.8rem;overflow:auto}
  CSS;
}
