import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HoaDonBanHang } from '../_models/hoadonbanhang';
import { PaginatedResult } from '../_models/pagination';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DebtCustomerBillService {

constructor(private httpClient: HttpClient) { }

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
      paginatedResult.result = response.body.content;
    }
    return paginatedResult;
  }));

}
}
