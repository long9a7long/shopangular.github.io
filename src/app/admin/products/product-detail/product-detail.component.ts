import { Component, OnInit, TemplateRef } from '@angular/core';
import { SanPham } from 'src/app/_models/sanpham';
import { Pagination } from 'src/app/_models/pagination';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ChiTietDanhMuc } from 'src/app/_models/chitietdanhmuc';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/_services/product.service';
import { DanhMucSP } from 'src/app/_models/danhmucsp';
import { NhaSanXuat } from 'src/app/_models/nhasanxuat';
import { CateProductService } from 'src/app/_services/cate-product.service';
import { ManufProdService } from 'src/app/_services/manuf-prod.service';
import { CateDetailProductService } from 'src/app/_services/cate-detail-product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  currentProd: SanPham;
  prodUpdate: SanPham;
  id: number;
  product: SanPham;
  pagination: Pagination;
  modalRef: BsModalRef;
  listCateDetail: ChiTietDanhMuc[];
  listCateProd: DanhMucSP[];
  baseDataListProds: SanPham[];
  listManufProd: NhaSanXuat[];
  proddetail: SanPham;
  itemsPerPage = 4;
  listProds: SanPham[];
  editProdForm = new FormGroup({
    id: new FormControl({value: ''}),
    masp: new FormControl({value: '', disabled: true}),
    tensp: new FormControl('', Validators.required),
    soluong: new FormControl('', Validators.required),
    giavon: new FormControl('', Validators.required),
    giaban: new FormControl('', Validators.required),
    danhmuc: new FormArray([]),
    nhasx: new FormControl('', Validators.required),
    donvitinh: new FormControl('', Validators.required),
    hot: new FormControl('', Validators.required),
    new: new FormControl('', Validators.required),
    display: new FormControl('', Validators.required),
    anhsp: new FormControl(''),
    motasp: new FormControl('')
  });
  listProductStatus = [
    'Đang kinh doanh',
    'Ngừng kinh doanh'
  ];
  activatedRoute: any;
  selectedFiles: FileList;
  currentFile: File;

  constructor(
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private router: Router,
    private cateProdService: CateProductService,
    private manufProdService: ManufProdService,
    private productService: ProductService,
    private cateDetailProdService: CateDetailProductService
    ) { }
    openModal(template: TemplateRef<any>, id: number) {
      this.modalRef = this.modalService.show(template);
    }

  ngOnInit() {
    this.route.data.subscribe( data => {
      this.proddetail = data.productdetail;
      console.log(this.proddetail);
    });
    this.route.params.subscribe(params => {
      this.id = params.id;
    });

    this.prodUpdate =  this.proddetail;
    this.updateValueProdForm();
    this.getListCateProd();
    this.getListManufProd();
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
  updateValueProdForm() {
    this.editProdForm.controls['id'].setValue(this.proddetail.id);
    this.editProdForm.controls['masp'].setValue(this.proddetail.masp);
    this.editProdForm.controls['tensp'].setValue(this.proddetail.tensp);
    this.editProdForm.controls['soluong'].setValue(this.proddetail.soluong);
    this.editProdForm.controls['giavon'].setValue(this.proddetail.giagoc);
    this.editProdForm.controls['giaban'].setValue(this.proddetail.giaban);
    let arrcate= new Array();
    this.proddetail.chitietdanhmuc.forEach(x => {
      arrcate.push(x.danhmucsp);
    });
    this.setCheckForDanhmuc(arrcate);
    this.editProdForm.controls['nhasx'].setValue(this.proddetail.nhasanxuat.id);
    this.editProdForm.controls['donvitinh'].setValue(this.proddetail.donvitinh);
    this.editProdForm.controls['hot'].setValue(this.proddetail.ishot);
    this.editProdForm.controls['new'].setValue(this.proddetail.isnew);
    this.editProdForm.controls['display'].setValue(this.proddetail.displaywebsite);
    this.editProdForm.controls['motasp'].setValue(this.proddetail.motasp);
  }
  checkManuProd(id: number) {
    return id === this.proddetail.nhasanxuat.id;
  }
  checkCateProd(id: number) {
    return this.proddetail.chitietdanhmuc.find(x => x.danhmucsp.id === id) !== undefined;
  }

  setCheckForDanhmuc(listdanhmuc: DanhMucSP[]) {
    let formArray: FormArray = this.editProdForm.get('danhmuc') as FormArray;
    listdanhmuc.forEach(x => {
      formArray.push(new FormControl(x.id));
    });
  }

  onCheckChange(event) {
    let formArray: FormArray = this.editProdForm.get('danhmuc') as FormArray;
    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(+event.target.value));
    } else {
      // find the unselected element
      let i = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  updateProduct() {
    this.prodUpdate.id = this.proddetail.id;
    this.prodUpdate.masp = this.proddetail.masp;
    this.prodUpdate.tensp = this.editProdForm.controls['tensp'].value;
    this.prodUpdate.soluong = this.editProdForm.controls['soluong'].value;
    this.prodUpdate.giagoc = this.editProdForm.controls['giavon'].value;
    this.prodUpdate.giaban = this.editProdForm.controls['giaban'].value;
    let productManu = this.listManufProd.find( x => {
      return x.id == this.editProdForm.controls['nhasx'].value;
    });
    this.prodUpdate.nhasanxuat = productManu;
    this.prodUpdate.donvitinh = this.editProdForm.controls['donvitinh'].value;
    this.prodUpdate.ishot = this.editProdForm.controls['hot'].value;
    this.prodUpdate.isnew = this.editProdForm.controls['new'].value;
    this.prodUpdate.displaywebsite = this.editProdForm.controls['display'].value;
    this.prodUpdate.motasp = this.editProdForm.controls['motasp'].value;
    this.prodUpdate.chitietdanhmuc = this.proddetail.chitietdanhmuc;
    if ( this.selectedFiles === undefined || this.selectedFiles === null) {
      this.productService.updateProduct(this.prodUpdate).subscribe(next => {
            this.proddetail = this.prodUpdate;
            let chitietdanhmucs = [];
            this.editProdForm.controls['danhmuc'].value.forEach(y => {
              let danhmuc: DanhMucSP = this.listCateProd.find(x => x.id == y);
              chitietdanhmucs.push({
                id_sanpham: this.proddetail.id,
                danhmucsp: danhmuc
              });
            });
            this.cateDetailProdService.addCateDetailProd(chitietdanhmucs).subscribe(() => {
              alert('Sửa thành công!');
            },
              error => console.log(error));
          },
          error => console.log(error)
          );
    } else {
      this.currentFile = this.selectedFiles.item(0);
      this.productService.uploadFile(this.currentFile).subscribe(response => {
      this.prodUpdate.anhsp = response.fileDownloadUri;
      this.productService.updateProduct(this.prodUpdate).subscribe(next => {
        this.proddetail = this.prodUpdate;
        let chitietdanhmucs = [];
        this.editProdForm.controls['danhmuc'].value.forEach(y => {
          let danhmuc: DanhMucSP = this.listCateProd.find(x => x.id == y);
          chitietdanhmucs.push ({
              id_sanpham: this.proddetail.id,
              danhmucsp: danhmuc
            });
        });
        this.cateDetailProdService.addCateDetailProd(chitietdanhmucs).subscribe(() => {
            alert('Sửa thành công!');
        },
          error => console.log(error));
        alert('Sửa thành công!');
      },
      error => console.log(error));
    });
    }
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
  changestate(id: number) {
    this.product = new SanPham();
    this.product = this.findProductByID(id);
    this.product.trangthai = this.product.trangthai == 1 ? 0 : 1;
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

}
