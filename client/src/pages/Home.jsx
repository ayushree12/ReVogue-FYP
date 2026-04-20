import React, { useEffect, useMemo, useState } from 'react';
import { fetchProducts } from '../api/products';
import ProductCard from '../components/ProductCard';

const stats = [
  { label: 'Verified sellers', value: '120+' },
  { label: 'Pieces curated', value: '3,400+' },
  { label: 'Orders delivered', value: '18k+' }
];

const features = [
  {
    title: 'Curated sustainability',
    detail: 'Every drop is vetted by our team, verified for story and condition, and paired with vendor storytelling.'
  },
  {
    title: 'Role-aware flows',
    detail: 'Admins, vendors, and shoppers each see a tailored dashboard that surfaces the right actions immediately.'
  },
  {
    title: 'Transparent commerce',
    detail: 'Track every order, message vendors, and inspect verification badges before placing a purchase.'
  }
];

const categories = [
  { name: 'Menswear', description: 'Heritage streetwear, workwear, and breathable layers.', image: '/Men.jpg' },
  { name: 'Womenswear', description: 'Indo-Western silhouettes, handloom weaves, and lounge fits.', image: '/Women.jpg' },
  { name: 'Accessories', description: 'Jewelry, bags, and curated trinkets with provenance.', image: '/accessories.png' },
  { name: 'Footwear', description: 'Resoled classics and new-era sneakers restored in-house.', image: '/Footwear.jpg' }
];

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    fetchProducts({ limit: 8 }).then((data) => {
      if (isMounted) {
        setProducts(data.products || []);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const featured = useMemo(() => products.slice(0, 5), [products]);
  const recent = useMemo(() => products.slice(5, 8), [products]);

  return (
    <div className="space-y-24 pb-20 bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden rounded-[2.5rem] bg-slate-50 mx-4 mt-4 shadow-sm border border-slate-200">
        {/* Left Side Content */}
        <div className="w-full lg:w-[55%] px-8 md:px-16 lg:px-20 z-10 py-12 relative">
          <div className="space-y-8 max-w-2xl relative">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-[6rem] font-serif text-black tracking-tight leading-none">
                REVOGUE
              </h1>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-slate-700 leading-snug">
                Curated Thrift,<br />
                Elevated.
              </h2>
            </div>
            
            <p className="text-lg text-slate-500 font-light leading-relaxed max-w-lg">
              Discover verified, authentic vintage fashion. Admins simplify approvals, vendors curate catalogues, and shoppers enjoy transparent provenance in a premium ecosystem.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-6">
              <a
                href="/collections"
                className="group relative inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition-all hover:bg-slate-800 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Browse Collections
              </a>
              <a
                href="/seller/verification"
                className="inline-flex items-center gap-2 rounded-full border border-black bg-transparent px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-black transition-all hover:bg-black hover:text-white"
              >
                Become a Vendor
              </a>
            </div>
            
            <div className="pt-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-slate-400" />
              <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Minimal Waste · Maximum Trust</span>
            </div>
          </div>
        </div>
        
        {/* Right Side Image */}
        <div className="hidden lg:block absolute right-0 top-0 w-[45%] h-full p-4 pl-0">
          <div className="w-full h-full rounded-[2rem] overflow-hidden relative bg-slate-200">
            <img
              src="/Women.jpg"
              alt="Vintage Fashion Editorial"
              className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-24">
        {/* Features Minimal */}
        <section className="grid gap-x-8 gap-y-12 md:grid-cols-3">
          {features.map((feature, i) => (
            <article key={feature.title} className="group relative border-t border-slate-200 pt-8">
              <div className="mb-4 text-sm font-bold tracking-widest text-slate-400">
                0{i + 1}
              </div>
              <h3 className="text-xl font-bold tracking-tight text-black">{feature.title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed font-light">{feature.detail}</p>
            </article>
          ))}
        </section>

        {/* Categories / Stories */}
        <section className="space-y-12 py-10">
          <div className="flex flex-col gap-4 text-center items-center">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Discover</span>
            <h2 className="text-5xl font-bold tracking-tight text-black">Curated Series</h2>
            <p className="text-lg text-slate-600 max-w-2xl font-light">
              Each piece is hand-picked for craftsmanship and condition. Tap into collections from trusted vendor partners.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <a
                href={`/collections?category=${category.name.toLowerCase()}`}
                key={category.name}
                className="group relative overflow-hidden rounded-[2.5rem] p-8 min-h-[450px] flex flex-col justify-end transition-all duration-700 shadow-lg hover:shadow-2xl hover:-translate-y-2 border border-slate-200 hover:border-black"
              >
                {/* Background Image Layer */}
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
                
                {/* Permanent Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 transition-colors duration-700 group-hover:from-black/95 group-hover:via-black/40" />
                
                <div className="space-y-2 relative z-10 pt-4 translate-y-6 transition-transform duration-500 group-hover:translate-y-0">
                  <h3 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">{category.name}</h3>
                  <p className="text-sm text-slate-200 font-light leading-relaxed font-medium line-clamp-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">{category.description}</p>
                  
                  <div className="pt-4 relative z-10 flex items-center gap-3">
                    <span className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-white">
                      Explore
                    </span>
                    <span className="opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 text-white">
                      →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Drop Section */}
        <section className="space-y-10">
          <div className="flex items-end justify-between border-b border-black pb-6">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">The Drop</p>
              <h2 className="text-4xl font-bold tracking-tight text-black">Featured Archive</h2>
            </div>
            <a href="/products" className="hidden md:inline-flex text-sm font-semibold uppercase tracking-widest text-slate-600 transition-colors hover:text-black border-b border-transparent hover:border-black pb-1">
              View Collection
            </a>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {featured.length ? (
              featured.map((product) => <ProductCard key={product._id} product={product} />)
            ) : (
              <p className="text-slate-500 font-light col-span-full py-12 text-center border border-dashed border-slate-300 rounded-3xl">Preparing the next drop. Check back shortly.</p>
            )}
          </div>
        </section>

        {/* Fresh Arrivals Section */}
        <section className="space-y-10">
          <div className="flex items-end justify-between border-b border-black pb-6">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">New Arrivals</p>
              <h2 className="text-4xl font-bold tracking-tight text-black">Recently Vetted</h2>
            </div>
            <a href="/collections" className="hidden md:inline-flex text-sm font-semibold uppercase tracking-widest text-slate-600 transition-colors hover:text-black border-b border-transparent hover:border-black pb-1">
              All Additions
            </a>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {recent.length ? (
              recent.map((product) => <ProductCard key={product._id} product={product} />)
            ) : (
              <p className="text-slate-500 font-light col-span-full py-12 text-center border border-dashed border-slate-300 rounded-3xl">Updating catalogue. Stay tuned.</p>
            )}
          </div>
        </section>

        {/* Waitlist Callout */}
        <section className="relative overflow-hidden rounded-[3rem] bg-white border border-slate-200 px-8 py-20 lg:px-20 lg:py-24 shadow-xl">
          <div className="relative z-10 grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h3 className="text-4xl lg:text-5xl font-bold tracking-tight text-black leading-tight">
                Scale your sustainable <br />
                <span className="text-slate-500">wardrobe.</span>
              </h3>
              <p className="text-lg text-slate-600 max-w-md font-light">
                Join our next phase to unlock dedicated vendor dashboards, direct messaging, and role-aware order tracking. 
              </p>
            </div>
            <div className="flex lg:justify-end">
              <button className="rounded-full bg-black px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white transition-transform hover:scale-105 hover:bg-slate-800 shadow-xl">
                Join the Waitlist
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
