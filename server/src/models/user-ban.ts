import { Model, DataTypes } from 'sequelize';

import sequelize from './_sequelize';
import type { Database } from './index';

class UserBan extends Model {
  public readonly id!: number;
  public readonly user_id!: number;
  public readonly expired_at!: Date | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public static associate = (db: Database): void => {
    db.UserBan.belongsTo(db.User);
  };
}

UserBan.init(
  {
    expired_at: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'user_ban',
    modelName: 'UserBan',
    timestamps: true,
  }
);

export default UserBan;
