// import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { ChartComponent } from '../shared-module/chart/chart.component';
import { Router } from '@angular/router';
// import * as jsPDF from 'jspdf';
import { jsPDF } from 'jspdf';

import autoTable from 'jspdf-autotable';

import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { Chart, DoughnutController, ChartOptions, ChartType,TooltipItem,ChartConfiguration  } from 'chart.js/auto';
import { MatDatepicker } from '@angular/material/datepicker';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  // standalone: true,
  // // imports: [MatTableModule, MatFormFieldModule]
  // imports: [MaterialModule, MatFormFieldModule, FormsModule, CommonModule]
})


export class ReportsComponent implements AfterViewInit {
  
  chart: any;

  @ViewChild('instoreChart') instoreChart: ElementRef;
  @ViewChild('ecommerceChart') ecommerceChart: ElementRef;

  topStylistsData: { stylist: string; billCount: number; sales: number }[] = [
    { stylist: 'Stylist A', billCount: 30, sales: 1200 },
    { stylist: 'Stylist B', billCount: 25, sales: 1000 },
    { stylist: 'Stylist C', billCount: 20, sales: 800 },
    { stylist: 'Stylist D', billCount: 15, sales: 600 },
    { stylist: 'Stylist E', billCount: 50, sales: 400 }
  ];
  topServiceSalesData: { service: string; sales: number }[] = [
    { service: 'Service A', sales: 1200 },
    { service: 'Service B', sales: 1000 },
    { service: 'Service C', sales: 800 },
    { service: 'Service D', sales: 600 },
    { service: 'Service E', sales: 400 }
  ];
  


  @ViewChild('bestChart') bestChart!: ElementRef;
  @ViewChild('leastChart') leastChart!: ElementRef;
  selectedType: 'best' | 'least' = 'least';
  
  @ViewChild('performanceChart') performanceChart!: ElementRef;
  @ViewChild('salesChart') salesChart!: ElementRef;
  
  @ViewChild('customersChart') customersChart!: ElementRef;
  @ViewChild('serviceSalesChart') serviceSalesChart!: ElementRef;
 
  
  @ViewChild('doughnutChartCanvas') doughnutChartCanvas!: ElementRef;
  private doughnutChart: Chart<'doughnut', number[], string> | undefined;
  
 
  

  
 

  dataSource = new MatTableDataSource<any>([]);
  serviceSalesdataSourceList = new MatTableDataSource<any>([]);
  productSalesdataSourceList = new MatTableDataSource<any>([]);
  staffSSalesdatasourceList = new MatTableDataSource<any>([]);
  @ViewChild('picker') picker: MatDatepicker<Date>;

  // columnsToDisplay = ['index', 'id', 'name', 'email', 'phoneNumber', 'total_value', 'visit', 'action'];
  columnsToDisplay = [];
  serviceColumn = [];
  productColumn = [];
  staffColumn = [];
  selectedCategory: any;
  selectedStore: any;
  selectedDate: any;
  selectedGender: any;
  catagoryList: any[] = [{ id: 1, name: "Sales List" }, { id: 2, name: "Service Sales" }, { id: 3, name: "Product Sales" }, { id: 4, name: "Staff Sales" }];
  
  performing: any[]=[{ id:1,name:"bestperforming"},{ id:2,name:"leastperforming"}];
  dateTypeList: any = [{ id: 1, name: "Today" }, { id: 2, name: "YesterDay" }, { id: 3, name: "7 days" }, { id: 4, name: "Current Month" }, { id: 5, name: "Custom Range" }];
  genterTypeList: any = [{ id: 1, name: "male" }, { id: 2, name: "female" }, { id: 3, name: "others" }, { id: 4, name: "All Customers" }];
  salesList: any = [];
  serviceSalesList: any = [];
  productSalesList: any = [];
  staffSalesList: any = [];
  staffSalesByService: any = [];
  staffSalesByProduct: any = [];
  labelValueList: any = [{ name: "8877566" }, { name: "12/12/2023" }, { name: "Shan" }, { name: "Cash" }, { name: "5000" }]
  getBillings: any = [];
  getAllBillings: any = [];
  showCustomeDate: boolean = false;
  totalBillValue: any;
  cashPaymentAmount: any;
  onlinePaymentAmount: any;
  cardPaymentAmount: any;
  startDate: any;
  endDate: any;
  productsalesList: any = [];
  byServiceLabel: any = [{ name: "S.no" }, { name: "Staff Name" }, { name: "Service Amount" }, { name: "Discount Amount" }, { name: "Commission / Tip" }, { name: "Duration(Minutes)" }, { name: "Total Amount" }];
  byProductLabel: any = [{ name: "S.no" }, { name: "Staff Name" }, { name: "Products Amount" }, { name: "Discount Amount" }, { name: "Commission" }, { name: "Total Amount" }];
  byServiceList: any = [];
  byProductList: any = [];
  merchantStoreId: any;
  staffSalesLabelList: any = [];
  selectSalesPerformance: any = 1;
  salesperformanceList: any = [{ id: 1, name: "Daily performance" }, { id: 2, name: "Monthly performance" },];
  stylistData: any = [];
  dailyReportList: any = [];
  monthlyReportList: any = [];
  cashPercentage: any;
  cardPercentage: any;
  upiPercentage: any;
  genderList = ['Male', 'Female'];
  gender: any;
  storeList: any = [];
   

  selectedCategory5: string;
  

  @ViewChild('paginatorFirst') paginatorFirst: MatPaginator;
  @ViewChild('paginatorSecond') paginatorSecond: MatPaginator;
  @ViewChild('paginatorThird') paginatorThird: MatPaginator;
  @ViewChild('paginatorFour') paginatorFour: MatPaginator;
  
 

  billingCount: number = 0;
  piechartData = [
    {
      color: "#b23392",
      data: null,
      name: "Men",
      y: 90
    },
    {
      color: "#cc9fc1",
      data: null,
      name: "Women",
      y: 213
    }, {
      color: "#8c6f89",
      data: null,
      name: "Both",
      y: 303
    }
  ]





  constructor(private api: ApiService, public dialog: MatDialog, private snackbar: MatSnackBar,
    private datePipe: DatePipe,
    private router: Router,
    private _snackBar: MatSnackBar,
    
  ) {}
   

