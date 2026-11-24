(function(){
  // menu mobile
  var b=document.querySelector('.burger'),n=document.querySelector('.nav');
  if(b){b.addEventListener('click',function(){
    var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o);
  });}

  // orari (ora italiana)
  var H={0:[[9,0,12,30]],1:[],2:[[9,0,12,30],[15,0,18,30]],3:[[9,0,12,30],[15,0,18,30]],
         4:[[9,0,12,30],[15,0,18,30]],5:[[9,0,12,30],[15,0,18,30]],6:[[9,0,12,30],[15,0,18,30]]};
  var giorni=['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'];
  function pad(x){return (x<10?'0':'')+x}
  function roma(){
    var p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Rome',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date()),o={};
    p.forEach(function(x){o[x.type]=x.value});
    var d={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[o.weekday];
    return {d:d,m:(+o.hour%24)*60+(+o.minute)};
  }
  function stato(){
    var t=roma(),slots=H[t.d],i,s,a,c;
    for(i=0;i<slots.length;i++){
      s=slots[i];a=s[0]*60+s[1];c=s[2]*60+s[3];
      if(t.m>=a&&t.m<c) return {open:true,txt:'Aperto ora · fino alle '+s[2]+':'+pad(s[3])};
      if(t.m<a) return {open:false,txt:'Chiuso ora · riapre oggi alle '+s[0]+':'+pad(s[1])};
    }
    for(i=1;i<=7;i++){
      var dd=(t.d+i)%7;
      if(H[dd].length) return {open:false,txt:'Chiuso ora · riapre '+(i==1?'domani':giorni[dd])+' alle '+H[dd][0][0]+':'+pad(H[dd][0][1])};
    }
  }
  var st=document.querySelector('[data-status]');
  if(st){var s=stato();st.textContent=s.txt+' (orari abituali)';st.classList.add(s.open?'open':'closed');}
  var rows=document.querySelectorAll('.hours tr');
  if(rows.length===7){var map=[1,2,3,4,5,6,0],ix=map.indexOf(roma().d);if(rows[ix])rows[ix].classList.add('today');}

  // galleria
  var fil=document.querySelectorAll('.filters button'),figs=document.querySelectorAll('.grid figure');
  fil.forEach(function(f){f.addEventListener('click',function(){
    fil.forEach(function(x){x.setAttribute('aria-pressed','false')});
    f.setAttribute('aria-pressed','true');
    var c=f.dataset.f;
    figs.forEach(function(g){g.classList.toggle('hide',c!=='tutti'&&g.dataset.c!==c)});
  });});
  var hash=location.hash.replace('#','');
  if(hash){var t=document.querySelector('.filters button[data-f="'+hash+'"]');if(t)t.click();}

  var lb=document.querySelector('.lb');
  if(lb&&figs.length){
    var list=[],cur=0,im=lb.querySelector('img'),cap=lb.querySelector('p');
    function vis(){return Array.prototype.filter.call(figs,function(g){return !g.classList.contains('hide')})}
    function show(i){list=vis();cur=(i+list.length)%list.length;var s=list[cur].querySelector('img');
      im.src=s.src;im.alt=s.alt;cap.textContent=s.alt;}
    figs.forEach(function(g){g.addEventListener('click',function(){list=vis();show(list.indexOf(g));lb.classList.add('on')})});
    lb.querySelector('.x').onclick=function(){lb.classList.remove('on')};
    lb.querySelector('.p').onclick=function(e){e.stopPropagation();show(cur-1)};
    lb.querySelector('.n').onclick=function(e){e.stopPropagation();show(cur+1)};
    lb.addEventListener('click',function(e){if(e.target===lb)lb.classList.remove('on')});
    document.addEventListener('keydown',function(e){
      if(!lb.classList.contains('on'))return;
      if(e.key==='Escape')lb.classList.remove('on');
      if(e.key==='ArrowLeft')show(cur-1);
      if(e.key==='ArrowRight')show(cur+1);
    });
  }

  // modulo contatti -> client di posta
  var f=document.querySelector('form.form');
  if(f){f.addEventListener('submit',function(e){
    e.preventDefault();
    var d=new FormData(f);
    var body='Nome: '+d.get('nome')+'\nEmail: '+d.get('email')+'\n\n'+d.get('msg');
    location.href='mailto:profumidicioccolato@gmail.com?subject='+encodeURIComponent('Richiesta dal sito')+'&body='+encodeURIComponent(body);
  });}
})();

