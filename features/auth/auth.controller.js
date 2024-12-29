import User from "./auth.model.js";
import jwt from "jsonwebtoken";
import Joi from "joi";
import nodemailer from "nodemailer";
import crypto from "crypto";

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const { error } = registerSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists!" });

    const otp = crypto.randomInt(100000, 999999);

    const newUser = new User({
      username,
      email,
      password,
      otp,
      verified: false,
    });
    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "neamatullahabolila@gmail.com",
        pass: "invaaptsexvktvrn",
      },
    });

    const mailOptions = {
      from: "neamatullahabolila@gmail.com",
      to: newUser.email,
      subject: "Email Verification for Sarah Application",
      text: `Hello ${newUser.username},\n\nPlease use the following OTP to verify your email address: ${otp}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email", err);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    res.status(201).json({
      message: "User registered successfully! Please verify your email.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = loginSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials!" });

    if (!user.verified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials!" });

    const token = jwt.sign({ id: user._id }, "neama124", {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (user.otp !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    user.verified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { registerUser, loginUser, verifyOtp };
