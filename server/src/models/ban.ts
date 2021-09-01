import { Model, DataTypes } from 'sequelize';

import sequelize from './_sequelize';
import type { Database } from './index';

class Ban extends Model {
  public readonly id!: number;
  public readonly userId!: number;
  public readonly expiredAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate = (db: Database): void => {
    db.Ban.belongsTo(db.User);
  };
}

Ban.init(
  {
    expiredAt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'ban',
    modelName: 'Ban',
    timestamps: true,
  }
);

export default Ban;
