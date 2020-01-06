import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { mergeMap } from 'rxjs/operators';
import { ProductService } from 'src/app/_services/product.service';
import { SanPham } from 'src/app/_models/sanpham';
import { ActivatedRoute, Router } from '@angular/router';
import { HoaDonBanHang } from 'src/app/_models/hoadonbanhang';
import { ChiTietHoaDonBH } from 'src/app/_models/chitiethoadonbh';
import { KhachHang } from 'src/app/_models/khachhang';
import { User } from 'src/app/_models/user';
import { BillsBhService } from 'src/app/_services/bills-bh.service';
import { BillDetailBhService } from 'src/app/_services/bill-detail-bh.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CustomersService } from 'src/app/_services/customers.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})
export class EditOrderComponent implements OnInit {

  modalRef: BsModalRef;
  asyncSelected: string;
  asyncSelectedKhachHang: string;
  typeaheadLoading: boolean;
  dataSource: Observable<any>;
  dataSourceKhachHang: Observable<any>;
  statesComplex: SanPham[];
  statesComplexKhachHang: KhachHang[];
  hoadonbanhang: HoaDonBanHang;
  listchitiethoadon: ChiTietHoaDonBH[];
  chitiethoadon: ChiTietHoaDonBH;
  khachhang: KhachHang;
  i: number;
  methodPay: number;
  giamgiaBill: number;
  khachduaBill: number;
  currentUser: User;
  customerAdd: KhachHang;
  ghichu: string;
  addCustomersForm = new FormGroup({
    makhachhang: new FormControl(''),
    ten: new FormControl(''),
    sdt: new FormControl(''),
    email: new FormControl(''),
    diachi: new FormControl(''),
    ngaysinh: new FormControl(''),
    gioitinh: new FormControl(''),
  });
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
    private modalService: BsModalService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private billService: BillsBhService,
    private detailBillService: BillDetailBhService,
    private customersService: CustomersService,
    private router: Router
    ) {}
    
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  ngOnInit() {
    this.i = 0;
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.activatedRoute.data.subscribe(data => {
      this.statesComplex = data.prods.filter(x => x.trangthai == 1);
      this.statesComplexKhachHang = data.custs;
      this.hoadonbanhang = data.bill;
      this.asyncSelectedKhachHang = data.bill.khachhang.makhachhang;
      this.listchitiethoadon = data.bill.chitiethoadons;
      this.giamgiaBill = data.bill.giamgia;
      this.khachduaBill = data.bill.khachhangtra;
      this.khachhang = data.bill.khachhang;
      this.methodPay = data.bill.loaithanhtoan;
      this.ghichu = data.bill.ghichu;
    });
    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.asyncSelected);
    })
    .pipe(
        mergeMap((token: string) => this.getStatesAsObservable(token))
    );
    this.dataSourceKhachHang = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.asyncSelectedKhachHang);
    })
    .pipe(
        mergeMap((token: string) => this.getStatesAsObservableKhachHang(token))
    );

  }


  getStatesAsObservable(token: string): Observable<any> {
    const query = new RegExp(token, 'i');

    return of(
      this.statesComplex.filter((state: any) => {
        return query.test(state.name) || query.test(state.masp);
      })
    );
  }
  getStatesAsObservableKhachHang(token: string): Observable<any> {
    const query = new RegExp(token, 'i');
    return of(
      this.statesComplexKhachHang.filter((state: any) => {
        return query.test(state.makhachhang) || query.test(state.ten) || query.test(state.sdt);
      })
    );
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    // init ChiTietHoaDon
    this.chitiethoadon = new ChiTietHoaDonBH();
    const prod = this.findProdByMaSP(e.value);
    if (prod !== undefined) {
      this.chitiethoadon.sanpham = prod;
      this.chitiethoadon.giamgia = 0;
      this.chitiethoadon.soluong = 1;
      this.chitiethoadon.gia = this.chitiethoadon.sanpham.giaban * this.chitiethoadon.soluong;
      this.i++;
      this.chitiethoadon.id_hoadon = this.hoadonbanhang.id;
      // add ChiTietHoaDon to HoaDon
      this.listchitiethoadon.push(this.chitiethoadon);
    }
    this.asyncSelected = '';
  }

  typeaheadOnSelectKhachHang(e: TypeaheadMatch): void {
    this.khachhang = this.findCustByMaKH( e.value);
  }

  findProdByMaSP(masp: string): SanPham {
    return this.statesComplex.filter(x => {
      return this.listchitiethoadon.find( y => y.sanpham.masp === masp ) == null;
    })
    .find( x => x.masp === masp );
  }

  findCustByMaKH(makh: string): KhachHang {
    return this.statesComplexKhachHang.find( x => x.makhachhang === makh );
  }

  getTotalProdCost() {
    let total = 0;
    this.listchitiethoadon.forEach(x => {
      total += x.sanpham.giaban * x.soluong - x.giamgia;
    });
    return total;
  }
  getTotalCost() {
    return this.getTotalProdCost() - this.giamgiaBill;
  }
  getDebt() {
    let tongphieuthu = 0;
    if (this.hoadonbanhang.phieuthus != null) {
      this.hoadonbanhang.phieuthus.forEach(element => {
        tongphieuthu += element.sotienthu;
      });
    }
    return this.getTotalCost() - this.khachduaBill - tongphieuthu ;
  }


  checkoutBill() {
    if (this.listchitiethoadon.length === 0) {
      alert('Bạn chưa thêm sản phẩm nào. Vui lòng thêm sản phẩm trước khi Lưu hóa đơn!');
    } else if (this.getDebt() < 0) {
      alert('Số tiền còn nợ không được âm!');
    } else {
      this.hoadonbanhang.ghichu = this.ghichu;
      this.hoadonbanhang.updatedAt = new Date();
      this.hoadonbanhang.giamgia = this.giamgiaBill;
      this.hoadonbanhang.khachhang = this.khachhang;
      this.hoadonbanhang.khachhangtra = this.khachduaBill;
      this.hoadonbanhang.loaithanhtoan = this.methodPay;
      this.hoadonbanhang.tonggia = this.getTotalCost();
      this.hoadonbanhang.trangthai = this.hoadonbanhang.trangthai == 0 ? 1 : this.hoadonbanhang.trangthai;
      this.hoadonbanhang.nguoisua = this.currentUser;
      this.hoadonbanhang.chitiethoadons = this.listchitiethoadon;
      if (!this.checkInputKhachhang()) {
        alert('Vui lòng chọn khách hàng');
      } else {
        this.billService.putBill(this.hoadonbanhang).subscribe(() => {
          alert('Lưu thành công');
          this.router.navigate(['/admin/orders']);
        },
        error => {
          if (error.status === 400) {
            alert('Số lượng sản phẩm trong Kho không đủ!');
          } else {
            alert('Không thể Lưu hóa đơn lúc này!');
            console.log(error);
          }
        });
      }
    }
  }

  deleteChitietBill(index: number) {
    this.listchitiethoadon.splice(index, 1);
  }

  checkInputKhachhang() {
    if (this.khachhang === undefined ) {return false; }
    return true;
  }

  addCustomer() {
    this.customerAdd =  new KhachHang();
    this.customerAdd.ten = this.addCustomersForm.controls['ten'].value;
    this.customerAdd.sdt = this.addCustomersForm.controls['sdt'].value;
    this.customerAdd.email = this.addCustomersForm.controls['email'].value;
    this.customerAdd.diachi = this.addCustomersForm.controls['diachi'].value;
    this.customerAdd.ngaysinh = this.addCustomersForm.controls['ngaysinh'].value;
    this.customerAdd.gioitinh = this.addCustomersForm.controls['gioitinh'].value;
    this.customersService.addCustomer(this.customerAdd).subscribe( next => {
      alert('Thêm thành công !');
      this.asyncSelectedKhachHang = next.makhachhang;
      this.khachhang = next;
      this.getListCustomers();
      this.modalRef.hide();
    }, error => {
        alert('Thêm thất bại');
        console.log(error);
      }, () => {});
  }

  getListCustomers() {
    this.customersService.getAllKHNonPag().subscribe(
        (data: KhachHang[]) => {
          this.statesComplexKhachHang = data;
      },
      error => console.log(error)
      );

  }

  completeBill() {
    // => status to 3
    this.saveBill(3);
  }

  deliveringBill() {
    // => status to 2
    this.saveBill(2);
  }

  onHoldBill() {
    // => status to 4
    this.saveBill(4);
  }

  cancleBill() {
    this.hoadonbanhang.updatedAt = new Date();
    this.hoadonbanhang.trangthai = 5;
    this.hoadonbanhang.ghichu = this.ghichu;
    this.hoadonbanhang.nguoisua = this.currentUser;
    this.billService.cancleBill(this.hoadonbanhang).subscribe(() => {
      alert('Lưu thành công');
      this.router.navigate(['/admin/orders']);
    },
    error => {
      if (error.status === 400) {
        alert('Số lượng sản phẩm trong Kho không đủ!');
      } else {
        alert('Không thể Lưu hóa đơn lúc này!');
        console.log(error);
      }
    });
  }

  saveBill(status: number) {
    if (this.listchitiethoadon.length === 0) {
      alert('Bạn chưa thêm sản phẩm nào. Vui lòng thêm sản phẩm trước khi Lưu hóa đơn!');
    } else if (this.getDebt() < 0) {
      alert('Số tiền còn nợ không được âm!');
    } else {
      this.hoadonbanhang.ghichu = this.ghichu;
      this.hoadonbanhang.updatedAt = new Date();
      this.hoadonbanhang.giamgia = this.giamgiaBill;
      this.hoadonbanhang.khachhang = this.khachhang;
      this.hoadonbanhang.khachhangtra = this.khachduaBill;
      this.hoadonbanhang.loaithanhtoan = this.methodPay;
      this.hoadonbanhang.tonggia = this.getTotalCost();
      this.hoadonbanhang.trangthai = status;
      this.hoadonbanhang.nguoisua = this.currentUser;
      this.hoadonbanhang.chitiethoadons = this.listchitiethoadon;
      if (!this.checkInputKhachhang()) {
        alert('Vui lòng chọn khách hàng');
      } else {
        this.billService.putBill(this.hoadonbanhang).subscribe(() => {
          alert('Lưu thành công');
          this.router.navigate(['/admin/orders']);
        },
        error => {
          if (error.status === 400) {
            alert('Số lượng sản phẩm trong Kho không đủ!');
          } else {
            alert('Không thể Lưu hóa đơn lúc này!');
            console.log(error);
          }
        });
      }
    }
  }
}
