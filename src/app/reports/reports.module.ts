import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { MaterialModule } from '../material.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-module/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { ChartComponent } from '../shared-module/chart/chart.component';
import { ViewreportComponent } from './viewreport/viewreport.component';
import { DateService } from '../services/date.service';
import { ViewdashboarddetailsComponent } from './viewdashboarddetails/viewdashboarddetails.component';


const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    // children: [
    //   { path: 'viewreport', component: ViewreportComponent },
    // ],
  },
  // {
  //   path: 'viewreport',
  //   component: ViewreportComponent,
  // }
]
@NgModule({
  declarations: [ReportsComponent, ViewreportComponent, ViewdashboarddetailsComponent],
  imports: [
    CommonModule, MaterialModule, RouterModule.forChild(routes), ReactiveFormsModule, SharedModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatTableModule
  ],
  exports: [MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatTableModule],
  providers: [DateService]
})
export class ReportsModule { }
