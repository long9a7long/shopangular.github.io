import { Datetimepicker } from 'bootstrap.v3.datetimepicker';

export interface KhachHangDTO {
    makhachhang: string;
    ten: string;
    sdt: string;
    diachi?: string;
    createdAt: Date;
    tonggia: number;
    tongno: number;
}
