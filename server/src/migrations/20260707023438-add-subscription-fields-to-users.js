"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "trialStartDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "trialEndDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "subscriptionStatus", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "trial",
    });

    await queryInterface.addColumn("Users", "subscriptionId", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "stripeCustomerId", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "stripeSubscriptionId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "trialStartDate");
    await queryInterface.removeColumn("Users", "trialEndDate");
    await queryInterface.removeColumn("Users", "subscriptionStatus");
    await queryInterface.removeColumn("Users", "subscriptionId");
    await queryInterface.removeColumn("Users", "stripeCustomerId");
    await queryInterface.removeColumn("Users", "stripeSubscriptionId");
  },
};
