import { NgModule } from '@angular/core';
import { UofxAvatarModule } from '@uofx/web-components/avatar';
import { UofxBreadcrumbModule } from '@uofx/web-components/breadcrumb';
import { UofxCardModule } from '@uofx/web-components/card';
import { UofxChipModule } from '@uofx/web-components/chip';
import { UofxCorpLogoModule } from '@uofx/web-components/corp-logo';
import { UofxDateRangeModule } from '@uofx/web-components/date-range';
import { UofxDialogModule } from '@uofx/web-components/dialog';
import { UofxDirectiveModule } from '@uofx/web-components';
import { UofxDropdownButtonModule } from '@uofx/web-components/dropdown-button';
import { UofxEmptyStatusModule } from '@uofx/web-components';
import { UofxFileModule } from '@uofx/web-components/file';
import { UofxFormFieldBaseModule, UofxFormModule } from '@uofx/web-components/form';
import { UofxIconModule } from '@uofx/web-components/icon';
import {
  UofxLoadingModule,
  UofxPaginationModule,
  UofxPipeModule,
  UofxRedirectModule
} from '@uofx/web-components';
import { UofxNotifyTemplateModule } from '@uofx/web-components/notify-template';
import { UofxSearchBarModule } from '@uofx/web-components/search-bar';
import { UofxSelectModule } from '@uofx/web-components/select';
import { UofxSpinnerModule } from '@uofx/web-components';
import { UofxTagSelectModule } from '@uofx/web-components/tag-select';
import { UofxTextareaModule } from '@uofx/web-components/textarea';
import { UofxTextEllipsisModule } from '@uofx/web-components/text-ellipsis';
import { UofxTimelineModule, UofxTranslateModule } from '@uofx/web-components';
import { UofxToastModule } from '@uofx/web-components/toast';
import { UofxTooltipModule } from '@uofx/web-components/tooltip';
import { UofxTreeModule } from '@uofx/web-components/tree';
import { UofxUserSelectModule } from '@uofx/web-components/user-select';

@NgModule({
  exports: [
    UofxAvatarModule,

    // UofxBreadcrumbModule,

    UofxCardModule,
    UofxChipModule,
    // UofxCorpLogoModule,

    UofxDateRangeModule,
    UofxDialogModule,
    UofxDirectiveModule,
    UofxDropdownButtonModule,

    UofxEmptyStatusModule,

    UofxFileModule,
    UofxFormFieldBaseModule,
    UofxFormModule,

    UofxIconModule,

    UofxLoadingModule,
    // UofxNotifyTemplateModule,

    UofxPaginationModule,

    UofxPipeModule,

    UofxRedirectModule,
    UofxSearchBarModule,

    UofxSelectModule,
    UofxSpinnerModule,
    UofxTagSelectModule,
    UofxTextareaModule,
    UofxTextEllipsisModule,
    // UofxTimelineModule,
    UofxToastModule,
    UofxTooltipModule,

    UofxTranslateModule,

    UofxTreeModule,
    UofxUserSelectModule
  ]
})
export class UofxPackageModule { }

