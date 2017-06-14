import {Injectable, HostListener} from '@angular/core';

@Injectable()
export class InfiniteScrollService {

  constructor() {
  }


  getDocHeight() {
    var D = document;
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    );
  }

  getScrollXY() {
    var scrOfX = 0, scrOfY = 0;
    if (typeof( window.pageYOffset ) == 'number') {
      //Netscape compliant
      scrOfY = window.pageYOffset;
      scrOfX = window.pageXOffset;
    } else if (document.body && ( document.body.scrollLeft || document.body.scrollTop )) {
      //DOM compliant
      scrOfY = document.body.scrollTop;
      scrOfX = document.body.scrollLeft;
    } else if (document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop )) {
      //IE6 standards compliant mode
      scrOfY = document.documentElement.scrollTop;
      scrOfX = document.documentElement.scrollLeft;
    }
    return [scrOfX, scrOfY];
  }

  debounce(func, wait, immediate, context?) {
    var result;
    var timeout = null;
    return function () {
      var ctx = context || this, args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) result = func.apply(ctx, args);
      };
      var callNow = immediate && !timeout;
      // Tant que la fonction est appelée, on reset le timeout.
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(ctx, args);
      return result;
    };
  }

  getInfiniteScroll() {
    if (this.getDocHeight() - 20 <= this.getScrollXY()[1] + window.innerHeight) {
      this.debounce((d) => console.log(d), 250, false);
      console.log('edeors debounce');
    }
  }
}
