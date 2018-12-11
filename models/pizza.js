'use strict';

/**
 * Pizza's model
 *
 * @namespace PizzaModel
 * @property {string} name - Pizza's name.
 * @property {string} name.required - Property is required.
 * @property {string} description - Pizza's description.
 * @property {string} description.required - The property is required.
 * @property {string} price - Pizza's price.
 * @property {string} price.required - The property is required.
 * @property {string} img - Pizza's image.
 * @property {string} img.required - The property is required.
 * @property {Ingredient[]} ingredients - Pizza's ingredients.
 * @property {string} created_at - Pizza's creation date.
 */
const mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    pizzaSchema = new Schema({
        name: { type: String, unique: true, required: true },
        description: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date },
        img: { type: Array },
        long: { type: String },
        lat: { type: String },
        ingredients: [{ type: Schema.Types.Mixed, ref: 'Ingredients' }]
    });

const Pizza = mongoose.model('Pizza', pizzaSchema);

// Tentative échouée
pizzaSchema.pre("save", function (next) {
    const currentDate = new Date;
    this.updated_at = currentDate.now;
    next();
});

module.exports = Pizza;