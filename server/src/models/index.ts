import { Sequelize } from 'sequelize';

import config from 'app/config/config';

interface Database {
  sequelize: Sequelize;
}

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db: Database = { sequelize };

export default db;