// ricerca nel sito
(function(){
  var DATA=[
    ['Home','index.html','Profumi di Cioccolato cioccolateria pasticceria artigianale Fubine Monferrato dal 2015'],
    ['Il laboratorio e la nostra storia','index.html','esperienza trentennale tecnico dolciario azienda Torino tornare a casa Fubine infanzia pasticceria 2015'],
    ['Il Bacio della Contessa','index.html','baci di dama fatti a mano farina di farro colli nostrani pasticceria secca'],
    ['Km 0: materie prime del posto','index.html','confetture vini locali nocciole colline farina di farro antica varietà di grano'],
    ['Su ordinazione: torte e preventivi','index.html','torte per tutte le occasioni informazioni preventivo chiamaci biscotti'],
    ['Galleria','prodotti.html','foto prodotti cioccolatini torte uova varie festività baci'],
    ['Cioccolatini','prodotti.html#cioccolatini','cioccolatini praline gianduiotti tavolette'],
    ['Torte','prodotti.html#torte','torte compleanno laurea nozze matrimonio crostatine frutta'],
    ['Uova di cioccolato','prodotti.html#uova','uova pasqua cioccolato decorate'],
    ['Varie (festività, baci)','prodotti.html#varie','natale festività baci di dama biscotti tavolette cuori'],
    ['Orari e contatti','contatti.html','orari apertura lunedì chiuso martedì sabato domenica telefono mail email'],
    ['Telefono e cellulare','contatti.html','0131.778.213 +39.340.489.6368 chiama numero telefono cellulare'],
    ['Scrivici (modulo di contatto)','contatti.html#scrivici','form modulo richiesta messaggio scrivere'],
    ['Dove ci trovi','dove-ci-trovi.html','indirizzo Via G. Bertoldi 46 Fubine Monferrato mappa come arrivare indicazioni'],
    ['Facebook e Instagram','index.html#social','facebook instagram social pagine seguici']
  ];
  var ov=document.querySelector('.search');if(!ov)return;
  var inp=ov.querySelector('input'),res=ov.querySelector('.search-res');
  function norm(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
  function render(q){
    q=norm(q.trim());res.innerHTML='';
    if(!q){return}
    var words=q.split(/\s+/),out=DATA.filter(function(r){var h=norm(r[0]+' '+r[2]);return words.every(function(w){return h.indexOf(w)>-1})});
    if(!out.length){res.innerHTML='<li class="search-empty">Nessun risultato. Prova con "torte", "orari" o "uova".</li>';return}
    out.forEach(function(r){var li=document.createElement('li'),a=document.createElement('a');a.href=r[1];
      a.innerHTML='<b></b><small></small>';a.firstChild.textContent=r[0];a.lastChild.textContent=r[1].split('#')[0].replace('.html','');li.appendChild(a);res.appendChild(li)});
  }
  function open(){ov.hidden=false;inp.value='';res.innerHTML='';setTimeout(function(){inp.focus()},30)}
  function close(){ov.hidden=true}
  document.querySelectorAll('.search-btn').forEach(function(b){b.addEventListener('click',open)});
  ov.querySelector('.search-x').onclick=close;
  ov.addEventListener('click',function(e){if(e.target===ov)close()});
  inp.addEventListener('input',function(){render(inp.value)});
  ov.querySelector('form').addEventListener('submit',function(e){e.preventDefault();var a=res.querySelector('a');if(a)location.href=a.getAttribute('href')});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!ov.hidden)close();if(e.key==='/'&&ov.hidden&&!/input|textarea/i.test(document.activeElement.tagName)){e.preventDefault();open()}});
})();
