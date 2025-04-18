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
        inIn: [['admin', 'support', 'agent']],
      } },
  });

  User.associate = function(models) {
    // define associations here if needed later
  };

  return User;
};
