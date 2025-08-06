import { animate, style, transition, trigger } from '@angular/animations';
import { createAnimation } from '@ionic/angular/standalone';

export const forwardEnterAnimation = (baseEl: HTMLElement) => {
  const root = baseEl.shadowRoot;

  const backdropAnimation = createAnimation()
    .addElement(root?.querySelector('ion-backdrop')!)
    .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

  const wrapperAnimation = createAnimation()
    .addElement(root?.querySelector('.modal-wrapper')!)
    .keyframes([
      { offset: 0, opacity: '1', transform: 'translateX(100%)' },
      { offset: 1, opacity: '1', transform: 'translateX(0)' },
    ]);

  return createAnimation()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(150)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};

export const backwardEnterAnimation = (baseEl: HTMLElement) => {
  return forwardEnterAnimation(baseEl).direction('reverse');
};

export const expandHeightAnimation = trigger('expandHeight', [
  transition(
    ':enter',
    [
      style({ height: '0', opacity: 0, overflow: 'hidden' }),
      animate(
        '{{duration}}ms {{easing}}',
        style({ height: '{{height}}', opacity: 1, padding: '{{padding}}' })
      ),
    ],
    {
      params: {
        duration: 300,
        easing: 'ease-out',
        height: '*',
        padding: '16px',
      },
    }
  ),
  transition(
    ':leave',
    [
      style({ height: '{{height}}', opacity: 1, overflow: 'hidden' }),
      animate(
        '{{duration}}ms {{easing}}',
        style({ height: '0', opacity: 0, padding: '0px 16px' })
      ),
    ],
    {
      params: { duration: 300, easing: 'ease-in', height: '0', padding: '0px 16px' },
    }
  ),
]);
