import { Sequelize } from 'sequelize';

import config from 'app/config/config';

const sequelize = new Sequelize(config.database, config.username, config.password, config);

export default sequelize;
