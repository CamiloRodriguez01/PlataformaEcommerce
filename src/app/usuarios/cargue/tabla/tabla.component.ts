import { Component } from '@angular/core';
import { ApiService } from '../../../api-service/api.service';
import { Producto } from '../../productos/ProductoI';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { Toast , ToastConfirmacion , ToastAutentication} from 'src/app/helpers/useAlerts';
import { Descuento } from '../../inicio/DescuentoI';
import { Category } from '../../productos/Category';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent {
  currentPage = 1;
  itemsPerPage = 10;
  cantidadElementos:number = 0;
  productos: Producto[] = [];
  form! : FormGroup; 
  formAdicionar! : FormGroup; 
  formDiscont! : FormGroup; 
  formFile! : FormGroup; 
  idActual!:number;
  idImagen!:number;
  fileToUpload: File[] = [];
  descuento:Descuento[] = [];
  categoria:Category[] = [];

  @ViewChild('cerrarModalButton') cerrarModalButton!: ElementRef;
  @ViewChild('cerrarModalButtonAd') cerrarModalButtonAd!: ElementRef;
  @ViewChild('cerrarModalButtonImg') cerrarModalButtonImg!: ElementRef;
  @ViewChild('cerrarModalButtonDis') cerrarModalButtonDis!: ElementRef;

  constructor(private apiService: ApiService , private formBuilder: FormBuilder) {
    this.buildForm();
    this.obtenerCategorias();
  }

  obtenerCategorias(): void {
    this.apiService.obtenerInformacion('/product/category/').subscribe(
      {
        next: (datos: any) => {
          this.categoria = datos.results;
        }
      }
    );
  }

  private buildForm(){
    const textRgx = /^(([a-zA-ZÀ-ÖØ-öø-ÿ]{3,60})([\s]?)([a-zA-ZÀ-ÖØ-öø-ÿ]*))$/;
    const numbergx = /^(([a-zA-ZÀ-ÖØ-öø-ÿ0-9]{3,60})([\s]?)([a-zA-ZÀ-ÖØ-öø-ÿ0-9]*))$/;
    this.form = this.formBuilder.group({
      name: [''  , [Validators.required, Validators.pattern(textRgx)]],
      description: ['', [Validators.required, Validators.pattern(textRgx)]],
      price: ['', [Validators.required, Validators.pattern(numbergx)]],
      category: ['', [Validators.required, Validators.pattern(numbergx)]],
    });

    this.formAdicionar = this.formBuilder.group({
      name: [''  , [Validators.required, Validators.pattern(textRgx)]],
      description: ['', [Validators.required, Validators.pattern(textRgx)]],
      price: ['', [Validators.required, Validators.pattern(numbergx)]],
      category: ['', [Validators.required, Validators.pattern(numbergx)]],
    });

    this.formFile = this.formBuilder.group({
      image: [''  , false],
      product: [this.idImagen, false],
    });

    this.formDiscont = this.formBuilder.group({
      percentage: [''  , [Validators.required, Validators.pattern(textRgx)]],
      valid: ['', [Validators.required, Validators.pattern(textRgx)]],
      inStock: [0, [Validators.required, Validators.pattern(numbergx)]],
      product: [ '', [Validators.required, Validators.pattern(/^\d+$/)]],
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerDescuentos();
  }

  obtenerProductos(): void {
    this.apiService.obtenerInformacion('/product/detail/?page='+this.currentPage).subscribe(
      {
        next: (datos: any) => {
          this.productos = datos.results;
          this.cantidadElementos = datos.count;
        }
      }
    );
  }

  obtenerDescuentos(): void {
    this.apiService.obtenerInformacion('/product/discount/').subscribe(
      {
        next: (datos: any) => {
          this.descuento = datos.results;
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
    this.apiService.obtenerInformacion('/product/detail/' + id).subscribe(
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
    this.apiService.actualizarInformacion('/product/detail/'+this.idActual+'/', this.form.value).subscribe(
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
    this.apiService.adicionarInformacion('/product/detail/', this.formAdicionar.value).subscribe(
      {
        next: (datos: any) => {
          this.obtenerProductos();
          this.cerrarModalButtonAd.nativeElement.click();
          Toast.fire({icon: 'success',title: 'Producto adicionado con exito'})
        },
        complete: () => {
        }
      }
    );
  }

  onFileSelected(event: any) {
    this.fileToUpload = Array.from(event.target.files);
  }

  uploadFile() {
    console.log("adsadsas");
    for (let i = 0; i < this.fileToUpload.length; i++) {
      const formData = new FormData();
      formData.append('image', this.fileToUpload[i]);
      formData.append('product', this.idImagen.toString());
      this.apiService.adicionarImagen('/product/images/', formData).subscribe({
        next: (datos: any) => {
          this.obtenerProductos();
        }
      });
    }
    this.cerrarModalButtonImg.nativeElement.click();
    Toast.fire({icon: 'success',title: 'Imagenes cargadas correctamente'})

  }

  guardarId(id:number):void{
    this.idImagen = id;
  }

  borrarInformacion(id: number): void {

    ToastConfirmacion.fire({
      html: '¿Estas seguro de borrar el producto?:',
    }).then(async(result) => {
        if (result.isConfirmed) {    
        this.apiService.borrarInformacion('/product/detail/' + id +'/').subscribe(
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

  adicionarDescuento(): void {
      this.formDiscont.value.product = this.idImagen;
      this.apiService.adicionarInformacion('/product/discount/', this.formDiscont.value).subscribe({
        next: (datos: any) => {
          this.obtenerProductos();
          this.obtenerDescuentos();
        },
        complete: () => {
            this.cerrarModalButtonDis.nativeElement.click();
            Toast.fire({icon: 'success',title: 'Producto adicionado correctamente a descuentos'})
        }
      });

  }

  obtenerDescuento(id: number): string {
    const descuentoEncontrar = this.descuento.find(e => e.product === id);
    let variable = descuentoEncontrar?.percentage ? descuentoEncontrar.percentage.toString() : '0';
    return variable;
  }

  obtenerIdDescuento(id: number): number {
    const descuentoEncontrar = this.descuento.find(e => e.product === id);
    let variable = descuentoEncontrar?.id ? descuentoEncontrar.id : 0;
    return variable;
  }

  borrarDescuento(id: number): void {
    ToastConfirmacion.fire({
      html: '¿Estas seguro de borrar el descuento?:',
    }).then(async(result) => {
        if (result.isConfirmed) {    
        this.apiService.borrarInformacion('/product/discount/' + id +'/').subscribe(
          {
            next: (datos: any) => {
              console.log(datos);
            },
            complete: () => {
              this.obtenerProductos();
              this.obtenerDescuentos();
              Toast.fire({icon: 'success',title: 'Descuento Eliminado con exito'})
            },
            error: (error: any) => {
              Toast.fire({icon: 'error',title: 'Ocurrio un problema al borrar el producto'})
            }
          }
        );
      }

    });
  }

  borrarImagen(id: number): void {
    ToastConfirmacion.fire({
      html: '¿Estas seguro de borrar la imagen?:',
    }).then(async(result) => {
        if (result.isConfirmed) {    
        this.apiService.borrarInformacion('/product/images/' + id +'/').subscribe(
          {
            next: (datos: any) => {
            },
            complete: () => {
              this.obtenerProductos();
              this.obtenerDescuentos();
              Toast.fire({icon: 'success',title: 'Imagen eliminada con exito'})
            },
            error: (error: any) => {
              console.log(error);
              Toast.fire({icon: 'error',title: 'Ocurrio un problema al borrar la imagen'})
            }
          }
        );
      }
    });
  }

  obttenerNombreCategoria(id: number): string {
    const categoriaNombre = this.categoria.find(e => e.id === id);
    let variable = categoriaNombre?.name ? categoriaNombre.name : '';
    return variable;

  }
}
