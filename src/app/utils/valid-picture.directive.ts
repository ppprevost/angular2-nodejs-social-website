import {Directive, Input} from '@angular/core';
/**
 * to replace a error src image into a good static jpg
 */

@Directive({
  selector: 'img[src]',
  host: {
    '[src]': 'checkPath(src)',
    '(error)': 'onError'
  }
})

export class ValidPictureDirective {
  @Input() src: string;
  defaultImg: string = '/assets/images/default-avatar.jpg';

  constructor() {
  }

  onError() {
    return this.defaultImg;
  }

  checkPath(src) {
    return src ? src : this.defaultImg
  }


}
