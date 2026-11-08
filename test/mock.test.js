import test from 'node:test';import assert from 'node:assert/strict';
import {validateRoute,validateRoutes,matchRoute,DEFAULT_ROUTES} from '../src/mock.js';
import {createApp} from '../src/server.js';
const valid=()=>({id:'ok',method:'GET',path:'/api/ok',status:200,delay:0,body:{ok:true}});
test('rota válida',()=>assert.deepEqual(validateRoute(valid()),valid()));
test('método inválido',()=>assert.throws(()=>validateRoute({...valid(),method:'TRACE'})));
test('caminho restrito a /api/',()=>assert.throws(()=>validateRoute({...valid(),path:'/_studio/routes'})));
test('status inválido',()=>assert.throws(()=>validateRoute({...valid(),status:999})));
test('atraso limitado',()=>assert.throws(()=>validateRoute({...valid(),delay:5000})));
test('IDs duplicados',()=>assert.throws(()=>validateRoutes([valid(),{...valid(),path:'/api/other'}])));
test('método/caminho duplicados',()=>assert.throws(()=>validateRoutes([valid(),{...valid(),id:'other'}])));
test('limite de rotas',()=>assert.throws(()=>validateRoutes(Array.from({length:31},(_,i)=>({...valid(),id:`r${i}`,path:`/api/${i}`})))); 
test('match de método e caminho',()=>{assert.equal(matchRoute(DEFAULT_ROUTES,'GET','/api/hello').id,'hello');assert.equal(matchRoute(DEFAULT_ROUTES,'DELETE','/api/hello'),undefined);});
test('integração HTTP, configuração e respostas',async()=>{
 const server=createApp();await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=`http://127.0.0.1:${server.address().port}`;
 try{
  let r=await fetch(base+'/');assert.equal(r.status,200);assert.match(await r.text(),/API Mock Station/);
  r=await fetch(base+'/api/hello');assert.equal(r.status,200);assert.equal((await r.json()).message,'Olá, LAB//ABERTO!');
  r=await fetch(base+'/api/missing');assert.equal(r.status,404);
  r=await fetch(base+'/_studio/routes',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify([valid()])});assert.equal(r.status,200);
  r=await fetch(base+'/api/ok');assert.equal(r.status,200);assert.deepEqual(await r.json(),{ok:true});
  r=await fetch(base+'/_studio/routes',{method:'PUT',body:'{bad'});assert.equal(r.status,400);
  r=await fetch(base+'/_studio/routes');assert.equal((await r.json()).routes.length,1);
 }finally{await new Promise(r=>server.close(r));}
});