// src/models/Account.ts

import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type AccountType =
  | 'checking'
  | 'savings'
  | 'credit'
  | 'cash'
  | 'investment'
  | 'wallet';

export interface AccountAttributes {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  currency: string;
  initialBalance: number;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AccountCreationAttributes
  extends Optional<
    AccountAttributes,
    'id' | 'initialBalance' | 'balance' | 'createdAt' | 'updatedAt'
  > {}

export class Account
  extends Model<AccountAttributes, AccountCreationAttributes>
  implements AccountAttributes
{
  public id!: string;
  public userId!: string;
  public name!: string;
  public type!: AccountType;
  public currency!: string;
  public initialBalance!: number;
  public balance!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Account.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Account.hasMany(models.Transaction, { foreignKey: 'accountId', as: 'transactions' });
  }
}

export function initAccountModel(sequelize: Sequelize) {
  Account.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(
          'checking',
          'savings',
          'credit',
          'cash',
          'investment',
          'wallet'
        ),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        validate: {
          len: [3, 3],
        },
      },
      initialBalance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      balance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
    },
    {
      sequelize,
      modelName: 'Account',
      tableName: 'Accounts',
      timestamps: true,
      indexes: [{ fields: ['userId'] }],
    }
  );

  return Account;
}
