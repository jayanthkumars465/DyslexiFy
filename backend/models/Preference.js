// models/Preference.js (FULL PERFECT CODE - consistent defaults)
const mongoose = require("mongoose");

const PreferenceSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

        // Keep these consistent with popup.js values
        fontSize: { type: String, default: "16" },
        fontType: { type: String, default: "OpenDyslexic" },
        lineSpacing: { type: String, default: "1.4" },
        backgroundColor: { type: String, default: "#fffee3" },
        textColor: { type: String, default: "#000000" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Preference", PreferenceSchema);
