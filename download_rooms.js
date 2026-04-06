const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const TARGET_DIR = '/Users/biltubag/Downloads/Full stack developer all resource/project /resume project/MESS-WALLAH/frontend/public/images/rooms';
if (!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR, { recursive: true });

const delay = (ms) => new Promise(r => setTimeout(r, ms));

const downloadFile = (url, dest, redirects = 8) => new Promise((resolve, reject) => {
  const client = url.startsWith('https') ? https : http;
  const req = client.get(url, {
    timeout: 15000,
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
  }, (res) => {
    if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects > 0) {
      res.resume();
      let loc = res.headers.location;
      if (!loc.startsWith('http')) loc = new URL(loc, url).href;
      return downloadFile(loc, dest, redirects - 1).then(resolve).catch(reject);
    }
    if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
    const ct = res.headers['content-type'] || '';
    if (!ct.includes('image')) { res.resume(); return reject(new Error(`Not image: ${ct}`)); }
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => { file.close(); resolve(); });
    file.on('error', (e) => { try { fs.unlinkSync(dest); } catch (_) {} reject(e); });
  });
  req.on('error', reject);
  req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
});

const countExisting = () => {
  const files = fs.readdirSync(TARGET_DIR).filter(f => f.match(/^room-\d+\.jpg$/));
  return files.length;
};

const run = async () => {
  // Count how many we already have
  let saved = countExisting();
  console.log(`Found ${saved} existing images. Downloading to reach 200...\n`);

  const seenSizes = new Set();
  // Track sizes of existing files to avoid duplicate detection problems
  fs.readdirSync(TARGET_DIR).filter(f => f.match(/^room-\d+\.jpg$/)).forEach(f => {
    try { seenSizes.add(fs.statSync(path.join(TARGET_DIR, f)).size); } catch(_) {}
  });

  // Room-related keywords for loremflickr — single words, no commas
  const keywords = ['bedroom', 'interior', 'apartment', 'livingroom', 'room', 'studio', 'house', 'flat'];

  let lock = 1;
  let attempts = 0;

  while (saved < 200 && attempts < 800) {
    attempts++;
    const kw = keywords[lock % keywords.length];
    // CORRECT loremflickr URL format: ?lock=N (NOT /keyword/N)
    const url = `https://loremflickr.com/800/600/${kw}?lock=${lock}`;
    const dest = path.join(TARGET_DIR, `room-${saved + 1}.jpg`);

    try {
      await downloadFile(url, dest);
      const size = fs.statSync(dest).size;
      if (size > 15000 && !seenSizes.has(size)) {
        seenSizes.add(size);
        saved++;
        process.stdout.write(`[${saved}/200] ✅ ${kw}?lock=${lock} (${Math.round(size/1024)}KB)\n`);
      } else {
        try { fs.unlinkSync(dest); } catch (_) {}
        process.stdout.write(`[SKIP] ${kw}?lock=${lock} duplicate/too small\n`);
      }
    } catch (e) {
      process.stdout.write(`[FAIL] ${kw}?lock=${lock}: ${e.message}\n`);
    }

    lock++;
    await delay(250);
  }

  console.log(`\n✅ DONE! Total: ${saved} unique room images saved to:\n   ${TARGET_DIR}`);
};

run().catch(console.error);
