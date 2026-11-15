const STEPS=[
 {n:"Warga",e:"Untuk warga Kota Bekasi",h:["Jalan rusak?","Laporkan saja."],p:"Ikuti perjalanan satu laporan, dari warga mengirim foto sampai jalannya mulus lagi. Semuanya bisa dipantau dari ponsel.",c:[["Laporan masuk","1.248"],["Sudah diperbaiki","86%"],["Rata-rata respons","3 hari"]]},
 {n:"Lapor",e:"Langkah 1 Lapor",h:["Foto lubangnya,","kirim lokasinya."],p:"Warga cukup mengambil foto dan menandai titik di peta. Laporan langsung masuk dengan nomor tiket yang bisa dipantau.",c:[["Nomor tiket","JR-0412"],["Lokasi","Jl. Ahmad Yani"],["Status","Terkirim"]]},
 {n:"Verifikasi",e:"Langkah 2 Verifikasi",h:["Dicek petugas,","dipastikan valid."],p:"Petugas memeriksa foto dan lokasi supaya laporan tidak ganda, lalu menentukan tingkat kerusakannya.",c:[["Jenis kerusakan","Lubang"],["Tingkat","Sedang"],["Laporan ganda","Tidak ada"]]},
 {n:"Survei",e:"Langkah 3 Survei lapangan",h:["Disurvei,","diukur di lapangan."],p:"Tim turun ke lokasi untuk mengukur panjang dan kedalaman kerusakan. Hasilnya langsung tercatat di laporan Anda.",c:[["Panjang","2,4 m"],["Kedalaman","8 cm"],["Prioritas","Tinggi"]]},
 {n:"Perbaikan",e:"Langkah 4 Perbaikan",h:["Dijadwalkan,","segera diperbaiki."],p:"Pekerjaan masuk jadwal perbaikan, dan Anda mendapat notifikasi saat tim mulai bekerja.",c:[["Aspal hotmix","Siap"],["Tim perbaikan","Berangkat"],["Estimasi","2 hari"]]},
 {n:"Selesai",e:"Langkah 5 Selesai",h:["Selesai dan","terdokumentasi."],p:"Setiap perbaikan ditutup dengan foto sesudah, jadi Anda bisa membandingkan kondisi sebelum dan sesudahnya.",c:[["Status","Selesai"],["Waktu penanganan","3 hari"],["Foto sesudah","Tersedia"]]}
];
const $=id=>document.getElementById(id);
const C=Math.cos(Math.PI/6);let S=36,items,floor,W,H,cam={x:0,y:0},cur=0,tgt=0,lastStep=-1;
const P=(x,y,z=0)=>[(x-y)*C*S,(x+y)*.5*S-z*S];
function shade(h,f){let n=parseInt(h.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;if(f<1){r*=f;g*=f;b*=f}else{const t=f-1;r+=(255-r)*t;g+=(255-g)*t;b+=(255-b)*t}return`rgb(${r|0},${g|0},${b|0})`}
const poly=(a,f)=>`<polygon points="${a.map(p=>p.map(v=>v.toFixed(1)).join(",")).join(" ")}" fill="${f}"/>`;
const add=(k,s)=>items.push([k,s]);
function box(x,y,z,w,d,h,c){R3.push(["b",x,y,z,w,d,h,c]);const a=P(x,y,z+h),b=P(x+w,y,z+h),e=P(x+w,y+d,z+h),f=P(x,y+d,z+h),g=P(x,y+d,z),i=P(x+w,y+d,z),j=P(x+w,y,z);add(x+w+y+d+z*.3,poly([a,b,e,f],shade(c,1.12))+poly([f,e,i,g],shade(c,.92))+poly([b,j,i,e],shade(c,.78)))}
var NPCN=0,PLN=0,face={x:1,a:0},dirS=1,lastFx=9,lastFa=9;
function chr(x,y,col,k=0,o){const[sx,sy]=P(x,y,0),sh=`<ellipse rx="${S*.3}" ry="${S*.15}" fill="rgba(0,0,0,.15)"/>`,bd=`<rect x="${-S*.2}" y="${-S*.85}" width="${S*.4}" height="${S*.8}" rx="${S*.18}" fill="${col}"/>`,hd=`<circle cy="${-S*1.02}" r="${S*.19}" fill="#f2cba8"/><path d="M${-S*.19} ${-S*1.05}a${S*.19} ${S*.19} 0 0 1 ${S*.38} 0z" fill="#2b2a28"/>`,tf=`<g transform="translate(${sx.toFixed(1)} ${(sy+k).toFixed(1)})">`;
 if(o&&o.me){const w=o.w||0,fx=o.fx,ay=o.ay,L1=Math.max(0,w)*S*.1,R1=Math.max(0,-w)*S*.1,ex=fx*S*.07,ey=-S*.99,er=S*.03,eo=(1-ay).toFixed(2);
  const ft=`<rect x="${-S*.17}" y="${-S*.08}" width="${S*.14}" height="${S*.13}" rx="${S*.05}" fill="#2b2a28" transform="translate(${(fx*L1*.5).toFixed(2)} ${(-L1).toFixed(2)})"/><rect x="${S*.03}" y="${-S*.08}" width="${S*.14}" height="${S*.13}" rx="${S*.05}" fill="#2b2a28" transform="translate(${(fx*R1*.5).toFixed(2)} ${(-R1).toFixed(2)})"/>`;
  return tf+sh+ft+bd+hd+`<circle cy="${-S*1.02}" r="${S*.19}" fill="#2b2a28" opacity="${ay.toFixed(2)}"/><circle cx="${(ex-S*.06).toFixed(2)}" cy="${ey}" r="${er}" fill="#2b2a28" opacity="${eo}"/><circle cx="${(ex+S*.06).toFixed(2)}" cy="${ey}" r="${er}" fill="#2b2a28" opacity="${eo}"/></g>`}
 if(o&&o.n!=null){return tf+sh+`<g class="nb" style="--d:-${(o.n*.83%3).toFixed(2)}s;--t:${(3+o.n%3*.6).toFixed(1)}s">${bd}<g class="hd" style="--d:-${(o.n*1.37%4).toFixed(2)}s">${hd}</g></g></g>`}
 return tf+sh+bd+hd+`</g>`}
const npc=(x,y,c)=>R3.push(["n",x,y,c])&&add(x+y+.6,chr(x,y,c,0,{n:NPCN++}));
function plant(x,y){R3.push(["p",x,y]);const[sx,sy]=P(x,y,.5);add(x+y+.4,`<g class="pl" style="--d:-${(PLN++*1.1%3.4).toFixed(1)}s"><circle cx="${sx}" cy="${sy-S*.5}" r="${S*.45}" fill="#6a9a52"/><circle cx="${sx+S*.2}" cy="${sy-S*.8}" r="${S*.3}" fill="#7fb064"/></g>`);box(x-.2,y-.2,0,.4,.4,.5,"#b8744a")}
function pill(x,y,z,t){R3.push(["l",x,y,z,t]);const[sx,sy]=P(x,y,z),w=t.length*6.6+34;add(999,`<g transform="translate(${sx} ${sy})"><g class="pf" style="--d:-${(PLN++*.9%3.6).toFixed(1)}s"><rect x="${-w/2}" y="-13" width="${w}" height="26" rx="13" fill="#fff" opacity=".95"/><circle cx="${-w/2+13}" r="4" fill="#f26a1b"/><text x="${-w/2+24}" y="4" font-size="11" font-weight="600" fill="#1c1917" font-family="Plus Jakarta Sans,sans-serif">${t}</text></g></g>`)}
const PATH=[[2,6],[6,6],[8,3],[14,3],[15,5],[21,5],[22,2],[28,2],[29,4],[35,4],[36,3],[41,3]];
let cum=[0];for(let i=1;i<PATH.length;i++)cum.push(cum[i-1]+Math.hypot(PATH[i][0]-PATH[i-1][0],PATH[i][1]-PATH[i-1][1]));
const L=cum[cum.length-1];
function at(d){d=Math.max(0,Math.min(L,d));let i=1;while(i<cum.length-1&&cum[i]<d)i++;const t=(d-cum[i-1])/(cum[i]-cum[i-1]||1),a=PATH[i-1],b=PATH[i];return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,i]}
function build(){
 items=[];R3=[];NPCN=0;PLN=0;S=innerWidth<800?Math.max(24,Math.min(34,innerWidth/13)):Math.min(40,innerWidth/34);
 const q=(a,b,c,d,f)=>(R3.push(["q",a,b,c,d,f]),poly([P(a,b),P(c,b),P(c,d),P(a,d)],f));
 let f=q(-8,-4,46,11,"var(--floor)");
 for(let x=-8;x<=46;x+=2)f+=`<polyline points="${P(x,-4)} ${P(x,11)}" stroke="rgba(120,80,40,.07)" fill="none"/>`;
 for(let y=-4;y<=11;y+=2)f+=`<polyline points="${P(-8,y)} ${P(46,y)}" stroke="rgba(120,80,40,.07)" fill="none"/>`;
 f+=q(-3,8,12,9.6,"#4a4540");
 for(let i=1;i<=5;i++){const x=6+7*(i-1);f+=q(x,-1,x+6.4,7,"#fbf3ea");}
 floor=f;
 for(let i=0;i<10;i++)box(0,0,i*.8,4,4,.8,i%2?"#ece6de":"#34302c");
 box(3.5,.5,0,.6,3,9.4,"#f26a1b");box(1,1,8,2,2,.4,"#f26a1b");
 [[-1.5,2],[5.5,6.5],[8,-2.5]].forEach(a=>plant(a[0],a[1]));
 for(let i=1;i<=5;i++){const x=6+7*(i-1);box(x,-1,0,6.4,.3,1.3,"#f58a45");box(x,-1,0,.3,8,1.3,"#f58a45")}
 const r1=6;box(r1+1,.6,0,4,1,1.1,"#f6e7d8");box(r1+4.5,-.6,0,.2,1.3,2.3,"#2b2a28");npc(r1+3,.2,"#2f5d8a");
 for(let j=0;j<4;j++)box(r1+1+j*1.2,5,0,.9,.9,.6,"#f58a45");npc(r1+1.4,5.2,"#4a6fa5");npc(r1+3.8,5.2,"#c46a3a");pill(r1+3,2.5,3.2,"Lapor");
 const r2=13;box(r2+1,.4,0,2.2,1,.9,"#f6e7d8");npc(r2+2,.1,"#2f8a6a");box(r2+3.6,3.2,0,2,1,.55,"#cfe6dc");box(r2+3.5,3,0,.1,.1,2.3,"#999");npc(r2+3,3.8,"#2f8a6a");plant(r2+.8,6.4);pill(r2+3,1.5,3,"Verifikasi");
 const r3=20;box(r3+.8,.5,0,3,1,.9,"#fff");box(r3+1,.6,.9,.8,.6,.5,"#e1d9cf");box(r3+2.2,.6,.9,.6,.6,.8,"#cfd8e0");npc(r3+3.4,.2,"#f0f0f0");
 box(r3+3.8,3,0,.4,.4,2.4,"#fff");box(r3+3.8,4.6,0,.4,.4,2.4,"#fff");box(r3+3.8,3,2.4,.4,2,.4,"#fff");box(r3+4.4,3.2,0,1.4,1.4,.5,"#cfe6dc");pill(r3+3,1.5,3,"Survei");
 const r4=27;box(r4+.6,-.8,0,5,.5,2.6,"#e7d9c8");["#f26a1b","#4a8bd6","#6aa26a","#e8b83a","#c46a9a"].forEach((c,j)=>[.6,1.3,2].forEach(z=>box(r4+.8+j*.95,-.3,z,.75,.12,.35,c)));
 box(r4+1,1.4,0,4,.9,1.1,"#f6e7d8");npc(r4+3,.9,"#2f5d8a");box(r4+1,5.4,0,.9,.9,.6,"#f58a45");box(r4+2.2,5.4,0,.9,.9,.6,"#f58a45");npc(r4+1.4,5.6,"#7a5a9a");pill(r4+3,3,3.3,"Perbaikan");
 const r5=34;box(r5+1.5,.8,0,3,1,1.1,"#f6e7d8");box(r5+2.2,.9,1.1,.7,.5,.4,"#2b2a28");npc(r5+3,.4,"#2f5d8a");plant(r5+5.3,.8);box(r5+1,5.4,0,.9,.9,.6,"#f58a45");pill(r5+3,3,3,"Selesai");
 items.sort((a,b)=>a[0]-b[0]);
 $("fl").innerHTML=floor;
 const pts=PATH.map(p=>P(p[0],p[1],.17).map(v=>v.toFixed(1)).join(",")).join(" L");
 $("pb").setAttribute("d","M"+pts);PP=PATH.map(p=>P(p[0],p[1],.17).join(","));$("pb").setAttribute("stroke","rgba(242,106,27,.22)");$("pb").setAttribute("stroke-width",S*.4);
 $("pa").setAttribute("stroke","#f26a1b");$("pa").setAttribute("stroke-width",S*.4);
 W=innerWidth;H=innerHeight;bv++;
}
function trackTop(){return $("track").getBoundingClientRect().top+scrollY}
function progress(){const m=$("track").offsetHeight-innerHeight;return m>0?Math.max(0,Math.min(1,(scrollY-trackTop())/m)):0}
var txtT=0;
function renderTxt(){const s=lastStep,d=STEPS[s],t=$("txt");t.classList.remove("in","out");void t.offsetWidth;
 t.innerHTML=`<p class="ey">${d.e}</p><h1>${d.h[0]}<span>${d.h[1]}</span></h1><p class="p">${d.p}</p><div class="card">${d.c.map(r=>`<div><i>${r[0]}</i><b>${r[1]}</b></div>`).join("")}</div>`;
 t.classList.add("in");
 const cb=document.createElement("button");cb.className="cta";cb.textContent=["Buat laporan","Kirim laporan","Lihat status","Lihat hasil survei","Pantau perbaikan","Buat laporan sekarang"][s]+" \u2192";cb.onclick=()=>user?go(Math.min(5,s+1)):openAuth();t.querySelector(".card").after(cb);
}
function setStep(s){
 if(s===lastStep)return;const first=lastStep===-1;lastStep=s;
 if(first||rmQ.matches){renderTxt()}
 else if(!txtT){const t=$("txt");t.classList.remove("in");t.classList.add("out");txtT=setTimeout(()=>{txtT=0;renderTxt()},230)}
 [...$("bar").children].forEach((e,i)=>e.className=i===s?"on":i<s?"done":"");
 sideSet(s);
}
function ovOpen(){for(const id of["auth","pt","pd","sts","ad","mn","rp","lo"]){const e=document.getElementById(id);if(e&&e.classList.contains("open"))return 1}const f=document.getElementById("fx");return f&&f.classList.contains("on")?1:0}
var PP=[],bv=0,lastBv=-1,lastCur=-1,lastCx=NaN,lastCy=NaN,lastK=0,lastT=0,IN=[],IK=[],meG=null,E={},rmQ=matchMedia("(prefers-reduced-motion:reduce)");
function syncIt(){const it=E.it||(E.it=$("it"));it.innerHTML=items.map(a=>"<g>"+a[1]+"</g>").join("")+'<g id="me"></g>';IN=Array.from(it.children);meG=IN.pop();IK=items.map(a=>a[0])}
function frame(){
 const now=performance.now(),dt=lastT?Math.min(100,now-lastT):16.667;lastT=now;
 const trk=E.t||(E.t=$("track")),sd=E.s||(E.s=$("side")),nv=E.n||(E.n=document.querySelector("nav"));
 const tr=trk.getBoundingClientRect(),ih=innerHeight,sy=scrollY,mh=trk.offsetHeight-ih;
 const inT=tr.top<ih*.6&&tr.bottom>ih*.4;
 sd.classList.toggle("off",!inT);(E.sv||(E.sv=$("sv"))).classList.toggle("live",!(tr.top>ih||tr.bottom<0));nv.classList.toggle("s",sy>40);
 if(tr.top>ih||tr.bottom<0||ovOpen()){requestAnimationFrame(frame);return}
 tgt=mh>0?Math.max(0,Math.min(1,-tr.top/mh)):0;
 const rm=rmQ.matches,ka=rm?1:1-Math.pow(1-.09,dt/16.667),kc=rm?1:1-Math.pow(1-.14,dt/16.667);
 cur+=(tgt-cur)*ka;if(Math.abs(tgt-cur)<1e-5)cur=tgt;
 const d=Math.max(0,Math.min(1,(cur-.03)/.94))*L,[x,y,i]=at(d);
 setStep(x<6?0:Math.min(5,((x-6)/7|0)+1));
 const[sx,sy2]=P(x,y),k=Math.abs(tgt-cur)>.0008?Math.sin(d*5)*S*.06:0;
 cam.x+=(sx-cam.x)*kc;cam.y+=(sy2-cam.y)*kc;
 if(Math.abs(sx-cam.x)<.01)cam.x=sx;if(Math.abs(sy2-cam.y)<.01)cam.y=sy2;
 if(tgt>cur+.0008)dirS=1;else if(tgt<cur-.0008)dirS=-1;
 {const a0=PATH[i-1],b0=PATH[i],dw=b0[0]-a0[0],dv=b0[1]-a0[1],hx=(dw-dv)*dirS,hy=(dw+dv)*dirS,tx=hx>=0?1:-1,ta=hy<0?1:0,kf=rm?1:1-Math.pow(1-.18,dt/16.667);
  face.x+=(tx-face.x)*kf;face.a+=(ta-face.a)*kf;if(Math.abs(tx-face.x)<.01)face.x=tx;if(Math.abs(ta-face.a)<.01)face.a=ta}
 if(G.on){r3(x,y,i,d,Math.abs(tgt-cur)>.0008,dt,now);requestAnimationFrame(frame);return}
 if(bv===lastBv&&cur===lastCur&&cam.x===lastCx&&cam.y===lastCy&&k===lastK&&face.x===lastFx&&face.a===lastFa){requestAnimationFrame(frame);return}
 if(lastBv!==bv){syncIt();lastBv=bv}
 lastCur=cur;lastCx=cam.x;lastCy=cam.y;lastK=k;lastFx=face.x;lastFa=face.a;
 const mobile=W<800;
 (E.c||(E.c=$("cam"))).setAttribute("transform",`translate(${(W*(mobile?.5:.68)-cam.x).toFixed(1)} ${(H*(mobile?.25:.56)-cam.y).toFixed(1)})`);
 (E.pa||(E.pa=$("pa"))).setAttribute("d","M"+PP.slice(0,i).concat([P(x,y,.17).join(",")]).join(" L"));
 const key=x+y+.5;let n=0;while(n<IK.length&&IK[n]<=key)n++;
 const ref=IN[n]||null;if(meG.nextSibling!==ref)E.it.insertBefore(meG,ref);
 meG.innerHTML=chr(x,y,"#f26a1b",-Math.abs(k),{me:1,fx:face.x,ay:face.a,w:k/(S*.06||1)});
 const sc="scaleX("+cur.toFixed(3)+")";(E.p||(E.p=document.querySelectorAll("#sp i,#mp i"))).forEach(e=>e.style.transform=sc);
 requestAnimationFrame(frame);
}
var R3=[],G={on:0,ang:0,amp:0,w:0,h:0};
function load3(){const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";s.onload=()=>{try{init3()}catch(e){fail3(e)}};s.onerror=()=>{};document.head.appendChild(s)}
function fail3(e){console.warn("3D tidak aktif, memakai tampilan SVG",e);G.on=0;const c=$("c3");if(c)c.remove();$("sv").style.display="";bv++;lastBv=-1}
function init3(){
 const T=THREE,st=$("stage"),cv=document.createElement("canvas");cv.id="c3";cv.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;visibility:hidden";
 const rd=new T.WebGLRenderer({canvas:cv,antialias:innerWidth>=800,alpha:true,powerPreference:"high-performance"}),mob=innerWidth<800;rd.shadowMap.autoUpdate=false;
 rd.setClearColor(0,0);rd.shadowMap.enabled=true;rd.shadowMap.type=T.PCFSoftShadowMap;
 const sc=new T.Scene(),cm=new T.PerspectiveCamera(30,1,1,400),hemi=new T.HemisphereLight(0xfff4e6,0xcdb79c,.55),sun=new T.DirectionalLight(0xfff0dd,.55);
 sun.castShadow=true;sun.shadow.mapSize.set(mob?1024:1536,mob?1024:1536);const sh=sun.shadow.camera;sh.left=sh.bottom=-15;sh.right=sh.top=15;sh.near=1;sh.far=90;sun.shadow.bias=-.0005;sun.shadow.normalBias=.03;
 sc.add(hemi,sun,sun.target);
 const mm={},mat=c=>mm[c]||(mm[c]=new T.MeshLambertMaterial({color:c}));
 const nc=document.createElement("canvas");nc.width=nc.height=256;{const x=nc.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,256,256);for(let i=0;i<3000;i++){const g=205+Math.random()*50|0;x.fillStyle="rgba("+g+","+g+","+g+",.55)";x.fillRect(Math.random()*256,Math.random()*256,2,2)}}
 const ntx=new T.CanvasTexture(nc);ntx.wrapS=ntx.wrapT=T.RepeatWrapping;
 const nz=(a,b)=>{const t=ntx.clone();t.needsUpdate=true;t.repeat.set(a,b);return t};
 const gm=new T.MeshLambertMaterial({color:0xefe3d5}),base=new T.MeshBasicMaterial({color:0xf5cfb0}),pa=new T.MeshBasicMaterial({color:0xf26a1b});
 const root=new T.Group();sc.add(root);const NP=[],PL=[],LB=[],DR=[];
 const sh1=m=>{m.castShadow=m.receiveShadow=true;return m};
 const MG={};
 function mg(c,w,h,d,px,py,pz){const m=MG[c]||(MG[c]={p:[],n:[],u:[],i:[],o:0}),g=new T.BoxGeometry(w,h,d),p=g.attributes.position.array,n=g.attributes.normal.array,u=g.attributes.uv.array,ix=g.index.array;for(let k=0;k<p.length;k+=3){m.p.push(p[k]+px,p[k+1]+py,p[k+2]+pz);m.n.push(n[k],n[k+1],n[k+2])}for(let k=0;k<u.length;k++)m.u.push(u[k]);for(let k=0;k<ix.length;k++)m.i.push(ix[k]+m.o);m.o+=p.length/3;g.dispose()}
 function flush(){for(const c in MG){const m=MG[c],g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute(m.p,3));g.setAttribute("normal",new T.Float32BufferAttribute(m.n,3));g.setAttribute("uv",new T.Float32BufferAttribute(m.u,2));g.setIndex(m.i);root.add(sh1(new T.Mesh(g,mat(c))))}}
 function mk(col,ex){const g=new T.Group(),sk=mat("#f2cba8"),dk=mat("#2b2a28"),cy=(a,b,h,m)=>sh1(new T.Mesh(new T.CylinderGeometry(a,b,h,12),m)),sp=(r,m)=>sh1(new T.Mesh(new T.SphereGeometry(r,14,10),m));
  const body=cy(.2,.24,.62,mat(col));body.position.y=.64;const sho=sp(.2,mat(col));sho.position.y=.95;sho.scale.y=.6;
  const head=new T.Group();head.position.y=1.14;const hm=sp(.19,sk),hr=sh1(new T.Mesh(new T.SphereGeometry(.2,16,12,0,Math.PI*2,0,Math.PI*.5),dk));hr.rotation.x=-.4;hr.position.y=.02;head.add(hm,hr);
  if(ex)[-.07,.07].forEach(e=>{const ey=new T.Mesh(new T.SphereGeometry(.026,8,6),dk);ey.position.set(e,-.01,.178);head.add(ey)});
  const lim=(x,y,r,h,m)=>{const p=new T.Group();p.position.set(x,y,0);const l=cy(r,r,h,m);l.position.y=-h/2;p.add(l);return p};
  const L=lim(-.1,.36,.075,.36,mat("#3a3a44")),R=lim(.1,.36,.075,.36,mat("#3a3a44")),AL=lim(-.27,.93,.055,.4,mat(col)),AR=lim(.27,.93,.055,.4,mat(col));
  [L,R].forEach(p=>{const f=sh1(new T.Mesh(new T.BoxGeometry(.13,.07,.2),dk));f.position.set(0,-.36,.04);p.add(f)});
  g.add(body,sho,head,L,R,AL,AR);return{g,body,head,L,R,AL,AR}}
 function ptx(t){const w=t.length*6.6+34,c=document.createElement("canvas"),k=3;c.width=w*k;c.height=26*k;const x=c.getContext("2d"),tx=new T.CanvasTexture(c);
  const dr=()=>{x.setTransform(k,0,0,k,0,0);x.clearRect(0,0,w,26);x.beginPath();x.arc(13,13,13,Math.PI/2,Math.PI*1.5);x.arc(w-13,13,13,-Math.PI/2,Math.PI/2);x.closePath();x.fillStyle="rgba(255,255,255,.95)";x.fill();x.beginPath();x.arc(13,13,4,0,7);x.fillStyle="#f26a1b";x.fill();x.fillStyle="#1c1917";x.font='600 11px "Plus Jakarta Sans",system-ui,sans-serif';x.textBaseline="middle";x.fillText(t,24,14);tx.needsUpdate=true};
  dr();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(dr);return{tx,w}}
 R3.forEach((a,n)=>{const t=a[0];
  if(t==="q"){const w=a[3]-a[1],d=a[4]-a[2];
   if(a[5].indexOf("var")===0){const m=sh1(new T.Mesh(new T.BoxGeometry(w,.3,d),gm));m.castShadow=false;m.position.set(a[1]+w/2,-.15,a[2]+d/2);gm.map=nz(14,4);root.add(m)}
   else mg(a[5],w,.06,d,a[1]+w/2,.03,a[2]+d/2)}
  else if(t==="b"){const[,x,y,z,w,d,h,c]=a,add=(y0,y1)=>mg(c,w,h,y1-y0,x+w/2,z+h/2,(y0+y1)/2);
   if(w===.3&&d===8&&y===-1&&!z){const X=x+w/2,hw=.95;let yc=3;for(let q=1;q<PATH.length;q++){const A=PATH[q-1],B=PATH[q];if(A[0]!==B[0]&&(A[0]-X)*(B[0]-X)<=0){yc=A[1]+(X-A[0])/(B[0]-A[0])*(B[1]-A[1]);break}}
    add(y,yc-hw);add(yc+hw,y+d);const pm=mat("#c9540f"),wd=mat("#8a5a3c"),kb=mat("#e8c46a");
    [-1,1].forEach(s=>mg("#c9540f",.34,1.95,.2,X,.975,yc+s*hw));
    mg("#c9540f",.34,.22,hw*2+.2,X,1.86,yc);
    const lf=s=>{const g=new T.Group();g.position.set(X,0,yc+s*(hw-.1));const l=sh1(new T.Mesh(new T.BoxGeometry(.07,1.72,hw-.1),wd));l.position.set(0,.86,-s*(hw-.1)/2);const k=new T.Mesh(new T.SphereGeometry(.05,8,6),kb);k.position.set(.06,.9,-s*(hw-.2));g.add(l,k);root.add(g);return g};
    DR.push({a:lf(-1),b:lf(1),x:X,o:0})}
   else add(y,y+d)}
  else if(t==="n"){const c=mk(a[3]);c.g.position.set(a[1],0,a[2]);c.g.rotation.y=Math.PI/4+(NP.length%3-1)*.6;root.add(c.g);NP.push({c,ph:NP.length*1.7})}
  else if(t==="p"){const g=new T.Group();g.position.set(a[1],.5,a[2]);const f1=sh1(new T.Mesh(new T.SphereGeometry(.45,14,10),mat("#6a9a52"))),f2=sh1(new T.Mesh(new T.SphereGeometry(.3,12,8),mat("#7fb064")));f1.position.y=.5;f2.position.set(.14,.8,-.14);g.add(f1,f2);root.add(g);PL.push({g,ph:PL.length*1.9})}
  else if(t==="l"){const o=ptx(a[4]),s=new T.Sprite(new T.SpriteMaterial({map:o.tx,transparent:true,depthTest:false}));s.scale.set(o.w/36,26/36,1);s.position.set(a[1],a[3],a[2]);s.renderOrder=10;root.add(s);LB.push({s,z:a[3],ph:LB.length*1.3})}});
 flush();
 const sg=[],jt=[],sg0=new T.BoxGeometry(1,.02,.4),jg=new T.CylinderGeometry(.2,.2,.02,18);
 for(let i=0;i<PATH.length;i++){const j=new T.Mesh(jg,pa);j.position.set(PATH[i][0],.16,PATH[i][1]);j.visible=false;root.add(j);jt.push(j);
  const jb=new T.Mesh(jg,base);jb.position.set(PATH[i][0],.14,PATH[i][1]);root.add(jb);
  if(i){const A=PATH[i-1],B=PATH[i],l=Math.hypot(B[0]-A[0],B[1]-A[1]),r=-Math.atan2(B[1]-A[1],B[0]-A[0]),b=new T.Mesh(new T.BoxGeometry(l,.02,.4),base);b.position.set((A[0]+B[0])/2,.14,(A[1]+B[1])/2);b.rotation.y=r;root.add(b);
   const s=new T.Mesh(sg0,pa);s.rotation.y=r;s.visible=false;root.add(s);sg.push(s)}}
 const me=mk("#f26a1b",1);root.add(me.g);
 function th(){const cs=getComputedStyle(document.documentElement),fl=cs.getPropertyValue("--floor").trim()||"#efe3d5",bg=new T.Color(cs.getPropertyValue("--bg").trim()||"#f6f0e9"),dk=bg.getHSL({}).l<.3;
  gm.color.set(fl);base.color.set(fl).lerp(new T.Color("#f26a1b"),.22);hemi.intensity=dk?.45:.55;sun.intensity=dk?.4:.55}
 th();new MutationObserver(th).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
 try{matchMedia("(prefers-color-scheme:dark)").addEventListener("change",th)}catch(e){}
 st.insertBefore(cv,$("sv").nextSibling);
 rd.compile(sc,cm);Object.assign(G,{dpr:Math.min(devicePixelRatio||1,mob?1.25:1.5),q:1,n:0,T,st,cv,rd,sc,cm,sun,me,NP,PL,LB,DR,sg,jt,on:1,shown:0});
}
function r3(x,y,i,d,mv,dt,now){
 const g=G,T=g.T;try{
 const w=g.st.clientWidth,h=g.st.clientHeight;if(!w||!h)return;
 if(w!==g.w||h!==g.h){g.w=w;g.h=h;g.rd.setPixelRatio(g.dpr*g.q);g.rd.setSize(w,h,false);g.cm.aspect=w/h}
 const t=now/1000,rm=rmQ.matches,k1=rm?1:1-Math.pow(1-.18,dt/16.667),mob=w<800;
 const a=cam.x/(C*S),b=cam.y*2/S,cx=(a+b)/2,cy=(b-a)/2,D=h/(2*S*Math.tan(Math.PI/12));
 const idle=!mv&&g.amp<.02&&Math.abs(cx-g.lx)<.002&&Math.abs(cy-g.ly)<.002;g.lx=cx;g.ly=cy;if(idle&&g.shown&&((g.f=(g.f||0)+1)&1))return;
 if(mv){const q=Math.min(dt,80);g.ema=g.ema?g.ema*.95+q*.05:q;if(++g.n>90&&g.ema>26){g.n=0;g.ema=0;if(g.q>.65){g.q*=.85;g.rd.setPixelRatio(g.dpr*g.q)}else if(!g.ns){g.ns=1;g.sun.castShadow=false}}}
 g.cm.position.set(cx+D*.577,D*.577,cy+D*.577);g.cm.lookAt(cx,0,cy);
 g.cm.setViewOffset(w,h,-((mob?.5:.68)-.5)*w,-((mob?.25:.56)-.5)*h,w,h);
 g.sun.position.set(cx-6,22,cy+18);g.sun.target.position.set(cx,0,cy);
 const A=PATH[i-1],B=PATH[i],ta=Math.atan2((B[0]-A[0])*dirS,(B[1]-A[1])*dirS);let df=ta-g.ang;df=Math.atan2(Math.sin(df),Math.cos(df));g.ang+=df*k1;
 g.amp+=((mv?1:0)-g.amp)*(rm?1:1-Math.pow(1-.15,dt/16.667));
 const m=g.me,sw=Math.sin(d*5)*g.amp;m.g.position.set(x,(1-Math.abs(Math.sin(d*5)))*.06*g.amp,y);m.g.rotation.y=g.ang;
 m.L.rotation.x=sw*.75;m.R.rotation.x=-sw*.75;m.AL.rotation.x=-sw*.6;m.AR.rotation.x=sw*.6;m.body.scale.y=1+Math.sin(t*2.2)*.012*(1-g.amp);
 g.sg.forEach((s,n)=>{const q=n+1,a0=PATH[q-1],b0=PATH[q],L0=Math.hypot(b0[0]-a0[0],b0[1]-a0[1]),f=q<i?1:q===i?Math.min(1,Math.hypot(x-a0[0],y-a0[1])/L0):0;s.visible=f>0;s.scale.x=Math.max(f*L0,1e-4);s.position.set(a0[0]+(b0[0]-a0[0])/L0*f*L0/2,.16,a0[1]+(b0[1]-a0[1])/L0*f*L0/2)});
 g.jt.forEach((j,n)=>j.visible=n<i);
 if(!rm){g.NP.forEach(n=>{n.c.g.scale.y=1+Math.sin(t*1.7+n.ph)*.012;n.c.head.rotation.x=Math.pow(Math.max(0,Math.sin(t*1.1+n.ph)),8)*.22});
  g.PL.forEach(p=>{p.g.rotation.z=Math.sin(t*1.8+p.ph)*.035;p.g.rotation.x=Math.cos(t*1.4+p.ph)*.025});
  g.LB.forEach(l=>l.s.position.y=l.z+Math.sin(t*1.7+l.ph)*.06)}
 g.DR.forEach(q=>{const n=Math.max(0,Math.min(1,(2.8-Math.abs(x-q.x))/1.5));q.o+=(n-q.o)*(rm?1:1-Math.pow(1-.12,dt/16.667));q.a.rotation.y=q.o*1.6;q.b.rotation.y=-q.o*1.6});
 g.rd.shadowMap.needsUpdate=!idle||!g.shown||g.f%4===0;
 g.rd.render(g.sc,g.cm);
 if(!g.shown){g.shown=1;g.cv.style.visibility="visible";$("sv").style.display="none"}
 }catch(e){fail3(e)}}

