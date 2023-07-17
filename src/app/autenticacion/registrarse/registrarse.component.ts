import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../api-service/api.service';
import { Router } from '@angular/router';
import {
  Toast,
  ToastConfirmacion,
  ToastAutentication,
} from 'src/app/helpers/useAlerts';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css'],
})
export class RegistrarseComponent {
  form!: FormGroup;

  errorMessage = {
    username: [
      { type: 'required', message: 'El usuario es requerido' },
      {
        type: 'pattern',
        message: 'El usuario no cuenta con el formato correcto',
      },
    ],
    first_name: [
      { type: 'required', message: 'El nombre es requerido' },
      {
        type: 'pattern',
        message: 'El nombre no cuenta con el formato correcto',
      },
    ],
    last_name: [
      { type: 'required', message: 'El apellido es requerido' },
      {
        type: 'pattern',
        message: 'El apellido no cuenta con el formato correcto',
      },
    ],
    address: [
      { type: 'required', message: 'La direccion es requerida' },
      {
        type: 'pattern',
        message: 'La direccion no cuenta con el formato correcto',
      },
    ],
    email: [
      { type: 'required', message: 'El correo es requerida' },
      {
        type: 'email',
        message: 'El correo no es valido',
      },
    ],
    password: [
      { type: 'required', message: 'La constraseña es requerida' },
      {
        type: 'pattern',
        message: 'La constraseña no cuenta con el formato correcto',
      },
      {
        type: 'minlength',
        message: 'La constraseña de contener minimo 8 caracteres',
      },
    ],password2: [
      { type: 'required', message: 'La constraseña es requerida' },
    ],
  };

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.buildForm();
  }

  private buildForm() {
    const textRgx: RegExp =
      /^(([a-zA-ZÀ-ÖØ-öø-ÿ]{3,60})([\s]?)([a-zA-ZÀ-ÖØ-öø-ÿ]*))$/;
    const passwordRgx: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+{}[\]|;:'",.<>\/?]).{8,}$/;
    this.form = this.formBuilder.group(
      {
        username: ['', [Validators.required, Validators.pattern(textRgx)]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(passwordRgx),
            Validators.minLength(8),
          ],
        ],
        password2: ['', [Validators.required, this.ConfirmPassowrdValidator]],
        email: ['', [Validators.required, Validators.email]],
        first_name: ['', [Validators.required, Validators.pattern(textRgx)]],
        last_name: ['', [Validators.required, Validators.pattern(textRgx)]],
        address: ['', [Validators.required, Validators.pattern(textRgx)]],
      },
      {
        validators: this.ConfirmPassowrdValidator.bind(this),
      }
    );
  }

  private ConfirmPassowrdValidator(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password') || {};
    const { value: password2 } = formGroup.get('password2') || {};
    return password === password2 ? null : { confirmpassowrd: true };
  }

  adicionarInformacion(): void {
    ToastConfirmacion.fire({
      html: '¿Estas seguro de enviar el registro?:',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.apiService
          .adicionarInformacion('/user/register/', this.form.value)
          .subscribe({
            next: (datos: any) => {
              Toast.fire({
                icon: 'success',
                title: 'Usuario registrado correctamente',
              });
              this.router.navigateByUrl('/');
            },
            error: (error: any) => {
              Toast.fire({
                icon: 'error',
                title: 'Favor validar los datos ingresados',
              });
            },
          });
      }
    });
  }
}
