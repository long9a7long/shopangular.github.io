import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { SanPham } from '../_models/sanpham';
import { Observable, of } from 'rxjs';
import { ProductService } from '../_services/product.service';
import { catchError } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class ProductsResolver implements Resolve<SanPham[]> {

    constructor(
        private prodrService: ProductService,
        private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<SanPham[]> {
        return this.prodrService.getListProduct().pipe(
            catchError(error => {
                console.log(error);
                this.router.navigate(['/admin/orders']);
                return of(null);
            })
        );
    }
}
