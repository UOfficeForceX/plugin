import { BpmFwDesignComponent } from '@uofx/web-components/form';
import { Component, Input } from '@angular/core';
import { Settings } from '@uofx/core';
import { AdvancedFieldExProps } from '@shared/advanced-field/advanced.exprops-type';

@Component({
  selector: 'uofx-advanced-field-design',
  templateUrl: './advanced-field.design.component.html',
  styleUrls: ['./advanced-field.design.component.scss']
})

export class AdvancedFieldDesignComponent extends BpmFwDesignComponent {

  /** 屬性資料 */
  @Input() exProps: AdvancedFieldExProps;

  /** 登入者公司id */
  corpId = Settings.UserInfo.corpId;
}
