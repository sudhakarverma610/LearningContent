import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from "@angular/core";
import { CategoryPriceRanges } from "src/store/categories/categories.model";
import { trigger, transition, style, animate } from "@angular/animations";
import { Options } from 'ng5-slider/options';

@Component({
  selector: "app-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
  animations: [
    trigger("enterAnimation", [
      transition(":enter", [
        style({ transform: "translateY(-100%)", opacity: 0 }),
        animate("500ms", style({ transform: "translateY(0)", opacity: 1 }))
      ]),
      transition(":leave", [
        style({ transform: "translateY(0)", opacity: 1 }),
        animate("500ms", style({ transform: "translateY(-100%)", opacity: 0 }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit, OnDestroy {
  public _Filters = [];
  public _category = [];

  public _mainCategory;

  public currentFilterredCategories = [];

  public _selectedFilterList = [];

  
  _value: number = 0;
  set value(value) {
    if (value) {
      this._value = value;
      this.count();
    }
  }

  get value() {
    return this._value;
  }

  _highValue: number = 30000;  
  set highValue(highValue) {
    if (highValue) {
      this._highValue = highValue;
      this.count();
    }
  }

  get highValue() {
    return this._highValue;
  }

  upperLimit = 0;

  options: Options = {
    floor: 0,
    ceil: 100
  };

  @Output()
  selectedFilterList = new EventEmitter();

  public _categoryPriceRange: CategoryPriceRanges;

  @Input("categoryPriceRange")
  set categoryPriceRange(categoryPriceRange: CategoryPriceRanges) {
    if (categoryPriceRange) {
      this._categoryPriceRange = categoryPriceRange;
      if (categoryPriceRange.range.length > 0 && categoryPriceRange.range[categoryPriceRange.range.length - 1].value) {
        this.options.ceil = parseInt(this.categoryPriceRange.range[this.categoryPriceRange.range.length - 1].value.split("-")[0], 10);
        this.upperLimit = this.options.ceil;
        this._value = parseInt(this.categoryPriceRange.selectedPriceRange.split("-")[0], 10);
        if (this.categoryPriceRange.selectedPriceRange.split("-")[1] === "max") {
          this._highValue = this.options.ceil;
        } else {
          this._highValue = parseInt(this.categoryPriceRange.selectedPriceRange.split("-")[1], 10);
        }
      }
    }
  }

  get categoryPriceRange() {
    return this._categoryPriceRange;
  }

  @Output()
  filterSelected = new EventEmitter();

  @Output()
  fetchCount = new EventEmitter();

  public arr: { type: number; data: any[] }[] = [];

  constructor() {}

  ngOnInit() {}

  @Input()
  set Filters(Filters) {
    if (Filters) {
      this.arr = [];
      this._Filters = [...Filters];
    }
  }

  get Filters() {
    return this._Filters;
  }

  @Input()
  set mainCategory(mainCategory) {
    if (mainCategory) {
      this._mainCategory = mainCategory;
    }
  }

  get mainCategory() {
    return this._mainCategory;
  }

  @Input("category")
  set category(categories) {
    if (categories) {
      this._category = categories;
    }
  }

  get category() {
    return this._category;
  }

  clear() {
    this.category.forEach(item => {
      item.selected = false;
    });
    this.Filters.forEach(item => {
      item.list.forEach(item2 => {
        item2.selected = false;
      });
    });
    this._highValue = this.options.ceil;
    this._value = 0;
    this.count();
  }

  setUpFilteringObject() {
    this.currentFilterredCategories = this.category;
    this._selectedFilterList = [];
    const tempCat = this.category
      .filter(item => item.selected)
      .map(it => {
        this._selectedFilterList.push(it);
        return it;
      })
      .reduce((acc, cValue) => {
        if (acc !== "") {
          return acc + "," + cValue.id.toString();
        }
        return cValue.id.toString();
      }, "");
    return {
      filter: this.Filters.reduce((accumulator, currentValue) => {
        const newValue = currentValue.list.reduce(
          (accumulator2, currentValue2) => {
            if (currentValue2.selected) {
              this._selectedFilterList.push(currentValue2);
              if (accumulator2 === "") {
                return currentValue2.attribute_option_id.toString();
              }
              return (
                accumulator2 +
                "," +
                currentValue2.attribute_option_id.toString()
              );
            }
            return accumulator2;
          },
          ""
        );
        this.selectedFilterList.emit(this._selectedFilterList);
        if (newValue.length > 0) {
          return accumulator === "" ? newValue : accumulator + "," + newValue;
        }
        return accumulator;
      }, ""),
      category: tempCat ? tempCat : "0",
      filterCategories: this.category,
      selectedPriceRange: this.value + "-" + (this.highValue === this.upperLimit ? "max" : this.highValue)
    };
  }

  show() {
    this.filterSelected.emit(this.setUpFilteringObject());
  }

  count() {
    this.fetchCount.emit(this.setUpFilteringObject());
  }

  removeItem(item) {
    this.category = this.category.map(it => {
      if (item.name === it.name) {
        it.selected = false;
      }
      return it;
    });

    this.Filters = this.Filters.map(a => {
      let tempitem = {
        ...a,
        list: a.list.map(it => {
          if (item.attribute_option_name === it.attribute_option_name) {
            it.selected = false;
          }
          return it;
        })
      };
      return tempitem;
    });
    this.count();
    this.show();
  }

  splitArr(arr: any[], type: number) {
    const data = this.arr.find(a => a.type === type);
    if (data) {
      return data.data;
    }
    const result = [];
    for (let i = 0; i < arr.length; i += 3) {
      result.push(arr.slice(i, i + 3));
    }
    this.arr.push({ data: result, type });
    return result;
  }

  ngOnDestroy() {}
}
