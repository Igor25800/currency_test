import { RouterModule, Routes } from "@angular/router";
import {HomeComponent} from "./home.component";


export const homeRouting: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

export const HomeRouting = RouterModule.forChild(homeRouting);
