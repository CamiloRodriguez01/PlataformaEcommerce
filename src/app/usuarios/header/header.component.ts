import { Component } from '@angular/core';
import { Toast , ToastConfirmacion , ToastAutentication} from 'src/app/helpers/useAlerts';
import { Router } from '@angular/router';
import { ApiService } from '../../api-service/api.service';
import { Usuario } from '../perfil/UsuarioI';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { group } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  permiso: Boolean = false;
  form! : FormGroup; 


  constructor(private router: Router, private apiService: ApiService) { 
  }

  ngOnInit(): void {
    this.obtenerUsuario();
  }


  cerrarSesion(){
    ToastConfirmacion.fire({
      html: '¿Estas seguro de cerrar sesiòn?:',
      }).then(async(result) => {
        if (result.isConfirmed) {
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
          this.router.navigateByUrl('/');
        }
    });
  }

  obtenerUsuario(): void {
    this.apiService.obtenerInformacion('/user/').subscribe(
      {
        next: (datos: any) => {
          datos.groups.forEach((element: any) => {
            if(element.name == 'administrator'){
              this.permiso = true;
            }
          })
        },
        complete: () => {

        }
      }
    );
  }


}
