import { Model, DataTypes } from 'sequelize';

import sequelize from './_sequelize';
import type { Database } from './index';

class User extends Model {
  public readonly id!: number;
  public phone_number!: string;
  public realname!: string;
  public username!: string;
  public password!: string;
  public follower_count!: number;
  public following_count!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;

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
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    phone_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
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
    follower_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    following_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    timestamps: true,
    paranoid: true,
  }
);

export default User;
