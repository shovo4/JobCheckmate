const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const token = user.createJWT();
  // Directly return the ID, name, and token without nesting them inside 'user'
  res.status(StatusCodes.OK).json({ id: user._id, name: user.name, token });
};


const getUserProfile = async (req, res) => {
  const { id } = req.params; // Assuming the ID is passed as a URL parameter
  const user = await User.findById(id).select('-password');
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
  }
  res.status(StatusCodes.OK).json({ user });
};

const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password'); // Excluding password field
  res.status(StatusCodes.OK).json({ users });
};


const deleteUserByEmail = async (req, res) => {
  const { email } = req.params; // Assuming the email is passed as a URL parameter
  const user = await User.findOneAndDelete({ email });
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
  }
  res.status(StatusCodes.OK).json({ msg: 'User deleted successfully' });
};

module.exports = {
  register,
  login,
  getUserProfile,
  getAllUsers,
  deleteUserByEmail,
}
