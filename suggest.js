(function(){
if(window._suggest)return;window._suggest=1;
var DAYS=window.DAYS||["Ma","Di","Wo","Do","Vr","Za","Zo"];
var DLAB=window.DLAB||{Ma:"Maandag",Di:"Dinsdag",Wo:"Woensdag",Do:"Donderdag",Vr:"Vrijdag",Za:"Zaterdag",Zo:"Zondag"};

function todayIdx(){return (new Date().getDay()+6)%7;}

function whoFor(day){
  var who={};
  (S.people||[]).forEach(function(p){
    who[p.id]=(typeof modeOf==="function")?modeOf(day,p):((p.sched&&p.sched[day])||"eat");
  });
  return who;
}

function eatersFor(day){
  if(typeof eatersOn==="function"){
    return eatersOn(day).filter(function(p){return typeof p.id==="number"||(p.id!=null&&p.id<1000);});
  }
  return (S.people||[]).filter(function(p){
    var m=(p.sched&&p.sched[day])||"eat";
    return m==="eat"||m==="later";
  });
}

function dayNeedsMeal(d){
  var slot=S.plan&&S.plan[d];
  if(slot&&slot.id)return false;
  return eatersFor(d).length>0;
}

function candidateDays(want){
  want=want||5;
  var start=todayIdx();
  var ordered=[];
  for(var i=0;i<7;i++)ordered.push(DAYS[(start+i)%7]);
  return ordered.filter(dayNeedsMeal).slice(0,want);
}

function scoreRec(rec,people,usedCuisine){
  if(typeof hardBlock==="function"&&hardBlock(rec,people).length)return null;
  var taste=(typeof tasteHits==="function")?tasteHits(rec,people).length:0;
  var cuisinePen=(usedCuisine[rec.c]?18:0);
  var timePen=Math.max(0,(rec.time||30)-35);
  return taste*12+cuisinePen+timePen;
}

function buildSuggestions(n){
  n=n||5;
  var days=candidateDays(n);
  if(days.length<3){
    var extra=candidateDays(7);
    days=extra.slice(0,Math.max(days.length,Math.min(5,extra.length)));
  }
  var usedCuisine={};
  var usedId={};
  var out=[];
  days.forEach(function(d){
    var people=eatersFor(d);
    if(!people.length)return;
    var best=null,bestScore=1e9;
    (typeof REC!=="undefined"?REC:[]).forEach(function(rec){
      if(usedId[rec.id])return;
      var sc=scoreRec(rec,people,usedCuisine);
      if(sc==null)return;
      if(sc<bestScore){bestScore=sc;best=rec;}
    });
    if(!best){
      (typeof REC!=="undefined"?REC:[]).forEach(function(rec){
        if(usedId[rec.id])return;
        var sc=scoreRec(rec,people,{});
        if(sc==null)return;
        if(sc<bestScore){bestScore=sc;best=rec;}
      });
    }
    if(!best)return;
    usedId[best.id]=1;
    usedCuisine[best.c]=1;
    out.push({day:d,id:best.id,t:best.t,c:best.c,time:best.time,taste:(typeof tasteHits==="function")?tasteHits(best,people).length:0});
  });
  if(out.length>5)out=out.slice(0,5);
  if(out.length>=3)return out;
  return out;
}

function panel(){
  var el=document.getElementById("suggest");
  if(el)return el;
  el=document.createElement("section");
  el.className="panel";
  el.id="suggest";
  el.innerHTML="<div class=hd><button class='btn s w' id=sugclose type=button>Later</button><b>Voorstellen</b></div><div class=sc id=sugbody></div>";
  (document.querySelector(".phone")||document.body).appendChild(el);
  return el;
}

function drawSuggest(list){
  S._sugDraft=(list||[]).slice();
  var host=document.getElementById("sugbody");if(!host)return;
  if(!S._sugDraft.length){
    host.innerHTML="<p class=note>Geen vrije avonden met eten thuis, of alles botst met dieet. Kies handmatig op het bord.</p><button class='btn g full' id=suggo type=button>Naar bord</button>";
    return;
  }
  var html="<p class=note>Drie tot vijf avonden, passend bij wie thuis is. Kok uit wie kan koken. Minder veto\u2019s eerst, keukens afgewisseld. Tik een regel om te wisselen.</p>";
  S._sugDraft.forEach(function(s,i){
    var taste=s.taste?(" \u00b7 "+s.taste+" smaak"):"";
    var cookN="";
    var pool=(typeof cooksOn==="function")?cooksOn():(S.people||[]).filter(function(p){return !!p.canCook;});
    if(pool.length){
      var wkey=(function(){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+3-(d.getDay()+6)%7);var w1=new Date(d.getFullYear(),0,4);var w=1+Math.round(((d-w1)/86400000-(3-(w1.getDay()+6)%7))/7);return d.getFullYear()+"-W"+String(w).padStart(2,"0");})();
      var sl=S.weekPlans&&S.weekPlans[wkey]&&S.weekPlans[wkey][s.day];
      var hit=pool.filter(function(p){return p.id===(sl&&sl.cook);})[0]||pool[0];
      if(hit)cookN=" \u00b7 kookt "+hit.name;
    }
    html+="<button type=button class='card sugrow' data-act=sugswap data-i="+i+"><div class=p><b>"+DLAB[s.day]+" \u00b7 "+s.t+"</b><div class=meta>"+s.c+" \u00b7 "+(s.time||"?")+" min"+taste+cookN+" \u00b7 tik om te wisselen</div></div></button>";
  });
  html+="<button class='btn g full' id=sugaccept type=button style=margin-top:8px>Alles op het bord</button>";
  html+="<button class='btn w full' id=sugclose2 type=button style=margin-top:8px>Nog even niet</button>";
  host.innerHTML=html;
}

function openSuggest(forceList){
  var list=forceList||buildSuggestions(5);
  if(list.length>5)list=list.slice(0,5);
  if(list.length>=3&&list.length<=5){/* ok */}
  else if(list.length&&list.length<3){/* still show what we have */}
  panel().classList.add("on");
  drawSuggest(list);
}

function closeSuggest(){
  var el=document.getElementById("suggest");
  if(el)el.classList.remove("on");
}

function swapOne(i){
  var cur=S._sugDraft&&S._sugDraft[i];if(!cur)return;
  var people=eatersFor(cur.day);
  var usedId={};S._sugDraft.forEach(function(s,j){if(j!==i)usedId[s.id]=1;});
  var usedCuisine={};S._sugDraft.forEach(function(s,j){if(j!==i)usedCuisine[s.c]=1;});
  var pool=[];
  (typeof REC!=="undefined"?REC:[]).forEach(function(rec){
    if(usedId[rec.id]||rec.id===cur.id)return;
    var sc=scoreRec(rec,people,usedCuisine);
    if(sc==null)return;
    pool.push({rec:rec,sc:sc});
  });
  pool.sort(function(a,b){return a.sc-b.sc;});
  if(!pool.length){if(typeof toast==="function")toast("Geen andere optie");return;}
  var next=pool[0].rec;
  S._sugDraft[i]={day:cur.day,id:next.id,t:next.t,c:next.c,time:next.time,taste:(typeof tasteHits==="function")?tasteHits(next,people).length:0};
  drawSuggest(S._sugDraft);
}

function acceptAll(){
  var list=S._sugDraft||[];
  if(!list.length){closeSuggest();if(typeof show==="function")show("bord");return;}
  list.forEach(function(s){
    var who=whoFor(s.day);
    var kids=(S.people||[]).filter(function(p){return p.role==="child"&&p.portion==="small";}).map(function(p){return p.id;});
    var rec=(typeof recipeBy==="function")?recipeBy(s.id):null;
    S.plan[s.day]={id:s.id,who:who,fijn:(rec&&rec.fijn)?kids.slice():[],leftover:false};
    if(S.eaten)delete S.eaten[s.day];
    var pool=(typeof cooksOn==="function")?cooksOn():(S.people||[]).filter(function(p){return !!p.canCook;});
    if(pool.length&&S.weekPlans){
      var wkey=(function(){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+3-(d.getDay()+6)%7);var w1=new Date(d.getFullYear(),0,4);var w=1+Math.round(((d-w1)/86400000-(3-(w1.getDay()+6)%7))/7);return d.getFullYear()+"-W"+String(w).padStart(2,"0");})();
      var wk=S.weekPlans[wkey];
      if(wk&&wk[s.day]){
        var cur=wk[s.day].cook;
        if(!pool.some(function(p){return p.id===cur;}))wk[s.day].cook=pool[0].id;
      }
    }
  });
  if(typeof save==="function")save();
  closeSuggest();
  if(typeof drawBord==="function")drawBord();
  if(typeof drawList==="function")drawList();
  if(typeof toast==="function")toast(list.length+" avonden op het bord \u00b7 lijst bijgewerkt");
  if(typeof show==="function")show("bord");
}

window.openSuggest=openSuggest;
window.buildSuggestions=buildSuggestions;
window.closeSuggest=closeSuggest;

document.addEventListener("click",function(e){
  var t=e.target;if(t&&t.nodeType===3)t=t.parentNode;if(!t||!t.closest)return;
  if(t.id==="sugclose"||t.id==="sugclose2"){e.preventDefault();closeSuggest();return;}
  if(t.id==="suggo"){e.preventDefault();closeSuggest();if(typeof show==="function")show("bord");return;}
  if(t.id==="sugaccept"){e.preventDefault();acceptAll();return;}
  var row=t.closest("[data-act=sugswap]");
  if(row){e.preventDefault();swapOne(+row.getAttribute("data-i"));return;}
},true);

if(typeof show==="function"&&!show._sug){
  var _sh=show;
  show=function(id){if(id!=="bord"&&id!=="huis")closeSuggest();_sh(id);};
  show._sug=true;
}
})();
