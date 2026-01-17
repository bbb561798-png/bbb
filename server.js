// Simple local server to test /transfer endpoint without extra dependencies
// Run: node server.js

const http = require('http');
const PORT = 3000;

function sendJSON(res, status, obj) {
  const payload = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(payload);
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    // CORS preflight
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  if (req.method === 'POST' && req.url === '/transfer') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let data;
      try { data = JSON.parse(body); } catch (e) {
        return sendJSON(res, 400, { success: false, message: 'JSON غير صالح' });
      }

      const { email, amount } = data;
      if (!email || !amount) {
        return sendJSON(res, 400, { success: false, message: 'البريد أو المبلغ مفقود' });
      }

      // هنا يمكنك إضافة منطق الاتصال بـ FaucetPay API إذا أردت
      // حالياً نرد محاكاة ناجحة
      return sendJSON(res, 200, { success: true, message: `تم تحويل ${amount} DEGO إلى ${email}` });
    });
    return;
  }

  // Not found
  sendJSON(res, 404, { success: false, message: 'المسار غير موجود' });
});

server.listen(PORT, () => console.log(`Local test server running on http://localhost:${PORT}`));
