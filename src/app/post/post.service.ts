import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
 providedIn: 'root',
})

export class PostService {
 private posts: Post[] = [];
 private postsUpdated = new Subject<Post[]>();
 constructor(private http: HttpClient){}

 getPosts() {
    this.http
    .get<{ message: string; posts: Post[] }>(
      'http://localhost:3000/api/posts'
    )
    .subscribe((postData) =>{
      this.posts = postData.posts;
      console.log(this.posts); // Temporary log to check the posts array
      this.postsUpdated.next([...this.posts]);
    });
 }

 getPostUpdateListener(){
    return this.postsUpdated.asObservable();
 }

 addPost(title: string, content: string) {
  const post: Post = { _id: '', title: title, content: content, image: '', editMode: false };
  this.http.post<{message: string }>('http://localhost:3000/api/posts', post)
  .subscribe((responseData) => {
    console.log(responseData.message);
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  });
}

 deletePost(postId: string): Observable<any> {
    console.log('Deleting post with ID:', postId); // Debugging statement
    return this.http.delete(`http://localhost:3000/api/posts/${postId}`);
 }

 getPostById(postId: string): Observable<Post> {
    return this.http.get<Post>(`http://localhost:3000/api/posts/${postId}`);
 }

 editPost(postId: string, title: string, content: string, image: string): Observable<any> {
  const post: Post = { _id: postId, title: title, content: content, image: image, editMode: false };
  return this.http.put(`http://localhost:3000/api/posts/${postId}`, post);
 }

 uploadFile(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('image', file, file.name);

  return this.http.post<{ message: string; imageUrl: string }>(
    'http://localhost:3000/api/upload', // Replace with your actual upload endpoint
    formData
  ).pipe(
    map(response => response.imageUrl) // Assuming the server returns an object with an 'imageUrl' property
  );
}
}


