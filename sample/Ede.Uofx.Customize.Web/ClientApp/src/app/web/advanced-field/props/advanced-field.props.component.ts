import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { AdvancedFieldExProps } from '@shared/advanced-field/advanced.exprops-type';
import { BpmFwPropsComponent } from '@uofx/web-components/form';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { createNumberValidatorValidator } from './numberValidator';

@Component({
  selector: 'uofx-advance-field-props-component',
  templateUrl: './advanced-field.props.component.html'
})
export class AdvancedFieldPropsComponent extends BpmFwPropsComponent implements OnInit {

  @Input() exProps: AdvancedFieldExProps;
  checkDaysCtrl: UntypedFormControl;

  constructor(
    public fb: UntypedFormBuilder,
    private cdr: ChangeDetectorRef
  ) {

    super(fb);
    console.log('constructor');
  }

  ngOnInit(): void {
    console.log(`edit=${this.editable}`)
    console.log(this.form.controls['isCheckDate']);
    this.initExProps();
    this.initForm();

    this.form.valueChanges.subscribe(res => {
      console.log('valueChanges', res);
      if (this.selfControl)
        this.selfControl.setValue(res);

      // 真正送出欄位值變更的函式
      this.valueChanges.emit(res);
    });
    this.cdr.detectChanges();
  }

  /** 初始化form */
  initForm() {
    console.log('initForm');

    this.addFormControl('isShowEmpNo', [Validators.required]);
    this.addFormControl('isCheckDate', null);
    this.addFormControl('checkDays', [Validators.required], [createNumberValidatorValidator()]);
    this.checkDaysCtrl = this.form.controls.checkDays as UntypedFormControl;

    if (this.selfControl) {
      this.selfControl.setValidators(validateSelf(this.form));
      this.selfControl.updateValueAndValidity();
    }
    console.log(`exProps= ${JSON.stringify(this.exProps)} `);

    this.form.setValue(this.exProps);
    this.setControlStatus();
  }

  /** 設定控制項狀態 */
  setControlStatus() {
    if(this.editable) {
      this.form.enable();
    }
    else {
      this.form.disable();
    }
  }

  /** 初始化屬性 */
  initExProps() {
    console.log('initExProps');
    if (!this.exProps) {
      // 初始化設定額外屬性
      this.exProps = {
        isShowEmpNo: false,
        isCheckDate: false,
        checkDays: 0
      };
    } else {
      // 若已有存在的 exProps
      // 看是需要更新還是重設 value
    }
  }
}

function validateSelf(form: UntypedFormGroup): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return form.valid ? null : { formInvalid: true };
  }
}
