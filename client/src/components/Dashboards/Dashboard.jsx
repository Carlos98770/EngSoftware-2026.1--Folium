import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const API_URL = "http://localhost:3000";

const fetchData = async (endpoint) => {
    try {
        const token = localStorage.getItem('server.token');
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao buscar dados de ${endpoint}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erro ao buscar ${endpoint}:`, error);
        throw error;
    }
};

const useWindowWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handle = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handle);
        return () => window.removeEventListener('resize', handle);
    }, []);
    return width;
};

const ChartCard = ({ title, data, options, component: Component, className, height }) => (
    <div className={`chart-card ${className}`}>
        <h3>{title}</h3>
        {data ? (
            <div className="chart-inner" style={{ minHeight: height }}>
                <Component data={data} options={{ ...options, maintainAspectRatio: false }} />
            </div>
        ) : (
            <p className="no-data">Sem dados.</p>
        )}
    </div>
);

const Dashboard = () => {
    const [availabilityData, setAvailabilityData]     = useState(null);
    const [mostRentedData, setMostRentedData]         = useState(null);
    const [rentalsStatusData, setRentalsStatusData]   = useState(null);
    const [activeClientsData, setActiveClientsData]   = useState(null);
    const [overdueReturnsData, setOverdueReturnsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    const width = useWindowWidth();
    const isMobile = width <= 640;
    const chartHeight = isMobile ? 200 : 300;
    const smallHeight = isMobile ? 180 : 260;

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [availability, mostRented, rentalsStatus, activeClients, overdueReturns] =
                    await Promise.all([
                        fetchData("/emprestimos/dashboard/availability"),
                        fetchData("/emprestimos/dashboard/most-rented"),
                        fetchData("/emprestimos/dashboard/status"),
                        fetchData("/emprestimos/dashboard/active-clients"),
                        fetchData("/emprestimos/dashboard/overdue-returns"),
                    ]);

                setAvailabilityData({
                    disponivel: availability.availableBooks || 0,
                    alugado: (availability.totalBooks - availability.availableBooks) || 0,
                });
                setMostRentedData(mostRented);
                setRentalsStatusData(
                    rentalsStatus.reduce(
                        (acc, item) => { acc[item.status.toLowerCase()] = item.count; return acc; },
                        { ativo: 0, devolvido: 0, atrasado: 0 }
                    )
                );
                setActiveClientsData(activeClients);
                setOverdueReturnsData(overdueReturns);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <p style={{ textAlign: 'center', padding: '40px', color: '#555' }}>Carregando gráficos...</p>;
    if (error)   return <p style={{ textAlign: 'center', padding: '40px', color: 'red' }}>Erro: {error}</p>;

    const dpr = window.devicePixelRatio * 2;

    const base = {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: dpr,
        plugins: { legend: { position: 'top' }, title: { display: false } },
    };

    const tick      = { color: '#666', font: { size: isMobile ? 10 : 11 } };
    const gridColor = 'rgba(0,0,0,0.06)';

    const availabilityChartData = availabilityData && {
        labels: ['Acervo'],
        datasets: [
            { label: 'Disponível', data: [availabilityData.disponivel], backgroundColor: '#28a745', borderRadius: 6, borderWidth: 0 },
            { label: 'Alugado',    data: [availabilityData.alugado],    backgroundColor: '#dc3545', borderRadius: 6, borderWidth: 0 },
        ],
    };

    const mostRentedChartData = mostRentedData?.length > 0 ? {
        labels: mostRentedData.map(b => b.livro.nome),
        datasets: [{ label: 'Aluguéis', data: mostRentedData.map(b => b.rentCount), backgroundColor: '#007bff', borderRadius: 4, borderWidth: 0 }],
    } : null;

    const rentalsStatusChartData = rentalsStatusData && {
        labels: ['Ativo', 'Devolvido', 'Atrasado'],
        datasets: [{
            data: [rentalsStatusData.ativo, rentalsStatusData.devolvido, rentalsStatusData.atrasado],
            backgroundColor: ['#007bff', '#28a745', '#dc3545'],
            borderColor: '#fff',
            borderWidth: 3,
        }],
    };

    const activeClientsChartData = activeClientsData?.length > 0 ? {
        labels: activeClientsData.map(c => c.receptor.nome),
        datasets: [{ label: 'Nº de Aluguéis', data: activeClientsData.map(c => c.rentalCount), backgroundColor: '#6f42c1', borderRadius: 4, borderWidth: 0 }],
    } : null;

    const overdueCount = overdueReturnsData?.length || 0;
    const overdueReturnsChartData = overdueCount > 0 ? {
        labels: overdueReturnsData.map(i => i.receptor.nome + ' — ' + i.livro.nome),
        datasets: [{
            label: 'Dias em Atraso',
            data: overdueReturnsData.map(i => Math.ceil(Math.abs(new Date() - new Date(i.data_fim)) / 86400000)),
            backgroundColor: '#ffc107',
            borderRadius: 4,
            borderWidth: 0,
        }],
    } : null;

    const overdueChartHeight = Math.max(200, overdueCount * 44 + 50);

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-grid">

                <ChartCard
                    title="Disponibilidade do Acervo"
                    data={availabilityChartData}
                    options={{ ...base, scales: { x: { ticks: tick, grid: { color: gridColor } }, y: { ticks: tick, grid: { color: gridColor } } } }}
                    component={Bar}
                    className="card-availability"
                    height={chartHeight}
                />

                <ChartCard
                    title="Status dos Empréstimos"
                    data={rentalsStatusChartData}
                    options={{ ...base, plugins: { legend: { position: 'bottom', labels: { font: { size: isMobile ? 10 : 12 } } }, title: { display: false } } }}
                    component={Doughnut}
                    className="card-status"
                    height={chartHeight}
                />

                <ChartCard
                    title="Livros Mais Alugados"
                    data={mostRentedChartData}
                    options={{ ...base, indexAxis: 'y', scales: { x: { ticks: tick, grid: { color: gridColor } }, y: { ticks: { ...tick, font: { size: isMobile ? 9 : 11 } }, grid: { display: false } } } }}
                    component={Bar}
                    className="card-most-rented"
                    height={smallHeight}
                />

                <ChartCard
                    title="Clientes Mais Ativos"
                    data={activeClientsChartData}
                    options={{ ...base, scales: { x: { ticks: { ...tick, maxRotation: 35 }, grid: { color: gridColor } }, y: { ticks: tick, grid: { color: gridColor } } } }}
                    component={Bar}
                    className="card-active-clients"
                    height={smallHeight}
                />

                <div className="chart-card card-overdue">
                    <h3>Devoluções em Atraso</h3>
                    {overdueReturnsChartData ? (
                        <div className="chart-inner" style={{ height: overdueChartHeight }}>
                            <Bar
                                data={overdueReturnsChartData}
                                options={{
                                    ...base,
                                    indexAxis: 'y',
                                    scales: {
                                        x: { ticks: tick, grid: { color: gridColor } },
                                        y: { ticks: { ...tick, font: { size: isMobile ? 9 : 10 } }, grid: { display: false } },
                                    },
                                }}
                            />
                        </div>
                    ) : (
                        <p className="no-data">Sem devoluções em atraso.</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;