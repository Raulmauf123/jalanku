(()=>{
const KEY="jk_reports",SEQ="jk_seq",ST=["Terkirim","Diverifikasi","Disurvei","Dalam perbaikan","Selesai"];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let mem=[],photo="",coords=null,seq=412;window.jkSetCoords=c=>{coords=c};
try{const v=JSON.parse(localStorage.getItem(KEY)||"null");if(Array.isArray(v))mem=v;seq=+localStorage.getItem(SEQ)||412}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(mem));return true}catch(e){return false}};
const nid=()=>{seq++;try{localStorage.setItem(SEQ,seq)}catch(e){}return"JR-"+String(seq).padStart(4,"0")};
const mine=()=>mem.filter(r=>r.user===user);
const RP=$("rp"),MN=$("mn"),AD=$("ad"),LO=$("lo");
function isAdmin(){return !!user&&user.trim().toLowerCase()==="admin"}
function badge(){const b=document.querySelector('#vsc [data-k="lap"] .vb');if(!b)return;const n=user?(isAdmin()?mem.length:mine().length):0;b.textContent=n;b.style.display=n?"":"none";const lb=b.parentElement.querySelector(".vx"),t=isAdmin()?"Panel admin":"Laporan saya";if(lb)lb.textContent=t;b.parentElement.dataset.tip=t;const mb=document.querySelector('#mm button[data-i="r"]');if(mb)mb.textContent=t}
function shut(el){el.classList.remove("open");el.setAttribute("aria-hidden","true")}
function show(el){el.classList.add("open");el.setAttribute("aria-hidden","false")}
function shrink(f){return new Promise((ok,no)=>{const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,900/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext("2d").drawImage(im,0,0,c.width,c.height);ok(c.toDataURL("image/jpeg",.72))};im.onerror=no;im.src=fr.result};fr.onerror=no;fr.readAsDataURL(f)})}
function resetForm(){$("rf").reset();photo="";coords=null;$("rph").innerHTML='<input type="file" id="rfile" accept="image/*"><span style="display:flex;align-items:center;gap:10px"><svg viewBox="0 0 24 24"><path d="M4 8a2 2 0 012-2h2l1.5-2h5L16 6h2a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2z"/><circle cx="12" cy="13" r="3.5"/></svg>Ketuk untuk ambil atau pilih foto</span>';bindFile()}
function bindFile(){$("rfile").onchange=async e=>{const f=e.target.files&&e.target.files[0];if(!f)return;try{photo=await shrink(f);const inp=$("rfile");$("rph").innerHTML="";$("rph").appendChild(inp);const im=document.createElement("img");im.src=photo;im.alt="Pratinjau foto";$("rph").appendChild(im)}catch(err){photo="";toast("Foto tidak bisa dibaca, coba foto lain")}}}
window.openReport=function(){if(!user){openAuth();return}shut(MN);show(RP);setTimeout(()=>$("rlok").focus({preventScroll:true}),60)};
window.openMine=function(){if(!user){openAuth();return}shut(RP);syncServer();draw();show(MN)};
function draw(){const L=mine();$("mnsub").textContent="Pantau status laporan jalan rusak yang Anda kirim, "+user+".";$("mncnt").textContent=L.length?L.length+" laporan":"";
$("mnl").innerHTML=L.length?L.map(r=>{const d=new Date(r.ts).toLocaleString("id-ID",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});const th=r.foto?`<img decoding="async" class="th" src="${r.foto}" alt="Foto ${esc(r.id)}">`:`<div class="th"><svg viewBox="0 0 24 24"><path d="M12 21s6-5.5 6-10.5a6 6 0 10-12 0C6 15.5 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/></svg></div>`;
return`<div class="rc">${th}<div class="bd"><h3>${esc(r.id)} &middot; ${esc(r.jenis)}</h3><p class="mt">${esc(r.lok)}<br>Tingkat ${esc(r.tk)} &middot; ${d}</p>${r.desc?`<p class="mt">&ldquo;${esc(r.desc)}&rdquo;</p>`:""}<div class="stg" aria-hidden="true">${ST.map((s,i)=>`<i class="${i<=r.stage?"on":""}"></i>`).join("")}</div><span class="st${r.stage===4?" ok":""}">${ST[r.stage]}</span><div class="ac"><button type="button" data-a="d" data-id="${esc(r.id)}">Hapus</button></div></div></div>`}).join(""):`<p class="rempty">Belum ada laporan.<br>Mulai dengan menekan &ldquo;Laporan baru&rdquo;.</p>`;badge()}
$("mnl").onclick=e=>{const b=e.target.closest("button[data-a]");if(!b)return;const r=mem.find(x=>x.id===b.dataset.id&&x.user===user);if(!r)return;if(b.dataset.a==="n"&&r.stage<4){r.stage++;save();toast(r.id+": "+ST[r.stage])}else if(b.dataset.a==="d"){if(!r.local){toast("Laporan yang sudah terkirim hanya bisa dihapus petugas");return}mem=mem.filter(x=>x!==r);save();toast("Laporan "+r.id+" dihapus")}draw()};
$("rgps").onclick=()=>{if(!navigator.geolocation){toast("Perangkat ini tidak mendukung lokasi");return}const b=$("rgps");b.disabled=true;navigator.geolocation.getCurrentPosition(p=>{coords=[+p.coords.latitude.toFixed(5),+p.coords.longitude.toFixed(5)];const i=$("rlok");if(!i.value.trim())i.value="Titik "+coords[0]+", "+coords[1];toast("Lokasi didapat");b.disabled=false},()=>{toast("Izin lokasi ditolak, ketik alamat manual");b.disabled=false},{enableHighAccuracy:true,timeout:8000})};
$("rf").onsubmit=async e=>{e.preventDefault();const lok=$("rlok").value.trim();if(!lok){$("rlok").focus();return}
const r={id:"",ts:Date.now(),user,jenis:$("rjenis").value,tk:(document.querySelector('input[name="tk"]:checked')||{}).value||"Sedang",lok,co:coords,desc:$("rdesc").value.trim(),foto:photo,stage:0};
const sb=$("rf").querySelector('[type="submit"]');if(sb)sb.disabled=true;
try{const fd=new FormData();fd.append("jenis",r.jenis);fd.append("tingkat",r.tk);fd.append("lokasi",lok);fd.append("nama",user);fd.append("keterangan",r.desc);if(coords){fd.append("lat",coords[0]);fd.append("lng",coords[1])}if(photo){fd.append("foto",await(await fetch(photo)).blob(),"foto.jpg")}
const res=await(await fetch("api/laporan.php?action=save",{method:"POST",body:fd})).json();
if(res.status==="success"){r.id=res.no_tiket}else if(res.need_login){if(sb)sb.disabled=false;toast(res.message);setUser(null);openAuth();return}else{r.id=nid();r.local=true;toast(res.message||"Server menolak laporan, disimpan lokal")}}catch(err){r.id=nid();r.local=true;toast("Server tidak terjangkau, laporan disimpan lokal")}
if(sb)sb.disabled=false;
mem.unshift(r);let note="";if(!save()&&r.foto){r.foto="";if(save())note=" (foto tidak muat, tersimpan tanpa foto)"}
resetForm();shut(RP);draw();(window.fxOk||function(o){o.done();toast("Laporan terkirim: "+r.id)})({pre:"Mengirim laporan",preSub:"Laporanmu sedang dikirim ke petugas",wait:"Mengirim laporan…",title:"Laporan terkirim",sub:"Simpan nomor tiket ini untuk memantau status laporanmu."+note,ticket:r.id,btn:"Lihat laporan saya",done:()=>show(MN)})};
$("rpx").onclick=()=>shut(RP);$("mnx").onclick=()=>shut(MN);$("mnnew").onclick=()=>openReport();
[RP,MN,AD].forEach(o=>o.addEventListener("click",e=>{if(e.target===o)shut(o)}));
addEventListener("keydown",e=>{if(e.key==="Escape"){shut(RP);shut(MN);shut(AD);shut(LO);shut(SS)}});
bindFile();
/* ---- sinkron dengan database (api/laporan.php) ---- */
async function syncServer(){try{const j=await(await fetch("api/laporan.php?action=fetch",{cache:"no-store"})).json();if(j.status!=="success")return false;
const srv=j.data.map(d=>({id:d.no_tiket,ts:Date.parse(String(d.dibuat_pada).replace(" ","T"))||Date.now(),user:d.user||"",jenis:d.jenis,tk:d.tingkat,lok:d.lokasi,co:(d.latitude!=null&&d.longitude!=null)?[+d.latitude,+d.longitude]:null,desc:d.keterangan||"",foto:d.foto?"uploads/"+d.foto:"",stage:+d.stage}));
const ids=new Set(srv.map(r=>r.id));mem=srv.concat(mem.filter(r=>r.local&&!ids.has(r.id)));save();
if(MN.classList.contains("open"))draw();if(AD.classList.contains("open"))drawAdmin();badge();return true}catch(e){return false}}
window.jkSync=syncServer;syncServer();addEventListener("focus",syncServer);setInterval(syncServer,30000);
if(user){fetch("api/auth.php?action=me",{cache:"no-store"}).then(r=>r.json()).then(j=>{if(!j.nama||String(j.nama).toLowerCase()!==String(user).toLowerCase()){setUser(null);toast("Sesi berakhir, silakan masuk lagi")}}).catch(()=>{})}
/* sambungkan tombol yang sudah ada */
$("bl").onclick=()=>openReport();$("hl").onclick=()=>openReport();
const _st=setStep;setStep=function(s){_st(s);if(s<2){const c=document.querySelector("#txt .cta");if(c)c.onclick=()=>openReport()}};
const vc=$("vsc"),_vo=vc.onclick;vc.onclick=function(e){const b=e.target.closest(".vi");if(b&&b.dataset.k==="lap"){openMine();return}_vo.call(vc,e)};
const mm=$("mm");mm.insertAdjacentHTML("beforeend",'<button data-i="r">Laporan saya</button>');
mm.addEventListener("click",e=>{if(e.target.dataset&&e.target.dataset.i==="r"){e.stopImmediatePropagation();mm.classList.remove("o");openMine()}},true);
const _su2=setUser;setUser=function(n){_su2(n);if(!n)fetch("api/auth.php?action=logout",{method:"POST"}).catch(()=>{});if(!n){shut(RP);shut(MN);shut(AD);shut(LO)}badge();if(n&&isAdmin())setTimeout(()=>{openAdmin();toast("Masuk sebagai admin")},450)};
/* ---- admin ---- */
const _or=window.openReport,_om=window.openMine;
window.openReport=function(){if(isAdmin()){openAdmin();return}_or()};
window.openMine=function(){if(isAdmin()){openAdmin();return}_om()};
window.openAdmin=function(){if(!isAdmin())return;shut(RP);shut(MN);syncServer();drawAdmin();show(AD)};
$("afs").innerHTML='<option value="">Semua status</option>'+ST.map((s,i)=>`<option value="${i}">${s}</option>`).join("");
function drawAdmin(){const q=$("afq").value.trim().toLowerCase(),f=$("afs").value,c=ST.map((s,i)=>mem.filter(r=>r.stage===i).length);
$("ast").innerHTML=`<div class="t"><b>${mem.length}</b><span>Total laporan</span></div>`+ST.map((s,i)=>`<div><b>${c[i]}</b><span>${s}</span></div>`).join("");
const L=mem.filter(r=>(f===""||r.stage===+f)&&(!q||(r.id+" "+r.lok+" "+r.user+" "+r.jenis).toLowerCase().includes(q)));
$("adl").innerHTML=L.length?L.map(r=>{const d=new Date(r.ts).toLocaleString("id-ID",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});const th=r.foto?`<img decoding="async" class="th" src="${r.foto}" alt="Foto ${esc(r.id)}">`:`<div class="th"><svg viewBox="0 0 24 24"><path d="M12 21s6-5.5 6-10.5a6 6 0 10-12 0C6 15.5 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/></svg></div>`;
return`<div class="rc">${th}<div class="bd"><h3>${esc(r.id)} &middot; ${esc(r.jenis)}</h3><span class="by">Pelapor: ${esc(r.user)}</span><p class="mt">${esc(r.lok)}<br>Tingkat ${esc(r.tk)} &middot; ${d}</p>${r.desc?`<p class="mt">&ldquo;${esc(r.desc)}&rdquo;</p>`:""}<div class="stg" aria-hidden="true">${ST.map((s,i)=>`<i class="${i<=r.stage?"on":""}"></i>`).join("")}</div><div class="ac"><select data-a="s" data-id="${esc(r.id)}" aria-label="Ubah status ${esc(r.id)}">${ST.map((s,i)=>`<option value="${i}"${i===r.stage?" selected":""}>${s}</option>`).join("")}</select><button type="button" data-a="d" data-id="${esc(r.id)}">Hapus</button></div></div></div>`}).join(""):`<p class="rempty">${mem.length?"Tidak ada laporan yang cocok.":"Belum ada laporan dari warga."}</p>`;badge()}
$("adl").onchange=async e=>{const t=e.target;if(t.dataset.a!=="s"||!isAdmin())return;const r=mem.find(x=>x.id===t.dataset.id);if(!r)return;const nx=+t.value;
if(r.local){r.stage=nx;save();drawAdmin();toast(r.id+": "+ST[nx]);return}
try{const fd=new FormData();fd.append("tiket",r.id);fd.append("stage",nx);const j=await(await fetch("api/laporan.php?action=update_status",{method:"POST",body:fd})).json();
if(j.status==="success"){r.stage=nx;save();drawAdmin();toast(r.id+": "+ST[nx])}else{toast(j.message||"Gagal mengubah status");drawAdmin()}}catch(err){toast("Server tidak terjangkau");drawAdmin()}};
$("adl").onclick=async e=>{const b=e.target.closest("button[data-a=d]");if(!b||!isAdmin())return;const r=mem.find(x=>x.id===b.dataset.id);if(!r)return;
if(!r.local){try{const fd=new FormData();fd.append("tiket",r.id);const j=await(await fetch("api/laporan.php?action=delete",{method:"POST",body:fd})).json();if(j.status!=="success"){toast(j.message||"Gagal menghapus");return}}catch(err){toast("Server tidak terjangkau");return}}
mem=mem.filter(x=>x!==r);save();drawAdmin();toast("Laporan "+r.id+" dihapus")};
$("afs").onchange=drawAdmin;$("afq").oninput=drawAdmin;
$("adx").onclick=()=>shut(AD);$("adout").onclick=()=>{shut(AD);setUser(null);toast("Anda sudah keluar")};
/* ---- statistik ---- */
const SS=$("sts"),CC=["#22d3ee","#fbbf24","#64748b"],JN=["Lubang","Retak","Amblas","Genangan / drainase","Lainnya"],TN=["Ringan","Sedang","Berat"];
let stMode=null,stTab=0,stRk=0,stRg=7,stDay=6,stTok=0;
function sampleData(){const J=["Lubang","Lubang","Lubang","Retak","Retak","Amblas","Genangan / drainase","Lainnya"],T=["Ringan","Sedang","Sedang","Berat"],K=["Jl. Ahmad Yani","Jl. Ahmad Yani","Jl. Raya Narogong","Jl. Cut Meutia","Jl. KH. Noer Ali","Jl. Juanda","Jl. Raya Pekayon","Jl. Pondok Gede Raya"],G=[0,0,1,1,2,3,4,4,4],now=Date.now(),m0=new Date().setHours(0,0,0,0),DD=[0,0,1,2,2,3,4,5,6,1,2],o=[];for(let i=0;i<36;i++)o.push({ts:Math.min(now-1,m0-DD[(i*7)%11]*864e5+7*36e5+((i*5381e3)%(10*36e5))),jenis:J[(i*5)%J.length],tk:T[(i*3)%T.length],lok:K[(i*7)%K.length],stage:G[(i*4)%G.length]});return o}
const SAMPLE=sampleData();
const dayS=()=>{const d=new Date();d.setHours(0,0,0,0);return d.getTime()};
const perDay=(D,k,f)=>{const t=dayS();return Array.from({length:k},(_,i)=>{const s=t-(k-1-i)*864e5;return D.filter(r=>r.ts>=s&&r.ts<s+864e5&&(!f||f(r))).length})};
const fmt=(s,o)=>new Date(s).toLocaleDateString("id-ID",o);
const spark=(a,c)=>{const m=Math.max(1,...a),d="M"+a.map((v,i)=>(i/(a.length-1||1)*100).toFixed(1)+" "+(34-v/m*28).toFixed(1)).join("L");return`<svg viewBox="0 0 100 40" style="--c:${c}"><path class="ar" d="${d}L100 40L0 40Z"/><path class="ln" pathLength="1" d="${d}"/></svg>`};
const cnt=root=>root.querySelectorAll("[data-n]").forEach(e=>{const n=+e.dataset.n,s=e.dataset.s||"",t0=performance.now(),still=matchMedia("(prefers-reduced-motion:reduce)").matches;(function f(t){const p=still?1:Math.min(1,(t-t0)/900);e.textContent=Math.round(n*(1-Math.pow(1-p,3)))+s;if(p<1)requestAnimationFrame(f)})(t0)});
const locs=(D,sev)=>{const m=new Map();D.forEach(r=>{const k=String(r.lok||"").trim();if(!k)return;const o=m.get(k.toLowerCase())||{n:k,c:0,sc:0,b:0,r:[]};o.c++;o.sc+=TN.indexOf(r.tk)+1;if(r.tk==="Berat")o.b++;o.r.push(r);m.set(k.toLowerCase(),o)});return[...m.values()].sort((a,b)=>sev?b.sc-a.sc||b.c-a.c:b.c-a.c||b.sc-a.sc).slice(0,4)};
function pickDay(){const D=stMode==="real"?mem:SAMPLE,t=dayS();stDay=6;for(let i=6;i>=0;i--)if(D.some(r=>r.ts>=t-(6-i)*864e5&&r.ts<t-(5-i)*864e5)){stDay=i;break}}
function pSum(D){const n=D.length,c=ST.map((s,i)=>D.filter(r=>r.stage===i).length),pr=c[1]+c[2]+c[3],pc=Math.round(c[4]/n*100),wk=perDay(D,7);
const K=[["Total laporan",n,"",wk,CC[0],"+"+wk.reduce((a,b)=>a+b,0)+" dalam 7 hari"],["Selesai ditangani",pc,"%",perDay(D,7,r=>r.stage===4),"#2dd4a7",c[4]+" ruas sudah pulih"],["Sedang diproses",pr,"",perDay(D,7,r=>r.stage>0&&r.stage<4),CC[1],"disurvei dan diperbaiki"],["Belum diverifikasi",c[0],"",perDay(D,7,r=>r.stage===0),"#ff6b6b","menunggu petugas"]];
const jc=JN.map(j=>[j,D.filter(r=>r.jenis===j).length]).sort((a,b)=>b[1]-a[1]),T=36,t1=Math.round(jc[0][1]/n*T),t2=Math.min(T-t1,Math.round(jc[1][1]/n*T)),s3=[jc[0],jc[1],["Jenis lain",n-jc[0][1]-jc[1][1]]];
const L=locs(D,stRk),tl=locs(D,0)[0],br=D.filter(r=>r.tk==="Berat").length;
const I=[["Jenis dominan",`${jc[0][0]} jadi keluhan nomor satu`,`${Math.round(jc[0][1]/n*100)}% laporan menyangkut ${jc[0][0].toLowerCase()}${tl?`, dan ${esc(tl.n)} paling sering disebut warga (${tl.c} laporan).`:"."}`],["Progres penanganan",`${c[4]} dari ${n} laporan sudah tuntas`,`${pr} laporan sedang disurvei atau diperbaiki, sementara ${c[0]} lainnya masih menunggu verifikasi petugas.`],["Perlu didahulukan",`${br} kerusakan tingkat berat`,br?"Ruas berat paling berisiko bagi pengendara motor, terutama saat hujan dan malam hari.":"Belum ada laporan tingkat berat. Tetap pantau ruas yang paling sering dilaporkan."]];
return`<div class="kp">${K.map((k,i)=>`<div class="g kc in" style="--c:${k[4]};--d:${i}"><span>${k[0]}</span><b data-n="${k[1]}" data-s="${k[2]}">0</b><em>${k[5]}</em>${spark(k[3],k[4])}</div>`).join("")}</div>
<div class="two"><div class="g in" style="--d:4"><h3>Sebaran kerusakan</h3><div class="bg"><b data-n="${n}">0</b><span>laporan warga</span><u>${pc}% sudah beres</u></div>
<div class="sl" style="grid-template-columns:${Math.max(1,t1)}fr ${Math.max(1,t2)}fr ${Math.max(1,T-t1-t2)}fr">${s3.map((s,i)=>`<div style="--c:${CC[i]}"><small>${s[0]}</small><b>${s[1]}</b></div>`).join("")}</div>
<div class="tk">${Array.from({length:T},(_,k)=>`<i style="--k:${k};--c:${k<t1?CC[0]:k<t1+t2?CC[1]:CC[2]}"></i>`).join("")}</div>
<p class="ft">Diperbarui ${fmt(Date.now(),{day:"numeric",month:"long",year:"numeric"})}</p></div>
<div class="g in" style="--d:5"><div class="hd"><h3>Ruas jalan sorotan</h3><div class="mt"><button type="button" data-a="rk" data-v="0" class="${stRk?"":"on"}">Terbanyak</button><button type="button" data-a="rk" data-v="1" class="${stRk?"on":""}">Terparah</button></div></div>
${L.map((o,i)=>`<div class="lr in" style="--d:${i+6}"><span><b>${esc(o.n)}</b><small>${stRk?o.b+" berat · "+o.c+" laporan":o.c+" laporan masuk"}</small></span>${spark(perDay(o.r,7),stRk?"#ff6b6b":CC[0])}<em>${stRk?o.sc:Math.round(o.c/n*100)+"%"}</em></div>`).join("")}</div></div>
<div class="ins">${I.map((x,i)=>`<div class="g in" style="--d:${i+8}"><span class="tg">${x[0]}</span><h4>${x[1]}</h4><p>${x[2]}</p></div>`).join("")}</div>`}
function pCal(D){const t=dayS(),ds=Array.from({length:7},(_,i)=>t-(6-i)*864e5),by=ds.map(s=>D.filter(r=>r.ts>=s&&r.ts<s+864e5)),R=by[stDay].slice().sort((a,b)=>b.ts-a.ts).slice(0,8);
return`<h3 class="sh in">Kalender laporan masuk</h3><div class="dy">${ds.map((s,i)=>`<button type="button" data-a="dy" data-v="${i}" class="g in${i===stDay?" on":""}" style="--d:${i}"><small>${fmt(s,{weekday:"long"})}</small><b>${fmt(s,{day:"numeric",month:"short"})}</b><em>${by[i].length} laporan</em></button>`).join("")}</div>
<div class="g tb"><div class="th"><span>Lokasi</span><span>Jenis</span><span>Tingkat</span><span>Status</span></div>${R.length?R.map((r,i)=>`<div class="tr in" style="--d:${i+3}"><span><b>${esc(r.lok)}</b><small>${new Date(r.ts).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})}${r.id?" · "+esc(r.id):""}</small></span><span>${esc(r.jenis)}</span><span><u class="bd t${Math.max(0,TN.indexOf(r.tk))}">${esc(r.tk)}</u></span><span class="pg">${ST.map((s,k)=>`<i class="${k<=r.stage?"on":""}"></i>`).join("")}<small>${ST[r.stage]}</small></span></div>`).join(""):'<p class="rempty">Tidak ada laporan pada hari ini.</p>'}</div>`}
function pTr(D){const k=stRg,a=perDay(D,k),m=Math.max(2,...a),sum=a.reduce((x,y)=>x+y,0),av=sum/k,X=i=>10+i/(k-1)*580,Y=v=>175-v/m*150,d="M"+a.map((v,i)=>X(i).toFixed(1)+" "+Y(v).toFixed(1)).join("L"),bi=a.indexOf(Math.max(...a)),t=dayS(),R=D.filter(r=>r.ts>=t-(k-1)*864e5),jt=JN.map(j=>[j,R.filter(r=>r.jenis===j).length]).sort((x,y)=>y[1]-x[1])[0],ys=Y(av).toFixed(1);
const kv=[["Total periode",sum+" laporan"],["Rata-rata harian",av.toFixed(1).replace(".",",")],["Hari tersibuk",fmt(t-(k-1-bi)*864e5,{day:"numeric",month:"short"})+" ("+a[bi]+")"],["Jenis terbanyak",jt[1]?jt[0]:"-"],["Tingkat berat",R.filter(r=>r.tk==="Berat").length+" laporan"],["Dalam perbaikan",R.filter(r=>r.stage===3).length+" laporan"],["Selesai",R.filter(r=>r.stage===4).length+" laporan"],["Belum diverifikasi",R.filter(r=>r.stage===0).length+" laporan"]];
return`<div class="g in"><div class="hd"><div><h3>Tren laporan harian</h3><p class="ft" style="margin:4px 0 0">${fmt(t-(k-1)*864e5,{day:"numeric",month:"short"})} – ${fmt(t,{day:"numeric",month:"short"})}</p></div><div class="mt">${[7,14,30].map(v=>`<button type="button" data-a="rg" data-v="${v}" class="${v===k?"on":""}">${v}H</button>`).join("")}</div></div>
<div class="cv" id="cv"><svg viewBox="0 0 600 200"><defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22d3ee" stop-opacity=".35"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></linearGradient></defs>${[0,1,2,3].map(i=>`<line class="gl" x1="10" x2="590" y1="${25+i*50}" y2="${25+i*50}"/>`).join("")}<line class="av" x1="10" x2="590" y1="${ys}" y2="${ys}"/><path d="${d}L590 200L10 200Z" fill="url(#cg)"/><path class="ln" pathLength="1" style="--c:#22d3ee;stroke-width:2.2" d="${d}"/><line id="xl" class="xl" y1="10" y2="190"/><circle id="xc" class="xc" r="4.5"/></svg><span class="tag" style="top:${(ys/2).toFixed(1)}%">${av.toFixed(1).replace(".",",")}</span><div class="tt" id="tt"></div></div>
<div class="kv">${kv.map(x=>`<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join("")}</div></div>`}
function bindCh(D){const cv=$("cv");if(!cv)return;const k=stRg,a=perDay(D,k),m=Math.max(2,...a),t=dayS(),xl=$("xl"),xc=$("xc"),tt=$("tt");
const mv=e=>{const b=cv.getBoundingClientRect(),i=Math.max(0,Math.min(k-1,Math.round(((e.clientX-b.left)/b.width*600-10)/580*(k-1)))),x=10+i/(k-1)*580,y=175-a[i]/m*150,s=t-(k-1-i)*864e5,R=D.filter(r=>r.ts>=s&&r.ts<s+864e5);
xl.setAttribute("x1",x);xl.setAttribute("x2",x);xc.setAttribute("cx",x);xc.setAttribute("cy",y);cv.classList.add("hv");tt.style.left=Math.min(70,x/6)+"%";
tt.innerHTML=`<b>${fmt(s,{weekday:"short",day:"numeric",month:"short"})}</b><div><span>Total</span><i>${a[i]}</i></div>`+JN.map(j=>[j,R.filter(r=>r.jenis===j).length]).filter(x=>x[1]).slice(0,3).map(x=>`<div><span>${x[0]}</span><i>${x[1]}</i></div>`).join("")};
cv.onpointermove=mv;cv.onpointerdown=mv;cv.onpointerleave=()=>cv.classList.remove("hv")}
const SK='<i class="sk" style="height:112px"></i>';
function paint(skel){const real=stMode==="real",D=real?mem:SAMPLE,n=D.length,tok=++stTok,g=$("sg");
$("stsub").textContent=real?"Dihitung dari laporan yang masuk di browser ini."+(n?"":" Belum ada laporan."):"Data contoh untuk ilustrasi. Kirim laporan untuk melihat data nyata.";
$("stn").innerHTML=["Ringkasan","Kalender","Tren"].map((x,i)=>`<button type="button" data-t="${i}" class="${i===stTab?"on":""}">${x}</button>`).join("");
$("stt").innerHTML=`<button type="button" data-m="real" class="${real?"on":""}">Data nyata (${mem.length})</button><button type="button" data-m="demo" class="${real?"":"on"}">Data contoh</button>`;
if(!n){g.innerHTML='<p class="rempty">Belum ada data untuk ditampilkan.<br>Kirim laporan atau pilih “Data contoh”.</p>';return}
const go=()=>{if(tok!==stTok)return;g.innerHTML=[pSum,pCal,pTr][stTab](D);cnt(g);bindCh(D)};
if(skel){g.innerHTML=`<div class="kp">${SK.repeat(4)}</div><div class="two"><i class="sk" style="height:230px"></i><i class="sk" style="height:230px"></i></div>`;setTimeout(go,480)}else go()}
window.openStats=function(){shut(RP);shut(MN);shut(AD);if(!stMode)stMode=mem.length?"real":"demo";stTab=0;stRk=0;stRg=7;pickDay();paint(true);show(SS)};
$("stn").onclick=e=>{const b=e.target.closest("button[data-t]");if(!b)return;stTab=+b.dataset.t;paint(true)};
$("stt").onclick=e=>{const b=e.target.closest("button[data-m]");if(!b)return;stMode=b.dataset.m;pickDay();paint(true)};
$("sg").onclick=e=>{const b=e.target.closest("button[data-a]");if(!b)return;const a=b.dataset.a,v=+b.dataset.v;if(a==="rk")stRk=v;else if(a==="dy")stDay=v;else stRg=v;paint(false)};
$("stclose").onclick=()=>shut(SS);SS.addEventListener("click",e=>{if(e.target===SS)shut(SS)});
/* konfirmasi sebelum keluar */
window.askLogout=function(){if(!user)return;$("lon").textContent=user;$("loi").textContent=user.trim()[0].toUpperCase();show(LO);setTimeout(()=>$("locancel").focus({preventScroll:true}),60)};
$("locancel").onclick=()=>shut(LO);
$("loyes").onclick=()=>{shut(LO);setUser(null);toast("Anda sudah keluar")};
LO.addEventListener("click",e=>{if(e.target===LO)shut(LO)});
const accBtn=()=>user?askLogout():openAuth();
$("vp").onclick=accBtn;$("bm").onclick=accBtn;$("mc").onclick=accBtn;
mm.addEventListener("click",e=>{if(e.target.dataset&&e.target.dataset.i==="a"){e.stopImmediatePropagation();mm.classList.remove("o");accBtn()}},true);
/* akun admin: PIN 4 digit di kotak-kotak, nama "admin" tidak bisa didaftarkan */
document.querySelectorAll("#auth form").forEach(f=>f.addEventListener("submit",e=>{
const reg=f.dataset.t==="Daftar",ni=f.querySelector("input"),n=ni.value.trim();
if(f.dataset.pinOk==="1"){delete f.dataset.pinOk;return}
e.preventDefault();e.stopImmediatePropagation();
const net=()=>toast("Server tidak terjangkau, coba lagi");
if(n.toLowerCase()==="admin"){
 if(reg){toast("Nama pengguna tidak tersedia");return}
 const ps=[...f.querySelectorAll(".pin input")],p=ps.map(i=>i.value).join("");
 if(p.length<4){toast("Masukkan 4 digit PIN");(ps.find(i=>!i.value)||ps[0]).focus();return}
 const fa=new FormData();fa.append("pin",p);
 fetch("api/auth.php?action=login",{method:"POST",body:fa}).then(r=>r.json()).then(j=>{if(j.status==="success"){f.dataset.pinOk="1";f.requestSubmit()}else{if(window.pinBad)window.pinBad();toast(j.message||"PIN admin salah")}}).catch(net);
 return}
const pw=f.querySelector('input[type="password"]:not([maxlength])'),fd=new FormData();
fd.append("nama",n);fd.append("password",pw?pw.value:"");
if(reg){const em=f.querySelector('input[type="email"]');fd.append("email",em?em.value.trim():"")}
fetch("api/auth.php?action="+(reg?"daftar":"masuk"),{method:"POST",body:fd}).then(r=>r.json()).then(j=>{if(j.status==="success"){ni.value=j.nama;f.dataset.pinOk="1";f.requestSubmit()}else toast(j.message||"Gagal masuk")}).catch(net)},true));
/* tombol "Cek status tiket" di kotak masuk */
document.addEventListener("click",e=>{const b=e.target.closest("[data-cek]");if(!b)return;e.preventDefault();$("ax").click();const cs=$("cs"),ci=$("csi");if(cs)cs.scrollIntoView({behavior:"smooth",block:"center"});setTimeout(()=>{if(ci)ci.focus({preventScroll:true})},450)});
badge();
})();
