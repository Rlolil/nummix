import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { fullName, companyName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Bu email artıq istifadə olunub" });
    }

    const user = await User.create({ fullName, companyName, email, password });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      companyName: user.companyName,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email və ya şifrə səhvdir" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email və ya şifrə səhvdir" });
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      companyName: user.companyName,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
