(function(){
if(window._suggest)return;window._suggest=1;
var DAYS=window.DAYS||["Ma","Di","Wo","Do","Vr","Za","Zo"];
var DLAB=window.DLAB||{Ma:"Maandag",Di:"Dinsdag",Wo:"Woensdag",Do:"Donderdag",Vr:"Vrijdag",Za:"Zaterdag",Zo:"Zondag"};
var OPTS_PER_DAY=10;

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
    return m==="eat";
  });
}

function dayNeedsMeal(d){
  var slot=S.plan&&S.plan[d];
  if(slot&&slot.id)return false;
  return eatersFor(d).length>0;
}

function dayRank(d){
  var i=DAYS.indexOf(d);
  return i<0?99:i;
}
function sortByWeekDay(list){
  return (list||[]).slice().sort(function(a,b){
    var da=typeof a==="string"?a:a.day;
    var db=typeof b==="string"?b:b.day;
    return dayRank(da)-dayRank(db);
  });
}
function candidateDays(want){
  want=want||7;
  return DAYS.filter(dayNeedsMeal).slice(0,want);
}

function recs(){return typeof REC!=="undefined"?REC:[];}

function scoreRec(rec,people,ctx){
  /* Één scorer: WeAteAI.scoreRecSmart (offline pad). Fallback alleen als AI-module ontbreekt. */
  if(window.WeAteAI&&typeof WeAteAI.scoreRecSmart==="function"){
    return WeAteAI.scoreRecSmart(rec,people,ctx||{});
  }
  ctx=ctx||{};
  if(typeof hardBlock==="function"&&hardBlock(rec,people).length)return null;
  var taste=(typeof tasteHits==="function")?tasteHits(rec,people).length:0;
  var score=taste*22;
  if(ctx.usedCuisine&&ctx.usedCuisine[rec.c])score+=20;
  if(ctx.usedId&&ctx.usedId[rec.id])score+=10;
  score+=Math.max(0,(rec.time||30)-35);
  if(ctx.busy&&(rec.time||30)>30)score+=14;
  if(ctx.busy&&(rec.time||30)<=25)score-=8;
  if(ctx.preferReheat&&rec.reheat)score-=6;
  if(ctx.kidsSmall&&rec.fijn)score-=5;
  if(ctx.usedCuisine&&!ctx.usedCuisine[rec.c])score-=2;
  return score;
}

function dayBusy(d){
  var modes={eat:0,later:0,apart:0,skip:0};
  (S.people||[]).forEach(function(p){
    var m=(typeof modeOf==="function")?modeOf(d,p):((p.sched&&p.sched[d])||"eat");
    modes[m]=(modes[m]||0)+1;
  });
  var people=eatersFor(d);
  return (modes.apart+modes.later)>=2||(modes.apart>=1&&people.length<=3);
}

function optionsForDay(d,ctx){
  ctx=ctx||{};
  var people=eatersFor(d);
  if(!people.length)return [];
  var kidsSmall=people.some(function(p){return p.role==="child"&&p.portion==="small";});
  var busy=dayBusy(d);
  var preferReheat=!!ctx.preferReheat;
  var usedCuisine=ctx.usedCuisine||{};
  var usedId=ctx.usedId||{};
  var preferId=ctx.preferId||null;
  var scored=[];
  recs().forEach(function(rec){
    var sc=scoreRec(rec,people,{
      usedCuisine:usedCuisine,
      usedId:usedId,
      busy:busy,
      kidsSmall:kidsSmall,
      preferReheat:preferReheat
    });
    if(sc==null)return;
    if(preferId&&rec.id===preferId)sc-=40;
    var tasteN=(typeof tasteHits==="function")?tasteHits(rec,people).length:0;
    var why=[];
    if(busy&&(rec.time||30)<=25)why.push("snel · drukke avond");
    else if(busy)why.push("drukke avond");
    if(rec.reheat&&preferReheat)why.push("warmt goed op");
    if(kidsSmall&&rec.fijn)why.push("fijn mogelijk");
    if(tasteN)why.push(tasteN+" smaak-check");
    scored.push({
      id:rec.id,
      t:rec.t,
      c:rec.c,
      time:rec.time,
      img:rec.img||"",
      taste:tasteN,
      why:why.join(" · "),
      score:sc
    });
  });
  scored.sort(function(a,b){return a.score-b.score;});
  /* Cuisine variety in top slice: take best, then prefer unseen cuisines. */
  var out=[], seenC={}, seenI={};
  function pushUnique(list){
    list.forEach(function(o){
      if(seenI[o.id]||out.length>=OPTS_PER_DAY)return;
      seenI[o.id]=1;
      out.push(o);
      seenC[o.c]=1;
    });
  }
  /* Prefer preferId first if present. */
  if(preferId){
    var pref=scored.filter(function(o){return o.id===preferId;});
    pushUnique(pref);
  }
  /* Pass 1: distinct cuisines */
  pushUnique(scored.filter(function(o){return !seenC[o.c];}));
  /* Pass 2: fill remaining by score */
  pushUnique(scored);
  /* Fallback: if hardBlock wiped everything, soft-score without cuisine penalty only — still hardBlock. */
  if(!out.length){
    recs().forEach(function(rec){
      if(typeof hardBlock==="function"&&hardBlock(rec,people).length)return;
      out.push({
        id:rec.id,t:rec.t,c:rec.c,time:rec.time,img:rec.img||"",
        taste:(typeof tasteHits==="function")?tasteHits(rec,people).length:0,
        why:"",score:0
      });
    });
    out=out.slice(0,OPTS_PER_DAY);
  }
  return out;
}

