import { Sequelize } from 'sequelize';

import sequelize from './sequelize';

interface Database {
  sequelize: Sequelize;
}

const db: Database = { sequelize };

export default db;
