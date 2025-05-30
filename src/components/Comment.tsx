
import React from 'react';
import { User, Clock, Heart } from 'lucide-react';
import type { Comment as CommentType } from '@/types/comment';

interface CommentProps {
  comment: CommentType;
  searchFilter: string;
}

const Comment = ({ comment, searchFilter }: CommentProps) => {
  // Função para destacar texto filtrado
  const highlightText = (text: string, filter: string) => {
    if (!filter.trim()) return text;
    
    const regex = new RegExp(`(${filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150 ml-4">
      <div className="flex items-start gap-3">
        {/* Avatar placeholder */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-2 flex-shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Username and timestamp */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">
              @{highlightText(comment.username, searchFilter)}
            </span>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Clock className="h-3 w-3" />
              <span>{comment.timestamp}</span>
            </div>
            {comment.likes !== undefined && comment.likes > 0 && (
              <div className="flex items-center gap-1 text-gray-500 text-sm ml-auto">
                <Heart className="h-3 w-3" />
                <span>{comment.likes}</span>
              </div>
            )}
          </div>
          
          {/* Comment text */}
          <p className="text-gray-800 leading-relaxed">
            {highlightText(comment.text, searchFilter)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
