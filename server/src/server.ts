import app from './app';
import { connectDB } from './models';

(async () => {
  await connectDB();
})();

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.info(`🌟 http://localhost:${port} 🌟`);
});
