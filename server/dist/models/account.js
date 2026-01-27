'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Account extends Model {
        static associate(models) {
            Account.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });
        }
    }
    Account.init({
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Account',
        timestamps: true
    });
    return Account;
};
