import { Component } from '@angular/core';
import { ApiService } from '../../../api-service/api.service';
import { Producto } from '../../productos/ProductoI';
import { Toast , ToastConfirmacion , ToastAutentication} from 'src/app/helpers/useAlerts';
import { Category } from '../Category';
import { Descuento } from '../../inicio/DescuentoI';

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
  nombreCategorias: Category[] = [];
  idActual!: number;
  nombreBusqueda: string = '';
  productosEncontrados: Producto[] = [];
  backupProductos: Producto[] = [];
  precioMaximo: number = 1000000;
  indiceImagen = 0;
  productoElegido!: Producto;
  descuento:Descuento[] = [];

  seleccionadoPorDefecto = true;


  constructor(private apiService: ApiService) {
    this.backupProductos = [...this.productos];
  }

  ngOnInit(): void {
    this.obtenerProductos()
    this.obtenerCategorias();
    this.obtenerDescuentos();

  }


  obtenerDescuentos(): void {
    this.apiService.obtenerInformacion('/product/discount/').subscribe({
      next: (datos: any) => {
        this.descuento = datos.results;
      },
      complete: () => {
      }
    });
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
    const categoriasSeleccionadas = this.nombreCategorias
      .filter((categoria) => categoria.seleccionado)
      .map((categoria) => categoria.id);

    this.productos = this.productos.filter((producto) =>
      producto.category.some((categoria) => categoriasSeleccionadas.includes(categoria))
    );
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

   obtenerCategorias(): void{
    this.apiService.obtenerInformacion('/product/category/').subscribe(
      {
        next: (datos: any) => {
          this.nombreCategorias = datos.results;
        },
        complete: () => {
          this.nombreCategorias.forEach(categoria => {
            console.log(categoria.name);
            categoria.seleccionado = true;
          });
        }
      }
    );
   }

   obtenerNombreCategoria(id: number): string {
    const categoriaEncontrada = this.nombreCategorias.find(categoria => categoria.id === id);
    return categoriaEncontrada ? categoriaEncontrada.name : '';
  }

  obtenerDescuento(id: number): number {
    const categoriaEncontrada = this.descuento.find(e => e.product === id);
    let descuento = categoriaEncontrada ? categoriaEncontrada.percentage : 0;
    if (descuento==0)return 0;
    let precioEncontrado = this.productos.find(e => e.id === id);
    let precio = precioEncontrado ? precioEncontrado.price : 0;
    let valor = precio * (1-(descuento/100));
    return valor;
  }


}
