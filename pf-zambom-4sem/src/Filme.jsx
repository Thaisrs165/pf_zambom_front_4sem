import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const BASE_URL = "http://localhost:8080";

export default function FilmesApp() {
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [nota, setNota] = useState("");
  const [diretor, setDiretor] = useState("");

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();


  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        setToken(accessToken);
      } catch (e) {
        console.error("Erro ao buscar token:", e);
      }
    };

    if (isAuthenticated) fetchToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (!isAuthenticated) {
    return <LoginButton />;
  }

  
  async function fetchFilmes() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/filmes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Erro ao carregar: ${res.status}`);
      const data = await res.json();
      setFilmes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

 
  async function handleCreate(e) {
    e.preventDefault();
    setError(null);

    const dto = {
      nome,
      descricao,
      nota,
      diretor,
    };

    try {
      const res = await fetch(`${BASE_URL}/filmes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro ao criar: ${res.status} ${text}`);
      }

      const created = await res.json();
      setFilmes((prev) => [created, ...prev]);
      setNome("");
      setDescricao("");
      setNota("");
      setDiretor("");
    } catch (err) {
      setError(err.message);
    }
  }


  async function handleDelete(id) {
    try {
      const res = await fetch(`${BASE_URL}/filmes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Erro ao deletar: ${res.status}`);
      setFilmes((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-sans">
      {/* Usuário autenticado */}
      <div>
        <img src={user.picture} alt={user.name} className="w-16 rounded-full" />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <LogoutButton />
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">🎬 Filmes — criação e listagem</h1>

        {/* Formulário */}
        <form onSubmit={handleCreate} className="space-y-3 mb-6">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do filme"
            className="p-2 border rounded w-full"
          />
          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
            className="p-2 border rounded w-full"
          />
          <input
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Nota"
            className="p-2 border rounded w-full"
          />
          <input
            value={diretor}
            onChange={(e) => setDiretor(e.target.value)}
            placeholder="Diretor"
            className="p-2 border rounded w-full"
          />

          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Criar
            </button>
            <button
              type="button"
              onClick={fetchFilmes}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Recarregar
            </button>
          </div>
        </form>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        {/* Lista de filmes */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Lista de Filmes</h2>
          {loading ? (
            <div>Carregando...</div>
          ) : filmes.length === 0 ? (
            <div>Nenhum filme encontrado.</div>
          ) : (
            <ul className="space-y-3">
              {filmes.map((f) => (
                <li key={f.id} className="p-3 border rounded flex justify-between">
                  <div>
                    <div className="font-semibold">{f.nome}</div>
                    {f.descricao && (
                      <div className="text-sm text-gray-600">{f.descricao}</div>
                    )}
                    <div className="text-sm">🎬 Diretor: {f.diretor}</div>
                    <div className="text-sm">⭐ Nota: {f.nota}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Deletar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
