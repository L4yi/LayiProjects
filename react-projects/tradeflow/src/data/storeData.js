// Shared Store Data for Admin & Customer Portals
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
    // 1. Mobile Devices & Phones
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
        oldPrice: 1600000,
        discountPercent: 9,
        inStock: 16,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity, and possibility starting with the most important device in your life.",
        features: [
            "6.8-inch Dynamic AMOLED 2X 120Hz display with Gorilla Armor",
            "200MP main sensor with 5x optical telephoto lens and Space Zoom",
            "Snapdragon 8 Gen 3 for Galaxy with ray tracing support",
            "Built-in S Pen stylus for effortless writing, sketching, and navigation",
            "5,000 mAh battery with 45W fast wired and wireless charging"
        ]
    },
    {
        id: "pixel-8-pro",
        code: "#PRD-003",
        categoryId: "mobile-devices",
        categoryName: "Mobile Devices",
        name: "Google Pixel 8 Pro",
        subtitle: "256GB - Obsidian Black / Tensor G3 & Best-in-class Camera",
        brand: "Google",
        rating: 4.8,
        reviewsCount: 68,
        price: 720000,
        oldPrice: 790000,
        discountPercent: 8,
        inStock: 20,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "Pixel 8 Pro is the all-pro phone engineered by Google; it's super fast, secure, and has an advanced camera system, temperature sensor, and innovative Google AI editing tools.",
        features: [
            "6.7-inch Super Actua display with 1-120Hz refresh rate",
            "Google Tensor G3 chip engineered specifically for advanced machine learning",
            "Triple rear camera setup with Magic Eraser and Best Take",
            "Built-in temperature sensor for measuring objects and ambient heat",
            "7 years of official OS and security updates directly from Google"
        ]
    },
    {
        id: "ipad-pro-m2",
        code: "#PRD-004",
        categoryId: "mobile-devices",
        categoryName: "Mobile Devices",
        name: "Apple iPad Pro 12.9\" M2 Chip",
        subtitle: "256GB - Space Gray / Liquid Retina XDR Mini-LED",
        brand: "Apple",
        rating: 4.9,
        reviewsCount: 110,
        price: 980000,
        oldPrice: 1100000,
        discountPercent: 11,
        inStock: 12,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "Astonishing performance with the M2 chip, advanced 12.9-inch Liquid Retina XDR display with ProMotion, superfast wireless connectivity, and Apple Pencil hover experience.",
        features: [
            "12.9-inch Liquid Retina XDR display with 1,600 nits peak brightness",
            "M2 chip with 8-core CPU and 10-core GPU for pro graphics",
            "Thunderbolt / USB 4 port for connecting high-speed storage and displays",
            "Face ID for secure biometric authentication and Apple Pay",
            "Four speaker audio and studio-quality five-microphone array"
        ]
    },

    // 2. Footwear & Shoes
    {
        id: "nike-air-jordan",
        code: "#PRD-005",
        categoryId: "footwear",
        categoryName: "Footwear",
        name: "Nike Air Jordan 1 Retro High OG",
        subtitle: "Classic University Blue / Leather High-Top",
        brand: "Nike",
        rating: 4.8,
        reviewsCount: 98,
        price: 125000,
        oldPrice: 145000,
        discountPercent: 14,
        inStock: 18,
        status: "ACTIVE",
        image: jordanImg,
        express: true,
        description: "Familiar yet always fresh, the iconic Air Jordan 1 is remastered for today's sneakerhead culture. Premium leather materials, comfortable cushioning, and classic design lines deliver timeless hoop aesthetic.",
        features: [
            "Genuine and synthetic leather upper for durability and premium look",
            "Encapsulated Nike Air-Sole unit provides lightweight cushioning",
            "Solid rubber outsole with deep flex grooves gives traction on a variety of surfaces",
            "Padded high-cut collar creates a secure, comfortable fit"
        ]
    },
    {
        id: "adidas-ultraboost",
        code: "#PRD-006",
        categoryId: "footwear",
        categoryName: "Footwear",
        name: "Adidas Ultraboost Light Running Shoes",
        subtitle: "Core Black & Cloud White / Continental Rubber Outsole",
        brand: "Adidas",
        rating: 4.9,
        reviewsCount: 84,
        price: 85000,
        oldPrice: 98000,
        discountPercent: 13,
        inStock: 25,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever. The magic lies in the Light BOOST midsole, a new generation of adidas BOOST cushioning.",
        features: [
            "Light BOOST cushioning technology delivering 30% lighter foam",
            "Primeknit+ textile upper offering sock-like supportive fit",
            "Linear Energy Push system increases responsiveness with every stride",
            "Continental Better Rubber outsole provides superior grip on wet and dry ground"
        ]
    },
    {
        id: "timberland-boots",
        code: "#PRD-007",
        categoryId: "footwear",
        categoryName: "Footwear",
        name: "Timberland 6-Inch Premium Waterproof Boots",
        subtitle: "Wheat Nubuck Leather / Rustproof Hardware",
        brand: "Timberland",
        rating: 4.8,
        reviewsCount: 62,
        price: 145000,
        oldPrice: 165000,
        discountPercent: 12,
        inStock: 14,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80",
        express: false,
        description: "The original waterproof boot designed more than 40 years ago remains a best-seller today. Built with waterproof sealed construction, PrimaLoft insulation, and rugged lug outsole.",
        features: [
            "Premium waterproof full-grain nubuck leather from a silver-rated tannery",
            "Direct-attach, seam-sealed waterproof construction keeps feet dry",
            "400 grams of PrimaLoft insulation for essential warmth",
            "Anti-fatigue comfort technology provides all-day standing support"
        ]
    },
    {
        id: "new-balance-990",
        code: "#PRD-008",
        categoryId: "footwear",
        categoryName: "Footwear",
        name: "New Balance 990v5 Heritage Sneaker",
        subtitle: "Classic Castlerock Grey / ENCAP Midsole Cushioning",
        brand: "New Balance",
        rating: 4.7,
        reviewsCount: 53,
        price: 110000,
        oldPrice: 130000,
        discountPercent: 15,
        inStock: 19,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "Crafted without compromise, the 990v5 blends the perfect combination of cushioning and stability. Made with premium pigskin suede overlays and breathable mesh underlays.",
        features: [
            "ENCAP midsole technology provides maximum support and durability",
            "Dual-density collar foam offers superior ankle lockdown and cushioning",
            "Blown rubber outsole with reinforced strike paths",
            "Manufactured with premium heritage craftsmanship"
        ]
    },

    // 3. Apparel & Clothing
    {
        id: "solara-tshirt",
        code: "#PRD-009",
        categoryId: "apparel",
        categoryName: "Apparel",
        name: "Solara Oversized Streetwear T-Shirt",
        subtitle: "100% Combed Cotton / Charcoal Black",
        brand: "Solara",
        rating: 4.9,
        reviewsCount: 76,
        price: 18500,
        oldPrice: 24000,
        discountPercent: 23,
        inStock: 50,
        status: "ACTIVE",
        image: tshirtImg,
        express: true,
        description: "Heavyweight 240 GSM organic cotton streetwear graphic tee. Built with dropped shoulders, relaxed fit, and reinforced crewneck collar for long-lasting comfort and effortless modern style.",
        features: [
            "Heavyweight 240 GSM combed organic cotton",
            "Relaxed boxy streetwear silhouette with dropped shoulders",
            "High-density screen print resistant to fading and cracking",
            "Pre-shrunk fabric for perfect fit retention wash after wash"
        ]
    },
    {
        id: "cargo-pants",
        code: "#PRD-010",
        categoryId: "apparel",
        categoryName: "Apparel",
        name: "Tactical Relaxed Techwear Cargo Pants",
        subtitle: "Water-Repellent Ripstop Fabric / Military Khaki",
        brand: "UrbanTech",
        rating: 4.8,
        reviewsCount: 59,
        price: 28000,
        oldPrice: 35000,
        discountPercent: 20,
        inStock: 35,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "Utility meets modern streetwear. Built from durable stretch ripstop fabric with 6 multi-compartment utility pockets, adjustable ankle cuffs, and reinforced knee stitching.",
        features: [
            "Durable stretch cotton-ripstop blend for full range of motion",
            "6 functional snap-button and zipper utility pockets",
            "Elastic waistband with integrated nylon web belt",
            "Adjustable drawstring ankle cuffs for custom taper"
        ]
    },
    {
        id: "denim-jacket",
        code: "#PRD-011",
        categoryId: "apparel",
        categoryName: "Apparel",
        name: "Vintage Washed Denim Trucker Jacket",
        subtitle: "13.5oz Rigid Cotton Denim / Indigo Blue",
        brand: "Heritage Denim",
        rating: 4.7,
        reviewsCount: 43,
        price: 42000,
        oldPrice: 55000,
        discountPercent: 24,
        inStock: 22,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80",
        express: false,
        description: "Timeless trucker jacket constructed from premium 13.5oz vintage-washed indigo denim. Features branded metal shank buttons, pointed collar, and dual button-flap chest pockets.",
        features: [
            "100% heavy cotton denim with authentic vintage wash fade",
            "Classic boxy trucker cut designed for effortless layering",
            "Dual side welt pockets and dual buttoned chest flap pockets",
            "Adjustable waist tab closures at back hem"
        ]
    },
    {
        id: "hoodie-fleece",
        code: "#PRD-012",
        categoryId: "apparel",
        categoryName: "Apparel",
        name: "Heavyweight 400GSM Premium Fleece Hoodie",
        subtitle: "Double-Lined Hood & Kangaroo Pocket / Bone Off-White",
        brand: "Solara",
        rating: 4.9,
        reviewsCount: 88,
        price: 32000,
        oldPrice: 40000,
        discountPercent: 20,
        inStock: 40,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "Ultra-plush 400 GSM heavyweight brushed fleece hoodie. Designed with an oversized drop-shoulder silhouette, seamless double-layer hood without drawstrings, and deep kangaroo pocket.",
        features: [
            "400 GSM premium cotton fleece interior for superior insulation",
            "Custom double-stitched kangaroo front pouch",
            "Heavy 2x2 ribbed cuffs and waistband that resist stretching",
            "Clean aesthetic without external drawstring hardware"
        ]
    },

    // 4. Bags & Accessories
    {
        id: "cross-bag",
        code: "#PRD-013",
        categoryId: "accessories",
        categoryName: "Accessories",
        name: "Urban Leather Crossbody Bag",
        subtitle: "Water-Resistant PU Leather / Matte Black",
        brand: "UrbanCraft",
        rating: 4.7,
        reviewsCount: 64,
        price: 32000,
        oldPrice: 45000,
        discountPercent: 29,
        inStock: 15,
        status: "ACTIVE",
        image: bagImg,
        express: false,
        description: "Compact yet spacious everyday crossbody utility sling. Features multiple secure zippered compartments, key-clip tether, and an adjustable ergonomic shoulder strap for hands-free travel.",
        features: [
            "Waterproof matte PU leather with heavy-duty YKK zippers",
            "Dedicated padded compartment for phone and mini tablets",
            "Ergonomic reversible quick-release shoulder strap",
            "Concealed anti-theft back zip pocket"
        ]
    },
    {
        id: "travel-backpack",
        code: "#PRD-014",
        categoryId: "accessories",
        categoryName: "Accessories",
        name: "Waterproof Commuter Laptop Backpack 30L",
        subtitle: "16-Inch Padded Sleeve / Matte Charcoal",
        brand: "NordicGear",
        rating: 4.9,
        reviewsCount: 92,
        price: 38000,
        oldPrice: 48000,
        discountPercent: 21,
        inStock: 28,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "Engineered for daily urban commutes and weekend travel. Features a 180-degree TSA opening, waterproof coated nylon shell, dedicated 16-inch laptop compartment, and USB charging pass-through port.",
        features: [
            "30L expandable capacity with dedicated 16-inch laptop chamber",
            "Waterproof 900D ballistic nylon exterior with sealed zippers",
            "Breathable honey-comb padded back panel and luggage pass-through strap",
            "Hidden anti-theft pocket and quick-access magnetic top pocket"
        ]
    },
    {
        id: "leather-wallet",
        code: "#PRD-015",
        categoryId: "accessories",
        categoryName: "Accessories",
        name: "Full-Grain Leather RFID Bifold Wallet",
        subtitle: "Hand-Stitched Genuine Cowhide / Vintage Cognac",
        brand: "ArtisanLeathers",
        rating: 4.8,
        reviewsCount: 47,
        price: 15000,
        oldPrice: 22000,
        discountPercent: 32,
        inStock: 30,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "Handcrafted from 100% full-grain Italian cowhide leather that develops a rich patina over time. Includes built-in RFID blocking shield to safeguard bank cards from wireless skimming.",
        features: [
            "100% genuine full-grain vegetable-tanned cowhide leather",
            "Military-grade RFID blocking technology integrated in lining",
            "Holds up to 10 credit cards plus dual full-size banknote slots",
            "Reinforced contrast saddle stitching for lifetime durability"
        ]
    },
    {
        id: "sunglasses-polarized",
        code: "#PRD-016",
        categoryId: "accessories",
        categoryName: "Accessories",
        name: "Aviator Polarized UV400 Sunglasses",
        subtitle: "Stainless Steel Gold Frame / Emerald Green Tint",
        brand: "OpticCraft",
        rating: 4.6,
        reviewsCount: 38,
        price: 19500,
        oldPrice: 26000,
        discountPercent: 25,
        inStock: 25,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "Classic teardrop aviator silhouette engineered with lightweight stainless steel frame, silicone nose pads, and 9-layer polarized TAC lenses with 100% UV400 radiation protection.",
        features: [
            "9-layer TAC polarized lenses eliminating 99% of reflected glare",
            "UV400 certified protection blocking harmful UVA and UVB rays",
            "Corrosion-resistant stainless steel frame with spring-loaded hinges",
            "Includes hard leather protective case and microfiber cloth"
        ]
    },

    // 5. Audio Devices & Sound
    {
        id: "headphones",
        code: "#PRD-017",
        categoryId: "audio",
        categoryName: "Audio Devices",
        name: "TradeFlow Pro ANC Wireless Headphones",
        subtitle: "Active Noise Cancellation / 40Hr Battery",
        brand: "SoundWave",
        rating: 4.9,
        reviewsCount: 112,
        price: 65000,
        oldPrice: 85000,
        discountPercent: 24,
        inStock: 30,
        status: "ACTIVE",
        image: headphonesImg,
        express: true,
        description: "Experience pure sound immersion with hybrid active noise cancellation, custom 40mm neodymium dynamic drivers, ultra-soft memory foam earcups, and crystal clear call quality.",
        features: [
            "Advanced Hybrid Active Noise Cancellation up to -35dB",
            "High-Resolution Audio certified with 40mm dynamic drivers",
            "Up to 40 hours battery life on a single charge with fast charging",
            "Multi-point Bluetooth 5.3 connection for seamless device switching"
        ]
    },
    {
        id: "airpods-pro",
        code: "#PRD-018",
        categoryId: "audio",
        categoryName: "Audio Devices",
        name: "Apple AirPods Pro (2nd Gen)",
        subtitle: "Adaptive Audio & Spatial Sound / MagSafe USB-C Case",
        brand: "Apple",
        rating: 5.0,
        reviewsCount: 165,
        price: 285000,
        oldPrice: 320000,
        discountPercent: 11,
        inStock: 20,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "AirPods Pro (2nd generation) with USB-C deliver up to 2x more Active Noise Cancellation than the previous generation, with Transparency mode and personalized Spatial Audio.",
        features: [
            "H2 Apple silicon chip powers advanced audio performance and ANC",
            "Adaptive Audio dynamically blends Transparency and Noise Cancellation",
            "Personalized Spatial Audio with dynamic head tracking",
            "MagSafe charging case (USB-C) with speaker and lanyard loop"
        ]
    },
    {
        id: "jbl-charge",
        code: "#PRD-019",
        categoryId: "audio",
        categoryName: "Audio Devices",
        name: "JBL Charge 5 Waterproof Bluetooth Speaker",
        subtitle: "Original Pro Sound & Built-in Powerbank / Forest Green",
        brand: "JBL",
        rating: 4.8,
        reviewsCount: 78,
        price: 145000,
        oldPrice: 170000,
        discountPercent: 15,
        inStock: 18,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "Take the party with you no matter what the weather. The JBL Charge 5 speaker delivers bold JBL Original Pro Sound, with an optimized long excursion driver, separate tweeter and dual pumping JBL bass radiators.",
        features: [
            "Bold JBL Original Pro Sound with long-excursion driver and dual bass radiators",
            "IP67 waterproof and dustproof rating for pool and outdoor use",
            "Up to 20 hours of playtime on a single charge",
            "Built-in 7,500 mAh powerbank to charge mobile phones on the go"
        ]
    },
    {
        id: "sony-wh1000xm5",
        code: "#PRD-020",
        categoryId: "audio",
        categoryName: "Audio Devices",
        name: "Sony WH-1000XM5 Wireless Headphones",
        subtitle: "Industry Leading Noise Canceling / Platinum Silver",
        brand: "Sony",
        rating: 4.9,
        reviewsCount: 130,
        price: 395000,
        oldPrice: 440000,
        discountPercent: 10,
        inStock: 14,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "With two processors controlling eight microphones, Auto NC Optimizer for automatically optimizing noise cancellation, and a specially designed driver unit, WH-1000XM5 headphones rewrite the rules for distraction-free listening.",
        features: [
            "Industry-leading noise cancellation with 8 microphones and Integrated Processor V1",
            "Magnificent sound engineered with new 30mm precision-engineered driver",
            "Ultra-clear, noise-free calls with 4 beamforming microphones and AI noise reduction",
            "Up to 30-hour battery life with 3-minute quick charge for 3 hours playback"
        ]
    },

    // 6. Wearable Technology
    {
        id: "smartwatch",
        code: "#PRD-021",
        categoryId: "wearable",
        categoryName: "Wearable Tech",
        name: "Apex Smart Fitness Watch Pro",
        subtitle: "AMOLED Always-On / Heart & SpO2 Monitor",
        brand: "Apex",
        rating: 4.8,
        reviewsCount: 89,
        price: 45000,
        oldPrice: 60000,
        discountPercent: 25,
        inStock: 22,
        status: "ACTIVE",
        image: smartwatchImg,
        express: true,
        description: "Track health metrics with precision. Features vibrant 1.43-inch AMOLED display, 24/7 heart rate, blood oxygen (SpO2), sleep analysis, 100+ sports modes, and 5ATM water resistance.",
        features: [
            "1.43-inch HD AMOLED display with 466x466 resolution",
            "Comprehensive 24/7 heart rate, SpO2, and sleep tracking",
            "Built-in GPS with 100+ workout and sports tracking modes",
            "5ATM water resistance (swimming and shower proof)"
        ]
    },
    {
        id: "apple-watch-ultra",
        code: "#PRD-022",
        categoryId: "wearable",
        categoryName: "Wearable Tech",
        name: "Apple Watch Ultra 2 GPS + Cellular 49mm",
        subtitle: "Aerospace Titanium Case / Orange Alpine Loop",
        brand: "Apple",
        rating: 5.0,
        reviewsCount: 95,
        price: 950000,
        oldPrice: 1050000,
        discountPercent: 10,
        inStock: 10,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "The most rugged and capable Apple Watch. Powered by the S9 SiP with Double Tap gesture control, a 3,000-nit display, dual-frequency precision GPS, and up to 36 hours of battery life.",
        features: [
            "49mm aerospace-grade titanium case with sapphire front crystal",
            "Brilliant Always-On Retina display with 3,000 nits peak brightness",
            "Precision dual-frequency GPS (L1 and L5) for distance and pace accuracy",
            "100m water resistance and certified EN13319 for scuba diving down to 40m"
        ]
    },
    {
        id: "samsung-galaxy-watch",
        code: "#PRD-023",
        categoryId: "wearable",
        categoryName: "Wearable Tech",
        name: "Samsung Galaxy Watch 6 Classic 47mm",
        subtitle: "Rotating Bezel & BioActive Sensor / Stainless Steel",
        brand: "Samsung",
        rating: 4.8,
        reviewsCount: 72,
        price: 295000,
        oldPrice: 340000,
        discountPercent: 13,
        inStock: 16,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "Iconic rotating bezel design with advanced sleep coaching, body composition analysis, heart rhythm notifications, and personalized heart rate zones.",
        features: [
            "Physical rotating bezel with 1.5-inch Super AMOLED sapphire crystal screen",
            "Samsung BioActive Sensor for ECG, Blood Pressure, and Body Fat composition",
            "Advanced sleep coaching with in-depth sleep stage breakdown",
            "Wear OS Powered by Samsung with seamless Google Maps and Wallet integration"
        ]
    },
    {
        id: "fitbit-charge",
        code: "#PRD-024",
        categoryId: "wearable",
        categoryName: "Wearable Tech",
        name: "Fitbit Charge 6 Advanced Fitness Tracker",
        subtitle: "Built-in GPS, EDA & ECG Sensor / Obsidian Black",
        brand: "Fitbit",
        rating: 4.7,
        reviewsCount: 61,
        price: 165000,
        oldPrice: 190000,
        discountPercent: 13,
        inStock: 25,
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=600&q=80",
        express: true,
        description: "Give your routine a boost with Fitbit Charge 6. Track 40+ exercise modes, check your heart rhythm with the ECG app, manage stress with EDA scans, and navigate with Google Maps.",
        features: [
            "Up to 7 days battery life with color AMOLED touchscreen",
            "Electrocardiogram (ECG) app and EDA stress monitoring sensor",
            "Built-in GPS for real-time outdoor pace and distance tracking",
            "Google Maps navigation and Google Wallet contactless payments"
        ]
    }
];

