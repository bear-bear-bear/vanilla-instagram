import { Model, DataTypes } from 'sequelize';

import sequelize from './_sequelize';
import type { Database } from './index';

class User extends Model {
  public readonly id!: number;
  public phonNumber!: string;
  public realname!: string;
  public username!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  public static associate = (db: Database): void => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'post_like', as: 'PostLiked' });
    db.User.belongsToMany(db.Comment, { through: 'comment_like', as: 'CommentLiked' });
    db.User.belongsToMany(db.User, {
      through: 'follow',
      as: 'Followers',
      foreignKey: 'follower_id',
      timestamps: false,
    });
    db.User.belongsToMany(db.User, {
      through: 'follow',
      as: 'Followings',
      foreignKey: 'following_id',
      timestamps: false,
    });
  };
}

User.init(
  {
    phoneNumber: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    realname: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'user',
    modelName: 'User',
    timestamps: true,
    paranoid: true,
  }
);

export default User;
