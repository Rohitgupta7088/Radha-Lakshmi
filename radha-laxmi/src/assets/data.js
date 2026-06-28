import logoImg from "./logo.svg";
import search from "./search.svg";
import user from "./user.svg";
import menu from "./menu.svg";
import menuClose from "./menu-close.svg";
import cartAdd from "./cart-add.svg";
import cartRemove from "./cart-remove.svg";
import cartAdded from "./cart-added.svg";
import forward from "./forward.svg";
import badge from "./badge.svg";
import heartAdd from "./heart-add.svg";
import returnRequest from "./return-request.svg";
import delivery from "./delivery.svg";
import secure from "./secure.svg";
import right from "./right.svg";
import pin from "./pin.svg";
import star from "./star.svg";
import facebook from "./facebook.svg";
import instagram from "./instagram.svg";
import twitter from "./twitter.svg";
import linkedin from "./linkedin.svg";
import rocket from "./rocket.svg";
import mail from "./mail.svg";
import phone from "./phone.svg";
import house from "./house.svg";
import graph from "./graph.svg";
import dollar from "./dollar.svg";
import map from "./map.svg";
import list from "./list.svg";
import dashboard from "./dashboard.svg";
import plus from "./plus.svg";
import squarePlus from "./square-plus.svg";
import minus from "./minus.svg";
import trash from "./trash.svg";
import hero from "./hero.png";
import features1 from "../assets/features1.png";
import features2 from "../assets/features2.png";
import userImg from "./user.png";
import user1 from "./user1.png";
import user2 from "./user2.png";
import user3 from "./user3.png";
import user4 from "./user4.png";
import uploadIcon from "../assets/upload_icon.png";
// Products
import product_1 from "./Product1.webp";
import product_2_1 from "./Product2.webp";
import product_2_2 from "./Product3.webp";
import product_2_3 from "./Product4.webp";
import product_2_4 from "./Product5.webp";
import product_3 from "./Product3.webp";
import product_4 from "./Product4.webp";
import product_5 from "./Product5.webp";
import product_6 from "./Product6.webp";
import product_7 from "./Product7.webp";
import product_8 from "./Product8.webp";
import product_9 from "./Product9.webp";
import product_10 from "./Product10.webp";
import product_11 from "./Product11.webp";
import product_12 from "./Product12.webp";
import product_13 from "./Product13.webp";
import product_14 from "./Product14.webp";
import product_15 from "./Product15.webp";
import product_16 from "./Product16.webp";
import product_17 from "./Product17.webp";
import product_18 from "./Product18.webp";
import product_19 from "./Product19.webp";
import product_20 from "./Product20.webp";
import product_21 from "./Product21.webp";
import product_22 from "./Product22.webp";
import product_23 from "./Product23.webp";
import product_24 from "./Product24.webp";
import product_25 from "./Product25.webp";
import product_26 from "./Product26.webp";
import product_27 from "./Product27.webp";
import product_28 from "./Product28.webp";
import product_29 from "./Product29.webp";
import product_30 from "./Product30.webp";
import product_31 from "./Product31.webp";
import product_32 from "./Product32.webp";
import product_33 from "./Product33.webp";
import product_34 from "./Product34.webp";
import product_35 from "./Product35.webp";
import product_36 from "./Product36.webp";
import product_37 from "./Product37.webp";
import product_38 from "./Product38.webp";
import product_39 from "./Product39.webp";
import product_40 from "./Product40.webp";
import product_41 from "./Product41.webp";
import product_42 from "./Product42.webp";
import product_43 from "./Product43.webp";
import product_44 from "./Product44.webp";
import product_45 from "./Product45.webp";
import product_46 from "./Product46.webp";
import product_47 from "./Product47.webp";
import product_48 from "./Product48.webp";
import product_49 from "./Product49.webp";
import product_50 from "./Product50.webp";
import product_51 from "./Product51.webp";
import product_52 from "./Product52.webp";
import product_53 from "./Product53.webp";
import product_54 from "./Product54.webp";
// Blogs
import blog1 from "./blogs/blog1.jpg";
import blog2 from "./blogs/blog2.jpg";
import blog3 from "./blogs/blog3.jpg";
import blog4 from "./blogs/blog4.jpg";
import blog5 from "./blogs/blog5.jpg";
import blog6 from "./blogs/blog6.jpg";
import blog7 from "./blogs/blog7.jpg";
import blog8 from "./blogs/blog8.jpg";

