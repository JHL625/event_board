import {handleJson} from "./apiHelper";

const BASE="/api/auth";

export async function registerUser({username,password,role}){
  const res=await fetch(`${BASE}/register`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    credentials:"include",
    body:JSON.stringify({username,password,role}),
  });
  return handleJson(res);
}

export async function loginUser({username,password}){
  const res=await fetch(`${BASE}/login`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    credentials:"include",
    body:JSON.stringify({username,password}),
  });
  return handleJson(res);
}

export async function logoutUser(){
  const res=await fetch(`${BASE}/logout`,{
    method:"POST",
    credentials:"include",
  });
  if(!res.ok){
    let msg="Logout failed";
    try{
      const data=await res.json();
      msg=data.message||msg;
    }catch{} throw new Error(msg);
  }
  return true;
}

export async function fetchCurUser(){
  const res=await fetch(`${BASE}/me`,{
    credentials:"include",
  });
  if(res.status===401) return null;
  return handleJson(res);
}
