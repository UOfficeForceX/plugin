import { JsonPipe } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { AdvancedFieldExProps } from "@shared/advanced-field/advanced.exprops-type";


import { BpmFwPropsComponent, UofxFormTools } from "@uofx/web-components/form";
import { createNumberValidatorValidator } from "./numberValidator";

@Component({
  selector: 'uofx-advance-field-props-component',
  templateUrl: './advanced-field.props.component.html',
  styleUrls: ['./advanced-field.props.component.scss']
})

export class AdvancedFieldPropsComponent extends BpmFwPropsComponent implements OnInit {

  @Input() exProps: AdvancedFieldExProps;
  checkDaysCtrl: FormControl;
  constructor(public fb: FormBuilder,
    private tools: UofxFormTools,
    private cdr: ChangeDetectorRef) {

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

  initForm() {
    console.log('initForm');
    // Object.keys(this.exProps).forEach(k => {
    //   this.addFormControl(k, null);
    // });
    this.addFormControl('isShowEmpNo', [Validators.required]);
    this.addFormControl('isCheckDate', null);
    this.addFormControl('checkDays', [Validators.required],
      [createNumberValidatorValidator()]);
    this.checkDaysCtrl = this.form.controls.checkDays as FormControl;
    if (this.selfControl) {
      this.selfControl.setValidators(validateSelf(this.form));
      this.selfControl.updateValueAndValidity();
    }
    console.log(`exProps= ${JSON.stringify(this.exProps)} `);

    this.form.setValue(this.exProps);
  }


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
function validateSelf(form: FormGroup): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return form.valid ? null : { formInvalid: true };
  }
}

