const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(cors({
    origin: ['https://data.taipei', 'http://localhost:3000']
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const fetchAllData = async () => {
    const apiUrl = 'https://data.taipei/api/v1/dataset/893c2f2a-dcfd-407b-b871-394a14105532?scope=resourceAquire&resource_id=893c2f2a-dcfd-407b-b871-394a14105532';
    let allData = [];
    let offset = 0;
    const limit = 1000; // 每次请求的数据量上限
    let hasMoreData = true;

    while (hasMoreData) {
        try {
            const response = await axios.get(`${apiUrl}&limit=${limit}&offset=${offset}`);
            const data = response.data.result.results;
            allData = allData.concat(data);
            if (data.length < limit) {
                hasMoreData = false; // 如果返回的数据量少于 limit，说明没有更多数据了
            } else {
                offset += limit; // 更新 offset 以获取下一页数据
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            hasMoreData = false;
        }
    }

    return allData;
};

app.get('/api/fares', async (req, res) => {
    try {
        const data = await fetchAllData();
        res.json({ result: { results: data } });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
