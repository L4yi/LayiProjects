import iphoneImg from "../assets/all-images/product-images/iphone-13.png";
import jordanImg from "../assets/all-images/product-images/nike-air-jordan.png";
import tshirtImg from "../assets/all-images/product-images/tshirt.png";
import bagImg from "../assets/all-images/product-images/cross-bag.png";
import headphonesImg from "../assets/all-images/product-images/headphones.png";
import smartwatchImg from "../assets/all-images/product-images/smartwatch.png";

export const STORE_CATEGORIES = [
    {
        id: "mobile-devices",
        code: "#CAT-101",
        name: "Mobile Devices & Phones",
        title: "MOBILE DEVICES",
        icon: "bi bi-phone",
        badge: "TradeFlow Tech",
        itemCount: "15 Models",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
        status: "ACTIVE",
        description: "Latest flagship smartphones, tablets, and 5G mobile handsets."
    },
    {
        id: "footwear",
        code: "#CAT-102",
        name: "Footwear & Shoes",
        title: "FOOTWEAR & SHOES",
        icon: "bi bi-boot",
        badge: "Official Nike Store",
        itemCount: "28 Styles",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
        status: "ACTIVE",
        description: "Premium sneakers, basketball footwear, running shoes, and boots."
    },
    {
        id: "apparel",
        code: "#CAT-103",
        name: "Apparel & Clothing",
        title: "APPAREL & CLOTHING",
        icon: "bi bi-person-standing",
        badge: "Streetwear Hub",
        itemCount: "45 Items",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
        status: "ACTIVE",
        description: "Quality streetwear, branded graphic tees, hoodies, and jackets."
    },
    {
        id: "accessories",
        code: "#CAT-104",
        name: "Bags & Accessories",
        title: "BAGS & ACCESSORIES",
        icon: "bi bi-bag",
        badge: "Luxury Leather",
        itemCount: "20 Designs",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
        status: "ACTIVE",
        description: "Handcrafted crossbody bags, premium backpacks, and leather wallets."
    },
    {
        id: "audio",
        code: "#CAT-105",
        name: "Audio Devices & Sound",
        title: "AUDIO & SOUND",
        icon: "bi bi-headphones",
        badge: "Sound Pro",
        itemCount: "18 Models",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        status: "ACTIVE",
        description: "Active noise-cancelling wireless headphones, earbuds, and speakers."
    },
    {
        id: "wearable",
        code: "#CAT-106",
        name: "Wearable Technology",
        title: "WEARABLE TECH",
        icon: "bi bi-smartwatch",
        badge: "Smart Fitness",
        itemCount: "14 Devices",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        status: "ACTIVE",
        description: "Health monitoring smartwatches, fitness trackers, and smart bands."
    }
];

