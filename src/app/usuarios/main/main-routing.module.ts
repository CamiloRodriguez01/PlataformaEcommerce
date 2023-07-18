import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { ProductosModule } from '../productos/productos.module';
import { ComprasModule } from '../compras/compras.module';
import { PerfilModule } from '../perfil/perfil.module';
import { CarroModule } from '../carro/carro.module';
import { InicioModule } from '../inicio/inicio.module';
import { CargueModule } from '../cargue/cargue.module';

const routes: Routes = [
  {
    path:'',
    component:MainComponent,
    children:[
      {
        path:'',
        loadChildren:()=>import('../inicio/inicio.module').then(m=>InicioModule)
      },
      {
        path:'productos',
        loadChildren:()=>import('../productos/productos.module').then(m=>ProductosModule)
      },
      {
        path:'compras',
        loadChildren:()=>import('../compras/compras.module').then(m=>ComprasModule)
      },
      {
        path:'perfil',
        loadChildren:()=>import('../perfil/perfil.module').then(m=>PerfilModule)
      },
      {
        path:'carro',
        loadChildren:()=>import('../carro/carro.module').then(m=>CarroModule)
      },
      {
        path:'cargue',
        loadChildren:()=>import('../cargue/cargue.module').then(m=>CargueModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
