import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment.prod';
import { AppResponse } from './appResponse.modal';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const API_URL = environment.apiUrl;
// const bocxy_parner_apiurl = environment.bocxy_partner_apiurl;
const bocxy_parner_apiurl = environment.bocxy_partner_apiurl_live;


@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private http: HttpClient) { }
  apiPutCall(postParam: any, endPoint: string): Observable<AppResponse> {
    let finalURL = API_URL + endPoint;
    return this.http.put<AppResponse>(finalURL, postParam).pipe(catchError(this.handleError));
  }
  apiPostCall(postParam: any, endPoint: string): Observable<AppResponse> {
    let finalURL = API_URL + endPoint;
    return this.http.post<AppResponse>(finalURL, postParam).pipe(catchError(this.handleError));
  }

  apiFormDataPostCall(postParam: any, endPoint: string): Observable<AppResponse> {
    let finalURL = API_URL + endPoint;
    return this.http.post<AppResponse>(finalURL, postParam).pipe(catchError(this.handleError));
  }

  apiDeleteCall(id: any, endPoint: string): Observable<AppResponse> {
    let finalURL = API_URL + endPoint;
    return this.http.delete<AppResponse>(finalURL + '/' + id).pipe(catchError(this.handleError));
  }

  apiGetCall(endPoint: string): Observable<AppResponse> {
    let finalURL = API_URL + endPoint;
    return this.http.get<AppResponse>(finalURL).pipe(catchError(this.handleError));
  }

  apiGetDetailsCall(id: any, endPoint: string): Observable<AppResponse> {
    let finalURL = API_URL + endPoint;
    return this.http.get<AppResponse>(finalURL + '/' + id).pipe(catchError(this.handleError));
  }

  getProductData() {
    let url = 'https://ecommerce-kxhu.onrender.com/Product/getProduct';
    // let url ='http://localhost:8000/Product/getProduct'
    return this.http.get(url);
  }
  createProductData(body) {
    let url = 'https://ecommerce-kxhu.onrender.com/Product/createProduct';
    // let url="http://localhost:8000/Product/createProduct"
    return this.http.post(url, body)
  }
  updateProduct(_id) {
    let url = 'https://ecommerce-kxhu.onrender.com/Product/updateProduct';
    // let url ="http://localhost:8000/Product/updateProduct"
    return this.http.put(url, _id)
  }

  deleteProduct(_id) {
    let url = `https://ecommerce-kxhu.onrender.com/Product/deleteProduct/${_id}`;
    // let url = `http://localhost:8000/Product/deleteProduct/${_id}`
    return this.http.delete(url, _id)
  }

  getOrderData() {
    let url = "https://ecommerce-kxhu.onrender.com/Order/getAllOrder";
    // let url='http://localhost:8000/Order/getAllOrder'
    return this.http.get(url)
  }
  updateOrderData(body) {
    let url = "https://ecommerce-kxhu.onrender.com/Order/updateOrder";
    // let url = "http://localhost:8000/Order/updateOrder";
    return this.http.put(url, body)
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something bad happened; please try again later.';

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      //console.error('An error occurred:', error.error.message);
      errorMessage = error.error.message;

    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      //console.error('Else occurred:', error);
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
      errorMessage = error.error;
    }
    // Return an observable with a user-facing error message.
    return throwError(errorMessage);
  }


  getByStore(data: any): Observable<AppResponse> {
    // return this.http.post<{ data: any, status: string }>(`${environment.apiUrl}bills/store`, data, httpOptions)
    //   .pipe(
    //     tap(_ => console.log('getByStore', _)),
    //     catchError(this.eh.handleHttpError<{ data: any, status: string }>('getByStore'))
    //   );
    let finalURL = `${bocxy_parner_apiurl}bills/store`;
    return this.http.post<AppResponse>(finalURL, data).pipe(catchError(this.handleError));
  }
  getServiceSalesList(data: any) {
    let finalURL = `${bocxy_parner_apiurl}serviceReport`;
    return this.http.post<AppResponse>(finalURL, data).pipe(catchError(this.handleError));

  }
  getProductSalesList(data: any) {
    let finalURL = `${bocxy_parner_apiurl}productreport`;
    return this.http.post<AppResponse>(finalURL, data).pipe(catchError(this.handleError));
  }

  getStylists() {
    let finalURL = `${bocxy_parner_apiurl}professionist`;
    return this.http.get<AppResponse>(finalURL).pipe(catchError(this.handleError));

  }
  getStylistByMerchantId(data) {
    let finalURL = `${bocxy_parner_apiurl}newProfessionist`;
    return this.http.post<AppResponse>(finalURL, data).pipe(catchError(this.handleError));
  }
  storelogindetails(data) {

    let finalURL = `${bocxy_parner_apiurl}storelogindetails`;
    return this.http.post<AppResponse>(finalURL, data).pipe(catchError(this.handleError));

  }
  StaffReport(data) {
    let finalURL = `${bocxy_parner_apiurl}staff_report`;
    return this.http.post<AppResponse>(finalURL, data).pipe(catchError(this.handleError));

  }
  getReportsProductDetails(id: number): Observable<{ data: any }> {
    // /bills/getid/

    let finalURL = `${bocxy_parner_apiurl}bills/${id}`;
    return this.http.get<AppResponse>(finalURL).pipe(catchError(this.handleError));

  }
  getReportsServiceDetails(id: number): Observable<{ data: any }> {
    // /bills/getid/
    let finalURL = `${bocxy_parner_apiurl}getService/${id}`;
    return this.http.get<AppResponse>(finalURL).pipe(catchError(this.handleError));

  }

  getAppointmentDetails(id: number) {

    let finalURL = `${bocxy_parner_apiurl}merchantAppointments/${id}`;
    return this.http.get<AppResponse>(finalURL).pipe(catchError(this.handleError));


  }

}

