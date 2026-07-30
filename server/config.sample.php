<?php
// ECA CMS configuration template.
//
// The easiest path: just open cms.php in a browser once — its first-run setup
// creates this file for you. To do it by hand instead:
//   1. Copy this file to  eca-cms-config.php  in the folder ABOVE your web root
//      (e.g. /home/<account>/eca-cms-config.php, not web-accessible), or to
//      config.php  next to cms.php (kept private by media/.htaccess only if you
//      also deny it — the outside-the-webroot location is preferred).
//   2. Replace the hash below. Generate one with:
//        php -r 'echo password_hash("your-strong-password", PASSWORD_DEFAULT), "\n";'
return [
  'user' => 'admin',
  'hash' => '$2y$10$replace_this_with_a_real_bcrypt_hash______________________',

  // Optional overrides:
  // 'media'        => __DIR__ . '/ecaproject.eu/media', // absolute path to media/
  // 'session_name' => 'eca_cms',
];
