require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const User = require("./models/User");
const Preference = require("./models/Preference");

const app = express();
app.use(cors());
app.use(express.json());

// =============== MongoDB Connection ===============
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
      family: 4,
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
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

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: "Registered successfully", userId: user._id });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== LOGIN ==================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", userId: user._id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== SAVE ALL PREFERENCES ==================
app.post("/preferences", async (req, res) => {
  try {
    const {
      userId,

      fontSize,
      fontType,
      lineHeight,
      letterSpacing,
      textColor,
      highlightColor,

      theme,

      overlayEnabled,
      overlayColor,
      overlayOpacity,

      pointerShape,
      pointerSize,
      pointerColor,

      bold,
      italic,
      underline,

      ruler,
      rulerHeight,
      rulerOpacity,
      rulerColor,

      voice,
      rate,
      pitch,

      isActive,
    } = req.body;

    if (!userId) return res.status(400).json({ message: "userId required" });

    const updated = await Preference.findOneAndUpdate(
      { userId },
      {
        userId,

        fontSize,
        fontType,
        lineHeight,
        letterSpacing,
        textColor,
        highlightColor,

        theme,

        overlayEnabled,
        overlayColor,
        overlayOpacity,

        pointerShape,
        pointerSize,
        pointerColor,

        bold,
        italic,
        underline,

        ruler,
        rulerHeight,
        rulerOpacity,
        rulerColor,

        voice,
        rate,
        pitch,

        isActive,
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ message: "Preferences saved", data: updated });
  } catch (err) {
    console.error("Preferences save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== GET ALL PREFERENCES ==================
app.get("/preferences/:userId", async (req, res) => {
  try {
    const pref = await Preference.findOne({ userId: req.params.userId });
    if (!pref) return res.status(404).json({ message: "No preferences found" });
    res.json(pref);
  } catch (err) {
    console.error("Preferences get error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
