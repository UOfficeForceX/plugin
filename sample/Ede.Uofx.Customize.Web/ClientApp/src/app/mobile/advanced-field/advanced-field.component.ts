import {
  AbstractControl,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { AdvancedFieldExProps, AdvancedFieldModel } from '@shared/advanced-field/advanced.exprops-type';
import { BpmFwWriteComponent, UofxValidators } from '@uofx/app-components/form';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { EmployeeService } from '@shared/advanced-field/employee.service';
import { Settings } from '@uofx/core';
import { UofxPluginApiService } from '@uofx/plugin/api';
import { UofxUserSetItemType } from '@uofx/app-components/user-select';
import { UofxCoreDateFormatPipe } from '@uofx/app-components';

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
  selector: 'app-advance-field',
  styleUrls: ['./advanced-field.component.scss'],
  templateUrl: './advanced-field.component.html'
})

export class AdvancedFieldComponent extends BpmFwWriteComponent implements OnInit {
  /** 屬性資料 */
  @Input() exProps: AdvancedFieldExProps;

  /** form group */
  form: UntypedFormGroup;
  /** 填寫model */
  value: AdvancedFieldModel;
  /** 錯誤訊息 */
  errorMessage: Array<string> = [];
  /** 員工編號 */
  empNo: string;
  /** 登入者公司id */
  corpId = Settings.UserInfo.corpId;
  /** 選人員件限制-僅選人 */
  userSelectTypes: Array<UofxUserSetItemType> = [UofxUserSetItemType.DeptEmployee];
  /** 時間format pipe */
  dateFormat = new UofxCoreDateFormatPipe();

  constructor(
    private fb: UntypedFormBuilder,
    private cdr: ChangeDetectorRef,
    private pluginService: UofxPluginApiService,
    private empService: EmployeeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.loadInfo();

    console.log('欄位屬性:', this.exProps);
    console.log('填寫的值:', this.value)
    console.log('表單變數:', this.taskNodeInfo.variables)
    this.getTargetFieldValue('Reason').then(res => {
      console.log('取得欄位代號為 Reason 的欄位資料:', res);
    });

    // 訂閱parent form的status changes，送出時，一併顯示欄位內整張form的錯誤訊息
    this.parentFormBinding(this.parentForm, this.selfControl, this.form);

    this.form.valueChanges.subscribe(res => {
      // 更新每次的value結果，為了跨欄位存取使用。
      this.setSelfControlValue(this.selfControl, this.form, res);

      // 真正送出欄位值變更的函式
      this.valueChanges.emit(res);
      this.cdr.detectChanges();
    });
  }

  /** 初始化form */
  initForm() {
    this.form = this.fb.group({
      'account': null,
      'empNo': [null, Validators.required],
      'mobile': [null, [Validators.required, UofxValidators.phoneNumber]],
      'applyDate': [null, [Validators.required, createApplyDateValidator(3)]],
      'agent': [null, Validators.required]
    });

    this.setFormValue();

    //表單送出時驗證
    if (this.selfControl) {
      // 在此便可設定自己的驗證器
      this.selfControl.setValidators(validateSelf(this.form));
      this.selfControl.updateValueAndValidity();
    }
  };

  /** 填入資料 */
  setFormValue() {
    // 等待畫面渲染後再設定值
    if (this.value) {
      this.form.controls.empNo.setValue(this.value.empNo);
      this.form.controls.mobile.setValue(this.value.mobile);
      const getApplyDate = this.value.applyDate ? this.dateFormat.transform(this.value.applyDate, 'yyyy/MM/dd') : null;
      this.form.controls.applyDate.setValue(getApplyDate);
      this.form.controls.agent.setValue(this.value.agent);
    }
  }

  /**
   * 表單送出前會呼叫此函式做檢查
   * @param {boolean} checkValidator 按下表單下方按鈕時是否要檢查表單驗證
   * @return {*}  {Promise<boolean>}
   * @memberof AdvancedFieldComponent
   */
  checkBeforeSubmit(checkValidator: boolean): Promise<boolean> {
    this.errorMessage = [];
    this.markFormGroup(this.form);

    return new Promise(resolve => {

      const formValue = this.form.value;
      console.log('checkBeforeSubmit', formValue);

      //呼叫api之前要設定serverUrl為外掛欄未站台位址
      this.empService.serverUrl = this.pluginSetting?.entryHost;
      console.log('checkBeforeSubmit-entryHost =', this.pluginSetting?.entryHost);

      // 放在checkBeforeSubmit中，如果是暫存就不需要驗證必填，且清除form control error
      this.checkValidators(checkValidator, this.selfControl, this.form);

      if (checkValidator) {

        if (this.form.invalid) {
          this.cdr.detectChanges();
          return resolve(false);
        }
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
          this.cdr.detectChanges();
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
        // 讓畫面更新
        this.cdr.detectChanges();
        return Promise.resolve(true);
      }
    });
  }

  /** 訂閱parent form的status changes，送出時，一併顯示欄位內整張form的錯誤訊息 */
  private parentFormBinding(parentForm: FormGroup, selfControl: FormControl, form: FormGroup) {
    // 已經call過就不再markFormGroup，目的: 節流，避免過多次重複呼叫
    let isCall = false;

    parentForm.statusChanges.subscribe({
      next: res => {
        // form驗證有過時才會重置isCall
        if (form.valid) {
          isCall = false;
        }
        // 表單顯示錯誤訊息
        if (res === 'INVALID' && selfControl.dirty && !isCall) {
          this.markFormGroup(form);
          isCall = true;
          this.cdr.detectChanges();
        }
      }
    });
  }

  /** 放在form.valueChanges訂閱中，每次更新selfControl的值 */
  private setSelfControlValue<T>(selfControl: FormControl, form: FormGroup, formModel: T) {
    // 表單驗證通過時，才更新selfControl的值 (selfControl有值，才會執行checkBeforeSubmit)
    // (1) emitEvent: false，避免parentForm訂閱重跑markFormGroup(造成無限循環)
    if (form.valid) {
      selfControl.setValue(formModel, { emitEvent: false });
    } else {
      selfControl.setValue(null, { emitEvent: false });
    }
  }

  /** 放在checkBeforeSubmit中，如果是暫存就不需要驗證必填，且清除form control error */
  private checkValidators(checkValidator: boolean, selfControl: FormControl, form: FormGroup) {
    if (!checkValidator && selfControl.hasError('required')) {
      delete selfControl.errors['required'];
      selfControl.setErrors(Object.keys(selfControl.errors).length === 0 ? null : selfControl.errors);
    } else if (checkValidator && selfControl.valid) {
      // 執行這行的目的是為了檢查欄位本身validator內的驗證，ex: 必填...等
      selfControl.updateValueAndValidity();
    }

    // 如果是暫存等按鈕，清除所有control error
    if (checkValidator === false) {
      this.clearControlError(form);
    }
  }

  /** 清除所有control error */
  private clearControlError(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      form.get(key).setErrors(null);
    });
  }

  /** 設定 FormGroup 的驗證狀態 */
  private markFormGroup(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      this.markFormControl(form.get(key));
    });
  }

  /** 設定 FormControl 的驗證狀態 */
  private markFormControl(control: AbstractControl) {
    control.markAsDirty();
    control.markAsTouched();
    control.updateValueAndValidity();
  }
}

//BpmFwWriteComponent
function validateSelf(form: UntypedFormGroup): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return form.valid ? null : { formInvalid: true };
  }
}
