import {Injectable, HostListener} from '@angular/core';

@Injectable()
export class InfiniteScrollService {

  constructor() {
  }

  /**
   * get the max height of the document by picking the good technique
   * @returns {number}
   */
  getDocHeight() {
    let D = document;
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    );
  }

  /**
   * get
   * @returns {[number,number]}
   */
  getScrollXY() {
    let scrOfX = 0, scrOfY = 0;
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

  /**
   * Need some time before launching the function
   * @param func
   * @param wait
   * @param immediate
   * @param context
   * @returns {()=>any}
   */
  debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = window,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  };

  /**
   * get the function
   */
  getInfiniteScroll(callback?) {
    this.debounce((d) => {
      if (this.getDocHeight() - 20 <= this.getScrollXY()[1] + window.innerHeight) {
        console.log('edeors debounce');
        if (callback) {
          callback();
        }
      }

    }, 500, false).bind(window);

  }
}
