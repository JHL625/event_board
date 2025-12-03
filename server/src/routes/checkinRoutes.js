const express=require("express");
const router=express.Router();
const{requireAuth}=require("../middleware/auth");
const Event=require("../models/Event");
const Rsvp=require("../models/Rsvp");
const Checkin=require("../models/Checkin");

//POST /api/chechins/:eventId/mark
router.post("/:eventId/mark", requireAuth, async(req,res)=>{
  try{
	const{ticketCode}=req.body;
  	const event=await Event.findById(req.params.eventId);
	if(!event) return res.status(404).json({message:"Event not found"});
	if(!event.organizer.equals(req.user._id)){
	  return res.status(403).json({message:"Forbidden"});
	}

	const rsvp=await Rsvp.findOne({event:event._id, ticketCode, status:"going"});
	if(!rsvp) return res.status(400).json({message:"Valid RSVP not found"});
  	
	const checkin=await Checkin.create({
	  event:event._id,
	  attendee:rsvp.user,
	});

	//recalculate checkin count for event
	const totalCheckins =await Checkin.countDocuments({
	  event:event._id,
	});
	event.checkinCount=totalCheckins;
	await event.save();

	res.status(201).json(checkin);
  }catch(err){
	res.status(400).json({message:"Checkin failed", error:err.message});
  }
});

//GET /api/checkins/event/:eventId
router.get("/event/:eventId", requireAuth, async(req,res)=>{
  try{
    const event=await Event.findById(req.params.eventId);
    if(!event) return res.status(400).json({message:"Event not found"});
    if(!event.organizer.equals(req.user._id)){
	return res.status(403).json({message:"Forbidden"});
    }

    const checkins=await Checkin.find({event:event._id}).populate("attendee");
    res.json(checkins);
  }catch(err){
    res.status(500).json({message:"Failed to load checkins"});
  }
});

module.exports=router;
