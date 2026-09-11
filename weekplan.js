(function(){
if(window._weekplan)return;window._weekplan=1;
var DAYS=window.DAYS||["Ma","Di","Wo","Do","Vr","Za","Zo"];
var DLAB={Ma:"Maandag",Di:"Dinsdag",Wo:"Woensdag",Do:"Donderdag",Vr:"Vrijdag",Za:"Zaterdag",Zo:"Zondag"};
var MODES=[{id:"eat",n:"Thuis"},{id:"later",n:"Later"},{id:"apart",n:"Anders"},{id:"skip",n:"Weg"}];
function isoWeek(){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+3-(d.getDay()+6)%7);var w1=new Date(d.getFullYear(),0,4);var w=1+Math.round(((d-w1)/86400000-(3-(w1.getDay()+6)%7))/7);return d.getFullYear()+"-W"+String(w).padStart(2,"0");}
function todayDow(){return DAYS[(new Date().getDay()+6)%7];}
function ensure(){if(typeof S==="undefined")return;S.planRemind=S.planRemind||"Zo";S.weekPlans=S.weekPlans||{};}
function cookPool(){if(typeof cooksOn==="function")return cooksOn();return (S.people||[]).filter(function(p){return !!p.canCook;});}
function defaultCookId(){var c=cookPool();if(c.length)return c[0].id;return (S.people&&S.people[0]&&S.people[0].id)||1;}
function resolveCook(id){var c=cookPool();if(!c.length)return id||1;if(c.some(function(p){return p.id===id;}))return id;return c[0].id;}
function weekKey(){return isoWeek();}
function personDayMode(p,d){if(p.sched&&p.sched[d])return p.sched[d];return (p.role==="guest"||p.temp)?"skip":"eat";}
function getWeek(){ensure();var k=weekKey();if(!S.weekPlans[k]){var w={};DAYS.forEach(function(d){var who={};(S.people||[]).forEach(function(p){who[p.id]=personDayMode(p,d);});w[d]={who:who,cook:defaultCookId(),guests:0};});S.weekPlans[k]=w;}return S.weekPlans[k];}
function slot(day){var w=getWeek();return w[day]||(w[day]={who:{},cook:defaultCookId(),guests:0});}
function guestsOf(day){var s=S.weekPlans&&S.weekPlans[weekKey()]&&S.weekPlans[weekKey()][day];return s&&+s.guests||0;}
function filled(){var w=S.weekPlans&&S.weekPlans[weekKey()];return !!(w&&w._done);}
function boardMealCount(){
  var n=0;
  if(!S.plan)return 0;
  DAYS.forEach(function(d){if(S.plan[d]&&S.plan[d].id)n++;});
  return n;
}
function panel(){var el=document.getElementById("weekplan");if(el)return el;el=document.createElement("section");el.className="panel";el.id="weekplan";el.innerHTML="<div class=hd><button class='btn s w' id=wpclose>Later</button><b>Weekplanning</b></div><div class=sc id=wpbody></div>";(document.querySelector(".phone")||document.body).appendChild(el);return el;}
function drawPlan(){ensure();var w=getWeek();var host=document.getElementById("wpbody");if(!host)return;var html="<p class=note>Deze week. Per dag wie thuis / later / anders / weg, wie kookt, visite. Tijdelijke koks (visite) kun je hierboven kiezen om te koken — ze eten niet standaard de hele week mee.</p>";DAYS.forEach(function(d){var sl=w[d]||{who:{},cook:1,guests:0};
html+="<div class=sec style=margin-top:16px>"+DLAB[d]+"</div>";
var cooks=cookPool();sl.cook=resolveCook(sl.cook);
html+="<div class=meta style=margin:4px 0 8px>Kookt</div><div class=row>";
if(!cooks.length){html+="<span class=note>Niemand gemarkeerd als kok — zet dat in Huis.</span>";}
else{cooks.forEach(function(p){html+="<button class='chip "+(sl.cook===p.id?"on":"")+"' data-act=wpcook data-d="+d+" data-id="+p.id+">"+p.name+"</button>";});}
html+="</div><div class=meta style=margin:8px 0 6px>Wie eet</div>";
(S.people||[]).filter(function(p){return p.role!=="guest"&&!p.temp;}).forEach(function(p){var m=sl.who[p.id]||personDayMode(p,d);html+="<div style='display:flex;align-items:center;gap:8px;margin:0 0 8px'><b style=min-width:64px>"+p.name+"</b><div class=row>";MODES.forEach(function(md){html+="<button class='chip "+(m===md.id?"on":"")+"' data-act=wpmode data-d="+d+" data-id="+p.id+" data-m="+md.id+">"+md.n+"</button>";});html+="</div></div>";});
html+="<label>Visite (extra eters)</label><input type=number min=0 max=12 value="+(sl.guests||0)+" data-act=wpguests data-d="+d+">";});
html+="<button class='btn g full' id=wpsave style=margin-top:16px>Planning zetten</button>";
host.innerHTML=html;}
function openPlan(){panel().classList.add("on");drawPlan();}
function closePlan(){var el=document.getElementById("weekplan");if(el)el.classList.remove("on");}
/* Hierarchy: fully empty bord → one strong primary (weekplan OR voorstellen).
   Day rows stay, visually secondary. Banner hides once ≥1 meal is on the bord. */
function banner(){
  var sc=document.querySelector("#bord .sc");if(!sc)return;
  var old=document.getElementById("wpbanner");if(old)old.remove();
  var meals=boardMealCount();
  var daysHost=document.getElementById("days");
  if(daysHost){
    if(meals===0)daysHost.classList.add("bord-secondary");
    else daysHost.classList.remove("bord-secondary");
  }
  if(meals>0)return;
  var card=document.createElement("div");
  card.id="wpbanner";
  card.className="primary-cta";
  if(!filled()){
    card.innerHTML="<b>Begin met de weekplanning</b><p class=note style=margin:6px 0 12px>Wie eet wanneer? Daarna zetten we 3–5 avonden voor je klaar.</p><button type=button class='btn g full' id=wpprimary>Weekplanning maken</button>";
  }else{
    card.innerHTML="<b>Avonden voorstellen</b><p class=note style=margin:6px 0 12px>Planning staat. Kies 3–5 diners die passen bij wie thuis is.</p><button type=button class='btn g full' id=wpprimary>Voorstellen tonen</button>";
  }
  sc.insertBefore(card,sc.firstChild);
  if(daysHost){
    daysHost.querySelectorAll(".dayrow").forEach(function(row){
      if(row.querySelector("[data-act=gegeten]"))return;
      var meta=row.querySelector(".meta");
      if(meta)meta.textContent="of kies zelf";
    });
  }
}
function huisRemind(){var sc=document.querySelector("#huis .sc");if(!sc||document.getElementById("planremind"))return;ensure();var box=document.createElement("div");box.id="planremindbox";box.innerHTML="<div class=sec>Weekplanning-herinnering</div><p class=note>Op deze dag krijg je de ronde: wie thuis, later, anders of weg.</p><div class=row id=planremind></div><button class='btn w full' id=wpopen style=margin-top:10px>Weekplanning deze week</button>";var always=document.getElementById("always");if(always&&always.parentNode)always.parentNode.insertBefore(box,always);else sc.appendChild(box);var row=document.getElementById("planremind");if(row)row.innerHTML=DAYS.map(function(d){return "<button class='chip "+(S.planRemind===d?"on":"")+"' data-act=wpremind data-d="+d+">"+d+"</button>";}).join("");}
function afterPlanSaved(){
  closePlan();
  if(typeof drawBord==="function")drawBord();
  if(typeof toast==="function")toast("Weekplanning staat");
  if(typeof openSuggest==="function")setTimeout(function(){openSuggest();},80);
}
if(typeof modeOf==="function"&&!modeOf._wp){var _m=modeOf;modeOf=function(day,p){ensure();var w=S.weekPlans&&S.weekPlans[weekKey()];if(w&&w[day]&&w[day].who&&w[day].who[p.id])return w[day].who[p.id];return _m(day,p);};modeOf._wp=true;}
if(typeof drawBord==="function"&&!drawBord._wp){var _db=drawBord;drawBord=function(){_db();banner();};drawBord._wp=true;}
if(typeof drawHuis==="function"&&!drawHuis._wp){var _dh=drawHuis;drawHuis=function(){_dh();huisRemind();};drawHuis._wp=true;}
if(typeof eatersOn==="function"&&!eatersOn._wp){var _eo=eatersOn;eatersOn=function(day){var list=_eo(day).filter(function(p){return typeof p.id==="number";});var g=guestsOf(day);for(var i=0;i<g;i++)list.push({id:1000+i,name:"Visite",role:"adult",portion:"normal",diet:[],vetoes:[]});return list;};eatersOn._wp=true;}
if(typeof show==="function"&&!show._wp){var _sh=show;show=function(id){if(id!=="huis"&&id!=="bord")closePlan();_sh(id);};show._wp=true;}
document.addEventListener("click",function(e){if(e.target&&e.target.dataset&&e.target.dataset.go)closePlan();if(e.target&&e.target.id==="wpclose"){ensure();getWeek()._later=1;if(typeof save==="function")save();closePlan();return;}if(e.target&&e.target.id==="wpsave"){ensure();getWeek()._done=1;if(typeof save==="function")save();afterPlanSaved();return;}if(e.target&&e.target.id==="wpprimary"){e.preventDefault();if(!filled())openPlan();else if(typeof openSuggest==="function")openSuggest();else openPlan();return;}if(e.target&&e.target.id==="wpopen"){e.preventDefault();openPlan();return;}var t=e.target.closest&&e.target.closest("[data-act]");if(!t)return;var act=t.getAttribute("data-act");if(act==="wpremind"){ensure();S.planRemind=t.getAttribute("data-d");if(typeof save==="function")save();huisRemind();var row=document.getElementById("planremind");if(row)row.querySelectorAll(".chip").forEach(function(c){c.classList.toggle("on",c.getAttribute("data-d")===S.planRemind);});return;}if(act==="wpcook"){var cid=+t.getAttribute("data-id");if(!cookPool().some(function(p){return p.id===cid;}))return;slot(t.getAttribute("data-d")).cook=cid;if(typeof save==="function")save();drawPlan();e.stopPropagation();return;}if(act==="wpmode"){slot(t.getAttribute("data-d")).who[+t.getAttribute("data-id")]=t.getAttribute("data-m");drawPlan();e.stopPropagation();return;}},true);
document.addEventListener("change",function(e){var t=e.target;if(t&&t.getAttribute("data-act")==="wpguests"){var n=+t.value||0;if(n<0)n=0;if(n>12)n=12;slot(t.getAttribute("data-d")).guests=n;}});
ensure();
})();
