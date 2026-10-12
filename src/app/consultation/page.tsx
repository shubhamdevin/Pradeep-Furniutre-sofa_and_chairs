'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import OtpVerificationModal from '@/components/ui/OtpVerificationModal';

export default function ConsultationPage() {
  const { error: toastError, success: toastSuccess } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    city: 'Agra',
    address: '',
    consultationType: 'SHOWROOM_VISIT',
    preferredDate: '',
    preferredTime: 'Morning (10:00 AM - 1:00 PM)',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.preferredDate) {
      toastError('Details Required', 'Please fill in your name, phone, and preferred date.');
      return;
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toastError('Valid Email Required', 'Please provide a valid email address for OTP verification.');
      return;
    }

    setShowOtpModal(true);
  };

  const handleOtpVerified = async (verificationToken: string, verifiedEmail: string) => {
    setShowOtpModal(false);
    setLoading(true);

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          email: verifiedEmail,
          verificationToken,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        toastSuccess('Appointment Verified & Requested', 'Our atelier concierge will confirm your schedule shortly.');
      } else {
        toastError('Consultation Booking', data.error || 'Failed to schedule appointment.');
      }
    } catch (err) {
      console.error(err);
      toastError('Network Error', 'Please contact our atelier directly at +91 8445553853.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-platinum py-16 md:py-24 text-graphite font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">
            Private Atelier Appointment
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-graphite">
            Book a Design Consultation
          </h1>
          <p className="text-sm text-slate-dark max-w-lg mx-auto leading-relaxed">
            Choose between an in-person meeting at our Deori Road atelier, a tour of our Nagla Latoori Singh workshop, a virtual CAD session, or an on-site spatial measurement visit.
          </p>
        </div>

        <div className="bg-white rounded-lg p-8 sm:p-12 border border-platinum-border shadow-sm">
          {success ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-7 h-7 text-emerald-700" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-medium text-graphite">Appointment Request Registered</h3>
                <p className="text-xs sm:text-sm text-slate-dark max-w-md mx-auto leading-relaxed">
                  Our atelier concierge will connect with you within 2 business hours to confirm your scheduled slot and provide directions or video conference links.
                </p>
              </div>

              {/* Terms & Conditions Block */}
              <div className="text-left bg-[#faf9f5] border border-[#e4dfd5] rounded-lg p-4 space-y-2 max-w-md mx-auto text-xs">
                <div className="flex items-center gap-1.5 pb-1 border-b border-[#e4dfd5]">
                  <span className="font-serif font-bold text-xs text-[#222823] tracking-wide uppercase">
                    Appointment Terms &amp; Conditions
                  </span>
                </div>
                <ul className="text-[11px] text-[#555d56] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li><strong>Complimentary Consultation:</strong> Private design consultations and workshop walkthroughs are 100% complimentary.</li>
                  <li><strong>Timings &amp; Rescheduling:</strong> Monday to Saturday: 10:00 AM – 8:00 PM. Reschedule at least 4 hours in advance via call or WhatsApp.</li>
                  <li><strong>Location:</strong> Nagla Latoori Singh, Deori Road, Agra, UP.</li>
                </ul>
                <p className="text-[10px] text-[#788079] pt-1 border-t border-[#e4dfd5]">
                  Contact: <strong>+91 8445553853</strong> | <strong>pradeepfurniture2@gmail.com</strong>
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/"
                  className="px-6 py-3 rounded-md bg-graphite hover:bg-graphite-hover text-white text-xs font-medium uppercase tracking-wider inline-block transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* Type Selection */}
              <div>
                <label className="block text-slate-dark font-semibold uppercase tracking-wider mb-2">
                  1. Consultation Format:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'SHOWROOM_VISIT', title: 'Studio Gallery Visit', desc: 'Nagla Latoori Singh, Deori Road, Agra (Touch fabric swatches)' },
                    { id: 'FACTORY_ATELIER_VISIT', title: 'Factory Workshop Tour', desc: 'Deori Road Workshop (Inspect raw teak frames)' },
                    { id: 'VIRTUAL_DESIGN_MEETING', title: 'Virtual CAD Consultation', desc: 'Google Meet / Zoom with our lead designer' },
                    { id: 'HOME_MEASUREMENT', title: 'On-Site Measurement Visit', desc: 'Complimentary laser measurement in Agra / Delhi NCR' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, consultationType: type.id })}
                      className={`p-4 rounded-md border text-left transition-all ${
                        formData.consultationType === type.id
                          ? 'border-graphite bg-platinum-soft text-graphite shadow-sm ring-1 ring-graphite'
                          : 'border-platinum-border hover:bg-platinum text-graphite'
                      }`}
                    >
                      <span className="font-serif font-medium text-sm block">{type.title}</span>
                      <span className="text-[11px] text-slate-dark block mt-0.5">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-dark font-medium mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full p-3 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                  />
                </div>

                <div>
                  <label className="block text-slate-dark font-medium mb-1">Preferred Time Slot *</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full p-3 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                  >
                    <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                    <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                    <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-dark font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                  />
                </div>

                <div>
                  <label className="block text-slate-dark font-medium mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 8445553853"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                  />
                </div>

                <div>
                  <label className="block text-slate-dark font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-3 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                  />
                </div>

                <div>
                  <label className="block text-slate-dark font-medium mb-1">
                    Email Address * <span className="text-[10px] text-slate-muted font-normal">(for OTP verification)</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-dark font-medium mb-1">Project Notes / Spatial Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Share details about your space, whether you need a curved sectional or statement chairs, or specific dimensions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                />
              </div>

              <div className="pt-4 border-t border-platinum-border space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    defaultChecked
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-graphite focus:ring-graphite"
                  />
                  <span className="text-xs text-slate-dark leading-tight">
                    I agree to the{' '}
                    <Link
                      href="/terms"
                      target="_blank"
                      className="text-graphite font-bold underline hover:text-black"
                    >
                      Terms of Atelier Consultation
                    </Link>{' '}
                    (Complimentary visit, offline commercial protocols, and mutual appointment confirmation).
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-md bg-graphite hover:bg-graphite-hover text-white text-xs font-medium uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Calendar className="w-4 h-4 text-slate-silver" />
                  <span>{loading ? 'Confirming with Concierge...' : 'Confirm Consultation Booking'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={showOtpModal}
        email={formData.email}
        customerName={formData.name}
        purpose={`private atelier ${formData.consultationType.toLowerCase().replace(/_/g, ' ')} booking`}
        onClose={() => setShowOtpModal(false)}
        onVerified={handleOtpVerified}
        onEmailChange={(newEmail) => setFormData((prev) => ({ ...prev, email: newEmail }))}
      />
    </div>
  );
}
