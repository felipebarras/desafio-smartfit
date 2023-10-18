import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GetUnitsService } from 'src/app/services/get-available-units.service';
import { Location } from 'src/app/types/location.interface';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent implements OnInit {
  results: Location[] = [];
  filteredResults: Location[] = []; // resultados filtrados na busca do formulário
  formGroup!: FormGroup;
  // isto é um atributo e com a exclamação estou avisando que já farei a declaração dele

  constructor(
    private formBuilder: FormBuilder,
    private unitService: GetUnitsService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      hour: '',
      showClosed: true,
    });
    this.unitService.getAllUnits().subscribe((data) => {
      this.results = data.locations;
      this.filteredResults = data.locations;
    });
  }

  onSubmit(): void {
    // momento que ocorrerá o filtro das unidades
    // depois de ter filtrado uma vez, precisa desfazer o que já foi feito
    if (!this.formGroup.value.showClosed) {
      this.filteredResults = this.results.filter(
        (location) => location.opened === true
      );
    } else {
      this.filteredResults = this.results;
    }
  }

  onClean(): void {
    this.formGroup.reset();
  }
}
