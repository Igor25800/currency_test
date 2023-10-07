import {Component, OnInit} from '@angular/core';
import {CurrencyService} from "../../shared/services/currency.service";
import {combineLatest, EMPTY, Observable, pluck, switchMap, tap} from "rxjs";
import {Currency, CurrencyInterface} from "../../shared/interfaces/currency.interface";
import {FormControl, FormGroup} from "@angular/forms";

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
  conversionForm!: FormGroup;
  conversion_rates!: Currency;

  constructor(
    private currencyService: CurrencyService
  ) {
  }

  ngOnInit(): void {
    this._getForm();
    this._getCurrency();
    this._changeConversion();
  }

  private _getCurrency(): void {
    this.currencyEUR = this.currencyService.getCurrencyEUR().pipe(pluck('conversion_rates', 'UAH'));
    this.currencyUSD = this.currencyService.getCurrencyUSD().pipe(pluck('conversion_rates', 'UAH'));
    this.currencyService.getCurrency(this.country).subscribe((currency: CurrencyInterface) => {
      this.currency = currency;
      this.arraySelect = Object.keys(currency.conversion_rates);
    })
  }

  private _getForm(): void {
    this.conversionForm = new FormGroup({
      currency_one: new FormControl('USD'),
      currency_two: new FormControl('UAH'),
      from: new FormControl(''),
      to: new FormControl(''),
    })
  }

  private _changeConversion(): void {
    combineLatest(
      Object.keys(this.conversionForm.controls).map((controlName: string) => {
        return this.conversionForm.controls[controlName].valueChanges.pipe(
          switchMap((value:number | string) => {
           return this._formControl(controlName, value);
          })
        )
      })).subscribe();
  }

  private _formControl( control: string, value: number | string ): Observable<CurrencyInterface> {
    const {currency_two, from, to} = this.conversionForm.getRawValue();
    switch (control) {
      case 'currency_one':
        return  this.currencyService.getCurrency(value as string).pipe(
          tap((currency: CurrencyInterface) =>{
            this.currency = currency;
            const resume =  from * currency.conversion_rates[currency_two];
            this.conversionForm.patchValue({to: resume.toFixed(2)}, {emitEvent: false});
          })
        );
      case 'from':
        const fromResume = value as number * this.currency.conversion_rates[currency_two];
        this.conversionForm.patchValue({to: fromResume.toFixed(2)} ,{emitEvent: false});
        break
      case 'currency_two':
        const resumeTwo =  from * this.currency.conversion_rates[currency_two];
        this.conversionForm.patchValue({to: resumeTwo.toFixed(2)},{emitEvent: false} );
        break
      case 'to':
        const r =  to / this.currency.conversion_rates[currency_two];
        this.conversionForm.patchValue({from: r.toFixed(2)},  {emitEvent: false})
        break
    }
    return EMPTY
  }
}
