import { Component } from '@angular/core';
import { ApiService } from '../../../api-service/api.service';
import { Producto } from '../../productos/ProductoI';
import { Toast , ToastConfirmacion , ToastAutentication} from 'src/app/helpers/useAlerts';
import { Descuento } from '../../inicio/DescuentoI';

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
  descuentoTotal:number = 0;
  granTotal:number = 0;

  constructor(private apiService: ApiService) {

  }
  ngOnInit(): void {
    this.obtenerCarrito();
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


  obtenerCarrito(): void {
    let idsProductos: number[] =[];
    let idsCarrito: number[] = [];
    this.productos = [];
    this.apiService.obtenerInformacion('/cart/detail/').subscribe({
      next: (datos: any) => {
        idsProductos = datos.results.map((resultado: any) => resultado.product);
        idsCarrito = datos.results.map((resultado: any) => resultado.id);
        this.cantidadElementos = datos.results.length;
      },
      complete: () => {
        this.obtenerDetallesProductos(idsProductos,idsCarrito);
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
            this.obteneralorTotalDescuento();
          this.granTotal = this.valorTotal - this.descuentoTotal;

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

  obtenerDescuento(id: number): number {
    const categoriaEncontrada = this.descuento.find(e => e.product === id);
    let descuento = categoriaEncontrada ? categoriaEncontrada.percentage : 0;
    if (descuento==0)return 0;
    let precioEncontrado = this.productos.find(e => e.id === id);
    let precio = precioEncontrado ? precioEncontrado.price : 0;
    let valor = precio * (1-(descuento/100));
    return valor;

  }

  obtenerDescuentoPorcentaje(id: number): number {
    const categoriaEncontrada = this.descuento.find(e => e.product === id);
    let descuento = categoriaEncontrada ? categoriaEncontrada.percentage : 0;
    if (descuento==0)return 0;
    return descuento;

  }

  obteneralorTotalDescuento(): void {
    this.descuento.forEach(element =>{
      this.productos.forEach(producto => {
        if(element.product === producto.id){
          this.descuentoTotal += producto.price*element.percentage/100;
        }
      });
    })
  }

  closeCart(): void {
    ToastConfirmacion.fire({
      html: '¿Estas seguro de quieres completar la compra?:',
    }).then(async(result) => {
      if (result.isConfirmed) {
        this.apiService.adicionarInformacionJ('/cart/generateJson/',{}).subscribe(
          {
            next: (datos: any) => {
            },
            complete: () => {
              this.obtenerCarrito();
              Toast.fire({icon: 'success',title: 'La compra ha sido completada'})
            },
            error: (error: any) => {
            }
          }
        );
      }
    })
  }

}
