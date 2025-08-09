document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('carousel');
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector('.prev');
  const nextBtn = carousel.querySelector('.next');
  const dotsNav = carousel.querySelector('#carousel-dots');

  let slideIndex = 0;
  const intervalMs = 3000;

  let autoSlideTimer = null; // setInterval id
  let resumeTimer = null;    // setTimeout id after manual action

  // build dots
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
    if (idx === 0) dot.classList.add('active');
    dotsNav.appendChild(dot);
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetAutoSlide();
    });
  });
  const dots = Array.from(dotsNav.children);

  function updateDots() {
    dots.forEach(d => d.classList.remove('active'));
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
  }

  function goToSlide(index) {
    // safe modulo for negative
    slideIndex = ((index % slides.length) + slides.length) % slides.length;
    track.style.transform = `translateX(-${slideIndex * 100}%)`;
    updateDots();
  }

  function nextSlide() { goToSlide(slideIndex + 1); }
  function prevSlide() { goToSlide(slideIndex - 1); }

  function startAutoSlide() {
    stopAutoSlide(); // ensure single interval
    autoSlideTimer = setInterval(nextSlide, intervalMs);
  }

  function stopAutoSlide() {
    if (autoSlideTimer !== null) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
    if (resumeTimer !== null) {
      clearTimeout(resumeTimer);
      resumeTimer = null;
    }
  }

  function resetAutoSlide() {
    // stop immediate auto slide and restart after one interval to give user time to view manual change
    stopAutoSlide();
    resumeTimer = setTimeout(() => {
      startAutoSlide();
    }, intervalMs);
  }

  // button handlers (manual navigation)
  nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
  prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

  // Pause on hover and resume on leave — works reliably for mouse and keyboard focus
  carousel.addEventListener('mouseenter', stopAutoSlide);
  carousel.addEventListener('mouseleave', startAutoSlide);
  carousel.addEventListener('focusin', stopAutoSlide);  // keyboard focus
  carousel.addEventListener('focusout', startAutoSlide);

  // Touch support: pause on touchstart, resume on touchend
  carousel.addEventListener('touchstart', () => { stopAutoSlide(); }, { passive: true });
  carousel.addEventListener('touchend', () => { startAutoSlide(); });

  // Pause autoplay when the tab is hidden to save resources, resume when visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoSlide(); else startAutoSlide();
  });

  // Keyboard navigation (left/right)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prevSlide(); resetAutoSlide(); }
    if (e.key === 'ArrowRight') { nextSlide(); resetAutoSlide(); }
  });

  // init
  goToSlide(0);
  startAutoSlide();
});
