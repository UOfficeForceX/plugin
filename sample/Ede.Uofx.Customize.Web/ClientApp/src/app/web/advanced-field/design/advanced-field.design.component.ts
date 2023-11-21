import { Component, Input } from "@angular/core";
import { BpmFwDesignComponent } from "@uofx/web-components/form";

@Component({
  selector: 'uofx-advanced-field-design-component',
  templateUrl: './advanced-field.design.component.html',
  styleUrls: ['./advanced-field.design.component.scss']
})

export class AdvancedFieldDesignComponent extends BpmFwDesignComponent {

  @Input() exProps: any;

}
