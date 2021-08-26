import { Sequelize } from 'sequelize';

import config from 'src/config/config';

const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    underscored: true,
  },
});

export default sequelize;
