import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { NhaCungCap } from '../_models/nhacungcap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class SupsProdService {

  constructor( private httpClient: HttpClient) { }
  getListSup(): Observable<NhaCungCap[]> {
    return this.httpClient.get<any>(environment.baseUrl + 'allSUPs');
  }
  getSupProductPage(page?: number, pageSize?: number): Observable<PaginatedResult<NhaCungCap[]>> {
    const paginatedResult: PaginatedResult<NhaCungCap[]> = new PaginatedResult<NhaCungCap[]>();
    let params = new HttpParams();
    if (page != null && pageSize != null) {
      params = params.append('pageNumber', (page - 1).toString());
      params = params.append('pageSize', pageSize.toString());
    }
    return this.httpClient.get<any>(environment.baseUrl + 'NCCs', { observe: 'response', params })
      .pipe(map(response => {
        paginatedResult.result = response.body.content;
        paginatedResult.pagination = {
          currentPage: response.body.pageable.pageNumber + 1,
          totalItems: response.body.totalElements,
          totalPages: response.body.totalPages,
          itemsPerPage: response.body.pageable.pageSize
        };
        return paginatedResult;
      }));
  }
  addSupProduct(supProd: NhaCungCap): Observable<any> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.post(environment.baseUrl + 'NCCs', supProd, { headers: headers });
  }
  updateSupsProduct(supProd: NhaCungCap) {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.put(environment.baseUrl + 'NCCs', supProd, { headers : headers });
  }
  deleteSupProduct(id: number) {
    return this.httpClient.delete(environment.baseUrl + 'NCCs/' + id);
  }
  getSearchListSupProduct(
    page?: number, pageSize?: number, searchTerm?: string):
    Observable<PaginatedResult<NhaCungCap[]>> {
      const paginatedResult: PaginatedResult<NhaCungCap[]> = new PaginatedResult<NhaCungCap[]>();
      let params = new HttpParams();
      if (page != null && pageSize != null) {
        params = params.append('pageNumber', (page - 1).toString());
        params = params.append('pageSize', pageSize.toString());
      }
      if (searchTerm != null) {
        params = params.append('searchTerm', searchTerm);
      }
      return this.httpClient.get<any>(environment.baseUrl + 'suppliers/search', { observe: 'response', params })
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

}
