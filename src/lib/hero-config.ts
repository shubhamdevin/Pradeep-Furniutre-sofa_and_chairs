export type HeroSlide = { id:string; enabled:boolean; image:string; alt:string; caption?:string; eyebrow:string; heading:string[]; description:string; position:number; primaryLabel:string; primaryHref:string; secondaryLabel:string; secondaryHref:string };
export type HeroConfig = { enabled:boolean; autoplay:boolean; interval:number; showPromises:boolean; promises:{title:string;detail:string}[]; slides:HeroSlide[] };
export const defaultHero:HeroConfig = {
  "enabled": true,
  "autoplay": true,
  "interval": 5500,
  "showPromises": true,
  "promises": [
    {
      "title": "Custom",
      "detail": "Design options"
    },
    {
      "title": "Premium",
      "detail": "Quality materials"
    },
    {
      "title": "Made in",
      "detail": "Our Agra atelier"
    },
    {
      "title": "Made for",
      "detail": "Your exact space"
    }
  ],
  "slides": [
    {
      "image": "/images/atelier/hero-living.webp",
      "alt": "Luxury sofa in a sunlit modern living room",
      "caption": "A softer way to come home",
      "eyebrow": "CRAFTED FOR MODERN LIVING",
      "heading": [
        "Design",
        "Defines",
        "the Space."
      ],
      "description": "Premium sofas and statement chairs, thoughtfully made for homes, offices and meaningful spaces.",
      "id": "slide-0",
      "enabled": true,
      "position": 50,
      "primaryLabel": "Explore Collection",
      "primaryHref": "/products",
      "secondaryLabel": "Customize Your Furniture",
      "secondaryHref": "/custom-design"
    },
    {
      "image": "/images/atelier/residence-living.webp",
      "alt": "Bespoke seating in an elegant residence",
      "caption": "Beautiful spaces, thoughtfully furnished",
      "eyebrow": "SPACES THAT FEEL LIKE YOU",
      "heading": [
        "Your Home.",
        "Your Style.",
        "Beautifully."
      ],
      "description": "Bring warmth and character to your favourite spaces with furniture tailored to the way you live.",
      "id": "slide-1",
      "enabled": true,
      "position": 50,
      "primaryLabel": "Explore Collection",
      "primaryHref": "/products",
      "secondaryLabel": "Customize Your Furniture",
      "secondaryHref": "/custom-design"
    },
    {
      "image": "/images/catalogue-2026/aurelia-crescent-sofa.webp",
      "alt": "Aurelia curved ivory sofa",
      "caption": "Comfort, beautifully curved",
      "eyebrow": "SOFT CURVES. QUIET LUXURY.",
      "heading": [
        "A Softer",
        "Side of",
        "Luxury."
      ],
      "description": "Discover sculpted curves and inviting textures, designed for slow mornings and evenings that linger.",
      "id": "slide-2",
      "enabled": true,
      "position": 50,
      "primaryLabel": "Explore Collection",
      "primaryHref": "/products",
      "secondaryLabel": "Customize Your Furniture",
      "secondaryHref": "/custom-design"
    },
    {
      "image": "/images/catalogue-2026/palazzo-tuxedo-sofa.webp",
      "alt": "Palazzo emerald velvet luxury sofa",
      "caption": "A statement in every detail",
      "eyebrow": "COLOUR WITH CHARACTER",
      "heading": [
        "Bold Form.",
        "Rich Colour.",
        "All Yours."
      ],
      "description": "Make room for a statement. Rich velvet, tailored lines and distinctive finishes give your space its own personality.",
      "id": "slide-3",
      "enabled": true,
      "position": 50,
      "primaryLabel": "Explore Collection",
      "primaryHref": "/products",
      "secondaryLabel": "Customize Your Furniture",
      "secondaryHref": "/custom-design"
    }
  ]
};
