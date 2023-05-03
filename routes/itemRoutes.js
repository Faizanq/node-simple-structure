const express = require('express');
const itemsController = require('../controllers/itemsController');
const itemValidation = require('../validations/items.vaildation');
const validate = require('../middlewares/validate');

const router = express.Router();

router.get('/', itemsController.getAllItems);

router.get('/:id', itemsController.getItemById);

router.post('/', validate(itemValidation.createItem), itemsController.createItem);


router.put('/:id', validate(itemValidation.updateItem), itemsController.updateItem);

router.delete('/:id', itemsController.deleteItem);

module.exports = router;
