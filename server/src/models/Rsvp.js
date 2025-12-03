const mongoose=require("mongoose");

const rsvpSchema=new mongoose.Schema(
  {
	user:{
	  type:mongoose.Schema.Types.ObjectId,
	  ref:"User", 
	  reuqired:true
	},
	event:{
	  type:mongoose.Schema.Types.ObjectId,
	  ref:"Event",
	  required:true
	},
	status:{
	  type:String,
	  enum:["going","cancelled"],
	  default:"going",
	},
	ticketCode:{
	  type:String,
	  required:true
	},
  },
  {timestamps:true}
);

rsvpSchema.index({user:1, event:1}, {unique:true});

module.exports=mongoose.model("Rsvp",rsvpSchema);
