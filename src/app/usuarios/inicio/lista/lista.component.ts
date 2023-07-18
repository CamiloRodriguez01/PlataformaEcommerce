import { Component } from '@angular/core';
import { ApiService } from '../../../api-service/api.service';
import { Producto } from '../../productos/ProductoI';
import { Toast , ToastConfirmacion , ToastAutentication} from 'src/app/helpers/useAlerts';
import { Descuento } from '../DescuentoI';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent {

  carrito: Producto[] = [];
  idActual!: number;
  valorTotal!: number;
  cantidadElementos:number = 0;
  indiceImagen = 0;
  productoElegido!: Producto;
  productos: Producto[] = [];
  descuento:Descuento[] = [];
  

  
  constructor(private apiService: ApiService) {
  }
  ngOnInit(): void {
    this.obtenerCarrito();
  }


  obtenerCarrito(): void {
    this.productos = [];
    this.apiService.obtenerInformacion('/product/discount/').subscribe({
      next: (datos: any) => {
        const idsProductos: number[] = datos.results.map((resultado: any) => resultado.product);
        const idsCarrito: number[] = datos.results.map((resultado: any) => resultado.id);
        this.obtenerDetallesProductos(idsProductos,idsCarrito);
        this.cantidadElementos = datos.results.length;
        this.descuento = datos.results;
      },
      complete: () => {

      }
    });
  }


  obtenerProductoElegido(id: number): void {
    this.apiService.obtenerInformacion('/product/detail/' + id).subscribe({
      next: (datos: any) => {
        this.productoElegido = datos;
      },
      complete: () => {
        this.indiceImagen = 0;
      }
    });
  }

  bucarProducto(id: number): void {
    this.apiService.obtenerInformacion('/product/discount/' + id).subscribe({
      next: (datos: any) => {
      },
    });
  }
  

  cambiarImagen(direccion: number) {
    this.indiceImagen += direccion;
  }

  obtenerDetallesProductos(idsProductos: number[], idsCarrito: number[]): void {
    this.valorTotal = 0;
    const obtenerProducto = (id: number, idCarrito: number) => {
      this.apiService.obtenerInformacion('/product/detail/' + id + '/').subscribe({
        next: (datos: any) => {
          this.valorTotal += datos.price;
          datos.idsCarrito = idCarrito;
          this.productos.push(datos);
        },
        complete: () => {
          if (this.productos.length === idsProductos.length) {
            this.carrito = this.productos;
          }
        }
      });
    };
  
    idsProductos.forEach((id: number, index: number) => {
      const idCarrito = idsCarrito[index];
      obtenerProducto(id, idCarrito);
    });
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

   obtenerDatoDescuento(id: number): string {
    const categoriaEncontrada = this.descuento.find(e => e.product === id);
    return categoriaEncontrada ? categoriaEncontrada.percentage.toString() : '';
  }
  obtenerDatoFecha(id: number): string {
    const categoriaEncontrada = this.descuento.find(e => e.product === id);
    return categoriaEncontrada ? categoriaEncontrada.valid.toString() : '';
  }

  obtenerValordescuento(id: number): string {
    const categoriaEncontrada = this.descuento.find(e => e.product === id);
    let descuento = categoriaEncontrada ? categoriaEncontrada.percentage : 0;
    let precioEncontrado = this.productos.find(e => e.id === id);
    let precio = precioEncontrado ? precioEncontrado.price : 0;
    let valor = precio * (1-(descuento/100));
    return valor.toString();
  }

}
