import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const CommentsSection = ({ songId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const maxLength = 500;
  const token = localStorage.getItem('authToken');
  const { user } = useUser();
  console.log(user)
  console.log(comments)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/songs/${songId}/comments/`);
        setComments(res.data);
      } catch (err) {
        console.error('❌ Error fetching comments:', err);
      }
    };

    if (songId) fetchComments();
  }, [songId]);

  const handleSubmit = async () => {
    if (!comment.trim() || !token) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:8000/api/songs/${songId}/comments/add/`,
        { content: comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prev) => [res.data, ...prev]);
      setComment('');
    } catch (err) {
      console.error('❌ Error posting comment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token) return;
    try {
      await axios.delete(`http://localhost:8000/api/comments/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('❌ Error deleting comment:', err);
    }
  };

  const handleEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.put(
        `http://localhost:8000/api/comments/${id}/edit/`,
        { content: editText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prev) =>
        prev.map((c) => (c.id === id ? res.data : c))
      );
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error('❌ Error editing comment:', err);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">
        Comments ({comments.length})
      </h2>

      <textarea
        placeholder="Please share your thought..."
        className="w-full p-4 rounded-lg bg-neutral-800 text-white resize-none"
        rows={4}
        maxLength={maxLength}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="text-right text-sm text-gray-400 mt-1">
        {comment.length}/{maxLength}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-2 disabled:opacity-50"
        disabled={!comment.trim() || loading}
      >
        {loading ? 'Posting...' : 'Comment'}
      </button>

      {/* 📝 List of comments */}
      <div className="mt-6 space-y-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className="bg-neutral-800 rounded-lg p-4 text-sm border border-neutral-700"
          >
            <div className="flex justify-between items-center text-gray-400 mb-1">
              <div className="flex items-center gap-2">
                <img
                  src={c.profile_picture || 'https://i.pravatar.cc/40'}
                  alt="profile"
                  className="w-6 h-6 rounded-full"
                />
                <span>{c.display_name|| 'Anonymous'}</span>
              </div>
              <span>{new Date(c.timestamp).toLocaleString()}</span>
            </div>

            {editingId === c.id ? (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  className="w-full p-2 rounded bg-neutral-700 text-white mt-2"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(c.id)}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 text-xs bg-gray-600 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-white">{c.content}</p>
                {user?.id === c.user?.id && (
                  <div className="text-right mt-2 flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setEditText(c.content);
                      }}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
