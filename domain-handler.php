<?php
/**
 * ORIENTAL CONSULTANTS AFGHANISTAN — DOMAIN REGISTRATION & PORTAL CREATION HANDLER
 * Primary Notification Recipient:
 *   - Primary: sa_nsr@yahoo.com
 *   - CC: saeed@ocafghan.com, info@ocafghan.com
 *
 * Standard 4 WhatsApp Hotlines:
 *   +93-799543365 / +93-787098321 / 0093 792002341 / +93 700 567868
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed. Please submit via POST.'
    ]);
    exit;
}

// Support JSON payload or Form data
$rawBody = file_get_contents('php://input');
$json = json_decode($rawBody, true);
$data = is_array($json) ? $json : $_POST;

function clean_input($val) {
    if ($val === null) return '';
    $val = trim($val);
    $val = stripslashes($val);
    $val = htmlspecialchars($val, ENT_QUOTES, 'UTF-8');
    return $val;
}

$domainName   = clean_input($data['Domain'] ?? $data['domain'] ?? '');
$tld          = clean_input($data['Extension'] ?? $data['ext'] ?? '');
$term         = clean_input($data['Registration_Term'] ?? $data['term'] ?? '1 Year');
$totalUsd     = clean_input($data['Total_USD'] ?? $data['totalUsd'] ?? '$0.00');
$totalAfn     = clean_input($data['Total_AFN'] ?? $data['totalAfn'] ?? '0 AFN');
$clientName   = clean_input($data['Customer_Name'] ?? $data['clientName'] ?? 'Authorized Representative');
$org          = clean_input($data['Organization'] ?? $data['clientOrg'] ?? 'Corporate Client');
$portalEmail  = filter_var(trim($data['Portal_Login_Email'] ?? $data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$portalPass   = clean_input($data['Portal_Password'] ?? $data['password'] ?? '');
$phone        = clean_input($data['WhatsApp_Phone'] ?? $data['phone'] ?? '');
$city         = clean_input($data['City_Province'] ?? $data['city'] ?? 'Kabul');
$currency     = clean_input($data['Currency_Preference'] ?? $data['currency'] ?? 'AFN');
$licenseNo    = clean_input($data['Business_License'] ?? $data['licenseNo'] ?? 'N/A');
$dnsSetup     = clean_input($data['DNS_Selection'] ?? $data['dns'] ?? 'Oriental Consultants Anycast DNS');
$customDns    = clean_input($data['Custom_DNS_Details'] ?? $data['customDns'] ?? 'Standard Zone Defaults');

if (empty($domainName) || empty($portalEmail)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Domain name and portal email are required.'
    ]);
    exit;
}

// Target email recipients as requested by the user
$toEmail = 'sa_nsr@yahoo.com';
$ccEmail = 'saeed@ocafghan.com, info@ocafghan.com';

$subject = "New Domain Registration & Portal Account: {$domainName} ({$clientName} - {$org})";

$htmlBody = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <title>New Domain Registration & Portal Account</title>
</head>
<body style='font-family: Arial, sans-serif; background-color: #0b0f19; margin: 0; padding: 20px; color: #334155;'>
  <div style='max-width: 650px; background: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.15);'>
    <div style='background: #011633; padding: 24px; text-align: center; border-bottom: 3px solid #00e5ff;'>
      <h2 style='color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;'>Oriental Consultants Afghanistan</h2>
      <p style='color: #00e5ff; margin: 6px 0 0; font-size: 13px; letter-spacing: 1px; font-weight: 700;'>OFFICIAL AFGHAN REGISTRY &bull; DOMAIN &amp; DNS NOTIFICATION</p>
    </div>
    
    <div style='padding: 24px;'>
      <div style='background: #ecfeff; border-left: 4px solid #00e5ff; padding: 12px 16px; margin-bottom: 20px; border-radius: 4px;'>
        <strong style='color: #0891b2; font-size: 15px;'>New Customer Domain Registered &amp; Portal Login Created!</strong><br>
        <span style='font-size: 13px; color: #0e7490;'>Delivered directly to: <strong>{$toEmail}</strong> (CC: {$ccEmail})</span>
      </div>

      <table style='width: 100%; border-collapse: collapse; font-size: 14px;'>
        <tr style='border-bottom: 1px solid #f1f5f9; background: #f8fafc;'>
          <td style='padding: 10px 12px; width: 38%; font-weight: bold; color: #0f172a;'>Registered Domain:</td>
          <td style='padding: 10px 12px; color: #0284c7; font-weight: 800; font-size: 16px;'>{$domainName}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 12px; font-weight: bold; color: #0f172a;'>Registration Term:</td>
          <td style='padding: 10px 12px;'>{$term}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 12px; font-weight: bold; color: #0f172a;'>Total Payable:</td>
          <td style='padding: 10px 12px; color: #d97706; font-weight: bold;'>{$totalUsd} / Approx. {$totalAfn}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9; background: #f8fafc;'>
          <td style='padding: 10px 12px; font-weight: bold; color: #0f172a;'>Portal Username (Email):</td>
          <td style='padding: 10px 12px; color: #0f172a; font-weight: bold;'>{$portalEmail}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 12px; font-weight: bold; color: #0f172a;'>Portal Initial Password:</td>
          <td style='padding: 10px 12px; color: #475569; font-family: monospace;'>{$portalPass}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 12px; font-weight: bold; color: #0f172a;'>Authorized Contact:</td>
          <td style='padding: 10px 12px;'>{$clientName}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 12px; font-weight: bold; color: #0f172a;'>Organization / NGO:</td>
          <td style='padding: 10px 12px;'>{$org}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 12px; font-weight: bold; color: #0f172a;'>WhatsApp / Mobile:</td>
          <td style='padding: 10px 12px;'>{$phone}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 12px; font-weight: bold; color: #0f172a;'>City / Province:</td>
          <td style='padding: 10px 12px;'>{$city}, Afghanistan</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 12px; font-weight: bold; color: #0f172a;'>Currency Preference:</td>
          <td style='padding: 10px 12px;'>{$currency}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9;'>
          <td style='padding: 10px 12px; font-weight: bold; color: #0f172a;'>Business License (Jawaz) / Tazkira:</td>
          <td style='padding: 10px 12px;'>{$licenseNo}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9; background: #f0fdf4;'>
          <td style='padding: 10px 12px; font-weight: bold; color: #166534;'>DNS Setup Configuration:</td>
          <td style='padding: 10px 12px; color: #166534; font-weight: bold;'>{$dnsSetup}</td>
        </tr>
        <tr style='border-bottom: 1px solid #f1f5f9; background: #f8fafc;'>
          <td style='padding: 10px 12px; font-weight: bold; color: #0f172a;'>Custom DNS Records / Notes:</td>
          <td style='padding: 10px 12px; font-family: monospace; font-size: 13px;'>{$customDns}</td>
        </tr>
        <tr>
          <td style='padding: 10px 12px; font-weight: bold; color: #0f172a;'>Registration Timestamp:</td>
          <td style='padding: 10px 12px; color: #64748b; font-size: 13px;'>" . date('Y-m-d H:i:s T') . "</td>
        </tr>
      </table>

      <div style='margin-top: 24px; padding: 14px; background: #f8fafc; border-radius: 6px; font-size: 13px; color: #475569;'>
        <strong>Next Steps:</strong>
        <ul style='margin: 8px 0 0; padding-left: 20px;'>
          <li>Verify registry availability and lock domain in .af ccTLD registry.</li>
          <li>Confirm payment via Kabul Bank / Azizi Bank wire receipt or cash at Kabul Head Office.</li>
          <li>Issue official Ministry of Finance (MoF) tax receipt (TIN: 1045181011).</li>
          <li>Activate Anycast DNS records for the client portal.</li>
        </ul>
      </div>
    </div>
    
    <div style='background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;'>
      &copy; " . date('Y') . " Oriental Consultants Afghanistan &bull; House 22, Street 17 Karte 3, Kabul<br>
      Direct Hotlines: +93-799543365 / +93-787098321 / 0093 792002341 / +93 700 567868
    </div>
  </div>
</body>
</html>
";

// Headers
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Oriental Consultants Portal <info@ocafghan.com>\r\n";
$headers .= "Reply-To: {$clientName} <{$portalEmail}>\r\n";
$headers .= "Cc: {$ccEmail}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$mailSent = @mail($toEmail, $subject, $htmlBody, $headers);

echo json_encode([
    'success'  => true,
    'message'  => 'Domain order and portal account notification received successfully.',
    'mailSent' => $mailSent,
    'target'   => $toEmail,
    'cc'       => $ccEmail
]);
