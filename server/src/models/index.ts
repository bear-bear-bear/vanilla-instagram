import sequelize from './_sequelize';
import Admin from './admin';
import Ban from './ban';
import User from './user';
import Post from './post';
import Hashtag from './hashtag';
import Image from './image';
import Comment from './comment';

const db = {
  sequelize,
  Admin,
  Ban,
  User,
  Post,
  Hashtag,
  Image,
  Comment,
};

User.associate(db);
Ban.associate(db);
Post.associate(db);
Hashtag.associate(db);
Image.associate(db);
Comment.associate(db);

export const connectDB = async ({ keep = true, logging = false } = {}): Promise<void> => {
  try {
    const syncPromise = () =>
      db.sequelize.sync({
        force: false,
        logging,
      });
    if (!keep) {
      await syncPromise().finally(() => db.sequelize.close());
      return;
    }
    await syncPromise();
  } catch (err) {
    console.error(err);
  }
};

export type Database = typeof db;
export default db;
