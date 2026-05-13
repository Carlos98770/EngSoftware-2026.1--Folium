import express from "express"

const testRouter = express.Router()

testRouter.get('/test', (req,res)=>{
    return res.json({status:"API rodando"})
});

export default testRouter;