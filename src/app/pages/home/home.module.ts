import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from "./home.component";
import {HomeRouting} from "./home-routing";
import {HeaderComponent} from "../../components/header/header.component";
import { ConversionComponent } from './conversion/conversion.component';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    ConversionComponent
  ],
  imports: [
    CommonModule,
    HomeRouting,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
