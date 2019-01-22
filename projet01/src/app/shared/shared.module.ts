import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
import { FileDropModule } from 'ngx-file-drop';

@NgModule({
  imports: [
    CommonModule,
    FileDropModule
  ],
  declarations: [
    UploadFilesComponent
  ],
  exports: [
    UploadFilesComponent
  ]
})
export class SharedModule { }
