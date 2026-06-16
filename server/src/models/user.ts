import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface UserAttributes {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public username !:string;
  public email!: string;
  public passwordHash!: string;
  public resetPasswordToken!: string | null;
  public resetPasswordExpires!: Date | null;

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
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    timestamps: true
  });
  return User;
}
