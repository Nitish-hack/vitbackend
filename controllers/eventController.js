const Event = require("../models/eventModel");
const fs = require('fs');
const path = require('path');
module.exports.addEvent = async (req, res) => {
 try {
    const { title, description, date, location, category, organizer,  technologies} = req.body;
  const imageurl=req.file.path;
const image='http://localhost:5000/'+imageurl;
    // Create a new event object
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      technologies,
      category, 
      organizer,
      image,
    });

    // Save the new event to the database
    const savedEvent = await newEvent.save();

    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add the event' });
  }
};


module.exports.getAllEvents = async (req, res) => {
   try {
    // Retrieve all events from the database
    const events = await Event.find();

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

module.exports.getEvent = async (req, res) => {
  try {
    const {eventId} = req.body;
    const id=eventId.eventId;
    // Retrieve the event from the database based on the eventId
    const event = await Event.findById(id);
  
  
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({event:event});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the event' });
  }
};