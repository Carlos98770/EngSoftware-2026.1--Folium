import React, { useState } from 'react';
import AdicionarModal from '../../pages/AlterarLivros/AlterarLivro'; // Ajuste o caminho se necessário
import './LivroCard.css';

interface LivroCardProps {
  titulo: string;
  disponivel: boolean;
}

export default function LivroCard({ titulo, disponivel }: LivroCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="LivroCard">
        <div className="LivroInfo">
          <h3 className="LivroTitulo">{titulo}</h3>
          <span className={`LivroStatus ${disponivel ? 'disponivel' : 'indisponivel'}`}>
            {disponivel ? 'Disponível' : 'Indisponível'}
          </span>
        </div>
        
        <button className="BtnAlterarLivro" onClick={() => setIsModalOpen(true)}>
          Alterar
        </button>
      </div>

      <AdicionarModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
    </>
  );
}