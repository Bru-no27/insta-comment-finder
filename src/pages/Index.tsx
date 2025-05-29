
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchForm from "@/components/SearchForm";
import CommentList from "@/components/CommentList";
import { fetchInstagramComments } from "@/services/instagramApi";
import { useToast } from "@/hooks/use-toast";
import type { InstagramComment } from "@/services/instagram/types";

const Index = () => {
  const [instagramUrl, setInstagramUrl] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [filterType, setFilterType] = useState<'keyword' | 'username' | 'comment_number'>('keyword');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [commentNumber, setCommentNumber] = useState('');
  const [comments, setComments] = useState<InstagramComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const { toast } = useToast();

  const applyFiltersAndSort = (rawComments: InstagramComment[]) => {
    let filteredComments = [...rawComments];

    // Aplicar filtros
    if (filterType === 'comment_number' && commentNumber) {
      const targetNumber = parseInt(commentNumber);
      if (targetNumber > 0 && targetNumber <= filteredComments.length) {
        filteredComments = [filteredComments[targetNumber - 1]];
      } else {
        filteredComments = [];
      }
    } else if (filterType === 'username' && searchFilter.trim()) {
      filteredComments = filteredComments.filter(comment =>
        comment.username.toLowerCase().includes(searchFilter.toLowerCase())
      );
    } else if (filterType === 'keyword' && searchFilter.trim()) {
      filteredComments = filteredComments.filter(comment =>
        comment.text.toLowerCase().includes(searchFilter.toLowerCase()) ||
        comment.username.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    // Aplicar ordenação
    if (sortOrder === 'oldest') {
      filteredComments.reverse();
    }

    return filteredComments;
  };

  const handleSearch = async () => {
    if (!instagramUrl.trim()) {
      toast({
        title: "URL necessária",
        description: "Por favor, insira um link do Instagram",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setComments([]);
    setSearchMessage('');

    try {
      // Buscar todos os comentários primeiro
      const response = await fetchInstagramComments(instagramUrl);
      
      // Aplicar filtros e ordenação
      const processedComments = applyFiltersAndSort(response.comments);
      
      setComments(processedComments);
      
      // Criar mensagem personalizada baseada nos filtros
      let filterMessage = '';
      if (filterType === 'comment_number' && commentNumber) {
        filterMessage = `\n\n🎯 Filtro aplicado: Comentário #${commentNumber}`;
      } else if (filterType === 'username' && searchFilter.trim()) {
        filterMessage = `\n\n👤 Filtro aplicado: Usuário "${searchFilter}"`;
      } else if (filterType === 'keyword' && searchFilter.trim()) {
        filterMessage = `\n\n🔍 Filtro aplicado: Palavra-chave "${searchFilter}"`;
      }
      
      const sortMessage = `\n📅 Ordenação: ${sortOrder === 'oldest' ? 'Mais antigo primeiro' : 'Mais recente primeiro'}`;
      
      setSearchMessage((response.message || '') + filterMessage + sortMessage);
      
      if (response.status === 'success') {
        const totalFound = response.comments.length;
        const filtered = processedComments.length;
        
        toast({
          title: "Busca concluída!",
          description: `${filtered} comentários encontrados${totalFound !== filtered ? ` (de ${totalFound} total)` : ''}`
        });
      }
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar os comentários",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏆 Instagram Comment Extractor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Extraia e filtre comentários de publicações do Instagram com filtros avançados
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <SearchForm
              instagramUrl={instagramUrl}
              setInstagramUrl={setInstagramUrl}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              filterType={filterType}
              setFilterType={setFilterType}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              commentNumber={commentNumber}
              setCommentNumber={setCommentNumber}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </div>

          {searchMessage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 whitespace-pre-line">
                {searchMessage}
              </p>
            </div>
          )}

          {comments.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Comentários Encontrados ({comments.length})
              </h2>
              <CommentList comments={comments} searchFilter={searchFilter} />
            </div>
          )}

          {comments.length === 0 && searchMessage && !isLoading && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center py-8">
                <p className="text-gray-600">
                  {filterType === 'comment_number' 
                    ? `Comentário #${commentNumber} não encontrado ou não existe.`
                    : 'Nenhum comentário encontrado com os filtros aplicados.'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
