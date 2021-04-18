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
  try {
    const newUsers = [];
    const adminExists = await User.exists({email: adminData.email});
    if (!adminExists) {
      const user = await createUser(adminData)
      await createProfile({
        ...adminProfileData,
        user
      });
      newUsers.push(user);
    }
    newUsers.length && console.log(`Seeded ${newUsers.length} new users`);
  } catch (e) {
    console.log('Error!', e.message);
  }
}

module.exports = seedUsers