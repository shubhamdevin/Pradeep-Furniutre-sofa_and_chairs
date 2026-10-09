import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Layers, 
  Wrench, 
  Ruler, 
  Scissors, 
  Feather,
  Box,
  ArrowRight
} from 'lucide-react';

export default function ManufacturingPage() {
  const steps = [
    {
      num: '01',
      title: 'Kiln-Dried Hardwood Selection',
      desc: 'We select aged Grade-A CP Teakwood and Salwood timber planks. Every plank is seasoned and kiln-dried down to less than 10% moisture content to prevent seasonal contraction, warping, or joint squeaking.',
      icon: Layers,
    },
    {
      num: '02',
      title: 'Mortise & Tenon Carpentry',
      desc: 'Our master woodworkers chisel traditional double-doweled mortise and tenon joinery reinforced with corner support blocks. We avoid cheap staple-gun joinery common in commercial retail furniture.',
      icon: Wrench,
    },
    {
      num: '03',
      title: 'High-Tensile Carbon Webbing',
      desc: 'The seating foundation is engineered with heavy-gauge carbon steel zig-zag sinuous springs and cross-knotted jute webbing, guaranteeing a resilient bounce that preserves seat loft for decades.',
      icon: Ruler,
    },
    {
      num: '04',
      title: 'High-Resilience Density Stacking',
      desc: 'We combine a 50D ortho-rebound foundation layer with a 45D High Resilience middle core, crowned with a channeled duvet of virgin microfiber and goose down feathers.',
      icon: Feather,
    },
    {
      num: '05',
      title: 'Laser Pattern Cutting & Tailoring',
      desc: 'European upholstery fabrics and Italian aniline leathers are laser-cut and aligned by master tailors with double-stitched French topstitching using bonded nylon thread.',
      icon: Scissors,
    },
    {
      num: '06',
      title: 'Hand Diamond-Tufting & Finishing',
      desc: 'Our Chesterfield and fluted lines are folded by hand without slitting the textile grain. Each tuft button is anchored through the timber frame under uniform artisan tension.',
      icon: Box,
    },
  ];

  return (
    <div className="min-h-screen bg-platinum py-16 md:py-24 text-graphite font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Hero Banner */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">
            Bodla Workshop &amp; Atelier Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-graphite">
            The Craft of Enduring Luxury
          </h1>
          <p className="text-sm sm:text-base text-slate-dark leading-relaxed max-w-xl mx-auto">
            Behind every Pradeep Furniture piece lies generational woodwork expertise. We operate full-scale carpentry, cushion carving, and tailoring workshops in Agra—building heirloom furniture meant to last a lifetime.
          </p>
        </div>

        {/* 6 Step Workshop Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="bg-white rounded-lg p-8 border border-platinum-border shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif font-medium text-3xl text-slate-muted/40">{st.num}</span>
                    <div className="w-10 h-10 rounded-md bg-platinum-soft flex items-center justify-center text-graphite border border-platinum-border">
                      <Icon className="w-5 h-5 text-slate-muted" />
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-medium text-graphite mb-3">{st.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">{st.desc}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-platinum-border text-xs text-slate-muted font-medium flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-graphite" />
                  <span>QC Inspected at every stage</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quality Assurance & Factory Visit CTA */}
        <div className="bg-graphite-deep rounded-lg text-platinum p-8 sm:p-12 lg:p-16 border border-slate-border shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-silver">Open Atelier Policy</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium">
              Inspect Your Raw Timber Skeleton In Person
            </h2>
            <p className="text-sm text-slate-silver leading-relaxed">
              We invite clients and architects to visit our Bodla manufacturing compound during production. Inspect the solid teakwood framing and test the foam densities before the upholstery is closed.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/consultation"
              className="px-7 py-3.5 rounded-md bg-platinum hover:bg-white text-graphite font-medium text-xs uppercase tracking-widest text-center transition-colors shadow-sm"
            >
              Book Workshop Tour
            </Link>
            <Link
              href="/custom-design"
              className="px-7 py-3.5 rounded-md bg-graphite hover:bg-graphite-hover text-white font-medium text-xs uppercase tracking-widest text-center border border-slate-border transition-colors"
            >
              Commission Custom Piece
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
