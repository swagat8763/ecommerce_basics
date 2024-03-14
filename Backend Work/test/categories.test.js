const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const { expect } = chai;
const sinon = require('sinon');
const  router  = require('../routes/categories');
const Category = require('../models/Category');
const app = require('../server');

chai.use(chaiHttp);


describe('Categories API', () => {
  beforeEach(() => {
    sinon.stub(Category, 'find');
    sinon.stub(Category.prototype, 'save');
    sinon.stub(Category, 'findById');
    sinon.stub(Category, 'findByIdAndDelete');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('GET /api/category/', () => {
    it('should return all categories', async () => {
      const mockCategories = [{ _id: '1', category: 'Category 1', subCategories: [] }];
      Category.find.resolves(mockCategories);

      const res = await chai.request(app).get('/api/category');

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal(mockCategories);
    });
  });

  describe('POST /api/category/add', () => {
    it('should add a new category', async () => {
      // Define request body with valid data
      const reqBody = {
        category: 'New Category',
        subCategories: [],
      };

      // Stub save method to resolve successfully
      Category.prototype.save.resolves();

      // Send POST request to add a new category
      const res = await chai.request(app).post('/api/category/add').send(reqBody);

      // Expectations for response
      expect(res).to.have.status(200);
      expect(res.body).to.equal('Category added!');
    });

    it('should handle missing fields in request body', async () => {
      // Define request body with missing fields
      const reqBody = {}; // No category or subCategories

      // Send POST request to add a new category
      const res = await chai.request(app).post('/api/category/add').send(reqBody);

      // Expectations for response
      expect(res).to.have.status(500);
    });

    it('should handle duplicate category name', async () => {
      // Define request body with existing category name
      const reqBody = {
        category: 'Existing Category', // Assuming 'Existing Category' already exists
        subCategories: [],
      };

      // Stub save method to reject with duplicate key error
      Category.prototype.save.rejects({ name: 'MongoError', code: 11000 });

      // Send POST request to add a new category
      const res = await chai.request(app).post('/api/category/add').send(reqBody);

      // Expectations for response
      expect(res).to.have.status(400);
    });
  });

  describe('GET /api/category/:id', () => {
    it('should return the category with the given ID', async () => {
      const mockCategory = { _id: '1', category: 'Category 1', subCategories: [] };
      Category.findById.resolves(mockCategory);

      const res = await chai.request(app).get('/api/category/1');

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal(mockCategory);
    });

    it('should handle invalid category ID', async () => {
      // Stub findById method to reject with an error
      Category.findById.rejects(new Error('Invalid ID'));

      const res = await chai.request(app).get('/api/category/invalid_id');

      expect(res).to.have.status(400);
      expect(res.body).to.be.a('string').that.includes('Error');
    });

  });

  describe('DELETE /api/category/:id', () => {
    it('should delete the category with the given ID', async () => {
      Category.findByIdAndDelete.resolves();

      const res = await chai.request(app).delete('/api/category/1');

      expect(res).to.have.status(200);
      expect(res.body).to.equal('Category deleted.');
    });

    it('should handle invalid category ID for deletion', async () => {
      // Stub findByIdAndDelete method to reject with an error
      Category.findByIdAndDelete.rejects(new Error('Invalid ID'));

      const res = await chai.request(app).delete('/api/category/invalid_id');

      expect(res).to.have.status(400);
      expect(res.body).to.be.a('string').that.includes('Error');
    });

  });

  describe('POST /api/category/update/:id', () => {

    it('should handle invalid category ID for updating', async () => {
      // Stub findById method to reject with an error
      Category.findById.rejects(new Error('Invalid ID'));

      const res = await chai.request(app).post('/api/category/update/invalid_id').send({});

      expect(res).to.have.status(400);
      expect(res.body).to.be.a('string').that.includes('Error');
    });

    it('should handle missing fields in request body for updating', async () => {
      // Stub findById method to resolve with a mock category
      Category.findById.resolves({ _id: '1' });

      const res = await chai.request(app).post('/api/category/update/1').send({});

      expect(res).to.have.status(400);
      expect(res.body).to.be.a('string').that.includes('Error');
    });
  });

});