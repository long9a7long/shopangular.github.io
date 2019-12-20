import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { SanPham } from 'src/app/_models/sanpham';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  modalRefAddProd: BsModalRef;
  pagination: Pagination;
  listProds: SanPham[];
  searchTerm: string;
  fitlerdanhmucsp: number;
  fitlernhasx: number;
  baseDataListProds: SanPham[];
  filterStatus: number;
  listStatusProd = [
    'Đang kinh doanh',
    'Đã ngừng kinh doanh'
  ];
  itemsPerPage = 4;
  listSubTrTableProd = [];
  constructor(
    private modalService: BsModalService,
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  openModal(template: TemplateRef<any>) {
    this.modalRefAddProd = this.modalService.show(template);
  }
  ngOnInit() {
    this.fitlerdanhmucsp = 0;
    this.fitlernhasx = 0;
    this.filterStatus = 0;
    this.listProds = new Array();
    this.pagination = {
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      itemsPerPage: this.itemsPerPage
    };
    this.resetFilter();
    this.baseDataListProds = [];
    this.activatedRoute.data.subscribe(data => {
        this.listProds = data.product.result;
        this.pagination = data.product.pagination;
     });
    console.log(this.listProds);
  }
  toggleChiTietSanPham(id: number) {
    this.listSubTrTableProd[id] = !this.listSubTrTableProd[id];
  }

  editProduct(maSP: number) {
    this.router.navigate(['/admin/products/' + maSP]);
  }
  deleteProduct(maSP: number) {
    if (confirm('Bạn thực sự muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(maSP).subscribe(() => {
        this.getListProduct();
        alert('Xóa thành công!');
      },
        error => {
          console.log(error);
          alert('Xóa thất bại!');
        }
      );
    }
  }
  getListProduct() {
    this.productService.getProductPage (
      this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(
        (data: PaginatedResult<SanPham[]>) => {
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
          this.updateListProduct(data.result);
        },
      error => console.log(error)
    );
  }
  updateListProduct(data) {
    this.listProds = data;
    this.baseDataListProds = [];
    this.listSubTrTableProd = [];
    if (data != null ) {
      this.listProds.forEach(x => {
        this.baseDataListProds.push(x);
        this.listSubTrTableProd.push(false);
      });
    }
    console.log(this.listProds);
  }
  resetFilter() {
    this.searchTerm = '';
  }
  search() {
        if (typeof (this.searchTerm) === 'undefined' || this.searchTerm === null) {
          this.searchTerm = '';
        }
        this.productService.getSearchListProduct (
          this.pagination.currentPage, this.pagination.itemsPerPage, this.searchTerm).subscribe(
            (data: PaginatedResult<SanPham[]>) => {
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
              this.updateListProduct(data.result);
        },
          error => console.log(error)
        );
  }
  filter() {
    if (this.filterStatus == 2) {
      this.listProds = this.baseDataListProds.filter(this.isNonSale);
    } else if (this.filterStatus == 0) {
      this.listProds = this.baseDataListProds;
    } else {
      this.listProds = this.baseDataListProds.filter(this.isSale);
    }
  }
  isSale(sanpham: SanPham){
    return sanpham.trangthai == 1;
  }
  isNonSale(sanpham: SanPham){
    return sanpham.trangthai == 2;
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.search();
  }

}
