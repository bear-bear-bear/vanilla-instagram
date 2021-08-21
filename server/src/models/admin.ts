import { Model, DataTypes } from 'sequelize';

import sequelize from './_sequelize';

class Admin extends Model {
  public readonly id!: number;
  public username!: string;
  public password!: string;
  public readonly expired_at!: Date | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

Admin.init(
  {
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    expired_at: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'admin',
    modelName: 'Admin',
    timestamps: true,
    paranoid: true,
  }
);

export default Admin;
