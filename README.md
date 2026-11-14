# Primo Passo · demo dell'interfaccia

Demo statica dell'interfaccia di **Primo Passo**, l'assistente che orienta le persone straniere a Roma
tra Anagrafe, ASL e Questura. Mostra come potrebbe essere l'app sul telefono: onboarding con scelta della
lingua, conversazione, percorso a fermate e foglio da portare allo sportello.

**Sito:** https://mancormemec-stack.github.io/stock/

## Cosa è e cosa non è

- È una **demo grafica con dati di esempio**: ogni schermata dice «Dati di esempio». Le risposte della
  conversazione sono finte e non c'è nessun assistente collegato.
- Non è l'applicazione funzionante. Quella (con Pino, la voce e gli strumenti) è nel repository
  `primo-passo`.
- Non salva nulla, non ha account, non chiama nessuna API e non contiene chiavi o credenziali.
  Lo stato resta nella memoria del browser e sparisce ricaricando la pagina.
- Le traduzioni dell'interfaccia in it, en, ro, ar, uk, fil e bn sono state scritte per la demo e vanno
  riviste da madrelingua.
- Nell'onboarding la lingua si sceglie con la ricerca sotto Pino (nome nella lingua, in inglese o codice) e ogni
  lingua ha la sua bandiera (libreria `flag-icons`, MIT). La bandiera è solo un'indicazione: le lingue non sono
  paesi (l'arabo usa la bandiera della Lega Araba, catalano e galiziano le bandiere regionali).
- Nella presentazione Pino **parla davvero** con la sintesi vocale del browser (nulla viene inviato a servizi
  esterni). Se il dispositivo non ha una voce per la lingua scelta, Pino non parla e il testo resta scritto;
  le 82 lingue automatiche hanno la presentazione in inglese. Il pulsante con l'altoparlante la riascolta.
- La scheda **Documenti** è un **mockup concettuale** con documenti inventati: archivio, dettaglio di un documento
  e collegamento tra documenti e passi del percorso. Non carica file, non salva nulla, non riconosce documenti e non
  ha un backend: ogni schermata lo dichiara («Mockup concettuale · Dati di esempio»). Non è una funzione del sito vero.
- Altre **82 lingue** (89 in tutto, come il sito vero) sono selezionabili, ma sono traduzioni **automatiche e
  parziali**: hanno solo i 14 testi che coincidono con quelli del sito (domanda sulla lingua, «Avanti», «Fine»,
  microfono, conversazione, titolo del foglio…); il resto, compresi i contenuti di esempio, resta in inglese.
  Non sono riviste da madrelingua e la pagina lo dichiara nella lingua scelta. Non vanno presentate come
  lingue «provate». Dati: `src/i18n/auto-langs.ts`, generato da `web/i18n-auto.js` del repository principale.

## Come è pubblicata

Il progetto nasce in Lovable (TanStack Start + React + Tailwind). Questa è una **copia separata** pensata per
GitHub Pages: TanStack Start è configurato in modalità SPA (`vite.config.ts`), con base `/stock/`, e la
pagina viene generata in anticipo in `index.html`. Il deploy è automatico a ogni push su `main`
(`.github/workflows/pages.yml`), dopo un controllo che nella build non ci siano chiavi.

Non disponibile nella versione statica: funzioni lato server e percorsi API (la demo non ne usa).
L'interfaccia carica i caratteri da Google Fonts.

```sh
npm ci
npm run dev      # sviluppo
npm run build    # sito statico in .output/public
```
