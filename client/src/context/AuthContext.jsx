import{createContext, useContext, useEffect, useState} from "react";
import{fetchCurUser, registerUser ,loginUser, logoutUser,} from "../api/authApi";

const AuthContext=createContext(null);

export function AuthProvider({children}){
	const [user,setUser]=useState(null); //{id,username,role}
	const [loading,setLoading]=useState(true);
	const [error,setError]=useState("");

	//get cookie from backend
	useEffect(()=>{
	  let cancelled=false;
	  
	  async function loadUser(){
	    setLoading(true);
	    setError("");
	    try{
	      const u=await fetchCurUser();
	      if(!cancelled) setUser(u);
	    }catch(err){
	      if(!cancelled) setError(err.message||"Failed to load user");
            }finally{
	      if(!cancelled) setLoading(false);
  	    }
 	  }
	  loadUser();
	  return()=>{cancelled=true};
	},[]);

	async function handleRegister({username,password,role}){
	 setError("");
	 const u=await registerUser({username,password,role});
	 setUser(u);
	}

	async function handleLogin({username,password}){
	  setError("");
	  const u=await loginUser({username,password});
	  setUser(u);
	}
	
	async function handleLogout(){
	  setError("");
	  try{
	    await logoutUser();
	    setUser(null);
	  }catch(err){
            setError(err.message||"Logout failed");
          }
	}

	const value={
	  user,
	  loading, 
	  error, 
	  login:handleLogin, 
	  register:handleRegister, 
	  logout:handleLogout, 
	  setError,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){
	const ctx=useContext(AuthContext);
 	if(!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
