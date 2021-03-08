const User = require('../../app/models/User');
const Profile = require('../../app/models/Profile');

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

const adminData = {
  name: 'System Administrator',
  username: 'admin',
  email: 'admin@example.com',
  password: 'Password',
  status: 'ACTIVE',
  role: 'ADMIN'
};

const adminProfileData = {
  firstName: 'System',
  lastName: 'Administrator',
}

const seedUsers = async () => {
  const adminExists = await User.exists({adminData});
  if (adminExists) { return; }

  const user = await createUser(adminData)
  await createProfile({
    ...adminProfileData,
    user
  });
}

module.exports = seedUsers