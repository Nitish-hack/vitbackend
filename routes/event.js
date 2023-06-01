const {
  addEvent,
  getAllEvents,
  getEvent
} = require("../controllers/eventController");

const router = require("express").Router();

router.post("/addevent", addEvent);
router.get("/allevents", getAllEvents);
router.post("/getevent", getEvent);


module.exports = router;
