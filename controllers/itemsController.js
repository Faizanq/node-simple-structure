const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const ItemsFilePath = path.join(__dirname, '..', 'models', 'items.json');

function getItems() {
  try {
    const itemJson = fs.readFileSync(ItemsFilePath, 'utf8');
    return JSON.parse(itemJson);
  } catch (err) {
    return [];
  }
}

function saveItems(items) {
  const itemsJson = JSON.stringify(items, null, 2);
  fs.writeFileSync(ItemsFilePath, itemsJson);
}



exports.getAllItems = (req, res) => {
  const { page = 1, limit = 10, sort = 'title', name = '', category = '' } = req.query;

  const items = JSON.parse(fs.readFileSync(ItemsFilePath));

  const filteredItems = items.filter((item) => {
    return (item.name.toLowerCase().includes(name.toLowerCase()) || name === '') &&
           (item.category.toLowerCase().includes(category.toLowerCase()) || category === '');
  });

  const sortedItems = filteredItems.sort((a, b) => {
    if (a[sort] < b[sort]) {
      return -1;
    }
    if (a[sort] > b[sort]) {
      return 1;
    }
    return 0;
  });

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalItems = sortedItems.length;

  const pagedItems = sortedItems.slice(startIndex, endIndex);

  const response = {
    page: parseInt(page),
    limit: parseInt(limit),
    totalItems,
    totalFilteredItems: filteredItems.length,
    items: pagedItems
  };

  res.json(response);
};


exports.getItemById = (req, res) => {
  
  const items = getItems();
  const item = items.find(ele=>ele.id==req.params.id)

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
};



exports.createItem = (req, res) => {
  const item = req.body;
  const items = getItems();
  const maxId = items.length > 0 ? Math.max(...items.map(i => i.id)) : 0;
  item.id = maxId + 1;
  items.push(item);
  saveItems(items);
  res.json(item);
};



exports.updateItem = (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  const items = getItems();
  const index = items.findIndex(i => i.id === Number(id));
  if (!index) {
    return res.status(404).json({ message: `Item with ID ${id} not found` });
  }
  items[index] = { ...items[index], ...updatedItem };
  saveItems(items);
  res.json(items[index]);
};


exports.deleteItem = (req, res) => {
  const items = getItems();
  const itemIndex = items.find(ele=>ele.id==req.params.id)
  // const itemIndex = _.findIndex(items, { id: req.params.id });
  if (!itemIndex) {
    return res.status(404).json({ error: 'Item not found' });
  }
  items.splice(itemIndex, 1);
  saveItems(items);
  res.sendStatus(204);
};






