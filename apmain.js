const swiper = new Swiper(".slider-wrapper", {
  loop: true,
  grabCursor: true,
  spaceBetween: 50,
  centerSlider: true,
  autoplay: true,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  // Responsive
  breakpoints: {
    1024: {
      slidesPerView: 1,
    },
  },
});
