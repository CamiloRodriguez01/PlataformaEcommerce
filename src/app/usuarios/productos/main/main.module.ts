import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { FiltrosComponent } from '../filtros/filtros.component';
import { ListaComponent } from '../lista/lista.component';


@NgModule({
  declarations: [
    MainComponent,
    FiltrosComponent,
    ListaComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
