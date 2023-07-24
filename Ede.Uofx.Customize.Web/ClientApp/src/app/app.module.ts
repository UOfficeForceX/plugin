import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IconModule } from './icon.module';

import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UofxTranslateLoader } from './translate-loader';
import { Helper } from '@uofx/core';
import { HelloWorldModule } from './web/hello-world/hello-world.module';
import { MenuModule, SidebarModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { AdvancedFieldModule } from './web/advanced-field/advanced-field.module';

// #region i18n services
export function I18nHttpLoaderFactory(http: HttpClient) {
  return new UofxTranslateLoader(http);
}

const I18NSERVICE_MODULES = [
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: I18nHttpLoaderFactory,
      deps: [HttpClient],
    },
    defaultLanguage: 'zh-TW',
    useDefaultLang: true,
  }),
];

//#endregion

const EJS_MODULES = [
  MenuModule,
  SidebarModule,
  ToolbarModule,
];

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      {
        path: 'hello-world',
        loadChildren: () => import('./web/hello-world/hello-world.module').then(m => m.HelloWorldModule)
      },
      {
        path: 'advanced-field',
        loadChildren: () => import('./web/advanced-field/advanced-field.module').then(m => m.AdvancedFieldModule)
      }
    ]),
    ...I18NSERVICE_MODULES,
    ...EJS_MODULES,
    IconModule.forRoot(),
    AdvancedFieldModule,
    HelloWorldModule

  ],
  providers: [
    { provide: 'BASE_HREF', useFactory: Helper.getBaseHref }
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
