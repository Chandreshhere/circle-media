// 6 services — mirrors the home page WhatWeDo puzzle, so /services reads
// with the same vocabulary as the home page. Each service also names the
// platform / tech logo we run it on, rendered as a chip after the copy on
// the Services page.
export const services = [
  {
    id: "01",
    title: "Branding & Content Planning",
    tagline: "Identity systems and editorial calendars with one unmistakable voice.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
    copy: "Identity systems and editorial calendars that turn your voice into a steady publishing rhythm across every channel, even when no one is watching.",
    platform: { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" }
  },
  {
    id: "02",
    title: "Social Media & Performance Marketing",
    tagline: "Content, community and paid media run as one engine: daily presence, accountable growth.",
    image: "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?auto=format&fit=crop&w=900&q=80",
    copy: "A daily social presence paired with paid media built around CAC, ROAS and the funnel — content, community and campaigns moving in the same direction. Always-on, accountable, engineered for compounding.",
    platform: { name: "Meta Ads", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" }
  },
  {
    id: "03",
    title: "Website Development",
    tagline: "Fast, accessible, considered websites that scale with the business.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
    copy: "Fast, accessible, considered websites, built to convert today and crafted to scale as your business grows. Design systems, headless stacks, performance budgets.",
    platform: { name: "Shopify", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" }
  },
  {
    id: "04",
    title: "E-Commerce Listings & Optimisation",
    tagline: "Catalogue, copy and storefront tuning that lifts discoverability and lifetime value.",
    image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=900&q=80",
    copy: "Catalogue copy, imagery, and storefront tuning that lifts discoverability, add-to-cart, and lifetime value across Amazon, Flipkart, Shopify and beyond.",
    platform: { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" }
  },
  {
    id: "05",
    title: "SEO / SEM",
    tagline: "Organic and paid search working as one engine: long game and short.",
    image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=900&q=80",
    copy: "Organic visibility paired with paid search: the long game and the short game, working as one engine. Technical audits, topical authority and SERP-ready content.",
    platform: { name: "Google Ads", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Ads_logo.svg" }
  },
  {
    id: "06",
    title: "Production Shoot",
    tagline: "On-location and studio shoots briefed to the channel, captured for performance.",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80",
    copy: "Studio and on-location shoots — products, lifestyle, brand films — briefed to the channel, captured for the brief, and edited so every frame earns its place.",
    platform: { name: "Adobe Premiere", logo: "https://upload.wikimedia.org/wikipedia/commons/2/22/Adobe_Premiere_Pro_CC_icon.svg" }
  }
];

// Mirrors the categories shown in the home page Services.jsx coverflow.
export const carouselItems = [
  {
    id: "01",
    title: "Instagram Posts",
    tagline: "Single-frame creatives engineered to stop the scroll.",
    tags: ["single posts, typography, campaign design"],
    url: "https://www.marketingbycircle.com/instagramposts"
  },
  {
    id: "02",
    title: "Instagram Stories",
    tagline: "Vertical narratives that keep audiences swiping forward.",
    tags: ["stories, vertical format, creative curation"],
    url: "https://www.marketingbycircle.com/instgramstories"
  },
  {
    id: "03",
    title: "Curated Feeds",
    tagline: "Cohesive grids that read like a magazine cover.",
    tags: ["grid design, visual identity, feed curation"],
    url: "https://www.marketingbycircle.com/instagramfeed"
  },
  {
    id: "04",
    title: "Reels & Short Video",
    tagline: "Short-form video built for the algorithm.",
    tags: ["reels, motion, edit"],
    url: "https://www.marketingbycircle.com/reels"
  },
  {
    id: "05",
    title: "Brand Identity",
    tagline: "Identity systems with a voice you'll recognise anywhere.",
    tags: ["identity, logo, system"],
    url: "https://www.marketingbycircle.com/branding"
  },
  {
    id: "06",
    title: "Analytics Dashboards",
    tagline: "Reporting frames that make growth measurable at a glance.",
    stats: [
      { v: "20+", k: "Clients" },
      { v: "5+",  k: "Social Handles" }
    ],
    services: ["META Ads", "Google Ads", "Analytics"],
    tags: ["meta ads, google ads, analytics"],
    url: "https://www.marketingbycircle.com/analytics"
  }
];

export const archive = [
  { name: "Shift in Design", year: "2024", images: ["img1"] },
  { name: "Evelyn", year: "2021", images: ["img2"] },
  { name: "Echo", year: "2022", images: ["img3", "img4", "img5"] },
  { name: "Beyond Borders", year: "2024", images: ["img6", "img7", "img8", "img9"] },
  { name: "Artifact", year: "2020", images: ["img10", "img11", "img12"] },
  { name: "Legacy Showcase", year: "2021", images: ["img13", "img14", "img15"] },
  { name: "Waveform", year: "2019", images: ["img16", "img17", "img18", "img19"] },
  { name: "Axis", year: "2024", images: ["img20", "img21", "img22", "img23"] },
  { name: "Capsule", year: "2023", images: ["img24", "img25", "img26"] },
  { name: "Cobalt Collective", year: "2018", images: ["img27", "img28", "img29", "img30"] },
  { name: "Nightfall", year: "2021", images: ["img31", "img32", "img33"] },
  { name: "Sprout", year: "2017", images: ["img34", "img35"] }
];

export const testimonials = [
  {
    quote: "Circle treats our growth like their own. The creative output is relentless and the numbers keep moving in the right direction.",
    author: "Priya Bindal",
    role: "Head of Brand, Investitute"
  },
  {
    quote: "The only agency we have worked with that speaks brand and performance in the same sentence, without flinching.",
    author: "Marco de Vries",
    role: "Founder, Northbound"
  },
  {
    quote: "They shipped in three weeks what our previous team could not deliver in six months.",
    author: "Hana Okafor",
    role: "CMO, Halcyon Hotels"
  }
];

export const clients = [
  { name: "Park Avenue",           logo: "/logos/park-avenue.png" },
  { name: "Pro Brew Republic",     logo: "/logos/pro-brew-republic.jpeg" },
  { name: "Madmix",                logo: "/logos/madmix.png" },
  { name: "Park Avenue Beer Shampoo", logo: "/logos/park-avenue-beer-shampoo.png" },
  { name: "CamPure",               logo: "/logos/campure.jpg" },
  { name: "Tushar Enterprises",    logo: "/logos/tushar.png" },
  { name: "Zawaa",                 logo: "/logos/zawaa.jpg" },
  { name: "Adam's Ale",            logo: "/logos/adams-ale.jpg" },
  { name: "Currygram",             logo: "/logos/currygram.png" },
  { name: "Exprto",                logo: "/logos/exprto.webp" },
  { name: "Investitute",           logo: "/logos/investitute.jpg" },
  { name: "Eduvest Connect",       logo: "/logos/eduvest-connect.png" },
  { name: "SRF",                   logo: "/logos/srf.png" },
  { name: "Outrider",              logo: "/logos/outrider.webp" },
  { name: "Swastik Habitates",     logo: "/logos/swastik.png" },
  { name: "Niket Mangal Group",    logo: "/logos/nm-group.png" },
];

/* Brands shown on the home-page honeycomb — a wider sample than before
   so the section feels like a real "trusted by" wall, but still short
   of the full 40+ list so the CTA into /brands has a reason to exist.
   18 entries fills four staggered rows (5+4+5+4) at the desktop row
   pattern. */
export const homeClients = [
  { name: "Park Avenue",                  logo: "/logos/park-avenue.png" },
  { name: "Adam's Ale",                   logo: "/logos/hospitality/1.png" },
  { name: "Agrawal Namkeen",              logo: "/logos/agrawal-namkeen.png", mod: "boost" },
  { name: "Madmix",                       logo: "/logos/fmcg/1.png" },
  { name: "DNS Hospitals",                logo: "/logos/healthcare/2.png" },
  // Row 2
  { name: "CamPure",                      logo: "/logos/home-kitchen/1.png" },
  { name: "Investitute",                  logo: "/logos/education/2.png" },
  { name: "Pro Brew Republic",            logo: "/logos/hospitality/3.png" },
  { name: "Urban Theka",                  logo: "/logos/hospitality/2.png" },
  // Row 3
  { name: "Zawaa",                        logo: "/logos/fmcg/3.png" },
  { name: "Round Table India",            logo: "/logos/management/1.png" },
  { name: "Conscious Food",               logo: "/logos/fmcg/2.png" },
  { name: "Swastik Habitates",            logo: "/logos/real-estate/2.png" },
  { name: "Currygram",                    logo: "/logos/fmcg/5.png" },
  // Row 4
  { name: "Eduvest Connect",              logo: "/logos/education/1.png" },
  { name: "FICCI Flo",                    logo: "/logos/management/5.png" },
  { name: "Park Avenue Beer Shampoo",     logo: "/logos/personal-care/2.png" },
  { name: "The Coffee Clique",            logo: "/logos/fmcg/7.png" },
];

/* Featured case-study brands shown on /brands. Each one renders as a
   card with the logo + the scope of work + a stand-out metric, so the
   page reads as "what we shipped" instead of just a wall of logos. */
export const featuredBrands = [
  {
    name: "Park Avenue",
    logo: "/logos/park-avenue.png",
    industry: "Fashion / Personal Care",
    scope: ["Branding", "Social Media", "Performance Ads", "E-commerce"],
    stat: { v: "4.2x", k: "Blended ROAS" },
    note: "Full-funnel campaigns + Amazon storefront, 18 months on retainer.",
    accent: "var(--c-pink)",
  },
  {
    name: "Adam's Ale",
    logo: "/logos/hospitality/1.png",
    industry: "Hospitality",
    scope: ["Brand Identity", "Website", "Social Media"],
    stat: { v: "+312%", k: "Organic reach" },
    note: "Identity refresh, content engine and an outlet-launch campaign.",
    accent: "var(--c-yellow)",
  },
  {
    name: "Agrawal Namkeen",
    logo: "/logos/agrawal-namkeen.png",
    industry: "FMCG / Snacks",
    scope: ["Listings", "Amazon Ads", "Quick-commerce"],
    stat: { v: "7.1x", k: "Amazon ROAS" },
    note: "Listings rebuild + Sponsored Products across 40+ SKUs.",
    accent: "var(--c-mint)",
  },
  {
    name: "DNS Hospitals",
    logo: "/logos/healthcare/2.png",
    industry: "Healthcare",
    scope: ["Performance Marketing", "Website", "Content"],
    stat: { v: "−42%", k: "Lead CPA" },
    note: "OPD lead engine — Meta + Google, with a new doctor-led content shelf.",
    accent: "var(--c-blue)",
  },
  {
    name: "CamPure",
    logo: "/logos/home-kitchen/1.png",
    industry: "Home & Kitchen",
    scope: ["E-commerce", "Brand Store", "Performance Ads"],
    stat: { v: "5.4x", k: "D2C ROAS" },
    note: "Shopify rebuild + Amazon brand store; sustained 6 months profitable.",
    accent: "var(--c-red)",
  },
  {
    name: "Investitute",
    logo: "/logos/education/2.png",
    industry: "Education",
    scope: ["Branding", "Social Media", "Lead Gen"],
    stat: { v: "2.6k", k: "Qualified leads / qtr" },
    note: "Brand system + always-on Meta and YouTube acquisition.",
    accent: "var(--c-pink)",
  },
];

/* Headline numbers shown above the featured-brand grid on /brands.
   These summarise the agency's footprint across the full client list,
   not a single account. */
export const brandsStats = [
  { v: "40",  sup: "+", k: "Brands served" },
  { v: "12",  sup: "+", k: "Industries" },
  { v: "800", sup: "+", k: "Campaigns shipped" },
  { v: "6",   sup: "yr", k: "On retainer (avg.)" },
];

/* What industries the brands span — drives the small pill row on the
   /brands page so visitors see the breadth at a glance. */
export const brandIndustries = [
  "FMCG", "Hospitality", "Healthcare", "Fashion",
  "Education", "Real Estate", "Home & Kitchen", "Personal Care",
  "Management", "Quick-commerce", "D2C",
];

export const navLinks = [
  { to: "/", label: "Index", num: "01" },
  { to: "/services", label: "Services", num: "02" },
  { to: "/work", label: "Work", num: "03" },
  { to: "/brands", label: "Brands", num: "04" },
  { to: "/about", label: "Studio", num: "05" },
  { to: "/contact", label: "Contact", num: "06" }
];
