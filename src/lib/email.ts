import nodemailer from 'nodemailer';

interface SendOtpOptions {
  to: string;
  otp: string;
  customerName?: string;
  purpose?: string;
}

interface SendConfirmationOptions {
  to: string;
  customerName: string;
  referenceCode: string;
  requestType: string;
  summary: string;
}

interface SendStatusUpdateOptions {
  to?: string | null;
  customerName: string;
  referenceCode: string;
  recordType: string;
  status: string;
  details?: string;
}

export type StatusEmailResult = {
  sent: boolean;
  mode: 'smtp' | 'dev' | 'skipped';
  reason?: 'missing_email' | 'smtp_not_configured' | 'send_failed';
};

function getSmtpConfig() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER || '';
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
  const rawFrom = process.env.SMTP_FROM || '';
  const from = rawFrom
    ? rawFrom.replace(/^"|"$/g, '').trim()
    : `"Pradeep Furniture Atelier" <${user || 'pradeepfurniture2@gmail.com'}>`;

  const isConfigured = Boolean(user && pass);

  return { host, port, secure, user, pass, from, isConfigured };
}

function createTransporter() {
  const config = getSmtpConfig();
  if (!config.isConfigured) return null;

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

/**
 * Common HTML email shell wrapper with luxury styling
 */
function wrapEmailTemplate(contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>Pradeep Furniture Atelier</title>
  <style>
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; }
      .content-padding { padding: 24px 20px !important; }
      .otp-digits { font-size: 32px !important; letter-spacing: 8px !important; }
      .features-table td { display: block !important; width: 100% !important; margin-bottom: 12px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f3ef; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c201d; -webkit-font-smoothing: antialiased;">
  <!-- Preheader spacing -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f3ef; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" class="email-container" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2ddd5; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
          
          <!-- Gold Ribbon Top Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #c5a059 0%, #ecd599 50%, #c5a059 100%);"></td>
          </tr>

          <!-- Luxury Atelier Header -->
          <tr>
            <td style="background-color: #171b18; padding: 36px 32px 30px; text-align: center;">
              <!-- Atelier Monogram Crest -->
              <table role="presentation" align="center" cellspacing="0" cellpadding="0" style="margin: 0 auto 14px;">
                <tr>
                  <td align="center" style="width: 44px; height: 44px; border-radius: 50%; border: 1px solid #c5a059; background-color: #212622;">
                    <span style="font-family: Georgia, serif; font-size: 15px; font-weight: 700; color: #ecd599; letter-spacing: 1.5px;">PF</span>
                  </td>
                </tr>
              </table>

              <h1 style="margin: 0; font-family: Georgia, 'Playfair Display', serif; font-size: 24px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: #ffffff;">
                PRADEEP FURNITURE
              </h1>
              <p style="margin: 6px 0 0; font-size: 10.5px; letter-spacing: 3px; text-transform: uppercase; color: #c5a059; font-weight: 600;">
                Bespoke Atelier • Fine Living • Est. 1998
              </p>
              <div style="width: 50px; height: 1px; background-color: #c5a059; margin: 16px auto 0; opacity: 0.6;"></div>
            </td>
          </tr>

          <!-- Dynamic Body Content -->
          <tr>
            <td class="content-padding" style="padding: 38px 40px 32px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Atelier Quality Pillars (Trust Badge Section) -->
          <tr>
            <td style="background-color: #fbfaf7; padding: 22px 32px; border-top: 1px solid #ede8de; border-bottom: 1px solid #ede8de;">
              <table role="presentation" class="features-table" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="33%" align="center" style="padding: 6px 8px; text-align: center; vertical-align: top;">
                    <span style="display: block; font-size: 18px; margin-bottom: 4px;">🛡️</span>
                    <strong style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #202521;">10-Year Warranty</strong>
                    <span style="display: block; font-size: 10px; color: #707770; margin-top: 2px;">Seasoned Hardwood Frame</span>
                  </td>
                  <td width="33%" align="center" style="padding: 6px 8px; text-align: center; vertical-align: top;">
                    <span style="display: block; font-size: 18px; margin-bottom: 4px;">📐</span>
                    <strong style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #202521;">Bespoke CAD</strong>
                    <span style="display: block; font-size: 10px; color: #707770; margin-top: 2px;">Custom Space Verification</span>
                  </td>
                  <td width="33%" align="center" style="padding: 6px 8px; text-align: center; vertical-align: top;">
                    <span style="display: block; font-size: 18px; margin-bottom: 4px;">🧵</span>
                    <strong style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #202521;">Master Upholstery</strong>
                    <span style="display: block; font-size: 10px; color: #707770; margin-top: 2px;">45D HR &amp; Velvet Tiers</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Formal Atelier Signature & Footer -->
          <tr>
            <td style="background-color: #171b18; padding: 32px 36px 28px; text-align: center; color: #8e958f;">
              <p style="margin: 0 0 6px; font-family: Georgia, serif; font-size: 13px; font-weight: 500; color: #ffffff; letter-spacing: 1px;">
                PRADEEP FURNITURE ATELIER
              </p>
              <p style="margin: 0 0 14px; font-size: 11px; color: #a4aca5; line-height: 1.5;">
                Nagla Latoori Singh, Deori Road, Agra, Uttar Pradesh – 282001<br>
                Dedicated Concierge: <strong style="color: #ecd599;">+91 8445553853</strong> | Email: <strong style="color: #ecd599;">shubham12977@gmail.com</strong>
              </p>

              <div style="width: 100%; height: 1px; background-color: #272d28; margin: 18px 0;"></div>

              <p style="margin: 0; font-size: 10px; color: #6a716b; line-height: 1.6;">
                This communication is generated by the official digital system of Pradeep Furniture Atelier.<br>
                Commercial transactions &amp; technical drawings are finalized strictly offline in accordance with bespoke atelier policies.<br>
                © ${new Date().getFullYear()} Pradeep Furniture. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function escapeEmailHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character] as string);
}

