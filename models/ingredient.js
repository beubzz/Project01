'use strict';

/**
 * Ingredient's model
 *
 * @namespace IngredientModel
 * @property {string} name - Ingredient's name.
 * @property {string} name.required - The property is required.
 * @property {string} name.unique - The property is unique.
 * @property {string} weight - Ingredient's weight.
 * @property {string} price - Ingredient's price.
 * @property {string} price.required - The property is required.
 * @property {string} img - Ingredient's img.
 * @property {string} created_at - Ingredient's creation date.
 */
const mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    ingredientSchema = new Schema({
        name: { type: String, required: true },
        description: { type: String },
        weight: { type: String },
        price: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
        img: { type: Array },
        deleted: { type: Boolean, default: false }
    });

const Ingredient = mongoose.model('Ingredients', ingredientSchema);

// Tentative échouée
ingredientSchema.pre("save", function (next) {
    const currentDate = new Date;
    this.updated_at = currentDate.now;
    next();
});

module.exports = Ingredient;
