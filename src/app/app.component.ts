import { Component } from '@angular/core';

interface Post {
 editMode: boolean;
 title: string;
 content: string;
}

@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.css']
})
export class AppComponent {
 posts: Post[] = [];
 newPost: Post = { title: '', content: '', editMode: false };

 submitPost() {
    this.posts.push({ ...this.newPost, editMode: false });
    this.newPost = { title: '', content: '', editMode: false };
 }

 toggleEditMode(post: Post) {
    post.editMode = !post.editMode;
 }
}
