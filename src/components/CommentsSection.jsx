import { useState } from 'react';

const CommentsSection = ({ songId }) => {
  const [comment, setComment] = useState('');
  const maxLength = 500;

  const handleSubmit = () => {
    // 🔜 Future: POST to API
    console.log(`Comment on song ${songId}:`, comment);
    setComment('');
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Comments (0)</h2>

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
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-2"
        disabled={!comment.trim()}
      >
        Comment
      </button>
    </div>
  );
};

export default CommentsSection;
