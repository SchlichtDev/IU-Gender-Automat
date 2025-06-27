# Gesamtprozess

Diese Dokumentation beschreibt die bisher umgesetzten Schritte der Webseite IU-Kleiderspenden Registrierung.

## Projektstart

Das Repository wurde mit einer einfachen Ordnerstruktur angelegt und enthielt zu Beginn nur die Datei `README.md` und die Lizenzinformationen.
Im Verlauf wurden die Verzeichnisse `public`, `src` und `docs` erstellt, um statische Dateien, den Server-Code und die Projektdokumentation aufzunehmen.

## Erste Version der Anwendung

In den nachfolgenden Commits wurde ein kleiner Node.js-Server implementiert (`src/server.js`). Dieser stellt die Startseite `public/index.html` bereit und nimmt Formularübermittlungen über den Endpunkt `/register` entgegen. Die Daten der Spenden werden in der Datei `docs/donations.json` gespeichert. Nach erfolgreicher Registrierung erfolgt eine Weiterleitung auf `public/success.html`.

Zusätzlich wurde über den Pfad `/donations` eine Schnittstelle bereitgestellt, die die gespeicherten Spenden als JSON zur Verfügung stellt.

## Layout-Erweiterungen

Die aktuellste Änderung fügte der Start- und Erfolgseite einen Header mit globaler Navigation sowie einen Footer mit rechtlichen Hinweisen hinzu. Außerdem wurde das Stylesheet um grundlegende Layout-Definitionen erweitert.

## Nutzung

1. Server starten:
   ```
   node src/server.js
   ```
2. Formular unter [http://localhost:3000](http://localhost:3000) aufrufen und Spende registrieren.
3. Alle bisher registrierten Spenden können über [http://localhost:3000/donations](http://localhost:3000/donations) eingesehen werden.
