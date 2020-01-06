import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { HoaDonBanHang } from '../_models/hoadonbanhang';
import { PaginatedResult } from '../_models/pagination';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { KhachHang } from '../_models/khachhang';
import { PhieuThu } from '../_models/phieuthu';

@Injectable({
  providedIn: 'root'
})
export class DebtCustomerBillService {

constructor(private httpClient: HttpClient) { }

  updateCustomer(khachhang: KhachHang) {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.put(environment.baseUrl + 'customers', khachhang, { headers: headers });
  }

  getListCustomerBillDebt(makhachhang?: string, page?: number, pageSize?: number): Observable<PaginatedResult<HoaDonBanHang[]>> {
    const paginatedResult: PaginatedResult<HoaDonBanHang[]> = new PaginatedResult<HoaDonBanHang[]>();
    let params = new HttpParams();
    if (page != null && pageSize != null) {
      params = params.append('pageNumber', (page - 1).toString());
      params = params.append('pageSize', pageSize.toString());
    }
    return this.httpClient.get<any>(environment.baseUrl + 'customers/bill/debt/' + makhachhang, { observe: 'response', params })
    .pipe(map(response => {
      if (response.body != null) {
        paginatedResult.pagination = {
          currentPage: response.body.pageable.pageNumber + 1,
          totalItems: response.body.totalElements,
          totalPages: response.body.totalPages,
          itemsPerPage: response.body.pageable.pageSize
        };
        if (response.body.content !== null) {
          paginatedResult.result = response.body.content.filter(this.checkDebtBill);
        } else {
          paginatedResult.result = response.body.content;
        }
      }
      return paginatedResult;
    }));
  }

  postReceipts(phieuthu: PhieuThu) {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.post(environment.baseUrl + 'receipts', phieuthu, { headers: headers });
  }

  checkDebtBill(hoadonbanhang: HoaDonBanHang) {
    let tongphieuthu = 0;
    if (hoadonbanhang.phieuthus != null) {
      hoadonbanhang.phieuthus.forEach(element => {
        tongphieuthu += element.sotienthu;
      });
    }
    return hoadonbanhang.tonggia - hoadonbanhang.khachhangtra - tongphieuthu > 0 ;
  }
}
