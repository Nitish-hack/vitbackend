const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
  
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  technologies:{
   type: [String],
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  registrationLink: {
    type: String,

  },
  registeredStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
