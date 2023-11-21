import { BpmFwPropsComponent } from '@uofx/web-components/form';
import { Component } from "@angular/core";
import { UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'uofx-hello-world-props-component',
  template: `<div class="padding-2x">目前沒有任何可設置屬性</div>`
})
export class HelloWorldPropsComponent extends BpmFwPropsComponent {
  constructor(public fb: UntypedFormBuilder) {
    super(fb);
  }
}

