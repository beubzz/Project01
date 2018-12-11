import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {
  // Element HTML inpute type file multiple hidden
  @ViewChild('file') file: ElementRef;

  // EVent de sortie
  @Output() addedFiles: EventEmitter<Array<File>> = new EventEmitter();

  public filesToUpload: Array<File>;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Function permettant de récupérer les fichiers uploadé via :
   * - drag and drop de fichier dans la zone
   * - Au click = Input type file multiple hidden
   * 
   * @param fil: Event.tager: Event de l'element HTML qui recois une FileList
   *              || Array<File> dans le cas du drag and drop de fichiers
   * @param fromDropped: boolean - Default = false
   */
  public addFile(fil: any, fromDropped: boolean = false): void {
    // Init de notre Array<File> de retour (output)
    this.filesToUpload = new Array();

    // si l'action vien du mode drag and drop :
    if (fromDropped) {
      for (let file of fil.files) {
        // Verification que ce soit bien un fichier
        if (file.fileEntry.isFile) {

          // Verification again
          file.fileEntry.file((file: File) => {

            // enrichissement de notre Array<File>
            this.filesToUpload.push(file);
            // console.log(this.filesToUpload);

            // si nous somme bien sur le dernier elements
            if (this.filesToUpload.length === fil.files.length) {
              // alors on emit au composant parent le Array<File>
              this.addedFiles.emit(this.filesToUpload);
            }
          });
        }
      }
    } else {
      // fil = Event.target ce qui représente l'input file multiple hidden
      // alors on a deja un Array<File>
      // Donc verification que celui-ci existe et contient au moins 1 element
      if (fil.files && fil.files[0]) {
        this.filesToUpload = fil.files;
        // emit au composant parent le Array<File>
        this.addedFiles.emit(this.filesToUpload);
      }
    }
  }
}
