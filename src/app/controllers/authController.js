const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const randomstring  = require('randomstring');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Ticket = require('../models/Ticket');
const { auth } = require('../../../config');
const { parseError } = require('../helpers/errorHelper');

const newEventEmitter = require('../events/newTicketEvent');

const generateAccessToken = user => {
  return JWT.sign({
    iss: 'User',
    sub: user.id,
    iat: new Date().getTime(), // Current time
    exp: new Date().setDate(new Date().getDate() + 1) //Current time plus 1 day ahead
  }, auth.clientSecret);
}

const createUser = async (data) => {
  const user = new User(data);
  await user.save();
  return user;
};

const createProfile = async (data) => {
  const profile = new Profile(data);
  await profile.save();
  return profile;
};

const createTicket = async (data) => {
  const ticket = new Ticket(data);
  await ticket.save();
  return ticket;
};

module.exports = {
  register: async (req, res, next) => {
    const emailExist = await User.exists({email: req.body.email});
    if (emailExist) {
      return parseError(res, 422, { email: 'Email is already exist.' });
    }

    const usernameExist = await User.exists({username: req.body.username});
    if (usernameExist) {
      return parseError(res, 422, { username: 'Username is already exist.' });
    }

    const name = `${req.body.firstName} ${req.body.lastName}`

    const user = await createUser({
      name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })

    await createProfile( {
      user,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    const token = await randomstring.generate();
    const ticket = await createTicket({
      owner: user,
      token
    });

    newEventEmitter.emit('sendVerifyEmailLink', user.name, user.email, ticket.token);

    const accessToken = generateAccessToken(user);

    res.status(200).json({ token: accessToken });
  },

  login: async (req, res, next) => {
    const token = generateAccessToken(req.user);

    res.status(200).json({ token });
  },

  forgotPassword: async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
      return parseError(res, 422, { email: 'Email is invalid'});
    }

    const token = await randomstring.generate();

    const ticket = await createTicket({ user, token });

    newEventEmitter.emit('sendResetPasswordLink', user.name, user.email, ticket.token);

    res.status(200).json({ message: 'Reset password link has been sent to your email' });
  },

  resetPassword: async (req, res, next) => {
    const ticket = await Ticket.findOne({ token: req.body.token }).populate('owner');
    if (!ticket) {
      return parseError(res, 422, { token: 'Token is invalid'});
    }

    const expiredTicket = Date.now() > ticket.expireAt;
    if (expiredTicket) {
      return parseError(res, 422, { token: 'Token is already expired'});
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    await ticket.owner.updateOne({ password: hashedPassword });

    await ticket.remove();

    res.status(200).json({ message: 'Password has been changed successfully' });
  },

  verifyEmail: async (req, res, next) => {
    const ticket = await Ticket.findOne({ token: req.params.token }).populate('owner');
    if (!ticket) {
      return parseError(res, 400, 'Token is invalid');
    }

    const expiredTicket = Date.now() > ticket.expireAt;
    if (expiredTicket) {
      return parseError(res, 400, 'Token is already expired');
    }

    await ticket.owner.updateOne({ status: 'ACTIVE' });

    await ticket.remove();

    const accessToken = generateAccessToken(ticket.owner);

    res.status(200).json({ token: accessToken });
  },

  resendVerifyEmailLink: async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
      return parseError(res, 422, { email: 'Email is invalid'});
    }

    if (user.status === 'ACTIVE') {
      return res.status(200).json({ message: 'Email is already verified' });
    }

    const token = await randomstring.generate();

    const ticket = await createTicket({
      owner: user,
      token
    });

    newEventEmitter.emit('sendVerifyEmailLink', user.name, user.email, ticket.token);

    res.status(200).json({ message: 'Email verification link has been sent to your email' });
  },
}