import { Model, DataTypes } from 'sequelize';

import sequelize from './_sequelize';
import type { Database } from './index';

class Comment extends Model {
  public readonly id!: number;
  public readonly user_id!: number;
  public readonly post_id!: number;
  public content!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;

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
