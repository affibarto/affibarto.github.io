(function(){
function hitFrom(el){if(!el)return null;var btn=el.closest?el.closest("[data-act=adddeal]"):null;if(!btn)return null;return (window._folderRows||[])[+btn.getAttribute("data-idx")]||null;}
function addHit(hit){if(!hit||!hit.n){if(typeof toast==="function")toast("Geen product");return;}
S.extras=S.extras||[];
var i=-1;for(var x=0;x<S.extras.length;x++){if(S.extras[x].n===hit.n&&(S.extras[x].sid||"")===(hit.s||""))i=x;}
if(i>=0){S.extras[i].q=(+S.extras[i].q||1)+1;S.extras[i].cents=S.extras[i].cents||hit.now||0;S.extras[i].line=(S.extras[i].cents||0)*S.extras[i].q;}
else {S.extras.push({n:hit.n,q:1,s:"Houdbaar",sid:hit.s||"",cents:hit.now||0,line:hit.now||0,img:hit.img||"",pack:hit.qty||hit.q||""});i=S.extras.length-1;}
if(typeof save==="function")save();
if(typeof toast==="function")toast(S.extras[i].q+"\u00d7 "+hit.n);
if(typeof show==="function")show("lijst");else if(typeof drawList==="function")drawList();
}
function bump(i,d){var e=(S.extras||[])[i];if(!e)return;e.q=Math.max(0,(+e.q||1)+d);if(e.q<=0)S.extras.splice(i,1);else e.line=(e.cents||0)*e.q;if(typeof save==="function")save();if(typeof drawList==="function")drawList();}
document.addEventListener("click",function(e){
var t=e.target;
if(t&&t.nodeType===3)t=t.parentNode;
if(!t||!t.closest)return;
var ad=t.closest("[data-act=adddeal]");
if(ad){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();addHit(hitFrom(ad));return;}
var q=t.closest("[data-act=exqty]");
if(q){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();bump(+q.getAttribute("data-i"),+q.getAttribute("data-d"));}
},true);
window.addHit=addHit;
})();
