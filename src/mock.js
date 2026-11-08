export const DEFAULT_ROUTES=[{id:'hello',method:'GET',path:'/api/hello',status:200,delay:0,body:{message:'Olá, LAB//ABERTO!'}},{id:'users',method:'GET',path:'/api/users',status:200,delay:0,body:[{id:1,name:'Ana'},{id:2,name:'Ravi'}]},{id:'created',method:'POST',path:'/api/users',status:201,delay:0,body:{id:3,created:true}}];
const METHODS=new Set(['GET','POST','PUT','PATCH','DELETE']);
export function validateRoute(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Rota inválida');
 const {id,method,path,status,delay,body}=input;
 if(typeof id!=='string'||! /^[a-zA-Z0-9_-]{1,40}$/.test(id))throw Error('ID inválido');
 if(!METHODS.has(method))throw Error('Método inválido');
 if(typeof path!=='string'||! /^\/api\/[a-zA-Z0-9/_-]*$/.test(path)||path.includes('//')||path.length>120)throw Error('Caminho inválido: use /api/...');
 if(!Number.isInteger(status)||status<100||status>599)throw Error('Status inválido');
 if(!Number.isInteger(delay)||delay<0||delay>3000)throw Error('Atraso deve estar entre 0 e 3000 ms');
 if(body===undefined||JSON.stringify(body)===undefined||JSON.stringify(body).length>20000)throw Error('Corpo JSON inválido ou grande demais');
 return {id,method,path,status,delay,body};
}
export function validateRoutes(input){
 if(!Array.isArray(input)||input.length>30)throw Error('Limite de 30 rotas');
 const routes=input.map(validateRoute),keys=new Set(),ids=new Set();
 for(const r of routes){const key=`${r.method} ${r.path}`;if(keys.has(key)||ids.has(r.id))throw Error('Rotas ou IDs duplicados');keys.add(key);ids.add(r.id);}
 return routes;
}
export function matchRoute(routes,method,path){return routes.find(r=>r.method===method&&r.path===path);}