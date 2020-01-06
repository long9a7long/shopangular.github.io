import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BillsBhService } from 'src/app/_services/bills-bh.service';
import { HoaDonBanHang } from 'src/app/_models/hoadonbanhang';
import { Pagination, PaginatedResult } from '../../_models/pagination';
import { ActivatedRoute, Router } from '@angular/router';
import { KhachHang } from 'src/app/_models/khachhang';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  fromdate: Date;
  pagination: Pagination;
  todate: Date;
  maxDate = new Date();
  listBills: HoaDonBanHang[];
  searchTerm: string;
  fitlerloaidonhang: number;
  baseDataListBills: HoaDonBanHang[];
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
  itemsPerPage = 10;
  listSubTrTableBill = [];

  constructor(
    private orderService: BillsBhService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.fitlerloaidonhang = 0;
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.listBills = new Array();
    this.pagination = {
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      itemsPerPage: this.itemsPerPage
    };
    this.resetFilter();
    this.baseDataListBills = [];
    this.activatedRoute.data.subscribe(data => {
      this.updateListBill(data.bills.result);
      this.pagination = data.bills.pagination;
    });

  }

  getTotalChiTietBillByIdBill(hoadon: HoaDonBanHang) {
    return typeof(hoadon.chitiethoadons) !== 'undefined'
      ? hoadon.chitiethoadons.length : 0;
  }

  toggleChiTietHoaDon(id: number) {
    this.listSubTrTableBill[id] = !this.listSubTrTableBill[id];
  }

  editBill(maHD: number) {
    this.router.navigate(['/admin/orders/' + maHD]);
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.search();
  }

  deleteBill(maHD: number) {
    if (confirm('Bạn thực sự muốn xóa Hóa đơn này?')) {
      this.orderService.deleteBill(maHD).subscribe(() => {
        this.getListBill();
        alert('Xóa thành công!');
      },
        error => {
          console.log(error);
          alert('Xóa thất bại!');
        }
      );
    }
  }

  search() {
    if (
      (this.fromdate == null && this.todate == null) ||
      ( typeof (this.todate) === 'undefined') && (typeof (this.fromdate) === 'undefined')) {
        this.orderService.getSearchListBill (
          this.pagination.currentPage, this.pagination.itemsPerPage, this.searchTerm, '', '').subscribe(
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
              this.updateListBill(data.result);
        },
          error => console.log(error)
        );
    } else {
      if (typeof (this.searchTerm) === 'undefined' || this.searchTerm === null) {
        this.searchTerm = '';
      }
      if (typeof (this.fromdate) === 'undefined' || this.fromdate === null) {
        this.fromdate = new Date();
      }
      if (typeof (this.todate) === 'undefined' || this.todate === null) {
        this.todate = new Date();
      }
      const date1 = this.fromdate.getDate() + '/' + (this.fromdate.getMonth() + 1) + '/' + this.fromdate.getFullYear();
      const date2 = (this.todate.getDate() + 1) + '/' + (this.todate.getMonth() + 1) + '/' + this.todate.getFullYear();
      this.orderService.getSearchListBill (
        this.pagination.currentPage, this.pagination.itemsPerPage, this.searchTerm, date1, date2).subscribe(
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
            this.updateListBill(data.result);
      },
        error => console.log(error)
      );
    }
  }

  filter() {
    if (this.fitlerloaidonhang == 2) {
      this.listBills = this.baseDataListBills.filter(this.isDebt);
    } else if (this.fitlerloaidonhang == 0) {
      this.listBills = this.baseDataListBills;
    } else {
      this.listBills = this.baseDataListBills.filter(this.isNonDebt);
    }
  }

  resetFilter() {
    this.searchTerm = '';
    this.fromdate = null;
    this.todate = null;
  }

  getBillOfWeek() {
    const start = this.getDateOfWeek(49, 2019);
    const end = this.getDateOfWeek(50, 2019);
    this.fromdate = start;
    this.todate = end;
    const date1 = start.getDate() + '/' + (start.getMonth() + 1) + '/' + start.getFullYear();
    const date2 = (end.getDate()) + '/' + (end.getMonth() + 1) + '/' + end.getFullYear();
    this.orderService.getSearchListBill (
      this.pagination.currentPage, this.pagination.itemsPerPage, this.searchTerm, date1, date2).subscribe(
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
          this.updateListBill(data.result);
    },
      error => console.log(error)
    );
  }
  getBillOfMonth() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 1, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), this.getDaysInMonth(now.getMonth() + 1, now.getFullYear()), 0, 0, 1, 0);
    this.fromdate = start;
    this.todate = end;
    const date1 = start.getDate() + '/' + (start.getMonth() + 1) + '/' + start.getFullYear();
    const date2 = end.getDate() + '/' + (end.getMonth() + 1) + '/' + end.getFullYear();
    this.orderService.getSearchListBill (
      this.pagination.currentPage, this.pagination.itemsPerPage, this.searchTerm, date1, date2).subscribe(
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
          this.updateListBill(data.result);
    },
      error => console.log(error)
    );
  }
  getBillOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1, 0, 0, 1, 0);
    const end = new Date(now.getFullYear(), 11, 31, 0, 0, 1, 0);
    this.fromdate = start;
    this.todate = end;
    const date1 = start.getDate() + '/' + (start.getMonth() + 1) + '/' + start.getFullYear();
    const date2 = end.getDate() + '/' + (end.getMonth() + 1) + '/' + end.getFullYear();
    this.orderService.getSearchListBill (
      this.pagination.currentPage, this.pagination.itemsPerPage, this.searchTerm, date1, date2).subscribe(
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
          this.updateListBill(data.result);
    },
      error => console.log(error)
    );
  }

  isDebt(hoadon: HoaDonBanHang) {
    return hoadon.tonggia - hoadon.giamgia - hoadon.khachhangtra > 0;
  }

  isNonDebt(hoadon: HoaDonBanHang) {
    return hoadon.tonggia - hoadon.giamgia - hoadon.khachhangtra <= 0;
  }

  getTotal() {
    let total = 0;
    if ( this.listBills != null ) {
      for (const bill of this.listBills) {
        total += bill.tonggia;
      }
    }
    return total;
  }

  getTotalDebt() {
    let total = 0;
    if (this.listBills != null) {
      for (const customerBillsDebt of this.listBills) {
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
  getTotalBills() {
    if (this.listBills != null) {
      return this.listBills.length;
    }
    return 0;
  }
  getListBill() {
    this.orderService.getListBill (
      this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(
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
          this.updateListBill(data.result);
    },
      error => console.log(error)
    );
  }

  getDateOfWeek(w, y) {
    const simple = new Date(y, 0, 1 + (w - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4) {
      ISOweekStart.setDate (simple.getDate() - simple.getDay() + 1);
    } else {
      ISOweekStart.setDate (simple.getDate() + 8 - simple.getDay());
    }
    return ISOweekStart;
  }

  getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  updateListBill(data) {
    this.listBills = data;
    this.baseDataListBills = [];
    this.listSubTrTableBill = [];
    if (data != null ) {
      this.listBills.forEach(x => {
        this.baseDataListBills.push(x);
        this.listSubTrTableBill.push(false);
      });

    }

  }

}
