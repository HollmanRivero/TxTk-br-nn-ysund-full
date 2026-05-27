# TXTk 2.0 — Brønnøysundregistrene Søk

> Moderne, lettvektig websøk i det norske Enhetsregisteret. Slå opp firma, organisasjonsnummer, roller og nøkkelopplysninger direkte fra Brønnøysundregistrenes åpne API.

![Status](https://img.shields.io/badge/status-aktiv-22c55e)
![Lisens](https://img.shields.io/badge/lisens-MIT-3b82f6)
![Stack](https://img.shields.io/badge/stack-Node.js%20%2B%20Express-7c3aed)
![Port](https://img.shields.io/badge/port-3002-f59e0b)

---

## Innhold

- [Oversikt](#oversikt)
- [Funksjoner](#funksjoner)
- [Arkitektur](#arkitektur)
- [Filstruktur](#filstruktur)
- [Installasjon](#installasjon)
- [Bruk](#bruk)
- [API-endepunkter](#api-endepunkter)
- [Tekniske detaljer](#tekniske-detaljer)
- [Skjermbilder / UI](#skjermbilder--ui)
- [Videreutvikling](#videreutvikling)
- [Lisens](#lisens)

---

## Oversikt

**TXTk 2.0** er en webapplikasjon som lar deg søke i Brønnøysundregistrenes Enhetsregister fra en ren, hurtig brukergrenseflate. Den fungerer som en proxy mellom nettleseren og Brreg sitt åpne API (`data.brreg.no`), og presenterer resultatene i et moderne mørkt design med detaljvisning, filtrering og pagination.

App-en kjører lokalt på **`http://localhost:3002`** via en Node.js + Express-server, og krever ingen API-nøkkel — Brreg sitt API er fritt tilgjengelig.

## Funksjoner

| Funksjon | Beskrivelse |
|----------|-------------|
| **Søk på firmanavn** | Fritekstsøk med 20 treff per side, pagination |
| **Søk på org.nr** | Direkte oppslag på 9-sifret organisasjonsnummer |
| **Filtrering** | Filter på organisasjonsform (AS, ENK, NUF, …), kommune, konkursstatus |
| **Detaljvisning** | Klikk en virksomhet for å se adresser, næringskode, MVA-registrering, hjemmeside m.m. |
| **Roller** | Henter og viser styre, daglig leder, signatur og andre roller |
| **Statusbadge** | Fargekodet status: Aktiv (grønn), Slettet (oransje), Konkurs (rød) |
| **Snarveier** | Direktelenker til rettsstiftelser, kunngjøringer, personoppslag og JSON-API |
| **Tastatursnarveier** | Enter for søk, Escape for å lukke detaljpanel |
| **Responsivt** | Tilpasser seg mobile skjermer |

## Arkitektur

```
┌──────────────────┐   HTTP    ┌──────────────────┐   HTTPS   ┌────────────────────┐
│  Nettleser       │  ───────► │  Express-server  │  ───────► │  data.brreg.no     │
│  (index.html)    │  ◄─────── │  (server.js)     │  ◄─────── │  (Enhetsregisteret)│
│  Vanilla JS      │   JSON    │  localhost:3002  │   JSON    │  Offentlig API     │
└──────────────────┘           └──────────────────┘           └────────────────────┘
```

Serveren fungerer som en tynn proxy. Klienten i `index.html` snakker primært direkte mot `data.brreg.no` via `fetch()`, men `server.js` eksponerer også `/api/*`-endepunkter for tilfeller hvor man trenger å unngå CORS eller legge på autorisasjon senere.

## Filstruktur

```
TXTk2.0/
├── README.md              ← dette dokumentet
├── LICENSE                ← MIT-lisens
├── package-lock.json
└── files/
    ├── index.html         ← Brukergrenseflate (HTML + CSS + vanilla JS)
    ├── server.js          ← Express-server / API-proxy (port 3002)
    ├── package.json       ← Avhengigheter (express)
    └── start.bat          ← Windows-startskript
```

## Installasjon

### Forutsetninger
- **Node.js 18+** (for innebygd `fetch()`)
- npm

### Steg

```bash
git clone https://github.com/<bruker>/TXTk2.0.git
cd TXTk2.0/files
npm install
```

Det installerer `express` som eneste avhengighet.

## Bruk

### Alternativ A — via batch-skript (Windows)

Dobbeltklikk `files/start.bat`. Skriptet bytter til sin egen mappe, installerer avhengigheter og starter serveren.

### Alternativ B — manuelt

```bash
cd files
npm start
```

Åpne deretter **`http://localhost:3002`** i nettleseren.

### Endre port

Standardport er `3002`. Endre konstanten `PORT` i [files/server.js](files/server.js) for å bytte.

### Søkeeksempler

| Inntasting | Resultat |
|------------|----------|
| `Equinor` | Liste over alle firma med "Equinor" i navnet |
| `923609016` | Direkte oppslag på Equinor ASA |
| `Statkraft` + filter `AS` | Aksjeselskap med "Statkraft" i navnet |

## API-endepunkter

Proxy-endepunkter eksponert av `server.js`:

| Metode | Sti | Beskrivelse |
|--------|-----|-------------|
| `GET` | `/api/enheter?navn=…&size=…&page=…` | Søk i hovedenheter |
| `GET` | `/api/enheter/:orgnr` | Oppslag av én enhet |
| `GET` | `/api/enheter/:orgnr/roller` | Roller for en enhet |
| `GET` | `/api/underenheter?…` | Søk i underenheter (bedriftsregistre) |

Alle endepunkter returnerer JSON og videresender query-parametere uendret til `data.brreg.no`.

## Tekniske detaljer

### Frontend
- **Ingen byggsteg, ingen rammeverk** — ren `<script>`-tag i `index.html`
- **CSS-variabler** for konsekvent fargepalett (mørkt tema, blå aksent)
- **Google Fonts:** DM Sans (UI) + JetBrains Mono (org.nr, kode)
- **XSS-beskyttelse:** All brukergenerert tekst kjøres gjennom `esc()` før innsetting i DOM
- **Asynkron søk** med spinner, statustekst og pagination

### Backend
- **Express 4** — én fil, ~80 linjer
- **Node.js innebygd `fetch()`** (krever Node 18+, ingen `node-fetch`-avhengighet)
- **Statisk serving** fra `files/`-katalogen (index.html serveres på rot-URL)
- **Port:** 3002
- **Stateless** — ingen database, ingen sesjoner, ingen caching

### Sikkerhet
- **Ingen API-nøkler** lagret i koden — Brreg sitt API er åpent
- **Ingen brukerdata** lagres lokalt eller på server
- **Ingen tredjepartssporing**
- HTML-escaping på all data fra API før rendering

### Datakilde
- **Brønnøysundregistrene Åpne Data**: https://data.brreg.no/enhetsregisteret/
- Lisens: NLOD (Norsk lisens for offentlige data)
- Oppdateringsfrekvens: nær-sanntid (Brreg oppdaterer kontinuerlig)

## Skjermbilder / UI

UI-en består av tre lag:

1. **Søkeområde øverst** — søkefelt + filtre + snarveier til andre Brreg-tjenester
2. **Resultatliste** — kort med firmanavn, org.nr, status, adresse, næring og ansatte
3. **Detaljpanel** — modal overlay med full informasjon og roller når man klikker et resultat

Designet bruker en mørk palett:
- Bakgrunn: `#0a0e17`
- Overflater: `#111827` / `#1a2234`
- Aksent: blå `#3b82f6`
- Status: grønn `#10b981` / oransje `#f59e0b` / rød `#ef4444`

## Videreutvikling

Forslag til videre arbeid:

- [ ] Lagring av favoritter i `localStorage`
- [ ] Eksport av søkeresultater til CSV / Excel
- [ ] Søk i underenheter via UI (proxy-endepunktet finnes allerede)
- [ ] Kart-integrasjon for forretningsadresser
- [ ] Historikk for sist besøkte firma
- [ ] Mørkt/lyst tema-bytter
- [ ] Pakketering som Electron-app (se søsterprosjektet `TXTk1`)

## Lisens

Dette prosjektet er lisensiert under **MIT-lisensen** — se [LICENSE](./LICENSE) for full tekst.

Kort fortalt: Du har lov til å bruke, kopiere, endre og distribuere koden fritt, men **copyright-notisen og lisensteksten må følge med** i alle kopier eller vesentlige deler. Programvaren leveres "som den er" uten noen form for garanti.

### Tredjepartskomponenter
- **Express** — MIT
- **DM Sans, JetBrains Mono** — Open Font License (Google Fonts)
- **Brønnøysund-data** — NLOD (Norsk lisens for offentlige data)

---

© 2026 Salazar Rivero Smart Things

**Kontakt:**
- E-post: [riveroosx7@gmail.com](mailto:riveroosx7@gmail.com)
- WhatsApp: [+47 48 904 267](https://wa.me/4748904267)
