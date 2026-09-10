(function(){
if(window._listview)return;window._listview=1;
function euro(c){return "\u20ac"+((+c||0)/100).toFixed(2).replace(".",",");}
function storeN(id){var s=(typeof STORES!=="undefined"?STORES:[]).filter(function(x){return x.id===id;})[0];return s?s.n:(id||"");}
function nm(k){return (typeof CAT!=="undefined"&&CAT[k]&&CAT[k].name)||k;}
function qty(n){return typeof n==="number"?String(Math.round(n*2)/2).replace(".",","):String(n||1);}
function row(k,name,meta,qtxt,rightHtml){
var on=!!(S.checked&&S.checked[k]);
return "<div class=swipewrap data-k='"+String(k).replace(/'/g,"")+"'><div class=swipebg>Verwijderen</div><div class='listrow "+(on?"muted":"")+"'><button type=button class='ck "+(on?"on":"")+"' data-act=tog data-k='"+String(k).replace(/'/g,"")+"'>"+(on?"\u2713":"")+"</button><div style=flex:1><b>"+String(name||"").replace(/</g,"")+"</b>"+(meta?"<div class=meta>"+meta+"</div>":"")+"</div>"+(rightHtml||("<div class=qtyn>"+qtxt+"</div>"))+"</div></div>";
}
function eatersMain(d){
if(typeof S==="undefined"||!S.people)return [];
return S.people.filter(function(p){
var m=(typeof modeOf==="function")?modeOf(d,p):(p.sched&&p.sched[d])||"eat";
return m==="eat"||m==="later";
});
}
function drawListByMeal(){
var body=document.getElementById("lijstbody");if(!body)return;
var slotF=document.getElementById("folderlijst");if(slotF)slotF.innerHTML="";
var html="";var n=0;
var days=typeof DAYS!=="undefined"?DAYS:["Ma","Di","Wo","Do","Vr","Za","Zo"];
days.forEach(function(d){
var slot=S.plan&&S.plan[d];if(!slot||!slot.id||slot.leftover)return;
var rec=typeof recipeBy==="function"?recipeBy(slot.id):null;if(!rec)return;
var who=eatersMain(d);
var scale=(typeof portions==="function")?portions(who.length?who:(S.people||[]))/4:1;
var done=S.shopped&&S.shopped[d];
html+="<div class=sec style=display:flex;align-items:center;justify-content:space-between;gap:8px><span>"+d+" \u00b7 "+rec.t+(done?" \u00b7 gehaald":"")+"</span><button type=button class='btn s w' data-act=gehaald data-d="+d+">"+(done?"Ok":"Gehaald")+"</button></div>";
(rec.ing||[]).forEach(function(it){
if(S.omit&&S.omit[d+":"+slot.id+":"+it.k])return;
var k=it.k+"@"+d;
if(S.removed&&S.removed[k])return;
n++;html+=row(k,nm(it.k),rec.t,qty(it.q*scale));
});
});
var extras=S.extras||[];
if(extras.length){
html+="<div class=sec>Actie</div>";
extras.forEach(function(e,i){
var k="e:"+i+":"+e.n;if(S.removed&&S.removed[k])return;n++;
var prijs=e.line||((e.cents||0)*(e.q||1));
var right="<div class=qtybox><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=-1>\u2212</button><span class=qtyn>"+(e.q||1)+"</span><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=1>+</button></div><div class=price>"+euro(prijs)+"</div>";
html+=row(k,e.n,[storeN(e.sid),e.pack||""].filter(Boolean).join(" \u00b7 "),e.q||1,right);
});
}
var extraN=0;
(S.always||[]).forEach(function(a){
var k=a.k&&typeof CAT!=="undefined"&&CAT[a.k]?a.k:("x:"+a.n);
if(S.removed&&S.removed[k])return;
if(!extraN)html+="<div class=sec>Extra</div>";extraN++;n++;
html+=row(k,a.n||nm(a.k),"zelf",qty(a.q||1));
});
var line=document.getElementById("lijstline");if(line)line.textContent=n?n+" open":"";
if(!html){
  var micOk=!!(window.SpeechRecognition||window.webkitSpeechRecognition||document.getElementById("mic"));
  body.innerHTML="<div class=empty-list>"+
    "<p class=\"sub ghost\">Nog stil hier. Zet avondeten op het bord, tik een actie, of zeg wat erbij moet.</p>"+
    "<button type=button class=\"card emptycta\" data-go=\"bord\"><div class=p><b>Naar Bord</b><div class=meta>Kies of laat voorstellen zetten</div></div></button>"+
    "<button type=button class=\"card emptycta\" data-go=\"folder\"><div class=p><b>Naar Actie</b><div class=meta>Folderhits van Dirk, AH, Lidl…</div></div></button>"+
    "<button type=button class=\"card emptycta\" id=emptymic><div class=p><b>"+(micOk?"Spreek in":"Typ iets in")+"</b><div class=meta>"+(micOk?"Zeg wat er op de lijst moet":"Via + of typ een product")+"</div></div></button>"+
    "</div>";
}else body.innerHTML=html;
if(typeof paintScore==="function")paintScore();
}
window.drawList=drawListByMeal;
// re-apply brands/actie wraps that ran before listview overwrote drawList
if(typeof paintBrand==="function"||typeof stampItemBrands==="function"||typeof markList==="function"){
  var _base=window.drawList;
  window.drawList=function(){
    _base();
    if(typeof markList==="function")markList();
    if(typeof paintBrand==="function")paintBrand();
    if(typeof stampItemBrands==="function")stampItemBrands();
  };
}
var WOORD={een:1,"\u00e9\u00e9n":1,twee:2,drie:3,vier:4,vijf:5,zes:6,zeven:7,acht:8,negen:9,tien:10,elf:11,twaalf:12};
function parseSpeak(text){
text=String(text||"").toLowerCase().replace(/\ben\b/g,",").replace(/[+/]/g,",");
return text.split(/[,;.]+/).map(function(s){return s.trim();}).filter(Boolean).map(function(part){
var m=part.match(/^(\d+(?:[.,]\d+)?)\s+(.*)$/);
if(m)return {n:m[2],q:+m[1].replace(",",".")};
var w=part.split(/\s+/);
if(WOORD[w[0]]&&w.length>1)return {n:w.slice(1).join(" "),q:WOORD[w[0]]};
return {n:part,q:1};
}).filter(function(x){return x.n&&x.n.length>1;});
}
function addSpoken(text){
var items=parseSpeak(text);
if(!items.length){if(typeof toast==="function")toast("Niets herkend");return;}
S.always=S.always||[];
items.forEach(function(it){
var hit=-1;for(var i=0;i<S.always.length;i++){if((S.always[i].n||"").toLowerCase()===it.n)hit=i;}
if(hit>=0)S.always[hit].q=(+S.always[hit].q||1)+it.q;
else S.always.push({n:it.n,q:it.q});
});
if(typeof save==="function")save();
if(typeof window.drawList==="function")window.drawList();else drawListByMeal();
if(typeof toast==="function")toast(items.map(function(i){return i.q+"\u00d7 "+i.n;}).join(", "));
}
function startListen(){
var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(!SR){var t=window.prompt("Wat moet er op de lijst?");if(t)addSpoken(t);return;}
var rec=new SR();rec.lang="nl-NL";rec.interimResults=false;rec.maxAlternatives=1;
if(typeof toast==="function")toast("Zeg het maar…");
rec.onresult=function(ev){addSpoken(ev.results[0][0].transcript);};
rec.onerror=function(){var t=window.prompt("Niet verstaan. Typ het:");if(t)addSpoken(t);};
rec.start();
}
document.addEventListener("click",function(e){
var t=e.target;if(t&&t.nodeType===3)t=t.parentNode;
if(!t)return;
var mic=t.id==="mic"||t.id==="emptymic"||(t.closest&&t.closest("#emptymic"));
if(mic){e.preventDefault();e.stopPropagation();startListen();return;}
},true);
window.addSpoken=addSpoken;
setTimeout(function(){var v=document.getElementById("lijst");if(v&&v.classList.contains("on")&&typeof window.drawList==="function")window.drawList();},0);
})();