export async function sendCustomerStatusUpdateEmail({
  to,
  customerName,
  referenceCode,
  recordType,
  status,
  details,
}: SendStatusUpdateOptions): Promise<StatusEmailResult> {
  const recipient = to?.trim();
  if (!recipient) return { sent: false, mode: 'skipped', reason: 'missing_email' };

  const config = getSmtpConfig();
  if (!config.isConfigured) {
    console.warn(`[EMAIL SERVICE] Status notification was not sent for ${referenceCode}: SMTP is not configured.`);
    return { sent: false, mode: 'dev', reason: 'smtp_not_configured' };
  }

  const safeName = escapeEmailHtml(customerName.trim() || 'Valued Client');
  const safeReference = escapeEmailHtml(referenceCode);
  const safeRecordType = escapeEmailHtml(recordType);
  const safeStatus = escapeEmailHtml(status.replaceAll('_', ' '));
  const safeDetails = details ? escapeEmailHtml(details) : '';
  const subject = `${recordType} status update: ${status.replaceAll('_', ' ')} [${referenceCode}]`;
  const bodyHtml = `
    <div style="margin-bottom:24px">
      <span style="display:inline-block;padding:5px 10px;background:#edf3ee;border:1px solid #d7e2d8;border-radius:4px;color:#345340;font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase">Atelier update</span>
      <h2 style="margin:14px 0 8px;font-family:Georgia,serif;font-size:22px;font-weight:500;color:#171b18">Your ${safeRecordType} has a status update</h2>
      <p style="margin:0;color:#4b524c;font-size:14px;line-height:1.65">Dear <strong>${safeName}</strong>, our atelier has updated the status of your record.</p>
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:22px 0;background:#faf9f6;border:1px solid #e7e2d8;border-radius:8px">
      <tr><td style="padding:12px 16px;color:#727b73;font-size:12px">Reference</td><td style="padding:12px 16px;text-align:right;font-family:monospace;font-size:13px;font-weight:700;color:#171b18">${safeReference}</td></tr>
      <tr><td style="padding:12px 16px;border-top:1px solid #e7e2d8;color:#727b73;font-size:12px">Current status</td><td style="padding:12px 16px;border-top:1px solid #e7e2d8;text-align:right;font-size:13px;font-weight:700;color:#345340">${safeStatus}</td></tr>
      ${safeDetails ? `<tr><td colspan="2" style="padding:12px 16px;border-top:1px solid #e7e2d8;color:#5b635c;font-size:12px;line-height:1.6">${safeDetails}</td></tr>` : ''}
    </table>
    <p style="margin:0;color:#5b635c;font-size:13px;line-height:1.65">Our team will contact you if any action or additional information is needed. You can reply to this email or reach the atelier at <strong>+91 8445553853</strong>.</p>
  `;
  const text = `Pradeep Furniture Atelier\n\nDear ${customerName.trim() || 'Valued Client'},\n\nYour ${recordType} status has been updated.\nReference: ${referenceCode}\nCurrent status: ${status.replaceAll('_', ' ')}${details ? `\n${details}` : ''}\n\nOur team will contact you if any action is needed.\nPradeep Furniture Atelier | +91 8445553853`;

  try {
    const transporter = createTransporter();
    if (!transporter) return { sent: false, mode: 'dev', reason: 'smtp_not_configured' };
    await transporter.sendMail({
      from: config.from,
      to: recipient,
      subject,
      text,
      html: wrapEmailTemplate(bodyHtml),
    });
    console.info(`[EMAIL SERVICE] Status update sent for ${referenceCode}.`);
    return { sent: true, mode: 'smtp' };
  } catch (error: any) {
    console.error(`[EMAIL SERVICE] Status update failed for ${referenceCode}:`, error?.message || error);
    return { sent: false, mode: 'smtp', reason: 'send_failed' };
  }
}

