(function(){
  var KEY='plantaris-koszyk',k=[];
  try{k=JSON.parse(localStorage.getItem(KEY)||'[]')||[]}catch(e){k=[]}
  function zapisz(){try{localStorage.setItem(KEY,JSON.stringify(k))}catch(e){}}
  function zl(n){return n.toLocaleString('pl-PL')+' zł'}
  function ile(){return k.reduce(function(a,p){return a+p.il},0)}
  function razem(){return k.reduce(function(a,p){return a+p.il*p.cena},0)}
  function $(s,r){return (r||document).querySelector(s)}
  function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}

  function odswiez(){
    var n=ile();
    $$('[data-ile]').forEach(function(b){b.textContent=n;b.hidden=!n});
    var kp=$('#koszyk');if(!kp)return;
    var ul=$('[data-lista]',kp);ul.innerHTML='';
    k.forEach(function(p){
      var li=document.createElement('li');
      li.innerHTML='<b></b><span class="cn"></span><span class="il"><button type="button" data-m aria-label="Mniej">-</button><span></span><button type="button" data-p aria-label="Więcej">+</button></span><button type="button" class="usun">usuń</button>';
      li.children[0].textContent=p.nazwa;li.children[1].textContent=zl(p.cena*p.il);
      $('.il span',li).textContent=p.il+' szt.';
      $('[data-m]',li).onclick=function(){p.il--;if(p.il<1)k.splice(k.indexOf(p),1);zapisz();odswiez()};
      $('[data-p]',li).onclick=function(){p.il++;zapisz();odswiez()};
      $('.usun',li).onclick=function(){k.splice(k.indexOf(p),1);zapisz();odswiez()};
      ul.appendChild(li);
    });
    $('[data-pusty]',kp).hidden=!!n;
    $('[data-suma]',kp).hidden=!n;
    $('[data-razem]',kp).textContent=zl(razem());
    var f=$('#zam');if(f)f.hidden=!n;
    if(n)$('[data-ok]',kp).hidden=true;
    var m=$('[data-kosz-m]');if(m){m.hidden=!n;$('[data-ile-m]').textContent=n;$('[data-razem-m]').textContent=zl(razem())}
  }

  $$('[data-dodaj]').forEach(function(b){
    var pr=b.closest('[data-id]'),t0=b.textContent;
    b.addEventListener('click',function(){
      var id=pr.dataset.id,nazwa=pr.dataset.nazwa,cena=+pr.dataset.cena,z=pr.querySelector('[data-cena-z]');
      if(z){cena=Math.max(0,parseInt(z.value,10)||0);if(!cena){z.setAttribute('aria-invalid','true');z.focus();return}z.removeAttribute('aria-invalid');
        var opis=z.tagName==='SELECT'?z.options[z.selectedIndex].text.replace(/ - [^-]*$/,''):cena+' zł';nazwa=nazwa+': '+opis;id=id+'-'+(z.tagName==='SELECT'?z.selectedIndex:cena)}
      var p=k.filter(function(x){return x.id===id})[0];
      if(p)p.il++;else k.push({id:id,nazwa:nazwa,cena:cena,il:1});
      zapisz();odswiez();b.textContent='Dodano';setTimeout(function(){b.textContent=t0},1400);
    });
  });

  // filtry: sklep i szkolenia
  $$('.tryb').forEach(function(g){
    var bs=$$('button',g),attr=bs[0].dataset.filtr!==undefined?'filtr':'tryb';
    bs.forEach(function(b){b.addEventListener('click',function(){
      var v=b.dataset[attr];bs.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
      $$(attr==='filtr'?'.prod-lista [data-rodzaj]':'.szk').forEach(function(el){el.hidden=!(v==='wszystkie'||el.dataset.rodzaj===v)});
    })});
  });

  // szkolenia: wybor szkolenia w formularzu
  var sel=$('#szk-wybor');
  $$('[data-szk]').forEach(function(a){a.addEventListener('click',function(){if(sel)sel.value=a.dataset.szk})});

  var f=$('#zam');
  if(f){
    var fv=$('[data-fv]',f),nip=$('[data-nip]',f);
    fv.addEventListener('change',function(){nip.hidden=!fv.checked});
    f.addEventListener('submit',function(e){
      e.preventDefault();var ok=true;
      $$('[required]',f).forEach(function(i){var v=i.type==='checkbox'?(i.checked?'1':''):i.value.trim();var bad=!v||(i.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v));i.setAttribute('aria-invalid',bad);if(bad&&ok){ok=false;i.focus()}});
      if(!ok)return;
      var d=new Date(),nr='PL/'+String(d.getMonth()+1).padStart(2,'0')+'/'+String(Math.floor(Math.random()*900)+100);
      var o=$('[data-ok]');$('[data-nr]',o).textContent=nr;$('[data-kw]',o).textContent=zl(razem());$('[data-em]',o).textContent=f.email.value.trim();
      k=[];zapisz();f.reset();nip.hidden=true;odswiez();$("[data-pusty]").hidden=true;o.hidden=false;o.focus();
    });
  }
  odswiez();
})();
