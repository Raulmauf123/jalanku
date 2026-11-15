(function(){
 var v=document.getElementById("hv");
 if(!v)return;
 var mq=matchMedia("(max-aspect-ratio:1/1)"),portrait=mq.matches||innerWidth<=800;
 v.muted=true;v.defaultMuted=true;v.setAttribute("muted","");v.playsInline=true;
 v.src=portrait?"assets/video/hero-portrait.mp4":"assets/video/hero-landscape.mp4";v.load();
 function go(){if(v._off)return;var p=v.play();if(p&&p.catch)p.catch(function(){})}
 v.addEventListener("canplay",go);go();
 try{new IntersectionObserver(function(es){es.forEach(function(e){v._off=!e.isIntersecting;if(e.isIntersecting){if(!matchMedia("(prefers-reduced-motion:reduce)").matches)go()}else v.pause()})},{threshold:.01}).observe(v)}catch(e){}
 ["touchstart","pointerdown","click","scroll"].forEach(function(ev){addEventListener(ev,function f(){if(v.paused)go();else removeEventListener(ev,f)},{passive:true})});
 document.addEventListener("visibilitychange",function(){if(!document.hidden&&v.paused)go()});
 addEventListener("orientationchange",function(){setTimeout(function(){var np=mq.matches||innerWidth<=800;if(np!==portrait)location.reload()},300)});
})();
