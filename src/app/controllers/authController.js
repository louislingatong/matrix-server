const {startSession} = require('mongoose');

const authService = require('../services/authService');

const login = async (req, res, next) => {
  const token = authService.generateAccessToken(req.user);
  res.status(200).json({token});
};

const register = async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const user = await authService.createUser(req.body, session);
    const token = authService.generateAccessToken(user);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({token});
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

const forgotPassword = async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    await authService.forgotPassword(req.body, session);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({message: 'Reset password link has been sent to your email'});
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

const resetPassword = async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    await authService.resetPassword(req.body, session);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({message: 'Password has been changed successfully'});
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

const verifyEmail = async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const user = await authService.verifyEmail(req.params, session)
    const token = authService.generateAccessToken(user);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({token});
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

const resendVerifyEmailLink = async (req, res, next) => {
  const session = await startSession();
  try {
    session.startTransaction();
    await authService.resendVerifyEmailLink(req.body, session);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({message: 'Email verification link has been sent to your email'});
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
}

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerifyEmailLink
}