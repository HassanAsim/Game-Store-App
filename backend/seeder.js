const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
    {
        title: "PlayStation 5",
        description: "Next-generation gaming console featuring lightning-fast loading, ultra-high speed SSD, ray tracing, and 4K gaming support.",
        price: 499.99,
        category: "Console",
        imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        stock: 15,
        brand: "Sony"
    },
    {
        title: "Xbox Series X",
        description: "The most powerful Xbox ever, featuring 4K gaming at up to 120 FPS, 12 teraflops of processing power, and ray tracing support.",
        price: 499.99,
        category: "Console",
        imageUrl: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1447&q=80",
        stock: 10,
        brand: "Microsoft"
    },
    {
        title: "DualSense Wireless Controller",
        description: "Next-gen gaming controller with haptic feedback, adaptive triggers, and built-in microphone for PS5.",
        price: 69.99,
        category: "Accessory",
        imageUrl: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        stock: 25,
        brand: "Sony"
    },
    {
        title: "ASUS ROG Swift 27\" Gaming Monitor",
        description: "27-inch 4K HDR gaming monitor with 144Hz refresh rate, 1ms response time, and G-SYNC technology for smooth gameplay.",
        price: 699.99,
        category: "Accessory",
        imageUrl: "https://images.unsplash.com/photo-1527219525722-f9767a7f2884?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80",
        stock: 8,
        brand: "ASUS"
    },
    {
        title: "Custom Gaming PC",
        description: "High-end gaming PC featuring RTX 4080, Intel i9 processor, 32GB RAM, 2TB NVMe SSD, and RGB cooling system.",
        price: 2499.99,
        category: "Console",
        imageUrl: "https://images.unsplash.com/photo-1587202372616-b43abea06c2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        stock: 5,
        brand: "Custom Built"
    },
    {
        title: "SteelSeries Arctis Pro Wireless",
        description: "Premium wireless gaming headset with high-fidelity audio, dual-wireless technology, and retractable microphone.",
        price: 329.99,
        category: "Accessory",
        imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1476&q=80",
        stock: 12,
        brand: "SteelSeries"
    },
    {
        title: "Meta Quest 3",
        description: "Advanced VR headset with high-resolution display, wireless design, and extensive game library for immersive gaming experience.",
        price: 499.99,
        category: "Console",
        imageUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        stock: 7,
        brand: "Meta"
    },
    {
        title: "Razer Huntsman Elite Keyboard",
        description: "Premium gaming keyboard with optical switches, RGB lighting, media controls, and ergonomic wrist rest.",
        price: 199.99,
        category: "Accessory",
        imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907198a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        stock: 15,
        brand: "Razer"
    }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
    seedDatabase();
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
});

const seedDatabase = async () => {
    try {
        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert new products
        await Product.insertMany(products);
        console.log('Successfully added sample products to database');

        // Disconnect from database
        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding database:', error.message);
        process.exit(1);
    }
};