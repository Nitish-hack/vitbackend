const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/studentModel');
const Event = require("../models/eventModel");

// Sign up controller
module.exports.signup = async (req, res) => {
  const { name, rollNumber, email, password } = req.body;

  try {
    // Check if the rollNumber or email already exists
    const existingStudent = await Student.findOne({
      $or: [{ rollNumber }, { email }]
    });

    if (existingStudent) {
      return res.status(409).json({ error: 'Student already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new student object
    const newStudent = new Student({
      name,
      rollNumber,
      email,
      password: hashedPassword
    });

    // Save the new student to the database
    const savedStudent = await newStudent.save();

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register student' });
  }
};

// Login controller
module.exports.login = async (req, res) => {
  const { rollNumber, password } = req.body;

  try {
    // Find the student based on the rollNumber
    const student = await Student.findOne({ rollNumber });

    // Check if the student exists
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordMatched = await bcrypt.compare(password, student.password);

    // Check if the passwords match
    if (!isPasswordMatched) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Password is correct, student is authenticated

    // Create and sign a JWT token
    const token = jwt.sign(
      { studentId: student._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the token in the response as "user"
    res.status(200).json({ user: token,isAdmin:student.isAdmin,registeredEvents:student.registeredEvents});
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};



module.exports.registerForEvent = async (req, res) => {
  try {
    const { eventId, token } = req.body;

    // Verify the token and retrieve the student ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decodedToken.studentId;

    // Find the event by its ID
    const event = await Event.findById(eventId);

    // Check if the event exists
    if (!event) {
      return res.json({ status:"false",error: 'Event not found' });
    }

    // Find the student by their ID
    const student = await Student.findById(studentId);

    // Check if the student exists
    if (!student) {
     return res.json({ status:"false",error: 'Student not found' });
    }

    // Check if the student is already registered for the event
    if (student.registeredEvents.includes(eventId)) {
      return res.json({ status:"false",error: 'Student is already registered for this event' });
     
    }

    // Add the event ID to the student's registeredEvents array
    student.registeredEvents.push(eventId);

    // Add the student ID to the event's registeredStudents array
    event.registeredStudents.push(studentId);

    // Save the changes to the student and event documents
    await student.save();
    await event.save();

return res.json({ status:"true",message:'Student registered for the event successfully'});

  } catch (error) {
    
return res.json({ status:"false", error:'Failed to register student for the event' });
  }
};



// Get all users controller
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await Student.find({}, '_id name rollNumber email');

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get users' });
  }
};


module.exports.verifyToken = async (req, res) => {

  const { token } = req.body;
 
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.studentId;

    // Find the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(401).json({ error: 'Student not found.' });
    }

      res.status(200).json({message: "token validated "});

  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};




module.exports.getStudentRegisteredEvents = async (req, res) => {

  const { token } = req.body;

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // Extract the student ID from the decoded token
    const { studentId } = decodedToken;

    // Find the student by their ID
    const student = await Student.findById(studentId);

    // Check if the student exists
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Retrieve the student's registered event IDs
    const registeredEventIds = student.registeredEvents;

    // Find the registered events by their IDs
    const registeredEvents = await Event.find({ _id: { $in: registeredEventIds } });

    res.status(200).json({events:registeredEvents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registered events' });
  }
};
