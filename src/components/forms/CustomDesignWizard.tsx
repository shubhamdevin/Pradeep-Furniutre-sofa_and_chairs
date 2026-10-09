'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Upload, 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  Calendar,
  Send
} from 'lucide-react';

interface WizardProps {
  preselectedProduct?: any;
  allProducts: { id: string; name: string; sku: string; furnitureType: string }[];
}

export default function CustomDesignWizard({ preselectedProduct, allProducts }: WizardProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 8;

  // Form State
  const [formData, setFormData] = useState({
    referenceType: preselectedProduct ? 'EXISTING_PRODUCT' : 'EXTERNAL_UPLOAD',
    productId: preselectedProduct?.id || '',
    productName: preselectedProduct?.name || '',
    referenceImages: [] as string[],
    referenceLinks: '',
    furnitureType: preselectedProduct?.furnitureType || 'SOFA',
    customizationChecklist: [] as string[],
    customizationDetails: '',
    dimensionsKnown: true,
    length: '',
    depth: '',
    height: '',
    seatHeight: '',
    seatingCapacity: '3 Seater',
    measurementUnit: 'Inches',
    fabricPreference: 'Belgian Luxe Velvet',
    colorPreference: '',
    framePreference: 'Kiln-Dried CP Teakwood',
    foamFirmness: 'Medium Balanced (45D HR)',
    legFinish: 'Solid Walnut with Brass Sleeves',
    quantity: 1,
    budgetRange: '₹1,50,000 - ₹2,50,000',
    intendedUsage: 'Living Room Drawing Hall',
    timeline: '3-4 Weeks',
    deliveryCity: 'Agra',
    deliveryPincode: '',
    roomPhotos: [] as string[],
    customerName: '',
    customerPhone: '',
    customerWhatsapp: '',
    customerEmail: '',
    preferredContact: 'WhatsApp',
    agreeConsent: true,
  });

  const [imageInput, setImageInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{ referenceNumber: string; leadCode: string } | null>(null);

  // Helper to handle image uploads / sample image additions
  const handleAddImage = (url: string) => {
    if (!url.trim()) return;
    setFormData((prev) => ({
      ...prev,
      referenceImages: [...prev.referenceImages, url.trim()],
    }));
    setImageInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert file to local object URL or sample placeholder
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({
            ...prev,
            referenceImages: [...prev.referenceImages, reader.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      referenceImages: prev.referenceImages.filter((_, i) => i !== index),
    }));
  };

  const toggleChecklist = (item: string) => {
    setFormData((prev) => {
      const exists = prev.customizationChecklist.includes(item);
      return {
        ...prev,
        customizationChecklist: exists
          ? prev.customizationChecklist.filter((c) => c !== item)
          : [...prev.customizationChecklist, item],
      };
    });
  };

  // Submit Handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/custom-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitSuccess({
          referenceNumber: data.referenceNumber,
          leadCode: data.leadCode,
        });
      } else {
        alert(data.error || 'Failed to submit custom request. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-fill if product changed
  const handleProductSelect = (id: string) => {
    const prod = allProducts.find((p) => p.id === id);
    setFormData((prev) => ({
      ...prev,
      productId: id,
      productName: prod?.name || '',
      furnitureType: prod?.furnitureType || prev.furnitureType,
    }));
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-ivory-300 shadow-luxury text-charcoal">
      {/* Success View */}
      {submitSuccess ? (
        <div className="py-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Commission Received</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-medium">
              Your Custom Design Request is Recorded
            </h2>
            <p className="text-sm text-charcoal/70 max-w-lg mx-auto leading-relaxed">
              Our master draftsmen and CAD designers are reviewing your reference photos and room dimensions. We will prepare an initial proposal drawing and connect via your preferred contact channel.
            </p>
          </div>

          <div className="bg-ivory-50 max-w-md mx-auto p-5 rounded-2xl border border-ivory-300 space-y-2 text-left text-xs">
            <div className="flex justify-between border-b border-ivory-200 pb-2">
              <span className="text-walnut font-medium">Reference Code:</span>
              <span className="font-mono font-bold text-charcoal text-sm">{submitSuccess.referenceNumber}</span>
            </div>
            <div className="flex justify-between border-b border-ivory-200 pb-2">
              <span className="text-walnut font-medium">CRM Tracking ID:</span>
              <span className="font-mono text-charcoal">{submitSuccess.leadCode}</span>
            </div>
            <div className="flex justify-between border-b border-ivory-200 pb-2">
              <span className="text-walnut font-medium">Customer:</span>
              <span className="font-semibold">{formData.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-walnut font-medium">Commercial Settlement:</span>
              <span className="font-semibold text-emerald-800">Strictly Offline / Bank Transfer</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="px-8 py-3.5 rounded-full bg-charcoal text-white hover:bg-charcoal-light text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Return to Atelier Home
            </Link>
            <Link
              href="/products"
              className="px-8 py-3.5 rounded-full bg-ivory-100 hover:bg-ivory-200 text-charcoal text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Browse More Designs
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-charcoal/70 mb-2">
              <span className="font-semibold text-charcoal">
                Step {step} of {totalSteps}: {
                  [
                    'Furniture Reference',
                    'Furniture Type',
                    'Customization Requirements',
                    'Dimensions & Capacity',
                    'Materials & Finishes',
                    'Project Details',
                    'Customer Information',
                    'Review & Submit',
                  ][step - 1]
                }
              </span>
              <span className="font-mono text-gold font-bold">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-ivory-200 overflow-hidden">
              <div
                className="h-full bg-gold transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1: FURNITURE REFERENCE */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="font-serif text-2xl font-medium text-charcoal">1. Furniture Reference</h3>
                <p className="text-xs text-charcoal/70 mt-1">
                  Are you customizing one of our existing catalogue designs or uploading an external photo from Google / Pinterest?
                </p>
              </div>

              {/* Reference Type Toggle */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, referenceType: 'EXTERNAL_UPLOAD' })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    formData.referenceType === 'EXTERNAL_UPLOAD'
                      ? 'border-gold bg-cream/30 ring-2 ring-gold/20'
                      : 'border-ivory-300 hover:border-ivory-400'
                  }`}
                >
                  <Upload className="w-5 h-5 text-gold mb-2" />
                  <span className="font-serif font-semibold text-sm block">Upload External Photo</span>
                  <span className="text-xs text-charcoal/60 mt-0.5 block">From Pinterest, Instagram, showroom, or sketch</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, referenceType: 'EXISTING_PRODUCT' })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    formData.referenceType === 'EXISTING_PRODUCT'
                      ? 'border-gold bg-cream/30 ring-2 ring-gold/20'
                      : 'border-ivory-300 hover:border-ivory-400'
                  }`}
                >
                  <Sliders className="w-5 h-5 text-gold mb-2" />
                  <span className="font-serif font-semibold text-sm block">Modify Existing Model</span>
                  <span className="text-xs text-charcoal/60 mt-0.5 block">Select a sofa or chair from our website</span>
                </button>
              </div>

              {/* If existing product, select it */}
              {formData.referenceType === 'EXISTING_PRODUCT' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-walnut">Select Base Website Model:</label>
                  <select
                    value={formData.productId}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    className="w-full p-3 rounded-xl bg-ivory-50 border border-ivory-300 text-xs focus:outline-none focus:border-gold"
                  >
                    <option value="">-- Choose Catalogue Item --</option>
                    {allProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Image Upload Area */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-walnut">
                  Upload Reference Photographs or Architectural Sketches:
                </label>

                <div className="border-2 border-dashed border-ivory-300 hover:border-gold rounded-2xl p-6 text-center bg-ivory-50/50 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="wizard-file-upload"
                  />
                  <label htmlFor="wizard-file-upload" className="cursor-pointer block space-y-2">
                    <ImageIcon className="w-8 h-8 text-walnut mx-auto" />
                    <span className="text-xs font-semibold text-charcoal block">
                      Click to browse image files (PNG, JPG, WEBP)
                    </span>
                    <span className="text-[11px] text-charcoal/60 block">
                      You can upload multiple angles or room views
                    </span>
                  </label>
                </div>

                {/* Or paste image URL */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Or paste an image web link (e.g. Pinterest / Imgur URL)..."
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    className="flex-grow px-3 py-2 rounded-xl bg-ivory-50 border border-ivory-300 text-xs focus:outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImage(imageInput)}
                    className="px-4 py-2 bg-charcoal text-white rounded-xl text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>

                {/* Previews */}
                {formData.referenceImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                    {formData.referenceImages.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-ivory-300 group">
                        <img src={img} alt="Upload Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 p-1 bg-charcoal/80 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: FURNITURE TYPE */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="font-serif text-2xl font-medium text-charcoal">2. Furniture Silhouette Type</h3>
                <p className="text-xs text-charcoal/70 mt-1">
                  Which category best describes the furniture piece you wish to commission?
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  '2-Seater Sofa',
                  '3-Seater Sofa',
                  'L-Shaped Sofa',
                  'U-Shaped Sectional',
                  'Chesterfield Tufted',
                  'Curved Sculptural Sofa',
                  'Accent Statement Chair',
                  'Mid-Century Lounge Chair',
                  'Regal Wingback Chair',
                  'Fluted Tub Swivel Chair',
                  'Hand-Carved Royal Armchair',
                  'Custom Hybrid Design',
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, furnitureType: type })}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      formData.furnitureType === type
                        ? 'border-gold bg-cream text-charcoal font-bold shadow-sm'
                        : 'border-ivory-300 bg-white hover:bg-ivory-50 text-charcoal'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: CUSTOMIZATION REQUIREMENTS */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="font-serif text-2xl font-medium text-charcoal">3. Customization Requirements</h3>
                <p className="text-xs text-charcoal/70 mt-1">
                  Select all modifications you require compared to the reference photo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Keep the same general silhouette',
                  'Change upholstery fabric type',
                  'Change upholstery colour',
                  'Alter seating dimensions (length/depth)',
                  'Increase/decrease seating capacity',
                  'Change frame / leg finish to solid brass',
                  'Modify backrest height or fluting',
                  'Change armrest design (curved / slim / shelter)',
                  'Adjust cushion softness / down feather topper',
                  'Add modular sectional chaise orientation',
                  'Special acoustic / high-back modification',
                ].map((req) => (
                  <label
                    key={req}
                    className="flex items-center space-x-3 p-3 rounded-xl border border-ivory-300 hover:border-gold cursor-pointer bg-ivory-50/40 text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={formData.customizationChecklist.includes(req)}
                      onChange={() => toggleChecklist(req)}
                      className="rounded text-gold focus:ring-0"
                    />
                    <span className="font-medium">{req}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-walnut mb-1">
                  Detailed Instructions / Special Modifications:
                </label>
                <textarea
                  rows={3}
                  value={formData.customizationDetails}
                  onChange={(e) => setFormData({ ...formData, customizationDetails: e.target.value })}
                  className="w-full p-3 rounded-xl bg-ivory-50 border border-ivory-300 text-xs focus:outline-none focus:border-gold"
                  placeholder="Describe your vision (e.g. 'We need the armrest to be 2 inches narrower, and the seating depth to be 28 inches for lounging...')"
                />
              </div>
            </div>
          )}

          {/* STEP 4: DIMENSIONS & CAPACITY */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="font-serif text-2xl font-medium text-charcoal">4. Dimensions &amp; Seating Capacity</h3>
                <p className="text-xs text-charcoal/70 mt-1">
                  Provide exact measurements if known, or request our complimentary site measurement visit.
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-ivory-50 p-3 rounded-xl border border-ivory-300">
                <input
                  type="checkbox"
                  id="dimensions-unknown"
                  checked={!formData.dimensionsKnown}
                  onChange={(e) => setFormData({ ...formData, dimensionsKnown: !e.target.checked })}
                  className="rounded text-gold focus:ring-0"
                />
                <label htmlFor="dimensions-unknown" className="text-xs font-semibold text-charcoal cursor-pointer">
                  I don&apos;t know the exact measurements. (Require designer consultation or site visit)
                </label>
              </div>

              {formData.dimensionsKnown && (
                <div className="space-y-4">
                  <div className="flex justify-end space-x-2 text-xs">
                    <span className="text-walnut font-medium">Unit:</span>
                    {['Inches', 'Centimeters', 'Feet'].map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => setFormData({ ...formData, measurementUnit: unit })}
                        className={`px-2.5 py-1 rounded-lg font-semibold ${
                          formData.measurementUnit === unit ? 'bg-charcoal text-white' : 'bg-ivory-100 text-charcoal'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-walnut font-medium mb-1">Length / Width</label>
                      <input
                        type="text"
                        placeholder="e.g. 96"
                        value={formData.length}
                        onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-walnut font-medium mb-1">Depth</label>
                      <input
                        type="text"
                        placeholder="e.g. 38"
                        value={formData.depth}
                        onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-walnut font-medium mb-1">Height</label>
                      <input
                        type="text"
                        placeholder="e.g. 32"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-walnut font-medium mb-1">Seating Capacity</label>
                    <select
                      value={formData.seatingCapacity}
                      onChange={(e) => setFormData({ ...formData, seatingCapacity: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-xs focus:outline-none focus:border-gold"
                    >
                      <option value="1 Seater (Chair)">1 Seater (Single Chair)</option>
                      <option value="2 Seater">2 Seater</option>
                      <option value="3 Seater">3 Seater</option>
                      <option value="4 Seater">4 Seater</option>
                      <option value="5-6 Seater L-Shape">5-6 Seater L-Shape</option>
                      <option value="7+ Seater Grand Sectional">7+ Seater Grand Sectional</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: MATERIALS & FINISHES */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="font-serif text-2xl font-medium text-charcoal">5. Materials &amp; Finishes</h3>
                <p className="text-xs text-charcoal/70 mt-1">
                  Specify your preferred upholstery tier and wood framing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-walnut font-medium mb-1">Upholstery Fabric Tier:</label>
                  <select
                    value={formData.fabricPreference}
                    onChange={(e) => setFormData({ ...formData, fabricPreference: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  >
                    <option value="Belgian Luxe Velvet">Belgian Luxe Velvet (65k Rub)</option>
                    <option value="Textured Bouclé">Alabaster Italian Bouclé</option>
                    <option value="Full-Grain Nappa Leather">Top-Grain Italian Nappa Leather</option>
                    <option value="Heavy Natural Linen">Pure Natural Woven Linen</option>
                    <option value="Customer Own Material (COM)">Customer Will Provide Fabric (COM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Color Shade Preference:</label>
                  <input
                    type="text"
                    placeholder="e.g. Emerald Green, Ivory Bouclé, Cognac Tan"
                    value={formData.colorPreference}
                    onChange={(e) => setFormData({ ...formData, colorPreference: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Solid Frame Wood:</label>
                  <select
                    value={formData.framePreference}
                    onChange={(e) => setFormData({ ...formData, framePreference: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  >
                    <option value="Solid Kiln-Dried CP Teakwood">Solid Kiln-Dried CP Teakwood (Grade-A)</option>
                    <option value="Seasoned Salwood Core">Seasoned Salwood Structural Framework</option>
                    <option value="Ebonized Oak">Ebonized Oak Exposed Trims</option>
                  </select>
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Cushion Core Firmness:</label>
                  <select
                    value={formData.foamFirmness}
                    onChange={(e) => setFormData({ ...formData, foamFirmness: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  >
                    <option value="Medium Balanced (45D HR)">Medium Balanced (45D HR with Down Crown)</option>
                    <option value="Plush Cloud Soft">Plush Cloud Soft (Dual Microfiber)</option>
                    <option value="Firm Ortho-Support (50D)">Firm Ortho-Support (50D Core)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PROJECT DETAILS */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="font-serif text-2xl font-medium text-charcoal">6. Project &amp; Delivery Information</h3>
                <p className="text-xs text-charcoal/70 mt-1">
                  Help us understand your timeline and logistics requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-walnut font-medium mb-1">Quantity of Units:</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Expected Budget Range:</label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  >
                    <option value="₹75,000 - ₹1,25,000">₹75,000 - ₹1,25,000</option>
                    <option value="₹1,25,000 - ₹2,00,000">₹1,25,000 - ₹2,00,000</option>
                    <option value="₹2,00,000 - ₹3,50,000">₹2,00,000 - ₹3,50,000</option>
                    <option value="₹3,50,000+ (Ultra Luxury)">₹3,50,000+ (Ultra Luxury / Estate)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Delivery City:</label>
                  <input
                    type="text"
                    value={formData.deliveryCity}
                    onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Pincode:</label>
                  <input
                    type="text"
                    placeholder="e.g. 282001"
                    value={formData.deliveryPincode}
                    onChange={(e) => setFormData({ ...formData, deliveryPincode: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Required Timeline:</label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  >
                    <option value="3-4 Weeks">3-4 Weeks (Standard Atelier Craft)</option>
                    <option value="2-3 Weeks (Expedited)">2-3 Weeks (Expedited Priority)</option>
                    <option value="6-8 Weeks (Project Stage)">6-8 Weeks (Site Under Construction)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Intended Space Usage:</label>
                  <input
                    type="text"
                    placeholder="e.g. Penthouse Living Room, Hotel Suite, Office"
                    value={formData.intendedUsage}
                    onChange={(e) => setFormData({ ...formData, intendedUsage: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: CUSTOMER DETAILS */}
          {step === 7 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="font-serif text-2xl font-medium text-charcoal">7. Contact &amp; Client Information</h3>
                <p className="text-xs text-charcoal/70 mt-1">
                  Our designer will reach out with the custom CAD drawings and quotation schedule.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-walnut font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Siddharth Mehra"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full p-3 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Phone Number (Calling) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98970 00000"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98970 00000 (if different)"
                    value={formData.customerWhatsapp}
                    onChange={(e) => setFormData({ ...formData, customerWhatsapp: e.target.value })}
                    className="w-full p-3 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full p-3 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Preferred Channel:</label>
                  <select
                    value={formData.preferredContact}
                    onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                    className="w-full p-3 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  >
                    <option value="WhatsApp">WhatsApp Message with Drawings</option>
                    <option value="Phone Call">Phone Call from Lead Designer</option>
                    <option value="Atelier Showroom Visit">In-Person Meeting at Showroom</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 text-xs text-charcoal/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeConsent}
                    onChange={(e) => setFormData({ ...formData, agreeConsent: e.target.checked })}
                    className="rounded text-gold focus:ring-0"
                  />
                  <span>I agree to receive custom furniture drawings and quotation estimates via phone/WhatsApp.</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 8: REVIEW & SUBMIT */}
          {step === 8 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="font-serif text-2xl font-medium text-charcoal">8. Review Specifications</h3>
                <p className="text-xs text-charcoal/70 mt-1">
                  Please verify all details before submitting your bespoke manufacturing request.
                </p>
              </div>

              <div className="bg-ivory-50 rounded-2xl p-6 border border-ivory-300 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-ivory-200">
                  <div>
                    <span className="text-walnut font-medium block">Furniture Type:</span>
                    <span className="font-semibold text-charcoal">{formData.furnitureType}</span>
                  </div>
                  <div>
                    <span className="text-walnut font-medium block">Reference Source:</span>
                    <span className="font-semibold text-charcoal">
                      {formData.referenceType === 'EXISTING_PRODUCT' ? `Website Model (${formData.productName})` : 'External Photo Upload'}
                    </span>
                  </div>
                  <div>
                    <span className="text-walnut font-medium block">Dimensions:</span>
                    <span className="font-semibold text-charcoal">
                      {formData.dimensionsKnown ? `${formData.length}L x ${formData.depth}D x ${formData.height}H ${formData.measurementUnit}` : 'Site Measurement Needed'}
                    </span>
                  </div>
                  <div>
                    <span className="text-walnut font-medium block">Fabric &amp; Color:</span>
                    <span className="font-semibold text-charcoal">
                      {formData.fabricPreference} ({formData.colorPreference || 'Custom Selection'})
                    </span>
                  </div>
                  <div>
                    <span className="text-walnut font-medium block">Quantity &amp; Timeline:</span>
                    <span className="font-semibold text-charcoal">{formData.quantity} Unit(s) • {formData.timeline}</span>
                  </div>
                  <div>
                    <span className="text-walnut font-medium block">Delivery City:</span>
                    <span className="font-semibold text-charcoal">{formData.deliveryCity}</span>
                  </div>
                </div>

                <div>
                  <span className="text-walnut font-medium block mb-1">Customer:</span>
                  <span className="font-semibold text-charcoal">{formData.customerName} • {formData.customerPhone} ({formData.preferredContact})</span>
                </div>

                {formData.customizationChecklist.length > 0 && (
                  <div>
                    <span className="text-walnut font-medium block mb-1">Customization Requests:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-charcoal/80">
                      {formData.customizationChecklist.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {formData.referenceImages.length > 0 && (
                  <div>
                    <span className="text-walnut font-medium block mb-1">Attached Images ({formData.referenceImages.length}):</span>
                    <div className="flex gap-2">
                      {formData.referenceImages.slice(0, 4).map((img, i) => (
                        <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border border-ivory-300">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Absolute Notice */}
              <div className="p-4 rounded-xl bg-cream/70 border border-gold/30 text-xs text-charcoal/80 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong>Atelier Policy:</strong> This submission initiates an offline design review and personalized quotation. No online payment is requested or collected on this platform.
                </span>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-10 pt-6 border-t border-ivory-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-ivory-100 hover:bg-ivory-200 text-charcoal text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            ) : <div />}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 7 && (!formData.customerName || !formData.customerPhone)) {
                    alert('Please enter your name and phone number before proceeding to review.');
                    return;
                  }
                  setStep(step + 1);
                }}
                className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-charcoal text-white hover:bg-charcoal-light text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="inline-flex items-center space-x-2 px-10 py-4 rounded-full bg-charcoal hover:bg-charcoal-light text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-luxury border border-gold/50"
              >
                <Send className="w-4 h-4 text-gold" />
                <span>{isSubmitting ? 'Recording Commission...' : 'Submit Custom Request'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
