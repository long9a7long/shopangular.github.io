import { NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { AdminComponent } from './admin.component';
import { HeaderComponent } from './layout/header/header.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ControlSidebarComponent } from './layout/control-sidebar/control-sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ContentComponent } from './layout/content/content.component';
import { LeftSideComponent } from './layout/left-side/left-side.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerDetailComponent } from './customers/customer-detail/customer-detail.component';
import { PurchaseHistoryComponent } from './customers/customer-detail/purchase-history/purchase-history.component';
import { DebtComponent } from './customers/customer-detail/debt/debt.component';
import { OrdersComponent } from './orders/orders.component';
import { SellProdComponent } from './orders/sell-prod/sell-prod.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesProdComponent } from './products/categories-prod/categories-prod.component';
import { ManufProdComponent } from './products/manuf-prod/manuf-prod.component';
import { SuppliersProdComponent } from './products/suppliers-prod/suppliers-prod.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { EditOrderComponent } from './orders/edit-order/edit-order.component';
import { ChooseProdComponent } from './orders/sell-prod/choose-prod/choose-prod.component';
@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    TypeaheadModule.forRoot()
  ],
  declarations: [
    AdminComponent,
    HeaderComponent,
    LeftSideComponent,
    ContentComponent,
    FooterComponent,
    ControlSidebarComponent,
    DashboardComponent,
    CustomersComponent,
    CustomerDetailComponent,
    PurchaseHistoryComponent,
    DebtComponent,
    OrdersComponent,
    SellProdComponent,
    ProductsComponent,
    CategoriesProdComponent,
    ManufProdComponent,
    SuppliersProdComponent,
    ProfilesComponent,
    EditOrderComponent,
    ChooseProdComponent
  ]
})
export class AdminModule {}
