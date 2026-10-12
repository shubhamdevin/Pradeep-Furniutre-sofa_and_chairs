import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otp-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const result = verifyOtp(email, String(otp));

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Invalid verification code.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verificationToken: result.verificationToken,
      message: 'Email verified successfully.',
    });
  } catch (error: any) {
    console.error('OTP Verify API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error verifying code.' },
      { status: 500 }
    );
  }
}
