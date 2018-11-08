'use strict';
/**
 * Ingredients' controller.
 * @namespace IngredientController
 */
 
const express = require('express');
const router = express.Router();
const Ingredient = require('../models/ingredient');
// ************************************************************************** //
//                                ROUTES                                      //
// ************************************************************************** //
router.get('/', (req, res, next) => {
    if (req.query) {
        getSearchedIngredients(req, res, next);
    } else {
        getIngredients(req, res, next);
    }
});

router.get('/:id', (req, res, next) => {
  getIngredientById(req, res, next);
});

router.post('/', (req, res, next) => {
    postIngredient(req, res, next);
});

router.put('/:id', (req, res, next) => {
  putIngredient(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  deleteIngredient(req, res, next);
});


// ************************************************************************** //
//                                FONCTIONS                                   //
// ************************************************************************** //
/**
 * Find all ingredients
 *
 * @function getIngredients
 * @memberof IngredientController
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise.<void>} Call res.status() with a status code to say what happens and res.json() to send data if there is any.
 */
function getIngredients(req, res, next){
    Ingredient.find({}, (err, ingredients) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            
            res.status(200).send(ingredients);
        }
    })
    .exec(function (err, story) {
        if (err) return console.log(err);
    });
    
}

/**
 * Find all ingredients
 *
 * @function getIngredients
 * @memberof IngredientController
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise.<void>} Call res.status() with a status code to say what happens and res.json() to send data if there is any.
 */
function getSearchedIngredients(req, res, next){

    const queryName = req.query.q;

    Ingredient.find({"name" : new RegExp(queryName, 'i')}, (err, ingredients) => {
        // console.log(queryName);
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send(ingredients);
        }
    })
    .exec(function (err, story) {
        if (err) return console.log(err);
    });
    
}

/**
 * Find ingredient by ID
 *
 * @function getIngredientById
 * @memberof IngredientController
 * @param {Object} req - Request object.
 * @param {string} req.params.id - Ingredient's ID to find.* @param {Object} res - Response object.
 * @returns {Promise.<void>} Call res.status() with a status code to say what happens and res.json() to send data if there is any.
 */
function getIngredientById(req, res, next){
    
     Ingredient.findById(req.params.id, (err, ingredient) => {
        if (err) {
            res.status(500).send(err)
        } else if (ingredient === null) {
            res.status(404).send(`Aucun ingredient trouvé avec cet identifiant...`);
        } else {
            res.status(200).send(ingredient);
        }
    }); 
    
}

/**
 * Post new Ingredient
 *
 * @function postIngredient
 * @memberof IngredientController
 * @param {Object} req - Request object.
 * @param {string} req.params.id - Ingredient's ID to find.
 * @param {string} req.query.name - Ingredient's name to query.
 * @param {string} req.query.description - Ingredient's description to query.
 * @param {string} req.query.price - Ingredient's price to query.
 * @param {string} req.query.img - Ingredient's image to query.
 * @param {Object} res - Response object.
 * @returns {Promise.<void>} Call res.status() with a status code to say what happens and res.json() to send data if there is any.
 */
function postIngredient(req, res, next){
    
    const ingredient = new Ingredient(req.body);
    // console.log(ingredient);
    ingredient.save((err, ingredient) => {
        if (err) {
            // console.log(err);
            res.status(500).send(err);
        }
        res.status(200).send(ingredient);
    });
}

/**
 * Put Ingredient
 *
 * @function putIngredient
 * @memberof IngredientController
 * @param {Object} req - Request object.
 * @param {string} req.params.id - Ingredient's ID to update.
 * @param {string} req.query.name - Ingredient's name to query.
 * @param {string} req.query.description - Ingredient's description to query.
 * @param {string} req.query.weight - Ingredient's weight to query.
 * @param {string} req.query.price - Ingredient's price to query.
 * @param {string} req.query.img - Ingredient's image to query.
 * @param {Object} res - Response object.
 * @returns {Promise.<void>} Call res.status() with a status code to say what happens and res.json() to send data if there is any.
 */
function putIngredient(req, res, next){

    let ingredient = {};
    ingredient.name = req.body.name || ingredient.name;
    ingredient.weight = req.body.weight || ingredient.weight;
    ingredient.description = req.body.description || ingredient.description;
    ingredient.img = req.body.img || ingredient.img;
    ingredient.price = req.body.price || ingredient.price;
    ingredient.deleted = req.body.deleted || ingredient.deleted;
    ingredient.updated_at = new Date;


    Ingredient.findOneAndUpdate({_id: req.params.id}, ingredient, { new: true }, (err, ingredient) => {
        if (err) {
            res.status(500).send(err);
        } else if (ingredient === null) {
            res.status(404).send('Aucun ingredient trouvé avec cet Identifiant...');
        } else {
            res.status(200).send(ingredient);
        }
    });
    
}

/**
 * Delete Ingredient
 *
 * @function deleteIngredient
 * @memberof IngredientController
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise.<void>} Call res.status() with a status code to say what happens and res.json() to send data if there is any.
 */
function deleteIngredient(req, res, next){
    
    Ingredient.findByIdAndRemove(req.params.id, (err, ingredient) => {
        if (err) {
            res.status(500).send(err);
        } else if (ingredient === null) {
            res.status(404).send(`Aucun ingredient trouvé avec cet identifiant...`);
        } else {
            let response = {
                message: `L'ingredient ${req.params.id} a été correctement supprimé`,
                ingredient: ingredient
            };
            res.status(200).send(response);
        }
        next();
    });
    
}

module.exports = router;