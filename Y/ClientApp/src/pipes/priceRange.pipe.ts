import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "priceRangeExtension", pure: true })
export class PriceRangeExtension implements PipeTransform {
  transform(value: string, isFirst, isLast) {
    let arr = value.trim().split("-");
    if (value.indexOf("0-") === 0) {
      return "< " + arr[1];
    } else if (value[value.length - 1] === "-") {
      return "> " + arr[0];
    }
    return value;
  }
}
