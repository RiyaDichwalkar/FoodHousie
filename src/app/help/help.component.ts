import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  feedback:string;
  user:any;
  constructor(private db: AngularFirestore,public authService: AuthService,private router:Router ) { }
   role:string;
  ngOnInit() {

  }
  onSubmitHelp(){
    
   this.user =JSON.parse(localStorage.getItem("user"));
   if(JSON.parse(localStorage.getItem("roles")).isChef){
     this.role="chef";
   }else{
    this.role="customer";
   }
    var id=this.db.createId()
    this.db.collection('issue').doc(id)
    .set({
      issueid:id,
      userid:this.user.uid,
      username:this.user.fullname,
      email:this.user.email,
      role:this.role,
      issue:this.feedback,
      acknowledge:false
    });
    window.alert("your feedback is recieved");
    this.router.navigate(["dashboard"]);
  }
}
