import {handleJson} from "./apiHelper";

const BASE="/api/rsvps";

export async function rsvpToEvent(eventId){
  const res=await fetch(`${BASE}/${eventId}`,{
	method:"POST",
	credentials:"include",
  });
  return handleJson(res);
}

export async function getMyRsvps(){
  const res=await fetch(`${BASE}/my`,{
        credentials:"include",
  });
  return handleJson(res);
}

// all rsvps for organizer
export async function getEventRsvps(eventId){
  const res=await fetch(`${BASE}/event/${eventId}`,{
        credentials:"include",
  });
  return handleJson(res);
}


