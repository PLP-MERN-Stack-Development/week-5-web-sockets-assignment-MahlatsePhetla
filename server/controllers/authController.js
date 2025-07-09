const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.register = async (req, res) => {
  console.log(" REGISTER CONTROLLER HIT");
  console.log("Register request body:", req.body);

  const { username, email, password } = req.body; 

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,  
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(" Returning user + token:", token, newUser.username);

    return res.status(201).json({
      message: "User registered successfully!",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,  
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};


exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("Password received:", JSON.stringify(password));
    console.log("Password stored (hash):", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // rest of your code ...
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
