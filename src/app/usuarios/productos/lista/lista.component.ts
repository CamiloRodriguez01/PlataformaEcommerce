import { Component } from '@angular/core';
import { ApiService } from '../../../api-service/api.service';
import { Producto } from '../../productos/ProductoI';
import { Toast , ToastConfirmacion , ToastAutentication} from 'src/app/helpers/useAlerts';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent {

  currentPage = 1;
  itemsPerPage = 10;
  cantidadElementos:number = 0;
  productos: Producto[] = [];
  idActual!: number;
  nombreBusqueda: string = '';
  productosEncontrados: Producto[] = [];
  backupProductos: Producto[] = [];
  precioMaximo: number = 1000000;
  indiceImagen = 0;
  productoElegido!: Producto;


  //Revisar si se traen como get, o dejarlos fijos. Yo los dejaria fijos jaja
  categoriasSeleccionadas = [
    { seleccionado: true, valor: 2 },
    { seleccionado: true, valor: 4 },
    { seleccionado: true, valor: 3 }
  ];
  
  constructor(private apiService: ApiService) {
    this.backupProductos = [...this.productos];
  }
  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.apiService.obtenerInformacion('/product/detail/?page='+this.currentPage).subscribe(
      {
        next: (datos: any) => {
          this.productos = datos.results;
          this.cantidadElementos = datos.count;
        },
        complete: () => {
          this.buscarPorNombre();
          this.buscarPorPrecio();
          this.buscarPorCategory();
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
          this.productoElegido = datos;
        },
        complete: () => {
          this.indiceImagen = 0;
        }
      }
    );
  }

  //Filtros
  buscarPorNombre(): void{
    this.productos = this.productos.filter(producto =>
      producto.name.toLowerCase().includes(this.nombreBusqueda.toLowerCase())
    );
  }
  buscarPorPrecio(): void{
    this.productos = this.productos.filter(producto =>
      producto.price<=this.precioMaximo);
  }
  buscarPorCategory(): void {
    const categoriasSeleccionadas = this.categoriasSeleccionadas
      .filter((categoria) => categoria.seleccionado)
      .map((categoria) => categoria.valor);

      this.productos = this.productos.filter((producto) => {
        return producto.category.some((categoria) =>
          categoriasSeleccionadas.includes(categoria)
        );
      })
  }
  
  cambiarImagen(direccion: number) {
    this.indiceImagen += direccion;
  }

  adicionarCarrito(id:number): void{
    let prod:any = {};
    prod['product'] = id;
    prod['amount'] = 0;

    ToastConfirmacion.fire({
      html: '¿Estas seguro de adicionar al carrito?:',
    }).then(async(result) => {
      if (result.isConfirmed) {
        this.apiService.adicionarInformacionJ('/cart/detail/',prod).subscribe(
          {
            next: (datos: any) => {
            },
            error: (error: any) => {
              Toast.fire({icon: 'error',title: 'Favor validar los datos ingresados'})
            },  
            complete: () => {
              Toast.fire({icon: 'success',title: 'Producto adicionado al carrito'})
            }
          }
        );
      }
    })
   }



}
