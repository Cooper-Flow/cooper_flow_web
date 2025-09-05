import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '@app/shared/shared.module';
import { UserListComponent } from './register/user/user-list/user-list.component';
import { UserFormComponent } from './register/user/user-form/user-form.component';
import { ProducerListComponent } from './register/producer/producer-list/producer-list.component';
import { ProducerFormComponent } from './register/producer/producer-form/producer-form.component';
import { CustomerFormComponent } from './register/customer/customer-form/customer-form.component';
import { CustomerListComponent } from './register/customer/customer-list/customer-list.component';
import { ProductFormComponent } from './register/product/product-form/product-form.component';
import { ProductListComponent } from './register/product/product-list/product-list.component';
import { LocationFormComponent } from './register/location/location-form/location-form.component';
import { LocationListComponent } from './register/location/location-list/location-list.component';
import { MaterialFormComponent } from './register/material/material-form/material-form.component';
import { MaterialListComponent } from './register/material/material-list/material-list.component';
import { ReportComponent } from './report/report.component';
import { StockComponent } from './stock/stock.component';
import { TrackComponent } from './track/track.component';
import { TrackEnterComponent } from './track/track-enter/track-enter.component';
import { TrackExitComponent } from './track/track-exit/track-exit.component';
import { TrackTransformComponent } from './track/track-transform/track-transform.component';
import { SectorFormComponent } from './register/sector/sector-form/sector-form.component';
import { SectorListComponent } from './register/sector/sector-list/sector-list.component';
import { PersonFormComponent } from './register/person/person-form/person-form.component';
import { PersonListComponent } from './register/person/person-list/person-list.component';
import { ProfileFormComponent } from './system/profile/profile-form/profile-form.component';
import { ProfileListComponent } from './system/profile/profile-list/profile-list.component';
import { TrackLocationComponent } from './track/track-location/track-location.component';
import { SettingComponent } from './setting/setting.component';
import { ReportDetailComponent } from './report/report-detail/report-detail.component';
import { TrackExitFormComponent } from './track/track-exit-form/track-exit-form.component';
import { TrackExitListComponent } from './track/track-exit-list/track-exit-list.component';
import { PriceManagerComponent } from './price-manager/price-manager.component';
import { ReportManagerComponent } from './report-manager/report-manager.component';
import { PriceManagerDetailComponent } from './price-manager/price-manager-detail/price-manager-detail.component';
import { A11yModule } from "@angular/cdk/a11y";


@NgModule({
  declarations: [
    HomeComponent,
    UserListComponent,
    UserFormComponent,
    ProducerListComponent,
    ProducerFormComponent,
    CustomerFormComponent,
    CustomerListComponent,
    ProductFormComponent,
    ProductListComponent,
    LocationFormComponent,
    LocationListComponent,
    MaterialFormComponent,
    MaterialListComponent,
    ReportComponent,
    StockComponent,
    TrackComponent,
    TrackEnterComponent,
    TrackExitComponent,
    TrackTransformComponent,
    SectorFormComponent,
    SectorListComponent,
    PersonFormComponent,
    PersonListComponent,
    ProfileFormComponent,
    ProfileListComponent,
    TrackLocationComponent,
    SettingComponent,
    ReportDetailComponent,
    TrackExitFormComponent,
    TrackExitListComponent,
    PriceManagerComponent,
    ReportManagerComponent,
    PriceManagerDetailComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    A11yModule
]
})
export class UserModule { }
