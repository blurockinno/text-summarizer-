import { User } from "../models/UserSchema.js";

export const registerUser = async (req, res) => {
  const { name, userClass, userId } = req.body;

  // Basic validation
  if (!name || !userClass || !userId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if the userId already exists (just to ensure uniqueness)
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "User ID already exists." });
    }

    // Create and save the new user
    const newUser = new User({
      userId,
      name,
      class: userClass,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      userId: newUser.userId,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { userId } = req.body;

  // Basic validation
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    // Find the user by userId
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(400).json({ message: "Invalid User ID." });
    }

    // Successful login
    return res
      .status(200)
      .json({
        success: true,
        message: "Login successful!",
        userDetails: user,
      });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
