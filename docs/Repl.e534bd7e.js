import{_ as T}from"./chunks/preload-helper.1de719f8.js";import{l as D,i as Ve,e as Ke,c as Xe,p as De,g as Qe,w as Ze,a as et,b as Te,d as Be,r as tt}from"./chunks/prebake.487e17f6.js";import{cx as R,useStrudel as st,flash as rt,useHighlighting as nt,CodeMirror as it}from"./chunks/index.es.5648691a.js";import{g as ot,r as _}from"./chunks/index.a0884559.js";/* empty css                              */import{j as m}from"./chunks/jsx-runtime.d117285b.js";import{j as at}from"./chunks/doc.427480f2.js";function lt(n,e){for(var t=0;t<e.length;t++){const s=e[t];if(typeof s!="string"&&!Array.isArray(s)){for(const r in s)if(r!=="default"&&!(r in n)){const a=Object.getOwnPropertyDescriptor(s,r);a&&Object.defineProperty(n,r,a.get?a:{enumerable:!0,get:()=>s[r]})}}}return Object.freeze(Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}))}const ct="1.35.7",$e={"X-Client-Info":`supabase-js/${ct}`},ht="supabase.auth.token";function ut(n){return n.replace(/\/$/,"")}const dt=()=>typeof window<"u",ft="1.24.0",pt="http://localhost:9999",mt={"X-Client-Info":`gotrue-js/${ft}`},ee=10,M={ERROR_MESSAGE:"Request Failed",MAX_RETRIES:10,RETRY_INTERVAL:2},H="supabase.auth.token",gt={name:"sb",lifetime:60*60*8,domain:"",path:"/",sameSite:"lax"};var K=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(a){return a instanceof t?a:new t(function(l){l(a)})}return new(t||(t=Promise))(function(a,l){function h(o){try{i(s.next(o))}catch(c){l(c)}}function f(o){try{i(s.throw(o))}catch(c){l(c)}}function i(o){o.done?a(o.value):r(o.value).then(h,f)}i((s=s.apply(n,e||[])).next())})};const bt=n=>n.msg||n.message||n.error_description||n.error||JSON.stringify(n),vt=(n,e)=>{if(!n?.status)return e({message:M.ERROR_MESSAGE});if(typeof n.json!="function")return e(n);n.json().then(t=>e({message:bt(t),status:n?.status||500}))},yt=(n,e,t)=>{const s={method:n,headers:e?.headers||{}};return n==="GET"||(s.headers=Object.assign({"Content-Type":"application/json;charset=UTF-8"},e?.headers),s.body=JSON.stringify(t)),s};function le(n,e,t,s,r){return K(this,void 0,void 0,function*(){return new Promise((a,l)=>{n(t,yt(e,s,r)).then(h=>{if(!h.ok)throw h;return s?.noResolveJson?a:h.json()}).then(h=>a(h)).catch(h=>vt(h,l))})})}function pe(n,e,t){return K(this,void 0,void 0,function*(){return le(n,"GET",e,t)})}function C(n,e,t,s){return K(this,void 0,void 0,function*(){return le(n,"POST",e,s,t)})}function Ee(n,e,t,s){return K(this,void 0,void 0,function*(){return le(n,"PUT",e,s,t)})}function wt(n,e,t,s){return K(this,void 0,void 0,function*(){return le(n,"DELETE",e,s,t)})}function xt(n,e,t){const s=t||{},r=encodeURIComponent,a=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;if(typeof r!="function")throw new TypeError("option encode is invalid");if(!a.test(n))throw new TypeError("argument name is invalid");const l=r(e);if(l&&!a.test(l))throw new TypeError("argument val is invalid");let h=n+"="+l;if(s.maxAge!=null){const f=s.maxAge-0;if(isNaN(f)||!isFinite(f))throw new TypeError("option maxAge is invalid");h+="; Max-Age="+Math.floor(f)}if(s.domain){if(!a.test(s.domain))throw new TypeError("option domain is invalid");h+="; Domain="+s.domain}if(s.path){if(!a.test(s.path))throw new TypeError("option path is invalid");h+="; Path="+s.path}if(s.expires){if(typeof s.expires.toUTCString!="function")throw new TypeError("option expires is invalid");h+="; Expires="+s.expires.toUTCString()}if(s.httpOnly&&(h+="; HttpOnly"),s.secure&&(h+="; Secure"),s.sameSite)switch(typeof s.sameSite=="string"?s.sameSite.toLowerCase():s.sameSite){case"lax":h+="; SameSite=Lax";break;case"strict":h+="; SameSite=Strict";break;case"none":h+="; SameSite=None";break;default:throw new TypeError("option sameSite is invalid")}return h}function _t(n){if(!n||!n.headers||!n.headers.host)throw new Error('The "host" request header is not available');const e=n.headers.host.indexOf(":")>-1&&n.headers.host.split(":")[0]||n.headers.host;return!(["localhost","127.0.0.1"].indexOf(e)>-1||e.endsWith(".local"))}function kt(n,e){var t,s,r;return xt(n.name,n.value,{maxAge:n.maxAge,expires:new Date(Date.now()+n.maxAge*1e3),httpOnly:!0,secure:e,path:(t=n.path)!==null&&t!==void 0?t:"/",domain:(s=n.domain)!==null&&s!==void 0?s:"",sameSite:(r=n.sameSite)!==null&&r!==void 0?r:"lax"})}function ve(n,e,t){const s=t.map(a=>kt(a,_t(n))),r=e.getHeader("Set-Cookie");return r&&(r instanceof Array?Array.prototype.push.apply(s,r):typeof r=="string"&&s.push(r)),s}function te(n,e,t){e.setHeader("Set-Cookie",ve(n,e,t))}var ce=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(a){return a instanceof t?a:new t(function(l){l(a)})}return new(t||(t=Promise))(function(a,l){function h(o){try{i(s.next(o))}catch(c){l(c)}}function f(o){try{i(s.throw(o))}catch(c){l(c)}}function i(o){o.done?a(o.value):r(o.value).then(h,f)}i((s=s.apply(n,e||[])).next())})};function P(n){return Math.round(Date.now()/1e3)+n}function At(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(n){const e=Math.random()*16|0;return(n=="x"?e:e&3|8).toString(16)})}const N=()=>typeof window<"u";function $(n,e){var t;e||(e=((t=window?.location)===null||t===void 0?void 0:t.href)||""),n=n.replace(/[\[\]]/g,"\\$&");const s=new RegExp("[?&#]"+n+"(=([^&#]*)|&|#|$)"),r=s.exec(e);return r?r[2]?decodeURIComponent(r[2].replace(/\+/g," ")):"":null}const Ct=n=>{let e;return n?e=n:typeof fetch>"u"?e=(...t)=>ce(void 0,void 0,void 0,function*(){return yield(yield T(()=>import("./chunks/browser-ponyfill.f75b33c5.js").then(s=>s.b),["chunks/browser-ponyfill.f75b33c5.js","chunks/index.a0884559.js"])).fetch(...t)}):e=fetch,(...t)=>e(...t)},St=(n,e,t)=>ce(void 0,void 0,void 0,function*(){N()&&(yield n?.setItem(e,JSON.stringify(t)))}),Tt=(n,e)=>ce(void 0,void 0,void 0,function*(){const t=N()&&(yield n?.getItem(e));if(!t)return null;try{return JSON.parse(t)}catch{return t}}),Et=(n,e)=>{const t=N()&&n?.getItem(e);if(!t||typeof t!="string")return null;try{return JSON.parse(t)}catch{return t}},Rt=(n,e)=>ce(void 0,void 0,void 0,function*(){N()&&(yield n?.removeItem(e))});var k=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(a){return a instanceof t?a:new t(function(l){l(a)})}return new(t||(t=Promise))(function(a,l){function h(o){try{i(s.next(o))}catch(c){l(c)}}function f(o){try{i(s.throw(o))}catch(c){l(c)}}function i(o){o.done?a(o.value):r(o.value).then(h,f)}i((s=s.apply(n,e||[])).next())})};class Ft{constructor({url:e="",headers:t={},cookieOptions:s,fetch:r}){this.url=e,this.headers=t,this.cookieOptions=Object.assign(Object.assign({},gt),s),this.fetch=Ct(r)}_createRequestHeaders(e){const t=Object.assign({},this.headers);return t.Authorization=`Bearer ${e}`,t}cookieName(){var e;return(e=this.cookieOptions.name)!==null&&e!==void 0?e:""}getUrlForProvider(e,t){const s=[`provider=${encodeURIComponent(e)}`];if(t?.redirectTo&&s.push(`redirect_to=${encodeURIComponent(t.redirectTo)}`),t?.scopes&&s.push(`scopes=${encodeURIComponent(t.scopes)}`),t?.queryParams){const r=new URLSearchParams(t.queryParams);s.push(`${r}`)}return`${this.url}/authorize?${s.join("&")}`}signUpWithEmail(e,t,s={}){return k(this,void 0,void 0,function*(){try{const r=Object.assign({},this.headers);let a="";s.redirectTo&&(a="?redirect_to="+encodeURIComponent(s.redirectTo));const l=yield C(this.fetch,`${this.url}/signup${a}`,{email:e,password:t,data:s.data,gotrue_meta_security:{captcha_token:s.captchaToken}},{headers:r}),h=Object.assign({},l);return h.expires_in&&(h.expires_at=P(l.expires_in)),{data:h,error:null}}catch(r){return{data:null,error:r}}})}signInWithEmail(e,t,s={}){return k(this,void 0,void 0,function*(){try{const r=Object.assign({},this.headers);let a="?grant_type=password";s.redirectTo&&(a+="&redirect_to="+encodeURIComponent(s.redirectTo));const l=yield C(this.fetch,`${this.url}/token${a}`,{email:e,password:t,gotrue_meta_security:{captcha_token:s.captchaToken}},{headers:r}),h=Object.assign({},l);return h.expires_in&&(h.expires_at=P(l.expires_in)),{data:h,error:null}}catch(r){return{data:null,error:r}}})}signUpWithPhone(e,t,s={}){return k(this,void 0,void 0,function*(){try{const r=Object.assign({},this.headers),a=yield C(this.fetch,`${this.url}/signup`,{phone:e,password:t,data:s.data,gotrue_meta_security:{captcha_token:s.captchaToken}},{headers:r}),l=Object.assign({},a);return l.expires_in&&(l.expires_at=P(a.expires_in)),{data:l,error:null}}catch(r){return{data:null,error:r}}})}signInWithPhone(e,t,s={}){return k(this,void 0,void 0,function*(){try{const r=Object.assign({},this.headers),a="?grant_type=password",l=yield C(this.fetch,`${this.url}/token${a}`,{phone:e,password:t,gotrue_meta_security:{captcha_token:s.captchaToken}},{headers:r}),h=Object.assign({},l);return h.expires_in&&(h.expires_at=P(l.expires_in)),{data:h,error:null}}catch(r){return{data:null,error:r}}})}signInWithOpenIDConnect({id_token:e,nonce:t,client_id:s,issuer:r,provider:a}){return k(this,void 0,void 0,function*(){try{const l=Object.assign({},this.headers),h="?grant_type=id_token",f=yield C(this.fetch,`${this.url}/token${h}`,{id_token:e,nonce:t,client_id:s,issuer:r,provider:a},{headers:l}),i=Object.assign({},f);return i.expires_in&&(i.expires_at=P(f.expires_in)),{data:i,error:null}}catch(l){return{data:null,error:l}}})}sendMagicLinkEmail(e,t={}){var s;return k(this,void 0,void 0,function*(){try{const r=Object.assign({},this.headers);let a="";t.redirectTo&&(a+="?redirect_to="+encodeURIComponent(t.redirectTo));const l=(s=t.shouldCreateUser)!==null&&s!==void 0?s:!0;return{data:yield C(this.fetch,`${this.url}/otp${a}`,{email:e,create_user:l,gotrue_meta_security:{captcha_token:t.captchaToken}},{headers:r}),error:null}}catch(r){return{data:null,error:r}}})}sendMobileOTP(e,t={}){var s;return k(this,void 0,void 0,function*(){try{const r=(s=t.shouldCreateUser)!==null&&s!==void 0?s:!0,a=Object.assign({},this.headers);return{data:yield C(this.fetch,`${this.url}/otp`,{phone:e,create_user:r,gotrue_meta_security:{captcha_token:t.captchaToken}},{headers:a}),error:null}}catch(r){return{data:null,error:r}}})}signOut(e){return k(this,void 0,void 0,function*(){try{return yield C(this.fetch,`${this.url}/logout`,{},{headers:this._createRequestHeaders(e),noResolveJson:!0}),{error:null}}catch(t){return{error:t}}})}verifyMobileOTP(e,t,s={}){return k(this,void 0,void 0,function*(){try{const r=Object.assign({},this.headers),a=yield C(this.fetch,`${this.url}/verify`,{phone:e,token:t,type:"sms",redirect_to:s.redirectTo},{headers:r}),l=Object.assign({},a);return l.expires_in&&(l.expires_at=P(a.expires_in)),{data:l,error:null}}catch(r){return{data:null,error:r}}})}verifyOTP({email:e,phone:t,token:s,type:r="sms"},a={}){return k(this,void 0,void 0,function*(){try{const l=Object.assign({},this.headers),h=yield C(this.fetch,`${this.url}/verify`,{email:e,phone:t,token:s,type:r,redirect_to:a.redirectTo},{headers:l}),f=Object.assign({},h);return f.expires_in&&(f.expires_at=P(h.expires_in)),{data:f,error:null}}catch(l){return{data:null,error:l}}})}inviteUserByEmail(e,t={}){return k(this,void 0,void 0,function*(){try{const s=Object.assign({},this.headers);let r="";return t.redirectTo&&(r+="?redirect_to="+encodeURIComponent(t.redirectTo)),{data:yield C(this.fetch,`${this.url}/invite${r}`,{email:e,data:t.data},{headers:s}),error:null}}catch(s){return{data:null,error:s}}})}resetPasswordForEmail(e,t={}){return k(this,void 0,void 0,function*(){try{const s=Object.assign({},this.headers);let r="";return t.redirectTo&&(r+="?redirect_to="+encodeURIComponent(t.redirectTo)),{data:yield C(this.fetch,`${this.url}/recover${r}`,{email:e,gotrue_meta_security:{captcha_token:t.captchaToken}},{headers:s}),error:null}}catch(s){return{data:null,error:s}}})}refreshAccessToken(e){return k(this,void 0,void 0,function*(){try{const t=yield C(this.fetch,`${this.url}/token?grant_type=refresh_token`,{refresh_token:e},{headers:this.headers}),s=Object.assign({},t);return s.expires_in&&(s.expires_at=P(t.expires_in)),{data:s,error:null}}catch(t){return{data:null,error:t}}})}setAuthCookie(e,t){e.method!=="POST"&&(t.setHeader("Allow","POST"),t.status(405).end("Method Not Allowed"));const{event:s,session:r}=e.body;if(!s)throw new Error("Auth event missing!");if(s==="SIGNED_IN"){if(!r)throw new Error("Auth session missing!");te(e,t,[{key:"access-token",value:r.access_token},{key:"refresh-token",value:r.refresh_token}].map(a=>{var l;return{name:`${this.cookieName()}-${a.key}`,value:a.value,domain:this.cookieOptions.domain,maxAge:(l=this.cookieOptions.lifetime)!==null&&l!==void 0?l:0,path:this.cookieOptions.path,sameSite:this.cookieOptions.sameSite}}))}s==="SIGNED_OUT"&&te(e,t,["access-token","refresh-token"].map(a=>({name:`${this.cookieName()}-${a}`,value:"",maxAge:-1}))),t.status(200).json({})}deleteAuthCookie(e,t,{redirectTo:s="/"}){return te(e,t,["access-token","refresh-token"].map(r=>({name:`${this.cookieName()}-${r}`,value:"",maxAge:-1}))),t.redirect(307,s)}getAuthCookieString(e,t){e.method!=="POST"&&(t.setHeader("Allow","POST"),t.status(405).end("Method Not Allowed"));const{event:s,session:r}=e.body;if(!s)throw new Error("Auth event missing!");if(s==="SIGNED_IN"){if(!r)throw new Error("Auth session missing!");return ve(e,t,[{key:"access-token",value:r.access_token},{key:"refresh-token",value:r.refresh_token}].map(a=>{var l;return{name:`${this.cookieName()}-${a.key}`,value:a.value,domain:this.cookieOptions.domain,maxAge:(l=this.cookieOptions.lifetime)!==null&&l!==void 0?l:0,path:this.cookieOptions.path,sameSite:this.cookieOptions.sameSite}}))}return s==="SIGNED_OUT"?ve(e,t,["access-token","refresh-token"].map(a=>({name:`${this.cookieName()}-${a}`,value:"",maxAge:-1}))):t.getHeader("Set-Cookie")}generateLink(e,t,s={}){return k(this,void 0,void 0,function*(){try{return{data:yield C(this.fetch,`${this.url}/admin/generate_link`,{type:e,email:t,password:s.password,data:s.data,redirect_to:s.redirectTo},{headers:this.headers}),error:null}}catch(r){return{data:null,error:r}}})}createUser(e){return k(this,void 0,void 0,function*(){try{const t=yield C(this.fetch,`${this.url}/admin/users`,e,{headers:this.headers});return{user:t,data:t,error:null}}catch(t){return{user:null,data:null,error:t}}})}listUsers(){return k(this,void 0,void 0,function*(){try{return{data:(yield pe(this.fetch,`${this.url}/admin/users`,{headers:this.headers})).users,error:null}}catch(e){return{data:null,error:e}}})}getUserById(e){return k(this,void 0,void 0,function*(){try{return{data:yield pe(this.fetch,`${this.url}/admin/users/${e}`,{headers:this.headers}),error:null}}catch(t){return{data:null,error:t}}})}getUserByCookie(e,t){return k(this,void 0,void 0,function*(){try{if(!e.cookies)throw new Error("Not able to parse cookies! When using Express make sure the cookie-parser middleware is in use!");const s=e.cookies[`${this.cookieName()}-access-token`],r=e.cookies[`${this.cookieName()}-refresh-token`];if(!s)throw new Error("No cookie found!");const{user:a,error:l}=yield this.getUser(s);if(l){if(!r)throw new Error("No refresh_token cookie found!");if(!t)throw new Error("You need to pass the res object to automatically refresh the session!");const{data:h,error:f}=yield this.refreshAccessToken(r);if(f)throw f;if(h)return te(e,t,[{key:"access-token",value:h.access_token},{key:"refresh-token",value:h.refresh_token}].map(i=>{var o;return{name:`${this.cookieName()}-${i.key}`,value:i.value,domain:this.cookieOptions.domain,maxAge:(o=this.cookieOptions.lifetime)!==null&&o!==void 0?o:0,path:this.cookieOptions.path,sameSite:this.cookieOptions.sameSite}})),{token:h.access_token,user:h.user,data:h.user,error:null}}return{token:s,user:a,data:a,error:null}}catch(s){return{token:null,user:null,data:null,error:s}}})}updateUserById(e,t){return k(this,void 0,void 0,function*(){try{const s=yield Ee(this.fetch,`${this.url}/admin/users/${e}`,t,{headers:this.headers});return{user:s,data:s,error:null}}catch(s){return{user:null,data:null,error:s}}})}deleteUser(e){return k(this,void 0,void 0,function*(){try{const t=yield wt(this.fetch,`${this.url}/admin/users/${e}`,{},{headers:this.headers});return{user:t,data:t,error:null}}catch(t){return{user:null,data:null,error:t}}})}getUser(e){return k(this,void 0,void 0,function*(){try{const t=yield pe(this.fetch,`${this.url}/user`,{headers:this._createRequestHeaders(e)});return{user:t,data:t,error:null}}catch(t){return{user:null,data:null,error:t}}})}updateUser(e,t){return k(this,void 0,void 0,function*(){try{const s=yield Ee(this.fetch,`${this.url}/user`,t,{headers:this._createRequestHeaders(e)});return{user:s,data:s,error:null}}catch(s){return{user:null,data:null,error:s}}})}}function jt(){if(typeof globalThis!="object")try{Object.defineProperty(Object.prototype,"__magic__",{get:function(){return this},configurable:!0}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__}catch{typeof self<"u"&&(self.globalThis=self)}}var S=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(a){return a instanceof t?a:new t(function(l){l(a)})}return new(t||(t=Promise))(function(a,l){function h(o){try{i(s.next(o))}catch(c){l(c)}}function f(o){try{i(s.throw(o))}catch(c){l(c)}}function i(o){o.done?a(o.value):r(o.value).then(h,f)}i((s=s.apply(n,e||[])).next())})};jt();const Ot={url:pt,autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,multiTab:!0,headers:mt},Dt=n=>{try{return atob(n.replace(/[-]/g,"+").replace(/[_]/g,"/"))}catch(e){if(e instanceof ReferenceError)return Buffer.from(n,"base64").toString("utf-8");throw e}};class Bt{constructor(e){this.stateChangeEmitters=new Map,this.networkRetries=0;const t=Object.assign(Object.assign({},Ot),e);this.currentUser=null,this.currentSession=null,this.autoRefreshToken=t.autoRefreshToken,this.persistSession=t.persistSession,this.multiTab=t.multiTab,this.localStorage=t.localStorage||globalThis.localStorage,this.api=new Ft({url:t.url,headers:t.headers,cookieOptions:t.cookieOptions,fetch:t.fetch}),this._recoverSession(),this._recoverAndRefresh(),this._listenForMultiTabEvents(),this._handleVisibilityChange(),t.detectSessionInUrl&&N()&&!!$("access_token")&&this.getSessionFromUrl({storeSession:!0}).then(({error:s})=>{if(s)throw new Error("Error getting session from URL.")})}signUp({email:e,password:t,phone:s},r={}){return S(this,void 0,void 0,function*(){try{this._removeSession();const{data:a,error:l}=s&&t?yield this.api.signUpWithPhone(s,t,{data:r.data,captchaToken:r.captchaToken}):yield this.api.signUpWithEmail(e,t,{redirectTo:r.redirectTo,data:r.data,captchaToken:r.captchaToken});if(l)throw l;if(!a)throw"An error occurred on sign up.";let h=null,f=null;return a.access_token&&(h=a,f=h.user,this._saveSession(h),this._notifyAllSubscribers("SIGNED_IN")),a.id&&(f=a),{user:f,session:h,error:null}}catch(a){return{user:null,session:null,error:a}}})}signIn({email:e,phone:t,password:s,refreshToken:r,provider:a,oidc:l},h={}){return S(this,void 0,void 0,function*(){try{if(this._removeSession(),e&&!s){const{error:f}=yield this.api.sendMagicLinkEmail(e,{redirectTo:h.redirectTo,shouldCreateUser:h.shouldCreateUser,captchaToken:h.captchaToken});return{user:null,session:null,error:f}}if(e&&s)return this._handleEmailSignIn(e,s,{redirectTo:h.redirectTo,captchaToken:h.captchaToken});if(t&&!s){const{error:f}=yield this.api.sendMobileOTP(t,{shouldCreateUser:h.shouldCreateUser,captchaToken:h.captchaToken});return{user:null,session:null,error:f}}if(t&&s)return this._handlePhoneSignIn(t,s);if(r){const{error:f}=yield this._callRefreshToken(r);if(f)throw f;return{user:this.currentUser,session:this.currentSession,error:null}}if(a)return this._handleProviderSignIn(a,{redirectTo:h.redirectTo,scopes:h.scopes,queryParams:h.queryParams});if(l)return this._handleOpenIDConnectSignIn(l);throw new Error("You must provide either an email, phone number, a third-party provider or OpenID Connect.")}catch(f){return{user:null,session:null,error:f}}})}verifyOTP(e,t={}){return S(this,void 0,void 0,function*(){try{this._removeSession();const{data:s,error:r}=yield this.api.verifyOTP(e,t);if(r)throw r;if(!s)throw"An error occurred on token verification.";let a=null,l=null;return s.access_token&&(a=s,l=a.user,this._saveSession(a),this._notifyAllSubscribers("SIGNED_IN")),s.id&&(l=s),{user:l,session:a,error:null}}catch(s){return{user:null,session:null,error:s}}})}user(){return this.currentUser}session(){return this.currentSession}refreshSession(){var e;return S(this,void 0,void 0,function*(){try{if(!(!((e=this.currentSession)===null||e===void 0)&&e.access_token))throw new Error("Not logged in.");const{error:t}=yield this._callRefreshToken();if(t)throw t;return{data:this.currentSession,user:this.currentUser,error:null}}catch(t){return{data:null,user:null,error:t}}})}update(e){var t;return S(this,void 0,void 0,function*(){try{if(!(!((t=this.currentSession)===null||t===void 0)&&t.access_token))throw new Error("Not logged in.");const{user:s,error:r}=yield this.api.updateUser(this.currentSession.access_token,e);if(r)throw r;if(!s)throw Error("Invalid user data.");const a=Object.assign(Object.assign({},this.currentSession),{user:s});return this._saveSession(a),this._notifyAllSubscribers("USER_UPDATED"),{data:s,user:s,error:null}}catch(s){return{data:null,user:null,error:s}}})}setSession(e){return S(this,void 0,void 0,function*(){let t;if(typeof e=="string"){const s=e,{data:r,error:a}=yield this.api.refreshAccessToken(s);if(a)return{session:null,error:a};t=r}else{const s=Math.round(Date.now()/1e3);let{refresh_token:r,access_token:a}=e,l=0,h=0;const f=a.split(".");if(f.length!==3)throw new Error("access_token is not a proper JWT");const i=Dt(f[1]);let o;try{o=JSON.parse(i)}catch{throw new Error("access_token is not a proper JWT, invalid JSON in body")}if(typeof o=="object"&&o&&typeof o.exp=="number")l=o.exp,h=s-o.exp;else throw new Error("access_token is not a proper JWT, missing exp claim");if(s>l){const{data:c,error:d}=yield this.api.refreshAccessToken(r);if(d)return{session:null,error:d};t=c}else{const{user:c,error:d}=yield this.api.getUser(a);if(d)throw d;t={access_token:a,expires_in:h,expires_at:l,refresh_token:r,token_type:"bearer",user:c}}}try{return this._saveSession(t),this._notifyAllSubscribers("SIGNED_IN"),{session:t,error:null}}catch(s){return{error:s,session:null}}})}setAuth(e){return this.currentSession=Object.assign(Object.assign({},this.currentSession),{access_token:e,token_type:"bearer",user:this.user()}),this._notifyAllSubscribers("TOKEN_REFRESHED"),this.currentSession}getSessionFromUrl(e){return S(this,void 0,void 0,function*(){try{if(!N())throw new Error("No browser detected.");const t=$("error_description");if(t)throw new Error(t);const s=$("provider_token"),r=$("provider_refresh_token"),a=$("access_token");if(!a)throw new Error("No access_token detected.");const l=$("expires_in");if(!l)throw new Error("No expires_in detected.");const h=$("refresh_token");if(!h)throw new Error("No refresh_token detected.");const f=$("token_type");if(!f)throw new Error("No token_type detected.");const o=Math.round(Date.now()/1e3)+parseInt(l),{user:c,error:d}=yield this.api.getUser(a);if(d)throw d;const u={provider_token:s,provider_refresh_token:r,access_token:a,expires_in:parseInt(l),expires_at:o,refresh_token:h,token_type:f,user:c};if(e?.storeSession){this._saveSession(u);const p=$("type");this._notifyAllSubscribers("SIGNED_IN"),p==="recovery"&&this._notifyAllSubscribers("PASSWORD_RECOVERY")}return window.location.hash="",{data:u,error:null}}catch(t){return{data:null,error:t}}})}signOut(){var e;return S(this,void 0,void 0,function*(){const t=(e=this.currentSession)===null||e===void 0?void 0:e.access_token;if(this._removeSession(),this._notifyAllSubscribers("SIGNED_OUT"),t){const{error:s}=yield this.api.signOut(t);if(s)return{error:s}}return{error:null}})}onAuthStateChange(e){try{const t=At(),s={id:t,callback:e,unsubscribe:()=>{this.stateChangeEmitters.delete(t)}};return this.stateChangeEmitters.set(t,s),{data:s,error:null}}catch(t){return{data:null,error:t}}}_handleEmailSignIn(e,t,s={}){var r,a;return S(this,void 0,void 0,function*(){try{const{data:l,error:h}=yield this.api.signInWithEmail(e,t,{redirectTo:s.redirectTo,captchaToken:s.captchaToken});return h||!l?{data:null,user:null,session:null,error:h}:((((r=l?.user)===null||r===void 0?void 0:r.confirmed_at)||((a=l?.user)===null||a===void 0?void 0:a.email_confirmed_at))&&(this._saveSession(l),this._notifyAllSubscribers("SIGNED_IN")),{data:l,user:l.user,session:l,error:null})}catch(l){return{data:null,user:null,session:null,error:l}}})}_handlePhoneSignIn(e,t,s={}){var r;return S(this,void 0,void 0,function*(){try{const{data:a,error:l}=yield this.api.signInWithPhone(e,t,s);return l||!a?{data:null,user:null,session:null,error:l}:(!((r=a?.user)===null||r===void 0)&&r.phone_confirmed_at&&(this._saveSession(a),this._notifyAllSubscribers("SIGNED_IN")),{data:a,user:a.user,session:a,error:null})}catch(a){return{data:null,user:null,session:null,error:a}}})}_handleProviderSignIn(e,t={}){const s=this.api.getUrlForProvider(e,{redirectTo:t.redirectTo,scopes:t.scopes,queryParams:t.queryParams});try{return N()&&(window.location.href=s),{provider:e,url:s,data:null,session:null,user:null,error:null}}catch(r){return s?{provider:e,url:s,data:null,session:null,user:null,error:null}:{data:null,user:null,session:null,error:r}}}_handleOpenIDConnectSignIn({id_token:e,nonce:t,client_id:s,issuer:r,provider:a}){return S(this,void 0,void 0,function*(){if(e&&t&&(s&&r||a))try{const{data:l,error:h}=yield this.api.signInWithOpenIDConnect({id_token:e,nonce:t,client_id:s,issuer:r,provider:a});return h||!l?{user:null,session:null,error:h}:(this._saveSession(l),this._notifyAllSubscribers("SIGNED_IN"),{user:l.user,session:l,error:null})}catch(l){return{user:null,session:null,error:l}}throw new Error("You must provide a OpenID Connect provider with your id token and nonce.")})}_recoverSession(){try{const e=Et(this.localStorage,H);if(!e)return null;const{currentSession:t,expiresAt:s}=e,r=Math.round(Date.now()/1e3);s>=r+ee&&t?.user&&(this._saveSession(t),this._notifyAllSubscribers("SIGNED_IN"))}catch(e){console.log("error",e)}}_recoverAndRefresh(){return S(this,void 0,void 0,function*(){try{const e=yield Tt(this.localStorage,H);if(!e)return null;const{currentSession:t,expiresAt:s}=e,r=Math.round(Date.now()/1e3);if(s<r+ee)if(this.autoRefreshToken&&t.refresh_token){this.networkRetries++;const{error:a}=yield this._callRefreshToken(t.refresh_token);if(a){if(console.log(a.message),a.message===M.ERROR_MESSAGE&&this.networkRetries<M.MAX_RETRIES){this.refreshTokenTimer&&clearTimeout(this.refreshTokenTimer),this.refreshTokenTimer=setTimeout(()=>this._recoverAndRefresh(),Math.pow(M.RETRY_INTERVAL,this.networkRetries)*100);return}yield this._removeSession()}this.networkRetries=0}else this._removeSession();else t?(this._saveSession(t),this._notifyAllSubscribers("SIGNED_IN")):(console.log("Current session is missing data."),this._removeSession())}catch(e){return console.error(e),null}})}_callRefreshToken(e){var t;return e===void 0&&(e=(t=this.currentSession)===null||t===void 0?void 0:t.refresh_token),S(this,void 0,void 0,function*(){try{if(!e)throw new Error("No current session.");const{data:s,error:r}=yield this.api.refreshAccessToken(e);if(r)throw r;if(!s)throw Error("Invalid session data.");return this._saveSession(s),this._notifyAllSubscribers("TOKEN_REFRESHED"),this._notifyAllSubscribers("SIGNED_IN"),{data:s,error:null}}catch(s){return{data:null,error:s}}})}_notifyAllSubscribers(e){this.stateChangeEmitters.forEach(t=>t.callback(e,this.currentSession))}_saveSession(e){this.currentSession=e,this.currentUser=e.user;const t=e.expires_at;if(t){const s=Math.round(Date.now()/1e3),r=t-s,a=r>ee?ee:.5;this._startAutoRefreshToken((r-a)*1e3)}this.persistSession&&e.expires_at&&this._persistSession(this.currentSession)}_persistSession(e){const t={currentSession:e,expiresAt:e.expires_at};St(this.localStorage,H,t)}_removeSession(){return S(this,void 0,void 0,function*(){this.currentSession=null,this.currentUser=null,this.refreshTokenTimer&&clearTimeout(this.refreshTokenTimer),Rt(this.localStorage,H)})}_startAutoRefreshToken(e){this.refreshTokenTimer&&clearTimeout(this.refreshTokenTimer),!(e<=0||!this.autoRefreshToken)&&(this.refreshTokenTimer=setTimeout(()=>S(this,void 0,void 0,function*(){this.networkRetries++;const{error:t}=yield this._callRefreshToken();t||(this.networkRetries=0),t?.message===M.ERROR_MESSAGE&&this.networkRetries<M.MAX_RETRIES&&this._startAutoRefreshToken(Math.pow(M.RETRY_INTERVAL,this.networkRetries)*100)}),e),typeof this.refreshTokenTimer.unref=="function"&&this.refreshTokenTimer.unref())}_listenForMultiTabEvents(){if(!this.multiTab||!N()||!window?.addEventListener)return!1;try{window?.addEventListener("storage",e=>{var t;if(e.key===H){const s=JSON.parse(String(e.newValue));!((t=s?.currentSession)===null||t===void 0)&&t.access_token?(this._saveSession(s.currentSession),this._notifyAllSubscribers("SIGNED_IN")):(this._removeSession(),this._notifyAllSubscribers("SIGNED_OUT"))}})}catch(e){console.error("_listenForMultiTabEvents",e)}}_handleVisibilityChange(){if(!this.multiTab||!N()||!window?.addEventListener)return!1;try{window?.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&this._recoverAndRefresh()})}catch(e){console.error("_handleVisibilityChange",e)}}}class $t extends Bt{constructor(e){super(e)}}var Re=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(a){return a instanceof t?a:new t(function(l){l(a)})}return new(t||(t=Promise))(function(a,l){function h(o){try{i(s.next(o))}catch(c){l(c)}}function f(o){try{i(s.throw(o))}catch(c){l(c)}}function i(o){o.done?a(o.value):r(o.value).then(h,f)}i((s=s.apply(n,e||[])).next())})};class ke{constructor(e){Object.assign(this,e);let t;e.fetch?t=e.fetch:typeof fetch>"u"?t=(...s)=>Re(this,void 0,void 0,function*(){return yield(yield T(()=>import("./chunks/browser-ponyfill.f75b33c5.js").then(r=>r.b),["chunks/browser-ponyfill.f75b33c5.js","chunks/index.a0884559.js"])).fetch(...s)}):t=fetch,this.fetch=(...s)=>t(...s),this.shouldThrowOnError=e.shouldThrowOnError||!1,this.allowEmpty=e.allowEmpty||!1}throwOnError(e){return e==null&&(e=!0),this.shouldThrowOnError=e,this}then(e,t){typeof this.schema>"u"||(["GET","HEAD"].includes(this.method)?this.headers["Accept-Profile"]=this.schema:this.headers["Content-Profile"]=this.schema),this.method!=="GET"&&this.method!=="HEAD"&&(this.headers["Content-Type"]="application/json");let s=this.fetch(this.url.toString(),{method:this.method,headers:this.headers,body:JSON.stringify(this.body),signal:this.signal}).then(r=>Re(this,void 0,void 0,function*(){var a,l,h,f;let i=null,o=null,c=null,d=r.status,u=r.statusText;if(r.ok){const g=(a=this.headers.Prefer)===null||a===void 0?void 0:a.split(",").includes("return=minimal");if(this.method!=="HEAD"&&!g){const v=yield r.text();v&&(this.headers.Accept==="text/csv"?o=v:o=JSON.parse(v))}const b=(l=this.headers.Prefer)===null||l===void 0?void 0:l.match(/count=(exact|planned|estimated)/),y=(h=r.headers.get("content-range"))===null||h===void 0?void 0:h.split("/");b&&y&&y.length>1&&(c=parseInt(y[1]))}else{const g=yield r.text();try{i=JSON.parse(g)}catch{i={message:g}}if(i&&this.allowEmpty&&((f=i?.details)===null||f===void 0?void 0:f.includes("Results contain 0 rows"))&&(i=null,d=200,u="OK"),i&&this.shouldThrowOnError)throw i}return{error:i,data:o,count:c,status:d,statusText:u,body:o}}));return this.shouldThrowOnError||(s=s.catch(r=>({error:{message:`FetchError: ${r.message}`,details:"",hint:"",code:r.code||""},data:null,body:null,count:null,status:400,statusText:"Bad Request"}))),s.then(e,t)}}class Nt extends ke{select(e="*"){let t=!1;const s=e.split("").map(r=>/\s/.test(r)&&!t?"":(r==='"'&&(t=!t),r)).join("");return this.url.searchParams.set("select",s),this}order(e,{ascending:t=!0,nullsFirst:s=!1,foreignTable:r}={}){const a=typeof r>"u"?"order":`${r}.order`,l=this.url.searchParams.get(a);return this.url.searchParams.set(a,`${l?`${l},`:""}${e}.${t?"asc":"desc"}.${s?"nullsfirst":"nullslast"}`),this}limit(e,{foreignTable:t}={}){const s=typeof t>"u"?"limit":`${t}.limit`;return this.url.searchParams.set(s,`${e}`),this}range(e,t,{foreignTable:s}={}){const r=typeof s>"u"?"offset":`${s}.offset`,a=typeof s>"u"?"limit":`${s}.limit`;return this.url.searchParams.set(r,`${e}`),this.url.searchParams.set(a,`${t-e+1}`),this}abortSignal(e){return this.signal=e,this}single(){return this.headers.Accept="application/vnd.pgrst.object+json",this}maybeSingle(){return this.headers.Accept="application/vnd.pgrst.object+json",this.allowEmpty=!0,this}csv(){return this.headers.Accept="text/csv",this}}class z extends Nt{constructor(){super(...arguments),this.cs=this.contains,this.cd=this.containedBy,this.sl=this.rangeLt,this.sr=this.rangeGt,this.nxl=this.rangeGte,this.nxr=this.rangeLte,this.adj=this.rangeAdjacent,this.ov=this.overlaps}not(e,t,s){return this.url.searchParams.append(`${e}`,`not.${t}.${s}`),this}or(e,{foreignTable:t}={}){const s=typeof t>"u"?"or":`${t}.or`;return this.url.searchParams.append(s,`(${e})`),this}eq(e,t){return this.url.searchParams.append(`${e}`,`eq.${t}`),this}neq(e,t){return this.url.searchParams.append(`${e}`,`neq.${t}`),this}gt(e,t){return this.url.searchParams.append(`${e}`,`gt.${t}`),this}gte(e,t){return this.url.searchParams.append(`${e}`,`gte.${t}`),this}lt(e,t){return this.url.searchParams.append(`${e}`,`lt.${t}`),this}lte(e,t){return this.url.searchParams.append(`${e}`,`lte.${t}`),this}like(e,t){return this.url.searchParams.append(`${e}`,`like.${t}`),this}ilike(e,t){return this.url.searchParams.append(`${e}`,`ilike.${t}`),this}is(e,t){return this.url.searchParams.append(`${e}`,`is.${t}`),this}in(e,t){const s=t.map(r=>typeof r=="string"&&new RegExp("[,()]").test(r)?`"${r}"`:`${r}`).join(",");return this.url.searchParams.append(`${e}`,`in.(${s})`),this}contains(e,t){return typeof t=="string"?this.url.searchParams.append(`${e}`,`cs.${t}`):Array.isArray(t)?this.url.searchParams.append(`${e}`,`cs.{${t.join(",")}}`):this.url.searchParams.append(`${e}`,`cs.${JSON.stringify(t)}`),this}containedBy(e,t){return typeof t=="string"?this.url.searchParams.append(`${e}`,`cd.${t}`):Array.isArray(t)?this.url.searchParams.append(`${e}`,`cd.{${t.join(",")}}`):this.url.searchParams.append(`${e}`,`cd.${JSON.stringify(t)}`),this}rangeLt(e,t){return this.url.searchParams.append(`${e}`,`sl.${t}`),this}rangeGt(e,t){return this.url.searchParams.append(`${e}`,`sr.${t}`),this}rangeGte(e,t){return this.url.searchParams.append(`${e}`,`nxl.${t}`),this}rangeLte(e,t){return this.url.searchParams.append(`${e}`,`nxr.${t}`),this}rangeAdjacent(e,t){return this.url.searchParams.append(`${e}`,`adj.${t}`),this}overlaps(e,t){return typeof t=="string"?this.url.searchParams.append(`${e}`,`ov.${t}`):this.url.searchParams.append(`${e}`,`ov.{${t.join(",")}}`),this}textSearch(e,t,{config:s,type:r=null}={}){let a="";r==="plain"?a="pl":r==="phrase"?a="ph":r==="websearch"&&(a="w");const l=s===void 0?"":`(${s})`;return this.url.searchParams.append(`${e}`,`${a}fts${l}.${t}`),this}fts(e,t,{config:s}={}){const r=typeof s>"u"?"":`(${s})`;return this.url.searchParams.append(`${e}`,`fts${r}.${t}`),this}plfts(e,t,{config:s}={}){const r=typeof s>"u"?"":`(${s})`;return this.url.searchParams.append(`${e}`,`plfts${r}.${t}`),this}phfts(e,t,{config:s}={}){const r=typeof s>"u"?"":`(${s})`;return this.url.searchParams.append(`${e}`,`phfts${r}.${t}`),this}wfts(e,t,{config:s}={}){const r=typeof s>"u"?"":`(${s})`;return this.url.searchParams.append(`${e}`,`wfts${r}.${t}`),this}filter(e,t,s){return this.url.searchParams.append(`${e}`,`${t}.${s}`),this}match(e){return Object.keys(e).forEach(t=>{this.url.searchParams.append(`${t}`,`eq.${e[t]}`)}),this}}class Ne extends ke{constructor(e,{headers:t={},schema:s,fetch:r,shouldThrowOnError:a}={}){super({fetch:r,shouldThrowOnError:a}),this.url=new URL(e),this.headers=Object.assign({},t),this.schema=s}select(e="*",{head:t=!1,count:s=null}={}){this.method="GET";let r=!1;const a=e.split("").map(l=>/\s/.test(l)&&!r?"":(l==='"'&&(r=!r),l)).join("");return this.url.searchParams.set("select",a),s&&(this.headers.Prefer=`count=${s}`),t&&(this.method="HEAD"),new z(this)}insert(e,{upsert:t=!1,onConflict:s,returning:r="representation",count:a=null}={}){this.method="POST";const l=[`return=${r}`];if(t&&l.push("resolution=merge-duplicates"),t&&s!==void 0&&this.url.searchParams.set("on_conflict",s),this.body=e,a&&l.push(`count=${a}`),this.headers.Prefer&&l.unshift(this.headers.Prefer),this.headers.Prefer=l.join(","),Array.isArray(e)){const h=e.reduce((f,i)=>f.concat(Object.keys(i)),[]);if(h.length>0){const f=[...new Set(h)].map(i=>`"${i}"`);this.url.searchParams.set("columns",f.join(","))}}return new z(this)}upsert(e,{onConflict:t,returning:s="representation",count:r=null,ignoreDuplicates:a=!1}={}){this.method="POST";const l=[`resolution=${a?"ignore":"merge"}-duplicates`,`return=${s}`];return t!==void 0&&this.url.searchParams.set("on_conflict",t),this.body=e,r&&l.push(`count=${r}`),this.headers.Prefer&&l.unshift(this.headers.Prefer),this.headers.Prefer=l.join(","),new z(this)}update(e,{returning:t="representation",count:s=null}={}){this.method="PATCH";const r=[`return=${t}`];return this.body=e,s&&r.push(`count=${s}`),this.headers.Prefer&&r.unshift(this.headers.Prefer),this.headers.Prefer=r.join(","),new z(this)}delete({returning:e="representation",count:t=null}={}){this.method="DELETE";const s=[`return=${e}`];return t&&s.push(`count=${t}`),this.headers.Prefer&&s.unshift(this.headers.Prefer),this.headers.Prefer=s.join(","),new z(this)}}class It extends ke{constructor(e,{headers:t={},schema:s,fetch:r,shouldThrowOnError:a}={}){super({fetch:r,shouldThrowOnError:a}),this.url=new URL(e),this.headers=Object.assign({},t),this.schema=s}rpc(e,{head:t=!1,count:s=null}={}){return t?(this.method="HEAD",e&&Object.entries(e).forEach(([r,a])=>{this.url.searchParams.append(r,a)})):(this.method="POST",this.body=e),s&&(this.headers.Prefer!==void 0?this.headers.Prefer+=`,count=${s}`:this.headers.Prefer=`count=${s}`),new z(this)}}const Pt="0.37.4",Gt={"X-Client-Info":`postgrest-js/${Pt}`};class Mt{constructor(e,{headers:t={},schema:s,fetch:r,throwOnError:a}={}){this.url=e,this.headers=Object.assign(Object.assign({},Gt),t),this.schema=s,this.fetch=r,this.shouldThrowOnError=a}auth(e){return this.headers.Authorization=`Bearer ${e}`,this}from(e){const t=`${this.url}/${e}`;return new Ne(t,{headers:this.headers,schema:this.schema,fetch:this.fetch,shouldThrowOnError:this.shouldThrowOnError})}rpc(e,t,{head:s=!1,count:r=null}={}){const a=`${this.url}/rpc/${e}`;return new It(a,{headers:this.headers,schema:this.schema,fetch:this.fetch,shouldThrowOnError:this.shouldThrowOnError}).rpc(t,{head:s,count:r})}}var x;(function(n){n.abstime="abstime",n.bool="bool",n.date="date",n.daterange="daterange",n.float4="float4",n.float8="float8",n.int2="int2",n.int4="int4",n.int4range="int4range",n.int8="int8",n.int8range="int8range",n.json="json",n.jsonb="jsonb",n.money="money",n.numeric="numeric",n.oid="oid",n.reltime="reltime",n.text="text",n.time="time",n.timestamp="timestamp",n.timestamptz="timestamptz",n.timetz="timetz",n.tsrange="tsrange",n.tstzrange="tstzrange"})(x||(x={}));const Fe=(n,e,t={})=>{var s;const r=(s=t.skipTypes)!==null&&s!==void 0?s:[];return Object.keys(e).reduce((a,l)=>(a[l]=Ut(l,n,e,r),a),{})},Ut=(n,e,t,s)=>{const r=e.find(h=>h.name===n),a=r?.type,l=t[n];return a&&!s.includes(a)?Ie(a,l):ye(l)},Ie=(n,e)=>{if(n.charAt(0)==="_"){const t=n.slice(1,n.length);return zt(e,t)}switch(n){case x.bool:return Lt(e);case x.float4:case x.float8:case x.int2:case x.int4:case x.int8:case x.numeric:case x.oid:return Wt(e);case x.json:case x.jsonb:return qt(e);case x.timestamp:return Ht(e);case x.abstime:case x.date:case x.daterange:case x.int4range:case x.int8range:case x.money:case x.reltime:case x.text:case x.time:case x.timestamptz:case x.timetz:case x.tsrange:case x.tstzrange:return ye(e);default:return ye(e)}},ye=n=>n,Lt=n=>{switch(n){case"t":return!0;case"f":return!1;default:return n}},Wt=n=>{if(typeof n=="string"){const e=parseFloat(n);if(!Number.isNaN(e))return e}return n},qt=n=>{if(typeof n=="string")try{return JSON.parse(n)}catch(e){return console.log(`JSON parse error: ${e}`),n}return n},zt=(n,e)=>{if(typeof n!="string")return n;const t=n.length-1,s=n[t];if(n[0]==="{"&&s==="}"){let a;const l=n.slice(1,t);try{a=JSON.parse("["+l+"]")}catch{a=l?l.split(","):[]}return a.map(h=>Ie(e,h))}return n},Ht=n=>typeof n=="string"?n.replace(" ","T"):n;var me,je;function Jt(){if(je)return me;je=1;var n=function(){if(typeof self=="object"&&self)return self;if(typeof window=="object"&&window)return window;throw new Error("Unable to resolve global `this`")};return me=function(){if(this)return this;if(typeof globalThis=="object"&&globalThis)return globalThis;try{Object.defineProperty(Object.prototype,"__global__",{get:function(){return this},configurable:!0})}catch{return n()}try{return __global__||n()}finally{delete Object.prototype.__global__}}(),me}const Yt="websocket",Vt="Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",Kt=["websocket","websockets","socket","networking","comet","push","RFC-6455","realtime","server","client"],Xt="Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)",Qt=["I\xF1aki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"],Zt="1.0.34",es={type:"git",url:"https://github.com/theturtle32/WebSocket-Node.git"},ts="https://github.com/theturtle32/WebSocket-Node",ss={node:">=4.0.0"},rs={bufferutil:"^4.0.1",debug:"^2.2.0","es5-ext":"^0.10.50","typedarray-to-buffer":"^3.1.5","utf-8-validate":"^5.0.2",yaeti:"^0.0.6"},ns={"buffer-equal":"^1.0.0",gulp:"^4.0.2","gulp-jshint":"^2.0.4","jshint-stylish":"^2.2.1",jshint:"^2.0.0",tape:"^4.9.1"},is={verbose:!1},os={test:"tape test/unit/*.js",gulp:"gulp"},as="index",ls={lib:"./lib"},cs="lib/browser.js",hs="Apache-2.0",us={name:Yt,description:Vt,keywords:Kt,author:Xt,contributors:Qt,version:Zt,repository:es,homepage:ts,engines:ss,dependencies:rs,devDependencies:ns,config:is,scripts:os,main:as,directories:ls,browser:cs,license:hs};var ds=us.version,U;if(typeof globalThis=="object")U=globalThis;else try{U=Jt()}catch{}finally{if(!U&&typeof window<"u"&&(U=window),!U)throw new Error("Could not determine global this")}var V=U.WebSocket||U.MozWebSocket,fs=ds;function Pe(n,e){var t;return e?t=new V(n,e):t=new V(n),t}V&&["CONNECTING","OPEN","CLOSING","CLOSED"].forEach(function(n){Object.defineProperty(Pe,n,{get:function(){return V[n]}})});var ps={w3cwebsocket:V?Pe:null,version:fs};const ms="1.7.5",gs={"X-Client-Info":`realtime-js/${ms}`},bs="1.0.0",Ge=1e4,vs=1e3;var Y;(function(n){n[n.connecting=0]="connecting",n[n.open=1]="open",n[n.closing=2]="closing",n[n.closed=3]="closed"})(Y||(Y={}));var E;(function(n){n.closed="closed",n.errored="errored",n.joined="joined",n.joining="joining",n.leaving="leaving"})(E||(E={}));var j;(function(n){n.close="phx_close",n.error="phx_error",n.join="phx_join",n.reply="phx_reply",n.leave="phx_leave",n.access_token="access_token"})(j||(j={}));var we;(function(n){n.websocket="websocket"})(we||(we={}));var L;(function(n){n.Connecting="connecting",n.Open="open",n.Closing="closing",n.Closed="closed"})(L||(L={}));class Me{constructor(e,t){this.callback=e,this.timerCalc=t,this.timer=void 0,this.tries=0,this.callback=e,this.timerCalc=t}reset(){this.tries=0,clearTimeout(this.timer)}scheduleTimeout(){clearTimeout(this.timer),this.timer=setTimeout(()=>{this.tries=this.tries+1,this.callback()},this.timerCalc(this.tries+1))}}class ys{constructor(){this.HEADER_LENGTH=1}decode(e,t){return e.constructor===ArrayBuffer?t(this._binaryDecode(e)):t(typeof e=="string"?JSON.parse(e):{})}_binaryDecode(e){const t=new DataView(e),s=new TextDecoder;return this._decodeBroadcast(e,t,s)}_decodeBroadcast(e,t,s){const r=t.getUint8(1),a=t.getUint8(2);let l=this.HEADER_LENGTH+2;const h=s.decode(e.slice(l,l+r));l=l+r;const f=s.decode(e.slice(l,l+a));l=l+a;const i=JSON.parse(s.decode(e.slice(l,e.byteLength)));return{ref:null,topic:h,event:f,payload:i}}}class ge{constructor(e,t,s={},r=Ge){this.channel=e,this.event=t,this.payload=s,this.timeout=r,this.sent=!1,this.timeoutTimer=void 0,this.ref="",this.receivedResp=null,this.recHooks=[],this.refEvent=null}resend(e){this.timeout=e,this._cancelRefEvent(),this.ref="",this.refEvent=null,this.receivedResp=null,this.sent=!1,this.send()}send(){this._hasReceived("timeout")||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload,ref:this.ref,join_ref:this.channel.joinRef()}))}updatePayload(e){this.payload=Object.assign(Object.assign({},this.payload),e)}receive(e,t){var s;return this._hasReceived(e)&&t((s=this.receivedResp)===null||s===void 0?void 0:s.response),this.recHooks.push({status:e,callback:t}),this}startTimeout(){if(this.timeoutTimer)return;this.ref=this.channel.socket.makeRef(),this.refEvent=this.channel.replyEventName(this.ref);const e=t=>{this._cancelRefEvent(),this._cancelTimeout(),this.receivedResp=t,this._matchReceive(t)};this.channel.on(this.refEvent,e),this.timeoutTimer=setTimeout(()=>{this.trigger("timeout",{})},this.timeout)}trigger(e,t){this.refEvent&&this.channel.trigger(this.refEvent,{status:e,response:t})}destroy(){this._cancelRefEvent(),this._cancelTimeout()}_cancelRefEvent(){!this.refEvent||this.channel.off(this.refEvent)}_cancelTimeout(){clearTimeout(this.timeoutTimer),this.timeoutTimer=void 0}_matchReceive({status:e,response:t}){this.recHooks.filter(s=>s.status===e).forEach(s=>s.callback(t))}_hasReceived(e){return this.receivedResp&&this.receivedResp.status===e}}class xs{constructor(e,t={},s){this.topic=e,this.params=t,this.socket=s,this.bindings=[],this.state=E.closed,this.joinedOnce=!1,this.pushBuffer=[],this.timeout=this.socket.timeout,this.joinPush=new ge(this,j.join,this.params,this.timeout),this.rejoinTimer=new Me(()=>this.rejoinUntilConnected(),this.socket.reconnectAfterMs),this.joinPush.receive("ok",()=>{this.state=E.joined,this.rejoinTimer.reset(),this.pushBuffer.forEach(r=>r.send()),this.pushBuffer=[]}),this.onClose(()=>{this.rejoinTimer.reset(),this.socket.log("channel",`close ${this.topic} ${this.joinRef()}`),this.state=E.closed,this.socket.remove(this)}),this.onError(r=>{this.isLeaving()||this.isClosed()||(this.socket.log("channel",`error ${this.topic}`,r),this.state=E.errored,this.rejoinTimer.scheduleTimeout())}),this.joinPush.receive("timeout",()=>{!this.isJoining()||(this.socket.log("channel",`timeout ${this.topic}`,this.joinPush.timeout),this.state=E.errored,this.rejoinTimer.scheduleTimeout())}),this.on(j.reply,(r,a)=>{this.trigger(this.replyEventName(a),r)})}rejoinUntilConnected(){this.rejoinTimer.scheduleTimeout(),this.socket.isConnected()&&this.rejoin()}subscribe(e=this.timeout){if(this.joinedOnce)throw"tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance";return this.joinedOnce=!0,this.rejoin(e),this.joinPush}onClose(e){this.on(j.close,e)}onError(e){this.on(j.error,t=>e(t))}on(e,t){this.bindings.push({event:e,callback:t})}off(e){this.bindings=this.bindings.filter(t=>t.event!==e)}canPush(){return this.socket.isConnected()&&this.isJoined()}push(e,t,s=this.timeout){if(!this.joinedOnce)throw`tried to push '${e}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;let r=new ge(this,e,t,s);return this.canPush()?r.send():(r.startTimeout(),this.pushBuffer.push(r)),r}updateJoinPayload(e){this.joinPush.updatePayload(e)}unsubscribe(e=this.timeout){this.state=E.leaving;let t=()=>{this.socket.log("channel",`leave ${this.topic}`),this.trigger(j.close,"leave",this.joinRef())};this.joinPush.destroy();let s=new ge(this,j.leave,{},e);return s.receive("ok",()=>t()).receive("timeout",()=>t()),s.send(),this.canPush()||s.trigger("ok",{}),s}onMessage(e,t,s){return t}isMember(e){return this.topic===e}joinRef(){return this.joinPush.ref}rejoin(e=this.timeout){this.isLeaving()||(this.socket.leaveOpenTopic(this.topic),this.state=E.joining,this.joinPush.resend(e))}trigger(e,t,s){let{close:r,error:a,leave:l,join:h}=j;if(s&&[r,a,l,h].indexOf(e)>=0&&s!==this.joinRef())return;let i=this.onMessage(e,t,s);if(t&&!i)throw"channel onMessage callbacks must return the payload, modified or unmodified";this.bindings.filter(o=>o.event==="*"?e===t?.type:o.event===e).map(o=>o.callback(i,s))}replyEventName(e){return`chan_reply_${e}`}isClosed(){return this.state===E.closed}isErrored(){return this.state===E.errored}isJoined(){return this.state===E.joined}isJoining(){return this.state===E.joining}isLeaving(){return this.state===E.leaving}}var _s=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(a){return a instanceof t?a:new t(function(l){l(a)})}return new(t||(t=Promise))(function(a,l){function h(o){try{i(s.next(o))}catch(c){l(c)}}function f(o){try{i(s.throw(o))}catch(c){l(c)}}function i(o){o.done?a(o.value):r(o.value).then(h,f)}i((s=s.apply(n,e||[])).next())})};const ks=()=>{};class As{constructor(e,t){this.accessToken=null,this.channels=[],this.endPoint="",this.headers=gs,this.params={},this.timeout=Ge,this.transport=ps.w3cwebsocket,this.heartbeatIntervalMs=3e4,this.longpollerTimeout=2e4,this.heartbeatTimer=void 0,this.pendingHeartbeatRef=null,this.ref=0,this.logger=ks,this.conn=null,this.sendBuffer=[],this.serializer=new ys,this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.endPoint=`${e}/${we.websocket}`,t?.params&&(this.params=t.params),t?.headers&&(this.headers=Object.assign(Object.assign({},this.headers),t.headers)),t?.timeout&&(this.timeout=t.timeout),t?.logger&&(this.logger=t.logger),t?.transport&&(this.transport=t.transport),t?.heartbeatIntervalMs&&(this.heartbeatIntervalMs=t.heartbeatIntervalMs),t?.longpollerTimeout&&(this.longpollerTimeout=t.longpollerTimeout),this.reconnectAfterMs=t?.reconnectAfterMs?t.reconnectAfterMs:s=>[1e3,2e3,5e3,1e4][s-1]||1e4,this.encode=t?.encode?t.encode:(s,r)=>r(JSON.stringify(s)),this.decode=t?.decode?t.decode:this.serializer.decode.bind(this.serializer),this.reconnectTimer=new Me(()=>_s(this,void 0,void 0,function*(){yield this.disconnect(),this.connect()}),this.reconnectAfterMs)}connect(){this.conn||(this.conn=new this.transport(this.endPointURL(),[],null,this.headers),this.conn&&(this.conn.binaryType="arraybuffer",this.conn.onopen=()=>this._onConnOpen(),this.conn.onerror=e=>this._onConnError(e),this.conn.onmessage=e=>this.onConnMessage(e),this.conn.onclose=e=>this._onConnClose(e)))}disconnect(e,t){return new Promise((s,r)=>{try{this.conn&&(this.conn.onclose=function(){},e?this.conn.close(e,t||""):this.conn.close(),this.conn=null,this.heartbeatTimer&&clearInterval(this.heartbeatTimer),this.reconnectTimer.reset()),s({error:null,data:!0})}catch(a){s({error:a,data:!1})}})}log(e,t,s){this.logger(e,t,s)}onOpen(e){this.stateChangeCallbacks.open.push(e)}onClose(e){this.stateChangeCallbacks.close.push(e)}onError(e){this.stateChangeCallbacks.error.push(e)}onMessage(e){this.stateChangeCallbacks.message.push(e)}connectionState(){switch(this.conn&&this.conn.readyState){case Y.connecting:return L.Connecting;case Y.open:return L.Open;case Y.closing:return L.Closing;default:return L.Closed}}isConnected(){return this.connectionState()===L.Open}remove(e){this.channels=this.channels.filter(t=>t.joinRef()!==e.joinRef())}channel(e,t={}){const s=new xs(e,t,this);return this.channels.push(s),s}push(e){const{topic:t,event:s,payload:r,ref:a}=e;let l=()=>{this.encode(e,h=>{var f;(f=this.conn)===null||f===void 0||f.send(h)})};this.log("push",`${t} ${s} (${a})`,r),this.isConnected()?l():this.sendBuffer.push(l)}onConnMessage(e){this.decode(e.data,t=>{let{topic:s,event:r,payload:a,ref:l}=t;(l&&l===this.pendingHeartbeatRef||r===a?.type)&&(this.pendingHeartbeatRef=null),this.log("receive",`${a.status||""} ${s} ${r} ${l&&"("+l+")"||""}`,a),this.channels.filter(h=>h.isMember(s)).forEach(h=>h.trigger(r,a,l)),this.stateChangeCallbacks.message.forEach(h=>h(t))})}endPointURL(){return this._appendParams(this.endPoint,Object.assign({},this.params,{vsn:bs}))}makeRef(){let e=this.ref+1;return e===this.ref?this.ref=0:this.ref=e,this.ref.toString()}setAuth(e){this.accessToken=e,this.channels.forEach(t=>{e&&t.updateJoinPayload({user_token:e}),t.joinedOnce&&t.isJoined()&&t.push(j.access_token,{access_token:e})})}leaveOpenTopic(e){let t=this.channels.find(s=>s.topic===e&&(s.isJoined()||s.isJoining()));t&&(this.log("transport",`leaving duplicate topic "${e}"`),t.unsubscribe())}_onConnOpen(){this.log("transport",`connected to ${this.endPointURL()}`),this._flushSendBuffer(),this.reconnectTimer.reset(),this.heartbeatTimer&&clearInterval(this.heartbeatTimer),this.heartbeatTimer=setInterval(()=>this._sendHeartbeat(),this.heartbeatIntervalMs),this.stateChangeCallbacks.open.forEach(e=>e())}_onConnClose(e){this.log("transport","close",e),this._triggerChanError(),this.heartbeatTimer&&clearInterval(this.heartbeatTimer),this.reconnectTimer.scheduleTimeout(),this.stateChangeCallbacks.close.forEach(t=>t(e))}_onConnError(e){this.log("transport",e.message),this._triggerChanError(),this.stateChangeCallbacks.error.forEach(t=>t(e))}_triggerChanError(){this.channels.forEach(e=>e.trigger(j.error))}_appendParams(e,t){if(Object.keys(t).length===0)return e;const s=e.match(/\?/)?"&":"?",r=new URLSearchParams(t);return`${e}${s}${r}`}_flushSendBuffer(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(e=>e()),this.sendBuffer=[])}_sendHeartbeat(){var e;if(!!this.isConnected()){if(this.pendingHeartbeatRef){this.pendingHeartbeatRef=null,this.log("transport","heartbeat timeout. Attempting to re-establish connection"),(e=this.conn)===null||e===void 0||e.close(vs,"hearbeat timeout");return}this.pendingHeartbeatRef=this.makeRef(),this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:this.pendingHeartbeatRef}),this.setAuth(this.accessToken)}}}class Cs{constructor(e,t,s,r){const a={},l=r==="*"?`realtime:${s}`:`realtime:${s}:${r}`,h=t.Authorization.split(" ")[1];h&&(a.user_token=h),this.subscription=e.channel(l,a)}getPayloadRecords(e){const t={new:{},old:{}};return(e.type==="INSERT"||e.type==="UPDATE")&&(t.new=Fe(e.columns,e.record)),(e.type==="UPDATE"||e.type==="DELETE")&&(t.old=Fe(e.columns,e.old_record)),t}on(e,t){return this.subscription.on(e,s=>{let r={schema:s.schema,table:s.table,commit_timestamp:s.commit_timestamp,eventType:s.type,new:{},old:{},errors:s.errors};r=Object.assign(Object.assign({},r),this.getPayloadRecords(s)),t(r)}),this}subscribe(e=()=>{}){return this.subscription.onError(t=>e("SUBSCRIPTION_ERROR",t)),this.subscription.onClose(()=>e("CLOSED")),this.subscription.subscribe().receive("ok",()=>e("SUBSCRIBED")).receive("error",t=>e("SUBSCRIPTION_ERROR",t)).receive("timeout",()=>e("RETRYING_AFTER_TIMEOUT")),this.subscription}}class Ss extends Ne{constructor(e,{headers:t={},schema:s,realtime:r,table:a,fetch:l,shouldThrowOnError:h}){super(e,{headers:t,schema:s,fetch:l,shouldThrowOnError:h}),this._subscription=null,this._realtime=r,this._headers=t,this._schema=s,this._table=a}on(e,t){return this._realtime.isConnected()||this._realtime.connect(),this._subscription||(this._subscription=new Cs(this._realtime,this._headers,this._schema,this._table)),this._subscription.on(e,t)}}const Ts="1.7.3",Es={"X-Client-Info":`storage-js/${Ts}`};var X=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(a){return a instanceof t?a:new t(function(l){l(a)})}return new(t||(t=Promise))(function(a,l){function h(o){try{i(s.next(o))}catch(c){l(c)}}function f(o){try{i(s.throw(o))}catch(c){l(c)}}function i(o){o.done?a(o.value):r(o.value).then(h,f)}i((s=s.apply(n,e||[])).next())})};const Rs=n=>n.msg||n.message||n.error_description||n.error||JSON.stringify(n),Fs=(n,e)=>{if(typeof n.json!="function")return e(n);n.json().then(t=>e({message:Rs(t),status:n?.status||500}))},js=(n,e,t,s)=>{const r={method:n,headers:e?.headers||{}};return n==="GET"?r:(r.headers=Object.assign({"Content-Type":"application/json"},e?.headers),r.body=JSON.stringify(s),Object.assign(Object.assign({},r),t))};function he(n,e,t,s,r,a){return X(this,void 0,void 0,function*(){return new Promise((l,h)=>{n(t,js(e,s,r,a)).then(f=>{if(!f.ok)throw f;return s?.noResolveJson?l(f):f.json()}).then(f=>l(f)).catch(f=>Fs(f,h))})})}function xe(n,e,t,s){return X(this,void 0,void 0,function*(){return he(n,"GET",e,t,s)})}function W(n,e,t,s,r){return X(this,void 0,void 0,function*(){return he(n,"POST",e,s,r,t)})}function Os(n,e,t,s,r){return X(this,void 0,void 0,function*(){return he(n,"PUT",e,s,r,t)})}function Ue(n,e,t,s,r){return X(this,void 0,void 0,function*(){return he(n,"DELETE",e,s,r,t)})}var Ds=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(a){return a instanceof t?a:new t(function(l){l(a)})}return new(t||(t=Promise))(function(a,l){function h(o){try{i(s.next(o))}catch(c){l(c)}}function f(o){try{i(s.throw(o))}catch(c){l(c)}}function i(o){o.done?a(o.value):r(o.value).then(h,f)}i((s=s.apply(n,e||[])).next())})};const Le=n=>{let e;return n?e=n:typeof fetch>"u"?e=(...t)=>Ds(void 0,void 0,void 0,function*(){return yield(yield T(()=>import("./chunks/browser-ponyfill.f75b33c5.js").then(s=>s.b),["chunks/browser-ponyfill.f75b33c5.js","chunks/index.a0884559.js"])).fetch(...t)}):e=fetch,(...t)=>e(...t)};var q=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(a){return a instanceof t?a:new t(function(l){l(a)})}return new(t||(t=Promise))(function(a,l){function h(o){try{i(s.next(o))}catch(c){l(c)}}function f(o){try{i(s.throw(o))}catch(c){l(c)}}function i(o){o.done?a(o.value):r(o.value).then(h,f)}i((s=s.apply(n,e||[])).next())})};class Bs{constructor(e,t={},s){this.url=e,this.headers=Object.assign(Object.assign({},Es),t),this.fetch=Le(s)}listBuckets(){return q(this,void 0,void 0,function*(){try{return{data:yield xe(this.fetch,`${this.url}/bucket`,{headers:this.headers}),error:null}}catch(e){return{data:null,error:e}}})}getBucket(e){return q(this,void 0,void 0,function*(){try{return{data:yield xe(this.fetch,`${this.url}/bucket/${e}`,{headers:this.headers}),error:null}}catch(t){return{data:null,error:t}}})}createBucket(e,t={public:!1}){return q(this,void 0,void 0,function*(){try{return{data:(yield W(this.fetch,`${this.url}/bucket`,{id:e,name:e,public:t.public},{headers:this.headers})).name,error:null}}catch(s){return{data:null,error:s}}})}updateBucket(e,t){return q(this,void 0,void 0,function*(){try{return{data:yield Os(this.fetch,`${this.url}/bucket/${e}`,{id:e,name:e,public:t.public},{headers:this.headers}),error:null}}catch(s){return{data:null,error:s}}})}emptyBucket(e){return q(this,void 0,void 0,function*(){try{return{data:yield W(this.fetch,`${this.url}/bucket/${e}/empty`,{},{headers:this.headers}),error:null}}catch(t){return{data:null,error:t}}})}deleteBucket(e){return q(this,void 0,void 0,function*(){try{return{data:yield Ue(this.fetch,`${this.url}/bucket/${e}`,{},{headers:this.headers}),error:null}}catch(t){return{data:null,error:t}}})}}var O=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(a){return a instanceof t?a:new t(function(l){l(a)})}return new(t||(t=Promise))(function(a,l){function h(o){try{i(s.next(o))}catch(c){l(c)}}function f(o){try{i(s.throw(o))}catch(c){l(c)}}function i(o){o.done?a(o.value):r(o.value).then(h,f)}i((s=s.apply(n,e||[])).next())})};const $s={limit:100,offset:0,sortBy:{column:"name",order:"asc"}},Ns={cacheControl:"3600",contentType:"text/plain;charset=UTF-8",upsert:!1};class Is{constructor(e,t={},s,r){this.url=e,this.headers=t,this.bucketId=s,this.fetch=Le(r)}uploadOrUpdate(e,t,s,r){return O(this,void 0,void 0,function*(){try{let a;const l=Object.assign(Object.assign({},Ns),r),h=Object.assign(Object.assign({},this.headers),e==="POST"&&{"x-upsert":String(l.upsert)});typeof Blob<"u"&&s instanceof Blob?(a=new FormData,a.append("cacheControl",l.cacheControl),a.append("",s)):typeof FormData<"u"&&s instanceof FormData?(a=s,a.append("cacheControl",l.cacheControl)):(a=s,h["cache-control"]=`max-age=${l.cacheControl}`,h["content-type"]=l.contentType);const f=this._removeEmptyFolders(t),i=this._getFinalPath(f),o=yield this.fetch(`${this.url}/object/${i}`,{method:e,body:a,headers:h});return o.ok?{data:{Key:i},error:null}:{data:null,error:yield o.json()}}catch(a){return{data:null,error:a}}})}upload(e,t,s){return O(this,void 0,void 0,function*(){return this.uploadOrUpdate("POST",e,t,s)})}update(e,t,s){return O(this,void 0,void 0,function*(){return this.uploadOrUpdate("PUT",e,t,s)})}move(e,t){return O(this,void 0,void 0,function*(){try{return{data:yield W(this.fetch,`${this.url}/object/move`,{bucketId:this.bucketId,sourceKey:e,destinationKey:t},{headers:this.headers}),error:null}}catch(s){return{data:null,error:s}}})}copy(e,t){return O(this,void 0,void 0,function*(){try{return{data:yield W(this.fetch,`${this.url}/object/copy`,{bucketId:this.bucketId,sourceKey:e,destinationKey:t},{headers:this.headers}),error:null}}catch(s){return{data:null,error:s}}})}createSignedUrl(e,t){return O(this,void 0,void 0,function*(){try{const s=this._getFinalPath(e);let r=yield W(this.fetch,`${this.url}/object/sign/${s}`,{expiresIn:t},{headers:this.headers});const a=`${this.url}${r.signedURL}`;return r={signedURL:a},{data:r,error:null,signedURL:a}}catch(s){return{data:null,error:s,signedURL:null}}})}createSignedUrls(e,t){return O(this,void 0,void 0,function*(){try{return{data:(yield W(this.fetch,`${this.url}/object/sign/${this.bucketId}`,{expiresIn:t,paths:e},{headers:this.headers})).map(r=>Object.assign(Object.assign({},r),{signedURL:r.signedURL?`${this.url}${r.signedURL}`:null})),error:null}}catch(s){return{data:null,error:s}}})}download(e){return O(this,void 0,void 0,function*(){try{const t=this._getFinalPath(e);return{data:yield(yield xe(this.fetch,`${this.url}/object/${t}`,{headers:this.headers,noResolveJson:!0})).blob(),error:null}}catch(t){return{data:null,error:t}}})}getPublicUrl(e){try{const t=this._getFinalPath(e),s=`${this.url}/object/public/${t}`;return{data:{publicURL:s},error:null,publicURL:s}}catch(t){return{data:null,error:t,publicURL:null}}}remove(e){return O(this,void 0,void 0,function*(){try{return{data:yield Ue(this.fetch,`${this.url}/object/${this.bucketId}`,{prefixes:e},{headers:this.headers}),error:null}}catch(t){return{data:null,error:t}}})}list(e,t,s){return O(this,void 0,void 0,function*(){try{const r=Object.assign(Object.assign(Object.assign({},$s),t),{prefix:e||""});return{data:yield W(this.fetch,`${this.url}/object/list/${this.bucketId}`,r,{headers:this.headers},s),error:null}}catch(r){return{data:null,error:r}}})}_getFinalPath(e){return`${this.bucketId}/${e}`}_removeEmptyFolders(e){return e.replace(/^\/|\/$/g,"").replace(/\/+/g,"/")}}class Ps extends Bs{constructor(e,t={},s){super(e,t,s)}from(e){return new Is(this.url,this.headers,e,this.fetch)}}var Gs=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(a){return a instanceof t?a:new t(function(l){l(a)})}return new(t||(t=Promise))(function(a,l){function h(o){try{i(s.next(o))}catch(c){l(c)}}function f(o){try{i(s.throw(o))}catch(c){l(c)}}function i(o){o.done?a(o.value):r(o.value).then(h,f)}i((s=s.apply(n,e||[])).next())})};const Ms=n=>{let e;return n?e=n:typeof fetch>"u"?e=(...t)=>Gs(void 0,void 0,void 0,function*(){return yield(yield T(()=>import("./chunks/browser-ponyfill.f75b33c5.js").then(s=>s.b),["chunks/browser-ponyfill.f75b33c5.js","chunks/index.a0884559.js"])).fetch(...t)}):e=fetch,(...t)=>e(...t)};var Us=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(a){return a instanceof t?a:new t(function(l){l(a)})}return new(t||(t=Promise))(function(a,l){function h(o){try{i(s.next(o))}catch(c){l(c)}}function f(o){try{i(s.throw(o))}catch(c){l(c)}}function i(o){o.done?a(o.value):r(o.value).then(h,f)}i((s=s.apply(n,e||[])).next())})};class Ls{constructor(e,{headers:t={},customFetch:s}={}){this.url=e,this.headers=t,this.fetch=Ms(s)}setAuth(e){this.headers.Authorization=`Bearer ${e}`}invoke(e,t){return Us(this,void 0,void 0,function*(){try{const{headers:s,body:r}=t??{},a=yield this.fetch(`${this.url}/${e}`,{method:"POST",headers:Object.assign({},this.headers,s),body:r}),l=a.headers.get("x-relay-error");if(l&&l==="true")return{data:null,error:new Error(yield a.text())};let h;const{responseType:f}=t??{};return!f||f==="json"?h=yield a.json():f==="arrayBuffer"?h=yield a.arrayBuffer():f==="blob"?h=yield a.blob():h=yield a.text(),{data:h,error:null}}catch(s){return{data:null,error:s}}})}}var be=globalThis&&globalThis.__awaiter||function(n,e,t,s){function r(a){return a instanceof t?a:new t(function(l){l(a)})}return new(t||(t=Promise))(function(a,l){function h(o){try{i(s.next(o))}catch(c){l(c)}}function f(o){try{i(s.throw(o))}catch(c){l(c)}}function i(o){o.done?a(o.value):r(o.value).then(h,f)}i((s=s.apply(n,e||[])).next())})};const Ws={schema:"public",autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,multiTab:!0,headers:$e};class qs{constructor(e,t,s){if(this.supabaseUrl=e,this.supabaseKey=t,!e)throw new Error("supabaseUrl is required.");if(!t)throw new Error("supabaseKey is required.");const r=ut(e),a=Object.assign(Object.assign({},Ws),s);if(this.restUrl=`${r}/rest/v1`,this.realtimeUrl=`${r}/realtime/v1`.replace("http","ws"),this.authUrl=`${r}/auth/v1`,this.storageUrl=`${r}/storage/v1`,r.match(/(supabase\.co)|(supabase\.in)/)){const h=r.split(".");this.functionsUrl=`${h[0]}.functions.${h[1]}.${h[2]}`}else this.functionsUrl=`${r}/functions/v1`;this.schema=a.schema,this.multiTab=a.multiTab,this.fetch=a.fetch,this.headers=Object.assign(Object.assign({},$e),s?.headers),this.shouldThrowOnError=a.shouldThrowOnError||!1,this.auth=this._initSupabaseAuthClient(a),this.realtime=this._initRealtimeClient(Object.assign({headers:this.headers},a.realtime)),this._listenForAuthEvents(),this._listenForMultiTabEvents()}get functions(){return new Ls(this.functionsUrl,{headers:this._getAuthHeaders(),customFetch:this.fetch})}get storage(){return new Ps(this.storageUrl,this._getAuthHeaders(),this.fetch)}from(e){const t=`${this.restUrl}/${e}`;return new Ss(t,{headers:this._getAuthHeaders(),schema:this.schema,realtime:this.realtime,table:e,fetch:this.fetch,shouldThrowOnError:this.shouldThrowOnError})}rpc(e,t,{head:s=!1,count:r=null}={}){return this._initPostgRESTClient().rpc(e,t,{head:s,count:r})}removeAllSubscriptions(){return be(this,void 0,void 0,function*(){const e=this.getSubscriptions().slice(),t=e.map(r=>this.removeSubscription(r));return(yield Promise.all(t)).map(({error:r},a)=>({data:{subscription:e[a]},error:r}))})}removeSubscription(e){return be(this,void 0,void 0,function*(){const{error:t}=yield this._closeSubscription(e),s=this.getSubscriptions(),r=s.filter(a=>a.isJoined()).length;return s.length===0&&(yield this.realtime.disconnect()),{data:{openSubscriptions:r},error:t}})}_closeSubscription(e){return be(this,void 0,void 0,function*(){let t=null;if(!e.isClosed()){const{error:s}=yield this._unsubscribeSubscription(e);t=s}return this.realtime.remove(e),{error:t}})}_unsubscribeSubscription(e){return new Promise(t=>{e.unsubscribe().receive("ok",()=>t({error:null})).receive("error",s=>t({error:s})).receive("timeout",()=>t({error:new Error("timed out")}))})}getSubscriptions(){return this.realtime.channels}_initSupabaseAuthClient({autoRefreshToken:e,persistSession:t,detectSessionInUrl:s,localStorage:r,headers:a,fetch:l,cookieOptions:h,multiTab:f}){const i={Authorization:`Bearer ${this.supabaseKey}`,apikey:`${this.supabaseKey}`};return new $t({url:this.authUrl,headers:Object.assign(Object.assign({},a),i),autoRefreshToken:e,persistSession:t,detectSessionInUrl:s,localStorage:r,fetch:l,cookieOptions:h,multiTab:f})}_initRealtimeClient(e){return new As(this.realtimeUrl,Object.assign(Object.assign({},e),{params:Object.assign(Object.assign({},e?.params),{apikey:this.supabaseKey})}))}_initPostgRESTClient(){return new Mt(this.restUrl,{headers:this._getAuthHeaders(),schema:this.schema,fetch:this.fetch,throwOnError:this.shouldThrowOnError})}_getAuthHeaders(){var e,t;const s=Object.assign({},this.headers),r=(t=(e=this.auth.session())===null||e===void 0?void 0:e.access_token)!==null&&t!==void 0?t:this.supabaseKey;return s.apikey=this.supabaseKey,s.Authorization=s.Authorization||`Bearer ${r}`,s}_listenForMultiTabEvents(){if(!this.multiTab||!dt()||!window?.addEventListener)return null;try{return window?.addEventListener("storage",e=>{var t,s,r;if(e.key===ht){const a=JSON.parse(String(e.newValue)),l=(s=(t=a?.currentSession)===null||t===void 0?void 0:t.access_token)!==null&&s!==void 0?s:void 0,h=(r=this.auth.session())===null||r===void 0?void 0:r.access_token;l?!h&&l?this._handleTokenChanged("SIGNED_IN",l,"STORAGE"):h!==l&&this._handleTokenChanged("TOKEN_REFRESHED",l,"STORAGE"):this._handleTokenChanged("SIGNED_OUT",l,"STORAGE")}})}catch(e){return console.error("_listenForMultiTabEvents",e),null}}_listenForAuthEvents(){let{data:e}=this.auth.onAuthStateChange((t,s)=>{this._handleTokenChanged(t,s?.access_token,"CLIENT")});return e}_handleTokenChanged(e,t,s){(e==="TOKEN_REFRESHED"||e==="SIGNED_IN")&&this.changedAccessToken!==t?(this.realtime.setAuth(t),s=="STORAGE"&&this.auth.setAuth(t),this.changedAccessToken=t):(e==="SIGNED_OUT"||e==="USER_DELETED")&&(this.realtime.setAuth(this.supabaseKey),s=="STORAGE"&&this.auth.signOut())}}const zs=(n,e,t)=>new qs(n,e,t);let We=(n=21)=>crypto.getRandomValues(new Uint8Array(n)).reduce((e,t)=>(t&=63,t<36?e+=t.toString(36):t<62?e+=(t-26).toString(36).toUpperCase():t>62?e+="-":e+="_",e),"");var Ae={exports:{}};(function(n,e){(function(t,s){n.exports=s()})(self,()=>(()=>{var t={d:(i,o)=>{for(var c in o)t.o(o,c)&&!t.o(i,c)&&Object.defineProperty(i,c,{enumerable:!0,get:o[c]})},o:(i,o)=>Object.prototype.hasOwnProperty.call(i,o),r:i=>{typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(i,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(i,"__esModule",{value:!0})}},s={};function r(i,o){if(this.msg=i,this.webDirt=o,this.ac=o.ac,this.sampleBank=o.sampleBank,this.outputNode=o.destination,this.cutGroups=o.cutGroups,this.eventCounter=o.eventCounter,this.audioOutputs=o.audioOutputs,this.workletsAvailable=o.workletsAvailable,typeof i.buffer=="object")this.bufferContainer=i.buffer;else{if(this.sampleBank==null)return void console.log("WebDirt: there is no sample bank, cancelling event");if(typeof this.sampleBank!="object")return void console.log("WebDirt: buffer not provided by calling app + no WebDirt sample bank, cancelling event");if(this.msg.n=parseInt(this.msg.n),isNaN(this.msg.n)&&(this.msg.n=0),!this.sampleBank.sampleNameExists(this.msg.s))return void console.log("WebDirt: no sample named "+this.msg.s+" exists in sample map, cancelling event");if(!this.sampleBank.getBufferMightSucceed(this.msg.s,this.msg.n))return}if(this.when=this.msg.when,isNaN(this.when))console.log("WebDirt: 'when' is null or not a number, cancelling event");else if(this.nudge=parseFloat(this.msg.nudge),isNaN(this.nudge)||(this.when=this.when+this.nudge),isNaN(parseFloat(this.msg.speed))&&(this.msg.speed=1),this.msg.speed!=0)if(isNaN(parseFloat(this.msg.note))&&(this.msg.note=0),this.msg.speed=this.msg.speed*Math.pow(2,this.msg.note/12),this.msg.begin=a(this.msg.begin,0),this.msg.end=a(this.msg.end,1),this.msg.end!=this.msg.begin){if(this.msg.begin>this.msg.end&&(this.msg.speed=-1*this.msg.speed),this.msg.speed<0&&(this.msg.begin=1-this.msg.begin,this.msg.end=1-this.msg.end),this.msg.begin>this.msg.end){let ue=this.msg.begin;this.msg.begin=this.msg.end,this.msg.end=ue}var c;if(this.webDirt.voices=this.webDirt.voices+1,this.source=c=this.ac.createBufferSource(),this.source.onended=this.disconnectHandler(),this.disconnectOnEnd(this.source),this.source.playbackRate.value=Math.abs(this.msg.speed),this.prepareBuffer(),this.buffer!=null)this.source.buffer=this.buffer,this.start();else{var d=this,u=1e3*(this.msg.when-this.ac.currentTime-.2);u<=0&&(u=1e3*(this.msg.when-this.ac.currentTime-.2)),u>0&&setTimeout(function(){d.prepareBuffer(),d.buffer!=null?(d.source.buffer=d.buffer,d.start()):(console.log("WebDirt: unable to access sample "+i.s+":"+i.n+" on second attempt"),d.stopAll())},u)}this.cut(this.msg.cut,this.msg.s),c=this.shape(c,this.msg.shape),c=this.lowPassFilter(c,this.msg.cutoff,this.msg.resonance),c=this.highPassFilter(c,this.msg.hcutoff,this.msg.hresonance),c=this.bandPassFilter(c,this.msg.bandf,this.msg.bandq),c=this.vowel(c,this.msg.vowel),c=this.delay(c,this.msg.delay,this.msg.delaytime,this.msg.delayfeedback),c=this.loop(c,this.msg.loop,this.msg.begin,this.msg.end,this.msg.speed),c=this.crush(c,this.msg.crush),c=this.coarse(c,this.msg.coarse),this.unit(this.msg.unit,this.msg.speed);var p=parseFloat(this.msg.gain);isNaN(p)&&(p=1),p>2&&(p=2),p<0&&(p=0);var g=parseFloat(this.msg.overgain);isNaN(g)||(p+=g),p=Math.pow(p,4);var b,y,v,w=parseFloat(i.pan);if(isNaN(w)&&(w=.5),this.audioOutputs==2)(w>1||w<0)&&(w-=Math.floor(w)),b=w,y=0,v=1;else{var F=(w-=Math.floor(w))*this.audioOutputs;(v=(y=Math.floor(F))+1)>=this.audioOutputs&&(v=0),b=F-Math.floor(F)}var B=this.ac.createGain();this.disconnectOnEnd(B);var I=this.ac.createGain();this.disconnectOnEnd(I),B.gain.value=Math.cos(b*Math.PI/2)*p,I.gain.value=Math.sin(b*Math.PI/2)*p,c.connect(B),c.connect(I),this.gain1=B,this.gain2=I;var G=this.ac.createChannelMerger(this.audioOutputs);this.disconnectOnEnd(G),B.connect(G,0,y),I.connect(G,0,v),G.connect(this.outputNode)}else this.stopAll()}function a(i,o){let c=parseFloat(i);return isNaN(c)?o:c>1?1:c<0?0:c}t.r(s),t.d(s,{WebDirt:()=>f}),r.prototype.prepareBuffer=function(){typeof this.bufferContainer=="object"?typeof this.bufferContainer.buffer=="object"&&(this.msg.speed>=0?this.buffer=this.bufferContainer.buffer:(typeof this.bufferContainer.reverseBuffer=="object"||(this.bufferContainer.reverseBuffer=this.reverseBuffer(this.ac,this.bufferContainer.buffer)),this.buffer=this.bufferContainer.reverseBuffer)):(this.msg.speed>=0?this.buffer=this.sampleBank.getBuffer(this.msg.s,this.msg.n):this.buffer=this.sampleBank.getReverseBuffer(this.msg.s,this.msg.n),this.buffer=this.accel(this.buffer,this.msg.accelerate,this.msg.speed))},r.prototype.disconnectOnEnd=function(i){this.source.disconnectQueue==null&&(this.source.disconnectQueue=new Array),this.source.disconnectQueue.unshift(i)},r.prototype.start=function(){let i=Math.abs(this.msg.speed),o=(this.msg.end-this.msg.begin)*this.source.buffer.duration/i,c=this.msg.begin*this.source.buffer.duration;this.source.start(this.when,c,o)},r.prototype.stopAll=function(){if(this.source!=null&&this.source.disconnectQueue!=null){for(var i=0;i<this.source.disconnectQueue.length;i++)this.source.disconnectQueue[i].disconnect();this.source.disconnectQueue=null;try{this.source.stop()}catch{}this.webDirt.voices=this.webDirt.voices-1}},r.prototype.disconnectHandler=function(){var i=this;return function(){setTimeout(function(){if(i.source.disconnectQueue==null)throw Error("WebDirt: no disconnectQueue for event "+i.eventCounter);for(var o=0;o<i.source.disconnectQueue.length;o++)i.source.disconnectQueue[o].disconnect();i.source.disconnectQueue=null,i.webDirt.voices=i.webDirt.voices-1},250)}},r.prototype.coarse=function(i,o){if(o=parseInt(o),isNaN(o)&&(o=1),o>1&&this.workletsAvailable){var c=new AudioWorkletNode(this.ac,"coarse-processor");return c.parameters.get("coarse").value=o,i.connect(c),this.disconnectOnEnd(c),c}return i},r.prototype.crush=function(i,o){if(o=parseInt(o),isNaN(o)&&(o=null),o!=null&&o>0&&this.workletsAvailable){var c=new AudioWorkletNode(this.ac,"crush-processor");return c.parameters.get("crush").value=o,i.connect(c),this.disconnectOnEnd(c),c}return i},r.prototype.cut=function(i,o){if(i=parseInt(i),!isNaN(i)&&i!=0){for(var c={cutGroup:i,node:this,sampleName:o},d=0;d<this.cutGroups.length;d++){var u=this.cutGroups[d];u.cutGroup==i&&(i<0?u.sampleName==o&&(u.node.stop(this.when),this.cutGroups.splice(d,1)):(u.node.stop(this.when),this.cutGroups.splice(d,1)))}this.cutGroups.push(c)}},r.prototype.delay=function(i,o,c,d){if(isNaN(parseInt(o))&&(o=0),(o=Math.abs(o))!=0){var u=this.ac.createDelay();this.disconnectOnEnd(u),isNaN(parseInt(c))&&(console.log("WebDirt: warning: delaytime not a number, using default of 1"),c=1),u.delayTime.value=c;var p=this.ac.createGain();this.disconnectOnEnd(p),isNaN(parseInt(d))&&(console.log("WebDirt: warning: delayfeedback not a number, using default of 0.5"),d=.5),p.gain.value=Math.min(Math.abs(d),.995);var g=this.ac.createGain();return this.disconnectOnEnd(g),g.gain.value=o,i.connect(u),u.connect(p),u.connect(g),g.gain.setValueAtTime(g.gain.value,this.when+parseFloat(c)),p.connect(u),g}return i},r.prototype.highPassFilter=function(i,o,c){if(isNaN(parseFloat(o))&&isNaN(parseFloat(c)))return i;isNaN(parseFloat(o))&&(o=440),o<20&&(o=20),o>2e4&&(o=2e4),isNaN(parseFloat(c))&&(c=0),c<0&&(c=0),c>1&&(c=1),c=1/(c=1-.999*(c*=c));var d=this.ac.createBiquadFilter();return this.disconnectOnEnd(d),d.type="highpass",d.frequency.value=o,d.Q.value=c,i.connect(d),d},r.prototype.lowPassFilter=function(i,o,c){if(isNaN(parseFloat(o))&&isNaN(parseFloat(c)))return i;isNaN(parseFloat(o))&&(o=440),o<20&&(o=20),o>2e4&&(o=2e4),isNaN(parseFloat(c))&&(c=0),c<0&&(c=0),c>1&&(c=1),c=1/(c=1-.999*(c*=c));var d=this.ac.createBiquadFilter();return this.disconnectOnEnd(d),d.type="lowpass",d.frequency.value=o,d.Q.value=c,i.connect(d),d},r.prototype.bandPassFilter=function(i,o,c){if(isNaN(parseFloat(o))&&isNaN(parseFloat(c)))return i;isNaN(parseFloat(o))&&(o=440),o<20&&(o=20),o>2e4&&(o=2e4),isNaN(parseFloat(c))&&(c=10),c<1&&(c=1),c>100&&(c=100);var d=this.ac.createBiquadFilter();return this.disconnectOnEnd(d),d.type="bandpass",d.frequency.value=o,d.Q.value=c,d.gain.value=c,i.connect(d),d},r.prototype.loop=function(i,o){if(isNaN(parseInt(o))||o==0)return i;try{var c=this.source.buffer.duration-this.msg.begin*this.source.buffer.duration-(1-this.msg.end)*this.source.buffer.duration;return this.source.loop=!0,this.source.loopStart=this.msg.begin*this.source.buffer.duration,this.source.loopEnd=this.msg.end*this.source.buffer.duration,this.source.stop(this.when+c*o/this.source.playbackRate.value),i}catch{return console.log("WebDirt Warning: buffer data not yet available to calculate loop time - no looping applied"),i}},r.prototype.accelerate=function(i,o){if(o=Math.abs(o),isNaN(parseFloat(i))&&(i=0),i!=0){i=parseFloat(i),this.source.playbackRate.setValueAtTime(o,this.when);var c=Math.abs((this.source.buffer.length*i/this.ac.sampleRate+o)/o),d=o+this.source.buffer.length*i/this.ac.sampleRate;if(d<0)this.source.buffer=this.negativeAccelerateBuffer(this.source.buffer,i,o),this.source.playbackRate.linearRampToValueAtTime(0,this.when+c),this.source.playbackRate.linearRampToValueAtTime(1,this.when+this.source.buffer.duration);else try{this.source.playbackRate.linearRampToValueAtTime(d,this.when+this.source.buffer.duration)}catch{console.log("WebDirt: Warning, buffer data not loaded, could not apply acclerate effect")}}},r.prototype.negativeAccelerateBuffer=function(i,o,c){var d=i.length,u=new Float32Array(d),p=this.ac.createBuffer(i.numberOfChannels,i.length,this.ac.sampleRate),g=new Float32Array(d),b=Math.abs(c/(c-o))*d;b=d*Math.abs((this.source.buffer.length*o/this.ac.sampleRate+c)/c)/this.source.buffer.duration,b=Math.trunc(b);for(var y=0;y<i.numberOfChannels;y++){i.copyFromChannel(u,y,0);for(var v=0;v<b;v++)g[v]=u[v];for(v=0;v<d-b;v++)g[v+b]=u[b-v];p.copyToChannel(g,y,0)}return p},r.prototype.accel=function(i,o,c){if(isNaN(parseFloat(o)))return i;o=parseFloat(o);try{var d=i.length}catch{return void console.log("WebDirt: Warning, buffer data not loaded, accelerate effect not applied")}for(var u=new Float32Array(d),p=this.ac.createBuffer(i.numberOfChannels,i.length,this.ac.sampleRate),g=new Float32Array(d),b=0;b<i.numberOfChannels;b++){var y=c;i.copyFromChannel(u,b,0);for(var v=0,w=0;w<d&&(g[v]=u[Math.round(w)],y+=o/this.ac.sampleRate,!(w<0));w+=y)v++;p.copyToChannel(g,b,0)}return p},r.prototype.shape=function(i,o){if(o=parseFloat(o),isNaN(o)&&(o=0),o>=1&&(o=.999),o>0&&this.workletsAvailable){var c=new AudioWorkletNode(this.ac,"shape-processor");return c.parameters.get("shape").value=o,i.connect(c),this.disconnectOnEnd(c),c}return i},r.prototype.stop=function(i){this.gain1.gain.setValueAtTime(this.gain1.gain.value,i),this.gain1.gain.linearRampToValueAtTime(0,i+.02),this.gain2.gain.setValueAtTime(this.gain1.gain.value,i),this.gain2.gain.linearRampToValueAtTime(0,i+.02)},r.prototype.unit=function(i,o){i=="c"&&(this.source.playbackRate.value=this.source.playbackRate.value*this.source.buffer.duration)},r.prototype.vowel=function(i,o){if(typeof o!="string")return i;if((o=o.toLowerCase())=="a"||o=="e"||o=="i"||o=="o"||o=="u"){var c,d,u,p=this.ac.createGain();switch(this.disconnectOnEnd(p),o){case"a":c=l.a.freqs,d=l.a.qs,u=l.a.amps;break;case"e":c=l.e.freqs,d=l.e.qs,u=l.e.amps;break;case"i":c=l.i.freqs,d=l.i.qs,u=l.i.amps;break;case"o":c=l.o.freqs,d=l.o.qs,u=l.o.amps;break;case"u":c=l.u.freqs,d=l.u.qs,u=l.u.amps}for(var g=0;g<5;g++){var b=this.ac.createGain();this.disconnectOnEnd(b),b.gain.value=u[g];var y=this.ac.createBiquadFilter();this.disconnectOnEnd(y),y.type="bandpass",y.Q.value=d[g]/8,y.frequency.value=c[g],i.connect(y),y.connect(b),b.connect(p)}return p.gain.value=8,p}return i},r.prototype.reverseBuffer=function(i,o){for(var c=o.length,d=new Float32Array(c),u=i.createBuffer(o.numberOfChannels,o.length,i.sampleRate),p=new Float32Array(c),g=0;g<o.numberOfChannels;g++){o.copyFromChannel(d,g,0);for(var b=0;b<c;b++)p[b]=d[c-b];p[0]=p[1],u.copyToChannel(p,g,0)}return u};var l={a:{freqs:[660,1120,2750,3e3,3350],amps:[1,.5012,.0708,.0631,.0126],qs:[80,90,120,130,140]},e:{freqs:[440,1800,2700,3e3,3300],amps:[1,.1995,.1259,.1,.1],qs:[70,80,100,120,120]},i:{freqs:[270,1850,2900,3350,3590],amps:[1,.0631,.0631,.0158,.0158],qs:[40,90,100,120,120]},o:{freqs:[430,820,2700,3e3,3300],amps:[1,.3162,.0501,.0794,.01995],qs:[40,80,100,120,120]},u:{freqs:[370,630,2750,3e3,3400],amps:[1,.1,.0708,.0316,.01995],qs:[40,60,100,120,120]}};function h(i,o,c){this.STATUS_PRELOAD=0,this.STATUS_LOADING=1,this.STATUS_READY=2,this.STATUS_ERROR=3,this.sampleMapUrl=i,this.urlPrefix=o,this.samples={};var d=new XMLHttpRequest;d.open("GET",this.sampleMapUrl,!0),d.responseType="json";var u=this;d.onload=function(){if(d.readyState!=4)throw Error("WebDirt: readyState != 4 in callback of sampleMap load");if(d.status!=200)throw Error("WebDirt: status != 200 in callback of sampleMap load");if(d.response==null)throw Error("WebDirt: JSON response null in callback of sampleMap load");u.sampleMap=d.response,console.log("WebDirt: sampleMap loaded from "+u.sampleMapUrl),typeof c=="function"&&c()},d.onerror=function(){console.log("WebDirt: unspecified error in loading of sampleMap from "+u.sampleMapUrl)},d.send()}function f(i){this.workletsAvailable=!1,this.voices=0,i===void 0&&(i={}),typeof i=="object"?(typeof i.sampleMapUrl=="string"?(i.sampleFolder==null&&(i.sampleFolder="samples"),console.log("WebDirt: will manage own sample bank, samplemap="+i.sampleMapUrl+" sampleFolder="+i.sampleFolder),this.sampleBank=new h(i.sampleMapUrl,i.sampleFolder,i.readyCallback)):console.log("WebDirt: will expect application to provide sample buffers"),i.latency==null&&(i.latency=.4),this.latency=i.latency,typeof i.maxLateness!="number"?this.maxLateness=.005:this.maxLateness=i.maxLateness,this.ac=i.audioContext,this.destination=i.destination,this.cutGroups=new Array,this.eventCounter=0,this.audioOutputs=2,this.ac==null?console.log("WebDirt: initialized (without audio context)"):this.destination==null?(this.destination=this.ac.destination,console.log("WebDirt: initialized with provided context")):console.log("WebDirt: initialized with provided context + destination")):console.log("WebDirt: unable to construct WebDirt object, arguments object not provided to constructor")}return h.prototype.loadAllNamed=function(i){if(this.ac==null)throw Error("WebDirt: called SampleBank.loadAllNamed with null audio context");if(this.sampleMap==null)throw Error("WebDirt: SampleBank.loadAllNamed: sampleMap is null");if(this.sampleMap[i]!=null)for(var o=0;o<this.sampleMap[i].length;o++)this.load(this.getFilename(i,o));else console.log("WebDirt: can't loadAllNamed "+i+" (not present in sampleMap)")},h.prototype.load=function(i,o){if(this.samples[i]==null&&(this.samples[i]={},this.samples[i].status=this.STATUS_PRELOAD),this.samples[i].status!=this.STATUS_READY){if(this.samples[i].status!=this.STATUS_ERROR&&this.samples[i].status!=this.STATUS_LOADING){this.samples[i].status=this.STATUS_LOADING;var c=this.urlPrefix+"/"+i,d=new XMLHttpRequest;try{d.open("GET",c,!0),d.responseType="arraybuffer";var u=this;d.onload=function(){u.ac.decodeAudioData(d.response,function(p){u.samples[i].buffer=p,u.samples[i].status=u.STATUS_READY,typeof o=="function"&&o()},function(p){console.log("WebDirt: error decoding "+c),u.samples[i].status=u.STATUS_ERROR})},d.onerror=function(){console.log("WebDirt: error requesting "+c),u.samples[i].status=u.STATUS_ERROR},d.send()}catch(p){console.log("WebDirt: exception loading "+c+" = "+p),u.samples[i].status=u.STATUS_ERROR}}}else typeof o=="function"&&o()},h.prototype.sampleNameExists=function(i){return this.sampleMap==null?(console.log("WebDirt: can't lookup sample bank because sampleMap doesn't exist"),!1):this.sampleMap[i]!=null},h.prototype.getFilename=function(i,o){return o==null&&(o=0),o<0&&(o=this.sampleMap[i].length-Math.abs(o)%this.sampleMap[i].length),o%=this.sampleMap[i].length,this.sampleMap[i][o]},h.prototype.getBufferMightSucceed=function(i,o){var c=this.getFilename(i,o);if(this.samples[c]==null)return!0;if(this.samples[c].status==this.STATUS_PRELOAD)return!1;if(this.samples[c].status==this.STATUS_LOADING||this.samples[c].status==this.STATUS_READY)return!0;if(this.samples[c].status==this.STATUS_ERROR)return!1;throw Error("WebDirt: SampleBank.getBufferMightSucceed: unrecognized status for "+i+":"+o)},h.prototype.getBuffer=function(i,o){var c=this.getFilename(i,o);return this.samples[c]==null?(this.load(c),null):this.samples[c].status==this.STATUS_PRELOAD?(console.log("WebDirt: *strange error* in SampleBank.getBuffer: sample "+i+":"+o+" status is PRELOAD"),null):this.samples[c].status==this.STATUS_ERROR?(console.log("WebDirt: SampleBank.getBuffer: sample "+i+" has status error"),null):this.samples[c].status==this.STATUS_LOADING?(console.log("WebDirt: SampleBank.getBuffer: "+i+":"+o+" is still loading"),null):this.samples[c].status==this.STATUS_READY?this.samples[c].buffer:(console.log("WebDirt: *strange error* in SampleBank.getBuffer: sample "+i+":"+o+" has unknown status"),null)},h.prototype.getReverseBuffer=function(i,o){if(this.sampleMap[i]!=null){var c=this.getFilename(i,o);if(this.samples[c]!=null){if(this.samples[c].reverseBuffer!=null)return this.samples[c].reverseBuffer;if(this.samples[c].status==this.STATUS_READY)return this.samples[c].reverseBuffer=function(d,u){for(var p=u.length,g=new Float32Array(p),b=d.createBuffer(u.numberOfChannels,u.length,d.sampleRate),y=new Float32Array(p),v=0;v<u.numberOfChannels;v++){u.copyFromChannel(g,v,0);for(var w=0;w<p;w++)y[w]=g[p-w];y[0]=y[1],b.copyToChannel(y,v,0)}return b}(this.ac,this.samples[c].buffer),this.samples[c].reverseBuffer}return this.load(c),null}console.log("WebDirt: can't getReverseBuffer "+i+" (not present in sampleMap)")},f.prototype.initializeWebAudio=function(){if(this.ac==null)try{window.AudioContext=window.AudioContext||window.webkitAudioContext,this.ac=new AudioContext,this.destination=this.ac.destination,console.log("WebDirt: own audio context created")}catch(o){return console.log(o),void alert("Web Audio API is not supported in this browser")}if(this.ac!=null){this.ac.audioWorklet!=null?this.ac.audioWorklet.addModule("WebDirt/AudioWorklets.js").then(()=>{console.log("WebDirt: audio worklets added"),this.workletsAvailable=!0}).catch(o=>{console.log("WebDirt: error loading AudioWorklets.js: "+o),console.log("(WebDirt should still work but shape, coarse, and crush will have no effect)"),this.workletsAvailable=!1}):(console.log("WebDirt: browser does not support audio worklets"),console.log("(WebDirt should still work but shape, coarse, and crush will have no effect)"),this.workletsAvailable=!1),this.tempo={time:this.ac.currentTime,beats:0,bpm:30},this.clockDiff=Date.now()/1e3-this.ac.currentTime,this.sampleBank!=null&&(this.sampleBank.ac=this.ac),this.silentNote=this.ac.createOscillator(),this.silentNote.type="sine",this.silentNote.frequency.value=440,this.silentGain=this.ac.createGain(),this.silentGain.gain.value=0,this.silentNote.connect(this.silentGain),this.silentGain.connect(this.ac.destination),this.silentNote.start();var i=this;setTimeout(function(){i.silentGain.disconnect(i.ac.destination),i.silentNote.disconnect(i.silentGain),i.silentNote.stop(),i.silentGain=null,i.silentNote=null},500)}console.log("WebDirt: initializeWebAudio finished.")},f.prototype.playSample=function(i,o){if(o==null&&(o=this.latency),i.whenPosix!=null&&(i.when=i.whenPosix-(new Date().getTime()/1e3-this.ac.currentTime)),i.when==null&&(i.when=this.ac.currentTime),i.when=i.when+o,typeof i.maxLateness!="number"&&(i.maxLateness=this.maxLateness),this.ac.currentTime-i.when>i.maxLateness)return void console.log("WebDirt warning: dropping msg late by "+(this.ac.currentTime-i.when)+" seconds");let c=new r(i,this);return this.eventCounter++,c},f.prototype.playScore=function(i,o,c){this.initializeWebAudio(),o==null&&(o=this.latency);for(var d=this.ac.currentTime,u=0,p=0;p<i.length;p++){var g=i[p];g.when>u&&(u=g.when),g.when=g.when+d,g.s!=null&&(g.sample_name=g.s),g.n!=null&&(g.sample_n=g.n),this.playSample(g,o)}setTimeout(function(){typeof c=="function"&&c()},1e3*(u+o))},f.prototype.playScoreWhenReady=function(i,o,c,d){this.initializeWebAudio(),o==null&&(o=this.latency);for(var u=i.length,p=0;p<i.length;p++){var g=i[p],b=this;g.s!=null&&(g.sample_name=g.s),g.n!=null&&(g.sample_n=g.n),this.sampleBank!=null&&this.sampleBank.load(g.sample_name,g.sample_n,function(){(u-=1)<=0&&(b.playScore(i,o,d),typeof c=="function"&&c())})}},f.prototype.loadAndPlayScore=function(i,o,c,d){this.initializeWebAudio(),o==null&&(o=this.latency);var u=new XMLHttpRequest;u.open("GET",i,!0),u.responseType="json";var p=this;u.onload=function(){if(u.readyState!=4)throw Error("readyState != 4 in callback of loadAndPlayScore");if(u.status!=200)throw Error("status != 200 in callback of loadAndPlayScore");if(u.response==null)throw Error("JSON response null in callback of loadAndPlayScore");console.log("playing JSON score from "+i),p.playScoreWhenReady(u.response,o,c,d)},u.send()},f.prototype.renderAndPlayScore=function(i,o,c,d,u,p,g){this.initializeWebAudio(),u==null&&(u=this.latency),window.WebSocket=window.WebSocket||window.MozWebSocket,console.log("WebDirt.renderAndPlayScore: attempting websocket connection to "+i);var b=new WebSocket(i);b.onerror=function(){console.log(" ERROR opening websocket connection to "+i)},b.onopen=function(){console.log(" websocket connection to "+i+" established");try{var v='{"render":'+JSON.stringify(o)+',"cps":'+c+',"cycles":'+d+"}";console.log(v),b.send(v),console.log(" render request sent")}catch{console.log(" EXCEPTION during transmission of render request"),b.close()}};var y=this;b.onmessage=function(v){var w=JSON.parse(v.data);if(!w instanceof Array)return console.log(" WebDirt warning: rendering socket received non-array message"),console.log(typeof w),void(globalX=w);console.log(" received score from "+i),y.playScoreWhenReady(w,u,p,g),console.log(" closing websocket connection to "+i),b.close()}},f.prototype.subscribeToTidalSocket=function(i,o){this.initializeWebAudio(),o==null&&(o=!1),window.WebSocket=window.WebSocket||window.MozWebSocket,console.log("WebDirt: attempting websocket connection to "+i),ws=new WebSocket(i),ws.onopen=function(){console.log("websocket connection to tidalSocket opened")},ws.onerror=function(){console.log("ERROR opening websocket connection to tidalSocket")};var c=this;ws.onmessage=function(d){if(d.data==null)throw Error("null data in tidalSocket onmessage handler");var u=JSON.parse(d.data);if(u.address==null)throw Error("received message from tidalSocket with no address: "+d.data);if(u.address!="/play")throw Error("address of message from tidalSocket wasn't /play: "+d.data);if(u.args.constructor!==Array)throw Error("ERROR: message from tidalSocket where args doesn't exist or isn't an array: "+d.data);if(u.args.length!=30&&u.args.length!=33)throw Error("ERROR: message from tidalSocket with "+u.args.length+" args instead of 30 or 33: "+d.data);var p={};p.when=u.args[0]+u.args[1]/1e6+c.clockDiff,p.sample_name=u.args[3],p.begin=u.args[5],p.end=u.args[6],p.speed=u.args[7],p.pan=u.args[8],p.vowel=u.args[10],p.cutoff=u.args[11],p.resonance=u.args[12],p.accelerate=u.args[13],p.shape=u.args[14],p.gain=u.args[16],p.cut=u.args[17],p.delay=u.args[18],p.delaytime=u.args[19],p.delayfeedback=u.args[20],p.crush=u.args[21],p.coarse=u.args[22],p.hcutoff=u.args[23],p.hresonance=u.args[24],p.bandf=u.args[25],p.bandq=u.args[26],p.unit_name=u.args[27],p.sample_loop=u.args[28],p.sample_n=u.args[29],u.args.length==33&&(p.attack=u.args[30],p.hold=u.args[31],p.release=u.args[32]),c.playSample(p),o&&console.log(u)}},f.prototype.getCurrentTime=function(){return this.ac.currentTime},f.prototype.syncWithEsp=function(i){if(typeof EspClient=="function")if(this.espClient==null){this.espClient=new EspClient(i,this.ac);var o=this;this.espClient.tempoCallback=function(c){o.tempo=c}}else this.espClient.setUrl(i);else console.log("WebDirt ERROR: syncWithEsp called but EspClient does not exist")},f.prototype.setTempo=function(i){if(typeof i.time!="number")throw Error("WebDirt: no time in setTempo");if(typeof i.beats!="number")throw Error("WebDirt: no beats in setTempo");if(typeof i.bpm!="number")throw Error("WebDirt: no bpm in setTempo");this.espClient!=null&&this.espClient.sendSetTempo(i),this.tempo=i},f.prototype.sampleHint=function(i){this.sampleBank!=null&&(console.log("WebDirt received sample hint: "+i),this.sampleBank.loadAllNamed(i))},s})())})(Ae);const Hs=ot(Ae.exports),Js=lt({__proto__:null,default:Hs},[Ae.exports]),se=_.exports;function Ys({title:n,titleId:e,...t},s){return se.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:s,"aria-labelledby":e},t),n?se.createElement("title",{id:e},n):null,se.createElement("path",{d:"M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"}))}const Vs=se.forwardRef(Ys);var Ks=Vs;const Xs=Ks,Oe=at.docs.filter(({name:n,description:e})=>n&&!n.startsWith("_")&&!!e).sort((n,e)=>n.name.localeCompare(e.name));function Qs(){return m.exports.jsxs("div",{className:"flex h-full w-full pt-2",children:[m.exports.jsx("div",{className:"w-64 flex-none h-full overflow-y-auto overflow-x-hidden pr-4",children:Oe.map((n,e)=>m.exports.jsxs("a",{className:"cursor-pointer block hover:bg-linegray py-1 px-4",href:`#doc-${e}`,children:[n.name," "]},e))}),m.exports.jsx("div",{className:"break-normal w-full h-full overflow-auto pl-4 flex relative",children:m.exports.jsxs("div",{className:"prose prose-invert",children:[m.exports.jsx("h2",{children:"API Reference"}),m.exports.jsx("p",{children:"This is the long list functions you can use! Remember that you don't need to remember all of those and that you can already make music with a small set of functions!"}),Oe.map((n,e)=>m.exports.jsxs("section",{children:[m.exports.jsx("h3",{id:`doc-${e}`,children:n.name}),m.exports.jsx("p",{dangerouslySetInnerHTML:{__html:n.description}}),n.examples?.map((t,s)=>m.exports.jsx("pre",{children:t},s))]},e))]})})]})}function Zs({context:n}){const{activeFooter:e,setActiveFooter:t,isZen:s}=n,r=_.exports.useRef(),[a,l]=_.exports.useState([]);_.exports.useLayoutEffect(()=>{r.current&&e==="console"&&(r.current.scrollTop=r.current?.scrollHeight)},[a,e]),_.exports.useLayoutEffect(()=>{r.current&&(e==="console"?r.current.scrollTop=r.current?.scrollHeight:r.current.scrollTop=0)},[e]),er(_.exports.useCallback(f=>{const{message:i,type:o,data:c}=f.detail;l(d=>{const u=d.length?d[d.length-1]:void 0,p=We(12);if(o==="loaded-sample"){const g=d.findIndex(({data:{url:b},type:y})=>y==="load-sample"&&b===c.url);d[g]={message:i,type:o,id:p,data:c}}else u&&u.message===i?d=d.slice(0,-1).concat([{message:i,type:o,count:(u.count??1)+1,id:p,data:c}]):d=d.concat([{message:i,type:o,id:p,data:c}]);return d.slice(-20)})},[]));const h=({children:f,name:i,label:o})=>m.exports.jsxs(m.exports.Fragment,{children:[m.exports.jsx("div",{onClick:()=>t(i),className:R("h-8 px-2 text-white cursor-pointer hover:text-tertiary flex items-center space-x-1 border-b",e===i?"border-white hover:border-tertiary":"border-transparent"),children:o||i}),e===i&&m.exports.jsx(m.exports.Fragment,{children:f})]});return s?null:m.exports.jsxs("footer",{className:"bg-footer z-[20]",children:[m.exports.jsxs("div",{className:"flex justify-between px-2",children:[m.exports.jsxs("div",{className:R("flex select-none",e&&"pb-2"),children:[m.exports.jsx(h,{name:"intro",label:"welcome"}),m.exports.jsx(h,{name:"samples"}),m.exports.jsx(h,{name:"console"}),m.exports.jsx(h,{name:"reference"})]}),e!==""&&m.exports.jsx("button",{onClick:()=>t(""),className:"text-white",children:m.exports.jsx(Xs,{className:"w-5 h-5"})})]}),e!==""&&m.exports.jsxs("div",{className:"text-white font-mono text-sm h-[360px] flex-none overflow-auto max-w-full relative",ref:r,children:[e==="intro"&&m.exports.jsxs("div",{className:"prose prose-invert max-w-[600px] pt-2 font-sans pb-8 px-4",children:[m.exports.jsxs("h3",{children:[m.exports.jsx("span",{className:R("animate-spin inline-block select-none"),children:"\u{1F300}"})," welcome"]}),m.exports.jsxs("p",{children:["You have found ",m.exports.jsx("span",{className:"underline",children:"strudel"}),", a new live coding platform to write dynamic music pieces in the browser! It is free and open-source and made for beginners and experts alike. To get started:",m.exports.jsx("br",{}),m.exports.jsx("br",{}),m.exports.jsx("span",{className:"underline",children:"1. hit play"})," - ",m.exports.jsx("span",{className:"underline",children:"2. change something"})," ","- ",m.exports.jsx("span",{className:"underline",children:"3. hit update"}),m.exports.jsx("br",{}),"If you don't like what you hear, try ",m.exports.jsx("span",{className:"underline",children:"shuffle"}),"!"]}),m.exports.jsxs("p",{children:["To learn more about what this all means, check out the"," ",m.exports.jsx("a",{href:"./learn/getting-started",target:"_blank",children:"interactive tutorial"}),". Also feel free to join the"," ",m.exports.jsx("a",{href:"https://discord.com/invite/HGEdXmRkzT",target:"_blank",children:"tidalcycles discord channel"})," ","to ask any questions, give feedback or just say hello."]}),m.exports.jsx("h3",{children:"about"}),m.exports.jsxs("p",{children:["strudel is a JavaScript version of"," ",m.exports.jsx("a",{href:"tidalcycles.org/",target:"_blank",children:"tidalcycles"}),", which is a popular live coding language for music, written in Haskell. You can find the source code at"," ",m.exports.jsx("a",{href:"https://github.com/tidalcycles/strudel",target:"_blank",children:"github"}),". Please consider to"," ",m.exports.jsx("a",{href:"https://opencollective.com/tidalcycles",target:"_blank",children:"support this project"})," ","to ensure ongoing development \u{1F496}"]})]}),e==="console"&&m.exports.jsx("div",{className:"break-all px-4",children:a.map((f,i)=>{const o=tr(f.message);return m.exports.jsxs("div",{className:R(f.type==="error"&&"text-red-500",f.type==="highlight"&&"text-highlight"),children:[m.exports.jsx("span",{dangerouslySetInnerHTML:{__html:o}}),f.count?` (${f.count})`:""]},f.id)})}),e==="samples"&&m.exports.jsxs("div",{className:"break-normal w-full px-4",children:[m.exports.jsxs("span",{className:"text-white",children:[_e.length," banks loaded:"]}),_e.map(([f,i])=>m.exports.jsxs("span",{className:"cursor-pointer hover:text-tertiary",onClick:()=>{},children:[" ",f,"(",Array.isArray(i)?i.length:typeof i=="object"?Object.values(i).length:1,")"," "]},f))]}),e==="reference"&&m.exports.jsx(Qs,{})]})]})}function er(n){Ye(D.key,n)}function tr(n){var e,t,s,r;return t=/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim,e=n.replace(t,'<a class="underline" href="$1" target="_blank">$1</a>'),s=/(^|[^\/])(www\.[\S]+(\b|$))/gim,e=e.replace(s,'$1<a class="underline" href="http://$2" target="_blank">$2</a>'),r=/(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim,e=e.replace(r,'<a class="underline" href="mailto:$1">$1</a>'),e}const re=_.exports;function sr({title:n,titleId:e,...t},s){return re.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:s,"aria-labelledby":e},t),n?re.createElement("title",{id:e},n):null,re.createElement("path",{fillRule:"evenodd",d:"M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21.324-.455.63-.739.914a.75.75 0 101.06 1.06c.37-.369.69-.77.96-1.193a26.61 26.61 0 013.095 2.348.75.75 0 00.992 0 26.547 26.547 0 015.93-3.95.75.75 0 00.42-.739 41.053 41.053 0 00-.39-3.114 29.925 29.925 0 00-5.199 2.801 2.25 2.25 0 01-2.514 0c-.41-.275-.826-.541-1.25-.797a6.985 6.985 0 01-1.084 3.45 26.503 26.503 0 00-1.281-.78A5.487 5.487 0 006 12v-.54z",clipRule:"evenodd"}))}const rr=re.forwardRef(sr);var nr=rr;const ir=nr,ne=_.exports;function or({title:n,titleId:e,...t},s){return ne.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:s,"aria-labelledby":e},t),n?ne.createElement("title",{id:e},n):null,ne.createElement("path",{fillRule:"evenodd",d:"M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z",clipRule:"evenodd"}))}const ar=ne.forwardRef(or);var lr=ar;const cr=lr,J=_.exports;function hr({title:n,titleId:e,...t},s){return J.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:s,"aria-labelledby":e},t),n?J.createElement("title",{id:e},n):null,J.createElement("path",{d:"M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z"}),J.createElement("path",{d:"M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z"}))}const ur=J.forwardRef(hr);var dr=ur;const fr=dr,ie=_.exports;function pr({title:n,titleId:e,...t},s){return ie.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:s,"aria-labelledby":e},t),n?ie.createElement("title",{id:e},n):null,ie.createElement("path",{fillRule:"evenodd",d:"M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z",clipRule:"evenodd"}))}const mr=ie.forwardRef(pr);var gr=mr;const qe=gr,oe=_.exports;function br({title:n,titleId:e,...t},s){return oe.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:s,"aria-labelledby":e},t),n?oe.createElement("title",{id:e},n):null,oe.createElement("path",{d:"M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z"}))}const vr=oe.forwardRef(br);var yr=vr;const wr=yr,ae=_.exports;function xr({title:n,titleId:e,...t},s){return ae.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:s,"aria-labelledby":e},t),n?ae.createElement("title",{id:e},n):null,ae.createElement("path",{fillRule:"evenodd",d:"M2 10a8 8 0 1116 0 8 8 0 01-16 0zm5-2.25A.75.75 0 017.75 7h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-4.5z",clipRule:"evenodd"}))}const _r=ae.forwardRef(xr);var kr=_r;const Ar=kr;function Cr({context:n}){const{embedded:e,started:t,pending:s,isDirty:r,lastShared:a,activeCode:l,handleTogglePlay:h,handleUpdate:f,handleShuffle:i,handleShare:o,isZen:c,setIsZen:d}=n,u=e||window.location!==window.parent.location;return m.exports.jsxs("header",{id:"header",className:R("py-1 flex-none w-full text-black justify-between z-[100] text-lg  select-none sticky top-0",!c&&!u&&"bg-header",u?"flex":"md:flex"),children:[m.exports.jsx("div",{className:"px-4 flex space-x-2 md:pt-0 select-none",children:m.exports.jsxs("h1",{onClick:()=>{u&&window.open(window.location.href.replace("embed",""))},className:R(u?"text-l cursor-pointer":"text-xl","text-white font-bold flex space-x-2 items-center"),children:[m.exports.jsx("div",{className:R("mt-[1px]",t&&"animate-spin","cursor-pointer"),onClick:()=>!u&&d(p=>!p),children:"\u{1F300}"}),!c&&m.exports.jsxs("div",{className:R(t&&"animate-pulse"),children:[m.exports.jsx("span",{className:"",children:"strudel"})," ",m.exports.jsx("span",{className:"text-sm",children:"REPL"})]})]})}),!c&&m.exports.jsxs("div",{className:"flex max-w-full overflow-auto text-white ",children:[m.exports.jsx("button",{onClick:h,title:t?"stop":"play",className:R(u?"px-2":"p-2","hover:text-tertiary",!t&&"animate-pulse"),children:s?m.exports.jsx(m.exports.Fragment,{children:"loading..."}):m.exports.jsxs("span",{className:R("flex items-center space-x-1",u?"":"w-16"),children:[t?m.exports.jsx(Ar,{className:"w-6 h-6"}):m.exports.jsx(qe,{className:"w-6 h-6"}),!u&&m.exports.jsx("span",{children:t?"stop":"play"})]})}),m.exports.jsxs("button",{onClick:f,title:"update",className:R("flex items-center space-x-1",u?"px-2":"p-2",!r||!l?"opacity-50":"hover:text-tertiary"),children:[m.exports.jsx(cr,{className:"w-6 h-6"}),!u&&m.exports.jsx("span",{children:"update"})]}),!u&&m.exports.jsxs("button",{title:"shuffle",className:"hover:text-tertiary p-2 flex items-center space-x-1",onClick:i,children:[m.exports.jsx(wr,{className:"w-6 h-6"}),m.exports.jsx("span",{children:" shuffle"})]}),!u&&m.exports.jsxs("button",{title:"share",className:R("cursor-pointer hover:text-tertiary flex items-center space-x-1",u?"px-2":"p-2"),onClick:o,children:[m.exports.jsx(fr,{className:"w-6 h-6"}),m.exports.jsxs("span",{children:["share",a&&a===(l||code)?"d!":""]})]}),!u&&m.exports.jsxs("a",{title:"learn",href:"./learn/getting-started",className:R("hover:text-tertiary flex items-center space-x-1",u?"px-2":"p-2"),children:[m.exports.jsx(ir,{className:"w-6 h-6"}),m.exports.jsx("span",{children:"learn"})]})]})]})}const Sr=`// Koji Kondo - Swimming (Super Mario World)
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
`,Tr=`// John Coltrane - Giant Steps
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
//.pianoroll({fold:1})`,Er=`// Koji Kondo - Princess Zelda's Rescue
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
  //.pianoroll({fold:1})`,Rr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
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
  //.pianoroll({fold:1})`,Fr=`samples({
  bd: 'bd/BT0A0D0.wav',
  sn: 'sn/ST0T0S3.wav',
  hh: 'hh/000_hh3closedhh.wav'
}, 'https://loophole-letters.vercel.app/samples/tidal/')

