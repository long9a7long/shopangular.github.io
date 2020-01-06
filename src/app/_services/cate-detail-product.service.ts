import { Injectable } from '@angular/core';
import { ChiTietDanhMuc } from '../_models/chitietdanhmuc';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CateDetailProductService {
constructor(
  private httpClient: HttpClient,
  private http: HttpClient
) { }

  addCateDetailProd(catedetailprod: ChiTietDanhMuc[]): Observable<any> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.post(environment.baseUrl + 'detailCate', catedetailprod, { headers: headers });
  }
  updateCateDetailProd(catedetailprod: ChiTietDanhMuc) {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.put(environment.baseUrl + 'detailCate', catedetailprod, { headers : headers });
  }
}
