import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './analytics/analytics.component';
import { CouponsModule } from './coupons/coupons.module';
import { CustomersComponent } from './customers/customers.component';
import { AddproductComponent } from './dashboard/inventory/addproduct/addproduct.component';
import { OrderComponent } from './dashboard/inventory/order/order.component';
import { LoginComponent } from './login/login.component';
import { ReportsComponent } from './reports/reports.component';
import { ViewreportComponent } from './reports/viewreport/viewreport.component';

import { ViewdashboarddetailsComponent } from './reports/viewdashboarddetails/viewdashboarddetails.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'analytic', component: AnalyticsComponent },
  { path: 'coupon', loadChildren: () => (import('./coupons/coupons.module')).then((m) => m.CouponsModule) },
  { path: 'marketing', loadChildren: () => (import('./marketing/marketing.module')).then((m) => m.MarketingModule) },
  { path: 'inventory', loadChildren: () => (import('./inventory/inventory.module')).then((m) => m.InventoryModule) },
  { path: 'order', loadChildren: () => (import('./order/order.module')).then((m) => m.OrderModule) },
  { path: 'customers', loadChildren: () => (import('./customers/customer.modules')).then((m) => m.CustomersModule) },
  { path: 'store', loadChildren: () => (import('./store/store.module')).then((m) => m.StoreModule) },
  { path: 'product', loadChildren: () => (import('./product/product.module')).then((m) => m.ProductModule) },
  { path: 'productDetails', component: AddproductComponent, data: { title: 'ProductDetails' } },
  { path: 'order', component: OrderComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'viewreport', component: ViewreportComponent },
  // { path: 'reports', loadChildren: () => (import('./reports/reports.module')).then((m) => m.ReportsModule) },
  // { path: 'viewreport', loadChildren: () => (import('./reports/reports.module')).then((m) => m.ReportsModule) },

  { path: 'viewdashboarddetails', component: ViewdashboarddetailsComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
