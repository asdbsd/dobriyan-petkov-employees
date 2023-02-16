import { Component, OnInit, Input } from '@angular/core';
import { ICommonProjectsData } from 'src/shared/iCsvData';

@Component({
  selector: 'app-project-pairs',
  templateUrl: './project-pairs.component.html',
  styleUrls: ['./project-pairs.component.scss']
})
export class ProjectPairsComponent implements OnInit {
  @Input() csvData!: ICommonProjectsData[];
  constructor() { }

  ngOnInit(): void {
    console.log(this.csvData);
  }

}
