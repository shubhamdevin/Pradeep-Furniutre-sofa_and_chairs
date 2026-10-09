'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2 } from 'lucide-react';

export default function ConsultationPage() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        alert(data.error || 'Failed to schedule appointment.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please call our atelier directly.');
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
            Choose between an in-person meeting at our Civil Lines gallery, a workshop tour at our Bodla compound, a virtual CAD session, or an on-site spatial measurement visit.
          </p>
        </div>

        <div className="bg-white rounded-lg p-8 sm:p-12 border border-platinum-border shadow-sm">
          {success ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-7 h-7 text-emerald-700" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-graphite">Appointment Request Registered</h3>
              <p className="text-xs sm:text-sm text-slate-dark max-w-md mx-auto leading-relaxed">
                Our atelier concierge will connect with you within 2 business hours to confirm your scheduled slot and provide directions or video conference links.
              </p>
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
                    { id: 'SHOWROOM_VISIT', title: 'Showroom Gallery Visit', desc: '18 Civil Lines, Agra (Touch fabric swatches)' },
                    { id: 'FACTORY_ATELIER_VISIT', title: 'Factory Workshop Tour', desc: 'Bodla Industrial Compound (Inspect raw teak frames)' },
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
                    placeholder="+91 98970 00000"
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
                  <label className="block text-slate-dark font-medium mb-1">Email Address</label>
                  <input
                    type="email"
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

              <div className="pt-4 border-t border-platinum-border">
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
    </div>
  );
}
