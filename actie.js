(function(){
if(window._actieOnce)return;window._actieOnce=1;
function findEx(n,sid){S.extras=S.extras||[];for(var i=0;i<S.extras.length;i++){if(S.extras[i].n===n&&(S.extras[i].sid||"")===(sid||""))return i;}return -1;}
function qtyOf(n,sid){var i=findEx(n,sid);return i<0?0:(+S.extras[i].q||1);}
function qtyHtml(i,q){return "<div class=qtybox><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=-1>\u2212</button><span class=qtyn>"+q+"</span><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=1>+</button></div>";}
function markFolder(){
var rows=window._folderRows||[];
document.querySelectorAll("#folderbody [data-act=adddeal]").forEach(function(btn){
var hit=rows[+btn.getAttribute("data-idx")];
if(!hit)return;
var i=findEx(hit.n,hit.s);
var box=btn.querySelector(".qtybox,.price,span.qtyn");
if(i>=0){
btn.classList.add("onlist");
var q=+S.extras[i].q||1;
var html=qtyHtml(i,q);
if(box)box.outerHTML=html;else btn.insertAdjacentHTML("beforeend",html);
}else{
btn.classList.remove("onlist");
var qb=btn.querySelector(".qtybox");
if(qb){
var prijs=hit.now?("\u20ac"+(hit.now/100).toFixed(2).replace(".",",")):"";
qb.outerHTML="<div class=price>"+prijs+"</div>";
}
}
});
}
function markList(){
var host=document.getElementById("folderlijst");
if(host)host.innerHTML="";
document.querySelectorAll("#lijstbody .swipewrap").forEach(function(w){
var k=w.getAttribute("data-k")||"";
var row=w.querySelector(".listrow");if(!row)return;
if(k.indexOf("e:")===0){
var i=+k.split(":")[1];
var e=(S.extras||[])[i];if(!e)return;
if(row.querySelector(".qtybox")){row.querySelector(".qtyn").textContent=String(e.q||1);return;}
var tails=row.querySelectorAll(":scope > .meta");
var tail=tails.length?tails[tails.length-1]:null;
var box=document.createElement("div");
box.className="qtybox";
box.innerHTML="<button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=-1>\u2212</button><span class=qtyn>"+(e.q||1)+"</span><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=1>+</button>";
if(tail)tail.replaceWith(box);else row.appendChild(box);
}else{
var tail=null;row.querySelectorAll(":scope > .meta").forEach(function(m){tail=m;});
if(tail&&!row.querySelector(".qtyn,.qtybox")){tail.classList.add("qtyn");}
}
});
}
function addHit(hit){
if(!hit||!hit.n||typeof S==="undefined")return;
S.extras=S.extras||[];S.removed=S.removed||{};
Object.keys(S.removed).forEach(function(k){if(String(k).indexOf("e:")===0)delete S.removed[k];});
var i=findEx(hit.n,hit.s);
if(i>=0)return markFolder();
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
var q=t.closest("[data-act=exqty]");
if(q){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();bump(+q.getAttribute("data-i"),+q.getAttribute("data-d"));return;}
var ad=t.closest("[data-act=adddeal]");
if(ad){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();var hit=(window._folderRows||[])[+ad.getAttribute("data-idx")];if(hit)addHit(hit);}
},true);
if(typeof drawList==="function"&&!drawList._actie){var _dl=drawList;drawList=function(){_dl();markList();};drawList._actie=true;}
if(typeof drawFolder==="function"&&!drawFolder._actie){var _df=drawFolder;drawFolder=function(){_df();markFolder();};drawFolder._actie=true;}
window.paintFolderList=markList;
setTimeout(function(){markFolder();markList();},0);
})();
