# The Luxury Barber Club – VIP játék

A projekt Next.js alkalmazásként Vercelen fut, a vendég- és sorsolási adatokat a Firebase Realtime Database tárolja.

## A játék menete

1. A vendég befejezi a hajvágást, majd jelzi a fodrászának, hogy szeretne részt venni a VIP-nyereményjátékban.
2. A fodrász az adminfelületen egyszer használható VIP-belépőkódot hoz létre és átadja a vendégnek.
3. A vendég a főoldalon megadja a nevét és a VIP-kódját, majd elfogadja, hogy a neve megjelenik a heti szerencsekeréken.
4. A szerver ellenőrzi és egyszer használatosként megjelöli a kódot, majd hozzáadja a nevezést az aktuális heti játékhoz.
5. Az élő szerencsekerék körülbelül 3 másodpercenként frissül. Az új résztvevők neve automatikusan megjelenik a keréken és a listában.
6. A heti sorsolást az adminisztrátor kézzel indítja el. A nyertest a szerver választja ki, nem a böngésző.

## Firebase beállítása

A böngészőben használt Firebase webes konfiguráció a `lib/firebase-client.ts` fájlban szerepel a megadott `ordog-fizetes` projekt adataival. A Firebase web API-kulcs kliensoldali azonosító, nem Service Account titok. Ha az `auth/invalid-api-key` hiba továbbra is jelentkezik, ellenőrizd a Firebase Console-ban, hogy a kulcs a `ordog-fizetes` projekt Web App konfigurációjából származik-e, nincs-e API-korlátozással letiltva, és az Identity Toolkit API engedélyezett-e.

A Firebase Console-ban:
- Authentication → Sign-in method → Email/Password: engedélyezd.
- Authentication → Users: hozd létre a `luxurybarber@gmail.com` felhasználót, állíts be jelszót, és igazold az email-címet.
- Project settings → Service accounts → Firebase Admin SDK: hozz létre privát kulcsot.
- A letöltött Service Account JSON teljes tartalmát titkos Vercel környezeti változóként add meg `FIREBASE_SERVICE_ACCOUNT_JSON` néven.

## Vercel környezeti változók

A Vercel projektben: Settings → Environment Variables.

### 1. FIREBASE_SERVICE_ACCOUNT_JSON
- Név: `FIREBASE_SERVICE_ACCOUNT_JSON`
- Érték: a Firebase Console-ból letöltött Service Account JSON teljes tartalma.
- Környezet: Production (és szükség esetén Preview/Development).
- Jelöld titkos értékként, ha a felület felkínálja.
- Soha ne tedd GitHubra, `NEXT_PUBLIC_` változóba vagy a böngészőbe.

### 2. ADMIN_EMAILS
- Név: `ADMIN_EMAILS`
- Érték: `luxurybarber@gmail.com`
- Több admin esetén vesszővel elválasztva.
- Környezet: Production (és szükség esetén Preview/Development).

A `FIREBASE_SERVICE_ACCOUNT_JSON` szerveroldali hitelesítő adat; az `ADMIN_EMAILS` csak az engedélyezett, igazolt Firebase Auth email-címeket sorolja fel. Az admin felhasználót külön létre kell hozni a Firebase Authenticationben.

## Realtime Database szabályok

A projekt mellé `firebase-rules.json` fájl került. A benne lévő szabályok az egész adatbázis közvetlen böngészős olvasását és írását tiltják. A szerveroldali Firebase Admin SDK ezt megkerüli, ezért a Next.js API-k továbbra is működnek.

A szabályok közzététele előtt figyelj: ha az `ordog-fizetes` adatbázist másik alkalmazás is használja, a teljes adatbázisra vonatkozó tiltás annak közvetlen böngészős hozzáférését is leállíthatja. Ilyenkor előbb fel kell mérni a meglévő szabályokat és az alkalmazás adatútvonalait. Ne cseréld le a meglévő szabályokat mentés és ellenőrzés nélkül.

Firebase Console → Realtime Database → Rules: a fájl tartalmát illeszd be, majd Publish. A szerver API az adatokat a `luxuryVip/` ág alatt kezeli.

## Telepítés

1. Töltsd fel a projektet GitHubra.
2. Vercel → Add New → Project → Import Git Repository.
3. Framework Preset: Next.js; Build Command: `npm run build`.
4. Add hozzá a fenti két környezeti változót.
5. Deploy, majd ellenőrizd a főoldalt és az `/admin` oldalt.

## Fontos indulás előtti teendők

- A nyilvános szerencsekerék a résztvevők nevét minden látogatónak megmutatja. A nevező ezt külön jelölőnégyzettel tudomásul veszi.
- A végleges játékszabályzatnak, adatkezelési tájékoztatónak, adatmegőrzési időnek, jogosultsági feltételeknek, nyereményeknek és kapcsolattartási adatoknak a szalon valós adatait kell tartalmazniuk. A jelenlegi felület nem helyettesíti a jogilag ellenőrzött dokumentumokat.
- A nyereményjáték és az esetleges vásárlási feltételek jogi megfelelőségét indulás előtt ellenőriztesd a célország szabályai szerint.
- A publikus nevezési végpont éles használata előtt érdemes sebességkorlátozást és botvédelmet beállítani.
- A projekt heti azonosítója jelenleg UTC szerinti ISO-hét. A heti zárási időt a szalon időzónájához kell igazítani, ha ettől eltérő szabályt szeretnétek.

## Adatstruktúra

- `luxuryVip/codes/{kód_hash}` – egyszer használható kódok.
- `luxuryVip/guestIndex/{nevezés_azonosító}` – vendégindex.
- `luxuryVip/weeks/{év-hét}/entries/{nevezés_azonosító}` – heti nevezések.
- `luxuryVip/weeks/{év-hét}/draw` – sorsolás állapota és eredménye.
- `luxuryVip/winners/{év-hét}` – nyertes eredményének mentése.
