const categorySelect = document.querySelector('#category-select');
const categoryRail = document.querySelector('.category-links');
const categoryBar = document.querySelector('.category-bar');
const categoryLinks = Array.from(categoryRail.querySelectorAll('a'));
const sections = categoryLinks.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeId = '';
let scheduled = false;
categorySelect.addEventListener('change', () => {
  const section = document.getElementById(categorySelect.value);
  if (section) { location.hash = section.id; section.setAttribute('tabindex', '-1'); section.focus({preventScroll: true}); }
});
function setActiveCategory(id) {
  if (id === activeId) return;
  const selected = categoryLinks.find(link => link.hash.slice(1) === id);
  if (!selected) return;
  activeId = id;
  categoryLinks.forEach(link => link.removeAttribute('aria-current'));
  selected.setAttribute('aria-current', 'location');
  categorySelect.value = id;
  const rail = categoryRail.getBoundingClientRect();
  const item = selected.getBoundingClientRect();
  if (item.left < rail.left + 4 || item.right > rail.right - 4) {
    categoryRail.scrollTo({
      left: categoryRail.scrollLeft + item.left - rail.left - (rail.width - item.width) / 2,
      behavior: reducedMotion.matches ? 'instant' : 'smooth'
    });
  }
}
function updateFromScroll() {
  scheduled = false;
  const anchorOffset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const threshold = Math.max(categoryBar.getBoundingClientRect().height + 24, anchorOffset + 16);
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= threshold) current = section;
    else break;
  }
  if (current) setActiveCategory(current.id);
}
function scheduleUpdate() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(updateFromScroll);
}
window.addEventListener('scroll', scheduleUpdate, {passive: true});
window.addEventListener('resize', scheduleUpdate);
window.addEventListener('hashchange', scheduleUpdate);
window.addEventListener('load', scheduleUpdate);
updateFromScroll();
