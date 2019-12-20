import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { SanPham } from '../_models/sanpham';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor( private httpClient: HttpClient ) { }
  getListProduct(): Observable<SanPham[]> {
    return this.httpClient.get<any>(environment.baseUrl + 'allproducts');
  }
  getProductPage(page?: number, pageSize?: number): Observable<PaginatedResult<SanPham[]>> {
    const paginatedResult: PaginatedResult<SanPham[]> = new PaginatedResult<SanPham[]>();
    let params = new HttpParams();
    if (page != null && pageSize != null) {
      params = params.append('pageNumber', (page - 1).toString());
      params = params.append('pageSize', pageSize.toString());
    }
    return this.httpClient.get<any>(environment.baseUrl + 'product', { observe: 'response', params })
      .pipe(map(response => {
        paginatedResult.result = response.body.content;
        paginatedResult.totalElements = response.body.totalElements;
        paginatedResult.pagination = {
          currentPage: response.body.pageable.pageNumber + 1,
          totalItems: response.body.totalElements,
          totalPages: response.body.totalPages,
          itemsPerPage: response.body.pageable.pageSize
        };
        return paginatedResult;
      }));
  }
  deleteProduct(id: number) {
    return this.httpClient.delete(environment.baseUrl + 'product/' + id);
  }
  getSearchListProduct(
    page?: number, pageSize?: number, searchTerm?: string):
    Observable<PaginatedResult<SanPham[]>> {
      const paginatedResult: PaginatedResult<SanPham[]> = new PaginatedResult<SanPham[]>();
      let params = new HttpParams();
      if (page != null && pageSize != null) {
        params = params.append('pageNumber', (page - 1).toString());
        params = params.append('pageSize', pageSize.toString());
      }
      if (searchTerm != null) {
        params = params.append('searchTerm', searchTerm);
      }
      return this.httpClient.get<any>(environment.baseUrl + 'product/search', { observe: 'response', params })
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
