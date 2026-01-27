import { DataTypes, Optional, Model, Sequelize } from 'sequelize';

interface TransactionAttributes {
  id: string;
  userId: string;
  accountId: string;
  categoryId?: string;
  amount: number;
  description?: string;
  transactionDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TransactionCreationAttributes
  extends Optional<TransactionAttributes, 'id' | 'categoryId' | 'description'> {}

export class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: string;
  public userId!: string;
  public accountId!: string;
  public categoryId?: string;
  public amount!: number;
  public description?: string;
  public transactionDate!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
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
