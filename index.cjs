const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const TEFAS_BASE = 'https://www.tefas.gov.tr';
const AUTH_TOKEN = 'Bearer ST-tefaswebwse3irfmSBj4iRAzGPbAlS94Se';
const COOKIE = 'xidaaaaaaaaaaaaaaaa_session_=JCLFBKMFFBHCKOKLCDAPMIBLEKIABJELGGMDKJKNALANECPDPPPIDLFMNFLBBNHCPLADGMOLFINNICDBDIBAGGGKJEKEJLOOOPOJJIGJEGGIIFNAONACJGPGMKINHANI; _ga=GA1.1.504495854.1769027394; cookieconsent_status=dismiss; _gcl_au=1.1.1415474271.1778398100; tefas.clientDeviceId=513a9bb1-c9d5-4552-b3da-d7304cd011b7.bNt1v2Bytv-r3HhFuP4YZguIUqOUhb9i-EE57cIhdDY';

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
};

async function tefasPost(endpoint, body) {
  const res = await fetch(`${TEFAS_BASE}/api/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': AUTH_TOKEN,
      'Cookie': COOKIE,
      'Referer': 'https://www.tefas.gov.tr/tr/fon-verileri',
      'Origin': TEFAS_BASE,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/148.0.0.0 Safari/537.36',
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

app.get('/tefas/funds', async (req, res) => {
  try {
    const data = await tefasPost('funds/fonGnlBlgSiraliGetir', {
      fonTipi: 'YAT',
      fonKodu: null,
      aramaMetni: null,
      fonTurKod: null,
      fonGrubu: null,
      sfonTurKod: null,
      kurucuKod: null,
      fonTurAciklama: null,
      basTarih: today(),
      bitTarih: today(),
      basSira: 1,
      bitSira: 1000,
      dil: 'TR',
    });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/tefas/fund/:code', async (req, res) => {
  try {
    const data = await tefasPost('funds/fonGnlBlgSiraliGetir', {
      fonTipi: 'YAT',
      fonKodu: req.params.code,
      aramaMetni: null,
      fonTurKod: null,
      fonGrubu: null,
      sfonTurKod: null,
      kurucuKod: null,
      fonTurAciklama: null,
      basTarih: today(),
      bitTarih: today(),
      basSira: 1,
      bitSira: 1,
      dil: 'TR',
    });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => console.log('TEFAS proxy running on port 3001'));