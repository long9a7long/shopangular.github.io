import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';
import { KhachHang } from '../_models/khachhang';
import { CustomersService } from '../_services/customers.service';
import { error } from 'util';


@Injectable({
    providedIn: 'root'
})

export class CustomersDetailResolver implements Resolve<KhachHang> {
    constructor(
        private custService: CustomersService,
        private router: Router,
        private activeroute: ActivatedRoute
    ) { }

    resolve(route: ActivatedRouteSnapshot): any {
        return this.custService.getCustomer(route.paramMap.get('id')); // lấy router trong resolver
    }
}