import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import 'swiper/swiper-bundle.css';
import './styles/carousel.css';
import Typed from "typed.js";

// Homepage carousel
Swiper.use([Autoplay]);

const swiper = new Swiper('.swiper', {
  loop: true,
  spaceBetween: 30,
  allowTouchMove: false,
  speed: 2000,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  },
  breakpoints: {
    // when window width is >= 0px
    0: {
        slidesPerView: 2,
    },
    // when window width is >= 601px
    601: {
        slidesPerView: 3,
    },
    // when window width is >= 1440px
    1440: {
        slidesPerView: 4,
    }
  }
});

// Mobile header
const hamburger = document.querySelector(".hamburger-menu");
const mainNav = document.querySelector(".main-nav");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  mainNav.classList.toggle("active");
});

// Homepage text marquee
import Typed from 'typed.js';

const typed = new Typed('#typed-text', {
  strings: ['SEO', 'Performance', 'Conversion', 'Mobile UX'],
  typeSpeed: 90,
  backSpeed: 40,
  backDelay: 1500,
  loop: true,
  showCursor: false,
});

const pauseIconUrl = new URL('./images/homepage/pause-button.svg', import.meta.url);
const playIconUrl = new URL('./images/homepage/play-button.svg', import.meta.url);

const toggleButton = document.getElementById('toggle-typed');
const toggleImage = toggleButton.querySelector('img');

let isPaused = false;

toggleButton.addEventListener('click', () => {
  if (isPaused) {
    typed.start();
    isPaused = false;
    toggleImage.src = pauseIconUrl;
    toggleImage.alt = 'Pause typed text';
  } else {
    typed.stop();
    isPaused = true;
    toggleImage.src = playIconUrl;
    toggleImage.alt = 'Play typed text';
  }
});