import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getBlog } from '../services/blogs';
import { useMutation, useQueryClient } from 'react-query';
import blogService from '../services/blogs';

const BlogDetail = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { data: blog, isError, isLoading } = useQuery(['blog', id], () => getBlog(id));
    const mutation = useMutation(({ id, data }) => blogService.update(id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries('blog', id);
        },
    })
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
  return (
    <div>
      <h2>{blog.title}</h2>
        <a href={blog.url}>{blog.url}</a>
      <p>{blog.likes} likes <button onClick={addLike}>like</button></p>
      <p>added by {blog.username}</p>
    </div>
  );
};

export default BlogDetail;