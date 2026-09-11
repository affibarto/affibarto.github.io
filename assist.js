(function(){
if(window._assist)return;window._assist=1;
function euro(c){return "\u20ac"+((+c||0)/100).toFixed(2).replace(".",",");}
function dealKind(hit){
var t=((hit&&(hit.deal||hit.d))||"").toLowerCase();
if(/1\s*\+\s*1|1\+1|twee voor de prijs van een|2=1/.test(t))return "oneplus";
if(/2e?\s*halve|tweede\s*halve|2e halve/.test(t))return "half";
if(/2\s*voor|twee voor|3\s*voor|pakket/.test(t)&&!/1\+1/.test(t))return "pack";
return "";
}

function normBrand(s){
return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[''`\u2019]/g,"").replace(/\s+/g," ").trim();
}
// NL private labels / store house lines (huismerk)
var _HOUSE_EXACT={
"ah":1,"albert heijn":1,"ah terra":1,"ah biologisch":1,"ah puur & eerlijk":1,"ah puur en eerlijk":1,
"jumbo":1,"plus":1,"lidl":1,"dirk":1,"1 de beste":1,"1debeste":1,
"gwoon":1,"g woon":1,"everyday":1,"budget":1,"aldi":1,
"hoogvliet":1,"dekamarkt":1,"dekavers":1,"vomar":1,"ekoplaza":1,"picnic":1,
"milsani":1,"daylicious":1,"euro shopper":1,"euroshopper":1,
"moser roth":1,"power force":1,"alpen schmaus":1,"boni":1,"xtra":1
};
var _HOUSE_PREFIX=/^(ah|albert heijn|jumbo|plus|lidl|dirk|aldi|hoogvliet|dekavers|dekamarkt|gwoon|1 de beste|everyday|budget|picnic|milsani|daylicious)\b/;
function isHouseBrand(s){
var n=normBrand(s);
if(!n)return false;
if(_HOUSE_EXACT[n])return true;
if(_HOUSE_PREFIX.test(n))return true;
// "AH Something" as brand string
if(/^ah\b/.test(n))return true;
return false;
}
function detectBrandTier(hit){
if(!hit)return "";
var brand=hit.b||hit.brand||"";
var name=hit.n||"";
if(isHouseBrand(brand)||isHouseBrand(name))return "B";
if(String(brand).trim())return "A";
return "";
}
window.detectBrandTier=detectBrandTier;
window.isHouseBrand=isHouseBrand;
function ask(title,body,yes,no,onYes,onNo){
var p=document.getElementById("askbox");
if(!p){
p=document.createElement("section");p.className="panel";p.id="askbox";
p.innerHTML="<div class=hd><b id=askt></b></div><div class=sc><p class=note id=askb></p><button class='btn g full' id=askyes></button><button class='btn w full' id=askno style=margin-top:8px></button></div>";
(document.querySelector(".phone")||document.body).appendChild(p);
}
document.getElementById("askt").textContent=title;
document.getElementById("askb").textContent=body;
document.getElementById("askyes").textContent=yes;
document.getElementById("askno").textContent=no;
p.classList.add("on");
function close(){p.classList.remove("on");}
document.getElementById("askyes").onclick=function(){close();onYes&&onYes();};
document.getElementById("askno").onclick=function(){close();onNo&&onNo();};
}
window.markFolder=function(){
document.querySelectorAll("#folderbody [data-act=adddeal]").forEach(function(btn){
var hit=(window._folderRows||[])[+btn.getAttribute("data-idx")];
if(!hit)return;
S.extras=S.extras||[];
var i=-1;for(var x=0;x<S.extras.length;x++){if(S.extras[x].n===hit.n&&(S.extras[x].sid||"")===(hit.s||""))i=x;}
var q=i>=0?(+S.extras[i].q||1):0;
btn.classList.toggle("onlist",q>0);
var mini=btn.querySelector(".qmini");
if(q>0){
if(!mini){mini=document.createElement("div");mini.className="qmini";btn.appendChild(mini);}
mini.innerHTML="<button type=button class=qminbtn data-act=exqty data-i="+i+" data-d=-1>\u2212</button><span>"+q+"</span><button type=button class=qminbtn data-act=exqty data-i="+i+" data-d=1>+</button>";
}else if(mini)mini.remove();
var pr=btn.querySelector(".price");
if(pr&&hit.now)pr.textContent=euro(hit.now);
});
};
function put(hit,q){
if(!hit||!hit.n)return;
S.extras=S.extras||[];
S.itemBrand=S.itemBrand||{};
var i=-1;for(var x=0;x<S.extras.length;x++){if(S.extras[x].n===hit.n&&(S.extras[x].sid||"")===(hit.s||""))i=x;}
var pack=hit.qty||hit.q||hit.pack||"";
var brand=hit.b||hit.brand||"";
var deal=hit.deal||"";
var tier=detectBrandTier(hit);
var isNew=i<0;
if(i>=0){
S.extras[i].q=(+S.extras[i].q||1)+q;
if(!S.extras[i].b&&brand)S.extras[i].b=brand;
if(!S.extras[i].brand&&brand)S.extras[i].brand=brand;
if(!S.extras[i].pack&&pack)S.extras[i].pack=pack;
if(!S.extras[i].deal&&deal)S.extras[i].deal=deal;
if(!S.extras[i].sid&&hit.s)S.extras[i].sid=hit.s;
// qty bump: never wipe brandTier / itemBrand override
}else{
var row={n:hit.n,q:q,s:"Houdbaar",sid:hit.s||"",cents:+hit.now||0,line:(+hit.now||0)*q,pack:pack,deal:deal,b:brand,brand:brand};
if(tier==="A"||tier==="B")row.brandTier=tier;
S.extras.push(row);
i=S.extras.length-1;
}
var e=S.extras[i];e.line=(e.cents||0)*e.q;
var extraKey="e:"+i+":"+e.n;
if(isNew&&(tier==="A"||tier==="B")){
e.brandTier=tier;
S.itemBrand[extraKey]=tier;
}
if(typeof save==="function")save();
window.markFolder();
if(typeof drawList==="function")drawList();
else if(typeof stampItemBrands==="function")stampItemBrands();
if(isNew&&typeof toast==="function"){
if(tier==="B")toast("Huismerk (B)");
else if(tier==="A")toast("A-merk");
}
}
function consider(hit){
var k=dealKind(hit);
if(k==="oneplus"){
ask("1+1 gratis",hit.n+" is 1+1. Zet ik er twee op de lijst? Anders geldt de actieprijs niet.","Ja, twee","Nee, één",function(){put(hit,2);},function(){put(hit,1);});
return;
}
if(k==="half"){
ask("2e halve prijs",hit.n+": de actie geldt vanaf twee stuks. Twee op de lijst?","Ja, twee","Nee, één",function(){put(hit,2);},function(){put(hit,1);});
return;
}
if(k==="pack"){
ask("Actie vanaf twee",(hit.deal||"Deze actie")+" \u2014 twee stuks op de lijst?","Ja, twee","Nee, één",function(){put(hit,2);},function(){put(hit,1);});
return;
}
put(hit,1);
}
document.addEventListener("click",function(e){
var t=e.target;if(t&&t.nodeType===3)t=t.parentNode;if(!t||!t.closest)return;
var ad=t.closest("[data-act=adddeal]");
if(ad&&!t.closest("[data-act=exqty]")){
e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
var hit=(window._folderRows||[])[+ad.getAttribute("data-idx")];
if(hit&&findAlready(hit))return;
if(hit)consider(hit);
}
var gh=t.closest("[data-act=gehaald]");
if(gh){e.preventDefault();e.stopPropagation();gotDay(gh.getAttribute("data-d"));}
},true);
function findAlready(hit){
S.extras=S.extras||[];
for(var i=0;i<S.extras.length;i++){if(S.extras[i].n===hit.n&&(S.extras[i].sid||"")===(hit.s||""))return true;}
return false;
}
function gotDay(d){
if(!d||!S.plan||!S.plan[d]||!S.plan[d].id)return;
S.shopped=S.shopped||{};S.shopped[d]=true;
S.checked=S.checked||{};
Object.keys(S.checked).forEach(function(){});
document.querySelectorAll("#lijstbody .swipewrap").forEach(function(w){
var k=w.getAttribute("data-k")||"";
if(k.indexOf("@"+d)===k.length-d.length-1||k.slice(-d.length-1)==="@"+d)S.checked[k]=true;
});
(S.plan[d]&&typeof recipeBy==="function"?recipeBy(S.plan[d].id):null);
if(S.plan[d]&&S.plan[d].id){
var rec=recipeBy(S.plan[d].id);
if(rec)(rec.ing||[]).forEach(function(it){S.checked[it.k+"@"+d]=true;});
}
if(typeof save==="function")save();
if(typeof drawList==="function")drawList();
if(typeof toast==="function")toast("Gehaald: "+d);
}
window.gotDay=gotDay;
setTimeout(function(){if(typeof markFolder==="function")markFolder();},0);
})();
