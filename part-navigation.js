(() => {
  const reader = document.getElementById('readerContent');
  if (!reader) return;

  let currentLesson = null;

  function getLessonNumber() {
    const small = reader.querySelector('.reader-top small');
    const match = small?.textContent.match(/(\d+)/);
    return match ? Number(match[1]) : null;
  }

  function openPart(index) {
    const tab = reader.querySelector(`[data-part="${index}"]`);
    if (tab) tab.click();
    const top = reader.querySelector('.reader-top');
    top?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    updateProgress(index);
  }

  function updateProgress(index) {
    const tabs = [...reader.querySelectorAll('[data-part]')];
    const total = tabs.length || 1;
    const percent = Math.round(((index + 1) / total) * 100);
    const label = reader.querySelector('.lesson-progress__top span');
    const fill = reader.querySelector('.lesson-progress__bar i');
    if (label) label.textContent = `${percent}% concluído`;
    if (fill) fill.style.width = `${percent}%`;
    if (currentLesson) localStorage.setItem(`lesson-${currentLesson}-last-part`, String(index));
  }

  function injectNavigation() {
    const tabs = [...reader.querySelectorAll('[data-part]')];
    const pages = [...reader.querySelectorAll('[data-page]')];
    if (!tabs.length || !pages.length || reader.querySelector('.lesson-progress')) return;

    currentLesson = getLessonNumber();

    const progress = document.createElement('div');
    progress.className = 'lesson-progress';
    progress.innerHTML = `
      <div class="lesson-progress__top">
        <strong>Progresso da lição</strong>
        <span>20% concluído</span>
      </div>
      <div class="lesson-progress__bar"><i></i></div>`;
    const partTabs = reader.querySelector('.part-tabs');
    partTabs?.insertAdjacentElement('afterend', progress);

    pages.forEach((page, index) => {
      const finish = document.createElement('div');
      finish.className = 'part-finish';
      const isLast = index === pages.length - 1;
      const prevLabel = index === 0 ? 'Voltar às lições' : `← ${tabs[index - 1]?.textContent.trim() || 'Anterior'}`;
      const nextLabel = isLast ? '✓ Concluir lição' : `${tabs[index + 1]?.textContent.trim() || 'Próxima'} →`;
      finish.innerHTML = `
        <div class="part-finish__message">
          <b>${isLast ? '🎉 Você chegou ao final!' : `✅ Parte ${index + 1} concluída`}</b>
          <span>${isLast ? 'Finalize para registrar esta lição.' : 'Continue sua caminhada sem voltar ao topo.'}</span>
        </div>
        <div class="part-finish__actions">
          <button class="part-prev" data-prev-part="${index - 1}">${prevLabel}</button>
          <button class="part-next" data-next-part="${index + 1}" ${isLast ? 'data-finish-lesson="true"' : ''}>${nextLabel}</button>
          <button class="part-menu" data-lesson-menu="true">☰ Menu da lição</button>
        </div>`;
      page.appendChild(finish);
    });

    const saved = currentLesson ? Number(localStorage.getItem(`lesson-${currentLesson}-last-part`) || 0) : 0;
    const initial = Number.isFinite(saved) && saved >= 0 && saved < tabs.length ? saved : 0;
    if (initial > 0) openPart(initial); else updateProgress(0);
  }

  reader.addEventListener('click', event => {
    const prev = event.target.closest('[data-prev-part]');
    if (prev) {
      const target = Number(prev.dataset.prevPart);
      if (target < 0) {
        document.querySelector('[data-go="lessons"]')?.click();
      } else {
        openPart(target);
      }
      return;
    }

    const next = event.target.closest('[data-next-part]');
    if (next) {
      if (next.dataset.finishLesson === 'true') {
        if (currentLesson) {
          localStorage.setItem(`lesson-${currentLesson}`, 'done');
          localStorage.setItem(`lesson-${currentLesson}-last-part`, '0');
        }
        const box = next.closest('.part-finish');
        box?.classList.add('part-celebration');
        next.textContent = '🏆 Lição concluída!';
        next.disabled = true;
      } else {
        openPart(Number(next.dataset.nextPart));
      }
      return;
    }

    const menu = event.target.closest('[data-lesson-menu]');
    if (menu) {
      reader.querySelector('.part-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const tab = event.target.closest('[data-part]');
    if (tab) updateProgress(Number(tab.dataset.part));
  });

  const observer = new MutationObserver(() => {
    if (reader.querySelector('.reader-top')) requestAnimationFrame(injectNavigation);
  });
  observer.observe(reader, { childList: true, subtree: true });
})();