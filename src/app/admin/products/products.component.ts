import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { SanPham } from 'src/app/_models/sanpham';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/_services/product.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ChiTietDanhMuc } from 'src/app/_models/chitietdanhmuc';
import { NhaSanXuat } from 'src/app/_models/nhasanxuat';
import { CateProductService } from 'src/app/_services/cate-product.service';
import { DanhMucSP } from 'src/app/_models/danhmucsp';
import { ManufProdService } from 'src/app/_services/manuf-prod.service';
import { HttpResponse } from '@angular/common/http';
import { CateDetailProductService } from 'src/app/_services/cate-detail-product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  modalRefAddProd: BsModalRef;
  modalRefEditProd: BsModalRef;
  id: number;
  dvtinh: string;
  pagination: Pagination;
  listProds: SanPham[];
  listProFilter: SanPham[];
  searchTerm: string;
  fitlerdanhmucsp: number;
  fitlernhasx: number;
  baseDataListProds: SanPham[];
  filterStatus: number;
  listCateProd: DanhMucSP[];
  listManufProd: NhaSanXuat[];
  itemsPerPage = 4;
  listProductStatus = [
    'Đang kinh doanh',
    'Ngừng kinh doanh'
  ];
  productAdd: SanPham;
  addProdForm = new FormGroup({
    tensp: new FormControl('', [Validators.required]),
    soluong: new FormControl('', Validators.required),
    giavon: new FormControl('', Validators.required),
    giaban: new FormControl('', Validators.required),
    danhmuc: new FormArray([]),
    nhasx: new FormControl('', Validators.required),
    donvitinh: new FormControl('', Validators.required),
    hot: new FormControl('', Validators.required),
    new: new FormControl('', Validators.required),
    display: new FormControl(''),
    anhsp: new FormControl(''),
    motasp: new FormControl('')
  });
  product: SanPham;

    selectedFiles: FileList;
    currentFile: File;

  constructor(
    private modalService: BsModalService,
    private productService: ProductService,
    private router: Router,
    private cateProdService: CateProductService,
    private manufProdService: ManufProdService,
    private activatedRoute: ActivatedRoute,
    private cateDetailProd: CateDetailProductService
    ) { }

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
    this.activatedRoute.params.subscribe(params => {
      this.id = params.id;
    });

    this.resetFilter();
    this.activatedRoute.data.subscribe(data => {
        this.listProds = data.product.result;
        this.pagination = data.product.pagination;
        this.baseDataListProds = data.product.result;
     });
    this.getListCateProd();
    this.getListManufProd();
  }
  onCheckChange(event) {
    let formArray: FormArray = this.addProdForm.get('danhmuc') as FormArray;
    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    } else {
      // find the unselected element
      let i = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value === event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  createProduct() {
    console.log(this.addProdForm);
    this.productAdd = new SanPham();
    this.productAdd.tensp = this.addProdForm.controls['tensp'].value;
    this.productAdd.soluong = this.addProdForm.controls['soluong'].value;
    this.productAdd.giagoc = this.addProdForm.controls['giavon'].value;
    this.productAdd.giaban = this.addProdForm.controls['giaban'].value;
    let productManu = this.listManufProd.find( x => {
      return x.id == this.addProdForm.controls['nhasx'].value;
    });
    this.productAdd.nhasanxuat = productManu;
    this.productAdd.donvitinh = this.addProdForm.controls['donvitinh'].value;
    this.productAdd.ishot = this.addProdForm.controls['hot'].value;
    this.productAdd.isnew = this.addProdForm.controls['new'].value;
    this.productAdd.displaywebsite = this.addProdForm.controls['display'].value;
    this.productAdd.motasp = this.addProdForm.controls['motasp'].value;
    this.currentFile = this.selectedFiles.item(0);
    this.productService.uploadFile(this.currentFile).subscribe(response => {
      this.productAdd.anhsp = response.fileDownloadUri;
      this.productService.addProduct(this.productAdd).subscribe( next => {
        let chitietdanhmucs = [];
        this.addProdForm.controls['danhmuc'].value.forEach(y => {
          let danhmuc: DanhMucSP = this.listCateProd.find(x => x.id == y);
          chitietdanhmucs.push({
            id_sanpham: next.id,
            danhmucsp: danhmuc
          });
          console.log(chitietdanhmucs);
          this.cateDetailProd.addCateDetailProd(chitietdanhmucs).subscribe(() => {
            alert('Thêm thành công !');
            this.getListProduct();
            this.modalRefAddProd.hide();
          },
          error => console.log(error));
        });
      },
        error => {
          alert('Lỗi');
          console.log(error);
        }, () => {});
    });
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  getListCateProd() {
    this.cateProdService.getListCate().subscribe(
      data => {
        this.listCateProd = data;
      }
    );
  }
  getListManufProd() {
    this.manufProdService.getListManu().subscribe(
      data => {
        this.listManufProd = data;
      }
    );
  }
  editProduct(masp: string) {
    this.router.navigate(['/admin/products/' + masp ]);
  }
  deleteProduct(id: number) {
    if (confirm('Bạn thực sự muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(id).subscribe(() => {
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
    if (data != null ) {
      this.listProds.forEach(x => {
        this.baseDataListProds.push(x);
      });
    }
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
    if (this.filterStatus == 0 && this.fitlernhasx == 0) {
      this.filterDanhmuc();
    } else {
      this.getListProFilter();
    }
    console.log(this.listProds);
  }
  
  filterDanhmuc() {
    if (this.fitlerdanhmucsp != 0 ) {
      this.listProds = this.baseDataListProds.filter(x => {
        for (let item of x.chitietdanhmuc) {
          if (item.danhmucsp.id === +this.fitlerdanhmucsp) {
            return true;
          }
        }
        return false;
      });
    } else {
      this.listProds = this.baseDataListProds;
    }
  }

  getListProFilter() {
    this.productService.filterProductPageWithStatusandManu (
      this.pagination.currentPage, this.pagination.itemsPerPage, this.filterStatus, this.fitlernhasx).subscribe(
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
          this.filterDanhmuc();
        },
      error => console.log(error)
    );
  }
  isSale(sanpham: SanPham) {
    return sanpham.trangthai == 1;
  }
  isNonSale(sanpham: SanPham) {
    return sanpham.trangthai == 2;
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.search();
  }
  changestate(id: number) {
    this.product = new SanPham();
    this.product = this.findProductByID(id);
    this.product.trangthai = this.product.trangthai == 1 ? 2 : 1;
    this.productService.updateProduct(this.product).subscribe(() => {
      alert('Đã thay đổi trạng thái');
      this.getListProduct();
    },
    error => {
      console.error(error);
      alert('Thất bại!');
    });
  }
  findProductByID(id: number) {
    return this.listProds.find(x => x.id == id);
  }
  titleState(id: number) {
    let title = '';
    this.product = new SanPham();
    this.product = this.findProductByID(id);
    title = this.product.trangthai === 1 ? this.listProductStatus[0] : this.listProductStatus[1];
    return title;
  }
  getTotalProducts() {
    if (this.listProds != null) {
      return this.listProds.length;
    }
  }
  getTotalManuf() {
    if (this.listManufProd != null) {
      return this.listManufProd.length;
    }
  }
}
