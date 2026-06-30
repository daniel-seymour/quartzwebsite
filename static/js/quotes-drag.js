// ------------------------------------------------------------
// Drag‑and‑drop for quote tiles
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.quotes-list');
  if (!container) return;

  // Load saved positions (or start empty)
  const saved = JSON.parse(localStorage.getItem('quotePositions_v2') || '{}');

  // Helper to get a numeric value from computed style
  const toPx = v => parseFloat(v) || 0;

  // Randomly position each tile if no saved data
  const tiles = container.querySelectorAll('.quote-item');
  tiles.forEach(tile => {
    // Generate an ID for the tile if we don't have one
    // Let's use the quote text itself as an ID for persistence
    const pTag = tile.querySelector('p');
    let textContent = pTag ? pTag.innerText : tile.innerText;
    // Basic hash of the text content to use as ID
    let hash = 0;
    for (let i = 0; i < textContent.length; i++) {
        hash = ((hash << 5) - hash) + textContent.charCodeAt(i);
        hash |= 0;
    }
    const id = tile.dataset.id || `quote_${hash}`;
    tile.dataset.id = id;

    const rect = tile.getBoundingClientRect();
    const parentRect = container.getBoundingClientRect();

    const pos = saved[id] || {
      x: Math.random() * Math.max(100, (parentRect.width - rect.width || 300)),
      y: Math.random() * Math.max(100, (parentRect.height - rect.height || 500))
    };
    tile.style.left = `${pos.x}px`;
    tile.style.top = `${pos.y}px`;

    // ---------- drag logic ----------
    let isDragging = false;
    let startX, startY, offsetX, offsetY;

    const onMouseDown = e => {
      // Don't prevent default on touch start so we don't break scrolling entirely,
      // but do it for mouse down if needed. We'll do it for mouse down only.
      if (e.type === 'mousedown') {
        e.preventDefault();
      }
      isDragging = true;
      
      const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
      const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
      
      startX = clientX;
      startY = clientY;
      offsetX = toPx(tile.style.left);
      offsetY = toPx(tile.style.top);
      tile.style.transition = 'none';
      tile.classList.add('dragging');
      tile.style.zIndex = 1000; // bring to front
    };

    const onMouseMove = e => {
      if (!isDragging) return;
      
      const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
      const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
      
      const dx = clientX - startX;
      const dy = clientY - startY;
      let newX = offsetX + dx;
      let newY = offsetY + dy;

      // Optional: keep inside container bounds
      const curParentRect = container.getBoundingClientRect();
      const curRect = tile.getBoundingClientRect();
      newX = Math.max(0, Math.min(newX, Math.max(100, curParentRect.width - curRect.width)));
      newY = Math.max(0, Math.min(newY, Math.max(100, curParentRect.height - curRect.height)));

      tile.style.left = `${newX}px`;
      tile.style.top = `${newY}px`;
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      tile.style.transition = '';
      tile.classList.remove('dragging');
      tile.style.zIndex = '';

      // Save final position
      const finalPos = {
        x: toPx(tile.style.left),
        y: toPx(tile.style.top)
      };
      saved[id] = finalPos;
      localStorage.setItem('quotePositions_v2', JSON.stringify(saved));
    };

    tile.addEventListener('mousedown', onMouseDown);
    tile.addEventListener('touchstart', onMouseDown, { passive: false });
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onMouseMove, { passive: false });
    
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);
  });

  // Shuffle logic
  const shuffleBtn = document.getElementById('shuffle-quotes-btn');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      const parentRect = container.getBoundingClientRect();
      tiles.forEach(tile => {
        const id = tile.dataset.id;
        // Use offsetWidth/offsetHeight in case bounding client rect is mid-transition
        const rectWidth = tile.offsetWidth || 260; 
        const rectHeight = tile.offsetHeight || 150;
        
        const rot = (Math.random() - 0.5) * 20; // smaller random rotation
        
        tile.style.transition = 'all 0.3s ease-out';
        
        const newX = Math.random() * Math.max(100, (parentRect.width - rectWidth));
        const newY = Math.random() * Math.max(100, (parentRect.height - rectHeight));
        
        tile.style.left = `${newX}px`;
        tile.style.top = `${newY}px`;
        tile.style.transform = `rotate(${rot}deg)`;
        
        saved[id] = { x: newX, y: newY };
        
        setTimeout(() => {
          tile.style.transition = 'all 0.3s ease-in-out';
          tile.style.transform = 'rotate(0deg)';
        }, 300);
        
        setTimeout(() => {
          if (!tile.classList.contains('dragging')) {
            tile.style.transition = '';
            tile.style.transform = '';
          }
        }, 600);
      });
      localStorage.setItem('quotePositions_v2', JSON.stringify(saved));
    });
  }
});
