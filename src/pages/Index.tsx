
import React, { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import CommentList from '@/components/CommentList';
import { Instagram } from 'lucide-react';

// Dados de exemplo simulando comentários do Instagram
const sampleComments = [
  {
    id: 1,
    username: "maria_silva",
    text: "Que foto linda! Adorei o look 😍",
    timestamp: "2h"
  },
  {
    id: 2,
    username: "joao_santos",
    text: "Incrível! Onde foi tirada essa foto?",
    timestamp: "3h"
  },
  {
    id: 3,
    username: "ana_costa",
    text: "Perfeita como sempre! 💕",
    timestamp: "4h"
  },
  {
    id: 4,
    username: "carlos_oliveira",
    text: "Que lugar maravilhoso para viajar",
    timestamp: "5h"
  },
  {
    id: 5,
    username: "lucia_ferreira",
    text: "Amei a combinação de cores! Muito estilo",
    timestamp: "6h"
  },
  {
    id: 6,
    username: "pedro_alves",
    text: "Foto profissional demais! Parabéns",
    timestamp: "7h"
  },
  {
    id: 7,
    username: "clara_mendes",
    text: "Inspiração pura! Obrigada por compartilhar",
    timestamp: "8h"
  },
  {
    id: 8,
    username: "rafael_lima",
    text: "Lugar incrível! Vou adicionar na minha lista de viagem",
    timestamp: "9h"
  }
];

export interface Comment {
  id: number;
  username: string;
  text: string;
  timestamp: string;
}

const Index = () => {
  const [instagramUrl, setInstagramUrl] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = () => {
    console.log('Buscando comentários para URL:', instagramUrl);
    console.log('Filtro aplicado:', searchFilter);
    
    // Simula a busca de comentários
    let results = sampleComments;
    
    // Aplica filtro se houver texto de busca
    if (searchFilter.trim()) {
      results = sampleComments.filter(comment => 
        comment.username.toLowerCase().includes(searchFilter.toLowerCase()) ||
        comment.text.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }
    
    setFilteredComments(results);
    setIsSearched(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Instagram className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Busca Comentário</h1>
              <p className="text-gray-600 text-sm">Encontre comentários específicos em publicações do Instagram</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <SearchForm
            instagramUrl={instagramUrl}
            setInstagramUrl={setInstagramUrl}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            onSearch={handleSearch}
          />
        </div>

        {/* Results */}
        {isSearched && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Comentários Encontrados
              </h2>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {filteredComments.length} {filteredComments.length === 1 ? 'comentário' : 'comentários'}
              </span>
            </div>
            
            <CommentList comments={filteredComments} searchFilter={searchFilter} />
          </div>
        )}

        {/* Info Section */}
        {!isSearched && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Como usar:</h3>
            <div className="space-y-2 text-blue-800">
              <p className="flex items-start gap-2">
                <span className="font-medium">1.</span>
                <span>Cole o link da publicação do Instagram no primeiro campo</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-medium">2.</span>
                <span>Digite um nome de usuário ou palavra-chave para filtrar os comentários (opcional)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-medium">3.</span>
                <span>Clique em "Buscar Comentários" para ver os resultados</span>
              </p>
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Nota:</strong> Esta é uma versão de demonstração com comentários simulados. 
                Em uma versão completa, seria necessário integração com APIs oficiais do Instagram.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            Busca Comentário - Ferramenta para filtrar comentários do Instagram
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
