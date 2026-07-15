const controls = document.querySelectorAll('[data-tab]');
const panels = document.querySelectorAll('.lesson-panel');

function openLesson(number, shouldScroll = true) {
  panels.forEach(panel => panel.classList.toggle('active', panel.id === `lesson-${number}`));
  controls.forEach(control => control.classList.toggle('active', control.dataset.tab === String(number)));
  history.replaceState(null, '', `#lesson-${number}`);
  if (shouldScroll) {
    document.querySelector('.tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

controls.forEach(control => control.addEventListener('click', () => openLesson(control.dataset.tab)));

document.querySelectorAll('[data-open]').forEach(button => {
  button.addEventListener('click', () => openLesson(button.dataset.open));
});

const initial = location.hash.match(/lesson-(\d)/)?.[1] || '1';
openLesson(initial, false);
