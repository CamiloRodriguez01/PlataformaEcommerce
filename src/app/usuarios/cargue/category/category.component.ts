import { Component } from '@angular/core';
import { ApiService } from '../../../api-service/api.service';
import { Producto } from '../../productos/ProductoI';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { Toast , ToastConfirmacion , ToastAutentication} from 'src/app/helpers/useAlerts';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  currentPage = 1;
  itemsPerPage = 10;
  cantidadElementos:number = 0;
  productos: Producto[] = [];
  form! : FormGroup;
  formAdicionar! : FormGroup;
  formFile! : FormGroup;
  idActual!:number;
  idImagen!:number;
  fileToUpload: File[] = [];
  @ViewChild('cerrarModalButton') cerrarModalButton!: ElementRef;
  @ViewChild('cerrarModalButtonAd') cerrarModalButtonAd!: ElementRef;
  @ViewChild('cerrarModalButtonImg') cerrarModalButtonImg!: ElementRef;

  constructor(private apiService: ApiService , private formBuilder: FormBuilder) {
    this.buildForm();
  }

  private buildForm(){
    const textRgx = /^(([a-zA-ZÀ-ÖØ-öø-ÿ]{3,60})([\s]?)([a-zA-ZÀ-ÖØ-öø-ÿ]*))$/;
    const numbergx = /^(([a-zA-ZÀ-ÖØ-öø-ÿ0-9]{3,60})([\s]?)([a-zA-ZÀ-ÖØ-öø-ÿ0-9]*))$/;
    this.form = this.formBuilder.group({
      name: [''  , [Validators.required, Validators.pattern(textRgx)]],
    });

    this.formAdicionar = this.formBuilder.group({
      name: [''  , [Validators.required, Validators.pattern(textRgx)]],
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.apiService.obtenerInformacion('/product/category/?page='+this.currentPage).subscribe(
      {
        next: (datos: any) => {
          this.productos = datos.results;
          this.cantidadElementos = datos.count;
        }
      }
    );
  }

  changePage(event: Event, page: number): void {
    event.preventDefault();
    this.currentPage = page;
    this.obtenerProductos()
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get totalPages(): number {
    return Math.ceil(this.cantidadElementos / this.itemsPerPage);
  }

  obtenerProductoElegido(id: number): void {
    this.apiService.obtenerInformacion('/product/category/' + id).subscribe(
      {
        next: (datos: any) => {
          this.form.patchValue({
            name: datos.name,
            description: datos.description,
            price: datos.price,
            category: datos.category
          });
          this.idActual = datos.id;
        }
      }
    );
  }

  actualizarInformacion(id:number): void {
    this.apiService.actualizarInformacion('/product/category/'+this.idActual+'/', this.form.value).subscribe(
      {
        next: (datos: any) => {
          this.obtenerProductos();
          this.cerrarModalButton.nativeElement.click();
          Toast.fire({icon: 'success',title: 'Producto actualizado con exito'})
        }
      }
    );
  }

  adicionarInformacion(): void {
    this.apiService.adicionarInformacion('/product/category/', this.formAdicionar.value).subscribe(
      {
        next: (datos: any) => {
          this.obtenerProductos();
          this.cerrarModalButtonAd.nativeElement.click();
          Toast.fire({icon: 'success',title: 'Producto adicionado con exito'})

        }
      }
    );
  }

  onFileSelected(event: any) {
    this.fileToUpload = Array.from(event.target.files);
  }

  guardarId(id:number):void{
    this.idImagen = id;
  }

  borrarInformacion(id: number): void {

    ToastConfirmacion.fire({
      html: '¿Estas seguro de borrar el producto?:',
    }).then(async(result) => {
        if (result.isConfirmed) {
        this.apiService.borrarInformacion('/product/category/' + id +'/').subscribe(
          {
            next: (datos: any) => {
            },
            complete: () => {
              this.obtenerProductos();
              Toast.fire({icon: 'success',title: 'Producto Eliminado con exito'})
            },
            error: (error: any) => {
              Toast.fire({icon: 'error',title: 'Ocurrio un problema al borrar el producto'})
            }
          }
        );
      }

    });
  }
}
