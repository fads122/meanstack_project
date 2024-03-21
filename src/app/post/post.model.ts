export interface Post {
  _id: string;
  title: string;
  content: string;
  image: string; // Add this line
  editMode: boolean;
 }
