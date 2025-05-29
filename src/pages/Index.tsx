
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchForm from "@/components/SearchForm";
import SimpliersResearch from "@/components/SimpliersResearch";
import AdvancedResearch from "@/components/AdvancedResearch";
import SingleBotTester from "@/components/SingleBotTester";
import ApiConfiguration from "@/components/ApiConfiguration";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏆 Instagram Comment Extractor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sistema profissional para extração de comentários do Instagram com múltiplas tecnologias
          </p>
        </div>

        <Tabs defaultValue="bot-test" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bot-test">🤖 Teste Bot</TabsTrigger>
            <TabsTrigger value="search">🔍 Busca Básica</TabsTrigger>
            <TabsTrigger value="simpliers">⚡ Técnicas Simples</TabsTrigger>
            <TabsTrigger value="advanced">🚀 Avançado</TabsTrigger>
            <TabsTrigger value="config">⚙️ Config API</TabsTrigger>
          </TabsList>

          <TabsContent value="bot-test" className="space-y-6">
            <SingleBotTester />
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <SearchForm />
          </TabsContent>

          <TabsContent value="simpliers" className="space-y-6">
            <SimpliersResearch />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <AdvancedResearch />
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <ApiConfiguration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
