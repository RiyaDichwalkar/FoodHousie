import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-chef-profile',
  templateUrl: './chef-profile.component.html',
  styleUrls: ['./chef-profile.component.scss']
})
export class ChefProfileComponent implements OnInit {

  constructor(public authService: AuthService,
    public router: Router,
    public ngZone: NgZone) { }

  ngOnInit() {
  }

}