stack(
  "<bd!3 bd(3,4,2)>".color('#F5A623'),
  "hh*4".color('#673AB7'),
  "~ <sn!3 sn(3,4,1)>".color('#4CAF50')
).s()
.pianoroll({fold:1})
`,jr=`// adapted from a Barry Harris excercise
"0,2,[7 6]"
  .add("<0 1 2 3 4 5 7 8>")
  .scale('C bebop major')
  .transpose("<0 1 2 1>/8")
  .slow(2)
  .note().piano()
  .color('#00B8D4')
`,Or=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
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

const scales = cat('C major', 'C mixolydian', 'F lydian', ['F minor', cat('Db major','Db mixolydian')])

stack(
  s("<bd sn> <hh hh*2 hh*3>").color('#00B8D4'),
  "<g4 c5 a4 [ab4 <eb5 f5>]>"
  .scale(scales)
  .struct("x*8")
  .scaleTranspose("0 [-5,-2] -7 [-9,-2]")
  .legato(.3)
  .slow(2)
  .note()
  .s('rhodes')
  .clip(1)
  .room(.5)
  .delay(.3)
  .delayfeedback(.4)
  .delaytime(1/12).gain(.5).color('#7ED321'),
  "<c2 c3 f2 [[F2 C2] db2]>"
  .legato("<1@3 [.3 1]>")
  .slow(2).superimpose(x=>x.add(.02))
  .note().gain(.3)
  .s('sawtooth').cutoff(600).color('#F8E71C'),
).fast(3/2)
//.pianoroll({fold:1})`,Dr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
samples({
  'kalimba': { c5:'https://freesound.org/data/previews/536/536549_11935698-lq.mp3' }
})
const scales = cat('C major', 'C mixolydian', 'F lydian', ['F minor', 'Db major'])

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
  .legato("<.4 .8 1 1.2 1.4 1.6 1.8 2>/8")
  .fast(1)
  .note()
  .clip(1)
  .s('kalimba')
  .delay(.2)
  `,Br=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
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
 .note().piano()`,$r=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos, inspired by Friendship - Let's not talk about it (1979) :)

