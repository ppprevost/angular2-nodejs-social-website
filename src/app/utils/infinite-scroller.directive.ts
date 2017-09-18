import {Directive, AfterViewInit, ElementRef, Input} from '@angular/core';
import {BehaviorSubject} from "rxjs/Rx";
import {Observable, Subscription} from 'rxjs/Rx';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';

interface ScrollPosition {
  sH: number;
  sT: number;
  cH: number;
}

const DEFAULT_SCROLL_POSITION: ScrollPosition = {
  sH: 0,
  sT: 0,
  cH: 0
};

@Directive({
  selector: 'div[appInfiniteScroller]'
})
export class InfiniteScrollerDirective {

  private cache = [];
  private pageByManual$ = new BehaviorSubject(1);
  private itemHeight = 40;
  private numberOfItems = 10;
  // ---2----3---4---...
  private pageByScroll$ = Observable.fromEvent(window, "scroll")
    .map(() => window.scrollY)
    .filter(current => current >= document.body.clientHeight - window.innerHeight)
    .debounceTime(200)
    .distinct()
    .map(y => Math.ceil((y + window.innerHeight) / (this.itemHeight * this.numberOfItems)));

  private pageByResize$ = Observable
    .fromEvent(window, "resize")
    .debounceTime(200)
    .map(_ => Math.ceil((window.innerHeight + document.body.scrollTop) / (this.itemHeight * this.numberOfItems)));

  private pageToLoad$ = Observable
    .merge(this.pageByManual$, this.pageByScroll$, this.pageByResize$)
    .distinct()
    .filter(page => this.cache[page - 1] === undefined)

  loading = false;
  itemResults$ = this.pageToLoad$
    .do(_ => this.loading = true)
    .flatMap((page: number) => {
      console.log('ok"éé')
    })


}
