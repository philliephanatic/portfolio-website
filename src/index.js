import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import 'swiper/swiper-bundle.css';
import './styles/carousel.css';

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