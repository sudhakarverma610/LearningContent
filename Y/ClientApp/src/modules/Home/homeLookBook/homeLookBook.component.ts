import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/services/app.service';

@Component({
  selector: 'app-homeLookBook',
  templateUrl: './homeLookBook.component.html',
  styleUrls: ['./homeLookBook.component.scss']
})
export class HomeLookBookComponent implements OnInit {
  public desktop = false;
  public src: string;
  public mobileSrc: string;
  constructor(private appService: AppService, private router: Router) { }

  ngOnInit() {
    this.src = 'https://files.y.jewelry/homelookbook.jpg';
    this.mobileSrc = 'https://files.y.jewelry/homelookbook.jpg';
  }
  GotoLookBookPage() {
    this.router.navigateByUrl('/lookbook/ibiza');
  }
}
