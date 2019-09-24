import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from "../auth.service";
//import {FormControl,Validators} from '@angular/forms';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {
  @ViewChild('demo',{static:false})x:ElementRef;
  loc:string;
  //displayName= new FormControl('');
  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(){
    this.getLocation();
  }

   getLocation() {
    //debugger;
    

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition((position)=>{
       // this.loc= " browsemmr.";
     console.log("sdddddddd " +this.loc);
      alert("Latitude: " + position.coords.latitude+  
      "Longitude: " + position.coords.longitude);
     this.loc = "Latitude: " + position.coords.latitude + 
    "Longitude: " + position.coords.longitude;
    console.log(this.loc);
      });
    } else { 
      this.loc= "Geolocation is not supported by this browser.";

    }
    
  }

}