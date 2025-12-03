import{useEffect, useState} from "react";

const emptyForm={
  title:"",
  description:"",
  date:"",
  location:"",
  category:"Other",
  capacity:"",
  autoDeleteDays:"1",
  posterUrl:"",
};

export default function EventForm({onSubmit, editingEvent, onFinish}){
	const[form,setForm]=useState(emptyForm);

	useEffect(()=>{
		if(editingEvent){
	  		setForm({
			  title:editingEvent.title || "",
			  description:editingEvent.description || "",
			  date:editingEvent.date ? new Date(editingEvent.date).toISOString().slice(0,16) : "",
			  location: editingEvent.location||"",
			  category:editingEvent.category ||"Other",
			  capacity: 
			    typeof editingEvent.capacity === "number" && editingEvent.capacity>0 
				? String(editingEvent.capacity) : "",
			  autoDeleteDays: editingEvent.autoDeleteDays!=null ? String(editingEvent.autoDeleteDays):"1",
			  posterUrl:editingEvent.posterUrl||"",
			});
		}else{
			setForm(emptyForm);
		}
	},[editingEvent]);

	function handleChange(e){
		const{name,value}=e.target;
		setForm((f)=>({...f,[name]:value}));
	}

	function handleSubmit(e){
		e.preventDefault();
		if(!form.date){
		  alert("Please choose a data/time");
		  return;
		}
	
		const payload={
		  ...form,
		  date:form.date ? new Date(form.date):null,
		  posterUrl:form.posterUrl||"",
		};

		if(form.capacity.trim()===""){
		  payload.capacity=0; //empty as unlimited
		}else{
		  const n=parseInt(form.capacity,10);
		  payload.capacity= Number.isNaN(n) || n<0 ? 0 : n;
		}

		const days=parseInt(form.autoDeleteDays,10);
		payload.autoDeleteDays=!Number.isNaN(days)&&days>=0?days:0;
		

		onSubmit(payload);
		setForm(emptyForm);
		if(onFinish) onFinish();
	}

	return(
	  <form
      		onSubmit={handleSubmit}
      		style={{
        	  border: "1px solid #ccc",
        	  borderRadius: "8px",
        	  padding: "12px",
        	  marginBottom: "16px",
      		}}
    	  >
      		<h2 style={{ marginTop: 0 }}>
        	  {editingEvent ? "Edit Event" : "Create Event"}
      		</h2>
	  
	  	<div style={{ marginBottom: "8px" }}>
        		<input
          	  	  name="title"
          	  	  value={form.title}
          	  	  onChange={handleChange}
          	  	  placeholder="Title"
          	  	  required
          	  	  style={{ width: "100%", padding: "6px" }}
          		/>
      	  	</div>

		<div style={{ marginBottom: "8px" }}>
                        <input
                          name="posterUrl"
                          value={form.posterUrl}
                          onChange={handleChange}
                          placeholder="Poster image URL(https://...)"
                          style={{ width: "100%", padding: "6px" }}
                        />
			<small style={{color:"#ccc"}}>
                          Paste a link to an image (PNG/JPEG/GIF).
                        </small>
                </div>

	  	<div style={{ marginBottom: "8px" }}>
        		<textarea
          	  	  name="description"
          	  	  value={form.description}
          	  	  onChange={handleChange}
          	  	  placeholder="Description"
          	  	  rows={3}
          	  	  style={{ width: "100%", padding: "6px" }}
        		/>
      	  	</div>

	  	<div style={{ marginBottom: "8px" }}>
        		<input
          	  	  type="datetime-local"
          	  	  name="date"
          	  	  value={form.date}
          	  	  onChange={handleChange}
          	  	  required
          	  	  style={{ width: "100%", padding: "6px" }}
        		/>
      	  	</div>

		<div style={{ marginBottom: "8px" }}>
                        <input
                          type="number"
                          name="autoDeleteDays"
                          value={form.autoDelteDays}
                          onChange={handleChange}
			  placeholder="Delete this event N days later"
                          min="0"
                          style={{ width: "100%", padding: "6px" }}
                        />
			<small style={{color:"#ccc"}}>
			  0 = never auto-delete
			</small>
                </div>

	  	<div style={{ marginBottom: "8px" }}>
        		<input
          	  	  name="location"
          	  	  value={form.location}
          	  	  onChange={handleChange}
          	  	  placeholder="Location"
          	  	  required
          	  	  style={{ width: "100%", padding: "6px" }}
        		/>
      	  	</div>

                <div style={{ marginBottom: "8px" }}>
                        <input
			  type="number"
                          name="capacity"
                          value={form.capacity}
                          onChange={handleChange}
                          placeholder="Capacity(option)"
                          min="0"
                          style={{ width: "100%", padding: "6px" }}
                        />
                </div>

	  	<div style={{ marginBottom: "8px" }}>
        		<select
          	  	  name="category"
          	  	  value={form.category}
          	  	  onChange={handleChange}
          	  	  style={{ width: "100%", padding: "6px" }}
         	 	>
          	  	  <option>Workshop</option>
          	  	  <option>Talk</option>
          	  	  <option>Social</option>
          	  	  <option>Other</option>
        		</select>
      	  	</div>
	  
	  	<button type="submit" style={{ marginRight: "8px" }}>
        		{editingEvent ? "Save changes" : "Add event"}
      	  	</button>
      		{editingEvent && (
        	  <button type="button" onClick={onCancel}>
          	 	 Cancel
          	  </button>)}
	  </form>
	);
}
