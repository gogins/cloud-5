import{l,k as u,N as w}from"./prebake.5a4b2523.js";import"./voicings.8325b92a.js";import"./index.ee58e7ae.js";let _,d,a=!1;function y(e){a=e,globalThis.__csound__&&(_=globalThis.__csound__)}function $(e,n){l(e,n),_&&_.message(`[Strudel ${n}] ${e}`)}function P(e){return(Math.log(e/261.62558)/Math.log(2)+8)*12-36}function f(e){let n=P(e);return Math.round(n)}function v(){d||globalThis.__csoundac__&&(d=globalThis.__csoundac__,l(`[csacLoad]: using global ${d}`,"information"))}function h(e,n){n.resize(e.voices());for(let t=0;t<e.voices();++t){let i=e.getPitch(t);n.getPitch(t),n.setPitch(t,i)}}function p(e){v(),a&&l("[csacChord] Creating Chord...","debug");let n=d.chordForName(e);return a&&l(`[csacChord] ${n.toString()}`,"debug"),n}const N=u("chordT",(e,n,t)=>t.withHap(i=>{let o=e.T(n);if(a){let r=`[chordT]: ${e.toString()} ${e.eOP().name()} T(${n}) =>
[chordT]: ${o.toString()} ${o.name()}`;$(r,"debug")}return h(o,e),i.withValue(()=>i.value)})),I=u("chordI",(e,n,t)=>t.withHap(i=>{let o=e.I(n);if(a){let r=`[chordI]: ${e.toString()} ${e.eOP().name()} I(${n}) =>
[chordI]: ${o.toString()} ${o.eOP().name()}`;$(r,"debug")}return h(o,e),i.withValue(()=>i.value)})),H=u("chordK",(e,n)=>n.withHap(t=>{let i=e.K();if(a){let o=`[chordK]: ${e.toString()} ${e.eOP().name()} K =>
[ChordK]: ${i.toString()} ${i.eOP().name()}`;$(o,"debug")}return h(i,e),t.withValue(()=>t.value)})),k=u("chordQ",(e,n,t,i)=>i.withHap(o=>{let r=e.Q(t,n,1);if(a){let c=`[chordQ]: ${e.toString()} ${e.eOP().name()} Q(${t}) =>
[chordQ]: ${r.toString()} ${r.eOP().name()}`;$(c,"debug")}return h(r,e),o.withValue(()=>o.value)})),C=u("chordNV",(e,n)=>n.withHap(t=>{let i;try{i=w(t)}catch{l("[chordNV] not a note!","warning");return}let o=f(i),r=d.closestPitch(o,e),c=t.withValue(()=>r);return a&&l(`[chordNV]: ${e.toString()} ${e.eOP().name()} old note: ${o} new note: ${c.value}`,"debug"),c})),M=u("chordN",(e,n)=>n.withHap(t=>{let i;try{i=w(t)}catch{l("[chordN] not a note!","warning");return}let o=f(i),r=d.conformToPitchClassSet(o,e.epcs()),c=t.withValue(()=>r);return a&&l(`[chordN]: ${e.toString()} ${e.eOP().name()} old note: ${o} new note: ${c.value}`,"debug"),c}));function O(e){v(),a&&l("[csacScale] Creating Scale...","debug");let n=d.scaleForName(e);return a&&l(`[csacScale] ${n.name()}`,"debug"),n}const q=u("scaleS",(e,n,t,i)=>i.withHap(o=>{let r=n.chord(t,e.voices(),3);return a&&l(`[scaleS]: old chord: ${e.toString()} scale step: ${t} new chord: ${r.toString()}`,"debug"),h(r,e),o.withValue(()=>o.value)})),K=u("scaleT",(e,n,t,i)=>i.withHap(o=>{let r=e.transpose_degrees(n,t,3);return a&&l(`[scaleT]: old chord: ${n.toString()} scale steps: ${t} new chord: ${r.toString()}`,"debug"),h(r,n),o.withValue(()=>o.value)})),Q=u("scaleM",(e,n,t,i)=>i.withHap(o=>{let r=n.eOP(),c=e.modulations(r),s=e,g=c.size(),m=-1;if(g>0){if(m=t%g,s=c.get(m),a){let V=`
[scaleM]: modulating in: ${e.toString()} ${e.name()} 
[scaleM]: from pivot:    ${r.toString()} ${r.name()}
[scaleM]: modulations:   ${g} => ${m}
[scaleM]: modulated to:  ${s.toString()} ${s.name()}
`;$(V,"debug")}h(s,e)}return o.withValue(()=>o.value)})),z=u("scaleN",(e,n)=>n.withHap(t=>{let i;try{i=w(t)}catch{l("[scaleN] not a note!","warning");return}let o=f(i),r=d.conformToPitchClassSet(o,e),c=t.withValue(()=>r);return a&&l(`[scaleN]: old note: ${o} new note: ${r}`,"debug"),c}));function F(e,n){a&&l("[csacPitv] Creating PITV group...","debug"),v();let t=new d.PITV;return t.initialize(e,n,1,!1),t.P=0,t.I=0,t.T=0,t.V=0,t.list(!0,!1,!1),t}const x=u("pitvP",(e,n,t)=>t.withHap(i=>(e.P=n,a&&l(`[pitvP]: ${e.P}`,"debug"),i.withValue(()=>i.value)))),L=u("pitvI",(e,n,t)=>t.withHap(i=>(e.I=n,l(`[pitvI]: ${e.I}`,"debug"),i.withValue(()=>i.value)))),D=u("pitvT",(e,n,t)=>t.withHap(i=>(e.T=n,a&&l(`[pitvT]: ${e.T}`,"debug"),i.withValue(()=>i.value)))),R=u("pitvV",(e,n,t)=>t.withHap(i=>(e.V=n,a&&l(`[pitvV]: ${e.V}`,"debug"),i.withValue(()=>i.value)))),j=u("pitvNV",(e,n)=>n.withHap(t=>{let i;try{i=w(t)}catch{l("[pitvNV] not a note!","warning");return}let o=f(i),r=e.toChord(e.P,e.I,e.T,e.V,!0).get(0),c=d.closestPitch(o,r),s=t.withValue(()=>c);return a&&l(`[pitvNV]: old note: ${o} new note: ${c} result.value: ${s.value}`,"debug"),s})),A=u("pitvN",(e,n)=>n.withHap(t=>{let i;try{i=w(t)}catch{l("[pitvNV] not a note!","warning");return}let o=f(i),c=e.toChord(e.P,e.I,e.T,e.V,!1).get(1).epcs(),s=d.conformToPitchClassSet(o,c),g=t.withValue(()=>s);return a&&l(`[pitvN]: old note: ${o} new note: ${s} result.value: ${g.value}`,"debug"),g}));export{I as chordI,H as chordK,M as chordN,C as chordNV,k as chordQ,N as chordT,p as csacChord,h as csacCopy,y as csacDebugging,v as csacLoad,F as csacPitv,O as csacScale,f as frequencyToMidiInteger,P as frequencyToMidiReal,L as pitvI,A as pitvN,j as pitvNV,x as pitvP,D as pitvT,R as pitvV,Q as scaleM,z as scaleN,q as scaleS,K as scaleT};