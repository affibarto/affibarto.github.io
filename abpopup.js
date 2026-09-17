/* A/B merk popup vóór Zet op het bord / Bijwerken (v60)
 * Prijsfilosofie: per ingrediënt de laagste unitPrice over activeStores (winkelselectie),
 * zelfde unitPrice/bonusOf als paintScore/drawStores. Totals = som(best × qty).
 * Indicatie, geen kassaprijs — nooit verzonnen besparingen.
 */
(function(){
if(window._abPopupOnce)return;window._abPopupOnce=1;

var draft={mode:"MIX",swaps:{},day:null,rid:null};

function euro(c){
if(c==null||!isFinite(c))return "onbekend";
return "\u20ac"+((+c)/100).toFixed(2).replace(".",",");
}

function stores(){
if(typeof activeStores==="function")return activeStores();
return typeof STORES!=="undefined"?STORES:[];
}

/** Laagste unitPrice over activeStores voor geforceerd merk A of B. */
function bestForBrand(cat,brand,k){
if(!cat||typeof unitPrice!=="function")return {cents:null,sid:null,bonus:null};
S.itemBrand=S.itemBrand||{};
var prev=S.itemBrand[k];
var had=Object.prototype.hasOwnProperty.call(S.itemBrand,k);
S.itemBrand[k]=brand;
var best=null,bestSid=null,bonusHit=null;
stores().forEach(function(r){
var sid=r.id||r;
var pr=unitPrice(cat,sid,brand,k);
if(pr==null||!isFinite(pr))return;
if(best==null||pr<best){best=pr;bestSid=sid;}
if(typeof bonusOf==="function"){
var b=bonusOf(k,sid);
if(b&&b.now!=null){
if(!bonusHit||b.now<bonusHit.now){
bonusHit={now:b.now,deal:b.deal||"",was:b.was,store:(r.n||sid),sid:sid};
}
}
}
});
if(had)S.itemBrand[k]=prev;else delete S.itemBrand[k];
return {cents:best,sid:bestSid,bonus:bonusHit};
}

function mealLines(day,rec){
var lines=[];
if(!rec||!rec.ing)return lines;
var eat=(typeof eatersOn==="function")?eatersOn(day):(S.people||[]);
var scale=(typeof portions==="function")?portions(eat)/4:1;
rec.ing.forEach(function(it){
if(!it||!it.k)return;
if(S.omit&&S.omit[day+":"+rec.id+":"+it.k])return;
var cat=(typeof CAT!=="undefined"&&CAT[it.k])?CAT[it.k]:null;
if(!cat)return;
var q=(+it.q||1)*scale;
var a=bestForBrand(cat,"A",it.k);
var b=bestForBrand(cat,"B",it.k);
var name=(typeof productLabel==="function")?productLabel(cat):(cat.label||cat.name||it.k);
var lineA=(a.cents!=null)?Math.round(a.cents*Math.max(q,0.5)):null;
var lineB=(b.cents!=null)?Math.round(b.cents*Math.max(q,0.5)):null;
var gap=(lineA!=null&&lineB!=null)?Math.abs(lineA-lineB):null;
lines.push({
k:it.k,name:name,q:q,
a:a,b:b,lineA:lineA,lineB:lineB,gap:gap,
bonus:a.bonus||b.bonus||null
});
});
(typeof mealAdds==="function"?mealAdds(day,rec.id):[]).forEach(function(it){
if(!it||!it.k||!CAT||!CAT[it.k])return;
if(S.omit&&S.omit[day+":"+rec.id+":"+it.k])return;
var cat=CAT[it.k];
var q=(+it.q||1)*scale;
var a=bestForBrand(cat,"A",it.k);
var b=bestForBrand(cat,"B",it.k);
var name=(typeof productLabel==="function")?productLabel(cat):(cat.label||cat.name||it.k);
var lineA=(a.cents!=null)?Math.round(a.cents*Math.max(q,0.5)):null;
var lineB=(b.cents!=null)?Math.round(b.cents*Math.max(q,0.5)):null;
var gap=(lineA!=null&&lineB!=null)?Math.abs(lineA-lineB):null;
lines.push({
k:it.k,name:name,q:q,
a:a,b:b,lineA:lineA,lineB:lineB,gap:gap,
bonus:a.bonus||b.bonus||null
});
});
return lines;
}

function sumKnown(lines,key){
var t=0,n=0;
lines.forEach(function(L){
var v=L[key];
if(v==null)return;
t+=v;n++;
});
return n?t:null;
}

function pickSwaps(lines){
return lines.filter(function(L){
return L.gap!=null&&L.gap>0&&L.lineA!=null&&L.lineB!=null;
}).sort(function(a,b){return b.gap-a.gap;}).slice(0,4);
}

function closeAb(){
var p=document.getElementById("abpanel");
if(p)p.classList.remove("on");
draft={mode:"MIX",swaps:{},day:null,rid:null};
}

function paintAb(){
var body=document.getElementById("abbody");
if(!body)return;
var day=draft.day,rec=typeof recipeBy==="function"?recipeBy(draft.rid):null;
if(!rec){body.innerHTML="<p class=note>Recept ontbreekt.</p>";return;}
var lines=mealLines(day,rec);
var totA=sumKnown(lines,"lineA");
var totB=sumKnown(lines,"lineB");
var delta=(totA!=null&&totB!=null)?(totA-totB):null;
var dayLab=(typeof DLAB!=="undefined"&&DLAB[day])?DLAB[day]:day;
var deltaHtml;
if(delta==null){
deltaHtml="<div class=abdelta><span class=abdelta-n>onbekend</span><span class=abdelta-l>Verschil niet te rekenen</span></div>";
}else if(delta===0){
deltaHtml="<div class=abdelta><span class=abdelta-n>"+euro(0)+"</span><span class=abdelta-l>Zelfde indicatie</span></div>";
}else if(delta>0){
deltaHtml="<div class=abdelta save><span class=abdelta-n>\u2212 "+euro(delta)+"</span><span class=abdelta-l>Huismerk lagere indicatie</span></div>";
}else{
deltaHtml="<div class=abdelta><span class=abdelta-n>+ "+euro(Math.abs(delta))+"</span><span class=abdelta-l>A-merk hogere indicatie</span></div>";
}
var mode=draft.mode||"MIX";
var swaps=pickSwaps(lines);
var swapHtml="";
if(!swaps.length){
swapHtml="<p class=note>Geen duidelijke A/B-gaten met bekende prijzen voor dit recept.</p>";
}else{
swapHtml=swaps.map(function(L){
var cur=draft.swaps[L.k]||"";
var act="";
if(L.bonus){
act=" \u00b7 Actie "+L.bonus.store+(L.bonus.deal?" "+L.bonus.deal:"")+" "+euro(L.bonus.now);
}
var aTxt=L.lineA!=null?("A "+euro(L.lineA)):("A onbekend");
var bTxt=L.lineB!=null?("huismerk "+euro(L.lineB)):("huismerk onbekend");
return "<button type=button class='listrow abswap"+(cur?" onswap":"")+"' data-act=abswap data-k='"+String(L.k).replace(/'/g,"")+"'>"+
"<div style=flex:1><b>"+String(L.name).replace(/</g,"")+"</b>"+
"<div class=meta>"+aTxt+" \u00b7 "+bTxt+act+(cur?" \u00b7 gekozen: "+(cur==="A"?"A-merk":"huismerk"):" \u00b7 tik voor A/B")+"</div></div>"+
"<div class=price>"+(L.gap!=null?("\u0394 "+euro(L.gap)):"")+"</div></button>";
}).join("");
}
var onBoard=!!(S.plan&&S.plan[day]&&S.plan[day].id===draft.rid);
var confirmLabel=onBoard?"Opslaan op het bord":"Zet op het bord";
body.innerHTML=
"<p class=sub style=margin:0 0 10px><b>"+String(rec.t).replace(/</g,"")+"</b> \u00b7 "+dayLab+"</p>"+
"<p class=note style=margin:0 0 12px>Indicatie, geen kassaprijs. Op basis van je winkelselectie (laagste per product).</p>"+
"<div class=abtotals>"+
"<div class='abtot"+(mode==="A"?" on":"")+"'><div class=abtot-l>A-merk</div><div class=abtot-n>"+(totA!=null?euro(totA):"onbekend")+"</div></div>"+
"<div class='abtot"+(mode==="B"?" on":"")+"'><div class=abtot-l>Huismerk</div><div class=abtot-n>"+(totB!=null?euro(totB):"onbekend")+"</div></div>"+
"</div>"+deltaHtml+
"<div class=sec>Welke lijn deze avond?</div>"+
"<div class=row abmodes>"+
"<button type=button class='chip"+(mode==="A"?" on hard":"")+"' data-act=abmode data-m=A>A-merk</button>"+
"<button type=button class='chip"+(mode==="B"?" on":"")+"' data-act=abmode data-m=B>Huismerk</button>"+
"<button type=button class='chip"+(mode==="MIX"?" on":"")+"' data-act=abmode data-m=MIX>Mix</button>"+
"</div>"+
"<p class=note style=margin:8px 0 0>"+(mode==="A"?"Hele maaltijd op A-merk (per product nog te overrulen).":mode==="B"?"Hele maaltijd op huismerk (per product nog te overrulen).":"Mix: huidige standaard + je swaps hieronder.")+"</p>"+
"<div class=sec>Slimme swaps</div>"+swapHtml+
"<button type=button class='btn g full' id=abconfirm style=margin-top:16px>"+confirmLabel+"</button>"+
"<button type=button class='btn w full' id=abcancel style=margin-top:8px>Annuleer</button>";
}

function openAbPopup(){
var r=typeof recipeBy==="function"?recipeBy(S.look):null;
if(!r){if(typeof toast==="function")toast("Recept ontbreekt");return;}
if(typeof hardBlock==="function"&&hardBlock(r,eatersOn(S.day)).length){
if(typeof toast==="function")toast("Past niet bij een dieet");
return;
}
var day=S.day;
var prevBrand=(S.plan&&S.plan[day]&&S.plan[day].brand)||S.brand||"MIX";
if(prevBrand!=="A"&&prevBrand!=="B"&&prevBrand!=="MIX")prevBrand="MIX";
draft={mode:prevBrand,swaps:{},day:day,rid:S.look};
var panel=document.getElementById("abpanel");
if(!panel){doPut();return;}
paintAb();
panel.classList.add("on");
}

function applyChoiceThenPut(){
var day=draft.day,rid=draft.rid,mode=draft.mode||"MIX";
var rec=typeof recipeBy==="function"?recipeBy(rid):null;
S.itemBrand=S.itemBrand||{};
function stampKey(k){
if(!k)return;
if(mode==="A"||mode==="B")S.itemBrand[k]=mode;
}
if(rec&&rec.ing){
rec.ing.forEach(function(it){stampKey(it&&it.k);});
}
if(typeof mealAdds==="function"){
mealAdds(day,rid).forEach(function(it){stampKey(it&&it.k);});
}
Object.keys(draft.swaps).forEach(function(k){
var v=draft.swaps[k];
if(v==="A"||v==="B")S.itemBrand[k]=v;
});
if(mode==="A"||mode==="B")S.brand=mode;
else if(mode==="MIX"&&(S.brand==="A"||S.brand==="B")){
/* keep per-item; leave global brand as MIX for list scoring defaults */
S.brand="MIX";
}
doPut();
if(S.plan&&S.plan[day]&&S.plan[day].id===rid){
S.plan[day].brand=mode;
if(typeof save==="function")save();
}
if(typeof paintBrand==="function")paintBrand();
}

function doPut(){
closeAb();
if(typeof window._putOnBoardCore==="function")window._putOnBoardCore();
}

function cycleSwap(k){
var order=["","A","B"];
var cur=draft.swaps[k]||"";
var i=order.indexOf(cur);
draft.swaps[k]=order[(i+1)%3];
if(!draft.swaps[k])delete draft.swaps[k];
paintAb();
}

document.addEventListener("click",function(e){
var t=e.target;if(t&&t.nodeType===3)t=t.parentNode;
if(!t||!t.closest)return;
if(t.id==="abcancel"||t.id==="abcancelhd"||(t.closest&&(t.closest("#abcancel")||t.closest("#abcancelhd")))){
e.preventDefault();closeAb();return;
}
if(t.id==="abconfirm"||(t.closest&&t.closest("#abconfirm"))){
e.preventDefault();applyChoiceThenPut();return;
}
var mode=t.closest&&t.closest("[data-act=abmode]");
if(mode){
e.preventDefault();
draft.mode=mode.getAttribute("data-m")||"MIX";
paintAb();return;
}
var sw=t.closest&&t.closest("[data-act=abswap]");
if(sw){
e.preventDefault();
cycleSwap(sw.getAttribute("data-k"));
return;
}
},true);

function wrapPut(){
if(typeof putOnBoard!=="function")return;
if(putOnBoard._abWrap||window._putOnBoardCore)return;
window._putOnBoardCore=putOnBoard;
var wrapped=function(){openAbPopup();};
wrapped._abWrap=true;
window.putOnBoard=wrapped;
}
wrapPut();
setTimeout(wrapPut,0);
})();
