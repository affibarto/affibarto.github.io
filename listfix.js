(function(){
if(window._listfix)return;window._listfix=1;
var lock=0;
function go(fn){var n=Date.now();if(n<lock)return;lock=n+300;fn();}
function inList(el){return el&&el.closest&&el.closest("#lijstbody");}
if(typeof removeItem==="function"&&!removeItem._fix){var _rm=removeItem;removeItem=function(k){if(k&&String(k).indexOf("e:")===0){var i=+String(k).split(":")[1];if(!isNaN(i)&&(S.extras||[])[i])S.extras.splice(i,1);if(typeof save==="function")save();if(typeof drawList==="function")drawList();if(typeof toast==="function")toast("Weg van de lijst");return;}return _rm(k);};removeItem._fix=true;}
function handle(e){if(!inList(e.target))return;var q=e.target.closest("[data-act=qty],.qtybtn");if(q){e.preventDefault();e.stopPropagation();var btn=q.closest("[data-act=qty]")||q;go(function(){if(typeof bumpExtra==="function")bumpExtra(+btn.getAttribute("data-i"),+btn.getAttribute("data-d"));});return;}var t=e.target.closest("[data-act=tog],.ck");if(t){e.preventDefault();e.stopPropagation();var k=t.getAttribute("data-k")||(t.closest(".swipewrap")&&t.closest(".swipewrap").getAttribute("data-k"));go(function(){S.checked=S.checked||{};S.checked[k]=!S.checked[k];if(typeof save==="function")save();if(typeof drawList==="function")drawList();});}}
document.addEventListener("touchstart",function(e){if(inList(e.target)&&e.target.closest(".ck,[data-act=qty],.qtybtn"))e.stopPropagation();},true);
document.addEventListener("click",handle,true);
})();
