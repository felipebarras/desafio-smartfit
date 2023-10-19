import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GetUnitsService } from 'src/app/services/get-available-units.service';
import { Location } from 'src/app/types/location.interface';

const OPENING_HOURS = {
  morning: {
    first: '06',
    last: '12',
  },
  afternoon: {
    first: '12',
    last: '18',
  },
  evening: {
    first: '18',
    last: '23',
  },
};

type HOUR_INDEXES = 'morning' | 'afternoon' | 'evening';

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

  transformWeekday(weekday: number) {
    switch (weekday) {
      case 0:
        return 'Dom.';
      case 6:
        return 'Sáb.';
      default:
        return 'Seg. à Sex.';
    }
  }

  filterUnits(unit: Location, opened_hour: string, closed_hour: string) {
    // como nem todas as unidades possuem calendários específicos (schedules), retorne true caso n tenha
    if (!unit.schedules) return true;
    let opened_hour_filter = parseInt(opened_hour, 10);
    let closed_hour_filter = parseInt(closed_hour, 10);

    let today_weekday = this.transformWeekday(new Date().getDay());

    for (let i = 0; i < unit.schedules.length; i++) {
      let schedule_hour = unit.schedules[i].hour;
      let schedule_weekday = unit.schedules[i].weekdays;

      if (today_weekday === schedule_weekday) {
        if (schedule_hour !== 'Fechada') {
          let [unit_open_hour, unit_close_hour] = schedule_hour.split(' às ');
          let unit_open_hour_int = parseInt(
            unit_open_hour.replace('h', ''),
            10
          );
          let unit_close_hour_int = parseInt(
            unit_open_hour.replace('h', ''),
            10
          );

          if (
            unit_open_hour_int <= opened_hour_filter &&
            unit_close_hour_int >= closed_hour_filter
          )
            return true;
          else return false;
        }
      }
    }
    return false;
  }

  onSubmit(): void {
    let intermediateResults = this.results;

    // momento que ocorrerá o filtro das unidades
    // depois de ter filtrado uma vez, precisa desfazer o que já foi feito
    if (!this.formGroup.value.showClosed) {
      intermediateResults = this.filteredResults = this.results.filter(
        (location) => location.opened === true
      );
    }

    if (this.formGroup.value.hour) {
      const OPENED_HOUR =
        OPENING_HOURS[this.formGroup.value.hour as HOUR_INDEXES].first;
      const CLOSED_HOUR =
        OPENING_HOURS[this.formGroup.value.hour as HOUR_INDEXES].last;
      this.filteredResults = intermediateResults.filter((location) =>
        this.filterUnits(location, OPENED_HOUR, CLOSED_HOUR)
      );
    } else {
      this.filteredResults = intermediateResults;
    }
  }

  onClean(): void {
    this.formGroup.reset();
  }
}
