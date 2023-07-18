import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrarseComponent } from './registrarse/registrarse.component';

const routes: Routes = [
  {
    path:'',
    component: LoginComponent
  },
  {
    path:'registrarse',
    component: RegistrarseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutenticacionRoutingModule { }
