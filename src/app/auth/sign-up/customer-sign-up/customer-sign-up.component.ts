import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../auth.service";
import { RegisterService } from "../../newuser/register.service";
import { NgForm } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
@Component({
  selector: "app-customer-sign-up",
  templateUrl: "./customer-sign-up.component.html",
  styleUrls: ["./customer-sign-up.component.scss"]
})
export class CustomerSignUpComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private firestore: AngularFirestore,
    private registerService: RegisterService
  ) {}
  latitude: number;
  longitude: number;
  ngOnInit() {
    this.resetForm();
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        this.setPosition.bind(this)
      );
    }
  }
  resetForm(form?: NgForm) {
    if (form != null) form.resetForm();
    this.registerService.formData = {
      id: null,
      fullName: "",
      role: "customer",
      email: "",
      password: "",
      address: "",
      mobile: "",
      emailVerified: false,
      longitude: null,
      latitude: null
    };
  }
  //
  onSubmit(form: NgForm) {
    let data = Object.assign({}, form.value);
    delete data.id;
    data.latitude = this.latitude;
    data.longitude = this.longitude;
    console.log(data.latitude, data.longitude + "in onSubmit");
    this.authService.SignUp(data);
    this.resetForm(form);
  }
  setPosition(position) {
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
  }
}
