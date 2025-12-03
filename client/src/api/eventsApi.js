import {handleJson} from "./apiHelper";
const BASE="/api/events";

export async function fetchEvents(){
	const res=await fetch(BASE,{credentials:"include",});
	return handleJson(res);
}

export async function createEvent(data){
	const res=await fetch(BASE,{
		method:"POST",
		headers:{"Content-Type":"application/json"},
		credentials:"include",
		body:JSON.stringify(data),
	});
	return handleJson(res);
}

export async function updateEvent(id,data){
	const res=await fetch(`${BASE}/${id}`,{
		method:"PUT",
		credentials:"include",
	});
	//if(!res.ok) throw new Error("Failed to update event");
	return handleJson(res);
}

export async function deleteEvent(id){
	const res=await fetch(`${BASE}/${id}`,{
		method:"DELETE",
	});
	if(!res.ok) throw new Error("Failed to delete");
	return res.json();
}
