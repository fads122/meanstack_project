import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
    postTitle = '';
    postContent = '';
    postImageUrl = '';
    uploadedImageDataUrl = '';
    uploadedImageFile: File | null = null; // Add this line to store the uploaded image file

    constructor(public postService: PostService) {}

    handleFileInputChange(event: Event) {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            this.uploadedImageFile = fileInput.files[0]; // Store the uploaded file
            this.readFile(fileInput.files[0]); // Read the file to get the data URL
        }
    }

    private readFile(file: File): void {
        const fileReader = new FileReader();
        fileReader.onload = (e: any) => {
            this.uploadedImageDataUrl = e.target.result;
        };
        fileReader.readAsDataURL(file);
    }

    addNewPost(form: NgForm) {
        if (form.invalid) {
            return;
        }

        const formData = new FormData();
        formData.append('title', form.value.title);
        formData.append('content', form.value.content);
        if (this.uploadedImageFile) {
            formData.append('image', this.uploadedImageFile); // Append the image file to the form data
        }

        this.postService.createPost(formData).subscribe(() => {
            this.resetFormAndImage(form);
        });
    }

    private resetFormAndImage(form: NgForm): void {
        form.resetForm();
        this.uploadedImageDataUrl = '';
        this.uploadedImageFile = null; // Reset the uploaded image file
    }
}
