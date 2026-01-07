const http = require('http');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: body ? JSON.parse(body) : {} }));
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function test() {
    try {
        console.log('--- Starting Verification ---');

        // 1. GET All
        console.log('1. GET /posts');
        let res = await request({ hostname: 'localhost', port: 3000, path: '/posts', method: 'GET' });
        console.log('Status:', res.status, 'Count:', res.body.length);

        // 2. POST
        console.log('\n2. POST /posts');
        res = await request({
            hostname: 'localhost', port: 3000, path: '/posts', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { title: 'Test Post', content: 'Verification Content' });
        console.log('Status:', res.status, 'ID:', res.body.id);
        const newId = res.body.id;

        // 3. GET Single
        console.log(`\n3. GET /posts/${newId}`);
        res = await request({ hostname: 'localhost', port: 3000, path: `/posts/${newId}`, method: 'GET' });
        console.log('Status:', res.status, 'Title:', res.body.title);

        // 4. DELETE
        console.log(`\n4. DELETE /posts/${newId}`);
        res = await request({ hostname: 'localhost', port: 3000, path: `/posts/${newId}`, method: 'DELETE' });
        console.log('Status:', res.status);

        // 5. Verify Delete
        console.log(`\n5. GET /posts/${newId} (Verify Delete)`);
        res = await request({ hostname: 'localhost', port: 3000, path: `/posts/${newId}`, method: 'GET' });
        console.log('Status:', res.status); // Should be 404

        console.log('\n--- Verification Complete ---');
    } catch (err) {
        console.error('Verification Failed:', err);
    }
}

test();
