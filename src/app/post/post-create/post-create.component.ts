// post-create.component.ts
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
 selector: 'app-post-create',
 templateUrl: './post-create.component.html',
 styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
 enteredTitle = '';
 enteredContent = '';
 // Define the newPost property with default values
 newPost: Post = {
    _id: '',
    title: '',
    content: '',
    image: '', // Initialize with an empty string or null
    editMode: false
 };

 constructor(private postService: PostService) {}

 AddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const title = form.value.title;
    const content = form.value.content;
    this.postService.addPost(title, content);
    form.resetForm();
 }

 onFileSelected(event: Event) {
 const fileInput = event.target as HTMLInputElement;
 if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    // Call a method to upload the file and get the image URL
    this.postService.uploadFile(file).subscribe(imageUrl => {
      // Save the image URL to the newPost object
      this.newPost.image = imageUrl;
    });
 }
}
}
