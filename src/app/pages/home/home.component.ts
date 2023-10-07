import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CurrencyService} from "../../shared/services/currency.service";
import {Observable, pluck} from "rxjs";
import {CurrencyInterface} from "../../shared/interfaces/currency.interface";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currency!: CurrencyInterface;
  currencyUSD!: Observable<number>;
  currencyEUR!: Observable<number>;
  country: string = 'USD';
  arraySelect!: Array<string>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private currencyService: CurrencyService
  ) {
  }

  ngOnInit(): void {
    this._getCurrency();
  }

  private _getCurrency(): void {
    this.currencyEUR = this.currencyService.getCurrencyEUR().pipe(pluck('conversion_rates', 'UAH'));
    this.currencyUSD = this.currencyService.getCurrencyUSD().pipe(pluck('conversion_rates', 'UAH'));
    this.currencyService.getCurrency(this.country).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((currency: CurrencyInterface) => {
      this.currency = currency;
      this.arraySelect = Object.keys(currency.conversion_rates);
    })
  }
}
