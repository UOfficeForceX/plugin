import { BpmFwDesignComponent } from '@uofx/web-components/form';
import { Component, Input } from '@angular/core';
import { Settings } from '@uofx/core';

@Component({
  selector: 'uofx-advanced-field-design-component',
  templateUrl: './advanced-field.design.component.html',
  styleUrls: ['./advanced-field.design.component.scss']
})

export class AdvancedFieldDesignComponent extends BpmFwDesignComponent {

  @Input() exProps: any;

  corpId = Settings.UserInfo.corpId;

}
