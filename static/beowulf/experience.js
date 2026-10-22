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
  const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const intro = document.querySelector('.story-intro');
  if (intro && motionPreference && !motionPreference.matches) {
    const sentences = [...intro.querySelectorAll('.intro-sentence')];
    const text = intro.querySelector('.story-intro-text');
    intro.classList.add('scroll-intro');
    intro.style.setProperty('--sentence-count', sentences.length);
    sentences.forEach(sentence => sentence.classList.add('sentence-reveal'));
    let frame = null;
    function revealSentences() {
      frame = null;
      const distance = Math.max(0, -intro.getBoundingClientRect().top);
      const travel = Math.max(1, intro.offsetHeight - text.offsetHeight);
      const count = Math.min(sentences.length, Math.ceil(distance / (travel / sentences.length)));
      sentences.slice(0, count).forEach(sentence => sentence.classList.add('sentence-visible'));
    }
    function scheduleReveal() {
      if (frame === null) frame = requestAnimationFrame(revealSentences);
    }
    window.addEventListener('scroll', scheduleReveal, { passive: true });
    window.addEventListener('resize', scheduleReveal);
    revealSentences();
    motionPreference.addEventListener('change', event => {
      if (event.matches) {
        window.removeEventListener('scroll', scheduleReveal);
        window.removeEventListener('resize', scheduleReveal);
        if (frame !== null) cancelAnimationFrame(frame);
        intro.classList.remove('scroll-intro');
        sentences.forEach(sentence => sentence.classList.add('sentence-visible'));
      }
    });
  }
  const hero = document.querySelector('.hero-backdrop');
  if (hero && motionPreference && !motionPreference.matches) {
    // Reveal regions of the existing composite, preserving its frames and layout.
    const picture = hero.querySelector('.hero-picture');
    const track = document.createElement('div');
    track.className = 'hero-art-scroll';
    hero.before(track);
    track.append(hero);
    const layers = document.createElement('div');
    layers.className = 'hero-art-layers';
    picture.before(layers);
    layers.append(picture);
    const columns = [0, 29.2, 50, 70.8, 100];
    const tiles = Array.from({ length: 8 }, (_, index) => {
      const tile = picture.cloneNode(true);
      tile.className = 'hero-tile';
      tile.setAttribute('aria-hidden', 'true');
      tile.querySelector('img').alt = '';
      const column = index % 4;
      const row = Math.floor(index / 4);
      tile.style.clipPath = `inset(${row * 50}% ${100 - columns[column + 1]}% ${(1 - row) * 50}% ${columns[column]}%)`;
      layers.append(tile);
      return tile;
    });
    let frame = null;
    function revealTiles() {
      frame = null;
      const distance = Math.max(0, -track.getBoundingClientRect().top - 24);
      const travel = Math.max(1, track.offsetHeight - hero.offsetHeight - 24);
      const count = Math.min(tiles.length, Math.ceil(distance / (travel / tiles.length)));
      tiles.slice(0, count).forEach(tile => tile.classList.add('tile-visible'));
    }
    function scheduleTiles() {
      if (frame === null) frame = requestAnimationFrame(revealTiles);
    }
    window.addEventListener('scroll', scheduleTiles, { passive: true });
    window.addEventListener('resize', scheduleTiles);
    revealTiles();
    motionPreference.addEventListener('change', event => {
      if (event.matches) {
        window.removeEventListener('scroll', scheduleTiles);
        window.removeEventListener('resize', scheduleTiles);
        if (frame !== null) cancelAnimationFrame(frame);
        track.before(hero);
        track.remove();
        layers.before(picture);
        layers.remove();
      }
    });
  }
  if (motionPreference && !motionPreference.matches) {
    const artwork = [...document.querySelectorAll('.gallery figure picture')];
    const artworkObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('artwork-visible');
          artworkObserver.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    for (const image of artwork) {
      image.classList.add('artwork-reveal');
      artworkObserver.observe(image);
    }
    motionPreference.addEventListener('change', event => {
      if (event.matches) {
        artworkObserver.disconnect();
        artwork.forEach(image => image.classList.add('artwork-visible'));
      }
    });
  }

  const links=[...document.querySelectorAll('.plate-nav a')];
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){for(const link of links){const active=link.hash===`#${entry.target.id}`;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}}},{rootMargin:'-25% 0px -45% 0px'});
  document.querySelectorAll('.spread').forEach(el=>observer.observe(el));

})();
