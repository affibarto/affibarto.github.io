/* WeAte depth: today marker, hero image vars, 3rd stacked card, tilt/parallax */
(function(){
  var TD=["Zo","Ma","Di","Wo","Do","Vr","Za"][new Date().getDay()];
  function bord(){
    var row=document.querySelector('#days .dayrow[data-d="'+TD+'"]');
    document.querySelectorAll('#days .today').forEach(function(n){n.classList.remove('today')});
    if(row){row.classList.add('today');var w=row.parentElement.classList.contains('swipewrap')?row.parentElement:row;var c=w.previousElementSibling;if(c&&c.classList.contains('daycap'))c.classList.add('today');}
    var img=(row&&row.querySelector('img.daythumb'))||document.querySelector('#days img.daythumb');
    var sc=document.querySelector('#bord .sc');if(sc)sc.style.setProperty('--hero',img?'url("'+img.src+'")':'none');
  }
  function deck(){
    var st=document.querySelector('#swipedeck .swipestack');if(!st)return;
    var f=st.querySelector('.swipecard.front'),b=st.querySelector('.swipecard.back');
    var sc=document.querySelector('#kies .sc');var fi=f&&f.querySelector('img');if(sc)sc.style.setProperty('--hero',fi?'url("'+fi.src+'")':'none');
    if(b&&!st.querySelector('.back2')){var c=b.cloneNode(true);c.classList.remove('back');c.classList.add('back2');c.removeAttribute('data-id');st.insertBefore(c,st.firstChild);}
    if(f&&!f._tilt){f._tilt=1;
      f.addEventListener('pointermove',function(e){if(e.buttons)return;var r=f.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        f.style.setProperty('--ry',(x*8)+'deg');f.style.setProperty('--rx',(-y*6)+'deg');f.style.setProperty('--px',(-x*14)+'px');f.style.setProperty('--py',(-y*14)+'px');});
      f.addEventListener('pointerleave',function(){['--rx','--ry','--px','--py'].forEach(function(k){f.style.removeProperty(k)})});
      if(window.DeviceOrientationEvent)window.addEventListener('deviceorientation',function(e){if(!f.isConnected)return;var g=Math.max(-20,Math.min(20,e.gamma||0)),bt=Math.max(-20,Math.min(20,(e.beta||45)-45));
        f.style.setProperty('--ry',(g/3)+'deg');f.style.setProperty('--rx',(-bt/4)+'deg');f.style.setProperty('--px',(-g/2)+'px');f.style.setProperty('--py',(-bt/2)+'px');},{passive:true});}
  }
  function hook(){
    var d=document.getElementById('days');if(d)new MutationObserver(function(){requestAnimationFrame(bord)}).observe(d,{childList:true});
    var k=document.querySelector('#kies .sc');if(k)new MutationObserver(function(){requestAnimationFrame(deck)}).observe(k,{childList:true,subtree:true});
    bord();deck();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();
