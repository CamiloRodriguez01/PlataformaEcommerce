import { Component } from '@angular/core';
import { ApiService } from '../../api-service/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Toast , ToastConfirmacion , ToastAutentication} from 'src/app/helpers/useAlerts';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username!: string;
  password!: string;
  form! : FormGroup;

  constructor(private apiService: ApiService, private router: Router , private formBuilder: FormBuilder) {
    this.buildForm();
  }

  private buildForm(){
    const textRgx = /^(([a-zA-ZÀ-ÖØ-öø-ÿ]{3,})([\s]?)([a-zA-ZÀ-ÖØ-öø-ÿ]*))$/;
    this.form = this.formBuilder.group({
      username: [''  , [Validators.required, Validators.pattern(textRgx)]],
      password: [''  , [Validators.required]],
    });

  }

  // 'CamiloRodriguez','Abc.1234'
  verificarUsuario(): void {
    // window.location.href = window.location.origin + "/usuarios";

    this.apiService.ingreso('/user/o/token/',this.form.value.username,this.form.value.password).subscribe(
      {
        next:(datos:any) => {
          if (datos.hasOwnProperty('access_token')) {
            document.cookie = "token=" + datos.access_token + "; max-age=" + (10 * 60 * 60) + "; path=/";
            window.location.href = window.location.origin + "/usuarios";
            // this.router.navigateByUrl('/usuarios');
          }else{
          }
        },
        error:(error)=>{
          Toast.fire({icon: 'error',title: 'Favor validar los datos ingresados'})
        }
      }
    );
  }

}
