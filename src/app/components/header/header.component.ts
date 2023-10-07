import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Observable} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
    @Input() currencyUSD!: Observable<number>;
    @Input() currencyEUR!: Observable<number>;
}
