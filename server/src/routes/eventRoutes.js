const express=require("express");

const router=express.Router();
const{getEvents, createEvent, updateEvent, deleteEvent,}=require("../controllers/eventController");
const{requireAuth,requireRole}=require("../middleware/auth");

router.get("/",getEvents);
router.post("/",requireAuth, requireRole("organizer"),createEvent);
router.put("/:id",requireAuth, requireRole("organizer"),updateEvent);
router.delete("/:id", requireAuth, requireRole("organizer"),deleteEvent);

module.exports=router;
