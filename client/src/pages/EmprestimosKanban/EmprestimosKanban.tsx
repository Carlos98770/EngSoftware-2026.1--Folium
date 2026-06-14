import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { EmprestimoService } from "../../services/EmprestimoService"
import type { Emprestimo } from "../../models/EmprestimoModel"
import PageBackground from "../../components/pageBackground/PageBackground"
import "./EmprestimosKanban.css"
import { authService } from "../../auth/AuthService"

// ── Ícones inline ────────────────────────────────────────────────────────────

const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
)
const IconHandshake = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l8.42 8.42 8.42-8.42a5.4 5.4 0 0 0 0-7.65z" />
    </svg>
)
const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)
const IconBook = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
)
const IconUser = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
)
const IconCalendar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)
const IconInbox = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
)
const IconX = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })

// ── Card de empréstimo ───────────────────────────────────────────────────────

type EmpCardProps = {
    emp: Emprestimo
    onDevolver: (id: number) => void
}

function EmprestimoCard({ emp, onDevolver }: EmpCardProps) {
    const statusKey = emp.status.toLowerCase() as "ativo" | "devolvido" | "atrasado"
    const labelStatus = { ativo: "Ativo", devolvido: "Devolvido", atrasado: "Atrasado" }

    return (
        <div className="EmpCard">
            <div className="EmpCardBook">
                <div className="EmpCardBookIcon"><IconBook /></div>
                <div className="EmpCardBookInfo">
                    <p className="EmpCardBookName">{emp.livro.nome}</p>
                    <p className="EmpCardBookEditora">{emp.livro.editora}</p>
                </div>
            </div>

            <div className="EmpCardMeta">
                <div className="EmpCardMetaRow">
                    <IconUser />
                    <span>Receptor: <strong>{emp.receptor.nome}</strong></span>
                </div>
                <div className="EmpCardMetaRow">
                    <IconCalendar />
                    <span>Devolução prevista: <strong>{formatDate(emp.data_fim)}</strong></span>
                </div>
                {emp.data_devolucao && (
                    <div className="EmpCardMetaRow">
                        <IconCalendar />
                        <span>Devolvido em: <strong>{formatDate(emp.data_devolucao)}</strong></span>
                    </div>
                )}
            </div>

            <div className="EmpCardDivider" />

            <div className="EmpCardFooter">
                <span className={`EmpCardBadge ${statusKey}`}>{labelStatus[statusKey]}</span>
                {emp.status === "ATIVO" && (
                    <button className="EmpCardBtn devolver" onClick={() => onDevolver(emp.id)}>
                        Marcar devolvido
                    </button>
                )}
                {emp.status === "ATRASADO" && (
                    <button className="EmpCardBtn devolver" onClick={() => onDevolver(emp.id)}>
                        Registrar devolução
                    </button>
                )}
            </div>
        </div>
    )
}

// ── Modal de criar empréstimo ────────────────────────────────────────────────

type ModalProps = {
    onClose: () => void
    onSucesso: () => void
}

