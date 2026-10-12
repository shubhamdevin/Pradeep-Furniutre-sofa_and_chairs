# Pradeep Furniture Atelier
## Premium Luxury Sofa & Fancy Chairs Manufacturing Website + Factory Management ERP
### Bespoke Digital Showroom • Custom Furniture Studio • CRM • Production ERP

Designed and developed as a complete, production-oriented digital platform for **Pradeep Furniture Atelier** (Agra, Uttar Pradesh, India) — manufacturers of bespoke luxury sofas, fancy chairs, curved sectionals, and custom upholstered seating.

---

## 1. Absolute Business Architecture: STRICTLY NON-E-COMMERCE

In accordance with Section 1 of the Master Brief:

**THIS APPLICATION IS NOT AN E-COMMERCE STORE.**

- **Strictly Prohibited & Excluded:**
  - ❌ No Shopping Cart
  - ❌ No Add to Cart buttons
  - ❌ No Buy Now buttons
  - ❌ No Online Checkout or Payment Gateway
  - ❌ No Consumer eCommerce ordering or COD workflows

- **Allowed & Fully Implemented Customer Features:**
  -  Filter, search, compare, and shortlist furniture designs.
  -  Interactive **Smart Customization Studio** with live dimension calculators and compatibility rules.
  -  **8-Step Custom Furniture Request System**: upload external reference images (Pinterest, Google, Instagram, sketches) to commission custom pieces.
  -  Request official offline quotations.
  -  Book private showroom visits (Civil Lines) and factory workshop tours (Bodla, Agra).
  -  Direct WhatsApp atelier concierge integration.
  -  **Offline Commercial Finalization**: Commercial contracts, timber inspections, and bank payments are finalized offline through the atelier.
  -  **Factory Operations Management**: Internal production job cards with 15 workshop stages, Bill of Materials (BOM), and Quality Control (QC).

---

## 2. Luxury Design System

- **Palette**:
  - Warm Ivory: `#FAF8F5` / `#F7F4EF`
  - Cream: `#EDE5D9`
  - Deep Charcoal: `#242424` / `#121212`
  - Walnut Brown: `#624737`
  - Muted Gold: `#B99A68`
  - Pure White: `#FFFFFF`
- **Typography**:
  - Headings: Serif (`Playfair Display`, `Cormorant Garamond`)
  - Body: Modern Sans-Serif (`Inter`, `system-ui`)
- **Visual Design**:
  - Subtle showroom lighting, soft drop shadows, architectural grid lines, floating consultation controls, accessible contrast ratios.

---

## 4. Key Systems & Modules

### 4.1 Public Showroom & Catalogue
- **Cinematic Hero**: "Furniture Beyond Ordinary" with luxury furniture photography and atelier statistics.
- **15 Furniture Categories**: 2-Seater, 3-Seater, L-Shaped, U-Shaped, Sectional, Chesterfield, Curved, Luxury Sofas, Fancy Chairs, Accent, Lounge, Wingback, Tub, Royal, and Custom Furniture.
- **Product Details (`/products/[slug]`)**:
  - Image gallery with angles (Hero, Front, Side, Back, Texture)
  - Complete specifications (Timber species, moisture control, foam density, suspension, leg finishes)
  - Recommended fabric swatches
  - Printable / Downloadable Architectural Specification Sheet
  - "Request Custom Quotation" modal & direct WhatsApp action

### 4.2 8-Step Custom Design Request Wizard (`/custom-design`)
- Step 1: Furniture Reference (External image upload with previews, sketches, web links, or base catalogue model)
- Step 2: Furniture Silhouette Type (12 types)
- Step 3: Customization Checklist (dimensions, fabric, cushion firmness, armrest/backrest modification) + detailed brief
- Step 4: Dimensions (Length, Depth, Height, Capacity, Units, or "I don't know exact measurements")
- Step 5: Materials & Finishes (Belgian Velvet, Bouclé, Italian Leather, Natural Linen, Teakwood, etc.)
- Step 6: Project Information (Quantity, budget range, intended space usage, timeline, delivery city/pincode)
- Step 7: Customer Details (Name, phone, WhatsApp, email, contact preference)
- Step 8: Review & Submit (Generates unique Reference ID `CFR-2026-XXXX`, creates Lead record, and triggers internal notifications)

