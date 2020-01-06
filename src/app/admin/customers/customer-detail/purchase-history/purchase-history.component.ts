import { Component, OnInit, Output, Input, EventEmitter  } from '@angular/core';
import { HoaDonBanHang } from '../../../../_models/hoadonbanhang';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseHistoryService } from 'src/app/_services/purchase-history.service';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.scss']
})
export class PurchaseHistoryComponent implements OnInit {
  @Input() listOrder: HoaDonBanHang[];
  
  @Output('chageToDebt') change = new EventEmitter<boolean>();

  id: string;
  pagination: Pagination;
  modalRef: BsModalRef;
  isPurchaseHistory: boolean;
  itemsPerPage = 4;
  baseDataListBills: HoaDonBanHang[];
  listCusBill: HoaDonBanHang[];
  activatedRoute: ActivatedRoute;
  listMethodBill = [
    'Tiền mặt',
    'Thẻ',
    'Chuyển khoản'
  ];
  listStatusBill = [
    'Khởi tạo',
    'Đang xử lý',
    'Đang giao',
    'Hoàn thành',
    'Tạm dừng',
    'Đã hủy'
  ];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseHistoryService: PurchaseHistoryService
  ) {}

  ngOnInit() {
    this.listCusBill = new Array();
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
    this.getCustomerBills(this.id);
  }


  toggleToDebt(value: boolean) {
    this.change.emit(value);
  }

  show() {
    if (this.listCusBill != null || this.listCusBill !== undefined) {
       return true;
    } else { return false; }
  }

  getCustomerBills(makhachhang: string) {
    this.purchaseHistoryService.getListCustomerBill (
      makhachhang, this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(
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
          this.updateListPurchase(data.result);
        },
        error => console.log(error)
      );
  }

  updateListPurchase(data) {
    this.listCusBill = data;
    this.baseDataListBills = [];
    if (data != null ) {
      this.listCusBill.forEach(x => {
        this.baseDataListBills.push(x);
      });
    }
  }

  editCustomer(mahoadon: string) {
    this.router.navigate(['/admin/orders/' + mahoadon ]);
  }

  getTotalCusBill() {
    if (this.listCusBill != null) {
      return this.listCusBill.length;
    }
  }

  getTotalMoney() {
    let total = 0;
    if (this.listCusBill != null) {
      for (const customerBills of this.listCusBill) {
        total += customerBills.tonggia;
      }
    }
    return total;
  }

  getTotalDebt() {
    let total = 0;
    if (this.listCusBill != null) {
      for (const customerBillsDebt of this.listCusBill) {
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

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.getCustomerBills(this.id);
  }
}
