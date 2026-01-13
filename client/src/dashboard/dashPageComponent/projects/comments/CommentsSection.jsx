// CommentsSection.jsx
import React, { useState } from "react";
import CommentItem from "./CommentItem";

const CommentsSection = ({
  comments = [],
  onPostComment,
  currentUser,
  projectId,
  setComments,
}) => {
  const [newComment, setNewComment] = useState("");

  // Handle posting a new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (onPostComment) {
      await onPostComment(newComment);
    }
    setNewComment("");
  };

  // Sorted comments: latest first
  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Update comment in state after editing
  const handleCommentUpdated = (updatedComment) => {
    const updatedComments = comments.map((c) =>
      c._id === updatedComment._id ? updatedComment : c
    );
    setComments(updatedComments);
  };

  // Remove comment from state after deletion
  const handleCommentDeleted = (deletedCommentId) => {
    const updatedComments = comments.filter((c) => c._id !== deletedCommentId);
    setComments(updatedComments);
  };

  return (
    <div className="border-t mt-4 p-4">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      {/* Add comment input at the top */}
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="w-full p-2 border rounded mb-2 bg-white text-black focus:outline-1 focus:outline-customBgBlue"
          placeholder="Add a public comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit" className="bg-customBgBlue text-white px-4 py-2 rounded">
          Comment
        </button>
      </form>
      {/* Scrollable comments list */}
      <div className="max-h-[20rem] overflow-y-auto">
        {sortedComments.length > 0 ? (
          <div className="space-y-2">
            {sortedComments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={{ ...comment, projectId }}
                currentUser={currentUser}
                onCommentUpdated={handleCommentUpdated}
                onCommentDeleted={handleCommentDeleted}
              />
            ))}
          </div>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