### 4.3 Smart Customization Studio (`/studio`)
- Dynamic layout & seating selector with real-time dimension recalculation
- Swatch picker with physical color hex previews
- Cushion firmness, armrest style, backrest style, and leg finish selection
- Manufacturer compatibility engine (e.g. alerts when deep diamond tufting requires shelter arms)
- Config A vs. Config B side-by-side comparison
- Instant RFQ generation

### 4.4 Lead CRM Pipeline (`/admin/leads`)
- Pipeline: `NEW` → `CONTACTED` → `REQUIREMENTS_COLLECTED` → `DESIGN_REVIEW` → `QUOTATION_SENT` → `NEGOTIATION` → `CONVERTED` / `LOST` / `ON_HOLD`
- Activity logging, priority tagging, customer details, and direct quotation links.

### 4.5 Custom Request Review & CAD Approvals (`/admin/custom-requests`)
- Review uploaded customer photos and dimensions
- Designer drafts revisions (`REV-01`, `REV-02`) with CAD concept URLs
- **Design Freeze**: Freeze final approved design version for factory job release.

### 4.6 Quotation Management (`/admin/quotations`)
- Generates Quote # (`QTE-2026-XXXX`), revision code, line items breakdown, GST (18%), delivery lead times, and terms.
- **Printable Customer PDF**: Generates formal customer quotation hiding internal factory costs.
- **Internal Margins**: Internal estimated BOM cost and gross operating margin visible only to authorized staff.
- One-click release to Factory Manufacturing Job.

### 4.7 Factory Operations & Job Cards (`/admin/manufacturing`)
- Job Card # (`JOB-2026-XXXX`), exact dimensions, timber joinery instructions, foam densities, fabric codes.
- **15 Standard Production Stages**:
  1. Job Released & Order Blueprint Freeze
  2. Material Planning & Allocation
  3. Wood Cutting & Milling
  4. Frame Assembly & Mortise Joinery
  5. Spring & Webbing Sub-Structure
  6. Foam Cutting & Density Stacking
  7. Cushioning & Feather Envelope Wrap
  8. Fabric Laser Cutting & Pattern Alignment
  9. Stitching & French Seam Tailoring
  10. Hand Upholstery & Channel Pleating
  11. Final Finishing & Brass Base Mounting
  12. Quality Inspection & Load Testing
  13. Protective Packaging & Corner Guards
  14. Dispatch Ready & Logistics Scheduling
  15. Closed Internally (Post Installation)
- **Bill of Materials (BOM)**: Tracks timber planks, fabric meters, foam sheets, springs, and costs.
- **Quality Control (QC)**: 6-point checklist (Dimensions, Frame Mortise, Spring Tension, Stitching, Foam Comfort, Design Match: PASS / REWORK / REJECT).

### 4.8 Raw Materials & Inventory (`/admin/inventory`)
- Real-time stock for Belgian velvet (meters), bouclé, foam sheets, seasoned teak planks, and hardware fittings.
- Low-stock alerts and suppliers directory.

---

## 5. Technology Stack

- **Framework**: Next.js 14.2 (App Router, Server & Client Components)
- **Frontend / Styling**: React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Database & ORM**: Prisma ORM with SQLite (default local zero-dependency out-of-the-box run) / PostgreSQL compatible
- **Testing**: Custom automated end-to-end verification suite (`scripts/test-runner.js`)

---

## 6. Quick Start & Local Setup

### Prerequisites
- Node.js 18.x or 20+ (tested on Node v24)
- npm 9+

### Step-by-Step Installation

