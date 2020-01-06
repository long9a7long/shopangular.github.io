import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ManufProdService } from '../_services/manuf-prod.service';
import { NhaSanXuat } from '../_models/nhasanxuat';

@Injectable({
    providedIn: 'root'
})
export class ManuProductResolver implements Resolve<NhaSanXuat[]>{
    pageNumber = 1;
    pageSize = 4;
    constructor(
        private manuProdrService: ManufProdService,
        private router: Router
    ) { }
    resolve(route: ActivatedRouteSnapshot): Observable<NhaSanXuat[]> {
        return this.manuProdrService.getManuProductPage(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                console.log(error);
                this.router.navigate(['/admin/manuf-prod']);
                return of(null);
            })
        );
    }
}
