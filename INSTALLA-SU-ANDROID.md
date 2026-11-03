# Team Guzzetta su Android

La versione Android si installa da Google Chrome, con il logo della casa geometrica e la grafica dorato e bordò. I file sono nella cartella `docs/`; richiedono un sito HTTPS per essere installabili. Il file ZIP e l'installer Windows non vanno eseguiti sul telefono.

## 1. Attiva il sito, una sola volta

Accedi a GitHub con l'account che gestisce questo repository e apri:

**[Impostazioni GitHub Pages](https://github.com/bartilottime67-ctrl/TEAM-GUZZETTA/settings/pages)**

Nella sezione **Build and deployment** imposta:

- **Source:** Deploy from a branch.
- **Branch:** `codex/statistiche-windows`.
- **Folder:** `/docs`.
- Premi **Save** e attendi che compaia il collegamento del sito pubblicato.

L'indirizzo previsto, dopo la pubblicazione, è:

`https://bartilottime67-ctrl.github.io/TEAM-GUZZETTA/`

Usa il collegamento indicato da GitHub Pages se diverso. La preparazione dei file non attiva automaticamente il sito: la pubblicazione e l'accessibilità HTTPS devono essere confermate nelle impostazioni Pages.

## 2. Installa sul telefono

1. Apri il collegamento del sito in **Google Chrome** sul telefono Android, con Internet attivo. Se lo apri dentro un'altra app, scegli prima **Apri in Chrome**.
2. Attendi il caricamento. Tocca **Installa app**, se compare, oppure il menu **⋮** in alto a destra.
3. Scegli **Aggiungi a schermata Home** e poi **Installa**. La dicitura può variare con la versione di Chrome.
4. Apri **Team Guzzetta** dalla nuova icona con la casa.

Dopo che il primo caricamento e la preparazione offline sono terminati, l'app si riapre anche senza connessione. Per scaricare una nuova versione serve Internet; quando compare l'avviso, salva eventuali moduli aperti e premi **Aggiorna**.

## 3. Porta i dati dal PC

1. Nel programma sul PC premi **Esporta backup**.
2. Trasferisci il file JSON sul telefono.
3. Nell'app sul telefono vai in **Clienti → Ripristina backup** e seleziona quel file. Leggi la conferma: il ripristino sostituisce l'archivio corrente del telefono.

**PC e telefono conservano archivi separati: non si sincronizzano automaticamente.** Esporta periodicamente un backup; cancellare i dati del sito/browser può eliminare l'archivio locale. I dati dei clienti e i movimenti restano nel dispositivo: non sono caricati su GitHub Pages.

## Verifiche della versione

Verificati con Chromium e schermo mobile simulato: manifest installabile, caricamento sotto `/TEAM-GUZZETTA/`, risorse offline, riapertura senza rete, salvataggio di clienti e incassi, quote RE/MAX e backup offline. L'installazione effettiva su un telefono Android e la disponibilità pubblica del sito richiedono verifica dopo l'attivazione di Pages.