$("bar").innerHTML=STEPS.map(s=>`<div>${s.n}</div>`).join("");
const ICONS=["M3 11l9-8 9 8M5 10v10h14V10","M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z","M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM8.5 12l2.5 2.5 4.5-5","M3 16L16 3l5 5L8 21l-5-5zM8 11l2 2M11 8l2 2M5 14l2 2","M14.5 6.5a4 4 0 005 5l-9 9a2.1 2.1 0 01-3-3l9-9zM14.5 6.5l3-3","M12 21a9 9 0 100-18 9 9 0 000 18zM8 12l3 3 5-6"];
function stepP(i){if(!i)return 0;const sx=6+7*(i-1)+1.5;let d=0;while(d<L&&at(d)[0]<sx)d+=.1;return Math.min(1,d/L*.94+.03)}
function go(i){const m=$("track").offsetHeight-innerHeight;scrollTo({top:trackTop()+stepP(i)*m,behavior:"smooth"})}
function sideSet(s){$("ind").style.transform=`translateY(${s*52}px)`;[...$("sn").querySelectorAll("button")].forEach((b,i)=>b.classList.toggle("on",i===s))}
$("sn").insertAdjacentHTML("beforeend",STEPS.map((s,i)=>`<button style="--i:${i}" aria-label="${s.n}"><svg viewBox="0 0 24 24"><path d="${ICONS[i]}"/></svg><span>${s.n}</span></button>`).join(""));
[...$("sn").querySelectorAll("button")].forEach((b,i)=>b.onclick=()=>go(i));
let user=null;try{user=localStorage.getItem("jk_user")}catch(e){}
const A=$("auth"),ab=$("abox");
function fit(){ab.style.transform="none"}
function paint(){const gl=document.querySelector("#gn [data-k=akun] span");if(gl)gl.textContent=user?"Keluar":"Masuk";$("bm").textContent=user?user.slice(0,12)+" \u00b7 Keluar":"Masuk"}
function openAuth(reg){ab.classList.toggle("active",!!reg);A.classList.add("open");A.setAttribute("aria-hidden","false");fit()}
function closeAuth(){A.classList.remove("open");A.setAttribute("aria-hidden","true")}
function setUser(n){user=n;try{n?localStorage.setItem("jk_user",n):localStorage.removeItem("jk_user")}catch(e){}paint()}
$("bm").onclick=()=>user?setUser(null):openAuth();
$("bl").onclick=()=>user?go(1):openAuth();
$("toRegister").onclick=e=>{e.preventDefault();ab.classList.add("active")};
$("toLogin").onclick=e=>{e.preventDefault();ab.classList.remove("active")};
$("ax").onclick=closeAuth;
A.addEventListener("click",e=>{if(e.target===A||e.target===$("asc"))closeAuth()});
addEventListener("keydown",e=>{if(e.key==="Escape")closeAuth()});
addEventListener("resize",fit);
A.querySelectorAll("form").forEach(f=>f.addEventListener("submit",e=>{e.preventDefault();const n=f.querySelector("input").value.trim(),reg=f.dataset.t==="Daftar",adm=!reg&&n.toLowerCase()==="admin";(window.fxOk||function(o){o.done()})({fast:true,pre:reg?"Membuat akun":(adm?"Memverifikasi PIN":"Memverifikasi akun"),preSub:"Mohon tunggu sebentar",wait:"Memverifikasi…",btn:"Berhasil",title:reg?"Akun berhasil dibuat":"Berhasil masuk",sub:adm?"Membuka panel admin":"Halo, "+n,done:()=>{f.reset();setUser(n);closeAuth()}})}));
$("mm").innerHTML=STEPS.map((s,i)=>`<button data-i="${i}">${s.n}</button>`).join("")+`<button data-i="a">Masuk / Keluar</button>`;
function gClose(){gn.classList.remove("o");$("mh").classList.remove("o")}
$("mh").onclick=e=>{e.stopPropagation();const o=gn.classList.toggle("o");$("mh").classList.toggle("o",o)};
$("mm").onclick=e=>{const i=e.target.dataset&&e.target.dataset.i;if(!i)return;$("mm").classList.remove("o");i==="a"?(user?setUser(null):openAuth()):go(+i)};
$("mc").onclick=()=>user?setUser(null):openAuth();
$("sk").onclick=()=>go(5);
$("hl").onclick=()=>user?go(1):openAuth();
const GI={home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',route:'<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 000-6H9a3 3 0 010-6h6.5"/>',add:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',lead:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5"/><path d="M16 4.8a3.5 3.5 0 010 6.4M18 14.8c2 .6 3.5 2.2 3.5 5.2"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'};
const GT=[["home","Beranda",()=>scrollTo({top:0,behavior:"smooth"})],["route","Alur",()=>$("track").scrollIntoView({behavior:"smooth"})],["add","Lapor",()=>user?go(1):openAuth()],["lead","Pimpinan",()=>$("lead").scrollIntoView({behavior:"smooth"})],["user","Masuk",()=>user?setUser(null):openAuth(),"akun"]];
Object.assign(GI,{doc:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',map:'<path d="M12 21s6-5.5 6-10.5a6 6 0 10-12 0C6 15.5 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',book:'<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 19V5M8 7h7"/>',phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>'});
function toast(m){let t=document.getElementById("tst");if(!t){t=document.createElement("div");t.id="tst";t.style.cssText="position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translateX(-50%) translateY(20px);background:#1c1917;color:#fff;font:600 13px 'Plus Jakarta Sans',system-ui,sans-serif;padding:12px 20px;border-radius:99px;opacity:0;transition:.35s;z-index:60;pointer-events:none;white-space:nowrap";document.body.appendChild(t)}t.textContent=m;t.style.opacity=1;t.style.transform="translateX(-50%)";clearTimeout(t._h);t._h=setTimeout(()=>{t.style.opacity=0;t.style.transform="translateX(-50%) translateY(20px)"},2200)}
GT.length=0;GT.push(["doc","Laporan",()=>$("track").scrollIntoView({behavior:"smooth"})],["map","Peta",()=>toast("Halaman Peta segera hadir")],["chart","Statistik",()=>openStats()],["book","Panduan",()=>toast("Halaman Panduan segera hadir")],["phone","Kontak",()=>$("ft").scrollIntoView({behavior:"smooth"})]);
const nbub=$("nbub"),navEl=document.querySelector("nav");let ntm;
[...navEl.querySelectorAll(":scope>a")].forEach((a,i)=>{
 const g=GT[i];if(!g)return;a.tabIndex=0;
 a.addEventListener("pointerdown",()=>{const r=a.getBoundingClientRect(),n=navEl.getBoundingClientRect();nbub.innerHTML=gsv(g[0]);nbub.style.left=(r.left+r.width/2-28)+"px";nbub.style.top=(n.bottom+8)+"px";navEl.classList.add("press");a.classList.add("pp");nbub.classList.add("show")});
 const rel=()=>{navEl.classList.remove("press");nbub.classList.remove("show");navEl.querySelectorAll("a").forEach(t=>t.classList.remove("pp"))};
 a.addEventListener("pointerup",()=>{g[2]();clearTimeout(ntm);ntm=setTimeout(rel,350)});
 a.addEventListener("pointerleave",rel);a.addEventListener("pointercancel",rel);
 a.addEventListener("keydown",e=>{if(e.key==="Enter")g[2]()});
});
(()=>{
const IC={grid:'<circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/>',bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',map:'<path d="M12 21s6-5.5 6-10.5a6 6 0 10-12 0C6 15.5 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',chat:'<path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"/>',layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',book:'<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 19V5M8 7h7"/>',phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',up:'<path d="M6 15l6-6 6 6"/>'};
const ic=(k,c="")=>`<svg class="${c}" viewBox="0 0 24 24">${IC[k]}</svg>`;
const ROWS=[["s","Utama"],["grid","Beranda","home"],["bolt","Alur laporan","alur","6"],["map","Peta","peta"],["chart","Statistik","stat","",1],["s","Laporan"],["chat","Laporan saya","lap","3"],["layers","Tahapan","tah","",0,1],["book","Panduan","pand"],["phone","Kontak","kon"]];
const SUB=[["Lapor","#2dd4a7"],["Verifikasi","#ff7a50"],["Survei","#a78bfa"],["Perbaikan","#f5b942"],["Selesai","#4ade80"]];
const row=r=>r[0]==="s"?`<p class="vg">${r[1]}</p>`:`<button class="vi" data-k="${r[2]}" data-tip="${r[1]}">${ic(r[0])}<span class="vx">${r[1]}</span>${r[3]?`<em class="vb">${r[3]}</em>`:r[4]?'<em class="vb dot"></em>':""}${r[5]?ic("up","vch"):""}</button>${r[5]?`<div class="vsub" id="vsub">${SUB.map((s,i)=>`<button class="vi vsb" data-k="s${i+1}" data-tip="${s[0]}"><i class="dt" style="background:${s[1]}"></i><span class="vx">${s[0]}</span></button>`).join("")}</div>`:""}`;
const vs=$("vs"),vsc=$("vsc");let vk="home",vstep=0,hk=null;
vsc.innerHTML='<i class="vind" id="vind"></i>'+ROWS.map(row).join("");
vsc.querySelector('[data-k="tah"]').classList.add("exp");
function place(){const b=vsc.querySelector(`.vi[data-k="${hk||vk}"]`),d=$("vind");if(!b||!b.offsetParent){d.style.opacity=0;return}const o=vs.classList.contains("open"),w=o?b.offsetWidth:44;d.style.opacity=1;d.style.width=w+"px";d.style.height=Math.min(b.offsetHeight,44)+"px";d.style.transform=`translate(${b.offsetLeft+(b.offsetWidth-w)/2}px,${b.offsetTop+(b.offsetHeight-Math.min(b.offsetHeight,44))/2}px)`}
function vsAct(){const h=innerHeight*.5,tr=$("track").getBoundingClientRect(),sb=$("vsub");let k="home";const OV=[["pt","peta"],["sts","stat"],["pd","pand"],["ad","lap"],["mn","lap"]].find(o=>{const e=$(o[0]);return e&&e.classList.contains("open")});if(OV)k=OV[1];else if($("ft").getBoundingClientRect().top<innerHeight*.8)k="kon";else if(tr.top<h&&tr.bottom>h)k=(vs.classList.contains("open")&&!sb.hidden&&vstep>0)?"s"+vstep:"alur";vk=k;vsc.querySelectorAll(".vi").forEach(b=>b.classList.toggle("act",b.dataset.k===k));place()}
function loop(){const t=performance.now();(function f(){vsAct();if(performance.now()-t<800)requestAnimationFrame(f)})()}
const setOpen=o=>{vs.classList.toggle("open",o);$("vtg").setAttribute("aria-expanded",o);loop()};
$("vtg").onclick=()=>setOpen(!vs.classList.contains("open"));
$("vq").onclick=()=>{if(!vs.classList.contains("open")){setOpen(true);setTimeout(()=>$("vqi").focus(),350)}};
$("vqi").oninput=e=>{const q=e.target.value.toLowerCase();vsc.querySelectorAll(".vi").forEach(b=>{b.style.display=!q||b.dataset.tip.toLowerCase().includes(q)?"":"none"});place()};
addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="k"){e.preventDefault();setOpen(true);setTimeout(()=>$("vqi").focus(),350)}});
vsc.onclick=e=>{const b=e.target.closest(".vi");if(!b)return;const k=b.dataset.k;
 if(k==="tah"){if(!vs.classList.contains("open"))setOpen(true);const s=$("vsub");s.hidden=!s.hidden;b.classList.toggle("exp",!s.hidden);loop();return}
 if(k.length===2&&k[0]==="s"){go(+k[1]);return}
 ({home:()=>scrollTo({top:0,behavior:"smooth"}),alur:()=>$("track").scrollIntoView({behavior:"smooth"}),peta:()=>toast("Halaman Peta segera hadir"),stat:()=>openStats(),lap:()=>user?go(1):openAuth(),pand:()=>toast("Halaman Panduan segera hadir"),kon:()=>$("ft").scrollIntoView({behavior:"smooth"})})[k]()};
$("vm").onclick=()=>{const r=document.documentElement,d=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=d?"light":"dark";$("vm").classList.toggle("on",!d)};
$("vm").classList.toggle("on",matchMedia("(prefers-color-scheme:dark)").matches);
$("vp").onclick=()=>user?setUser(null):openAuth();
function vsUser(){$("vav").textContent=(user||"T")[0].toUpperCase();$("vpn").textContent=user||"Tamu";$("vps").textContent=user?"Ketuk untuk opsi akun":"Ketuk untuk masuk"}
const _ss=sideSet;sideSet=s=>{_ss(s);vstep=s;vsAct()};
const _su=setUser;setUser=n=>{_su(n);vsUser()};
(function(){let q=0;addEventListener("scroll",()=>{if(q)return;q=requestAnimationFrame(()=>{q=0;vsAct()})},{passive:true})})();addEventListener("resize",place);
/* indikator mengikuti mouse: pindah ke item yang dihover, kembali ke item aktif saat mouse keluar */
vsc.addEventListener("pointerover",e=>{const b=e.target.closest(".vi");if(!b||e.pointerType==="touch")return;hk=b.dataset.k;place()});
vsc.addEventListener("pointerleave",()=>{hk=null;place()});
vsc.addEventListener("click",()=>loop(),true);
["pt","sts","pd","ad","mn"].forEach(id=>{const e=$(id);if(e)new MutationObserver(()=>loop()).observe(e,{attributes:true,attributeFilter:["class"]})});
vsUser();setTimeout(vsAct,60);
})();
setTimeout(()=>gOn(-1),0);
const gb=$("gb"),gbub=$("gbub"),gn=$("gn");let gtm;
const gsv=k=>`<svg viewBox="0 0 24 24">${GI[k]}</svg>`;
const gOn=n=>[...gb.children].forEach((t,i)=>t.classList.toggle("act",i===n));
GT.forEach(([k,l,fn,id],i)=>{
 const b=document.createElement("button");b.className="gt"+(i===0?" act":"");if(id)b.dataset.k=id;
 b.innerHTML=gsv(k)+"<span>"+l+"</span>";
 b.addEventListener("pointerdown",()=>{const r=b.getBoundingClientRect(),s=gn.getBoundingClientRect();gbub.innerHTML=gsv(k);gbub.style.left=(r.left-s.left+r.width/2-28)+"px";gb.classList.add("press");b.classList.add("pp");gbub.classList.add("show")});
 const rel=()=>{gb.classList.remove("press");gbub.classList.remove("show");[...gb.children].forEach(t=>t.classList.remove("pp"))};
 b.addEventListener("pointerup",()=>{fn();clearTimeout(gtm);gtm=setTimeout(rel,350);setTimeout(gClose,700)});
 b.addEventListener("pointerleave",rel);b.addEventListener("pointercancel",rel);
 b.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();fn();setTimeout(gClose,300)}});
 gb.appendChild(b)});
addEventListener("click",e=>{if(!gn.contains(e.target))gClose()});addEventListener("keydown",e=>{if(e.key==="Escape")gClose()});
addEventListener("scroll",(()=>{let q=0;return()=>{if(q)return;q=requestAnimationFrame(()=>{q=0;const h=innerHeight*.5;gOn($("ft").getBoundingClientRect().top<innerHeight*.8?4:$("track").getBoundingClientRect().top<h&&$("lead").getBoundingClientRect().top>h?0:-1)})}})(),{passive:true});$("hw").onclick=()=>$("track").scrollIntoView({behavior:"smooth"});
if(matchMedia("(prefers-reduced-motion:reduce)").matches)$("hv").pause();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.25});document.querySelectorAll(".rv").forEach(e=>io.observe(e));
paint();
build();addEventListener("resize",build);requestAnimationFrame(frame);window.requestIdleCallback?requestIdleCallback(load3,{timeout:2500}):setTimeout(load3,1500);
