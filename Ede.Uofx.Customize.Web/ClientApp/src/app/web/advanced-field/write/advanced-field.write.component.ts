import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { AdvancedFieldExProps, AdvancedFieldModel } from "@shared/advanced-field/advanced.exprops-type";
import { EmployeeService } from "@shared/advanced-field/employee.service";
import { UofxPluginApiService } from "@uofx/plugin-api";
import { BpmFwWriteComponent, UofxFormTools } from "@uofx/web-components/form";
import { zip } from "rxjs";

/**
 * 驗證行動電話的格式
 * @returns
 */
export function createMobileValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    //驗證輸入10碼數字
    const validNumber = /^[0-9]{10}$/.test(value);
    return !validNumber ? { invalidMobile: true } : null;
  }
}

/**
 * 驗證申請的日期是否超出屬性設定的天數
 */
export function createApplyDateValidator(days: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    console.log('applyvalue', JSON.stringify(value));
    const today = new Date();
    const applyDateVal = new Date(value);
    if (!applyDateVal)
      return null;
    const timeDiff = Math.abs(applyDateVal.getTime() - today.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > days)
      return { invalidApplyDate: true };
    else
      return null;
  }
}

@Component({
  selector: 'uofx-advanced-field-props-component',
  templateUrl: './advanced-field.write.component.html',
  styleUrls: ['./advanced-field.write.component.scss']
})
export class AdvancedFieldWriteComponent extends BpmFwWriteComponent implements OnInit {
  form: UntypedFormGroup;
  value: AdvancedFieldModel;
  @Input() exProps: AdvancedFieldExProps;

  errorMessage = [];
  empNo: string;
  applyDateCtrl: UntypedFormControl;
  mobileCtrl: UntypedFormControl;
  constructor(private fb: UntypedFormBuilder,
    private tools: UofxFormTools,
    private cdr: ChangeDetectorRef,
    private pluginService: UofxPluginApiService,
    private empService: EmployeeService) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    console.log('this.exProps.checkDays', this.exProps.checkDays);
    console.log(this.value)
    this.loadInfo();

    this.parentForm.statusChanges.subscribe(res => {

      if (res === 'INVALID' && this.selfControl.dirty) {
        if (!this.form.dirty) {
          Object.keys(this.form.controls).forEach(key => {
            this.tools.markFormControl(this.form.get(key));
          });
          this.form.markAsDirty();
          //強制formgroup驗證狀態
          //this.tools.markFormGroup(this.form);
        }
      }
    });

    this.form.valueChanges.subscribe(res => {
      console.log('valueChanges', res);

      this.selfControl.setValue(res);

      // 真正送出欄位值變更的函式
      this.valueChanges.emit(res);

    });
    this.cdr.detectChanges();
  }

  initForm() {
    console.log('initForm', this.exProps);
    this.form = this.fb.group({
      'empNo': [this.value?.empNo ?? '', Validators.required],
      'mobile': [this.value?.mobile ?? '', [createMobileValidator(), Validators.minLength(10)]],
      'applyDate': [this.value?.applyDate, [Validators.required, createApplyDateValidator(this.exProps.checkDays)]]
    }

    );
    this.applyDateCtrl = this.form.controls.applyDate as UntypedFormControl;
    this.mobileCtrl = this.form.controls.mobile as UntypedFormControl;

    //表單送出時驗證
    if (this.selfControl) {
      // 在此便可設定自己的驗證器
      this.selfControl.setValidators(validateSelf(this.form));
      this.selfControl.updateValueAndValidity();
    }

  }


  /** 表單submit前要做的檢查 */
  checkBeforeSubmit(): Promise<boolean> {
    return new Promise(resolve => {
      const value = this.form.value;
      console.log(value);
      //呼叫api之前要設定serverUrl為外掛欄未站台位址
      this.empService.serverUrl = this.pluginSetting?.entryHost;
      //呼叫api檢查是否是有效的帳號
      this.empService.getValidEmpNumber().subscribe(res => {
        if (res?.length ?? 0 > 0) {
          const ary = res;
          if (ary.indexOf(this.empNo) < 0) {
            this.errorMessage.push('無效的員工編號');
            //this.cdr.detectChanges();
            console.log('errormsg', this.errorMessage);
            resolve(false);

          }
          else
            resolve(true);
        }
        else
          resolve(false);
      });
    });
  }

  getFormControl(ctrl: string) {
    return this.form.get(ctrl) as UntypedFormControl;
    //form.controls.email
  }

  loadInfo() {
    //呼叫api取得員工和公司相關資訊
    zip(
      this.pluginService.getCorpInfo(),
      this.pluginService.getUserInfo(this.taskNodeInfo.applicantId)
    ).subscribe({
      next: ([corpInfo, empInfo]) => {
        console.log('corpInfo', corpInfo);
        console.log(empInfo.employeeNumber);
        if (empInfo.employeeNumber) {
          //取得員工編號
          this.empNo = empInfo.employeeNumber;
          this.form.controls.empNo.setValue(this.empNo);
        }

        console.log(this.empNo);
      },
      complete: () => {
        console.log(this.empNo);
        // 讓畫面更新
        this.cdr.detectChanges();
      }

    }

    );
  }

}
//BpmFwWriteComponent
function validateSelf(form: UntypedFormGroup): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return form.valid ? null : { formInvalid: true };
  }
}

