import { Subscription } from 'rxjs';
import { DirectoryService } from './../../services/directory.service';
import { CreateNewFileDialogComponent } from './../createNewFileDialog/createNewFileDialog.component';
import { DocumentService } from './../../services/document.service';
import { FileInfo } from '../../interfaces/fileInfo.interface';
import { ApiService } from './../../services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'wy-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit, OnDestroy {
  @Output() docChanged: EventEmitter<FileInfo> = new EventEmitter<FileInfo>();


  ngOnInit() {
  }

  ngOnDestroy() {
  }

  constructor(
    public dialog: MatDialog,
    private httpClient: HttpClient,
    private api: ApiService,
    private documentService: DocumentService,
    private directoryService: DirectoryService
  ) {}

  openDocument(node) {
    this.docChanged.emit({ name: node.name, path: node.path });
  }
}
