import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
  } from '@angular/forms';
import { AdvancedFieldExProps, AdvancedFieldModel } from '@shared/advanced-field/advanced.exprops-type';
import { BpmFwWriteComponent } from '@uofx/app-components/form';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
  } from '@angular/core';
import { EmployeeService } from '@shared/advanced-field/employee.service';
import { switchMap, zip } from 'rxjs';
import { UofxPluginApiService } from '@uofx/plugin/api';

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
  selector: 'app-advance-field',
  styleUrls: ['./advanced-field.component.scss'],
  templateUrl: './advanced-field.component.html'
})

export class AdvancedFieldComponent extends BpmFwWriteComponent implements OnInit {
  @Input() exProps: AdvancedFieldExProps;
  form: UntypedFormGroup;
  value: AdvancedFieldModel;
  mobileCtrl: UntypedFormControl;
  applyDateCtrl: UntypedFormControl;
  errorMessage = [];
  account = [];
  err: any;
  empNo: string;
  constructor(private fb: UntypedFormBuilder,
    private cdr: ChangeDetectorRef,
    private pluginService: UofxPluginApiService,
    private empService: EmployeeService) {
    super();
  }



  ngOnInit(): void {

    console.log('init');

    this.initForm();
    console.log('empService=', this.empService);
    this.loadInfo();
    this.form.valueChanges.subscribe(res => {
      console.log('valueChanges', res);

      this.selfControl.setValue(res);

      // 真正送出欄位值變更的函式
      this.valueChanges.emit(res);

    });
    this.cdr.detectChanges();
  }

  initForm() {
    console.log('exProps=', this.exProps);
    this.form = this.fb.group({
      'empNo': [this.value?.empNo ?? '', Validators.required],
      'mobile': [this.value?.mobile ?? '', [createMobileValidator(), Validators.minLength(10)]],
      'applyDate': [this.value?.applyDate, [Validators.required, createApplyDateValidator(3)]]
    });

    this.applyDateCtrl = this.form.controls.applyDate as UntypedFormControl;
    this.mobileCtrl = this.form.controls.mobile as UntypedFormControl;

    //表單送出時驗證
    if (this.selfControl) {
      // 在此便可設定自己的驗證器
      this.selfControl.setValidators(validateSelf(this.form));
      this.selfControl.updateValueAndValidity();
    }
  };

  /**
   * 表單送出前會呼叫此函式做檢查
   * @param {boolean} checkValidator 按下表單下方按鈕時是否要檢查表單驗證
   * @return {*}  {Promise<boolean>}
   * @memberof AdvancedFieldComponent
   */
  checkBeforeSubmit(checkValidator: boolean): Promise<boolean> {
    return new Promise(resolve => {
      const value = this.form.value;
      console.log(value);
      console.log('empNo =', this.empNo);
      //呼叫api之前要設定serverUrl為外掛欄未站台位址
      this.empService.serverUrl = this.pluginSetting?.entryHost;
      console.log('entryHost =', this.pluginSetting?.entryHost);
      //呼叫api檢查是否是有效的帳號
      this.empService.getValidEmpNumber().subscribe({
        next: res => {
          if (res?.length ?? 0 > 0) {
            const ary = res;
            console.log('empNo=', this.empNo);
            if (ary.indexOf(this.empNo) < 0) {
              this.errorMessage = [];
              this.errorMessage.push('無效的員工編號');
              //this.cdr.detectChanges();
              console.log('errormsg', this.errorMessage);
              this.cdr.detectChanges();
              resolve(false);

            }
            else
              resolve(true);
          }
          else
            resolve(false);
        }, error: error => {
          console.log('err', error);
          this.err = 'error!!';
        }
      });
    });

  }

  loadInfo() {
    // 呼叫api取得員工相關資訊
    this.pluginService.getUserInfo(this.taskNodeInfo.applicantId)
      .pipe(
        switchMap(empInfo => {
          return this.pluginService.getCorpInfo()
        })
      ).subscribe({
        next: (empInfo) => {
          // console.log('empInfo', empInfo);
          // if (empInfo.employeeNumber) {
          //   // 取得員工編號
          //   this.empNo = empInfo.employeeNumber;
          //   this.form.controls.empNo.setValue(this.empNo);
          // } else {
          //   this.empNo = '申請者未設定員工編號';
          // }
        },
        error: () => {
          this.empNo = '無法取得申請者員工編號';
          this.empNo = 'A001';
          this.form.controls.empNo.setValue('A001');
        },
        complete: () => {
          console.log('empNo', this.empNo);
          // 讓畫面更新
          this.cdr.detectChanges();
          return Promise.resolve(true);
        }
      });

  };
}
//BpmFwWriteComponent
function validateSelf(form: UntypedFormGroup): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return form.valid ? null : { formInvalid: true };
  }
}
