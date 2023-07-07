import { Component } from '@angular/core';
import { ApiService } from '../../../api-service/api.service';
import { Usuario } from '../UsuarioI';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  usuario: Usuario[] = [];
  form! : FormGroup; 


  constructor(private apiService: ApiService,private formBuilder: FormBuilder) {
    this.obtenerUsuario();
    this.buildForm();
  }

  private buildForm(){
    const textRgx = /^(([a-zA-ZÀ-ÖØ-öø-ÿ]{3,60})([\s]?)([a-zA-ZÀ-ÖØ-öø-ÿ]*))$/;
    const numbergx = /^(([a-zA-ZÀ-ÖØ-öø-ÿ0-9]{3,60})([\s]?)([a-zA-ZÀ-ÖØ-öø-ÿ0-9]*))$/;
    this.form = this.formBuilder.group({
      usarname: [''  , [Validators.required, Validators.pattern(textRgx)]],
      first_name: [''  , [Validators.required, Validators.pattern(textRgx)]],
      last_name: ['', [Validators.required, Validators.pattern(textRgx)]],
      address: ['', [Validators.required, Validators.pattern(textRgx)]],
      email: ['', [Validators.required, Validators.pattern(textRgx)]],
    });

  }

  obtenerUsuario(): void {
    this.apiService.obtenerInformacion('/user/').subscribe(
      {
        next: (datos: any) => {
          this.form.patchValue({
            usarname: datos.username,
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

}
