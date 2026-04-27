import mongoose from "mongoose";

const emprestimoSchema = new mongoose.Schema({
    livro_id:{type: mongoose.Schema.Types.ObjectId, ref:("Livro"), required: true},
    dono_id:{type: mongoose.Schema.Types.ObjectId, ref:("User"), required: true},
    receptor_id:{ type: mongoose.Schema.Types.ObjectId, ref:("User"), required: true},
    data_inicio:{type: Date,required: true},
    data_fim:{type: Date, required: true},
    data_devolucao:{type: Date},
    status:{type: String, enum : ["ATIVO", "DEVOLVIDO", "ATRASADO"], default: "ATIVO"}
},{
    timestamps: true
});

export default mongoose.model("Emprestimo", emprestimoSchema)