export const STAFFS_DATA = [
    {
        id: "STF-01",
        name: "JONE COPPER",
        initials: "JC",
        avatarBg: "#143526",
        accentColor: "#38a169",
        role: "Senior Operations Lead",
        roleCategory: "STAFF",
        phone: "090 3427 5446",
        email: "jone.copper@tradeflow.com",
        status: "ACTIVE",
        lastLogin: "2026-09-02 08:30 AM"
    },
    {
        id: "STF-02",
        name: "OLADELE PHILIP",
        initials: "OP",
        avatarBg: "#2d5a43",
        accentColor: "#38a169",
        role: "Store Manager",
        roleCategory: "STAFF",
        phone: "090 3427 5446",
        email: "oladele.philip@tradeflow.com",
        status: "ACTIVE",
        lastLogin: "2026-09-01 04:15 PM"
    },
    {
        id: "STF-03",
        name: "KATHRYN MURPHY",
        initials: "KM",
        avatarBg: "#143526",
        accentColor: "#2d5a43",
        role: "Sales & Retail Lead",
        roleCategory: "STAFF",
        phone: "080 9898 7876",
        email: "kathryn.murphy@tradeflow.com",
        status: "ACTIVE",
        lastLogin: "2026-08-30 09:45 AM"
    },
    {
        id: "STF-04",
        name: "WADE WARREN",
        initials: "AA",
        avatarBg: "#2d5a43",
        accentColor: "#38a169",
        role: "Systems Specialist",
        roleCategory: "STAFF",
        phone: "081 2345 6789",
        email: "wade.warren@tradeflow.com",
        status: "ACTIVE",
        lastLogin: "2026-08-29 02:10 PM"
    },
    {
        id: "STF-05",
        name: "BROOKLYN SIMMONS",
        initials: "GO",
        avatarBg: "#143526",
        accentColor: "#38a169",
        role: "Customer Success Officer",
        roleCategory: "STAFF",
        phone: "082 3456 7890",
        email: "brooklyn.simmons@tradeflow.com",
        status: "INACTIVE",
        lastLogin: "2026-08-25 11:30 AM"
    },
    {
        id: "STF-06",
        name: "ALEXANDER WRIGHT",
        initials: "AW",
        avatarBg: "#143526",
        accentColor: "#38a169",
        role: "Store Manager",
        roleCategory: "STAFF",
        phone: "080 1122 3344",
        email: "alexander.wright@tradeflow.com",
        status: "ACTIVE",
        lastLogin: "2026-09-02 08:30 AM"
    },
    {
        id: "STF-07",
        name: "SOPHIA MARTINEZ",
        initials: "SM",
        avatarBg: "#2d5a43",
        accentColor: "#38a169",
        role: "Inventory Lead",
        roleCategory: "STAFF",
        phone: "081 5566 7788",
        email: "sophia.martinez@tradeflow.com",
        status: "ACTIVE",
        lastLogin: "2026-09-01 04:15 PM"
    },
    {
        id: "STF-08",
        name: "DANIEL STERLING",
        initials: "DS",
        avatarBg: "#38a169",
        accentColor: "#143526",
        role: "Customer Support",
        roleCategory: "STAFF",
        phone: "090 9988 7766",
        email: "daniel.sterling@tradeflow.com",
        status: "INACTIVE",
        lastLogin: "2026-08-28 11:20 AM"
    }
];

