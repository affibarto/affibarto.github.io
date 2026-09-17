S.folderStore=S.folderStore||"alle";
S.folderQ=S.folderQ||"";
function storeName(id){var s=(typeof STORES!=="undefined"?STORES:[]).filter(function(x){return x.id===id;})[0];if(s)return s.n;var ix=(window.FOLDER_INDEX&&window.FOLDER_INDEX.stores)||[];var t=ix.filter(function(x){return x.id===id;})[0];return t?t.n:id;}
function fullItems(){return (window.FOLDER_FULL&&window.FOLDER_FULL.items)||[];}
function packOf(r){return (r&&(r.q||r.qty||r.pack))||"";}
function dealText(r){var raw=String(r.deal||"").trim();if(!raw||/^(feed|folder|actie|bonus|promotie)$/i.test(raw))return (r.was&&r.now&&r.was>r.now)?(Math.round(100*(r.was-r.now)/r.was)+"% korting"):"";return raw;}
function euroc(c){c=+c||0;return "\u20ac"+(c/100).toFixed(2).replace(".",",");}
function untilText(r){
  var u=String(r.until||"").trim();
  if(!u)return "";
  var m=u.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if(m){
    var months=["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"];
    return "t/m "+parseInt(m[3],10)+" "+months[parseInt(m[2],10)-1];
  }
  return "t/m "+u;
}
function folderMeta(r){
  if(r.desc)return [storeName(r.s),r.desc].filter(Boolean).join(" \u00b7 ");
  return [storeName(r.s),r.b,packOf(r),dealText(r),untilText(r)].filter(Boolean).join(" \u00b7 ");
}
var _STOP={
  voor:1,met:1,van:1,een:1,het:1,de:1,en:1,per:1,stuks:1,pack:1,doos:1,vers:1,diepvries:1,
  milde:1,halfvolle:1,volle:1,magere:1,
  /* adjectives / prep — never the product noun */
  geraspte:1,geraspt:1,gerookte:1,gerookt:1,biologische:1,biologisch:1,
  hollandse:1,hollands:1,verse:1,light:1,naturel:1,flinterdun:1,flinterdunne:1,
  gesneden:1,gewassen:1,geroosterde:1,geroosterd:1,gemalen:1,gedroogde:1,gedroogd:1,
  jonge:1,belegen:1,oude:1,pittige:1,pittig:1,zoete:1,zoet:1,rode:1,groene:1,witte:1,
  kleine:1,grote:1
};
/* Short core food nouns allowed below the usual length≥5 token floor. */
var _CORE={
  kaas:1,melk:1,ui:1,uien:1,ei:1,eieren:1,ham:1,sla:1,rijst:1,kip:1,kipfilet:1,
  pesto:1,pasta:1,wraps:1,wrap:1,boter:1,gehakt:1,brood:1,zalm:1,room:1,kwark:1,
  yoghurt:1,tomaat:1,tomaten:1,paprika:1,spinazie:1,worst:1
};
/* Snack / processed class — never match fresh/simple staples (paprika↔chips). */
var _SNACK={
  chips:1,chip:1,crisps:1,snoep:1,koek:1,koekje:1,reep:1,frisdrank:1,sap:1,
  yoghurtdrink:1,dip:1,kruidenmix:1,pringles:1,crackers:1,cracker:1,toastjes:1,
  toastje:1,snack:1,snacks:1,borrel:1,lays:1,lay:1,doritos:1,nachos:1,croky:1,
  kettle:1,smear:1,smeerkaas:1,fruitgom:1,haribo:1
};
/* Dish/sauce/ready-meal class — reject when board item is a simple ingredient.
   Prefer missing a weak match over a wrong badge. wrap/wraps ignored when board is wraps.
   Documented reject tokens: saus, soep, saladbowl, salade, maaltijd, pizza, ovenschotel,
   pan, stamppot, stoof, curry, nasi, bami, wrap, burger, nugget, kroket, poeder, schotel. */
