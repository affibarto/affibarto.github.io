(function(){
if(window._actieOnce)return;window._actieOnce=1;
function euro(c){return "\u20ac"+((+c||0)/100).toFixed(2).replace(".",",");}
function storeN(id){var s=(typeof STORES!=="undefined"?STORES:[]).filter(function(x){return x.id===id;})[0];return s?s.n:(id||"");}
function closePanel(){var p=document.getElementById("storepanel");if(p)p.classList.remove("on");}
function findEx(n,sid){S.extras=S.extras||[];for(var i=0;i<S.extras.length;i++){if(S.extras[i].n===n&&(S.extras[i].sid||"")===(sid||""))return i;}return -1;}
function extraOfKey(k){if(!k||String(k).indexOf("e:")!==0)return null;return (S.extras||[])[+String(k).split(":")[1]]||null;}
function hitFrom(btn){
var rows=window._folderRows||[];
var idx=+btn.getAttribute("data-idx");
if(rows[idx])return rows[idx];
var n="";try{n=decodeURIComponent(btn.getAttribute("data-n")||"");}catch(er){n=btn.getAttribute("data-n")||"";}
if(!n)return null;
var pack="";try{pack=decodeURIComponent(btn.getAttribute("data-pack")||"");}catch(er){pack=btn.getAttribute("data-pack")||"";}
return {n:n,s:btn.getAttribute("data-sid")||"",now:+btn.getAttribute("data-now")||0,qty:pack};
}
function scoreStores(){
var extras=S.extras||[];
var stores=typeof activeStores==="function"?activeStores():(STORES||[]);
return stores.map(function(r){
var actie=0;
extras.forEach(function(e){if(!e.sid||e.sid===r.id)actie+=e.line||((e.cents||0)*(e.q||1));});
return {id:r.id,n:r.n,total:actie};
}).sort(function(a,b){return a.total-b.total;});
}
function paintScore(){
var host=document.getElementById("listscore");if(!host)return;
var extras=S.extras||[];
if(!extras.length){host.innerHTML="";return;}
var scores=scoreStores();var best=scores[0];
var bits=scores.filter(function(s){return s.total>0;}).slice(0,3).map(function(s,i){return (i===0?"<b>"+s.n+" "+euro(s.total)+"</b>":s.n+" "+euro(s.total));});
host.innerHTML="<div class=listrow style=margin:0 0 10px><div style=flex:1><b>Voordeligst: "+best.n+"</b><div class=meta>"+(bits.join(" \u00b7 ")||"alleen actieprijs")+"</div></div><div class=price>"+euro(best.total)+"</div></div>";
}
function paintStores(){
["setstores","huisstores"].forEach(function(id){
var el=document.getElementById(id);if(!el||typeof STORES==="undefined")return;
el.innerHTML=STORES.map(function(r){return "<button type=button class='chip "+((S.stores||{})[r.id]!==false?"on":"")+"' data-act=store data-id="+r.id+">"+r.n+"</button>";}).join("");
});
}
window.markFolder=function(){
document.querySelectorAll("#folderbody [data-act=adddeal]").forEach(function(btn){
var hit=hitFrom(btn);if(!hit)return;
var i=findEx(hit.n,hit.s);
var box=btn.querySelector(".qtybox,.price");
if(i>=0){btn.classList.add("onlist");var html="<div class=qtybox><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=-1>\u2212</button><span class=qtyn>"+(S.extras[i].q||1)+"</span><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=1>+</button></div>";if(box)box.outerHTML=html;else btn.insertAdjacentHTML("beforeend",html);}
else {btn.classList.remove("onlist");var qb=btn.querySelector(".qtybox");if(qb)qb.outerHTML="<div class=price>"+(hit.now?euro(hit.now):"")+"</div>";}
});
};
function markList(){
var body=document.getElementById("lijstbody");
var slot=document.getElementById("folderlijst");
var extras=S.extras||[];
var html="";
extras.forEach(function(e,i){
var k="e:"+i;
var on=!!(S.checked&&S.checked[k]);
var prijs=e.line||((e.cents||0)*(e.q||1));
html+="<div class=swipewrap data-k='"+k+"' data-extra=1><div class=swipebg>Verwijderen</div><div class='listrow "+(on?"muted":"")+"'><button type=button class='ck "+(on?"on":"")+"' data-act=tog data-k='"+k+"'>"+(on?"\u2713":"")+"</button><div style=flex:1><b>"+String(e.n||"").replace(/</g,"")+"</b><div class=meta>"+[storeN(e.sid),e.pack||""].filter(Boolean).join(" \u00b7 ")+"</div></div><div class=qtybox><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=-1>\u2212</button><span class=qtyn>"+(e.q||1)+"</span><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=1>+</button></div><div class=price>"+euro(prijs)+"</div></div></div>";
});
if(slot){slot.style.display=extras.length?"block":"none";slot.innerHTML=html;}
else if(body){
body.querySelectorAll("[data-extra]").forEach(function(n){n.remove();});
if(html){var empty=body.querySelector("p.sub");if(empty)empty.remove();body.insertAdjacentHTML("afterbegin",html);}
}
paintScore();
}
function addHit(hit){
if(!hit||!hit.n||typeof S==="undefined")return;
S.extras=S.extras||[];S.removed=S.removed||{};
Object.keys(S.removed).forEach(function(k){if(String(k).indexOf("e:")===0)delete S.removed[k];});
if(findEx(hit.n,hit.s)>=0){window.markFolder();markList();return;}
S.extras.push({n:hit.n,q:1,s:"Houdbaar",sid:hit.s||"",cents:+hit.now||0,line:+hit.now||0,pack:hit.qty||hit.pack||""});
if(typeof save==="function")save();
window.markFolder();
if(typeof drawList==="function")drawList();
markList();
}
function bump(i,d){
var e=(S.extras||[])[i];if(!e)return;
e.q=Math.max(0,(+e.q||1)+d);
if(e.q<=0)S.extras.splice(i,1);else e.line=(e.cents||0)*e.q;
if(typeof save==="function")save();
window.markFolder();
if(typeof drawList==="function")drawList();
markList();
}
document.addEventListener("click",function(e){
var t=e.target;if(t&&t.nodeType===3)t=t.parentNode;if(!t||!t.closest)return;
if(t.id==="closeset"||(t.closest&&t.closest("#closeset"))){e.preventDefault();e.stopPropagation();closePanel();return;}
if(t.id==="listgear"||(t.closest&&t.closest("#listgear"))){e.preventDefault();e.stopPropagation();var p=document.getElementById("storepanel");if(p){p.classList.add("on");paintStores();}return;}
var go=t.closest("[data-go]");
if(go){closePanel();return;}
var q=t.closest("[data-act=exqty]");
if(q){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();bump(+q.getAttribute("data-i"),+q.getAttribute("data-d"));return;}
var ad=t.closest("[data-act=adddeal]");
if(ad){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();var hit=hitFrom(ad);if(hit)addHit(hit);return;}
var st=t.closest("[data-act=store]");
if(st){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();var id=st.getAttribute("data-id");S.stores=S.stores||{};var on=S.stores[id]!==false;var nOn=0;Object.keys(S.stores).forEach(function(k){if(S.stores[k]!==false)nOn++;});if(on&&nOn<=1)return;S.stores[id]=!on;if(typeof save==="function")save();paintStores();markList();}
},true);
if(typeof drawList==="function"&&!drawList._actie){var _dl=drawList;drawList=function(){_dl();markList();};drawList._actie=true;}
if(typeof drawFolder==="function"&&!drawFolder._actie){var _df=drawFolder;drawFolder=function(){_df();window.markFolder();};drawFolder._actie=true;}
if(typeof drawHuis==="function"&&!drawHuis._actie){var _dh=drawHuis;drawHuis=function(){_dh();paintStores();};drawHuis._actie=true;}
if(typeof show==="function"&&!show._extras){var _sh=show;show=function(id){_sh(id);if(id==="lijst")markList();};show._extras=true;}
window.paintFolderList=markList;
setTimeout(function(){window.markFolder();markList();paintStores();},0);
})();