  ngAfterViewInit() :void {
    this.updateChart();
    this.drawCustomersChart();
    this.renderDoughnutChart();
    this.renderChart();
    this.createProductSalesChart();
    
  }
  createProductSalesChart(): void {
    const ctx = document.getElementById('productSalesChart') as HTMLCanvasElement;
    const productSalesChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Product A', 'Product B', 'Product C','Product D','Product E'],
        datasets: [{
          data: [300, 450, 200,800,600],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56','#8c3e87','#1fcf22']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Product Sales'
          }
        }
      }
    });
  }
  
















  renderChart() {
    const canvas = document.getElementById('stylistPerformanceChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      const chartConfig: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels: this.topStylistsData.map(data => data.stylist),
          datasets: [
            {
              label: 'Bill Count',
              data: this.topStylistsData.map(data => data.billCount),
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
            },
            {
              label: 'Sales',
              data: this.topStylistsData.map(data => data.sales),
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
            },
          ],
        },
        options: {
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
        },
      };
  
      new Chart(ctx, chartConfig);
    }
  }
  








  
  
  
  

  updateChart() {
    if (this.selectedType === 'best') {
      this.drawBestChart();
    } else if (this.selectedType === 'least') {
      this.drawLeastChart();
    }
  }
  

  drawBestChart() {
    const ctx = this.bestChart.nativeElement.getContext('2d');
    const data = this.getData(true);
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    };

    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options,
    });
  }

  drawLeastChart() {
    const ctx = this.leastChart.nativeElement.getContext('2d');
    const data = this.getData(false);
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    };

    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options,
    });
  }

  getData(isBest: boolean) {
    const labels = isBest ? ['mck-kilpauk', 'Mck-perambur', 'Mck-royapuram', 'Mck-vadapalani', 'Mck-Ashok pillar']:['Mck-Ashok pillar','Mck-vadapalani','Mck-royapuram','Mck-perambur','mck-kilpauk'];
    const performanceData = isBest ? [90, 85, 92, 88, 80] : [50, 55, 45, 60, 40];
    
    const backgroundColor = isBest ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)';
    const borderColor = isBest ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)';
   
  
    return {
      labels: labels,
      datasets: [
        {
          label: isBest ? 'Best Performing' : 'Least Performing',
          data: performanceData,
          backgroundColor: Array(5).fill(backgroundColor),
          borderColor: Array(5).fill(borderColor),
          borderWidth: 1,
        },
      ],
    };
  }


  drawPerformanceChart() {
    const ctx = this.performanceChart.nativeElement.getContext('2d');

    const data = {
      labels: ['Stylist 1', 'Stylist 2', 'Stylist 3', 'Stylist 4', 'Stylist 5'],
      datasets: [
        {
          label: 'Bill Count',
          data: [30, 25, 20, 18, 15],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Sales',
          data: [3000, 2500, 2000, 1800, 1500],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
    };

    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options,
    });
  }

  
  drawCustomersChart() {
    const ctx = this.customersChart.nativeElement.getContext('2d');

    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Total Customers',
          data: [50, 65, 80, 81, 56, 55, 40],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false,
        },
        {
          label: 'New Customers',
          data: [20, 35, 40, 51, 46, 45, 30],
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          fill: false,
        },
        {
          label: 'High Value Customers',
          data: [10, 15, 20, 25, 30, 35, 40],
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
          fill: false,
        },
      ],
    };

    const options = {
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
    };

    new Chart(ctx, {
      type: 'line',
      data: data,
      options: options,
    });
  }

  renderDoughnutChart() {
    const canvas = document.getElementById('serviceSalesDoughnutChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const chartConfig: ChartConfiguration<'doughnut'> = {
        type: 'doughnut',
        data: {
          labels: this.topServiceSalesData.map(data => data.service),
          datasets: [
            {
              data: this.topServiceSalesData.map(data => data.sales),
              backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)',
                                 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)'],
            }
          ]
        },
        options: {} // Customize options as needed
      };

      new Chart(ctx, chartConfig);
    }
  }

  
  
  // drawBarChart() {
  //   const ctx = this.barChart.nativeElement.getContext('2d');
  //   const data = this.getData();
  //   const options = {
  //     scales: {
  //       y: {
  //         beginAtZero: true,
  //         max: 100,
  //       },
  //     },
  //   };

  //   new Chart(ctx, {
  //     type: 'bar',
  //     data: data,
  //     options: options,
  //   });
  // }

  // updateChart() {
  //   const ctx = this.barChart.nativeElement.getContext('2d');
  //   const data = this.getData();
  //   const chart = new Chart(ctx, {
  //     type: 'bar',
  //     data: data,
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           max: 100,
  //         },
  //       },
  //     },
  //   });

  //   // Destroy the previous chart instance to avoid memory leaks
  //   chart.destroy();
  // }

  // getData() {
  //   const labels = ['1', '2', '3', '4', '5'];
  //   const performanceData =
  //     this.selectedType === 'best'
  //       ? [90, 85, 92, 88, 95]
  //       : [50, 55, 45, 60, 40];

  //   const backgroundColor =
  //     this.selectedType === 'best'
  //       ? 'rgba(75, 192, 192, 0.5)'
  //       : 'rgba(255, 99, 132, 0.5)';
  //   const borderColor =
  //     this.selectedType === 'best'
  //       ? 'rgba(75, 192, 192, 1)'
  //       : 'rgba(255, 99, 132, 1)';

  //   return {
  //     labels: labels,
  //     datasets: [
  //       {
  //         label:
  //           this.selectedType === 'best'
  //             ? 'Best Performing'
  //             : 'Least Performing',
  //         data: performanceData,
  //         backgroundColor: Array(5).fill(backgroundColor),
  //         borderColor: Array(5).fill(borderColor),
  //         borderWidth: 1,
  //       },
  //     ],
  //   };
  // }
  // drawBarChart() {
  //   const ctx = this.barChart.nativeElement.getContext('2d');

  //   const data = {
  //     labels: ['Salon 1', 'Salon 2', 'Salon 3', 'Salon 4', 'Salon 5'],
  //     datasets: [
  //       {
  //         label: 'Performance',
  //         data: [85, 75, 92, 88, 95], // Replace with actual performance data
  //         backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(75, 192, 192, 0.5)'],
  //         borderColor: ['rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 1)'],
  //         borderWidth: 1,
  //       },
  //     ],
  //   };

  //   const options = {
  //     scales: {
  //       y: {
  //         beginAtZero: true,
  //         max: 100, // Assuming the performance is in percentage, adjust if it's in a different range
  //       },
  //     },
  //   };

  //   new Chart(ctx, {
  //     type: 'bar',
  //     data: data,
  //     options: options,
  //   });
  // }

  

   
  

  
  // drawDoughnutChart() {
  //   const ctx = this.doughnutChart.nativeElement.getContext('2d');

  //   const data = {
  //     labels: ['Label 1', 'Label 2', 'Label 3'],
  //     datasets: [
  //       {
  //         data: [30, 40, 30],
  //         backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)'],
  //         borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
  //         borderWidth: 1,
  //       },
  //     ],
  //   };

  //   new Chart(ctx, {
  //     type: 'doughnut',
  //     data: data,
  //   });
  // }




  
  applyFilter(filterValue: string) {
    debugger
    switch (this.selectedCategory) {
      case 1:
        // code block
        this.dataSource.filter = filterValue.trim().toLowerCase();

        break;
      case 2:
        this.serviceSalesdataSourceList.filter = filterValue.trim().toLowerCase();

        break;
      case 3:
        this.productSalesdataSourceList.filter = filterValue.trim().toLowerCase();
        break;

      default:
        this.staffSSalesdatasourceList.filter = filterValue.trim().toLowerCase();
      // code block
    }
  }
  ngOnInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.data = this.customerData;
    // this.dataSource.sort = this.sort;
    // this.serviceSalesdataSourceList.paginator = this.paginator2;
    this.selectedCategory = 1;
    this.selectedDate = 1;
    this.selectedGender = 4;
    this.columnsToDisplay = ['S.no', 'Order ID', 'Date', 'Customer Name', 'Customer Mobile Number', 'Payment Mode', 'Net Total', 'Tax', 'Gross', 'Action'];
    this.serviceColumn = ['S.no', 'Service Name', 'Qty Sold', 'Gross Total'];
    this.productColumn = ['S.no', 'Product Name', 'Quantity', 'Total Amount'];
    this.staffColumn = ['S.no', 'Staff Name', 'Service', 'Product', 'Total', 'No of clients', 'ABV', 'Service Incentive', 'Product Incentive'];
    this.getStoreList();
    this.getChartData('pie');

  }
  ngAfterViewInit1() {
    // this.dataSource.paginator = this.paginator;
    
    this.dataSource.paginator = this.paginatorFirst;
    // this.serviceSalesdataSourceList.paginator = this.paginatorSecond;

  }

  getBillingByStoreId() {
    debugger
    let merchantStoreId: number;
    merchantStoreId = this.selectedStore ? JSON.parse(this.selectedStore) : 0;
    var startDate: any;
    var endDate: any;
    var data: any;
    var currentdate = new Date();
    if (this.selectedDate == 1) {
      startDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + currentdate.getDate().toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';

      endDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + currentdate.getDate().toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "merchantStoreId": merchantStoreId,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    if (this.selectedDate == 2) {
      startDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + (currentdate.getDate() - 1).toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';
      endDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + (currentdate.getDate() - 1).toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "merchantStoreId": merchantStoreId,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    if (this.selectedDate == 3) {
      startDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + (currentdate.getDate() - 6).toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';
      endDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + (currentdate.getDate()).toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "merchantStoreId": merchantStoreId,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    if (this.selectedDate == 4) {
      var date = new Date(), y = date.getFullYear(), m = date.getMonth();
      let firstDay = new Date(y, m, 1);
      let lastDay = new Date(y, m + 1, 0);
      startDate = firstDay.getFullYear() + "-" + (firstDay.getMonth() + 1).toString().padStart(2, '0')
        + "-" + firstDay.getDate().toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';
      endDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + currentdate.getDate().toString().padStart(2, '0') + ' ' + currentdate.getHours().toString().padStart(2, '0') + ":"
        + currentdate.getMinutes().toString().padStart(2, '0');
      data = {
        "merchantStoreId": merchantStoreId,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    if (this.selectedDate == 5) {
      debugger
      let getStartDate = new Date(this.startDate);
      let getEndDate = new Date(this.endDate);
      startDate = getStartDate.getFullYear() + "-" + (getStartDate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + getStartDate.getDate().toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';
      endDate = getEndDate.getFullYear() + "-" + (getEndDate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + getEndDate.getDate().toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "merchantStoreId": merchantStoreId,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    this.api.getByStore(data).subscribe(res => {
      if (res && res.data.length > 0) {
        debugger
        res.data.forEach(element => {
          if (element.paidAmount) {
            element.paidAmount = JSON.parse(element.paidAmount)
          }
          if (element.created_at) {
            console.log('created_at', element.created_at);
            const originalDate: string = element.created_at;
            const dateObject: Date = new Date(originalDate);
            const formattedDate: string = this.datePipe.transform(dateObject, 'yyyy-MM-dd');
            element.created_at = formattedDate;
          }
          if (element.phoneno && element.phoneno != '') {
            let numericPart = (element.phoneno.replace(/\D/g, '')).slice(2);
            element.searchMobileNo = numericPart ? numericPart : "";
          }
          if (element.CGST) {
            element.CGST = JSON.parse(element.CGST);
          }
          if (element.SGST) {
            element.SGST = JSON.parse(element.SGST);
          }
          if (element.gender) {
            element.gender = (element.gender).toLowerCase();
          }
          if (element.cash_paid_amount) {
            element.cash_paid_amount = JSON.parse(element.cash_paid_amount)
          }
          if (element.card_paid_amount) {
            element.card_paid_amount = JSON.parse(element.card_paid_amount)
          }
          if (element.upi_paid_amount) {
            element.upi_paid_amount = JSON.parse(element.upi_paid_amount)
          }
          if (element.Grandtotal) {
            element.Grandtotal = JSON.parse(element.Grandtotal);
          }
        });

        this.getBillings = [];
        this.getAllBillings = this.getBillings;
        let gender: any;
        gender = this.selectedGender == 1 ? 'male' : this.selectedGender == 2 ? 'female' : this.selectedGender == 3 ? 'others' : '';
        if (this.selectedGender == 4) {
          this.getBillings = res.data;
          // this.getAllBillings = this.getBillings;
          this.dataSource.data = this.getBillings;
          // this.dataSource = new MatTableDataSource<any>(this.getBillings);
          this.billingCount = this.dataSource.data.length;
          this.totalAmount();
          this.dataSource.paginator = this.paginatorFirst;

        } else {
          this.getBillings = res.data.filter(x => x.gender == this.selectedGender);
          // this.getAllBillings = this.getBillings;
          this.dataSource.data = this.getBillings;
          // this.dataSource = new MatTableDataSource<any>(this.getBillings);

          this.billingCount = this.dataSource.data.length;

          // this.totalCustomer = data.data?.length;
          this.totalAmount();
          this.dataSource.paginator = this.paginatorFirst;

          // this.dataSource.paginator = this.paginatorFirst;

        }
        console.log('initialget', this.getAllBillings);
        // this.onChangeDate('event');

      } else {
        this.getBillings = [];
        this.getAllBillings = this.getBillings;
        this.dataSource.data = this.getBillings;
        this.billingCount = this.dataSource.data.length;


        this.totalAmount();
      }
    }, (error) => {
      this.getBillings = [];
      this.getAllBillings = this.getBillings;
      this.dataSource.data = this.getBillings;
      this.billingCount = this.dataSource.data.length;
      this.totalAmount();
    }), (error) => {
      this.getBillings = [];
      this.getAllBillings = this.getBillings;
      this.dataSource.data = this.getBillings;
      this.billingCount = this.dataSource.data.length;
      this.totalAmount();
    }
  }
  getServiceSalesList() {

    let merchantStoreId = this.selectedStore ? JSON.parse(this.selectedStore) : 0;
    debugger
    var startDate: any;
    var endDate: any;
    var data: any;
    var currentdate = new Date();
    if (this.selectedDate == 1) {
      startDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + currentdate.getDate().toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';
      endDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + currentdate.getDate().toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "merchantStoreId": merchantStoreId,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    if (this.selectedDate == 2) {
      startDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + (currentdate.getDate() - 1).toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';
      endDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + (currentdate.getDate() - 1).toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "merchantStoreId": merchantStoreId,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    if (this.selectedDate == 3) {
      startDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + (currentdate.getDate() - 6).toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';

      endDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + (currentdate.getDate()).toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';

      data = {
        "merchantStoreId": merchantStoreId,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    if (this.selectedDate == 4) {
      var date = new Date(), y = date.getFullYear(), m = date.getMonth();
      let firstDay = new Date(y, m, 1);
      let lastDay = new Date(y, m + 1, 0);
      startDate = firstDay.getFullYear() + "-" + (firstDay.getMonth() + 1).toString().padStart(2, '0')
        + "-" + firstDay.getDate().toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';

      endDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + currentdate.getDate().toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "merchantStoreId": merchantStoreId,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    if (this.selectedDate == 5) {
      debugger
      let getStartDate = new Date(this.startDate);
      let getEndDate = new Date(this.endDate);
      startDate = getStartDate.getFullYear() + "-" + (getStartDate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + getStartDate.getDate().toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';
      endDate = getEndDate.getFullYear() + "-" + (getEndDate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + getEndDate.getDate().toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "merchantStoreId": merchantStoreId,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    this.api.getServiceSalesList(data).subscribe((res) => {
      if (res && res.data.length > 0) {
        var totalProductprice: number = 0;
        console.log('servicesalesres', res);
        if (this.selectedGender == 4) {
          this.serviceSalesList = res.data;
          this.serviceSalesList.forEach(element => {
            totalProductprice = totalProductprice + element.totalPrice;
          });
          this.totalBillValue = Math.round(totalProductprice);
          this.serviceSalesdataSourceList.data = this.serviceSalesList;
          this.billingCount = this.serviceSalesdataSourceList.data.length;
        } else {
          this.serviceSalesList = res.data;
          this.serviceSalesList.forEach(element => {
            totalProductprice = totalProductprice + element.totalPrice;
          });
          this.totalBillValue = Math.round(totalProductprice);
          this.serviceSalesdataSourceList.data = this.serviceSalesList;
          this.billingCount = this.serviceSalesdataSourceList.data.length;
        }
        let cashAmount = _.sumBy(this.serviceSalesList, 'cash_paid_amount');
        this.cashPaymentAmount = cashAmount ? cashAmount : 0;
        let cardAmount = _.sumBy(this.serviceSalesList, 'card_paid_amount');
        this.cardPaymentAmount = cardAmount ? cardAmount : 0;
        let upiAmount = _.sumBy(this.serviceSalesList, 'upi_paid_amount');
        this.onlinePaymentAmount = upiAmount ? upiAmount : 0;
        this.cashPercentage = this.cashPaymentAmount > 0 ? Math.round((this.cashPaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
        this.cardPercentage = this.cardPaymentAmount > 0 ? Math.round((this.cardPaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
        this.upiPercentage = this.onlinePaymentAmount > 0 ? Math.round((this.onlinePaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
        this.serviceSalesdataSourceList.paginator = this.paginatorSecond;

      } else {
        this.serviceSalesList = [];
        this.serviceSalesdataSourceList.data = this.serviceSalesList;
        this.billingCount = this.serviceSalesdataSourceList.data.length;
      }
    }, (error) => {
      this.serviceSalesList = [];
      this.serviceSalesdataSourceList.data = this.serviceSalesList;
      this.billingCount = this.serviceSalesdataSourceList.data.length;
    }), (error) => {
      this.serviceSalesList = [];
      this.serviceSalesdataSourceList.data = this.serviceSalesList;
      this.billingCount = this.serviceSalesdataSourceList.data.length;
    }
  }
  getProductSalesList() {
    debugger
    let merchantStoreId = this.selectedStore ? JSON.parse(this.selectedStore) : 0;
    var startDate: any;
    var endDate: any;
    var data: any;
    var currentdate = new Date();
    if (this.selectedDate == 1) {
      startDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + currentdate.getDate().toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';

      endDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + currentdate.getDate().toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "merchantStoreId": merchantStoreId,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    if (this.selectedDate == 2) {
      startDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + (currentdate.getDate() - 1).toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';
      endDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + (currentdate.getDate() - 1).toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "merchantStoreId": merchantStoreId,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    if (this.selectedDate == 3) {


      startDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + (currentdate.getDate() - 6).toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';

      endDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + (currentdate.getDate()).toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';

      data = {
        "merchantStoreId": merchantStoreId,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    if (this.selectedDate == 4) {
      var date = new Date(), y = date.getFullYear(), m = date.getMonth();
      let firstDay = new Date(y, m, 1);
      let lastDay = new Date(y, m + 1, 0);
      startDate = firstDay.getFullYear() + "-" + (firstDay.getMonth() + 1).toString().padStart(2, '0')
        + "-" + firstDay.getDate().toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';


      endDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + currentdate.getDate().toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "merchantStoreId": merchantStoreId,
        "start_date": startDate,
        "end_date": endDate
      }

    }
    if (this.selectedDate == 5) {
      debugger
      let getStartDate = new Date(this.startDate);
      let getEndDate = new Date(this.endDate);
      startDate = getStartDate.getFullYear() + "-" + (getStartDate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + getStartDate.getDate().toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';
      endDate = getEndDate.getFullYear() + "-" + (getEndDate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + getEndDate.getDate().toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "merchantStoreId": merchantStoreId,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    this.api.getProductSalesList(data).subscribe((res: any) => {
      if (res && res.length > 0) {
        var totalProductprice: number = 0;
        var gender = this.selectedGender == 1 ? 'male' : this.selectedGender == 2 ? 'female' : 'others';
        if (this.selectedGender == 4) {
          res.forEach(element => {
            totalProductprice = totalProductprice + element.entries[0].totalPrice;
          });
          this.productSalesList = res;
          this.productSalesdataSourceList.data = this.productSalesList;
          this.billingCount = this.productSalesdataSourceList.data.length;
          this.totalBillValue = Math.round(totalProductprice);
          this.productSalesdataSourceList.paginator = this.paginatorThird;

        } else {
          this.productsalesList = res.filter(x => x.gender == gender);
          this.productsalesList.forEach(element => {
            totalProductprice = totalProductprice + element.entries[0].totalPrice;
          });
          this.productSalesdataSourceList.data = this.productsalesList;
          this.billingCount = this.productSalesdataSourceList.data.length;

          this.totalBillValue = Math.round(totalProductprice ? totalProductprice : 0);
          this.productSalesdataSourceList.paginator = this.paginatorThird;
        }

        let cashAmount = _.sumBy(this.productsalesList, 'cash_paid_amount');
        this.cashPaymentAmount = cashAmount ? cashAmount : 0;
        let cardAmount = _.sumBy(this.productsalesList, 'card_paid_amount');
        this.cardPaymentAmount = cardAmount ? cardAmount : 0;
        let upiAmount = _.sumBy(this.productsalesList, 'upi_paid_amount');
        this.onlinePaymentAmount = upiAmount ? upiAmount : 0;

        this.cashPercentage = this.cashPaymentAmount > 0 ? Math.round((this.cashPaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
        this.cardPercentage = this.cardPaymentAmount > 0 ? Math.round((this.cardPaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
        this.upiPercentage = this.onlinePaymentAmount > 0 ? Math.round((this.onlinePaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
      } else {
        this.productsalesList = [];

        this.productSalesdataSourceList.data = this.productsalesList;

        this.billingCount = this.productSalesdataSourceList.data.length;

        let cashAmount = _.sumBy(this.productsalesList, 'cash_paid_amount');
        this.cashPaymentAmount = cashAmount ? cashAmount : 0;
        let cardAmount = _.sumBy(this.productsalesList, 'card_paid_amount');
        this.cardPaymentAmount = cardAmount ? cardAmount : 0;
        let upiAmount = _.sumBy(this.productsalesList, 'upi_paid_amount');
        this.onlinePaymentAmount = upiAmount ? upiAmount : 0;

        this.cashPercentage = this.cashPaymentAmount > 0 ? Math.round((this.cashPaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
        this.cardPercentage = this.cardPaymentAmount > 0 ? Math.round((this.cardPaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
        this.upiPercentage = this.onlinePaymentAmount > 0 ? Math.round((this.onlinePaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
        this.totalBillValue = Math.round(_.sumBy(this.productsalesList, 'paidAmount'));

      }
    }, (error) => {
      this.productsalesList = [];

      this.productSalesdataSourceList.data = this.productsalesList;

      this.billingCount = this.productSalesdataSourceList.data.length;
    }), (error) => {
      this.productsalesList = [];

      this.productSalesdataSourceList.data = this.productsalesList;

      this.billingCount = this.productSalesdataSourceList.data.length;
    }


  }
  getStylists() {
    debugger
    let data = {
      "merchantId": this.selectedStore
    }
    this.api.getStylistByMerchantId(data).subscribe(
      (data) => {
        // console.log(data);
        if (data && data.status === 'SUCCESS') {
          // this.stylistData = data.data;
          // ...filterArray.map(({ id, name }) => ({ [id]: name }))
          let stylistData = [];
          stylistData = data.data.map((item) => (item.accountId));
          console.log('stylistData', stylistData);
          let merchantdata = {
            "merchant_store_id": this.selectedStore

          }
          this.api.storelogindetails(merchantdata).subscribe((response: any) => {
            console.log('res_______', response);
            if (response && response.length > 0) {
              let getStoreDetails = response[0];

              this.getStaffSales_byService_byProducts(stylistData, getStoreDetails)
            }


          })
          // =data.data.map({accountId:any})
        } else {
          // this.toast.showToast();
        }
      },
      (error) => {
        console.log(error);
        // this.toast.showToast();
        // reject(error);
      }
    );
  }
  getStaffSales_byService_byProducts(stylistData, store) {
    debugger
    this.staffSalesList = [];
    var startDate: any;
    var endDate: any;
    var data: any;
    var currentdate = new Date();
    if (this.selectedDate == 1) {
      startDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + currentdate.getDate().toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';

      endDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + currentdate.getDate().toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "staff_Id": stylistData,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    if (this.selectedDate == 2) {
      startDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + (currentdate.getDate() - 1).toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';
      endDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + (currentdate.getDate() - 1).toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "staff_Id": stylistData,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    if (this.selectedDate == 3) {
      startDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + (currentdate.getDate() - 6).toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';

      endDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + (currentdate.getDate()).toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "staff_Id": stylistData,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    if (this.selectedDate == 4) {
      var date = new Date(), y = date.getFullYear(), m = date.getMonth();
      let firstDay = new Date(y, m, 1);
      let lastDay = new Date(y, m + 1, 0);
      startDate = firstDay.getFullYear() + "-" + (firstDay.getMonth() + 1).toString().padStart(2, '0')
        + "-" + firstDay.getDate().toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';

      endDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + currentdate.getDate().toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "staff_Id": stylistData,
        "start_date": startDate,
        "end_date": endDate
      }

    }
    if (this.selectedDate == 5) {

      let getStartDate = new Date(this.startDate);
      let getEndDate = new Date(this.endDate);
      startDate = getStartDate.getFullYear() + "-" + (getStartDate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + getStartDate.getDate().toString().padStart(2, '0') + ' ' + '00' + ":"
        + '00';
      endDate = getEndDate.getFullYear() + "-" + (getEndDate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + getEndDate.getDate().toString().padStart(2, '0') + ' ' + '24' + ":"
        + '00';
      data = {
        "staff_Id": stylistData,
        "start_date": startDate,
        "end_date": endDate
      }
    }
    console.log('startDate', startDate);
    console.log('enddate', endDate);


    this.api.StaffReport(data).subscribe(res => {
      if (res.data.length > 0) {
        for (let i = 0; i < res.data.length; i++) {

          let totalService = _.sumBy(res.data[i].service, 'price');
          let totalProduct = _.sumBy(res.data[i].product, 'price');
          let total = totalService + totalProduct;
          // let totalClients = res.data[i].service.length + res.data[i].product.length;
          let totalClients = res.data[i].Billcount;

          var ABV: any
          if (total > 0 && total > totalClients) {
            let formateABV = (total / totalClients) > 0 ? (total / totalClients).toFixed(2) : 0;
            ABV = formateABV
          } else {
            ABV = 0;
          }
          let serviceDailyIncentive = res.data[i].daily_incentive_service ? res.data[i].daily_incentive_service : 0;
          let productDailyIncentive = res.data[i].daily_incentive_product ? res.data[i].daily_incentive_product : 0;
          let serviceMonthlyIncentive = res.data[i].month_incentive_service ? res.data[i].month_incentive_service : 0;
          let productMonthlyIncentive = res.data[i].month_incentive_product ? res.data[i].month_incentive_product : 0;
          let daily_incentiveServiceBy: any;
          let daily_incentiveProductBy: any;
          let monthly_incentiveServiceBy: any;
          let monthly_incentiveProductBy: any;
          let SI_daily = store.SI_percentage_Daily ? JSON.parse(store.SI_percentage_Daily) : 0;
          let PI_daily = store.PI_percentage_Daily ? JSON.parse(store.PI_percentage_Daily) : 0;
          let SI_monthly = store.SI_percentage_Montly ? JSON.parse(store.SI_percentage_Montly) : 0;
          let PI_monthly = store.PI_percentage_Montly ? JSON.parse(store.PI_percentage_Montly) : 0;

          daily_incentiveServiceBy = res.data[i].service_totalprice >= serviceDailyIncentive ? Math.round((res.data[i].service_totalprice * SI_daily) / 100) : 0;
          daily_incentiveProductBy = res.data[i].product_totalprice >= productDailyIncentive ? Math.round((res.data[i].product_totalprice * PI_daily) / 100) : 0;

          monthly_incentiveServiceBy = res.data[i].service_totalprice >= serviceMonthlyIncentive ? Math.round((res.data[i].service_totalprice * SI_monthly) / 100) : 0;
          monthly_incentiveProductBy = res.data[i].product_totalprice >= productMonthlyIncentive ? Math.round((res.data[i].product_totalprice * PI_monthly) / 100) : 0;



          if (res.data[i].product.length > 0 || res.data[i].service.length > 0) {
            let dailyData = {
              serviceName: res.data[i].first_name,
              serviceTotal: _.sumBy(res.data[i].service, 'price'),
              productTotal: _.sumBy(res.data[i].product, 'price'),
              total: total,
              noofClients: totalClients,
              ABV: ABV,
              billcount: totalClients,
              serviceIncentive: this.selectSalesPerformance == 1 ? daily_incentiveServiceBy : monthly_incentiveServiceBy,
              productIncentive: this.selectSalesPerformance == 1 ? daily_incentiveProductBy : monthly_incentiveProductBy,

            }
            this.staffSalesList.push(dailyData);


          } else {
            this.staffSalesList = [];
            this.staffSSalesdatasourceList.data = this.staffSalesList;
            this.billingCount = this.staffSSalesdatasourceList.data.length;
            this.totalBillValue = Math.round(_.sumBy(this.staffSalesList, 'total'));
          }

        }
        this.staffSSalesdatasourceList.data = this.staffSalesList;
        this.billingCount = this.staffSSalesdatasourceList.data.length;
        this.totalBillValue = Math.round(_.sumBy(this.staffSalesList, 'total'));
        this.staffSSalesdatasourceList.paginator = this.paginatorFour;

        let cashAmount = _.sumBy(this.getAllBillings, 'cash_paid_amount');
        this.cashPaymentAmount = cashAmount ? cashAmount : 0;
        let cardAmount = _.sumBy(this.getAllBillings, 'card_paid_amount');
        this.cardPaymentAmount = cardAmount ? cardAmount : 0;
        let upiAmount = _.sumBy(this.getAllBillings, 'upi_paid_amount');
        this.onlinePaymentAmount = upiAmount ? upiAmount : 0;
        this.cashPercentage = this.cashPaymentAmount > 0 ? Math.round((this.cashPaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
        this.cardPercentage = this.cardPaymentAmount > 0 ? Math.round((this.cardPaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
        this.upiPercentage = this.onlinePaymentAmount > 0 ? Math.round((this.onlinePaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
        // this.totalAmount();

      } else {
        this.staffSalesList = [];
        this.staffSSalesdatasourceList.data = this.staffSalesList;
        this.billingCount = this.staffSSalesdatasourceList.data.length;
        this.totalBillValue = Math.round(_.sumBy(this.getAllBillings, 'total'));
        let cashAmount = _.sumBy(this.getAllBillings, 'cash_paid_amount');
        this.cashPaymentAmount = cashAmount ? cashAmount : 0;
        let cardAmount = _.sumBy(this.getAllBillings, 'card_paid_amount');
        this.cardPaymentAmount = cardAmount ? cardAmount : 0;
        let upiAmount = _.sumBy(this.getAllBillings, 'upi_paid_amount');
        this.onlinePaymentAmount = upiAmount ? upiAmount : 0;
        this.cashPercentage = this.cashPaymentAmount > 0 ? Math.round((this.cashPaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
        this.cardPercentage = this.cardPaymentAmount > 0 ? Math.round((this.cardPaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
        this.upiPercentage = this.onlinePaymentAmount > 0 ? Math.round((this.onlinePaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
        // this.totalAmount();

      }
    }, (error) => {
      this.staffSalesList = [];
      this.staffSSalesdatasourceList.data = this.staffSalesList;
      this.billingCount = this.staffSSalesdatasourceList.data.length;
      this.totalBillValue = Math.round(_.sumBy(this.getAllBillings, 'total'));
    }), (error) => {
      this.staffSalesList = [];
      this.staffSSalesdatasourceList.data = this.staffSalesList;
      this.billingCount = this.staffSSalesdatasourceList.data.length;
      this.totalBillValue = Math.round(_.sumBy(this.getAllBillings, 'total'));
    }
  }
  getStoreList(): void {
    debugger
    this.api.apiGetCall('admin/getAllStores/' + localStorage.getItem('superAdminId')).subscribe((data) => {
      if (data && data.data.length > 0) {
        this.storeList = data.data;
        this.selectedStore = data.data[0].merchant_store_id;
        this.getBillingByStoreId()
      }
    })
  }
  applyTypeFilter() {
    debugger
  }
  selectStore() {
    if (this.selectedDate != 5) {

      this.showCustomeDate = false;
    }
    this.startDate = '';
    this.endDate = '';
    this.getBillingByStoreId()
  }
  selectCategory() {
    debugger
    if (this.selectedDate != 5) {

      this.showCustomeDate = false;
    }
    this.startDate = '';
    this.endDate = '';
    switch (this.selectedCategory) {
      case 1:
        // code block
        this.getBillingByStoreId();
        break;
      case 2:

        this.getServiceSalesList();
        break;
      case 3:
        this.getProductSalesList();
        break;
      default:
        this.selectedDate = 1;
        this.getStylists();
      // code block
    }
  }
  selectDate() {
    debugger

    switch (this.selectedCategory) {
      case 1:
        // code block
        if (this.selectedDate == 5) {
          this.showCustomeDate = true;
          this.getBillings = [];
          this.getAllBillings = this.getBillings;
          this.dataSource.data = this.getBillings;
          this.billingCount = this.dataSource.data.length;
          this.totalAmount();
        } else {
          this.startDate = '';
          this.endDate = '';
          this.showCustomeDate = false;
          this.getBillingByStoreId();
        }
        break;
      case 2:
        if (this.selectedDate == 5) {
          this.showCustomeDate = true;
          this.serviceSalesList = [];
          this.serviceSalesdataSourceList.data = this.serviceSalesList;
          this.billingCount = this.serviceSalesdataSourceList.data.length;
          this.totalAmount();
        } else {
          this.startDate = '';
          this.endDate = '';
          this.showCustomeDate = false;
        }
        this.getServiceSalesList();

        break;
      case 3:
        if (this.selectedDate == 5) {
          this.showCustomeDate = true;
          this.productsalesList = [];

          this.productSalesdataSourceList.data = this.productsalesList;

          this.billingCount = this.productSalesdataSourceList.data.length;
        } else {
          this.startDate = '';
          this.endDate = '';
          this.showCustomeDate = false;
        }
        this.getProductSalesList();
        break;

      default:
        if (this.selectedDate == 5) {
          this.showCustomeDate = true;
          this.staffSalesList = [];
          this.staffSSalesdatasourceList = this.staffSalesList;
          this.billingCount = this.staffSSalesdatasourceList.data.length;
        } else {
          this.startDate = '';
          this.endDate = '';
          this.showCustomeDate = false;
        }
        this.getStylists();
      // code block
    }

  }
  customeDateRage(event) {
    debugger
    console.log('date///');

    if (this.selectedCategory == 1) {
      this.getBillingByStoreId();
    }
    if (this.selectedCategory == 2) {
      this.getServiceSalesList();
    }
    if (this.selectedCategory == 3) {
      this.getProductSalesList();
    }
    if (this.selectedCategory == 4) {
      this.getStylists();
    }
  }
  onFocus(): void {
    if (this.picker) {
      this.picker.open();
    }
  }
  
  selectGender() {
  }
  onChangeSalesPerformance(event: any) {
    if (event.value == 2) {

      this.selectSalesPerformance = 2;
    } else {
      this.selectSalesPerformance = 1;

    }
    debugger
    // if (event && event.detail.value == 1) {

    // } else {

    // }
    this.getStylists();
    debugger
  }
  exportexcel(): void {
    var fileName: any;
    let salesList = [{ name: "S.no" }, { name: "Order ID" }, { name: "Date" }, { name: "Customer Name" }, { name: "Payment Mode" }, { name: "Amount" }, { name: "Action" }];
    let getExportdata = [];
    if (this.selectedCategory == 1) {
      fileName = 'Sales List';
      this.dataSource.data.forEach((element, index) => {
        let data = {
          's.no': index + 1,
          "Order ID": element.bill_id,
          "Date": element.created_at,
          "Customer Name": element.customer_name ? element.customer_name : '',
          "Customer Mobile Number": element.searchMobileNo ? element.searchMobileNo : '',
          "Payment Mode": element.modeofpayment,
          "Net Total": element.amount,
          "Tax": element.CGST + element.SGST,
          "Gross": element.Grandtotal,
        }
        getExportdata.push(data)
      });
      console.log('getExportdata', getExportdata);
    }
    if (this.selectedCategory == 2) {
      fileName = 'Service Sales List';
      this.serviceSalesdataSourceList.data.forEach((element, index) => {
        let data = {
          's.no': index + 1,
          "Service Name": element.name,
          "Qty Sold": element.count,
          "Gross Total": element.totalPrice,

        }
        getExportdata.push(data)
      });
      console.log('getExportdata', getExportdata);
    }
    if (this.selectedCategory == 3) {
      fileName = 'Product Sales List';

      this.productSalesdataSourceList.data.forEach((element, index) => {
        let data = {
          's.no': index + 1,

          "Product Name": element.name,
          "Quantity": element.entries[0].quantity,
          "Total Amount": element.entries[0].totalPrice,
        }
        getExportdata.push(data)
      });
      console.log('getExportdata', getExportdata);
    }
    if (this.selectedCategory == 4) {
      if (this.selectSalesPerformance == 1) {
        fileName = 'Staff Sales Daily performance List';

      } else {
        fileName = 'Staff Sales Monthly performance List';

      }

      this.staffSSalesdatasourceList.data.forEach((element, index) => {
        let data = {
          's.no': index + 1,
          "Staff Name": element.serviceName,
          "Service": element.serviceTotal,
          "Product": element.productTotal,
          "Total": element.total,
          "No of Clients": element.billcount,
          "ABV": element.ABV,
          "Service Incentive": element.serviceIncentive,
          "Product Incentive": element.productIncentive
        }
        getExportdata.push(data)
      });
      console.log('getExportdata', getExportdata);
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(getExportdata);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
  convert() {
    debugger
    let currentdate = new Date();
    let formaateDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
      + "-" + currentdate.getDate().toString().padStart(2, '0') + ' ' + currentdate.getHours().toString().padStart(2, '0') + ":" + currentdate.getMinutes().toString().padStart(2, '0');
    console.log('formate', formaateDate);
    try {


      let getExportdata = [];
      var fileName: any;
      let headerName: any = [];
      let store: any;
      store = this.storeList.filter(x => x.merchant_store_id == this.selectedStore).map(data => data.store_name);
      console.log('store', store);

      let selectedDatetype: any;
      if (this.selectedDate != 5) {
        selectedDatetype = this.dateTypeList.filter(x => x.id == this.selectedDate)
          .map(data => data.name)
      } else {
        let getStartDate = new Date(this.startDate);
        let getEndDate = new Date(this.endDate);
        let startDate = getStartDate.getFullYear() + "-" + (getStartDate.getMonth() + 1).toString().padStart(2, '0')
          + "-" + getStartDate.getDate().toString().padStart(2, '0');
        let endDate = getEndDate.getFullYear() + "-" + (getEndDate.getMonth() + 1).toString().padStart(2, '0')
          + "-" + getEndDate.getDate().toString().padStart(2, '0');
        selectedDatetype = startDate + ' ' + '-' + ' ' + endDate
      }

      if (this.selectedCategory == 1) {
        fileName = 'Sales List';
        headerName = ['s.no', 'Order ID', 'Date', 'Customer Name', 'Customer Mobile Number', 'Payment Mode', 'Net Total', 'Tax', 'Gross'];
        this.dataSource.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.bill_id,
            element.created_at,
            element.customer_name ? element.customer_name : '',
            element.searchMobileNo ? element.searchMobileNo : '',
            element.modeofpayment,
            element.amount,
            element.CGST + element.SGST,
            element.Grandtotal,
          ]
          getExportdata.push(data)
        });


      } else if (this.selectedCategory == 2) {
        fileName = 'Service Sales List';
        headerName = ['s.no', 'Service Name', 'Qty Sold', 'Gross Total'];

        this.serviceSalesdataSourceList.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.name,
            element.count,
            element.totalPrice,

          ]
          getExportdata.push(data)
        });

      } else if (this.selectedCategory == 3) {
        fileName = 'Product Sales List';
        headerName = ['s.no', 'Product Name', 'Quantity', 'Total Amount']

        this.productSalesdataSourceList.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.name,
            element.entries[0].quantity,
            element.entries[0].totalPrice,
          ]
          getExportdata.push(data)
        });
      } else {
        if (this.selectSalesPerformance == 1) {
          fileName = 'Staff Sales Daily performance List';

        } else {
          fileName = 'Staff Sales Monthly performance List';

        }
        headerName = ['s.no', 'Staff Name', 'Service', 'Product', 'Total', 'No of Clients', 'ABV', 'Service Incentive', 'Product Incentive'];
        this.staffSSalesdatasourceList.data.forEach((element, index) => {
          let data = [
            index + 1,
            element.serviceName,
            element.serviceTotal,
            element.productTotal,
            element.total,
            element.noofClients,
            element.ABV,
            element.serviceIncentive,
            element.productIncentive
          ]
          getExportdata.push(data)
        });

      }
      // const arrayOfArrays = getExportdata.map(obj => Object.values(obj));

      console.log('getExportdata', getExportdata);

      const doc = new jsPDF();
      const imageUrl = '../../assets/Bocxy_logo.png'; // Replace with the path to your image
      // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
      const imageWidth = 25; // Adjust the image width as needed
      const pdfWidth = doc.internal.pageSize.getWidth();

      // const imageX = (pdfWidth - imageWidth) / 2;
      const imageX = 10;

      const imageY = 5; // Adjust the top margin as needed

      // doc.addImage(imageUrl, 'png', imageX, imageY, imageWidth, imageWidth);


      // doc.text(fileName + ' ' + '-' + ' ' + selectedDatetype + ':', 14, 15, { align: "center" });
      let cellWidth = this.selectedCategory == 1 || this.selectedCategory == 4 ? {

        0: { cellWidth: 12 }, // Set width for column 0
        1: { cellWidth: 28 }, // Set width for column 1
        // Add more column styles as needed
      } : {

      };


      autoTable(doc, {
        head: [headerName],
        body: getExportdata,
        theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
        headStyles: {
          fillColor: [14, 31, 83],
          // Header background color
          textColor: 255, // Header text color
          // textColor: '#0E1F5',
          fontSize: 10 // Header font size
        },
        bodyStyles: {
          textColor: 0, // Body text color
          fontSize: 10 // Body font size
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255] // Alternate row background color
        },
        columnStyles: cellWidth,
        margin: { top: 30 },
        pageBreak: 'auto',
        didDrawPage: (data) => {
          // console.log('data', data.pageCount);
          doc.addImage(imageUrl, 'png', imageX, imageY, imageWidth, 15);
          doc.setTextColor(14, 31, 83);
          let titleX = this.selectedDate != 5 ? 70 : 90
          let titleY = 20
          // doc.text(fileName + ' ' + '-' + ' ' + selectedDatetype + ':', titleX, titleY, { align: "center" });
          doc.text(store, doc.internal.pageSize.getWidth() / 2, 10, { align: "center" });
          doc.setFontSize(10);

          doc.text(fileName + ' ' + '-' + ' ' + selectedDatetype + ':', doc.internal.pageSize.getWidth() / 2, titleY, { align: "center" });

          doc.setFontSize(10);
          let subTitle;
          if (this.selectedCategory == 1) {
            subTitle = 'No of Bills:' + ' ' + this.billingCount + ', ' + 'Total Bill Value:' + ' ' + this.totalBillValue + ', ' + 'Cash:' + ' ' + this.cashPaymentAmount + ', ' + 'Card:' + ' ' + this.cardPaymentAmount + ', ' + 'UPI:' + ' ' + this.onlinePaymentAmount;
          } else {
            subTitle = 'No of Bills:' + ' ' + this.billingCount + ', ' + 'Total Bill Value:' + ' ' + this.totalBillValue;

          }
          // doc.text(subTitle, titleX, 25, { align: "center" });
          doc.text(subTitle, doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' });
          // doc.setFontSize(10);
          doc.text('Page:' + ' ' + data.pageNumber + ', ' + 'Generated on: ' + formaateDate, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        },
      },)
      if (this.dataSource.data.length > 0 || this.serviceSalesdataSourceList.data.length > 0
        || this.productSalesdataSourceList.data.length > 0 || this.staffSSalesdatasourceList.data.length > 0) {
        setTimeout(() => {
          console.log('fileName', fileName + '.pdf');

          doc.save(fileName + '.pdf')

        }, 100);

      } else {
        this._snackBar.open('No Data Available', 'Close', {
          duration: 3000
        })
      }
    } catch (error) {

    }

  }


  totalAmount() {
    debugger
    let cashAmount = _.sumBy(this.getBillings, 'cash_paid_amount');
    this.cashPaymentAmount = cashAmount ? Math.round(cashAmount) : 0;
    let cardAmount = _.sumBy(this.getBillings, 'card_paid_amount');
    this.cardPaymentAmount = cardAmount ? Math.round(cardAmount) : 0;
    let upiAmount = _.sumBy(this.getBillings, 'upi_paid_amount');
    this.onlinePaymentAmount = upiAmount ? Math.round(upiAmount) : 0;
    // this.cashPercentage = this.cashPaymentAmount > 0 ? Math.round((this.cashPaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
    // this.cardPercentage = this.cardPaymentAmount > 0 ? Math.round((this.cardPaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
    // this.upiPercentage = this.onlinePaymentAmount > 0 ? Math.round((this.onlinePaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 10) / 10 : 0;
    this.cashPercentage = this.cashPaymentAmount > 0 ? Math.round((this.cashPaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 100) : 0;
    this.cardPercentage = this.cardPaymentAmount > 0 ? Math.round((this.cardPaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 100) : 0;
    this.upiPercentage = this.onlinePaymentAmount > 0 ? Math.round((this.onlinePaymentAmount / (this.cashPaymentAmount + this.cardPaymentAmount + this.onlinePaymentAmount)) * 100) : 0;
    debugger
    console.log('cashPercentage', this.cashPercentage);
    this.totalBillValue = Math.round(_.sumBy(this.getBillings, 'Grandtotal'));
    debugger
    // if (this.selectedCategory == 4) {
    //   this.totalBillValue = Math.round(_.sumBy(this.getAllBillings, 'total'));
    // }
    console.log('getBillings', this.getBillings);
  }
  goToView(item: any) {
    debugger
    // let data = item
    // this.router.navigateByUrl('/viewreport');
    this.router.navigate(['viewreport', { id: item.bill_id }]);
  }
  getChartData(type) {
    debugger
    // if (type === 'pie') {
    // this.barChartRef.chartColumnsArray = [];
    // this.barChartRef.chartDataArray = [];
    // let chartData = [];
    // let chartDataColumns = [];
    // this.piechartData?.forEach((element) => {
    //   if (element.name) {
    //     chartData.push([element.name, element.y, element.color]);
    //   }
    // });
    // chartDataColumns = ['name', '', { role: 'style' }];
    // this.barChartRef.chartOptionsg.height = '270';
    // this.barChartRef.chartOptionsg.colors = ['#b23392', '#cc9fc1', '#f7dcf5'];


    // if (chartData?.length > 0) {
    //   this.barChartRef.chartDataArray.push(chartData);
    //   this.barChartRef.chartColumnsArray.push(chartDataColumns);
    //   this.barChartRef.refreshForLastLength();

    // } else {
    //   this.barChartRef.isHide = true;
    // }

    // }

  }
}
