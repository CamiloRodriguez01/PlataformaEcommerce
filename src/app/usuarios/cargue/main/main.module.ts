import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { TablaComponent } from '../tabla/tabla.component';
import { AdicionarComponent } from '../adicionar/adicionar.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CategoryComponent } from '../category/category.component';


@NgModule({
  declarations: [
    MainComponent,
    TablaComponent,
    AdicionarComponent,
    CategoryComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    FormsModule
    
  ]
})
export class MainModule { }
