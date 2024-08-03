import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from '@app/resources/handlers/datetime';
import { Regex } from '@app/resources/handlers/regex';
import { NavigationService } from '@app/services/common/navigation.service';
import { LocationService } from '@app/services/user/location.service';
import { SectorService } from '@app/services/user/sector.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrl: './track.component.scss'
})
export class TrackComponent {

  public pathname = window.location.pathname;
  public isLoading = signal(true);
  public locationList: Array<any> = [];
  public sectorList: Array<any> = [];
  public sector_id = "";

  constructor(
    public navigationService: NavigationService,
    private _locationService: LocationService,
    private _sectorService: SectorService,
    public regex: Regex,
    public dateTime: DateTime,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getSectors();
    this.getTrack();
  }

  get title() {
    return this.navigationService.getName('track');
  }

  get icon() {
    return this.navigationService.getIcon('track');
  }

  get iconLocations() {
    return this.navigationService.getIcon('locations');
  }

  get iconProducers() {
    return this.navigationService.getIcon('producers');
  }

  public getSectors() {

    this._sectorService.combolist().subscribe(
      data => {
        this.sectorList = data;
      }
    )
  }

  public getTrack() {
    this.isLoading.set(true);

    const params = {
      sector_id: this.sector_id
    }

    this._locationService.track(params).subscribe(
      data => {
        this.locationList = data;
        this.isLoading.set(false);
      }
    )
  }

  public detailLocation(id: string) {
    this.router.navigate(['/in/track/location/detail/' + id])
  }

}
