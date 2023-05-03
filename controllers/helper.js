const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { isNumber } = require('lodash');
const ItemsFilePath = path.join(__dirname, '..', 'models', 'items.json');
const httpStatus = require('http-status');


/**
 * Retrieves the list of items from a JSON file located at the file path specified by `ItemsFilePath`.
 * @returns {Object} A JSON object containing a status code, a data property, and a message property.
 */
 function getItems()  {
    try {
      // Read the JSON file and return its contents as a string.
      const itemJson = fs.readFileSync(ItemsFilePath, 'utf8');
      // Parse the JSON string and return the resulting JavaScript object.
      return { 
        status: httpStatus.OK,
        data: JSON.parse(itemJson),
        message: 'Items retrieved successfully from the JSON file.' 
      };
    } catch (err) {
      // If there was an error, return an error message in a JSON object.
      const errorMessage = `Failed to retrieve items from the JSON file: ${err.message}`;
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        data: {},
        message: errorMessage
      });
    }
  }
  
  module.exports = getItems;
