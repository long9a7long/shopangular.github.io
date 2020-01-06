import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NhaCungCap } from '../_models/nhacungcap';
import { SupsProdService } from '../_services/sups-prod.service';

@Injectable({
    providedIn: 'root'
})
export class SupplierProductResolver implements Resolve<NhaCungCap[]>{
    pageNumber = 1;
    pageSize = 4;
    constructor(
        private supsProdrService: SupsProdService,
        private router: Router
    ) { }
    resolve(route: ActivatedRouteSnapshot): Observable<NhaCungCap[]> {
        return this.supsProdrService.getSupProductPage(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                console.log(error);
                this.router.navigate(['/admin/suppliers-prod']);
                return of(null);
            })
        );
    }
}
