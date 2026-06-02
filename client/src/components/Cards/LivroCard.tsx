import React from 'react';
import './LivroCard.css';

interface LivroCardProps {
  titulo: string;
  disponivel: boolean;
}

export default function LivroCard({ titulo, disponivel }: LivroCardProps) {
  return (
    <div className="LivroCard">
      <h3 className="LivroTitulo">{titulo}</h3>
      <span className={`LivroStatus ${disponivel ? 'disponivel' : 'indisponivel'}`}>
        {disponivel ? 'Disponível' : 'Indisponível'}
      </span>
    </div>
  );
}