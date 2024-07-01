const { DataTypes } = require('sequelize');
const config = require('../../config');

const PmbDB = config.DATABASE.define('pmblocker', {
    value: { type: DataTypes.TEXT },
    isEnable: { type: DataTypes.BOOLEAN }
});

exports.setPmb = async ({ value, isEnable }) => {
    const Pmbs = await PmbDB.findAll();
    
    if (!Pmbs.length) {
        return await PmbDB.create({
            value: value || '',
            isEnable: typeof isEnable !== 'undefined' ? isEnable : false
        });
    }
    
    const updateData = {};
    if (value !== undefined) {
        updateData.value = value;
    }
    if (isEnable !== undefined) {
        updateData.isEnable = isEnable;
    }
    
    return await Pmbs[0].update(updateData);
};

exports.getPmb = async () => {
    const Pmbs = await PmbDB.findAll();
    if (!Pmbs.length) {
        return { isEnable: false };
    }
    return Pmbs[0].dataValues;
};
