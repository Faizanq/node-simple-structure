const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('./app');

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
          description: 'This is a new item',
          price: 10.99
        };
  
        const res = await chai.request(app)
          .post('/api/items')
          .send(newItem);
  
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        itemId = res.body.id;
      });
    });
  

    // Test the getItem API endpoint
  describe('GET /api/items/:id', () => {
    it('should get an item by id', (done) => {
      // const newItem = { name: 'Test item', description: 'Test description' };
      chai.request(app)
        .post('/api/items/:id')
        // .send(newItem)
        .end((err, res) => {
          const itemId = res.body.id;
          chai.request(app)
            .get(`/api/items/${itemId}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('id').equal(itemId);
              res.body.should.have.property('name').equal(newItem.name);
              res.body.should.have.property('description').equal(newItem.description);
              done();
            });
        });
    });    
  });



  // Test the updateItem API endpoint
  describe('PUT /api/items/:id', () => {
    it('should update an item by id', async () => {
      const updatedItem = {
        name: 'Updated Item',
        description: 'This is an updated item',
        price: 20.99
      };

      const res = await chai.request(app)
        .put(`/api/items/${itemId}`)
        .send(updatedItem);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('name').eq(updatedItem.name);
      res.body.should.have.property('description').eq(updatedItem.description);
      res.body.should.have.property('price').eq(updatedItem.price);
    });
  });


  // Test the deleteItem API endpoint
  describe('DELETE /api/items/:id', () => {
    it('should delete an item by id', async () => {
      const res = await chai.request(app)
        .delete(`/api/items/${itemId}`);

      res.should.have.status(200);
    });
  });



  // Test the getItems API endpoint with pagination, filtering, and sorting
  describe('GET /api/items', () => {
    it('should get items with pagination, filtering, and sorting', async () => {
      const res = await chai.request(app)
        .get('/api/items')
        .query({
          page: 2,
          limit: 5,
          name: 'item',
          sort: 'price'
        });

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data').which.is.an('array');
      res.body.should.have.property('total').which.is.a('number');
      res.body.should.have.property('page').which.is.a('number');
      res.body.should.have.property('limit').which.is.a('number');
      res.body.data.length.should.be.eql(5);
    });
  });


})














// describe('Item API', () => {
//   let itemId = '';

//   // Test POST /items
//   describe('POST /api/items', () => {
//     it('should create a new item', (done) => {
//       chai
//         .request(app)
//         .post('/api/items')
//         .send({ name : 'product 1', category: '1' })
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body.title).to.equal('product 1');
//           expect(res.body.author).to.equal('1');
//           itemId = res.body.id;
//           done();
//         });
//     });
//   });

//   // Test GET /books/:id
//   describe('GET /api/items/:id', () => {
//     it('should get a item by ID', (done) => {
//       chai
//         .request(app)
//         .get(`/api/items${itemId}`)
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body.title).to.equal();
//           expect(res.body.author).to.equal('Douglas Adams');
//           expect(res.body.pages).to.equal(224);
//           done();
//         });
//     });
//     it('should return 404 for non-existing book ID', (done) => {
//       chai
//         .request(app)
//         .get('/books/123')
//         .end((err, res) => {
//           expect(res).to.have.status(404);
//           done();
//         });
//     });
//   });

//   // Test PUT /books/:id
//   describe('PUT /books/:id', () => {
//     it('should update a book by ID', (done) => {
//       chai
//         .request(app)
//         .put(`/books/${bookId}`)
//         .send({ title: 'The Restaurant at the End of the Universe', author: 'Douglas Adams', pages: 256 })
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           expect(res.body.title).to.equal('The Restaurant at the End of the Universe');
//           expect(res.body.author).to.equal('Douglas Adams');
//           expect(res.body.pages).to.equal(256);
//           done();
//         });
//     });
//     it('should return 404 for non-existing book ID', (done) => {
//       chai
//         .request(app)
//         .put('/books/123')
//         .send({ title: 'The Restaurant at the End of the Universe', author: 'Douglas Adams', pages: 256 })
//         .end((err, res) => {
//           expect(res).to.have.status(404);
//           done();
//         });
//     });
//   });


// ///Delete
//   describe("DELETE /api/items/:id", () => {
//     it("should delete an item given the id", (done) => {
//       // Create an item to delete
//       const newItem = { name: "Test Item", description: "This is a test item" };
//       chai.request(server)
//         .post("/api/items")
//         .send(newItem)
//         .end((err, res) => {
//           // Get the id of the created item
//           const idToDelete = res.body.id;
          
//           // Delete the item
//           chai.request(server)
//             .delete("/api/items/" + idToDelete)
//             .end((err, res) => {
//               res.should.have.status(200);
//               res.body.should.be.a('object');
//               res.body.should.have.property('message').eql('Item deleted successfully');
//               done();
//             });
//         });
//     });

//     it("should return an error if the id does not exist", (done) => {
//       chai.request(server)
//         .delete("/api/items/123")
//         .end((err, res) => {
//           res.should.have.status(404);
//           res.body.should.be.a('object');
//           res.body.should.have.property('message').eql('Item not found');
//           done();
//         });
//     });
//   });

// })
