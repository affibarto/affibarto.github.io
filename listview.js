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
function drawListByMeal(){
var body=document.getElementById("lijstbody");if(!body)return;
var slotF=document.getElementById("folderlijst");if(slotF)slotF.innerHTML="";
var html="";var n=0;
var days=typeof DAYS!=="undefined"?DAYS:["Ma","Di","Wo","Do","Vr","Za","Zo"];
days.forEach(function(d){
var slot=S.plan&&S.plan[d];if(!slot||!slot.id||slot.leftover)return;
var rec=typeof recipeBy==="function"?recipeBy(slot.id):null;if(!rec)return;
var scale=(typeof portions==="function"&&typeof eatersOn==="function")?portions(eatersOn(d))/4:1;
html+="<div class=sec>"+d+" \u00b7 "+rec.t+"</div>";
(rec.ing||[]).forEach(function(it){
if(S.omit&&S.omit[d+":"+slot.id+":"+it.k])return;
var k=it.k+"@"+d;
if(S.removed&&S.removed[k])return;
n++;html+=row(k,nm(it.k),rec.t,qty(it.q*scale));
});
if(typeof apartOn==="function")apartOn(d).forEach(function(p){
var ap=(typeof APART!=="undefined"&&APART.find(function(a){return a.id===(S.apartPick[d+":"+p.id]||"tosti");}))||(APART&&APART[0]);
if(!ap)return;
html+="<div class=sec>"+d+" \u00b7 "+p.name+" apart</div>";
(ap.ing||[]).forEach(function(it){var k=it.k+"@"+d+"@"+p.id;if(S.removed&&S.removed[k])return;n++;html+=row(k,nm(it.k),ap.t,qty(it.q));});
});
});
var extras=S.extras||[];
if(extras.length){
html+="<div class=sec>Actie</div>";
extras.forEach(function(e,i){
var k="e:"+i;if(S.removed&&S.removed[k])return;n++;
var prijs=e.line||((e.cents||0)*(e.q||1));
var right="<div class=qtybox><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=-1>\u2212</button><span class=qtyn>"+(e.q||1)+"</span><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=1>+</button></div><div class=price>"+euro(prijs)+"</div>";
html+=row(k,e.n,[storeN(e.sid),e.pack||""].filter(Boolean).join(" \u00b7 "),e.q||1,right);
});
}
var extraN=0;
(S.always||[]).forEach(function(a,i){
var k=a.k&&typeof CAT!=="undefined"&&CAT[a.k]?a.k:("x:"+a.n);
if(S.removed&&S.removed[k])return;
if(!extraN)html+="<div class=sec>Extra</div>";extraN++;n++;
html+=row(k,a.n||nm(a.k),"zelf",qty(a.q||1));
});
var line=document.getElementById("lijstline");if(line)line.textContent=n?n+" open":"";
body.innerHTML=html||"<p class=sub>Nog leeg. Zet eten op het bord, tik een actie, of spreek iets in.</p>";
if(typeof paintScore==="function")paintScore();
}
window.drawList=drawListByMeal;
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
drawListByMeal();
if(typeof toast==="function")toast(items.map(function(i){return i.q+"\u00d7 "+i.n;}).join(", "));
}
function startListen(){
var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(!SR){
var t=window.prompt("Wat moet er op de lijst? (komma of en)");
if(t)addSpoken(t);
return;
}
var rec=new SR();rec.lang="nl-NL";rec.interimResults=false;rec.maxAlternatives=1;
if(typeof toast==="function")toast("Zeg het maar…");
rec.onresult=function(ev){var said=ev.results[0][0].transcript;addSpoken(said);};
rec.onerror=function(){var t=window.prompt("Niet verstaan. Typ het:");if(t)addSpoken(t);};
rec.start();
}
document.addEventListener("click",function(e){
var t=e.target;if(t&&t.nodeType===3)t=t.parentNode;
if(t&&t.id==="mic"){e.preventDefault();e.stopPropagation();startListen();}
},true);
window.addSpoken=addSpoken;
setTimeout(function(){var v=document.getElementById("lijst");if(v&&v.classList.contains("on"))drawListByMeal();},0);
})();
