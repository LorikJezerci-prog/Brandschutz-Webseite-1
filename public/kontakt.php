<?php
/**
 * Kontaktformular Brandschutz Ried (all-inkl, PHP 8).
 * Nimmt POST von /kontakt/ entgegen, prüft die Angaben und sendet eine E-Mail
 * über den Mailserver der eigenen Domain. Antwortet mit JSON (fetch) oder
 * per Weiterleitung (ohne JavaScript).
 */
declare(strict_types=1);

const TO          = 'info@brandschutz-ried.de';
const FROM        = 'website@brandschutz-ried.de'; // Absender auf eigener Domain (SPF/DKIM)
const SITE_HOSTS  = ['www.brandschutz-ried.de', 'brandschutz-ried.de'];
const MIN_FILL_MS = 2500;
const RATE_LIMIT  = 5;      // Anfragen …
const RATE_WINDOW = 900;    // … je 15 Minuten und IP

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json')
    || str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'application/json');

function respond(bool $ok, string $code = '', array $errors = []): never {
    global $wantsJson;
    $messages = [
        'invalid' => 'Bitte prüfen Sie die markierten Felder.',
        'rate'    => 'Es wurden zu viele Anfragen in kurzer Zeit gesendet. Bitte versuchen Sie es später erneut.',
        'origin'  => 'Die Anfrage konnte nicht zugeordnet werden. Bitte laden Sie die Seite neu.',
        'format'  => 'Die Anfrage hatte ein unerwartetes Format.',
        'failed'  => 'Ihre Anfrage konnte gerade nicht versendet werden. Bitte versuchen Sie es später erneut oder schreiben Sie direkt eine E-Mail.',
    ];
    if ($wantsJson) {
        http_response_code($ok ? 200 : ($code === 'rate' ? 429 : ($code === 'invalid' ? 422 : 400)));
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'code' => $code, 'message' => $messages[$code] ?? $messages['failed'], 'errors' => (object)$errors]);
        exit;
    }
    $target = $ok ? '/kontakt/danke/' : '/kontakt/?fehler=' . rawurlencode($code)
        . ($errors ? '&felder=' . rawurlencode(implode(',', array_keys($errors))) : '') . '#formular';
    header('Location: ' . $target, true, 303);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST', true, 405);
    exit('Nur POST.');
}

// Herkunft prüfen
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array(parse_url($origin, PHP_URL_HOST), SITE_HOSTS, true)) respond(false, 'origin');
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) respond(false, 'format');

$raw = $_POST;
if (str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) {
    $raw = json_decode((string)file_get_contents('php://input'), true);
    if (!is_array($raw)) respond(false, 'format');
}

// Rate-Limit: Hash der IP, Dateien im Temp-Ordner, max. 15 Minuten
$dir = sys_get_temp_dir() . '/bsr-kontakt';
@mkdir($dir, 0700, true);
$key = $dir . '/' . hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . 'bsr-salz');
$now = time();
$hits = array_filter(array_map('intval', @file($key, FILE_IGNORE_NEW_LINES) ?: []), fn($t) => $t > $now - RATE_WINDOW);
if (count($hits) >= RATE_LIMIT) respond(false, 'rate');
$hits[] = $now;
@file_put_contents($key, implode("\n", $hits), LOCK_EX);
foreach (glob($dir . '/*') ?: [] as $f) if (@filemtime($f) < $now - RATE_WINDOW) @unlink($f);

// Honeypot und Zeitfalle: Bots bekommen eine neutrale Erfolgsmeldung
$started = (int)($raw['_t'] ?? 0);
if (trim((string)($raw['website'] ?? '')) !== '' || ($started > 0 && (int)(microtime(true) * 1000) - $started < MIN_FILL_MS)) respond(true);

$clean = fn($v, bool $multi = false) => trim(preg_replace($multi ? '/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/u' : '/[\x00-\x1F\x7F]/u', ' ', is_string($v) ? $v : '') ?? '');
$d = [
    'name'     => $clean($raw['name'] ?? ''),
    'company'  => $clean($raw['company'] ?? ''),
    'email'    => strtolower($clean($raw['email'] ?? '')),
    'phone'    => $clean($raw['phone'] ?? ''),
    'service'  => $clean($raw['service'] ?? ''),
    'location' => $clean($raw['location'] ?? ''),
    'message'  => $clean($raw['message'] ?? '', true),
];
$privacy = in_array($raw['privacy'] ?? '', ['on', 'true', '1', true], true);
$len = fn($s) => mb_strlen($s);
$e = [];
if ($len($d['name']) < 2 || $len($d['name']) > 100) $e['name'] = 1;
if ($len($d['company']) < 2 || $len($d['company']) > 150) $e['company'] = 1;
if (!filter_var($d['email'], FILTER_VALIDATE_EMAIL) || $len($d['email']) > 200) $e['email'] = 1;
if ($d['phone'] !== '' && !preg_match('/^[0-9+()\/\-.\s]{6,40}$/', $d['phone'])) $e['phone'] = 1;
if (!preg_match('/^[a-z0-9-]{2,60}$/', $d['service'])) $e['service'] = 1;
if ($len($d['location']) < 2 || $len($d['location']) > 150) $e['location'] = 1;
if ($len($d['message']) < 10 || $len($d['message']) > 4000) $e['message'] = 1;
if (!$privacy) $e['privacy'] = 1;
if ($e) {
    $texts = ['name' => 'Bitte geben Sie Ihren Namen an.', 'company' => 'Bitte geben Sie Ihr Unternehmen an.', 'email' => 'Bitte geben Sie eine gültige E-Mail-Adresse an.', 'phone' => 'Die Telefonnummer enthält ungültige Zeichen.', 'service' => 'Bitte wählen Sie eine Leistung aus.', 'location' => 'Bitte geben Sie den Standort des Objekts an.', 'message' => 'Bitte beschreiben Sie Ihr Anliegen in ein paar Sätzen (10 bis 4000 Zeichen).', 'privacy' => 'Bitte bestätigen Sie die Datenschutzhinweise.'];
    respond(false, 'invalid', array_intersect_key($texts, $e));
}

$service = ucfirst(str_replace('-', ' ', $d['service']));
$subject = 'Anfrage über die Website: ' . $service . ' – ' . $d['company'];
$body = "Neue Anfrage über brandschutz-ried.de\n\n"
    . "Name:        {$d['name']}\nUnternehmen: {$d['company']}\nE-Mail:      {$d['email']}\n"
    . 'Telefon:     ' . ($d['phone'] ?: '–') . "\nLeistung:    {$service}\nStandort:    {$d['location']}\n\n"
    . "Nachricht:\n{$d['message']}\n\n— Gesendet am " . date('d.m.Y H:i') . " Uhr. Antworten geht direkt an den Absender.\n";
$headers = implode("\r\n", [
    'From: Website Brandschutz Ried <' . FROM . '>',
    'Reply-To: ' . $d['email'],
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'MIME-Version: 1.0',
]);
$ok = mail(TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f' . FROM);
respond($ok, $ok ? '' : 'failed');
