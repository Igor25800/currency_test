import {Component, DestroyRef, inject, Input, OnInit, Optional, SkipSelf} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {combineLatest, EMPTY, Observable, switchMap, tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CurrencyInterface} from "../../../shared/interfaces/currency.interface";
import {CurrencyService} from "../../../shared/services/currency.service";

@Component({
  selector: 'app-conversion',
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.scss']
})
export class ConversionComponent implements OnInit {
  @Input() arrayCurrency!: Array<string>;
  @Input() currency!: CurrencyInterface;
  private destroyRef = inject(DestroyRef);
  conversionForm!: FormGroup;

  constructor(
    @Optional() @SkipSelf()
    private currencyService: CurrencyService
  ) {
  }
  ngOnInit(): void {
    this._getForm();
    this._changeConversion();
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
      })).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
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
