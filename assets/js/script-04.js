(()=>{const f=document.getElementById("cs");if(!f)return;const ST=["Terkirim","Diverifikasi","Disurvei","Dalam perbaikan","Selesai"],o=document.getElementById("cso"),i=document.getElementById("csi");
f.addEventListener("submit",async e=>{e.preventDefault();const q=i.value.trim().toUpperCase();if(!q){o.textContent="Masukkan nomor tiket dulu.";return}
o.textContent="Memeriksa…";
try{const j=await(await fetch("api/laporan.php?action=cek&tiket="+encodeURIComponent(q),{cache:"no-store"})).json();if(j.status==="success"){o.textContent=q+": "+ST[j.data.stage]+" ("+j.data.lokasi+")";return}}catch(x){}
let L=[];try{L=JSON.parse(localStorage.getItem("jk_reports")||"[]")}catch(x){}
const r=Array.isArray(L)&&L.find(x=>x&&String(x.id).toUpperCase()===q);
o.textContent=r?q+": "+ST[r.stage]+" ("+r.lok+")":"Tiket "+q+" tidak ditemukan. Periksa kembali nomornya."})})();
