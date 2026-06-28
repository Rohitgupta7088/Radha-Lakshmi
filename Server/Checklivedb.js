import dns from "dns";
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from "mongoose";
import "dotenv/config";
import Product from "./models/Product.js";

async function checkDB() {
    try {
        console.log("Connecting with URI (password hidden):");
        console.log(process.env.MONGO_URI.replace(/:[^:@]+@/, ":****@"));
        console.log("");

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to database:", mongoose.connection.db.databaseName);
        console.log("Connected to host:", mongoose.connection.host);
        console.log("");

        const count = await Product.countDocuments();
        console.log("TOTAL PRODUCTS IN 'products' COLLECTION:", count);
        console.log("");

        const all = await Product.find({}, "title category createdAt").sort({ createdAt: 1 });
        all.forEach((p, i) => {
            console.log(`${i + 1}. "${p.title}" — category: "${p.category}" — created: ${p.createdAt}`);
        });

        // Also list all collections in this database, in case products live under a different name
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("\nAll collections in this database:");
        collections.forEach(c => console.log("  -", c.name));

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

checkDB();