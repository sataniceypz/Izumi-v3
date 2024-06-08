const { Sequelize, DataTypes } = require('sequelize');
const config = require('../../config');

const modeDB = config.DATABASE.define('mode', {
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

async function getMode() {
  const [mode, created] = await modeDB.findOrCreate({
    where: {},
    defaults: { state: false }
  });

  if (mode) {
    return mode.dataValues.state; // Return the state value
  } else {
    return false; // Return default value if mode is undefined
  }
}

async function updateMode(value) {
  const [mode, created] = await modeDB.findOrCreate({
    where: {},
    defaults: { state: value }
  });

  if (!created) {
    await mode.update({ state: value });
  }

  return mode.dataValues.state; // Return the state value
}

module.exports = {
  modeDB: modeDB,
  getMode: getMode,
  updateMode: updateMode
};
