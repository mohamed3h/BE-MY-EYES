const swiper = new Swiper(".slider-wrapper", {
  loop: true,
  grabCursor: true,
  spaceBetween: 50,
  centerSlider: true,
  autoplay: {
    delay: 7000,
    disableOnInteraction: false,
  },

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

function speakCard(card) {
  const title = card.querySelector(".username, .over-text")?.innerText || "";
  const desc =
    card.querySelector(".user-profession, .card-desc")?.innerText || "";
  const text = `${title}. ${desc}`;
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  const utterance = new window.SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

function observeSliderCards() {
  const cards = document.querySelectorAll(".card.swiper-slide");
  if (!("IntersectionObserver" in window)) return;
  let lastSpoken = null;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
          if (lastSpoken !== entry.target) {
            speakCard(entry.target);
            lastSpoken = entry.target;
          }
        }
      });
    },
    { threshold: 0.7 }
  );
  cards.forEach((card) => observer.observe(card));
}

document.addEventListener("DOMContentLoaded", observeSliderCards);

// Camera activation on card click
function openCameraModal() {
  // Stop any ongoing speech
  if (window.speechSynthesis && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  // Stop the slider autoplay
  if (swiper && swiper.autoplay) {
    swiper.autoplay.stop();
  }
  const modal = document.getElementById("camera-modal");
  const video = document.getElementById("camera-video");
  modal.style.display = "flex";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100vw";
  modal.style.height = "100vh";
  modal.style.background = "rgba(0,0,0,0.98)";
  modal.style.zIndex = "9999";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.flexDirection = "column";
  video.style.maxWidth = "100vw";
  video.style.maxHeight = "100vh";
  video.style.width = "100vw";
  video.style.height = "100vh";
  video.style.borderRadius = "0";
  // Prevent background scrolling
  if (typeof disableScrolling === "function") disableScrolling();
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
        video._stream = stream;
      })
      .catch(function (err) {
        alert("Could not access the camera: " + err);
      });
  } else {
    alert("Camera not supported on this device/browser.");
  }
}

function closeCameraModal() {
  const modal = document.getElementById("camera-modal");
  const video = document.getElementById("camera-video");
  modal.style.display = "none";
  // Restore background scrolling
  if (typeof enableScrolling === "function") enableScrolling();
  // Restart the slider autoplay
  if (swiper && swiper.autoplay) {
    swiper.autoplay.start();
  }
  if (video._stream) {
    video._stream.getTracks().forEach((track) => track.stop());
    video.srcObject = null;
    video._stream = null;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".card.swiper-slide").forEach(function (card) {
    card.style.cursor = "pointer";
    card.addEventListener("click", openCameraModal);
  });
});
