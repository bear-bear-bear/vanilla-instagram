import sequelize from './sequelize';
import User from './user';

const db = { sequelize, User };

// Object.keys(db).forEach((modelname): void => {
//   if (modelname === 'sequelize') return;
//   if (db[modelname as keyof typeof db].associate) {
//     db[modelname].associate(db);
//   }
// });

// Object.values(db).forEach((Model) => {
//   if ('assosiate' in Model) {
//   }
// });

User.associate(db);

export type Database = typeof db;
export default db;
