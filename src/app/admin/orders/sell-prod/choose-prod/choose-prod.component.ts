import { Component, OnInit, Output, Input, EventEmitter  } from '@angular/core';
import { SanPham } from 'src/app/_models/sanpham';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-choose-prod',
  templateUrl: './choose-prod.component.html',
  styleUrls: ['./choose-prod.component.scss']
})
export class ChooseProdComponent implements OnInit {
  @Input() listProd: SanPham[];
  @Output('SubmitChooseProd') submit = new EventEmitter<string>();
  searchProdKey: string;
  currentProd: SanPham;
  baseListPrd: SanPham[];
  constructor(private prodService: ProductService) { }

  ngOnInit() {
    this.searchProdKey = '';
    if (this.listProd != null) {
      this.currentProd = this.listProd[0];
    }
    this.baseListPrd = this.listProd;
  }

  changeCurrentProd(sp: SanPham) {
    this.currentProd = sp;
  }

  submitAddProd(masp) {
    this.submit.emit(masp);
  }

  filterProd($event) {
    this.prodService.getSearchListProduct(1, 99999, this.searchProdKey).subscribe(data => {
      this.listProd = data.result;
    },
    error => {console.error(error); }
    );
  }
}
