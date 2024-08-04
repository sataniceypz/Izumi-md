const { DataTypes } = require('sequelize');
const config = require('../../config');

const MenuDB = config.DATABASE.define('menu', {
    value: { type: DataTypes.TEXT }
});

/**
 * Sets the menu value. If no value is provided, it sets the default to an empty string.
 * If a value exists, it updates the value.
 * 
 * @param {Object} param - The parameter object.
 * @param {string} param.value - The menu value to set.
 * @returns {Promise} - A promise that resolves to the created or updated menu entry.
 */
exports.setMenu = async ({ value }) => {
    const menuu = await MenuDB.findAll();
 
    const normalizedValue = value === 'text' ? value : 'button';

    if (!menuu.length) {
        return await MenuDB.create({
            value: normalizedValue
        });
    }
    
    const updateData = { value: normalizedValue };
    return await menuu[0].update(updateData);
};

/**
 * Gets the current menu value. If no value is set, it returns a default value of "button".
 * 
 * @returns {Promise<Object>} - A promise that resolves to the menu value.
 */
exports.getMenu = async () => {
    const menuu = await MenuDB.findAll();
    if (!menuu.length) {
        return { value: "button" };
    }
    return menuu[0].dataValues;
};