samples({ bd: 'bd/BT0A0D0.wav', sn: 'sn/ST0T0S3.wav', hh: 'hh/000_hh3closedhh.wav', cp: 'cp/HANDCLP0.wav',
}, 'https://loophole-letters.vercel.app/samples/tidal/')

const h = x=>x.transpose("<0@2 5 0 7 5 0 -5>/2")

stack(
  s("<<bd*2 bd> sn> hh").fast(2).gain(.7),
  "[c2 a1 bb1 ~] ~"
  .echo(2, 1/16, 1)
  .legato(.4)
  .slow(2)
  .layer(h)
  .note().s('square')
  .cutoff(400).decay(.12).sustain(0)
  ,
  "[g2,[c3 eb3]]".iter(4)
  .echoWith(4, 1/8, (x,n)=>x.transpose(n*12).velocity(Math.pow(.4,n)))
  .legato(.1)
  .layer(h).note()
)
  .fast(2/3)
  .pianoroll({})`,Nr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos, bassline by BDP - The Bridge Is Over
samples({mad:'https://freesound.org/data/previews/22/22274_109943-lq.mp3'})
stack(
  stack(
  "c3*2 [[c3@1.4 bb2] ab2] gb2*2 <[[gb2@1.4 ab2] bb2] gb2>".legato(".5 1".fast(2)).velocity(.8),
  "0 ~".scale('c4 whole tone')
    .euclidLegato(3,8).slow(2).mask("x ~")
    .stutWith(8, 1/16, (x,n)=>x.scaleTranspose(n).velocity(Math.pow(.7,n)))
    .scaleTranspose("<0 1 2 3 4 3 2 1>")
    .fast(2)
    .velocity(.7)
    .legato(.5)
    .stut(3, .5, 1/8)
  ).transpose(-1).note().piano(),
  s("mad").slow(2)
).cpm(78).slow(4)
  
  .pianoroll()
`,Ir=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
const scale = cat('C3 dorian','Bb2 major').slow(4);
stack(
  "2*4".add(12).scale(scale)
  .off(1/8, scaleTranspose("2")).fast(2)
  .scaleTranspose("<0 1 2 1>").hush(),
  "<0 1 2 3>(3,8,2)"
  .scale(scale)
  .off(1/4, scaleTranspose("2,4")),
  "<0 4>(5,8)".scale(scale).transpose(-12)
)
  .velocity(".6 .7".fast(4))
  .legato("2")
  .scaleTranspose("<0>".slow(4))
  .transpose(5)
  .note().piano()
  .velocity(.8)
  .slow(2)
  .pianoroll({maxMidi:100,minMidi:20})`,Pr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
"<0 2 [4 6](3,4,1) 3*2>"
.scale('D minor')
.color('salmon')
.off(1/4, x=>x.scaleTranspose(2).color('green'))
.off(1/2, x=>x.scaleTranspose(6).color('steelblue'))
.legato(.5)
.echo(4, 1/8, .5)
.note().piano()
.pianoroll()`,Gr=`// Hirokazu Tanaka - World 1-1
stack(
  // melody
  \`<
  [e5 ~] [[d5@2 c5] [~@2 e5]] ~ [~ [c5@2 d5]] [e5 e5] [d5 c5] [e5 f5] [g5 a5]
  [~ c5] [c5 d5] [e5 [c5@2 c5]] [~ c5] [f5 e5] [c5 d5] [~ g6] [g6 ~]
  [e5 ~] [[d5@2 c5] [~@2 e5]] ~ [~ [c5@2 d5]] [e5 e5] [d5 c5] [a5 g5] [c6 [e5@2 d5]]
  [~ c5] [c5 d5] [e5 [c5@2 c5]] [~ c5] [f5 e5] [c5 d5] [~ [g6@2 ~] ~@2] [g5 ~] 
  [~ a5] [b5 c6] [b5@2 ~@2 g5] ~
  [f5 ~] [[g5@2 f5] ~] [[e5 ~] [f5 ~]] [[f#5 ~] [g5 ~]]
  [~ a5] [b5 c6] [b5@2 ~@2 g5] ~
  [eb6 d6] [~ c6] ~!2
  >\`
  .legato(.95),
  // sub melody
  \`<
  [~ g4]!2 [~ ab4]!2 [~ a4]!2 [~ bb4]!2 
  [~ a4]!2 [~ g4]!2 [d4 e4] [f4 gb4] ~!2
  [~ g4]!2 [~ ab4]!2 [~ a4]!2 [~ bb4]!2 
  [~ a4]!2 [~ g4]!2 [d4 e4] [f4 gb4] ~!2
  [~ c5]!4 [~ a4]!2 [[c4 ~] [d4 ~]] [[eb4 ~] [e4 ~]]
  [~ c5]!4 [~ eb5]!2 [g4*2 [f4 ~]] [[e4 ~] [d4 ~]]
  >\`,
  // bass
  \`<
  c3!7 a3 f3!2
  e3!2 ~!4
  c3!7 a3 f3!2
  e3!2 ~!4
  f3!2 e3!2 d3!2 ~!2
  f3!2 e3!2 ab3!2 ~!2
  >\`
  .legato(.5)
).fast(2).note()`,Mr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
samples({
  bell: { c6: 'https://freesound.org/data/previews/411/411089_5121236-lq.mp3' },
  bass: { d2: 'https://freesound.org/data/previews/608/608286_13074022-lq.mp3' }
})

