# Primo Passo · landing page

Pagina di presentazione di **Primo Passo**, l'assistente Pino che guida le persone straniere a Roma tra
residenza, tessera sanitaria e permesso di soggiorno, un passo alla volta e nella loro lingua.

- **Landing page:** https://mancormemec-stack.github.io/stock/
- **Il prodotto (con il vero Pino, a voce e in chat):** https://mancormemec-stack.github.io/primo-passo/
- **Codice del prodotto:** https://github.com/mancormemec-stack/primo-passo

## Cosa c'è in questo repository

Una pagina statica (HTML, CSS e JavaScript senza compilazione), in italiano e inglese. Pino è lo stesso disegno del
prodotto (`pino.js` e `pino.css`, copiati da `primo-passo`). La pagina non chiama servizi esterni, salvo i caratteri
di Google Fonts, e non contiene chiavi o credenziali. Il testo dichiara ciò che oggi è vero: le traduzioni
dell'interfaccia in 87 lingue sono automatiche e vanno riviste, e non tutti i dati sono già controllati da una persona.

## La demo dell'interfaccia (Lovable)

Fino al 14 novembre 2026 qui c'era la demo dell'interfaccia in React, con dati di esempio. Non è stata cancellata:

- ramo `demo-lovable`
- tag `demo-lovable-v1` (commit `73905f1`)

Per rivederla: `git checkout demo-lovable`, poi `npm ci` e `npm run dev`. Non è collegata al vero Pino.
