import { Component, OnInit, signal } from '@angular/core';
import { NavigationService } from '@app/services/common/navigation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  public pathname = window.location.pathname;
  public isLoading = signal(true);

  constructor(
    public navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  get title() {
    return this.navigationService.getName('locations');
  }

  get icon() {
    return this.navigationService.getIcon('locations');
  }

}
