use folium;

create table users (
    id int auto_increment,
    nome varchar(255) not null,
    email varchar(255) not null unique,
    senha_hash varchar(255) not null,
    role enum('USER', 'ADMIN') default 'USER',
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    primary key(id)
);

create table livros (
    id int auto_increment,
    nome varchar(255) not null,
    editora varchar(255) not null,
    comentario varchar(200),
    quantidade_total int not null,
    quantidade_disponivel int not null,
    user_id int not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    primary key (id),
    foreign key (user_id) references users(id) on delete restrict on update cascade
);

create table emprestimos (
    id int auto_increment,
    livro_id int not null,
    dono_id int not null,
    receptor_id int not null,
    data_inicio datetime not null,
    data_fim datetime not null,
    data_devolucao datetime null,
    status enum('ATIVO', 'DEVOLVIDO', 'ATRASADO') default 'ATIVO',
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    primary key (id),
    foreign key (livro_id) references livros(id) on delete restrict on update cascade,
    foreign key (dono_id) references users(id) on delete restrict on update cascade,
    foreign key (receptor_id) references users(id) on delete restrict on update cascade
);

create table generos (
    id int auto_increment,
    nome varchar(100) not null unique,
    primary key (id)
);

create table livro_generos (
    livro_id int not null,
    genero_id int not null,
    primary key(livro_id, genero_id),
    foreign key (livro_id) references livros(id) on delete cascade on update cascade,
    foreign key (genero_id) references generos(id) on delete cascade on update cascade
);

create index idx_livro_generos_genero on livro_generos(genero_id);