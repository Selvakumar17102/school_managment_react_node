module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Marks', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      classId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      examId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sectionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      subjectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      exam: Sequelize.INTEGER,
      attendance: Sequelize.INTEGER,
      classTest: Sequelize.INTEGER,
      assignment: Sequelize.INTEGER,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Marks');
  },
};
