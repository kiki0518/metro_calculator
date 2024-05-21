const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 设置静态文件目录
app.use(express.static(path.join(__dirname, '..', 'public')));

// 允许跨域访问多个来源
app.use(cors({
    origin: ['https://data.taipei', 'http://localhost:3000']
}));

// 在路由处理中发送 index.html 文件
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// 定义代理路由，将请求转发到 data.taipei
app.get('/api/fares', async (req, res) => {
    try {
        const apiUrl = 'https://data.taipei/api/v1/dataset/893c2f2a-dcfd-407b-b871-394a14105532?scope=resourceAquire&resource_id=893c2f2a-dcfd-407b-b871-394a14105532';
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
