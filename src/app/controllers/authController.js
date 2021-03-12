const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const randomstring  = require('randomstring');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Ticket = require('../models/Ticket');
const { auth, app } = require('../../../config');
const { parseError } = require('../helpers/errorHelper');

const newEventEmitter = require('../events/newTicketEvent');

generateAccessToken = user => {
  return JWT.sign({
    iss: 'User',
    sub: user.id,
    iat: new Date().getTime(), // Current time
    exp: new Date().setDate(new Date().getDate() + 1) //Current time plus 1 day ahead
  }, auth.clientSecret);
}

generateCode = async () => {
  const count = await User.countDocuments();
  const currentDate = new Date();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
  const year = currentDate.getFullYear();
  const number = count.toString().padStart(4, '0');
  return `${month}${year}${number}`;
}

createUser = async (data, leader) => {
  const user = new User(data);
  await user.save();
  if (leader) {
    await user.updateOne({
      leader,
      level: leader.level + 1
    })
    await leader.updateOne({
      $push: {
        members: user
      }
    });
  }
  return user;
};

createProfile = async (data) => {
  const profile = new Profile(data);
  await profile.save();
  return profile;
};

createTicket = async (data) => {
  const ticket = new Ticket(data);
  await ticket.save();
  return ticket;
};

module.exports = {
  register: async (req, res, next) => {
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) {
      return parseError(res, 422, { email: 'Email is already exist.' });
    }

    const usernameExist = await User.findOne({username: req.body.username});
    if (usernameExist) {
      return parseError(res, 422, { username: 'Username is already exist.' });
    }

    const leader = await User.findOne({code: req.body.code});

    if (leader.role === 'USER') {
      const membersCount = await User.countDocuments({ leader });
      if (membersCount >= app.maxMembers) {
        return parseError(res, 400, `Code ${leader.code} is already in maximum of ${app.maxMembers} members`);
      }

      if (leader.level >= app.maxLevels) {
        return parseError(res, 400, `User level is limited only for ${app.maxLevels - 1} levels`);
      }
    }

    const code = await generateCode();
    const group = leader ? leader.group : code;
    const name = `${req.body.firstName} ${req.body.lastName}`

    const user = await createUser({
      code,
      group,
      name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }, leader)

    await createProfile( {
      user,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    const token = await randomstring.generate();

    const ticket = await createTicket({ user, token });

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
    const ticket = await Ticket.findOne({ token: req.body.token }).populate('user');
    if (!ticket) {
      return parseError(res, 422, { token: 'Token is invalid'});
    }

    const expiredTicket = Date.now() > ticket.expireAt;
    if (expiredTicket) {
      parseError(res, 422, { token: 'Token is already expired'});
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    await ticket.user.updateOne({ password: hashedPassword });

    ticket.remove();

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