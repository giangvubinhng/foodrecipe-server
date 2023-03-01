const recipeRecordService = require('../services/reciperecord.service');

module.exports = {
    createRecipeRecord
}

async function createRecipeRecord(req, res, next) {
    // recipeRecordService.createRecipe(req.body).then(data => res.json("Recorded")).catch((e) => next(e));

    const requestObject = req.body;
    const action = await recipeRecordService.createRecipe(requestObject);
    return res.status(action.status).json(action.result);
}