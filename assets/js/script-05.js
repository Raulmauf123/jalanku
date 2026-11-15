(()=>{
const F=document.getElementById("fx");if(!F)return;
const $q=s=>F.querySelector(s),T0=$q(".t0"),T1=$q(".t1"),S0=$q(".s0"),S1=$q(".s1"),N=$q("#fxn"),P=$q("#fxp"),Q=$q("#fxq"),BW=$q(".bw b"),BD=$q(".bd"),DG=[...F.querySelectorAll(".bx span b")];
const ttl=(el,txt,cls)=>{const w=String(txt).split(" "),l=w.pop();el.textContent=w.length?w.join(" ")+" ":"";const g=document.createElement("span");g.className=cls;g.textContent=l;el.appendChild(g)};
let T=[],busy=false,cur=null;
const later=(f,ms)=>T.push(setTimeout(f,ms));
function end(){if(!cur)return;const d=cur.done;cur=null;T.forEach(clearTimeout);T=[];busy=false;F.classList.remove("on","rdy");F.setAttribute("aria-hidden","true");try{if(d)d()}catch(e){console.error(e)}}
window.fxOk=function(o){
 if(busy)return;busy=true;cur=o||{};
 const still=matchMedia("(prefers-reduced-motion:reduce)").matches,fast=!!cur.fast,tk=!!cur.ticket,sp=fast?.5:1;
 ttl(T0,cur.pre||"Memproses data","g0");ttl(T1,cur.title||"Berhasil","g1");
 S0.textContent=cur.preSub||"Mohon tunggu sebentar";S1.textContent=cur.sub||"";
 BW.textContent=cur.wait||"Memproses…";BD.textContent=cur.btn||"Berhasil";
 if(tk)N.textContent=cur.ticket;Q.textContent="Salin";
 const dg=String(cur.digits||(tk?cur.ticket.replace(/\D/g,"").slice(-4):"")||"\u2022\u2022\u2022\u2022").padStart(4,"\u2022").slice(-4);DG.forEach((e,i)=>e.textContent=dg[i]);
 F.className="";F.style.setProperty("--sp",sp);void F.offsetWidth;
 F.classList.add("on","run");if(tk)F.classList.add("tk");F.setAttribute("aria-hidden","false");
 const okMs=still?80:Math.round(4700*sp);
 later(()=>F.classList.add("ok"),okMs);
 if(tk)later(()=>{F.classList.add("rdy");P.focus({preventScroll:true})},okMs+(still?100:900));
 else later(end,okMs+(still?600:fast?1300:1800));
};
P.onclick=()=>{if(F.classList.contains("rdy"))end()};
Q.onclick=()=>{const ok=m=>{Q.textContent=m;setTimeout(()=>{Q.textContent="Salin"},1600)};try{navigator.clipboard.writeText(N.textContent).then(()=>ok("Tersalin \u2713"),()=>ok("Gagal"))}catch(e){ok("Gagal")}};
addEventListener("keydown",e=>{if(e.key==="Escape"&&F.classList.contains("rdy"))end()});
/* PIN admin di form masuk */
const lf=document.querySelector("#auth form.fl");
if(lf){
 const un=lf.querySelector('input[type="text"]'),pw=lf.querySelector('input[type="password"]'),pf=pw.closest(".fld"),pr=lf.querySelector(".pinw"),pb=lf.querySelector(".pin"),ps=[...pb.querySelectorAll("input")],go=()=>setTimeout(()=>lf.querySelector(".btn").click(),140);
 const sync=()=>{const a=un.value.trim().toLowerCase()==="admin";pw.required=!a;pf.style.display=a?"none":"";pr.classList.toggle("on",a)};
 un.addEventListener("input",sync);
 lf.addEventListener("reset",()=>setTimeout(()=>{sync();ps.forEach(x=>x.classList.remove("f"))},0));
 ps.forEach((el,i)=>{
  el.addEventListener("input",()=>{const d=el.value.replace(/\D/g,"").slice(-1);el.value=d;el.classList.toggle("f",!!d);if(d&&i<3)ps[i+1].focus();else if(d&&i===3&&ps.every(x=>x.value))go()});
  el.addEventListener("keydown",e=>{if(e.key==="Backspace"&&!el.value&&i>0){e.preventDefault();ps[i-1].value="";ps[i-1].classList.remove("f");ps[i-1].focus()}else if(e.key==="ArrowLeft"&&i>0){e.preventDefault();ps[i-1].focus()}else if(e.key==="ArrowRight"&&i<3){e.preventDefault();ps[i+1].focus()}});
  el.addEventListener("focus",()=>el.select());
  el.addEventListener("paste",e=>{const t=((e.clipboardData||window.clipboardData).getData("text")||"").replace(/\D/g,"").slice(0,4);if(!t)return;e.preventDefault();ps.forEach((x,k)=>{x.value=t[k]||"";x.classList.toggle("f",!!t[k])});ps[Math.min(t.length,3)].focus();if(t.length===4)go()});
 });
 window.pinBad=()=>{pb.classList.add("bad");setTimeout(()=>{pb.classList.remove("bad");ps.forEach(x=>{x.value="";x.classList.remove("f")});ps[0].focus()},450)};
 sync();
}
})();
