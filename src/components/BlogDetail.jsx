import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getBlog } from '../services/blogs';
import { useMutation, useQueryClient } from 'react-query';
import blogService from '../services/blogs';

const BlogDetail = () => {
    const [comment, setComment] = useState('');
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { data: blog, isError, isLoading } = useQuery(['blog', id], () => getBlog(id));
    const mutation = useMutation(({ id, data }) => blogService.update(id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries('blog', id);
        },
      })
    const addCommentMutation = useMutation(({ id, data }) => blogService.addComment(id, data), {
      onSuccess: (updatedBlog) => {
        queryClient.setQueryData(['blog', id], updatedBlog);
        setComment('');
      },
    });
      if (isLoading) {
        return <div>Loading...</div>;
    }
    

    if (isError) {
        return <div>Error fetching blog</div>;
    }
    // if (blog){
    //     console.log('blog', blog)

    // }


  const addLike = () => {
    const blogToUpdate = {
      ...blog,
      user: blog.user.id, 
      likes: blog.likes + 1
    };
    mutation.mutate({ id: blog.id, data: blogToUpdate });
  };


  const addComment = () => {
    const commentToAdd = { comment };
    addCommentMutation.mutate({ id: blog.id, data: commentToAdd });
  }

  return (
    <div>
      <h2>{blog.title}</h2>
        <a href={blog.url}>{blog.url}</a>
      <p>{blog.likes} likes <button onClick={addLike}>like</button></p>
      <p>added by {blog.username}</p>

      <h2>comments</h2>
      <input type="text" name='commentField' value={comment} onChange={(e) => setComment(e.target.value)} />
      <button onClick={addComment}>add comment</button>
      <ul>
        {blog.comments && blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default BlogDetail;