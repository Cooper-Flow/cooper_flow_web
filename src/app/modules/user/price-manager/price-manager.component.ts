import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DateTime } from '@app/resources/handlers/datetime';
import { NavigationService } from '@app/services/common/navigation.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { PricingService } from '@app/services/user/pricing.service';
import { SelectorProducerComponent } from '@app/shared/components/selector-producer/selector-producer.component';

@Component({
  selector: 'app-price-manager',
  templateUrl: './price-manager.component.html',
  styleUrl: './price-manager.component.scss'
})
export class PriceManagerComponent implements OnInit {

  public isLoading = signal(true);
  public selectedValue: string = 'producer';
  public selectedProducer = signal(false);
  public producer: any = null;
  public pricingList: Array<any> = [];

  public entryList: Array<any> = [];

  public total: number = 0;
  public page_size: number = 10;
  public page_index: number = 0;
  public order: string = 'desc';

  public template = signal(1);

  constructor(
    public navigationService: NavigationService,
    public dialog: MatDialog,
    private _pricingService: PricingService,
    public snackService: SnackbarService,
    public dateTime: DateTime,
  ) { }

  ngOnInit(): void {
    this.getVolumes(this.producer)
  }

  get title() {
    return this.navigationService.getName('price_manager');
  }

  get icon() {
    return this.navigationService.getIcon('price_manager');
  }

  get disablePricing() {
    return true;
  }

  onToggleChange(event: any) {
    this.selectedValue = event.value;
  }

  public dialogProducer() {
    const dialogRef = this.dialog.open(SelectorProducerComponent);

    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          this.selectedProducer.set(true)
          this.getVolumes(response)
        }
      }
    )
  }

  public getVolumes(producerData: any) {
    this.producer = producerData;
    const producer_id = producerData ? producerData.Producer.id : '';
    this.isLoading.set(true);

    const params = {
      page: this.page_index + 1,
      pageSize: this.page_size,
      order: this.order,
      producer_id: producer_id
    }


    this._pricingService.paginate(params).subscribe(
      data => {
        this.pricingList = data.data;
        this.total = data?.total;
        this.entryList = data?.entries;
        this.isLoading.set(false);
      },
      excp => {
        this.isLoading.set(false);
        this.snackService.open('Houve um erro inesperado ao buscar dados');
      }
    )
  }

  public removeProducerFilter() {
    this.selectedProducer.set(false);
    this.getVolumes(null);
  }

  public pageEvent(event: PageEvent) {
    this.page_size = event.length;
    this.page_index = event.pageIndex;
    this.page_size = event.pageSize;

    this.getVolumes(this.producer);
  }

  public changeLayout(layout: number) {
    this.template.set(layout)
  }

}
