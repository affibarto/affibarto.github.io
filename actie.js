(function(){
if(window._actieOnce)return;window._actieOnce=1;
function euro(c){return "\u20ac"+((+c||0)/100).toFixed(2).replace(".",",");}
function closePanel(){var p=document.getElementById("storepanel");if(p)p.classList.remove("on");var n=document.getElementById("nearbypanel");if(n)n.classList.remove("on");}
function extraOfKey(k){
if(!k||k.indexOf("e:")!==0)return null;
var parts=k.split(":");
var i=+parts[1];
if(!isFinite(i))return null;
return (S.extras||[])[i]||null;
}
function scoreListStores(){
var stores=typeof activeStores==="function"?activeStores():(STORES||[]);
if(!stores.length||typeof buildList!=="function")return [];
var items=buildList().filter(function(i){return !(S.checked&&S.checked[i.k]);});
return stores.map(function(r){
var total=0,miss=[],have=0;
items.forEach(function(i){
var ex=extraOfKey(i.k);
if(ex&&(ex.cents||ex.line)){
if(!ex.sid||ex.sid===r.id){
total+=ex.line||((ex.cents||0)*(+ex.q||1));
have++;
}else miss.push(i.n);
return;
}
if(typeof unitPrice!=="function"||!i.cat){miss.push(i.n);return;}
var pr=unitPrice(i.cat,r.id,S.brand,i.k);
if(pr==null)miss.push(i.n);
else{total+=Math.round(pr*Math.max(i.q||1,0.5));have++;}
});
return {id:r.id,n:r.n,total:total,miss:miss,cov:items.length?Math.round(100*have/items.length):100,have:have,nItems:items.length};
}).sort(function(a,b){
var aOk=a.cov>=90?0:1,bOk=b.cov>=90?0:1;
if(aOk!==bOk)return aOk-bOk;
if(a.total!==b.total)return a.total-b.total;
return b.cov-a.cov;
});
}
function renderScoreHtml(scores,opts){
opts=opts||{};
var itemsN=scores.length?scores[0].nItems:0;
if(!scores.length||!itemsN){
return opts.emptyNote?'<p class=note>'+opts.emptyNote+'</p>':"";
}
var top=scores.slice(0,3);
var rows=top.map(function(s,i){
var rank=(i+1)+") ";
var cov=s.cov!=null?(s.cov+"%"):"";
var head=rank+s.n+" "+euro(s.total);
if(i===0)head="<b>"+head+"</b>";
return "<div class=listrow style=margin:0 0 6px><div style=flex:1>"+head+(cov?"<div class=meta>"+cov+" dekking</div>":"")+"</div><div class=price>"+euro(s.total)+"</div></div>";
}).join("");
return rows+'<p class=note style=margin:4px 0 0>Indicatie, geen kassaprijs.</p>';
}
function paintScore(){
var host=document.getElementById("listscore");if(!host)return;
var scores=scoreListStores();
if(!scores.length||!(scores[0]&&scores[0].nItems)){host.innerHTML="";return;}
host.innerHTML=renderScoreHtml(scores);
}
function paintStoreCompare(){
var panel=document.getElementById("storepanel");if(!panel)return;
var sc=panel.querySelector(".sc");if(!sc)return;
var host=document.getElementById("storescore");
if(!host){
host=document.createElement("div");
host.id="storescore";
host.style.marginTop="14px";
var near=sc.querySelector(".nearby-entry");
if(near)sc.insertBefore(host,near);else sc.appendChild(host);
}
var scores=scoreListStores();
if(!scores.length||!(scores[0]&&scores[0].nItems)){
host.innerHTML='<p class=note>Geen open producten om te vergelijken.</p>';
return;
}
host.innerHTML='<div class=sec>Winkeltotalen</div>'+renderScoreHtml(scores);
}
window.paintScore=paintScore;
window.paintStores=paintStores;
window.scoreListStores=scoreListStores;
function paintStores(){
["setstores","huisstores"].forEach(function(id){
var el=document.getElementById(id);if(!el||typeof STORES==="undefined")return;
el.innerHTML=STORES.map(function(r){return "<button type=button class='chip "+((S.stores||{})[r.id]!==false?"on":"")+"' data-act=store data-id="+r.id+">"+r.n+"</button>";}).join("");
});
paintStoreCompare();
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
if(st){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();var id=st.getAttribute("data-id");S.stores=S.stores||{};var on=S.stores[id]!==false;if(on&&typeof activeStores==="function"&&activeStores().length<=1){if(typeof toast==="function")toast("Minstens een winkel");return;}S.stores[id]=!on;if(typeof save==="function")save();paintStores();paintScore();}
},true);
if(typeof drawList==="function"&&!drawList._actie){var _dl=drawList;drawList=function(){_dl();markList();};drawList._actie=true;}
if(typeof drawHuis==="function"&&!drawHuis._actie){var _dh=drawHuis;drawHuis=function(){_dh();paintStores();};drawHuis._actie=true;}
window.markList=markList;window.paintFolderList=markList;window.bumpExtra=bump;
setTimeout(function(){markList();paintStores();},0);
})();
