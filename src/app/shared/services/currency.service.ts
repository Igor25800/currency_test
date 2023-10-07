import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, pluck} from "rxjs";
import {environment} from "../../../environments/environment";
import {CurrencyInterface} from "../interfaces/currency.interface";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(
    private _http: HttpClient
  ) { }

  getCurrency(country: string): Observable<CurrencyInterface> {
    return this._http.get<CurrencyInterface>(environment.api + country);
  }

  getCurrencyUSD(): Observable<CurrencyInterface> {
    return this._http.get<CurrencyInterface>(environment.api + 'USD');
  }

  getCurrencyEUR(): Observable<CurrencyInterface> {
    return this._http.get<CurrencyInterface>(environment.api + 'EUR');
  }
}
