import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { HoaDonBanHang } from '../_models/hoadonbanhang';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class BillsBhService {

constructor( private httpClient: HttpClient ) { }
  getListBill(page?: number, pageSize?: number): Observable<PaginatedResult<HoaDonBanHang[]>> {
    const paginatedResult: PaginatedResult<HoaDonBanHang[]> = new PaginatedResult<HoaDonBanHang[]>();
    let params = new HttpParams();
    if (page != null && pageSize != null) {
      params = params.append('pageNumber', (page - 1).toString());
      params = params.append('pageSize', pageSize.toString());
    }
    return this.httpClient.get<any>(environment.baseUrl + 'billBHs', { observe: 'response', params })
      .pipe(map(response => {
        if (response.body != null) {
          paginatedResult.result = response.body.content;
          paginatedResult.totalElements = response.body.totalElements;
          paginatedResult.pagination = {
            currentPage: response.body.pageable.pageNumber + 1,
            totalItems: response.body.totalElements,
            totalPages: response.body.totalPages,
            itemsPerPage: response.body.pageable.pageSize
          };
          return paginatedResult;
        }
      }));
  }

  getSearchListBill(
    page?: number, pageSize?: number, searchTerm?: string, fromdate?: string,  todate?: string):
    Observable<PaginatedResult<HoaDonBanHang[]>> {
      const paginatedResult: PaginatedResult<HoaDonBanHang[]> = new PaginatedResult<HoaDonBanHang[]>();
      let params = new HttpParams();
      if (page != null && pageSize != null) {
        params = params.append('pageNumber', (page - 1).toString());
        params = params.append('pageSize', pageSize.toString());
      }
      if (searchTerm != null && fromdate != null && todate != null) {
        params = params.append('searchTerm', searchTerm);
        params = params.append('fromdate', fromdate);
        params = params.append('todate', todate);
      }
      return this.httpClient.get<any>(environment.baseUrl + 'billBHs/search', { observe: 'response', params })
      .pipe(map(response => {
        if (response.body != null) {
          paginatedResult.result = response.body.content;
          paginatedResult.pagination = {
          currentPage: response.body.pageable.pageNumber + 1,
          totalItems: response.body.totalElements,
          totalPages: response.body.totalPages,
          itemsPerPage: response.body.pageable.pageSize
        };
        }
        return paginatedResult;
      }));
  }

  getBillById(id: number): any {
    return this.httpClient.get(environment.baseUrl + 'billBHs/' + id);
  }

  deleteBill(id: number) {
    return this.httpClient.delete(environment.baseUrl + 'billBHs/' + id);
  }

  postBill(bill: HoaDonBanHang): any {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.post(environment.baseUrl + 'billBHs', bill, { headers: headers });
  }

  putBill(bill: HoaDonBanHang): any {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.put(environment.baseUrl + 'billBHs', bill, { headers: headers });
  }

  cancleBill(bill: HoaDonBanHang): any {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.put(environment.baseUrl + 'billBHs/cancle', bill, { headers: headers });
  }
}
