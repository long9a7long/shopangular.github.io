import {DanhMucSP} from './danhmucsp';
import {NhaSanXuat} from './nhasanxuat'
import { ChiTietDanhMuc } from './chitietdanhmuc';
export interface SanPham {
  id: number;
  masp: string;
  tensp: string;
  giagoc: number;
  giaban: number;
  soluong: number;
  trangthai: number;
  nhasanxuat: NhaSanXuat;
  chitietdanhmuc: ChiTietDanhMuc[];
  anhsp: string;
  motasp: string;
  donvitinh: string;
  ishot: boolean;
  isnew: boolean;
  displaywebsite: boolean;
  created_at: Date;
  updated_at?: Date;
}
