import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { HoaDonBanHang } from '../../../../_models/hoadonbanhang';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { DebtCustomerBillService } from 'src/app/_services/debt-customer-bill.service';
import { PhieuThu } from 'src/app/_models/phieuthu';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from 'src/app/_models/user';
import { KhachHang } from 'src/app/_models/khachhang';
@Component({
  selector: 'app-debt',
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.scss']
})
export class DebtComponent implements OnInit {
  @Input() listOrder: HoaDonBanHang[];

  @Output('chageToPurchaseHistory') change = new EventEmitter<boolean>();

  ngaythu: Date;
  receiptsAll: number;
  idkhachhang: string;
  listCusBillDebt: HoaDonBanHang[];
  itemsPerPage = 4;
  collection: number;
  pagination: Pagination;
  phieuthus: PhieuThu[];
  phieuthu: PhieuThu;
  proceeds: any[]; // số tiền thu
  methodPay: number;
  currentUser: User;
  currentCustomer: KhachHang;
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

  value: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private debtCusBillService: DebtCustomerBillService,
  ) { }

  ngOnInit() {
    this.receiptsAll = 0;
    this.ngaythu = new Date();
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.route.params.subscribe(params => {
      this.idkhachhang = params.id;
    });
    this.pagination = {
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      itemsPerPage: this.itemsPerPage
    };
    this.proceeds =  new Array();
    this.getCustomerBillsDebt(this.idkhachhang);
    this.methodPay = 1;
  }

  toggleToPurchaseHistory(value: boolean) {
    this.change.emit(value);
  }

  show() {
    if (this.listCusBillDebt != null && this.listCusBillDebt !== undefined) {
       return true;
    } else { return false; }
  }


  getCustomerBillsDebt(makhachhang: string) {
    this.debtCusBillService.getListCustomerBillDebt
    (makhachhang, this.pagination.currentPage, this.pagination.itemsPerPage ).subscribe(
      (data: PaginatedResult<HoaDonBanHang[]>) => {
        const totalItems = this.updateListDebt(data.result);
        if (data.pagination !== undefined) {
          this.pagination = data.pagination;
          data.pagination.totalItems = totalItems;
          data.pagination.totalPages = totalItems / this.itemsPerPage;
        } else {
            this.pagination = {
              currentPage: 1,
              totalItems: 0,
              totalPages: 0,
              itemsPerPage: this.itemsPerPage
            };
        }
      },
      error => console.log(error)
    );

  }
  updateListDebt(data) {
    this.proceeds = [];
    if (data != null) {
      this.listCusBillDebt = data;
      this.listCusBillDebt.forEach(x => {
        this.proceeds.push({
          'id':x.id,
          'value': 0
        });
      });
      return this.listCusBillDebt.length;
    }
    return 0;
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.getCustomerBillsDebt(this.idkhachhang);
  }

  reset() {
    this.receiptsAll = 0 ;
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
    return hoadonbanhang.tonggia - hoadonbanhang.khachhangtra - tongphieuthu  ;
  }


  receipts(id: number, hoadonbanhang: HoaDonBanHang) {
    this.collection = this.proceeds.find(x => x.id === id).value;
    if (this.collection > this.getDebt(hoadonbanhang)) {
      alert('Số tiền thu lớn hơn số tiền nợ!');
      this.proceeds.find(x => x.id === id).value = this.getDebt(hoadonbanhang);
      return;
    }
    this.phieuthu = new PhieuThu();
    this.phieuthu.maphieuthu = '';
    this.phieuthu.idhoadon = id;
    this.phieuthu.sotienthu = this.collection;
    this.phieuthu.ngaythu = this.ngaythu;
    this.phieuthu.nguoithu = this.currentUser.manhanvien;
    this.phieuthu.hinhthucthu = this.methodPay;
    this.debtCusBillService.postReceipts(this.phieuthu).subscribe (data => {
      alert('Thu thành công');
      this.getCustomerBillsDebt(this.idkhachhang);
    }, error => {
      alert('Thu thất bại');
    }, () => {});
  }

  receiptsAllDebt() {
    this.proceeds.forEach(x => {
      this.phieuthu = new PhieuThu();
      this.phieuthu.maphieuthu = '';
      this.phieuthu.nguoithu = this.currentUser.manhanvien;
      this.phieuthu.hinhthucthu =  this.methodPay;
      this.phieuthu.ngaythu = new Date();
      this.phieuthu.idhoadon = x.id;
      this.phieuthu.sotienthu = x.value;
      if (this.phieuthu.sotienthu != 0 ) {
        this.debtCusBillService.postReceipts(this.phieuthu).subscribe ();
      }
    });
    alert('Thu nợ thành công');
    this.getCustomerBillsDebt(this.idkhachhang);
    this.reset();
    this.toggleToPurchaseHistory(true);
  }
  onChangeReceptAll() {
    this.proceeds.forEach(x => x.value = 0);
    const tongno =  this.getTotalDebt();
    if (this.receiptsAll > tongno) {
      this.receiptsAll = tongno;
    }
    let totalMoney = this.receiptsAll;
    let chimuc = 0;
    while (totalMoney > 0) {
      if (this.listCusBillDebt[chimuc] != undefined ) {
        let no = this.getDebt(this.listCusBillDebt[chimuc]);
        if (totalMoney >= no) {
          this.proceeds[chimuc].value = no;
          totalMoney -= no;
        } else {
          this.proceeds[chimuc].value = totalMoney;
          totalMoney = 0;
        }
        chimuc++;
      }
    }
  }
  checkDebtBill(hoadonbanhang: HoaDonBanHang) {
    let tongphieuthu = 0;
    if (hoadonbanhang.phieuthus != null) {
      hoadonbanhang.phieuthus.forEach(element => {
        tongphieuthu += element.sotienthu;
      });
    }
    return hoadonbanhang.tonggia - hoadonbanhang.khachhangtra - tongphieuthu > 0 ;
  }

}
