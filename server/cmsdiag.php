<?php
// Temporary diagnostic for the CMS 500. Written in PHP 5-compatible syntax so it
// runs even on an old PHP that can't parse cms.php. Visit /cmsdiag.php, read the
// output, then DELETE this file (remove it from the deploy-cpanel.yml copy step).
header('Content-Type: text/plain; charset=utf-8');

$dir = dirname(__FILE__);
$php = phpversion();
$ok74 = version_compare($php, '7.4.0', '>=');
$ok80 = version_compare($php, '8.0.0', '>=');

echo "== ECA CMS diagnostics ==\n";
echo "PHP version         : " . $php . (($ok80) ? "  (OK)" : ($ok74 ? "  (7.4 — works, 8.x preferred)" : "  <-- TOO OLD, needs >= 7.4")) . "\n";
echo "fileinfo extension  : " . (extension_loaded('fileinfo') ? "yes" : "NO  <-- uploads need this") . "\n";
echo "session extension   : " . (extension_loaded('session') ? "yes" : "NO") . "\n";
echo "json extension      : " . (extension_loaded('json') ? "yes" : "NO") . "\n";
echo "\n-- files (expected next to this one) --\n";
echo "cms.php             : " . (is_file($dir . '/cms.php') ? "present" : "MISSING") . "\n";
echo "cms_lib.php         : " . (is_file($dir . '/cms_lib.php') ? "present" : "MISSING  <-- cms.php require()s it") . "\n";
echo "media/              : " . (is_dir($dir . '/media') ? "present" : "MISSING (run the Seed CMS media workflow)") . "\n";
echo "media/manifest.json : " . (is_file($dir . '/media/manifest.json') ? "present" : "MISSING (run Seed CMS media)") . "\n";
echo "\n-- writability (CMS needs these) --\n";
echo "media/ writable     : " . (is_dir($dir . '/media') && is_writable($dir . '/media') ? "yes" : "no") . "\n";
echo "above-docroot write : " . (is_writable(dirname($dir)) ? "yes (config can go outside webroot)" : "no (setup will fall back to config.php)") . "\n";
echo "config present      : " . (is_file(dirname($dir) . '/eca-cms-config.php') ? "yes (outside)" : (is_file($dir . '/config.php') ? "yes (in docroot)" : "no (setup not done yet)")) . "\n";

echo "\n-- last PHP errors (the actual 500 cause, if logged here) --\n";
$found = false;
$candidates = array($dir . '/error_log', dirname($dir) . '/error_log', $dir . '/php_errorlog');
foreach ($candidates as $lg) {
  if (is_file($lg)) {
    $found = true;
    echo "(" . $lg . ")\n";
    $lines = @file($lg);
    if ($lines) {
      echo implode('', array_slice($lines, -20));
    }
    break;
  }
}
if (!$found) {
  echo "no error_log file next to the script. Check cPanel -> Metrics -> Errors instead.\n";
}

echo "\n== verdict ==\n";
if (!$ok74) {
  echo "PHP is too old to run the CMS. In cPanel -> MultiPHP Manager set ecaproject.eu to PHP 8.1 or 8.2.\n";
} elseif (!is_file($dir . '/cms_lib.php')) {
  echo "cms_lib.php did not deploy. Re-push (the workflow copies it), then reload cms.php.\n";
} else {
  echo "Environment looks OK for the CMS. If cms.php still 500s, read the error lines above / cPanel Errors and send them.\n";
}
