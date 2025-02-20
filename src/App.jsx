import React, { useState } from 'react';
import { MapPin, Menu, X, Info, Map, Users, Settings } from 'lucide-react';
import MapPage from './pages/MapPage';

// Componente do Layout Principal
function Layout({ currentPage, onNavigate, children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Início', icon: Info },
    { id: 'map', label: 'Mapa Interativo', icon: Map },
    { id: 'community', label: 'Comunidade', icon: Users },
    { id: 'about', label: 'Sobre o Projeto', icon: Info },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MapPin className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">EcoVoz</span>
            </div>
            
            {/* Menu para Desktop */}
            <div className="hidden md:flex space-x-4">
              {menuItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium
                    ${currentPage === item.id 
                      ? 'bg-green-700 text-white' 
                      : 'text-green-100 hover:bg-green-500'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Menu para Mobile */}
            <button 
              className="md:hidden p-2 rounded-md hover:bg-green-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-green-500">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium
                  ${currentPage === item.id 
                    ? 'bg-green-700 text-white' 
                    : 'text-green-100 hover:bg-green-600'}`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-lg font-bold">EcoVoz</h3>
              <p className="text-sm">Mapeamento Colaborativo de Áreas Verdes</p>
            </div>
            <div className="flex space-x-4">
              <a href="https://github.com/seu-usuario/ecovoz" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-green-100 hover:text-white">
                GitHub
              </a>
              <button 
                onClick={() => onNavigate('about')}
                className="text-green-100 hover:text-white"
              >
                Documentação
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Páginas
function HomePage() {
  return (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo ao EcoVoz</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Sobre o Projeto</h2>
          <p>
            O EcoVoz é uma plataforma colaborativa para mapeamento e monitoramento 
            de áreas verdes urbanas. Através da participação da comunidade, 
            buscamos criar um banco de dados atualizado e preciso sobre os espaços 
            verdes em nossa cidade.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Funcionalidades</h2>
          <ul className="space-y-2">
            <li>✓ Mapeamento interativo de áreas verdes</li>
            <li>✓ Busca e filtros avançados</li>
            <li>⋯ Análise de dados e estatísticas (Em breve)</li>
            <li>⋯ Perfis de usuário e gamificação (Em breve)</li>
            <li>⋯ Relatórios e visualizações (Em breve)</li>
            <li>⋯ API pública (Em desenvolvimento)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function CommunityPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Comunidade</h2>
      <p className="text-gray-600">
        Esta seção está em desenvolvimento. Recursos planejados:
      </p>
      <ul className="list-disc ml-6 mt-2 text-gray-600">
        <li>Perfis de usuário</li>
        <li>Sistema de pontuação</li>
        <li>Fórum de discussão</li>
        <li>Eventos e encontros</li>
      </ul>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-bold mb-6">Sobre o EcoVoz</h1>
      <p>
        O EcoVoz é um projeto de código aberto que visa criar uma ferramenta 
        colaborativa para o mapeamento e monitoramento de áreas verdes urbanas.
      </p>
      <h2>Objetivos</h2>
      <ul>
        <li>Mapear e categorizar áreas verdes urbanas</li>
        <li>Promover a conscientização ambiental</li>
        <li>Gerar dados para políticas públicas</li>
        <li>Criar uma comunidade engajada</li>
      </ul>
      <h2>Documentação</h2>
      <p>
        Para mais detalhes sobre o projeto, funcionalidades e como contribuir, 
        visite nossa documentação completa no GitHub.
      </p>
      <a 
        href="https://github.com/seu-usuario/ecovoz" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 no-underline"
      >
        Ver no GitHub
      </a>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Configurações</h2>
      <p className="text-gray-600">
        Esta seção está em desenvolvimento. Configurações planejadas:
      </p>
      <ul className="list-disc ml-6 mt-2 text-gray-600">
        <li>Preferências de mapa</li>
        <li>Notificações</li>
        <li>Privacidade</li>
        <li>Integrações</li>
      </ul>
    </div>
  );
}

// Componente Principal
function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'map':
        return <MapPage />;
      case 'community':
        return <CommunityPage />;
      case 'about':
        return <AboutPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;