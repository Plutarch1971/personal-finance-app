import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface UserAttributes {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public username !:string;
  public email!: string;
  public passwordHash!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initUserModel(sequelize: Sequelize) {
  User.init({
    id: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true 
    },
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
  }, {
    sequelize,
    timestamps: true
  });
  return User;
}
