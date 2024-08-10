import { Component, signal } from '@angular/core';
import { DateTime } from '@app/resources/handlers/datetime';
import { NavigationService } from '@app/services/common/navigation.service';
import { RegisterService } from '@app/services/user/register.service';

@Component({
  selector: 'app-track-exit-list',
  templateUrl: './track-exit-list.component.html',
  styleUrl: './track-exit-list.component.scss'
})
export class TrackExitListComponent {

  public isLoading = signal(true);
  public exitList: Array<any> = [];

  constructor(
    public navigationService: NavigationService,
    public _registerService: RegisterService,
    public dateTime: DateTime
  ) { }

  ngOnInit(): void {
    this.getExits();
  }

  get title() {
    return this.navigationService.getName('register');
  }

  get icon() {
    return this.navigationService.getIcon('register');
  }

  public getExits() {
    this._registerService.listExits().subscribe(
      data => {
        this.exitList = data;
        this.isLoading.set(false)
      }
    )
  }
}
