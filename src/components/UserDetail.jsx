import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getUser } from '../services/users';

const UserDetail = () => {
  const { id } = useParams();
  const { data: user, isError, isLoading } = useQuery(['user', id], () => getUser(id));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching user</div>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
      {user.blogs.map(blog => (
        <li key={blog.id}>{blog.title}</li>
      ))}
    </ul>
    </div>
  );
};

export default UserDetail;