export const assets = {
    logoImg,
    search,
    user,
    menu,
    menuClose,
    cartAdd,
    cartRemove,
    cartAdded,
    forward,
    badge,
    heartAdd,
    returnRequest,
    delivery,
    secure,
    right,
    pin,
    star,
    facebook,
    instagram,
    twitter,
    linkedin,
    rocket,
    mail,
    phone,
    dollar,
    house,
    graph,
    map,
    dashboard,
    plus,
    minus,
    squarePlus,
    trash,
    list,
    userImg,
    user1,
    user2,
    user3,
    user4,
    hero,
    features1,
    features2,
    uploadIcon,
};


export const dummyProducts = [
    {
        _id: "1",
        title: "Green Astatic Bangles",
        images: [product_1],
        price: { "2-10": 15, "2-12": 25, "2-14": 40 },
        description: "Elegant green glass bangles with a glossy finish that enhances your look. Lightweight and comfortable for long wear. Perfect for daily styling and small occasions. A timeless addition to your collection.",
        category: "Glass Bangle",
        type: "Daily Wear",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "2",
        title: "Green Astatic Bangles",
        images: [product_2_1, product_2_2, product_2_3, product_2_4],
        price: { "2-10": 20, "2-12": 35, "2-14": 50 },
        description: "Premium green bangles set designed to add vibrance to your outfit. Features a polished shine for festive occasions. Ideal for weddings and celebrations. Complements traditional attire beautifully.",
        category: "Glass Bangle",
        type: "Festive",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: true,
        inStock: true,
    },
    {
        _id: "3",
        title: "Astatic pink Bangle",
        images: [product_3],
        price: { "2-10": 25, "2-12": 40, "2-14": 60 },
        description: "Soft pink bangles with a delicate and feminine appeal. Designed for comfort with a stylish finish. Perfect for casual outings and light occasions. Adds grace to any look.",
        category: "Glass Bangle",
        type: "Casual",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "4",
        title: "Delicious Pink Bangles",
        images: [product_4],
        price: { "2-14": 18, "2-10": 30, "2-14": 45 },
        description: "Beautiful pink bangles crafted with a refined finish. Durable and long-lasting shine. Perfect for festive and traditional wear. Enhances your ethnic appearance.",
        category: "Glass Bangle",
        type: "Traditional",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: true,
        inStock: true,
    },
    {
        _id: "5",
        title: "Long Hand Multi set",
        images: [product_5],
        price: { "2-10": 22, "2-12": 38, "2-14": 55 },
        description: "Long multi-set bangles designed for a complete bridal look. Rich patterns provide a luxurious feel. Ideal for weddings and heavy outfits. A perfect festive accessory.",
        category: "Multi Set",
        type: "Bridal",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "6",
        title: "Long Hand Multi Set",
        images: [product_6],
        price: { "2-10": 28, "2-12": 45, "2-14": 65 },
        description: "Elegant multi-set bangles with intricate detailing. Gives a royal and premium look. Suitable for grand celebrations and weddings. Comfortable and stylish.",
        category: "Multi Set",
        type: "Bridal",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "7",
        title: "Choclately Red Nag Bangle",
        images: [product_7],
        price: { "2-10": 12, "2-12": 20, "2-14": 35 },
        description: "Deep red bangles with a bold glossy finish. Designed for eye-catching festive looks. Perfect for parties and weddings. Adds richness to your outfit.",
        category: "Glass Bangle",
        type: "Party Wear",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "8",
        title: "Choclately Red Nag Bangle",
        images: [product_8],
        price: { "2-10": 25, "2-12": 40, "2-14": 60 },
        description: "Chocolate red bangles with smooth and shiny texture. Stylish and comfortable for long wear. Ideal for traditional functions. A modern ethnic choice.",
        category: "Glass Bangle",
        type: "Ethnic",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "9",
        title: "Simple Dark red Bangle",
        images: [product_9],
        price: { "2-10": 30, "2-12": 50, "2-14": 75 },
        description: "Simple dark red bangles with a classic minimal design. Perfect for daily wear and comfort. Lightweight and versatile. Matches every outfit easily.",
        category: "Glass Bangle",
        type: "Daily Wear",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: true,
        inStock: true,
    },
    {
        _id: "10",
        title: "Dark Brown Amazing Kada",
        images: [product_10],
        price: { "2-10": 40, "2-12": 60, "2-14": 85 },
        description: "Premium brown kada with a bold and sturdy design. Perfect for statement styling. Ideal for traditional and party wear. Adds elegance to your look.",
        category: "Kada Bangle",
        type: "Designer",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "11",
        title: "Multi Color Nag bangles",
        images: [product_11],
        price: { "2-10": 45, "2-12": 65, "2-14": 90 },
        description: "Multi-color bangles with vibrant and eye-catching tones. Perfect for festive celebrations. Adds energy to your outfit. Stylish and trendy.",
        category: "Glass Bangle",
        type: "Festive",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "12",
        title: "Multi Color Nag Bangle",
        images: [product_12],
        price: { "2-10": 35, "2-12": 55, "2-14": 80 },
        description: "Colorful bangles set designed for mix-and-match styling. Bright and attractive finish. Ideal for casual and festive wear. Enhances overall look.",
        category: "Glass Bangle",
        type: "Casual",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "13",
        title: "Single set Multi Bangles",
        images: [product_13],
        price: { "2-10": 42, "2-12": 62, "2-14": 88 },
        description: "Single set bangles with balanced color combination. Elegant and simple design. Suitable for daily and festive wear. Comfortable fit.",
        category: "Glass Bangle",
        type: "Traditional",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: true,
        inStock: true,
    },
    {
        _id: "14",
        title: "Single Designed Kada",
        images: [product_14],
        price: { "2-10": 38, "2-12": 58, "2-14": 82 },
        description: "Designer kada with unique patterns and finish. Strong and stylish structure. Ideal for modern ethnic styling. Perfect for occasions.",
        category: "Kada Bangle",
        type: "Designer",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "15",
        title: "Spicy Matalic Small Hand Set",
        images: [product_15],
        price: { "2-10": 44, "2-10": 64, "2-14": 89 },
        description: "Metallic multi-set bangles with shiny finish. Designed for party and festive looks. Adds glamour to your outfit. Lightweight and stylish.",
        category: "Multi Set",
        type: "Party Wear",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "16",
        title: "Fancy Multi Matalic Hand Set",
        images: [product_16],
        price: { "2-10": 36, "2-12": 56, "2-14": 81 },
        description: "Fancy metallic bangles set with modern design. Premium look with smooth edges. Perfect for events and celebrations. Comfortable wear.",
        category: "Multi Set",
        type: "Designer",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "17",
        title: "Exotic Many Colors Set",
        images: [product_17],
        price: { "2-10": 48, "2-12": 70, "2-14": 95 },
        description: "Exotic colorful bangles set for grand occasions. Rich design enhances ethnic outfits. Perfect for weddings and celebrations. Stylish choice.",
        type: "Bridal",
        category: "Multi Set",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "18",
        title: "Large Many Colors Set",
        images: [product_18],
        price: { "2-10": 39, "2-12": 59, "2-14": 84 },
        description: "Large multi-color bangles set for bold styling. Designed for festive and wedding wear. Adds volume and beauty. Premium finish.",
        type: "Festive",
        category: "Multi Set",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: true,
        inStock: true,
    },
    {
        _id: "19",
        title: "Piped Set Redly Bangle Set",
        images: [product_19],
        price: { "2-10": 25, "2-12": 40, "2-14": 60 },
        description: "Red piped bangles with detailed finishing. Elegant and traditional design. Perfect for festive occasions. Comfortable for long wear.",
        type: "Traditional",
        category: "Glass Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "20",
        title: "Brightening Redly piped Bangle",
        images: [product_20],
        price: { "2-10": 28, "2-12": 45, "2-14": 65 },
        description: "Bright red bangles with polished shine. Stylish and vibrant appearance. Ideal for parties and festivals. Enhances ethnic outfits.",
        type: "Party Wear",
        category: "Glass Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "21",
        title: "Retinol Anti Set Bangles",
        images: [product_21],
        price: { "2-10": 30, "2-12": 50, "2-14": 70 },
        description: "Designer bangles set with elegant patterns. Modern and stylish look. Perfect for special occasions. Durable and lightweight.",
        type: "Designer",
        category: "Glass Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "22",
        title: "Niacinamide Balancing Kada bangles",
        images: [product_22],
        price: { "2-10": 22, "2-12": 35, "2-14": 55 },
        description: "Stylish kada bangles with bold finish. Strong and long-lasting material. Ideal for modern traditional wear. Comfortable fit.",
        type: "Ethnic",
        category: "Kada Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "23",
        title: "Peptide 4-paired Set",
        images: [product_23],
        price: { "2-10": 32, "2-12": 52, "2-14": 75 },
        description: "Multi-set bangles with balanced design. Suitable for daily and festive use. Elegant color combination. Easy to style.",
        type: "Traditional",
        category: "Multi Set",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "24",
        title: "Volumizing 4-paired Set",
        images: [product_24],
        price: { "2-10": 15, "2-12": 25, "2-14": 40 },
        description: "4-paired bangles set for a complete look. Lightweight and comfortable design. Ideal for casual styling. Simple yet elegant.",
        type: "Casual",
        category: "Multi Set",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "25",
        title: "Valvate 3rd Paired Big Set",
        images: [product_25],
        price: { "2-10": 18, "2-12": 30, "2-14": 45 },
        description: "Large multi-set bangles perfect for weddings. Rich and premium appearance. Designed for heavy outfits. Adds festive charm.",
        type: "Bridal",
        category: "Multi Set",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: true,
        inStock: true,
    },
    {
        _id: "26",
        title: "Clarifying 4-Paired Set Bangles",
        images: [product_26],
        price: { "2-10": 20, "2-12": 35, "2-14": 50 },
        description: "Paired bangles with modern stylish design. Perfect for casual and daily wear. Lightweight and trendy. Easy to carry.",
        type: "Casual",
        category: "Multi Set",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: true,
        inStock: true,
    },
    {
        _id: "27",
        title: "Anti-Dandruff Colored Bangle",
        images: [product_27],
        price: { "2-10": 16, "2-12": 28, "2-14": 42 },
        description: "Colored bangles with vibrant finish. Simple yet attractive design. Ideal for daily use. Comfortable and durable.",
        type: "Daily Wear",
        category: "Glass Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "28",
        title: "Protect Dark Voilet Kada Bangle",
        images: [product_28],
        price: { "2-10": 19, "2-12": 32, "2-14": 48 },
        description: "Dark violet kada with bold appearance. Stylish and modern design. Perfect for statement looks. Long-lasting finish.",
        type: "Designer",
        category: "Kada Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "29",
        title: "Citrus Designed Red Bangle",
        images: [product_29],
        price: { "2-10": 12, "2-12": 20, "2-14": 35 },
        description: "Red designer bangles with unique color tone. Stylish and trendy look. Ideal for casual and festive wear. Lightweight design.",
        type: "Casual",
        category: "Glass Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "30",
        title: "Cool Red Mint Kade",
        images: [product_30],
        price: { "2-10": 14, "2-12": 22, "2-14": 38 },
        description: "Cool-toned kada with refreshing design. Modern and minimal look. Suitable for daily styling. Comfortable wear.",
        type: "Daily Wear",
        category: "Kada Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "31",
        title: "Vanilla Dream Redly lined Kade",
        images: [product_31],
        price: { "2-10": 13, "2-12": 21, "2-14": 36 },
        description: "Soft red kada with smooth finish. Elegant and simple design. Perfect for light occasions. Stylish and durable.",
        type: "Traditional",
        category: "Kada Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "32",
        title: "Ocean Wave Paired Kade",
        images: [product_32],
        price: { "2-10": 15, "2-12": 25, "2-14": 40 },
        description: "Ocean-inspired kada with fresh colors. Trendy and modern appeal. Perfect for casual styling. Lightweight and stylish.",
        type: "Casual",
        category: "Kada Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: true,
        inStock: true,
    },
    {
        _id: "33",
        title: "Berry Pink Simple Bangles",
        images: [product_33],
        price: { "2-10": 11, "2-12": 18, "2-14": 32 },
        description: "Pink simple bangles with minimal design. Elegant and easy to wear. Suitable for daily use. Matches all outfits.",
        type: "Daily Wear",
        category: "Glass Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "34",
        title: "Gentle Foaming Tiranga kade",
        images: [product_34],
        price: { "2-10": 15, "2-12": 25, "2-14": 40 },
        description: "Tiranga-themed kada with unique colors. Stylish and meaningful design. Perfect for special occasions. Comfortable fit.",
        type: "Ethnic",
        category: "Kada Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "35",
        title: "Golden Cleanser Delicious Kade",
        images: [product_35],
        price: { "2-10": 18, "2-12": 30, "2-14": 45 },
        description: "Golden kada with rich premium finish. Elegant and eye-catching design. Ideal for festive wear. Enhances traditional outfits.",
        type: "Festive",
        category: "Kada Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "36",
        title: "Fancy Stand Delicious 2-paired Kade",
        images: [product_36],
        price: { "2-10": 20, "2-12": 35, "2-14": 50 },
        description: "Fancy paired kada with stylish structure. Modern and attractive design. Perfect for parties. Lightweight comfort.",
        type: "Party Wear",
        category: "Kada Bangle",
        sizes: ["2-10", "2-14", "2-14"],
        date: 1716634345448,
        popular: true,
        inStock: true,
    },
    {
        _id: "37",
        title: "Exfoliating Red-Gold Bangle",
        images: [product_37],
        price: { "2-10": 22, "2-12": 38, "2-14": 55 },
        description: "Red-gold bangles with elegant blend. Perfect for weddings and celebrations. Premium finish and design. Adds richness.",
        type: "Bridal",
        category: "Glass Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "38",
        title: "Micellar Kade Designed",
        images: [product_38],
        price: { "2-10": 16, "2-12": 28, "2-14": 42 },
        description: "Designed kada with modern patterns. Stylish and durable build. Perfect for daily and party wear. Comfortable fit.",
        type: "Designer",
        category: "Kada Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "39",
        title: "Antibacterial Hand-Full Set",
        images: [product_39],
        price: { "2-10": 10, "2-12": 18, "2-14": 30 },
        description: "Full-hand multi-set bangles for traditional look. Rich and stylish appearance. Ideal for festive occasions. Comfortable wear.",
        type: "Traditional",
        category: "Multi Set",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "40",
        title: "Moisturizing Hand Voilet Bangle",
        images: [product_40],
        price: { "2-10": 12, "2-12": 20, "2-14": 35 },
        description: "Violet glass bangles with smooth shine. Elegant and simple design. Perfect for daily styling. Lightweight comfort.",
        type: "Daily Wear",
        category: "Glass Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "41",
        title: "Citrus Scented Two Paired bangle",
        images: [product_41],
        price: { "2-10": 11, "2-12": 19, "2-14": 32 },
        description: "Citrus-toned bangles with vibrant look. Fresh and trendy design. Ideal for casual outfits. Easy to style.",
        type: "Casual",
        category: "Glass Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "42",
        title: "Lavender Calming Hand green Bangle",
        images: [product_42],
        price: { "2-10": 13, "2-12": 22, "2-14": 38 },
        description: "Green bangles with calming tone. Elegant and minimal finish. Suitable for daily wear. Comfortable and stylish.",
        type: "Daily Wear",
        category: "Glass Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "43",
        title: "Tree light green-yellow Bangle",
        images: [product_43],
        price: { "2-10": 14, "2-12": 24, "2-14": 40 },
        description: "Light green-yellow bangles with fresh design. Perfect for casual styling. Lightweight and comfortable. Stylish look.",
        type: "Casual",
        category: "Glass Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "44",
        title: "Plane Simple Bangle",
        images: [product_44],
        price: { "2-10": 15, "2-12": 25, "2-14": 45},
        description: "Plain simple bangles with minimal design. Perfect for everyday use. Lightweight and easy to wear. Classic style.",
        type: "Daily Wear",
        category: "Glass Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "45",
        title: "Hydrate Many Color Bangle Set",
        images: [product_45],
        price: { "2-10": 10, "2-12": 18 },
        description: "Multi-color bangles set with vibrant tones. Ideal for mix and match styling. Perfect for casual and festive wear. Stylish design.",
        type: "Casual",
        category: "Glass bangle",
        sizes: ["2-10", "2-12"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "46",
        title: "Glossy Multi Set Kade",
        images: [product_46],
        price: { "2-12": 12, "2-14": 20 },
        description: "Glossy kada set with shiny premium finish. Stylish and modern look. Perfect for parties. Comfortable wear.",
        type: "Party Wear",
        category: "Kada Bangle",
        sizes: ["2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "47",
        title: "Light Coloring Bangle",
        images: [product_47],
        price: { "2-10": 18, "2-12": 30, "2-14": 45 },
        description: "Light-colored bangles with soft elegant design. Perfect for daily use. Comfortable and stylish. Matches any outfit.",
        type: "Daily Wear",
        category: "Glass Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "48",
        title: "Matte Big-Bangle set",
        images: [product_48],
        price: { "2-10": 14, "2-12": 24 },
        description: "Matte finish bangles set with modern touch. Trendy and stylish look. Perfect for casual wear. Lightweight design.",
        type: "Casual",
        category: "Multi Set",
        sizes: ["2-10", "2-12"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "49",
        title: "Aloe Light Blue Bangle",
        images: [product_49],
        price: { "2-10": 15, "2-12": 25, "2-14": 40 },
       description: "Light blue bangles with soothing tone. Elegant and refreshing design. Ideal for daily styling. Comfortable fit.",
        type: "Daily Wear",
        category: "Glass Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: true,
        inStock: true,
    },
    {
        _id: "50",
        title: "dark Natured Bangle Designed",
        images: [product_50],
        price: { "2-10": 12, "2-12": 20, "2-14": 35 },
        description: "Dark designer bangles with bold look. Stylish and modern finish. Perfect for evening wear. Durable design.",
        type: "Designer",
        category: "Glass Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "51",
        title: "Sea Moisturizing Designed Bangle",
        images: [product_51],
        price: { "2-10": 18, "2-12": 30, "2-14": 45 },
       description: "Sea-inspired bangles with fresh design. Stylish and unique appearance. Perfect for casual outfits. Lightweight.",
        type: "Casual",
        category: "Glass Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "52",
        title: "Relaxing Expensive kade set",
        images: [product_52],
        price: { "2-10": 14, "2-12": 22, "2-14": 38 },
        description: "Premium kada set with luxurious finish. Designed for special occasions. Elegant and stylish look. Comfortable fit.",
        type: "Bridal",
        category: "Multi Set",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "53",
        title: "Enriched Weds Set",
        images: [product_53],
        price: { "2-10": 20, "2-12": 35, "2-14": 50 },
        description: "Wedding special bangles set with rich design. Perfect for bridal wear. Enhances traditional outfits. Premium quality.",
        type: "Bridal",
        category: "Multi Set",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
    {
        _id: "54",
        title: "Unscented Sensitive Bangle",
        images: [product_54],
        price: { "2-10": 16, "2-12": 28, "2-14": 42 },
        description: "Simple kada with minimal elegant design. Perfect for daily styling. Comfortable and lightweight. Classic look.",
        type: "Daily Wear",
        category: "Kada Bangle",
        sizes: ["2-10", "2-12", "2-14"],
        date: 1716634345448,
        popular: false,
        inStock: true,
    },
];


// Blogs Dummy Data 
export const blogs = [{
        title: "Top 10 Trending Bangle Designs for 2026",
        category: "Traditional Bangles",
        image: blog1,
        description: "Discover the latest bangle styles, from colorful glass bangles to elegant designer collections that are trending this year.",
    },
    {
        title: "Choose the Perfect Bangles",
        category: "Delious Bangles",
        image: blog2,
        description: "Learn how to select bangles based on design, purity, weight, and occasions for a timeless collection.",
    },
    {
        title: "Elegant Everyday Bangles You'll Love",
        category: "Daily Wear",
        image: blog3,
        description: "Explore lightweight and stylish bangles that offer comfort, durability, and elegance for daily wear.",
    },
    {
        title: "Bridal Bangles: Complete Wedding Style Guide",
        category: "Bridal Collection",
        image: blog4,
        description: "Find the perfect bridal bangles with expert tips on matching colors, materials, and traditional wedding outfits for a stunning look.",
    },
    {
        title: "Elegant Bridal Bangles for Your Special Day",
        category: "Bridal Collection",
        image: blog5,
        description: "Complete your wedding look with stunning bridal bangles that blend traditional craftsmanship with modern elegance.",
    },
    {
        title: "Explore Our Premium Bangle Collections",
        category: "Bangle Collections",
        image: blog6,
        description: "Browse a wide variety of gold, glass, oxidized, and designer bangles perfect for every occasion and style.",
    },
    {
        title: "How to Choose the Perfect Bangles",
        category: "Shopping Guide",
        image: blog7,
        description: "Learn how to select the right bangles based on size, material, color, and outfit to create a stylish look.",
    },
    {
        title: "Top Bangle Trends to Watch in 2025",
        category: "Top Bangle Trends",
        image: blog8,
        description: "Discover the latest bangle styles, vibrant colors, and elegant designs that are making waves in fashion this year.",
    },
];


export const dummyAddress = [{
        _id: "67b5b9e54ea97f71bbc196a0",
        userId: "68591d36daf423db94fa8f4f",
        firstName: "user",
        lastName: "one",
        email: "userone@gmail.com",
        street: "789 Elm Street",
        city: "Springfield",
        state: "California",
        zipcode: 90210,
        country: "US",
        phone: "+1-555-123-4567",
    },
    {
        _id: "67b5b9e54ea97fdfgdbcsd5",
        userId: "68591d36daf423db94fa8f4f",
        firstName: "Jane",
        lastName: "Smith",
        email: "janesmith@gmail.com",
        street: "456 Elm Street",
        city: "Metropolis",
        state: "CA",
        zipcode: "998877",
        country: "United States",
        phone: "9876543210",
    },

];


export const dummyOrdersData = [{
        _id: "685a5bbfaff57babcdfcc171",
        userId: "68591d36daf423db94fa8f4f",
        items: [{
                product: dummyProducts[0],
                quantity: 1,
                size: "2-10",
                _id: "685a5bbfaff57babcdfcc172",
            },
            {
                product: dummyProducts[3], // Tea Tree Hair Oil
                quantity: 2,
                size: "2-14",
                _id: "685a5bbfaff57babcdfcc173",
            },
        ],
        amount: 40.6,
        address: dummyAddress[0],
        status: "Out for delivery",
        paymentMethod: "COD",
        isPaid: false,
        createdAt: "2025-06-24T08:03:11.197+00:00",
        updatedAt: "2025-06-24T11:02:04.631+00:00",
        __v: 0,
    },
    {
        _id: "685a5bbfaff57babcdfcc174",
        userId: "68591d36daf423db94fa8f4f",
        items: [{
                product: dummyProducts[8], // Vitamin C Face Oil
                quantity: 1,
                size: "2-12",
                _id: "685a5bbfaff57babcdfcc175",
            },
            {
                product: dummyProducts[24], // Volumizing Shampoo
                quantity: 3,
                size: "2-14",
                _id: "685a5bbfaff57babcdfcc176",
            },
        ],
        amount: 85.0,
        address: dummyAddress[0],
        status: "Delivered",
        paymentMethod: "Online",
        isPaid: true,
        createdAt: "2025-07-01T09:15:45.197+00:00",
        updatedAt: "2025-07-01T11:30:04.631+00:00",
        __v: 0,
    },
];


// Dashboard Dummy Data
export const dummyDashboardData = {
    "totalOrders": 2,
    "totalRevenue": 897,
    "orders": dummyOrdersData
}