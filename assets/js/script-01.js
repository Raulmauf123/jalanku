(function(){const A=document.getElementById("auth"),ab=document.getElementById("abox"),bl=A.querySelectorAll(".blobs i");let t,raf,mx=0,my=0,p=[[0,0],[0,0],[0,0]];
function sync(){clearTimeout(t);if(A.classList.contains("open")){ab.classList.remove("ex");t=setTimeout(()=>ab.classList.add("ex"),550);loop()}else{ab.classList.remove("ex");cancelAnimationFrame(raf)}}
new MutationObserver(sync).observe(A,{attributes:true,attributeFilter:["class"]});
document.getElementById("apeek").onclick=()=>{clearTimeout(t);ab.classList.add("ex")};
A.addEventListener("pointerleave",()=>{document.getElementById("asc").style.transform=""});A.addEventListener("pointermove",e=>{const sc=document.getElementById("asc"),W=innerWidth,H=innerHeight,nx=(e.clientX/W-.5)*2,ny=(e.clientY/H-.5)*2;sc.style.transform="translate("+(nx*14).toFixed(1)+"px,"+(ny*10).toFixed(1)+"px) rotateY("+(nx*7).toFixed(2)+"deg) rotateX("+(-ny*7).toFixed(2)+"deg)";const r=A.querySelector(".blobs").getBoundingClientRect();mx=(e.clientX-r.left-32)/Math.max(300,innerWidth/2);my=(e.clientY-r.top-32)/Math.max(300,innerHeight/2)});
function loop(){const k=[.2,.1,.06],m=[16,26,36];bl.forEach((el,i)=>{const tx=Math.max(-1,Math.min(1,mx))*m[i],ty=Math.max(-1,Math.min(1,my))*m[i]*.6;p[i][0]+=(tx-p[i][0])*k[i];p[i][1]+=(ty-p[i][1])*k[i];el.style.transform="translate("+p[i][0].toFixed(2)+"px,"+p[i][1].toFixed(2)+"px)"});raf=requestAnimationFrame(loop)}
A.addEventListener("click",e=>{const ey=e.target.closest(".eye");if(ey){const i=ey.parentNode.querySelector("input");const s=i.type==="password";i.type=s?"text":"password";ey.classList.toggle("on",s);ey.setAttribute("aria-label",s?"Sembunyikan kata sandi":"Tampilkan kata sandi")}
const f=e.target.closest("[data-forgot]");if(f){e.preventDefault();f.textContent="Segera hadir";setTimeout(()=>f.textContent="Lupa sandi?",1600)}
if(e.target.closest("[data-guest]"))document.getElementById("ax").click();});
})();
