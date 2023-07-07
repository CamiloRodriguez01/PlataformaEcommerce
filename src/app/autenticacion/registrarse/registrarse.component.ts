import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api-service/api.service';
import { Router } from '@angular/router';
import { Toast , ToastConfirmacion , ToastAutentication} from 'src/app/helpers/useAlerts';


@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css']
})
export class RegistrarseComponent {
  form! : FormGroup; 

  constructor(private apiService: ApiService , private formBuilder: FormBuilder, private router: Router) {
    this.buildForm();
  }

  private buildForm(){
    const textRgx = /^(([a-zA-ZÀ-ÖØ-öø-ÿ]{3,60})([\s]?)([a-zA-ZÀ-ÖØ-öø-ÿ]*))$/;
    const numbergx = /^(([a-zA-ZÀ-ÖØ-öø-ÿ0-9]{3,60})([\s]?)([a-zA-ZÀ-ÖØ-öø-ÿ0-9]*))$/;
    this.form = this.formBuilder.group({
      username: [''  , [Validators.required, Validators.pattern(textRgx)]],
      name: [''  , [Validators.required, Validators.pattern(textRgx)]],
      password: [''  , [Validators.required, Validators.pattern(textRgx)]],
      password2: [''  , [Validators.required, Validators.pattern(textRgx)]],
      email: [''  , [Validators.required, Validators.pattern(textRgx)]],
      first_name: [''  , [Validators.required, Validators.pattern(textRgx)]],
      last_name: [''  , [Validators.required, Validators.pattern(textRgx)]],
      address: [''  , [Validators.required, Validators.pattern(textRgx)]],
    });

  }

  adicionarInformacion(): void {
        ToastConfirmacion.fire({
          html: '¿Estas seguro de enviar el registro?:',
        }).then(async(result) => {
            if (result.isConfirmed) {
              this.apiService.adicionarInformacion('/user/register/', this.form.value).subscribe(
                {
                  next: (datos: any) => {
                     Toast.fire({icon: 'success',title: 'Usuario registrado correctamente'})
                     this.router.navigateByUrl('/');
                  },
                  error: (error: any) => {
                    Toast.fire({icon: 'error',title: 'Favor validar los datos ingresados'})
                  }
                }
              );
            }
        })
   }

}
