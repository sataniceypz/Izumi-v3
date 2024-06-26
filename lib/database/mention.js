const { DataTypes } = require('sequelize');
const config = require('../../config');

const MentionDB = config.DATABASE.define('men', {
    value: { type: DataTypes.TEXT },
    isEnable: { type: DataTypes.BOOLEAN }
});

exports.setMention = async ({ value, isEnable }) => {
    const mentions = await MentionDB.findAll();
    
    if (!mentions.length) {
        return await MentionDB.create({
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
    
    return await mentions[0].update(updateData);
};

exports.getMention = async () => {
    const mentions = await MentionDB.findAll();
    if (!mentions.length) {
        return { isEnable: false };
    }
    return mentions[0].dataValues;
};
