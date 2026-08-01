<?php
// Shared helpers for the ECA flat-file CMS (cms.php). No database: the content
// index lives in media/manifest.json and the files live under media/. One admin
// user, whose bcrypt hash is kept in a config file (ideally outside the web root).

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// Candidate locations for the config file, most-preferred first. The parent of
// the web root is best (not web-accessible); an in-root config.php is the
// fallback (protected by .htaccess). Override with the ECA_CMS_CONFIG env var.
function cms_config_candidates(): array {
  $c = [];
  if (getenv('ECA_CMS_CONFIG')) $c[] = getenv('ECA_CMS_CONFIG');
  $c[] = dirname(__DIR__) . '/eca-cms-config.php'; // outside the docroot
  $c[] = __DIR__ . '/config.php';                  // inside the docroot (fallback)
  return $c;
}

// Load the config array, or null if the CMS has not been set up yet.
function cms_config(): ?array {
  foreach (cms_config_candidates() as $path) {
    if (is_file($path)) {
      $cfg = include $path;
      if (is_array($cfg) && !empty($cfg['user']) && !empty($cfg['hash'])) return $cfg;
    }
  }
  return null;
}

// Absolute path to the media directory (where files + manifest.json live).
function cms_media_dir(): string {
  $cfg = cms_config();
  $dir = $cfg['media'] ?? (__DIR__ . '/media');
  return rtrim($dir, '/');
}

function cms_manifest_path(): string {
  return cms_media_dir() . '/manifest.json';
}

// ---------------------------------------------------------------------------
// Session / auth / CSRF
// ---------------------------------------------------------------------------

function cms_boot(): void {
  $cfg = cms_config();
  session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => !empty($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Lax',
  ]);
  session_name($cfg['session_name'] ?? 'eca_cms');
  session_start();
  if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
  }
}

function cms_is_logged_in(): bool {
  return !empty($_SESSION['auth']);
}

function cms_login(string $user, string $pass): bool {
  $cfg = cms_config();
  if (!$cfg) return false;
  // Always run password_verify (no short-circuit) to avoid user enumeration.
  $userOk = hash_equals($cfg['user'], $user);
  $passOk = password_verify($pass, $cfg['hash']);
  if ($userOk && $passOk) {
    session_regenerate_id(true);
    $_SESSION['auth'] = true;
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return true;
  }
  return false;
}

function cms_logout(): void {
  $_SESSION = [];
  session_destroy();
}

function h(string $s): string {
  return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

function csrf_field(): string {
  return '<input type="hidden" name="csrf" value="' . h($_SESSION['csrf'] ?? '') . '">';
}

function require_csrf(): void {
  $sent = $_POST['csrf'] ?? '';
  if (!$sent || empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $sent)) {
    http_response_code(400);
    exit('Bad CSRF token. Go back and try again.');
  }
}

function flash_set(string $msg, string $type = 'ok'): void {
  $_SESSION['flash'] = ['msg' => $msg, 'type' => $type];
}

function flash_get(): ?array {
  $f = $_SESSION['flash'] ?? null;
  unset($_SESSION['flash']);
  return $f;
}

// Redirect back to the CMS (Post/Redirect/Get) and stop.
function cms_redirect(string $query = ''): void {
  $self = strtok($_SERVER['REQUEST_URI'], '?');
  header('Location: ' . $self . ($query ? ('?' . $query) : ''));
  exit;
}

// ---------------------------------------------------------------------------
// Manifest read / write
// ---------------------------------------------------------------------------

function manifest_default(): array {
  return [
    'version' => 1,
    'updatedAt' => gmdate('c'),
    'resources' => new stdClass(),
    'events' => ['hu' => [], 'pl' => []],
  ];
}

function manifest_load(): array {
  $path = cms_manifest_path();
  if (!is_file($path)) return manifest_default();
  $data = json_decode(file_get_contents($path), true);
  if (!is_array($data)) return manifest_default();
  $data['resources'] ??= [];
  $data['events'] ??= ['hu' => [], 'pl' => []];
  return $data;
}

// Write the manifest atomically (temp file + rename) under an exclusive lock.
function manifest_save(array $m): void {
  $m['updatedAt'] = gmdate('c');
  $m['version'] = $m['version'] ?? 1;
  if (empty($m['resources'])) $m['resources'] = new stdClass();
  $json = json_encode(
    $m,
    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
  );
  // Never overwrite the manifest with garbage: bail if encoding failed (e.g. a
  // malformed-UTF-8 paste) rather than writing a truncated/false value.
  if ($json === false) {
    throw new RuntimeException('Could not encode content (' . json_last_error_msg() . '); nothing was saved.');
  }
  $path = cms_manifest_path();
  $tmp = $path . '.tmp';
  if (file_put_contents($tmp, $json . "\n", LOCK_EX) === false || !rename($tmp, $path)) {
    @unlink($tmp);
    throw new RuntimeException('Could not write manifest.json — is media/ writable?');
  }
}

// ---------------------------------------------------------------------------
// Event body codec: Block[] <-> plain text (a tiny line-based syntax)
//   "## heading"    -> { h }
//   "- bullet"      -> item of a { list }
//   "* lead para"   -> { lead }
//   "-- signature"  -> { sig }
//   anything else   -> plain paragraph string; blank line separates blocks
// ---------------------------------------------------------------------------

function blocks_to_text(array $blocks): string {
  $parts = [];
  foreach ($blocks as $b) {
    if (is_string($b)) {
      $parts[] = $b;
    } elseif (isset($b['lead'])) {
      $parts[] = '* ' . $b['lead'];
    } elseif (isset($b['h'])) {
      $parts[] = '## ' . $b['h'];
    } elseif (isset($b['sig'])) {
      $parts[] = '-- ' . $b['sig'];
    } elseif (isset($b['list']) && is_array($b['list'])) {
      $parts[] = implode("\n", array_map(fn($i) => '- ' . $i, $b['list']));
    }
  }
  return implode("\n\n", $parts);
}

