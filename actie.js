(function(){
if(window._actieOnce)return;window._actieOnce=1;
function euro(c){return "\u20ac"+((+c||0)/100).toFixed(2).replace(".",",");}
function closePanel(){var p=document.getElementById("storepanel");if(p)p.classList.remove("on");var n=document.getElementById("nearbypanel");if(n)n.classList.remove("on");}
function scoreStores(){
var extras=S.extras||[];
var stores=typeof activeStores==="function"?activeStores():(STORES||[]);
return stores.map(function(r){
var actie=0;
extras.forEach(function(e){if(e.sid===r.id)actie+=e.line||((e.cents||0)*(e.q||1));});
return {id:r.id,n:r.n,total:actie};
}).filter(function(s){return s.total>0;}).sort(function(a,b){return a.total-b.total;});
}
function paintScore(){
var host=document.getElementById("listscore");if(!host)return;
var extras=S.extras||[];
if(!extras.length){host.innerHTML="";return;}
var scores=scoreStores();
if(!scores.length){host.innerHTML="";return;}
var best=scores[0];
var bits=scores.slice(0,3).map(function(s,i){return (i===0?"<b>"+s.n+" "+euro(s.total)+"</b>":s.n+" "+euro(s.total));});
host.innerHTML="<div class=listrow style=margin:0 0 10px><div style=flex:1><b>Voordeligst: "+best.n+"</b><div class=meta>"+bits.join(" \u00b7 ")+"</div></div><div class=price>"+euro(best.total)+"</div></div>";
}
window.paintScore=paintScore;
window.paintStores=paintStores;
function paintStores(){
["setstores","huisstores"].forEach(function(id){
var el=document.getElementById(id);if(!el||typeof STORES==="undefined")return;
el.innerHTML=STORES.map(function(r){return "<button type=button class='chip "+((S.stores||{})[r.id]!==false?"on":"")+"' data-act=store data-id="+r.id+">"+r.n+"</button>";}).join("");
});
}
function markList(){
var slot=document.getElementById("folderlijst");if(slot){slot.innerHTML="";slot.style.display="none";}
paintScore();
}
function bump(i,d){
var e=(S.extras||[])[i];if(!e)return;
e.q=Math.max(0,(+e.q||1)+d);
if(e.q<=0)S.extras.splice(i,1);else e.line=(e.cents||0)*e.q;
if(typeof save==="function")save();
if(typeof markFolder==="function")markFolder();
if(typeof drawList==="function")drawList();
}
document.addEventListener("click",function(e){
var t=e.target;if(t&&t.nodeType===3)t=t.parentNode;if(!t||!t.closest)return;
if(t.id==="closeset"||(t.closest&&t.closest("#closeset"))){e.preventDefault();e.stopPropagation();closePanel();return;}
if(t.id==="listgear"||(t.closest&&t.closest("#listgear"))){e.preventDefault();e.stopPropagation();var p=document.getElementById("storepanel");if(p){p.classList.add("on");paintStores();}return;}
var go=t.closest("[data-go]");if(go){closePanel();return;}
var q=t.closest("[data-act=exqty]");
if(q){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();bump(+q.getAttribute("data-i"),+q.getAttribute("data-d"));return;}
var st=t.closest("[data-act=store]");
if(st){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();var id=st.getAttribute("data-id");S.stores=S.stores||{};var on=S.stores[id]!==false;S.stores[id]=!on;if(typeof save==="function")save();paintStores();paintScore();}
},true);
if(typeof drawList==="function"&&!drawList._actie){var _dl=drawList;drawList=function(){_dl();markList();};drawList._actie=true;}
if(typeof drawHuis==="function"&&!drawHuis._actie){var _dh=drawHuis;drawHuis=function(){_dh();paintStores();};drawHuis._actie=true;}
window.paintFolderList=markList;
setTimeout(function(){markList();paintStores();},0);
})();
