import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { AdvancedFieldExProps, AdvancedFieldModel } from '@shared/advanced-field/advanced.exprops-type';
import { BpmFwWriteComponent, UofxFormFieldLogic, UofxFormTools, UofxValidators } from '@uofx/web-components/form';
import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { EmployeeService } from '@shared/advanced-field/employee.service';
import { Settings } from '@uofx/core';
import { UofxPluginApiService } from '@uofx/plugin/api';
import { UofxToastController } from '@uofx/web-components/toast';
import { UofxUserSetItemType } from '@uofx/web-components/user-select';

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

    const today = new Date();
    const applyDateVal = new Date(value);
    if (isNaN(applyDateVal.getTime())) {
      return null;
    }
    const timeDiff = Math.abs(applyDateVal.getTime() - today.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays > days ? { invalidApplyDate: true } : null;
  }
}

@Component({
  selector: 'uofx-advanced-field-props',
  templateUrl: './advanced-field.write.component.html',
  styleUrls: ['./advanced-field.write.component.scss']
})
export class AdvancedFieldWriteComponent extends BpmFwWriteComponent implements OnInit {
  /** 屬性資料 */
  @Input() exProps: AdvancedFieldExProps;

  /** 登入者公司id */
  corpId = Settings.UserInfo.corpId;
  /** form group */
  form: UntypedFormGroup;
  /** 填寫model */
  value: AdvancedFieldModel;
  /** 錯誤訊息 */
  errorMessage = [];
  /** 員工編號 */
  empNo: string;
  /** 選人員件限制-僅選人 */
  userSelectTypes: Array<UofxUserSetItemType> = [UofxUserSetItemType.DeptEmployee];

  constructor(
    private fb: UntypedFormBuilder,
    private tools: UofxFormTools,
    private pluginService: UofxPluginApiService,
    private empService: EmployeeService,
    private toastCtrl: UofxToastController,
    private fieldLogic: UofxFormFieldLogic
  ) {
    super();
  }

  ngOnInit(): void {
    this.toastCtrl.saved();
    this.initForm();

    console.log('欄位屬性:', this.exProps);
    console.log('填寫的值:', this.value)
    console.log('表單變數:', this.taskNodeInfo.variables)
    this.getTargetFieldValue('Reason').then(res => {
      console.log('取得欄位代號為 Reason 的欄位資料:', res);
    });

    this.loadInfo();

    // 訂閱parent form的status changes，送出時，一併顯示欄位內整張form的錯誤訊息
    this.fieldLogic.parentFormBinding(this.parentForm, this.selfControl, this.form);

    this.form.valueChanges.subscribe({
      next: res => {
        // 更新每次的value結果，為了跨欄位存取使用。
        this.fieldLogic.setSelfControlValue(this.selfControl, this.form, res);

        // 真正送出欄位值變更的函式
        this.valueChanges.emit(res);
      }
    });
  }

  /** 初始化form */
  initForm() {
    this.form = this.fb.group({
      'account': null,
      'empNo': [null, Validators.required],
      'mobile': [null, [Validators.required, UofxValidators.phoneNumber]],
      'applyDate': [null, [Validators.required, createApplyDateValidator(this.exProps.checkDays)]],
      'agent': [null, Validators.required]
    });

    this.setFormValue();

    // 表單送出時驗證
    if (this.selfControl) {
      // 在此便可設定自己的驗證器
      this.selfControl.setValidators(validateSelf(this.form));
      this.selfControl.updateValueAndValidity();
    }
  }

  /** 填入資料 */
  setFormValue() {
    if (this.value) {
      this.form.controls.empNo.setValue(this.value.empNo);
      this.form.controls.mobile.setValue(this.value.mobile);
      this.form.controls.applyDate.setValue(this.value.applyDate);
      this.form.controls.agent.setValue(this.value.agent);
    }
  }

  /**
   * 表單送出前會呼叫此函式做檢查
   * @param {boolean} checkValidator 按下表單下方按鈕時是否要檢查表單驗證
   * @return {*}  {Promise<boolean>}
   */
  checkBeforeSubmit(checkValidator: boolean): Promise<boolean> {
    this.errorMessage = [];
    this.tools.markFormGroup(this.form);

    return new Promise(resolve => {

      const formValue = this.form.value;
      console.log('checkBeforeSubmit', formValue);

      //呼叫api之前要設定serverUrl為外掛欄位站台位址
      this.empService.serverUrl = this.pluginSetting?.entryHost;
      console.log('checkBeforeSubmit-entryHost =', this.pluginSetting?.entryHost);

      // 放在checkBeforeSubmit中，如果是暫存就不需要驗證必填，且清除form control error
      this.fieldLogic.checkValidators(checkValidator, this.selfControl, this.form);

      if (checkValidator) {

        if (this.form.invalid) return resolve(false);
        this.checkValidEmpNo(formValue, resolve);

      } else {
        resolve(true);
      }

    });
  }

  /** 驗證員編 */
  checkValidEmpNo(formValue, resolve) {
    this.empService.getValidEmpNumber().subscribe({
      next: res => {
        console.log('有效的員編', res);
        if (res?.includes(formValue.empNo)) {
          this.errorMessage = [];
          resolve(true);
        } else {
          this.errorMessage.push('無效的員工編號');
          console.log('errormsg', this.errorMessage);
          resolve(false);
        }
      }
    });
  }

  /** 取得員工資訊 */
  loadInfo() {
    this.pluginService.getUserInfo(this.taskNodeInfo.applicantId).subscribe({
      next: (empInfo) => {
        console.log('員工資訊', empInfo);

        this.form.controls.account.setValue(empInfo.account);
      },
      error: () => {
        console.log('無法取得員工資訊');
      },
      complete: () => {
        return Promise.resolve(true);
      }
    });
  }
}

// BpmFwWriteComponent
function validateSelf(form: UntypedFormGroup): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return form.valid ? null : { formInvalid: true };
  }
}
