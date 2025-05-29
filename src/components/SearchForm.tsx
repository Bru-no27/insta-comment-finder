
import React from 'react';
import { Search, Instagram, Filter, Loader2, Hash, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchFormProps {
  instagramUrl?: string;
  setInstagramUrl?: (url: string) => void;
  searchFilter?: string;
  setSearchFilter?: (filter: string) => void;
  filterType?: 'keyword' | 'username' | 'comment_number';
  setFilterType?: (type: 'keyword' | 'username' | 'comment_number') => void;
  sortOrder?: 'newest' | 'oldest';
  setSortOrder?: (order: 'newest' | 'oldest') => void;
  commentNumber?: string;
  setCommentNumber?: (number: string) => void;
  onSearch?: () => void;
  isLoading?: boolean;
}

const SearchForm = ({
  instagramUrl = '',
  setInstagramUrl = () => {},
  searchFilter = '',
  setSearchFilter = () => {},
  filterType = 'keyword',
  setFilterType = () => {},
  sortOrder = 'newest',
  setSortOrder = () => {},
  commentNumber = '',
  setCommentNumber = () => {},
  onSearch = () => {},
  isLoading = false
}: SearchFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instagramUrl.trim() && !isLoading) {
      onSearch();
    }
  };

  const isValidInstagramUrl = (url: string) => {
    return url.includes('instagram.com') || url.includes('instagr.am');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="instagram-url" className="text-base font-medium text-gray-900 mb-2 block">
          Link da Publicação do Instagram
        </Label>
        <div className="relative">
          <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="instagram-url"
            type="url"
            placeholder="https://www.instagram.com/p/... ou https://www.instagram.com/reel/..."
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            className="pl-10 h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
            required
            disabled={isLoading}
          />
        </div>
        {instagramUrl && !isValidInstagramUrl(instagramUrl) && (
          <p className="mt-2 text-sm text-red-600">
            Por favor, insira um link válido do Instagram
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="filter-type" className="text-base font-medium text-gray-900 mb-2 block">
            Tipo de Filtro
          </Label>
          <Select value={filterType} onValueChange={setFilterType} disabled={isLoading}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione o tipo de filtro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="keyword">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Palavra-chave
                </div>
              </SelectItem>
              <SelectItem value="username">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome de usuário
                </div>
              </SelectItem>
              <SelectItem value="comment_number">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Número do comentário
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sort-order" className="text-base font-medium text-gray-900 mb-2 block">
            Ordenação
          </Label>
          <Select value={sortOrder} onValueChange={setSortOrder} disabled={isLoading}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a ordenação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Mais recente primeiro
                </div>
              </SelectItem>
              <SelectItem value="oldest">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Mais antigo primeiro
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filterType === 'comment_number' ? (
        <div>
          <Label htmlFor="comment-number" className="text-base font-medium text-gray-900 mb-2 block">
            Número do Comentário
          </Label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="comment-number"
              type="number"
              placeholder="Ex: 50 (para buscar o 50º comentário)"
              value={commentNumber}
              onChange={(e) => setCommentNumber(e.target.value)}
              className="pl-10 h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
              disabled={isLoading}
              min="1"
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Digite o número do comentário que deseja encontrar (ex: 50 para o 50º comentário)
          </p>
        </div>
      ) : (
        <div>
          <Label htmlFor="search-filter" className="text-base font-medium text-gray-900 mb-2 block">
            {filterType === 'username' ? 'Nome de Usuário' : 'Palavra-chave'}
          </Label>
          <div className="relative">
            {filterType === 'username' ? (
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            ) : (
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            )}
            <Input
              id="search-filter"
              type="text"
              placeholder={
                filterType === 'username' 
                  ? "Ex: maria_silva" 
                  : "Ex: 'lugar incrível'"
              }
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-10 h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
              disabled={isLoading}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {filterType === 'username' 
              ? 'Digite o nome de usuário (sem @) para filtrar comentários'
              : 'Digite uma palavra ou frase para filtrar os comentários'
            }
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium text-base transition-colors duration-200 flex items-center gap-2"
        disabled={!instagramUrl.trim() || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Carregando...
          </>
        ) : (
          <>
            <Search className="h-5 w-5" />
            Buscar Comentários
          </>
        )}
      </Button>
    </form>
  );
};

export default SearchForm;
