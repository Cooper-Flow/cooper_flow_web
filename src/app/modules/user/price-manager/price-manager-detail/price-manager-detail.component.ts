import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime } from '@app/resources/handlers/datetime';
import { LoadingService } from '@app/services/common/loading.service';
import { NavigationService } from '@app/services/common/navigation.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { PricingService } from '@app/services/user/pricing.service';
import { DialogConfirmComponent } from '@app/shared/components/dialog-confirm/dialog-confirm.component';


@Component({
  selector: 'app-price-manager-detail',
  templateUrl: './price-manager-detail.component.html',
  styleUrl: './price-manager-detail.component.scss'
})
export class PriceManagerDetailComponent implements OnInit {

  public pricing_id: number = 0;
  public isLoading = signal(true);
  public pricingData: any = {};
  public additionalList: Array<any> = [];
  public observationlList: Array<any> = [];
  public observation: string = '';
  public sendingObs = signal(false);

  constructor(
    public navigationService: NavigationService,
    public _activeRoute: ActivatedRoute,
    public route: Router,
    private _pricingService: PricingService,
    public snackService: SnackbarService,
    public dateTime: DateTime,
    public dialog: MatDialog,
    public loadingService: LoadingService,
    public router: Router
  ) { }

  ngOnInit() {
    const id = this._activeRoute.snapshot.params['id'];

    if (id) {
      this.getDetail(id)
    } else {
      this.route.navigate(['/in/price-manager'])
    }
  }

  get title() {
    const text = `${this.navigationService.getName('price_manager')} ${this.pricing_id}`
    return text;
  }

  get icon() {
    return this.navigationService.getIcon('price_manager');
  }

  get totalPrice() {
    let total = 0;

    this.pricingData.PricingItem?.forEach((p: any) => {
      const weight = Number(p?.Volume?.weight) || 0;
      const price = Number(p?.price) || 0;
      total += weight * price;
    });

    this.additionalList?.forEach((p: any) => {
      const value = Number(p?.price) || 0;
      switch (p.type) {
        case 'add':
          total += value;
          break;
        case 'remove':
          total -= value;
          break;
      }
    });

    return total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }


  get canEdit() {
    return this.pricingData.canEdit ?? false;
  }

  get getTotalWeight() {
    return this.pricingData?.PricingItem?.reduce(
      (total: number, p: any) => total + (p?.Volume?.weight || 0),
      0
    ) ?? 0;
  }



  public getDetail(id: number) {
    this.pricing_id = id;

    this.isLoading.set(true);

    this._pricingService.detail(id).subscribe(
      data => {
        this.pricingData = data;
        this.additionalList = data.PricingAdditional;
        this.observationlList = data.PricingObservation;
        this.isLoading.set(false);
      },
      excp => {
        this.isLoading.set(false);
        this.snackService.open('Houve um erro inesperado ao buscar dados');
      }
    )
  }

  formatPrice(value: number | null): string {
    if (value == null) return '0,00';
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  onPriceInput(event: any, item: any) {
    const digits = event.target.value.replace(/\D/g, '');
    const numericValue = parseInt(digits || '0', 10);

    item.price = numericValue / 100;

    event.target.value = this.formatPrice(item.price);
  }

  public addValues() {
    const values = {
      description: '',
      type: 'add',
      price: 0,
      currency: 'R$'
    }

    this.additionalList.push(values)
  }

  public confirm() {

    const data = {
      pricingData: this.pricingData,
      additionalList: this.additionalList
    }

    const dialogRef = this.dialog.open(DialogConfirmComponent, { data: `Finalizar precificação?` });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.loadingService.setIsLoading(true);

          this._pricingService.closePricing(data).subscribe(
            response => {
              this.loadingService.setIsLoading(false);
              this.snackService.open(response.message);
              window.location.reload()
            },
            excp => {
              this.loadingService.setIsLoading(false);
              this.snackService.open('Houve um erro inesperado ao finalizar precificação')
            }
          )
        }
      }
    )
  }

  public sendObservation() {

    const data = {
      pricing_id: this.pricing_id,
      observation: this.observation,
      type: 'post'
    }

    this.sendingObs.set(true)

    this._pricingService.sendObservation(data).subscribe(
      response => {
        this.sendingObs.set(false);
        this.getDetail(this.pricing_id);
        this.observation = '';
      },
      excp => {
        this.sendingObs.set(false)
        this.snackService.open('Houve um erro ao enviar observação')
      }
    )
  }


  public getSubTotal(item: any): string {
    if (!item || !item.Volume) return 'R$ 0,00';

    const weight = item.Volume.weight ?? 0;
    const price = item.price ?? 0;

    const subtotal = weight * price;

    return `R$ ${this.formatPrice(subtotal)}`;
  }
}
