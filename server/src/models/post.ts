import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize';

class Post extends Model {
  public readonly id!: number;
  public user_id!: string;
  public Post_id!: string;
  public readonly created_at!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    paranoid: true,
  }
);

export default Post;
