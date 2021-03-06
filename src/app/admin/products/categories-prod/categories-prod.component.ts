import { Component, OnInit, TemplateRef, ɵisObservable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { DanhMucSP } from 'src/app/_models/danhmucsp';
import { Router, ActivatedRoute } from '@angular/router';
import { CateProductService } from 'src/app/_services/cate-product.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-categories-prod',
  templateUrl: './categories-prod.component.html',
  styleUrls: ['./categories-prod.component.scss']
})
export class CategoriesProdComponent implements OnInit {
  modalRefAddCateProd: BsModalRef;
  pagination: Pagination;
  listCateProds: DanhMucSP[];
  searchTerm: string;
  baseDataListCateProds: DanhMucSP[];
  itemsPerPage = 4;
  cateAdd: DanhMucSP;
  addCateForm = new FormGroup({
    tendanhmuc: new FormControl('', Validators.required),
    motadanhmuc: new FormControl('', Validators.required)
  });
  constructor(
    private modalService: BsModalService,
    private cateProdService: CateProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  openModal(template: TemplateRef<any>) {
    this.modalRefAddCateProd = this.modalService.show(template);
  }

  ngOnInit() {
    this.listCateProds = new Array();
    this.pagination = {
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      itemsPerPage: this.itemsPerPage
    };
    this.baseDataListCateProds = [];
    this.activatedRoute.data.subscribe(data => {
        this.listCateProds = data.cateProduct.result;
        this.pagination = data.cateProduct.pagination;
     });
  }
  createCate() {
    this.cateAdd = new DanhMucSP();
    this.cateAdd.tendanhmuc = this.addCateForm.controls['tendanhmuc'].value;
    this.cateAdd.motadanhmuc = this.addCateForm.controls['motadanhmuc'].value;
    this.cateProdService.addCateProduct(this.cateAdd).subscribe(() => {
      alert('Thêm thành công !');
      this.getListCateProduct();
      this.modalRefAddCateProd.hide();
    },
    error => {
      alert('Lỗi');
      console.log(error);
    });
  }
  editCateProduct(maDM: number) {
    this.cateProdService.updateCateProduct(this.listCateProds.find(x => x.id == maDM)).subscribe(() => {
      alert('Sửa thành công !');
      this.getListCateProduct();
    },
    error => {
      alert('Lỗi');
      console.log(error);
      }
    );
  }
  deleteCateProduct(maDM: number) {
    if (confirm('Bạn thực sự muốn xóa danh mục này?')) {
      this.cateProdService.deleteCateProduct(maDM).subscribe(() => {
        this.getListCateProduct();
        alert('Xóa thành công!');
      },
        error => {
          console.log(error);
          alert('Xóa thất bại!');
        }
      );
    }
  }
  getListCateProduct() {
    this.cateProdService.getCateProductPage(
      this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(
        (data: PaginatedResult<DanhMucSP[]>) => {
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
          this.updateListCateProduct(data.result);
        },
      error => console.log(error)
    );
  }
  updateListCateProduct(data) {
    this.listCateProds = data;
    this.baseDataListCateProds = [];
    if (data != null ) {
      this.listCateProds.forEach(x => {
        this.baseDataListCateProds.push(x);
      });
    }
    console.log(this.listCateProds);
  }
  resetFilter() {
    this.searchTerm = '';
  }
  search() {
        if (typeof (this.searchTerm) === 'undefined' || this.searchTerm === null) {
          this.searchTerm = '';
        }
        this.cateProdService.getSearchListCateProduct (
          this.pagination.currentPage, this.pagination.itemsPerPage, this.searchTerm).subscribe(
            (data: PaginatedResult<DanhMucSP[]>) => {
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
              this.updateListCateProduct(data.result);
        },
          error => console.log(error)
        );
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.search();
  }

}
