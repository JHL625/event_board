import EventCard from "./EventCard";

export default function EventList({events,onEdit,onDelete, onManageAttendees, onRsvp, curUser}){
	if (!events||events.length===0){
		return <p>No events yet</p>;
	}

	return(
	  <div>
		{events.map((ev)=>(
		  <EventCard
 		    key={ev._id}
		    event={ev}
		    onEdit={onEdit}
		    onDelete={onDelete}
		    onRsvp={onRsvp}
		    onManageAttendees={onManageAttendees}
		    curUser={curUser}
		  />
		))}
	  </div>
	);
}
