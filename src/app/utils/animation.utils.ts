import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, fadeInAnimation, fadeOutAnimation } from 'angular-animations';
import { trigger, transition, animate, style, state } from '@angular/animations';

const fadingDuration = 400;
const fadeInOptions = { duration: fadingDuration };

export const FADE_ANIMATIONS = [
  fadeInOnEnterAnimation(fadeInOptions),
  fadeOutOnLeaveAnimation(fadeInOptions),
  fadeInAnimation(fadeInOptions),
  fadeOutAnimation(fadeInOptions),
  trigger('fadeOutFromHalf', [
    transition('* => void', [style({ opacity: 0.5 }), animate(fadingDuration, style({ opacity: 0 }))]),
  ]),
  trigger('fade', [
    state(
      'false',
      style({
        opacity: 0,
      })
    ),
    transition('true => false', [style({ opacity: 1 }), animate(fadingDuration, style({ opacity: 0 }))]),
    transition('false => true', [style({ opacity: 0 }), animate(fadingDuration, style({ opacity: 1 }))]),
  ]),
];
