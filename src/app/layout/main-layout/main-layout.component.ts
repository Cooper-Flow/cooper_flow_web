import { Component, HostListener, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";
import { NavigationService } from '@app/services/common/navigation.service';
import { LoadingService } from '@app/services/common/loading.service';
import { ProfileService } from '@app/services/user/profile.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {

  public openSidebar = signal(false);
  public displayMode = signal('')

  constructor(
    public navigationService: NavigationService,
    private _route: Router,
    public loadingService: LoadingService,
    public profileService: ProfileService
  ) {
    this._route.events.subscribe((val) => {
      if(this.displayMode() === 'mobile') {
        this.openSidebar.set(false)
      }
    })
  }

  ngOnInit(): void {
    this.getPermissions();

    const width = window.innerWidth;
    if(width >= 1024 ) {
      this.displayMode.set('desktop')
      this.openSidebar.set(true)
    } else {
      this.displayMode.set('mobile')
      this.openSidebar.set(false)
    }

    this.navigationService.getExits();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    const width = event.target.innerWidth;
    if(width >= 1024 ) {
      this.displayMode.set('desktop')
      this.openSidebar.set(true)
    } else {
      this.displayMode.set('mobile')
      this.openSidebar.set(false)
    }
  }

  public getPermissions() {
    this.profileService.getPermission().subscribe(
      data => {
        this.navigationService.permissions = data.permission;
        this.navigationService.fullAccess.set( data.access ?? false);
      }
    )
  }
}
