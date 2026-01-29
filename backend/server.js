// server.js (FULL PERFECT CODE - matches your frontend, no token/JWT)
// ✅ Stable MongoDB connect
// ✅ Register + Login return userId
// ✅ Preferences save + get
// ✅ CORS for extension
// ✅ Safe validations

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const User = require("./models/User");
const Preference = require("./models/Preference");

const app = express();

// IMPORTANT: allow extension + local pages
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

// =============== MongoDB Connection (FIXED) ===============
async function connectDB() {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("❌ MONGO_URI missing in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
            family: 4, // IPv4 helps some SSL/network issues
        });

        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err?.message || err);
        process.exit(1);
    }
}

// ================== REGISTER ==================
app.post("/register", async (req, res) => {
    try {
        const { name = "", email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
        if (exists) return res.status(400).json({ message: "User already exists" });

        const user = new User({
            name: String(name || "").trim(),
            email: String(email).toLowerCase().trim(),
            password: String(password),
        });

        await user.save();

        return res.json({ message: "Registered successfully", userId: user._id });
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

// ================== LOGIN ==================
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await User.findOne({ email: String(email).toLowerCase().trim() });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await user.comparePassword(String(password));
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        return res.json({ message: "Login successful", userId: user._id });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

// ================== SAVE PREFERENCES ==================
app.post("/preferences", async (req, res) => {
    try {
        const {
            userId,
            fontSize,
            fontType,
            lineSpacing,
            backgroundColor,
            textColor,
        } = req.body;

        if (!userId) return res.status(400).json({ message: "userId required" });

        // Keep consistent formats (store numbers/strings cleanly)
        const update = {
            userId,
            fontSize: fontSize != null ? String(fontSize).replace("px", "") : "16",
            fontType: fontType != null ? String(fontType) : "OpenDyslexic",
            lineSpacing: lineSpacing != null ? String(lineSpacing) : "1.4",
            backgroundColor: backgroundColor != null ? String(backgroundColor) : "#fffee3",
            textColor: textColor != null ? String(textColor) : "#000000",
        };

        const saved = await Preference.findOneAndUpdate(
            { userId },
            update,
            { upsert: true, new: true }
        );

        return res.json({ message: "Preferences saved", data: saved });
    } catch (err) {
        console.error("Preferences save error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

// ================== GET PREFERENCES ==================
app.get("/preferences/:userId", async (req, res) => {
    try {
        const pref = await Preference.findOne({ userId: req.params.userId });
        if (!pref) return res.status(404).json({ message: "No preferences found" });
        return res.json(pref);
    } catch (err) {
        console.error("Preferences get error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

// ================== START SERVER (AFTER DB) ==================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
});
