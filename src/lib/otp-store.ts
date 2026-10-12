import crypto from 'crypto';

interface OtpEntry {
  email: string;
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
  purpose?: string;
}

// Global store to survive HMR in Next.js dev server
declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, OtpEntry> | undefined;
}

const otpStore: Map<string, OtpEntry> = globalThis.__otpStore || new Map();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__otpStore = otpStore;
}

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds
const MAX_ATTEMPTS = 5;
const SECRET = process.env.ADMIN_SESSION_SECRET || 'pradeep-atelier-secret-verification-key-2026';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Generate and store a secure 6-digit OTP for an email address
 */
export function generateAndStoreOtp(rawEmail: string, purpose: string = 'verification'): { code: string; expiresInSeconds: number } {
  const email = normalizeEmail(rawEmail);
  const now = Date.now();

  const existing = otpStore.get(email);
  if (existing && now - existing.lastSentAt < RESEND_COOLDOWN_MS) {
    const remainingSeconds = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.lastSentAt)) / 1000);
    throw new Error(`Please wait ${remainingSeconds} seconds before requesting a new verification code.`);
  }

  // Generate cryptographically secure 6-digit OTP
  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = now + OTP_EXPIRY_MS;

  otpStore.set(email, {
    email,
    code,
    expiresAt,
    attempts: 0,
    lastSentAt: now,
    purpose,
  });

  return {
    code,
    expiresInSeconds: Math.floor(OTP_EXPIRY_MS / 1000),
  };
}

/**
 * Verify an entered OTP against the stored record
 */
export function verifyOtp(rawEmail: string, enteredCode: string): { success: boolean; verificationToken?: string; error?: string } {
  const email = normalizeEmail(rawEmail);
  const entry = otpStore.get(email);

  if (!entry) {
    return { success: false, error: 'No verification code found for this email. Please request a new code.' };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email);
    return { success: false, error: 'Verification code has expired. Please request a new code.' };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(email);
    return { success: false, error: 'Too many incorrect attempts. Please request a fresh verification code.' };
  }

  entry.attempts += 1;

  if (entry.code !== enteredCode.trim()) {
    const remaining = MAX_ATTEMPTS - entry.attempts;
    return {
      success: false,
      error: `Incorrect verification code. ${remaining > 0 ? `${remaining} attempts remaining.` : 'Code invalidated.'}`,
    };
  }

  // OTP verified successfully -> cleanup and generate verification token
  otpStore.delete(email);
  const verificationToken = createVerificationToken(email);

  return {
    success: true,
    verificationToken,
  };
}

/**
 * Creates an HMAC signed verification token valid for 1 hour
 */
export function createVerificationToken(rawEmail: string): string {
  const email = normalizeEmail(rawEmail);
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
  const payload = `${email}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64url');
}

/**
 * Validates the HMAC signed verification token
 */
export function validateVerificationToken(rawEmail: string, token: string): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;

    const [tokenEmail, expiresAtStr, tokenHmac] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);

    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return false;
    }

    if (normalizeEmail(rawEmail) !== normalizeEmail(tokenEmail)) {
      return false;
    }

    const expectedPayload = `${tokenEmail}:${expiresAtStr}`;
    const expectedHmac = crypto.createHmac('sha256', SECRET).update(expectedPayload).digest('hex');

    return crypto.timingSafeEqual(Buffer.from(tokenHmac), Buffer.from(expectedHmac));
  } catch {
    return false;
  }
}
