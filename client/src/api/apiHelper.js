export async function handleJson(res){
        if(!res.ok){
          let msg="Req. failed";
          try{
            const data=await res.json();
            msg=data.message||msg;
          }catch{} throw new Error(msg);
        }
        return res.json();
} 
