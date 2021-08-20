import { Model, DataTypes } from 'sequelize';

import sequelize from './_sequelize';
import type { Database } from './index';

class Image extends Model {
  public readonly id!: number;
  public readonly post_id!: number;
  public name!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;

  public static associate = (db: Database): void => {
    db.Image.belongsTo(db.Post);
  };
}

Image.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'image',
    modelName: 'Image',
    timestamps: true,
    paranoid: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  }
);

export default Image;
