import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-try',
  templateUrl: './try.component.html',
  styleUrls: ['./try.component.scss']
})
export class TryComponent implements OnInit {

  constructor( public authService: AuthService,
    public router: Router,
    public ngZone: NgZone) { }

  ngOnInit() {
  }

}
