'use strict';

/**
 * Pizzas' controller.
 * @namespace PizzaController
 */

const express = require('express');
const router = express.Router();
const Pizza = require('../models/pizza');
const fileUpload = require('express-fileupload');
const formidable = require('formidable');

var multer  = require('multer')
// var upload = multer({ dest: '../uploads/' })
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, '../uploads/')
    },
    filename: function(requ, file, callback) {
        callback(null, Date.now()+file.originalname);
    }
});

var upload = multer({storage : storage}).single('file');

// ************************************************************************** //
//                                ROUTES                                      //
// ************************************************************************** //
router.get('/', (req, res, next) => {
    getPizzas(req, res, next);
});

router.get('/:id', (req, res, next) => {
    getPizzaById(req, res, next);
});

/*
router.post('/', (req, res, next) => {
    postPizza(req, res, next);
});

router.post('/upload', (req, res, next) => {
    upload(req, res, next);
});
*/


router.post('/', function (req, res, next) { // upload.array('imgs', 12),
    
    // console.log('---------------');
    postPizza(req, res, next);
});

router.post('/:id', (req, res, next) => {
    updatePizza(req, res, next);
});

/*
router.put('/:id', (req, res, next) => {
    putPizza(req, res, next);
});
*/

router.delete('/:id', (req, res, next) => {
    deletePizza(req, res, next);
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
    let pizza = null;
    
    var form = new formidable.IncomingForm();

    form.parse(req);

    // représente un forEach files
    form.on('fileBegin', function (name, file){
        // console.log(file);
        file.path = './uploads/' + file.name;
        console.log(file.path);
    });

    form.on('fileEnd', function (name, file){
        // console.log(file);
        // file.path = './uploads/' + file.name;
        console.log('------------ c est passé !!! ----------------');
    });

    form.on('field', function(field, value) {
        // console.log(field);
        // console.log('----------------- IIIIICICCCCCCIIIIIII ---------------');
        // console.log(value);
        // req.body = value;
        // console.log('----------------- IIIIICICCCCCCIIIIIII ---------------');
        // console.log(JSON.parse(value));
        pizza = new Pizza(JSON.parse(value));
        // console.log('---------------- 170 ------------');
        // console.log(pizza);
        if (pizza) {
            pizza.save((err, piz) => {
                if (err) {
                    // console.log(err);
                    res.status(500).send(err);
                } else {
                    // console.log('------------ LA! -----------', piz);
                    res.status(200).send(piz);
                    // SOCKET
                    // global.io.emit('[Pizza][post]', pizza);
                    // global.io.emit('[Toast][new]', { type: 'success', title: `Nouvelle Pizza`, message: 'Une nouvelle pizza a été ajoutée !' });
                }
        
            });
        }
        // fields.push([field, value]);
    })

    // console.log('---------------- 175 ------------');
    // console.log(pizza);
    /*console.log('---------------- 172 ------------');
    console.log(req.body);
    console.log('---------------- 174 ------------');
    console.log(req.body.content);

    const pizza = new Pizza(JSON.parse(req.body));*/
    // console.log(pizza);

    // console.log(req.files);
    // pizza = JSON.parse(pizza);
    // console.log(pizza);

    // var form = new IncomingForm();

    /* form.on('file', (field, file) => {
        // Do something with the file
        // e.g. save it to the database
        // you can access it using file.path
    });
    form.on('end', () => {
        res.json();
    });
    form.parse(req); */

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
function upload(req, res, next) {

    const pizza = new Pizza(req.body);
    // console.log(pizza);

    console.log(req.files);
    console.log(req.body);

    var form = new IncomingForm();

    form.on('file', (field, file) => {
        // Do something with the file
        // e.g. save it to the database
        // you can access it using file.path
    });
    form.on('end', () => {
        res.json();
    });
    form.parse(req);


    pizza.save((err, pizza) => {
        if (err) {
            // console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send(pizza);
            // SOCKET
            // global.io.emit('[Pizza][post]', pizza);
            // global.io.emit('[Toast][new]', { type: 'success', title: `Nouvelle Pizza`, message: 'Une nouvelle pizza a été ajoutée !' });
        }

    });

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
function updatePizza(req, res, next){
    
    let pizza = new Pizza(req.body);
    pizza.updated_at = new Date;

    Pizza.findOneAndUpdate({_id: req.params.id}, pizza, { new: true }, (err, pizza) => {
        if (err) {
            res.status(500).send(err);
        } else if (pizza === null) {
            res.status(404).send('Aucun pizza trouvé avec cet Identifiant...');
        } else {
            res.status(200).send(pizza);
        }
    });
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
        if (err) {
            res.status(500).send(err);
        } else if (pizza === null) {
            res.status(404).send('Aucune pizza trouvée avec cet identifiant...');
        } else {
            let response = {
                message: `La pizza ${req.params.id} a été correctement supprimée`,
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