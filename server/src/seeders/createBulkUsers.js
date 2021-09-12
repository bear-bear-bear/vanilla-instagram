const faker = require('faker');

const users = [...Array(30)].map(() => ({
  phone_number: `+${faker.datatype.number({ min: 821000000000, max: 821099999999 })}`,
  realname: faker.name.firstName(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
  created_at: new Date(),
  updated_at: new Date(),
}));

console.log(users);

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('user', users);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('user', null);
  },
};
