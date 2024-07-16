const http = require('http');

const PORT = process.env.PORT;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Keep alive!');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
