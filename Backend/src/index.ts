import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
// const PORT = process.env.PORT;
const PORT = 3000;

app.use(cors());
app.use(express.json());


// endpoints


app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});

// npm run dev