# Snezzi Citation Planner

A client-side planning tool for Snezzi-style AI search delivery. Paste prompt opportunities and the tool ranks them by citation potential, recommends the right page type, and produces a practical execution queue. It runs entirely in the browser and stores no client data.

## Input format

One opportunity per line:

```text
prompt | brand | competitor | comparison|best-of|use-case|faq|guide | low|medium|high
```

## Run

Open `index.html` in a browser. No server, dependency, or API key is required.

## Test

```bash
node test.js
```
