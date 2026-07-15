(() => {
  const LABELS = ['Parte 1', 'Parte 2', 'Parte 3', 'Parte 4', 'Avaliação'];

  function openPart(index) {
    const tabs = [...document.querySelectorAll('[data-part]')];
    const pages = [...document.querySelectorAll('[data-page]')];
    if (!pages.length) return;
    const safeIndex = Math.max(0, Math.min(index, pages.length - 1));

    tabs.forEach((tab, i) => tab.classList.toggle('active', i === safeIndex));
    pages.forEach((page, i) => page.classList.toggle('active', i === safeIndex));

    const reader = document.querySelector('.lesson-reader');
    const lessonNumber = reader?.querySelector('.reader-top small')?.textContent?.match(/\d+/)?.[0] || '0';
    localStorage.setItem(`lesson-${lessonNumber}-part`, String(safeIndex));

    document.querySelector('.reader-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    updateProgress(safeIndex, pages.length);
  }

  function updateProgress(index, total) {
    const fill = document.querySelector('.lesson-progress-fill');
    const text = document.querySelector('.lesson-progress-text');
    const percent = Math.round(((index + 1) / total) * 100);
    if (fill) fill.style.width = `${percent}%`;
    if (text) text.textContent = `${percent}% concluído`;
  }

  function navHtml(index, total) {
    const isFirst = index === 0;
    const isLast = index === total - 1;
    const nextLabel = LABELS[index + 1] || 'Próxima parte';

    const mainAction = isLast
      ? '<button class="part-nav-btn primary next-main" data-finish-lesson><span>✓</span><strong>Concluir esta lição</strong></button>'
      : `<button class="part-nav-btn primary next-main" data-part-next="${index + 1}"><span>Continuar</span><strong>${nextLabel} →</strong></button>`;

    const previousAction = isFirst
      ? '<button class="part-nav-btn secondary previous-btn" disabled><span>←</span><strong>Parte anterior</strong></button>'
      : `<button class="part-nav-btn secondary previous-btn" data-part-prev="${index - 1}"><span>←</span><strong>Parte anterior</strong></button>`;

    return `<div class="part-bottom-nav">
      <div class="part-complete-note"><span>✓</span><div><strong>Parte finalizada</strong><small>Continue para avançar na lição</small></div></div>
      <div class="part-bottom-actions">
        ${mainAction}
        <div class="part-secondary-row">
          ${previousAction}
          <button class="part-nav-btn menu menu-btn" data-lesson-menu><span>☰</span><strong>Menu da lição</strong></button>
        </div>
      </div>
    </div>`;
  }

  function enhanceReader() {
    const reader = document.querySelector('#readerContent');
    const pages = [...document.querySelectorAll('[data-page]')];
    const tabs = [...document.querySelectorAll('[data-part]')];
    if (!reader || !pages.length || reader.dataset.navReady === 'true') return;
    reader.dataset.navReady = 'true';

    const top = reader.querySelector('.reader-top');
    if (top && !reader.querySelector('.lesson-progress')) {
      top.insertAdjacentHTML('beforeend', `<div class="lesson-progress"><div class="lesson-progress-head"><span>Progresso da lição</span><strong class="lesson-progress-text">20% concluído</strong></div><div class="lesson-progress-track"><i class="lesson-progress-fill"></i></div></div>`);
    }

    pages.forEach((page, index) => {
      page.querySelector('.part-bottom-nav')?.remove();
      page.insertAdjacentHTML('beforeend', navHtml(index, pages.length));
    });

    tabs.forEach((tab, index) => {
      tab.onclick = () => openPart(index);
    });

    reader.addEventListener('click', (event) => {
      const next = event.target.closest('[data-part-next]');
      const prev = event.target.closest('[data-part-prev]');
      const menu = event.target.closest('[data-lesson-menu]');
      const finish = event.target.closest('[data-finish-lesson]');

      if (next) openPart(Number(next.dataset.partNext));
      if (prev) openPart(Number(prev.dataset.partPrev));
      if (menu) document.querySelector('.part-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (finish) {
        const lessonNumber = reader.querySelector('.reader-top small')?.textContent?.match(/\d+/)?.[0] || '0';
        localStorage.setItem(`lesson-${lessonNumber}`, 'done');
        finish.innerHTML = '<span>🎉</span><strong>Lição concluída!</strong>';
        finish.disabled = true;
      }
    });

    const lessonNumber = reader.querySelector('.reader-top small')?.textContent?.match(/\d+/)?.[0] || '0';
    const saved = Number(localStorage.getItem(`lesson-${lessonNumber}-part`) || 0);
    openPart(Number.isFinite(saved) ? saved : 0);
  }

  const observer = new MutationObserver(enhanceReader);
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', enhanceReader);
})();