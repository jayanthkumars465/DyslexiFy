// models/Preference.js (STORE ALL PREFERENCES)
const mongoose = require("mongoose");

const PreferenceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // ===== Core =====
    isActive: { type: Boolean, default: false },

    // ===== Text Settings =====
    font: { type: String, default: "OpenDyslexic" },
    fontSize: { type: Number, default: 16 },     // popup: fontSize slider
    size: { type: Number, default: 16 },         // contentScript uses size
    lineHeight: { type: Number, default: 1.4 },
    letterSpacing: { type: Number, default: 0 },
    bold: { type: Boolean, default: false },
    italic: { type: Boolean, default: false },
    underline: { type: Boolean, default: false },

    textColor: { type: String, default: "#000000" },
    highlightColor: { type: String, default: "#87ceeb" },

    // ===== Theme / Overlay =====
    theme: { type: String, default: "Light" },

    overlay: { type: Boolean, default: false },          // popup checkbox
    overlayEnabled: { type: Boolean, default: false },   // contentScript uses overlayEnabled
    overlayColor: { type: String, default: "#fffee3" },
    overlayOpacity: { type: Number, default: 0.15 },

    // ===== Pointer =====
    pointerShape: { type: String, default: "Arrow" },
    pointerSize: { type: Number, default: 16 },
    pointerColor: { type: String, default: "#0000ff" },

    // ===== Ruler =====
    ruler: { type: Boolean, default: false },
    rulerHeight: { type: Number, default: 30 },
    rulerOpacity: { type: Number, default: 0.5 },
    rulerColor: { type: String, default: "#add8e6" },

    // ===== TTS =====
    voice: { type: String, default: "" },
    rate: { type: Number, default: 1.0 },
    pitch: { type: Number, default: 1.0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Preference", PreferenceSchema);
