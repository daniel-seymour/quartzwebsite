(() => {
  const audio = document.querySelector('#reading-audio');
  const poems = [...document.querySelectorAll('.poem')];
  const poem = poems[0];
  const status = document.querySelector('#reading-status');
  const timings = window.beowulfTimings;
  if (!audio || !poem) return;

  const lines = [...poem.querySelectorAll('.poem-line')];
  const transcript = lines.flatMap(line => line.textContent.match(/\S+/gu) || []);

  // Check the transcript before exposing timestamps for highlighting or seeking.
  if (!Array.isArray(timings) || !timings.length || timings.length !== transcript.length ||
      timings.some((cue, i) => !cue || cue.word !== transcript[i] ||
        !Number.isFinite(cue.start) || !Number.isFinite(cue.end) ||
        cue.start < 0 || cue.end <= cue.start || (i > 0 && cue.start < timings[i - 1].end))) {
    if (status) status.textContent = 'You can listen to the recording, but word highlighting and text seeking are unavailable.';
    return;
  }

  function seekWord(text, index, className) {
    const word = document.createElement('button');
    word.setAttribute('type', 'button');
    word.className = `audio-word ${className}`;
    word.textContent = text;
    word.setAttribute('aria-label', `${text} — seek to ${className === 'word' ? 'this word' : 'the corresponding phrase'} in the Old English audio`);
    word.addEventListener('click', () => {
      audio.currentTime = timings[index].start;
      update();
    });
    return word;
  }

  // Copy the plain transcript first; each view needs its own button listeners.
  for (const other of poems.slice(1)) other.innerHTML = poem.innerHTML;
  for (const original of poems) {
    let wordIndex = 0;
    for (const line of original.querySelectorAll('.poem-line')) {
      const fragment = document.createDocumentFragment();
      for (const token of line.textContent.match(/\S+|\s+/gu) || []) {
        fragment.append(/^\s+$/u.test(token)
          ? document.createTextNode(token)
          : seekWord(token, wordIndex++, 'word'));
      }
      line.replaceChildren(fragment);
    }
  }
  const wordGroups = poems.map(item => [...item.querySelectorAll('.word')]);

  // Every view, including hidden tabs, shares the recording's word index.
  // Translations follow corresponding phrases because their word order differs.
  const highlights = timings.map((_, i) => wordGroups.map(group => group[i]));
  for (const target of document.querySelectorAll('[data-translation]')) {
    const chunks = window.beowulfTranslationAlignment?.[target.dataset.translation];
    const translatedLines = [...target.querySelectorAll('.translated-lines li')];
    const translatedWords = translatedLines.flatMap(line => line.textContent.match(/\S+/gu) || []);
    const alignedWords = [];
    const covered = new Set();
    const valid = Array.isArray(chunks) && chunks.length > 0 && chunks.every(chunk => {
      if (!chunk || typeof chunk.text !== 'string' || !Array.isArray(chunk.source) || chunk.source.length !== 2) return false;
      const [start, end] = chunk.source;
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end > timings.length) return false;
      const tokens = chunk.text.match(/\S+/gu);
      if (!tokens) return false;
      for (let i = start; i <= end; i++) covered.add(i);
      for (const word of tokens) alignedWords.push({ word, chunk });
      return true;
    });
    if (!valid || covered.size !== timings.length || alignedWords.length !== translatedWords.length ||
        alignedWords.some((entry, i) => entry.word !== translatedWords[i])) {
      if (status) status.textContent = 'You can listen to the recording, but highlighting and text seeking are unavailable for some translations.';
      continue;
    }

    let wordIndex = 0;
    for (const line of translatedLines) {
      const fragment = document.createDocumentFragment();
      let chunk = null;
      let phrase = '';
      function appendPhrase() {
        if (!chunk) return;
        const span = document.createElement('span');
        span.className = 'translation-phrase';
        // Translations reorder and expand words, so seek every word in a phrase
        // to its semantic source range rather than guessing by printed position.
        for (const token of phrase.trimEnd().match(/\S+|\s+/gu) || []) {
          span.append(/^\s+$/u.test(token)
            ? document.createTextNode(token)
            : seekWord(token, chunk.source[0] - 1, 'translation-word'));
        }
        fragment.append(span);
        const space = phrase.slice(phrase.trimEnd().length);
        if (space) fragment.append(document.createTextNode(space));
        for (let i = chunk.source[0] - 1; i < chunk.source[1]; i++) highlights[i].push(span);
      }
      for (const token of line.textContent.match(/\S+|\s+/gu) || []) {
        if (/^\s+$/u.test(token)) {
          if (chunk) phrase += token;
          else fragment.append(document.createTextNode(token));
          continue;
        }
        const next = alignedWords[wordIndex++].chunk;
        if (next !== chunk) {
          appendPhrase();
          chunk = next;
          phrase = '';
        }
        phrase += token;
      }
      appendPhrase();
      line.replaceChildren(fragment);
    }
  }

  let activeIndex = -1;
  let frame = null;

  function mark(index, active) {
    if (index < 0) return;
    for (const element of highlights[index]) element.classList.toggle('is-active', active);
  }

  function update() {
    const time = audio.currentTime;
    const index = audio.ended || audio.error ? -1 : timings.findIndex(cue => time >= cue.start && time < cue.end);
    if (index === activeIndex) return;
    mark(activeIndex, false);
    mark(index, true);
    activeIndex = index;
  }

  function tick() {
    update();
    frame = audio.paused || audio.ended ? null : requestAnimationFrame(tick);
  }

  function stop() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    update();
  }

  audio.addEventListener('play', () => {
    stop();
    tick();
  });
  for (const event of ['timeupdate', 'seeking', 'seeked', 'loadedmetadata', 'ratechange', 'emptied']) {
    audio.addEventListener(event, update);
  }
  audio.addEventListener('pause', stop);
  audio.addEventListener('ended', stop);
  audio.addEventListener('error', () => {
    stop();
    mark(activeIndex, false);
    activeIndex = -1;
    if (status) status.textContent = 'The recording could not be loaded. Please reload the page to try again.';
  });
  update();
  if (!audio.paused && !audio.ended) tick();
})();
