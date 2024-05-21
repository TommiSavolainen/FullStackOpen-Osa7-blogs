import { getUsers } from '../services/users';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

const User = () => {
    const { data: users, isError, isLoading } = useQuery('users', getUsers);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching users</div>;
    }

    return (
        <div>
            <h2>Users</h2>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Blogs created</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <Link to={`/users/${user.id}`}>
                                {user.username}
                                </Link>
                            </td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default User;