import { Component, OnInit } from '@angular/core';
import { NavService } from '../navService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-search',
  styleUrls: ['./search.component.scss'],
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  public searchTerms: string[];
  public search: string;

  constructor(
    private searchService: NavService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchService.getProductTags().subscribe(res => {
      this.searchTerms = res.list;
    });
  }
  searchQuery() {
    if (this.search) {
      const url = '/search?q=' + this.search;
      this.router.navigateByUrl(url);
    }
  }
}
