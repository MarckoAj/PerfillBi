import dotenv from 'dotenv';
import customExpress from "./config/customExpress.js";

dotenv.config();


const PORT = process.env.PORT || 3000;
const app = customExpress();

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});




