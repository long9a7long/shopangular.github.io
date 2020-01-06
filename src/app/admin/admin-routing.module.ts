import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomerDetailComponent } from './customers/customer-detail/customer-detail.component';
import { OrdersComponent } from './orders/orders.component';
import { SellProdComponent } from './orders/sell-prod/sell-prod.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesProdComponent } from './products/categories-prod/categories-prod.component';
import { ManufProdComponent } from './products/manuf-prod/manuf-prod.component';
import { SuppliersProdComponent } from './products/suppliers-prod/suppliers-prod.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { EditOrderComponent } from './orders/edit-order/edit-order.component';

import { ProductsResolver } from '../_resolver/product-resolver';
import { CustomersResolver } from '../_resolver/customer-resolver';
import { BillBHResolver } from '../_resolver/bill-bh-resolver';
import { EditBillResolver } from '../_resolver/edit-bill-resolver';
import { ProductResolver } from '../_resolver/products-resolver';
import { CateProductResolver } from '../_resolver/cate-resolver';
import { CustomersComponent } from './customers/customers.component';
import { AllCustomersResolver } from '../_resolver/customer-all-resolver';
import { AllCateProductResolver } from '../_resolver/list-all-cate-resolver';
import { CustomersDetailResolver } from '../_resolver/customer-detail-resolver';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { ProductsDetailResolver } from '../_resolver/product-detail-resolver';
import { ManuProductResolver } from '../_resolver/manuf-prod.resolver';
import { SupplierProductResolver } from '../_resolver/supplier-prod-resolver';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'customers',
        component: CustomersComponent,
        resolve: {customers: CustomersResolver }
      },
      {
        path: 'customers/:id',
        component: CustomerDetailComponent,
        resolve: {khachhang: CustomersDetailResolver}
      },
      {
        path: 'orders',
        component: OrdersComponent,
        resolve: {bills: BillBHResolver}
      },
      {
        path: 'orders/:id',
        component: EditOrderComponent,
        resolve: {bill: EditBillResolver, prods: ProductsResolver, custs: AllCustomersResolver}
      },
      {
        path: 'sell-prod',
        component: SellProdComponent,
        resolve: {prods: ProductsResolver, custs: AllCustomersResolver}
      },
      {
        path: 'products',
        component: ProductsComponent,
        resolve: {product: ProductResolver, cates: AllCateProductResolver}
      },
      {
        path: 'products/:masp',
        component: ProductDetailComponent,
        resolve: {productdetail: ProductsDetailResolver}
      },
      {
        path: 'categories-prod',
        component: CategoriesProdComponent,
        resolve: {cateProduct: CateProductResolver}
      },
      {
        path: 'manuf-prod',
        component: ManufProdComponent,
        resolve: {manuProd: ManuProductResolver}
      },
      {
        path: 'suppliers-prod',
        component: SuppliersProdComponent,
        resolve: {supProd: SupplierProductResolver}
      },
      {
        path: 'profile',
        component: ProfilesComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
