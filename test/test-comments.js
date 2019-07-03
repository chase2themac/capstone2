'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const { app, runServer, closeServer } = require('../server');
const { Comment } = require('../comments');
const {TEST_DATABASE_URL} = require('../config');
const expect = chai.expect;

chai.use(chaiHttp);

function seedComments() {
    console.info('seeding comments');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
      seedData.push({
        commenter: faker.name.commenter(),
        content: faker.lorem.sentence()
      });
    }
    return Comment.insertMany(seedData);
  }

function tearDownDb() {
    return new Promise((resolve, reject) => {
      console.warn('Deleting database');
      mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }
  describe(' server start to finish', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedComments();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    
    describe('GET endpoint', function() {
        it('should return all existing Comments', function() {
            let res;
            return chai.request(app)
              .get('/Comments')
              .then(function(_res) {
                  res = _res;
                  expect(res).to.have.status(200);
                  expect(res.body).to.have.lengthOf.at.least(1);
                  return Comments.count();
              })
              .then(function(count) {
                  expect(res.body).to.have.lengthOf(count)
                  
              });
        });

        it('should return the correct fields', function() {
            let resComment;
            return chai.request(app)
              .get('/Comments')
              .then(function(res) {
                  expect(res).to.have.status(200);
                  expect(res).to.be.json;
                  expect(res.body).to.be.a('array');
                  expect(res.body).to.have.lengthOf.at.least(1);

                  res.body.forEach(function(Comment) {
                      expect(Comment).to.be.a('object');
                      expect(Comment).to.include.keys('id', 'content', 'commenter');
                  });
                  resComment = res.body[0];
                  return Comment.findById(resComment.id);
              })
              .then(function(Comment) {
                  expect(resComment.commenter).to.equal(Comment.commenter);
                  expect(resComment.content).to.equal(Comment.content);
                  
                  
              });
        });
    });

    describe('POST endpoint', function() {
        it('should add a new post', function() {
            const newPost = {
                commenter: faker.name.commenter(),
                content: faker.lorem.text()
              };

            return chai.request(app)
              .post('/comments')
              .send(newPost)
              .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys(
                    'id', 'commenter', 'content');
                expect(res.body.id).to.not.be.null;
                expect(res.body.commenter).to.equal(`${newPost.commenter}`);
                return Comment.findById(res.body.id);
              })
              .then(function(Comment) {
                expect(Comment.commenter.firstName).to.equal(newPost.commenter);
                expect(Comment.content).to.equal(newPost.content);
              });
        });
    });
    describe('PUT endpoint', function() {
        it('should update fields you send over', function() {
        const updateData = {
            content: 'ksfjajnsfgjnpaskndfkanmsdfvkasdkfvnm'
        };

        return Comment
          .findOne()
          .then(function(Comment) {
              updateData.id = Comment.id;

              return chai.request(app)
                .put(`/comments/${Comment.id}`)
                .send(updateData);
          })
          .then(function(res) { 
              expect(res).to.have.status(204);

              return Comment.findById(updateData.id);
          })
          .then(function(Comment) {
              expect(Comment.content).to.equal(updateData.content);
              
          });
        });
    });

    describe('DELETE endpoint', function() {
        it('delete a blog post by id', function() {

        let comments;

        return comment
          .findOne()
          .then(function(_comments) {
              comments = _comments;
              return chai.request(app).delete(`/comments/${comments.id}`);
          })
          .then(function(res) {
              expect(res).to.have.status(204);
              return comment.findById(comments.id);
          })
          .then(function(_comment) {
              expect(_comment).to.be.null;
              
          });
        });
    });
});
