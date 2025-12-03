import {useState, useEffect} from "react";
import {getEventRsvps} from "../api/rsvpApi";
import {getCheckins, markAttend} from "../api/checkinApi";

export default function OrganizerAPanel({event,onClose, onStatsChanged}){
  const [rsvps,setRsvps]=useState([]);
  const [checkins,setCheckins]=useState([]);
  const [loading,setLoading]=useState(false);
  const [checkinL,setCheckinL]=useState(false);
  const [err,setErr]=useState("");
  const [ticketCode,setTicketCode]=useState("");
  const [success,setSuccess]=useState("");

  useEffect(()=>{
	if(!event) return;
	let cancelled=false;

	async function load(){
	  setLoading(true);
	  setErr("");
	  setSuccess("");
	  try{
	    const [rsvpData,checkinData]=await Promise.all([
	      getEventRsvps(event._id),
	      getCheckins(event._id),
	    ]);
	    if(!cancelled) {
	      setRsvps(rsvpData);
	      setCheckins(checkinData);	
	    }
	  }catch(err){
	    if(!cancelled) setErr(err.message||"Failed to load attendees");
	  }finally{
	    if(!cancelled) setLoading(false);
	  }
	}

	load();
	return ()=>{cancelled=true;};
  },[event])

  if(!event) return null;

  const checkedInUserIds = new Set(checkins.map((c)=>c.attendee && c.attendee._id));

  async function handleCheckinSubmit(ev){
	ev.preventDefault();
	
	if(!ticketCode.trim()) return;
	
	setCheckinL(true);
	setErr("");
	setSuccess("");	

	try{
	  //call backend to mark attendance
	  await markAttend(event._id, ticketCode.trim());
	  
	  //clear input
	  setTicketCode("");
	  setSuccess("Checkin recorded!");

	  //refresh checkin and rsvps
	  const [rsvpData, checkinData]=await Promise.all([
	    getEventRsvps(event._id),
	    getCheckins(event._id),
	  ]);
          setRsvps(rsvpData);
	  setCheckins(checkinData);

	  if(onStatsChanged){
	    onStatsChanged();
	  }
	}catch(err){
	  setErr(err.message||"Check-in failed");
	}finally{
	  setCheckinL(false);
	}
  }

  return(
	<div
	  style={{
		border:"1px solid #555",
		borderRadius: "8px",
        	padding: "12px",
        	marginTop: "16px",
        	background: "#181818",
	  }}
	>
	  <div style={{display:"flex", justifyContent:"space-between"}}>
	    <h2 style={{marginTop:0}}>Attendees: {event.title}</h2>
	    <button onClick={onClose}>Close</button>
	  </div>

	  {loading && <p>Loading RSVPs and checkins...</p>}
	  {err && (<p style={{color:"#ffb3b3", marginBottom:"8px"}}>{err}</p>)}
	  {success && (<p style={{color:"#8f8", marginBottom:"8px"}}>{success}</p>)}

	  {/*checkin form*/}
	  <form
		style={{marginBottom:"12px", display:"flex", gap:"6px"}}
    		onSubmit={handleCheckinSubmit}
	  >
	    <input
		placeholder="Ticket Code"
	 	value={ticketCode}
		onChange={(e)=>setTicketCode(e.target.value)}
		style={{flex:1, padding:"6px"}}
	    />
	    <button type="submit" disabled={checkinL}>
		{checkinL ? "Checking in..." : "Mark attendance"}
	    </button>
	  </form>

	  {/*rsvps list*/}
	  <h3 style={{marginBottom:"4px"}}>RSVPs</h3>
	  {rsvps.length===0 && !loading && <p>No RSVPs yet</p>}
	  {rsvps.map((r)=>{
		const checkedIn = checkedInUserIds.has(r.user && r.user._id);
		return (
		  <div
		    key={r._id}
          	    style={{
                    border:"1px solid #333",
                    borderRadius: "6px",
                    padding: "8px",
                    marginBottom: "6px",
          	    }}
         	  >
		    <strong>{r.user?.username || "User"}</strong>
		    <div>Status: {r.status}</div>
		    <div>Ticket: {r.ticketCode}</div>
		    <div>Checked in: {" "}
		      <span style={{color:checkedIn ? "#8f8":"#f88"}}>
			{checkedIn? "Yes":"No"}
		      </span>
		    </div>
		  </div>
		);
	  })}
	</div>
  );
}
