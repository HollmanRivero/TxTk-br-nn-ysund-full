const express = require('express');
const path = require('path');
const app = express();
const PORT = 3002;

app.use(express.static(__dirname));
app.use(express.json());

// Proxy for enhetsregisteret API (avoids CORS issues)
app.get('/api/enheter', async (req, res) => {
  try {
    const params = new URLSearchParams(req.query);
    const url = `https://data.brreg.no/enhetsregisteret/api/enheter?${params.toString()}`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Feil ved søk i Enhetsregisteret', details: err.message });
  }
});

// Lookup single entity by org number
app.get('/api/enheter/:orgnr', async (req, res) => {
  try {
    const url = `https://data.brreg.no/enhetsregisteret/api/enheter/${req.params.orgnr}`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Enhet ikke funnet' });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Feil ved oppslag', details: err.message });
  }
});

// Get roles for an entity
app.get('/api/enheter/:orgnr/roller', async (req, res) => {
  try {
    const url = `https://data.brreg.no/enhetsregisteret/api/enheter/${req.params.orgnr}/roller`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Roller ikke funnet' });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Feil ved henting av roller', details: err.message });
  }
});

// Search sub-entities
app.get('/api/underenheter', async (req, res) => {
  try {
    const params = new URLSearchParams(req.query);
    const url = `https://data.brreg.no/enhetsregisteret/api/underenheter?${params.toString()}`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Feil ved søk i underenheter', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n  ╔═══════════════════════════════════════════╗`);
  console.log(`  ║  TXTk – Brønnøysundregistrene Søk        ║`);
  console.log(`  ║  Kjører på http://localhost:${PORT}          ║`);
  console.log(`  ╚═══════════════════════════════════════════╝\n`);
});
