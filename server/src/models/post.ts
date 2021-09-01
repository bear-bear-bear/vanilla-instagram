import { Model, DataTypes } from 'sequelize';

import sequelize from './_sequelize';
import type { Database } from './index';

class Post extends Model {
  public readonly id!: number;
  public readonly userId!: number;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  public static associate = (db: Database): void => {
    db.Post.belongsToMany(db.Hashtag, { through: 'post_hashtag' });
    db.Post.belongsToMany(db.User, { through: 'post_like', as: 'PostLikers' });
    db.Post.belongsTo(db.User);
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
  };
}

Post.init(
  {
    content: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'post',
    modelName: 'Post',
    timestamps: true,
    paranoid: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  }
);

export default Post;
