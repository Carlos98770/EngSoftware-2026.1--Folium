import mongoose from "mongoose";

const livroSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    editora: { type: String, required: true },
    comentario: { type: String, maxlength: 200 },
    generos: [{ type: String }],
    quantidade_total: { type: Number, required: true },
    quantidade_disponivel: { type: Number, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: true
});

export default mongoose.model("Livro", livroSchema);
