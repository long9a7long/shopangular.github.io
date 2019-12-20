import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KhachHang } from '../_models/khachhang';
import { CustomersService } from '../_services/customers.service';
import { KhachHangDTO } from '../_models/khachhangDTO';


@Injectable({
    providedIn: 'root'
})
export class CustomersResolver implements Resolve<KhachHangDTO[]> {

    pageNumber = 1;
    pageSize = 4;
    constructor(
        private custService: CustomersService,
        private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<KhachHangDTO[]> {
        return this.custService.getAllKhachHang(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                console.log(error);
                this.router.navigate(['/admin/customers']);
                return of(null);
            })
        );
    }

    
}
