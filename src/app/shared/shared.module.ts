import {  CommonModule } from '@angular/common';
import { MaterialModule } from './lib/material.module';
import { ExtraOptions, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoaderComponent } from './components/loader/loader.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TitleComponent } from './components/title/title.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NgxMaskPipe, NgxMaskDirective } from 'ngx-mask'
import { LabelComponent } from './components/label/label.component';
import { SelectorProducerComponent } from './components/selector-producer/selector-producer.component';
import { SelectorProductComponent } from './components/selector-product/selector-product.component';
import { LabelRequiredComponent } from './components/label-required/label-required.component';
import { VolumeCard1Component } from './components/volume-card-1/volume-card-1.component';
import { VolumeCard2Component } from './components/volume-card-2/volume-card-2.component';
import { ZeroLengthComponent } from './components/zero-length/zero-length.component';
import { LoadingTransformComponent } from './components/loading-transform/loading-transform.component';
import { DialogTransformComponent } from './components/dialog-transform/dialog-transform.component';
import { SheetVolumeComponent } from './components/sheets/sheet-volume/sheet-volume.component';
import { SelectorCustomerComponent } from './components/selector-customer/selector-customer.component';
import { SelectorLocationComponent } from './components/selector-location/selector-location.component';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { IconComponent } from './components/icon/icon.component';
import { SheetPalletComponent } from './components/sheets/sheet-pallet/sheet-pallet.component';
import { CardVolumeComponent } from './components/cards/card-volume/card-volume.component';

const config: ExtraOptions = {
  useHash: false,
  scrollPositionRestoration: 'top'
};


@NgModule({
  declarations: [
    LoaderComponent,
    NavigationComponent,
    SidebarComponent,
    TitleComponent,
    LoadingComponent,
    LabelComponent,
    SelectorProducerComponent,
    SelectorProductComponent,
    LabelRequiredComponent,
    VolumeCard1Component,
    VolumeCard2Component,
    ZeroLengthComponent,
    LoadingTransformComponent,
    DialogTransformComponent,
    SheetVolumeComponent,
    SelectorCustomerComponent,
    SelectorLocationComponent,
    DialogConfirmComponent,
    IconComponent,
    SheetPalletComponent,
    CardVolumeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    NgxMaskPipe,
    NgxMaskDirective
  ],
  exports: [
    RouterModule,
    MaterialModule,
    LoaderComponent,
    NavigationComponent,
    SidebarComponent,
    TitleComponent,
    LoadingComponent,
    NgxMaskPipe,
    NgxMaskDirective,
    LabelComponent,
    LabelRequiredComponent,
    VolumeCard1Component,
    VolumeCard2Component,
    ZeroLengthComponent,
    LoadingTransformComponent,
    DialogTransformComponent,
    SheetVolumeComponent,
    SelectorCustomerComponent,
    SelectorLocationComponent,
    DialogConfirmComponent,
    IconComponent,
    SheetPalletComponent,
    DialogTransformComponent,
    CardVolumeComponent
  ],
})
export class SharedModule { }
