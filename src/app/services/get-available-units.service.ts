import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UnitsResponse } from '../types/units-response.interface';
import { Location } from '../types/location.interface';

@Injectable({
  // é a maneira de compartilhar o serviço pelos componentes e sempre será a mesma instância
  providedIn: 'root',
})
export class GetUnitsService {
  readonly apiURL =
    'https://test-frontend-developer.s3.amazonaws.com/data/locations.json';

  //behavior subject é uma proprieda do Angular que podemos observar pelas mudanças dela
  private allUnitsSubject: BehaviorSubject<Location[]> = new BehaviorSubject<
    Location[]
  >([]);
  // transformei o allUnits$ para um subject, que é algo que consigo ir mudando o valor através do next()
  private allUnits$: Observable<Location[]> =
    this.allUnitsSubject.asObservable(); // allUnits recebe todos os dados e será um observable, por padrão no Angular, propriedades observable recebem um $. Toda vez que o valor dele muda, as propriedades ao redor serão notificadas disso
  private filteredUnits: Location[] = []; // quando precisar das unidades filtradas

  constructor(private httpClient: HttpClient) {
    this.httpClient.get<UnitsResponse>(this.apiURL).subscribe((data) => {
      // depois da minha Promise finalizar, preciso manipular o resultado e colocá-lo no Observable
      this.allUnitsSubject.next(data.locations);
      this.filteredUnits = data.locations;
    });
  }

  getAllUnits(): Observable<Location[]> {
    return this.allUnits$;
  }

  // o filteredUnits não será Observable, pois ele não é síncrono, afinal será chamado apenas após o filtro
  getFilteredUnits() {
    return this.filteredUnits;
  }

  setFilteredUnits(value: Location[]) {
    this.filteredUnits = value;
  }
}
