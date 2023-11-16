import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-biograf',
  templateUrl: './biograf.page.html',
  styleUrls: ['./biograf.page.scss'],
})
export class BiografPage implements OnInit {
  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }

  constructor() { }

  ngOnInit() {
  }

}
