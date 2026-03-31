const express = require("express");
const router = express.Router();

const roomController = require("../controllers/roomController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, roomController.getRooms);

router.post("/", auth, roomController.createRoom);

module.exports = router;