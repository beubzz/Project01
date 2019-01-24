'use strict';

/**
 * Pizzas' controller.
 * @namespace PizzaController
 */

const express = require('express');
const router = express.Router();
const Pizza = require('../models/pizza');
const formidable = require('formidable');
const fs = require('fs');


// ************************************************************************** //
//                                ROUTES                                      //
// ************************************************************************** //
router.get('/', (req, res, next) => {
    getPizzas(req, res, next);
});

router.get('/:id', (req, res, next) => {
    getPizzaById(req, res, next);
});

router.post('/', function (req, res, next) {
    postPizza(req, res, next);
});

router.post('/:id', (req, res, next) => {
    updatePizza(req, res, next);
});

router.delete('/:id', (req, res, next) => {
    deletePizza(req, res, next);
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
 * Find all pizzas
 *
 * @function getPizzas
 * @memberof PizzaController
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise.<void>} Call res.status() with a status code to say what happens and res.json() to send data if there is any.
 */
function getPizzas(req, res, next) {

    Pizza.find((err, pizza) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(pizza);
        }
    }).sort({ created_at: 'desc' })
    /*.populate({
        match: { deleted: false }
    })*/.exec(function (err, story) {
            if (err) return console.log(err);
        });

}

/**
 * Get Pizza By Id
 *
 * @function getPizzaById
 * @memberof PizzaController
 * @param {Object} req - Request object.
 * @param {string} req.params.id - Pizza's ID to find.
 * @param {Object} res - Response object.
 * @returns {Promise.<void>} Call res.status() with a status code to say what happens and res.json() to send data if there is any.
 */
function getPizzaById(req, res, next) {

    Pizza.findById(req.params.id, (err, pizza) => {
        if (err) {
            res.status(500).send(err)
        } else if (pizza === null) {
            res.status(404).send('Pas de pizza trouvé avec cet Identifiant...')
        } else {
            res.status(200).send(pizza)
        }
    }).populate({
        path: 'ingredients',
        match: { deleted: false }
    }).exec(function (err, story) {
        if (err) return console.log(err);
    });

}

/**
 * Post new Pizza
 *
 * @function postPizza
 * @memberof PizzaController
 * @param {Object} req - Request object.
 * @param {string} req.params.id - Pizza's ID to find.
 * @param {string} req.query.name - Pizza's name to query.
 * @param {string} req.query.description - Pizza's description to query.
 * @param {string} req.query.price - Pizza's price to query.
 * @param {string} req.query.img - Pizza's image to query.
 * @param {Object} res - Response object.
 * @returns {Promise.<void>} Call res.status() with a status code to say what happens and res.json() to send data if there is any.
 */
function postPizza(req, res, next) {
    // init de notre object qui sera utilisé et renvoyé
    let pizza = null;

    // init du formulaire d'entré en tant que Formidable Form
    var form = new formidable.IncomingForm();

    // parse de la request passé
    form.parse(req);

    // représente un forEach files et nous permet d'uploader les fichier dans le dossier uploads
    form.on('fileBegin', function (name, file) {
        /*fs.readdir('./uploads/', (err, data) => {
            if (err) throw err;
            console.log(data);
            console.log(file.name);
            data.forEach(element => {
                if (element == file.name) { // mettre en place une config pour (metre a jours l'image ou ajouter l'image name-x)
                    var filename = file.name.split(/\.(?=[^\.]+$)/);
                    console.log(filename);
                    file.name = filename[0] + '-copie.' + filename[1];
                    fs.rename(file.path, './uploads/' + file.name);
                    console.log(file.name);
                    file.path = './uploads/' + file.name;
                } else if (element == data[data.length - 1]) {
                    file.path = './uploads/' + file.name;
                }
            });
        });*/
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
        pizza = new Pizza(JSON.parse(value));
        // console.log(pizza);
        // Si cet objet est correct :
        if (pizza) {
            // mettre en place le changement des noms d'images si on faits ca !
            // on save notre object remplie en base !
            pizza.save((err, piz) => {
                if (err) {
                    // console.log(err);
                    res.status(500).send(err);
                } else {
                    // console.log(piz);
                    res.status(200).send(piz);
                    // SOCKET
                    // global.io.emit('[Pizza][post]', pizza);
                    // global.io.emit('[Toast][new]', { type: 'success', title: `Nouvelle Pizza`, message: 'Une nouvelle pizza a été ajoutée !' });
                }
            });
        }
    })
}


