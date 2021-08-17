import { Sequelize } from 'sequelize';

import config from 'app/config/config';

const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    timestamps: true,
  },
});

export default sequelize;
