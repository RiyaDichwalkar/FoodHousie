import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"]
})
export class ForgotPasswordComponent implements OnInit {
  authError: any;
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.eventAuthError$.subscribe(data => {
      this.authError = data;
    });
  }
  resetPassword(frm) {
    this.auth.resetPassword(frm.value.email);
  }
}
