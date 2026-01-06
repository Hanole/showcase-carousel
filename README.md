# Showcase Carousel

Et lite hobbyprosjekt der du kan lage en spill-lobby basert på RAWG-collections, invitere vennenr og stemme frem hvilket spill dere skal spille. 

## Hva gjør appen?
- Lobby oppretter limer inn **slug** for en RAWG-collection + sitt eget navn.
- Appen henter spillene i den collectionen og viser dem i en karusell/oversikt.
- Det genereres en **lenke til lobbyen** som kan deles med venner.
- Venner som åpner lenken kan joine lobbyen og **stemme på spillene**.
- Lobby-eier og venner ser stemmmene og kan bli enige om hvilket spill dere skal spille.

> En *slug* er navnet til en collection tilpasset bruk i URL, altså vanligvis med små bokstaver og bindestreker.

## Teknologi
- React
- Vite
- Supabase via @supabase/supabase-js som backend-klient
- ESLint for kvalitetssikring

## Forutsetninnger
- Node.js og npm for å kjøre lokalt.

##  Installering
  ´git clone https://github.com/Hanole/showcase-carousel.git
  cd showcase-carousel
  npm install
  npm run dev´
