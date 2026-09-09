(function(){
if(window._actieOnce)return;window._actieOnce=1;
function euro(c){return "\u20ac"+((+c||0)/100).toFixed(2).replace(".",",");}
function storeN(id){var s=(typeof STORES!=="undefined"?STORES:[]).filter(function(x){return x.id===id;})[0];return s?s.n:(id||"");}
function paint(){
var host=document.getElementById("folderlijst");
if(!host)return;
var extras=(typeof S!=="undefined"&&S.extras)||[];
if(!extras.length){host.innerHTML="";return;}
var html="<div class=sec>Uit de folder</div>";
extras.forEach(function(e,i){
var prijs=e.line||((e.cents||0)*(e.q||1));
html+="<div class=listrow><div style=flex:1><b>"+String(e.n||"").replace(/</g,"")+"</b><div class=meta>"+[storeN(e.sid),e.pack||""].filter(Boolean).join(" \u00b7 ")+"</div></div>";
html+="<div class=qtybox><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=-1>\u2212</button><span class=qtyn>"+(e.q||1)+"</span><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=1>+</button></div>";
html+="<div class=price>"+euro(prijs)+"</div></div>";
});
host.innerHTML=html;
var line=document.getElementById("lijstline");
if(line)line.textContent=extras.length+" uit de folder";
}
function addHit(hit){
if(!hit||!hit.n)return;
if(typeof S==="undefined")return;
S.extras=S.extras||[];
S.removed=S.removed||{};
Object.keys(S.removed).forEach(function(k){if(String(k).indexOf("e:")===0)delete S.removed[k];});
var i=-1;
for(var x=0;x<S.extras.length;x++){if(S.extras[x].n===hit.n&&(S.extras[x].sid||"")===(hit.s||""))i=x;}
if(i>=0){S.extras[i].q=(+S.extras[i].q||1)+1;S.extras[i].cents=S.extras[i].cents||hit.now||0;S.extras[i].line=(S.extras[i].cents||0)*S.extras[i].q;}
else{S.extras.push({n:hit.n,q:1,s:"Houdbaar",sid:hit.s||"",cents:hit.now||0,line:hit.now||0,img:hit.img||"",pack:hit.qty||hit.q||""});i=S.extras.length-1;}
if(typeof save==="function")save();
paint();
if(typeof toast==="function")toast(S.extras[i].q+"\u00d7 "+hit.n);
var lijst=document.getElementById("lijst");
var folder=document.getElementById("folder");
if(folder)folder.classList.remove("on");
if(lijst)lijst.classList.add("on");
document.querySelectorAll(".nav button").forEach(function(b){b.classList.toggle("on",b.getAttribute("data-go")==="lijst");});
}
function bump(i,d){
var e=(S.extras||[])[i];if(!e)return;
e.q=Math.max(0,(+e.q||1)+d);
if(e.q<=0)S.extras.splice(i,1);else e.line=(e.cents||0)*e.q;
if(typeof save==="function")save();
paint();
}
document.addEventListener("click",function(e){
var t=e.target;if(t&&t.nodeType===3)t=t.parentNode;if(!t||!t.closest)return;
var ad=t.closest("[data-act=adddeal]");
if(ad){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();var hit=(window._folderRows||[])[+ad.getAttribute("data-idx")];if(hit)addHit(hit);return;}
var q=t.closest("[data-act=exqty]");
if(q){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();bump(+q.getAttribute("data-i"),+q.getAttribute("data-d"));}
},true);
if(typeof drawList==="function"&&!drawList._actie){var _dl=drawList;drawList=function(){_dl();paint();};drawList._actie=true;}
window.paintFolderList=paint;
window.addHit=addHit;
setTimeout(paint,0);
})();
