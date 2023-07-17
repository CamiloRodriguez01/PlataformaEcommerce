import { Component } from '@angular/core';
import { ApiService } from 'src/app/api-service/api.service';
import { HistoryI } from '../HistoyI';

@Component({
  selector: 'app-list-history',
  templateUrl: './list-history.component.html',
  styleUrls: ['./list-history.component.css']
})
export class ListHistoryComponent {

  history: HistoryI[] = [];

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.getHistory();

  }

  getHistory(): void {
    this.history = [];
    this.apiService.obtenerInformacion('/cart/history/').subscribe({
      next: (datos: any) => {
        datos.results.forEach((element: any) => {
          this.history.push(element)
        });
      }
    });
  }




}
