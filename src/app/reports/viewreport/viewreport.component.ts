import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Time } from 'src/app/_models/Time.model';
import { AppointmentDetail } from 'src/app/_models/appointment.model';
import { ApiService } from 'src/app/services/api.service';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-viewreport',
  templateUrl: './viewreport.component.html',
  styleUrls: ['./viewreport.component.scss']
})
export class ViewreportComponent implements OnInit {
  servicedataSource = new MatTableDataSource<any>([]);
  serviveColumns = ['S.no', 'Service', 'Price', 'Stylist', 'Duration'];
  serviceList: any = [];
  @ViewChild('servicepaginator') servicepaginator: MatPaginator;

  productdataSource = new MatTableDataSource<any>([]);
  productColumns = ['S.no', 'Product', 'Price', 'Quantity', 'Discount'];
  @ViewChild('productpaginator') productpaginator: MatPaginator;
  productList: any = [];
  billId: any;
  appointment: AppointmentDetail;
  totalPriceExpected = 0;
  appointmentEndTime: string;
  appointmentStartTime: string;
  isproducts: boolean = false;
  receiptDetails: any;

  constructor(private router: Router, private route: ActivatedRoute,
    private api: ApiService, public dateService: DateService,
    private location: Location) {

  }

  ngOnInit() {
    debugger
    let id = this.route.snapshot.paramMap.get('id')
    this.billId = id;
    this.receiptDetails = {};
    this.getBillingDetails();

  }

  getBillingDetails() {
    this.api.getReportsProductDetails(this.billId).subscribe((resproducts: any) => {
      if (resproducts.data.length > 0) {
        this.receiptDetails = resproducts.data[0];
        resproducts.data.forEach(element => {
          if (element.products.length > 0) {
            element.products.forEach(products => {
              products.productName = products.product_name;
              products.choosequantity = products.Quantity;
              products.choosediscount = products.discount;
              products.totalprice = products.Price
            });
          }

        });
        this.productList = [];
        this.productList = resproducts.data[0].products;
        this.productdataSource.data = this.productList;
        if (this.receiptDetails.type == "Products") {
          this.isproducts = true;
          // this.router.navigate(['billing', { id: 1, value: JSON.stringify(resproducts.data[0]) }]);
        } else {
          this.isproducts = false;
          this.api.getReportsServiceDetails(this.billId).subscribe(res => {
            if (res && res.data.length > 0) {
              this.getAppointmentDetails(res.data[0].appointmentId)

              this.receiptDetails.products = resproducts.data[0].products;
              this.receiptDetails.bookedServices = res.data[0].bookedServices;
              this.receiptDetails.appointmentId = res.data[0].appointmentId;
              let totalDuration = 0;
              for (const service of this.receiptDetails.bookedServices) {
                if (!service.stylist) {
                  service.stylist = this.receiptDetails.stylistName;
                }
                if (service.duration < 60) {
                  service.totalDuration = `${service.duration} min`;
                }
                else {
                  service.totalDuration = (service.duration % 60) === 0 ? `${Math.trunc(service.duration / 60)}h` : `${Math.trunc(service.duration / 60)}h ${service.duration % 60}min`;
                }
              }
              this.serviceList = [];
              this.serviceList = this.receiptDetails.bookedServices;
              this.servicedataSource.data = this.serviceList;
              // console.log('receiptDetails', receiptDetails);

            } else {
            }
          })
        }

      }
    })
  }
  getAppointmentDetails(id: number) {
    debugger
    this.api.getAppointmentDetails(id).subscribe((response) => {
      if (response && response.status === 'SUCCESS') {
        this.appointment = response.data;
        let totalDuration = 0;
        for (const service of this.appointment.bookedServices) {
          if (!service.stylist) {
            service.stylist = this.appointment.stylistName;
          }
          if (service.duration < 60) {
            service.totalDuration = `${service.duration} min`;
          }
          else {
            service.totalDuration = (service.duration % 60) === 0 ? `${Math.trunc(service.duration / 60)}h` : `${Math.trunc(service.duration / 60)}h ${service.duration % 60}min`;
          }
          totalDuration = totalDuration + service.duration;
        }
        const startTime = new Time(this.appointment.slotName);
        const closeTime = new Time(this.appointment.slotName);
        closeTime.addMinutes(totalDuration);
        this.appointmentStartTime = startTime.toShortTime();
        this.appointmentEndTime = closeTime.toShortTime();
        // this.bookedServices = this.appointment.bookedServices;
        // this.totalPriceExpected = this.appointment.totalPriceExpected;


      }
      else {
      }
    });
  }
  back() {
    this.location.back();
  }

}
