# buildConnect-react-web-app

React + TypeScript + MobX frontend za BuildConnect aplikaciju.

## Pokretanje

```powershell
npm install
npm run dev
```

Frontend se dize na:

```text
http://localhost:3000
```

## Backend konekcija

Development API URL:

```text
http://localhost:56602/api
```

To je definirano u:

- `.env.development`

## Build

```powershell
npm run build
```

## Napomena

Za puni rad aplikacije backend mora biti pokrenut.

## Fotografije profila

Na vlastitom profilu odaberite **Uredi fotografije**. Profilna i naslovna
fotografija spremaju se zasebno, nakon pregleda odabrane slike i pritiska na
**Spremi sliku**. Podržani su JPG, PNG i WebP do 5 MiB po fotografiji.

Fotografije su javne. **Ukloni** briše samo odabranu vrstu fotografije.
Odustajanje od uređivanja tekstualnih podataka ne poništava već spremljene
fotografije. Za rad je potrebna backend migracija `AddUserProfileImages`.
