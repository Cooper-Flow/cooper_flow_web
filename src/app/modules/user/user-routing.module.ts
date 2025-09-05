import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './register/user/user-list/user-list.component';
import { UserFormComponent } from './register/user/user-form/user-form.component';
import { ProducerListComponent } from './register/producer/producer-list/producer-list.component';
import { ProducerFormComponent } from './register/producer/producer-form/producer-form.component';
import { CustomerListComponent } from './register/customer/customer-list/customer-list.component';
import { CustomerFormComponent } from './register/customer/customer-form/customer-form.component';
import { LocationListComponent } from './register/location/location-list/location-list.component';
import { LocationFormComponent } from './register/location/location-form/location-form.component';
import { MaterialListComponent } from './register/material/material-list/material-list.component';
import { MaterialFormComponent } from './register/material/material-form/material-form.component';
import { ProductListComponent } from './register/product/product-list/product-list.component';
import { ProductFormComponent } from './register/product/product-form/product-form.component';
import { ReportComponent } from './report/report.component';
import { StockComponent } from './stock/stock.component';
import { TrackComponent } from './track/track.component';
import { TrackTransformComponent } from './track/track-transform/track-transform.component';
import { TrackEnterComponent } from './track/track-enter/track-enter.component';
import { TrackExitComponent } from './track/track-exit/track-exit.component';
import { SectorListComponent } from './register/sector/sector-list/sector-list.component';
import { SectorFormComponent } from './register/sector/sector-form/sector-form.component';
import { PersonListComponent } from './register/person/person-list/person-list.component';
import { PersonFormComponent } from './register/person/person-form/person-form.component';
import { ProfileListComponent } from './system/profile/profile-list/profile-list.component';
import { ProfileFormComponent } from './system/profile/profile-form/profile-form.component';
import { TrackLocationComponent } from './track/track-location/track-location.component';
import { SettingComponent } from './setting/setting.component';
import { ReportDetailComponent } from './report/report-detail/report-detail.component';
import { TrackExitListComponent } from './track/track-exit-list/track-exit-list.component';
import { TrackExitFormComponent } from './track/track-exit-form/track-exit-form.component';
import { PriceManagerComponent } from './price-manager/price-manager.component';
import { ReportManagerComponent } from './report-manager/report-manager.component';
import { PriceManagerDetailComponent } from './price-manager/price-manager-detail/price-manager-detail.component';
import { PermissionGuard } from '@app/guards/permission.guard';
import { PermissionEnum } from '@app/enum/permissions.enum';

const routes: Routes = [
  // Rastreabilidade
  { path: 'track', component: TrackComponent },
  { path: 'track/enter', component: TrackEnterComponent },
  { path: 'track/transform/:id', component: TrackTransformComponent },
  { path: 'track/exit/detail/:id', component: TrackExitComponent },
  { path: 'track/exit/init', component: TrackExitFormComponent },
  { path: 'track/exit/list', component: TrackExitListComponent },
  { path: 'track/location/detail/:id', component: TrackLocationComponent },

  { path: 'register', component: ReportComponent },
  { path: 'register/:id', component: ReportDetailComponent },
  { path: 'stock', component: StockComponent },

  {
    path: 'price-manager',
    component: PriceManagerComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.P01 }
  },
  {
    path: 'price-manager/:id',
    component: PriceManagerDetailComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.P01 }
  },

  {
    path: 'report-manager',
    component: ReportManagerComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.T07 }
  },

  // Cadastros
  {
    path: 'persons',
    component: PersonListComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.R01 }
  },
  {
    path: 'persons/new',
    component: PersonFormComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.R01 }
  },
  {
    path: 'persons/:id',
    component: PersonFormComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.R01 }
  },

  {
    path: 'products',
    component: ProductListComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.R02 }
  },
  {
    path: 'products/new',
    component: ProductFormComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.R02 }
  },
  {
    path: 'products/:id',
    component: ProductFormComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.R02 }
  },

  {
    path: 'sectors',
    component: SectorListComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.R03 }
  },
  {
    path: 'sectors/new',
    component: SectorFormComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.R03 }
  },
  {
    path: 'sectors/:id',
    component: SectorFormComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.R03 }
  },

  {
    path: 'locations',
    component: LocationListComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.R04 }
  },
  {
    path: 'locations/new',
    component: LocationFormComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.R04 }
  },
  {
    path: 'locations/:id',
    component: LocationFormComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.R04 }
  },

  {
    path: 'materials',
    component: MaterialListComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.R05 }
  },
  {
    path: 'materials/new',
    component: MaterialFormComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.R05 }
  },
  {
    path: 'materials/:id',
    component: MaterialFormComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.R05 }
  },

  {
    path: 'profiles',
    component: ProfileListComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.S01 }
  },
  {
    path: 'profiles/new',
    component: ProfileFormComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.S01 }
  },
  {
    path: 'profiles/:id',
    component: ProfileFormComponent,
    canActivate: [PermissionGuard],
    data: { permission: PermissionEnum.S01 }
  },

  { path: 'setting', component: SettingComponent },

  {
    path: '**',
    redirectTo: 'track',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
