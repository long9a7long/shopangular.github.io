import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HoaDonBanHang } from '../_models/hoadonbanhang';
import { BillsBhService } from '../_services/bills-bh.service';


@Injectable({
    providedIn: 'root'
})
export class EditBillResolver implements Resolve<HoaDonBanHang> {

    constructor(
      private billbhService: BillsBhService,
      private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<HoaDonBanHang> {
        return this.billbhService.getBillById(route.params.id).pipe(
            catchError(error => {
                console.log(error);
                this.router.navigate(['/admin/orders']);
                return of(null);
            })
        );
    }
}
