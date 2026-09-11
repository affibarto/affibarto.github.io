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
var _STOP={voor:1,met:1,van:1,een:1,het:1,de:1,en:1,per:1,stuks:1,pack:1,doos:1,vers:1,diepvries:1,milde:1,halfvolle:1};
function _tokens(s){
  return String(s||"").toLowerCase().replace(/[^\wäöüßà-ÿ0-9]+/g," ").split(/\s+/).filter(function(t){
    return t.length>=5 && !_STOP[t] && !/^\d/.test(t);
  });
}
function boardMatchSets(){
  var listNames=[], bordNames=[], seenL={}, seenB={};
  function add(arr,seen,name){
    name=String(name||"").trim();
    if(!name)return;
    var key=name.toLowerCase();
    if(seen[key])return;
    seen[key]=1;arr.push(name);
  }
  try{
    if(typeof buildList==="function"){
      buildList().forEach(function(i){add(listNames,seenL,i.n);});
    }
  }catch(e){}
  try{
    if(S&&S.plan&&typeof recipeBy==="function"){
      Object.keys(S.plan).forEach(function(d){
        var slot=S.plan[d];if(!slot||!slot.id||slot.leftover)return;
        var rec=recipeBy(slot.id);if(!rec)return;
        (rec.ing||[]).forEach(function(it){
          var cat=(typeof CAT!=="undefined"&&CAT[it.k])||null;
          add(bordNames,seenB,cat?cat.name:it.k);
        });
      });
    }
  }catch(e){}
  return {list:listNames,bord:bordNames};
}
function dealMatchKind(r,sets){
  var hay=(r.n+" "+(r.b||"")+" "+(r.desc||"")+" "+packOf(r)).toLowerCase();
  function hit(names){
    for(var i=0;i<names.length;i++){
      var n=names[i].toLowerCase();
      if(n.length>=5 && hay.indexOf(n)>=0)return true;
      var toks=_tokens(n);
      for(var j=0;j<toks.length;j++){
        if(hay.indexOf(toks[j])>=0)return true;
      }
    }
    return false;
  }
  if(hit(sets.list||[]))return "list";
  if(hit(sets.bord||[]))return "bord";
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
