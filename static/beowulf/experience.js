(() => {
  for (const target of document.querySelectorAll('[data-translation]')) {
    const text = window.beowulfTranslations[target.dataset.translation];
    const list = document.createElement('ol');list.className = 'translated-lines';
    for (const line of text.lines) {const li=document.createElement('li');li.textContent=line;list.append(li);}
    target.append(list);
  }
  for (const column of document.querySelectorAll('.text-column')) {
    const tabs = [...column.querySelectorAll('[role="tab"]')];
    function select(tab) {
      for (const item of tabs) {const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!active;}
    }
    for (const [i,tab] of tabs.entries()) {
      tab.addEventListener('click',()=>select(tab));
      tab.addEventListener('keydown',event=>{
        let next;
        if(event.key==='ArrowRight') next=tabs[(i+1)%tabs.length];
        if(event.key==='ArrowLeft') next=tabs[(i+tabs.length-1)%tabs.length];
        if(event.key==='Home') next=tabs[0];
        if(event.key==='End') next=tabs[tabs.length-1];
        if(next){event.preventDefault();select(next);next.focus();}
      });
    }
  }
  const links=[...document.querySelectorAll('.plate-nav a')];
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){for(const link of links){const active=link.hash===`#${entry.target.id}`;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}}},{rootMargin:'-25% 0px -45% 0px'});
  document.querySelectorAll('.spread').forEach(el=>observer.observe(el));

})();
