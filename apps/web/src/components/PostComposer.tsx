import React, { useState } from 'react';
import { Send, Image, Calendar, AlertCircle } from 'lucide-react';

interface PostComposerProps {
  brandId: string;
}

export const PostComposer: React.FC<PostComposerProps> = ({ brandId }) => {
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState('');
  const [error, setError] = useState('');

  const availablePlatforms = [
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', color: 'bg-pink-600' },
    { id: 'youtube', name: 'YouTube', color: 'bg-red-600' },
    { id: 'tiktok', name: 'TikTok', color: 'bg-gray-900' },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700' },
  ];

  const handlePublish = async () => {
    if (!content.trim()) {
      setError('Please write some content');
      return;
    }

    if (platforms.length === 0) {
      setError('Select at least one platform');
      return;
    }

    setError('');
    // Post publish logic would go here
    console.log({ content, platforms, scheduledAt, brandId });
    setContent('');
    setPlatforms([]);
    setScheduledAt('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Create a Post
      </h2>

      <div className="space-y-4">
        {/* Content Area */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            maxLength={280}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {content.length}/280
          </div>
        </div>

        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Platforms
          </label>
          <div className="flex flex-wrap gap-2">
            {availablePlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() =>
                  setPlatforms(
                    platforms.includes(platform.id)
                      ? platforms.filter((p) => p !== platform.id)
                      : [...platforms, platform.id]
                  )
                }
                className={`px-3 py-2 rounded-lg text-white font-medium transition ${
                  platforms.includes(platform.id)
                    ? `${platform.color} opacity-100`
                    : 'bg-gray-300 opacity-50'
                }`}
              >
                {platform.name}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule (Optional)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={handlePublish}
            disabled={!content.trim()}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Send size={18} />
            {scheduledAt ? 'Schedule Post' : 'Publish Now'}
          </button>
          <button
            onClick={() => {
              setContent('');
              setPlatforms([]);
              setScheduledAt('');
              setError('');
            }}
            className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};