/**
 * Send High-End Professional OTP Verification Email
 */
export async function sendOtpEmail({
  to,
  otp,
  customerName,
  purpose = 'bespoke furniture request verification',
}: SendOtpOptions): Promise<{ success: boolean; mode: 'smtp' | 'dev'; error?: string }> {
  const config = getSmtpConfig();
  const recipientName = customerName ? customerName.trim() : 'Valued Client';
  const subject = `Your Verification Passcode: ${otp} | Pradeep Furniture Atelier`;

  const bodyHtml = `
    <!-- Greeting & Purpose -->
    <div style="margin-bottom: 24px;">
      <span style="display: inline-block; padding: 4px 10px; background-color: #f5eedf; border: 1px solid #e4d7bf; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #876d38; margin-bottom: 12px;">
        Identity Verification Protocol
      </span>
      <h2 style="margin: 0 0 8px; font-family: Georgia, serif; font-size: 21px; color: #171b18; font-weight: 500;">
        Confirm Your Bespoke Request
      </h2>
      <p style="margin: 0; font-size: 14px; color: #4b524c; line-height: 1.65;">
        Dear <strong>${recipientName}</strong>,
      </p>
      <p style="margin: 8px 0 0; font-size: 13.5px; color: #5b635c; line-height: 1.65;">
        Thank you for submitting your bespoke commission enquiry with <strong>Pradeep Furniture Atelier</strong>. To protect your details and ensure prompt designer allocation, please authenticate your submission using the one-time passcode below:
      </p>
    </div>

    <!-- Luxury OTP Box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
      <tr>
        <td align="center" style="background-color: #171b18; border-radius: 10px; padding: 30px 24px; border: 1px solid #2a312b; box-shadow: 0 8px 24px rgba(0,0,0,0.12);">
          <span style="display: block; font-size: 10.5px; text-transform: uppercase; letter-spacing: 3px; color: #c5a059; font-weight: 700; margin-bottom: 12px;">
            One-Time Passcode (OTP)
          </span>

          <!-- High-Contrast Formatted Code -->
          <div style="display: inline-block; background-color: #212622; border: 1px solid #3c453e; border-radius: 8px; padding: 12px 28px; margin-bottom: 14px;">
            <span class="otp-digits" style="font-family: 'Courier New', Courier, monospace, sans-serif; font-size: 40px; font-weight: 700; letter-spacing: 14px; color: #fbf5e6; text-shadow: 0 2px 4px rgba(0,0,0,0.4);">
              ${otp}
            </span>
          </div>

          <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
            <tr>
              <td style="font-size: 11.5px; color: #a6b0a7;">
                ⏱ <strong>Valid for 10 minutes</strong> • Single use only
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Instructions & Workflow -->
    <div style="background-color: #fbfaf8; border-left: 3px solid #c5a059; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 12.5px; color: #434a44; line-height: 1.6;">
        <strong>Next Steps:</strong> Enter this 6-digit code into your active session window to finalize your inquiry. Upon verification, our senior furniture draftsperson will review your dimensions and reference photos to prepare formal technical CAD blueprints.
      </p>
    </div>

    <!-- Security Advisory -->
    <p style="margin: 0; font-size: 11.5px; color: #848c85; line-height: 1.6;">
      🔒 <em>Security Advisory: If you did not initiate this bespoke enquiry with Pradeep Furniture Atelier, please disregard this email. Never disclose this code to anyone.</em>
    </p>
  `;

  const htmlContent = wrapEmailTemplate(bodyHtml);
  const textContent = `PRADEEP FURNITURE ATELIER\nBespoke Handcrafted Luxury Seating\n\nVerification Code: ${otp}\n\nDear ${recipientName},\nUse this 6-digit one-time passcode to confirm your ${purpose}: ${otp}\nValid for 10 minutes only.\n\nPradeep Furniture Atelier | Deori Road, Agra | +91 8445553853`;

  // Fallback if SMTP not configured
  if (!config.isConfigured) {
    console.log('\n=============================================================');
    console.log(`[EMAIL SERVICE DEV MODE]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`>>> VERIFICATION OTP CODE: ${otp} <<<`);
    console.log('=============================================================\n');
    return { success: true, mode: 'dev' };
  }

  try {
    const transporter = createTransporter();
    if (!transporter) throw new Error('Could not initialize mail transporter');

    await transporter.sendMail({
      from: config.from,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    console.log(`[EMAIL SERVICE] Successfully sent luxury OTP email to ${to}`);
    return { success: true, mode: 'smtp' };
  } catch (error: any) {
    console.error(`[EMAIL SERVICE ERROR] Failed to send email to ${to}:`, error.message);
    return { success: true, mode: 'dev', error: error.message };
  }
}

/**
 * Send High-End Professional Submission Confirmation Email
 */
export async function sendSubmissionConfirmationEmail({
  to,
  customerName,
  referenceCode,
  requestType,
  summary,
}: SendConfirmationOptions): Promise<boolean> {
  const config = getSmtpConfig();
  const recipientName = customerName ? customerName.trim() : 'Valued Client';
  const subject = `Inquiry Confirmed [${referenceCode}] | Pradeep Furniture Atelier`;

  const bodyHtml = `
    <!-- Top Status Banner -->
    <div style="margin-bottom: 24px;">
      <span style="display: inline-block; padding: 4px 10px; background-color: #edf7ee; border: 1px solid #c7e8c9; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #216d27; margin-bottom: 12px;">
        ✓ Request Authenticated &amp; Logged
      </span>
      <h2 style="margin: 0 0 8px; font-family: Georgia, serif; font-size: 21px; color: #171b18; font-weight: 500;">
        We Have Received Your Commission
      </h2>
      <p style="margin: 0; font-size: 14px; color: #4b524c; line-height: 1.65;">
        Dear <strong>${recipientName}</strong>,
      </p>
      <p style="margin: 8px 0 0; font-size: 13.5px; color: #5b635c; line-height: 1.65;">
        Your submission for <strong>${requestType}</strong> has been successfully recorded in our atelier workshop management system.
      </p>
    </div>

    <!-- Official Reference Voucher Card -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 26px 0; background-color: #faf9f6; border: 1px solid #e7e2d8; border-radius: 10px; overflow: hidden;">
      <tr>
        <td style="background-color: #171b18; padding: 14px 20px; border-bottom: 1px solid #2d332e;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td>
                <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #c5a059; font-weight: 700;">
                  Official Atelier Reference ID
                </span>
              </td>
              <td align="right">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 14px; font-weight: 700; color: #ffffff;">
                  ${referenceCode}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px 22px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 12.5px; color: #3b423c;">
            <tr>
              <td style="padding: 6px 0; color: #727b73; width: 35%;">Category / Type:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #171b18;">${requestType}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #727b73; vertical-align: top;">Specifications:</td>
              <td style="padding: 6px 0; line-height: 1.5; color: #262c27;">${summary}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #727b73;">Current Status:</td>
              <td style="padding: 6px 0;">
                <span style="font-weight: 600; color: #876d38; background-color: #f7f1e4; padding: 2px 8px; border-radius: 4px; font-size: 11px;">
                  Under CAD &amp; Engineering Review
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Next Steps Timeline -->
    <div style="margin: 28px 0 20px;">
      <h3 style="font-family: Georgia, serif; font-size: 15px; color: #171b18; margin: 0 0 14px; font-weight: 600; letter-spacing: 0.5px;">
        What Happens Next in Our Workshop:
      </h3>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 12.5px; color: #434a44;">
        <tr>
          <td style="padding: 6px 0; vertical-align: top; width: 26px;">
            <span style="display: inline-block; width: 20px; height: 20px; border-radius: 50%; background-color: #171b18; color: #ecd599; font-size: 10px; font-weight: 700; text-align: center; line-height: 20px;">1</span>
          </td>
          <td style="padding: 6px 0 12px 8px;">
            <strong>Dimensional Analysis:</strong> Lead draftsmen review room spatial proportions, seating comfort, and frame feasibility.
          </td>
        </tr>
        <tr>
          <td style="padding: 6px 0; vertical-align: top; width: 26px;">
            <span style="display: inline-block; width: 20px; height: 20px; border-radius: 50%; background-color: #171b18; color: #ecd599; font-size: 10px; font-weight: 700; text-align: center; line-height: 20px;">2</span>
          </td>
          <td style="padding: 6px 0 12px 8px;">
            <strong>Designer Contact:</strong> Our senior design consultant will reach out via WhatsApp / Phone to share bespoke CAD drawings and fabric swatches.
          </td>
        </tr>
        <tr>
          <td style="padding: 6px 0; vertical-align: top; width: 26px;">
            <span style="display: inline-block; width: 20px; height: 20px; border-radius: 50%; background-color: #171b18; color: #ecd599; font-size: 10px; font-weight: 700; text-align: center; line-height: 20px;">3</span>
          </td>
          <td style="padding: 6px 0 6px 8px;">
            <strong>Formal Quotation Schedule:</strong> Itemized estimates, lead time schedule, and craftsmanship warranty documentation delivered for offline agreement.
          </td>
        </tr>
      </table>
    </div>

    <!-- Contact Callout -->
    <div style="background-color: #f7f6f2; border: 1px dashed #d5cfc3; border-radius: 8px; padding: 14px 18px; margin-top: 20px; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #485049;">
        Need to update your drawings or space details? Reply to this email or speak directly with our workshop at <strong style="color: #171b18;">+91 8445553853</strong>.
      </p>
    </div>
  `;

  const htmlContent = wrapEmailTemplate(bodyHtml);
  const textContent = `PRADEEP FURNITURE ATELIER\nInquiry Confirmed: ${referenceCode}\n\nDear ${recipientName},\nWe have received your ${requestType}.\nDetails: ${summary}\n\nOur design consultant will contact you with custom drawings.\nPradeep Furniture Atelier, Deori Road, Agra | +91 8445553853`;

  if (!config.isConfigured) {
    console.log(`[EMAIL SERVICE DEV] Confirmation email for ${to} (Ref: ${referenceCode})`);
    return true;
  }

  try {
    const transporter = createTransporter();
    if (!transporter) return false;

    await transporter.sendMail({
      from: config.from,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });
    console.log(`[EMAIL SERVICE] Confirmation email sent to ${to}`);
    return true;
  } catch (err: any) {
    console.error('[EMAIL SERVICE] Confirmation email failed:', err.message);
    return false;
  }
}
