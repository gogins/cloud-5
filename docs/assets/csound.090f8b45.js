import{P as r,l as a,_ as S,j as h,D as w}from"./index.9be083e6.js";const b=`<CsoundSynthesizer>
<CsInstruments>

sr=48000
ksmps=64
nchnls=2
0dbfs=1

</CsInstruments>
</CsoundSynthesizer>`,_=`; returns value of given key in given "string map"
; keymap("freq", "note/c3/freq/220/gain/0.5")
; yields "220"
opcode keymap, S, SS
  Skey, Smap xin
  idelimiter = strindex(Smap, strcat(Skey, "/"))
  ifrom = idelimiter + strlen(Skey) + 1
  Svalue = strsub(Smap, ifrom, strlen(Smap))
  Svalue = strsub(Svalue, 0, strindex(Svalue, "/"))
  xout Svalue
endop

; TODO add incredibly dope synths
instr organ
    iduration = p3
    ifreq = p4
    igain = p5
    ioct = octcps(ifreq)

    asig = vco2(igain, ifreq, 12, .5) ; my edit
    kpwm = oscili(.1, 5)
    asig = vco2(igain, ifreq, 4, .5 + kpwm)
    asig += vco2(igain/4, ifreq * 2)

    ; filter
    ; idepth = 2
    ; acut = transegr:a(0, .005, 0, idepth, .06, -4.2, 0.001, .01, -4.2, 0) ; filter envelope
    ; asig = zdf_2pole(asig, cpsoct(ioct + acut), 0.5)

    ; amp envelope
    iattack = .001
    irelease = .05
    asig *= linsegr:a(0, iattack, 1, iduration, 1, irelease, 0)

    out(asig, asig)

endin

instr triangle
  iduration = p3
  ifreq = p4
  igain = p5
  ioct = octcps(ifreq)
  
  asig = vco2(igain, ifreq, 12, .5)
  
  ; amp envelope
  iattack = .001
  irelease = .05
  asig *= linsegr:a(0, iattack, 1, iduration, 1, irelease, 0)
  
  out(asig, asig)
endin

instr pad
    iduration = p3
    ifreq = p4
    igain = p5
    ioct = octcps(ifreq)

    asig = vco2(igain, ifreq, 0)

    ; amp envelope
    iattack = .5
    irelease = .1
    asig *= linsegr:a(0, iattack, 1, iduration, 1, irelease, 0)
    
    idepth = 2
    acut = transegr:a(0, .005, 0, idepth, .06, -4.2, 0.001, .01, -4.2, 0)
    asig = zdf_2pole(asig, 1000, 2)

    out(asig, asig)
endin


gisine	ftgen	0, 0, 4096, 10, 1

instr bow
    kpres = 2
    krat = 0.16
    kvibf = 6.12723
    
    kvib  linseg 0, 0.5, 0, 1, 1, p3-0.5, 1	
    kvamp = kvib * 0.01
    asig  wgbow .7, p4, kpres, krat, kvibf, kvamp, gisine
    asig = asig*p5
    outs asig, asig
endin


instr Meta
    Smap = strget(p6)
    Sinstrument = keymap("s", Smap)
    schedule(Sinstrument, 0, p3, p4, p5)
    ; TODO find a way to pipe Sinstrument through effects
endin`;let d,e;r.prototype._csound=function(n){return n=n||"triangle",c(),this.onTrigger((i,t)=>{if(!e){a("[csound] not loaded yet","warning");return}if(typeof t.value!="object")throw new Error("csound only support objects as hap values");let{gain:s=.8}=t.value;s*=.2;const o=Math.round(w(t)),p=Object.entries({...t.value,freq:o}).flat().join("/"),u=`i ${[`"${n}"`,i-h().currentTime,t.duration+0,o,s,`"${p}"`].join(" ")}`;e.inputMessage(u)})};async function T(n=""){await c(),n&&(n=`${n}`,await(e==null?void 0:e.evalCode(n)))}r.prototype.define("csound",(n,i)=>i.csound(n),{composable:!1,patternified:!0});function C(n,i){const[t]=i;if(n==="message"&&(["[commit: HEAD]"].includes(t)||t.startsWith("--Csound version")||t.startsWith("libsndfile")||t.startsWith("sr =")||t.startsWith("0dBFS")||t.startsWith("audio buffered")||t.startsWith("writing")||t.startsWith("SECTION 1:")))return;let s="info";t.startsWith("error:")&&(s="error"),a(`[csound] ${t||""}`,s)}async function q(){if(window.__csound__)a("[load] Using external Csound","warning"),e=window.__csound__;else{const{Csound:n}=await S(()=>import("./csound.ce40f0ca.js"),[]);e=await n({audioContext:h()}),e.removeAllListeners("message"),["message"].forEach(i=>e.on(i,(...t)=>C(i,t))),await e.setOption("-m0d"),await e.setOption("--sample-accurate"),await e.compileCsdText(b),await e.compileOrc(_),await e.start()}return e}async function c(){return d=d||q(),d}let g={};async function W(n){if(await c(),typeof n!="string")throw new Error("loadOrc: expected url string");if(n.startsWith("github:")){const[i,t]=n.split("github:");n=`https://raw.githubusercontent.com/${t}`}g[n]||(g[n]=fetch(n).then(i=>i.text()).then(i=>e.compileOrc(i))),await g[n]}r.prototype._csoundm=function(...n){return c(),this.onTrigger((i,t,s)=>{var m,v;if(!e){a("[csoundm] Csound is not yet loaded","warning");return}if(typeof t.value!="object")throw new Error("csoundm only supports objects as hap values");const o=n[0],p=i-s,l=t.duration.valueOf(),u=w(t),y=(Math.log(u/261.62558)/Math.log(2)+8)*12-36,k=127*((v=(m=t.context)==null?void 0:m.velocity)!=null?v:.9);let f=`i ${o} ${p} ${l} ${y} ${k} 
`;a(`[csoundm] ${f}`),e?e.inputMessage(f):a("[csoundm] Csound is not defined!",warning)})};r.prototype.define("csoundm",(n,i)=>i.csoundm(n),{composable:!1,patternified:!0});export{T as csound,W as loadOrc};
//# sourceMappingURL=csound.090f8b45.js.map
