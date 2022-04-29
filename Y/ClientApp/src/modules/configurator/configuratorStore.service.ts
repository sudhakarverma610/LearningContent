import { Injectable, Optional, Inject } from '@angular/core';
import { ConfiguratorSettings } from './modal/configuratorSettings.model';
import { BehaviorSubject, Subject, Observable, forkJoin, noop } from 'rxjs';
import { Product, ProductDTO } from 'src/store/products/products.model';
import { HttpClient } from '@angular/common/http';
import { Angulartics2 } from 'angulartics2';
import { AppService } from 'src/services/app.service';
import { map, tap } from 'rxjs/operators';
@Injectable()
export class ConfiguratorStoreService {
  private settings: ConfiguratorSettings = new ConfiguratorSettings();
  public settingsFetched = false;
  public settingsFetchedSubject: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  private selectedBases: Product[];
  private selectedCharms: Product[];

  private compareListFetched = false;
  private _selectedId:string;
  public itemCountChanged: Subject<number> = new Subject();
  public selectedIdChanged:Subject<string>=new Subject();
  constructor(
    private http: HttpClient,
    private angulartics2: Angulartics2,
    private appService: AppService
  ) {}

  get selectedId(): string {
    return this._selectedId;
  }
  set selectedId(value: string) {    
    this._selectedId=value;
    this.selectedIdChanged.next(value);

  }  
  setSettings(input: ConfiguratorSettings) {
    this.settings = input;
    this.settingsFetched = true;
    this.settingsFetchedSubject.next(true);
  }

  getSettings() {
    return this.settings;
  }

  async getSelectedCharms() {
    const data = await this.fetchCompareList().toPromise();
    return data[2];
  }

  async getSelectedBases() {
    const data = await this.fetchCompareList().toPromise();
    return data[1];
  }

  prepareCompareList(input: Product[]) {
    this.selectedBases = [];
    this.selectedCharms = [];
    input.forEach(item => {
      if (item.tags.find(tag => tag === this.settings.baseTag)) {
        this.selectedBases.push(item);
      } else if (
        item.tags.find(
          tag =>
            tag === this.settings.hangingTag || tag === this.settings.beadTag
        )
      ) {
        this.selectedCharms.push(item);
      }
    });
    this.itemCountChanged.next(
      this.selectedCharms.length + this.selectedBases.length
    );
  }

  fetchCompareList(): Observable<[ConfiguratorSettings, Product[], Product[]]> {
    if (this.compareListFetched) {
      return new Observable<[ConfiguratorSettings, Product[], Product[]]>(
        observer => {
          observer.next([
            this.getSettings(),
            this.selectedBases,
            this.selectedCharms
          ]);
          observer.complete();
        }
      );
    }

    if (!this.appService.isBrowser) {
      return new Observable<[ConfiguratorSettings, Product[], Product[]]>(
        observer => {
          observer.next([
            this.getSettings(),
            this.selectedBases,
            this.selectedCharms
          ]);
          observer.complete();
        }
      );
    }

    return forkJoin([
      this.http.get<ConfiguratorSettings>(`/api/getconfiguratorsettings`),
      this.http.get<ProductDTO>(`/api/get_product_to_compare_list`)
    ]).pipe(
      map((result: [ConfiguratorSettings, ProductDTO]) => {
        this.setSettings(result[0]);
        this.prepareCompareList(result[1].products);
        this.compareListFetched = true;
        const response: [ConfiguratorSettings, Product[], Product[]] = [
          result[0],
          this.selectedBases,
          this.selectedCharms
        ];
        return response;
      })
    );
  }

