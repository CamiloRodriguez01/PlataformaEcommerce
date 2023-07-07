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

  carrito: Producto[] = [];
  idActual!: number;
  valorTotal!: number;
  cantidadElementos:number = 0;
  indiceImagen = 0;
  productoElegido!: Producto;
  productos: Producto[] = [];

  
  constructor(private apiService: ApiService) {
  }
  ngOnInit(): void {
    this.obtenerCarrito();
  }


  obtenerCarrito(): void {
    this.productos = [];
    this.apiService.obtenerInformacion('/cart/detail/').subscribe({
      next: (datos: any) => {
        const idsProductos: number[] = datos.results.map((resultado: any) => resultado.product);
        const idsCarrito: number[] = datos.results.map((resultado: any) => resultado.id);
        this.obtenerDetallesProductos(idsProductos,idsCarrito);
        this.cantidadElementos = datos.results.length;
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
    this.apiService.obtenerInformacion('/product/detail/' + id).subscribe({
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
  

  borrarInformacion(id: number): void {
    ToastConfirmacion.fire({
      html: '¿Estas seguro de quitar el producto del carrito?:',
    }).then(async(result) => {
      if (result.isConfirmed) {
        this.apiService.borrarInformacion('/cart/detail/' + id +'/').subscribe(
          {
            next: (datos: any) => {
            },
            complete: () => {
              this.obtenerCarrito();
              Toast.fire({icon: 'success',title: 'Producto eliminado del carrito'})
            },
            error: (error: any) => {
            }
          }
        );
      }
    })

  }


}
