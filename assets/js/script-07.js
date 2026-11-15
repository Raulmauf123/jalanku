(function(){
 var G=document.getElementById("pd");if(!G)return;
 var bx=document.getElementById("pdx"),q=document.getElementById("pdq"),no=document.getElementById("pdno"),T=document.getElementById("pdt"),last=null;
 var cards=[].slice.call(G.querySelectorAll("#pdg>.g"));
 var TABS=[["mulai","Mulai"],["lapor","Melapor"],["peta","Lokasi & peta"],["pantau","Pantau"],["tanya","Tanya jawab"]];
 var cur="mulai";
 T.innerHTML=TABS.map(function(t){return'<button type="button" role="tab" data-t="'+t[0]+'">'+t[1].replace("&","&amp;")+"</button>"}).join("");
 var tb=[].slice.call(T.querySelectorAll("button"));
 var norm=function(s){return String(s||"").toLowerCase()};
 function paint(list){
  var n=0;
  cards.forEach(function(c){
   var on=list.indexOf(c)>-1;c.hidden=!on;c.classList.remove("in");
   if(on){c.style.setProperty("--d",n++)}});
  void G.offsetWidth;
  cards.forEach(function(c){if(!c.hidden)c.classList.add("in")});
  no.hidden=n>0}
 function show(t){
  cur=t;
  tb.forEach(function(b){var on=b.dataset.t===t;b.classList.toggle("on",on);b.setAttribute("aria-selected",on)});
  paint(cards.filter(function(c){return c.dataset.t===t}))}
 function search(){
  var v=norm(q.value).trim();
  if(!v){show(cur);return}
  tb.forEach(function(b){b.classList.remove("on");b.setAttribute("aria-selected","false")});
  paint(cards.filter(function(c){return norm(c.textContent).indexOf(v)>-1}))}
 T.addEventListener("click",function(e){var b=e.target.closest("button[data-t]");if(!b)return;q.value="";show(b.dataset.t)});
 q.addEventListener("input",search);
 window.openGuide=function(){
  last=document.activeElement;q.value="";show("mulai");
  G.classList.add("open");G.setAttribute("aria-hidden","false");G.scrollTop=0;
  setTimeout(function(){try{bx.focus({preventScroll:true})}catch(e){}},60)};
 function closeGuide(){
  if(!G.classList.contains("open"))return;
  G.classList.remove("open");G.setAttribute("aria-hidden","true");
  if(last&&last.focus&&document.contains(last)){try{last.focus({preventScroll:true})}catch(e){}}}
 bx.onclick=closeGuide;
 G.addEventListener("click",function(e){if(e.target===G)closeGuide()});
 addEventListener("keydown",function(e){if(e.key==="Escape")closeGuide()});
 G.addEventListener("click",function(e){
  var b=e.target.closest&&e.target.closest("[data-pd]");if(!b)return;
  var k=b.getAttribute("data-pd");last=null;closeGuide();
  var f=k==="peta"?window.openMap:k==="lapor"?window.openReport:k==="mine"?window.openMine:null;
  if(f)setTimeout(f,120)});
 /* semua menu Panduan lama hanya memanggil toast "segera hadir": arahkan ke halaman Panduan */
 var _t=window.toast;
 if(typeof _t==="function")window.toast=function(m){if(m==="Halaman Panduan segera hadir"){window.openGuide();return}return _t.apply(this,arguments)};
 /* menu hamburger di HP */
 var mm=document.getElementById("mm");
 if(mm){
  mm.insertAdjacentHTML("beforeend",'<button data-g="1">Panduan</button>');
  mm.addEventListener("click",function(e){var t=e.target;if(t&&t.dataset&&t.dataset.g==="1"){mm.classList.remove("o");window.openGuide()}})}
 show("mulai");
})();
