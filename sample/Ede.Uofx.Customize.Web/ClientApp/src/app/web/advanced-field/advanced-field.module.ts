import { AdvancedFieldDesignComponent } from './design/advanced-field.design.component';
import { AdvancedFieldPropsComponent } from './props/advanced-field.props.component';
import { AdvancedFieldWriteComponent } from './write/advanced-field.write.component';
import { BASIC_HTTP_HANDLER, EmployeeHttpHandler } from '@service/basic-http-handler';
import { BasicHttpClient } from '@service/basic-http-client';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '@shared/advanced-field/employee.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UofxButtonModule } from '@uofx/web-components/button';
import { UofxDialogModule } from '@uofx/web-components/dialog';
import { UofxFormFieldBaseModule, UofxFormModule } from '@uofx/web-components/form';
import { UofxIconModule } from '@uofx/web-components/icon';
import { UofxPluginApiService } from '@uofx/plugin-api';
import { UofxToastController, UofxToastModule } from '@uofx/web-components/toast';
import { UofxTranslateModule } from '@uofx/web-components';
import { UofxUserSelectModule } from '@uofx/web-components/user-select';
import { MessageService } from 'primeng/api';

const PRIMENG_MODULES = [
  ButtonModule,
  CalendarModule,
  CheckboxModule,
  InputTextModule
];

const UOF_MODULES = [
  UofxDialogModule,
  UofxFormFieldBaseModule,
  UofxFormModule,
  UofxIconModule,
  // UofxSelectModule,
  UofxToastModule,
  UofxTranslateModule,
  UofxUserSelectModule,
  UofxButtonModule,
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
    ...PRIMENG_MODULES,
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
