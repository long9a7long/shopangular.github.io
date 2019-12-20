import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { User } from '../../_models/user';
import { BillsBhService } from 'src/app/_services/bills-bh.service';
import { ProductService } from 'src/app/_services/product.service';
import { CustomersService } from 'src/app/_services/customers.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalBill: number;
  totalCust: number;
  totalProd: number;
  totalMoney: number;
  constructor(
    private authService: AuthService,
    private billService: BillsBhService,
    private prodService: ProductService,
    private custService: CustomersService) {}
  ngOnInit() {
    this.totalBill = 0;
    this.totalCust = 0;
    this.totalProd = 0;
    this.totalMoney = 0;
    this.getTotalBill();
    this.getTotalProd();
    this.getTotalCust();
  }

  getTotalBill() {
    return this.billService.getListBill(1, 1 ).subscribe(data => {
      if (data != null) {
        this.totalBill = data.totalElements;
      }
      return 0;
    });
  }
  getTotalProd() {
    return this.prodService.getProductPage(1, 1 ).subscribe(data => {
      if (data != null) {
        this.totalProd = data.totalElements;
      }
      return 0;
    });
  }
  getTotalCust() {
    return this.custService.getAllKhachHang(1, 1 ).subscribe(data => {
      if (data != null) {
        this.totalCust = data.totalElements;
      }
      return 0;
    });
  }

}
