const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { userName, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: 'User already exists' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({ userName, email, password: hashedPassword });
  await user.save();

  const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({ token });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
  
    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
  
    res.json({ token });
  };
  