stack(
  // bells
  "0".euclidLegato(3,8)
  .echo(3, 1/16, .5)
  .add(rand.range(0,12))
  .velocity(rand.range(.5,1))
  .legato(rand.range(.4,3))
  .scale(cat('D minor pentatonic')).note()
  .s('bell').gain(.6).delay(.2).delaytime(1/3).delayfeedback(.8),
  // bass
  "<D2 A2 G2 F2>".euclidLegatoRot(6,8,1).note().s('bass').clip(1).gain(.8)
)
  .slow(6)
  .pianoroll({minMidi:20,maxMidi:120,background:'transparent'})
  `,Ur=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
n(
  "a4 [a3 c3] a3 c3"
  .sub("<7 12 5 12>".slow(2))
  .off(1/4,x=>x.add(7))
  .off(1/8,x=>x.add(12))
)
  .slow(2)
  .legato(sine.range(0.3, 2).slow(28))
  .s("sawtooth square".fast(2))
  .cutoff(cosine.range(500,4000).slow(16))
  .gain(.5)
  .room(.5)
  `,Lr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
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
  "-7 0 -7 7".struct("x(5,8,2)").fast(2).sub(7)
  .scale(scales)
  .n()
  .s("sawtooth,square")
  .gain(.3).attack(0.01).decay(0.1).sustain(.5)
  .apply(filter1),
  "~@3 [<2 3>,<4 5>]"
  .echo(4,1/16,.7)
  .scale(scales)
  .n()
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
  .n()
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
// strudel disable-highlighting`,Wr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
"[-7*3],0,2,6,[8 7]"
.echoWith(4,1/4, (x,n)=>x
          .add(n*7)
          .velocity(1/(n+1))
          .legato(1/(n+1)))
