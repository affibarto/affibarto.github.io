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
var _STOP={voor:1,met:1,van:1,een:1,het:1,de:1,en:1,per:1,stuks:1,pack:1,doos:1,vers:1,diepvries:1,milde:1,halfvolle:1,all:1,uovo:1,flavour:1};
var _GENERIC={rundergehakt:1,gehakt:1,pasta:1,spaghetti:1,melk:1,boter:1,roomboter:1,yoghurt:1,rijst:1,kip:1,kipfilet:1,kaas:1,pesto:1,brood:1,wraps:1,spinazie:1,aardappel:1,aardappelen:1,tomaat:1,tomatenblokjes:1,ui:1,uien:1,wortel:1,wortelen:1,paprika:1,sla:1,komkommer:1,ham:1,fruit:1,bananen:1};
function _tokens(s){
return String(s||"").toLowerCase().replace(/[^\wäöüßà-ÿ0-9]+/g," ").split(/\s+/).filter(function(t){
return t.length>=4 && !_STOP[t] && !/^\d/.test(t);
});
}
function parsePack(text){
var s=String(text||"").trim();
if(!s)return {name:"",pack:""};
var m=s.match(/^(.*?)[\s,·\-–]+((?:\d+\s*[x×]\s*)?\d+(?:[.,]\d+)?\s*(?:g|kg|ml|cl|l|liter|stuks?|st)|\d+(?:[.,]\d+)?\s*(?:g|kg|ml|cl|l)|(?:\d+\s*)?(?:x\s*)?pack|\d+\-pack)\s*$/i);
if(m)return {name:m[1].trim(),pack:m[2].replace(/\s+/g," ").trim()};
var m2=s.match(/^(.*?)[\s,·]+(\d+\s*[x×]\s*\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))\s*$/i);
if(m2)return {name:m2[1].trim(),pack:m2[2].replace(/\s+/g," ").trim()};
return {name:s,pack:""};
}
function normPack(p){
p=String(p||"").replace(/\s+/g," ").trim();
if(!p)return "";
return p.replace(/(\d)(g|kg|ml|cl|l)\b/i,function(_,a,b){return a+" "+b.toLowerCase();});
}
function guessBrand(name,explicit){
if(explicit)return String(explicit).trim();
var n=String(name||"").trim();if(!n)return "";
var w=n.split(/\s+/)[0];
if(!w||w.length<2)return "";
var low=w.toLowerCase().replace(/[^a-zäöüßà-ÿ0-9]/g,"");
if(_GENERIC[low]||_STOP[low])return "";
if(/^(ah|jumbo|lidl|plus|dirk|aldi|vomar|picnic)$/i.test(w))return w.toUpperCase()==="AH"?"AH":w.charAt(0).toUpperCase()+w.slice(1).toLowerCase();
if(/^[A-ZÀ-Ý]/.test(w) && n.indexOf(" ")>0)return w;
return "";
}
function activeStoreList(){
if(typeof activeStores==="function")return activeStores();
return (typeof STORES!=="undefined"?STORES:[]);
}
function findBonusHit(k){
if(typeof BONUS==="undefined"||!k)return null;
var stores=activeStoreList();
for(var i=0;i<stores.length;i++){
var sid=stores[i].id||stores[i];
var b=BONUS[sid]&&BONUS[sid][k];
if(b&&(b.name||b.deal||b.now))return {sid:sid,store:storeN(sid),b:b};
}
return null;
}
function findFolderHit(k,catName,preferName){
var items=(window.FOLDER_FULL&&window.FOLDER_FULL.items)||[];
if(!items.length)return null;
var stores=activeStoreList();
var active={};stores.forEach(function(s){active[s.id||s]=1;});
var needles=_tokens(catName||"");
var keyTok=String(k||"").toLowerCase();
if(keyTok&&keyTok.length>=4&&needles.indexOf(keyTok)<0)needles=needles.concat([keyTok]);
var prefer=String(preferName||"").toLowerCase();
var best=null,bestScore=0;
for(var i=0;i<items.length;i++){
var r=items[i];if(!r||!r.n)continue;
if(Object.keys(active).length&&r.s&&!active[r.s])continue;
var hay=(r.n+" "+(r.b||"")+" "+(r.qty||r.q||"")).toLowerCase();
var score=0;
if(prefer&&hay.indexOf(prefer)>=0)score+=8;
if(keyTok&&hay.indexOf(keyTok)>=0)score+=5;
for(var j=0;j<needles.length;j++){
if(hay.indexOf(needles[j])>=0)score+=2;
}
if(catName){
var cn=String(catName).toLowerCase();
var base=parsePack(cn).name.toLowerCase();
if(base.length>=5&&hay.indexOf(base)>=0)score+=4;
}
if(score>bestScore){bestScore=score;best=r;}
}
if(bestScore>=5)return best;
return null;
}
function enrichIngredient(k){
var catName=nm(k);
var catPack=normPack(parsePack(catName).pack);
var catTitle=parsePack(catName).name||catName;
var hit=findBonusHit(k);
var bonusName=hit&&hit.b&&hit.b.name?String(hit.b.name).trim():"";
var folder=findFolderHit(k,catName,bonusName);
var brand="";
var pack=catPack;
var store="";
var deal="";
var product="";
var confident=false;
if(hit){
store=hit.store||"";
deal=String(hit.b.deal||"").trim();
if(/^(feed|folder|actie|bonus|promotie)$/i.test(deal))deal="";
if(bonusName){product=bonusName;confident=true;}
}
if(folder){
if(!brand&&folder.b)brand=String(folder.b).trim();
if(!pack&&(folder.qty||folder.q||folder.pack))pack=normPack(folder.qty||folder.q||folder.pack);
if(!store&&folder.s)store=storeN(folder.s);
if(!deal&&folder.deal){
deal=String(folder.deal).trim();
if(/^(feed|folder|actie|bonus|promotie)$/i.test(deal))deal="";
}
if(!product&&folder.n&&confident===false){
/* folder-only match: only promote title when strong */
var fscore=0;
var hay=(folder.n+" "+(folder.b||"")).toLowerCase();
if(hay.indexOf(String(k).toLowerCase())>=0)fscore+=5;
var base=parsePack(catName).name.toLowerCase();
if(base.length>=5&&hay.indexOf(base)>=0)fscore+=4;
if(fscore>=5){product=folder.n;confident=true;}
}
}
if(!brand)brand=guessBrand(product||bonusName,"");
if(product&&!pack){
var pp=parsePack(product);
if(pp.pack){pack=normPack(pp.pack);product=pp.name||product;}
}
var tier="";
if(typeof window.detectBrandTier==="function"){
tier=window.detectBrandTier({b:brand,brand:brand,n:product||bonusName||(folder&&folder.n)||""})||"";
}else if(brand){
/* assist not loaded yet: crude house vs A */
var bl=String(brand).toLowerCase();
if(/^(ah|jumbo|plus|lidl|dirk|aldi|gwoon|picnic|hoogvliet|dekamarkt|vomar|ekoplaza)\b/.test(bl))tier="B";
else tier="A";
}
return {
title:confident&&product?product:catTitle,
brand:brand,
pack:pack,
store:store,
deal:deal,
meal:"",
tier:tier
};
}
function joinMeta(parts){
return parts.filter(function(p){return p&&String(p).trim();}).join(" \u00b7 ");
}
function mealMeta(info,mealLabel,needQty){
var bits=[];
if(info.brand)bits.push(info.brand);
if(info.pack){
bits.push("pak: "+info.pack);
if(needQty!=null&&needQty!=="")bits.push("nodig: "+needQty);
}
if(info.store)bits.push(info.store);
if(info.deal)bits.push(info.deal);
if(mealLabel)bits.push(mealLabel);
return joinMeta(bits);
}
function extraMeta(e){
var brand=e.b||e.brand||"";
var pack=normPack(e.pack||e.qty||"");
var deal=String(e.deal||"").trim();
if(/^(feed|folder|actie|bonus|promotie)$/i.test(deal))deal="";
return joinMeta([brand,pack,storeN(e.sid),deal]);
}
function alwaysDisplay(a){
var raw=a.n||nm(a.k)||"";
var parsed=parsePack(raw);
return {title:parsed.name||raw,meta:joinMeta([normPack(parsed.pack),"zelf"])};
}
function todayCode(){
var map=["Zo","Ma","Di","Wo","Do","Vr","Za"];
return map[(new Date()).getDay()]||"Ma";
}
function applyListCompact(){
var el=document.getElementById("lijst");
var on=!(S&&S.listCompact===false);
if(el)el.classList.toggle("compact",on);
var btn=document.getElementById("listcompact");
if(btn){
btn.classList.toggle("on",on);
btn.setAttribute("aria-pressed",on?"true":"false");
btn.textContent=on?"Compact":"Ruim";
}
}
function secIsOpen(key,fallback){
S.listOpen=S.listOpen||{};
if(Object.prototype.hasOwnProperty.call(S.listOpen,key))return !!S.listOpen[key];
return !!fallback;
}
function secHead(key,label,open,rightHtml){
return "<div class='listsec"+(open?" open":"")+"' data-sec='"+key+"'>"+
"<div class=sechead>"+
"<button type=button class=sectog data-act=sectog data-sec='"+key+"' aria-expanded='"+(open?"true":"false")+"'>"+
"<span class=chev aria-hidden=true>"+(open?"\u25be":"\u25b8")+"</span>"+
"<span class=seclabel>"+String(label||"").replace(/</g,"")+"</span>"+
"</button>"+(rightHtml||"")+
"</div><div class=secbody>";
}
function secFoot(){return "</div></div>";}
function drawListByMeal(){
var body=document.getElementById("lijstbody");if(!body)return;
var slotF=document.getElementById("folderlijst");if(slotF)slotF.innerHTML="";
applyListCompact();
S.listOpen=S.listOpen||{};
var html="";var n=0;
var days=typeof DAYS!=="undefined"?DAYS:["Ma","Di","Wo","Do","Vr","Za","Zo"];
var today=todayCode();
var dayBlocks=[];
days.forEach(function(d){
var slot=S.plan&&S.plan[d];if(!slot||!slot.id||slot.leftover)return;
var rec=typeof recipeBy==="function"?recipeBy(slot.id):null;if(!rec)return;
var who=eatersMain(d);
var scale=(typeof portions==="function")?portions(who.length?who:(S.people||[]))/4:1;
var shopped=!!(S.shopped&&S.shopped[d]);
var rows="";var count=0;var allChecked=true;
(rec.ing||[]).forEach(function(it){
if(S.omit&&S.omit[d+":"+slot.id+":"+it.k])return;
var k=it.k+"@"+d;
if(S.removed&&S.removed[k])return;
var need=qty(it.q*scale);
var info=enrichIngredient(it.k);
if((info.tier==="A"||info.tier==="B")){
S.itemBrand=S.itemBrand||{};
if(S.itemBrand[k]===undefined){S.itemBrand[k]=info.tier;window._brandDirty=1;}
}
if(!(S.checked&&S.checked[k]))allChecked=false;
count++;n++;
rows+=row(k,info.title,mealMeta(info,d+" \u00b7 "+rec.t,need),need);
});
if(!count)allChecked=false;
dayBlocks.push({d:d,rec:rec,shopped:shopped,done:shopped||allChecked,rows:rows,count:count});
});
var firstOpen=null;
for(var i=0;i<dayBlocks.length;i++){
if(!dayBlocks[i].done){firstOpen=dayBlocks[i].d;break;}
}
var todayIn=dayBlocks.some(function(b){return b.d===today&&!b.done;});
dayBlocks.forEach(function(b){
var defOpen=false;
if(!b.done){
if(todayIn)defOpen=(b.d===today);
else defOpen=(b.d===firstOpen);
}
var open=b.done?secIsOpen(b.d,false):secIsOpen(b.d,defOpen);
var label=b.d+" \u00b7 "+b.rec.t+" \u00b7 "+b.count+(b.shopped?" \u00b7 gehaald":"");
var right="<button type=button class='btn s w' data-act=gehaald data-d="+b.d+">"+(b.shopped?"Ok":"Gehaald")+"</button>";
html+=secHead(b.d,label,open,right)+b.rows+secFoot();
});
var extras=S.extras||[];
var actRows="";var actN=0;
extras.forEach(function(e,i){
var k="e:"+i+":"+e.n;if(S.removed&&S.removed[k])return;actN++;n++;
if(!(e.brandTier==="A"||e.brandTier==="B")&&typeof window.detectBrandTier==="function"){
var t=window.detectBrandTier({b:e.b||e.brand,brand:e.b||e.brand,n:e.n});
if(t==="A"||t==="B"){e.brandTier=t;window._brandDirty=1;}
}
if((e.brandTier==="A"||e.brandTier==="B")){
S.itemBrand=S.itemBrand||{};
if(S.itemBrand[k]===undefined){S.itemBrand[k]=e.brandTier;window._brandDirty=1;}
}
var prijs=e.line||((e.cents||0)*(e.q||1));
var right="<div class=qtybox><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=-1>\u2212</button><span class=qtyn>"+(e.q||1)+"</span><button type=button class=qtybtn data-act=exqty data-i="+i+" data-d=1>+</button></div><div class=price>"+euro(prijs)+"</div>";
actRows+=row(k,e.n,extraMeta(e),e.q||1,right);
});
if(actN){
var actOpen=secIsOpen("actie",actN<=5);
html+=secHead("actie","Actie \u00b7 "+actN,actOpen,"")+actRows+secFoot();
}
var exRows="";var extraN=0;
(S.always||[]).forEach(function(a){
var k=a.k&&typeof CAT!=="undefined"&&CAT[a.k]?a.k:("x:"+a.n);
if(S.removed&&S.removed[k])return;
extraN++;n++;
var disp=alwaysDisplay(a);
exRows+=row(k,disp.title,disp.meta,qty(a.q||1));
});
if(extraN){
var exOpen=secIsOpen("extra",extraN<=5);
html+=secHead("extra","Extra \u00b7 "+extraN,exOpen,"")+exRows+secFoot();
}
var line=document.getElementById("lijstline");if(line)line.textContent=n?n+" open":"";
if(!html){
  var micOk=!!(window.SpeechRecognition||window.webkitSpeechRecognition||document.getElementById("mic"));
  body.innerHTML="<div class=empty-list>"+
    "<p class=\"sub ghost\">Nog stil hier. Zet avondeten op het bord, tik een actie, of zeg wat erbij moet.</p>"+
    "<button type=button class=\"card emptycta\" data-go=\"bord\"><div class=p><b>Naar Bord</b><div class=meta>Kies of laat voorstellen zetten</div></div></button>"+
    "<button type=button class=\"card emptycta\" data-go=\"folder\"><div class=p><b>Naar Actie</b><div class=meta>Folderhits van alle supers…</div></div></button>"+
    "<button type=button class=\"card emptycta\" id=emptymic><div class=p><b>"+(micOk?"Spreek in":"Typ iets in")+"</b><div class=meta>"+(micOk?"Zeg wat er op de lijst moet":"Via + of typ een product")+"</div></div></button>"+
    "</div>";
}else body.innerHTML=html;
if(window._brandDirty){window._brandDirty=0;if(typeof save==="function")save();}
if(typeof paintScore==="function")paintScore();
}
window.drawList=drawListByMeal;
window._enrichIngredient=enrichIngredient;
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
if(!t||!t.closest)return;
var tog=t.closest("[data-act=sectog]");
if(tog){
e.preventDefault();e.stopPropagation();
var key=tog.getAttribute("data-sec");
if(!key)return;
S.listOpen=S.listOpen||{};
var sec=tog.closest(".listsec");
var nowOpen=!(sec&&sec.classList.contains("open"));
S.listOpen[key]=nowOpen;
if(typeof save==="function")save();
if(sec){
sec.classList.toggle("open",nowOpen);
tog.setAttribute("aria-expanded",nowOpen?"true":"false");
var ch=tog.querySelector(".chev");
if(ch)ch.textContent=nowOpen?"▾":"▸";
}
return;
}
var lc=t.id==="listcompact"||(t.closest&&t.closest("#listcompact"));
if(lc){
e.preventDefault();e.stopPropagation();
S.listCompact=!(S.listCompact!==false);
if(typeof save==="function")save();
applyListCompact();
return;
}
},true);
setTimeout(function(){
if(typeof window.gotDay==="function"&&!window.gotDay._listCompact){
var _gd=window.gotDay;
window.gotDay=function(d){
S.listOpen=S.listOpen||{};
if(d)S.listOpen[d]=false;
return _gd.apply(this,arguments);
};
window.gotDay._listCompact=1;
}
applyListCompact();
},0);
document.addEventListener("click",function(e){
var t=e.target;if(t&&t.nodeType===3)t=t.parentNode;
if(!t)return;
var mic=t.id==="mic"||t.id==="emptymic"||(t.closest&&t.closest("#emptymic"));
if(mic){e.preventDefault();e.stopPropagation();startListen();return;}
},true);
window.addSpoken=addSpoken;
setTimeout(function(){var v=document.getElementById("lijst");if(v&&v.classList.contains("on")&&typeof window.drawList==="function")window.drawList();},0);
})();
