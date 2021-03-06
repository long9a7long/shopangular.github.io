import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { DanhMucSP } from '../_models/danhmucsp';

@Injectable({
  providedIn: 'root'
})
export class CateProductService {
constructor( private httpClient: HttpClient ) { }

  getListCate(): Observable<DanhMucSP[]> {
    return this.httpClient.get<any>(environment.baseUrl + 'allcates');
  }
  getListCateArr(): Observable<DanhMucSP[]> {
    return this.httpClient.get<any>(environment.baseUrl + 'allcates', { observe: 'response' }).pipe(map(response => {
      return response.body;
    }));
  }
  getCateProductPage(page?: number, pageSize?: number): Observable<PaginatedResult<DanhMucSP[]>> {
    const paginatedResult: PaginatedResult<DanhMucSP[]> = new PaginatedResult<DanhMucSP[]>();
    let params = new HttpParams();
    if (page != null && pageSize != null) {
      params = params.append('pageNumber', (page - 1).toString());
      params = params.append('pageSize', pageSize.toString());
    }
    return this.httpClient.get<any>(environment.baseUrl + 'cates', { observe: 'response', params })
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
  addCateProduct(cateProd: DanhMucSP): Observable<any> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.post(environment.baseUrl + 'cates', cateProd, { headers: headers });
  }
  updateCateProduct(cateProd: DanhMucSP) {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.put(environment.baseUrl + 'cates', cateProd, { headers : headers });
  }
  deleteCateProduct(id: number) {
    return this.httpClient.delete(environment.baseUrl + 'cates/' + id);
  }
  getSearchListCateProduct(
    page?: number, pageSize?: number, searchTerm?: string):
    Observable<PaginatedResult<DanhMucSP[]>> {
      const paginatedResult: PaginatedResult<DanhMucSP[]> = new PaginatedResult<DanhMucSP[]>();
      let params = new HttpParams();
      if (page != null && pageSize != null) {
        params = params.append('pageNumber', (page - 1).toString());
        params = params.append('pageSize', pageSize.toString());
      }
      if (searchTerm != null) {
        params = params.append('searchTerm', searchTerm);
      }
      return this.httpClient.get<any>(environment.baseUrl + 'cate/search', { observe: 'response', params })
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
