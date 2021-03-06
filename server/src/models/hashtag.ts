import { Model, DataTypes } from 'sequelize';

import sequelize from './_sequelize';
import type { Database } from './index';

class Hashtag extends Model {
  public readonly id!: number;
  public readonly userId!: number;
  public name!: string;

  public static associate = (db: Database): void => {
    db.Hashtag.belongsToMany(db.Post, { through: 'post_hashtag' });
  };
}

Hashtag.init(
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'hashtag',
    modelName: 'Hashtag',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  }
);

export default Hashtag;
