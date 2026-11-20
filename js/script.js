(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var splash=$('.fixed.inset-0.z-\\[200\\]'), started=false;

  function envSetup(){
    var wrap=$('#env-wrap'),lay=$('.eb'),card=$('#env-card'),fall=$('#fall'),bg=$('#seal-bg'),r=Math.random;
    function dot(cls,x,y,s,parent){var d=document.createElement('i');d.className=cls;
      d.style.cssText='left:'+x+'%;top:'+y+'%;width:'+s+'px;height:'+s+'px';(parent||bg).appendChild(d);return d}
    var pearls=[[2,6,16],[6.5,3,9],[1,11.5,11],[8.5,9,6],[4,14.5,7],[0,52,10],[3,55,15],[1,58.5,8],[6,53,5],
      [97,18,9],[94,21,14],[99,24.5,6],[95,84,15],[98,88,10],[92,90,8],[97,93,6],[3,90,8],[1,93.5,12]];
    pearls.forEach(function(p){dot('pearl',p[0],p[1],p[2])});
    var boxes=[[0,0,13,17],[0,46,10,22],[88,12,12,18],[86,78,14,20],[0,84,10,14],[10,36,8,6],[84,60,12,10]];
    boxes.forEach(function(b){for(var i=0;i<12;i++)dot('speck',b[0]+r()*b[2],b[1]+r()*b[3],1.5+r()*3.2).style.opacity=.3+r()*.45});
    for(var k=0;k<14;k++){var t=dot('tw',r()*96,r()*92,10,fall);t.style.animationDelay=(-r()*3.2)+'s';t.style.animationDuration=(2.4+r()*2.6)+'s'}
    window.envVars=function(){
      var W=lay.offsetWidth,H=W*368/535,cw=card.offsetWidth,ch=card.offsetHeight,s1=.5*W/cw;
      wrap.style.setProperty('--s0',(.55*H/ch).toFixed(3));wrap.style.setProperty('--s1',s1.toFixed(3));
      wrap.style.setProperty('--y1',(-.56*H+s1*ch/2).toFixed(1)+'px');
    };
    envVars();window.addEventListener('resize',function(){if(!started)envVars()});
  }

  envSetup();
  document.body.classList.add('locked');
  var hidden=$$('[style*="opacity: 0"]');
  function toast(t){var e=$('#toast');e.textContent=t;e.classList.add('on');setTimeout(function(){e.classList.remove('on')},2000)}

  function reveal(el,delay){setTimeout(function(){el.classList.add('reveal-in')},delay||0)}
  function startReveals(){
    if(!('IntersectionObserver' in window)){hidden.forEach(function(e){reveal(e)});return}
    var io=new IntersectionObserver(function(es){es.forEach(function(en){
      if(en.isIntersecting){reveal(en.target,0);io.unobserve(en.target)}})},{threshold:.12});
    var hero=$('section.min-h-screen'), n=0;
    hidden.forEach(function(e){
      if(hero&&hero.contains(e)){reveal(e,300+(n++)*250);return}
      io.observe(e)});
  }
  var timers=[],finished=false;
  function T(fn,ms){timers.push(setTimeout(fn,ms))}
  function finishNow(){
    if(finished)return;finished=true;timers.forEach(clearTimeout);
    splash.classList.add('splash-out');document.body.classList.remove('locked');startReveals();
    setTimeout(function(){splash.style.display='none'},1300);
  }
  // música de fondo (arranca al tocar el lazo, que cuenta como interacción del usuario)
  var audio=$('#musica'), mbtn=$('#music-btn'), wantPlay=true;
  function setMusicUI(){mbtn.classList.toggle('muted',audio.paused);mbtn.setAttribute('aria-pressed',String(!audio.paused));mbtn.setAttribute('aria-label',audio.paused?'Activar música':'Pausar música')}
  function startMusic(){audio.volume=.7;var p=audio.play();if(p&&p.catch)p.catch(function(){});mbtn.classList.add('on');setMusicUI()}
  mbtn.addEventListener('click',function(){wantPlay=!audio.paused?false:true;if(audio.paused){audio.play()}else{audio.pause()}setMusicUI()});
  audio.addEventListener('play',setMusicUI);audio.addEventListener('pause',setMusicUI);
  // pausar si la pestaña queda en segundo plano y retomar al volver
  document.addEventListener('visibilitychange',function(){if(!started)return;if(document.hidden){audio.dataset.was=audio.paused?'0':'1';audio.pause()}else if(audio.dataset.was==='1'){audio.play().catch(function(){})}});
  function openInvitation(){
    if(started){if(!finished)finishNow();return}
    started=true;envVars();startMusic();
    splash.classList.add('untie');
    T(function(){splash.classList.add('opening')},1250);
    T(function(){splash.classList.add('rise')},2500);
    T(function(){splash.classList.add('show')},4300);
    T(finishNow,7700);
  }
  splash.addEventListener('click',openInvitation);

  // scroll cue
  var cue=$('section.min-h-screen button');
  if(cue)cue.addEventListener('click',function(){var n=$('section.min-h-screen').nextElementSibling;if(n)n.scrollIntoView({behavior:'smooth'})});
  var arrow=cue&&cue.nextElementSibling;
  if(arrow)arrow.addEventListener('click',function(){cue.click()});

  // countdown (domingo 20/12/2026 22:00, hora Argentina)
  var target=new Date('2026-12-20T22:00:00-03:00').getTime();
  var nums=$$('#cuenta-regresiva .guada-card span.font-serif');
  function tick(){
    var d=Math.max(0,target-Date.now()),s=Math.floor(d/1000);
    var v=[Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60];
    nums.forEach(function(e,i){if(v[i]!==undefined)e.textContent=v[i]});
  }
  tick();setInterval(tick,1000);

  // carousels
  $$('section.py-8.overflow-hidden').forEach(function(sec){
    var i=0,track=$('.flex.items-center',sec), dots=$$('button[aria-label^="Ir a la foto"]',sec);
    if(!track||!dots.length)return;
    track.classList.add('slides-track');track.style.alignItems='flex-start';
    var vp=track.parentNode,slides=Array.prototype.slice.call(track.children);
    var n=dots.length,timer;
    var on='bg-[var(--accent-cta)] scale-125', off='bg-[var(--accent-frame)]/40 hover:bg-[var(--accent-frame)]';
    function go(k){
      i=(k+n)%n;track.style.transform='translateX(calc(-'+(i*100)+'%))';
      dots.forEach(function(d,j){
        d.className='w-2.5 h-2.5 rounded-full transition-all duration-300 '+(j===i?on:off)});
    }
    function play(){clearInterval(timer);timer=setInterval(function(){go(i+1)},4500)}
    dots.forEach(function(d,j){d.addEventListener('click',function(){go(j);play()})});
    var sx=null;
    track.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
    track.addEventListener('touchend',function(e){
      if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;
      if(Math.abs(dx)>40){go(i+(dx<0?1:-1));play()}sx=null});
    go(0);play();
  });

  // copy alias
  var cb=$$('button').filter(function(b){return /Copiar alias/i.test(b.textContent)})[0];
  if(cb)cb.addEventListener('click',function(){
    var a='15deSilvia';
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(a).then(function(){toast('Alias copiado')},function(){toast(a)})}
    else toast(a);
  });

  // RSVP
  var form=$('#confirmacion form'), btns=$$('button[type="button"]',form), extra=$('.space-y-6.pt-4',form), attend=true;
  var A='p-4 rounded-2xl border-2 transition-all font-bold text-sm bg-[var(--accent-cta)] border-[var(--accent-cta)] !text-[#0A192F] shadow-lg';
  var I='p-4 rounded-2xl border-2 transition-all font-bold text-sm bg-transparent border-[var(--accent-cta)] text-[var(--text-primary)] hover:bg-[var(--accent-cta)] hover:!text-[#0A192F]';
  var sub=$('button[type="submit"]',form);
  function setAtt(v){attend=v;btns[0].className=v?A:I;btns[1].className=v?I:A;if(extra)extra.style.display=v?'':'none';if(sub)sub.textContent=v?'Confirmar Asistencia':'Avisar que no podré ir'}
  btns[0].addEventListener('click',function(){setAtt(true)});
  btns[1].addEventListener('click',function(){setAtt(false)});
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var f=function(n){var x=form.elements[n];return x?x.value.trim():''};
    var n=f('nombre'),t;
    if(attend){
      t='¡Hola! Soy '+n+' y confirmo mi asistencia a los 15 años de Silvia el domingo 20 de diciembre. ¡Nos vemos en la fiesta!';
      // if(f('sugerencia_musica'))t+=' Canción que no puede faltar: '+f('sugerencia_musica')+'.';
    }else{
      t='¡Hola! Soy '+n+'. Lamentablemente no voy a poder asistir a los 15 años de Silvia. ¡Les deseo una hermosa fiesta!';
    }
    // if(f('mensaje'))t+=' Mensaje para Silvia: '+f('mensaje');
    window.open('https://wa.me/5493863454123?text='+encodeURIComponent(t),'_blank','noopener');
    toast(attend?'¡Gracias por confirmar!':'Gracias por avisar');
  });
})();