function AdicionarEmprestimoModal({ onClose, onSucesso }: ModalProps) {
    const [livroId, setLivroId] = useState("")
    const [dataFim, setDataFim] = useState("")
    const [erro, setErro] = useState("")
    const [loading, setLoading] = useState(false)

    const hoje = new Date()
    hoje.setDate(hoje.getDate() + 1)
    const minDate = hoje.toISOString().split("T")[0]

    const handleConfirmar = async () => {
        setErro("")
        if (!livroId || isNaN(Number(livroId))) {
            setErro("Informe um ID de livro válido.")
            return
        }
        if (!dataFim) {
            setErro("Informe a data de devolução.")
            return
        }
        const selectedDate = new Date(dataFim)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate <= today) {
            setErro("A data de devolução deve ser posterior à data atual.")
            return
        }

        setLoading(true)
        try {
            await EmprestimoService.create({
                livro_id: Number(livroId),
                data_fim: dataFim,
                receptor_id: authService.getUserId(),
            })
            toast("Empréstimo criado com sucesso!", {
                position: "top-right",
                autoClose: 3000,
                type: "success",
                theme: "light",
            })
            onSucesso()
            onClose()
        } catch (err: any) {
            console.error("Erro ao criar empréstimo:", err)
            setErro(err.message ?? "Erro ao criar empréstimo.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="ModalOverlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="ModalCard">
                <div className="ModalHeader">
                    <h2>Novo empréstimo</h2>
                    <button className="ModalCloseBtn" onClick={onClose}><IconX /></button>
                </div>

                <div className="ModalBody">
                    <div className="ModalFormGroup">
                        <label htmlFor="modal-livro-id">ID do livro</label>
                        <input
                            id="modal-livro-id"
                            type="number"
                            min={1}
                            placeholder="Ex: 3"
                            value={livroId}
                            onChange={(e) => setLivroId(e.target.value)}
                            className={erro && !livroId ? "input-error" : ""}
                        />
                    </div>

                    <div className="ModalFormGroup">
                        <label htmlFor="modal-data-fim">Data de devolução</label>
                        <input
                            id="modal-data-fim"
                            type="date"
                            min={minDate}
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                            className={erro && !dataFim ? "input-error" : ""}
                        />
                    </div>

                    {erro && <div className="ModalError">{erro}</div>}
                </div>

                <div className="ModalActions">
                    <button className="ModalCancelBtn" onClick={onClose}>Cancelar</button>
                    <button className="ModalConfirmBtn" onClick={handleConfirmar} disabled={loading}>
                        {loading ? "Salvando..." : "Criar empréstimo"}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Página principal ─────────────────────────────────────────────────────────

export default function EmprestimosKanban() {
    const navigate = useNavigate()
    const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
    const [loading, setLoading] = useState(true)
    const [modalAberto, setModalAberto] = useState(false)

    // ID do usuário logado — filtra os empréstimos na API
    const usuarioId = authService.getUserId()

    const carregar = async () => {
        try {
            setLoading(true)
            const data = await EmprestimoService.findAll({ receptor_id: usuarioId })
            setEmprestimos(data)
        } catch (err) {
            console.error("Erro ao carregar empréstimos:", err)
            toast("Erro ao carregar empréstimos.", { type: "error", theme: "light" })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { carregar() }, [])

    const handleDevolver = async (id: number) => {
        try {
            await EmprestimoService.devolver(id)
            toast("Devolução registrada!", { type: "success", theme: "light", autoClose: 3000 })
            carregar()
        } catch (err: any) {
            toast(err.message ?? "Erro ao registrar devolução.", { type: "error", theme: "light" })
        }
    }

    const ativos     = emprestimos.filter(e => e.status === "ATIVO")
    const devolvidos = emprestimos.filter(e => e.status === "DEVOLVIDO")
    const atrasados  = emprestimos.filter(e => e.status === "ATRASADO")

    const colunas = [
        { key: "ativo",     label: "Ativos",     dot: "ativo",     lista: ativos },
        { key: "atrasado",  label: "Atrasados",  dot: "atrasado",  lista: atrasados },
        { key: "devolvido", label: "Devolvidos", dot: "devolvido", lista: devolvidos },
    ]

    return (
        <>
            <PageBackground />

            <div className="KanbanPage" style={{ position: "relative", zIndex: 1 }}>
                {/* Cabeçalho */}
                <div className="KanbanHeader">
                    <button className="KanbanBackBtn" onClick={() => navigate("/main")} aria-label="Voltar">
                        <IconArrowLeft />
                    </button>
                    <div className="KanbanHeaderIcon"><IconHandshake /></div>
                    <div className="KanbanHeaderText">
                        <h1>Meus Empréstimos</h1>
                        <p>{emprestimos.length} empréstimo{emprestimos.length !== 1 ? "s" : ""} no total</p>
                    </div>
                    <div className="KanbanHeaderActions">
                        <button className="KanbanAddBtn" onClick={() => setModalAberto(true)}>
                            <IconPlus />
                            Novo empréstimo
                        </button>
                    </div>
                </div>

                {/* Board */}
                {loading ? (
                    <div className="KanbanLoading">Carregando empréstimos...</div>
                ) : (
                    <div className="KanbanBoard">
                        {colunas.map(({ key, label, dot, lista }) => (
                            <div key={key} className="KanbanColumn">
                                <div className="KanbanColumnHeader">
                                    <div className="KanbanColumnTitle">
                                        <span className={`KanbanColumnDot ${dot}`} />
                                        {label}
                                    </div>
                                    <span className="KanbanColumnCount">{lista.length}</span>
                                </div>

                                {lista.length === 0 ? (
                                    <div className="KanbanEmpty">
                                        <IconInbox />
                                        <p>Nenhum empréstimo</p>
                                    </div>
                                ) : (
                                    lista.map(emp => (
                                        <EmprestimoCard
                                            key={emp.id}
                                            emp={emp}
                                            onDevolver={handleDevolver}
                                        />
                                    ))
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {modalAberto && (
                <AdicionarEmprestimoModal
                    onClose={() => setModalAberto(false)}
                    onSucesso={carregar}
                />
            )}
        </>
    )
}