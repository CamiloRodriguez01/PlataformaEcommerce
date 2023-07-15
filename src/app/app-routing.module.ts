import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { BeforeEnterGuardGuard } from '../app/before-enter-guard.guard';

const routes: Routes = [
  {
    path:'',
    loadChildren:()=>import('./autenticacion/autenticacion.module').then(m=>AutenticacionModule)
  },
  {
    path:'usuarios',
    loadChildren:()=>import('./usuarios/usuarios.module').then(m=>UsuariosModule),
    canActivate: [BeforeEnterGuardGuard] 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
