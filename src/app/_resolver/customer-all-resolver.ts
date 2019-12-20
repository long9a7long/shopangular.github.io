import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KhachHang } from '../_models/khachhang';
import { CustomersService } from '../_services/customers.service';


@Injectable({
    providedIn: 'root'
})
export class AllCustomersResolver implements Resolve<KhachHang[]> {

    constructor(
        private custService: CustomersService,
        private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<KhachHang[]> {
        return this.custService.getAllKHNonPag();
    }
}