function text_to_blocks(string $text): array {
  $lines = preg_split('/\r\n|\r|\n/', $text);
  $blocks = [];
  $list = null;
  $flush = function () use (&$blocks, &$list) {
    if ($list !== null) {
      $blocks[] = ['list' => $list];
      $list = null;
    }
  };
  foreach ($lines as $line) {
    $line = rtrim($line);
    if ($line === '') { $flush(); continue; }
    if (strncmp($line, '## ', 3) === 0) { $flush(); $blocks[] = ['h' => trim(substr($line, 3))]; }
    elseif (strncmp($line, '-- ', 3) === 0) { $flush(); $blocks[] = ['sig' => trim(substr($line, 3))]; }
    elseif (strncmp($line, '* ', 2) === 0) { $flush(); $blocks[] = ['lead' => trim(substr($line, 2))]; }
    elseif (strncmp($line, '- ', 2) === 0) { if ($list === null) $list = []; $list[] = trim(substr($line, 2)); }
    else { $flush(); $blocks[] = $line; }
  }
  $flush();
  return $blocks;
}

// ---------------------------------------------------------------------------
// Slugs, paths, uploads
// ---------------------------------------------------------------------------

function cms_slug(string $s): string {
  $map = [
    'á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ö'=>'o','ő'=>'o','ú'=>'u','ü'=>'u','ű'=>'u',
    'Á'=>'a','É'=>'e','Í'=>'i','Ó'=>'o','Ö'=>'o','Ő'=>'o','Ú'=>'u','Ü'=>'u','Ű'=>'u',
    'ł'=>'l','Ł'=>'l','ą'=>'a','ć'=>'c','ę'=>'e','ń'=>'n','ś'=>'s','ź'=>'z','ż'=>'z',
  ];
  $s = strtr($s, $map);
  $s = strtolower($s);
  $s = preg_replace('/[^a-z0-9]+/', '-', $s);
  return trim($s, '-');
}

// Resolve a media-relative path to an absolute one, refusing traversal.
function cms_media_abs(string $rel): ?string {
  $rel = ltrim($rel, '/');
  if ($rel === '' || strpos($rel, "\\") !== false || preg_match('#(^|/)\.\.(/|$)#', $rel)) {
    return null;
  }
  return cms_media_dir() . '/' . $rel;
}

function cms_delete_media(string $rel): void {
  $abs = cms_media_abs($rel);
  if ($abs && is_file($abs)) @unlink($abs);
}

// Recursively remove a directory tree under the media root (used to drop an
// event's whole image folder). Guarded to the media dir.
function cms_rmtree(string $rel): void {
  $abs = cms_media_abs($rel);
  if (!$abs || !is_dir($abs)) return;
  $it = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($abs, FilesystemIterator::SKIP_DOTS),
    RecursiveIteratorIterator::CHILD_FIRST
  );
  foreach ($it as $f) {
    $f->isDir() ? @rmdir($f->getPathname()) : @unlink($f->getPathname());
  }
  @rmdir($abs);
}

// Move an uploaded file into media/<destRelDir>/<slug(stem)>.<ext>, validating
// the extension against the whitelist. Returns the media-relative path.
function cms_store_upload(array $file, string $destRelDir, string $stem, array $allowedExt, int $maxBytes): string {
  if (!isset($file['error']) || is_array($file['error'])) {
    throw new RuntimeException('Invalid upload.');
  }
  if ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE) {
    throw new RuntimeException('File is too large for the server limit.');
  }
  if ($file['error'] !== UPLOAD_ERR_OK) {
    throw new RuntimeException('Upload failed (error ' . $file['error'] . ').');
  }
  if ($file['size'] <= 0 || $file['size'] > $maxBytes) {
    throw new RuntimeException('File is empty or exceeds ' . round($maxBytes / 1048576) . ' MB.');
  }
  $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
  if (!in_array($ext, $allowedExt, true)) {
    throw new RuntimeException('Type .' . $ext . ' is not allowed here.');
  }
  // Sniff the real content type, so a renamed script can't slip through.
  $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']) ?: '';
  $mimeOk = $ext === 'pdf' ? $mime === 'application/pdf' : strpos($mime, 'image/') === 0;
  if (!$mimeOk) {
    throw new RuntimeException('File content is not a valid .' . $ext . ' (' . $mime . ').');
  }
  $destAbsDir = cms_media_abs($destRelDir);
  if (!$destAbsDir) throw new RuntimeException('Bad destination.');
  if (!is_dir($destAbsDir)) mkdir($destAbsDir, 0755, true);

  $base = cms_slug($stem) ?: 'file';
  $rel = rtrim($destRelDir, '/') . '/' . $base . '.' . $ext;
  $n = 2;
  while (is_file(cms_media_abs($rel))) {
    $rel = rtrim($destRelDir, '/') . '/' . $base . '-' . $n++ . '.' . $ext;
  }
  if (!move_uploaded_file($file['tmp_name'], cms_media_abs($rel))) {
    throw new RuntimeException('Could not save the uploaded file.');
  }
  return $rel;
}

// Known resource categories and languages (kept in sync with the frontend).
const CMS_CATEGORIES = ['handbook', 'curriculum', 'lesson_plan', 'worksheet', 'hw', 'questions'];
const CMS_LANGS = ['hu', 'en', 'pl'];
const CMS_COUNTRIES = ['hu', 'pl'];
