import { NextRequest, NextResponse } from 'next/server';
import { generateAndStoreOtp } from '@/lib/otp-store';
import { sendOtpEmail } from '@/lib/email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, customerName, purpose = 'furniture request verification' } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Generate and store OTP
    const { code, expiresInSeconds } = generateAndStoreOtp(trimmedEmail, purpose);

    // Send email
    const emailResult = await sendOtpEmail({
      to: trimmedEmail,
      otp: code,
      customerName,
      purpose,
    });

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${trimmedEmail}.`,
      expiresInSeconds,
      mode: emailResult.mode,
    });
  } catch (error: any) {
    console.error('OTP Send API error:', error);
    const status = error.message?.includes('wait') ? 429 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to send verification code. Please try again.' },
      { status }
    );
  }
}
