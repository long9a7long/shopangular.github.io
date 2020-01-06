import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { NhaCungCap } from 'src/app/_models/nhacungcap';
import { SanPham } from 'src/app/_models/sanpham';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SupsProdService } from 'src/app/_services/sups-prod.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-suppliers-prod',
  templateUrl: './suppliers-prod.component.html',
  styleUrls: ['./suppliers-prod.component.scss']
})
export class SuppliersProdComponent implements OnInit {
  modalRefAddSupProd: BsModalRef;
  pagination: Pagination;
  listSupProds: NhaCungCap[];
  listProducts: SanPham[];
  searchTerm: string;
  baseDataListSupProds: NhaCungCap[];
  itemsPerPage = 4;
  supProdAdd: NhaCungCap;
  addSupProdForm = new FormGroup({
    tenncc: new FormControl('', Validators.required),
    sdt: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    diachi: new FormControl('', Validators.required)
  });
  constructor(
    private modalService: BsModalService,
    private supProdService: SupsProdService,
    private router: Router,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) { }
  openModal(template: TemplateRef<any>) {
    this.modalRefAddSupProd = this.modalService.show(template);
  }

  ngOnInit() {
    this.listSupProds = new Array();
    this.pagination = {
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      itemsPerPage: this.itemsPerPage
    };
    this.baseDataListSupProds = [];
    this.activatedRoute.data.subscribe(data => {
        this.listSupProds = data.supProd.result;
        this.pagination = data.supProd.pagination;
        this.baseDataListSupProds = data.supProd.result;
     });
    this.getListProduct();
  }
  getListProduct() {
    this.productService.getListProduct().subscribe(
      data => {
        this.listProducts = data;
      }
    );
  }
  createSup() {
    this.supProdAdd = new NhaCungCap();
    this.supProdAdd.tenncc = this.addSupProdForm.controls['tenncc'].value;
    this.supProdAdd.sdt = this.addSupProdForm.controls['sdt'].value;
    this.supProdAdd.email = this.addSupProdForm.controls['email'].value;
    this.supProdAdd.diachi = this.addSupProdForm.controls['diachi'].value;
    this.supProdService.addSupProduct(this.supProdAdd).subscribe(() => {
      alert('Thêm thành công !');
      this.getListSupProduct();
      this.modalRefAddSupProd.hide();
    },
    error => {
      alert('Lỗi');
      console.log(error);
    });
  }
  editSupsProduct(id: number) {
    this.supProdService.updateSupsProduct(this.listSupProds.find(x => x.id == id)).subscribe(() => {
      alert('Sửa thành công !');
      this.getListSupProduct();
    },
    error => {
      alert('Lỗi');
      console.log(error);
      }
    );
  }
  deleteSupProduct(id: number) {
    if (confirm('Bạn thực sự muốn xóa danh mục này?')) {
      this.supProdService.deleteSupProduct(id).subscribe(() => {
        this.getListSupProduct();
        alert('Xóa thành công!');
      },
        error => {
          console.log(error);
          alert('Xóa thất bại!');
        }
      );
    }
  }
  getListSupProduct() {
    this.supProdService.getSupProductPage(
      this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(
        (data: PaginatedResult<NhaCungCap[]>) => {
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
          this.updateListSupProduct(data.result);
        },
      error => console.log(error)
    );
  }
  updateListSupProduct(data) {
    this.listSupProds = data;
    this.baseDataListSupProds = [];
    if (data != null ) {
      this.listSupProds.forEach(x => {
        this.baseDataListSupProds.push(x);
      });
    }
    console.log(this.listSupProds);
  }
  resetFilter() {
    this.searchTerm = '';
  }
  search() {
        if (typeof (this.searchTerm) === 'undefined' || this.searchTerm === null) {
          this.searchTerm = '';
        }
        this.supProdService.getSearchListSupProduct (
          this.pagination.currentPage, this.pagination.itemsPerPage, this.searchTerm).subscribe(
            (data: PaginatedResult<NhaCungCap[]>) => {
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
              this.updateListSupProduct(data.result);
        },
          error => console.log(error)
        );
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.search();
  }
  getTotalProducts() {
    if (this.listProducts != null) {
      return this.listProducts.length;
    }
  }
  getTotalSups() {
    if (this.listSupProds != null) {
      return this.listSupProds.length;
    }
  }

}
