'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, CheckCircle2, Phone, Sparkles, Send } from 'lucide-react';

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
    preferredTime: 'Morning (10 AM - 1 PM)',
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
    <div className="min-h-screen bg-ivory-100 py-12 md:py-20 text-charcoal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cream border border-gold/30 text-xs text-walnut font-semibold uppercase tracking-wider">
            <span>Private Atelier Appointment</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-charcoal">
            Book a Design Consultation
          </h1>
          <p className="text-sm text-charcoal/70 max-w-lg mx-auto leading-relaxed">
            Choose between an in-person meeting at our Civil Lines gallery, a workshop tour at our Bodla compound, a virtual CAD session, or an in-home room measurement visit.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-ivory-300 shadow-luxury">
          {success ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-semibold">Appointment Request Received</h3>
              <p className="text-xs sm:text-sm text-charcoal/70 max-w-md mx-auto">
                Our atelier concierge will call you within 2 hours to confirm your scheduled slot and provide directions or video conference links.
              </p>
              <div className="pt-4">
                <Link
                  href="/"
                  className="px-8 py-3.5 rounded-full bg-charcoal text-white text-xs font-semibold uppercase tracking-wider inline-block"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* Type Selection */}
              <div>
                <label className="block text-walnut font-semibold uppercase tracking-wider mb-2">
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
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        formData.consultationType === type.id
                          ? 'border-gold bg-cream text-charcoal shadow-sm ring-2 ring-gold/20'
                          : 'border-ivory-300 hover:bg-ivory-50 text-charcoal'
                      }`}
                    >
                      <span className="font-serif font-semibold text-sm block">{type.title}</span>
                      <span className="text-[11px] text-charcoal/70 block mt-0.5">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-walnut font-medium mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full p-3 rounded-xl bg-ivory-50 border border-ivory-300 text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Preferred Time Slot *</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full p-3 rounded-xl bg-ivory-50 border border-ivory-300 text-charcoal focus:outline-none focus:border-gold"
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
                  <label className="block text-walnut font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-ivory-50 border border-ivory-300 text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98970 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-ivory-50 border border-ivory-300 text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-3 rounded-xl bg-ivory-50 border border-ivory-300 text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 rounded-xl bg-ivory-50 border border-ivory-300 text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-walnut font-medium mb-1">Project Notes / Room Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Share details about your space, whether you need a curved sectional or accent chairs, or special dimensions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 rounded-xl bg-ivory-50 border border-ivory-300 text-charcoal focus:outline-none focus:border-gold"
                />
              </div>

              <div className="pt-4 border-t border-ivory-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-charcoal hover:bg-charcoal-light text-white text-xs font-semibold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 shadow-luxury"
                >
                  <Calendar className="w-4 h-4 text-gold" />
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
