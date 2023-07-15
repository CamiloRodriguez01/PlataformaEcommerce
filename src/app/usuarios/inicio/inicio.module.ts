import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { MainComponent } from './main/main.component';
import { ListaComponent } from './lista/lista.component';


@NgModule({
  declarations: [
    MainComponent,
    ListaComponent
  ],
  imports: [
    CommonModule,
    InicioRoutingModule,
  ]
})
export class InicioModule { }
