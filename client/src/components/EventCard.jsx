export default function EventCard({event, onEdit, onDelete, onRsvp, onManageAttendees, curUser,}){
	let dateStr = "N/A";
	if(event.date){
	  const d=new Date(event.date);
	  if(!Number.isNaN(d.getTime())){
	    dateStr = d.toLocaleString();
	  }
	}

	//let capacityStr="Unlimited";
	//if (typeof event.capacity==="number" && event.capacity>0){
	//  capacityStr=String(event.capacity);
	//}

	let capacityLabel;
	const rsvpCount=event.rsvpCount ?? 0;
	const checkinCount = event.checkinCount ?? 0;
	
	if (typeof event.capacity==="number" && event.capacity>0){
          capacityLabel=`${event.capacity}/${rsvpCount}`;
	}else{
	  capacityLabel=`Unlimited (${rsvpCount} RSVPs)`;
	}
	
	const organizerName=event.organizer?.username||event.organizerName||"Unknown";

	const isOrganizer= curUser && curUser.role==="organizer" && event.organizer && event.organizer._id===curUser.id;	

	const isVisitor=curUser && curUser.role==="visitor";

	return (
    	  <div
      		style={{
        	border: "1px solid #ccc",
        	borderRadius: "8px",
        	padding: "12px",
        	marginBottom: "8px",
		background:"#222",
      		}}
    	  >
	    	<div style={{ display: "flex", gap: "12px" }}>
		    {/*left info*/}
		    <div style={{flex:1}}>
      			<h3 style={{ margin: "0 0 4px" }}>{event.title}</h3>
		
			<h5 style={{margin:"0 0 4px"}}>
                  	  {event.description && (
                    		<p style={{ margin: "8px", whiteSpace:"pre-wrap" }}>{event.description}</p>
                  	  )}
			</h5>

			<p><strong>Capacity: </strong>{capacityLabel}</p>
			<p><strong>Checked in: </strong>{checkinCount}</p>
      		
			<p><strong>Organizer: </strong>{organizerName}</p>			

			<p style={{ margin: "0 0 4px" }}>
        	  	  <strong>Date:</strong> {dateStr}
      			</p>

      			<p style={{ margin: "0 0 4px" }}>
        	  	  <strong>Location: </strong> {event.location}
      			</p>

	        	{event.category && (
        	  	  <p style={{ margin: "0 0 4px" }}>
          	    	  	<strong>Category: </strong> {event.category||"Other"}
        	  	  </p>
      			)}
				
			<div style={{marginTop:"8px", display:"flex", gap:"8px", flexWrap:"wrap"}}>
		  	  {isOrganizer && (
				<>
	      		  	  <button onClick={() => onEdit && onEdit(event)}>Edit</button>
	      		  	  <button onClick={() => onDelete && onDelete(event._id)}>Delete</button>
			  	  <button onClick={() => onManageAttendees && onManageAttendees(event)}>
			    		Manage attendees
			  	  </button>
				</>
		   	  )}

		   	  {isVisitor && (
                        	<button onClick={() => onRsvp && onRsvp(event)}>
                            		RSVP
                        	</button>
                  	  )}
			</div>
    	  	    </div>
	
	   	    {/*right poster*/}
	 	    {event.posterUrl && (
        		<div
          	  	  style={{
            	  	    flexBasis: "180px",
            	  	    flexShrink: 0,
            	  	    display: "flex",
            	  	    alignItems: "center",
            	  	    justifyContent: "center",
          	  	  }}
        		>
          	  	<img
            	    	  src={event.posterUrl}
            	    	  alt={`${event.title} poster`}
            	    	  style={{
              	    		maxWidth: "180px",
              	    		maxHeight: "260px",
             	    		objectFit: "cover",
              	    		borderRadius: "6px",
              	    		border: "2px solid #7b3fe4",
            	    	  }}
            	    	  onError={(e) => {
              			// hide broken images
              		 	e.currentTarget.style.display = "none";
            	    	  }}
          	   	/>
        	 </div>
      		)}
	    </div>
	</div>
 );
}
