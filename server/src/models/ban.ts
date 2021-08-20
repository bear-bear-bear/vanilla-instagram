import { Model, DataTypes } from 'sequelize';

import sequelize from './_sequelize';
import type { Database } from './index';

class Ban extends Model {
  public readonly id!: number;
  public readonly user_id!: number;
  public readonly expired_at!: Date | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public static associate = (db: Database): void => {
    db.Ban.belongsTo(db.User);
  };
}

Ban.init(
  {
    expired_at: {
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
