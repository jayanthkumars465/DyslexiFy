// models/User.js (FULL PERFECT CODE - fixes "next is not a function")
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        email: { type: String, unique: true, required: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6 },
    },
    { timestamps: true }
);

// ✅ async pre-save hook (NO next param)
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// ✅ compare password
UserSchema.methods.comparePassword = async function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
