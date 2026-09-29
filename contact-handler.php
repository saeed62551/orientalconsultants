<?php
/**
 * ORIENTAL CONSULTANTS AFGHANISTAN — EXECUTIVE CONSULTATION FORM HANDLER
 * Target Recipients:
 *   - Primary: info@ocafghan.com
 *   - CC: saeed@ocafghan.com
 *
 * Direct WhatsApp Hotlines:
 *   +93-799543365 / +93-787098321 / 0093 792002341 / +93 700 567868
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed. Please submit the form via POST.'
    ]);
    exit;
}

// Helper to sanitize input
function clean_input($data) {
    if ($data === null) return '';
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Retrieve POST fields
$name        = clean_input($_POST['clientName'] ?? '');
$org         = clean_input($_POST['clientOrg'] ?? 'Not specified');
$email       = filter_var(trim($_POST['clientEmail'] ?? ''), FILTER_SANITIZE_EMAIL);
$phone       = clean_input($_POST['clientPhone'] ?? '');
$service     = clean_input($_POST['clientService'] ?? 'Executive Consultation');
$province    = clean_input($_POST['clientProvince'] ?? 'Kabul');
$format      = clean_input($_POST['clientFormat'] ?? 'In-Person (Kabul HQ)');
$urgency     = clean_input($_POST['clientUrgency'] ?? 'Normal');
$budget      = clean_input($_POST['clientBudget'] ?? 'Not specified');
$partnerLine = clean_input($_POST['clientPartnerLine'] ?? '+93-799543365 (Sayyed Ul Abrar)');
$message     = clean_input($_POST['clientMessage'] ?? 'No additional details provided.');

// Validation
$errors = [];
if (empty($name)) {
    $errors[] = 'Full name is required.';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}
if (empty($phone)) {
    $errors[] = 'Phone / WhatsApp contact number is required.';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors),
        'errors'  => $errors
    ]);
    exit;
}

// Recipient details as strictly specified
$toEmail = 'info@ocafghan.com';
$ccEmail = 'saeed@ocafghan.com';

$subject = "[Consultation Request] {$service} - {$name} (" . ($org ? $org : 'Client') . ")";

// HTML Body
$htmlBody = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <title>New Consultation Request</title>
</head>
<body style='font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px;'>
  <div style='max-width: 650px; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);'>
    <div style='background: #011633; padding: 24px; text-align: center; border-bottom: 3px solid #d97706;'>
      <h2 style='color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;'>Oriental Consultants Afghanistan</h2>
      <p style='color: #38bdf8; margin: 6px 0 0; font-size: 13px; letter-spacing: 1px;'>EXECUTIVE CONSULTATION BOOKING DISPATCH</p>
    </div>
    
    <div style='padding: 24px;'>
      <div style='background: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 16px; margin-bottom: 20px;'>
        <strong style='color: #065f46;'>New Executive Inquiry Received</strong><br>
        <span style='font-size: 13px; color: #047857;'>Delivered to <strong>info@ocafghan.com</strong> with CC to <strong>saeed@ocafghan.com</strong></span>
      </div>

      <table style='width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;'>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 0; width: 35%; font-weight: bold; color: #0f172a;'>Client Full Name:</td>
          <td style='padding: 10px 0;'>{$name}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 0; font-weight: bold; color: #0f172a;'>Organization / Company:</td>
          <td style='padding: 10px 0;'>{$org}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 0; font-weight: bold; color: #0f172a;'>Email Address:</td>
          <td style='padding: 10px 0;'><a href='mailto:{$email}' style='color: #0284c7; text-decoration: none;'>{$email}</a></td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 0; font-weight: bold; color: #0f172a;'>Phone / WhatsApp:</td>
          <td style='padding: 10px 0;'><strong>{$phone}</strong></td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 0; font-weight: bold; color: #0f172a;'>Practice Area / Service:</td>
          <td style='padding: 10px 0;'><span style='background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-weight: bold;'>{$service}</span></td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 0; font-weight: bold; color: #0f172a;'>Province / Location:</td>
          <td style='padding: 10px 0;'>{$province}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 0; font-weight: bold; color: #0f172a;'>Consultation Format:</td>
          <td style='padding: 10px 0;'>{$format}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 0; font-weight: bold; color: #0f172a;'>Urgency / Timeline:</td>
          <td style='padding: 10px 0;'>{$urgency}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 0; font-weight: bold; color: #0f172a;'>Estimated Budget:</td>
          <td style='padding: 10px 0;'>{$budget}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 0; font-weight: bold; color: #0f172a;'>Selected Partner Hotline:</td>
          <td style='padding: 10px 0;'>{$partnerLine}</td>
        </tr>
      </table>

      <div style='margin-top: 20px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;'>
        <h4 style='margin: 0 0 8px; color: #0f172a; font-size: 14px;'>Project Scope & Requirements:</h4>
        <p style='margin: 0; font-size: 14px; color: #475569; line-height: 1.6; white-space: pre-wrap;'>{$message}</p>
      </div>

      <div style='margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;'>
        Sent automatically from Oriental Consultants Web Portal (contact.html)<br>
        Kabul HQ: House 22, Street 17 Karte 3, Kabul, Afghanistan<br>
        Hotlines: +93-799543365 / +93-787098321 / 0093 792002341 / +93 700 567868
      </div>
    </div>
  </div>
</body>
</html>
";

// Headers
$headers   = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=utf-8';
$headers[] = 'From: Oriental Consultants Portal <noreply@ocafghan.com>';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'Cc: ' . $ccEmail;
$headers[] = 'X-Mailer: PHP/' . phpversion();

$headerString = implode("\r\n", $headers);

// Attempt PHP mail()
$mailSent = false;
if (function_exists('mail')) {
    $mailSent = @mail($toEmail, $subject, $htmlBody, $headerString);
}

// Return JSON response
if ($mailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your consultation request has been delivered to info@ocafghan.com and cc\'d to saeed@ocafghan.com. Our senior partners will contact you promptly.',
        'recipient' => $toEmail,
        'cc' => $ccEmail,
        'data' => [
            'name' => $name,
            'org' => $org,
            'service' => $service,
            'phone' => $phone
        ]
    ]);
} else {
    // If local PHP mail is disabled or server mail agent not configured, report success with client-side fallback
    echo json_encode([
        'success' => true,
        'sent_via_fallback' => true,
        'message' => 'Consultation inquiry prepared for info@ocafghan.com (cc: saeed@ocafghan.com).',
        'mailto_url' => 'mailto:' . $toEmail . '?cc=' . rawurlencode($ccEmail) . '&subject=' . rawurlencode($subject) . '&body=' . rawurlencode("Name: {$name}\nOrg: {$org}\nPhone/WhatsApp: {$phone}\nEmail: {$email}\nService: {$service}\nProvince: {$province}\nFormat: {$format}\nUrgency: {$urgency}\nBudget: {$budget}\nDetails:\n{$message}"),
        'data' => [
            'name' => $name,
            'org' => $org,
            'service' => $service,
            'phone' => $phone
        ]
    ]);
}
