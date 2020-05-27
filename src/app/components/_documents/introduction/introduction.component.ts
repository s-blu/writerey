import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'wy-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss'],
})
export class IntroductionComponent implements OnInit {
  public introduction;
  constructor(private transloco: TranslocoService, private http: HttpClient) {}

  ngOnInit() {
    const lang = this.transloco.getActiveLang();
    this.http.get(`assets/introduction_${lang}.html`, { responseType: 'text' }).subscribe((res: any) => {
      console.log('intro', res);
      this.introduction = res || '';
    });
  }
}
