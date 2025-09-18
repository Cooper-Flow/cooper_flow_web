import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DateTime } from '@app/resources/handlers/datetime';
import { Regex } from '@app/resources/handlers/regex';
import { LoadingService } from '@app/services/common/loading.service';
import { NavigationService } from '@app/services/common/navigation.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { PricingService } from '@app/services/user/pricing.service';
import { DialogConfirmComponent } from '@app/shared/components/dialog-confirm/dialog-confirm.component';
import { SelectorProducerComponent } from '@app/shared/components/selector-producer/selector-producer.component';

@Component({
  selector: 'app-report-manager',
  templateUrl: './report-manager.component.html',
  styleUrl: './report-manager.component.scss'
})
export class ReportManagerComponent {

  public isLoading = signal(true);
  public selectedValue: string = 'producer';
  public selectedProducer = signal(false);
  public producer: any = null;
  public filter = "entry";
  public batch = "";
  public reportList: Array<any> = [];
  public exitList: Array<any> = [];
  public pricingVolumesList: Array<string> = [];

  constructor(
    public navigationService: NavigationService,
    public dialog: MatDialog,
    private _pricingService: PricingService,
    public snackService: SnackbarService,
    public regex: Regex,
    public dateTime: DateTime,
    public loadingService: LoadingService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getData(this.producer)
  }

  get title() {
    return this.navigationService.getName('report_manager');
  }

  get icon() {
    return this.navigationService.getIcon('report_manager');
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
          this.getData(response)
        }
      }
    )
  }

  public removeProducerFilter() {
    this.selectedProducer.set(false)
    this.getData(null)
  }

  public getData(producerData: any) {
    this.producer = producerData;
    const producer_id = producerData ? producerData.Producer.id : '';
    this.pricingVolumesList = []
    this.isLoading.set(true);

    const params = {
      producer_id: producer_id,
      batch: this.batch,
      filter: this.filter
    }

    this._pricingService.getVoluesByProducer(params).subscribe(
      response => {
        this.reportList = (response.enters ?? []).map((item: any) => ({
          ...item,
          compare: false
        }));
        this.exitList = response.exits ?? [];
        this.isLoading.set(false);
      },
      excp => {
        this.isLoading.set(false);
        this.snackService.open('Houve um erro inesperado ao buscar dados');
      }
    )
  }

  public createPricing() {

    const data = {
      volumes: this.pricingVolumesList
    }
    const dialogRef = this.dialog.open(DialogConfirmComponent, { data: `Criar precificação para ${this.pricingVolumesList.length} ${this.pricingVolumesList.length > 1 ? 'volumes' : 'volume'}?` });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.loadingService.setIsLoading(true);

          this._pricingService.create(data).subscribe(
            response => {
              this.loadingService.setIsLoading(false);
              this.snackService.open(response.message);
              this.router.navigate(['/in/price-manager/' + response.pricing_id]);
            },
            excp => {
              this.loadingService.setIsLoading(false);
              this.snackService.open('Houve um erro inesperado ao criar precificação')
            }
          )
        }
      }
    )
  }

  public setFilter() {
    this.getData(this.producer)
  }

  public includeToPricing(volume_id: string, status: string) {

    if (status === 'ongoing') {
      this.snackService.open('Não é possível precificar volumes de saídas em andamento')
    } else {
      const index = this.pricingVolumesList.indexOf(volume_id);

      if (index > -1) {
        this.pricingVolumesList.splice(index, 1);
      } else {
        this.pricingVolumesList.push(volume_id);
      }
    }
  }

  public getTotal(volumes: any[], exited?: boolean): string {
    if (!volumes) return '---';

    const total = volumes
      .filter(v => (exited === null ? v?.exited == null : v?.exited === exited))
      .reduce((sum, v) => {
        const weight = Number(v?.weight) || 0;
        return sum + weight;
      }, 0);

    return `${total} Kg`;
  }

}
