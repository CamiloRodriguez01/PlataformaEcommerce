import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  URL_BASE = "http://ec2-100-26-117-71.compute-1.amazonaws.com/api";
  TOKEN = ''

  private headers = new HttpHeaders()
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization' , this.cookieValue('token'));
  private options = {
    headers: this.headers
  };

 
  //Opcion para enviar imagen.
  private headersImage = new HttpHeaders()
  .set('Authorization' , this.cookieValue('token'));
  private optionsImage = {
    headers: this.headersImage
  };

  //Opcion para enviar imagen.
  private headersJson = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('Authorization' , this.cookieValue('token'));
  private optionsJson = {
    headers: this.headersJson
  };



  constructor(private http: HttpClient) {}


  //Solo utilizada para el ingreso.
  public ingreso(endPoint:string, username:string, password:string) {
    const body = new HttpParams()
      .set('client_id', '4xdExjjAyzlNYdRdVi7r3OqZHqwaOvD6Jjt7xw4p')
      .set('client_secret', 'HeKxucasZYrsK0ck70O3fjlTJgbUPrcswAHGhbGsznSxFCJnY01Jl6ty8YqJJdRijK4S4clG2r2sYZvIt4sJIfMmwiVC3dPSL6fANVLrVofiuXakKzuRoLLGvrXSuo7U')
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', password)

    return this.http.post(this.URL_BASE+endPoint, body.toString(), this.options);
  }

  //Obtener el token si existe
  cookieValue(name: string):string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return 'Bearer ' + parts.pop()?.split(';').shift();
    }
    return 'undefined';
  }

  public obtenerInformacion(endPoint:string){
    return this.http.get(this.URL_BASE+endPoint,this.options)
  }

  public actualizarInformacion(endPoint: string, datos: any): Observable<any> {
    const params = new URLSearchParams();
    Object.keys(datos).forEach(key => {
      params.set(key, datos[key]);
    });
    const body = params.toString();
    return this.http.put(this.URL_BASE + endPoint, body, this.options);
  }

  public adicionarInformacion(endPoint: string, datos: any): Observable<any> {
    const params = new URLSearchParams();
    Object.keys(datos).forEach(key => {
      params.set(key, datos[key]);
    });
    const body = params.toString();
    return this.http.post(this.URL_BASE + endPoint, body, this.options);
  }

  public adicionarInformacionJ(endPoint: string, datos: any): Observable<any> {
    console.log(datos);
    const body = JSON.stringify(datos);
    return this.http.post(this.URL_BASE + endPoint, body, this.optionsJson);
  }

  public adicionarImagen(endPoint: string, datos: any): Observable<any> {
    return this.http.post(this.URL_BASE + endPoint, datos, this.optionsImage);
  }

  public borrarInformacion(endPoint: string): Observable<any> {
    return this.http.delete(this.URL_BASE + endPoint, this.optionsImage);
  }
  
  
}