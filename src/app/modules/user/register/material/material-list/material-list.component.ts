import { LocationService } from './../../../../../services/user/location.service';
import { Component, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PermissionEnum } from '@app/enum/permissions.enum';
import { Regex } from '@app/resources/handlers/regex';
import { NavigationService } from '@app/services/common/navigation.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { MaterialService } from '@app/services/user/material.service';

interface props {

}


@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrl: './material-list.component.scss'
})
export class MaterialListComponent {

  public isLoading = signal(true);
  displayedColumns: string[] = ['name', 'email', 'status', 'created_at', 'action',];
  public locationList: Array<props> = [];
  public locationTotal: number = 0;
  public page_size: number = 10;
  public page_index: number = 0;
  public order: string = 'asc';

  constructor(
    public navigationService: NavigationService,
    private _materialService: MaterialService,
    private _snackbarService: SnackbarService,
    public regex: Regex,
  ) { }


  ngOnInit(): void {
    this.getMaterials();
  }

  get title() {
    return this.navigationService.getName('materials');
  }

  get icon() {
    return this.navigationService.getIcon('materials');
  }

  public filterOrder(event: Event) {
    this.order = (event.target as HTMLInputElement).value;
    this.getMaterials();
  }

  public pageEvent(event: PageEvent) {
    this.page_size = event.length;
    this.page_index = event.pageIndex;
    this.page_size = event.pageSize;

    this.getMaterials();
  }

  public getMaterials() {

    this.isLoading.set(true);

    const params = {
      search: '',
      page: this.page_index + 1,
      pageSize: this.page_size,
      order: this.order
    }

    this._materialService.paginate(params).subscribe(
      data => {
        this.locationList = data.data;
        this.locationTotal = data.total;
        this.isLoading.set(false);
      },
      error => {
        this._snackbarService.open(error.error.message)
      }
    )
  }

}
