import { Model, DataTypes } from 'sequelize';

import sequelize from './_sequelize';

class Admin extends Model {
  public readonly id!: number;
  public username!: string;
  public password!: string;
  public readonly expiredAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
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
    expiredAt: {
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
