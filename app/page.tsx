'use client'
import React, { useState } from 'react';

const UserIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 text-gray-600"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Home: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [registrationMessage, setRegistrationMessage] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const [apiData, setApiData] = useState(['Dados']);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [dataErrorMessage, setDataErrorMessage] = useState<string>('');
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationMessage('');
    setIsRegistering(true);

    try {
      if(!name ||!email || !password) return false

        const response = await fetch(`/api/user/register`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

      const { backend } = await response.json();
      const { data } = await backend;


      if (data.success) {
        setRegistrationMessage(data.message);
        setEmail('');
        setPassword('');
      } else {
        setRegistrationMessage(`Erro: ${data.message}`);
      }
    } catch (error) {
      setRegistrationMessage('Ocorreu um erro ao tentar registrar.');
      console.error('Erro de registro:', error);
    } finally {
      setIsRegistering(false);
    }
  };

 
  const fetchSomeData = async () => {
    setApiData([]);
    setDataErrorMessage('');
    setIsLoadingData(true);

    try {
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
          },
          
        });
        
       const { backend } = await response.json();
       const { data } = await backend;
      if (data.success) {
        setApiData(data.users);
      } else {
        setDataErrorMessage(`Erro: ${data.message}`);
      }
    } catch (error) {
      setDataErrorMessage('Ocorreu um erro ao buscar os dados.');
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 font-sans text-gray-800 flex items-center justify-center p-4">
    
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full transform transition-all duration-300 border border-indigo-200">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8 tracking-tight">
          Meu App Next.js
        </h1>

        <section className="mb-10 p-6 bg-indigo-50 rounded-lg shadow-inner border border-indigo-100">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6 flex items-center justify-center">
            <UserIcon />
            <span className="ml-3">Registro de Usuário</span>
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 focus:ring-2"
                placeholder="Seu nome aqui"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 focus:ring-2"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 focus:ring-2"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold text-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              disabled={isRegistering}
            >
              {isRegistering ? 'Registrando...' : 'Registrar'}
            </button>
          </form>
          
          {registrationMessage && (
            <p className={`mt-4 text-center text-sm font-medium ${registrationMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
              {registrationMessage}
            </p>
          )}
        </section>

        <section className="p-6 bg-purple-50 rounded-lg shadow-inner border border-purple-100">
          <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
            Consumir Dados da API
          </h2>
          <button
            onClick={fetchSomeData}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-md font-semibold text-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            disabled={isLoadingData}
          >
            {isLoadingData ? 'Buscando Dados...' : 'Buscar Dados da API'}
          </button>
          {isLoadingData && (
            <p className="mt-4 text-center text-gray-500 text-sm">Carregando...</p>
          )}


          {apiData && (
            <div className="mt-4 p-4 bg-purple-100 text-purple-800 rounded-md border border-purple-200 text-sm font-mono break-words">
              {apiData.map((e, index)=> e.email ? (
                <div
                  className="mt-4 p-4 bg-purple-100 text-purple-800 rounded-md border border-purple-200 text-sm font-mono break-words"
                  key={index}
                >
                  <h2>{e.name}</h2>
                  <h2>{e.email}</h2>
                </div>
              ) : null
            )}
        
            </div>
          )}
          
          {dataErrorMessage && (
            <p className="mt-4 text-center text-red-600 text-sm font-medium">
              {dataErrorMessage}
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;

