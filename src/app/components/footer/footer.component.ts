import { Subscription } from 'rxjs';
import { SnapshotStore } from '../../stores/snapshot.store';
import { Component, OnInit, Input } from '@angular/core';
import { DocumentDefinition } from '../../models/documentDefinition.interface';

@Component({
  selector: 'wy-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit() {
  }
}
