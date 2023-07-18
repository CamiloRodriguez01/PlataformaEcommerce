import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { ListaComponent } from '../lista/lista.component';
import { ListHistoryComponent } from '../list-history/list-history.component';
import { CardHistoryComponent } from '../card-history/card-history.component';


@NgModule({
  declarations: [
    MainComponent,
    ListaComponent,
    ListHistoryComponent,
    CardHistoryComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
