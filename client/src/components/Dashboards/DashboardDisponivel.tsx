import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Livro {
    id: number;
    nome: string;
    quantidade_total: number;
    quantidade_disponivel: number;
}

export default function DashboardDisponivel({listaLivros}: {listaLivros: Livro[]}){
    const disponiveis = listaLivros.reduce((acc, livro) => acc + livro.quantidade_disponivel, 0);
    const totais = listaLivros.reduce((acc, livro) => acc + livro.quantidade_total, 0);
    const alugados = totais - disponiveis;

    const data = {
        labels: ['Estoque Geral'], 
        datasets: [
            {
                label: 'Disponíveis',
                data: [disponiveis], 
                backgroundColor: '#28a745',
                borderRadius: 5,
            },
            {
                label: 'Alugados',
                data: [alugados],
                backgroundColor: '#dc3545',
                borderRadius: 5,
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    return (
        <div style={{ width: '100%', maxWidth: '400px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '15px' }}>
            <h4 style={{ textAlign: 'center', fontFamily: 'sans-serif', color: '#333', marginBottom: '15px' }}>
                Disponibilidade do Acervo
            </h4>
            
            <Bar data={data} options={options} />
        </div>
    );
}