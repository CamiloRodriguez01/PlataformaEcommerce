import { Component, Input, OnInit } from '@angular/core';
import { HistoryConfigI } from '../HistoryConfigI';
import { Producto } from '../../productos/ProductoI';
import { ApiService } from 'src/app/api-service/api.service';

@Component({
  selector: 'app-card-history',
  templateUrl: './card-history.component.html',
  styleUrls: ['./card-history.component.css']
})
export class CardHistoryComponent implements OnInit {
  @Input('date') date! :string;
  @Input('id') id!: number;
  @Input('config') config! :HistoryConfigI[];

  public dateTime!: Date;
  products:Producto[] = [];

  constructor(private apiService: ApiService){}


  ngOnInit(): void {
    this.dateTime = new Date(this.date);
    this.getProductDetails()
  }

  private getProductDetails(){
    this.config.forEach(product => {
      this.bucarProducto(product.product);
    });
  }

  private bucarProducto(id: number): void {
    this.apiService.obtenerInformacion('/product/detail/' + id).subscribe({
      next: (datos: any) => {

        let productExit = this.products.find((e) => {
          e.id == datos.id
        });
        if(!productExit){
          this.products.push(datos)
        }
      },
    });
  }

  public findProduct(id:number):Producto|undefined{
    return this.products.find(e => e.id == id)
  }


}
