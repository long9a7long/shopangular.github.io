import { Injectable } from '@angular/core';
import { ChiTietHoaDonBH } from '../_models/chitiethoadonbh';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillDetailBhService {

constructor( private httpClient: HttpClient ) { }

postDetailsBill(bill: ChiTietHoaDonBH[]) {
  const headers = new HttpHeaders();
  headers.set('Content-Type', 'application/json; charset=utf-8');
  return this.httpClient.post(environment.baseUrl + 'detailsBH', bill, {observe: 'response', headers: headers });
}

}
