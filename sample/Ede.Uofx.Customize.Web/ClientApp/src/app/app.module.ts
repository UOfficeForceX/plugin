import { AdvancedFieldModule } from './web/advanced-field/advanced-field.module';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HelloWorldModule } from './web/hello-world/hello-world.module';
import { Helper } from '@uofx/core';
import { HomeComponent } from './develop-lab/home/home.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IconModule } from './icon.module';
import { LayoutComponent } from './develop-lab/layout/layout.component';
import { MessageService } from 'primeng/api';
import { NavMenuComponent } from './develop-lab/nav-menu/nav-menu.component';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UofxTranslateLoader } from './translate-loader';

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


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    NavMenuComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
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
    IconModule.forRoot(),
    AdvancedFieldModule,
    HelloWorldModule
  ],
  providers: [
    { provide: 'BASE_HREF', useFactory: Helper.getBaseHref },
    MessageService,
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
