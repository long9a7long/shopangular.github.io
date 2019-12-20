import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { KhachHang } from '../_models/khachhang';
import { KhachHangDTO } from '../_models/khachhangDTO';
@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor( private httpClient: HttpClient ) { }
  getAllKHNonPag(): Observable<KhachHang[]> {
    return this.httpClient.get<any>(environment.baseUrl + 'allcustomers');
  }

  getAllKhachHang(page?: number, pageSize?: number): Observable<PaginatedResult<KhachHangDTO[]>> {
    const paginatedResult: PaginatedResult<KhachHangDTO[]> = new PaginatedResult<KhachHangDTO[]>();
    let params = new HttpParams();
    if (page != null && pageSize != null) {
      params = params.append('pageNumber', (page - 1).toString());
      params = params.append('pageSize', pageSize.toString());
    }
    return this.httpClient.get<any>(environment.baseUrl + 'customers', { observe: 'response', params })
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

  getSearchKhachHang(page?: number, pageSize?: number, searchTerm?: string): Observable<PaginatedResult<KhachHangDTO[]>> {
    const paginatedResult: PaginatedResult<KhachHangDTO[]> = new PaginatedResult<KhachHangDTO[]>();
    let params = new HttpParams();
    if (page != null && pageSize != null) {
      params = params.append('pageNumber', (page - 1).toString());
      params = params.append('pageSize', pageSize.toString());
    }

    if (searchTerm != null || typeof(searchTerm) != 'undefined' ) {
      params = params.append('searchTerm', searchTerm);
    }

    return this.httpClient.get<any>(environment.baseUrl + 'customers/search', { observe: 'response', params })
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

  deleteCustomer(id: string) {
    return this.httpClient.delete(environment.baseUrl + 'customers/' + id);
  }

  addCustomer(customers: KhachHang): any {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.post(environment.baseUrl + 'customers', customers, { headers: headers });
  }

  getCustomer(makhachhang: string): any {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.get(environment.baseUrl + 'customers/' + makhachhang, { headers: headers });
  }

  getDebtCustomer(makhachhang: string): any {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.get(environment.baseUrl + 'customers/totaldebt/' + makhachhang, { headers: headers });
  }

}
