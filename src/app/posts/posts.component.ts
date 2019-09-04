import { Component, OnInit ,NgZone} from '@angular/core';
import { PostService } from '../shared/post.service';
import { Router} from '@angular/router';
import { AuthService } from "../auth/auth.service";
declare var $: any;
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  constructor(public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,private service:PostService) { }

  ngOnInit() {
    
      $(document).ready(() => {
        $('#elementId').css({'background-color': 'yellow', 'font-size': '200%'});
      });
    
  }


}
