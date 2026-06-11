import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2 } from "lucide-react";
import LiderService from "../../../services/liderService";
import SectionTitle from "../../../components/ui/SectionTitle";
import EmptyState from "../../../components/ui/EmptyState";
import Loading from "../../../components/ui/Loading";

export default function AdminLideres() {
  const navigate = useNavigate();
  const [lideres, setLideres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLideres();
  }, []);

  const fetchLideres = async () => {
    setLoading(true);
    try {
      const data = await LiderService.getAllLideres();
      setLideres(data);
      setError(null);
    } catch (err) {
      setError("Não foi possível carregar os líderes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este líder?")) return;
    try {
      await LiderService.deleteLider(id);
      fetchLideres();
    } catch (err) {
      alert("Erro ao excluir: " + err.message);
    }
  };

  const rightContent = (
    <Link
      to="/admin/lideres/criar"
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors shadow-sm"
    >
      Cadastrar Líder
      <Plus size={18} />
    </Link>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionTitle title="Líderes" rightContent={rightContent} />

      {loading ? (
        <Loading />
      ) : error ? (
        <EmptyState message={error} />
      ) : lideres.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Nome</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Cargo</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-center">Ordem</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-center">Tipo</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lideres.map((lider) => (
                <tr key={lider.lider_id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{lider.nome}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{lider.cargo}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm text-center">{lider.ordem}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${lider.is_antigo ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                      {lider.is_antigo ? 'Antigo' : 'Atual'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => navigate(`/admin/lideres/${lider.lider_id}/editar`)}
                      className="text-blue-500 hover:text-blue-700 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(lider.lider_id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="Nenhum líder cadastrado." />
      )}
    </div>
  );
}
