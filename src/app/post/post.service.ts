import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map, tap, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class PostService {

    private apiEndpoint = 'http://localhost:3000/api/posts';
    private postUpdateSubject = new BehaviorSubject<Post[]>([]);

    constructor(private httpClient: HttpClient) { }



    createPost(formData: FormData): Observable<any> {
      return this.httpClient.post(this.apiEndpoint, formData).pipe(
          tap(() => {
              // Emit an event to indicate that a new post has been created
              this.postUpdateSubject.next([]); // Pass an empty array instead of null
          }),
          switchMap(() => this.fetchPosts()) // Fetch the updated list of posts
      );
  }

  updatePost(postId: string, updatedPost: Post): Observable<any> {
    return this.httpClient.put(`${this.apiEndpoint}/${postId}`, updatedPost).pipe(
        tap(() => {
            // Emit an event to indicate that a post has been updated
            this.postUpdateSubject.next([]); // Pass an empty array to signal an update without data
        }),
        switchMap(() => this.fetchPosts()) // Fetch the updated list of posts
    );
}

  removePost(postId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiEndpoint}/${postId}`).pipe(
        tap(() => {
            this.postUpdateSubject.next([]);
        }),
        switchMap(() => this.fetchPosts())
    );
}



fetchPosts(): Observable<Post[]> {
  return this.httpClient.get<{ message: string; posts: Post[] }>(this.apiEndpoint).pipe(
      tap(response => {
          this.postUpdateSubject.next(response.posts);
      }),
      map(response => response.posts)
  );
}

listenForPostUpdates(): Observable<Post[]> {
  return this.postUpdateSubject.asObservable();
}



}
