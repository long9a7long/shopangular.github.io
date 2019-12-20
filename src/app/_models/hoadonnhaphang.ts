import {NhaCungCap} from './nhacungcap';
import {User} from './user';
export interface HoaDonBanHang {
  id: number;
  mahoadon: string;
  nhacungcap: NhaCungCap;
  loaithanhtoan: number;
  tonggia: number;
  giamgia?: number;
  datra: number;
  trangthai: number;
  createdAt: Date;
  updatedAt?: Date;
  nguoisua?: User;
  nguoitao: User;
  chitiethoadon: string;
}
