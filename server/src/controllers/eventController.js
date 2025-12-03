const Event=require("../models/Event");

//GET /api/events
async function getEvents(req,res){
	try{
		const events=await Event.find().sort({date:1}).populate("organizer", "username");
		res.json(events);
	}catch(err){
		res.status(500).json({message:"Failed to fetch events"});
	}
}

//POST /api/events
async function createEvent(req,res){
	try{
		const {
		  title,
		  description,
		  date,
		  location,
		  category,
		  capacity,
		  autoDeleteDays,
		  posterUrl,
		} = req.body;
		
		const eventDate = new Date(date);
		if(Number.isNaN(eventDate.getTime())){
		  return res.status(400).json({message:"Invalid date"});
		}

		let expiresAt=null;
		const days=Number.isFinite(Number(autoDeleteDays))? Number(autoDeleteDays):1;

		if(days>0){
		  expiresAt=new Date(eventDate.getTime()+days*24*60*60*1000);
		}

		const event=await Event.create({
		  title,
                  description,
                  date: eventDate,
                  location,
                  category,
                  capacity,
		  organizer:req.user._id, 
		  expiresAt,
		  posterUrl:posterUrl||"", 
		});

		await event.populate("organizer","username");
		res.status(201).json(event);
	}catch(err){
		res.status(400).json({message:"Bad request",error:err.message});
	}

}

function computeExpire(eventDate,autoDD){
  if(!eventDate||Number.isNaN(new Date(eventDate).getTime())){
	return null;
  }

  const days=Number(autoDD);
  if(!Number.isFinite(days)|| days<=0){
	return null;
  }
  return new Date(new Date(eventDate).getTime()+days*24*60*60*1000);
}

//PUT /api/events/:id
async function updateEvent(req,res){
	try{
		const event=await Event.findById(req.params.id);
		if(!event) return res.status(404).json({message:"Not found"});
		
		// edit only for owner organizer
		if(!event.organizer.equals(req.user._id)){
		  return res.status(403).json({message:"Forbidden"});
		}

		const {
			title,
			description,
			date,
			autoDeleteDays,
                  	location,
                  	category,
                  	capacity,
			posterUrl,
		} = req.body;
		
		//partial updates
		if(title!==undefined) event.title==title;
		if (description !== undefined) event.description = description;
    		if (location !== undefined) event.location = location;
    		if (category !== undefined) event.category = category;
    		if (posterUrl !== undefined) event.posterUrl = posterUrl;

		if(capacity!==undefined) {
		  const num=Number(capacity);
		  event.capacity=Number.isFinite(num) && num >= 0 ? num:0;
		}

		let dateChanged=false;
		if(date!==undefined){
		  const newDate=new Date(date);
		  if(Number.isNaN(newDate.getTime())){
			return res.status(400).json({message:"Invalid date"});
		  }
		  event.date=newDate;
		  dateChanged=true;
		}

		let autoDeleteChanged=false;
		if(autoDeleteDays!==undefined){
                  const days=Number(autoDeleteDays);
                  event.autoDeleteDays=Number.isFinite(days) && days >= 0 ? 
			days : event.autoDeleteDays;
                  autoDeleteChanged=true;  
		}

		if(dateChanged||autoDeleteChanged){
	 	  event.expiresAt=computeExpire(event.date, event.autoDeleteDays);
		}                

		await event.save();
		await event.populate("organizer","username");
		res.json(event);
	}catch{
		res.status(400).json({message:"Bad request",error:err.message});
	}
}

//DELETE /api/events/:id
async function deleteEvent(req,res){
	try{
		const event=await Event.findById(req.params.id);
		if(!event) return res.status(404).json({message:"Not found"});

		if(!event.organizer.equals(req.user._id)){
		  return res.status(403).json({message:"Forbidden"});
		}
		await event.deleteOne();
		res.json({message:"Deleted"});
	}catch(err){
		res.status(400).json({message:"Bad request",error:err.message});
	}
}

module.exports={getEvents,createEvent, updateEvent, deleteEvent};
