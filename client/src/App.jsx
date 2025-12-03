import { useEffect, useState } from "react";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "./api/eventsApi";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import AuthPanel from "./components/AuthPanel";
import MyTPanel from "./components/MyTPanel";
import OrganizerAPanel from "./components/OrganizerAPanel";
import {useAuth} from "./context/AuthContext.jsx";
import {rsvpToEvent} from "./api/rsvpApi";

function App() {
  const{user}=useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [error, setError] = useState("");
  const [adminEvent,setAdminEvent] = useState(null);
  const [tRefresh,setTRefresh]=useState(0);

  async function loadEvents() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchEvents();
      // sort by date
      data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setEvents(data);
    } catch (e) {
      console.error(e);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleCreateOrUpdate(formData) {
    try {
      setError("");
      if(!user||user.role!=="organizer"){
	setError("Only organizers can create or edit events");
	return;
      }

      if (editingEvent) {
	//update existing event
        const updated = await updateEvent(editingEvent._id, formData);
        
	setEvents((prev) =>{
          const next=prev.map((ev) => (ev._id === updated._id ? updated : ev));
	  next.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	  return next;
	});

        setEditingEvent(null);
      } else {
	//create new event
        const created = await createEvent(formData);

        setEvents((prev) => {
	  const next=[...prev, created]);
	  next.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	  return next;
        });
      }
    } catch (e) {
      console.error(e);
      setError("Failed to save event");
    }
  }

  async function handleDelete(id) {
    try {
      setError("");
      if(!user||user.role!=="organizer"){
        setError("Only organizers can create or edit events");
        return;
      }
      await deleteEvent(id);
      setEvents((prev) => prev.filter((ev) => ev._id !== id));
    } catch (e) {
      console.error(e);
      setError("Failed to delete event");
    }
  }

  async function handleRsvp(event){
    try{
	if(!user||user.role!=="visitor"){
	  setError("You must be logged in as visitor to RSVP");
	  return;
	}
	setError("");
	
	const rsvp=await rsvpToEvent(event._id);
	alert(`RSVP successful! Your ticket code: ${rsvp.ticketCode}`);
	
	//reload and update counts
	await loadEvents();

	//MyTPanel reload
	setTRefresh((k)=>k+1);
    }catch(err){
	console.error(err);
	setError(err.message||"RSVP failed");
    }
  }

  async function handleManageAttendees(event){
    if(!user||user.role!=="organizer") return;
    setAdminEvent(event);
  }


  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "16px",
        fontFamily: "sans-serif",
	color:"#eee",
	background:"#111",
	minHeight:"100vh",
      }}
    >
      <h1>Event Board</h1>

      {/*Login/Register*/}
      <AuthPanel/>

      {error && (
        <div
          style={{
            background: "#552222",
            color: "#ffb3b",
            padding: "8px",
            marginBottom: "8px",
	    borderRadius:"4px",
          }}
        >
          {error}
        </div>
      )}

      {user && user.role==="organizer"?(
	<EventForm
          onSubmit={handleCreateOrUpdate}
          editingEvent={editingEvent}
          onFinish={() => setEditingEvent(null)}
        />
      ):(
	<p style={{marginBottom:"16px"}}>
	  Login as <strong>Organizer</strong> to create or manage events.
	</p>
      )}

      {loading ? <p>Loading events...</p> : null}

      <EventList
        events={events}
        onEdit={(ev) => { 
	  if(user && user.mode==="organizer"){
	    setEditingEvent(ev);
	  }
	}}
        onDelete={handleDelete}
	onRsvp={handleRsvp}
	onManageAttendees={handleManageAttendees}
	curUser={user}
      />

      <MyTPanel refreshK={tRefresh}/>

      {user && user.role==="organizer" && adminEvent && (
	<OrganizerAPanel 
	  event={adminEvent} 
	  onClose={()=> setAdminEvent(null)}
	  onStatsChanged={loadEvents}
	/>
      )}
    </div>
  );
}

export default App;
