const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  joinDate: {type: Date, default: nowDate()},
  libraryId: {type: String, unique: true}
});

userSchema.methods.userRepr = function() {
  return {
    id: this._id,
    libraryId: this.libraryId,
    email: this.email,
    username: this.username,
    joinDate: this.joinDate.toString()
  };
};

// Generates a hash 
userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

// Checks if password isvalid
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// Schema for user guides/posts 
const guideSchema = mongoose.Schema({
  guideId: {type: String},
  libraryId: {type: String, required: true},
  title: {type: String, required: true},
  author: {type: String},
  publishDate: {type: Date, default: Date.now},
  link: {type: String},
  ratings: {type: Boolean},
  views: {type: Number},
  comments: [{username: String, publishDate: Date, content: String}]
});

guideSchema.methods.guideRepr = function() {
  return {
    guideId: this._id,
    libraryId: this.libraryId,
    title: this.title,
    author: this.author,
    publishDate: this.publishDate,
    link: this.link,
    ratings: this.ratings,
    views: this.views,
    comments: this.comments
  };
};

const heroSchema = mongoose.Schema({
  name: {type: String, required: true},
  role: {type: String, required: true},
  overview: {type: String, required: true},
  realName: {type: String},
  age: {type: String, required: true},
  occupation: {type: String, required: true},
  baseOfOperations: {type: String, required: true},
  affiliation: {type: String, required: true},
  pictureName: {type: String},
  abilities: [{ability: String, description: String}]
});

heroSchema.methods.heroRepr = function () {
  return {
    id: this._id,
    name: this.name,
    role: this.role,
    overview: this.overview,
    realName: this.realName,
    age: this.age,
    occupation: this.occupation,
    baseOfOperations: this.baseOfOperations,
    affiliation: this.affiliation,
    pictureName: this.pictureName,
    abilities: this.abilities
  };
};

const mapSchema = mongoose.Schema({
  mode: {type: String, required: true},
  name: {type: String, required: true},
  location: {type: String},
  description: {type: String, required: true},
  pictureName: {type: String},
  terrain: {type: String, required: true}
});

mapSchema.methods.mapRepr = function() {
  return {
    id: this._id,
    mode: this.mode,
    name: this.name,
    location: this.location,
    description: this.description,
    pictureName: this.pictureName,
    terrain: this.terrain
  };
};

function nowDate() {
  let now = new Date(Date.now());
  let currentDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate());
  return currentDate;
}

const User = mongoose.model('users', userSchema);
const Guide = mongoose.model('posts', guideSchema);
const Hero = mongoose.model('heroes', heroSchema);
const Maps = mongoose.model('maps', mapSchema);
module.exports = {User, Guide, Hero, Maps};


