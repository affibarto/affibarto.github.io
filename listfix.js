(function(){
if(window._listfix)return;window._listfix=1;
var lock=0;
function go(fn){var n=Date.now();if(n<lock)return;lock=n+350;fn();}
function isCtrl(el){return el&&el.closest&&el.closest(".ck,[data-act=tog],[data-act=qty],.qtybtn,.qtybox");}
if(typeof removeItem==="function"&&!removeItem._fix){var _rm=removeItem;removeItem=function(k){if(!k)return;if(String(k).indexOf("e:")===0){var i=+String(k).split(":")[1];if(!isNaN(i)&&(S.extras||[])[i])S.extras.splice(i,1);S.removed=S.removed||{};delete S.removed[k];if(typeof save==="function")save();if(typeof drawList==="function")drawList();if(typeof drawStores==="function")drawStores();if(typeof toast==="function")toast("Weg van de lijst");return;}return _rm(k);};removeItem._fix=true;}
function doTog(k){if(!k)return;go(function(){S.checked=S.checked||{};S.checked[k]=!S.checked[k];if(typeof save==="function")save();if(typeof drawList==="function")drawList();});}
function doQty(i,d){go(function(){if(typeof bumpExtra==="function"){window._skipFolder=1;bumpExtra(i,d);window._skipFolder=0;}});} 
function handle(e){var q=e.target.closest&&e.target.closest("[data-act=qty],.qtybtn");if(q){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();var btn=q.closest("[data-act=qty]")||q;doQty(+btn.getAttribute("data-i"),+btn.getAttribute("data-d"));return true;}var t=e.target.closest&&e.target.closest("[data-act=tog],.ck");if(t){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();var k=t.getAttribute("data-k")||(t.closest(".swipewrap")&&t.closest(".swipewrap").getAttribute("data-k"));doTog(k);return true;}return false;}
document.addEventListener("touchstart",function(e){if(isCtrl(e.target))e.stopPropagation();},true);
document.addEventListener("touchend",handle,true);
document.addEventListener("click",handle,true);
})();
