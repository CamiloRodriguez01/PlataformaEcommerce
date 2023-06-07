import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { UsuariosModule } from './usuarios/usuarios.module';

const routes: Routes = [
  {
    path:'',
    loadChildren:()=>import('./autenticacion/autenticacion.module').then(m=>AutenticacionModule)
  },
  {
    path:'usuarios',
    loadChildren:()=>import('./usuarios/usuarios.module').then(m=>UsuariosModule)
    //TODO: Colocar un beforeEntrie. Para que verifique que tenga acceso.
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