export const STORE_PRODUCTS = [
    {
        id: "iphone-13",
        code: "#PRD-001",
        categoryId: "mobile-devices",
        categoryName: "Mobile Devices",
        name: "Apple iPhone 13 Pro Max",
        subtitle: "256GB - Sierra Blue / 5G Super Retina XDR",
        brand: "Apple",
        rating: 5.0,
        reviewsCount: 142,
        price: 850000,
        oldPrice: 920000,
        discountPercent: 8,
        inStock: 24,
        status: "ACTIVE",
        image: iphoneImg,
        express: true,
        description: "The iPhone 13 Pro Max features the biggest Pro camera system upgrade ever, Super Retina XDR display with ProMotion for a faster, more responsive feel, and lightning-fast A15 Bionic chip with durable ceramic shield front.",
        features: [
            "6.7-inch Super Retina XDR display with ProMotion",
            "Cinematic mode adds shallow depth of field and shifts focus automatically in your videos",
            "Pro camera system with new 12MP Telephoto, Wide, and Ultra Wide cameras",
            "A15 Bionic chip with 5-core GPU for lightning-fast performance",
            "Up to 28 hours of video playback, the best battery life ever in an iPhone"
        ]
    },
    {
        id: "samsung-s24",
        code: "#PRD-002",
        categoryId: "mobile-devices",
        categoryName: "Mobile Devices",
        name: "Samsung Galaxy S24 Ultra 5G",
        subtitle: "512GB - Titanium Gray / Galaxy AI Built-in",
        brand: "Samsung",
        rating: 4.9,
        reviewsCount: 94,
        price: 1450000,
        oldPrice: 1580000,
        discountPercent: 8,
        inStock: 18,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 6.8-inch flat display. Unleash whole new levels of creativity, productivity and possibility starting with the most important device in your life.",
        features: [
            "Armor up with titanium durable shield built right into the frame",
            "Corning Gorilla Armor helps protect your screen from scratches",
            "Built-in S Pen writes new chapters with precision",
            "200MP camera captures details that rival reality"
        ]
    },
    {
        id: "google-pixel-8",
        code: "#PRD-003",
        categoryId: "mobile-devices",
        categoryName: "Mobile Devices",
        name: "Google Pixel 8 Pro",
        subtitle: "128GB - Obsidian Black / Google Tensor G3",
        brand: "Google",
        rating: 4.8,
        reviewsCount: 76,
        price: 780000,
        oldPrice: 840000,
        discountPercent: 7,
        inStock: 12,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
        express: false,
        description: "Pixel 8 Pro is the all-pro phone engineered by Google. It has refined finishes, a polished aluminum frame, and matte back glass. With Google AI, you can do even more throughout your day.",
        features: [
            "Super Actua display is Pixel's brightest ever",
            "Fully upgraded cameras and never-before-seen editing tools",
            "Google Tensor G3 chip is custom-designed with Google AI",
            "Temperature sensor lets you quickly measure object temperatures"
        ]
    },
    {
        id: "nike-air-jordan",
        code: "#PRD-004",
        categoryId: "footwear",
        categoryName: "Footwear & Shoes",
        name: "Nike Air Jordan 1 Retro High OG",
        subtitle: "University Blue / White-Black Classic Heritage",
        brand: "Nike",
        rating: 5.0,
        reviewsCount: 218,
        price: 125000,
        oldPrice: 145000,
        discountPercent: 14,
        inStock: 15,
        status: "ACTIVE",
        image: jordanImg,
        express: true,
        description: "Familiar colors, applied with a fresh approach. The Air Jordan 1 Retro High OG features genuine leather, comfortable cushioning, and iconic design details.",
        features: [
            "Genuine leather upper offers durability and structure",
            "Encapsulated Air-Sole unit provides lightweight cushioning",
            "Solid rubber outsole with flex grooves for traction on various surfaces",
            "Perforations over toe for breathability"
        ]
    },
    {
        id: "nike-air-max-270",
        code: "#PRD-005",
        categoryId: "footwear",
        categoryName: "Footwear & Shoes",
        name: "Nike Air Max 270 React",
        subtitle: "Triple Black / Cushion Running Edition",
        brand: "Nike",
        rating: 4.7,
        reviewsCount: 88,
        price: 85000,
        oldPrice: 98000,
        discountPercent: 13,
        inStock: 30,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "The Nike Air Max 270 React delivers unmatched, all-day comfort in a bold silhouette. Fresh colors and super-soft cushioning combine for eye-catching style.",
        features: [
            "Nike React technology delivers an extremely smooth ride",
            "Max Air 270 unit provides responsive cushioning",
            "Lightweight, layered no-sew materials create a modern aesthetic",
            "Full rubber toe-to-heel coverage for traction and durability"
        ]
    },
    {
        id: "adidas-ultraboost",
        code: "#PRD-006",
        categoryId: "footwear",
        categoryName: "Footwear & Shoes",
        name: "Adidas Ultraboost Light Running",
        subtitle: "Core Black / Cloud White Performance",
        brand: "Adidas",
        rating: 4.8,
        reviewsCount: 104,
        price: 110000,
        oldPrice: 125000,
        discountPercent: 12,
        inStock: 19,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=600&q=80",
        express: false,
        description: "Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever. The magic lies in the Light BOOST midsole, a new generation of adidas BOOST.",
        features: [
            "Regular fit with lace closure",
            "adidas PRIMEKNIT+ textile upper",
            "Light BOOST cushioning system",
            "Continental Better Rubber outsole"
        ]
    },
    {
        id: "tradeflow-graphic-tee",
        code: "#PRD-007",
        categoryId: "apparel",
        categoryName: "Apparel & Clothing",
        name: "TradeFlow Heritage Heavyweight Tee",
        subtitle: "Vintage Washed Black / 240 GSM Pure Cotton",
        brand: "TradeFlow Apparel",
        rating: 4.9,
        reviewsCount: 62,
        price: 18500,
        oldPrice: 22000,
        discountPercent: 16,
        inStock: 50,
        status: "ACTIVE",
        image: tshirtImg,
        express: true,
        description: "Constructed from 240 GSM organic combed cotton, this heavyweight boxy tee provides an elevated structured silhouette that holds its shape wash after wash.",
        features: [
            "100% combed ringspun cotton",
            "Reinforced crewneck ribbing with twin-needle stitch",
            "Drop-shoulder modern streetwear drape",
            "Pre-shrunk fabric to minimize shrinkage"
        ]
    },
    {
        id: "crossbody-bag",
        code: "#PRD-008",
        categoryId: "accessories",
        categoryName: "Bags & Accessories",
        name: "Urban Explorer Crossbody Bag",
        subtitle: "Matte Black / Waterproof Cordura Ballistic Nylon",
        brand: "Solara Gear",
        rating: 5.0,
        reviewsCount: 115,
        price: 28000,
        oldPrice: 35000,
        discountPercent: 20,
        inStock: 35,
        status: "ACTIVE",
        image: bagImg,
        express: true,
        description: "Engineered for daily urban commuters, this minimalist sling bag delivers quick-access compartments, weather-sealed YKK zippers, and adjustable ergonomic strap.",
        features: [
            "1680D Cordura ballistic nylon exterior",
            "YKK AquaGuard weather-resistant zippers",
            "Magnetic quick-release Fidlock chest buckle",
            "Soft fleece-lined pocket for smartphones and sunglasses"
        ]
    },
    {
        id: "headphones",
        code: "#PRD-009",
        categoryId: "audio",
        categoryName: "Audio Devices & Sound",
        name: "TradeFlow Pro ANC Wireless Headphones",
        subtitle: "Graphite Silver / 40h Battery & Spatial Audio",
        brand: "TradeFlow Audio",
        rating: 4.9,
        reviewsCount: 173,
        price: 65000,
        oldPrice: 85000,
        discountPercent: 24,
        inStock: 22,
        status: "ACTIVE",
        image: headphonesImg,
        express: true,
        description: "Industry-leading active noise cancellation paired with custom 40mm titanium drivers provides concert-hall acoustics with crystal-clear vocal fidelity.",
        features: [
            "Hybrid active noise cancellation with transparency pass-through",
            "Up to 40 hours continuous playback on a single charge",
            "Multi-point Bluetooth 5.3 instant device switching",
            "Memory-foam leather ear cushions for prolonged listening comfort"
        ]
    },
    {
        id: "smartwatch",
        code: "#PRD-010",
        categoryId: "wearable",
        categoryName: "Wearable Technology",
        name: "Apex Ultra GPS Fitness Smartwatch",
        subtitle: "Space Titanium / ECG, SpO2 & Sapphire Glass",
        brand: "Apex Tech",
        rating: 5.0,
        reviewsCount: 89,
        price: 145000,
        oldPrice: 175000,
        discountPercent: 17,
        inStock: 16,
        status: "ACTIVE",
        image: smartwatchImg,
        express: true,
        description: "Precision-machined titanium case housing an ultra-bright AMOLED display, dual-frequency multi-satellite GPS, and clinical-grade cardiovascular biometric tracking.",
        features: [
            "Grade 5 aerospace titanium bezel and sapphire crystal glass",
            "Dual-band L1 & L5 GPS for high-density urban precision",
            "Continuous ECG monitoring, heart-rate variability and blood oxygen",
            "Up to 14 days standard battery life with rapid solar assist"
        ]
    }
];

export const WISHLIST_ITEMS = [
    {
        id: "nike-air-jordan",
        name: "Nike Air Jordan 1 Retro High OG University Blue",
        price: 125000,
        oldPrice: 145000,
        discountPercent: 14,
        image: jordanImg
    },
    {
        id: "headphones",
        name: "TradeFlow Pro ANC Wireless Headphones",
        price: 65000,
        oldPrice: 85000,
        discountPercent: 24,
        image: headphonesImg
    }
];

export const INITIAL_CART_ITEMS = [
    {
        id: "iphone-13",
        name: "Apple iPhone 13 Pro Max - 256GB Sierra Blue",
        variation: "Variation: Sierra Blue / 256GB",
        price: 850000,
        oldPrice: 920000,
        discountPercent: 8,
        quantity: 1,
        inStock: true,
        express: true,
        image: iphoneImg
    }
];

export const STAFFS_DATA = [];
export const CUSTOMERS_DATA = [];
export const CURRENT_USER = {
    name: "Customer Member",
    initials: "CM",
    email: "customer@example.com",
    role: "Customer",
    department: "Retail Commerce & Shopping",
    lastLogin: "Just now"
};