function buildSuggestions(n){
  n=n||7;
  var days=candidateDays(n);
  if(days.length<3){
    var extra=candidateDays(7);
    days=extra.slice(0,Math.max(days.length,Math.min(7,extra.length)));
  }
  var usedCuisine={};
  var usedId={};
  /* Soft: ids already on board */
  if(S.plan){
    DAYS.forEach(function(d){
      var sl=S.plan[d];
      if(sl&&sl.id)usedId[sl.id]=1;
    });
  }
  var out=[];
  days.forEach(function(d,idx){
    var opts=optionsForDay(d,{
      usedCuisine:usedCuisine,
      usedId:usedId,
      preferReheat:idx>=2
    });
    if(!opts.length)return;
    var pick=opts[0].id;
    usedId[pick]=1;
    usedCuisine[opts[0].c]=1;
    out.push({day:d,options:opts,pick:pick,skip:false});
  });
  return out;
}

/* Accept legacy flat [{day,id,t…}] or new [{day,options,pick}]. */
function normalizeSuggestList(list){
  list=list||[];
  if(!list.length)return [];
  if(list[0]&&Array.isArray(list[0].options)){
    return sortByWeekDay(list.map(function(s){
      var opts=(s.options||[]).filter(function(o){return o&&o.id&&o.t;});
      var pick=s.skip?null:(s.pick||(opts[0]&&opts[0].id)||null);
      return {day:s.day,options:opts,pick:pick,skip:!!s.skip};
    }).filter(function(s){return s.day&&s.options.length;}));
  }
  /* Flat AI/local: one preferred id per day → expand with local options. */
  var byDay={};
  list.forEach(function(s){
    if(!s||!s.day)return;
    byDay[s.day]=s;
  });
  var days=Object.keys(byDay);
  if(!days.length){
    /* Maybe pure option list without days — ignore */
    return [];
  }
  days=sortByWeekDay(days);
  var usedCuisine={},usedId={};
  if(S.plan){
    DAYS.forEach(function(d){
      var sl=S.plan[d];
      if(sl&&sl.id)usedId[sl.id]=1;
    });
  }
  return days.map(function(d,idx){
    var pref=byDay[d];
    var preferId=pref&&pref.id;
    var opts=optionsForDay(d,{
      usedCuisine:usedCuisine,
      usedId:usedId,
      preferReheat:idx>=2,
      preferId:preferId
    });
    /* Ensure preferred id is in list with real catalog fields. */
    if(preferId&&!opts.some(function(o){return o.id===preferId;})){
      var rec=(typeof recipeBy==="function")?recipeBy(preferId):null;
      if(rec&&rec.t){
        opts.unshift({
          id:rec.id,t:rec.t,c:rec.c,time:rec.time,img:rec.img||"",
          taste:pref.taste||0,why:pref.why||"",score:-1
        });
      }
    }
    if(!opts.length)return null;
    var pick=preferId&&opts.some(function(o){return o.id===preferId;})?preferId:opts[0].id;
    usedId[pick]=1;
    var hit=opts.filter(function(o){return o.id===pick;})[0];
    if(hit)usedCuisine[hit.c]=1;
    return {day:d,options:opts,pick:pick,skip:false};
  }).filter(Boolean);
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

function syncPick(list,keep){
  var prev=keep?(S._sugPick||{}):{};
  var next={};
  (list||[]).forEach(function(s){
    if(prev[s.day]!==undefined){
      next[s.day]=prev[s.day];
    }else{
      next[s.day]=s.skip?null:(s.pick||null);
    }
  });
  S._sugPick=next;
}

function selectedList(){
  return sortByWeekDay((S._sugDraft||[]).filter(function(s){
    var p=S._sugPick&&S._sugPick[s.day];
    return p&&p!=="__skip__";
  }).map(function(s){
    var pid=S._sugPick[s.day];
    var opt=(s.options||[]).filter(function(o){return o.id===pid;})[0];
    if(!opt){
      var rec=(typeof recipeBy==="function")?recipeBy(pid):null;
      if(rec)opt={id:rec.id,t:rec.t,c:rec.c,time:rec.time,img:rec.img||""};
    }
    if(!opt)return null;
    return {day:s.day,id:opt.id,t:opt.t,c:opt.c,time:opt.time,taste:opt.taste||0};
  }).filter(Boolean));
}

function selectedCount(){
  return selectedList().length;
}

function refreshAcceptBtn(){
  var btn=document.getElementById("sugaccept");
  if(!btn)return;
  var n=selectedCount();
  btn.textContent=n?("Gekozen op het bord ("+n+")"):"Gekozen op het bord";
  btn.disabled=!n;
  btn.setAttribute("aria-disabled",n?"false":"true");
  btn.style.opacity=n?"":"0.5";
}

function setAllPick(on){
  (S._sugDraft||[]).forEach(function(s){
    if(on){
      S._sugPick[s.day]=s.pick||(s.options&&s.options[0]&&s.options[0].id)||null;
      s.skip=false;
    }else{
      S._sugPick[s.day]="__skip__";
      s.skip=true;
    }
  });
  drawSuggest(S._sugDraft,{keepPick:true});
}

function esc(s){
  return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
}

function drawSuggest(list,opts){
  opts=opts||{};
  S._sugDraft=normalizeSuggestList(list||[]);
  syncPick(S._sugDraft,!!opts.keepPick);
  /* Mirror pick into draft */
  S._sugDraft.forEach(function(s){
    var p=S._sugPick[s.day];
    if(p==="__skip__"){s.skip=true;s.pick=null;}
    else if(p){s.skip=false;s.pick=p;}
  });
  var host=document.getElementById("sugbody");if(!host)return;
  if(!S._sugDraft.length){
    host.innerHTML="<p class=note>Geen vrije avonden met eten thuis, of alles botst met dieet. Kies handmatig op het bord, of stel zelf samen.</p>"+
      "<button class='btn g full' id=sugcustomopen type=button style=margin-top:8px>Zelf samenstellen</button>"+
      "<button class='btn w full' id=suggo type=button style=margin-top:8px>Naar bord</button>";
    return;
  }
  var html="<p class=note>Per avond: kies uit echte recepten (foto + naam), sla over, of stel zelf samen. Alleen aangevinkte avonden gaan op het bord.</p>";
  html+="<div class='row sugquick'><button type=button class='chip' id=sugall>Alles</button><button type=button class='chip' id=sugnone>Geen</button><button type=button class='chip' id=sugcustomopen>Zelf samenstellen</button></div>";
  S._sugDraft.forEach(function(s,di){
    var pick=S._sugPick[s.day];
    var skipped=pick==="__skip__";
    var on=!skipped&&!!pick;
    var cookN="";
    var pool=(typeof cooksOn==="function")?cooksOn():(S.people||[]).filter(function(p){return !!p.canCook;});
    if(pool.length){
      var wkey=(function(){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+3-(d.getDay()+6)%7);var w1=new Date(d.getFullYear(),0,4);var w=1+Math.round(((d-w1)/86400000-(3-(w1.getDay()+6)%7))/7);return d.getFullYear()+"-W"+String(w).padStart(2,"0");})();
      var sl=S.weekPlans&&S.weekPlans[wkey]&&S.weekPlans[wkey][s.day];
      var hit=pool.filter(function(p){return p.id===(sl&&sl.cook);})[0]||pool[0];
      if(hit)cookN=" · kookt "+hit.name;
    }
    html+="<div class='sugday"+(skipped?" dim":"")+"' data-di="+di+">";
    html+="<div class=sugdayhd>"+
      "<label class=sugchk><input type=checkbox class=sugchkbox data-i="+di+(on?" checked":"")+" aria-label=\""+esc(DLAB[s.day])+" op het bord\"></label>"+
      "<div class=sugdaytitle><b>"+esc(DLAB[s.day])+"</b><div class=meta>"+(s.options||[]).length+" opties"+cookN+(skipped?" · overgeslagen":"")+"</div></div>"+
      "<button type=button class='chip' data-act=sugskip data-i="+di+">"+(skipped?"Terug":"Sla over")+"</button>"+
      "</div>";
    if(!skipped){
      html+="<div class=sugopts role=list>";
      (s.options||[]).forEach(function(o,oi){
        var sel=pick===o.id;
        html+="<button type=button class='card sugopt"+(sel?" on":"")+"' data-act=sugpick data-i="+di+" data-oi="+oi+" role=listitem>"+
          (o.img?"<img alt='' src='"+esc(o.img)+"' loading=lazy/>":"<div class=sugph></div>")+
          "<div class=p><b>"+esc(o.t)+"</b><div class=meta>"+esc(o.c)+" · "+(o.time||"?")+" min"+(o.why?" · "+esc(o.why):"")+(sel?" · gekozen":"")+"</div></div>"+
          "</button>";
      });
      html+="<button type=button class='card sugopt sugcustom' data-act=sugcustomday data-i="+di+">"+
        "<div class=sugph sugph-plus>+</div>"+
        "<div class=p><b>Zelf samenstellen</b><div class=meta>Naam + producten · op deze avond</div></div>"+
        "</button>";
      html+="</div>";
    }
    html+="</div>";
  });
  html+="<button class='btn g full' id=sugaccept type=button style=margin-top:8px>Gekozen op het bord</button>";
  html+="<button class='btn w full' id=sugclose2 type=button style=margin-top:8px>Nog even niet</button>";
  host.innerHTML=html;
  refreshAcceptBtn();
}