.velocity(perlin.range(.5,.9).slow(8))
.stack("[22 25]*3"
       .legato(sine.range(.5,2).slow(8))
       .velocity(sine.range(.4,.8).slow(5))
       .echo(4,1/12,.5))
.scale(cat('D dorian','G mixolydian','C dorian','F mixolydian'))
.legato(1)
.slow(2)
.note().piano()
//.pianoroll({maxMidi:160})`,qr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
await samples('github:tidalcycles/Dirt-Samples/master/')
stack(
  s("bd:5,[~ <sd:1!3 sd:1(3,4,2)>],hh27(3,4)") // drums
  .speed(perlin.range(.7,.9)) // random sample speed variation
  //.hush()
  ,"<a1 b1*2 a1(3,8) e2>" // bassline
  .off(1/8,x=>x.add(12).degradeBy(.5)) // random octave jumps
  .add(perlin.range(0,.5)) // random pitch variation
  .superimpose(add(.05)) // add second, slightly detuned voice
  .n() // wrap in "n"
  .decay(.15).sustain(0) // make each note of equal length
  .s('sawtooth') // waveform
  .gain(.4) // turn down
  .cutoff(sine.slow(7).range(300,5000)) // automate cutoff
  //.hush()
  ,"<Am7!3 <Em7 E7b13 Em7 Ebm7b5>>".voicings('lefthand') // chords
  .superimpose(x=>x.add(.04)) // add second, slightly detuned voice
  .add(perlin.range(0,.5)) // random pitch variation
  .n() // wrap in "n"
  .s('sawtooth') // waveform
  .gain(.16) // turn down
  .cutoff(500) // fixed cutoff
  .attack(1) // slowly fade in
  //.hush()
  ,"a4 c5 <e6 a6>".struct("x(5,8)")
  .superimpose(x=>x.add(.04)) // add second, slightly detuned voice
  .add(perlin.range(0,.5)) // random pitch variation
  .n() // wrap in "n"
  .decay(.1).sustain(0) // make notes short
  .s('triangle') // waveform
  .degradeBy(perlin.range(0,.5)) // randomly controlled random removal :)
  .echoWith(4,.125,(x,n)=>x.gain(.15*1/(n+1))) // echo notes
  //.hush()
)
  .slow(3/2)`,zr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
samples({
  bd: ['bd/BT0AADA.wav','bd/BT0AAD0.wav','bd/BT0A0DA.wav','bd/BT0A0D3.wav','bd/BT0A0D0.wav','bd/BT0A0A7.wav'],
  sd: ['sd/rytm-01-classic.wav','sd/rytm-00-hard.wav'],
  hh: ['hh27/000_hh27closedhh.wav','hh/000_hh3closedhh.wav'],
  perc: ['perc/002_perc2.wav'],
}, 'github:tidalcycles/Dirt-Samples/master/');

"C^7 Am7 Dm7 G7".slow(2).voicings('lefthand')
  .stack("0@6 [<1 2> <2 0> 1]@2".scale('C5 major'))
  .n().slow(4)
  .s('0040_FluidR3_GM_sf2_file')
  .color('steelblue')
  .stack(
   "<-7 ~@2 [~@2 -7] -9 ~@2 [~@2 -9] -10!2 ~ [~@2 -10] -5 ~ [-3 -2 -10]@2>*2".scale('C3 major')
    .n().s('sawtooth').color('brown')
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
  `,Hr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
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
.pianoroll({vertical:1})`,Jr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
samples({ p: 'https://cdn.freesound.org/previews/648/648433_11943129-lq.mp3' })

s("p")
  .loopAt(32)
  .chop(128)
  .jux(rev)
  .shape(.4)
  .decay(.1)
  .sustain(.6)
  `,Yr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
