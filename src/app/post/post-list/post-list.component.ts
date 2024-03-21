import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { PostService } from '../post.service';


@Component({
 selector: 'app-post-list',
 templateUrl: './post-list.component.html',
 styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
 posts: Post[] = [];
 private postsSub!: Subscription;
 selectedFile: File | null = null;

 constructor(public postService: PostService) {}

 ngOnInit(): void {
    this.postService.getPosts();
    this.postsSub = this.postService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
 }

 ngOnDestroy(): void {
    this.postsSub.unsubscribe();
 }

 onDelete(postId: string): void {
    this.postService.deletePost(postId).subscribe(() => {
      this.posts = this.posts.filter(post => post._id !== postId);
    });
 }

 toggleEditMode(post: Post): void {
  post.editMode = !post.editMode;
  console.log(`Toggled edit mode for post with ID: ${post._id}, new editMode: ${post.editMode}`);
 }

 onFileSelected(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
     this.selectedFile = fileInput.files[0];
  }
 }

 onUpdatePost(post: Post): void {
 // If no file is selected, just update the post without the image
 this.postService.editPost(post._id, post.title, post.content, '').subscribe(() => {
    this.toggleEditMode(post);
 });
}
}
