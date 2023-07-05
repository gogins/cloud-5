import{_ as I,t as Me,u as ve,s as tt,l as J,a as Bt,b as K,d as Rt,f as Dt,e as $t,c as Pt,g as It,h as Nt,i as Lt,j as st,k as Ut}from"./settings.ea7ba944.js";import{c as R,u as mt,a as Gt,b as Mt,f as qt,d as zt,C as Ht}from"./useKeydown.72a52a62.js";import{r as Jt,d as Kt,a as Vt,b as Wt,g as me,s as Yt,i as Xt,p as gt,w as Zt,c as Qt}from"./prebake.2658b75f.js";import{g as es,c as ts,r as v}from"./index.528e429e.js";import{j as d}from"./jsx-runtime.0c15e696.js";import"./mini.2df09350.js";import{j as ss}from"./doc.4c8d7d30.js";import"./client.bf050b43.js";function rs(n,e){for(var t=0;t<e.length;t++){const s=e[t];if(typeof s!="string"&&!Array.isArray(s)){for(const r in s)if(r!=="default"&&!(r in n)){const i=Object.getOwnPropertyDescriptor(s,r);i&&Object.defineProperty(n,r,i.get?i:{enumerable:!0,get:()=>s[r]})}}}return Object.freeze(Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}))}var ns=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(i){return i instanceof t?i:new t(function(o){o(i)})}return new(t||(t=Promise))(function(i,o){function a(c){try{h(s.next(c))}catch(u){o(u)}}function l(c){try{h(s.throw(c))}catch(u){o(u)}}function h(c){c.done?i(c.value):r(c.value).then(a,l)}h((s=s.apply(n,e||[])).next())})};const is=n=>{let e;return n?e=n:typeof fetch>"u"?e=(...t)=>ns(void 0,void 0,void 0,function*(){return yield(yield I(()=>Promise.resolve().then(()=>je),void 0)).fetch(...t)}):e=fetch,(...t)=>e(...t)};class Ve extends Error{constructor(e,t="FunctionsError",s){super(e),super.name=t,this.context=s}}class os extends Ve{constructor(e){super("Failed to send a request to the Edge Function","FunctionsFetchError",e)}}class as extends Ve{constructor(e){super("Relay Error invoking the Edge Function","FunctionsRelayError",e)}}class ls extends Ve{constructor(e){super("Edge Function returned a non-2xx status code","FunctionsHttpError",e)}}var cs=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(i){return i instanceof t?i:new t(function(o){o(i)})}return new(t||(t=Promise))(function(i,o){function a(c){try{h(s.next(c))}catch(u){o(u)}}function l(c){try{h(s.throw(c))}catch(u){o(u)}}function h(c){c.done?i(c.value):r(c.value).then(a,l)}h((s=s.apply(n,e||[])).next())})};class hs{constructor(e,{headers:t={},customFetch:s}={}){this.url=e,this.headers=t,this.fetch=is(s)}setAuth(e){this.headers.Authorization=`Bearer ${e}`}invoke(e,t={}){var s;return cs(this,void 0,void 0,function*(){try{const{headers:r,method:i,body:o}=t;let a={},l;o&&(r&&!Object.prototype.hasOwnProperty.call(r,"Content-Type")||!r)&&(typeof Blob<"u"&&o instanceof Blob||o instanceof ArrayBuffer?(a["Content-Type"]="application/octet-stream",l=o):typeof o=="string"?(a["Content-Type"]="text/plain",l=o):typeof FormData<"u"&&o instanceof FormData?l=o:(a["Content-Type"]="application/json",l=JSON.stringify(o)));const h=yield this.fetch(`${this.url}/${e}`,{method:i||"POST",headers:Object.assign(Object.assign(Object.assign({},a),this.headers),r),body:l}).catch(y=>{throw new os(y)}),c=h.headers.get("x-relay-error");if(c&&c==="true")throw new as(h);if(!h.ok)throw new ls(h);let u=((s=h.headers.get("Content-Type"))!==null&&s!==void 0?s:"text/plain").split(";")[0].trim(),m;return u==="application/json"?m=yield h.json():u==="application/octet-stream"?m=yield h.blob():u==="multipart/form-data"?m=yield h.formData():m=yield h.text(),{data:m,error:null}}catch(r){return{data:null,error:r}}})}}var qe={exports:{}};(function(n,e){var t=typeof self<"u"?self:ts,s=function(){function i(){this.fetch=!1,this.DOMException=t.DOMException}return i.prototype=t,new i}();(function(i){(function(o){var a={searchParams:"URLSearchParams"in i,iterable:"Symbol"in i&&"iterator"in Symbol,blob:"FileReader"in i&&"Blob"in i&&function(){try{return new Blob,!0}catch{return!1}}(),formData:"FormData"in i,arrayBuffer:"ArrayBuffer"in i};function l(f){return f&&DataView.prototype.isPrototypeOf(f)}if(a.arrayBuffer)var h=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],c=ArrayBuffer.isView||function(f){return f&&h.indexOf(Object.prototype.toString.call(f))>-1};function u(f){if(typeof f!="string"&&(f=String(f)),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(f))throw new TypeError("Invalid character in header field name");return f.toLowerCase()}function m(f){return typeof f!="string"&&(f=String(f)),f}function y(f){var p={next:function(){var x=f.shift();return{done:x===void 0,value:x}}};return a.iterable&&(p[Symbol.iterator]=function(){return p}),p}function g(f){this.map={},f instanceof g?f.forEach(function(p,x){this.append(x,p)},this):Array.isArray(f)?f.forEach(function(p){this.append(p[0],p[1])},this):f&&Object.getOwnPropertyNames(f).forEach(function(p){this.append(p,f[p])},this)}g.prototype.append=function(f,p){f=u(f),p=m(p);var x=this.map[f];this.map[f]=x?x+", "+p:p},g.prototype.delete=function(f){delete this.map[u(f)]},g.prototype.get=function(f){return f=u(f),this.has(f)?this.map[f]:null},g.prototype.has=function(f){return this.map.hasOwnProperty(u(f))},g.prototype.set=function(f,p){this.map[u(f)]=m(p)},g.prototype.forEach=function(f,p){for(var x in this.map)this.map.hasOwnProperty(x)&&f.call(p,this.map[x],x,this)},g.prototype.keys=function(){var f=[];return this.forEach(function(p,x){f.push(x)}),y(f)},g.prototype.values=function(){var f=[];return this.forEach(function(p){f.push(p)}),y(f)},g.prototype.entries=function(){var f=[];return this.forEach(function(p,x){f.push([x,p])}),y(f)},a.iterable&&(g.prototype[Symbol.iterator]=g.prototype.entries);function w(f){if(f.bodyUsed)return Promise.reject(new TypeError("Already read"));f.bodyUsed=!0}function b(f){return new Promise(function(p,x){f.onload=function(){p(f.result)},f.onerror=function(){x(f.error)}})}function k(f){var p=new FileReader,x=b(p);return p.readAsArrayBuffer(f),x}function D(f){var p=new FileReader,x=b(p);return p.readAsText(f),x}function $(f){for(var p=new Uint8Array(f),x=new Array(p.length),S=0;S<p.length;S++)x[S]=String.fromCharCode(p[S]);return x.join("")}function F(f){if(f.slice)return f.slice(0);var p=new Uint8Array(f.byteLength);return p.set(new Uint8Array(f)),p.buffer}function U(){return this.bodyUsed=!1,this._initBody=function(f){this._bodyInit=f,f?typeof f=="string"?this._bodyText=f:a.blob&&Blob.prototype.isPrototypeOf(f)?this._bodyBlob=f:a.formData&&FormData.prototype.isPrototypeOf(f)?this._bodyFormData=f:a.searchParams&&URLSearchParams.prototype.isPrototypeOf(f)?this._bodyText=f.toString():a.arrayBuffer&&a.blob&&l(f)?(this._bodyArrayBuffer=F(f.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):a.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(f)||c(f))?this._bodyArrayBuffer=F(f):this._bodyText=f=Object.prototype.toString.call(f):this._bodyText="",this.headers.get("content-type")||(typeof f=="string"?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):a.searchParams&&URLSearchParams.prototype.isPrototypeOf(f)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},a.blob&&(this.blob=function(){var f=w(this);if(f)return f;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?w(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(k)}),this.text=function(){var f=w(this);if(f)return f;if(this._bodyBlob)return D(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve($(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},a.formData&&(this.formData=function(){return this.text().then(be)}),this.json=function(){return this.text().then(JSON.parse)},this}var Te=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function W(f){var p=f.toUpperCase();return Te.indexOf(p)>-1?p:f}function q(f,p){p=p||{};var x=p.body;if(f instanceof q){if(f.bodyUsed)throw new TypeError("Already read");this.url=f.url,this.credentials=f.credentials,p.headers||(this.headers=new g(f.headers)),this.method=f.method,this.mode=f.mode,this.signal=f.signal,!x&&f._bodyInit!=null&&(x=f._bodyInit,f.bodyUsed=!0)}else this.url=String(f);if(this.credentials=p.credentials||this.credentials||"same-origin",(p.headers||!this.headers)&&(this.headers=new g(p.headers)),this.method=W(p.method||this.method||"GET"),this.mode=p.mode||this.mode||null,this.signal=p.signal||this.signal,this.referrer=null,(this.method==="GET"||this.method==="HEAD")&&x)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(x)}q.prototype.clone=function(){return new q(this,{body:this._bodyInit})};function be(f){var p=new FormData;return f.trim().split("&").forEach(function(x){if(x){var S=x.split("="),O=S.shift().replace(/\+/g," "),j=S.join("=").replace(/\+/g," ");p.append(decodeURIComponent(O),decodeURIComponent(j))}}),p}function Se(f){var p=new g,x=f.replace(/\r?\n[\t ]+/g," ");return x.split(/\r?\n/).forEach(function(S){var O=S.split(":"),j=O.shift().trim();if(j){var C=O.join(":").trim();p.append(j,C)}}),p}U.call(q.prototype);function N(f,p){p||(p={}),this.type="default",this.status=p.status===void 0?200:p.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in p?p.statusText:"OK",this.headers=new g(p.headers),this.url=p.url||"",this._initBody(f)}U.call(N.prototype),N.prototype.clone=function(){return new N(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new g(this.headers),url:this.url})},N.error=function(){var f=new N(null,{status:0,statusText:""});return f.type="error",f};var Fe=[301,302,303,307,308];N.redirect=function(f,p){if(Fe.indexOf(p)===-1)throw new RangeError("Invalid status code");return new N(null,{status:p,headers:{location:f}})},o.DOMException=i.DOMException;try{new o.DOMException}catch{o.DOMException=function(p,x){this.message=p,this.name=x;var S=Error(p);this.stack=S.stack},o.DOMException.prototype=Object.create(Error.prototype),o.DOMException.prototype.constructor=o.DOMException}function ne(f,p){return new Promise(function(x,S){var O=new q(f,p);if(O.signal&&O.signal.aborted)return S(new o.DOMException("Aborted","AbortError"));var j=new XMLHttpRequest;function C(){j.abort()}j.onload=function(){var G={status:j.status,statusText:j.statusText,headers:Se(j.getAllResponseHeaders()||"")};G.url="responseURL"in j?j.responseURL:G.headers.get("X-Request-URL");var ie="response"in j?j.response:j.responseText;x(new N(ie,G))},j.onerror=function(){S(new TypeError("Network request failed"))},j.ontimeout=function(){S(new TypeError("Network request failed"))},j.onabort=function(){S(new o.DOMException("Aborted","AbortError"))},j.open(O.method,O.url,!0),O.credentials==="include"?j.withCredentials=!0:O.credentials==="omit"&&(j.withCredentials=!1),"responseType"in j&&a.blob&&(j.responseType="blob"),O.headers.forEach(function(G,ie){j.setRequestHeader(ie,G)}),O.signal&&(O.signal.addEventListener("abort",C),j.onreadystatechange=function(){j.readyState===4&&O.signal.removeEventListener("abort",C)}),j.send(typeof O._bodyInit>"u"?null:O._bodyInit)})}return ne.polyfill=!0,i.fetch||(i.fetch=ne,i.Headers=g,i.Request=q,i.Response=N),o.Headers=g,o.Request=q,o.Response=N,o.fetch=ne,Object.defineProperty(o,"__esModule",{value:!0}),o})({})})(s),s.fetch.ponyfill=!0,delete s.fetch.polyfill;var r=s;e=r.fetch,e.default=r.fetch,e.fetch=r.fetch,e.Headers=r.Headers,e.Request=r.Request,e.Response=r.Response,n.exports=e})(qe,qe.exports);var We=qe.exports;const Ye=es(We),je=rs({__proto__:null,default:Ye},[We]);class ds{constructor(e){this.shouldThrowOnError=!1,this.method=e.method,this.url=e.url,this.headers=e.headers,this.schema=e.schema,this.body=e.body,this.shouldThrowOnError=e.shouldThrowOnError,this.signal=e.signal,this.allowEmpty=e.allowEmpty,e.fetch?this.fetch=e.fetch:typeof fetch>"u"?this.fetch=Ye:this.fetch=fetch}throwOnError(){return this.shouldThrowOnError=!0,this}then(e,t){this.schema===void 0||(["GET","HEAD"].includes(this.method)?this.headers["Accept-Profile"]=this.schema:this.headers["Content-Profile"]=this.schema),this.method!=="GET"&&this.method!=="HEAD"&&(this.headers["Content-Type"]="application/json");const s=this.fetch;let r=s(this.url.toString(),{method:this.method,headers:this.headers,body:JSON.stringify(this.body),signal:this.signal}).then(async i=>{var o,a,l;let h=null,c=null,u=null,m=i.status,y=i.statusText;if(i.ok){if(this.method!=="HEAD"){const k=await i.text();k===""||(this.headers.Accept==="text/csv"||this.headers.Accept&&this.headers.Accept.includes("application/vnd.pgrst.plan+text")?c=k:c=JSON.parse(k))}const w=(o=this.headers.Prefer)===null||o===void 0?void 0:o.match(/count=(exact|planned|estimated)/),b=(a=i.headers.get("content-range"))===null||a===void 0?void 0:a.split("/");w&&b&&b.length>1&&(u=parseInt(b[1]))}else{const w=await i.text();try{h=JSON.parse(w),Array.isArray(h)&&i.status===404&&(c=[],h=null,m=200,y="OK")}catch{i.status===404&&w===""?(m=204,y="No Content"):h={message:w}}if(h&&this.allowEmpty&&(!((l=h?.details)===null||l===void 0)&&l.includes("Results contain 0 rows"))&&(h=null,m=200,y="OK"),h&&this.shouldThrowOnError)throw h}return{error:h,data:c,count:u,status:m,statusText:y}});return this.shouldThrowOnError||(r=r.catch(i=>{var o,a,l;return{error:{message:`${(o=i?.name)!==null&&o!==void 0?o:"FetchError"}: ${i?.message}`,details:`${(a=i?.stack)!==null&&a!==void 0?a:""}`,hint:"",code:`${(l=i?.code)!==null&&l!==void 0?l:""}`},data:null,count:null,status:0,statusText:""}})),r.then(e,t)}}class us extends ds{select(e){let t=!1;const s=(e??"*").split("").map(r=>/\s/.test(r)&&!t?"":(r==='"'&&(t=!t),r)).join("");return this.url.searchParams.set("select",s),this.headers.Prefer&&(this.headers.Prefer+=","),this.headers.Prefer+="return=representation",this}order(e,{ascending:t=!0,nullsFirst:s,foreignTable:r}={}){const i=r?`${r}.order`:"order",o=this.url.searchParams.get(i);return this.url.searchParams.set(i,`${o?`${o},`:""}${e}.${t?"asc":"desc"}${s===void 0?"":s?".nullsfirst":".nullslast"}`),this}limit(e,{foreignTable:t}={}){const s=typeof t>"u"?"limit":`${t}.limit`;return this.url.searchParams.set(s,`${e}`),this}range(e,t,{foreignTable:s}={}){const r=typeof s>"u"?"offset":`${s}.offset`,i=typeof s>"u"?"limit":`${s}.limit`;return this.url.searchParams.set(r,`${e}`),this.url.searchParams.set(i,`${t-e+1}`),this}abortSignal(e){return this.signal=e,this}single(){return this.headers.Accept="application/vnd.pgrst.object+json",this}maybeSingle(){return this.headers.Accept="application/vnd.pgrst.object+json",this.allowEmpty=!0,this}csv(){return this.headers.Accept="text/csv",this}geojson(){return this.headers.Accept="application/geo+json",this}explain({analyze:e=!1,verbose:t=!1,settings:s=!1,buffers:r=!1,wal:i=!1,format:o="text"}={}){const a=[e?"analyze":null,t?"verbose":null,s?"settings":null,r?"buffers":null,i?"wal":null].filter(Boolean).join("|"),l=this.headers.Accept;return this.headers.Accept=`application/vnd.pgrst.plan+${o}; for="${l}"; options=${a};`,o==="json"?this:this}rollback(){var e;return((e=this.headers.Prefer)!==null&&e!==void 0?e:"").trim().length>0?this.headers.Prefer+=",tx=rollback":this.headers.Prefer="tx=rollback",this}returns(){return this}}class ae extends us{eq(e,t){return this.url.searchParams.append(e,`eq.${t}`),this}neq(e,t){return this.url.searchParams.append(e,`neq.${t}`),this}gt(e,t){return this.url.searchParams.append(e,`gt.${t}`),this}gte(e,t){return this.url.searchParams.append(e,`gte.${t}`),this}lt(e,t){return this.url.searchParams.append(e,`lt.${t}`),this}lte(e,t){return this.url.searchParams.append(e,`lte.${t}`),this}like(e,t){return this.url.searchParams.append(e,`like.${t}`),this}likeAllOf(e,t){return this.url.searchParams.append(e,`like(all).{${t.join(",")}}`),this}likeAnyOf(e,t){return this.url.searchParams.append(e,`like(any).{${t.join(",")}}`),this}ilike(e,t){return this.url.searchParams.append(e,`ilike.${t}`),this}ilikeAllOf(e,t){return this.url.searchParams.append(e,`ilike(all).{${t.join(",")}}`),this}ilikeAnyOf(e,t){return this.url.searchParams.append(e,`ilike(any).{${t.join(",")}}`),this}is(e,t){return this.url.searchParams.append(e,`is.${t}`),this}in(e,t){const s=t.map(r=>typeof r=="string"&&new RegExp("[,()]").test(r)?`"${r}"`:`${r}`).join(",");return this.url.searchParams.append(e,`in.(${s})`),this}contains(e,t){return typeof t=="string"?this.url.searchParams.append(e,`cs.${t}`):Array.isArray(t)?this.url.searchParams.append(e,`cs.{${t.join(",")}}`):this.url.searchParams.append(e,`cs.${JSON.stringify(t)}`),this}containedBy(e,t){return typeof t=="string"?this.url.searchParams.append(e,`cd.${t}`):Array.isArray(t)?this.url.searchParams.append(e,`cd.{${t.join(",")}}`):this.url.searchParams.append(e,`cd.${JSON.stringify(t)}`),this}rangeGt(e,t){return this.url.searchParams.append(e,`sr.${t}`),this}rangeGte(e,t){return this.url.searchParams.append(e,`nxl.${t}`),this}rangeLt(e,t){return this.url.searchParams.append(e,`sl.${t}`),this}rangeLte(e,t){return this.url.searchParams.append(e,`nxr.${t}`),this}rangeAdjacent(e,t){return this.url.searchParams.append(e,`adj.${t}`),this}overlaps(e,t){return typeof t=="string"?this.url.searchParams.append(e,`ov.${t}`):this.url.searchParams.append(e,`ov.{${t.join(",")}}`),this}textSearch(e,t,{config:s,type:r}={}){let i="";r==="plain"?i="pl":r==="phrase"?i="ph":r==="websearch"&&(i="w");const o=s===void 0?"":`(${s})`;return this.url.searchParams.append(e,`${i}fts${o}.${t}`),this}match(e){return Object.entries(e).forEach(([t,s])=>{this.url.searchParams.append(t,`eq.${s}`)}),this}not(e,t,s){return this.url.searchParams.append(e,`not.${t}.${s}`),this}or(e,{foreignTable:t}={}){const s=t?`${t}.or`:"or";return this.url.searchParams.append(s,`(${e})`),this}filter(e,t,s){return this.url.searchParams.append(e,`${t}.${s}`),this}}class fs{constructor(e,{headers:t={},schema:s,fetch:r}){this.url=e,this.headers=t,this.schema=s,this.fetch=r}select(e,{head:t=!1,count:s}={}){const r=t?"HEAD":"GET";let i=!1;const o=(e??"*").split("").map(a=>/\s/.test(a)&&!i?"":(a==='"'&&(i=!i),a)).join("");return this.url.searchParams.set("select",o),s&&(this.headers.Prefer=`count=${s}`),new ae({method:r,url:this.url,headers:this.headers,schema:this.schema,fetch:this.fetch,allowEmpty:!1})}insert(e,{count:t,defaultToNull:s=!0}={}){const r="POST",i=[];if(this.headers.Prefer&&i.push(this.headers.Prefer),t&&i.push(`count=${t}`),s||i.push("missing=default"),this.headers.Prefer=i.join(","),Array.isArray(e)){const o=e.reduce((a,l)=>a.concat(Object.keys(l)),[]);if(o.length>0){const a=[...new Set(o)].map(l=>`"${l}"`);this.url.searchParams.set("columns",a.join(","))}}return new ae({method:r,url:this.url,headers:this.headers,schema:this.schema,body:e,fetch:this.fetch,allowEmpty:!1})}upsert(e,{onConflict:t,ignoreDuplicates:s=!1,count:r,defaultToNull:i=!0}={}){const o="POST",a=[`resolution=${s?"ignore":"merge"}-duplicates`];if(t!==void 0&&this.url.searchParams.set("on_conflict",t),this.headers.Prefer&&a.push(this.headers.Prefer),r&&a.push(`count=${r}`),i||a.push("missing=default"),this.headers.Prefer=a.join(","),Array.isArray(e)){const l=e.reduce((h,c)=>h.concat(Object.keys(c)),[]);if(l.length>0){const h=[...new Set(l)].map(c=>`"${c}"`);this.url.searchParams.set("columns",h.join(","))}}return new ae({method:o,url:this.url,headers:this.headers,schema:this.schema,body:e,fetch:this.fetch,allowEmpty:!1})}update(e,{count:t}={}){const s="PATCH",r=[];return this.headers.Prefer&&r.push(this.headers.Prefer),t&&r.push(`count=${t}`),this.headers.Prefer=r.join(","),new ae({method:s,url:this.url,headers:this.headers,schema:this.schema,body:e,fetch:this.fetch,allowEmpty:!1})}delete({count:e}={}){const t="DELETE",s=[];return e&&s.push(`count=${e}`),this.headers.Prefer&&s.unshift(this.headers.Prefer),this.headers.Prefer=s.join(","),new ae({method:t,url:this.url,headers:this.headers,schema:this.schema,fetch:this.fetch,allowEmpty:!1})}}const ps="1.6.0",ms={"X-Client-Info":`postgrest-js/${ps}`};class gs{constructor(e,{headers:t={},schema:s,fetch:r}={}){this.url=e,this.headers=Object.assign(Object.assign({},ms),t),this.schema=s,this.fetch=r}from(e){const t=new URL(`${this.url}/${e}`);return new fs(t,{headers:Object.assign({},this.headers),schema:this.schema,fetch:this.fetch})}rpc(e,t={},{head:s=!1,count:r}={}){let i;const o=new URL(`${this.url}/rpc/${e}`);let a;s?(i="HEAD",Object.entries(t).forEach(([h,c])=>{o.searchParams.append(h,`${c}`)})):(i="POST",a=t);const l=Object.assign({},this.headers);return r&&(l.Prefer=`count=${r}`),new ae({method:i,url:o,headers:l,schema:this.schema,body:a,fetch:this.fetch,allowEmpty:!1})}}var Be,rt;function vs(){if(rt)return Be;rt=1;var n=function(){if(typeof self=="object"&&self)return self;if(typeof window=="object"&&window)return window;throw new Error("Unable to resolve global `this`")};return Be=function(){if(this)return this;if(typeof globalThis=="object"&&globalThis)return globalThis;try{Object.defineProperty(Object.prototype,"__global__",{get:function(){return this},configurable:!0})}catch{return n()}try{return __global__||n()}finally{delete Object.prototype.__global__}}(),Be}const ys="websocket",bs="Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",_s=["websocket","websockets","socket","networking","comet","push","RFC-6455","realtime","server","client"],ws="Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)",xs=["Iñaki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"],Cs="1.0.34",As={type:"git",url:"https://github.com/theturtle32/WebSocket-Node.git"},js="https://github.com/theturtle32/WebSocket-Node",ks={node:">=4.0.0"},Es={bufferutil:"^4.0.1",debug:"^2.2.0","es5-ext":"^0.10.50","typedarray-to-buffer":"^3.1.5","utf-8-validate":"^5.0.2",yaeti:"^0.0.6"},Ts={"buffer-equal":"^1.0.0",gulp:"^4.0.2","gulp-jshint":"^2.0.4","jshint-stylish":"^2.2.1",jshint:"^2.0.0",tape:"^4.9.1"},Ss={verbose:!1},Fs={test:"tape test/unit/*.js",gulp:"gulp"},Os="index",Bs={lib:"./lib"},Rs="lib/browser.js",Ds="Apache-2.0",$s={name:ys,description:bs,keywords:_s,author:ws,contributors:xs,version:Cs,repository:As,homepage:js,engines:ks,dependencies:Es,devDependencies:Ts,config:Ss,scripts:Fs,main:Os,directories:Bs,browser:Rs,license:Ds};var Ps=$s.version,ee;if(typeof globalThis=="object")ee=globalThis;else try{ee=vs()}catch{}finally{if(!ee&&typeof window<"u"&&(ee=window),!ee)throw new Error("Could not determine global this")}var ge=ee.WebSocket||ee.MozWebSocket,Is=Ps;function vt(n,e){var t;return e?t=new ge(n,e):t=new ge(n),t}ge&&["CONNECTING","OPEN","CLOSING","CLOSED"].forEach(function(n){Object.defineProperty(vt,n,{get:function(){return ge[n]}})});var Ns={w3cwebsocket:ge?vt:null,version:Is};const Ls="2.7.2",Us={"X-Client-Info":`realtime-js/${Ls}`},Gs="1.0.0",yt=1e4,Ms=1e3;var fe;(function(n){n[n.connecting=0]="connecting",n[n.open=1]="open",n[n.closing=2]="closing",n[n.closed=3]="closed"})(fe||(fe={}));var L;(function(n){n.closed="closed",n.errored="errored",n.joined="joined",n.joining="joining",n.leaving="leaving"})(L||(L={}));var z;(function(n){n.close="phx_close",n.error="phx_error",n.join="phx_join",n.reply="phx_reply",n.leave="phx_leave",n.access_token="access_token"})(z||(z={}));var ze;(function(n){n.websocket="websocket"})(ze||(ze={}));var te;(function(n){n.Connecting="connecting",n.Open="open",n.Closing="closing",n.Closed="closed"})(te||(te={}));class bt{constructor(e,t){this.callback=e,this.timerCalc=t,this.timer=void 0,this.tries=0,this.callback=e,this.timerCalc=t}reset(){this.tries=0,clearTimeout(this.timer)}scheduleTimeout(){clearTimeout(this.timer),this.timer=setTimeout(()=>{this.tries=this.tries+1,this.callback()},this.timerCalc(this.tries+1))}}class qs{constructor(){this.HEADER_LENGTH=1}decode(e,t){return e.constructor===ArrayBuffer?t(this._binaryDecode(e)):t(typeof e=="string"?JSON.parse(e):{})}_binaryDecode(e){const t=new DataView(e),s=new TextDecoder;return this._decodeBroadcast(e,t,s)}_decodeBroadcast(e,t,s){const r=t.getUint8(1),i=t.getUint8(2);let o=this.HEADER_LENGTH+2;const a=s.decode(e.slice(o,o+r));o=o+r;const l=s.decode(e.slice(o,o+i));o=o+i;const h=JSON.parse(s.decode(e.slice(o,e.byteLength)));return{ref:null,topic:a,event:l,payload:h}}}class Re{constructor(e,t,s={},r=yt){this.channel=e,this.event=t,this.payload=s,this.timeout=r,this.sent=!1,this.timeoutTimer=void 0,this.ref="",this.receivedResp=null,this.recHooks=[],this.refEvent=null,this.rateLimited=!1}resend(e){this.timeout=e,this._cancelRefEvent(),this.ref="",this.refEvent=null,this.receivedResp=null,this.sent=!1,this.send()}send(){if(this._hasReceived("timeout"))return;this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload,ref:this.ref,join_ref:this.channel._joinRef()})==="rate limited"&&(this.rateLimited=!0)}updatePayload(e){this.payload=Object.assign(Object.assign({},this.payload),e)}receive(e,t){var s;return this._hasReceived(e)&&t((s=this.receivedResp)===null||s===void 0?void 0:s.response),this.recHooks.push({status:e,callback:t}),this}startTimeout(){if(this.timeoutTimer)return;this.ref=this.channel.socket._makeRef(),this.refEvent=this.channel._replyEventName(this.ref);const e=t=>{this._cancelRefEvent(),this._cancelTimeout(),this.receivedResp=t,this._matchReceive(t)};this.channel._on(this.refEvent,{},e),this.timeoutTimer=setTimeout(()=>{this.trigger("timeout",{})},this.timeout)}trigger(e,t){this.refEvent&&this.channel._trigger(this.refEvent,{status:e,response:t})}destroy(){this._cancelRefEvent(),this._cancelTimeout()}_cancelRefEvent(){this.refEvent&&this.channel._off(this.refEvent,{})}_cancelTimeout(){clearTimeout(this.timeoutTimer),this.timeoutTimer=void 0}_matchReceive({status:e,response:t}){this.recHooks.filter(s=>s.status===e).forEach(s=>s.callback(t))}_hasReceived(e){return this.receivedResp&&this.receivedResp.status===e}}var nt;(function(n){n.SYNC="sync",n.JOIN="join",n.LEAVE="leave"})(nt||(nt={}));class pe{constructor(e,t){this.channel=e,this.state={},this.pendingDiffs=[],this.joinRef=null,this.caller={onJoin:()=>{},onLeave:()=>{},onSync:()=>{}};const s=t?.events||{state:"presence_state",diff:"presence_diff"};this.channel._on(s.state,{},r=>{const{onJoin:i,onLeave:o,onSync:a}=this.caller;this.joinRef=this.channel._joinRef(),this.state=pe.syncState(this.state,r,i,o),this.pendingDiffs.forEach(l=>{this.state=pe.syncDiff(this.state,l,i,o)}),this.pendingDiffs=[],a()}),this.channel._on(s.diff,{},r=>{const{onJoin:i,onLeave:o,onSync:a}=this.caller;this.inPendingSyncState()?this.pendingDiffs.push(r):(this.state=pe.syncDiff(this.state,r,i,o),a())}),this.onJoin((r,i,o)=>{this.channel._trigger("presence",{event:"join",key:r,currentPresences:i,newPresences:o})}),this.onLeave((r,i,o)=>{this.channel._trigger("presence",{event:"leave",key:r,currentPresences:i,leftPresences:o})}),this.onSync(()=>{this.channel._trigger("presence",{event:"sync"})})}static syncState(e,t,s,r){const i=this.cloneDeep(e),o=this.transformState(t),a={},l={};return this.map(i,(h,c)=>{o[h]||(l[h]=c)}),this.map(o,(h,c)=>{const u=i[h];if(u){const m=c.map(b=>b.presence_ref),y=u.map(b=>b.presence_ref),g=c.filter(b=>y.indexOf(b.presence_ref)<0),w=u.filter(b=>m.indexOf(b.presence_ref)<0);g.length>0&&(a[h]=g),w.length>0&&(l[h]=w)}else a[h]=c}),this.syncDiff(i,{joins:a,leaves:l},s,r)}static syncDiff(e,t,s,r){const{joins:i,leaves:o}={joins:this.transformState(t.joins),leaves:this.transformState(t.leaves)};return s||(s=()=>{}),r||(r=()=>{}),this.map(i,(a,l)=>{var h;const c=(h=e[a])!==null&&h!==void 0?h:[];if(e[a]=this.cloneDeep(l),c.length>0){const u=e[a].map(y=>y.presence_ref),m=c.filter(y=>u.indexOf(y.presence_ref)<0);e[a].unshift(...m)}s(a,c,l)}),this.map(o,(a,l)=>{let h=e[a];if(!h)return;const c=l.map(u=>u.presence_ref);h=h.filter(u=>c.indexOf(u.presence_ref)<0),e[a]=h,r(a,h,l),h.length===0&&delete e[a]}),e}static map(e,t){return Object.getOwnPropertyNames(e).map(s=>t(s,e[s]))}static transformState(e){return e=this.cloneDeep(e),Object.getOwnPropertyNames(e).reduce((t,s)=>{const r=e[s];return"metas"in r?t[s]=r.metas.map(i=>(i.presence_ref=i.phx_ref,delete i.phx_ref,delete i.phx_ref_prev,i)):t[s]=r,t},{})}static cloneDeep(e){return JSON.parse(JSON.stringify(e))}onJoin(e){this.caller.onJoin=e}onLeave(e){this.caller.onLeave=e}onSync(e){this.caller.onSync=e}inPendingSyncState(){return!this.joinRef||this.joinRef!==this.channel._joinRef()}}var T;(function(n){n.abstime="abstime",n.bool="bool",n.date="date",n.daterange="daterange",n.float4="float4",n.float8="float8",n.int2="int2",n.int4="int4",n.int4range="int4range",n.int8="int8",n.int8range="int8range",n.json="json",n.jsonb="jsonb",n.money="money",n.numeric="numeric",n.oid="oid",n.reltime="reltime",n.text="text",n.time="time",n.timestamp="timestamp",n.timestamptz="timestamptz",n.timetz="timetz",n.tsrange="tsrange",n.tstzrange="tstzrange"})(T||(T={}));const it=(n,e,t={})=>{var s;const r=(s=t.skipTypes)!==null&&s!==void 0?s:[];return Object.keys(e).reduce((i,o)=>(i[o]=zs(o,n,e,r),i),{})},zs=(n,e,t,s)=>{const r=e.find(a=>a.name===n),i=r?.type,o=t[n];return i&&!s.includes(i)?_t(i,o):He(o)},_t=(n,e)=>{if(n.charAt(0)==="_"){const t=n.slice(1,n.length);return Vs(e,t)}switch(n){case T.bool:return Hs(e);case T.float4:case T.float8:case T.int2:case T.int4:case T.int8:case T.numeric:case T.oid:return Js(e);case T.json:case T.jsonb:return Ks(e);case T.timestamp:return Ws(e);case T.abstime:case T.date:case T.daterange:case T.int4range:case T.int8range:case T.money:case T.reltime:case T.text:case T.time:case T.timestamptz:case T.timetz:case T.tsrange:case T.tstzrange:return He(e);default:return He(e)}},He=n=>n,Hs=n=>{switch(n){case"t":return!0;case"f":return!1;default:return n}},Js=n=>{if(typeof n=="string"){const e=parseFloat(n);if(!Number.isNaN(e))return e}return n},Ks=n=>{if(typeof n=="string")try{return JSON.parse(n)}catch(e){return console.log(`JSON parse error: ${e}`),n}return n},Vs=(n,e)=>{if(typeof n!="string")return n;const t=n.length-1,s=n[t];if(n[0]==="{"&&s==="}"){let i;const o=n.slice(1,t);try{i=JSON.parse("["+o+"]")}catch{i=o?o.split(","):[]}return i.map(a=>_t(e,a))}return n},Ws=n=>typeof n=="string"?n.replace(" ","T"):n;var ot=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(i){return i instanceof t?i:new t(function(o){o(i)})}return new(t||(t=Promise))(function(i,o){function a(c){try{h(s.next(c))}catch(u){o(u)}}function l(c){try{h(s.throw(c))}catch(u){o(u)}}function h(c){c.done?i(c.value):r(c.value).then(a,l)}h((s=s.apply(n,e||[])).next())})},at;(function(n){n.ALL="*",n.INSERT="INSERT",n.UPDATE="UPDATE",n.DELETE="DELETE"})(at||(at={}));var lt;(function(n){n.BROADCAST="broadcast",n.PRESENCE="presence",n.POSTGRES_CHANGES="postgres_changes"})(lt||(lt={}));var ct;(function(n){n.SUBSCRIBED="SUBSCRIBED",n.TIMED_OUT="TIMED_OUT",n.CLOSED="CLOSED",n.CHANNEL_ERROR="CHANNEL_ERROR"})(ct||(ct={}));class Xe{constructor(e,t={config:{}},s){this.topic=e,this.params=t,this.socket=s,this.bindings={},this.state=L.closed,this.joinedOnce=!1,this.pushBuffer=[],this.params.config=Object.assign({broadcast:{ack:!1,self:!1},presence:{key:""}},t.config),this.timeout=this.socket.timeout,this.joinPush=new Re(this,z.join,this.params,this.timeout),this.rejoinTimer=new bt(()=>this._rejoinUntilConnected(),this.socket.reconnectAfterMs),this.joinPush.receive("ok",()=>{this.state=L.joined,this.rejoinTimer.reset(),this.pushBuffer.forEach(r=>r.send()),this.pushBuffer=[]}),this._onClose(()=>{this.rejoinTimer.reset(),this.socket.log("channel",`close ${this.topic} ${this._joinRef()}`),this.state=L.closed,this.socket._remove(this)}),this._onError(r=>{this._isLeaving()||this._isClosed()||(this.socket.log("channel",`error ${this.topic}`,r),this.state=L.errored,this.rejoinTimer.scheduleTimeout())}),this.joinPush.receive("timeout",()=>{this._isJoining()&&(this.socket.log("channel",`timeout ${this.topic}`,this.joinPush.timeout),this.state=L.errored,this.rejoinTimer.scheduleTimeout())}),this._on(z.reply,{},(r,i)=>{this._trigger(this._replyEventName(i),r)}),this.presence=new pe(this)}subscribe(e,t=this.timeout){var s,r;if(this.joinedOnce)throw"tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance";{const{config:{broadcast:i,presence:o}}=this.params;this._onError(h=>e&&e("CHANNEL_ERROR",h)),this._onClose(()=>e&&e("CLOSED"));const a={},l={broadcast:i,presence:o,postgres_changes:(r=(s=this.bindings.postgres_changes)===null||s===void 0?void 0:s.map(h=>h.filter))!==null&&r!==void 0?r:[]};this.socket.accessToken&&(a.access_token=this.socket.accessToken),this.updateJoinPayload(Object.assign({config:l},a)),this.joinedOnce=!0,this._rejoin(t),this.joinPush.receive("ok",({postgres_changes:h})=>{var c;if(this.socket.accessToken&&this.socket.setAuth(this.socket.accessToken),h===void 0){e&&e("SUBSCRIBED");return}else{const u=this.bindings.postgres_changes,m=(c=u?.length)!==null&&c!==void 0?c:0,y=[];for(let g=0;g<m;g++){const w=u[g],{filter:{event:b,schema:k,table:D,filter:$}}=w,F=h&&h[g];if(F&&F.event===b&&F.schema===k&&F.table===D&&F.filter===$)y.push(Object.assign(Object.assign({},w),{id:F.id}));else{this.unsubscribe(),e&&e("CHANNEL_ERROR",new Error("mismatch between server and client bindings for postgres changes"));return}}this.bindings.postgres_changes=y,e&&e("SUBSCRIBED");return}}).receive("error",h=>{e&&e("CHANNEL_ERROR",new Error(JSON.stringify(Object.values(h).join(", ")||"error")))}).receive("timeout",()=>{e&&e("TIMED_OUT")})}return this}presenceState(){return this.presence.state}track(e,t={}){return ot(this,void 0,void 0,function*(){return yield this.send({type:"presence",event:"track",payload:e},t.timeout||this.timeout)})}untrack(e={}){return ot(this,void 0,void 0,function*(){return yield this.send({type:"presence",event:"untrack"},e)})}on(e,t,s){return this._on(e,t,s)}send(e,t={}){return new Promise(s=>{var r,i,o;const a=this._push(e.type,e,t.timeout||this.timeout);a.rateLimited&&s("rate limited"),e.type==="broadcast"&&!(!((o=(i=(r=this.params)===null||r===void 0?void 0:r.config)===null||i===void 0?void 0:i.broadcast)===null||o===void 0)&&o.ack)&&s("ok"),a.receive("ok",()=>s("ok")),a.receive("timeout",()=>s("timed out"))})}updateJoinPayload(e){this.joinPush.updatePayload(e)}unsubscribe(e=this.timeout){this.state=L.leaving;const t=()=>{this.socket.log("channel",`leave ${this.topic}`),this._trigger(z.close,"leave",this._joinRef())};return this.rejoinTimer.reset(),this.joinPush.destroy(),new Promise(s=>{const r=new Re(this,z.leave,{},e);r.receive("ok",()=>{t(),s("ok")}).receive("timeout",()=>{t(),s("timed out")}).receive("error",()=>{s("error")}),r.send(),this._canPush()||r.trigger("ok",{})})}_push(e,t,s=this.timeout){if(!this.joinedOnce)throw`tried to push '${e}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;let r=new Re(this,e,t,s);return this._canPush()?r.send():(r.startTimeout(),this.pushBuffer.push(r)),r}_onMessage(e,t,s){return t}_isMember(e){return this.topic===e}_joinRef(){return this.joinPush.ref}_trigger(e,t,s){var r,i;const o=e.toLocaleLowerCase(),{close:a,error:l,leave:h,join:c}=z;if(s&&[a,l,h,c].indexOf(o)>=0&&s!==this._joinRef())return;let m=this._onMessage(o,t,s);if(t&&!m)throw"channel onMessage callbacks must return the payload, modified or unmodified";["insert","update","delete"].includes(o)?(r=this.bindings.postgres_changes)===null||r===void 0||r.filter(y=>{var g,w,b;return((g=y.filter)===null||g===void 0?void 0:g.event)==="*"||((b=(w=y.filter)===null||w===void 0?void 0:w.event)===null||b===void 0?void 0:b.toLocaleLowerCase())===o}).map(y=>y.callback(m,s)):(i=this.bindings[o])===null||i===void 0||i.filter(y=>{var g,w,b,k,D,$;if(["broadcast","presence","postgres_changes"].includes(o))if("id"in y){const F=y.id,U=(g=y.filter)===null||g===void 0?void 0:g.event;return F&&((w=t.ids)===null||w===void 0?void 0:w.includes(F))&&(U==="*"||U?.toLocaleLowerCase()===((b=t.data)===null||b===void 0?void 0:b.type.toLocaleLowerCase()))}else{const F=(D=(k=y?.filter)===null||k===void 0?void 0:k.event)===null||D===void 0?void 0:D.toLocaleLowerCase();return F==="*"||F===(($=t?.event)===null||$===void 0?void 0:$.toLocaleLowerCase())}else return y.type.toLocaleLowerCase()===o}).map(y=>{if(typeof m=="object"&&"ids"in m){const g=m.data,{schema:w,table:b,commit_timestamp:k,type:D,errors:$}=g;m=Object.assign(Object.assign({},{schema:w,table:b,commit_timestamp:k,eventType:D,new:{},old:{},errors:$}),this._getPayloadRecords(g))}y.callback(m,s)})}_isClosed(){return this.state===L.closed}_isJoined(){return this.state===L.joined}_isJoining(){return this.state===L.joining}_isLeaving(){return this.state===L.leaving}_replyEventName(e){return`chan_reply_${e}`}_on(e,t,s){const r=e.toLocaleLowerCase(),i={type:r,filter:t,callback:s};return this.bindings[r]?this.bindings[r].push(i):this.bindings[r]=[i],this}_off(e,t){const s=e.toLocaleLowerCase();return this.bindings[s]=this.bindings[s].filter(r=>{var i;return!(((i=r.type)===null||i===void 0?void 0:i.toLocaleLowerCase())===s&&Xe.isEqual(r.filter,t))}),this}static isEqual(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const s in e)if(e[s]!==t[s])return!1;return!0}_rejoinUntilConnected(){this.rejoinTimer.scheduleTimeout(),this.socket.isConnected()&&this._rejoin()}_onClose(e){this._on(z.close,{},e)}_onError(e){this._on(z.error,{},t=>e(t))}_canPush(){return this.socket.isConnected()&&this._isJoined()}_rejoin(e=this.timeout){this._isLeaving()||(this.socket._leaveOpenTopic(this.topic),this.state=L.joining,this.joinPush.resend(e))}_getPayloadRecords(e){const t={new:{},old:{}};return(e.type==="INSERT"||e.type==="UPDATE")&&(t.new=it(e.columns,e.record)),(e.type==="UPDATE"||e.type==="DELETE")&&(t.old=it(e.columns,e.old_record)),t}}var De=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(i){return i instanceof t?i:new t(function(o){o(i)})}return new(t||(t=Promise))(function(i,o){function a(c){try{h(s.next(c))}catch(u){o(u)}}function l(c){try{h(s.throw(c))}catch(u){o(u)}}function h(c){c.done?i(c.value):r(c.value).then(a,l)}h((s=s.apply(n,e||[])).next())})};const Ys=()=>{};class Xs{constructor(e,t){var s;this.accessToken=null,this.channels=[],this.endPoint="",this.headers=Us,this.params={},this.timeout=yt,this.transport=Ns.w3cwebsocket,this.heartbeatIntervalMs=3e4,this.heartbeatTimer=void 0,this.pendingHeartbeatRef=null,this.ref=0,this.logger=Ys,this.conn=null,this.sendBuffer=[],this.serializer=new qs,this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.eventsPerSecondLimitMs=100,this.inThrottle=!1,this.endPoint=`${e}/${ze.websocket}`,t?.params&&(this.params=t.params),t?.headers&&(this.headers=Object.assign(Object.assign({},this.headers),t.headers)),t?.timeout&&(this.timeout=t.timeout),t?.logger&&(this.logger=t.logger),t?.transport&&(this.transport=t.transport),t?.heartbeatIntervalMs&&(this.heartbeatIntervalMs=t.heartbeatIntervalMs);const r=(s=t?.params)===null||s===void 0?void 0:s.eventsPerSecond;r&&(this.eventsPerSecondLimitMs=Math.floor(1e3/r)),this.reconnectAfterMs=t?.reconnectAfterMs?t.reconnectAfterMs:i=>[1e3,2e3,5e3,1e4][i-1]||1e4,this.encode=t?.encode?t.encode:(i,o)=>o(JSON.stringify(i)),this.decode=t?.decode?t.decode:this.serializer.decode.bind(this.serializer),this.reconnectTimer=new bt(()=>De(this,void 0,void 0,function*(){this.disconnect(),this.connect()}),this.reconnectAfterMs)}connect(){this.conn||(this.conn=new this.transport(this._endPointURL(),[],null,this.headers),this.conn&&(this.conn.binaryType="arraybuffer",this.conn.onopen=()=>this._onConnOpen(),this.conn.onerror=e=>this._onConnError(e),this.conn.onmessage=e=>this._onConnMessage(e),this.conn.onclose=e=>this._onConnClose(e)))}disconnect(e,t){this.conn&&(this.conn.onclose=function(){},e?this.conn.close(e,t??""):this.conn.close(),this.conn=null,this.heartbeatTimer&&clearInterval(this.heartbeatTimer),this.reconnectTimer.reset())}getChannels(){return this.channels}removeChannel(e){return De(this,void 0,void 0,function*(){const t=yield e.unsubscribe();return this.channels.length===0&&this.disconnect(),t})}removeAllChannels(){return De(this,void 0,void 0,function*(){const e=yield Promise.all(this.channels.map(t=>t.unsubscribe()));return this.disconnect(),e})}log(e,t,s){this.logger(e,t,s)}connectionState(){switch(this.conn&&this.conn.readyState){case fe.connecting:return te.Connecting;case fe.open:return te.Open;case fe.closing:return te.Closing;default:return te.Closed}}isConnected(){return this.connectionState()===te.Open}channel(e,t={config:{}}){this.isConnected()||this.connect();const s=new Xe(`realtime:${e}`,t,this);return this.channels.push(s),s}push(e){const{topic:t,event:s,payload:r,ref:i}=e;let o=()=>{this.encode(e,a=>{var l;(l=this.conn)===null||l===void 0||l.send(a)})};if(this.log("push",`${t} ${s} (${i})`,r),this.isConnected())if(["broadcast","presence","postgres_changes"].includes(s)){if(this._throttle(o)())return"rate limited"}else o();else this.sendBuffer.push(o)}setAuth(e){this.accessToken=e,this.channels.forEach(t=>{e&&t.updateJoinPayload({access_token:e}),t.joinedOnce&&t._isJoined()&&t._push(z.access_token,{access_token:e})})}_makeRef(){let e=this.ref+1;return e===this.ref?this.ref=0:this.ref=e,this.ref.toString()}_leaveOpenTopic(e){let t=this.channels.find(s=>s.topic===e&&(s._isJoined()||s._isJoining()));t&&(this.log("transport",`leaving duplicate topic "${e}"`),t.unsubscribe())}_remove(e){this.channels=this.channels.filter(t=>t._joinRef()!==e._joinRef())}_endPointURL(){return this._appendParams(this.endPoint,Object.assign({},this.params,{vsn:Gs}))}_onConnMessage(e){this.decode(e.data,t=>{let{topic:s,event:r,payload:i,ref:o}=t;(o&&o===this.pendingHeartbeatRef||r===i?.type)&&(this.pendingHeartbeatRef=null),this.log("receive",`${i.status||""} ${s} ${r} ${o&&"("+o+")"||""}`,i),this.channels.filter(a=>a._isMember(s)).forEach(a=>a._trigger(r,i,o)),this.stateChangeCallbacks.message.forEach(a=>a(t))})}_onConnOpen(){this.log("transport",`connected to ${this._endPointURL()}`),this._flushSendBuffer(),this.reconnectTimer.reset(),this.heartbeatTimer&&clearInterval(this.heartbeatTimer),this.heartbeatTimer=setInterval(()=>this._sendHeartbeat(),this.heartbeatIntervalMs),this.stateChangeCallbacks.open.forEach(e=>e())}_onConnClose(e){this.log("transport","close",e),this._triggerChanError(),this.heartbeatTimer&&clearInterval(this.heartbeatTimer),this.reconnectTimer.scheduleTimeout(),this.stateChangeCallbacks.close.forEach(t=>t(e))}_onConnError(e){this.log("transport",e.message),this._triggerChanError(),this.stateChangeCallbacks.error.forEach(t=>t(e))}_triggerChanError(){this.channels.forEach(e=>e._trigger(z.error))}_appendParams(e,t){if(Object.keys(t).length===0)return e;const s=e.match(/\?/)?"&":"?",r=new URLSearchParams(t);return`${e}${s}${r}`}_flushSendBuffer(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(e=>e()),this.sendBuffer=[])}_sendHeartbeat(){var e;if(this.isConnected()){if(this.pendingHeartbeatRef){this.pendingHeartbeatRef=null,this.log("transport","heartbeat timeout. Attempting to re-establish connection"),(e=this.conn)===null||e===void 0||e.close(Ms,"hearbeat timeout");return}this.pendingHeartbeatRef=this._makeRef(),this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:this.pendingHeartbeatRef}),this.setAuth(this.accessToken)}}_throttle(e,t=this.eventsPerSecondLimitMs){return()=>this.inThrottle?!0:(e(),t>0&&(this.inThrottle=!0,setTimeout(()=>{this.inThrottle=!1},t)),!1)}}class Ze extends Error{constructor(e){super(e),this.__isStorageError=!0,this.name="StorageError"}}function B(n){return typeof n=="object"&&n!==null&&"__isStorageError"in n}class Zs extends Ze{constructor(e,t){super(e),this.name="StorageApiError",this.status=t}toJSON(){return{name:this.name,message:this.message,status:this.status}}}class ht extends Ze{constructor(e,t){super(e),this.name="StorageUnknownError",this.originalError=t}}var wt=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(i){return i instanceof t?i:new t(function(o){o(i)})}return new(t||(t=Promise))(function(i,o){function a(c){try{h(s.next(c))}catch(u){o(u)}}function l(c){try{h(s.throw(c))}catch(u){o(u)}}function h(c){c.done?i(c.value):r(c.value).then(a,l)}h((s=s.apply(n,e||[])).next())})};const xt=n=>{let e;return n?e=n:typeof fetch>"u"?e=(...t)=>wt(void 0,void 0,void 0,function*(){return yield(yield I(()=>Promise.resolve().then(()=>je),void 0)).fetch(...t)}):e=fetch,(...t)=>e(...t)},Qs=()=>wt(void 0,void 0,void 0,function*(){return typeof Response>"u"?(yield I(()=>Promise.resolve().then(()=>je),void 0)).Response:Response});var le=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(i){return i instanceof t?i:new t(function(o){o(i)})}return new(t||(t=Promise))(function(i,o){function a(c){try{h(s.next(c))}catch(u){o(u)}}function l(c){try{h(s.throw(c))}catch(u){o(u)}}function h(c){c.done?i(c.value):r(c.value).then(a,l)}h((s=s.apply(n,e||[])).next())})};const $e=n=>n.msg||n.message||n.error_description||n.error||JSON.stringify(n),er=(n,e)=>le(void 0,void 0,void 0,function*(){const t=yield Qs();n instanceof t?n.json().then(s=>{e(new Zs($e(s),n.status||500))}).catch(s=>{e(new ht($e(s),s))}):e(new ht($e(n),n))}),tr=(n,e,t,s)=>{const r={method:n,headers:e?.headers||{}};return n==="GET"?r:(r.headers=Object.assign({"Content-Type":"application/json"},e?.headers),r.body=JSON.stringify(s),Object.assign(Object.assign({},r),t))};function ke(n,e,t,s,r,i){return le(this,void 0,void 0,function*(){return new Promise((o,a)=>{n(t,tr(e,s,r,i)).then(l=>{if(!l.ok)throw l;return s?.noResolveJson?l:l.json()}).then(l=>o(l)).catch(l=>er(l,a))})})}function Je(n,e,t,s){return le(this,void 0,void 0,function*(){return ke(n,"GET",e,t,s)})}function Z(n,e,t,s,r){return le(this,void 0,void 0,function*(){return ke(n,"POST",e,s,r,t)})}function sr(n,e,t,s,r){return le(this,void 0,void 0,function*(){return ke(n,"PUT",e,s,r,t)})}function Ct(n,e,t,s,r){return le(this,void 0,void 0,function*(){return ke(n,"DELETE",e,s,r,t)})}var M=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(i){return i instanceof t?i:new t(function(o){o(i)})}return new(t||(t=Promise))(function(i,o){function a(c){try{h(s.next(c))}catch(u){o(u)}}function l(c){try{h(s.throw(c))}catch(u){o(u)}}function h(c){c.done?i(c.value):r(c.value).then(a,l)}h((s=s.apply(n,e||[])).next())})};const rr={limit:100,offset:0,sortBy:{column:"name",order:"asc"}},dt={cacheControl:"3600",contentType:"text/plain;charset=UTF-8",upsert:!1};class nr{constructor(e,t={},s,r){this.url=e,this.headers=t,this.bucketId=s,this.fetch=xt(r)}uploadOrUpdate(e,t,s,r){return M(this,void 0,void 0,function*(){try{let i;const o=Object.assign(Object.assign({},dt),r),a=Object.assign(Object.assign({},this.headers),e==="POST"&&{"x-upsert":String(o.upsert)});typeof Blob<"u"&&s instanceof Blob?(i=new FormData,i.append("cacheControl",o.cacheControl),i.append("",s)):typeof FormData<"u"&&s instanceof FormData?(i=s,i.append("cacheControl",o.cacheControl)):(i=s,a["cache-control"]=`max-age=${o.cacheControl}`,a["content-type"]=o.contentType);const l=this._removeEmptyFolders(t),h=this._getFinalPath(l),c=yield this.fetch(`${this.url}/object/${h}`,Object.assign({method:e,body:i,headers:a},o?.duplex?{duplex:o.duplex}:{}));return c.ok?{data:{path:l},error:null}:{data:null,error:yield c.json()}}catch(i){if(B(i))return{data:null,error:i};throw i}})}upload(e,t,s){return M(this,void 0,void 0,function*(){return this.uploadOrUpdate("POST",e,t,s)})}uploadToSignedUrl(e,t,s,r){return M(this,void 0,void 0,function*(){const i=this._removeEmptyFolders(e),o=this._getFinalPath(i),a=new URL(this.url+`/object/upload/sign/${o}`);a.searchParams.set("token",t);try{let l;const h=Object.assign({upsert:dt.upsert},r),c=Object.assign(Object.assign({},this.headers),{"x-upsert":String(h.upsert)});typeof Blob<"u"&&s instanceof Blob?(l=new FormData,l.append("cacheControl",h.cacheControl),l.append("",s)):typeof FormData<"u"&&s instanceof FormData?(l=s,l.append("cacheControl",h.cacheControl)):(l=s,c["cache-control"]=`max-age=${h.cacheControl}`,c["content-type"]=h.contentType);const u=yield this.fetch(a.toString(),{method:"PUT",body:l,headers:c});return u.ok?{data:{path:i},error:null}:{data:null,error:yield u.json()}}catch(l){if(B(l))return{data:null,error:l};throw l}})}createSignedUploadUrl(e){return M(this,void 0,void 0,function*(){try{let t=this._getFinalPath(e);const s=yield Z(this.fetch,`${this.url}/object/upload/sign/${t}`,{},{headers:this.headers}),r=new URL(this.url+s.url),i=r.searchParams.get("token");if(!i)throw new Ze("No token returned by API");return{data:{signedUrl:r.toString(),path:e,token:i},error:null}}catch(t){if(B(t))return{data:null,error:t};throw t}})}update(e,t,s){return M(this,void 0,void 0,function*(){return this.uploadOrUpdate("PUT",e,t,s)})}move(e,t){return M(this,void 0,void 0,function*(){try{return{data:yield Z(this.fetch,`${this.url}/object/move`,{bucketId:this.bucketId,sourceKey:e,destinationKey:t},{headers:this.headers}),error:null}}catch(s){if(B(s))return{data:null,error:s};throw s}})}copy(e,t){return M(this,void 0,void 0,function*(){try{return{data:{path:(yield Z(this.fetch,`${this.url}/object/copy`,{bucketId:this.bucketId,sourceKey:e,destinationKey:t},{headers:this.headers})).Key},error:null}}catch(s){if(B(s))return{data:null,error:s};throw s}})}createSignedUrl(e,t,s){return M(this,void 0,void 0,function*(){try{let r=this._getFinalPath(e),i=yield Z(this.fetch,`${this.url}/object/sign/${r}`,Object.assign({expiresIn:t},s?.transform?{transform:s.transform}:{}),{headers:this.headers});const o=s?.download?`&download=${s.download===!0?"":s.download}`:"";return i={signedUrl:encodeURI(`${this.url}${i.signedURL}${o}`)},{data:i,error:null}}catch(r){if(B(r))return{data:null,error:r};throw r}})}createSignedUrls(e,t,s){return M(this,void 0,void 0,function*(){try{const r=yield Z(this.fetch,`${this.url}/object/sign/${this.bucketId}`,{expiresIn:t,paths:e},{headers:this.headers}),i=s?.download?`&download=${s.download===!0?"":s.download}`:"";return{data:r.map(o=>Object.assign(Object.assign({},o),{signedUrl:o.signedURL?encodeURI(`${this.url}${o.signedURL}${i}`):null})),error:null}}catch(r){if(B(r))return{data:null,error:r};throw r}})}download(e,t){return M(this,void 0,void 0,function*(){const r=typeof t?.transform<"u"?"render/image/authenticated":"object",i=this.transformOptsToQueryString(t?.transform||{}),o=i?`?${i}`:"";try{const a=this._getFinalPath(e);return{data:yield(yield Je(this.fetch,`${this.url}/${r}/${a}${o}`,{headers:this.headers,noResolveJson:!0})).blob(),error:null}}catch(a){if(B(a))return{data:null,error:a};throw a}})}getPublicUrl(e,t){const s=this._getFinalPath(e),r=[],i=t?.download?`download=${t.download===!0?"":t.download}`:"";i!==""&&r.push(i);const a=typeof t?.transform<"u"?"render/image":"object",l=this.transformOptsToQueryString(t?.transform||{});l!==""&&r.push(l);let h=r.join("&");return h!==""&&(h=`?${h}`),{data:{publicUrl:encodeURI(`${this.url}/${a}/public/${s}${h}`)}}}remove(e){return M(this,void 0,void 0,function*(){try{return{data:yield Ct(this.fetch,`${this.url}/object/${this.bucketId}`,{prefixes:e},{headers:this.headers}),error:null}}catch(t){if(B(t))return{data:null,error:t};throw t}})}list(e,t,s){return M(this,void 0,void 0,function*(){try{const r=Object.assign(Object.assign(Object.assign({},rr),t),{prefix:e||""});return{data:yield Z(this.fetch,`${this.url}/object/list/${this.bucketId}`,r,{headers:this.headers},s),error:null}}catch(r){if(B(r))return{data:null,error:r};throw r}})}_getFinalPath(e){return`${this.bucketId}/${e}`}_removeEmptyFolders(e){return e.replace(/^\/|\/$/g,"").replace(/\/+/g,"/")}transformOptsToQueryString(e){const t=[];return e.width&&t.push(`width=${e.width}`),e.height&&t.push(`height=${e.height}`),e.resize&&t.push(`resize=${e.resize}`),e.format&&t.push(`format=${e.format}`),e.quality&&t.push(`quality=${e.quality}`),t.join("&")}}const ir="2.5.1",or={"X-Client-Info":`storage-js/${ir}`};var oe=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(i){return i instanceof t?i:new t(function(o){o(i)})}return new(t||(t=Promise))(function(i,o){function a(c){try{h(s.next(c))}catch(u){o(u)}}function l(c){try{h(s.throw(c))}catch(u){o(u)}}function h(c){c.done?i(c.value):r(c.value).then(a,l)}h((s=s.apply(n,e||[])).next())})};class ar{constructor(e,t={},s){this.url=e,this.headers=Object.assign(Object.assign({},or),t),this.fetch=xt(s)}listBuckets(){return oe(this,void 0,void 0,function*(){try{return{data:yield Je(this.fetch,`${this.url}/bucket`,{headers:this.headers}),error:null}}catch(e){if(B(e))return{data:null,error:e};throw e}})}getBucket(e){return oe(this,void 0,void 0,function*(){try{return{data:yield Je(this.fetch,`${this.url}/bucket/${e}`,{headers:this.headers}),error:null}}catch(t){if(B(t))return{data:null,error:t};throw t}})}createBucket(e,t={public:!1}){return oe(this,void 0,void 0,function*(){try{return{data:yield Z(this.fetch,`${this.url}/bucket`,{id:e,name:e,public:t.public,file_size_limit:t.fileSizeLimit,allowed_mime_types:t.allowedMimeTypes},{headers:this.headers}),error:null}}catch(s){if(B(s))return{data:null,error:s};throw s}})}updateBucket(e,t){return oe(this,void 0,void 0,function*(){try{return{data:yield sr(this.fetch,`${this.url}/bucket/${e}`,{id:e,name:e,public:t.public,file_size_limit:t.fileSizeLimit,allowed_mime_types:t.allowedMimeTypes},{headers:this.headers}),error:null}}catch(s){if(B(s))return{data:null,error:s};throw s}})}emptyBucket(e){return oe(this,void 0,void 0,function*(){try{return{data:yield Z(this.fetch,`${this.url}/bucket/${e}/empty`,{},{headers:this.headers}),error:null}}catch(t){if(B(t))return{data:null,error:t};throw t}})}deleteBucket(e){return oe(this,void 0,void 0,function*(){try{return{data:yield Ct(this.fetch,`${this.url}/bucket/${e}`,{},{headers:this.headers}),error:null}}catch(t){if(B(t))return{data:null,error:t};throw t}})}}class lr extends ar{constructor(e,t={},s){super(e,t,s)}from(e){return new nr(this.url,this.headers,e,this.fetch)}}const cr="2.21.0",hr={"X-Client-Info":`supabase-js/${cr}`};var dr=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(i){return i instanceof t?i:new t(function(o){o(i)})}return new(t||(t=Promise))(function(i,o){function a(c){try{h(s.next(c))}catch(u){o(u)}}function l(c){try{h(s.throw(c))}catch(u){o(u)}}function h(c){c.done?i(c.value):r(c.value).then(a,l)}h((s=s.apply(n,e||[])).next())})};const ur=n=>{let e;return n?e=n:typeof fetch>"u"?e=Ye:e=fetch,(...t)=>e(...t)},fr=()=>typeof Headers>"u"?We.Headers:Headers,pr=(n,e,t)=>{const s=ur(t),r=fr();return(i,o)=>dr(void 0,void 0,void 0,function*(){var a;const l=(a=yield e())!==null&&a!==void 0?a:n;let h=new r(o?.headers);return h.has("apikey")||h.set("apikey",n),h.has("Authorization")||h.set("Authorization",`Bearer ${l}`),s(i,Object.assign(Object.assign({},o),{headers:h}))})};function mr(n){return n.replace(/\/$/,"")}function gr(n,e){const{db:t,auth:s,realtime:r,global:i}=n,{db:o,auth:a,realtime:l,global:h}=e;return{db:Object.assign(Object.assign({},o),t),auth:Object.assign(Object.assign({},a),s),realtime:Object.assign(Object.assign({},l),r),global:Object.assign(Object.assign({},h),i)}}var re=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(i){return i instanceof t?i:new t(function(o){o(i)})}return new(t||(t=Promise))(function(i,o){function a(c){try{h(s.next(c))}catch(u){o(u)}}function l(c){try{h(s.throw(c))}catch(u){o(u)}}function h(c){c.done?i(c.value):r(c.value).then(a,l)}h((s=s.apply(n,e||[])).next())})};function vr(n){return Math.round(Date.now()/1e3)+n}function yr(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(n){const e=Math.random()*16|0;return(n=="x"?e:e&3|8).toString(16)})}const X=()=>typeof document<"u",Q={tested:!1,writable:!1},Pe=()=>{if(!X())return!1;try{if(typeof globalThis.localStorage!="object")return!1}catch{return!1}if(Q.tested)return Q.writable;const n=`lswt-${Math.random()}${Math.random()}`;try{globalThis.localStorage.setItem(n,n),globalThis.localStorage.removeItem(n),Q.tested=!0,Q.writable=!0}catch{Q.tested=!0,Q.writable=!1}return Q.writable};function P(n,e){var t;e||(e=((t=window?.location)===null||t===void 0?void 0:t.href)||""),n=n.replace(/[\[\]]/g,"\\$&");const s=new RegExp("[?&#]"+n+"(=([^&#]*)|&|#|$)"),r=s.exec(e);return r?r[2]?decodeURIComponent(r[2].replace(/\+/g," ")):"":null}const At=n=>{let e;return n?e=n:typeof fetch>"u"?e=(...t)=>re(void 0,void 0,void 0,function*(){return yield(yield I(()=>Promise.resolve().then(()=>je),void 0)).fetch(...t)}):e=fetch,(...t)=>e(...t)},br=n=>typeof n=="object"&&n!==null&&"status"in n&&"ok"in n&&"json"in n&&typeof n.json=="function",ce=(n,e,t)=>re(void 0,void 0,void 0,function*(){yield n.setItem(e,JSON.stringify(t))}),we=(n,e)=>re(void 0,void 0,void 0,function*(){const t=yield n.getItem(e);if(!t)return null;try{return JSON.parse(t)}catch{return t}}),Ie=(n,e)=>re(void 0,void 0,void 0,function*(){yield n.removeItem(e)});function _r(n){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";let t="",s,r,i,o,a,l,h,c=0;for(n=n.replace("-","+").replace("_","/");c<n.length;)o=e.indexOf(n.charAt(c++)),a=e.indexOf(n.charAt(c++)),l=e.indexOf(n.charAt(c++)),h=e.indexOf(n.charAt(c++)),s=o<<2|a>>4,r=(a&15)<<4|l>>2,i=(l&3)<<6|h,t=t+String.fromCharCode(s),l!=64&&r!=0&&(t=t+String.fromCharCode(r)),h!=64&&i!=0&&(t=t+String.fromCharCode(i));return t}class Ee{constructor(){this.promise=new Ee.promiseConstructor((e,t)=>{this.resolve=e,this.reject=t})}}Ee.promiseConstructor=Promise;function ut(n){const e=/^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}=?$|[a-z0-9_-]{2}(==)?$)$/i,t=n.split(".");if(t.length!==3)throw new Error("JWT is not valid: not a JWT structure");if(!e.test(t[1]))throw new Error("JWT is not valid: payload is not in base64url format");const s=t[1];return JSON.parse(_r(s))}function wr(n){return new Promise(e=>{setTimeout(()=>e(null),n)})}function xr(n,e){return new Promise((s,r)=>{re(this,void 0,void 0,function*(){for(let i=0;i<1/0;i++)try{const o=yield n(i);if(!e(i,null,o)){s(o);return}}catch(o){if(!e(i,o)){r(o);return}}})})}function Cr(n){return("0"+n.toString(16)).substr(-2)}function xe(){const e=new Uint32Array(56);if(typeof crypto>"u"){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~",s=t.length;let r="";for(let i=0;i<56;i++)r+=t.charAt(Math.floor(Math.random()*s));return r}return crypto.getRandomValues(e),Array.from(e,Cr).join("")}function Ar(n){return re(this,void 0,void 0,function*(){const t=new TextEncoder().encode(n),s=yield crypto.subtle.digest("SHA-256",t),r=new Uint8Array(s);return Array.from(r).map(i=>String.fromCharCode(i)).join("")})}function jr(n){return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Ce(n){return re(this,void 0,void 0,function*(){if(typeof crypto>"u")return console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."),n;const e=yield Ar(n);return jr(e)})}class Qe extends Error{constructor(e,t){super(e),this.__isAuthError=!0,this.name="AuthError",this.status=t}}function A(n){return typeof n=="object"&&n!==null&&"__isAuthError"in n}class kr extends Qe{constructor(e,t){super(e,t),this.name="AuthApiError",this.status=t}toJSON(){return{name:this.name,message:this.message,status:this.status}}}function Er(n){return A(n)&&n.name==="AuthApiError"}class jt extends Qe{constructor(e,t){super(e),this.name="AuthUnknownError",this.originalError=t}}class ye extends Qe{constructor(e,t,s){super(e),this.name=t,this.status=s}toJSON(){return{name:this.name,message:this.message,status:this.status}}}class he extends ye{constructor(){super("Auth session missing!","AuthSessionMissingError",400)}}class Ne extends ye{constructor(e){super(e,"AuthInvalidCredentialsError",400)}}class V extends ye{constructor(e,t=null){super(e,"AuthImplicitGrantRedirectError",500),this.details=null,this.details=t}toJSON(){return{name:this.name,message:this.message,status:this.status,details:this.details}}}class Le extends ye{constructor(e,t=null){super(e,"AuthPKCEGrantCodeExchangeError",500),this.details=null,this.details=t}toJSON(){return{name:this.name,message:this.message,status:this.status,details:this.details}}}class Ke extends ye{constructor(e,t){super(e,"AuthRetryableFetchError",t)}}var et=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(i){return i instanceof t?i:new t(function(o){o(i)})}return new(t||(t=Promise))(function(i,o){function a(c){try{h(s.next(c))}catch(u){o(u)}}function l(c){try{h(s.throw(c))}catch(u){o(u)}}function h(c){c.done?i(c.value):r(c.value).then(a,l)}h((s=s.apply(n,e||[])).next())})},Tr=globalThis&&globalThis.__rest||function(n,e){var t={};for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&e.indexOf(s)<0&&(t[s]=n[s]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,s=Object.getOwnPropertySymbols(n);r<s.length;r++)e.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(n,s[r])&&(t[s[r]]=n[s[r]]);return t};const Ae=n=>n.msg||n.message||n.error_description||n.error||JSON.stringify(n),Sr=(n,e)=>et(void 0,void 0,void 0,function*(){const t=[502,503,504];br(n)?t.includes(n.status)?e(new Ke(Ae(n),n.status)):n.json().then(s=>{e(new kr(Ae(s),n.status||500))}).catch(s=>{e(new jt(Ae(s),s))}):e(new Ke(Ae(n),0))}),Fr=(n,e,t,s)=>{const r={method:n,headers:e?.headers||{}};return n==="GET"?r:(r.headers=Object.assign({"Content-Type":"application/json;charset=UTF-8"},e?.headers),r.body=JSON.stringify(s),Object.assign(Object.assign({},r),t))};function E(n,e,t,s){var r;return et(this,void 0,void 0,function*(){const i=Object.assign({},s?.headers);s?.jwt&&(i.Authorization=`Bearer ${s.jwt}`);const o=(r=s?.query)!==null&&r!==void 0?r:{};s?.redirectTo&&(o.redirect_to=s.redirectTo);const a=Object.keys(o).length?"?"+new URLSearchParams(o).toString():"",l=yield Or(n,e,t+a,{headers:i,noResolveJson:s?.noResolveJson},{},s?.body);return s?.xform?s?.xform(l):{data:Object.assign({},l),error:null}})}function Or(n,e,t,s,r,i){return et(this,void 0,void 0,function*(){return new Promise((o,a)=>{n(t,Fr(e,s,r,i)).then(l=>{if(!l.ok)throw l;return s?.noResolveJson?l:l.json()}).then(l=>o(l)).catch(l=>Sr(l,a))})})}function Y(n){var e;let t=null;$r(n)&&(t=Object.assign({},n),t.expires_at=vr(n.expires_in));const s=(e=n.user)!==null&&e!==void 0?e:n;return{data:{session:t,user:s},error:null}}function se(n){var e;return{data:{user:(e=n.user)!==null&&e!==void 0?e:n},error:null}}function Br(n){return{data:n,error:null}}function Rr(n){const{action_link:e,email_otp:t,hashed_token:s,redirect_to:r,verification_type:i}=n,o=Tr(n,["action_link","email_otp","hashed_token","redirect_to","verification_type"]),a={action_link:e,email_otp:t,hashed_token:s,redirect_to:r,verification_type:i},l=Object.assign({},o);return{data:{properties:a,user:l},error:null}}function Dr(n){return n}function $r(n){return n.access_token&&n.refresh_token&&n.expires_in}var H=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(i){return i instanceof t?i:new t(function(o){o(i)})}return new(t||(t=Promise))(function(i,o){function a(c){try{h(s.next(c))}catch(u){o(u)}}function l(c){try{h(s.throw(c))}catch(u){o(u)}}function h(c){c.done?i(c.value):r(c.value).then(a,l)}h((s=s.apply(n,e||[])).next())})},Pr=globalThis&&globalThis.__rest||function(n,e){var t={};for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&e.indexOf(s)<0&&(t[s]=n[s]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,s=Object.getOwnPropertySymbols(n);r<s.length;r++)e.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(n,s[r])&&(t[s[r]]=n[s[r]]);return t};class Ir{constructor({url:e="",headers:t={},fetch:s}){this.url=e,this.headers=t,this.fetch=At(s),this.mfa={listFactors:this._listFactors.bind(this),deleteFactor:this._deleteFactor.bind(this)}}signOut(e){return H(this,void 0,void 0,function*(){try{return yield E(this.fetch,"POST",`${this.url}/logout`,{headers:this.headers,jwt:e,noResolveJson:!0}),{data:null,error:null}}catch(t){if(A(t))return{data:null,error:t};throw t}})}inviteUserByEmail(e,t={}){return H(this,void 0,void 0,function*(){try{return yield E(this.fetch,"POST",`${this.url}/invite`,{body:{email:e,data:t.data},headers:this.headers,redirectTo:t.redirectTo,xform:se})}catch(s){if(A(s))return{data:{user:null},error:s};throw s}})}generateLink(e){return H(this,void 0,void 0,function*(){try{const{options:t}=e,s=Pr(e,["options"]),r=Object.assign(Object.assign({},s),t);return"newEmail"in s&&(r.new_email=s?.newEmail,delete r.newEmail),yield E(this.fetch,"POST",`${this.url}/admin/generate_link`,{body:r,headers:this.headers,xform:Rr,redirectTo:t?.redirectTo})}catch(t){if(A(t))return{data:{properties:null,user:null},error:t};throw t}})}createUser(e){return H(this,void 0,void 0,function*(){try{return yield E(this.fetch,"POST",`${this.url}/admin/users`,{body:e,headers:this.headers,xform:se})}catch(t){if(A(t))return{data:{user:null},error:t};throw t}})}listUsers(e){var t,s,r,i,o,a,l;return H(this,void 0,void 0,function*(){try{const h={nextPage:null,lastPage:0,total:0},c=yield E(this.fetch,"GET",`${this.url}/admin/users`,{headers:this.headers,noResolveJson:!0,query:{page:(s=(t=e?.page)===null||t===void 0?void 0:t.toString())!==null&&s!==void 0?s:"",per_page:(i=(r=e?.perPage)===null||r===void 0?void 0:r.toString())!==null&&i!==void 0?i:""},xform:Dr});if(c.error)throw c.error;const u=yield c.json(),m=(o=c.headers.get("x-total-count"))!==null&&o!==void 0?o:0,y=(l=(a=c.headers.get("link"))===null||a===void 0?void 0:a.split(","))!==null&&l!==void 0?l:[];return y.length>0&&(y.forEach(g=>{const w=parseInt(g.split(";")[0].split("=")[1].substring(0,1)),b=JSON.parse(g.split(";")[1].split("=")[1]);h[`${b}Page`]=w}),h.total=parseInt(m)),{data:Object.assign(Object.assign({},u),h),error:null}}catch(h){if(A(h))return{data:{users:[]},error:h};throw h}})}getUserById(e){return H(this,void 0,void 0,function*(){try{return yield E(this.fetch,"GET",`${this.url}/admin/users/${e}`,{headers:this.headers,xform:se})}catch(t){if(A(t))return{data:{user:null},error:t};throw t}})}updateUserById(e,t){return H(this,void 0,void 0,function*(){try{return yield E(this.fetch,"PUT",`${this.url}/admin/users/${e}`,{body:t,headers:this.headers,xform:se})}catch(s){if(A(s))return{data:{user:null},error:s};throw s}})}deleteUser(e,t=!1){return H(this,void 0,void 0,function*(){try{return yield E(this.fetch,"DELETE",`${this.url}/admin/users/${e}`,{headers:this.headers,body:{should_soft_delete:t},xform:se})}catch(s){if(A(s))return{data:{user:null},error:s};throw s}})}_listFactors(e){return H(this,void 0,void 0,function*(){try{const{data:t,error:s}=yield E(this.fetch,"GET",`${this.url}/admin/users/${e.userId}/factors`,{headers:this.headers,xform:r=>({data:{factors:r},error:null})});return{data:t,error:s}}catch(t){if(A(t))return{data:null,error:t};throw t}})}_deleteFactor(e){return H(this,void 0,void 0,function*(){try{return{data:yield E(this.fetch,"DELETE",`${this.url}/admin/users/${e.userId}/factors/${e.id}`,{headers:this.headers}),error:null}}catch(t){if(A(t))return{data:null,error:t};throw t}})}}const Nr="2.24.0",Lr="http://localhost:9999",Ur="supabase.auth.token",Gr={"X-Client-Info":`gotrue-js/${Nr}`},Mr=10,qr={getItem:n=>Pe()?globalThis.localStorage.getItem(n):null,setItem:(n,e)=>{Pe()&&globalThis.localStorage.setItem(n,e)},removeItem:n=>{Pe()&&globalThis.localStorage.removeItem(n)}};function zr(){if(typeof globalThis!="object")try{Object.defineProperty(Object.prototype,"__magic__",{get:function(){return this},configurable:!0}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__}catch{typeof self<"u"&&(self.globalThis=self)}}var _=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(i){return i instanceof t?i:new t(function(o){o(i)})}return new(t||(t=Promise))(function(i,o){function a(c){try{h(s.next(c))}catch(u){o(u)}}function l(c){try{h(s.throw(c))}catch(u){o(u)}}function h(c){c.done?i(c.value):r(c.value).then(a,l)}h((s=s.apply(n,e||[])).next())})};zr();const Hr={url:Lr,storageKey:Ur,autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,headers:Gr,flowType:"implicit"},Ue=30*1e3,Jr=3;class Kr{constructor(e){var t;this.stateChangeEmitters=new Map,this.autoRefreshTicker=null,this.visibilityChangedCallback=null,this.refreshingDeferred=null,this.initializePromise=null,this.detectSessionInUrl=!0,this.broadcastChannel=null;const s=Object.assign(Object.assign({},Hr),e);if(this.inMemorySession=null,this.storageKey=s.storageKey,this.autoRefreshToken=s.autoRefreshToken,this.persistSession=s.persistSession,this.storage=s.storage||qr,this.admin=new Ir({url:s.url,headers:s.headers,fetch:s.fetch}),this.url=s.url,this.headers=s.headers,this.fetch=At(s.fetch),this.detectSessionInUrl=s.detectSessionInUrl,this.flowType=s.flowType,this.mfa={verify:this._verify.bind(this),enroll:this._enroll.bind(this),unenroll:this._unenroll.bind(this),challenge:this._challenge.bind(this),listFactors:this._listFactors.bind(this),challengeAndVerify:this._challengeAndVerify.bind(this),getAuthenticatorAssuranceLevel:this._getAuthenticatorAssuranceLevel.bind(this)},X()&&globalThis.BroadcastChannel&&this.persistSession&&this.storageKey){try{this.broadcastChannel=new globalThis.BroadcastChannel(this.storageKey)}catch(r){console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available",r)}(t=this.broadcastChannel)===null||t===void 0||t.addEventListener("message",r=>{this._notifyAllSubscribers(r.data.event,r.data.session,!1)})}this.initialize()}initialize(){return this.initializePromise||(this.initializePromise=this._initialize()),this.initializePromise}_initialize(){return _(this,void 0,void 0,function*(){if(this.initializePromise)return this.initializePromise;try{const e=yield this._isPKCEFlow();if(this.detectSessionInUrl&&this._isImplicitGrantFlow()||e){const{data:t,error:s}=yield this._getSessionFromUrl(e);if(s)return yield this._removeSession(),{error:s};const{session:r,redirectType:i}=t;return yield this._saveSession(r),setTimeout(()=>{i==="recovery"?this._notifyAllSubscribers("PASSWORD_RECOVERY",r):this._notifyAllSubscribers("SIGNED_IN",r)},0),{error:null}}return yield this._recoverAndRefresh(),{error:null}}catch(e){return A(e)?{error:e}:{error:new jt("Unexpected error during initialization",e)}}finally{yield this._handleVisibilityChange()}})}signUp(e){var t,s,r;return _(this,void 0,void 0,function*(){try{yield this._removeSession();let i;if("email"in e){const{email:c,password:u,options:m}=e;let y=null,g=null;if(this.flowType==="pkce"){const w=xe();yield ce(this.storage,`${this.storageKey}-code-verifier`,w),y=yield Ce(w),g=w===y?"plain":"s256"}i=yield E(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,redirectTo:m?.emailRedirectTo,body:{email:c,password:u,data:(t=m?.data)!==null&&t!==void 0?t:{},gotrue_meta_security:{captcha_token:m?.captchaToken},code_challenge:y,code_challenge_method:g},xform:Y})}else if("phone"in e){const{phone:c,password:u,options:m}=e;i=yield E(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{phone:c,password:u,data:(s=m?.data)!==null&&s!==void 0?s:{},channel:(r=m?.channel)!==null&&r!==void 0?r:"sms",gotrue_meta_security:{captcha_token:m?.captchaToken}},xform:Y})}else throw new Ne("You must provide either an email or phone number and a password");const{data:o,error:a}=i;if(a||!o)return{data:{user:null,session:null},error:a};const l=o.session,h=o.user;return o.session&&(yield this._saveSession(o.session),this._notifyAllSubscribers("SIGNED_IN",l)),{data:{user:h,session:l},error:null}}catch(i){if(A(i))return{data:{user:null,session:null},error:i};throw i}})}signInWithPassword(e){return _(this,void 0,void 0,function*(){try{yield this._removeSession();let t;if("email"in e){const{email:i,password:o,options:a}=e;t=yield E(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{email:i,password:o,gotrue_meta_security:{captcha_token:a?.captchaToken}},xform:Y})}else if("phone"in e){const{phone:i,password:o,options:a}=e;t=yield E(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{phone:i,password:o,gotrue_meta_security:{captcha_token:a?.captchaToken}},xform:Y})}else throw new Ne("You must provide either an email or phone number and a password");const{data:s,error:r}=t;return r||!s?{data:{user:null,session:null},error:r}:(s.session&&(yield this._saveSession(s.session),this._notifyAllSubscribers("SIGNED_IN",s.session)),{data:s,error:r})}catch(t){if(A(t))return{data:{user:null,session:null},error:t};throw t}})}signInWithOAuth(e){var t,s,r,i;return _(this,void 0,void 0,function*(){return yield this._removeSession(),yield this._handleProviderSignIn(e.provider,{redirectTo:(t=e.options)===null||t===void 0?void 0:t.redirectTo,scopes:(s=e.options)===null||s===void 0?void 0:s.scopes,queryParams:(r=e.options)===null||r===void 0?void 0:r.queryParams,skipBrowserRedirect:(i=e.options)===null||i===void 0?void 0:i.skipBrowserRedirect})})}exchangeCodeForSession(e){return _(this,void 0,void 0,function*(){const t=yield we(this.storage,`${this.storageKey}-code-verifier`),{data:s,error:r}=yield E(this.fetch,"POST",`${this.url}/token?grant_type=pkce`,{headers:this.headers,body:{auth_code:e,code_verifier:t},xform:Y});return yield Ie(this.storage,`${this.storageKey}-code-verifier`),r||!s?{data:{user:null,session:null},error:r}:(s.session&&(yield this._saveSession(s.session),this._notifyAllSubscribers("SIGNED_IN",s.session)),{data:s,error:r})})}signInWithIdToken(e){return _(this,void 0,void 0,function*(){yield this._removeSession();try{const{options:t,provider:s,token:r,nonce:i}=e,o=yield E(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,body:{provider:s,id_token:r,nonce:i,gotrue_meta_security:{captcha_token:t?.captchaToken}},xform:Y}),{data:a,error:l}=o;return l||!a?{data:{user:null,session:null},error:l}:(a.session&&(yield this._saveSession(a.session),this._notifyAllSubscribers("SIGNED_IN",a.session)),{data:a,error:l})}catch(t){if(A(t))return{data:{user:null,session:null},error:t};throw t}})}signInWithOtp(e){var t,s,r,i,o;return _(this,void 0,void 0,function*(){try{if(yield this._removeSession(),"email"in e){const{email:a,options:l}=e;let h=null,c=null;if(this.flowType==="pkce"){const m=xe();yield ce(this.storage,`${this.storageKey}-code-verifier`,m),h=yield Ce(m),c=m===h?"plain":"s256"}const{error:u}=yield E(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{email:a,data:(t=l?.data)!==null&&t!==void 0?t:{},create_user:(s=l?.shouldCreateUser)!==null&&s!==void 0?s:!0,gotrue_meta_security:{captcha_token:l?.captchaToken},code_challenge:h,code_challenge_method:c},redirectTo:l?.emailRedirectTo});return{data:{user:null,session:null},error:u}}if("phone"in e){const{phone:a,options:l}=e,{error:h}=yield E(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{phone:a,data:(r=l?.data)!==null&&r!==void 0?r:{},create_user:(i=l?.shouldCreateUser)!==null&&i!==void 0?i:!0,gotrue_meta_security:{captcha_token:l?.captchaToken},channel:(o=l?.channel)!==null&&o!==void 0?o:"sms"}});return{data:{user:null,session:null},error:h}}throw new Ne("You must provide either an email or phone number.")}catch(a){if(A(a))return{data:{user:null,session:null},error:a};throw a}})}verifyOtp(e){var t,s;return _(this,void 0,void 0,function*(){try{yield this._removeSession();const{data:r,error:i}=yield E(this.fetch,"POST",`${this.url}/verify`,{headers:this.headers,body:Object.assign(Object.assign({},e),{gotrue_meta_security:{captcha_token:(t=e.options)===null||t===void 0?void 0:t.captchaToken}}),redirectTo:(s=e.options)===null||s===void 0?void 0:s.redirectTo,xform:Y});if(i)throw i;if(!r)throw new Error("An error occurred on token verification.");const o=r.session,a=r.user;return o?.access_token&&(yield this._saveSession(o),this._notifyAllSubscribers("SIGNED_IN",o)),{data:{user:a,session:o},error:null}}catch(r){if(A(r))return{data:{user:null,session:null},error:r};throw r}})}signInWithSSO(e){var t,s,r;return _(this,void 0,void 0,function*(){try{return yield this._removeSession(),yield E(this.fetch,"POST",`${this.url}/sso`,{body:Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},"providerId"in e?{provider_id:e.providerId}:null),"domain"in e?{domain:e.domain}:null),{redirect_to:(s=(t=e.options)===null||t===void 0?void 0:t.redirectTo)!==null&&s!==void 0?s:void 0}),!((r=e?.options)===null||r===void 0)&&r.captchaToken?{gotrue_meta_security:{captcha_token:e.options.captchaToken}}:null),{skip_http_redirect:!0}),headers:this.headers,xform:Br})}catch(i){if(A(i))return{data:null,error:i};throw i}})}getSession(){return _(this,void 0,void 0,function*(){yield this.initializePromise;let e=null;if(this.persistSession){const i=yield we(this.storage,this.storageKey);i!==null&&(this._isValidSession(i)?e=i:yield this._removeSession())}else e=this.inMemorySession;if(!e)return{data:{session:null},error:null};if(!(e.expires_at?e.expires_at<=Date.now()/1e3:!1))return{data:{session:e},error:null};const{session:s,error:r}=yield this._callRefreshToken(e.refresh_token);return r?{data:{session:null},error:r}:{data:{session:s},error:null}})}getUser(e){var t,s;return _(this,void 0,void 0,function*(){try{if(!e){const{data:r,error:i}=yield this.getSession();if(i)throw i;e=(s=(t=r.session)===null||t===void 0?void 0:t.access_token)!==null&&s!==void 0?s:void 0}return yield E(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:e,xform:se})}catch(r){if(A(r))return{data:{user:null},error:r};throw r}})}updateUser(e,t={}){return _(this,void 0,void 0,function*(){try{const{data:s,error:r}=yield this.getSession();if(r)throw r;if(!s.session)throw new he;const i=s.session,{data:o,error:a}=yield E(this.fetch,"PUT",`${this.url}/user`,{headers:this.headers,redirectTo:t?.emailRedirectTo,body:e,jwt:i.access_token,xform:se});if(a)throw a;return i.user=o.user,yield this._saveSession(i),this._notifyAllSubscribers("USER_UPDATED",i),{data:{user:i.user},error:null}}catch(s){if(A(s))return{data:{user:null},error:s};throw s}})}_decodeJWT(e){return ut(e)}setSession(e){return _(this,void 0,void 0,function*(){try{if(!e.access_token||!e.refresh_token)throw new he;const t=Date.now()/1e3;let s=t,r=!0,i=null;const o=ut(e.access_token);if(o.exp&&(s=o.exp,r=s<=t),r){const{session:a,error:l}=yield this._callRefreshToken(e.refresh_token);if(l)return{data:{user:null,session:null},error:l};if(!a)return{data:{user:null,session:null},error:null};i=a}else{const{data:a,error:l}=yield this.getUser(e.access_token);if(l)throw l;i={access_token:e.access_token,refresh_token:e.refresh_token,user:a.user,token_type:"bearer",expires_in:s-t,expires_at:s},yield this._saveSession(i),this._notifyAllSubscribers("SIGNED_IN",i)}return{data:{user:i.user,session:i},error:null}}catch(t){if(A(t))return{data:{session:null,user:null},error:t};throw t}})}refreshSession(e){var t;return _(this,void 0,void 0,function*(){try{if(!e){const{data:i,error:o}=yield this.getSession();if(o)throw o;e=(t=i.session)!==null&&t!==void 0?t:void 0}if(!e?.refresh_token)throw new he;const{session:s,error:r}=yield this._callRefreshToken(e.refresh_token);return r?{data:{user:null,session:null},error:r}:s?{data:{user:s.user,session:s},error:null}:{data:{user:null,session:null},error:null}}catch(s){if(A(s))return{data:{user:null,session:null},error:s};throw s}})}_getSessionFromUrl(e){return _(this,void 0,void 0,function*(){try{if(!X())throw new V("No browser detected.");if(this.flowType==="implicit"&&!this._isImplicitGrantFlow())throw new V("Not a valid implicit grant flow url.");if(this.flowType=="pkce"&&!e)throw new Le("Not a valid PKCE flow url.");if(e){const b=P("code");if(!b)throw new Le("No code detected.");const{data:k,error:D}=yield this.exchangeCodeForSession(b);if(D)throw D;if(!k.session)throw new Le("No session detected.");return{data:{session:k.session,redirectType:null},error:null}}const t=P("error_description");if(t){const b=P("error_code");if(!b)throw new V("No error_code detected.");const k=P("error");throw k?new V(t,{error:k,code:b}):new V("No error detected.")}const s=P("provider_token"),r=P("provider_refresh_token"),i=P("access_token");if(!i)throw new V("No access_token detected.");const o=P("expires_in");if(!o)throw new V("No expires_in detected.");const a=P("refresh_token");if(!a)throw new V("No refresh_token detected.");const l=P("token_type");if(!l)throw new V("No token_type detected.");const c=Math.round(Date.now()/1e3)+parseInt(o),{data:u,error:m}=yield this.getUser(i);if(m)throw m;const y=u.user,g={provider_token:s,provider_refresh_token:r,access_token:i,expires_in:parseInt(o),expires_at:c,refresh_token:a,token_type:l,user:y},w=P("type");return window.location.hash="",{data:{session:g,redirectType:w},error:null}}catch(t){if(A(t))return{data:{session:null,redirectType:null},error:t};throw t}})}_isImplicitGrantFlow(){return X()&&(!!P("access_token")||!!P("error_description"))}_isPKCEFlow(){return _(this,void 0,void 0,function*(){const e=yield we(this.storage,`${this.storageKey}-code-verifier`);return X()&&!!P("code")&&!!e})}signOut(){var e;return _(this,void 0,void 0,function*(){const{data:t,error:s}=yield this.getSession();if(s)return{error:s};const r=(e=t.session)===null||e===void 0?void 0:e.access_token;if(r){const{error:i}=yield this.admin.signOut(r);if(i&&!(Er(i)&&(i.status===404||i.status===401)))return{error:i}}return yield this._removeSession(),yield Ie(this.storage,`${this.storageKey}-code-verifier`),this._notifyAllSubscribers("SIGNED_OUT",null),{error:null}})}onAuthStateChange(e){const t=yr(),s={id:t,callback:e,unsubscribe:()=>{this.stateChangeEmitters.delete(t)}};return this.stateChangeEmitters.set(t,s),this.emitInitialSession(t),{data:{subscription:s}}}emitInitialSession(e){var t,s;return _(this,void 0,void 0,function*(){try{const{data:{session:r},error:i}=yield this.getSession();if(i)throw i;(t=this.stateChangeEmitters.get(e))===null||t===void 0||t.callback("INITIAL_SESSION",r)}catch(r){(s=this.stateChangeEmitters.get(e))===null||s===void 0||s.callback("INITIAL_SESSION",null),console.error(r)}})}resetPasswordForEmail(e,t={}){return _(this,void 0,void 0,function*(){let s=null,r=null;if(this.flowType==="pkce"){const i=xe();yield ce(this.storage,`${this.storageKey}-code-verifier`,i),s=yield Ce(i),r=i===s?"plain":"s256"}try{return yield E(this.fetch,"POST",`${this.url}/recover`,{body:{email:e,code_challenge:s,code_challenge_method:r,gotrue_meta_security:{captcha_token:t.captchaToken}},headers:this.headers,redirectTo:t.redirectTo})}catch(i){if(A(i))return{data:null,error:i};throw i}})}_refreshAccessToken(e){return _(this,void 0,void 0,function*(){try{const t=Date.now();return yield xr(s=>_(this,void 0,void 0,function*(){return yield wr(s*200),yield E(this.fetch,"POST",`${this.url}/token?grant_type=refresh_token`,{body:{refresh_token:e},headers:this.headers,xform:Y})}),(s,r,i)=>i&&i.error&&i.error instanceof Ke&&Date.now()+(s+1)*200-t<Ue)}catch(t){if(A(t))return{data:{session:null,user:null},error:t};throw t}})}_isValidSession(e){return typeof e=="object"&&e!==null&&"access_token"in e&&"refresh_token"in e&&"expires_at"in e}_handleProviderSignIn(e,t){return _(this,void 0,void 0,function*(){const s=yield this._getUrlForProvider(e,{redirectTo:t.redirectTo,scopes:t.scopes,queryParams:t.queryParams});return X()&&!t.skipBrowserRedirect&&window.location.assign(s),{data:{provider:e,url:s},error:null}})}_recoverAndRefresh(){var e;return _(this,void 0,void 0,function*(){try{const t=yield we(this.storage,this.storageKey);if(!this._isValidSession(t)){t!==null&&(yield this._removeSession());return}const s=Math.round(Date.now()/1e3);if(((e=t.expires_at)!==null&&e!==void 0?e:1/0)<s+Mr)if(this.autoRefreshToken&&t.refresh_token){const{error:r}=yield this._callRefreshToken(t.refresh_token);r&&(console.log(r.message),yield this._removeSession())}else yield this._removeSession();else this.persistSession&&(yield this._saveSession(t)),this._notifyAllSubscribers("SIGNED_IN",t)}catch(t){console.error(t);return}})}_callRefreshToken(e){var t,s;return _(this,void 0,void 0,function*(){if(this.refreshingDeferred)return this.refreshingDeferred.promise;try{if(this.refreshingDeferred=new Ee,!e)throw new he;const{data:r,error:i}=yield this._refreshAccessToken(e);if(i)throw i;if(!r.session)throw new he;yield this._saveSession(r.session),this._notifyAllSubscribers("TOKEN_REFRESHED",r.session);const o={session:r.session,error:null};return this.refreshingDeferred.resolve(o),o}catch(r){if(A(r)){const i={session:null,error:r};return(t=this.refreshingDeferred)===null||t===void 0||t.resolve(i),i}throw(s=this.refreshingDeferred)===null||s===void 0||s.reject(r),r}finally{this.refreshingDeferred=null}})}_notifyAllSubscribers(e,t,s=!0){this.broadcastChannel&&s&&this.broadcastChannel.postMessage({event:e,session:t}),this.stateChangeEmitters.forEach(r=>r.callback(e,t))}_saveSession(e){return _(this,void 0,void 0,function*(){this.persistSession||(this.inMemorySession=e),this.persistSession&&e.expires_at&&(yield this._persistSession(e))})}_persistSession(e){return ce(this.storage,this.storageKey,e)}_removeSession(){return _(this,void 0,void 0,function*(){this.persistSession?yield Ie(this.storage,this.storageKey):this.inMemorySession=null})}_removeVisibilityChangedCallback(){const e=this.visibilityChangedCallback;this.visibilityChangedCallback=null;try{e&&X()&&window?.removeEventListener&&window.removeEventListener("visibilitychange",e)}catch(t){console.error("removing visibilitychange callback failed",t)}}_startAutoRefresh(){return _(this,void 0,void 0,function*(){yield this._stopAutoRefresh();const e=setInterval(()=>this._autoRefreshTokenTick(),Ue);this.autoRefreshTicker=e,e&&typeof e=="object"&&typeof e.unref=="function"?e.unref():typeof Deno<"u"&&typeof Deno.unrefTimer=="function"&&Deno.unrefTimer(e),yield this._autoRefreshTokenTick()})}_stopAutoRefresh(){return _(this,void 0,void 0,function*(){const e=this.autoRefreshTicker;this.autoRefreshTicker=null,e&&clearInterval(e)})}startAutoRefresh(){return _(this,void 0,void 0,function*(){this._removeVisibilityChangedCallback(),yield this._startAutoRefresh()})}stopAutoRefresh(){return _(this,void 0,void 0,function*(){this._removeVisibilityChangedCallback(),yield this._stopAutoRefresh()})}_autoRefreshTokenTick(){return _(this,void 0,void 0,function*(){const e=Date.now();try{const{data:{session:t}}=yield this.getSession();if(!t||!t.refresh_token||!t.expires_at)return;Math.floor((t.expires_at*1e3-e)/Ue)<Jr&&(yield this._callRefreshToken(t.refresh_token))}catch(t){console.error("Auto refresh tick failed with error. This is likely a transient error.",t)}})}_handleVisibilityChange(){return _(this,void 0,void 0,function*(){if(!X()||!window?.addEventListener)return this.autoRefreshToken&&this.startAutoRefresh(),!1;try{this.visibilityChangedCallback=()=>_(this,void 0,void 0,function*(){return yield this._onVisibilityChanged(!1)}),window?.addEventListener("visibilitychange",this.visibilityChangedCallback),yield this._onVisibilityChanged(!0)}catch(e){console.error("_handleVisibilityChange",e)}})}_onVisibilityChanged(e){return _(this,void 0,void 0,function*(){document.visibilityState==="visible"?(e||(yield this.initializePromise,yield this._recoverAndRefresh()),this.autoRefreshToken&&this._startAutoRefresh()):document.visibilityState==="hidden"&&this.autoRefreshToken&&this._stopAutoRefresh()})}_getUrlForProvider(e,t){return _(this,void 0,void 0,function*(){const s=[`provider=${encodeURIComponent(e)}`];if(t?.redirectTo&&s.push(`redirect_to=${encodeURIComponent(t.redirectTo)}`),t?.scopes&&s.push(`scopes=${encodeURIComponent(t.scopes)}`),this.flowType==="pkce"){const r=xe();yield ce(this.storage,`${this.storageKey}-code-verifier`,r);const i=yield Ce(r),o=r===i?"plain":"s256",a=new URLSearchParams({code_challenge:`${encodeURIComponent(i)}`,code_challenge_method:`${encodeURIComponent(o)}`});s.push(a.toString())}if(t?.queryParams){const r=new URLSearchParams(t.queryParams);s.push(r.toString())}return`${this.url}/authorize?${s.join("&")}`})}_unenroll(e){var t;return _(this,void 0,void 0,function*(){try{const{data:s,error:r}=yield this.getSession();return r?{data:null,error:r}:yield E(this.fetch,"DELETE",`${this.url}/factors/${e.factorId}`,{headers:this.headers,jwt:(t=s?.session)===null||t===void 0?void 0:t.access_token})}catch(s){if(A(s))return{data:null,error:s};throw s}})}_enroll(e){var t,s;return _(this,void 0,void 0,function*(){try{const{data:r,error:i}=yield this.getSession();if(i)return{data:null,error:i};const{data:o,error:a}=yield E(this.fetch,"POST",`${this.url}/factors`,{body:{friendly_name:e.friendlyName,factor_type:e.factorType,issuer:e.issuer},headers:this.headers,jwt:(t=r?.session)===null||t===void 0?void 0:t.access_token});return a?{data:null,error:a}:(!((s=o?.totp)===null||s===void 0)&&s.qr_code&&(o.totp.qr_code=`data:image/svg+xml;utf-8,${o.totp.qr_code}`),{data:o,error:null})}catch(r){if(A(r))return{data:null,error:r};throw r}})}_verify(e){var t;return _(this,void 0,void 0,function*(){try{const{data:s,error:r}=yield this.getSession();if(r)return{data:null,error:r};const{data:i,error:o}=yield E(this.fetch,"POST",`${this.url}/factors/${e.factorId}/verify`,{body:{code:e.code,challenge_id:e.challengeId},headers:this.headers,jwt:(t=s?.session)===null||t===void 0?void 0:t.access_token});return o?{data:null,error:o}:(yield this._saveSession(Object.assign({expires_at:Math.round(Date.now()/1e3)+i.expires_in},i)),this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED",i),{data:i,error:o})}catch(s){if(A(s))return{data:null,error:s};throw s}})}_challenge(e){var t;return _(this,void 0,void 0,function*(){try{const{data:s,error:r}=yield this.getSession();return r?{data:null,error:r}:yield E(this.fetch,"POST",`${this.url}/factors/${e.factorId}/challenge`,{headers:this.headers,jwt:(t=s?.session)===null||t===void 0?void 0:t.access_token})}catch(s){if(A(s))return{data:null,error:s};throw s}})}_challengeAndVerify(e){return _(this,void 0,void 0,function*(){const{data:t,error:s}=yield this._challenge({factorId:e.factorId});return s?{data:null,error:s}:yield this._verify({factorId:e.factorId,challengeId:t.id,code:e.code})})}_listFactors(){return _(this,void 0,void 0,function*(){const{data:{user:e},error:t}=yield this.getUser();if(t)return{data:null,error:t};const s=e?.factors||[],r=s.filter(i=>i.factor_type==="totp"&&i.status==="verified");return{data:{all:s,totp:r},error:null}})}_getAuthenticatorAssuranceLevel(){var e,t;return _(this,void 0,void 0,function*(){const{data:{session:s},error:r}=yield this.getSession();if(r)return{data:null,error:r};if(!s)return{data:{currentLevel:null,nextLevel:null,currentAuthenticationMethods:[]},error:null};const i=this._decodeJWT(s.access_token);let o=null;i.aal&&(o=i.aal);let a=o;((t=(e=s.user.factors)===null||e===void 0?void 0:e.filter(c=>c.status==="verified"))!==null&&t!==void 0?t:[]).length>0&&(a="aal2");const h=i.amr||[];return{data:{currentLevel:o,nextLevel:a,currentAuthenticationMethods:h},error:null}})}}class Vr extends Kr{constructor(e){super(e)}}var Wr=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(i){return i instanceof t?i:new t(function(o){o(i)})}return new(t||(t=Promise))(function(i,o){function a(c){try{h(s.next(c))}catch(u){o(u)}}function l(c){try{h(s.throw(c))}catch(u){o(u)}}function h(c){c.done?i(c.value):r(c.value).then(a,l)}h((s=s.apply(n,e||[])).next())})};const Yr={headers:hr},Xr={schema:"public"},Zr={autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,flowType:"implicit"},Qr={};class en{constructor(e,t,s){var r,i,o,a,l,h,c,u;if(this.supabaseUrl=e,this.supabaseKey=t,!e)throw new Error("supabaseUrl is required.");if(!t)throw new Error("supabaseKey is required.");const m=mr(e);if(this.realtimeUrl=`${m}/realtime/v1`.replace(/^http/i,"ws"),this.authUrl=`${m}/auth/v1`,this.storageUrl=`${m}/storage/v1`,m.match(/(supabase\.co)|(supabase\.in)/)){const k=m.split(".");this.functionsUrl=`${k[0]}.functions.${k[1]}.${k[2]}`}else this.functionsUrl=`${m}/functions/v1`;const g=`sb-${new URL(this.authUrl).hostname.split(".")[0]}-auth-token`,w={db:Xr,realtime:Qr,auth:Object.assign(Object.assign({},Zr),{storageKey:g}),global:Yr},b=gr(s??{},w);this.storageKey=(i=(r=b.auth)===null||r===void 0?void 0:r.storageKey)!==null&&i!==void 0?i:"",this.headers=(a=(o=b.global)===null||o===void 0?void 0:o.headers)!==null&&a!==void 0?a:{},this.auth=this._initSupabaseAuthClient((l=b.auth)!==null&&l!==void 0?l:{},this.headers,(h=b.global)===null||h===void 0?void 0:h.fetch),this.fetch=pr(t,this._getAccessToken.bind(this),(c=b.global)===null||c===void 0?void 0:c.fetch),this.realtime=this._initRealtimeClient(Object.assign({headers:this.headers},b.realtime)),this.rest=new gs(`${m}/rest/v1`,{headers:this.headers,schema:(u=b.db)===null||u===void 0?void 0:u.schema,fetch:this.fetch}),this._listenForAuthEvents()}get functions(){return new hs(this.functionsUrl,{headers:this.headers,customFetch:this.fetch})}get storage(){return new lr(this.storageUrl,this.headers,this.fetch)}from(e){return this.rest.from(e)}rpc(e,t={},s){return this.rest.rpc(e,t,s)}channel(e,t={config:{}}){return this.realtime.channel(e,t)}getChannels(){return this.realtime.getChannels()}removeChannel(e){return this.realtime.removeChannel(e)}removeAllChannels(){return this.realtime.removeAllChannels()}_getAccessToken(){var e,t;return Wr(this,void 0,void 0,function*(){const{data:s}=yield this.auth.getSession();return(t=(e=s.session)===null||e===void 0?void 0:e.access_token)!==null&&t!==void 0?t:null})}_initSupabaseAuthClient({autoRefreshToken:e,persistSession:t,detectSessionInUrl:s,storage:r,storageKey:i,flowType:o},a,l){const h={Authorization:`Bearer ${this.supabaseKey}`,apikey:`${this.supabaseKey}`};return new Vr({url:this.authUrl,headers:Object.assign(Object.assign({},h),a),storageKey:i,autoRefreshToken:e,persistSession:t,detectSessionInUrl:s,storage:r,flowType:o,fetch:l})}_initRealtimeClient(e){return new Xs(this.realtimeUrl,Object.assign(Object.assign({},e),{params:Object.assign({apikey:this.supabaseKey},e?.params)}))}_listenForAuthEvents(){return this.auth.onAuthStateChange((t,s)=>{this._handleTokenChanged(t,s?.access_token,"CLIENT")})}_handleTokenChanged(e,t,s){(e==="TOKEN_REFRESHED"||e==="SIGNED_IN")&&this.changedAccessToken!==t?(this.realtime.setAuth(t??null),this.changedAccessToken=t):e==="SIGNED_OUT"&&(this.realtime.setAuth(this.supabaseKey),s=="STORAGE"&&this.auth.signOut(),this.changedAccessToken=void 0)}}const tn=(n,e,t)=>new en(n,e,t);let kt=(n=21)=>crypto.getRandomValues(new Uint8Array(n)).reduce((e,t)=>(t&=63,t<36?e+=t.toString(36):t<62?e+=(t-26).toString(36).toUpperCase():t>62?e+="-":e+="_",e),"");function sn({title:n,titleId:e,...t},s){return v.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:s,"aria-labelledby":e},t),n?v.createElement("title",{id:e},n):null,v.createElement("path",{d:"M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"}))}const rn=v.forwardRef(sn),nn=rn,ft=ss.docs.filter(({name:n,description:e})=>n&&!n.startsWith("_")&&!!e).sort((n,e)=>n.name.localeCompare(e.name));function on(){return d.jsxs("div",{className:"flex h-full w-full pt-2 text-foreground",children:[d.jsx("div",{className:"w-42 flex-none h-full overflow-y-auto overflow-x-hidden pr-4",children:ft.map((n,e)=>d.jsxs("a",{className:"cursor-pointer block hover:bg-lineHighlight py-1 px-4",href:`#doc-${e}`,children:[n.name," "]},e))}),d.jsx("div",{className:"break-normal w-full h-full overflow-auto pl-4 flex relative",children:d.jsxs("div",{className:"prose dark:prose-invert",children:[d.jsx("h2",{children:"API Reference"}),d.jsx("p",{children:"This is the long list functions you can use! Remember that you don't need to remember all of those and that you can already make music with a small set of functions!"}),ft.map((n,e)=>d.jsxs("section",{children:[d.jsx("h3",{id:`doc-${e}`,children:n.name}),d.jsx("p",{dangerouslySetInnerHTML:{__html:n.description}}),n.examples?.map((t,s)=>d.jsx("pre",{children:t},s))]},e))]})})]})}function an(){const[n,e]=v.useState([]);v.useEffect(()=>(Jt("",{dir:Kt,recursive:!0}).then(a=>e([{name:"~/music",children:a}])).catch(a=>{console.log("error loadin files",a)}),()=>{}),[]);const t=v.useMemo(()=>n[n.length-1],[n]),s=v.useMemo(()=>n.slice(1).map(a=>a.name).join("/"),[n]),r=v.useMemo(()=>t?.children.filter(a=>!!a.children),[t]),i=v.useMemo(()=>t?.children.filter(a=>!a.children&&Vt(a.name)),[t]),o=a=>e(l=>l.concat([a]));return d.jsxs("div",{className:"px-4 flex flex-col h-full",children:[d.jsx("div",{className:"flex justify-between font-mono pb-1",children:d.jsxs("div",{children:[d.jsx("span",{children:"samples('"}),n?.map((a,l)=>l<n.length-1?d.jsxs(v.Fragment,{children:[d.jsx("span",{className:"cursor-pointer underline",onClick:()=>e(h=>h.slice(0,l+1)),children:a.name}),d.jsx("span",{children:"/"})]},l):d.jsx("span",{className:"cursor-pointer underline",children:a.name},l)),d.jsx("span",{children:"')"})]})}),d.jsxs("div",{className:"overflow-auto",children:[!r?.length&&!i?.length&&d.jsx("span",{className:"text-gray-500",children:"Nothing here"}),r?.map((a,l)=>d.jsx("div",{className:"cursor-pointer",onClick:()=>o(a),children:a.name},l)),i?.map((a,l)=>d.jsx("div",{className:"text-gray-500 cursor-pointer select-none",onClick:async()=>Wt(`${s}/${a.name}`),children:a.name},l))]})]})}const ln=window.__TAURI__;function cn({context:n}){const e=v.useRef(),[t,s]=v.useState([]),{activeFooter:r,isZen:i}=ve();v.useLayoutEffect(()=>{e.current&&r==="console"&&(e.current.scrollTop=e.current?.scrollHeight)},[t,r]),v.useLayoutEffect(()=>{e.current&&(r==="console"?e.current.scrollTop=e.current?.scrollHeight:e.current.scrollTop=0)},[r]),hn(v.useCallback(a=>{const{message:l,type:h,data:c}=a.detail;s(u=>{const m=u.length?u[u.length-1]:void 0,y=kt(12);if(h==="loaded-sample"){const g=u.findIndex(({data:{url:w},type:b})=>b==="load-sample"&&w===c.url);u[g]={message:l,type:h,id:y,data:c}}else m&&m.message===l?u=u.slice(0,-1).concat([{message:l,type:h,count:(m.count??1)+1,id:y,data:c}]):u=u.concat([{message:l,type:h,id:y,data:c}]);return u.slice(-20)})},[]));const o=({children:a,name:l,label:h})=>d.jsxs(d.Fragment,{children:[d.jsx("div",{onClick:()=>tt(l),className:R("h-8 px-2 text-foreground cursor-pointer hover:opacity-50 flex items-center space-x-1 border-b",r===l?"border-foreground":"border-transparent"),children:h||l}),r===l&&d.jsx(d.Fragment,{children:a})]});return i?null:d.jsxs("footer",{className:"bg-lineHighlight z-[20]",children:[d.jsxs("div",{className:"flex justify-between px-2",children:[d.jsxs("div",{className:R("flex select-none max-w-full overflow-auto",r&&"pb-2"),children:[d.jsx(o,{name:"intro",label:"welcome"}),d.jsx(o,{name:"sounds"}),d.jsx(o,{name:"console"}),d.jsx(o,{name:"reference"}),d.jsx(o,{name:"settings"}),ln&&d.jsx(o,{name:"files"})]}),r!==""&&d.jsx("button",{onClick:()=>tt(""),className:"text-foreground","aria-label":"Close Panel",children:d.jsx(nn,{className:"w-5 h-5"})})]}),r!==""&&d.jsxs("div",{className:"text-white flex-none h-[360px] overflow-auto max-w-full relative",ref:e,children:[r==="intro"&&d.jsx(un,{}),r==="console"&&d.jsx(fn,{log:t}),r==="sounds"&&d.jsx(mn,{}),r==="reference"&&d.jsx(on,{}),r==="settings"&&d.jsx(bn,{scheduler:n.scheduler}),r==="files"&&d.jsx(an,{})]})]})}function hn(n){mt(J.key,n)}function dn(n){var e,t,s,r;return t=/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim,e=n.replace(t,'<a class="underline" href="$1" target="_blank">$1</a>'),s=/(^|[^\/])(www\.[\S]+(\b|$))/gim,e=e.replace(s,'$1<a class="underline" href="http://$2" target="_blank">$2</a>'),r=/(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim,e=e.replace(r,'<a class="underline" href="mailto:$1">$1</a>'),e}function un(){return d.jsxs("div",{className:"prose dark:prose-invert max-w-[600px] pt-2 font-sans pb-8 px-4",children:[d.jsxs("h3",{children:[d.jsx("span",{className:R("animate-spin inline-block select-none"),children:"🌀"})," welcome"]}),d.jsxs("p",{children:["You have found ",d.jsx("span",{className:"underline",children:"strudel"}),", a new live coding platform to write dynamic music pieces in the browser! It is free and open-source and made for beginners and experts alike. To get started:",d.jsx("br",{}),d.jsx("br",{}),d.jsx("span",{className:"underline",children:"1. hit play"})," - ",d.jsx("span",{className:"underline",children:"2. change something"})," -"," ",d.jsx("span",{className:"underline",children:"3. hit update"}),d.jsx("br",{}),"If you don't like what you hear, try ",d.jsx("span",{className:"underline",children:"shuffle"}),"!"]}),d.jsxs("p",{children:["To learn more about what this all means, check out the"," ",d.jsx("a",{href:"./workshop/getting-started",target:"_blank",children:"interactive tutorial"}),". Also feel free to join the"," ",d.jsx("a",{href:"https://discord.com/invite/HGEdXmRkzT",target:"_blank",children:"tidalcycles discord channel"})," ","to ask any questions, give feedback or just say hello."]}),d.jsx("h3",{children:"about"}),d.jsxs("p",{children:["strudel is a JavaScript version of"," ",d.jsx("a",{href:"https://tidalcycles.org/",target:"_blank",children:"tidalcycles"}),", which is a popular live coding language for music, written in Haskell. You can find the source code at"," ",d.jsx("a",{href:"https://github.com/tidalcycles/strudel",target:"_blank",children:"github"}),". Please consider to"," ",d.jsx("a",{href:"https://opencollective.com/tidalcycles",target:"_blank",children:"support this project"})," ","to ensure ongoing development 💖"]})]})}function fn({log:n}){return d.jsxs("div",{id:"console-tab",className:"break-all px-4 dark:text-white text-stone-900 text-sm",children:[d.jsx("pre",{children:`███████╗████████╗██████╗ ██╗   ██╗██████╗ ███████╗██╗     
██╔════╝╚══██╔══╝██╔══██╗██║   ██║██╔══██╗██╔════╝██║     
███████╗   ██║   ██████╔╝██║   ██║██║  ██║█████╗  ██║     
╚════██║   ██║   ██╔══██╗██║   ██║██║  ██║██╔══╝  ██║     
███████║   ██║   ██║  ██║╚██████╔╝██████╔╝███████╗███████╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝`}),n.map((e,t)=>{const s=dn(e.message);return d.jsxs("div",{className:R(e.type==="error"&&"text-red-500",e.type==="highlight"&&"underline"),children:[d.jsx("span",{dangerouslySetInnerHTML:{__html:s}}),e.count?` (${e.count})`:""]},e.id)})]})}const pn=n=>Array.isArray(n)?n.length:typeof n=="object"?Object.values(n).length:1;function mn(){const n=Bt(Yt),{soundsFilter:e}=ve(),t=v.useMemo(()=>{let r=Object.entries(n).filter(([i])=>!i.startsWith("_"));return n?e==="user"?r.filter(([i,{data:o}])=>!o.prebake):e==="drums"?r.filter(([i,{data:o}])=>o.type==="sample"&&o.tag==="drum-machines"):e==="samples"?r.filter(([i,{data:o}])=>o.type==="sample"&&o.tag!=="drum-machines"):e==="synths"?r.filter(([i,{data:o}])=>["synth","soundfont"].includes(o.type)):r:[]},[n,e]),s=v.useRef();return mt("mouseup",()=>{const r=s.current;s.current=void 0,r?.then(i=>{i?.stop(me().currentTime+.01)})}),d.jsxs("div",{id:"sounds-tab",className:"flex flex-col w-full h-full dark:text-white text-stone-900",children:[d.jsx("div",{className:"px-2 pb-2 flex-none",children:d.jsx(Et,{value:e,onChange:r=>K.setKey("soundsFilter",r),items:{samples:"samples",drums:"drum-machines",synths:"Synths",user:"User"}})}),d.jsxs("div",{className:"p-2 min-h-0 max-h-full grow overflow-auto font-mono text-sm break-normal",children:[t.map(([r,{data:i,onTrigger:o}])=>d.jsxs("span",{className:"cursor-pointer hover:opacity-50",onMouseDown:async()=>{const a=me(),l={note:["synth","soundfont"].includes(i.type)?"a3":void 0,s:r,clip:1,release:.5},h=a.currentTime+.05,c=()=>s.current?.node?.disconnect();s.current=Promise.resolve(o(h,l,c)),s.current.then(u=>{u?.node.connect(a.destination)})},children:[" ",r,i?.type==="sample"?`(${pn(i.samples)})`:"",i?.type==="soundfont"?`(${i.fonts.length})`:""]},r)),t.length?"":"No custom sounds loaded in this pattern (yet)."]})]})}function Ge({label:n,value:e,onChange:t}){return d.jsxs("label",{children:[d.jsx("input",{type:"checkbox",checked:e,onChange:t})," "+n]})}function Et({value:n,onChange:e,items:t}){return d.jsx("div",{className:"flex max-w-lg",children:Object.entries(t).map(([s,r],i,o)=>d.jsx("button",{onClick:()=>e(s),className:R("px-2 border-b h-8",n===s?"border-foreground":"border-transparent"),children:r.toLowerCase()},s))})}function pt({value:n,options:e,onChange:t}){return d.jsx("select",{className:"p-2 bg-background rounded-md text-foreground",value:n,onChange:s=>t(s.target.value),children:Object.entries(e).map(([s,r])=>d.jsx("option",{className:"bg-background",value:s,children:r},s))})}function gn({value:n,onChange:e,step:t=1,...s}){return d.jsxs("div",{className:"flex space-x-2 gap-1",children:[d.jsx("input",{className:"p-2 grow",type:"range",value:n,step:t,onChange:r=>e(Number(r.target.value)),...s}),d.jsx("input",{type:"number",value:n,step:t,className:"w-16 bg-background rounded-md",onChange:r=>e(Number(r.target.value))})]})}function de({label:n,children:e}){return d.jsxs("div",{className:"grid gap-2",children:[d.jsx("label",{children:n}),e]})}const vn=Object.fromEntries(Object.keys(Me).map(n=>[n,n])),yn={monospace:"monospace",BigBlueTerminal:"BigBlueTerminal",x3270:"x3270",PressStart:"PressStart2P",galactico:"galactico","we-come-in-peace":"we-come-in-peace",FiraCode:"FiraCode","FiraCode-SemiBold":"FiraCode SemiBold"};function bn({scheduler:n}){const{theme:e,keybindings:t,isLineNumbersDisplayed:s,isAutoCompletionEnabled:r,isLineWrappingEnabled:i,fontSize:o,fontFamily:a}=ve();return d.jsxs("div",{className:"text-foreground p-4 space-y-4",children:[d.jsx(de,{label:"Theme",children:d.jsx(pt,{options:vn,value:e,onChange:l=>K.setKey("theme",l)})}),d.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[d.jsx(de,{label:"Font Family",children:d.jsx(pt,{options:yn,value:a,onChange:l=>K.setKey("fontFamily",l)})}),d.jsx(de,{label:"Font Size",children:d.jsx(gn,{value:o,onChange:l=>K.setKey("fontSize",l),min:10,max:40,step:2})})]}),d.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-4",children:[d.jsx(de,{label:"Keybindings",children:d.jsx(Et,{value:t,onChange:l=>K.setKey("keybindings",l),items:{codemirror:"Codemirror",vim:"Vim",emacs:"Emacs"}})}),d.jsx(Ge,{label:"Display line numbers",onChange:l=>K.setKey("isLineNumbersDisplayed",l.target.checked),value:s}),d.jsx(Ge,{label:"Enable auto-completion",onChange:l=>K.setKey("isAutoCompletionEnabled",l.target.checked),value:r}),d.jsx(Ge,{label:"Enable line wrapping",onChange:l=>K.setKey("isLineWrappingEnabled",l.target.checked),value:i})]}),d.jsx(de,{label:"Reset Settings",children:d.jsx("button",{className:"bg-background p-2 max-w-[300px] rounded-md hover:opacity-50",onClick:()=>{confirm("Sure?")&&K.set(Rt)},children:"restore default settings"})})]})}function _n({title:n,titleId:e,...t},s){return v.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:s,"aria-labelledby":e},t),n?v.createElement("title",{id:e},n):null,v.createElement("path",{fillRule:"evenodd",d:"M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21.324-.455.63-.739.914a.75.75 0 101.06 1.06c.37-.369.69-.77.96-1.193a26.61 26.61 0 013.095 2.348.75.75 0 00.992 0 26.547 26.547 0 015.93-3.95.75.75 0 00.42-.739 41.053 41.053 0 00-.39-3.114 29.925 29.925 0 00-5.199 2.801 2.25 2.25 0 01-2.514 0c-.41-.275-.826-.541-1.25-.797a6.985 6.985 0 01-1.084 3.45 26.503 26.503 0 00-1.281-.78A5.487 5.487 0 006 12v-.54z",clipRule:"evenodd"}))}const wn=v.forwardRef(_n),xn=wn;function Cn({title:n,titleId:e,...t},s){return v.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:s,"aria-labelledby":e},t),n?v.createElement("title",{id:e},n):null,v.createElement("path",{fillRule:"evenodd",d:"M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z",clipRule:"evenodd"}))}const An=v.forwardRef(Cn),jn=An;function kn({title:n,titleId:e,...t},s){return v.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:s,"aria-labelledby":e},t),n?v.createElement("title",{id:e},n):null,v.createElement("path",{d:"M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z"}),v.createElement("path",{d:"M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z"}))}const En=v.forwardRef(kn),Tn=En;function Sn({title:n,titleId:e,...t},s){return v.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:s,"aria-labelledby":e},t),n?v.createElement("title",{id:e},n):null,v.createElement("path",{fillRule:"evenodd",d:"M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z",clipRule:"evenodd"}))}const Fn=v.forwardRef(Sn),Tt=Fn;function On({title:n,titleId:e,...t},s){return v.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:s,"aria-labelledby":e},t),n?v.createElement("title",{id:e},n):null,v.createElement("path",{d:"M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z"}))}const Bn=v.forwardRef(On),Rn=Bn;function Dn({title:n,titleId:e,...t},s){return v.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:s,"aria-labelledby":e},t),n?v.createElement("title",{id:e},n):null,v.createElement("path",{fillRule:"evenodd",d:"M2 10a8 8 0 1116 0 8 8 0 01-16 0zm5-2.25A.75.75 0 017.75 7h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-4.5z",clipRule:"evenodd"}))}const $n=v.forwardRef(Dn),Pn=$n;function In({context:n}){const{embedded:e,started:t,pending:s,isDirty:r,lastShared:i,activeCode:o,handleTogglePlay:a,handleUpdate:l,handleShuffle:h,handleShare:c}=n,u=e||window.location!==window.parent.location,{isZen:m}=ve();return d.jsxs("header",{id:"header",className:R("py-1 flex-none w-full text-black justify-between z-[100] text-lg  select-none sticky top-0",!m&&!u&&"bg-lineHighlight",u?"flex":"md:flex"),children:[d.jsx("div",{className:"px-4 flex space-x-2 md:pt-0 select-none",children:d.jsxs("h1",{onClick:()=>{u&&window.open(window.location.href.replace("embed",""))},className:R(u?"text-l cursor-pointer":"text-xl","text-foreground font-bold flex space-x-2 items-center"),children:[d.jsx("div",{className:R("mt-[1px]",t&&"animate-spin","cursor-pointer"),onClick:()=>{u||Dt(!m)},children:"🌀"}),!m&&d.jsxs("div",{className:R(t&&"animate-pulse"),children:[d.jsx("span",{className:"",children:"strudel"})," ",d.jsx("span",{className:"text-sm",children:"REPL"})]})]})}),!m&&d.jsxs("div",{className:"flex max-w-full overflow-auto text-foreground",children:[d.jsx("button",{onClick:a,title:t?"stop":"play",className:R(u?"px-2":"p-2","hover:opacity-50",!t&&"animate-pulse"),children:s?d.jsx(d.Fragment,{children:"loading..."}):d.jsxs("span",{className:R("flex items-center space-x-1",u?"":"w-16"),children:[t?d.jsx(Pn,{className:"w-6 h-6"}):d.jsx(Tt,{className:"w-6 h-6"}),!u&&d.jsx("span",{children:t?"stop":"play"})]})}),d.jsxs("button",{onClick:l,title:"update",className:R("flex items-center space-x-1",u?"px-2":"p-2",!r||!o?"opacity-50":"hover:opacity-50"),children:[d.jsx(jn,{className:"w-6 h-6"}),!u&&d.jsx("span",{children:"update"})]}),!u&&d.jsxs("button",{title:"shuffle",className:"hover:opacity-50 p-2 flex items-center space-x-1",onClick:h,children:[d.jsx(Rn,{className:"w-6 h-6"}),d.jsx("span",{children:" shuffle"})]}),!u&&d.jsxs("button",{title:"share",className:R("cursor-pointer hover:opacity-50 flex items-center space-x-1",u?"px-2":"p-2"),onClick:c,children:[d.jsx(Tn,{className:"w-6 h-6"}),d.jsxs("span",{children:["share",i&&i===(o||code)?"d!":""]})]}),!u&&d.jsxs("a",{title:"learn",href:"./workshop/getting-started",className:R("hover:opacity-50 flex items-center space-x-1",u?"px-2":"p-2"),children:[d.jsx(xn,{className:"w-6 h-6"}),d.jsx("span",{children:"learn"})]})]})]})}const Nn=`// Koji Kondo - Swimming (Super Mario World)
stack(
  seq(
    "~",
    "~",
    "~",
    "A5 [F5@2 C5] [D5@2 F5] F5",
    "[C5@2 F5] [F5@2 C6] A5 G5",
    "A5 [F5@2 C5] [D5@2 F5] F5",
    "[C5@2 F5] [Bb5 A5 G5] F5@2",
    "A5 [F5@2 C5] [D5@2 F5] F5",
    "[C5@2 F5] [F5@2 C6] A5 G5",
    "A5 [F5@2 C5] [D5@2 F5] F5",
    "[C5@2 F5] [Bb5 A5 G5] F5@2",
    "A5 [F5@2 C5] A5 F5",
    "Ab5 [F5@2 Ab5] G5@2",
    "A5 [F5@2 C5] A5 F5",
    "Ab5 [F5@2 C5] C6@2",
    "A5 [F5@2 C5] [D5@2 F5] F5",
    "[C5@2 F5] [Bb5 A5 G5] F5@2"
  ).color('#FFEBB5'),
  seq(
    "[F4,Bb4,D5] [[D4,G4,Bb4]@2 [Bb3,D4,F4]] [[G3,C4,E4]@2 [[Ab3,F4] [A3,Gb4]]] [Bb3,E4,G4]",
    "[~ [F3, A3, C3] [F3, A3, C3]] [~ [F3, A3, C3] [F3, A3, C3]] [~ [F3, Bb3, D3] [F3, Bb3, D3]] [~ [F3, Bb3, Db3] [F3, Bb3, Db3]]",
    "[~ [F3, A3, C3] [F3, A3, C3]] [~ [F3, A3, C3] [F3, A3, C3]] [~ [F3, Bb3, D3] [F3, Bb3, D3]] [~ [F3, B3, D3] [F3, B3, D3]]",
    "[~ [F3, A3, C3] [F3, A3, C3]] [~ [F3, A3, C3] [F3, A3, C3]] [~ [F3, Bb3, D3] [F3, Bb3, D3]] [~ [F3, B3, D3] [F3, B3, D3]]",
    "[~ [A3, C4, E4] [A3, C4, E4]] [~ [Ab3, C4, Eb4] [Ab3, C4, Eb4]] [~ [F3, Bb3, D3] [F3, Bb3, D3]] [~ [G3, C4, E4] [G3, C4, E4]]",
    "[~ [F3, A3, C4] [F3, A3, C4]] [~ [F3, A3, C4] [F3, A3, C4]] [~ [F3, Bb3, D3] [F3, Bb3, D3]] [~ [F3, B3, D3] [F3, B3, D3]]",
    "[~ [F3, Bb3, D4] [F3, Bb3, D4]] [~ [F3, Bb3, C4] [F3, Bb3, C4]] [~ [F3, A3, C4] [F3, A3, C4]] [~ [F3, A3, C4] [F3, A3, C4]]",
    "[~ [F3, A3, C3] [F3, A3, C3]] [~ [F3, A3, C3] [F3, A3, C3]] [~ [F3, Bb3, D3] [F3, Bb3, D3]] [~ [F3, B3, D3] [F3, B3, D3]]",
    "[~ [A3, C4, E4] [A3, C4, E4]] [~ [Ab3, C4, Eb4] [Ab3, C4, Eb4]] [~ [F3, Bb3, D3] [F3, Bb3, D3]] [~ [G3, C4, E4] [G3, C4, E4]]",
    "[~ [F3, A3, C3] [F3, A3, C3]] [~ [F3, A3, C3] [F3, A3, C3]] [~ [F3, Bb3, D3] [F3, Bb3, D3]] [~ [F3, B3, D3] [F3, B3, D3]]",
    "[~ [F3, Bb3, D4] [F3, Bb3, D4]] [~ [F3, Bb3, C4] [F3, Bb3, C4]] [~ [F3, A3, C4] [F3, A3, C4]] [~ [F3, A3, C4] [F3, A3, C4]]",
    "[~ [Bb3, D3, F4] [Bb3, D3, F4]] [~ [Bb3, D3, F4] [Bb3, D3, F4]] [~ [A3, C4, F4] [A3, C4, F4]] [~ [A3, C4, F4] [A3, C4, F4]]",
    "[~ [Ab3, B3, F4] [Ab3, B3, F4]] [~ [Ab3, B3, F4] [Ab3, B3, F4]] [~ [G3, Bb3, F4] [G3, Bb3, F4]] [~ [G3, Bb3, E4] [G3, Bb3, E4]]",
    "[~ [Bb3, D3, F4] [Bb3, D3, F4]] [~ [Bb3, D3, F4] [Bb3, D3, F4]] [~ [A3, C4, F4] [A3, C4, F4]] [~ [A3, C4, F4] [A3, C4, F4]]",
    "[~ [Ab3, B3, F4] [Ab3, B3, F4]] [~ [Ab3, B3, F4] [Ab3, B3, F4]] [~ [G3, Bb3, F4] [G3, Bb3, F4]] [~ [G3, Bb3, E4] [G3, Bb3, E4]]",
    "[~ [F3, A3, C3] [F3, A3, C3]] [~ [F3, A3, C3] [F3, A3, C3]] [~ [F3, Bb3, D3] [F3, Bb3, D3]] [~ [F3, B3, D3] [F3, B3, D3]]",
    "[~ [F3, Bb3, D4] [F3, Bb3, D4]] [~ [F3, Bb3, C4] [F3, Bb3, C4]] [~ [F3, A3, C4] [F3, A3, C4]] [~ [F3, A3, C4] [F3, A3, C4]]"
  ).color('#54C571'),
  seq(
    "[G3 G3 C3 E3]",
    "[F2 D2 G2 C2]",
    "[F2 D2 G2 C2]",
    "[F2 A2 Bb2 B2]",
    "[A2 Ab2 G2 C2]",
    "[F2 A2 Bb2 B2]",
    "[G2 C2 F2 F2]",
    "[F2 A2 Bb2 B2]",
    "[A2 Ab2 G2 C2]",
    "[F2 A2 Bb2 B2]",
    "[G2 C2 F2 F2]",
    "[Bb2 Bb2 A2 A2]",
    "[Ab2 Ab2 G2 [C2 D2 E2]]",
    "[Bb2 Bb2 A2 A2]",
    "[Ab2 Ab2 G2 [C2 D2 E2]]",
    "[F2 A2 Bb2 B2]",
    "[G2 C2 F2 F2]"
  ).color('#0077C9')
).note().slow(51)
//.pianoroll({fold:1})
`,Ln=`// John Coltrane - Giant Steps
setVoicingRange('lefthand', ['E3', 'G4']);

stack(
  // melody
  seq(
    "[F#5 D5] [B4 G4] Bb4 [B4 A4]",
    "[D5 Bb4] [G4 Eb4] F#4 [G4 F4]",
    "Bb4 [B4 A4] D5 [D#5 C#5]",
    "F#5 [G5 F5] Bb5 [F#5 F#5]",
  ).color('#F8E71C'),
  // chords
  seq(
    "[B^7 D7] [G^7 Bb7] Eb^7 [Am7 D7]",
    "[G^7 Bb7] [Eb^7 F#7] B^7 [Fm7 Bb7]",
    "Eb^7 [Am7 D7] G^7 [C#m7 F#7]",
    "B^7 [Fm7 Bb7] Eb^7 [C#m7 F#7]"
  ).voicings('lefthand').color('#7ED321'),
  // bass
  seq(
    "[B2 D2] [G2 Bb2] [Eb2 Bb3] [A2 D2]",
    "[G2 Bb2] [Eb2 F#2] [B2 F#2] [F2 Bb2]",
    "[Eb2 Bb2] [A2 D2] [G2 D2] [C#2 F#2]",
    "[B2 F#2] [F2 Bb2] [Eb2 Bb3] [C#2 F#2]"
  ).color('#00B8D4')
).slow(20).note()
//.pianoroll({fold:1})`,Un=`// Koji Kondo - Princess Zelda's Rescue
stack(
  // melody
  \`[B3@2 D4] [A3@2 [G3 A3]] [B3@2 D4] [A3] 
  [B3@2 D4] [A4@2 G4] [D4@2 [C4 B3]] [A3]
  [B3@2 D4] [A3@2 [G3 A3]] [B3@2 D4] [A3]
  [B3@2 D4] [A4@2 G4] D5@2 
  [D5@2 [C5 B4]] [[C5 B4] G4@2] [C5@2 [B4 A4]] [[B4 A4] E4@2]
  [D5@2 [C5 B4]] [[C5 B4] G4 C5] [G5] [~ ~ B3]\`
  .color('#9C7C38'),
  // bass
  \`[[C2 G2] E3@2] [[C2 G2] F#3@2] [[C2 G2] E3@2] [[C2 G2] F#3@2]
  [[B1 D3] G3@2] [[Bb1 Db3] G3@2] [[A1 C3] G3@2] [[D2 C3] F#3@2]
  [[C2 G2] E3@2] [[C2 G2] F#3@2] [[C2 G2] E3@2] [[C2 G2] F#3@2]
  [[B1 D3] G3@2] [[Bb1 Db3] G3@2] [[A1 C3] G3@2] [[D2 C3] F#3@2]
  [[F2 C3] E3@2] [[E2 B2] D3@2] [[D2 A2] C3@2] [[C2 G2] B2@2]
  [[F2 C3] E3@2] [[E2 B2] D3@2] [[Eb2 Bb2] Db3@2] [[D2 A2] C3 [F3,G2]]\`
  .color('#4C4646')
).transpose(12).slow(48)
  .superimpose(x=>x.add(0.06)) // add slightly detuned voice
  .note()
  .gain(.1)
  .s('triangle')
  .room(1)
  //.pianoroll({fold:1})`,Gn=`// "Caverave"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

const keys = x => x.s('sawtooth').cutoff(1200).gain(.5)
  .attack(0).decay(.16).sustain(.3).release(.1);

const drums = stack(
  s("bd*2").mask("<x@7 ~>/8").gain(.8),
  s("~ <sd!7 [sd@3 ~]>").mask("<x@7 ~>/4").gain(.5),
  s("[~ hh]*2").delay(.3).delayfeedback(.5).delaytime(.125).gain(.4)
);

const thru = (x) => x.transpose("<0 1>/8").transpose(-1);
const synths = stack(
  "<eb4 d4 c4 b3>/2"
  .scale(timeCat([3,'C minor'],[1,'C melodic minor'])
  .slow(8)).struct("[~ x]*2")
  .layer(
    x=>x.scaleTranspose(0).early(0),
    x=>x.scaleTranspose(2).early(1/8),
    x=>x.scaleTranspose(7).early(1/4),
    x=>x.scaleTranspose(8).early(3/8)
  ).apply(thru).note().apply(keys).mask("<~ x>/16")
  .color('darkseagreen'),
  note("<C2 Bb1 Ab1 [G1 [G2 G1]]>/2".apply(thru))
  .struct("[x [~ x] <[~ [~ x]]!3 [x x]>@2]/2".fast(2))
  .s('sawtooth').attack(0.001).decay(0.2).sustain(1).cutoff(500)
  .color('brown'),
  "<Cm7 Bb7 Fm7 G7b13>/2".struct("~ [x@0.2 ~]".fast(2))
  .voicings('lefthand')
  .apply(thru).every(2, early(1/8)).note().apply(keys).sustain(0)
  .delay(.4).delaytime(.12)
  .mask("<x@7 ~>/8".early(1/4))
)
stack(
  drums.fast(2).color('tomato'), 
  synths
).slow(2)
  //.pianoroll({fold:1})`,Mn=`samples({
  bd: 'bd/BT0A0D0.wav',
  sn: 'sn/ST0T0S3.wav',
  hh: 'hh/000_hh3closedhh.wav'
}, 'https://loophole-letters.vercel.app/samples/tidal/')

stack(
  "<bd!3 bd(3,4,3)>".color('#F5A623'),
  "hh*4".color('#673AB7'),
  "~ <sn!3 sn(3,4,2)>".color('#4CAF50')
).s()
.pianoroll({fold:1})
`,qn=`// adapted from a Barry Harris excercise
"0,2,[7 6]"
  .add("<0 1 2 3 4 5 7 8>")
  .scale('C bebop major')
  .transpose("<0 1 2 1>/8")
  .slow(2)
  .note().piano()
  .color('#00B8D4')
`,zn=`// "Blippy Rhodes"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

samples({
  bd: 'samples/tidal/bd/BT0A0D0.wav',
  sn: 'samples/tidal/sn/ST0T0S3.wav',
  hh: 'samples/tidal/hh/000_hh3closedhh.wav',
  rhodes: {
  E1: 'samples/rhodes/MK2Md2000.mp3',
  E2: 'samples/rhodes/MK2Md2012.mp3',
  E3: 'samples/rhodes/MK2Md2024.mp3',
  E4: 'samples/rhodes/MK2Md2036.mp3',
  E5: 'samples/rhodes/MK2Md2048.mp3',
  E6: 'samples/rhodes/MK2Md2060.mp3',
  E7: 'samples/rhodes/MK2Md2072.mp3'
  }
}, 'https://loophole-letters.vercel.app/')

stack(
  s("<bd sn> <hh hh*2 hh*3>").color('#00B8D4'),
  "<g4 c5 a4 [ab4 <eb5 f5>]>"
  .scale("<C:major C:mixolydian F:lydian [F:minor <Db:major Db:mixolydian>]>")
  .struct("x*8")
  .scaleTranspose("0 [-5,-2] -7 [-9,-2]")
  .slow(2)
  .note()
  .clip(.3)
  .s('rhodes')
  .room(.5)
  .delay(.3)
  .delayfeedback(.4)
  .delaytime(1/12).gain(.5).color('#7ED321'),
  "<c2 c3 f2 [[F2 C2] db2]>/2"
  .add("0,.02")
  .note().gain(.3)
  .clip("<1@3 [.3 1]>/2")
  .s('sawtooth').cutoff(600).color('#F8E71C'),
).fast(3/2)
//.pianoroll({fold:1})`,Hn=`// "Wavy kalimba"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

samples({
  'kalimba': { c5:'https://freesound.org/data/previews/536/536549_11935698-lq.mp3' }
})
const scales = "<C:major C:mixolydian F:lydian [F:minor Db:major]>"

stack(
  "[0 2 4 6 9 2 0 -2]*3"
  .add("<0 2>/4")
  .scale(scales)
  .struct("x*8")
  .velocity("<.8 .3 .6>*8")
  .slow(2),
  "<c2 c2 f2 [[F2 C2] db2]>"
  .scale(scales)
  .scaleTranspose("[0 <2 4>]*2")
  .struct("x*4")
  .velocity("<.8 .5>*4")
  .velocity(0.8)
  .slow(2)
)
  .fast(1)
  .note()
  .clip("<.4 .8 1 1.2 1.4 1.6 1.8 2>/8")
  .s('kalimba')
  .delay(.2)`,Jn=`// "Festival of fingers"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

const chords = "<Cm7 Fm7 G7 F#7>";
stack(
  chords.voicings('lefthand').struct("x(3,8,-1)").velocity(.5).off(1/7,x=>x.transpose(12).velocity(.2)),
  chords.rootNotes(2).struct("x(4,8,-2)"),
  chords.rootNotes(4)
  .scale(cat('C minor','F dorian','G dorian','F# mixolydian'))
  .struct("x(3,8,-2)".fast(2))
  .scaleTranspose("0 4 0 6".early(".125 .5")).layer(scaleTranspose("0,<2 [4,6] [5,7]>/4"))
).slow(2)
 .velocity(sine.struct("x*8").add(3/5).mul(2/5).fast(8))
 .note().piano()`,Kn=`// "Underground plumber"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos
// @details inspired by Friendship - Let's not talk about it (1979) :)

samples({ bd: 'bd/BT0A0D0.wav', sn: 'sn/ST0T0S3.wav', hh: 'hh/000_hh3closedhh.wav', cp: 'cp/HANDCLP0.wav',
}, 'https://loophole-letters.vercel.app/samples/tidal/')

const h = x=>x.transpose("<0@2 5 0 7 5 0 -5>/2")

stack(
  s("<<bd*2 bd> sn> hh").fast(2).gain(.7),
  "[c2 a1 bb1 ~] ~"
  .echo(2, 1/16, 1)
  .slow(2)
  .layer(h)
  .note().s('square')
  .clip(.4)
  .cutoff(400).decay(.12).sustain(0)
  ,
  "[g2,[c3 eb3]]".iter(4)
  .echoWith(4, 1/8, (x,n)=>x.transpose(n*12).velocity(Math.pow(.4,n)))
  .layer(h).note()
  .clip(.1)
)
  .fast(2/3)
  .pianoroll()`,Vn=`// "Bridge is over"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos, bassline by BDP - The Bridge Is Over

samples({mad:'https://freesound.org/data/previews/22/22274_109943-lq.mp3'})
stack(
  stack(
  note("c3*2 [[c3@1.4 bb2] ab2] gb2*2 <[[gb2@1.4 ab2] bb2] gb2>")
    .gain(.8).clip("[.5 1]*2"),
  n("<0 1 2 3 4 3 2 1>")
    .clip(.5)
    .echoWith(8, 1/32, (x,i)=>x.add(n(i)).velocity(Math.pow(.7,i)))
    .scale('c4 whole tone')
    .echo(3, 1/8, .5)
  ).piano(),
  s("mad").slow(2)
).cpm(78).slow(4)
  .pianoroll()
`,Wn=`// "Good times"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

const scale = cat('C3 dorian','Bb2 major').slow(4);
stack(
  n("2*4".add(12)).off(1/8, add(2))
  .scale(scale)
  .fast(2)
  .add("<0 1 2 1>").hush(),
  "<0 1 2 3>(3,8,2)".off(1/4, add("2,4"))
  .n().scale(scale),
  n("<0 4>(5,8,-1)").scale(scale).sub(note(12))
)
  .velocity(".6 .7".fast(4))
  .add(note(4))
  .piano()
  .clip(2)
  .velocity(.8)
  .slow(2)
  .pianoroll()`,Yn=`// "Echo piano"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

n("<0 2 [4 6](3,4,2) 3*2>").color('salmon')
.off(1/4, x=>x.add(2).color('green'))
.off(1/2, x=>x.add(6).color('steelblue'))
.scale('D minor')
.echo(4, 1/8, .5)
.clip(.5)
.piano()
.pianoroll()`,Xn=`// Hirokazu Tanaka - World 1-1
stack(
  // melody
  note(\`<
  [e5 ~] [[d5@2 c5] [~@2 e5]] ~ [~ [c5@2 d5]] [e5 e5] [d5 c5] [e5 f5] [g5 a5]
  [~ c5] [c5 d5] [e5 [c5@2 c5]] [~ c5] [f5 e5] [c5 d5] [~ g6] [g6 ~]
  [e5 ~] [[d5@2 c5] [~@2 e5]] ~ [~ [c5@2 d5]] [e5 e5] [d5 c5] [a5 g5] [c6 [e5@2 d5]]
  [~ c5] [c5 d5] [e5 [c5@2 c5]] [~ c5] [f5 e5] [c5 d5] [~ [g6@2 ~] ~@2] [g5 ~] 
  [~ a5] [b5 c6] [b5@2 ~@2 g5] ~
  [f5 ~] [[g5@2 f5] ~] [[e5 ~] [f5 ~]] [[f#5 ~] [g5 ~]]
  [~ a5] [b5 c6] [b5@2 ~@2 g5] ~
  [eb6 d6] [~ c6] ~!2
  >\`)
  .clip(.95),
  // sub melody
  note(\`<
  [~ g4]!2 [~ ab4]!2 [~ a4]!2 [~ bb4]!2 
  [~ a4]!2 [~ g4]!2 [d4 e4] [f4 gb4] ~!2
  [~ g4]!2 [~ ab4]!2 [~ a4]!2 [~ bb4]!2 
  [~ a4]!2 [~ g4]!2 [d4 e4] [f4 gb4] ~!2
  [~ c5]!4 [~ a4]!2 [[c4 ~] [d4 ~]] [[eb4 ~] [e4 ~]]
  [~ c5]!4 [~ eb5]!2 [g4*2 [f4 ~]] [[e4 ~] [d4 ~]]
  >\`),
  // bass
  note(\`<
  c3!7 a3 f3!2
  e3!2 ~!4
  c3!7 a3 f3!2
  e3!2 ~!4
  f3!2 e3!2 d3!2 ~!2
  f3!2 e3!2 ab3!2 ~!2
  >\`)
  .clip(.5)
).fast(2)`,Zn=`// "Random bells"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

samples({
  bell: { c6: 'https://freesound.org/data/previews/411/411089_5121236-lq.mp3' },
  bass: { d2: 'https://freesound.org/data/previews/608/608286_13074022-lq.mp3' }
})

stack(
  // bells
  "0".euclidLegato(3,8)
  .echo(3, 1/16, .5)
  .add(rand.range(0,12))
  .scale("D:minor:pentatonic").note()
  .velocity(rand.range(.5,1))
  .s('bell').gain(.6).delay(.2).delaytime(1/3).delayfeedback(.8),
  // bass
  note("<D2 A2 G2 F2>").euclidLegatoRot(6,8,4).s('bass').clip(1).gain(.8)
)
  .slow(6)
  .pianoroll({vertical:1})`,Qn=`// "Waa2"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

n(
  "a4 [a3 c3] a3 c3"
  .sub("<7 12 5 12>".slow(2))
  .off(1/4,x=>x.add(7))
  .off(1/8,x=>x.add(12))
)
  .slow(2)
  .clip(sine.range(0.3, 2).slow(28))
  .s("sawtooth square".fast(2))
  .cutoff(cosine.range(500,4000).slow(16))
  .gain(.5)
  .room(.5)
  `,ei=`// "Hyperpop"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

const lfo = cosine.slow(15);
const lfo2 = sine.slow(16);
const filter1 = x=>x.cutoff(lfo2.range(300,3000));
const filter2 = x=>x.hcutoff(lfo.range(1000,6000)).cutoff(4000)
const scales = cat('D3 major', 'G3 major').slow(8)

samples({
  bd: '344/344757_1676145-lq.mp3',
  sn: '387/387186_7255534-lq.mp3',
  hh: '561/561241_12517458-lq.mp3',
  hh2:'44/44944_236326-lq.mp3',
  hh3: '44/44944_236326-lq.mp3',
}, 'https://freesound.org/data/previews/')

stack(
  "-7 0 -7 7".struct("x(5,8,1)").fast(2).sub(7)
  .scale(scales)
  .note()
  .s("sawtooth,square")
  .gain(.3).attack(0.01).decay(0.1).sustain(.5)
  .apply(filter1),
  "~@3 [<2 3>,<4 5>]"
  .echo(4,1/16,.7)
  .scale(scales)
  .note()
  .s('square').gain(.7)
  .attack(0.01).decay(0.1).sustain(0)
  .apply(filter1),
  "6 4 2".add(14)
  .superimpose(sub("5"))
  .fast(1).euclidLegato(3,8)
  .mask("<1 0@7>")
  .fast(2)
  .echo(32, 1/8, .8)
  .scale(scales)
  .note()
  .s("sawtooth")
  .gain(sine.range(.1,.4).slow(8))
  .attack(.001).decay(.2).sustain(0)
  .apply(filter2)
).stack(
  stack(
    "bd <~@7 [~ bd]>".fast(2),
    "~ sn",
    "[~ hh3]*2"
  ).s().fast(2).gain(.7)
).slow(2)
// strudel disable-highlighting`,ti=`// "Festival of fingers 3"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

n("[-7*3],0,2,6,[8 7]")
  .echoWith(
    4, // echo 4 times
    1/4, // 1/4s between echos
    (x,i)=>x
      .add(n(i*7)) // add octaves
      .gain(1/(i+1)) // reduce gain
      .clip(1/(i+1))
    )
  .velocity(perlin.range(.5,.9).slow(8))
  .stack(n("[22 25]*3")
         .clip(sine.range(.5,2).slow(8))
         .gain(sine.range(.4,.8).slow(5))
         .echo(4,1/12,.5))
  .scale("<D:dorian G:mixolydian C:dorian F:mixolydian>")
  .slow(2).piano()
//.pianoroll({maxMidi:160})`,si=`// "Melting submarine"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

await samples('github:tidalcycles/Dirt-Samples/master/')
stack(
  s("bd:5,[~ <sd:1!3 sd:1(3,4,3)>],hh27(3,4,1)") // drums
  .speed(perlin.range(.7,.9)) // random sample speed variation
  //.hush()
  ,"<a1 b1*2 a1(3,8) e2>" // bassline
  .off(1/8,x=>x.add(12).degradeBy(.5)) // random octave jumps
  .add(perlin.range(0,.5)) // random pitch variation
  .superimpose(add(.05)) // add second, slightly detuned voice
  .note() // wrap in "note"
  .decay(.15).sustain(0) // make each note of equal length
  .s('sawtooth') // waveform
  .gain(.4) // turn down
  .cutoff(sine.slow(7).range(300,5000)) // automate cutoff
  //.hush()
  ,"<Am7!3 <Em7 E7b13 Em7 Ebm7b5>>".voicings('lefthand') // chords
  .superimpose(x=>x.add(.04)) // add second, slightly detuned voice
  .add(perlin.range(0,.5)) // random pitch variation
  .note() // wrap in "note"
  .s('sawtooth') // waveform
  .gain(.16) // turn down
  .cutoff(500) // fixed cutoff
  .attack(1) // slowly fade in
  //.hush()
  ,"a4 c5 <e6 a6>".struct("x(5,8,-1)")
  .superimpose(x=>x.add(.04)) // add second, slightly detuned voice
  .add(perlin.range(0,.5)) // random pitch variation
  .note() // wrap in "note"
  .decay(.1).sustain(0) // make notes short
  .s('triangle') // waveform
  .degradeBy(perlin.range(0,.5)) // randomly controlled random removal :)
  .echoWith(4,.125,(x,n)=>x.gain(.15*1/(n+1))) // echo notes
  //.hush()
)
  .slow(3/2)`,ri=`// "Outro music"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

samples({
  bd: ['bd/BT0AADA.wav','bd/BT0AAD0.wav','bd/BT0A0DA.wav','bd/BT0A0D3.wav','bd/BT0A0D0.wav','bd/BT0A0A7.wav'],
  sd: ['sd/rytm-01-classic.wav','sd/rytm-00-hard.wav'],
  hh: ['hh27/000_hh27closedhh.wav','hh/000_hh3closedhh.wav'],
  perc: ['perc/002_perc2.wav'],
}, 'github:tidalcycles/Dirt-Samples/master/');

"C^7 Am7 Dm7 G7".slow(2).voicings('lefthand')
  .stack("0@6 [<1 2> <2 0> 1]@2".scale('C5 major'))
  .note().slow(4)
  .s("gm_epiano1:1")
  .color('steelblue')
  .stack(
   "<-7 ~@2 [~@2 -7] -9 ~@2 [~@2 -9] -10!2 ~ [~@2 -10] -5 ~ [-3 -2 -10]@2>*2".scale('C3 major')
    .note().s('sawtooth').color('brown')
  )
  .attack(0.05).decay(.1).sustain(.7)
  .cutoff(perlin.range(800,2000))
  .gain(.3)
  .stack(
    s("<bd!3 [bd ~ bd]> sd,hh*3,~@5 <perc perc*3>")
    .speed(perlin.range(.9,1.1))
    .n(3).color('gray')
  ).slow(3/2)
  //.pianoroll({autorange:1,vertical:1,fold:0})
  `,ni=`// "Bass fuge"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

samples({ flbass: ['00_c2_finger_long_neck.wav','01_c2_finger_short_neck.wav','02_c2_finger_long_bridge.wav','03_c2_finger_short_bridge.wav','04_c2_pick_long.wav','05_c2_pick_short.wav','06_c2_palm_mute.wav'] }, 
  'github:cleary/samples-flbass/main/')
samples({
bd: ['bd/BT0AADA.wav','bd/BT0AAD0.wav','bd/BT0A0DA.wav','bd/BT0A0D3.wav','bd/BT0A0D0.wav','bd/BT0A0A7.wav'],
sd: ['sd/rytm-01-classic.wav','sd/rytm-00-hard.wav'],
hh: ['hh27/000_hh27closedhh.wav','hh/000_hh3closedhh.wav'],
}, 'github:tidalcycles/Dirt-Samples/master/');

note("<8(3,8) <7 7*2> [4 5@3] 8>".sub(1) // sub 1 -> 1-indexed
.layer(
x=>x,
x=>x.add(7).color('steelblue')
.off(1/8,x=>x.add("2,4").off(1/8,x=>x.add(5).echo(4,.125,.5)))
.slow(2),
).scale('A1 minor'))
.s("flbass").n(0)
.gain(.3)
.cutoff(sine.slow(7).range(200,4000))
.resonance(10)
//.hcutoff(400)
.clip(1)
.stack(s("bd:1*2,~ sd:0,[~ hh:0]*2"))
.pianoroll({vertical:1})`,ii=`// "Chop"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

samples({ p: 'https://cdn.freesound.org/previews/648/648433_11943129-lq.mp3' })

s("p")
  .loopAt(32)
  .chop(128)
  .jux(rev)
  .shape(.4)
  .decay(.1)
  .sustain(.6)
  `,oi=`// "Delay"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

stack(
    s("bd <sd cp>")
    .delay("<0 .5>")
    .delaytime(".16 | .33")
    .delayfeedback(".6 | .8")
  ).sometimes(x=>x.speed("-1"))`,ai=`// "Orbit"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

stack(
    s("bd <sd cp>")
    .delay(.5)
    .delaytime(.33)
    .delayfeedback(.6),
    s("hh*2")
    .delay(.8)
    .delaytime(.08)
    .delayfeedback(.7)
    .orbit(2)
  ).sometimes(x=>x.speed("-1"))`,li=`// "Belldub"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

samples({ bell: {b4:'https://cdn.freesound.org/previews/339/339809_5121236-lq.mp3'}})
// "Hand Bells, B, Single.wav" by InspectorJ (www.jshaw.co.uk) of Freesound.org
stack(
  // bass
  note("[0 ~] [2 [0 2]] [4 4*2] [[4 ~] [2 ~] 0@2]".scale('g1 dorian').superimpose(x=>x.add(.02)))
  .s('sawtooth').cutoff(200).resonance(20).gain(.15).shape(.6).release(.05),
  // perc
  s("[~ hh]*4").room("0 0.5".fast(2)).end(perlin.range(0.02,1)),
  s("mt lt ht").struct("x(3,8)").fast(2).gain(.5).room(.5).sometimes(x=>x.speed(".5")),
  s("misc:2").speed(1).delay(.5).delaytime(1/3).gain(.4),
  // chords
  note("[~ Gm7] ~ [~ Dm7] ~".voicings('lefthand').superimpose(x=>x.add(.1)))
  .s('sawtooth').gain(.5)
  .cutoff(perlin.range(400,3000).slow(8))
  .decay(perlin.range(0.05,.2)).sustain(0)
  .delay(.9).room(1),
  // blips
  note(
    "0 5 4 2".iter(4)
    .off(1/3, add(7))
    .scale('g4 dorian')
  ).s('square').cutoff(2000).decay(.03).sustain(0)
  .degradeBy(.2)
  .orbit(2).delay(.2).delaytime(".33 | .6 | .166 | .25")
  .room(1).gain(.5).mask("<0 1>/8"),
  // bell
  note(rand.range(0,12).struct("x(5,8,-1)").scale('g2 minor pentatonic')).s('bell').begin(.05)
  .delay(.2).degradeBy(.4).gain(.4)
  .mask("<1 0>/8")
).slow(5)`,ci=`// "Dinofunk"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

samples({bass:'https://cdn.freesound.org/previews/614/614637_2434927-hq.mp3',
dino:{b4:'https://cdn.freesound.org/previews/316/316403_5123851-hq.mp3'}})
setVoicingRange('lefthand', ['c3','a4'])

stack(
s('bass').loopAt(8).clip(1),
s("bd*2, ~ sd,hh*4"),
note("Abm7".voicings('lefthand').struct("x(3,8,1)".slow(2))),
"0 1 2 3".scale('ab4 minor pentatonic')
.superimpose(x=>x.add(.1))
.sometimes(x=>x.add(12))
.note().s('sawtooth')
.cutoff(sine.range(400,2000).slow(16)).gain(.8)
.decay(perlin.range(.05,.2)).sustain(0)
.delay(sine.range(0,.5).slow(32))
.degradeBy(.4).room(1),
note("<b4 eb4>").s('dino').delay(.8).slow(8).room(.5)
)`,hi=`// "Sample demo"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

stack(
  // percussion
  s("[woodblock:1 woodblock:2*2] snare_rim:0,gong/8,brakedrum:1(3,8),~@3 cowbell:3")
  .sometimes(x=>x.speed(2)),
  // melody
  note("<0 4 1 3 2>".off(".25 | .125",add(2)).scale('D3 hirajoshi'))
  .s("clavisynth").gain(.2).delay(.25).jux(rev)
  .degradeBy(sine.range(0,.5).slow(32)),
  // bass
  note("<0@3 <2(3,8) 3(3,8)>>".scale('D1 hirajoshi'))
  .s('psaltery_pluck').gain(.6).clip(1)
  .release(.1).room(.5)
)`,di=`// "Holy flute"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

"c3 eb3(3,8) c4/2 g3*2"
.superimpose(
  x=>x.slow(2).add(12),
  x=>x.slow(4).sub(5)
).add("<0 1>/16")
.note().s('ocarina_vib').clip(1)
.release(.1).room(1).gain(.2)
.color("salmon | orange | darkseagreen")
.pianoroll({fold:0,autorange:0,vertical:0,cycles:12,smear:0,minMidi:40})
`,ui=`// "Flatrave"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

stack(
  s("bd*2,~ [cp,sd]").bank('RolandTR909'),
  
  s("hh:1*4").sometimes(fast("2"))
  .rarely(x=>x.speed(".5").delay(.5))
  .end(perlin.range(0.02,.05).slow(8))
  .bank('RolandTR909').room(.5)
  .gain("0.4,0.4(5,8,-1)"),
  
  note("<0 2 5 3>".scale('G1 minor')).struct("x(5,8,-1)")
  .s('sawtooth').decay(.1).sustain(0),
  
  note("<G4 A4 Bb4 A4>,Bb3,D3").struct("~ x*2").s('square').clip(1)
  .cutoff(sine.range(500,4000).slow(16)).resonance(10)
  .decay(sine.slow(15).range(.05,.2)).sustain(0)
  .room(.5).gain(.3).delay(.2).mask("<0 1@3>/8"),
  
  "0 5 3 2".sometimes(slow(2)).off(1/8,add(5)).scale('G4 minor').note()
  .decay(.05).sustain(0).delay(.2).degradeBy(.5).mask("<0 1>/16")
)`,fi=`// "Amensister"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

await samples('github:tidalcycles/Dirt-Samples/master')

stack(
  // amen
  n("0 1 2 3 4 5 6 7")
  .sometimes(x=>x.ply(2))
  .rarely(x=>x.speed("2 | -2"))
  .sometimesBy(.4, x=>x.delay(".5"))
  .s("amencutup")
  .slow(2)
  .room(.5)
  ,
  // bass
  sine.add(saw.slow(4)).range(0,7).segment(8)
  .superimpose(x=>x.add(.1))
  .scale('G0 minor').note()
  .s("sawtooth").decay(.1).sustain(0)
  .gain(.4).cutoff(perlin.range(300,3000).slow(8)).resonance(10)
  .degradeBy("0 0.1 .5 .1")
  .rarely(add(note("12")))
  ,
  // chord
  note("Bb3,D4".superimpose(x=>x.add(.2)))
  .s('sawtooth').cutoff(1000).struct("<~@3 [~ x]>")
  .decay(.05).sustain(.0).delay(.8).delaytime(.125).room(.8)
  ,
  // alien
  s("breath").room(1).shape(.6).chop(16).rev().mask("<x ~@7>")
  ,
  n("0 1").s("east").delay(.5).degradeBy(.8).speed(rand.range(.5,1.5))
).reset("<x@7 x(5,8,-1)>")`,pi=`// "Jux und tollerei"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

note("c3 eb3 g3 bb3").palindrome()
.s('sawtooth')
.jux(x=>x.rev().color('green').s('sawtooth'))
.off(1/4, x=>x.add(note("<7 12>/2")).slow(2).late(.005).s('triangle'))
//.delay(.5)
.fast(1).cutoff(sine.range(200,2000).slow(8))
.decay(.05).sustain(0)
.room(.6)
.delay(.5).delaytime(.1).delayfeedback(.4)
.pianoroll()`,mi=`// "CSound demo"
// @license with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

await loadCsound\`
instr CoolSynth
    iduration = p3
    ifreq = p4
    igain = p5
    ioct = octcps(ifreq)

    kpwm = oscili(.05, 8)
    asig = vco2(igain, ifreq, 4, .5 + kpwm)
    asig += vco2(igain, ifreq * 2)

    idepth = 2
    acut = transegr:a(0, .005, 0, idepth, .06, -4.2, 0.001, .01, -4.2, 0) ; filter envelope
    asig = zdf_2pole(asig, cpsoct(ioct + acut + 2), 0.5)

    iattack = .01
    isustain = .5
    idecay = .1
    irelease = .1
    asig *= linsegr:a(0, iattack, 1, idecay, isustain, iduration, isustain, irelease, 0)
    
    out(asig, asig)
endin\`

"<0 2 [4 6](3,4,2) 3*2>"
.off(1/4, add(2))
.off(1/2, add(6))
.scale('D minor')
.note()
//.pianoroll()
.csound('CoolSynth')`,gi=`// "Lounge sponge"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos, livecode.orc by Steven Yi

await loadOrc('github:kunstmusik/csound-live-code/master/livecode.orc')

stack(
  note("<C^7 A7 Dm7 Fm7>/2".voicings('lefthand'))
  .cutoff(sine.range(500,2000).round().slow(16))
  .euclidLegato(3,8).csound('FM1')
  ,
  note("<C2 A1 D2 F2>/2").ply(8).csound('Bass').gain("1 4 1 4")
  ,
  n("0 7 [4 3] 2".fast(2/3).off(".25 .125", add("<2 4 -3 -1>"))
  .slow(2).scale('A4 minor'))
  .clip(.25).csound('SynHarp')
  ,
  s("bd*2,[~ hh]*2,~ cp").bank('RolandTR909')
)`,vi=`// "Arpoon"
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @by Felix Roos

await samples('github:tidalcycles/Dirt-Samples/master')

note("<<Am7 C^7> C7 F^7 [Fm7 E7b9]>".voicings('lefthand'))
  .arp("[0,3] 2 [1,3] 2".fast(3).lastOf(4, fast(2))).clip(2)
  .add(perlin.range(0,0.2).add("<0 12>/8").note())
  .cutoff(perlin.range(500,4000)).resonance(12)
  .gain("<.5 .8>*16")
  .decay(.16).sustain(0.5)
  .delay(.2)
  .room(.5).pan(sine.range(.3,.6))
  .s('piano')
  .stack("<<A1 C2>!2 F2 [F2 E2]>".add.out("0 -5".fast(2)).add("0,.12").note().s('sawtooth').clip(1).cutoff(300))
  .slow(4)
  .stack(s("bd*4, [~ [hh hh? hh?]]*2,~ [sd ~ [sd:2? bd?]]").bank('RolandTR909').gain(.5).slow(2))
`,yi=Object.freeze(Object.defineProperty({__proto__:null,amensister:fi,arpoon:vi,barryHarris:qn,bassFuge:ni,belldub:li,blippyRhodes:zn,bridgeIsOver:Vn,caverave:Gn,chop:ii,csoundDemo:mi,delay:oi,dinofunk:ci,echoPiano:Yn,festivalOfFingers:Jn,festivalOfFingers3:ti,flatrave:ui,giantSteps:Ln,goodTimes:Wn,holyflute:di,hyperpop:ei,juxUndTollerei:pi,loungeSponge:gi,meltingsubmarine:si,orbit:ai,outroMusic:ri,randomBells:Zn,sampleDemo:hi,sampleDrums:Mn,sml1:Xn,swimming:Nn,undergroundPlumber:Kn,waa2:Qn,wavyKalimba:Hn,zeldasRescue:Un},Symbol.toStringTag,{value:"Module"}));function bi({active:n}){return d.jsx("div",{className:"overflow-hidden opacity-50 fixed top-0 left-0 w-full z-[1000]",children:d.jsx("div",{className:R("h-[2px] block w-full",n?"bg-foreground animate-train":"bg-transparent"),children:d.jsx("div",{})})})}const{latestCode:_i}=K.get();Xt();const St=tn("https://pidxdsxphlhzjnzmifth.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZHhkc3hwaGxoempuem1pZnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTYyMzA1NTYsImV4cCI6MTk3MTgwNjU1Nn0.bqlw7802fsWRnqU5BLYtmXk_k-D1VFmbkHMywWc15NM"),wi=[I(()=>import("./settings.ea7ba944.js").then(n=>n.m),["_astro/settings.ea7ba944.js","_astro/index.528e429e.js"]),I(()=>import("./index.873ee4fb.js"),["_astro/index.873ee4fb.js","_astro/settings.ea7ba944.js","_astro/index.528e429e.js"]),I(()=>import("./index.9481925f.js"),["_astro/index.9481925f.js","_astro/mini.2df09350.js","_astro/settings.ea7ba944.js","_astro/index.528e429e.js"]),I(()=>import("./index.d89fc6fe.js"),["_astro/index.d89fc6fe.js","_astro/settings.ea7ba944.js","_astro/index.528e429e.js","_astro/prebake.2658b75f.js"]),I(()=>import("./index.80804d81.js"),["_astro/index.80804d81.js","_astro/settings.ea7ba944.js","_astro/index.528e429e.js"]),I(()=>import("./index.5099bcab.js"),["_astro/index.5099bcab.js","_astro/prebake.2658b75f.js","_astro/settings.ea7ba944.js","_astro/index.528e429e.js"]),I(()=>import("./osc.89644a0a.js"),["_astro/osc.89644a0a.js","_astro/index.528e429e.js","_astro/settings.ea7ba944.js"]),I(()=>import("./serial.ca69e5dc.js"),["_astro/serial.ca69e5dc.js","_astro/settings.ea7ba944.js","_astro/index.528e429e.js"]),I(()=>import("./index.0d606562.js"),["_astro/index.0d606562.js","_astro/settings.ea7ba944.js","_astro/index.528e429e.js","_astro/prebake.2658b75f.js"]),I(()=>import("./index.8d2999c5.js"),["_astro/index.8d2999c5.js","_astro/settings.ea7ba944.js","_astro/index.528e429e.js","_astro/prebake.2658b75f.js"])],xi=$t(Pt,It,...wi);gt();let ue,Ft;typeof window<"u"&&(ue=Nt(),Ft=()=>ue.clearRect(0,0,ue.canvas.height,ue.canvas.width));const Ci=()=>me().currentTime;async function Ai(){try{const e=window.location.href.split("?")[1]?.split("#")?.[0],t=window.location.href.split("#")[1];if(t)return atob(decodeURIComponent(t||""));if(e)return St.from("code").select("code").eq("hash",e).then(({data:s,error:r})=>{if(r&&console.warn("failed to load hash",err),s.length)return s[0].code})}catch(n){console.warn("failed to decode",n)}}function Ot(){const n=Object.entries(yi),e=r=>r[Math.floor(Math.random()*r.length)],[t,s]=e(n);return{name:t,code:s}}const{code:ji,name:ki}=Ot(),Ei=v.createContext(null);function Ii({embedded:n=!1}){const e=n||window.location!==window.parent.location,[t,s]=v.useState(),[r,i]=v.useState(),[o,a]=v.useState(!0),{theme:l,keybindings:h,fontSize:c,fontFamily:u,isLineNumbersDisplayed:m,isAutoCompletionEnabled:y,isLineWrappingEnabled:g}=ve(),{code:w,setCode:b,scheduler:k,evaluate:D,activateCode:$,isDirty:F,activeCode:U,pattern:Te,started:W,stop:q,error:be}=Gt({initialCode:"// LOADING...",defaultOutput:Zt,getTime:Ci,beforeEval:async()=>{a(!0),await xi,Lt(),st()},afterEval:({code:C,meta:G})=>{Se(G.miniLocations),a(!1),Ut(C),window.location.hash="#"+encodeURIComponent(btoa(C))},onEvalError:C=>{a(!1)},onToggle:C=>!C&&st(!1),drawContext:ue});v.useEffect(()=>{Ai().then(C=>{J(`Welcome to Strudel! ${C?"I have loaded the code from the URL.":`A random code snippet named "${ki}" has been loaded!`} Press play or hit ctrl+enter to run it!`,"highlight"),b(C||_i||ji),a(!1)})},[]),Mt(v.useCallback(async C=>{if(C.ctrlKey||C.altKey)if(C.code==="Enter"){if(me().state!=="running"){alert("please click play to initialize the audio. you can use shortcuts after that!");return}C.preventDefault(),qt(t),await $()}else(C.key==="."||C.code==="Period")&&(q(),C.preventDefault())},[$,q,t]));const{setMiniLocations:Se}=zt({view:t,pattern:Te,active:W&&!U?.includes("strudel disable-highlighting"),getTime:()=>k.now()}),N=v.useCallback(C=>{b(C),W&&J("[edit] code changed. hit ctrl+enter to update")},[W]),Fe=v.useCallback(C=>{},[]),ne=async()=>{await me().resume(),W?(J("[repl] stopped. tip: you can also stop by pressing ctrl+dot","highlight"),q()):(J("[repl] started. tip: you can also start by pressing ctrl+enter","highlight"),$())},S={scheduler:k,embedded:n,started:W,pending:o,isDirty:F,lastShared:r,activeCode:U,handleChangeCode:N,handleTogglePlay:ne,handleUpdate:()=>{F&&$(),J("[repl] code updated! tip: you can also update the code by pressing ctrl+enter","highlight")},handleShuffle:async()=>{const{code:C,name:G}=Ot();J(`[repl] ✨ loading random tune "${G}"`),Ft(),Qt(),k.setCps(1),await gt(),await D(C,!1)},handleShare:async()=>{const C=U||w;if(r===C){J("Link already generated!","error");return}const G=kt(12),ie=window.location.origin+window.location.pathname+"?"+G,{data:Ti,error:Oe}=await St.from("code").insert([{code:C,hash:G}]);if(Oe){console.log("error",Oe);const _e=`Error: ${Oe.message}`;J(_e)}else{i(U||w),await navigator.clipboard.writeText(ie);const _e=`Link copied to clipboard: ${ie}`;alert(_e),J(_e,"highlight")}}},O=v.useMemo(()=>Me[l]||Me.strudelTheme,[l]),j=v.useCallback(C=>{s(C)},[]);return d.jsx(Ei.Provider,{value:S,children:d.jsxs("div",{className:R("h-full flex flex-col"),children:[d.jsx(bi,{active:o}),d.jsx(In,{context:S}),d.jsx("section",{className:"grow flex text-gray-100 relative overflow-auto cursor-text pb-0",id:"code",children:d.jsx(Ht,{theme:O,value:w,keybindings:h,isLineNumbersDisplayed:m,isAutoCompletionEnabled:y,isLineWrappingEnabled:g,fontSize:c,fontFamily:u,onChange:N,onViewChanged:j,onSelectionChange:Fe})}),be&&d.jsx("div",{className:"text-red-500 p-4 bg-lineHighlight animate-pulse",children:be.message||"Unknown Error :-/"}),e&&!W&&d.jsxs("button",{onClick:()=>ne(),className:"text-white text-2xl fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[1000] m-auto p-4 bg-black rounded-md flex items-center space-x-2",children:[d.jsx(Tt,{className:"w-6 h-6"}),d.jsx("span",{children:"play"})]}),!e&&d.jsx(cn,{context:S})]})})}export{Ii as Repl};
