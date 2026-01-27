// src/models/Category.ts

import { Sequelize, DataTypes, Optional, Model } from 'sequelize';

interface CategoryAttributes {
  id: string;
  name: string;
  type: 'Expense' | 'Income';
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
  public name!: string;
  public type!: 'Expense' | 'Income';
  public parentId?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Category.hasMany(models.Category, { foreignKey: 'parentId', as: 'children' });
    Category.belongsTo(models.Category, { foreignKey: 'parentId', as: 'parent' });
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
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('Expense', 'Income'),
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
