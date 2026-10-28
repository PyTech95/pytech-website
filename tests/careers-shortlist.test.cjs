const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('frontend/app/api/[[...path]]/route.js', 'utf8');
const routes = source.slice(source.indexOf("    // ---- Careers:"), source.indexOf('    // ---- Email settings'));
const run = new Function('request', 'db', 'isAdmin', 'uuidv4', 'handleCORS', 'NextResponse', `return (async()=>{const route=request.nextUrl.pathname.slice(4);const method=request.method;${routes}})()`);
function harness(admin = true) {
  const rows = []; let offset;
  const collection = {
    insertOne: async (row) => rows.push(row), findOne: async () => null,
    updateOne: async ({id}, {$set}) => {const row = rows.find(a => a.id === id);if(row) Object.assign(row,$set);return {matchedCount:row ? 1:0};},
    find: () => ({sort: () => ({skip: n => {offset=n;return {limit: () => ({toArray: async () => rows.slice(n,n+500)})};}})}),
  };
  return { rows, get offset(){return offset}, call: (path, method, body={}) => run({method,nextUrl:new URL('http://localhost/api'+path),json:async()=>body,formData:async()=>new Map(Object.entries(body))}, {collection:()=>collection}, ()=>admin, ()=> 'candidate-1', r=>r, {json:(body,options)=>({body,status:options?.status||200})}) };
}
test('location is required and trimmed before save', async()=>{
 const h=harness();
 for(const currentLocation of ['', '   ']) {assert.equal((await h.call('/careers/apply','POST',{name:'Candidate',email:'a@example.com',currentLocation})).status,400);}
 assert.equal(h.rows.length,0);
 assert.equal((await h.call('/careers/apply','POST',{name:'Candidate',email:'a@example.com',currentLocation:' Gurugram, Haryana '})).status,200);
 assert.equal(h.rows[0].currentLocation,'Gurugram, Haryana');assert.equal(h.rows[0].starred,false);
});
test('admin can star and unstar existing applications persistently',async()=>{
 const h=harness();h.rows.push({id:'old'});
 for(const starred of [true,false]) {assert.equal((await h.call('/careers/applications/old','PATCH',{starred})).status,200);assert.equal(h.rows[0].starred,starred);}
 assert.equal((await h.call('/careers/applications/old','PATCH',{starred:'yes'})).status,400);
 assert.equal((await h.call('/careers/applications/missing','PATCH',{starred:true})).status,404);
});
test('shortlist and application list require admin access', async()=>{
 const h=harness(false);
 assert.equal((await h.call('/careers/applications/old','PATCH',{starred:true})).status,401);
 assert.equal((await h.call('/careers/applications','GET')).status,401);
});
test('older applications are accessible past first 500',async()=>{
 const h=harness();for(let i=0;i<501;i++)h.rows.push({id:String(i),starred:i===500});
 const result=await h.call('/careers/applications?offset=500','GET');
 assert.equal(result.body.length,1);assert.equal(result.body[0].starred,true);assert.equal(h.offset,500);
 assert.equal((await h.call('/careers/applications?offset=-1','GET')).status,400);
});
