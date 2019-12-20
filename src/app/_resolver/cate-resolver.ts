import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { DanhMucSP } from '../_models/danhmucsp';
import { Observable, of } from 'rxjs';
import { CateProductService } from '../_services/cate-product.service';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CateProductResolver implements Resolve<DanhMucSP[]>{
    pageNumber = 1;
    pageSize = 4;
    constructor(
        private cateProdrService: CateProductService,
        private router: Router
    ) { }
    resolve(route: ActivatedRouteSnapshot): Observable<DanhMucSP[]> {
        return this.cateProdrService.getCateProductPage(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                console.log(error);
                this.router.navigate(['/admin/categories-prod']);
                return of(null);
            })
        );
    }
}