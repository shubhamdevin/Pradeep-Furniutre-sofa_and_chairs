const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Pradeep Furniture Atelier database...');

  // 1. Business Settings
  await prisma.businessSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      brandName: 'Pradeep Furniture Atelier',
      tagline: 'Bespoke Luxury Sofas & Statement Fancy Chairs Handcrafted to Perfection',
      phone: '+91 98970 23456',
      whatsapp: '+91 98970 23456',
      email: 'bespoke@pradeepfurniture.com',
      factoryAddress: 'Atelier Compound, Plot 42-44, Bodla Industrial Zone, Agra, UP - 282007',
      showroomAddress: 'The Heritage Design Gallery, 18 Civil Lines, Agra, UP - 282002',
      businessHours: 'Monday - Saturday: 10:00 AM - 8:00 PM | Sunday: By Private Appointment',
      gstNumber: '09AABCP1234F1Z9',
      warrantyHighlight: '10-Year Solid Hardwood Structural Guarantee & 5-Year Cushion Foam Resilience Warranty',
    },
  });

  // 2. Staff Users with Roles
  const usersData = [
    {
      id: 'user-admin-1',
      email: 'admin@pradeepfurniture.com',
      name: 'Pradeep Sharma',
      passwordHash: 'atelier_secure_hash_2026',
      role: 'SUPER_ADMIN',
      department: 'Executive Atelier Management',
      phone: '+91 98970 23456',
    },
    {
      id: 'user-designer-1',
      email: 'designer@pradeepfurniture.com',
      name: 'Ar. Ananya Sen',
      passwordHash: 'designer_hash_2026',
      role: 'FURNITURE_DESIGNER',
      department: 'Custom Studio & CAD Drafting',
      phone: '+91 98970 23457',
    },
    {
      id: 'user-sales-1',
      email: 'sales@pradeepfurniture.com',
      name: 'Vikram Malhotra',
      passwordHash: 'sales_hash_2026',
      role: 'SALES_MANAGER',
      department: 'Client Relations & Quotations',
      phone: '+91 98970 23458',
    },
    {
      id: 'user-prod-1',
      email: 'production@pradeepfurniture.com',
      name: 'Master Upholsterer Rajesh Pal',
      passwordHash: 'prod_hash_2026',
      role: 'PRODUCTION_MANAGER',
      department: 'Carpentry & Upholstery Works',
      phone: '+91 98970 23459',
    },
    {
      id: 'user-qc-1',
      email: 'qc@pradeepfurniture.com',
      name: 'Devendra Rathore',
      passwordHash: 'qc_hash_2026',
      role: 'QC_INSPECTOR',
      department: 'Quality Assurance & Dispatch',
      phone: '+91 98970 23460',
    },
  ];

  for (const u of usersData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }

  // 3. Categories
  const categories = [
    { id: 'cat-2seater', name: '2-Seater Sofas', slug: '2-seater-sofas', description: 'Intimate, space-efficient sofas crafted for modern luxury apartments and study lounges.' },
    { id: 'cat-3seater', name: '3-Seater Sofas', slug: '3-seater-sofas', description: 'Classic proportioned living room statement sofas with hand-finished hardwood frames.' },
    { id: 'cat-lshape', name: 'L-Shaped Sofas', slug: 'l-shaped-sofas', description: 'Expansive corner loungers engineered for generous family comfort and architectural focal points.' },
    { id: 'cat-ushape', name: 'U-Shaped Sofas', slug: 'u-shaped-sofas', description: 'Magnificent conversational sectional suites tailored for grand drawing rooms and cinema halls.' },
    { id: 'cat-sectional', name: 'Sectional Sofas', slug: 'sectional-sofas', description: 'Modular seating arrangements configurable to any bespoke floor plan.' },
    { id: 'cat-chesterfield', name: 'Chesterfield Sofas', slug: 'chesterfield-sofas', description: 'Deep diamond-tufted hand-pleated masterpieces with roll-top arms and brass studding.' },
    { id: 'cat-curved', name: 'Curved Sofas', slug: 'curved-sofas', description: 'Sculptural organic silhouettes inspired by Milanese contemporary architecture.' },
    { id: 'cat-luxury', name: 'Luxury Sofas', slug: 'luxury-sofas', description: 'Ultra-exclusive atelier pieces combining bespoke Italian fabrics and gilded timber trims.' },
    { id: 'cat-fancy', name: 'Fancy Chairs', slug: 'fancy-chairs', description: 'Eye-catching statement chairs featuring unconventional silhouettes and artisanal details.' },
    { id: 'cat-accent', name: 'Accent Chairs', slug: 'accent-chairs', description: 'Contrasting seating designed to elevate reading nooks, bedrooms, and foyer spaces.' },
    { id: 'cat-lounge', name: 'Lounge Chairs', slug: 'lounge-chairs', description: 'Ergonomic recline-angled seating with deep cushioned comfort and sculpted armrests.' },
    { id: 'cat-wingback', name: 'Wingback Chairs', slug: 'wingback-chairs', description: 'Regal high-backed armchairs that provide acoustic shelter and stately presence.' },
    { id: 'cat-tub', name: 'Tub Chairs', slug: 'tub-chairs', description: 'Curved barrel-back chairs wrapping the sitter in seamless upholstered comfort.' },
    { id: 'cat-royal', name: 'Royal Chairs', slug: 'royal-chairs', description: 'Palatial throne-inspired heritage armchairs with teak carvings and velvet tapestries.' },
    { id: 'cat-custom', name: 'Custom Furniture', slug: 'custom-furniture', description: 'Fully tailored one-of-a-kind seating manufactured from reference sketches or client blueprints.' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
    });
  }

  // 4. Collections
  const collections = [
    {
      id: 'col-milano',
      name: 'Milano Opulence',
      slug: 'milano-opulence',
      tagline: 'Italian Haute Couture Living',
      description: 'Low-slung minimalist profiles with fluted details, boucle textures, and brushed champagne gold metal accents.',
      heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'col-royal',
      name: 'Royal Heritage',
      slug: 'royal-heritage',
      tagline: 'Aristocratic Tufting & Hand-Carved Teak',
      description: 'Timeless Chesterfield deep-buttoning, heavy jewel-toned velvets, and hand-turned solid walnut legs.',
      heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'col-scandi',
      name: 'Scandinavian Serenity',
      slug: 'scandinavian-serenity',
      tagline: 'Organic Curves & Warm Natural Wood',
      description: 'Gentle cocoon-like curves, textured natural linen, and exposed oiled oak timber joinery.',
      heroImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'col-artdeco',
      name: 'Art Deco Atelier',
      slug: 'art-deco-atelier',
      tagline: 'Geometric Glamour & Fluted Paneling',
      description: 'Scalloped backrests, rich emerald and amber velvets, and precision handcrafted brass ferrules.',
      heroImage: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  for (const col of collections) {
    await prisma.collection.upsert({
      where: { slug: col.slug },
      update: {},
      create: col,
    });
  }

  // 5. Materials & Swatches
  const materials = [
    {
      id: 'mat-velvet',
      category: 'FABRIC',
      code: 'FAB-VELVET-ROYAL',
      name: 'Belgian Luxe Velvet',
      description: 'Heavy 480 GSM plush velvet with spill-resistant treatment and 65,000 Martindale rub count.',
      tier: 'LUXURY_ATELIER',
      colorHex: '#1B3B2B',
      stockUnit: 'METERS',
      currentStock: 340,
      reorderLevel: 50,
      supplierName: 'Kavita Textile Mills & European Imports',
    },
    {
      id: 'mat-boucle',
      category: 'FABRIC',
      code: 'FAB-BOUCLE-MILAN',
      name: 'Alabaster Textured Bouclé',
      description: 'Warm tactile looped yarn offering rich dimensional depth and cozy contemporary feel.',
      tier: 'PREMIUM',
      colorHex: '#EDE5D9',
      stockUnit: 'METERS',
      currentStock: 220,
      reorderLevel: 40,
      supplierName: 'Verona Fabrics Ltd',
    },
    {
      id: 'mat-leather',
      category: 'LEATHER',
      code: 'LEA-NAPPA-TOP',
      name: 'Full-Grain Italian Nappa Leather',
      description: 'Supple 1.4mm aniline dyed bovine leather developing a rich natural patina over decades.',
      tier: 'LUXURY_ATELIER',
      colorHex: '#624737',
      stockUnit: 'SQ_FT',
      currentStock: 650,
      reorderLevel: 100,
      supplierName: 'Tuscan Leather Consortium',
    },
    {
      id: 'mat-wood-teak',
      category: 'WOOD',
      code: 'TIMBER-TEAK-A',
      name: 'Kiln-Dried CP Teakwood Frame',
      description: 'Moisture content controlled below 10%, anti-termite treated with mortise-and-tenon joinery.',
      tier: 'LUXURY_ATELIER',
      colorHex: '#7A5B47',
      stockUnit: 'CUBIC_FT',
      currentStock: 180,
      reorderLevel: 30,
      supplierName: 'Timber Guild Foresters',
    },
    {
      id: 'mat-foam-hr45',
      category: 'FOAM',
      code: 'FOAM-HR-45D',
      name: '45-Density High Resilience PU Foam',
      description: 'Sag-free pressure-relieving core layered with hypersoft comfort topper and pocket springs.',
      tier: 'PREMIUM',
      colorHex: '#F7F4EF',
      stockUnit: 'SHEETS',
      currentStock: 95,
      reorderLevel: 20,
      supplierName: 'SleepCraft Advanced Foams',
    },
  ];

  for (const m of materials) {
    await prisma.furnitureMaterial.upsert({
      where: { code: m.code },
      update: {},
      create: m,
    });
  }

  // Fabric Swatches
  const swatches = [
    { id: 'sw-emerald', materialId: 'mat-velvet', name: 'Imperial Emerald Velvet', code: 'V-EMR-01', colorHex: '#14382A', weaveType: 'Velvet', rubCount: 65000, isRecommended: true },
    { id: 'sw-royal-blue', materialId: 'mat-velvet', name: 'Midnight Sapphire Velvet', code: 'V-BLU-02', colorHex: '#16284F', weaveType: 'Velvet', rubCount: 65000, isRecommended: true },
    { id: 'sw-mustard', materialId: 'mat-velvet', name: 'Antique Gold Ochre Velvet', code: 'V-GLD-03', colorHex: '#B99A68', weaveType: 'Velvet', rubCount: 65000, isRecommended: false },
    { id: 'sw-charcoal', materialId: 'mat-velvet', name: 'Deep Basalt Velvet', code: 'V-CHR-04', colorHex: '#242424', weaveType: 'Velvet', rubCount: 65000, isRecommended: true },
    { id: 'sw-boucle-cream', materialId: 'mat-boucle', name: 'Alabaster Ivory Bouclé', code: 'B-CRM-01', colorHex: '#F7F4EF', weaveType: 'Boucle', rubCount: 45000, isRecommended: true },
    { id: 'sw-boucle-oat', materialId: 'mat-boucle', name: 'Warm Oat Bouclé', code: 'B-OAT-02', colorHex: '#DFD4C2', weaveType: 'Boucle', rubCount: 45000, isRecommended: false },
    { id: 'sw-leather-cognac', materialId: 'mat-leather', name: 'Heritage Cognac Tan Leather', code: 'L-CGN-01', colorHex: '#7A4B29', weaveType: 'Top Grain Nappa', rubCount: 100000, isRecommended: true },
    { id: 'sw-leather-espresso', materialId: 'mat-leather', name: 'Espresso Walnut Leather', code: 'L-ESP-02', colorHex: '#3D281E', weaveType: 'Top Grain Nappa', rubCount: 100000, isRecommended: false },
  ];

  for (const sw of swatches) {
    await prisma.fabricSwatch.upsert({
      where: { id: sw.id },
      update: {},
      create: sw,
    });
  }

  // 6. 3D Model Registry (Section 7 Compliant)
  const assetModels = [
    {
      id: 'asset-3d-sofa-03',
      name: 'Poly Haven Sofa 03 (Hosted Interactive 3D GLTF)',
      provider: 'POLY_HAVEN',
      embedMode: 'HOSTED_GLB',
      modelUrl: '/models/sofa_03/sofa_03_1k.gltf',
      author: 'Poly Haven Contributors (Dmitry Tretyakov & Rob Tuytel)',
      licence: 'CC0 1.0 Universal Public Domain',
      attributionUrl: 'https://polyhaven.com/a/sofa_03',
      posterImageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
      fileFormat: 'gltf',
      loadingStatus: 'VERIFIED',
      isAccurateRep: false,
      disclaimer: 'Third-party 3D model used under CC0 license for interactive geometry and scale demonstration. Manufactured finishes are custom tailored to client order.',
      initialCameraPos: '0, 1.4, 3.2',
      isEnabled: true,
    },
    {
      id: 'asset-3d-mid-century-chair',
      name: 'Poly Haven Mid Century Lounge Chair (Hosted Interactive 3D GLTF)',
      provider: 'POLY_HAVEN',
      embedMode: 'HOSTED_GLB',
      modelUrl: '/models/mid_century_lounge_chair/mid_century_lounge_chair_1k.gltf',
      author: 'Poly Haven Contributors (Dmitry Tretyakov)',
      licence: 'CC0 1.0 Universal Public Domain',
      attributionUrl: 'https://polyhaven.com/a/mid_century_lounge_chair',
      posterImageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
      fileFormat: 'gltf',
      loadingStatus: 'VERIFIED',
      isAccurateRep: false,
      disclaimer: 'Third-party 3D model used under CC0 license for interactive ergonomic showcase. Workshop carpentry utilizes solid kiln-dried teak/walnut.',
      initialCameraPos: '0, 1.1, 2.4',
      isEnabled: true,
    },
    {
      id: 'asset-3d-sofa-3-sketchfab',
      name: 'Sofa 3 by 3dx (Official Sketchfab Embed)',
      provider: 'SKETCHFAB',
      embedMode: 'SKETCHFAB_EMBED',
      modelUrl: 'https://sketchfab.com/models/1d09094be7fc4e809841992d8801f217/embed?autostart=1&ui_controls=1&ui_infos=0&ui_watermark=1',
      sketchfabUid: '1d09094be7fc4e809841992d8801f217',
      author: '3dx',
      licence: 'Creative Commons Attribution (CC-BY 4.0)',
      attributionUrl: 'https://sketchfab.com/3d-models/sofa-3-3dx-1d09094be7fc4e809841992d8801f217',
      posterImageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80',
      fileFormat: 'embed',
      loadingStatus: 'VERIFIED',
      isAccurateRep: false,
      disclaimer: 'Third-party 3D demonstration model embedded via Sketchfab under CC-BY 4.0 with full author attribution. Custom fabrication produces bespoke proportions.',
      initialCameraPos: '0, 1.5, 3.0',
      isEnabled: true,
    },
    {
      id: 'asset-3d-wingback-sketchfab',
      name: 'Modern Wingback Accent Chair by dynamic_digital (Official Sketchfab Embed)',
      provider: 'SKETCHFAB',
      embedMode: 'SKETCHFAB_EMBED',
      modelUrl: 'https://sketchfab.com/models/4b053c1851784878a0add9973b89d823/embed?autostart=1&ui_controls=1&ui_infos=0&ui_watermark=1',
      sketchfabUid: '4b053c1851784878a0add9973b89d823',
      author: 'dynamic_digital',
      licence: 'Creative Commons Attribution (CC-BY 4.0)',
      attributionUrl: 'https://sketchfab.com/3d-models/modern-wingback-accent-chair-4b053c1851784878a0add9973b89d823',
      posterImageUrl: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1000&q=80',
      fileFormat: 'embed',
      loadingStatus: 'VERIFIED',
      isAccurateRep: false,
      disclaimer: 'Third-party 3D model embedded via Sketchfab under CC-BY 4.0. Visual demonstration of high-backed contour and wing flare.',
      initialCameraPos: '0, 1.2, 2.2',
      isEnabled: true,
    },
  ];

  for (const asset of assetModels) {
    await prisma.threeDAsset.upsert({
      where: { id: asset.id },
      update: {},
      create: asset,
    });
  }

  // 7. Products Catalogue (12 Luxury Products)
  const products = [
    {
      id: 'prod-milano-lshape-01',
      sku: 'ATELIER-SOF-001',
      name: 'The Aurelia Italian Curved Sectional',
      slug: 'the-aurelia-italian-curved-sectional',
      tagline: 'Sculptural Grandeur with Seamless Floating Plinth',
      description: 'An architectural centerpiece defined by its organic curved geometry, whisper-soft cloud cushioning, and sweeping panoramic presence. Handcrafted with an inner kiln-dried hardwood skeleton and layered with dual-density high resilience foam crowned in goose feather blend.',
      categoryId: 'cat-curved',
      collectionId: 'col-milano',
      furnitureType: 'SOFA',
      seatingCapacity: '5-6 Seater Curved Sectional',
      dimensionsSummary: '132"W x 58"D x 31"H (Seat Height: 17.5")',
      widthCm: 335,
      depthCm: 147,
      heightCm: 79,
      seatHeightCm: 44.5,
      frameMaterial: 'Kiln-Dried Treated Sal Wood & Marine Ply Reinforcements',
      upholsteryType: 'Alabaster Textured Bouclé or Belgian Velvet',
      foamDensity: '45D Sag-Resistant High Resilience Foam + Microfiber Crown',
      suspension: 'German Heavy Tensile Sinuous Springs with Cross-Woven Jute Webbing',
      legFinish: 'Recessed Concealed Hardwood Plinth in Ebonized Finish',
      warrantyYears: 10,
      isCustomizable: true,
      isFeatured: true,
      indicativePriceRange: 'Custom Manufacturing Quotation on Request',
      assetId: 'asset-3d-sofa-03', // Linked 3D
      images: [
        { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', viewAngle: 'Angled 45° Hero', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80', viewAngle: 'Front Perspective', isPrimary: false },
        { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', viewAngle: 'Atmospheric Drawing Room View', isPrimary: false },
      ],
      specs: [
        { group: 'Dimensions', label: 'Overall Dimensions', value: '132" W x 58" D x 31" H' },
        { group: 'Dimensions', label: 'Seat Depth', value: '26" (Generous Deep Seating)' },
        { group: 'Frame & Foundation', label: 'Timber Species', value: 'Seasoned Sal Wood (Moisture < 10%)' },
        { group: 'Frame & Foundation', label: 'Joinery Type', value: 'Mortise, Tenon & Corner Glued Blocks' },
        { group: 'Cushioning', label: 'Seat Core', value: '45-Density High Resilience + Down Wrap' },
        { group: 'Cushioning', label: 'Back Support', value: 'Conjugated Siliconized Poly-Fibre' },
        { group: 'Finishes', label: 'Standard Fabric', value: 'Belgian Bouclé 45,000 Martindale' },
        { group: 'Finishes', label: 'Plinth Detail', value: 'Concealed Shadow Line Base' },
        { group: 'Care & Service', label: 'Fabric Care', value: 'Professional Dry Clean / Vacuum with soft brush' },
        { group: 'Care & Service', label: 'Warranty', value: '10-Year Hardwood Frame Structural Guarantee' },
      ],
    },
    {
      id: 'prod-midcentury-lounge-02',
      sku: 'ATELIER-CHR-002',
      name: 'The Regent Mid-Century Sculpted Lounge Chair',
      slug: 'the-regent-mid-century-sculpted-lounge-chair',
      tagline: 'Ergonomic Poise with Solid Teak Exposed Framework',
      description: 'An iconic silhouette honoring 1950s Danish modernism with hand-sculpted solid teak arms and an organically reclined seat rake. Each joint is carved by master artisans and finished with warm organic linseed oils to reveal the natural grain.',
      categoryId: 'cat-lounge',
      collectionId: 'col-scandi',
      furnitureType: 'CHAIR',
      seatingCapacity: '1 Seater Lounge',
      dimensionsSummary: '31"W x 34"D x 33"H (Seat Height: 16.5")',
      widthCm: 79,
      depthCm: 86,
      heightCm: 84,
      seatHeightCm: 42,
      frameMaterial: 'Solid Hand-Carved Teakwood Frame',
      upholsteryType: 'Italian Nappa Leather or Belgian Velvet',
      foamDensity: '50D Ortho-Support Molded Foam Core',
      suspension: 'Pirelli Elastic Webbing Sub-Structure',
      legFinish: 'Hand-Rubbed Natural Teak Oil Finish',
      warrantyYears: 10,
      isCustomizable: true,
      isFeatured: true,
      indicativePriceRange: 'Custom Manufacturing Quotation on Request',
      assetId: 'asset-3d-mid-century-chair', // Linked 3D
      images: [
        { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80', viewAngle: 'Hero 45° Profile', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=80', viewAngle: 'Side Sculpted Timber View', isPrimary: false },
        { url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80', viewAngle: 'Back Contour Detail', isPrimary: false },
      ],
      specs: [
        { group: 'Dimensions', label: 'Overall Dimensions', value: '31" W x 34" D x 33" H' },
        { group: 'Dimensions', label: 'Seat Clearance', value: '16.5" Ergonomic Pitch' },
        { group: 'Frame & Foundation', label: 'Timber Species', value: 'Solid Seasoned Teak Wood' },
        { group: 'Cushioning', label: 'Seat Core', value: '50-Density Ergonomic Contoured Foam' },
        { group: 'Finishes', label: 'Upholstery Tier', value: 'Top-Grain Aniline Dyed Leather' },
        { group: 'Care & Service', label: 'Warranty', value: '10-Year Framework Guarantee' },
      ],
    },
    {
      id: 'prod-chesterfield-grand-03',
      sku: 'ATELIER-SOF-003',
      name: 'The Buckingham Grand Chesterfield 3-Seater',
      slug: 'the-buckingham-grand-chesterfield-3-seater',
      tagline: 'Deep Diamond Tufted Heritage Masterpiece',
      description: 'The pinnacle of classic British atelier upholstery. Features hand-folded deep diamond tufting with individual fabric buttons, rolled shelter arms, and solid turned bun feet fitted with brass castors.',
      categoryId: 'cat-chesterfield',
      collectionId: 'col-royal',
      furnitureType: 'SOFA',
      seatingCapacity: '3-4 Seater',
      dimensionsSummary: '96"W x 39"D x 31"H (Seat Height: 18")',
      widthCm: 244,
      depthCm: 99,
      heightCm: 79,
      seatHeightCm: 45.7,
      frameMaterial: 'Grade-A Kiln-Dried Hardwood Frame with Solid Birch Carvings',
      upholsteryType: 'Royal Emerald Luxe Velvet or Vintage Saddle Leather',
      foamDensity: '45D Multi-Layered Pocket Coil Cushions',
      suspension: 'Hand-Tied 8-Way Steel Coil Springs',
      legFinish: 'Turned Hardwood Bun Feet with Antiqued Brass Castors',
      warrantyYears: 10,
      isCustomizable: true,
      isFeatured: true,
      indicativePriceRange: 'Custom Manufacturing Quotation on Request',
      assetId: 'asset-3d-sofa-3-sketchfab', // Linked 3D
      images: [
        { url: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1200&q=80', viewAngle: 'Hero Tufted Front Angle', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', viewAngle: 'Armrest Scroll Detail', isPrimary: false },
      ],
      specs: [
        { group: 'Dimensions', label: 'Overall Dimensions', value: '96" W x 39" D x 31" H' },
        { group: 'Frame & Foundation', label: 'Structural Timber', value: 'Solid Hardwood Double-Doweled' },
        { group: 'Cushioning', label: 'Tufting Technique', value: 'Authentic Hand-Folded Deep Diamond' },
        { group: 'Finishes', label: 'Studding', value: 'Individual Hand-Applied Brass Nails' },
      ],
    },
    {
      id: 'prod-wingback-accent-04',
      sku: 'ATELIER-CHR-004',
      name: 'The Sovereign High-Back Wing Chair',
      slug: 'the-sovereign-high-back-wing-chair',
      tagline: 'Regal Cocoon with Fluted Lumbar Wings',
      description: 'A modern revival of the aristocratic fireside wingback chair. Tall sculpted ear-wings provide privacy and acoustic tranquility, while slim tapered brass-capped legs add contemporary grace.',
      categoryId: 'cat-wingback',
      collectionId: 'col-artdeco',
      furnitureType: 'CHAIR',
      seatingCapacity: '1 Seater Wingback',
      dimensionsSummary: '34"W x 35"D x 44"H (Seat Height: 18.5")',
      widthCm: 86,
      depthCm: 89,
      heightCm: 112,
      seatHeightCm: 47,
      frameMaterial: 'Reinforced Kiln-Dried Teak Framework',
      upholsteryType: 'Midnight Sapphire Velvet with Textured Piping',
      foamDensity: '45D Molded Contoured Foam with Lumbar Pillow',
      suspension: 'High Tensile Webbing & Coil Foundation',
      legFinish: 'Tapered Black Oak Legs with Brushed Brass Sleeves',
      warrantyYears: 10,
      isCustomizable: true,
      isFeatured: true,
      indicativePriceRange: 'Custom Manufacturing Quotation on Request',
      assetId: 'asset-3d-wingback-sketchfab', // Linked 3D
      images: [
        { url: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=80', viewAngle: 'Front High-Back Hero', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80', viewAngle: 'Wing Detail Angle', isPrimary: false },
      ],
      specs: [
        { group: 'Dimensions', label: 'Overall Dimensions', value: '34" W x 35" D x 44" H' },
        { group: 'Frame & Foundation', label: 'Structure', value: 'Solid Hardwood with Steel Stiffeners' },
        { group: 'Finishes', label: 'Leg Finish', value: 'Brushed PVD Brass Ferrule Trims' },
      ],
    },
    {
      id: 'prod-luxe-lshape-05',
      sku: 'ATELIER-SOF-005',
      name: 'The Versailles Modular Luxury Sectional',
      slug: 'the-versailles-modular-luxury-sectional',
      tagline: 'Expansive Modular Comfort for Private Estates',
      description: 'Configurable in left or right chaise orientations with generous 42-inch deep seating. Includes built-in solid walnut side drink tables and hidden charging troughs handcrafted into the frame.',
      categoryId: 'cat-lshape',
      collectionId: 'col-milano',
      furnitureType: 'SECTIONAL',
      seatingCapacity: '6-7 Seater Sectional',
      dimensionsSummary: '144"W x 108"D x 32"H',
      widthCm: 366,
      depthCm: 274,
      heightCm: 81,
      seatHeightCm: 44,
      frameMaterial: 'Heavy Timber Frame with Steel Under-beams',
      upholsteryType: 'Belgian Bouclé & Italian Full-Grain Leather Trim',
      foamDensity: 'Dual Layer 40D + 50D HR Foam with Feather Topper',
      suspension: 'No-Sag Heavy Duty Sinuous Wire System',
      legFinish: 'Matte Titanium Plinth Base',
      warrantyYears: 10,
      isCustomizable: true,
      isFeatured: true,
      indicativePriceRange: 'Custom Manufacturing Quotation on Request',
      images: [
        { url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80', viewAngle: 'Living Room Setting', isPrimary: true },
      ],
      specs: [
        { group: 'Dimensions', label: 'Overall Dimensions', value: '144" W x 108" D x 32" H' },
        { group: 'Frame & Foundation', label: 'Core Frame', value: 'Kiln-Dried Salwood with Steel Interlocks' },
      ],
    },
    {
      id: 'prod-fancy-tub-06',
      sku: 'ATELIER-CHR-006',
      name: 'The Celeste Fluted Barrel Tub Chair',
      slug: 'the-celeste-fluted-barrel-tub-chair',
      tagline: 'Curved Cocoon with 360-Degree Swivel Base',
      description: 'Enveloping 180-degree vertical channel fluting with an ultra-smooth whisper-silent concealed brass swivel mechanism. Ideal for boutique hotel lounges and master suite reading corners.',
      categoryId: 'cat-tub',
      collectionId: 'col-artdeco',
      furnitureType: 'CHAIR',
      seatingCapacity: '1 Seater Tub Swivel',
      dimensionsSummary: '32"W x 31"D x 29"H',
      widthCm: 81,
      depthCm: 79,
      heightCm: 74,
      seatHeightCm: 43,
      frameMaterial: 'Curved Molded Steam-Bent Hardwood',
      upholsteryType: 'Rosewater Velvet or Champagne Bouclé',
      foamDensity: '45D Molded Cold-Cure Foam',
      suspension: 'Reinforced Webbing Sub-Frame',
      legFinish: '360° Concealed Brushed Gold Swivel Base',
      warrantyYears: 10,
      isCustomizable: true,
      isFeatured: true,
      indicativePriceRange: 'Custom Manufacturing Quotation on Request',
      images: [
        { url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80', viewAngle: 'Front Swivel Angle', isPrimary: true },
      ],
      specs: [
        { group: 'Dimensions', label: 'Overall Dimensions', value: '32" W x 31" D x 29" H' },
        { group: 'Finishes', label: 'Mechanism', value: 'German Industrial 360° Ball-Bearing Swivel' },
      ],
    },
    {
      id: 'prod-royal-throne-07',
      sku: 'ATELIER-CHR-007',
      name: 'The Maharaja Hand-Carved Royal Armchair',
      slug: 'the-maharaja-hand-carved-royal-armchair',
      tagline: 'Palatial Heirloom with Gold Leaf Accents',
      description: 'A monument to Agra wood-carving heritage. Features intricate floral acanthus leaf cresting hand-carved out of aged CP Teak, finished with distressed gold leafing and upholstered in heavy gold brocade velvet.',
      categoryId: 'cat-royal',
      collectionId: 'col-royal',
      furnitureType: 'CHAIR',
      seatingCapacity: '1 Seater Royal Throne Chair',
      dimensionsSummary: '36"W x 34"D x 52"H',
      widthCm: 91,
      depthCm: 86,
      heightCm: 132,
      seatHeightCm: 49,
      frameMaterial: '100% Solid Seasoned Teak Wood Hand-Carved',
      upholsteryType: 'Heavy Brocade Royal Velvet with Zari Cord Piping',
      foamDensity: '50D High Resilience Traditional Coir & Foam Combination',
      suspension: 'Hand-Knotted Heavy Jute & Steel Coil Springs',
      legFinish: 'Antiqued Gold Leaf on Carved Teakwood',
      warrantyYears: 15,
      isCustomizable: true,
      isFeatured: true,
      indicativePriceRange: 'Custom Manufacturing Quotation on Request',
      images: [
        { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80', viewAngle: 'Front Carved Stature', isPrimary: true },
      ],
      specs: [
        { group: 'Dimensions', label: 'Overall Dimensions', value: '36" W x 34" D x 52" H' },
        { group: 'Craftsmanship', label: 'Carving', value: '180+ Artisan Hours Hand-Chiseled Teak' },
      ],
    },
    {
      id: 'prod-2seater-compact-08',
      sku: 'ATELIER-SOF-008',
      name: 'The Como Compact 2-Seater Love Seat',
      slug: 'the-como-compact-2-seater-love-seat',
      tagline: 'Tailored Luxury for Penthouse Studies & Boudoirs',
      description: 'Slim tailored arms, tight upholstered backrest with delicate blind button tufts, and slender solid walnut stiletto legs.',
      categoryId: 'cat-2seater',
      collectionId: 'col-milano',
      furnitureType: 'SOFA',
      seatingCapacity: '2 Seater Love Seat',
      dimensionsSummary: '68"W x 34"D x 32"H',
      widthCm: 173,
      depthCm: 86,
      heightCm: 81,
      seatHeightCm: 44,
      frameMaterial: 'Kiln-Dried Salwood Frame',
      upholsteryType: 'Belgian Linen Bouclé or Velvet',
      foamDensity: '45D Sag-Resistant Foam',
      suspension: 'Reinforced Steel Springs',
      legFinish: 'Turned Solid Walnut with Brass Ferrules',
      warrantyYears: 10,
      isCustomizable: true,
      isFeatured: false,
      indicativePriceRange: 'Custom Manufacturing Quotation on Request',
      images: [
        { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', viewAngle: 'Hero 2 Seater', isPrimary: true },
      ],
      specs: [
        { group: 'Dimensions', label: 'Overall Dimensions', value: '68" W x 34" D x 32" H' },
      ],
    },
  ];

  for (const prod of products) {
    const { images, specs, assetId, ...prodData } = prod;
    const createdProduct = await prisma.product.upsert({
      where: { slug: prodData.slug },
      update: {},
      create: prodData,
    });

    // Attach 3D asset if provided
    if (assetId) {
      await prisma.threeDAsset.update({
        where: { id: assetId },
        data: { productId: createdProduct.id },
      });
    }

    // Attach Images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: createdProduct.id,
            url: images[i].url,
            viewAngle: images[i].viewAngle,
            isPrimary: images[i].isPrimary,
            sortOrder: i,
          },
        });
      }
    }

    // Attach Specs
    if (specs && specs.length > 0) {
      for (let s = 0; s < specs.length; s++) {
        await prisma.productSpecification.create({
          data: {
            productId: createdProduct.id,
            group: specs[s].group,
            label: specs[s].label,
            value: specs[s].value,
            sortOrder: s,
          },
        });
      }
    }
  }

  // 8. Demo Customers
  const customer1 = await prisma.customer.upsert({
    where: { id: 'cust-sharma-1' },
    update: {},
    create: {
      id: 'cust-sharma-1',
      fullName: 'Dr. Siddharth Mehra',
      phone: '+91 98101 44552',
      whatsapp: '+91 98101 44552',
      email: 'siddharth.mehra@gmail.com',
      city: 'Agra',
      pincode: '282001',
      address: 'Bungalow 7, Taj Nagari Phase II, Fatehabad Road',
      companyName: 'Mehra Healthcare Diagnostics',
      customerType: 'RESIDENTIAL',
      notes: 'Renovating 4,500 sqft penthouse drawing room. Prefers rich jewel tones and curved silhouettes.',
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { id: 'cust-ar-kapoor-2' },
    update: {},
    create: {
      id: 'cust-ar-kapoor-2',
      fullName: 'Ar. Tanya Kapoor',
      phone: '+91 98200 99881',
      whatsapp: '+91 98200 99881',
      email: 'tanya@kapoordesignstudio.com',
      city: 'New Delhi',
      pincode: '110048',
      address: 'Studio 14, Greater Kailash II',
      companyName: 'Kapoor Architecture & Interiors',
      customerType: 'ARCHITECT',
      notes: 'Specifying custom lounge chairs and Chesterfield suites for boutique resort in Rishikesh.',
    },
  });

  // 9. Custom Design Request (CFR-2026-0001)
  const designReq1 = await prisma.designRequest.upsert({
    where: { referenceNumber: 'CFR-2026-0001' },
    update: {},
    create: {
      referenceNumber: 'CFR-2026-0001',
      requestType: 'EXTERNAL_REFERENCE',
      customerId: customer1.id,
      furnitureType: 'Curved Sectional Sofa',
      customizationReqs: JSON.stringify([
        'Change dimensions to fit 14ft curved bay window',
        'Custom Imperial Emerald Velvet upholstery',
        'Add recessed brass shadow-line plinth',
        'Ultra-deep 28-inch seating cushion depth',
      ]),
      dimensionsSummary: 'Length: 144" x Depth: 42" x Height: 30" (Bay Window Radius)',
      fabricPreference: 'Belgian Luxe Velvet',
      colorPreference: 'Imperial Emerald (V-EMR-01)',
      framePreference: 'Solid Kiln-Dried Teakwood',
      foamFirmness: 'Medium Plush with Down Topper',
      legFinish: 'Brushed Brass Recessed Base',
      quantity: 1,
      budgetRange: '₹1,80,000 - ₹2,40,000',
      intendedUsage: 'Penthouse Living Room Bay View',
      requiredTimeline: '4-5 Weeks',
      deliveryCity: 'Agra',
      deliveryPincode: '282001',
      specialInstructions: 'Customer uploaded Pinterest reference photo of a curved Parisian salon sofa. Requires CAD drawing verification before woodworking.',
      status: 'DESIGN_APPROVED',
    },
  });

  // Attachments for Design Request
  await prisma.designRequestAttachment.createMany({
    data: [
      {
        designRequestId: designReq1.id,
        fileUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        fileName: 'Customer_Pinterest_Reference_Living_Room.jpg',
        fileType: 'CUSTOMER_REFERENCE',
        notes: 'Original reference photo uploaded by Dr. Mehra',
      },
      {
        designRequestId: designReq1.id,
        fileUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
        fileName: 'Site_Bay_Window_Measurements_Photo.jpg',
        fileType: 'ROOM_PHOTO',
        notes: 'Living room curved window space',
      },
    ],
  });

  // Design Revisions (REV-01 & REV-02)
  const rev1 = await prisma.designRevision.create({
    data: {
      designRequestId: designReq1.id,
      revisionCode: 'REV-01',
      versionNumber: 1,
      designerId: 'user-designer-1',
      specifications: 'Initial 140" curved radius draft with 40D foam and standard birch ply frame.',
      designerNotes: 'Client reviewed and requested expanding length to 144" and upgrading to solid teak frame with feather topper.',
      approvalStatus: 'REVISE',
    },
  });

  const rev2 = await prisma.designRevision.create({
    data: {
      designRequestId: designReq1.id,
      revisionCode: 'REV-02',
      versionNumber: 2,
      designerId: 'user-designer-1',
      proposedCadUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      specifications: 'Final Frozen Specs: 144"W x 42"D x 30"H. Kiln-dried CP Teak structural frame, 45D HR foam core with 70/30 feather-down topper envelope. Imperial Emerald 65k Martindale velvet. Recessed 2" brushed brass plinth.',
      designerNotes: 'Approved in private atelier design meeting with client on Oct 6, 2026. Ready for job release.',
      isFrozenForJob: true,
      approvalStatus: 'APPROVED',
      approvedById: 'user-admin-1',
      approvedAt: new Date(),
    },
  });

  // 10. CRM Lead
  const lead1 = await prisma.lead.upsert({
    where: { leadCode: 'LEAD-2026-0042' },
    update: {},
    create: {
      leadCode: 'LEAD-2026-0042',
      source: 'EXTERNAL_REFERENCE',
      stage: 'QUOTATION_SENT',
      priority: 'HIGH',
      customerId: customer1.id,
      assignedToId: 'user-sales-1',
      designRequestId: designReq1.id,
      budgetRange: '₹2,00,000 - ₹2,50,000',
      tags: 'Penthouse Bay Window, Emerald Velvet, Bespoke Teak',
    },
  });

  await prisma.leadActivity.createMany({
    data: [
      { leadId: lead1.id, userId: 'user-sales-1', action: 'LEAD_CREATED', details: 'Customer submitted custom design request from website wizard with 2 photos.' },
      { leadId: lead1.id, userId: 'user-designer-1', action: 'CAD_REVISION_CREATED', details: 'Designer Ananya uploaded REV-02 after discussing bay window radius.' },
      { leadId: lead1.id, userId: 'user-sales-1', action: 'QUOTE_GENERATED', details: 'Quotation QTE-2026-0089 generated and shared with client for offline finalization.' },
    ],
  });

  // 11. Quotation (QTE-2026-0089)
  const quote1 = await prisma.quotation.upsert({
    where: { quoteNumber: 'QTE-2026-0089' },
    update: {},
    create: {
      quoteNumber: 'QTE-2026-0089',
      revisionCode: 'REV-01',
      customerId: customer1.id,
      leadId: lead1.id,
      designRevisionId: rev2.id,
      createdById: 'user-sales-1',
      status: 'ACCEPTED',
      subtotal: 185000.0,
      taxPercent: 18.0,
      taxAmount: 33300.0,
      shippingCost: 4500.0,
      totalEstimate: 222800.0,
      internalEstimatedCost: 112000.0, // SENSITIVE: Never show to customer
      internalProfitMargin: 49.7,     // SENSITIVE: Never show to customer
      deliveryLeadWeeks: 4,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      termsAndConditions: '1. Commercial agreement finalized offline via bank RTGS / Cheque.\n2. 50% mobilization advance upon Job Release, 50% prior to dispatch.\n3. Delivery includes white-glove living room installation in Agra.',
      warrantyTerms: '10-Year Solid Hardwood Structural Guarantee & 5-Year Cushion Foam Resilience Warranty.',
      clientNotes: 'Custom handcrafted curved sectional tailored to bay window blueprint.',
    },
  });

  await prisma.quotationItem.create({
    data: {
      quotationId: quote1.id,
      itemDescription: 'Bespoke 144" Curved Sectional Sofa in Imperial Emerald Velvet (CFR-2026-0001 / REV-02)',
      dimensions: '144"W x 42"D x 30"H',
      upholsterySpec: 'Belgian Luxe Velvet (V-EMR-01) with Spill Repel Shield',
      frameSpec: 'Solid Kiln-Dried CP Teakwood Frame with Brushed Brass Base',
      quantity: 1,
      unitEstimate: 185000.0,
      totalLineAmount: 185000.0,
    },
  });

  // 12. Manufacturing Job (JOB-2026-0055)
  const job1 = await prisma.manufacturingJob.upsert({
    where: { jobCardNumber: 'JOB-2026-0055' },
    update: {},
    create: {
      jobCardNumber: 'JOB-2026-0055',
      customerId: customer1.id,
      designRequestId: designReq1.id,
      designRevisionId: rev2.id,
      quotationId: quote1.id,
      productTitle: '144" Curved Bay-Window Sectional Sofa in Imperial Emerald Velvet',
      quantity: 1,
      exactDimensions: '144"W x 42"D x 30"H (Outer Arch Radius: 18ft)',
      frameInstructions: 'Use Grade-A Seasoned CP Teak planks. Form laminated curved ribs with 18mm Russian Birch ply blocks. Apply anti-fungal preservative.',
      foamSpecification: 'Base layer 50D ortho-rebound, middle 45D HR foam, top 3-inch channeled duvet containing 70% virgin microfiber & 30% down.',
      fabricCodeAndColor: 'V-EMR-01 (Imperial Emerald Luxe Velvet, Roll Batch #2026-94)',
      priority: 'HIGH',
      currentStage: 'STITCHING',
      startDate: new Date(),
      targetCompletionDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      notes: 'Customer visited atelier on Oct 7. Approved teak carcass before foam wrap. Proceeding with velvet pattern matching.',
    },
  });

  // 15 Production Stages Tasks
  const stages = [
    { name: 'Job Released & Order Blueprint Freeze', num: 1, status: 'COMPLETED' },
    { name: 'Material Planning & Allocation', num: 2, status: 'COMPLETED' },
    { name: 'Wood Cutting & Milling', num: 3, status: 'COMPLETED' },
    { name: 'Frame Assembly & Mortise Joinery', num: 4, status: 'COMPLETED' },
    { name: 'Spring & Webbing Sub-Structure', num: 5, status: 'COMPLETED' },
    { name: 'Foam Cutting & Density Stacking', num: 6, status: 'COMPLETED' },
    { name: 'Cushioning & Feather Envelope Wrap', num: 7, status: 'COMPLETED' },
    { name: 'Fabric Laser Cutting & Pattern Alignment', num: 8, status: 'COMPLETED' },
    { name: 'Stitching & French Seam Tailoring', num: 9, status: 'IN_PROGRESS' },
    { name: 'Hand Upholstery & Channel Pleating', num: 10, status: 'PENDING' },
    { name: 'Final Finishing & Brass Base Mounting', num: 11, status: 'PENDING' },
    { name: 'Quality Inspection & Load Testing', num: 12, status: 'PENDING' },
    { name: 'Protective Packaging & Corner Guards', num: 13, status: 'PENDING' },
    { name: 'Dispatch Ready & Logistics Scheduling', num: 14, status: 'PENDING' },
    { name: 'Closed Internally (Post Installation)', num: 15, status: 'PENDING' },
  ];

  for (const st of stages) {
    await prisma.jobTask.create({
      data: {
        jobId: job1.id,
        stageName: st.name,
        stageNumber: st.num,
        status: st.status,
      },
    });
  }

  // Workstation Assignment
  await prisma.jobAssignment.createMany({
    data: [
      { jobId: job1.id, userId: 'user-prod-1', workstation: 'Carpentry & Framing Unit' },
      { jobId: job1.id, userId: 'user-prod-1', workstation: 'Stitching & Tailoring Unit' },
    ],
  });

  // Bill of Materials (BOM)
  const bom1 = await prisma.billOfMaterials.upsert({
    where: { jobId: job1.id },
    update: {},
    create: {
      jobId: job1.id,
      totalCost: 112000.0,
    },
  });

  await prisma.bOMItem.createMany({
    data: [
      { bomId: bom1.id, materialCategory: 'Wood', description: 'Solid CP Teak Planks 3x2x8ft', requiredQty: 24, unit: 'Planks', unitEstimatedCost: 1800, totalEstimatedCost: 43200, isReserved: true },
      { bomId: bom1.id, materialCategory: 'Fabric', description: 'Belgian Luxe Velvet (V-EMR-01)', requiredQty: 28, unit: 'Meters', unitEstimatedCost: 1200, totalEstimatedCost: 33600, isReserved: true },
      { bomId: bom1.id, materialCategory: 'Foam', description: '45D HR & 50D Ortho Foam Sheets', requiredQty: 8, unit: 'Sheets', unitEstimatedCost: 2400, totalEstimatedCost: 19200, isReserved: true },
      { bomId: bom1.id, materialCategory: 'Springs & Fittings', description: 'German Sinuous Springs & Brass Plinth Trims', requiredQty: 1, unit: 'Kit', unitEstimatedCost: 16000, totalEstimatedCost: 16000, isReserved: true },
    ],
  });

  // Quality Inspection
  await prisma.qualityInspection.create({
    data: {
      jobId: job1.id,
      inspectorId: 'user-qc-1',
      result: 'PASS',
      dimensionCheck: true,
      frameStabilityCheck: true,
      stitchingCheck: true,
      foamComfortCheck: true,
      finishAlignmentCheck: true,
      inspectionNotes: 'Frame carpentry, mortise stability, and spring bounce verified prior to upholstery. Structural integrity certified 100%.',
    },
  });

  // 13. Inventory Items & Suppliers
  const sup1 = await prisma.supplier.upsert({
    where: { id: 'sup-verona' },
    update: {},
    create: {
      id: 'sup-verona',
      name: 'Verona Mills & European Textiles',
      contactName: 'Luca Rossi / Sunil Khanna',
      phone: '+91 98112 33441',
      email: 'orders@veronatextiles.in',
      city: 'Mumbai',
      category: 'FABRIC_MILLS',
      leadTimeDays: 5,
    },
  });

  const invItem1 = await prisma.inventoryItem.upsert({
    where: { itemCode: 'INV-VEL-EMR' },
    update: {},
    create: {
      itemCode: 'INV-VEL-EMR',
      name: 'Imperial Emerald Belgian Velvet (65k Rub)',
      category: 'FABRIC',
      unit: 'METERS',
      currentStock: 145.0,
      reservedStock: 28.0,
      minimumLevel: 30.0,
      supplierId: sup1.id,
      unitCost: 1150.0,
      locationBin: 'RACK-B4-ROLL12',
    },
  });

  await prisma.inventoryMovement.create({
    data: {
      inventoryItemId: invItem1.id,
      movementType: 'OUTWARD_JOB_ISSUE',
      quantity: 28.0,
      referenceCode: 'JOB-2026-0055',
      remarks: 'Issued 28 meters for Dr. Mehra Bay Window Sectional',
    },
  });

  // 14. Projects Portfolio Case Studies
  const projects = [
    {
      slug: 'taj-view-penthouse-agra',
      title: 'The Taj Enclave Penthouse',
      clientType: 'Luxury Penthouse Residence',
      location: 'Taj Nagari, Agra',
      description: 'A 5,000 sq ft private residence overlooking the historical horizon. Handcrafted curved velvet sectionals, sculptural accent seating, and fluted cocktail tub chairs.',
      challengeAndWork: 'Designing seamless curved seating that matched the 18ft radial bay window without visible seams while maintaining supreme comfort.',
      furnitureSupplied: '1 x 144" Curved Sectional in Emerald Velvet, 2 x Sovereign High-Back Wing Chairs, 1 x Fluted Swivel Tub Chair',
      coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    },
    {
      slug: 'the-haveli-heritage-resort',
      title: 'The Heritage Haveli Boutique Suites',
      clientType: 'Heritage Boutique Hotel',
      location: 'Jaipur Road, Agra Heritage Corridor',
      description: 'Restoration and bespoke seating for 12 royal luxury suites blending royal carved teakwood with modern fire-retardant plush velvet.',
      challengeAndWork: 'Replicating historical Mughal and British colonial turnings with heavy kiln-dried teakwood frames built to sustain commercial hospitality wear.',
      furnitureSupplied: '12 x Hand-Tufted Chesterfield Sofas, 24 x Carved Teak Armchairs, 12 x Bedroom Benches',
      coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    },
    {
      slug: 'skyline-villa-gurugram',
      title: 'The Horizon Pavilion Villa',
      clientType: 'Architectural Modernist Villa',
      location: 'Golf Course Road, Gurugram',
      description: 'Clean Scandinavian lines with low-profile Italian modular seating wrapped in tactile ivory bouclé and solid walnut trims.',
      challengeAndWork: 'Achieved an ultra-low 14-inch architectural plinth profile without compromising on 45-density multi-spring cushioning support.',
      furnitureSupplied: '1 x 156" U-Shaped Sectional Suite, 4 x Regent Mid-Century Teak Lounge Chairs',
      coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  for (const p of projects) {
    await prisma.projectPortfolio.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  // 15. Genuine Testimonials
  const testimonials = [
    {
      clientName: 'Ar. Tanya Kapoor',
      clientTitle: 'Principal Architect, Kapoor Design Studio',
      location: 'New Delhi & Agra',
      quote: 'Working with Pradeep Furniture Atelier is a revelation. Unlike commercial retailers, their workshop executes exact millimeter-level CAD drawings. The joinery of their teak frames and the flawless velvet tensioning on our hotel project exceeded Italian imports.',
      rating: 5,
    },
    {
      clientName: 'Dr. Siddharth & Radhika Mehra',
      clientTitle: 'Homeowners',
      location: 'Taj Enclave, Agra',
      quote: 'We had fallen in love with a curved designer sofa on Pinterest that no store in Delhi NCR could manufacture. Pradeep Furniture’s custom studio drafted CAD revisions, invited us to inspect the raw teak frame at their Bodla workshop, and delivered an absolute masterpiece.',
      rating: 5,
    },
    {
      clientName: 'Vikramaditya Singhania',
      clientTitle: 'Managing Director, Heritage Palace Hotels',
      location: 'Rajasthan & UP',
      quote: 'Their attention to frame acoustics, foam densities, and heavy Martindale contract-grade fabrics make them our first and only manufacturing partner for bespoke suites.',
      rating: 5,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  console.log('Seeding completed successfully with all rich atelier data, 3D assets, products, CRM leads, and factory jobs!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
