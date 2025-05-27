
import React from 'react';
import Comment from './Comment';
import { MessageCircle } from 'lucide-react';
import type { Comment as CommentType } from '@/pages/Index';

interface CommentListProps {
  comments: CommentType[];
  searchFilter: string;
}

const CommentList = ({ comments, searchFilter }: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum comentário encontrado</h3>
        <p className="text-gray-600">
          {searchFilter 
            ? `Não foram encontrados comentários com "${searchFilter}"`
            : "Não há comentários para exibir"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment 
          key={comment.id} 
          comment={comment} 
          searchFilter={searchFilter}
        />
      ))}
    </div>
  );
};

export default CommentList;
