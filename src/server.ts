import cors from 'cors';
import 'dotenv/config';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { router } from './routes.js';
const app = express();

app.use(express.json());
app.use(cors());
app.use(router);
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof Error) {
    return res.status(400).json({
      error: error.message,
    });
  }
  return res.status(500).json({
    error: 'internal server error',
  });
});
const PORT = process.env.port || 3333;

app.listen(PORT, () => {
  console.log('port' + PORT);
});
