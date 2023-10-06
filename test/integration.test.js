import { expect, use } from 'chai';
import chaiHttp from 'chai-http';
import chai from 'chai'
// const expect = _expect;
// const expect = require('chai').expect;


use(chaiHttp);

import app from '../app.js'; 
describe('API Tests', () => {
  

  it('Check if the application is up',  (done) => {
    try {
        
     chai.request(app)
     
     .get('/healthz') // Replace with the actual endpoint you want to test
     .end((err, res) => {
       expect(err).to.be.null;
       expect(res).to.have.status(200);
       
       done();
     
       process.exit(0);
     });
    } catch (error) {
        console.error("this is the error message",error);
        process.exit(1);   
    }
  });

  // Add more test cases as needed
});