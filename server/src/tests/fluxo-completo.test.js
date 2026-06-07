import 'dotenv/config';
import request from 'supertest';
import app from '../app.js';
import sequelize from '../database/config.js';
import authService from '../services/auth.service.js';

describe('Teste de Integração: Fluxo Completo e Cobertura Ampliada (>75%)', () => {
    let tokenUser1, tokenUser2, tokenAdmin;
    let userId1, userId2;
    let livroId, emprestimoId;

    const user1Data = { nome: 'Dono do Livro', email: 'dono@folium.com', senha: 'senhaforte' };
    const user2Data = { nome: 'Leitor', email: 'leitor@folium.com', senha: 'senhaforte' };
    const adminCredentials = { email: 'admin', senha: 'senhasenhasenhaadminadminadmin' };

    beforeAll(async () => {
        await sequelize.sync({ force: true });
        await authService.seedAdmin();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    // --- BLOCO 1: VALIDAÇÕES E USUÁRIOS ---
    it('1. Deve barrar a criação de usuário com email inválido (Cobertura Validator)', async () => {
        const res = await request(app).post('/usuarios').send({ nome: '', email: 'email-errado', senha: '12' });
        expect(res.status).toBe(400); // Bad Request
    });

    it('2. Deve criar usuários, obter tokens e logar com Admin', async () => {
        const res1 = await request(app).post('/usuarios').send(user1Data);
        userId1 = res1.body.id;
        tokenUser1 = (await request(app).post('/login').send({ email: user1Data.email, senha: user1Data.senha })).body.token;

        const res2 = await request(app).post('/usuarios').send(user2Data);
        userId2 = res2.body.id;
        tokenUser2 = (await request(app).post('/login').send({ email: user2Data.email, senha: user2Data.senha })).body.token;

        tokenAdmin = (await request(app).post('/login').send(adminCredentials)).body.token;
    });

    it('3. Usuário deve conseguir atualizar o próprio perfil', async () => {
        const res = await request(app)
            .put(`/usuarios/${userId1}`)
            .set('Authorization', `Bearer ${tokenUser1}`)
            .send({ nome: 'Nome Atualizado' });
        expect(res.status).toBe(200);
    });

    it('4. Admin deve conseguir promover e rebaixar usuários (Cobertura Admin User)', async () => {
        const resPromote = await request(app).patch(`/usuarios/${userId2}/promover`).set('Authorization', `Bearer ${tokenAdmin}`);
        expect(resPromote.status).toBe(200);
        
        const resDemote = await request(app).patch(`/usuarios/${userId2}/rebaixar`).set('Authorization', `Bearer ${tokenAdmin}`);
        expect(resDemote.status).toBe(200);
    });

    // --- BLOCO 2: LIVROS E GÊNEROS ---
    it('5. Deve barrar criação de livro com quantidade negativa (Cobertura Validator)', async () => {
        const res = await request(app).post('/livros').set('Authorization', `Bearer ${tokenUser1}`).send({
            nome: '', editora: '', quantidade_total: -5
        });
        expect(res.status).toBe(400);
    });

    it('6. Deve criar livro incluindo Gêneros (Cobertura de Tabela Pivô)', async () => {
        const res = await request(app).post('/livros').set('Authorization', `Bearer ${tokenUser1}`).send({
            nome: 'Arquitetura Limpa', editora: 'Alta Books', quantidade_total: 2, generos: ['Tecnologia', 'Engenharia']
        });
        expect(res.status).toBe(201);
        livroId = res.body.id;
    });

    it('7. Deve listar livros filtrando por gênero', async () => {
        const res = await request(app).get('/livros?genero=Tecnologia');
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('8. Admin deve conseguir atualizar livro de qualquer usuário', async () => {
        const res = await request(app).put(`/livros/${livroId}`).set('Authorization', `Bearer ${tokenAdmin}`).send({
            comentario: 'Admin aprovou este livro'
        });
        expect(res.status).toBe(200);
    });

    // --- BLOCO 3: EMPRÉSTIMOS COM ADMIN ---
    it('9. Usuário 2 pega livro emprestado', async () => {
        const res = await request(app).post('/emprestimos').set('Authorization', `Bearer ${tokenUser2}`).send({
            livro_id: livroId, data_fim: '2050-12-31'
        });
        expect(res.status).toBe(201);
        emprestimoId = res.body.id;
    });

    it('10. Admin deve conseguir forçar alteração de status de empréstimo (Cobertura Admin Emp)', async () => {
        const res = await request(app).patch(`/emprestimos/${emprestimoId}/status`).set('Authorization', `Bearer ${tokenAdmin}`).send({
            status: 'ATRASADO'
        });
        expect(res.status).toBe(200);
    });

    it('11. Admin deve conseguir registrar devolução pelo usuário', async () => {
        const res = await request(app).post(`/emprestimos/${emprestimoId}/return`).set('Authorization', `Bearer ${tokenAdmin}`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('DEVOLVIDO');
    });

    // --- BLOCO FINAL: EXCLUSÕES ---
    it('12. Usuário comum falha ao deletar outro, mas Admin tem sucesso', async () => {
        // User 1 tenta deletar User 2 (Falha 403)
        const fail = await request(app).delete(`/usuarios/${userId2}`).set('Authorization', `Bearer ${tokenUser1}`);
        expect(fail.status).toBe(403);

        // Admin deleta User 2 (Sucesso 204)
        const success = await request(app).delete(`/usuarios/${userId2}`).set('Authorization', `Bearer ${tokenAdmin}`);
        expect(success.status).toBe(204);
    });
});