function openSuggest(forceList){
  var list;
  if(forceList&&forceList.length){
    list=normalizeSuggestList(forceList);
  }else{
    list=buildSuggestions(7);
  }
  S._sugPick={};
  panel().classList.add("on");
  drawSuggest(list);
}

function closeSuggest(){
  var el=document.getElementById("suggest");
  if(el)el.classList.remove("on");
  closeCustom();
}

function pickOption(di,oi){
  var s=S._sugDraft&&S._sugDraft[di];if(!s)return;
  var o=s.options&&s.options[oi];if(!o)return;
  s.skip=false;
  s.pick=o.id;
  S._sugPick[s.day]=o.id;
  drawSuggest(S._sugDraft,{keepPick:true});
}

function skipDay(di){
  var s=S._sugDraft&&S._sugDraft[di];if(!s)return;
  if(S._sugPick[s.day]==="__skip__"){
    s.skip=false;
    s.pick=s.pick||(s.options&&s.options[0]&&s.options[0].id)||null;
    S._sugPick[s.day]=s.pick;
  }else{
    s.skip=true;
    S._sugPick[s.day]="__skip__";
  }
  drawSuggest(S._sugDraft,{keepPick:true});
}

function acceptSelected(){
  var list=selectedList();
  if(!list.length){
    if(typeof toast==="function")toast("Kies minstens één avond");
    return;
  }
  S._skipAb=true; /* Slim-bulk: geen A/B-popup per avond */
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
  S._skipAb=false;
  closeSuggest();
  if(typeof drawBord==="function")drawBord();
  if(typeof drawList==="function")drawList();
  if(typeof toast==="function")toast(list.length+" avond"+(list.length===1?"":"en")+" op het bord · lijst bijgewerkt");
  if(typeof show==="function")show("bord");
}

/* —— Zelf samenstellen —— */
function customPanel(){
  var el=document.getElementById("sugcustom");
  if(el)return el;
  el=document.createElement("section");
  el.className="panel";
  el.id="sugcustom";
  el.innerHTML=
    "<div class=hd><button class='btn s w' id=sugcustomback type=button>Terug</button><b>Zelf samenstellen</b></div>"+
    "<div class=sc id=sugcustombody></div>";
  (document.querySelector(".phone")||document.body).appendChild(el);
  return el;
}

function closeCustom(){
  var el=document.getElementById("sugcustom");
  if(el)el.classList.remove("on");
}

function openCustom(di){
  S._customMode="suggest";
  S._customDayIdx=(di==null||di<0)?null:di;
  var day=null;
  if(S._customDayIdx!=null&&S._sugDraft&&S._sugDraft[S._customDayIdx]){
    day=S._sugDraft[S._customDayIdx].day;
  }else if(S._sugDraft&&S._sugDraft[0]){
    day=S._sugDraft[0].day;
  }else{
    day=candidateDays(1)[0]||DAYS[todayIdx()];
  }
  S._customDraft={day:day,t:"",ing:[],q:"",img:""};
  customPanel().classList.add("on");
  drawCustom();
}