1. **Clone or navigate to workspace directory**:
   ```bash
   cd "F:\sofa_chair pradeep furniture"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Database Setup (Prisma)**:
   ```bash
   # Push schema to database and generate client
   npx prisma db push

   # Seed database with rich atelier demo data (products, leads, jobs)
   node prisma/seed.js
   ```

4. **Run Automated Test Suite (Section 25 Scenarios A through H)**:
   ```bash
   node scripts/test-runner.js
   ```
   *(Expected output: ALL TESTS PASSED: 8 / 8 - 100% SUCCESS)*

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Production Build & Start**:
   ```bash
   npm run build
   npm start
   ```

---

## 7. Key Application Routes

| Route | Description |
|---|---|
| `/` | Luxury Homepage with Furniture Collections and Craftsmanship |
| `/products` | Furniture Catalogue with filters, search, and side-by-side comparison |
| `/products/[slug]` | Product Details with photo gallery, specs, and quote modal |
| `/collections` | Editorial Signature Collections (Milano, Royal Heritage, Scandi, Art Deco) |
| `/custom-design` | 8-Step Custom Furniture Request Wizard with external photo upload |
| `/studio` | Smart Customization Studio with live dimension calculations |
| `/manufacturing` | Workshop & Factory Story detailing the 6 core crafting stages |
| `/materials` | Fabric swatches, timber specifications, and foam density library |
| `/projects` | Completed luxury installations & architectural case studies |
| `/architects` | B2B architect collaboration & commercial RFQ portal |
| `/consultation` | Private showroom & workshop tour appointment booking |
| `/about` | Generational atelier history and Agra craftsmanship philosophy |
| `/contact` | Civil Lines gallery and Bodla workshop addresses |
| `/admin` | Executive Command Center & Operations Dashboard |
| `/admin/leads` | Sales CRM Pipeline with status updates and client history |
| `/admin/custom-requests` | Custom requests review, CAD drafting, and design freeze |
| `/admin/quotations` | Quotation generator, client PDF document, and factory conversion |
| `/admin/manufacturing` | Factory job cards, 15-stage production stepper, and BOM/QC |
| `/admin/inventory` | Raw timber, foam sheets, and fabric roll inventory tracking |
| `/admin/products` | Catalogue CMS |

---

## 8. Verification & Test Report

All 8 scenarios specified in Section 25 were executed and validated:

```text
================================================================
PRADEEP FURNITURE ATELIER - END-TO-END TEST SUITE (SECTION 25)
================================================================

[TEST A] Scenario A — Product Enquiry Submission...
  ✔ Passed: Customer enquiry saved and recorded in Lead CRM pipeline.

[TEST B] Scenario B — External Reference Photo & CAD Revision...
  ✔ Passed: External reference photo uploaded, customer requirements recorded, and designer CAD revision REV-01 frozen.

[TEST C] Scenario C — Existing Product Customization in Studio...
  ✔ Passed: Existing sofa customization attributes validated against manufacturer rules and saved.

[TEST D] Scenario D — Quotation Management & Versioning...
  ✔ Passed: Quotation QTE generated with tax calculations, revision code, and internal margin separation.

[TEST E] Scenario E — Manufacturing Job Card, 15 Stages & QC Verification...
  ✔ Passed: Manufacturing job card issued, stage transitioned to WOOD_CUTTING, and 6-point QC passed.


[TEST G] Scenario G — Non-E-Commerce Compliance Audit (Section 1 Strict Prohibition)...
  ✔ Passed: Codebase 100% compliant with Non-E-Commerce policy. Zero shopping carts, zero Buy Now buttons, zero online checkouts.

[TEST H] Scenario H — Access Control & Data Protection...
  ✔ Passed: RBAC operational across Super Admin, Designer, Sales, and Production roles. Confidential internal costs protected.

================================================================
ALL TESTS PASSED: 8 / 8 (100% SUCCESS)
================================================================
```

---

## 9. Business Information & Atelier Contacts

- **Brand Name**: Pradeep Furniture Atelier
- **Showroom Gallery**: 18 Civil Lines, Heritage Boulevard, Agra, UP - 282002
- **Manufacturing Works**: Plot 42-44, Bodla Industrial Zone, Agra, UP - 282007
- **Phone**: +91 98970 23456 / +91 98970 23457
- **Email**: `bespoke@pradeepfurniture.com`
- **GSTIN**: 09AABCP1234F1Z9
- **Guarantee**: 10-Year Solid Hardwood Structural Guarantee

## Admin operations

Open `/admin/login`. The local admin password is stored as `ADMIN_PASSWORD` in `.env.local`; `ADMIN_SESSION_SECRET` signs the eight-hour, HTTP-only admin session. Keep both values private and configure them in the hosting environment when deploying. The local environment file is excluded from Git.

The admin panel supports product creation/editing and publishing, featured selections, persistent lead stages and staff follow-ups, custom request status, quotation approval, factory job creation and sequential stage updates, inventory adjustments with movement history, supplier editing, and consultation status. Accept a quote before releasing its job. Existing jobs cannot be duplicated from the same quote. Print the customer quotation through its preview.

Public pages use scroll reveals and subtle hover/hero animation. Reduced-motion preferences disable animation.
