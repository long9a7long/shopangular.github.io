import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NhaSanXuat } from 'src/app/_models/nhasanxuat';
import { ManufProdService } from 'src/app/_services/manuf-prod.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SanPham } from 'src/app/_models/sanpham';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-manuf-prod',
  templateUrl: './manuf-prod.component.html',
  styleUrls: ['./manuf-prod.component.scss']
})
export class ManufProdComponent implements OnInit {
  modalRefAddManuProd: BsModalRef;
  pagination: Pagination;
  listManuProds: NhaSanXuat[];
  listProducts: SanPham[];
  searchTerm: string;
  baseDataListManuProds: NhaSanXuat[];
  itemsPerPage = 4;
  manuProdAdd: NhaSanXuat;
  manuProEdit: NhaSanXuat;
  addManuProdForm = new FormGroup({
    tennsx: new FormControl('', Validators.required)
  });
  constructor(
    private modalService: BsModalService,
    private manuProdService: ManufProdService,
    private router: Router,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) { }
  openModal(template: TemplateRef<any>) {
    this.modalRefAddManuProd = this.modalService.show(template);
  }
  ngOnInit() {
    this.listManuProds = new Array();
    this.pagination = {
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      itemsPerPage: this.itemsPerPage
    };
    this.baseDataListManuProds = [];
    this.activatedRoute.data.subscribe(data => {
        this.listManuProds = data.manuProd.result;
        this.pagination = data.manuProd.pagination;
        this.baseDataListManuProds = data.manuProd.result;
     });
    this.getListProduct();
  }
  createManu() {
    this.manuProdAdd = new NhaSanXuat();
    this.manuProdAdd.tennsx = this.addManuProdForm.controls['tennsx'].value;
    this.manuProdService.addManuProduct(this.manuProdAdd).subscribe(() => {
      alert('Thêm thành công !');
      this.getListManuProduct();
      this.modalRefAddManuProd.hide();
    },
    error => {
      alert('Lỗi');
      console.log(error);
    });
  }
  editManuProduct(id: number) {
    this.manuProdService.updateManuProduct(this.listManuProds.find(x => x.id == id)).subscribe(() => {
        alert('Sửa thành công !');
        this.getListManuProduct();
      },
      error => {
        alert('Lỗi');
        console.log(error);
      }
    );
  }
  deleteManuProduct(maNSX: number) {
    if (confirm('Bạn thực sự muốn xóa danh mục này?')) {
      this.manuProdService.deleteManuProduct(maNSX).subscribe(() => {
        this.getListManuProduct();
        alert('Xóa thành công!');
      },
        error => {
          console.log(error);
          alert('Xóa thất bại!');
        }
      );
    }
  }
  getListManuProduct() {
    this.manuProdService.getManuProductPage(
      this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(
        (data: PaginatedResult<NhaSanXuat[]>) => {
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
          this.updateListManuProduct(data.result);
        },
      error => console.log(error)
    );
  }
  updateListManuProduct(data) {
    this.listManuProds = data;
    this.baseDataListManuProds = [];
    if (data != null ) {
      this.listManuProds.forEach(x => {
        this.baseDataListManuProds.push(x);
      });
    }
    console.log(this.listManuProds);
  }
  getListProduct() {
    this.productService.getListProduct().subscribe(
      data => {
        this.listProducts = data;
      }
    );
  }
  resetFilter() {
    this.searchTerm = '';
  }
  search() {
        if (typeof (this.searchTerm) === 'undefined' || this.searchTerm === null) {
          this.searchTerm = '';
        }
        this.manuProdService.getSearchListManuProduct (
          this.pagination.currentPage, this.pagination.itemsPerPage, this.searchTerm).subscribe(
            (data: PaginatedResult<NhaSanXuat[]>) => {
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
              this.updateListManuProduct(data.result);
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
  getTotalManuf() {
    if (this.listManuProds != null) {
      return this.listManuProds.length;
    }
  }
}
