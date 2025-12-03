const express=require("express");
const router=express.Router();
const{requireAuth}=require("../middleware/auth");
const Rsvp=require("../models/Rsvp");
const Event=require("../models/Event");
const crypto=require("crypto");


//POST /api/rsvps/:eventId (visitor)
router.post("/:eventId",requireAuth, async(req,res)=>{
  try{
        const event=await Event.findById(req.params.eventId);
        if(!event) return res.status(404).json({message:"Event not found"});

        //check capacity
        if(event.capacity && event.capacity>0){
          const currentCount=await Rsvp.countDocuments({event:event._id,status:"going",});
          if(currentCount>=event.capacity) return res.status(400).json({message:"Event is full"});
        }

	const ticketCode=crypto.randomBytes(4).toString("hex");

	const rsvp=await Rsvp.findOneAndUpdate(
	  {user:req.user._id, event:event._id},
	  {status:"going", ticketCode},
	  {upsert:true, new:true, setDefaultsOnInsert:true}
	).populate("event");

	//recalculate rsvp count
	const totalGoing=await Rsvp.countDocuments({event:event._id, status:"going",});
	event.rsvpCount=totalGoing;
	await event.save()

	res.status(201).json(rsvp);
  }catch(err){
  	res.status(400).json({message:"RSVP failed", error:err.message});
  }
});

//GET /api/rsvps/my (user current rsvps)
router.get("/my",requireAuth, async(req,res)=>{
  try{
    const rsvps=await Rsvp.find({user:req.user._id}).populate("event");
    res.json(rsvps);
  }catch(err){
    res.status(500).json({message:"Failed to load RSVPs"});
  }
});

//GET /api/rsvps/event/:eventId (organizer)
router.get("/event/:eventId", requireAuth, async(req,res)=>{
  try{
    const event=await Event.findById(req.params.eventId);
    if(!event) return res.status(404).json({message:"Event not found"});
    if(!event.organizer.equals(req.user._id)){
	return res.status(403).json({message:"Forbidden"});
    }
    const rsvps=await Rsvp.find({event:event._id}).populate("user");
    res.json(rsvps);
  }catch(err){
    res.status(500).json({message:"Failed to load event RSVPs"});
  }
});

module.exports=router;
