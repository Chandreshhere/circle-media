// 8 services — mirrors the home page WhatWeDo puzzle and the Services.jsx
// carousel category list, so /services reads with the same vocabulary as
// the home page.
export const services = [
  {
    id: "01",
    title: "Brand Consultation",
    tagline: "Strategy that uncovers your story and shapes a brand built to last.",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=900&q=80",
    copy: "Strategy sessions that uncover your story, sharpen your positioning, and shape a brand built to outlast trends — not chase them."
  },
  {
    id: "02",
    title: "Influencer Marketing",
    tagline: "Creators matched to audience, briefed for impact, measured against real outcomes.",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=900&q=80",
    copy: "Creators matched to the right audience, briefed for the right message, measured against real outcomes — not vanity metrics."
  },
  {
    id: "03",
    title: "Branding & Content Planning",
    tagline: "Identity systems and editorial calendars with one unmistakable voice.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
    copy: "Identity systems and editorial calendars that turn your voice into a steady publishing rhythm across every channel — even when no one is watching."
  },
  {
    id: "04",
    title: "Social Media Marketing",
    tagline: "A daily presence with a point of view — content, community, conversion.",
    image: "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?auto=format&fit=crop&w=900&q=80",
    copy: "A daily presence with a point of view — content, community, and conversion, all moving in the same direction. Always-on, accountable, and engineered for compounding."
  },
  {
    id: "05",
    title: "Website Development",
    tagline: "Fast, accessible, considered websites that scale with the business.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
    copy: "Fast, accessible, considered websites — built to convert today and crafted to scale as your business grows. Design systems, headless stacks, performance budgets."
  },
  {
    id: "06",
    title: "E-Commerce Listings & Optimisation",
    tagline: "Catalogue, copy and storefront tuning that lifts discoverability and lifetime value.",
    image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=900&q=80",
    copy: "Catalogue copy, imagery, and storefront tuning that lifts discoverability, add-to-cart, and lifetime value across Amazon, Flipkart, Shopify and beyond."
  },
  {
    id: "07",
    title: "Performance Marketing (Google & Meta Ads)",
    tagline: "Paid media built around CAC, ROAS and the funnel — growth, not impressions.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    copy: "Paid media built around CAC, ROAS, and the funnel — campaigns that earn you growth, not just impressions. Daily optimisation, weekly reporting, monthly compounding."
  },
  {
    id: "08",
    title: "SEO / SEM",
    tagline: "Organic and paid search working as one engine — long game and short.",
    image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=900&q=80",
    copy: "Organic visibility paired with paid search — the long game and the short game, working as one engine. Technical audits, topical authority and SERP-ready content."
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
    quote: "The only agency we have worked with that speaks brand and performance in the same sentence — without flinching.",
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
  { name: "Park Avenue",           logo: "/logos/park-avenue.jpg" },
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

export const navLinks = [
  { to: "/", label: "Index", num: "01" },
  { to: "/services", label: "Services", num: "02" },
  { to: "/work", label: "Work", num: "03" },
  { to: "/about", label: "Studio", num: "04" },
  { to: "/contact", label: "Contact", num: "05" }
];
