import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { TotalComponent } from '../total/total.component';
import { ListaComponent } from '../lista/lista.component';


@NgModule({
  declarations: [
    MainComponent,
    TotalComponent,
    ListaComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
