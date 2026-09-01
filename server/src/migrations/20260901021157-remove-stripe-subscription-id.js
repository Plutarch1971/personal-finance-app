"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn("Users", "stripeSubscriptionId");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "stripeSubscriptionId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
