import { Injectable } from '@angular/core';
import { Location } from '../types/location.interface';

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

@Injectable({
  providedIn: 'root',
})
export class FilterUnitsService {
  constructor() {}

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
            unit_close_hour.replace('h', ''),
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

  filter(results: Location[], showClosed: boolean, hour: string) {
    let intermediateResults = results;

    // momento que ocorrerá o filtro das unidades
    // depois de ter filtrado uma vez, precisa desfazer o que já foi feito
    if (!showClosed) {
      intermediateResults = results.filter(
        (location) => location.opened === true
      );
    }

    if (hour) {
      const OPENED_HOUR = OPENING_HOURS[hour as HOUR_INDEXES].first;
      const CLOSED_HOUR = OPENING_HOURS[hour as HOUR_INDEXES].last;
      return intermediateResults.filter((location) =>
        this.filterUnits(location, OPENED_HOUR, CLOSED_HOUR)
      );
    } else {
      return intermediateResults;
    }
  }
}
