import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/store/products/products.model';
import { AppService } from 'src/services/app.service';

@Component({
    selector: 'app-product-list',
    templateUrl: 'productList.component.html',
    styleUrls: ['productList.component.scss']
})

export class ProductListComponent implements OnInit {
    @Input()
    products: Product[] = [];

    constructor(private appService: AppService) { }

    ngOnInit() {
        if(this.appService.isBrowser) {
            this.scrollinview();
        }
    }

    scrollinview() {   
        const self = this;     
        setTimeout(() => {
            const a = document.getElementById("productList");
            if (a) {
              a.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
            } else {
                self.scrollinview();
            }
        }, 500);
    }
}