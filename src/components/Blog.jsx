import React, { useState } from 'react';
import blogService from '../services/blogs';
import { useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';

const Blog = ({ blog, blogs, user}) => {
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const mutation = useMutation(({ id, data }) => blogService.update(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
    },
  })

  const deleteMutation = useMutation(blogService.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
    },
  })

  const addLike = () => {
    const blogToUpdate = {
      ...blog,
      user: blog.user.id, // Only send the user ID
      likes: blog.likes + 1
    };
    mutation.mutate({ id: blog.id, data: blogToUpdate });
  };
  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteMutation.mutate(blog.id);
      // blogService
      //   .remove(blog.id)
      //   .then(() => {
      //     setBlogs(blogs.filter((b) => b.id !== blog.id));
      //     setSuccessMessage('Blog removed successfully');
      //   });
    }
  };
  let removeButton = {
    display: 'none',
  };


  if (user.username === blog.username) {
    removeButton = {
      display: 'block',
    };
  }
  
  return (
    <div className='note'>
      <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link> 
      {/* {visible && (
        <div>
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button onClick={addLike} className='likeButton'>like</button></p>
          <p>{blog.user.name}</p>
          <button style={removeButton} id='remove-button' onClick={removeBlog}>remove</button>
        </div>
      )} */}
    </div>
  );
};
// const Blog = ({ blog }) => (
//   <div className="note">
//     {blog.title} {blog.author}<button onClick={show}>view</button>
//   </div>  
// )

export default Blog