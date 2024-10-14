import React from 'react';

const UserDetail = ({ user }) => {
  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <h2>User Details</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</p>
      <p><strong>Roles:</strong> {user.roles.map(role => role.name).join(', ')}</p>

      <h3>Liked Movies</h3>
      {user.movieId.length > 0 ? (
        <ul>
          {user.movieId.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      ) : (
        <p>No liked movies.</p>
      )}

      <h3>Comments</h3>
      {user.comments.length > 0 ? (
        <ul>
          {user.comments.map((comment) => (
            <li key={comment.id}>{comment.content}</li>
          ))}
        </ul>
      ) : (
        <p>No comments available.</p>
      )}
    </div>
  );
};

export default UserDetail;
