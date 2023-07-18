import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../api-service/api.service';
import { Usuario } from '../UsuarioI';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Toast,ToastConfirmacion } from 'src/app/helpers/useAlerts';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  usuario: Usuario[] = [];
  form! : FormGroup;
  passwordForm! : FormGroup;
  stateEdit:boolean = false;
  isEnableBiometryAuth:Boolean = false;

  @ViewChild('closePasswordModal') closePasswordModal!: ElementRef;

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
    ]
  };

  constructor(private apiService: ApiService,private formBuilder: FormBuilder) {
    this.obtenerUsuario();
    this.buildForm();
  }
  ngOnInit(): void {
    this.checkBiometryAuth();
  }

  private buildForm(){
    const textRgx = /^(([a-zA-ZÀ-ÖØ-öø-ÿ]{3,60})([\s]?)([a-zA-ZÀ-ÖØ-öø-ÿ]*))$/;
    const passwordRgx: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+{}[\]|;:'",.<>\/?]).{8,}$/;

    this.form = this.formBuilder.group(
      {
        username: ['', [Validators.required, Validators.pattern(textRgx)]],
        email: ['', [Validators.required, Validators.email]],
        first_name: ['', [Validators.required, Validators.pattern(textRgx)]],
        last_name: ['', [Validators.required, Validators.pattern(textRgx)]],
        address: ['', [Validators.required, Validators.pattern(textRgx)]],
      }
    );
    this.form.disable();

    this.passwordForm = this.formBuilder.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(passwordRgx),
            Validators.minLength(8),
          ],
        ],
        password2: ['', [Validators.required, this.ConfirmPassowrdValidator]],
      },
      {
        validators: this.ConfirmPassowrdValidator.bind(this),
      }
    );

  }

  private checkBiometryAuth():void{
    SecureStoragePlugin.get({key:'user'}).then(value => {
      this.isEnableBiometryAuth = true
    }).catch(() => {
      this.isEnableBiometryAuth = false
    })
  }

  disabledBiometryAuth():void{
    ToastConfirmacion.fire({
      text: "¿Estás seguro de que deseas deshabilitar la autenticación por huella?"
    }).then((result) => {
      if(result.isConfirmed){
        SecureStoragePlugin.remove({key:'user'})
        SecureStoragePlugin.remove({key:'password'})
        this.checkBiometryAuth();
        Toast.fire({icon: 'success',title: 'Se ha deshabilitado la autenticación por huella'})
      }
    })

  }

  private ConfirmPassowrdValidator(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password') || {};
    const { value: password2 } = formGroup.get('password2') || {};
    return password === password2 ? null : { confirmpassowrd: true };
  }

  public enableEdit(){
    this.form.enable();
    this.stateEdit = true;
  }

  obtenerUsuario(): void {
    this.apiService.obtenerInformacion('/user/').subscribe(
      {
        next: (datos: any) => {
          this.form.patchValue({
            username: datos.username,
            first_name: datos.first_name,
            last_name: datos.last_name,
            address: datos.address,
            email: datos.email
          });
        },
        complete: () => {
        }
      }
    );
  }

  updateProfile():void{
    this.apiService.actualizarInformacion('/user/', this.form.value).subscribe(
      {
        next: (datos: any) => {
          Toast.fire({icon: 'success',title: 'Perfil actualizado con exito'})
        },
        error: (err) => {
          console.error(err)
        }
      }
    );
  }

  updatePassword():void{
    this.apiService.actualizarInformacion('/user/updatePassword', this.passwordForm.value).subscribe(
      {
        next: (datos: any) => {
          Toast.fire({icon: 'success',title: 'Contraseña actualizada con exito'});
          this.closePasswordModal.nativeElement.click()
        },
        error: (err) => {
          console.error(err)
        }
      }
    );
  }

}
