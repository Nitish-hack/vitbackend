const {
  login,
  signup,
  registerForEvent,
  getAllUsers,
  getStudentRegisteredEvents,
  verifyToken,
} = require("../controllers/studentController");

const router = require("express").Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/register/event", registerForEvent);
router.post("/verifytoken", verifyToken);
router.post("/myevents",getStudentRegisteredEvents)

router.get("/allusers", getAllUsers);

module.exports = router;

