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
- Le traduzioni dell'interfaccia (it, en, ro, ar, uk, fil, bn) sono state scritte per la demo e vanno
  riviste da madrelingua.

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
