import {Directive, Input} from '@angular/core';

@Directive({
  selector: 'i',
  host: {
    '(click)': 'test($event)',
    'mdTooltip':"Tooltip!",
    'mdTooltipPosition':'before'
  }
})
export class TooltipDirective {
@Input() mdTooltipPosition

  constructor() {
  }

  test(event: Event) {
    console.log(event)
  }

}
