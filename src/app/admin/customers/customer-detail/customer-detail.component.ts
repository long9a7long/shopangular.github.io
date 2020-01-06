import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HoaDonBanHang } from '../../../_models/hoadonbanhang';
import { KhachHang } from 'src/app/_models/khachhang';
import { CustomersService } from 'src/app/_services/customers.service';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DebtCustomerBillService } from 'src/app/_services/debt-customer-bill.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
  currentCus: KhachHang;
  cusUpdate: KhachHang;
  id: string;
  pagination: Pagination;
  modalRef: BsModalRef;
  isPurchaseHistory: boolean;
  listOrder: HoaDonBanHang[];
  usersdetail: KhachHang;
  itemsPerPage = 4;
  baseDataListProds: HoaDonBanHang[];
  listCusBill: HoaDonBanHang[];
  activatedRoute: any;

  listStatusBill = [
    'Khởi tạo',
    'Hoàn thành'
  ];
  profileForm = new FormGroup({
    makhachhang: new FormControl({value: '', disabled: true}),
    ten:  new FormControl('', Validators.required),
    sdt:  new FormControl(''),
    email:  new FormControl(''),
    diachi:  new FormControl(''),
    gioitinh:  new FormControl(''),
    ngaysinh:  new FormControl(''),
  });


  constructor(
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private router: Router,
    private debtCustomerBillService: DebtCustomerBillService,
  ) {}

  openModal(template: TemplateRef<any>, masp: string) {
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit() {
    this.isPurchaseHistory = true;

    this.route.data.subscribe( data => {
      this.usersdetail = data.khachhang;
    });
    this.route.params.subscribe(params => {
      this.id = params.id;
    });

    this.cusUpdate =  this.usersdetail;
    this.updateValueProfileForm();

  }

  emitChangeDebt(event: boolean) {
    this.isPurchaseHistory = event;
  }


  updateListProduct(data) {
    this.listCusBill = data;
    this.baseDataListProds = [];
    if (data != null ) {
      this.listCusBill.forEach(x => {
        this.baseDataListProds.push(x);
      });
    }
  }

  updateValueProfileForm() {
    this.profileForm.controls['makhachhang'].setValue(this.usersdetail.makhachhang);
    this.profileForm.controls['ten'].setValue(this.usersdetail.ten);
    this.profileForm.controls['sdt'].setValue(this.usersdetail.sdt);
    this.profileForm.controls['email'].setValue(this.usersdetail.email);
    this.profileForm.controls['diachi'].setValue(this.usersdetail.diachi);
    this.profileForm.controls['gioitinh'].setValue(this.usersdetail.gioitinh ? 1 : 0);
    const ngsinh = new Date(this.usersdetail.ngaysinh);
    this.profileForm.controls['ngaysinh'].setValue(ngsinh);
  }

  updateCustomer() {
    this.cusUpdate.makhachhang = this.usersdetail.makhachhang;
    this.cusUpdate.ten = this.profileForm.controls['ten'].value;
    this.cusUpdate.sdt = this.profileForm.controls['sdt'].value;
    this.cusUpdate.email = this.profileForm.controls['email'].value;
    this.cusUpdate.diachi = this.profileForm.controls['diachi'].value;
    this.cusUpdate.gioitinh = this.profileForm.controls['gioitinh'].value;
    this.cusUpdate.ngaysinh = this.profileForm.controls['ngaysinh'].value;
    this.debtCustomerBillService.updateCustomer(this.cusUpdate).subscribe(next => {
      this.currentCus = this.cusUpdate;
      alert('Update thành công');
      this.router.navigate(['/admin/customers/' + this.currentCus.makhachhang]);
    }, error => {
      alert('Update Fail');
    }, () => {});
  }
}
