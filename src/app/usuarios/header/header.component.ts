import { Component } from '@angular/core';
import { Toast , ToastConfirmacion , ToastAutentication} from 'src/app/helpers/useAlerts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router: Router) { 

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



}
