(function(){
  var top=document.getElementById('top'),bg=document.getElementById('burger');
  function zamknij(){top.classList.remove('open');bg.setAttribute('aria-expanded','false');bg.setAttribute('aria-label','Otwórz menu')}
  bg.addEventListener('click',function(){var o=top.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
  document.querySelectorAll('.menu a').forEach(function(a){a.addEventListener('click',zamknij)});
  var tk=false;function sc(){if(tk)return;tk=true;requestAnimationFrame(function(){top.classList.toggle('sc',window.pageYOffset>40);tk=false})}
  addEventListener('scroll',sc,{passive:true});

  var links=[].slice.call(document.querySelectorAll('.menu a[href*="#"]:not(.btn)')).filter(function(l){var u=new URL(l.href,location.href);if(u.pathname===location.pathname||(/\/index\.html$/.test(u.pathname)&&/\/$/.test(location.pathname))){l.dataset.h=u.hash;return true}return false});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.dataset.h==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    links.forEach(function(l){var t=document.querySelector(l.dataset.h);if(t)io.observe(t)});
    var st=document.getElementById('start');if(st)io.observe(st);
    var mob=document.getElementById('mob'),hb=document.querySelector('.hero .btn, .pod .btn, .pod h1');
    if(mob&&hb)new IntersectionObserver(function(es){mob.classList.toggle('widac',!es[0].isIntersecting&&es[0].boundingClientRect.top<0)},{threshold:0}).observe(hb);
  }
  /* mapy Google: po zgodzie na cookies zewnetrzne */
  function zgoda(k){var z=window.PLZ;return !!(z&&z[k])}
  function mapy(){document.querySelectorAll('.mapa[data-src]').forEach(function(m){
    if(m.dataset.ok)return;
    if(!zgoda('zew')){if(!m.querySelector('.zamiast')){m.innerHTML='<div class="zamiast"><div><p>'+(m.dataset.t||'Mapa dojazdu')+'</p><p>Mapa Google pojawi się po zgodzie na cookies zewnętrzne.</p><button type="button" class="btn">Pokaż mapę</button></div></div>';m.querySelector('button').onclick=function(){zapiszZ({zew:1,an:zgoda('an')?1:0,mk:zgoda('mk')?1:0})}}return}
    m.dataset.ok=1;m.innerHTML='';
    var wst=function(){var f=document.createElement('iframe');f.src=m.dataset.src;f.title=m.dataset.t||'Mapa';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';m.appendChild(f)};
    if('IntersectionObserver' in window){var mo=new IntersectionObserver(function(es){if(es[0].isIntersecting){wst();mo.disconnect()}},{rootMargin:'400px'});mo.observe(m)}else wst();
  })}
  var ck=document.getElementById('cookies');
  function zapiszZ(z){z.t=Date.now();window.PLZ=z;try{localStorage.setItem('pl-zgody',JSON.stringify(z))}catch(e){}if(ck)ck.hidden=true;mapy()}
  if(ck){
    var kat=ck.querySelector('.kat');
    ck.addEventListener('click',function(e){var b=e.target.closest('[data-c]');if(!b)return;var c=b.dataset.c;
      if(c==='tak')zapiszZ({zew:1,an:1,mk:1});
      else if(c==='nie')zapiszZ({zew:0,an:0,mk:0});
      else if(c==='ust'){kat.hidden=!kat.hidden;kat.querySelectorAll('[data-k]').forEach(function(i){i.checked=zgoda(i.dataset.k)})}
      else if(c==='zapisz'){var z={};kat.querySelectorAll('[data-k]').forEach(function(i){z[i.dataset.k]=i.checked?1:0});zapiszZ(z)}
    });
    document.querySelectorAll('[data-cookies-ust]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();ck.hidden=false;kat.hidden=false;kat.querySelectorAll('[data-k]').forEach(function(i){i.checked=zgoda(i.dataset.k)})})});
  }
  mapy();

  document.querySelectorAll('[data-tor]').forEach(function(tor){
    var down=false,sx=0,sl=0,moved=false;
    function step(){var k=tor.children[0];return k?k.getBoundingClientRect().width+parseFloat(getComputedStyle(tor).columnGap||0):300}
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||tor.scrollWidth<=tor.clientWidth+2)return;down=true;moved=false;sx=e.clientX;sl=tor.scrollLeft});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4){moved=true;tor.classList.add('drag')}tor.scrollLeft=sl-dx});
    addEventListener('pointerup',function(){if(!down)return;down=false;tor.classList.remove('drag');if(moved){var w=step();tor.scrollTo({left:Math.round(tor.scrollLeft/w)*w,behavior:'smooth'})}setTimeout(function(){moved=false},0)});
    tor.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    tor.addEventListener('dragstart',function(e){e.preventDefault()});
    var nav=document.querySelector('[data-nav="'+tor.id+'"]');
    if(nav){var bs=nav.querySelectorAll('button');
      bs.forEach(function(b){b.addEventListener('click',function(){tor.scrollBy({left:step()*(+b.dataset.k),behavior:'smooth'})})});
      function upd(){bs[0].disabled=tor.scrollLeft<4;bs[1].disabled=tor.scrollLeft+tor.clientWidth>=tor.scrollWidth-4;nav.hidden=tor.scrollWidth<=tor.clientWidth+2}
      tor.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);requestAnimationFrame(upd);
    }
  });

  var lb=document.getElementById('lb'),li=lb.querySelector('img'),lp=lb.querySelector('p'),cur=0,last=null,grp=[];
  function opis(b){var f=b.closest('figure'),c=f&&f.querySelector('figcaption');var img=b.querySelector('img');return c?c.innerText.replace(/\n+/g,' - '):(img?img.alt:'')}
  function pokaz(i){cur=(i+grp.length)%grp.length;var b=grp[cur];li.src=b.dataset.lb;var im=b.querySelector('img');li.alt=im?im.alt:'';lp.textContent=opis(b)+'  ('+(cur+1)+'/'+grp.length+')'}
  document.querySelectorAll('[data-lb]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();last=b;var g=b.closest('[data-grupa]');grp=[].slice.call((g||document).querySelectorAll('[data-lb]'));pokaz(grp.indexOf(b));lb.classList.add('otw');document.body.style.overflow='hidden';lb.querySelector('.x').focus()})});
  function zam(){lb.classList.remove('otw');document.body.style.overflow='';li.removeAttribute('src');if(last)last.focus()}
  lb.querySelector('.x').addEventListener('click',zam);
  lb.querySelector('.p').addEventListener('click',function(){pokaz(cur-1)});
  lb.querySelector('.n').addEventListener('click',function(){pokaz(cur+1)});
  lb.addEventListener('click',function(e){if(e.target===lb)zam()});
  var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)pokaz(cur+(d<0?1:-1))});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){if(lb.classList.contains('otw'))zam();else zamknij()}
    if(!lb.classList.contains('otw'))return;
    if(e.key==='ArrowRight')pokaz(cur+1);if(e.key==='ArrowLeft')pokaz(cur-1);
  });

  document.querySelectorAll('form.js-form').forEach(function(f){var msg=f.querySelector('.msg');
    f.addEventListener('submit',function(e){e.preventDefault();var ok=true;[].forEach.call(f.querySelectorAll('[required]'),function(i){var v=i.type==='checkbox'?(i.checked?'1':''):i.value.trim();var bad=!v||(i.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v));i.setAttribute('aria-invalid',bad);if(bad&&ok){ok=false;i.focus()}});if(!ok)return;msg.hidden=false;msg.focus();f.reset()})});
  var r=document.getElementById('rok');if(r)r.textContent=new Date().getFullYear();
})();
