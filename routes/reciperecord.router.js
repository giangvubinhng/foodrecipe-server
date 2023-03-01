var express = require('express');
var router = express.Router();
var recipeRecordController = require('../controllers/reciperecord.controller');

router.post('/createrecipe', recipeRecordController.createRecipeRecord);

module.exports = router;
