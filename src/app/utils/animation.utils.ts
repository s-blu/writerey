import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, fadeInAnimation } from 'angular-animations';
import { trigger, transition, animate, style } from '@angular/animations';

const fadingDuration = 400;
const fadeInOptions = { duration: fadingDuration };

export const FADE_ANIMATIONS = [
  fadeInOnEnterAnimation(fadeInOptions),
  fadeOutOnLeaveAnimation(fadeInOptions),
  fadeInAnimation(fadeInOptions),
  trigger('fadeOutFromHalf', [transition('* => void', [animate(fadingDuration, style({ opacity: 0 }))])]),
];
