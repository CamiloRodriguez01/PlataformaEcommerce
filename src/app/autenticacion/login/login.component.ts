import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api-service/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Toast , ToastFingerPrint, ToastAutentication} from 'src/app/helpers/useAlerts';
import { Capacitor } from '@capacitor/core';
import { BiometricAuth,CheckBiometryResult,BiometryType,BiometryErrorType,BiometryError } from '@aparajita/capacitor-biometric-auth'
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username!: string;
  password!: string;
  form! : FormGroup;

  // Boimetric Auth
  private biometry:CheckBiometryResult = {
    isAvailable: false,
    biometryType: BiometryType.none,
    reason: '',
    code: BiometryErrorType.none
  }

  isNative:boolean = Capacitor.isNativePlatform()
  isEnableBiometryAuth:Boolean = false;

  constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
    this.buildForm();
  }

  private buildForm(){
    const textRgx = /^(([a-zA-ZÀ-ÖØ-öø-ÿ]{3,})([\s]?)([a-zA-ZÀ-ÖØ-öø-ÿ]*))$/;
    this.form = this.formBuilder.group({
      username: [''  , [Validators.required, Validators.pattern(textRgx)]],
      password: [''  , [Validators.required]],
    });
  }


  ngOnInit(): void {
    if(this.isNative){
      this.checkBiometrySensor()
      this.checkBiometryAuth()
    }
  }


  // Boimetric Auth Methods
  private async checkBiometrySensor(){
    this.updateBiometryInfo(await BiometricAuth.checkBiometry())
  }

  private updateBiometryInfo(info: CheckBiometryResult): void {
    this.biometry = info
  }

  private async BiometryAuth():Promise<void>{
    return await BiometricAuth.authenticate();
  }

  private saveLoginInfo(user:string,password:string){
    SecureStoragePlugin.set({key:'user',value:user}).then(success => console.log(success));
    SecureStoragePlugin.set({key:'password',value:password}).then(success => console.log(success));
  }

  private checkBiometryAuth():void{
    SecureStoragePlugin.get({key:'user'}).then(value => {
      this.isEnableBiometryAuth = true
    }).catch(() => {
      this.isEnableBiometryAuth = false
    })
  }

  private async autoFillStorageLogin():Promise<any>{
    await SecureStoragePlugin.get({key:'user'}).then(value => this.form.get('username')?.setValue(value.value) )
    await SecureStoragePlugin.get({key:'password'}).then(value => this.form.get('password')?.setValue(value.value))
  }

  biometryAuthProcess():void {
    this.BiometryAuth().then(async () => {
      await this.autoFillStorageLogin();
      this.apiService.ingreso('/user/o/token/',this.form.value.username,this.form.value.password).subscribe({
        next:(datos:any)=>{
          if (datos.hasOwnProperty('access_token')) this.routeLogin(datos)
        },
        error:(error)=>{
          Toast.fire({icon: 'error',title: 'Porfavor validar los datos ingresados'})
        }
      })
    })
    .catch((error:BiometryError) => {
      console.log(error.code)
      console.log(error.message)
    })
  }



  verificarUsuario(): void {
    this.apiService.ingreso('/user/o/token/',this.form.value.username,this.form.value.password).subscribe(
      {
        next:(datos:any) => {
          if (datos.hasOwnProperty('access_token')) {
            if(this.isNative && this.biometry.isAvailable && !this.isEnableBiometryAuth){
              ToastFingerPrint.fire().then(async (result) => {
                    if (result.isConfirmed) {
                      await this.BiometryAuth().then(() => {
                        this.saveLoginInfo(this.form.value.username, this.form.value.password)
                      })
                      .catch((error:BiometryError) => {
                        console.log(error.code)
                        console.log(error.message)
                      })
                    }

                    this.routeLogin(datos);
                });
            }else{
              this.routeLogin(datos);
            }
          }
        },
        error:(error)=>{
          Toast.fire({icon: 'error',title: 'Favor validar los datos ingresados'})
        }
      }
    );
  }

  private routeLogin(datos:any){
    document.cookie = "token=" + datos.access_token + "; max-age=" + (10 * 60 * 60) + "; path=/";
    window.location.href = window.location.origin + "/usuarios";
  }

}