export const CUSTOMERS_DATA = [
    { id: "CUST-01", name: "Alexander Wright", initials: "AW", avatarBg: "#143526", email: "alexander.w@example.com", phone: "080 1122 3344", lastLogin: "2026-09-02 08:30 AM", status: "ACTIVE", role: "VIP Customer", address: "Abeokuta, Ogun State" },
    { id: "CUST-02", name: "Sophia Martinez", initials: "SM", avatarBg: "#2d5a43", email: "sophia.m@example.com", phone: "081 2233 4455", lastLogin: "2026-09-01 04:15 PM", status: "ACTIVE", role: "Customer", address: "Ibara, Abeokuta" },
    { id: "CUST-03", name: "Daniel Sterling", initials: "DS", avatarBg: "#38a169", email: "daniel.s@example.com", phone: "090 3344 5566", lastLogin: "2026-08-28 11:20 AM", status: "INACTIVE", role: "Retail Member", address: "Kuto, Abeokuta" },
    { id: "CUST-04", name: "Olivia Chen", initials: "OC", avatarBg: "#0284c7", email: "olivia.c@example.com", phone: "080 4455 6677", lastLogin: "2026-08-31 02:40 PM", status: "ACTIVE", role: "Wholesale Buyer", address: "Panseke, Abeokuta" },
    { id: "CUST-05", name: "Marcus Johnson", initials: "MJ", avatarBg: "#78350f", email: "marcus.j@example.com", phone: "081 5566 7788", lastLogin: "2026-09-03 09:10 AM", status: "ACTIVE", role: "VIP Customer", address: "Oke-Mosan, Abeokuta" },
    { id: "CUST-06", name: "Emma Rodriguez", initials: "ER", avatarBg: "#ea580c", email: "emma.r@example.com", phone: "090 6677 8899", lastLogin: "2026-09-04 10:05 AM", status: "ACTIVE", role: "Customer", address: "Adigbe, Abeokuta" },
    { id: "CUST-07", name: "Lucas Taylor", initials: "LT", avatarBg: "#143526", email: "lucas.t@example.com", phone: "080 7788 9900", lastLogin: "2026-08-25 01:14 PM", status: "ACTIVE", role: "Retail Member", address: "Camp, Abeokuta" },
    { id: "CUST-08", name: "Ava Patel", initials: "AP", avatarBg: "#2d5a43", email: "ava.p@example.com", phone: "081 8899 0011", lastLogin: "2026-09-02 03:22 PM", status: "ACTIVE", role: "VIP Customer", address: "Asero, Abeokuta" },
    { id: "CUST-09", name: "Noah Williams", initials: "NW", avatarBg: "#0284c7", email: "noah.w@example.com", phone: "090 9900 1122", lastLogin: "2026-08-20 09:50 AM", status: "INACTIVE", role: "Customer", address: "Lafenwa, Abeokuta" },
    { id: "CUST-10", name: "Isabella Davis", initials: "ID", avatarBg: "#78350f", email: "isabella.d@example.com", phone: "080 1234 9876", lastLogin: "2026-09-05 11:30 AM", status: "ACTIVE", role: "Wholesale Buyer", address: "Totoro, Abeokuta" },
    { id: "CUST-11", name: "Ethan Brown", initials: "EB", avatarBg: "#ea580c", email: "ethan.b@example.com", phone: "081 2345 8765", lastLogin: "2026-09-01 08:45 AM", status: "ACTIVE", role: "Customer", address: "Ita-Eko, Abeokuta" },
    { id: "CUST-12", name: "Mia Wilson", initials: "MW", avatarBg: "#143526", email: "mia.w@example.com", phone: "090 3456 7654", lastLogin: "2026-08-29 04:10 PM", status: "ACTIVE", role: "VIP Customer", address: "Obantoko, Abeokuta" },
    { id: "CUST-13", name: "Liam Anderson", initials: "LA", avatarBg: "#2d5a43", email: "liam.a@example.com", phone: "080 4567 6543", lastLogin: "2026-08-30 02:15 PM", status: "ACTIVE", role: "Retail Member", address: "Onikolobo, Abeokuta" },
    { id: "CUST-14", name: "Charlotte Thomas", initials: "CT", avatarBg: "#0284c7", email: "charlotte.t@example.com", phone: "081 5678 5432", lastLogin: "2026-09-03 01:20 PM", status: "ACTIVE", role: "Customer", address: "Sapon, Abeokuta" },
    { id: "CUST-15", name: "Benjamin Jackson", initials: "BJ", avatarBg: "#78350f", email: "benjamin.j@example.com", phone: "090 6789 4321", lastLogin: "2026-08-22 10:00 AM", status: "INACTIVE", role: "Customer", address: "Omida, Abeokuta" }
];

export const CURRENT_USER = {
    name: "Mr Afolabi",
    initials: "AA",
    email: "afolabiabayomi83@gmail.com",
    phone: "09029159943",
    role: "SUPER ADMIN",
    department: "Computer Science / Retail Commerce",
    lastLogin: "2026-10-04 08:30 AM"
};

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
