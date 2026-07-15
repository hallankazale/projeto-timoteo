const screens = document.querySelectorAll('.screen');
const navButtons = document.querySelectorAll('.nav-btn');
const lessonViews = document.querySelectorAll('.lesson-view');
const lessonTabs = document.querySelectorAll('.lesson-tab');

function openScreen(id) {
  screens.forEach(screen => screen.classList.toggle('active', screen.id === id));
  navButtons.forEach(button => button.classList.toggle('active', button.dataset.screen === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openLesson(number) {
  lessonViews.forEach(view => view.classList.toggle('active', view.id === `lesson-${number}`));
  lessonTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.lesson === String(number)));
  openScreen('lessons-screen');
  history.replaceState(null, '', `#lesson-${number}`);
}

navButtons.forEach(button => button.addEventListener('click', () => openScreen(button.dataset.screen)));
lessonTabs.forEach(tab => tab.addEventListener('click', () => openLesson(tab.dataset.lesson)));
document.querySelectorAll('[data-open-lesson]').forEach(button => button.addEventListener('click', () => openLesson(button.dataset.openLesson)));
document.getElementById('printBtn')?.addEventListener('click', () => window.print());

const lessonHash = location.hash.match(/lesson-(\d)/)?.[1];
if (lessonHash) openLesson(lessonHash);
