const express = require('express');
const guideRouter = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Guide, User} = require('../models/models');

guideRouter.get('/', (req, res) => {
  Guide
    .find()
    .then(guides => {
      res.json({
        guide: guides.map(guide => guide.guideRepr())
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

guideRouter.get('/library', checkAuthentication, (req, res) => {
  let user = req.user.userRepr;
  Guide
    .find({libraryId: user.libraryId})
    .then(guides => {
      if (guides.length !== 0) {
        res.json({guides: guides.map(guide => guide.guideRepr)});
      } else {
        res.status(200).json({code: 200, message: 'There are no available guides.'});
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

// Make sure there are no missing fields - title of guide, content &link
guideRouter.post('/', checkAuthentication, (req, res) => {
  const requiredFields = ['title', 'content', 'link'];
  let currentDate = nowDate();
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError', 
      message: 'Missing field',
      location: missingField
    });
  }
  let {title, author, publishDate, link, ratings, views, comments} = req.body;
  User
    .find({libraryId: req.user.libraryId})
    .then((library) => {
      if (req.body.title) {
        Guide
          .create({
            libraryId: library,
            title: title,
            author: author,
            publishDate: currentDate,
            link: link,
            ratings: ratings,
            views: views,
            comments: comments
          });
      }
    })
    .then(guide => res.status(201).json({code:201, guide: guide.guideRepr}))
    .catch(err => {
      console.error(err);
      return res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

// Should be able to update the title, content, and guide
guideRouter.put('/:guideId', checkAuthentication, (req, res) => {
  if (req.params.guideId !== req.body.guideId) {
    const message = `Request path id (${req.params.guideId} and` + 
      `request body id (${req.body.guideId} must match each other`;
    console.error(message);
    return res.status(422).send(message);
  }

  let updateField = {};
  const updateableFields = ['title', 'content', 'link'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updateField[field] = req.body[field];
    }
  });

  Guide
    .findById(req.body.guideId)
    .then(res => {
      let libraryId = res.libraryId;
      return libraryId;
    })
    .then(libraryId => {
      User
        .find({libraryId: libraryId})
        .then(() => {
          Guide
            .findByIdAndUpdate(req.params.guideId, {set: updateField}, {new: true})
            .then(updateGuide => res.status(201).json(updateGuide.entryRepr()))
            .catch(err => res.status(500).json({code: 500, message: 'Internal server error'}));
        });
    });
});

guideRouter.delete('/:guideId', checkAuthentication, (req, res) => {
  Guide
    .findByIdAndRemove(req.params.guideId)
    .then(() => {
      console.log(`Guide ${req.params.guideId} was deleted.`);
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

guideRouter.delete('/library/:libraryId', checkAuthentication, (req, res) => {
  Guide
    .find({libraryId: req.params.libraryId})
    .remove()
    .then(() => {
      console.log(`Library ${req.params.libraryId} is deleted`);
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

// middleware to make sure a user is logged in
function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
} 

function nowDate() {
  let now = new Date(Date.now());
  let currentDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate());
    now.getHours();
    now.getMinutes();
  return currentDate;
}

module.exports = guideRouter;