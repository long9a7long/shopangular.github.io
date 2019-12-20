import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { SanPham } from '../_models/sanpham';
import { Observable, of } from 'rxjs';
import { ProductService } from '../_services/product.service';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductResolver implements Resolve<SanPham[]>{
    pageNumber = 1;
    pageSize = 4;
    constructor(
        private prodrService: ProductService,
        private router: Router
    ) { }
    resolve(route: ActivatedRouteSnapshot): Observable<SanPham[]> {
        return this.prodrService.getProductPage(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                console.log(error);
                this.router.navigate(['/admin/products']);
                return of(null);
            })
        );
    }
}