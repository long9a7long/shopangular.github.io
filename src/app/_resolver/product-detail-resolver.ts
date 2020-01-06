import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';
import { SanPham } from '../_models/sanpham';
import { ProductService } from '../_services/product.service';
import { error } from 'util';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})

export class ProductsDetailResolver implements Resolve<SanPham> {
    constructor(
        private prodService: ProductService,
        private router: Router,
        private activeroute: ActivatedRoute
    ) { }

    resolve(route: ActivatedRouteSnapshot): any {
        return this.prodService.getProduct(route.paramMap.get('masp')); // lấy router trong resolver
    }
}