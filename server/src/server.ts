import app from './app';

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.info(`🌟 http://localhost:${port} 🌟`);
});
