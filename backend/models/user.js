// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { 
      type: DataTypes.STRING, 
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: [['admin', 'support', 'agent']], // 🛠️ fixed typo from "inIn" to "isIn"
      },
    },
  }, {
    tableName: 'users',         // ✅ tell Sequelize the exact table name
    freezeTableName: true       // ✅ prevent Sequelize from pluralizing it
  });

  User.associate = function(models) {
    // define associations here if needed later
  };

  return User;
};
