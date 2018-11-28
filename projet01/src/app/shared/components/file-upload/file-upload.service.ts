import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class UploadService {

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
        })
    };
    
    private fileUrl: string;
    
    constructor(private http: HttpClient) { 
        this.fileUrl = `${environment.apiUrl}/pizza/upload`;
    }

  public upload(file: File): { [key: string]: Observable<number> } {
    // this will be the our resulting map
    const status = {};

    console.log('ici !!!!!!!!!!');
    console.log(file);

    // files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', this.fileUrl, formData, {
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates

      let startTime = new Date().getTime();
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage

          const percentDone = Math.round((100 * event.loaded) / event.total);
          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    // });

    // return the map of progress.observables
    return status;
  }
}