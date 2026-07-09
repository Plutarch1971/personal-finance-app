import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface UserAttributes {
  id: string;
  username: string;
  email: string;
  passwordHash: string;

  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;

  trialStartDate: Date | null;
  trialEndDate: Date | null;

  subscriptionStatus: string;
  subscriptionId: string | null;

  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 
    | 'id'
    | 'resetPasswordToken'
    | 'resetPasswordExpires'
    | 'trialStartDate'
    | 'trialEndDate'
    | 'subscriptionStatus'
    | 'subscriptionId'
    | 'stripeCustomerId'
    | 'stripeSubscriptionId'
    | 'createdAt'
    | 'updatedAt'
> {}

export class User extends Model<UserAttributes, UserCreationAttributes> 
implements UserAttributes 
{
  public id!: string;
  public username!:string;
  public email!: string;
  public passwordHash!: string;
  public resetPasswordToken!: string | null;
  public resetPasswordExpires!: Date | null;

  public trialStartDate!: Date | null;
  public trialEndDate!: Date | null;
  public subscriptionStatus!: string;
  public subscriptionId!: string | null;
  public stripeCustomerId!: string | null;
  public stripeSubscriptionId!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;


    static associate(models: any) {
      User.hasMany(models.Account, {
        foreignKey: 'userId',
        as: 'accounts',
      });

      User.hasMany(models.Transaction, {
        foreignKey: 'userId',
        as: 'transactions',
      });
      User.hasMany(models.Category, {
        foreignKey: 'userId',
        as: 'categories',
      });

      User.hasMany(models.Budget, {
        foreignKey: 'userId',
        as: 'budgets',
        });
      }
    }
  export function initUserModel(sequelize: Sequelize) {
    User.init({
      id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true 
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 50],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        },
      passwordHash: {
        type:DataTypes.STRING,
        allowNull: false,  
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      trialStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      trialEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      subscriptionStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'trial',
      },
      subscriptionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stripeCustomerId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
        stripeSubscriptionId: {
          type: DataTypes.STRING,
          allowNull: true,
        },

  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true
  }
  );
  return User;
  }


