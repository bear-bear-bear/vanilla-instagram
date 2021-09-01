import { Model, DataTypes } from 'sequelize';

import sequelize from './_sequelize';
import type { Database } from './index';

class Comment extends Model {
  public readonly id!: number;
  public readonly userId!: number;
  public readonly postId!: number;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  public static associate = (db: Database): void => {
    db.Comment.belongsToMany(db.User, { through: 'comment_like', as: 'CommentLikers' });
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  };
}

Comment.init(
  {
    content: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'comment',
    modelName: 'Comment',
    timestamps: true,
    paranoid: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  }
);

export default Comment;
