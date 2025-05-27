
import React from 'react';
import { Search, Instagram, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SearchFormProps {
  instagramUrl: string;
  setInstagramUrl: (url: string) => void;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
  onSearch: () => void;
}

const SearchForm = ({
  instagramUrl,
  setInstagramUrl,
  searchFilter,
  setSearchFilter,
  onSearch
}: SearchFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instagramUrl.trim()) {
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
            placeholder="https://www.instagram.com/p/..."
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            className="pl-10 h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
        {instagramUrl && !isValidInstagramUrl(instagramUrl) && (
          <p className="mt-2 text-sm text-red-600">
            Por favor, insira um link válido do Instagram
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="search-filter" className="text-base font-medium text-gray-900 mb-2 block">
          Filtrar por usuário ou palavra-chave (opcional)
        </Label>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="search-filter"
            type="text"
            placeholder="Ex: maria_silva ou 'lugar incrível'"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-10 h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Digite um nome de usuário ou palavra-chave para filtrar os comentários
        </p>
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium text-base transition-colors duration-200 flex items-center gap-2"
        disabled={!instagramUrl.trim()}
      >
        <Search className="h-5 w-5" />
        Buscar Comentários
      </Button>
    </form>
  );
};

export default SearchForm;
