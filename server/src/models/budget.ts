import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import sequelize from '../config/connection';
import { Category } from './category';
import { User } from './user';

export interface BudgetAttributes {
    id: string;
    userId: string;
    categoryId: string;
    amount: number;
    month: string; //YYYY-MM-DD
    createdAt?: Date;
    updatedAt?: Date;

}

// For creation (id optional)
export interface BudgetCreationAttributes 
extends Optional<BudgetAttributes, 'id'> {}

export class Budget
extends Model<BudgetAttributes, BudgetCreationAttributes>
implements BudgetAttributes
{
    public id!: string;
    public userId!: string;
    public categoryId!: string;
    public amount!: number;
    public month!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export function initBudgetModel(sequelize: Sequelize) {
    Budget.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
              },

              userId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
              },

              categoryId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Categories',
                    key: 'id'
                }
              },

              amount: {
                type: DataTypes.DECIMAL(12,2),
                allowNull: false,
                get(this: Budget){
                    const value = this.getDataValue('amount');
                    return value ? parseFloat(String(value)) : 0;
                },
                validate: {
                    isDecimal: true,
                    min: { args: [0], msg: 'Amount must be >=0' }
                }
              },

              month: {
                type: DataTypes.DATEONLY,
                allowNull: false,
              },
        },
        {
            sequelize,
            modelName: 'Budget',
            tableName: 'Budgets',
            timestamps: true,
            indexes: [{fields: ['userId'], 
                name: 'idx_budgets_user_id'},
            { unique: true, 
            fields: ['userId', 'categoryId', 'month'],
            name: 'unique_user_category_month_budget'}
        ],
        }
    );
    Budget.addScope('currentMonth', () => ({
        where: {
            month: new Date().toISOString().slice(0,7)+ '-01'
        }
    }));
    return Budget;
}