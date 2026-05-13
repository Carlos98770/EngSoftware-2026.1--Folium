import mongoose from "mongoose";

export function connectDataBase() {
    return mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("Mongo conectado!"))
        .catch(err => {
            console.error("Erro ao conectar ao Mongo!", err);
            process.exit(1);
        });
}
