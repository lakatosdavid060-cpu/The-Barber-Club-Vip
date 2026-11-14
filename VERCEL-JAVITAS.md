# Vercel telepítési javítás – The Luxury Barber Club VIP

## Mit javítottunk?

- A Firebase kliens SDK többé nem inicializálódik a Next.js szerveroldali előrenderelésekor.
- A Firebase Auth csak a böngészőben, a `getFirebaseAuth()` függvény első meghívásakor indul el.
- A megadott `ordog-fizetes` Firebase Web App-konfiguráció biztonságos, publikus alapértelmezett értékként bekerült a klienskonfigurációba. A Vercel `NEXT_PUBLIC_FIREBASE_*` változói felülírhatják.
- Az admin oldal érthető hibaüzenetet mutat, ha a kliensoldali Firebase inicializálás nem sikerül.

## Kötelező Vercel-beállítások

A Vercel projektben, Settings → Environment Variables alatt állítsd be:

- `FIREBASE_SERVICE_ACCOUNT_JSON`: a Firebase Console → Project settings → Service accounts menüpontban létrehozott teljes service-account JSON egyetlen környezeti változóként.
- `ADMIN_EMAILS`: a Firebase Authenticationben létrehozott, emailben ellenőrzött admin cím(ek), vesszővel elválasztva.

A service-account JSON titkos adat. Soha ne tedd `NEXT_PUBLIC_` változóba, ne töltsd fel GitHubra, és ne küldd el chatben.

A publikus Firebase változók opcionálisan ugyanígy beállíthatók az `.env.example` alapján. Az appban szereplő fallback értékek már a megadott projekt adatait használják.

## Firebase Console ellenőrzések

1. Authentication → Sign-in method → Email/Password: legyen engedélyezve.
2. Authentication → Users: legyen létrehozva az admin felhasználó, és legyen igazolt az email címe.
3. Authentication → Settings → Authorized domains: szerepeljen a Vercel domain, például `projekt-neve.vercel.app`.
4. Realtime Database: a megadott európai adatbázis legyen aktív.

## Újratelepítés

Minden Vercel környezeti változó mentése után indíts új deploymentet (Deployments → Redeploy). Ha a hiba továbbra is `auth/invalid-api-key`, ellenőrizd a Firebase Console-ban, hogy a Web App `apiKey` mezője karakterről karakterre megegyezik-e a kódban szereplő kulccsal, illetve hogy a Google Cloud API key korlátozásai engedik-e az Identity Toolkit / Firebase Authentication használatát.

## Fontos korlát

A forráskód javítása önmagában nem hoz létre Firebase service accountot, admin felhasználót, és nem állítja be a Vercel titkos környezeti változóit. Ezeket a tulajdonosnak kell beállítania a saját Firebase és Vercel konzoljában. A projekt buildjét ebben a futtatási környezetben nem tudtam ténylegesen lefuttatni, mert az npm csomagtelepítés időtúllépésbe futott; ezért a csomag nem tekinthető teljes körűen build-teszteltnek.
