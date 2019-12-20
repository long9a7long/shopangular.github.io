import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { HoaDonBanHang } from '../../../../_models/hoadonbanhang';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { DebtCustomerBillService } from 'src/app/_services/debt-customer-bill.service';
import { PhieuThu } from 'src/app/_models/phieuthu';
@Component({
  selector: 'app-debt',
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.scss']
})
export class DebtComponent implements OnInit {
  @Input() listOrder: HoaDonBanHang[];
  @Output('chageToPurchaseHistory') change = new EventEmitter<boolean>();

  id: string;
  listCusBillDebt: HoaDonBanHang[];
  itemsPerPage = 4;
  baseDataListBills: HoaDonBanHang[];
  pagination: Pagination;
  phieuthus: PhieuThu[];
  phieuthu: PhieuThu;
  listMethodBill = [
    'Tiền mặt',
    'Thẻ',
    'Chuyển khoản'
  ];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private debtCusBillService: DebtCustomerBillService,
  ) { }

  ngOnInit() {
    this.listCusBillDebt = new Array();
    this.baseDataListBills = [];
    this.route.params.subscribe(params => {
      this.id = params.id;
    });
    this.pagination = {
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      itemsPerPage: this.itemsPerPage
    };
    this.getCustomerBillsDebt(this.id);
  }

  toggleToPurchaseHistory(value: boolean) {
    this.change.emit(value);
  }

  debt(mahoadon: string) {
    
  }

  getCustomerBillsDebt(makhachhang: string) {
    this.debtCusBillService.getListCustomerBillDebt
    (makhachhang, this.pagination.currentPage, this.pagination.itemsPerPage ).subscribe(
      (data: PaginatedResult<HoaDonBanHang[]>) => {
        if (typeof(data.pagination) !== 'undefined') {
          this.pagination = data.pagination;
        } else {
            this.pagination = {
              currentPage: 1,
              totalItems: 0,
              totalPages: 0,
              itemsPerPage: this.itemsPerPage
            };
        }
        this.updateListDebt(data.result);
      },
      error => console.log(error)
    );

  }
  updateListDebt(data) {
    this.listCusBillDebt = data;
    this.baseDataListBills = [];
    if (data != null ) {
      this.listCusBillDebt.forEach(x => {
        this.baseDataListBills.push(x);
      });
    }
    console.log(data);
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.getCustomerBillsDebt(this.id);
  }

  getTotalCusBill() {
    if (this.listCusBillDebt != null) {
      return this.listCusBillDebt.length;
    }
  }

  getTotalMoney() {
    let total = 0;
    if (this.listCusBillDebt != null) {
      for (const customerBillsDebt of this.listCusBillDebt) {
        total += customerBillsDebt.tonggia;
      }
    }
    return total;
  }

  getTotalDebt() {
    let total = 0;
    if (this.listCusBillDebt != null) {
      for (const customerBillsDebt of this.listCusBillDebt) {
        total += this.getDebt(customerBillsDebt);
      }
    }
    return total;
  }

  getDebt(hoadonbanhang: HoaDonBanHang) {
    let tongphieuthu = 0;
    if (hoadonbanhang.phieuthus != null) {
      hoadonbanhang.phieuthus.forEach(element => {
        tongphieuthu += element.sotienthu;
      });
    }
    return hoadonbanhang.tonggia - hoadonbanhang.khachhangtra - tongphieuthu ;
  }

}
