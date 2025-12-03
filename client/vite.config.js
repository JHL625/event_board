import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host:"0.0.0.0",
    port:5173,
    allowedHosts:["ec2-18-224-94-170.us-east-2.compute.amazonaws.com"],
    proxy:{
      "/api":{
        target:"http://localhost:4000",
	chargeOrigin:true
      }
    }
  }

})
