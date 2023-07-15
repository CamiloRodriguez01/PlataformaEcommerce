import { Component } from '@angular/core';
import { ApiService } from '../../../api-service/api.service';
import { Producto } from '../../productos/ProductoI';
import { Toast , ToastConfirmacion , ToastAutentication} from 'src/app/helpers/useAlerts';
import { Descuento } from '../../inicio/DescuentoI';
import config from '../../../../../capacitor.config';

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
  compras:any[] = [];

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.obtenerCompras();
    this.obtenerDescuentos();
    
  }

  obtenerDescuentos(): void {
    this.apiService.obtenerInformacion('/cart/history/').subscribe({
      next: (datos: any) => {
        this.compras = datos.results;
      },
      complete: () => {
      }
    });
  }


  obtenerCompras(): void {
    let idsProductos: number[] =[];
    let idsCarrito: number[] = [];
    this.productos = [];
    this.apiService.obtenerInformacion('/cart/history/').subscribe({
      next: (datos: any) => {
        datos.results.forEach((element: any) => {
          idsProductos = element.config.map((resultado: any) => resultado.product);
        });
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
      if (id === undefined) return
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

  obtenerPrecioVenta(id:number):number{
    let precio = 0;
    this.compras.forEach((element:any) => {
      element.config.forEach((e:any) => {
        if(e.product === id){
          precio =  e.amount;
        }
      })
    })

    return precio;

  }
  

  
}