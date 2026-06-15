import React, { useState } from 'react';
import AdicionarModal from '../../pages/AlterarLivros/AlterarLivro'; // Ajuste o caminho se necessário
import './LivroCard.css';
import { LivroService } from '../../services/LivroService';
import { authService } from '../../auth/AuthService';

interface LivroCardProps {
  id: number
  titulo: string;
  disponivel: boolean;
  descricao: string;
  onDelete?: (id: number) => void;
}

export default function LivroCard({ id,titulo, disponivel, descricao, onDelete }: LivroCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = authService.adminLogged() && authService.userLogged();

  const handleDelete = async () => {
    if (!confirm(`Deseja excluir "${titulo}"?`)) return;
    await LivroService.deletar(id);
    onDelete?.(id);
  };

  return (
  <>
    <div className="LivroCard">
      <span className="LivroIdBadge">#{id}</span>
      <div className="LivroInfo">
        <h3 className="LivroTitulo">{titulo}</h3>
        <p className="LivroDescricao">{descricao}</p>
      </div>
      <div className="CardFooter">
        <span className={`LivroStatus ${disponivel ? 'disponivel' : 'indisponivel'}`}>
          <span className="StatusDot" />
          {disponivel ? 'Disponível' : 'Indisponível'}
        </span>
        <div className="CardActions">
                                    {isAdmin && (
                            <button className="BtnAlterarLivro" onClick={() => setIsModalOpen(true)}>
                                Alterar
                            </button>
                        )}
                        {isAdmin && (
                            <button className="BtnDeletarLivro" onClick={handleDelete}>
                                Excluir
                            </button>
                        )}

          </div>
      </div>
    </div>
    <AdicionarModal isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    livro={{ id, nome: titulo, comentario: descricao }} />
  </>
);
}