import { Model, DataTypes } from 'sequelize';

import sequelize from './_sequelize';
import type { Database } from './index';

class Image extends Model {
  public readonly id!: number;
  public readonly postId!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  public static associate = (db: Database): void => {
    db.Image.belongsTo(db.Post);
  };
}

Image.init(
  {
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
