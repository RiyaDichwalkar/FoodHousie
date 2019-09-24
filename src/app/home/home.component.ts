import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/shared/post.service';
import { AuthService } from "../auth/auth.service";
import { map } from 'rxjs/operators';
import { Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss',
  '../../css/home_css/bootstrap.min.css',
  '../../css/home_css/main.css',
  '../../css/home_css/magnific-popup.css'
  
   ]
})
export class HomeComponent implements OnInit {
  user: firebase.User;
  imageList:any;
  rowIndexArray:any;
  constructor(private service:PostService,private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.auth.getUserState().subscribe(user => {
      this.user = user;
    });

    this.getPostsList();
  }
  login() {
    this.router.navigate(["/login"]);
  }

  logout() {
    this.auth.SignOut();
  }

  register() {
    this.router.navigate(["/register"]);
  }
   
  getPostsList() {
    this.service.getPostsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(posts => {
      this.imageList = posts;
      this.rowIndexArray=Array.from(Array(Math.ceil((this.imageList.length)/3)).keys());
    });
  }
  onClick(key:any){
    this.router.navigate(['recipe',key]);
 }
}

