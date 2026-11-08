import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {DEFAULT_ROUTES,validateRoutes,matchRoute} from './mock.js';
const publicDir=fileURLToPath(new URL('../public/',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
export function createApp(){
 let routes=structuredClone(DEFAULT_ROUTES);
 return http.createServer(async(req,res)=>{
  const send=(code,data)=>{res.writeHead(code,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','access-control-allow-origin':'*','access-control-allow-headers':'content-type','access-control-allow-methods':'GET,POST,PUT,PATCH,DELETE,OPTIONS'});res.end(JSON.stringify(data));};
  if(req.method==='OPTIONS'){res.writeHead(204,{'access-control-allow-origin':'*','access-control-allow-headers':'content-type','access-control-allow-methods':'GET,POST,PUT,PATCH,DELETE,OPTIONS'});return res.end();}
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname==='/_studio/routes'&&req.method==='GET')return send(200,{routes});
  if(pathname==='/_studio/routes'&&req.method==='PUT'){
   let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>100000)return send(413,{error:'Payload muito grande'});}
   try{routes=validateRoutes(JSON.parse(raw));return send(200,{routes});}catch(e){return send(400,{error:e.message});}
  }
  if(pathname.startsWith('/api/')){
   const r=matchRoute(routes,req.method,pathname);
   if(!r)return send(404,{error:'Mock não encontrado',method:req.method,path:pathname});
   if(r.delay)await new Promise(resolve=>setTimeout(resolve,r.delay));
   return send(r.status,r.body);
  }
  if(req.method!=='GET')return send(405,{error:'Método não permitido'});
  const file=pathname==='/'?'index.html':pathname.slice(1);
  if(!['index.html','app.js','style.css'].includes(file))return send(404,{error:'Não encontrado'});
  try{const body=await readFile(path.join(publicDir,file));res.writeHead(200,{'content-type':mime[path.extname(file)],'x-content-type-options':'nosniff'});res.end(body);}catch{return send(404,{error:'Arquivo não encontrado'});}
 });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const port=Number(process.env.PORT||3000);createApp().listen(port,'0.0.0.0',()=>console.log(`API Mock Station: http://localhost:${port}`));
}