// src/models/Category.ts
import { Sequelize, DataTypes, Optional, Model } from 'sequelize';

interface CategoryAttributes {
  id: string;
  userId: string;
  name: string;
  type: 'income' | 'expense';
  parentId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, 'id' | 'parentId' | 'createdAt' | 'updatedAt'> {}

export class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: string;
  public userId!: string; 
  public name!: string;
  public type!: 'income' | 'expense';
  public parentId?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Category.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Category.hasMany(models.Category, { foreignKey: 'parentId', as: 'children' });
    Category.belongsTo(models.Category, { foreignKey: 'parentId', as: 'parent' });
    Category.hasMany(models.Transaction, { foreignKey: 'categoryId', as: 'transactioins',});
  }
}

export function initCategoryModel(sequelize: Sequelize) {
  Category.init(
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
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false,
      },
      parentId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'Categories',
      timestamps: true,
    }
  );

  return Category;
}
