// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { DeletionService } from '../../../services/deletion.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { LabelService } from 'src/app/services/label.service';
import { LabelDefinition } from '@writerey/shared/models/labelDefinition.class';
import { LabelStore } from 'src/app/stores/label.store';
import { Router } from '@angular/router';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
/** Flat node with expandable and level information */
interface LabelNode {
  id: string;
  name: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'wy-label-tree',
  templateUrl: './labelTree.component.html',
  styleUrls: ['./labelTree.component.scss'],
})
export class LabelTreeComponent implements OnInit, OnDestroy {
  @Input() project;

  activeLabelId;
  labelDefinitions: Array<LabelDefinition>;
  // Tree Controls
  treeControl = new FlatTreeControl<LabelNode>(
    node => node.level,
    node => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    () => []
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  private subscription = new Subscription();

  constructor(
    private deletionService: DeletionService,
    private labelService: LabelService,
    private labelStore: LabelStore,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.labelStore.labelDefinitions$.subscribe(labelDefs => {
        this.labelDefinitions = labelDefs;
        this.dataSource.data = this.labelDefinitions;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openLabelCategory(node) {
    this.activeLabelId = node.id;
    this.router.navigate(['/labelDefinition', { labelDefinitionId: node.id }]);
  }

  removeLabel(node) {
    this.subscription.add(
      this.deletionService.handleDeleteUserInputAndSnapshot(node.name, 'label').subscribe(result => {
        if (!result) return;
        this.labelService.deleteLabelCategory(node.id).subscribe(() => {
          // TODO show snackbar
        });
      })
    );
  }

  /**
   * Tree functions
   */
  hasChild = (_: number, node: LabelNode) => node.expandable;

  private _transformer(node, level: number) {
    return {
      expandable: false,
      name: node.name,
      id: node.id,
      level,
    };
  }
}
