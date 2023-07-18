import { Component } from '@angular/core';
import { ApiService } from '../../../api-service/api.service';
import { Producto } from '../../productos/ProductoI';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { Toast , ToastConfirmacion , ToastAutentication} from 'src/app/helpers/useAlerts';
import { Descuento } from '../../inicio/DescuentoI';
import { Category } from '../../productos/Category';
import { Camera, CameraResultType } from '@capacitor/camera';


@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent {
  currentPage = 1;
  itemsPerPage = 12;
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
  imageUrl:any;
  imageView:any;

  @ViewChild('cerrarModalButton') cerrarModalButton!: ElementRef;
  @ViewChild('cerrarModalButtonAd') cerrarModalButtonAd!: ElementRef;
  @ViewChild('cerrarModalButtonImg') cerrarModalButtonImg!: ElementRef;
  @ViewChild('cerrarModalButtonImgPhoto') cerrarModalButtonImgPhoto!: ElementRef;
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
    this.form = this.formBuilder.group({
      name: [''  , [Validators.required, Validators.minLength(3),Validators.maxLength(60)]],
      description: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(150)]],
      price: ['', [Validators.required, Validators.min(1)]],
      category: ['', [Validators.required]],
    });

    this.formAdicionar = this.formBuilder.group({
      name: [''  , [Validators.required, Validators.minLength(3),Validators.maxLength(60)]],
      description: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(150)]],
      price: ['', [Validators.required, Validators.min(1)]],
      category: ['', [Validators.required]],
    });

    this.formFile = this.formBuilder.group({
      image: [''  , [Validators.required]],
      product: [this.idImagen, false],
    });

    this.formDiscont = this.formBuilder.group({
      percentage: [''  , [Validators.required,Validators.min(1),Validators.max(100) ]],
      valid: ['', [Validators.required]],
      inStock: [0, null],
      product: [ '', null],
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

  guardarIdPhoto(id:number):void{
    this.idImagen = id;
    this.takePicture();
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

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });

    const mimeType = "image/jpeg";
    const base64Data = image.base64String;
    const fileName = "captured_image.jpg";
    const blob = this.base64ToBlob(base64Data, mimeType);
    const file = new File([blob], fileName, { type: mimeType });
    this.imageUrl = file;
    this.imageView = "data:image/jpeg;base64, "+base64Data;


  };

  base64ToBlob = (base64:any, mimeType:any) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: mimeType });
  };



  uploadFilePhoto() {
    const formData = new FormData();
    formData.append('image', this.imageUrl);
    formData.append('product', this.idImagen.toString());
    this.apiService.adicionarImagen('/product/images/', formData).subscribe({
      next: (datos: any) => {
        this.obtenerProductos();
      },
    });
    this.cerrarModalButtonImgPhoto.nativeElement.click();
    Toast.fire({icon: 'success',title: 'Imagen cargada correctamente'})
  }

}
