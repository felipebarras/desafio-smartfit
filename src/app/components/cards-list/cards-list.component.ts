import { Component, Input, OnInit } from '@angular/core';
import { GetUnitsService } from 'src/app/services/get-available-units.service';
import { Location } from 'src/app/types/location.interface';

@Component({
  selector: 'app-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss'],
})
export class CardsListComponent implements OnInit {
  // precisamos atualizar esse unitsList com o valor que foi filtrado no form
  @Input() unitsList: Location[] = [];

  constructor() {}

  ngOnInit(): void {
    console.log(this.unitsList);
  }
}
