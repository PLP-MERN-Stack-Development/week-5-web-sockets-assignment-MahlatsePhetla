
const User = require('../models/User');

exports.login = async (req, res) => {
  const { username } = req.body;

  try {
    let user = await User.findOne({ username });

    
    if (!user) {
      user = await User.create({ username, email: `${username}@chat.com`, password: 'nopass' });
    }

    return res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
