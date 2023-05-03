const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');
const httpStatus = require('http-status');
// const itemsController = require('../controllers/itemsController');
const getItems = require('../controllers/helper');


chai.use(chaiHttp);
chai.should();
let server;

before(() => {
  server = app.listen(4000);
});

after(() => {
  server.close();
});



describe('Items API', () => {
    let itemId;
    
  
   // Test the createItem API endpoint
describe('POST /api/items', () => {
  it('should create a new item', async () => {
    const newItem = {
      name: 'New Item',
      category: 10,
      price: 290
    };

    const res = await chai.request(app)
      .post('/api/items')
      .send(newItem);

    res.should.have.status(httpStatus.CREATED);
    res.body.should.be.a('object');
    res.body.should.have.property('data');
    res.body.data.should.be.a('object');
    res.body.data.should.have.property('id');
    res.body.data.should.have.property('name').eq(newItem.name);
    res.body.data.should.have.property('category').eq(newItem.category);
    res.body.data.should.have.property('price').eq(newItem.price);
  });
});

  
// Test the getItemById API endpoint
describe('GET /api/items/:id', () => {
  it('should return an item by ID', async () => {
    // Get the list of items from the JSON file
    const { data: items } = getItems();

    // Choose an item from the list
    const item = items[0];

    const res = await chai.request(app)
      .get(`/api/items/${item.id}`);

    res.should.have.status(httpStatus.OK);
    res.body.should.be.a('object');
    res.body.should.have.property('data');
    res.body.data.should.be.a('object');
    res.body.data.should.have.property('id').eq(item.id);
    res.body.data.should.have.property('name').eq(item.name);
    res.body.data.should.have.property('category').eq(item.category);
    res.body.data.should.have.property('price').eq(item.price);
  });

  it('should return a 404 error if the item is not found', async () => {
    // Choose an ID that does not exist in the list of items
    const id = 9999;

    const res = await chai.request(app)
      .get(`/api/items/${id}`);

    res.should.have.status(httpStatus.NOT_FOUND);
    res.body.should.be.a('object');
    res.body.should.have.property('message').eq(`Item with ID ${id} not found.`);
  });
});




  // Test the updateItem API endpoint
  describe('PUT /api/items/:id', () => {
    it('should update an existing item', async () => {
      const newItem = {
        name: 'New Item',
        category: 10,
        price: 290
      };
  
      // create a new item
      const createRes = await chai.request(app)
        .post('/api/items')
        .send(newItem);
      
      const itemId = createRes.body.data.id;
  
      // update the item with new values
      const updatedItem = {
        name: 'Updated Item',
        category: 20,
        price: 350
      };
  
      const updateRes = await chai.request(app)
        .put(`/api/items/${itemId}`)
        .send(updatedItem);
  
      updateRes.should.have.status(httpStatus.OK);
      updateRes.body.should.be.a('object');
      updateRes.body.should.have.property('data');
      updateRes.body.data.should.be.a('object');
      updateRes.body.data.should.have.property('id').eq(itemId);
      updateRes.body.data.should.have.property('name').eq(updatedItem.name);
      updateRes.body.data.should.have.property('category').eq(updatedItem.category);
      updateRes.body.data.should.have.property('price').eq(updatedItem.price);
    });
  
    it('should return an error if item not found', async () => {
      const updatedItem = {
        name: 'Updated Item',
        category: 20,
        price: 350
      };
  
      const itemId = 9999; // non-existing item ID
  
      const updateRes = await chai.request(app)
        .put(`/api/items/${itemId}`)
        .send(updatedItem);
  
      updateRes.should.have.status(httpStatus.NOT_FOUND);
      updateRes.body.should.be.a('object');
      updateRes.body.should.have.property('status').eq(httpStatus.NOT_FOUND);
      updateRes.body.should.have.property('data');
      updateRes.body.data.should.be.a('object');
      updateRes.body.data.should.be.empty;
      updateRes.body.should.have.property('message').eq(`Item with ID ${itemId} not found`);
    });
  });
  






  // Test the getItems API endpoint with pagination, filtering, and sorting
  describe('GET /api/items', () => {
    it('should retrieve a list of items', async () => {
      const query = {
        page: 2,
        limit: 10,
        sort: 'price',
        name: 'apple',
        category: 1
      };
  
      const res = await chai.request(app)
        .get('/api/items')
        .query(query);
  
      res.should.have.status(httpStatus.OK);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.data.should.be.a('object');
      res.body.data.should.have.property('page').eq(query.page);
      res.body.data.should.have.property('limit').eq(query.limit);
      res.body.data.should.have.property('totalItems').be.a('number');
      res.body.data.should.have.property('totalFilteredItems').be.a('number');
      res.body.data.should.have.property('items').be.a('array');
      // res.body.data.items.should.have.lengthOf(query.limit);
      // res.body.data.items[0].should.have.property('id').be.a('number');
      // res.body.data.items[0].should.have.property('name').be.a('string');
      // res.body.data.items[0].should.have.property('category').be.a('number');
      // res.body.data.items[0].should.have.property('price').be.a('number');
    });
  });
  


  // Test the deleteItem API endpoint
  describe('DELETE /api/items/:id', () => {
    it('should delete an existing item', async () => {
      // Create a new item to be deleted
      const newItem = {
        name: 'New Item',
        category: 10,
        price: 290
      };
      const res1 = await chai.request(app)
        .post('/api/items')
        .send(newItem);
      const newItemId = res1.body.data.id;
  
      // Delete the item
      const res2 = await chai.request(app)
        .delete(`/api/items/${newItemId}`);
  
      // Check that the response has the expected status code and message
      res2.should.have.status(httpStatus.OK);
      res2.body.should.be.a('object');
      res2.body.should.have.property('status').eq(httpStatus.OK);
      res2.body.should.have.property('data');
      res2.body.data.should.be.a('object');
      res2.body.data.should.be.empty;
      res2.body.should.have.property('message').eq('Item deleted successfully.');
  
      // Check that the item has been deleted
      const res3 = await chai.request(app)
        .get('/api/items');
      res3.body.data.items.should.not.deep.include(newItem);
    });
  
    it('should return a 404 error for a non-existing item', async () => {
      // Delete an item with an invalid ID
      const res = await chai.request(app)
        .delete('/api/items/invalid_id');
  
      // Check that the response has the expected status code and message
      res.should.have.status(httpStatus.NOT_FOUND);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eq(httpStatus.NOT_FOUND);
      res.body.should.have.property('data');
      res.body.data.should.be.a('object');
      res.body.data.should.be.empty;
      res.body.should.have.property('message').eq('Item with ID invalid_id not found');
    });
  });
  

})













