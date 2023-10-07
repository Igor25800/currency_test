export interface CurrencyInterface {
  base_code: string;
  conversion_rates: Currency;
  documentation: string;
  result: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: Date;
  time_next_update_unix: number;
  time_next_update_utc: Date;
}

export interface Currency {
  [key: string]: number
}
