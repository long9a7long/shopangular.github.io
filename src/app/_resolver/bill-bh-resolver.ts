import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HoaDonBanHang } from '../_models/hoadonbanhang';
import { BillsBhService } from '../_services/bills-bh.service';


@Injectable({
    providedIn: 'root'
})
export class BillBHResolver implements Resolve<HoaDonBanHang[]> {
    pageNumber = 1;
    pageSize = 4;
    constructor(
        private billbhService: BillsBhService,
        private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<HoaDonBanHang[]> {
        return this.billbhService.getListBill(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                console.log(error);
                this.router.navigate(['/admin']);
                return of(null);
            })
        );
    }
}
