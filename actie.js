(function(){
if(window._actieOnce)return;window._actieOnce=1;
function euro(c){return "\u20ac"+((+c||0)/100).toFixed(2).replace(".",",");}
function findEx(n,sid){S.extras=S.extras||[];for(var i=0;i<S.extras.length;i++){if(S.extras[i].n===n&&(S.extras[i].sid||"")===(sid||""))return i;}return -1;}
function extraOfKey(k){if(!k||String(k).indexOf("e:")!==0)return null;return (S.extras||[])[+String(k).split(":")[1]]||null;}
function scoreStores(){
var items=(typeof buildList==="function"?buildList():[]).filter(function(i){return !(S.checked&&S.checked[i.k]);});
var stores=typeof activeStores==="function"?activeStores():(STORES||[]);
return stores.map(function(r){
var actie=0,rest=0,miss=[];
items.forEach(function(i){
var ex=extraOfKey(i.k);
if(ex){if(ex.sid&&ex.sid!==r.id){miss.push(i.n);return;}actie+=ex.line||((ex.cents||0)*(ex.q||1));return;}
var pr=typeof unitPrice==="function"?unitPrice(i.cat,r.id,S.brand,i.k):null;
if(pr==null)miss.push(i.n);else rest+=Math.round(pr*Math.max(+i.q||1,0.5));
});
return {id:r.id,n:r.n,actie:actie,rest:rest,total:actie+rest,miss:miss};
}).sort(function(a,b){return a.total-b.total;});
}
function paintScore(){
var host=document.getElementById("listscore");
if(!host)return;
var scores=scoreStores();
if(!scores.length){host.innerHTML="";return;}
var best=scores[0];
var extraN=(S.extras||[]).length;
var bits=scores.slice(0,3).map(function(s,i){
return (i===0?"<b>"+s.n+" "+euro(s.total)+"</b>":s.n+" "+euro(s.total));
});
var note=extraN?extraN+" actie tegen folderprijs":"totaal is indicatie tot je acties tikt";
host.innerHTML="<div class=listrow style=margin:0 0 10px><div style=flex:1><b>Voordeligst: "+best.n+"</b><div class=meta>"+bits.join(" \u00b7 ")+"</div><div class=meta>"+note+"</div></div><div class=price>"+euro(best.total)+"</div></div>";
var line=document.getElementById("lijstline");
if(line)line.textContent=best.n+" "+euro(best.total);
}
function paintStores(){
var pick=document.getElementById("setstores")||document.getElementById("huisstores");
["setstores","huisstores"].forEach(function(id){
var el=document.getElementById(id);if(!el||typeof STORES==="undefined")return;
el.innerHTML=STORES.map(function(r){return "<button type=button class='chip "+(S.stores[r.id]!==false?"on":"")+"' data-act=store data-id="+r.id+">"+r.n+"</button>";}).join("");
});
}
function markFolder(){
var rows=window._folderRows||[];
document.querySelectorAll("#folderbody [data-act=adddeal]").forEach(function(btn){
var hit=rows[+btn.getAttribute("data-idx")];if(!hit)return;
var i=findEx(hit.n,hit.s);
var box=btn.querySelector(".qtybox,.price");
if(i>=0){
btn.classList.add("onlist");
var html="<div class=qtybox><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=-1>\u2212</button><span class=qtyn>"+(S.extras[i].q||1)+"</span><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=1>+</button></div>";
if(box)box.outerHTML=html;else btn.insertAdjacentHTML("beforeend",html);
}else{
btn.classList.remove("onlist");
var qb=btn.querySelector(".qtybox");
if(qb){qb.outerHTML="<div class=price>"+(hit.now?euro(hit.now):"")+"</div>";}
}
});
}
function markList(){
var host=document.getElementById("folderlijst");if(host)host.innerHTML="";
document.querySelectorAll("#lijstbody .swipewrap").forEach(function(w){
var k=w.getAttribute("data-k")||"";
var row=w.querySelector(".listrow");if(!row)return;
var ex=extraOfKey(k);
if(ex){
var i=+String(k).split(":")[1];
var old=row.querySelector(".qtybox,.price");
var html="<div class=qtybox><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=-1>\u2212</button><span class=qtyn>"+(ex.q||1)+"</span><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=1>+</button></div><div class=price>"+euro(ex.line||((ex.cents||0)*(ex.q||1)))+"</div>";
if(old){var wrap=document.createElement("div");wrap.style.cssText="display:flex;align-items:center;gap:8px;flex:none";wrap.innerHTML=html;old.replaceWith(wrap);}
else row.insertAdjacentHTML("beforeend","<div style='display:flex;align-items:center;gap:8px;flex:none'>"+html+"</div>");
var meta=row.querySelector(".meta");
if(meta&&ex.sid){var sn=(STORES||[]).filter(function(s){return s.id===ex.sid;})[0];meta.textContent=(sn?sn.n:ex.sid)+(ex.pack?" \u00b7 "+ex.pack:"")+" \u00b7 actie";}
}else{
var tail=null;row.querySelectorAll(":scope > .meta").forEach(function(m){tail=m;});
if(tail&&!row.querySelector(".qtyn,.qtybox"))tail.classList.add("qtyn");
}
});
paintScore();
}
function addHit(hit){
if(!hit||!hit.n||typeof S==="undefined")return;
S.extras=S.extras||[];S.removed=S.removed||{};
Object.keys(S.removed).forEach(function(k){if(String(k).indexOf("e:")===0)delete S.removed[k];});
if(findEx(hit.n,hit.s)>=0){markFolder();return;}
S.extras.push({n:hit.n,q:1,s:"Houdbaar",sid:hit.s||"",cents:hit.now||0,line:hit.now||0,img:hit.img||"",pack:hit.qty||hit.q||""});
if(typeof save==="function")save();
markFolder();
if(typeof drawList==="function")drawList();
}
function bump(i,d){
var e=(S.extras||[])[i];if(!e)return;
e.q=Math.max(0,(+e.q||1)+d);
if(e.q<=0)S.extras.splice(i,1);else e.line=(e.cents||0)*e.q;
if(typeof save==="function")save();
markFolder();
if(typeof drawList==="function")drawList();
}
document.addEventListener("click",function(e){
var t=e.target;if(t&&t.nodeType===3)t=t.parentNode;if(!t||!t.closest)return;
if(t.id==="listgear"||t.closest&&t.closest("#listgear")){e.preventDefault();var p=document.getElementById("storepanel");if(p){p.classList.toggle("on");paintStores();}return;}
var q=t.closest("[data-act=exqty]");
if(q){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();bump(+q.getAttribute("data-i"),+q.getAttribute("data-d"));return;}
var ad=t.closest("[data-act=adddeal]");
if(ad){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();var hit=(window._folderRows||[])[+ad.getAttribute("data-idx")];if(hit)addHit(hit);return;}
var st=t.closest("[data-act=store]");
if(st){var id=st.getAttribute("data-id");S.stores=S.stores||{};var on=S.stores[id]!==false;if(on&&(typeof activeStores==="function"?activeStores():[]).length===1)return;S.stores[id]=!on;if(typeof save==="function")save();paintStores();if(typeof drawList==="function")drawList();}
},true);
if(typeof drawList==="function"&&!drawList._actie){var _dl=drawList;drawList=function(){_dl();markList();};drawList._actie=true;}
if(typeof drawFolder==="function"&&!drawFolder._actie){var _df=drawFolder;drawFolder=function(){_df();markFolder();};drawFolder._actie=true;}
if(typeof drawHuis==="function"&&!drawHuis._actie){var _dh=drawHuis;drawHuis=function(){_dh();paintStores();};drawHuis._actie=true;}
if(typeof show==="function"&&!show._score){var _sh=show;show=function(id){_sh(id);if(id==="lijst"){markList();paintScore();}if(id==="huis")paintStores();};show._score=true;}
window.paintFolderList=markList;
setTimeout(function(){markFolder();markList();paintStores();},0);
})();
