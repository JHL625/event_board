import {handleJson} from "./apiHelper";
const BASE="/api/checkins";

export async function markAttend(eventId,ticketCode){
  const res=await fetch(`${BASE}/${eventId}/mark`,{
	method:"POST",
	headers:{"Content-Type":"application/json"},
	credentials:"include",
	body:JSON.stringify({ticketCode}),
  });
  return handleJson(res);
}


export async function getCheckins(eventId){
  const res=await fetch(`${BASE}/event/${eventId}`,{
        credentials:"include",
  });
  return handleJson(res);
}
