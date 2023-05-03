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



/**
 * Writes the list of items to a JSON file located at the file path specified by `ItemsFilePath`.
 * @param {Array} items - An array of objects representing items to be saved.
 * @returns {Object} A JSON object containing a status code, a data property, and a message property.
 */
 function saveItems(items) {
  try {
    // Convert the items array to a formatted JSON string.
    const itemsJson = JSON.stringify(items, null, 2);

    // Write the JSON string to the file at ItemsFilePath.
    fs.writeFileSync(ItemsFilePath, itemsJson);

    // If the write was successful, return a success message in a JSON object.
    return { 
      status: httpStatus.OK,
      data: items,
      message: 'Items saved successfully to the JSON file.' 
    };
  } catch (err) {
    // If there was an error, return an error message in a JSON object.
    const errorMessage = `Failed to save items to the JSON file: ${err.message}`;
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      data: {},
      message: errorMessage
    });
  }
}





/**

Retrieves a paginated and sorted list of items based on query parameters.
@param {Object} req - The HTTP request object.
@param {Object} res - The HTTP response object.
@returns {Object} A JSON object containing a status code, a data property, and a message property.
*/
exports.getAllItems = (req, res) => {
  try {
    // Get query parameters with default values
    const { page = 1, limit = 10, sort = 'id', name = '', category = '' } = req.query;

    // Determine sort order and property to sort by
    const sortOrder = sort.startsWith('-') ? -1 : 1;
    const sortBy = sort.replace(/^-/, '');

    // Read items from file
    const items = JSON.parse(fs.readFileSync(ItemsFilePath));

    // Filter items based on name and category
    const filteredItems = items.filter((item) => {
      const itemNameMatches = item.name.toLowerCase().includes(name.toLowerCase()) || name === '';
      const itemCategoryMatches = Number(item.category) === Number(category) || category === '';
      return itemNameMatches && itemCategoryMatches;
    });

    // Sort items based on sort order and property
    const sortedItems = filteredItems.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return -sortOrder;
      }
      if (a[sortBy] > b[sortBy]) {
        return sortOrder;
      }
      return 0;
    });

    // Paginate items
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalItems = sortedItems.length;
    const pagedItems = sortedItems.slice(startIndex, endIndex);

    // Construct response object
    const response = {
      status: httpStatus.OK,
      data: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalItems,
        totalFilteredItems: filteredItems.length,
        items: pagedItems
      },
      message: 'Items retrieved successfully.'
    };

    // Send response
    res.json(response);
  } catch (err) {
    // Handle errors
    const errorMessage = `Failed to retrieve items: ${err.message}`;
    console.error(errorMessage);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      data: {},
      message: errorMessage
    });
  }
};




/**

Retrieves an item from the list of items with the specified ID.
@param {Object} req - The HTTP request object.
@param {Object} res - The HTTP response object.
@returns {Object} A JSON object containing a status code, a data property, and a message property.
*/
exports.getItemById = (req, res) => {
  try {
    // Get all items from the JSON file
    const { data: items } = getItems();

    // Find the item with the given ID
    const item = items.find(ele => ele.id == req.params.id);

    // If item is not found, return a 404 error response
    if (!item) {
      const errorMessage = `Item with ID ${req.params.id} not found.`;
      return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        data: {},
        message: errorMessage
      });
    }

    // Otherwise, return the item as a response
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: item,
      message: 'Item retrieved successfully.'
    });
  } catch (err) {
    // If there was an error, return a 500 error response
    console.error(err);
    const errorMessage = `Failed to retrieve item with ID ${req.params.id}: ${err.message}`;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      data: {},
      message: errorMessage
    });
  }
};




/**

Creates a new item and adds it to the list of items.
@param {Object} req - The HTTP request object.
@param {Object} res - The HTTP response object.
@returns {Object} A JSON object containing a status code, a data property, and a message property.
*/
exports.createItem = (req, res) => {
  try {
    // Extract the item from the request body
    const item = req.body;
    
    // Get the list of items from the JSON file
    const { data: items } = getItems();
    
    // Find the maximum ID of the items in the list
    const maxId = items.length > 0 ? Math.max(...items.map(i => i.id)) : 0;
    
    // Assign a new ID to the item and add it to the list
    item.id = maxId + 1;
    items.push(item);
    
    // Save the updated list of items to the JSON file
    saveItems(items);
    
    // Send a JSON response indicating that the item was created successfully
    res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      data: item,
      message: 'Item created successfully.'
    });
  } catch (err) {
    // If an error occurred, log it and send a JSON response indicating the failure
    console.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      data: {},
      message: `Failed to create item: ${err.message}`
    });
  }
};



/**

Updates an item in the list of items with the specified ID.
@param {Object} req - The HTTP request object.
@param {Object} res - The HTTP response object.
@returns {Object} A JSON object containing a status code, a data property, and a message property.
*/
exports.updateItem = (req, res) => {
  try {

    const { id } = req.params;
    const updatedItem = req.body;
    const { data: items } = getItems(); // extract the "data" property from the response object
    const index = items.findIndex(ele => ele.id == (id));
    if (index  == -1) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        data: {},
        message: `Item with ID ${id} not found` 
      });
    }
    items[index] = { ...items[index], ...updatedItem };
    saveItems(items);
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: items[index],
      message: 'Item updated successfully.'
    });

  } catch (err) {
    console.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      data: {},
      message: `Failed to update item: ${err.message}`
    });
  }
};




/**

Deletes an item from the list of items with the specified ID.
@param {Object} req - The HTTP request object.
@param {Object} res - The HTTP response object.
@returns {Object} A JSON object containing a status code, a data property, and a message property.
*/
exports.deleteItem = (req, res) => {
  try {
    // Get the id of the item to delete from the request parameters
    const { id } = req.params;

    // Get all items from the JSON file
    const { data: items } = getItems();

    // Find the index of the item to delete
    const itemObjectIndex = items.findIndex(item => item.id === Number(id));

    // If the item was not found, return a 404 error
    if (itemObjectIndex === -1) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        data: {},
        message: `Item with ID ${id} not found` 
      });
    }

    // Remove the item from the array
    items.splice(itemObjectIndex, 1);

    // Save the updated items to the file
    saveItems(items);

    // Return a success status code and message
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: {},
      message: 'Item deleted successfully.'
    });

  } catch (err) {
    // If there was an error, log it and return an error message
    console.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      data: {},
      message: `Failed to delete item: ${err.message}`
    });
  }
};

module.exports = {getItems};








