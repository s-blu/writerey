import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'writerey';

  constructor(
    private http: HttpClient
  ) { }
  dummyFn() {
    this.http.post('http://127.0.0.1:5000/', {ulul: 'alal'})
      .subscribe(arg => console.log('dizasgidzasd', arg));
  }
}
