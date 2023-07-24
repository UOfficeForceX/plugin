import { Injectable } from '@angular/core';
import { BasicApiService } from "@service/basic-api.service"
@Injectable()
export class EmployeeService extends BasicApiService{
  /**
   * 取得合法的員工編號
   * @returns 合法的員工編號
   */
  getValidEmpNumber(){
    const url= `~/api/emp/validemp`;
    //呼叫之前需先設定serverUrl
    console.log( this.http.serverUrl);
    return this.http.get<string[]>(url);
  }
}
