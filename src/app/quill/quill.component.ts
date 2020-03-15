import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, debounceTime } from 'rxjs/operators';
import { throwError, from, Observable } from 'rxjs';
import { CompileTemplateMetadata } from '@angular/compiler';


@Component({
  selector: 'wy-quill',
  templateUrl: './quill.component.html',
  styleUrls: ['./quill.component.scss']
})
export class QuillComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ align: [] }],
      ['clean'],
    ]
  };
  styles = {
    border: 'none',
    'font-family': '\'Noto Serif\', \'Libertinus Serif\', \'Palatino Linotype\', \'Book Antiqua\', serif',
    'font-size': '16px'
  };

  constructor(
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
  }

  changedEditor(event) {
    console.log('changed editor');
    console.log(event);

    const formdata = new FormData();
    formdata.append('content', 'abc');
    formdata.append('doc_path', 'this/is/a');

    // const file = new File(event.html, 'seven.txt', {
    //   type: 'text/plain',
    // });

    var myHeaders = new HttpHeaders();
    myHeaders.append('Content-Type', 'multipart/form-data');

    var requestOptions = {
      headers: myHeaders
    };
    let event$ = new Observable((observer) => {
      observer.next(event);
      observer.complete();
    });
    const eventDebounced$ = event$.pipe(
      debounceTime(5000)
    );
    console.log(event$)

    eventDebounced$.subscribe(() => {
      console.log('sub!', new Date().toISOString());
      this.httpClient.put('http://127.0.0.1:5002/doc/seven', formdata, requestOptions)
        .pipe(catchError((err) => this.handleError(err)))
        .subscribe((res) => console.log('i put', res));
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      console.log(error)
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}