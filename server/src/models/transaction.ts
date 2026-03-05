import { DataTypes, Optional, Model, Sequelize } from 'sequelize';

interface TransactionAttributes {
  id: string;
  userId: string;

  type: 'income' | 'expense' | 'transfer';

  accountId: string;
  toAccountId: string | null;

  categoryId?: string;
  amount: number;
  description?: string;
  transactionDate: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

interface TransactionCreationAttributes
  extends Optional<TransactionAttributes, 'id' | 'categoryId' | 'description' | 'toAccountId'> {}

export class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: string;
  public userId!: string;

  public type!: 'income' | 'expense' | 'transfer';

  public accountId!: string;
  public toAccountId!: string | null;
  public categoryId?: string;
  public amount!: number;
  public description?: string;
  public transactionDate!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associateps(models: any) {
    Transaction.belongsTo(models.Category, { 
      foreignKey: 'categoryId', 
      as: 'category',
     });

     Transaction.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
     });

     Transaction.belongsTo(models.Account, {
      foreignKey: 'accountId',
      as: 'account',
     });

     Transaction.belongsTo(models.Account, {
      foreignKey: 'toAccountId',
      as: 'toAccount',
     });

  }

}

export function initTransactionModel(sequelize: Sequelize) {
  Transaction.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('income', 'expense', 'transfer'),
        allowNull: false,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      toAccountId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      transactionDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Transaction',
      tableName: 'Transactions',
      timestamps: true,
    }
  );

  return Transaction;
}
