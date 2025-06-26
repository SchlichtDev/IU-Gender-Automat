# IU-Kleiderspenden Registrierung

Dies ist eine einfache Node.js Anwendung zur Registrierung von Kleiderspenden.
Die "IU-Kleiderspenden Registrierung" ist eine Webanwendung zur einfachen und benutzerfreundlichen Erfassung von Kleiderspenden. Diese Anwendung wurde im Rahmen des Moduls **IPWA01-01** (Programmierung von Webanwendungsoberflächen) an der IU Internationale Hochschule als praktische Fallstudie erstellt.

## Warum Node.js?
Node.js bietet eine schlanke und performante serverseitige JavaScript-Laufzeitumgebung. Dadurch lassen sich

- HTTP-Server schnell umsetzen und bedienen,
- Formulardaten einfach verarbeiten und in JSON-Dateien speichern sowie
- Frontend-Technologien wie HTML, CSS und JavaScript problemlos integrieren.

## Warum mehrere HTML-Dateien?
Die Trennung in einzelne HTML-Dateien erhöht Übersichtlichkeit und Wartbarkeit. Jede Seite erfüllt einen eigenen Zweck:

- **index.html** – Formular zur Registrierung einer Spende
- **success.html** – persönliche Bestätigung der registrierten Spende
- **Impressum.html** und **datenschutz.html** – rechtliche Pflichtinformationen

Diese klare Struktur macht spätere Erweiterungen und Anpassungen leichter.

## Verwendete Entwicklungsumgebung und Tools

Visual Studio Code wurde als Codeumgebung eingesetzt, da es eine intuitive Bedienung, umfassende Erweiterungen und eine integrierte Terminalfunktion bietet.

Nodemon wurde während der Entwicklung verwendet, um Änderungen im Code live zu beobachten und den Entwicklungsserver automatisch neu zu starten. Dies erleichterte und beschleunigte den Entwicklungsprozess erheblich.


## Projektstruktur
```text
IU-Kleiderspenden-Registrierung
├── public
│   ├── index.html
│   ├── success.html
│   ├── impressum.html
│   ├── datenschutz.html
│   ├── style.css
│   └── images
│       └── logo.jpg
├── docs
│   └── donations.json
└── src
    └── server.js
```
* `public` enthält Frontend-Dateien wie HTML, CSS und Bilder.
* `docs` enthält gespeicherte Spenden im JSON-Format.
* `src` enthält die serverseitige JavaScript-Datei.

## Starten des Servers
Stelle sicher, dass Node.js installiert ist. Danach kann der Server mit folgendem Befehl gestartet werden:
```bash
node src/server.js
```
oder für Live-Reload während der Entwicklung:
```bash
nodemon src/server.js
```
Der Server läuft standardmäßig auf Port **3000** und die Registrierungsseite ist anschließend unter <http://localhost:3000> erreichbar.

### Hosting und Bedienung
Nachfolgend findest du eine kurze Anleitung, wie du die Anwendung ohne Entwickler-Tools wie *nodemon* auf deinem eigenen Rechner betreibst.

1. **Node.js installieren**
   - Lade das passende Installationspaket von [nodejs.org](https://nodejs.org/) herunter und folge den Anweisungen.
2. **Projekt herunterladen**
   - Klone dieses Repository oder lade den Quellcode als ZIP-Datei herunter und entpacke ihn.
3. **Server starten**
   - Navigiere im Terminal (über cd "Pfad aus Explorer kopieren. Es muss ich um IU-Kleiderspenden-Registrierung\src handeln." in das Projektverzeichnis und führe folgenden Befehl aus:
   ```bash
   node src/server.js
   ```
   - Der Server hört standardmäßig auf Port **3000**. Falls dieser Port bereits belegt ist, kannst du einen anderen Port mit der Umgebungsvariable `PORT` angeben:
   ```bash
   PORT=8080 node src/server.js
   ```
4. **Webseite aufrufen**
   - Öffne deinen Browser und besuche <http://localhost:3000> (oder den gewählten Port).
   - Trage die Daten im Formular ein und sende sie ab. Nach der Registrierung wirst du automatisch auf die Bestätigungsseite weitergeleitet.
5. **Server stoppen**
   - Mit `Strg + C` im Terminal beendest du den Server.

Die erfassten Spenden werden in der Datei `docs/donations.json` gespeichert und können über den Endpunkt `/donations` im Browser eingesehen werden.

## Funktionsweise
### Formularregistrierung
Nutzer geben persönliche Daten, eine Beschreibung der Kleidung, die Zielregion und die Übergabeart an. Bei Abholung erfolgt zusätzlich eine PLZ-Prüfung (zulässig ist nur der PLZ-Bereich "39"). Nach erfolgreicher Registrierung erfolgt eine automatische Weiterleitung auf die persönliche Bestätigungsseite.

### Speicherung der Spenden
Alle Spenden werden in `docs/donations.json` gespeichert und können darüber hinaus über den Endpunkt `/donations` abgerufen werden.

## Erstellungsschritte (Dokumentation des Prozesses)
1. **Konzeption** – Anforderungen festgelegt und Entscheidung für Node.js getroffen
2. **Entwicklung Frontend** – HTML-Struktur, CSS und dynamisches Verhalten mit JavaScript
3. **Entwicklung Backend** – einfacher HTTP-Server, Endpunkte für Formulardaten und Speicherung
4. **Validierung und Fehlerbehandlung** – u.a. PLZ-Validierung und Fehler beim Dateizugriff
5. **Erweiterte Benutzerfreundlichkeit** – persönliche Bestätigungsseite mittels URL-Parametern
6. **Finalisierung und Dokumentation** – Nutzung von Nodemon für eine effizientere Entwicklung, Code-Kommentierung und ausführliche Dokumentation. Erstellung einer vollständigen README für Projektabgabe und Dokumentationszwecke.

## Rechtliche Hinweise
Diese Webseite ist ein rein fiktives Projekt für Studienzwecke. Es werden keine echten Spenden registriert oder verarbeitet.

## Kontakt
Pascal Schlicht  
Studiengang Informatik (IU Internationale Hochschule)  
E-Mail: pascal.schlicht@iu-study.org
GitHub Repository: IU-Kleiderspenden-Registrierung
