// server.js
const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // 添加 Express 中间件
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // 添加 Express 路由
  server.get('/api', (req, res) => {
    res.json({ message: 'Hello from Express!' });
  });

  // Next.js 请求处理
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3001;

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
