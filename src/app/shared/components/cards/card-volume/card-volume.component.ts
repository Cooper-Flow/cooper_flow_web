import { Component, Input } from '@angular/core';
import { Calc } from '@app/resources/handlers/calc';
import { DateTime } from '@app/resources/handlers/datetime';
import { Regex } from '@app/resources/handlers/regex';

@Component({
  selector: 'app-card-volume',
  templateUrl: './card-volume.component.html',
  styleUrl: './card-volume.component.scss'
})
export class CardVolumeComponent {

  @Input() item: any
  @Input() disableHover?: boolean = false
  @Input() small?: boolean = false
  @Input() line?: boolean = false
  @Input() lineType?: string = ''

  constructor(
    public regex: Regex,
    public dateTime: DateTime,
    public calc: Calc,
  ){}
}
