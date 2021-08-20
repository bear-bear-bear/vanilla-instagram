import sequelize from './_sequelize';
import Admin from './admin';
import User from './user';
import UserBan from './user-ban';
import Post from './post';
import Hashtag from './hashtag';
import Image from './image';
import Comment from './comment';

const db = {
  sequelize,
  Admin,
  User,
  UserBan,
  Post,
  Hashtag,
  Image,
  Comment,
};

User.associate(db);
UserBan.associate(db);
Post.associate(db);
Hashtag.associate(db);
Image.associate(db);
Comment.associate(db);

export type Database = typeof db;
export default db;
