import { NgModule } from '@angular/core';
import { UofxAvatarModule } from '@uofx/web-components/avatar';
import { UofxCardModule } from '@uofx/web-components/card';
import { UofxChipModule } from '@uofx/web-components/chip';
import { UofxDateRangeModule } from '@uofx/web-components/date-range';
import { UofxDialogModule } from '@uofx/web-components/dialog';
import { UofxDirectiveModule } from '@uofx/web-components';
import { UofxDropdownButtonModule } from '@uofx/web-components/dropdown-button';
import { UofxEmptyStatusModule } from '@uofx/web-components';
import { UofxFileModule } from '@uofx/web-components/file';
import { UofxFormFieldBaseModule, UofxFormModule } from '@uofx/web-components/form';
import { UofxIconModule } from '@uofx/web-components/icon';
import { UofxLoadingModule, UofxPaginationModule } from '@uofx/web-components';
import { UofxPipeModule } from '@uofx/web-components/pipes';
import { UofxProgressButtonModule } from '@uofx/web-components/progress-button';
import { UofxRedirectModule } from '@uofx/web-components/redirect';
import { UofxSearchBarModule } from '@uofx/web-components/search-bar';
import { UofxSelectModule } from '@uofx/web-components/select';
import { UofxSpinnerModule } from '@uofx/web-components';
import { UofxTextareaModule } from '@uofx/web-components/textarea';
import { UofxTextEllipsisModule } from '@uofx/web-components/text-ellipsis';
import { UofxToastModule } from '@uofx/web-components/toast';
import { UofxTooltipModule } from '@uofx/web-components/tooltip';
import { UofxTranslateModule } from '@uofx/web-components';
import { UofxTreeModule } from '@uofx/web-components/tree';
import { UofxUserSelectModule } from '@uofx/web-components/user-select';

@NgModule({
  exports: [
    UofxAvatarModule,

    UofxCardModule,
    UofxChipModule,

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
    UofxPaginationModule,
    UofxPipeModule,

    UofxProgressButtonModule,
    UofxRedirectModule,
    UofxSearchBarModule,

    UofxSelectModule,
    UofxSpinnerModule,
    UofxTextareaModule,
    UofxTextEllipsisModule,
    UofxToastModule,
    UofxTooltipModule,

    UofxTranslateModule,

    UofxTreeModule,
    UofxUserSelectModule
  ]
})
export class UofxPackageModule { }