/** From Bord / Kies: compose for a fixed avond and zet direct op het bord. */
function openCustomForDay(day){
  S._customMode="bord";
  S._customDayIdx=null;
  day=day||S.day||DAYS[todayIdx()]||DAYS[0];
  S._customDraft={day:day,t:"",ing:[],q:"",img:""};
  customPanel().classList.add("on");
  drawCustom();
}

function customImgEsc(u){
  return String(u||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
}

function drawCustom(){
  var host=document.getElementById("sugcustombody");if(!host)return;
  var d=S._customDraft||{day:DAYS[0],t:"",ing:[],q:"",img:""};
  var bordMode=S._customMode==="bord";
  var days;
  if(bordMode){
    days=[d.day];
  }else{
    days=candidateDays(7);
    if(!days.length)days=DAYS.slice();
    if(days.indexOf(d.day)<0)d.day=days[0];
  }
  var html="<p class=note>Geef je diner een naam, kies producten uit de catalogus of typ vrij. Foto mag — upload of zoek. Past bij wie-eet op die avond.</p>";
  html+="<label>Avond</label><div class=row style=margin-bottom:10px>";
  days.forEach(function(day){
    html+="<button type=button class='chip "+(d.day===day?"on":"")+"' data-act=custday data-d="+day+(bordMode?" disabled":"")+">"+esc(DLAB[day]||day)+"</button>";
  });
  html+="</div>";
  html+="<label>Naam van het diner</label>";
  html+="<input id=custname type=text placeholder=\"bijv. Pasta met worst\" value=\""+esc(d.t)+"\"/>";
  html+="<label style=margin-top:10px>Foto <span class=meta>(optioneel)</span></label>";
  html+="<div class=custphoto>";
  if(d.img){
    html+="<img class=custphoto-prev id=custphprev alt='' src=\""+customImgEsc(d.img)+"\"/>";
  }else{
    html+="<div class='custphoto-prev custphoto-empty' id=custphprev>Nog geen foto</div>";
  }
  html+="<div class=row style=gap:8px;margin-bottom:8px;flex-wrap:wrap>";
  html+="<label class='btn s w' style=margin:0;cursor:pointer>Upload<input type=file id=custfile accept=\"image/*\" capture=environment style=display:none></label>";
  html+="<button type=button class='btn s w' id=custphclear"+(d.img?"":" disabled")+">Weg</button>";
  html+="</div>";
  html+="<div class=row style=gap:8px;margin-bottom:8px>";
  html+="<input id=custphq type=text placeholder=\"Zoek (pasta) of plak foto-URL\" value=\"\" style=flex:1>";
  html+="<button type=button class='btn s g' id=custphsearch>Zoek</button>";
  html+="</div>";
  html+="<div id=custphresults></div>";
  html+="</div>";
  html+="<label style=margin-top:10px>Producten</label>";
  html+="<div class=row style=gap:8px;margin-bottom:8px>";
  html+="<input id=custq type=text placeholder=\"Zoek of typ product\" value=\""+esc(d.q||"")+"\" style=flex:1>";
  html+="<button type=button class='btn s g' id=custadd>Erbij</button>";
  html+="</div>";
  html+="<div id=custchips style=margin-bottom:10px></div>";
  html+="<div id=custing style=margin-bottom:12px></div>";
  if(bordMode){
    html+="<button class='btn g full' id=custsave type=button>Zet op het bord</button>";
  }else{
    html+="<button class='btn g full' id=custsave type=button>Zet op voorstellen</button>";
  }
  html+="<button class='btn w full' id=sugcustomback2 type=button style=margin-top:8px>Terug</button>";
  host.innerHTML=html;
  refreshCustChips();
  refreshCustIng();
  var nameEl=document.getElementById("custname");
  if(nameEl){
    nameEl.addEventListener("input",function(){
      S._customDraft.t=nameEl.value;
    });
  }
  var qEl=document.getElementById("custq");
  if(qEl){
    qEl.addEventListener("input",function(){
      S._customDraft.q=qEl.value;
      refreshCustChips();
    });
  }
  var fileEl=document.getElementById("custfile");
  if(fileEl){
    fileEl.addEventListener("change",function(){
      var f=fileEl.files&&fileEl.files[0];
      if(!f)return;
      compressImageFile(f,function(dataUrl){
        if(!dataUrl){
          if(typeof toast==="function")toast("Foto lukte niet");
          return;
        }
        S._customDraft.img=dataUrl;
        drawCustom();
        if(typeof toast==="function")toast("Foto erbij");
      });
    });
  }
}

function compressImageFile(file,cb){
  if(!file||!file.type||file.type.indexOf("image/")!==0){cb(null);return;}
  var reader=new FileReader();
  reader.onerror=function(){cb(null);};
  reader.onload=function(){
    var img=new Image();
    img.onerror=function(){cb(null);};
    img.onload=function(){
      try{
        var maxSide=720;
        var w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;
        var scale=Math.min(1,maxSide/Math.max(w,h));
        var cw=Math.max(1,Math.round(w*scale)),ch=Math.max(1,Math.round(h*scale));
        var canvas=document.createElement("canvas");
        canvas.width=cw;canvas.height=ch;
        var ctx=canvas.getContext("2d");
        ctx.drawImage(img,0,0,cw,ch);
        var q=0.72,out=canvas.toDataURL("image/jpeg",q);
        /* Keep localStorage reasonable (~180KB). */
        var guard=0;
        while(out.length>180000&&q>0.4&&guard<6){
          q-=0.08;
          out=canvas.toDataURL("image/jpeg",q);
          guard++;
        }
        if(out.length>280000){
          /* Still huge: shrink further */
          canvas.width=Math.round(cw*0.7);canvas.height=Math.round(ch*0.7);
          ctx=canvas.getContext("2d");
          ctx.drawImage(img,0,0,canvas.width,canvas.height);
          out=canvas.toDataURL("image/jpeg",0.55);
        }
        cb(out);
      }catch(err){cb(null);}
    };
    img.src=reader.result;
  };
  reader.readAsDataURL(file);
}

function setCustomPhoto(url){
  if(!url)return;
  S._customDraft=S._customDraft||{day:DAYS[0],t:"",ing:[],q:"",img:""};
  S._customDraft.img=url;
  drawCustom();
  if(typeof toast==="function")toast("Foto gekozen");
}

function clearCustomPhoto(){
  if(!S._customDraft)return;
  S._customDraft.img="";
  drawCustom();
}

function looksLikeImgUrl(s){
  s=String(s||"").trim();
  if(!/^https?:\/\//i.test(s))return false;
  if(/\.(jpe?g|png|webp|gif)(\?|$)/i.test(s))return true;
  if(/images\.unsplash\.com|images\.pexels\.com|upload\.wikimedia\.org|loremflickr\.com/i.test(s))return true;
  return /^https?:\/\//i.test(s)&&s.length<500;
}

function searchCustomPhotos(){
  var qEl=document.getElementById("custphq");
  var q=((qEl&&qEl.value)||"").trim();
  var host=document.getElementById("custphresults");
  if(!host)return;
  if(!q){
    if(typeof toast==="function")toast("Typ een zoekwoord of plak een URL");
    return;
  }
  if(looksLikeImgUrl(q)){
    setCustomPhoto(q);
    return;
  }
  host.innerHTML="<p class=note>Zoeken…</p>";
  var term=q+" food dinner";
  var api="https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrsearch="+encodeURIComponent(term)+"&gsrlimit=9&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=640";
  fetch(api).then(function(r){return r.json();}).then(function(data){
    var pages=data&&data.query&&data.query.pages;
    var urls=[];
    if(pages){
      Object.keys(pages).forEach(function(k){
        var info=pages[k].imageinfo&&pages[k].imageinfo[0];
        if(!info)return;
        var mime=info.mime||"";
        if(mime&&mime.indexOf("image/")!==0)return;
        if(mime.indexOf("svg")>=0)return;
        var u=info.thumburl||info.url;
        if(u)urls.push(u);
      });
    }
    /* Fallback: free Unsplash/Pexels-style picks via loremflickr (no key). */
    if(!urls.length){
      var slug=encodeURIComponent(q.replace(/\s+/g,","));
      for(var i=0;i<6;i++){
        urls.push("https://loremflickr.com/640/480/"+slug+",food?lock="+(i+1));
      }
    }
    host.innerHTML="<div class=custph-grid>"+urls.slice(0,9).map(function(u){
      return "<button type=button data-act=custphpick data-u=\""+customImgEsc(u)+"\" title=\"Kies foto\"><img alt='' src=\""+customImgEsc(u)+"\" loading=lazy/></button>";
    }).join("")+"</div><p class=note style=margin-top:8px>Gratis stock · tik om te kiezen. Of plak een Unsplash/Pexels-URL.</p>";
  }).catch(function(){
    var slug=encodeURIComponent(q.replace(/\s+/g,","));
    var urls=[];
    for(var i=0;i<6;i++)urls.push("https://loremflickr.com/640/480/"+slug+",food?lock="+(i+11));
    host.innerHTML="<div class=custph-grid>"+urls.map(function(u){
      return "<button type=button data-act=custphpick data-u=\""+customImgEsc(u)+"\" title=\"Kies foto\"><img alt='' src=\""+customImgEsc(u)+"\" loading=lazy/></button>";
    }).join("")+"</div><p class=note style=margin-top:8px>Zoekdienst traag — tip-foto’s. Of plak een Unsplash/Pexels-URL.</p>";
  });
}

function custProductMeta(k){
  var p=null;
  if(window.WeAteProducts&&typeof WeAteProducts.get==="function")p=WeAteProducts.get(k);
  var label=(p&&p.name)||k;
  if(!p&&typeof CAT!=="undefined"&&CAT[k]){
    label=(typeof productLabel==="function")?productLabel(CAT[k]):(CAT[k].label||CAT[k].name||k);
  }
  var pack=(p&&p.pack)||(typeof CAT!=="undefined"&&CAT[k]&&CAT[k].pack)||"";
  if(!pack&&typeof CAT!=="undefined"&&CAT[k]&&CAT[k].base!=null&&CAT[k].unit){
    pack=CAT[k].base+" "+CAT[k].unit;
  }
  var img=(p&&p.img)||(typeof CAT!=="undefined"&&CAT[k]&&CAT[k].img)||"";
  var tier="";
  if(S.itemBrand&&(S.itemBrand[k]==="A"||S.itemBrand[k]==="B"))tier=S.itemBrand[k];
  else if(p&&p.brandTier)tier=p.brandTier==="huismerk"?"B":p.brandTier;
  else if(typeof CAT!=="undefined"&&CAT[k]&&CAT[k].brandTier)tier=CAT[k].brandTier;
  return {label:label,pack:pack,img:img,tier:tier,p:p};
}

function refreshCustChips(){
  var host=document.getElementById("custchips");if(!host)return;
  var q=String((S._customDraft&&S._customDraft.q)||"").trim();
  var keys=[];
  var seen={};
  function pushId(id){
    if(!id||seen[id])return;
    seen[id]=1;keys.push(id);
  }
  /* Typeahead-only: empty query → no default product list. */
  if(!q){
    host.innerHTML="<span class=note>Typ een productnaam — suggesties verschijnen terwijl je typt.</span>";
    return;
  }
  /* Prefer catalog search so variants (krieltjes ≠ aardappelen) stay distinct. */
  if(window.WeAteProducts&&typeof WeAteProducts.search==="function"){
    try{
      (WeAteProducts.search(q,16)||[]).forEach(function(p){if(p&&p.id)pushId(p.id);});
    }catch(e){}
  }
  if(!keys.length&&typeof CAT!=="undefined"){
    var ql=q.toLowerCase();
    Object.keys(CAT).filter(function(k){
      var c=CAT[k];
      var hay=((c.label||"")+" "+c.name+" "+k).toLowerCase();
      return hay.indexOf(ql)>=0;
    }).slice(0,16).forEach(pushId);
  }
  if(!keys.length){
    host.innerHTML="<span class=note>Niets gevonden. Typ verder of tik Erbij voor vrije tekst.</span>";
    return;
  }
  host.innerHTML=keys.map(function(k){
    var m=custProductMeta(k);
    var thumb=m.img
      ?("<img class='prodthumb' alt='' src='"+esc(m.img)+"' loading=lazy/>")
      :("<span class='prodthumb prodph' aria-hidden=true></span>");
    var pack=m.pack?("<span class=meta>"+esc(m.pack)+"</span>"):"";
    var tierA=m.tier==="A"?" on hard":"";
    var tierB=(m.tier==="B"||m.tier==="huismerk")?" on":"";
    var act="";
    if(typeof actieBadgeInfo==="function"){
      var info=actieBadgeInfo(m.p||{id:k,name:m.label});
      if(info&&info.stores&&info.stores.length){
        var storeLabel=info.stores.slice(0,2).join("/");
        act="<button type=button class='badge actie' data-act=gotoactie data-id='"+esc(k)+"' title='Open Actie'>in Actie · "+esc(storeLabel)+"</button>";
      }
    }
    return "<div class='prodchip' data-k='"+esc(k)+"'>"+
      "<button type=button class='prodchip-main' data-act=custcat data-k='"+esc(k)+"'>"+
        thumb+
        "<span class='prodchip-body'><b>"+esc(m.label)+"</b>"+pack+"</span>"+
      "</button>"+
      act+
      "<span class='prodchip-brands'>"+
        "<button type=button class='chip s"+tierA+"' data-act=custbrand data-k='"+esc(k)+"' data-b=A title='A-merk'>A</button>"+
        "<button type=button class='chip s"+tierB+"' data-act=custbrand data-k='"+esc(k)+"' data-b=B title='Huismerk / B'>B</button>"+
      "</span>"+
    "</div>";
  }).join("");
}

function refreshCustIng(){
  var host=document.getElementById("custing");if(!host)return;
  var ing=(S._customDraft&&S._customDraft.ing)||[];
  if(!ing.length){
    host.innerHTML="<p class=note>Nog geen producten. Tik chips of typ vrij.</p>";
    return;
  }
  host.innerHTML=ing.map(function(it,i){
    var label=it.n||it.k||"?";
    var pack="";
    var img="";
    var tier="";
    if(it.k){
      var m=custProductMeta(it.k);
      /* Always keep catalog display name (krieltjes stays krieltjes). */
      label=m.label||label;
      pack=m.pack||"";
      img=m.img||"";
      if(it.brand==="A"||it.brand==="B")tier=it.brand;
      else if(S.itemBrand&&(S.itemBrand[it.k]==="A"||S.itemBrand[it.k]==="B"))tier=S.itemBrand[it.k];
      else tier=m.tier||"";
    }
    var thumb=img
      ?("<img class='prodthumb' alt='' src='"+esc(img)+"' loading=lazy/>")
      :("<span class='prodthumb prodph' aria-hidden=true></span>");
    var metaBits=[];
    if(pack)metaBits.push(pack);
    if(tier==="A")metaBits.push("A-merk");
    else if(tier==="B"||tier==="huismerk")metaBits.push("huismerk");
    var meta=metaBits.length?("<div class=meta>"+esc(metaBits.join(" · "))+"</div>"):"";
    return "<div class='listrow custingrow'>"+thumb+
      "<div style=flex:1><b>"+esc(label)+"</b>"+meta+"</div>"+
      "<button type=button class='btn s w' data-act=custrm data-i="+i+">Weg</button></div>";
  }).join("");
}

function ensureCatFromProduct(p){
  if(!p||!p.id)return null;
  if(window.WeAteProducts&&typeof WeAteProducts.syncIntoCat==="function"){
    try{WeAteProducts.syncIntoCat();}catch(e){}
  }
  return p.id;
}

function addCustCat(k,brand){
  if(!k)return;
  if(window.WeAteProducts&&typeof WeAteProducts.get==="function"){
    var p=WeAteProducts.get(k);
    if(p)ensureCatFromProduct(p);
  }
  S._customDraft=S._customDraft||{day:DAYS[0],t:"",ing:[],q:"",img:""};
  S._customDraft.ing=S._customDraft.ing||[];
  if(S._customDraft.ing.some(function(it){return it.k===k;})){
    if(typeof toast==="function")toast("Staat er al bij");
    return;
  }
  var entry={k:k,q:1};
  var tier=brand;
  if(tier!=="A"&&tier!=="B"){
    var m=custProductMeta(k);
    if(m.tier==="A"||m.tier==="B")tier=m.tier;
  }
  if(tier==="A"||tier==="B"){
    entry.brand=tier;
    S.itemBrand=S.itemBrand||{};
    S.itemBrand[k]=tier;
  }
  S._customDraft.ing.push(entry);
  S._customDraft.q="";
  var qEl=document.getElementById("custq");
  if(qEl)qEl.value="";
  var label=custProductMeta(k).label||k;
  if(typeof toast==="function")toast(label+" erbij");
  refreshCustChips();
  refreshCustIng();
}

function setCustBrand(k,brand){
  if(!k||(brand!=="A"&&brand!=="B"))return;
  S.itemBrand=S.itemBrand||{};
  S.itemBrand[k]=brand;
  var ing=(S._customDraft&&S._customDraft.ing)||[];
  var hit=ing.filter(function(it){return it.k===k;})[0];
  if(hit){
    hit.brand=brand;
    refreshCustChips();
    refreshCustIng();
    if(typeof toast==="function")toast(brand==="A"?"A-merk":"Huismerk");
    return;
  }
  addCustCat(k,brand);
}

function addCustFree(){
  var qEl=document.getElementById("custq");
  var n=((qEl&&qEl.value)||(S._customDraft&&S._customDraft.q)||"").trim();
  if(!n){
    if(typeof toast==="function")toast("Typ een product");
    return;
  }
  S._customDraft=S._customDraft||{day:DAYS[0],t:"",ing:[],q:"",img:""};
  S._customDraft.ing=S._customDraft.ing||[];
  var hit=null;
  /* Exact catalog match first — keeps krieltjes as krieltjes, never rewrite to parent. */
  if(window.WeAteProducts&&typeof WeAteProducts.findByName==="function"){
    var cp=WeAteProducts.findByName(n);
    if(cp){
      hit=ensureCatFromProduct(cp)||cp.id;
    }else if(typeof WeAteProducts.upsert==="function"){
      var up=WeAteProducts.upsert({name:n,aisle:"Huis"});
      if(up)hit=ensureCatFromProduct(up)||up.id;
    }
  }
  if(!hit&&typeof CAT!=="undefined"){
    hit=Object.keys(CAT).find(function(k){
      var c=CAT[k];
      return (c.label||"").toLowerCase()===n.toLowerCase()||c.name.toLowerCase()===n.toLowerCase()||k.toLowerCase()===n.toLowerCase();
    })||null;
  }
  if(hit){
    addCustCat(hit);
    return;
  }
  if(S._customDraft.ing.some(function(it){return (it.n||"").toLowerCase()===n.toLowerCase();})){
    if(typeof toast==="function")toast("Staat er al bij");
    return;
  }
  S._customDraft.ing.push({n:n,q:1});
  S._customDraft.q="";
  if(qEl)qEl.value="";
  refreshCustChips();
  refreshCustIng();
}

function buildCustomRecipe(name,ing,img){
  var id="custom:"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  var rec={
    id:id,
    t:name,
    c:"Zelf",
    time:30,
    img:img||"",
    reheat:false,
    fijn:true,
    ing:ing.map(function(it){
      if(it.k){
        var row={k:it.k,q:it.q||1};
        var b=it.brand||(S.itemBrand&&S.itemBrand[it.k]);
        if(b==="A"||b==="B"){
          row.brand=b;
          S.itemBrand=S.itemBrand||{};
          S.itemBrand[it.k]=b;
        }
        return row;
      }
      return {n:it.n,q:it.q||1};
    }),
    st:["Bereid zoals jullie het thuis doen — zelf samengesteld in WeAte."],
    custom:true,
    swap:{}
  };
  return rec;
}

function customInUse(id,exceptDay){
  if(!id||!S.plan)return false;
  return DAYS.some(function(d){
    if(exceptDay&&d===exceptDay)return false;
    return S.plan[d]&&S.plan[d].id===id;
  });
}

function purgeCustomIfUnused(id){
  if(!id||String(id).indexOf("custom:")!==0)return false;
  if(customInUse(id))return false;
  if(S.customs&&S.customs[id]){
    delete S.customs[id];
    return true;
  }
  return false;
}

function saveCustom(){
  var d=S._customDraft||{};
  var name=String(d.t||"").trim();
  var nameEl=document.getElementById("custname");
  if(nameEl)name=nameEl.value.trim();
  if(!name){
    if(typeof toast==="function")toast("Geef je diner een naam");
    return;
  }
  if(!(d.ing&&d.ing.length)){
    if(typeof toast==="function")toast("Voeg minstens één product toe");
    return;
  }
  var day=d.day||candidateDays(1)[0]||DAYS[0];
  var rec=buildCustomRecipe(name,d.ing,d.img||"");
  var id=rec.id;
  S.customs=S.customs||{};
  S.customs[id]=rec;
  if(typeof save==="function")save();

  if(S._customMode==="bord"){
    var who=whoFor(day);
    var kids=(S.people||[]).filter(function(p){return p.role==="child"&&p.portion==="small";}).map(function(p){return p.id;});
    S.plan[day]={id:id,who:who,fijn:rec.fijn?kids.slice():[],leftover:false};
    if(S.eaten)delete S.eaten[day];
    if(typeof save==="function")save();
    closeCustom();
    if(typeof drawBord==="function")drawBord();
    if(typeof drawList==="function")drawList();
    if(typeof show==="function")show("bord");
    if(typeof toast==="function")toast(name+" staat op "+(DLAB[day]||day));
    return;
  }

  /* Suggest mode: ensure draft has this day */
  S._sugDraft=S._sugDraft||[];
  var entry=S._sugDraft.filter(function(s){return s.day===day;})[0];
  var opt={id:id,t:rec.t,c:rec.c,time:rec.time,img:rec.img||"",taste:0,why:"zelf samengesteld",score:-50};
  if(!entry){
    entry={day:day,options:[opt],pick:id,skip:false};
    S._sugDraft.push(entry);
    S._sugDraft=sortByWeekDay(S._sugDraft);
  }else{
    entry.options=entry.options||[];
    entry.options.unshift(opt);
    entry.pick=id;
    entry.skip=false;
  }
  S._sugPick=S._sugPick||{};
  S._sugPick[day]=id;
  closeCustom();
  panel().classList.add("on");
  drawSuggest(S._sugDraft,{keepPick:true});
  if(typeof toast==="function")toast(name+" klaar voor "+(DLAB[day]||day));
}

/** Haal custom maaltijd van deze avond; wis uit S.customs als nergens meer. */
function deleteCustomMeal(day,opts){
  opts=opts||{};
  day=day||S.day;
  var slot=S.plan&&S.plan[day];
  var id=opts.id||(slot&&slot.id)||S.look;
  if(!id||String(id).indexOf("custom:")!==0){
    if(typeof toast==="function")toast("Geen zelfgemaakte maaltijd");
    return false;
  }
  var rec=(S.customs&&S.customs[id])||(typeof recipeBy==="function"&&recipeBy(id));
  var label=(rec&&rec.t)||"deze maaltijd";
  var msg="\""+label+"\" van "+(DLAB[day]||day)+" afhalen?";
  if(!customInUse(id,day)){
    msg+=" Hij staat nergens anders — dan gooien we hem ook uit je opgeslagen maaltijden.";
  }
  if(!opts.skipConfirm&&!window.confirm(msg))return false;
  if(slot&&slot.id===id){
    S.plan[day]=null;
    if(S.eaten)delete S.eaten[day];
  }
  var purged=purgeCustomIfUnused(id);
  if(typeof save==="function")save();
  if(typeof drawBord==="function")drawBord();
  if(typeof drawList==="function")drawList();
  if(typeof show==="function")show("bord");
  if(typeof toast==="function")toast(purged?(label+" weg · ook uit opgeslagen"):(label+" van het bord"));
  return true;
}

window.openSuggest=openSuggest;
window.buildSuggestions=buildSuggestions;
window.closeSuggest=closeSuggest;
window.optionsForDay=optionsForDay;
window.normalizeSuggestList=normalizeSuggestList;
window.openCustom=openCustom;
window.openCustomForDay=openCustomForDay;
window.deleteCustomMeal=deleteCustomMeal;
window.purgeCustomIfUnused=purgeCustomIfUnused;

document.addEventListener("click",function(e){
  var t=e.target;if(t&&t.nodeType===3)t=t.parentNode;if(!t||!t.closest)return;
  function hasId(id){return t.id===id||(t.closest&&t.closest("#"+id));}
  if(hasId("sugclose")||hasId("sugclose2")){e.preventDefault();closeSuggest();return;}
  if(hasId("suggo")){e.preventDefault();closeSuggest();if(typeof show==="function")show("bord");return;}
  if(hasId("sugall")){e.preventDefault();setAllPick(true);return;}
  if(hasId("sugnone")){e.preventDefault();setAllPick(false);return;}
  if(hasId("sugaccept")){e.preventDefault();acceptSelected();return;}
  if(hasId("kiescustom")){e.preventDefault();openCustomForDay(S.day);return;}
  if(hasId("sugcustomopen")){e.preventDefault();openCustom(null);return;}
  if(hasId("sugcustomback")||hasId("sugcustomback2")){e.preventDefault();closeCustom();return;}
  if(hasId("custadd")){e.preventDefault();addCustFree();return;}
  if(hasId("custsave")){e.preventDefault();saveCustom();return;}
  if(hasId("custphclear")){e.preventDefault();clearCustomPhoto();return;}
  if(hasId("custphsearch")){e.preventDefault();searchCustomPhotos();return;}
  if(hasId("rdelcustom")){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();deleteCustomMeal(S.day,{id:S.look});return;}
  var php=t.closest&&t.closest("[data-act=custphpick]");
  if(php){e.preventDefault();setCustomPhoto(php.getAttribute("data-u"));return;}
  if(t.classList&&t.classList.contains("sugchkbox")){return;}
  if(t.closest&&t.closest("label.sugchk")){return;}
  var skip=t.closest&&t.closest("[data-act=sugskip]");
  if(skip){e.preventDefault();skipDay(+skip.getAttribute("data-i"));return;}
  var pick=t.closest&&t.closest("[data-act=sugpick]");
  if(pick){e.preventDefault();pickOption(+pick.getAttribute("data-i"),+pick.getAttribute("data-oi"));return;}
  var cday=t.closest&&t.closest("[data-act=sugcustomday]");
  if(cday){e.preventDefault();openCustom(+cday.getAttribute("data-i"));return;}
  var cd=t.closest&&t.closest("[data-act=custday]");
  if(cd){
    e.preventDefault();
    S._customDraft=S._customDraft||{t:"",ing:[],q:""};
    S._customDraft.day=cd.getAttribute("data-d");
    drawCustom();
    return;
  }
  var cbrand=t.closest&&t.closest("[data-act=custbrand]");
  if(cbrand){e.preventDefault();e.stopPropagation();setCustBrand(cbrand.getAttribute("data-k"),cbrand.getAttribute("data-b"));return;}
  var ccat=t.closest&&t.closest("[data-act=custcat]");
  if(ccat){e.preventDefault();addCustCat(ccat.getAttribute("data-k"));return;}
  var crm=t.closest&&t.closest("[data-act=custrm]");
  if(crm){
    e.preventDefault();
    var i=+crm.getAttribute("data-i");
    if(S._customDraft&&S._customDraft.ing)S._customDraft.ing.splice(i,1);
    refreshCustIng();
    return;
  }
},true);

document.addEventListener("keydown",function(e){
  if(e.key!=="Enter")return;
  var t=e.target;if(!t||!t.id)return;
  if(t.id==="custphq"){e.preventDefault();searchCustomPhotos();return;}
},true);

document.addEventListener("change",function(e){
  var t=e.target;if(!t||!t.classList||!t.classList.contains("sugchkbox"))return;
  var i=+t.getAttribute("data-i");
  var s=S._sugDraft&&S._sugDraft[i];
  if(!s)return;
  if(t.checked){
    s.skip=false;
    s.pick=s.pick||(s.options&&s.options[0]&&s.options[0].id)||null;
    S._sugPick[s.day]=s.pick;
  }else{
    s.skip=true;
    S._sugPick[s.day]="__skip__";
  }
  drawSuggest(S._sugDraft,{keepPick:true});
},true);

if(typeof show==="function"&&!show._sug){
  var _sh=show;
  show=function(id){if(id!=="bord"&&id!=="huis"){closeSuggest();closeCustom();}_sh(id);};
  show._sug=true;
}

document.addEventListener("click",function(e){
  var t=e.target;if(t&&t.nodeType===3)t=t.parentNode;
  if(!t||!t.closest)return;
  var go=t.closest("[data-act=gotoactie]");
  if(!go)return;
  /* Only handle badges inside compose typeahead. */
  if(!go.closest("#custchips")&&!go.closest("#sugcustom"))return;
  e.preventDefault();e.stopPropagation();
  if(e.stopImmediatePropagation)e.stopImmediatePropagation();
  var id=go.getAttribute("data-id");
  var p=window.WeAteProducts&&WeAteProducts.get(id);
  if(typeof openActieForProduct==="function")openActieForProduct(p||id);
},true);
})();
