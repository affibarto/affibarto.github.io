(function(){
if(window._nearbyOnce)return;window._nearbyOnce=1;

var CHAINS=[
  {id:"dirk",n:"Dirk",re:/\bdirk\b/i},
  {id:"ah",n:"Albert Heijn",re:/albert\s*heijn|\bah\b/i},
  {id:"lidl",n:"Lidl",re:/\blidl\b/i},
  {id:"jumbo",n:"Jumbo",re:/\bjumbo\b/i},
  {id:"plus",n:"Plus",re:/\bplus\b/i}
];
var RADIUS_KM=12;
var CACHE_KEY="weate.nearby.v1";
var _lastNomAt=0;
var _busy=false;

function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");}
function chainOf(tags){
  tags=tags||{};
  var blob=[tags.brand,tags.name,tags.operator,tags["brand:en"],tags["name:nl"]].filter(Boolean).join(" ");
  if(/\bpicnic\b/i.test(blob))return null;
  for(var i=0;i<CHAINS.length;i++){
    if(CHAINS[i].re.test(blob))return CHAINS[i];
  }
  return null;
}
function haversine(a,b,c,d){
  var R=6371,to=Math.PI/180;
  var dLat=(c-a)*to,dLon=(d-b)*to;
  var x=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(a*to)*Math.cos(c*to)*Math.sin(dLon/2)*Math.sin(dLon/2);
  return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}
function fmtKm(km){
  if(km<1)return Math.round(km*1000)+" m";
  return (Math.round(km*10)/10).toFixed(1).replace(".",",")+" km";
}
function mapsUrl(lat,lon,name){
  return "https://maps.google.com/?q="+encodeURIComponent((name?name+" ":"")+lat+","+lon);
}
function bboxAround(lat,lon,km){
  var dLat=km/111.32;
  var dLon=km/(111.32*Math.cos(lat*Math.PI/180));
  return {
    s:lat-dLat,w:lon-dLon,n:lat+dLat,e:lon+dLon
  };
}
function readCache(){
  try{
    var raw=sessionStorage.getItem(CACHE_KEY)||localStorage.getItem(CACHE_KEY);
    if(!raw)return null;
    var o=JSON.parse(raw);
    if(!o||!o.results||!o.at)return null;
    if(Date.now()-o.at>6*60*60*1000)return null;
    return o;
  }catch(e){return null;}
}
function writeCache(o){
  try{
    var raw=JSON.stringify(o);
    sessionStorage.setItem(CACHE_KEY,raw);
    localStorage.setItem(CACHE_KEY,raw);
  }catch(e){}
}
function setStatus(msg,kind){
  var el=document.getElementById("nearbystatus");
  if(!el)return;
  el.textContent=msg||"";
  el.className="note"+(kind==="err"?" nearby-err":kind==="ok"?" nearby-ok":"");
}
function openPanel(){
  var p=document.getElementById("nearbypanel");
  if(!p)return;
  p.classList.add("on");
  var cached=readCache();
  if(cached&&cached.results&&cached.results.length){
    setStatus(cached.label?"Laatste zoekopdracht: "+cached.label:"Laatste zoekopdracht (cache)","");
    renderList(cached.results);
  }
}
function closePanel(){
  var p=document.getElementById("nearbypanel");
  if(p)p.classList.remove("on");
}
function renderList(rows){
  var host=document.getElementById("nearbybody");
  if(!host)return;
  window._nearbyRows=rows||[];
  if(!rows||!rows.length){
    host.innerHTML="<p class=note>Geen Dirk, Albert Heijn, Lidl, Jumbo of Plus in de buurt gevonden. Probeer een andere plaats.</p>";
    return;
  }
  var storesOn=(typeof S!=="undefined"&&S.stores)||{};
  var html="";
  rows.forEach(function(r,i){
    var on=storesOn[r.id]!==false;
    html+="<div class='listrow nearbyrow' data-act=nearmap data-i="+i+">"+
      "<div style=flex:1>"+
        "<b>"+esc(r.name)+"</b>"+
        "<div class=meta><span class=badge>"+esc(r.chain)+"</span> · "+fmtKm(r.km)+(r.addr?" · "+esc(r.addr):"")+"</div>"+
      "</div>"+
      "<div class=nearbyacts>"+
        "<button type=button class='chip "+(on?"on":"")+"' data-act=neartog data-id='"+esc(r.id)+"'>"+(on?"Aan":"Zet aan")+"</button>"+
        "<a class='btn s w' href='"+mapsUrl(r.lat,r.lon,r.name)+"' target=_blank rel=noopener data-act=nearmaplink>Kaart</a>"+
      "</div>"+
    "</div>";
  });
  host.innerHTML=html;
}
function parseOverpass(data,lat,lon){
  var seen={},out=[];
  (data.elements||[]).forEach(function(el){
    var tags=el.tags||{};
    var ch=chainOf(tags);
    if(!ch)return;
    var la=el.lat,lo=el.lon;
    if(el.center){la=el.center.lat;lo=el.center.lon;}
    if(la==null||lo==null)return;
    var km=haversine(lat,lon,+la,+lo);
    if(km>RADIUS_KM+0.4)return;
    var key=ch.id+"|"+Math.round(+la*4000)+"|"+Math.round(+lo*4000);
    if(seen[key])return;
    seen[key]=1;
    var name=tags.name||tags.brand||ch.n;
    if(/\bpicnic\b/i.test(name))return;
    var addr=[tags["addr:street"],tags["addr:housenumber"],tags["addr:city"]||tags["addr:place"]].filter(Boolean).join(" ").replace(/\s+/g," ").trim();
    out.push({id:ch.id,chain:ch.n,name:name,lat:+la,lon:+lo,addr:addr,km:km});
  });
  out.sort(function(a,b){return a.km-b.km;});
  return out;
}
function overpassQuery(lat,lon){
  var b=bboxAround(lat,lon,RADIUS_KM);
  // bbox + shop=supermarket is indexed and reliable; brands filtered client-side
  return "[out:json][timeout:40];("+
    "node[\"shop\"=\"supermarket\"]("+b.s+","+b.w+","+b.n+","+b.e+");"+
    "way[\"shop\"=\"supermarket\"]("+b.s+","+b.w+","+b.n+","+b.e+");"+
    ");out center tags;";
}
function fetchNearby(lat,lon,label){
  if(_busy)return;
  _busy=true;
  setStatus("Winkels zoeken…","");
  var body=document.getElementById("nearbybody");
  if(body)body.innerHTML="<p class=note>Bezig met OpenStreetMap…</p>";
  var q=overpassQuery(lat,lon);
  var urls=[
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
  ];
  function tryOne(i){
    if(i>=urls.length){
      _busy=false;
      setStatus("Kon winkels niet ophalen. Probeer zo meteen opnieuw.","err");
      if(body)body.innerHTML="";
      return;
    }
    fetch(urls[i],{
      method:"POST",
      headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8","Accept":"application/json"},
      body:"data="+encodeURIComponent(q)
    }).then(function(r){
      if(!r.ok)throw new Error("http "+r.status);
      return r.json();
    }).then(function(data){
      if(data&&data.remark&&!(data.elements&&data.elements.length))throw new Error(data.remark);
      _busy=false;
      var rows=parseOverpass(data,lat,lon);
      writeCache({lat:lat,lon:lon,label:label||"",at:Date.now(),results:rows});
      setStatus(rows.length?(rows.length+" winkels binnen ~"+RADIUS_KM+" km"+(label?" · "+label:"")):"Niets gevonden"+(label?" bij "+label:""),rows.length?"ok":"");
      renderList(rows);
    }).catch(function(){tryOne(i+1);});
  }
  tryOne(0);
}
function geocodePlace(q){
  var wait=Math.max(0,1100-(Date.now()-_lastNomAt));
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      _lastNomAt=Date.now();
      // Browser Referer identifies WeAte/affibarto; custom User-Agent breaks CORS.
      var url="https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=nl&q="+encodeURIComponent(q);
      fetch(url,{headers:{"Accept":"application/json"}}).then(function(r){
        if(!r.ok)throw new Error("http "+r.status);
        return r.json();
      }).then(function(arr){
        if(!arr||!arr.length){reject(new Error("notfound"));return;}
        resolve({lat:+arr[0].lat,lon:+arr[0].lon,label:arr[0].display_name||q});
      }).catch(reject);
    },wait);
  });
}
function useGps(){
  if(!navigator.geolocation){
    setStatus("Geolocation niet beschikbaar. Vul een plaats of postcode in.","err");
    return;
  }
  setStatus("Locatie vragen… WeAte gebruikt je locatie alleen om winkels in de buurt te zoeken — niet opgeslagen op een server.","");
  navigator.geolocation.getCurrentPosition(function(pos){
    fetchNearby(pos.coords.latitude,pos.coords.longitude,"mijn locatie");
  },function(err){
    var msg="Locatie niet beschikbaar.";
    if(err&&err.code===1)msg="Locatie geweigerd. Vul hieronder een plaats of postcode in.";
    else if(err&&err.code===3)msg="Locatie duurde te lang. Probeer opnieuw of vul een plaats in.";
    else if(err&&err.code===2)msg="Locatie onbekend. Vul een plaats of postcode in.";
    setStatus(msg,"err");
  },{enableHighAccuracy:false,timeout:12000,maximumAge:120000});
}
function searchTyped(){
  if(_busy)return;
  var inp=document.getElementById("nearbyq");
  var q=(inp&&inp.value||"").trim();
  if(!q){setStatus("Vul een plaats of postcode in.","err");return;}
  _busy=true;
  setStatus("Plaats opzoeken…","");
  geocodePlace(q).then(function(g){
    _busy=false;
    fetchNearby(g.lat,g.lon,(g.label.split(",")[0]||q));
  }).catch(function(err){
    _busy=false;
    if(err&&err.message==="notfound")setStatus("Geen plaats gevonden in NL. Probeer een postcode of stad.","err");
    else setStatus("Kon plaats niet opzoeken. Probeer zo opnieuw.","err");
  });
}
function enableChain(id){
  if(!id||typeof S==="undefined")return;
  var known=false;
  if(typeof STORES!=="undefined")known=STORES.some(function(s){return s.id===id;});
  if(!known)return;
  S.stores=S.stores||{};
  S.stores[id]=true;
  if(typeof save==="function")save();
  if(typeof paintStores==="function")paintStores();
  if(typeof drawStores==="function")drawStores();
  if(typeof toast==="function"){
    var n=(CHAINS.filter(function(c){return c.id===id;})[0]||{}).n||id;
    toast(n+" staat aan in je vergelijking");
  }
  renderList(window._nearbyRows||[]);
}
function refreshStoreChips(){
  try{
    if(typeof paintStores==="function")paintStores();
    else if(typeof STORES!=="undefined"&&typeof S!=="undefined"){
      ["setstores","huisstores"].forEach(function(id){
        var el=document.getElementById(id);if(!el)return;
        el.innerHTML=STORES.map(function(r){return "<button type=button class='chip "+((S.stores||{})[r.id]!==false?"on":"")+"' data-act=store data-id="+r.id+">"+r.n+"</button>";}).join("");
      });
    }
  }catch(e){}
}
document.addEventListener("click",function(e){
  var t=e.target;if(t&&t.nodeType===3)t=t.parentNode;if(!t||!t.closest)return;
  if(t.id==="opennnearby"||t.id==="opennnearby2"||(t.closest&&t.closest("[data-act=opennnearby]"))){
    e.preventDefault();e.stopPropagation();openPanel();return;
  }
  if(t.id==="closenearby"||(t.closest&&t.closest("#closenearby"))){e.preventDefault();e.stopPropagation();closePanel();return;}
  if(t.id==="nearbygps"||(t.closest&&t.closest("#nearbygps"))){e.preventDefault();e.stopPropagation();useGps();return;}
  if(t.id==="nearbysearch"||(t.closest&&t.closest("#nearbysearch"))){e.preventDefault();e.stopPropagation();searchTyped();return;}
  var tog=t.closest&&t.closest("[data-act=neartog]");
  if(tog){
    e.preventDefault();e.stopPropagation();
    enableChain(tog.getAttribute("data-id"));
    refreshStoreChips();
    return;
  }
  if(t.closest&&t.closest("[data-act=nearmaplink]")){e.stopPropagation();return;}
  var row=t.closest&&t.closest("[data-act=nearmap]");
  if(row&&!(t.closest("a")||t.closest("[data-act=neartog]"))){
    var i=+row.getAttribute("data-i");
    var r=(window._nearbyRows||[])[i];
    if(r)window.open(mapsUrl(r.lat,r.lon,r.name),"_blank","noopener");
  }
},true);
document.addEventListener("keydown",function(e){
  if(e.key==="Enter"&&e.target&&e.target.id==="nearbyq"){e.preventDefault();searchTyped();}
});
window.openNearby=openPanel;
})();