var _DISH={
  saus:1,sauce:1,soep:1,soup:1,saladbowl:1,salade:1,salad:1,maaltijd:1,maaltijdmix:1,
  pizza:1,ovenschotel:1,stamppot:1,stoof:1,stoofschotel:1,curry:1,nasi:1,bami:1,
  wrap:1,wraps:1,burger:1,burgers:1,nugget:1,nuggets:1,kroket:1,kroketten:1,
  pan:1,wok:1,schotel:1,gerecht:1,maaltijdbox:1,poeder:1,poeders:1,
  carbonara:1,bolognese:1,bolo:1,ragout:1,teriyaki:1,madras:1,kebab:1,tikka:1,
  presto:1,ovenpasta:1,babymaaltijd:1,olvarit:1,cheese:1,mac:1
};
/* Simple staples: dish/sauce/snack reject applies (plus Vers aisle / _FRESH). */
var _SIMPLE={
  pasta:1,pesto:1,wraps:1,wrap:1,spinazie:1,tomaat:1,tomaten:1,tomaatKers:1,
  paprika:1,kaas:1,melk:1,boter:1,rijst:1,gehakt:1,kip:1,ui:1,uien:1,sla:1,
  ham:1,ei:1,eieren:1,aardappel:1,wortel:1,brood:1,yoghurt:1,champignon:1
};
/* Core fresh-produce tokens (also detected via CAT aisle Vers). */
var _FRESH={
  paprika:1,ui:1,uien:1,tomaat:1,tomaten:1,kerstomaat:1,komkommer:1,sla:1,ijsbergsla:1,
  aardappel:1,aardappelen:1,wortel:1,wortelen:1,bloemkool:1,boerenkool:1,
  champignon:1,champignons:1,knoflook:1,gember:1,bananen:1,banaan:1,spinazie:1
};
function _words(s){
  return String(s||"").toLowerCase().replace(/[^\wäöüßà-ÿ0-9]+/g," ").split(/\s+/).filter(Boolean);
}
function _isToken(t){
  if(!t||_STOP[t]||/^\d/.test(t))return false;
  if(t.length>=5)return true;
  return !!_CORE[t];
}
function _tokens(s){
  return _words(s).filter(_isToken);
}
function _itemLabel(cat,fallback){
  if(cat&&typeof productLabel==="function")return productLabel(cat);
  if(cat){if(cat.label)return cat.label;if(cat.name)return cat.name;}
  return fallback||"";
}
function _catKeyOf(k){
  k=String(k||"").trim();
  if(!k||/^(add:|e:|x:)/i.test(k))return "";
  if(typeof CAT!=="undefined"&&CAT[k])return k;
  return "";
}
/* Primary nouns: prefer CAT key (or longer label specialization like kip→kipfilet). */
function _needTokens(entry){
  var name=entry&&entry.n!=null?String(entry.n):String(entry||"");
  var catKey=_catKeyOf(entry&&entry.k);
  if(catKey){
    var keyLow=catKey.toLowerCase();
    var labelToks=_tokens(name);
    var spec=labelToks.filter(function(t){
      return t!==keyLow&&(t.indexOf(keyLow)===0||keyLow.indexOf(t)===0);
    });
    if(spec.length){
      spec.sort(function(a,b){return b.length-a.length;});
      return [spec[0]];
    }
    if(_isToken(keyLow)||((_CORE[keyLow]||keyLow.length>=2)&&!_STOP[keyLow]))return [keyLow];
  }
  return _tokens(name);
}
function boardMatchSets(){
  var listNames=[],bordNames=[],seenL={},seenB={};
  function add(arr,seen,name,aisle,k){
    name=String(name||"").trim();
    if(!name)return;
    var uniq=(k||"")+":"+name.toLowerCase();
    if(seen[uniq])return;
    seen[uniq]=1;
    arr.push({n:name,aisle:aisle||"",k:k||""});
  }
  try{
    if(typeof buildList==="function"){
      buildList().forEach(function(i){
        var label=_itemLabel(i.cat,i.n);
        var ck=_catKeyOf(i.k);
        add(listNames,seenL,label,i.aisle||(i.cat&&i.cat.aisle)||"",ck);
      });
    }
  }catch(e){}
  try{
    /* Same omit/leftover/removed scope as buildList recipe ingredients (+ mealAdds). */
    if(S&&S.plan&&typeof recipeBy==="function"){
      Object.keys(S.plan).forEach(function(d){
        var slot=S.plan[d];if(!slot||!slot.id||slot.leftover)return;
        var rec=recipeBy(slot.id);if(!rec)return;
        (rec.ing||[]).forEach(function(it){
          if(S.omit&&S.omit[d+":"+slot.id+":"+it.k])return;
          if(S.removed&&S.removed[it.k])return;
          var cat=(typeof CAT!=="undefined"&&CAT[it.k])||null;
          add(bordNames,seenB,_itemLabel(cat,it.k),cat?cat.aisle:"",it.k||"");
        });
        if(typeof mealAdds==="function"){
          mealAdds(d,slot.id).forEach(function(it){
            if(!it||!it.k)return;
            if(S.omit&&S.omit[d+":"+slot.id+":"+it.k])return;
            if(S.removed&&S.removed[it.k])return;
            var cat=(typeof CAT!=="undefined"&&CAT[it.k])||null;
            add(bordNames,seenB,_itemLabel(cat,it.k),cat?cat.aisle:"",it.k||"");
          });
        }
      });
    }
  }catch(e){}
  return {list:listNames,bord:bordNames};
}
/* Strip leading brand-like tokens (apostrophe brands, ALLCAPS, CamelBrand). */
function _titleContentWords(title){
  var parts=String(title||"").trim().split(/\s+/).filter(Boolean);
  var i=0;
  while(i<parts.length-1){
    var p=parts[i];
    var low=p.toLowerCase().replace(/[^\wäöüßà-ÿ0-9]+/g,"");
    if(_CORE[low]||_FRESH[low]||_SIMPLE[low])break;
    var brandish=/['\u2019]/.test(p)||/^[A-ZÀ-Ý]{2,}$/.test(p)||
      (/^[A-ZÀ-Ý]/.test(p)&&/[A-ZÀ-Ý].*[A-ZÀ-Ý]/.test(p)&&p.length<=14&&!/\d/.test(p));
    if(brandish){i++;continue;}
    break;
  }
  return _words(parts.slice(i).join(" "));
}
function _titleDominated(title,main){
  var content=_titleContentWords(title).filter(function(t){return !_STOP[t];});
  return content.slice(0,3).indexOf(main)>=0;
}
function _isSimpleEntry(entry,need){
  var aisle=entry&&entry.aisle||"";
  var k=String(entry&&entry.k||"").toLowerCase();
  if(aisle==="Vers")return true;
  if(k&&(_SIMPLE[k]||_FRESH[k]))return true;
  return need.some(function(t){return !!(_SIMPLE[t]||_FRESH[t]);});
}
function _dishReject(titleWords,entry,need){
  var k=String(entry&&entry.k||"").toLowerCase();
  var main=need[0]||"";
  var allowWrap=k==="wraps"||k==="wrap"||need.indexOf("wraps")>=0||need.indexOf("wrap")>=0;
  for(var i=0;i<titleWords.length;i++){
    var w=titleWords[i];
    if(!_DISH[w])continue;
    if(allowWrap&&(w==="wrap"||w==="wraps"))continue;
    return true;
  }
  /* Cross-staple: dry pasta ≠ pasta-saus/pesto meal; pesto board may still see "pesto". */
  if(main==="pasta"||k==="pasta"){
    if(titleWords.indexOf("pesto")>=0||titleWords.indexOf("saus")>=0)return true;
  }
  /* Grated cheese staple ≠ broodje/toast cheese snacks */
  if(main==="kaas"||k==="kaas"){
    if(titleWords.some(function(w){return /^(brood|breekbrood|toast|toastjes|cracker|crackers|smeerkaas|roomkaas)/.test(w);}))return true;
  }
  /* Compound forms glued to the noun: pastasaus, ovenpasta, kipcurry, paprikapoeder */
  if(!main)return false;
  for(var j=0;j<titleWords.length;j++){
    var tw=titleWords[j];
    if(tw===main)continue;
    if(tw.indexOf(main)<0)continue;
    if(/(saus|soep|maaltijd|salade|salad|curry|schotel|snack|chips|poeder|pesto)$/.test(tw)||
       /^(oven|baby)/.test(tw)||/pasta$/.test(tw)&&main!=="pasta")return true;
    /* ovenpasta / pastamaaltijd when main is pasta */
    if(main==="pasta"&&tw!=="pasta"&&tw.indexOf("pasta")>=0)return true;
  }
  return false;
}
function dealMatchKind(r,sets){
  /* Title-only whole-word match — not brand/desc/pack soup. */
  var titleWords=_words(r.n);
  var titleSet={};titleWords.forEach(function(t){titleSet[t]=1;});
  var titleSnack=titleWords.some(function(w){return !!_SNACK[w];});
  function entryHits(entry,mode){
    var need=_needTokens(entry);
    if(!need.length)return false;
    for(var j=0;j<need.length;j++){
      if(!titleSet[need[j]])return false;
    }
    var simple=_isSimpleEntry(entry,need);
    if(simple&&titleSnack)return false;
    if(simple&&_dishReject(titleWords,entry,need))return false;
    /* Bord-only: stronger — main token in first 3 content title tokens. */
    if(mode==="bord"&&!_titleDominated(r.n,need[0]))return false;
    return true;
  }
  function hit(entries,mode){
    for(var i=0;i<(entries||[]).length;i++){
      if(entryHits(entries[i],mode))return true;
    }
    return false;
  }
  if(hit(sets.list,"list"))return "list";
  if(hit(sets.bord,"bord"))return "bord";
  return "";
}
function drawFolder(){var host=document.getElementById("folderbody");if(!host)return;var line=document.getElementById("folderline");if(line)line.textContent=fullItems().length+" acties";var sc=host.parentNode;if(sc&&!document.getElementById("folderq")){var inp=document.createElement("input");inp.id="folderq";inp.placeholder="Zoek in de folder";inp.value=S.folderQ||"";inp.addEventListener("input",function(){S.folderQ=inp.value;drawFolder();});sc.insertBefore(inp,host);}var pick=document.getElementById("folderpick");if(pick){var stores=(window.FOLDER_INDEX&&window.FOLDER_INDEX.stores&&window.FOLDER_INDEX.stores.length)?window.FOLDER_INDEX.stores:(typeof STORES!=="undefined"&&STORES.length?STORES:[]);pick.innerHTML=["alle"].concat(stores.map(function(s){return s.id;})).map(function(id){var n=id==="alle"?"Alle":storeName(id);return "<button type=button class='chip "+(S.folderStore===id?"on":"")+"' data-act=fstore data-id="+id+">"+n+"</button>";}).join("");}var q=(S.folderQ||"").toLowerCase().trim();var rows=fullItems().filter(function(r){if(S.folderStore&&S.folderStore!=="alle"&&r.s!==S.folderStore)return false;if(!q)return true;return (r.n+" "+(r.b||"")+" "+packOf(r)+" "+(r.deal||"")+" "+(r.desc||"")).toLowerCase().indexOf(q)>=0;});
  var sets=boardMatchSets();
  rows.forEach(function(r){r._match=dealMatchKind(r,sets);});
  rows.sort(function(a,b){
    var ra=a._match==="list"?0:a._match==="bord"?1:2;
    var rb=b._match==="list"?0:b._match==="bord"?1:2;
    if(ra!==rb)return ra-rb;
    return 0;
  });
  window._folderRows=rows.slice(0,200);
  if(!rows.length){host.innerHTML="<p class=note>Nog geen folderregels.</p>";return;}
  var html="";var lastSec="";
  window._folderRows.forEach(function(r,idx){
    var sec="";
    if(r._match==="list"||r._match==="bord")sec="match";
    else sec="rest";
    if(sec!==lastSec){
      if(sec==="match")html+="<div class=sec>Past bij je bord</div>";
      else if(lastSec==="match")html+="<div class=sec>Meer acties</div>";
      lastSec=sec;
    }
    var badge="";
    if(r._match==="list")badge=" <span class='badge match'>Op je lijst</span>";
    else if(r._match==="bord")badge=" <span class='badge bord'>Past bij je bord</span>";
    var img=r.img?"<img class=thumb alt='' referrerpolicy='no-referrer' loading='lazy' onerror=\"this.onerror=null;this.src='';this.style.background='#EDE0D0'\" src=\""+String(r.img).replace(/\"/g,"")+"\">":"<span class=thumb aria-hidden=true></span>";
    html+="<button type=button class=listrow data-act=adddeal data-idx="+idx+" data-n='"+encodeURIComponent(r.n||"")+"' data-sid='"+(r.s||"")+"' data-now='"+(r.now||0)+"' data-pack='"+encodeURIComponent(packOf(r))+"'>"+img+"<div style=flex:1><b>"+String(r.n||"").replace(/</g,"")+badge+"</b><div class=meta>"+folderMeta(r).replace(/</g,"")+"</div></div><div class=price>"+(r.now?euroc(r.now):"")+"</div></button>";
  });
  host.innerHTML=html;if(typeof markFolder==="function")markFolder();}
document.addEventListener("click",function(e){var fs=e.target.closest&&e.target.closest("[data-act=fstore]");if(fs){S.folderStore=fs.getAttribute("data-id");drawFolder();}});
if(typeof show==="function"&&!show._folderWrap){var _show=show;show=function(id){var pan=document.getElementById("storepanel");if(pan)pan.classList.remove("on");_show(id);if(id==="folder")drawFolder();};show._folderWrap=true;}
function refreshListQuiet(){try{var v=document.getElementById("lijst");if(v&&v.classList.contains("on")&&typeof drawList==="function")drawList();}catch(e){}}
fetch("bonus.json",{cache:"no-store"}).then(function(r){return r.json();}).then(function(d){if(!d)return;if(typeof BONUS!=="undefined"){Object.keys(d).forEach(function(k){if(k==="week"||k==="source"||k==="fetched"||k==="note")return;if(d[k]&&typeof d[k]==="object"&&!Array.isArray(d[k]))BONUS[k]=d[k];});}if(d.week){try{BONUS_WEEK=d.week;}catch(e){window.BONUS_WEEK=d.week;}if(typeof window!=="undefined")window.BONUS_WEEK=d.week;}refreshListQuiet();}).catch(function(){});
function applyFolderFiles(arr){var items=[];arr.forEach(function(d){if(!d)return;(d.items||[]).forEach(function(it){if(it.qty&&!it.q)it.q=it.qty;items.push(it);});});window.FOLDER_FULL={items:items};var f=document.getElementById("folder");if(f&&f.classList.contains("on"))drawFolder();refreshListQuiet();}
fetch("folder-index.json",{cache:"no-store"}).then(function(r){return r.json();}).then(function(idx){
  window.FOLDER_INDEX=idx||{stores:[]};
  var stores=(idx&&idx.stores)||[];
  if(!stores.length&&typeof STORES!=="undefined")stores=STORES.map(function(s){return {id:s.id,n:s.n,file:"folder-"+s.id+".json"};});
  return Promise.all(stores.map(function(s){var file=s.file||("folder-"+s.id+".json");return fetch(file,{cache:"no-store"}).then(function(r){return r.ok?r.json():{items:[]};}).catch(function(){return {items:[]};});}));
}).then(applyFolderFiles).catch(function(){
  var fallback=(typeof STORES!=="undefined"?STORES:[]).map(function(s){return s.id;});
  Promise.all(fallback.map(function(s){return fetch("folder-"+s+".json",{cache:"no-store"}).then(function(r){return r.ok?r.json():{items:[]};}).catch(function(){return {items:[]};});})).then(applyFolderFiles).catch(function(){});
});
