import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostService } from '../post.service';
import { Post } from '../post.model';
import { map, tap, switchMap } from 'rxjs/operators';

@Component({
 selector: 'app-post-list',
 templateUrl: './post-list.component.html',
 styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
 posts: Post[] = [];
 currentEditPostId: string | null = null; // Track the post being edited
 private postUpdateSubscription!: Subscription;

 constructor(public postService: PostService) { }

 ngOnInit() {
    // Combine the subscriptions to fetchPosts and listenForPostUpdates
    this.postUpdateSubscription = this.postService.fetchPosts().pipe(
        switchMap(() => this.postService.listenForPostUpdates())
    ).subscribe(posts => {
        this.posts = posts;
    });
}

 ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.postUpdateSubscription.unsubscribe();
 }

 deletePost(postId: string) {
    this.postService.removePost(postId).subscribe(() => {
      // Remove the deleted post from the local posts array
      this.posts = this.posts.filter(post => post._id !== postId);
    });
 }

 editPost(postId: string) {
    this.currentEditPostId = postId; // Set the post ID being edited
 }

 savePost(postId: string, updatedPost: Post) {
    this.postService.updatePost(postId, updatedPost).subscribe(() => {
      // Update the local posts array with the updated post
      const index = this.posts.findIndex(post => post._id === postId);
      if (index !== -1) {
        this.posts[index] = updatedPost;
      }
      this.currentEditPostId = null; // Exit edit mode
    }, error => {
      console.error('Error saving post:', error);
    });
 }
}
