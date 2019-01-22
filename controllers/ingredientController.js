'use strict';
/**
 * Ingredients' controller.
 * @namespace IngredientController
 */
 
const express = require('express');
const router = express.Router();
const Ingredient = require('../models/ingredient');
var formidable = require('formidable');

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

router.post('/:id', (req, res, next) => {
    updateIngredient(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  deleteIngredient(req, res, next);
});

router.get('/img/:name', function (req, res, next) {

    var options = {
        root: './uploads/',
        headers: {
            'Content-Type': 'image/png, image/PNG, image/jpg, image/JPG'
        }
    };

    var fileName = req.params.name;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });

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

    // init de notre object qui sera utilisé et renvoyé
    let ingredient = null;

    // init du formulaire d'entré en tant que Formidable Form
    var form = new formidable.IncomingForm();

    // parse de la request passé
    form.parse(req);

    // représente un forEach files et nous permet d'uploader les fichier dans le dossier uploads
    form.on('fileBegin', function (name, file) {
        file.path = './uploads/' + file.name;
        // console.log(file.path);
    });

    /*
    Ne pas supprimer au cas pour une progress bar
    form.on('fileEnd', function (name, file){
        // console.log(file);
        // file.path = './uploads/' + file.name;
        console.log('------------ c est passé !!! ----------------');
    });
    */

    // si il y a bien des champs dans le formulaire (autre que des fichiers)
    form.on('field', function (field, value) {
        // initialisation de notre object avec les bonnes valeurs
        ingredient = new Ingredient(JSON.parse(value));
        // Si cet objet est correct :
        if (ingredient) {
            // on save notre object remplie en base !
            ingredient.save((err, piz) => {
                if (err) {
                    // console.log(err);
                    res.status(500).send(err);
                } else {
                    // console.log(piz);
                    res.status(200).send(piz);
                    // SOCKET
                    // global.io.emit('[ingredient][post]', ingredient);
                    // global.io.emit('[Toast][new]', { type: 'success', title: `Nouvelle ingredient`, message: 'Une nouvelle ingredient a été ajoutée !' });
                }
            });
        }
    })
}


/**
 * Update Ingredient in POST not PUT
 *
 * @function updateIngredient
 * @memberof IngredientController
 * @param {Object} req - Request object.
 * @param {string} req.params._id - Ingredient's ID to find.
 * @param {string} req.query.name - Ingredient's name to query.
 * @param {string} req.query.description - Ingredient's description to query.
 * @param {string} req.query.img - Ingredient's image to query.
 * @param {string} req.query.weight - Ingredient's weight to query.
 * @param {string} req.query.price - Ingredient's price to query.
 * @param {string} req.query.deleted - Ingredient's deleted to query.
 * @param {Object} res - Response object.
 * @returns {Promise.<void>} Call res.status() with a status code to say what happens and res.json() to send data if there is any.
 */
function updateIngredient(req, res, next){
    
    // init de notre object qui sera utilisé et renvoyé
    let ingredient = null;

    // init du formulaire d'entré en tant que Formidable Form
    var form = new formidable.IncomingForm();

    // parse de la request passé
    form.parse(req);

    // représente un forEach files et nous permet d'uploader les fichier dans le dossier uploads
    form.on('fileBegin', function (name, file) {
        file.path = './uploads/' + file.name;
        // console.log(file.path);
    });

    // si il y a bien des champs dans le formulaire (autre que des fichiers)
    form.on('field', function (field, value) {
        // initialisation de notre object avec les bonnes valeurs
        ingredient = new Ingredient(JSON.parse(value));
        // Si cet objet est correct :
        if (ingredient) {
            ingredient.updated_at = new Date;

            // on save notre object remplie en base !
            Ingredient.findOneAndUpdate({ _id: ingredient._id }, ingredient, { new: true }, (err, ingredient) => {
                if (err) {
                    res.status(500).send(err);
                } else if (ingredient === null) {
                    res.status(404).send('Aucun ingredient trouvé avec cet Identifiant...');
                } else {
                    res.status(200).send(ingredient);
                }
            });
        }
    })  
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