/**
 * Update Pizza in POST not PUT
 *
 * @function updatePizza
 * @memberof PizzaController
 * @param {Object} req - Request object.
 * @param {string} req.params._id - pizza's ID to find.
 * @param {string} req.query.name - pizza's name to query.
 * @param {string} req.query.description - pizza's description to query.
 * @param {string} req.query.img - pizza's image to query.
 * @param {string} req.query.lat - pizza's lat to query.
 * @param {string} req.query.long - pizza's long to query.
 * @param {string} req.query.ingredients - pizza's ingredients to query.
 * @param {Object} res - Response object.
 * @returns {Promise.<void>} Call res.status() with a status code to say what happens and res.json() to send data if there is any.
 */
function updatePizza(req, res, next) {

    // init de notre object qui sera utilisé et renvoyé
    let pizza = null;

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
        pizza = new Pizza(JSON.parse(value));
        // Si cet objet est correct :
        if (pizza) {
            pizza.updated_at = new Date;

            // on save notre object remplie en base !
            Pizza.findOneAndUpdate({ _id: pizza._id }, pizza, { new: true }, (err, pizza) => {
                if (err) {
                    res.status(500).send(err);
                } else if (pizza === null) {
                    res.status(404).send('Aucun pizza trouvé avec cet Identifiant...');
                } else {
                    res.status(200).send(pizza);
                }
            });
        }
    })    
}


/**
 * Put Pizza
 *
 * @function putPizza
 * @memberof PizzaController
 * @param {Object} req - Request object.
 * @param {string} req.params.id - Pizza's ID to update.
 * @param {string} req.query.name - Pizza's name to query.
 * @param {string} req.query.description - Pizza's description to query.
 * @param {string} req.query.price - Pizza's price to query.
 * @param {string} req.query.img - Pizza's image to query.
 * @param {Object} res - Response object.
 * @returns {Promise.<void>} Call res.status() with a status code to say what happens and res.json() to send data if there is any.
 */
function putPizza(req, res, next) {

    var pizza = {};
    pizza.name = req.body.name || pizza.name;
    pizza.img = req.body.img || pizza.img;
    pizza.long = req.body.long || pizza.long;
    pizza.lat = req.body.lat || pizza.lat;
    pizza.description = req.body.description || pizza.description;
    pizza.updated_at = new Date;
    pizza.ingredients = req.body.ingredients || pizza.ingredients;

    Pizza.findOneAndUpdate({ _id: req.params.id }, pizza, { new: true }, (err, pizza) => {
        if (err) {
            res.status(500).send(err);
        } else if (pizza === null) {
            res.status(404).send('Pas de pizza trouvé avec cet Identifiant...');
        } else {
            res.status(200).send(pizza);
            // SOCKET
            global.io.emit('[Pizza][put]', pizza);
            global.io.emit('[Toast][new]', { type: 'warning', title: `Pizza ${pizza.name} améliorée`, message: 'Découvrez les améliorations !' });
        }
    });

}

/**
 * Delete Pizza
 *
 * @function deletePizza
 * @memberof PizzaController
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise.<void>} Call res.status() with a status code to say what happens and res.json() to send data if there is any.
 */
function deletePizza(req, res, next) {

    Pizza.findByIdAndRemove(req.params.id, (err, pizza) => {
        let mess = `La pizza ${req.params.id} a été correctement supprimée`;
        let notFoundImg = false;
        if (err) {
            res.status(500).send(err);
        } else if (pizza === null) {
            res.status(404).send('Aucune pizza trouvée avec cet identifiant...');
        } else {
            pizza.img.forEach(element => {
                fs.unlink('uploads/' + element, (err) => {
                    if (err) {
                        // console.log(err);
                        notFoundImg = true;
                        // throw err;
                    } else {
                        console.log(element + ' was deleted');
                    }
                });
            });

            if (!notFoundImg) {
                mess = `La pizza ${req.params.id} a été correctement supprimée, mais le(s) image(s) associée(s) n'existé pas ou plus.`
            }
            
            let response = {
                message: mess,
                pizza: pizza
            };
            res.status(200).send(response);
            // SOCKET
            // global.io.emit('[Pizza][delete]', pizza);
            // global.io.emit('[Toast][new]', { type: 'error', title: `La pizza ${pizza.name} indisponible`, message: `Trop tard, la pizza n'est plus diposnible !` });
        }
    });

}


module.exports = router;