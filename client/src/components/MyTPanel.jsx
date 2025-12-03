import {useEffect, useState} from "react";
import {getMyRsvps} from "../api/rsvpApi";
import {useAuth} from "../context/AuthContext";

export default function MyTPanel({refreshK}){
  const {user} =useAuth();
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [rsvps,setRsvps]=useState([]);

  useEffect(()=>{
	if(!user||user.role!=="visitor"){
	  setRsvps([]);
	  return;
	}
	let cancelled=false;

	async function load(){
	  setLoading(true);
	  setError("");
	  try{
	    const data=await getMyRsvps();
	    if(!cancelled) setRsvps(data);
	  }catch(err){
	    if(!cancelled) setError(err.message||"Failed to load tickets");
	  }finally{
	    if(!cancelled) setLoading(false);
	  }
	}

	load();
	return ()=>{cancelled=true;};
  },[user, refreshK]);


  if (!user||user.role!=="visitor") return null;

  return (
	<div 
	  style={{
		border:"1px solid #444",
		borderRadius:"8px",
		padding:"12px",
		marginTop:"16px",
		background:"#181818",
	  }}
	>
	  <h2>Tickets</h2>
	  {loading && <p>Loading tickets...</p>}
	  {error && (
		<p style={{color:"#ffb3b3", marginBottom:"8px"}}>{error}</p>
	  )}

	  {rsvps.length===0 && !loading && <p>No tickets yet</p>}

	  {rsvps.map((r)=>(
		<div
		  key={r._id} 
		  style={{
			border:"1px solid #333",
                	borderRadius:"6px",
                	padding:"8px",
                	marginBottom:"8px",
		  }}
		>
		  <strong>{r.event?.title||"Event"}</strong>

		  <div>Date:{" "}{r.event?.date? new Date(r.event.date).toLocaleString(): "N/A"}</div>

		  <div>Location: {r.event?.location||"Unknown"}</div>

		  <div>Status: {r.status}</div>
		  <div>Ticket Code: {r.ticketCode}</div>
		</div>
	  ))}
	</div>
  );
}