  addProductToList(input: Product, addToBackend = true): Observable<boolean> {
    try {
      window.dataLayer.push({
        event_category: 'curator',
        event_action: input.name,
        event: 'curator_event'
      });
    } catch (e) {}
    return this.fetchCompareList().pipe(
      map((result: [ConfiguratorSettings, Product[], Product[]]) => {
        const productType = this.checkIfNewProductCanBeAdded(input, result);
        if (productType !== 0) {
          if (productType === 1) {
            if (
              this.selectedBases.findIndex(item => item.id === input.id) === -1
            ) {
              this.selectedBases.push(input);
            }
          } else {
            this.selectedCharms.push(input);
          }
          this.itemCountChanged.next(
            this.selectedCharms.length + this.selectedBases.length
          );
        } else {
          return false;
        }
        return true;
      }),
      tap(item => {
        if (item) {
          this.sendGTMEvent('add');
          if (addToBackend) {
            this.addProductToListAtBackend(input.id).subscribe(noop);
          }
        }
      })
    );
  }

  addProductToListAtBackend(id: string) {
    return this.http.get(`/api/add_product_to_compare_list/${id}`);
  }

  addAllProductToListAtBackend(id: string) {
    return this.http.get(`/api/add_all_product_to_compare_list/${id}`);
  }

  clearCompareList() {
    if (!this.appService.isBrowser) {
      return;
    }
    this.selectedBases = [];
    this.selectedCharms = [];
    this.itemCountChanged.next(
      this.selectedCharms.length + this.selectedBases.length
    );
    this.sendGTMEvent('clearList');
    return this.http.get(`/api/clear_compare_list`);
  }

  removeProductFromCompareList(id: string) {
    let index = this.selectedBases.findIndex(item => item.id === id);
    if (index >= 0) {
      this.selectedBases.splice(index, 1);
    } else {
      index = this.selectedCharms.findIndex(item => item.id === id);
      if (index >= 0) {
        this.selectedCharms.splice(index, 1);
      }
    }
    this.itemCountChanged.next(
      this.selectedCharms.length + this.selectedBases.length
    );
    this.sendGTMEvent('remove');
    return this.http.get(`/api/remove_product_to_compare_list/${id}`);
  }

  checkIfNewProductCanBeAdded(
    input: Product,
    config: [ConfiguratorSettings, Product[], Product[]]
  ): number {
    let result = 0;
    input.tags.forEach(tag => {
      if (tag === config[0].baseTag && config[1].length < 3) {
        result = 1;
      } else if (tag === config[0].beadTag || tag === config[0].hangingTag) {
        const beadSize = parseInt(
          config[0].beadAndHangingAngleOfDeflection.split('-')[0],
          10
        );
        const hangingSize = parseInt(
          config[0].beadAndHangingAngleOfDeflection.split('-')[1],
          10
        );
        let currentTotalDeflection = 0;
        config[2].forEach(item => {
          if (item.tags.find(tag1 => tag1 === this.settings.hangingTag)) {
            currentTotalDeflection += hangingSize;
          } else if (item.tags.find(tag1 => tag1 === this.settings.beadTag)) {
            currentTotalDeflection += beadSize;
          }
        });
        if (currentTotalDeflection <= config[0].angleOfDeflection) {
          result = 2;
        }
      }
    });
    return result;
  }

  isConfigurable(input: Product): Observable<boolean> {
    if (this.settingsFetched) {
      const result = input.tags.find(
        tag =>
          tag === this.settings.baseTag ||
          tag === this.settings.beadTag ||
          tag === this.settings.hangingTag
      )
        ? true
        : false;
      return new Observable<boolean>(observer => {
        observer.next(result);
        observer.complete();
      });
    } else {
      return this.fetchCompareList().pipe(
        map(response => {
          const result = input.tags.find(
            tag =>
              tag === response[0].baseTag ||
              tag === response[0].beadTag ||
              tag === response[0].hangingTag
          )
            ? true
            : false;
          return result;
        })
      );
    }
  }

  sendGTMEvent(type) {
    this.angulartics2.eventTrack.next({
      properties: {
        event: 'curator',
        gtmCustom: {
          change: type,
          charmsList: this.selectedCharms.map(item => {
            return {
              sku: item.sku,
              name: item.name
            };
          }),
          chainsList: this.selectedBases.map(item => {
            return {
              sku: item.sku,
              name: item.name
            };
          })
        }
      }
    });
  }
}
