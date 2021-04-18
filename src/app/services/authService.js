const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {auth, app} = require('../../../config');
const userService = require('./userService');
const profileService = require('./profileService');
const walletService = require('./walletService');
const ticketService = require('./ticketService');
const Error = require('../helpers/errorHelper');

const newTicketEventEmitter = require('../events/newTicketEvent');

const generateCode = async (session) => {
  const count = await userService.countUsers({}, session);
  const currentDate = new Date();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  const number = count.toString().padStart(4, '0');
  return `${month}${year}${number}`;
};

const generateAccessToken = user => {
  try {
    return JWT.sign({
      iss: 'User',
      sub: user.id,
      iat: new Date().getTime(), // Current time
      exp: new Date().setDate(new Date().getDate() + 1) //Current time plus 1 day ahead
    }, auth.clientSecret);
  } catch (e) {
    throw e;
  }
};

const createUser = async (data, session) => {
  try {
    const emailExist = await userService.retrieveUser({email: data.email}, session);
    if (emailExist) {
      Error.unprocessableEntity({email: 'Email is already exist.'});
    }

    const usernameExist = await userService.retrieveUser({username: data.username}, session);
    if (usernameExist) {
      Error.unprocessableEntity({username: 'Username is already exist.'});
    }

    const leader = await userService.retrieveUser({code: data.code}, session);

    if (leader['role'] === 'USER') {
      const membersCount = await userService.countUsers({leader}, session);
      if (membersCount >= app.maxMembers) {
        Error.badRequest(`Code ${leader['code']} is already in maximum of ${app.maxMembers} members`);
      }

      if (leader['level'] >= app.maxLevels) {
        Error.badRequest(`User level is limited only for ${app.maxLevels} levels`);
      }
    }

    const code = await generateCode(session);
    const group = leader && leader['level'] !== 0 ? leader['group'] : code;
    const name = `${data.firstName} ${data.lastName}`

    const user = await userService.createUser({
      code,
      group,
      name,
      username: data.username,
      email: data.email,
      password: data.password
    }, leader, session)

    await profileService.createProfile({
      user,
      firstName: data.firstName,
      lastName: data.lastName,
    }, session);

    await walletService.createWallet({owner: user}, session);

    const ticket = await ticketService.createTicket({owner: user}, session);

    newTicketEventEmitter.emit('sendVerifyEmailLink', user['name'], user['email'], ticket['token']);

    return user;
  } catch (e) {
    throw e;
  }
};

const forgotPassword = async (data, session) => {
  try {
    const owner = await userService.retrieveUser({email: data.email}, session);
    if (!owner) {
      Error.unprocessableEntity({email: 'Email is invalid'});
    }

    const ticket = await ticketService.createTicket({owner}, session);

    newTicketEventEmitter.emit('sendResetPasswordLink', owner['name'], owner['email'], ticket['token']);

    return ticket;
  } catch (e) {
    throw e;
  }
};

const resetPassword = async (data, session) => {
  try {
    const ticket = await ticketService.retrieveTicket({token: data.token}, session);
    if (!ticket) {
      Error.unprocessableEntity({token: 'Token is invalid'});
    }

    if (Date.now() > ticket['expireAt']) {
      Error.unprocessableEntity({token: 'Token is already expired'});
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await ticket['owner'].updateOne({password: hashedPassword}).session(session);

    await ticket.remove();

    return ticket;
  } catch (e) {
    throw e;
  }
};

const verifyEmail = async (data, session) => {
  try {
    const ticket = await ticketService.retrieveTicket({token: data.token}, session);
    if (!ticket) {
      Error.badRequest('Token is invalid');
    }

    if (Date.now() > ticket['expireAt']) {
      Error.badRequest('Token is already expired');
    }

    await ticket['owner'].updateOne({status: 'ACTIVE'}).session(session);

    await ticket.remove();

    return ticket['owner'];
  } catch (e) {
    throw e;
  }
};

const resendVerifyEmailLink = async (data, session) => {
  try {
    const owner = await userService.retrieveUser({email: data.email}, session);
    if (!owner) {
      Error.unprocessableEntity({email: 'Email is invalid'});
    }

    if (owner['status'] === 'ACTIVE') {
      // return res.status(200).json({message: 'Email is already verified'});
    }

    const ticket = await ticketService.createTicket({owner}, session);

    newTicketEventEmitter.emit('sendVerifyEmailLink', owner['name'], owner['email'], ticket['token']);

    return ticket;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  generateAccessToken,
  createUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerifyEmailLink
}