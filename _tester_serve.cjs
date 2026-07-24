// office-crew tester: minimal static server for the built app
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(process.env.SERVE_DIR || '.');
const port = Number(process.env.PORT || 4173);
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript',
  '.css':'text/css', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg', '.gif':'image/gif', '.svg':'image/svg+xml', '.ico':'image/x-icon',
  '.wav':'audio/wav', '.mp3':'audio/mpeg', '.ogg':'audio/ogg', '.woff':'font/woff',
  '.woff2':'font/woff2', '.ttf':'font/ttf', '.map':'application/json' };
http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0]);
  if (p === '/' || p.endsWith('/')) p += 'index.html';
  const fp = path.normalize(path.join(root, p));
  if (!fp.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(fp, (err, data) => {
    if (err) { // SPA fallback → index.html
      return fs.readFile(path.join(root, 'index.html'), (e2, d2) => {
        if (e2) { res.writeHead(404); res.end('not found'); }
        else { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(d2); }
      });
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(fp)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, () => console.log('tester serving ' + root + ' on ' + port));
