import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UsersService } from 'src/app/_services/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomersService } from 'src/app/_services/customers.service';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { KhachHang } from 'src/app/_models/khachhang';
import { KhachHangDTO } from 'src/app/_models/khachhangDTO';
import { error } from 'util';
import { TabHeadingDirective } from 'ngx-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})

export class CustomersComponent implements OnInit {

  pagination: Pagination;
  searchkey: string;
  modalRef: BsModalRef;
  itemsPerPage = 2;
  listCustomers: KhachHangDTO[];
  baseDataListCustomers: KhachHangDTO[];
  fitlerloaikhachhang: number;
  searchTerm: string;
  customer: KhachHang;
  ten: string;
  makhachhang: string;
  sdt: string;
  email: string;
  diachi: string;
  ngaysinh: Date;
  gioitinh: boolean;
  haveCus: boolean;
  addCustomersForm = new FormGroup({
    makhachhang: new FormControl(''),
    ten: new FormControl('', [
      Validators.required,
    ]),
    sdt: new FormControl('', [
      Validators.required,
      Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
    ]),
    diachi: new FormControl('', [
      Validators.required,
    ]),
    ngaysinh: new FormControl('', [Validators.required]),
    gioitinh: new FormControl(''),
  });

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private customersService: CustomersService) { }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  ngOnInit() {
    this.searchTerm = '' ;
    this.fitlerloaikhachhang = 0;
    this.activatedRoute.data.subscribe(data => {
      if (data.customers !== undefined && data.customers !== null) {
        this.listCustomers = data.customers.result;
        this.pagination = data.customers.pagination;
      }
    });
    this.baseDataListCustomers = this.listCustomers;
  }

  show() {
    if (this.listCustomers != null && this.listCustomers !== undefined) {
       return true;
    } else { return false; }
  }

  search() {
    this.customersService.getSearchKhachHang(
      this.pagination.currentPage, this.pagination.itemsPerPage, this.searchTerm ).subscribe(
        (data: PaginatedResult<KhachHangDTO[]>) => {
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

  getListCustomers() {
    let currenPage = 1;
    if (this.pagination !== undefined && this.pagination !== null) {
      this.itemsPerPage = this.pagination.itemsPerPage;
      currenPage = this.pagination.currentPage;
    }
    this.customersService.getAllKhachHang(
      currenPage, this.itemsPerPage ).subscribe(
        (data: PaginatedResult<KhachHangDTO[]>) => {
          if (data !== undefined && data !== null) {
            this.pagination = data.pagination;
            this.updateListBill(data.result);
          } else {
              this.pagination = {
                currentPage: 1,
                totalItems: 0,
                totalPages: 0,
                itemsPerPage: this.itemsPerPage
              };
              this.updateListBill(null);
          }
      },
      error => console.log(error)
      );

  }

  editCustomer(makhachhang: string) {
    this.router.navigate(['/admin/customers/' + makhachhang ]);
   }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.search();
  }

  getTotalCustomers() {
    if (this.listCustomers != null) {
      return this.listCustomers.length;
    }
  }
  getTotalMoney() {
    let total = 0;
    if (this.listCustomers != null) {
      for (const customers of this.listCustomers) {
        total += customers.tonggia;
      }
    }
    return total;
  }

  getTotalDet() {
    let total = 0;
    if (this.listCustomers != null) {
      for (const customers of this.listCustomers) {
        total += customers.tongno;
      }
    }
    return total;
  }

  filter() {
    if (this.fitlerloaikhachhang == 1) {
      this.listCustomers = this.baseDataListCustomers.filter(this.isNonDebt);
    } else if (this.fitlerloaikhachhang == 0) {
      this.listCustomers = this.baseDataListCustomers;
    } else {
      this.listCustomers = this.baseDataListCustomers.filter(this.isDebt);
    }
  }

  isNonDebt(customers: KhachHangDTO) {
    return customers.createdAt != null  ;
  }

  isDebt(customers: KhachHangDTO) {
    return customers.tongno > 0 ;
  }

  updateListBill(data) {
    this.haveCus = false;
    this.listCustomers = data; // lưu dữ liệu bên html
    this.baseDataListCustomers = []; // lưu dữ liệu gốc
    if (data != null ) {
      this.listCustomers.forEach(x => {
        this.baseDataListCustomers.push(x);
      });
      this.haveCus = true;
    }
  }


  deleteCustomer(makhachhang: string) {
    if (confirm('Bạn có thực sự muốn xóa khách hàng này ?')) {
      this.customersService.deleteCustomer(makhachhang).subscribe(() => {
        this.getListCustomers();
        alert('Xóa thành công !');
      },
        error => {
          console.log(error);
          alert('Xóa thất bại !');
        }
    );
    }
  }

  addCustomer() {
    this.customer =  new KhachHang();
    this.customer.ten = this.addCustomersForm.controls['ten'].value;
    this.customer.sdt = this.addCustomersForm.controls['sdt'].value;
    this.customer.email = this.addCustomersForm.controls['email'].value;
    this.customer.diachi = this.addCustomersForm.controls['diachi'].value;
    this.customer.ngaysinh = this.addCustomersForm.controls['ngaysinh'].value;
    this.customer.gioitinh = this.addCustomersForm.controls['gioitinh'].value;
    this.customersService.addCustomer(this.customer).subscribe( next => {
      alert('Thêm thành công !');
      this.getListCustomers();
      this.modalRef.hide();
      this.addCustomersForm.reset();
    }, error => {
      alert('Thêm thất bại');
      console.log(error);
      }, () => {});
  }




}
