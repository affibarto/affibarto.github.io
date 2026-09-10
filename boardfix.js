(function(){
if(window._boardfix)return;window._boardfix=1;
function wipeDay(d){
if(!S.plan||!S.plan[d])return;
S.plan[d]={};
if(S.eaten)delete S.eaten[d];
if(typeof save==="function")save();
if(typeof drawBord==="function")drawBord();
if(typeof drawList==="function")drawList();
if(typeof toast==="function")toast("Van het bord");
}
function wrapDays(){
var host=document.getElementById("days");if(!host)return;
host.querySelectorAll(".dayrow").forEach(function(row){
if(row.closest(".swipewrap"))return;
if(!row.querySelector("[data-act=gegeten]"))return;
var wrap=document.createElement("div");
wrap.className="swipewrap right";
wrap.setAttribute("data-d",row.getAttribute("data-d"));
var bg=document.createElement("div");
bg.className="swipebg";
bg.textContent="Weg";
row.parentNode.insertBefore(wrap,row);
wrap.appendChild(bg);
wrap.appendChild(row);
});
}
if(typeof drawBord==="function"&&!drawBord._swipe){var _db=drawBord;drawBord=function(){_db();wrapDays();};drawBord._swipe=true;}
var startX=0,cur=null,dx=0,locked=false;
function grab(x,el){var wrap=el.closest&&el.closest("#days .swipewrap");if(!wrap||el.closest&&el.closest("button"))return null;startX=x;cur=wrap;dx=0;locked=false;var row=wrap.querySelector(".dayrow");if(row)row.style.transition="none";return wrap;}
function move(x){if(!cur)return;var adx=x-startX;if(Math.abs(adx)>12)locked=true;if(!locked)return;dx=Math.max(0,adx);var row=cur.querySelector(".dayrow");if(row)row.style.transform="translateX("+dx+"px)";}
function end(){if(!cur)return;var wrap=cur,d=wrap.getAttribute("data-d");var row=wrap.querySelector(".dayrow");if(row)row.style.transition="transform .15s ease";if(dx>88){if(row)row.style.transform="translateX(100%)";setTimeout(function(){wipeDay(d);},140);}else if(row)row.style.transform="";cur=null;dx=0;}
document.addEventListener("touchstart",function(e){if(e.target.closest&&e.target.closest("#days"))grab(e.changedTouches[0].clientX,e.target);},true);
document.addEventListener("touchmove",function(e){if(cur)move(e.changedTouches[0].clientX);},true);
document.addEventListener("touchend",function(){if(cur)end();},true);
document.addEventListener("mousedown",function(e){if(e.target.closest&&e.target.closest("#days")){if(grab(e.clientX,e.target)){window._bdrag=1;e.preventDefault();}}},true);
document.addEventListener("mousemove",function(e){if(window._bdrag&&cur)move(e.clientX);},true);
document.addEventListener("mouseup",function(){if(window._bdrag){window._bdrag=0;end();}},true);
window.clearList=function(){
S.extras=[];S.always=[];S.checked={};S.removed={};
if(typeof save==="function")save();
if(typeof drawList==="function")drawList();
if(typeof drawHuis==="function")drawHuis();
if(typeof toast==="function")toast("Acties en extra weg. Boodschappen van het bord blijven.");
};
document.addEventListener("click",function(e){
var t=e.target;if(t&&t.nodeType===3)t=t.parentNode;
var btn=(t&&t.closest)?t.closest("#clearlist"):(t&&t.id==="clearlist"?t:null);
if(btn){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();if(window.confirm("Acties en extra van de lijst af? Gerechten blijven op het bord."))window.clearList();}
},true);
setTimeout(wrapDays,0);
})();