stack(
    s("bd <sd cp>")
    .delay("<0 .5>")
    .delaytime(".16 | .33")
    .delayfeedback(".6 | .8")
  ).sometimes(x=>x.speed("-1"))`,Vr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
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
  ).sometimes(x=>x.speed("-1"))`,Kr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
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
  note(rand.range(0,12).struct("x(5,8)").scale('g2 minor pentatonic')).s('bell').begin(.05)
  .delay(.2).degradeBy(.4).gain(.4)
  .mask("<1 0>/8")
).slow(5)`,Xr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
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
)`,Qr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
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
)`,Zr=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
"c3 eb3(3,8) c4/2 g3*2"
.superimpose(
  x=>x.slow(2).add(12),
  x=>x.slow(4).sub(5)
).add("<0 1>/16")
.note().s('ocarina_vib').clip(1)
.release(.1).room(1).gain(.2)
.color("salmon | orange | darkseagreen")
.pianoroll({fold:0,autorange:0,vertical:0,cycles:12,smear:0,minMidi:40})
`,en=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
stack(
  s("bd*2,~ [cp,sd]").bank('RolandTR909'),
  
  s("hh:1*4").sometimes(fast("2"))
  .rarely(x=>x.speed(".5").delay(.5))
  .end(perlin.range(0.02,.05).slow(8))
  .bank('RolandTR909').room(.5)
  .gain("0.4,0.4(5,8)"),
  
  note("<0 2 5 3>".scale('G1 minor')).struct("x(5,8)")
  .s('sawtooth').decay(.1).sustain(0),
  
  note("<G4 A4 Bb4 A4>,Bb3,D3").struct("~ x*2").s('square').clip(1)
  .cutoff(sine.range(500,4000).slow(16)).resonance(10)
  .decay(sine.slow(15).range(.05,.2)).sustain(0)
  .room(.5).gain(.3).delay(.2).mask("<0 1@3>/8"),
  
  "0 5 3 2".sometimes(slow(2)).off(1/8,add(5)).scale('G4 minor').note()
  .decay(.05).sustain(0).delay(.2).degradeBy(.5).mask("<0 1>/16")
)`,tn=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
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
).reset("<x@7 x(5,8)>")`,sn=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
note("c3 eb3 g3 bb3").palindrome()
.s('sawtooth')
.jux(x=>x.rev().color('green').s('sawtooth'))
.off(1/4, x=>x.add(note("<7 12>/2")).slow(2).late(.005).s('triangle'))
//.delay(.5)
.fast(1).cutoff(sine.range(200,2000).slow(8))
.decay(.05).sustain(0)
.room(.6)
.delay(.5).delaytime(.1).delayfeedback(.4)
.pianoroll()`,rn=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
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

"<0 2 [4 6](3,4,1) 3*2>"
.off(1/4, add(2))
.off(1/2, add(6))
.scale('D minor')
.note()
//.pianoroll()
.csound('CoolSynth')`,nn=`
// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Felix Roos
// livecode.orc by Steven Yi
await loadOrc('github:kunstmusik/csound-live-code/master/livecode.orc')

stack(
  note("<C^7 A7 Dm7 Fm7>/2".voicings('lefthand'))
  .cutoff(sine.range(500,2000).round().slow(16))
  .euclidLegato(3,8).csound('FM1')
  ,
  note("<C2 A1 D2 F2>/2").ply(8).csound('Bass').gain("1 4 1 4")
  ,
  note("0 7 [4 3] 2".fast(2/3).off(".25 .125",add("<2 4 -3 -1>"))
  .slow(2).scale('A4 minor'))
  .legato(.25).csound('SynHarp')
  ,
  s("bd*2,[~ hh]*2,~ cp").bank('RolandTR909')
)`,on=`// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// "Arpoon" by Felix Roos
await samples('github:tidalcycles/Dirt-Samples/master')

"<<Am7 C^7> C7 F^7 [Fm7 E7b9]>".voicings('lefthand')
  .arp("[0,3] 2 [1,3] 2".fast(3)).legato(2)
  .add(perlin.range(0,0.2)).sub("<0 -12>/8")
  .note().cutoff(perlin.range(500,4000)).resonance(12)
  .gain("<.5 .8>*16")
  .decay(.16).sustain(0.5)
  .delay(.2)
  .room(.5).pan(sine.range(.3,.6))
  .s('piano').clip(1)
  .stack("<<A1 C2>!2 F2 [F2 E2]>".add.out("0 -5".fast(2)).add("0,.12").note().s('sawtooth').clip(1).cutoff(300))
  .slow(4)
  .stack(s("bd*4, [~ [hh hh? hh?]]*2,~ [sd ~ [sd:2? bd?]]").arp("0|1").bank('RolandTR909').gain(.5).slow(2))
`,an=Object.freeze(Object.defineProperty({__proto__:null,swimming:Sr,giantSteps:Tr,zeldasRescue:Er,caverave:Rr,sampleDrums:Fr,barryHarris:jr,blippyRhodes:Or,wavyKalimba:Dr,festivalOfFingers:Br,undergroundPlumber:$r,bridgeIsOver:Nr,goodTimes:Ir,echoPiano:Pr,sml1:Gr,randomBells:Mr,waa2:Ur,hyperpop:Lr,festivalOfFingers3:Wr,meltingsubmarine:qr,outroMusic:zr,bassFuge:Hr,chop:Jr,delay:Yr,orbit:Vr,belldub:Kr,dinofunk:Xr,sampleDemo:Qr,holyflute:Zr,flatrave:en,amensister:tn,juxUndTollerei:sn,csoundDemo:rn,loungeSponge:nn,arpoon:on},Symbol.toStringTag,{value:"Module"}));Ve();const ze=zs("https://pidxdsxphlhzjnzmifth.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZHhkc3hwaGxoempuem1pZnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTYyMzA1NTYsImV4cCI6MTk3MTgwNjU1Nn0.bqlw7802fsWRnqU5BLYtmXk_k-D1VFmbkHMywWc15NM"),He=[T(()=>import("./chunks/prebake.487e17f6.js").then(n=>n.O),["chunks/prebake.487e17f6.js","chunks/index.a0884559.js"]),T(()=>import("./chunks/index.5ac749b7.js"),["chunks/index.5ac749b7.js","chunks/voicings.375d8047.js","chunks/prebake.487e17f6.js","chunks/index.a0884559.js"]),T(()=>import("./chunks/index.6cdc910e.js"),["chunks/index.6cdc910e.js","chunks/prebake.487e17f6.js","chunks/index.a0884559.js"]),T(()=>import("./chunks/index.ad5e2c3f.js"),["chunks/index.ad5e2c3f.js","chunks/prebake.487e17f6.js","chunks/index.a0884559.js"]),T(()=>import("./chunks/index.0a1a223d.js"),["chunks/index.0a1a223d.js","chunks/prebake.487e17f6.js","chunks/index.a0884559.js"]),T(()=>import("./chunks/index.86355bc6.js"),["chunks/index.86355bc6.js","chunks/prebake.487e17f6.js","chunks/index.a0884559.js"]),T(()=>import("./chunks/osc.39f971cf.js"),["chunks/osc.39f971cf.js","chunks/index.a0884559.js","chunks/prebake.487e17f6.js"]),T(()=>import("./chunks/serial.1645b452.js"),["chunks/serial.1645b452.js","chunks/prebake.487e17f6.js","chunks/index.a0884559.js"]),T(()=>import("./chunks/index.70056326.js"),["chunks/index.70056326.js","chunks/prebake.487e17f6.js","chunks/index.a0884559.js"]),T(()=>import("./chunks/csound.a54d3d38.js"),["chunks/csound.a54d3d38.js","chunks/preload-helper.1de719f8.js","chunks/prebake.487e17f6.js","chunks/index.a0884559.js"]),T(()=>import("./chunks/csoundac.fb5b267a.js"),["chunks/csoundac.fb5b267a.js","chunks/prebake.487e17f6.js","chunks/index.a0884559.js","chunks/voicings.375d8047.js"])];Ke(Xe,{WebDirt:Js},...He);let _e=[];const ln=De();Promise.all([...He,ln]).then(n=>{_e=Object.entries(Qe()||{})});const cn=()=>Be().currentTime;async function hn(){try{const e=window.location.href.split("?")[1]?.split("#")?.[0],t=window.location.href.split("#")[1];if(t)return atob(decodeURIComponent(t||""));if(e)return ze.from("code").select("code").eq("hash",e).then(({data:s,error:r})=>{if(r&&console.warn("failed to load hash",err),s.length)return console.log("load hash from database",e),s[0].code})}catch(n){console.warn("failed to decode",n)}}function Je(){const n=Object.entries(an),e=r=>r[Math.floor(Math.random()*r.length)],[t,s]=e(n);return{name:t,code:s}}const{code:un,name:dn}=Je(),fn=_.exports.createContext(null);function Sn({embedded:n=!1}){const e=n||window.location!==window.parent.location,[t,s]=_.exports.useState(),[r,a]=_.exports.useState(),[l,h]=_.exports.useState(""),[f,i]=_.exports.useState(!1),[o,c]=_.exports.useState(!1),{code:d,setCode:u,scheduler:p,evaluate:g,activateCode:b,isDirty:y,activeCode:v,pattern:w,started:F,stop:B,error:I}=st({initialCode:"// LOADING",defaultOutput:Ze,getTime:cn,autolink:!0,beforeEval:()=>{et(),Te(),c(!0)},afterEval:()=>{c(!1)},onToggle:A=>!A&&Te(!1)});_.exports.useEffect(()=>{hn().then(A=>{A||h("intro"),D(`Welcome to Strudel! ${A?"I have loaded the code from the URL.":`A random code snippet named "${dn}" has been loaded!`} Press play or hit ctrl+enter to run it!`,"highlight"),u(A||un)})},[]),pn(_.exports.useCallback(async A=>{(A.ctrlKey||A.altKey)&&(A.code==="Enter"?(A.preventDefault(),rt(t),await b()):A.code==="Period"&&(B(),A.preventDefault()))},[b,B,t])),nt({view:t,pattern:w,active:F&&!v?.includes("strudel disable-highlighting"),getTime:()=>p.getPhase()});const G=_.exports.useCallback(A=>{u(A),F&&D("[edit] code changed. hit ctrl+enter to update")},[F]),ue=_.exports.useCallback(A=>{},[]),Ce=async()=>{await Be().resume(),F?(D("[repl] stopped. tip: you can also stop by pressing ctrl+dot","highlight"),B()):(D("[repl] started. tip: you can also start by pressing ctrl+enter","highlight"),b())},de={embedded:n,started:F,pending:o,isDirty:y,lastShared:r,activeCode:v,activeFooter:l,setActiveFooter:h,handleChangeCode:G,handleTogglePlay:Ce,handleUpdate:()=>{y&&b(),D("[repl] code updated! tip: you can also update the code by pressing ctrl+enter","highlight")},handleShuffle:async()=>{const{code:A,name:Q}=Je();D(`[repl] \u2728 loading random tune "${Q}"`),tt(),await De(),await g(A,!1)},handleShare:async()=>{const A=v||d;if(r===A){D("Link already generated!","error");return}const Q=We(12),{data:vn,error:fe}=await ze.from("code").insert([{code:A,hash:Q}]);if(fe){console.log("error",fe);const Z=`Error: ${fe.message}`;D(Z)}else{a(v||d);const Z=window.location.origin+"?"+Q;await navigator.clipboard.writeText(Z);const Se=`Link copied to clipboard: ${Z}`;alert(Se),D(Se,"highlight")}},isZen:f,setIsZen:i};return m.exports.jsx(fn.Provider,{value:de,children:m.exports.jsxs("div",{className:R("h-screen flex flex-col"),children:[m.exports.jsx(Cr,{context:de}),m.exports.jsx("section",{className:"grow flex text-gray-100 relative overflow-auto cursor-text pb-0",id:"code",children:m.exports.jsx(it,{value:d,onChange:G,onViewChanged:s,onSelectionChange:ue})}),I&&m.exports.jsx("div",{className:"text-red-500 p-4 bg-lineblack animate-pulse",children:I.message||"Unknown Error :-/"}),e&&!F&&m.exports.jsxs("button",{onClick:()=>Ce(),className:"text-white text-2xl fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[1000] m-auto p-4 bg-black rounded-md flex items-center space-x-2",children:[m.exports.jsx(qe,{className:"w-6 h-6"}),m.exports.jsx("span",{children:"play"})]}),!e&&m.exports.jsx(Zs,{context:de})]})})}function Ye(n,e,t=!1){_.exports.useEffect(()=>(document.addEventListener(n,e,t),()=>{document.removeEventListener(n,e,t)}),[e])}function pn(n){Ye("keydown",n,!0)}export{Sn as Repl,fn as ReplContext,_e as loadedSamples,Ye as useEvent};
