import { AdvancedFieldDesignComponent } from './design/advanced-field.design.component';
import { AdvancedFieldPropsComponent } from './props/advanced-field.props.component';
import { AdvancedFieldWriteComponent } from './write/advanced-field.write.component';
import { BASIC_HTTP_HANDLER, EmployeeHttpHandler } from '@service/basic-http-handler';
import { BasicHttpClient } from '@service/basic-http-client';
import { ButtonModule, CheckBoxModule, RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { CommonModule } from '@angular/common';
import { DatePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { EmployeeService } from '@shared/advanced-field/employee.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { NgModule } from '@angular/core';
import { NumericTextBoxModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UofxDialogModule } from '@uofx/web-components/dialog';
import { UofxFileModule } from '@uofx/web-components/file';
import { UofxFormFieldBaseModule, UofxFormModule } from '@uofx/web-components/form';
import { UofxIconModule } from '@uofx/web-components/icon';
import { UofxPluginApiService } from '@uofx/plugin-api';
import { UofxSelectModule } from '@uofx/web-components/select';
import { UofxToastModule } from '@uofx/web-components/toast';
import { UofxTooltipModule } from '@uofx/web-components/tooltip';
import { UofxTranslateModule } from '@uofx/web-components';
import { UofxUserSelectModule } from '@uofx/web-components/user-select';

const EJS_MODULES = [
  ButtonModule,
  CheckBoxModule,
  DatePickerModule,
  DateTimePickerModule,
  DialogModule,
  DropDownListModule,
  GridModule,
  NumericTextBoxModule,
  RadioButtonModule,
  TextBoxModule,
];

const UOF_MODULES = [
  UofxDialogModule,
  UofxFileModule,
  UofxFormFieldBaseModule,
  UofxFormModule,
  UofxIconModule,
  UofxSelectModule,
  UofxToastModule,
  UofxTooltipModule,
  UofxTranslateModule,
  UofxUserSelectModule,
];

const COMPONENTS = [
  AdvancedFieldDesignComponent,
  AdvancedFieldPropsComponent,
  AdvancedFieldWriteComponent
];

const EMP_SERVICES = [
  { provide: BASIC_HTTP_HANDLER, useClass: EmployeeHttpHandler },
  BasicHttpClient,
  EmployeeService
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', redirectTo: 'design', pathMatch: 'full' },
      { path: 'design', component: AdvancedFieldDesignComponent },
      { path: 'props', component: AdvancedFieldPropsComponent },
      { path: 'write', component: AdvancedFieldWriteComponent },
      { path: 'view', component: AdvancedFieldWriteComponent },
      {
        path: 'app',
        loadChildren: () => import('../../mobile/advanced-field/advanced-field.module').then(m => m.FieldAdvancedAppModule)
      }
    ]),
    TranslateModule.forChild(),
    ...EJS_MODULES,
    ...UOF_MODULES
  ],
  providers: [
    UofxPluginApiService,
    ...EMP_SERVICES
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class AdvancedFieldModule {
  static comp = {
    props: AdvancedFieldPropsComponent,
    design: AdvancedFieldDesignComponent,
    write: AdvancedFieldWriteComponent,
    view: AdvancedFieldWriteComponent,
    print: AdvancedFieldWriteComponent,
  }
}
