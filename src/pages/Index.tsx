
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
  const [comments, setComments] = useState<InstagramComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const { toast } = useToast();

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
      const response = await fetchInstagramComments(instagramUrl, searchFilter);
      
      setComments(response.comments);
      setSearchMessage(response.message || '');
      
      if (response.status === 'success') {
        toast({
          title: "Busca concluída!",
          description: `${response.comments.length} comentários encontrados`
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
            Extraia comentários de publicações do Instagram de forma simples e rápida
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <SearchForm
              instagramUrl={instagramUrl}
              setInstagramUrl={setInstagramUrl}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
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
        </div>
      </div>
    </div>
  );
};

export default Index;
