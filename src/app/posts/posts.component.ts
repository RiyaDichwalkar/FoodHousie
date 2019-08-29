import { Component, OnInit } from '@angular/core';
import { PostService } from '../shared/post.service';
declare var $: any;
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  constructor(private service:PostService) { }

  ngOnInit() {
    
      $(document).ready(() => {
        $('#elementId').css({'background-color': 'yellow', 'font-size': '200%'});
      });
    
  }

}
