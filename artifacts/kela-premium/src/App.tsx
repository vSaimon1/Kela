import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Instagram, Menu, X } from 'lucide-react';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import './index.css';

type Lang = 'en' | 'es' | 'el';
type Copy = {
  language: string; nav: readonly string[]; pageTitles: { home: string; menu: string; story: string };
  common: { brand: string; homeAria: string; primary: string; open: string; close: string; language: string; instagram: string; photo: string; photos: string };
  home: { eyebrow: string; title: string; intro: string; primary: string; secondary: string; note: string; imageAlt: string; illustrationLabel: string; sealLine1: string; sealLine2: string; sealLine3: string; ticker: string; manifesto: string; manifestoText: string; featureLabel: string; featureTitle: string; featureText: string; featureCta: string; galleryLabel: string; ctaTitle: string; ctaText: string };
  menu: { eyebrow: string; titleFirst: string; titleSecond: string; intro: string; frozen: string; cards: readonly { name: string; description: string }[]; toppings: string; toppingsDescription: string; combinations: string; toppingGroups: readonly { name: string; price: string; items: readonly string[] }[]; drinks: string; icedLattes: string; icedDescription: string; syrups: string; comeBy: string; address1: string; address2: string; back: string };
  story: { eyebrow: string; titleFirst: string; titleSecond: string; intro: string; who: string; ownersTitle: string; ownersP1: string; ownersP2: string; inspiration: string; quote: string; quoteDescription: string; store: string; storeTitleFirst: string; storeTitleSecond: string; storeDescription: string; ingredients: string; ingredientsTitleFirst: string; ingredientsTitleSecond: string; ingredientsDescription: string; imageAlt: string; storeAlt: string };
  footer: string;
};

const queryClient = new QueryClient();

const copy: Record<Lang, Copy> = {
  en: {
    language: 'English', nav: ['Home', 'Our menu', 'Our story'], pageTitles: { home: 'Home', menu: 'Menu', story: 'Our Story' },
    common: { brand: 'GREEK FROZEN YOGURT', homeAria: 'KELA home', primary: 'Primary navigation', open: 'Open navigation menu', close: 'Close navigation menu', language: 'Change language', instagram: 'KELA on Instagram', photo: 'Photo by Fareen Karim', photos: 'Photos by Fareen Karim' },
    home: { eyebrow: 'Greek frozen yogurt · Toronto', title: 'A little taste of the Aegean.', intro: 'Kela Greek Frozen Yogurt keeps Toronto stocked with fresh frozen treats all summer long. Find us at 81 St. Clair Avenue East and build a cup around our Greek-style yogurt.', primary: 'Explore the menu', secondary: 'Our story', note: 'Greek-style / Made fresh in Toronto', imageAlt: 'KELA Greek frozen yogurt with strawberry and cookie toppings', illustrationLabel: 'swirl / spoon / sun', sealLine1: 'Greek style', sealLine2: 'made fresh', sealLine3: 'in Toronto', ticker: 'Greek-style yogurt · Toronto · made fresh · choose your swirl · ', manifesto: 'Make room for the good stuff.', manifestoText: 'A spoonful of something bright, a topping you did not plan on, a slow afternoon that turns into a ritual. KELA is a little taste of the Aegean, made for Toronto.', featureLabel: '01 / The KELA way', featureTitle: 'Choose your swirl. Make it yours.', featureText: 'Start with Greek-style frozen yogurt, then take the scenic route through fruit, crunch, chocolate and house-made favourites.', featureCta: 'See what is on', galleryLabel: 'Freshly made / generously finished', ctaTitle: 'Meet us at St. Clair.', ctaText: 'A small shop with a generous point of view.' },
    menu: { eyebrow: 'The KELA menu', titleFirst: 'Choose your', titleSecond: 'happy place.', intro: 'Greek-style frozen yogurt, generous toppings and coffee worth lingering over.', frozen: 'Frozen yogurt', cards: [{ name: 'Mini', description: 'A tiny white KELA cup with one topping. Add more toppings for a little extra.' }, { name: 'Classic', description: 'Almost twice the size, with twice as many toppings.' }, { name: 'Cone', description: 'A long, crisp sugar cone made to complement the yogurt.' }], toppings: 'Toppings', toppingsDescription: 'Fresh fruit, chopped nuts, chocolate, strawberries, pistachios, cherries, honey and pistachio cream.', combinations: 'Try chocolate + strawberries + pistachios, chopped pistachios + whole cherries + honey, or pistachio cream piled into a cone.', toppingGroups: [{ name: 'Classic toppings', price: '$0.75', items: ['Almonds', 'Unsweetened coconut', 'Strawberry', 'Blueberry', 'Granola', 'Dates', 'Brownie bites', 'Pistachios', 'Oreos', 'Biscoff', 'Organic strawberry jam', 'Walnuts', 'Olive oil and salt', 'Honey', 'Melted chocolate', 'Almond butter', 'Biscoff spread'] }, { name: 'Premium toppings', price: '$0.99', items: ['Pistachios', 'Pistachio drizzle', 'Amarena cherries'] }, { name: 'KELA toppings', price: '$1.50', items: ['KELA Choccy crunch', 'KELA pistachio dream', 'KELA Colombian dulce', 'KELA topping'] }], drinks: 'Drinks', icedLattes: 'Iced lattes', icedDescription: 'Colombian coffee with whole, 2%, 0%, oat or almond milk. Almond milk is +$0.50.', syrups: 'Finish with caramel, vanilla or sugar-free syrup on request.', comeBy: 'Come by', address1: '81 St. Clair Avenue East, Unit 112', address2: 'Toronto, Ontario', back: 'Back home' },
    story: { eyebrow: 'Our story', titleFirst: 'Rooted in Greece.', titleSecond: 'Made in Toronto.', intro: 'Simple ingredients. Endless little joys. KELA is a place to slow down, choose your swirl and make it yours.', who: 'Who we are', ownersTitle: 'Kerem & Laura', ownersP1: 'Owners Kerem Karaca and Laura Delaossa combined their names to create Kela. After travelling to Greece together, they were amazed by the quality of Greek desserts and surprised by their lack of presence in North America.', ownersP2: 'They made it their mission to bring Greek-style frozen yogurt to Toronto, opening KELA in June 2026.', inspiration: 'Our Greek inspiration', quote: '“Not too sweet, not too tart, and perfect with almost any topping.”', quoteDescription: "Greek yogurt's unique flavour makes it an ideal summer snack. While other restaurants have begun serving Greek yogurt, KELA is the only shop in the city that exclusively carries it.", store: 'Our store', storeTitleFirst: 'Every inch', storeTitleSecond: 'has a story.', storeDescription: 'Our Greek influences are visible from the moment you enter: cobblestone tiles cover the floor, pottery sits in niches on the walls, and a long counter invites you to explore labelled bowls of toppings.', ingredients: 'Our ingredients', ingredientsTitleFirst: 'Local care,', ingredientsTitleSecond: 'made in-house.', ingredientsDescription: "All of KELA's ingredients are purchased from local Ontario businesses. Our yogurt is made in-house, giving the team complete control over the quality of every product. We make our mix in-house, which means we know exactly what is in the froyo. We keep it as low in sugar as possible by sweetening the product with pure monk fruit.", imageAlt: 'KELA owners Kerem Karaca and Laura Delaossa', storeAlt: 'The welcoming KELA shop interior' },
    footer: 'Greek frozen yogurt, made with care - S G P',
  },
  es: {
    language: 'Español', nav: ['Inicio', 'Nuestro menú', 'Nuestra historia'], pageTitles: { home: 'Inicio', menu: 'Menú', story: 'Nuestra historia' },
    common: { brand: 'YOGUR GRIEGO HELADO', homeAria: 'Inicio de KELA', primary: 'Navegación principal', open: 'Abrir menú de navegación', close: 'Cerrar menú de navegación', language: 'Cambiar idioma', instagram: 'KELA en Instagram', photo: 'Foto de Fareen Karim', photos: 'Fotos de Fareen Karim' },
    home: { eyebrow: 'Yogur griego helado · Toronto', title: 'Un pequeño sabor del Egeo.', intro: 'Kela Greek Frozen Yogurt mantiene a Toronto lleno de postres frescos todo el verano. Visítanos en 81 St. Clair Avenue East y crea tu vaso con nuestro yogur estilo griego.', primary: 'Explorar el menú', secondary: 'Nuestra historia', note: 'Estilo griego / Hecho fresco en Toronto', imageAlt: 'Yogur griego helado de KELA con fresas y toppings de galleta', illustrationLabel: 'remolino / cuchara / sol', sealLine1: 'Estilo griego', sealLine2: 'hecho fresco', sealLine3: 'en Toronto', ticker: 'Yogur estilo griego · Toronto · hecho fresco · elige tu remolino · ', manifesto: 'Haz espacio para lo bueno.', manifestoText: 'Una cucharada luminosa, un topping inesperado, una tarde tranquila que se convierte en ritual. KELA es un pequeño sabor del Egeo hecho para Toronto.', featureLabel: '01 / La manera KELA', featureTitle: 'Elige tu mezcla. Hazla tuya.', featureText: 'Empieza con yogur helado estilo griego y recorre el camino de fruta, crujiente, chocolate y favoritos de la casa.', featureCta: 'Ver el menú', galleryLabel: 'Hecho fresco / terminado con generosidad', ctaTitle: 'Te esperamos en St. Clair.', ctaText: 'Una tienda pequeña con una gran perspectiva.' },
    menu: { eyebrow: 'El menú de KELA', titleFirst: 'Elige tu', titleSecond: 'lugar feliz.', intro: 'Yogur helado estilo griego, toppings generosos y café para disfrutar sin prisa.', frozen: 'Yogur helado', cards: [{ name: 'Mini', description: 'Un pequeño vaso blanco KELA con un topping. Añade más por un poco extra.' }, { name: 'Clásico', description: 'Casi el doble de tamaño, con el doble de toppings.' }, { name: 'Cono', description: 'Un cono de azúcar largo y crujiente que complementa el yogur.' }], toppings: 'Toppings', toppingsDescription: 'Fruta fresca, frutos secos, chocolate, fresas, pistachos, cerezas, miel y crema de pistacho.', combinations: 'Prueba chocolate + fresas + pistachos, pistachos picados + cerezas enteras + miel, o crema de pistacho en un cono.', toppingGroups: [{ name: 'Toppings clásicos', price: '$0.75', items: ['Almendras', 'Coco sin azúcar', 'Fresa', 'Arándano', 'Granola', 'Dátiles', 'Brownie', 'Pistachos', 'Oreos', 'Biscoff', 'Mermelada orgánica de fresa', 'Nueces', 'Aceite de oliva y sal', 'Miel', 'Chocolate derretido', 'Mantequilla de almendra', 'Crema Biscoff'] }, { name: 'Toppings premium', price: '$0.99', items: ['Pistachos', 'Crema de pistacho', 'Cerezas Amarena'] }, { name: 'Toppings KELA', price: '$1.50', items: ['KELA Choccy crunch', 'KELA pistachio dream', 'KELA Colombian dulce', 'KELA topping'] }], drinks: 'Bebidas', icedLattes: 'Lattes fríos', icedDescription: 'Café colombiano con leche entera, 2%, 0%, de avena o de almendra. La leche de almendra cuesta +$0.50.', syrups: 'Termina con sirope de caramelo, vainilla o sin azúcar bajo petición.', comeBy: 'Visítanos', address1: '81 St. Clair Avenue East, Unit 112', address2: 'Toronto, Ontario', back: 'Volver a inicio' },
    story: { eyebrow: 'Nuestra historia', titleFirst: 'Raíces en Grecia.', titleSecond: 'Hecho en Toronto.', intro: 'Ingredientes simples. Infinitas pequeñas alegrías. KELA es un lugar para bajar el ritmo, elegir tu mezcla y hacerla tuya.', who: 'Quiénes somos', ownersTitle: 'Kerem & Laura', ownersP1: 'Los propietarios Kerem Karaca y Laura Delaossa combinaron sus nombres para crear Kela. Después de viajar juntos a Grecia, quedaron fascinados por la calidad de sus postres y sorprendidos por su poca presencia en Norteamérica.', ownersP2: 'Hicieron suyo el objetivo de traer yogur helado estilo griego a Toronto y abrieron KELA en junio de 2026.', inspiration: 'Nuestra inspiración griega', quote: '“Ni demasiado dulce, ni demasiado ácido, perfecto con casi cualquier topping.”', quoteDescription: 'El sabor único del yogur griego lo convierte en un snack ideal para el verano. Aunque otros restaurantes han comenzado a servir yogur griego, KELA es la única tienda de la ciudad dedicada exclusivamente a él.', store: 'Nuestra tienda', storeTitleFirst: 'Cada rincón', storeTitleSecond: 'tiene una historia.', storeDescription: 'La influencia griega se siente desde que entras: baldosas de piedra cubren el suelo, la cerámica vive en nichos de las paredes y un largo mostrador te invita a explorar los cuencos etiquetados de toppings.', ingredients: 'Nuestros ingredientes', ingredientsTitleFirst: 'Cuidado local,', ingredientsTitleSecond: 'hecho en casa.', ingredientsDescription: 'Todos los ingredientes de KELA se compran a negocios locales de Ontario. Nuestro yogur se hace en casa, dando al equipo control total sobre la calidad de cada producto.', imageAlt: 'Los propietarios de KELA Kerem Karaca y Laura Delaossa', storeAlt: 'El acogedor interior de KELA' },
    footer: 'Yogur griego helado, hecho con cuidado - S G P',
  },
  el: {
    language: 'Ελληνικά', nav: ['Αρχική', 'Το μενού μας', 'Η ιστορία μας'], pageTitles: { home: 'Αρχική', menu: 'Μενού', story: 'Η ιστορία μας' },
    common: { brand: 'ΕΛΛΗΝΙΚΟ ΠΑΓΩΜΕΝΟ ΓΙΑΟΥΡΤΙ', homeAria: 'Αρχική KELA', primary: 'Κύρια πλοήγηση', open: 'Άνοιγμα μενού πλοήγησης', close: 'Κλείσιμο μενού πλοήγησης', language: 'Αλλαγή γλώσσας', instagram: 'Η KELA στο Instagram', photo: 'Φωτογραφία από Fareen Karim', photos: 'Φωτογραφίες από Fareen Karim' },
    home: { eyebrow: 'Ελληνικό παγωμένο γιαούρτι · Τορόντο', title: 'Μια μικρή γεύση από το Αιγαίο.', intro: 'Η Kela Greek Frozen Yogurt γεμίζει το Τορόντο με φρέσκες παγωμένες απολαύσεις όλο το καλοκαίρι. Θα μας βρείτε στη διεύθυνση 81 St. Clair Avenue East και θα δημιουργήσετε το κύπελλό σας με το γιαούρτι ελληνικού τύπου.', primary: 'Εξερευνήστε το μενού', secondary: 'Η ιστορία μας', note: 'Ελληνικό στιλ / Φρέσκο στο Τορόντο', imageAlt: 'Ελληνικό παγωμένο γιαούρτι KELA με φράουλες και μπισκότα', illustrationLabel: 'δίνη / κουτάλι / ήλιος', sealLine1: 'Ελληνικό στιλ', sealLine2: 'φρέσκο', sealLine3: 'στο Τορόντο', ticker: 'Ελληνικό γιαούρτι · Τορόντο · φρέσκο · διάλεξε τη δίνη σου · ', manifesto: 'Κάντε χώρο για τα καλά.', manifestoText: 'Μια φωτεινή κουταλιά, μια απρόσμενη επικάλυψη, ένα αργό απόγευμα που γίνεται συνήθεια. Η KELA είναι μια μικρή γεύση του Αιγαίου, φτιαγμένη για το Τορόντο.', featureLabel: '01 / Ο τρόπος KELA', featureTitle: 'Διάλεξε τη δίνη σου. Κάν’ την δική σου.', featureText: 'Ξεκίνα με γιαούρτι ελληνικού τύπου και συνέχισε με φρούτα, τραγανές γεύσεις, σοκολάτα και αγαπημένες δημιουργίες του καταστήματος.', featureCta: 'Δες το μενού', galleryLabel: 'Φρέσκο / γενναιόδωρα τελειωμένο', ctaTitle: 'Συναντήστε μας στο St. Clair.', ctaText: 'Ένα μικρό κατάστημα με μεγάλη άποψη.' },
    menu: { eyebrow: 'Το μενού της KELA', titleFirst: 'Διάλεξε το', titleSecond: 'χαρούμενο μέρος σου.', intro: 'Παγωμένο γιαούρτι ελληνικού τύπου, γενναιόδωρες επικαλύψεις και καφές για να μείνεις λίγο ακόμη.', frozen: 'Παγωμένο γιαούρτι', cards: [{ name: 'Mini', description: 'Ένα μικρό λευκό κύπελλο KELA με μία επικάλυψη. Πρόσθεσε κι άλλες για λίγο παραπάνω.' }, { name: 'Κλασικό', description: 'Σχεδόν διπλάσιο μέγεθος, με διπλάσιες επικαλύψεις.' }, { name: 'Χωνάκι', description: 'Ένα μακρύ, τραγανό χωνάκι ζάχαρης που συμπληρώνει το γιαούρτι.' }], toppings: 'Επικαλύψεις', toppingsDescription: 'Φρέσκα φρούτα, ψιλοκομμένοι ξηροί καρποί, σοκολάτα, φράουλες, φιστίκια, κεράσια, μέλι και κρέμα φιστικιού.', combinations: 'Δοκίμασε σοκολάτα + φράουλες + φιστίκια, ψιλοκομμένα φιστίκια + ολόκληρα κεράσια + μέλι ή κρέμα φιστικιού σε χωνάκι.', toppingGroups: [{ name: 'Κλασικές επικαλύψεις', price: '$0.75', items: ['Αμύγδαλα', 'Καρύδα χωρίς ζάχαρη', 'Φράουλα', 'Μύρτιλο', 'Granola', 'Χουρμάδες', 'Brownie bites', 'Φιστίκια', 'Oreos', 'Biscoff', 'Οργανική μαρμελάδα φράουλα', 'Καρύδια', 'Ελαιόλαδο και αλάτι', 'Μέλι', 'Λιωμένη σοκολάτα', 'Βούτυρο αμυγδάλου', 'Κρέμα Biscoff'] }, { name: 'Premium επικαλύψεις', price: '$0.99', items: ['Φιστίκια', 'Κρέμα φιστικιού', 'Κεράσια Amarena'] }, { name: 'Επικαλύψεις KELA', price: '$1.50', items: ['KELA τραγανή σοκολάτα', 'KELA όνειρο φιστικιού', 'KELA κολομβιανή καραμέλα', 'KELA επικάλυψη'] }], drinks: 'Ροφήματα', icedLattes: 'Παγωμένα lattes', icedDescription: 'Κολομβιανός καφές με πλήρες γάλα, 2%, 0%, βρώμης ή αμυγδάλου. Το γάλα αμυγδάλου είναι +$0.50.', syrups: 'Ολοκλήρωσε με καραμέλα, βανίλια ή σιρόπι χωρίς ζάχαρη κατόπιν αιτήματος.', comeBy: 'Πέρνα από εδώ', address1: '81 St. Clair Avenue East, Μονάδα 112', address2: 'Τορόντο, Οντάριο', back: 'Πίσω στην αρχική' },
    story: { eyebrow: 'Η ιστορία μας', titleFirst: 'Ρίζες στην Ελλάδα.', titleSecond: 'Φτιαγμένο στο Τορόντο.', intro: 'Απλά υλικά. Αμέτρητες μικρές χαρές. Η KELA είναι ένας χώρος για να χαμηλώσεις ρυθμό, να διαλέξεις τη δίνη σου και να την κάνεις δική σου.', who: 'Ποιοι είμαστε', ownersTitle: 'Kerem & Laura', ownersP1: 'Οι ιδιοκτήτες Kerem Karaca και Laura Delaossa ένωσαν τα ονόματά τους για να δημιουργήσουν την Kela. Μετά από ένα κοινό ταξίδι στην Ελλάδα, εντυπωσιάστηκαν από την ποιότητα των ελληνικών γλυκών και από την περιορισμένη παρουσία τους στη Βόρεια Αμερική.', ownersP2: 'Έκαναν αποστολή τους να φέρουν το παγωμένο γιαούρτι ελληνικού τύπου στο Τορόντο, ανοίγοντας την KELA τον Ιούνιο του 2026.', inspiration: 'Η ελληνική μας έμπνευση', quote: '«Ούτε πολύ γλυκό, ούτε πολύ ξινό, τέλειο με σχεδόν κάθε επικάλυψη.»', quoteDescription: 'Η μοναδική γεύση του ελληνικού γιαουρτιού το κάνει ιδανικό καλοκαιρινό σνακ. Ενώ κι άλλα εστιατόρια άρχισαν να σερβίρουν ελληνικό γιαούρτι, η KELA είναι το μόνο κατάστημα στην πόλη που προσφέρει αποκλειστικά αυτό.', store: 'Το κατάστημά μας', storeTitleFirst: 'Κάθε γωνιά', storeTitleSecond: 'έχει μια ιστορία.', storeDescription: 'Οι ελληνικές επιρροές είναι ορατές από την είσοδο: πλακόστρωτα καλύπτουν το πάτωμα, κεραμικά βρίσκονται σε κόγχες στους τοίχους και ένας μακρύς πάγκος σε προσκαλεί να εξερευνήσεις τα μπολ με τις επικαλύψεις.', ingredients: 'Τα υλικά μας', ingredientsTitleFirst: 'Τοπική φροντίδα,', ingredientsTitleSecond: 'φτιαγμένο εδώ.', ingredientsDescription: 'Όλα τα υλικά της KELA αγοράζονται από τοπικές επιχειρήσεις του Οντάριο. Το γιαούρτι μας φτιάχνεται εδώ, δίνοντας στην ομάδα πλήρη έλεγχο της ποιότητας κάθε προϊόντος.', imageAlt: 'Οι ιδιοκτήτες της KELA Kerem Karaca και Laura Delaossa', storeAlt: 'Το φιλόξενο εσωτερικό της KELA' },
    footer: 'Ελληνικό παγωμένο γιαούρτι, φτιαγμένο με φροντίδα - Σ Γ Π',
  },
} as const;

const grandProductCopy: Record<Lang, { name: string; description: string }> = {
  en: { name: 'Grand', description: 'The largest cup, served with three toppings.' },
  es: { name: 'Vaso grande', description: 'El vaso más grande, servido con tres ingredientes.' },
  el: { name: 'μεγάλο ποτήρι', description: 'Το μεγαλύτερο κύπελλο, με τρεις επικαλύψεις.' },
};

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('.reveal');
    if (!('IntersectionObserver' in window)) { nodes.forEach((n) => n.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  });
}

function useHeroMotion() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.hero');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!hero || reduceMotion.matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      hero.style.setProperty('--scroll-shift', `${Math.min(window.scrollY * 0.045, 32)}px`);
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
}

function SiteShell({ children, lang, setLang }: { children: ReactNode; lang: Lang; setLang: (lang: Lang) => void }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const c = copy[lang];
  const links = [{ href: '/', label: c.nav[0] }, { href: '/menu', label: c.nav[1] }, { href: '/story', label: c.nav[2] }];
  useEffect(() => { setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }, [location]);
  useEffect(() => {
    const pageKey = location === '/menu' ? 'menu' : location === '/story' ? 'story' : 'home';
    document.title = `KELA - ${c.pageTitles[pageKey]}`;
  }, [location, c.pageTitles]);
  return <div className="site-shell noise">
    <header className="topbar">
      <div className="container-wide topbar-inner">
        <Link href="/" className="brand-lockup" aria-label={c.common.homeAria} data-testid="link-brand">
          <img src="/images/kelalogo.png" alt="" aria-hidden="true" />
          <span className="brand-word">KELA<small>{c.common.brand}</small></span>
        </Link>
        <nav className="nav-links" aria-label={c.common.primary}>
          {links.map((link) => <Link key={link.href} href={link.href} aria-current={location === link.href ? 'page' : undefined} data-testid={`link-nav-${link.href.slice(1) || 'home'}`}>{link.label}</Link>)}
        </nav>
        <div className="nav-actions">
          <label className="sr-only" htmlFor="language-select">{c.common.language}</label>
          <select id="language-select" className="lang-select" value={lang} onChange={(event) => setLang(event.target.value as Lang)} aria-label={c.common.language} data-testid="select-language">
            <option value="en">EN</option><option value="es">ES</option><option value="el">ΕΛ</option>
          </select>
          <Link className="btn-quiet" href="/menu" data-testid="link-order-menu">{c.nav[1]} <ArrowUpRight size={14} /></Link>
          <button className="menu-toggle" aria-label={c.common.open} aria-expanded={menuOpen} onClick={() => setMenuOpen(true)} data-testid="button-open-menu"><Menu size={25} /></button>
        </div>
      </div>
    </header>
    <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
      <div className="mobile-menu-top"><img src="/images/Brand.png" alt="KELA" /><button className="mobile-close" aria-label={c.common.close} onClick={() => setMenuOpen(false)} data-testid="button-close-menu"><X size={28} /></button></div>
      <nav className="mobile-nav" aria-label={c.common.primary}>{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} data-testid={`mobile-link-${link.href.slice(1) || 'home'}`}>{link.label}</Link>)}</nav>
      <div className="mobile-menu-bottom"><p>81 St. Clair Avenue East<br />Toronto, Ontario</p><a href="https://www.instagram.com/kelagreek/" target="_blank" rel="noreferrer" aria-label={c.common.instagram} data-testid="mobile-link-instagram"><Instagram size={18} /></a></div>
    </div>
    {children}
  </div>;
}

function Footer({ c }: { c: Copy }) {
  return <footer className="footer">
    <div className="container-wide footer-main">
      <div className="footer-brand"><img src="/images/Brand.png" alt="KELA" /><p>{c.footer}</p></div>
      <div className="footer-links">
        <div className="footer-col"><h3>{c.nav[1]}</h3><Link href="/menu">{c.menu.frozen}</Link><Link href="/menu#toppings">{c.menu.toppings}</Link><Link href="/menu#drinks">{c.menu.drinks}</Link></div>
        <div className="footer-col"><h3>{c.menu.comeBy}</h3><p>{c.menu.address1}<br />{c.menu.address2}</p><a href="https://www.instagram.com/kelagreek/" target="_blank" rel="noreferrer" aria-label={c.common.instagram} data-testid="link-instagram"><Instagram size={18} /></a></div>
      </div>
    </div>
    <div className="container-wide footer-bottom"><span>© 2026 KELA</span><span>{c.common.photo}</span><span>KELA · {c.language}</span></div>
  </footer>
}

function HomePage({ c }: { c: Copy }) {
  useReveal();
  useHeroMotion();
  return <main>
    <section className="hero">
      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />
      <div className="container-wide hero-grid">
        <div className="hero-copy reveal">
          <div className="eyebrow">{c.home.eyebrow}</div>
          <h1 className="display">{c.home.title.split(' ').map((word, index) => <span key={word + index}>{index === 2 ? <em>{word} </em> : `${word} `}</span>)}</h1>
          <p className="hero-intro">{c.home.intro}</p>
          <div className="hero-actions"><Link className="btn-primary" href="/menu" data-testid="link-hero-menu">{c.home.primary} <ArrowUpRight size={15} /></Link><Link className="btn-quiet" href="/story" data-testid="link-hero-story">{c.home.secondary} <ArrowUpRight size={15} /></Link></div>
          <div className="hero-note mono">{c.home.note}</div>
        </div>
        <div className="hero-visual reveal delay-2">
          <div className="hero-visual-wash" aria-hidden="true" />
          <div className="hero-illustration" aria-hidden="true">
            <svg viewBox="0 0 300 360" role="presentation">
              <path className="swirl-ribbon" d="M148 42c-52 19-59 63-22 81 39 19 91-13 103 26 9 31-28 55-78 59-55 4-105 28-88 72 12 32 61 38 93 15" />
              <path className="swirl-ribbon swirl-ribbon-light" d="M166 56c-31 23-34 44-7 57 26 13 61-4 71 18 10 23-18 42-57 48-48 8-80 30-66 56" />
              <path className="swirl-line" d="M58 294c38-29 83-28 119-6 28 17 57 19 78 2" />
              <path className="swirl-line" d="M42 315c41-21 77-18 112 2 31 18 66 20 106-5" />
              <circle className="swirl-dot" cx="67" cy="95" r="10" />
              <circle className="swirl-dot swirl-dot-small" cx="219" cy="112" r="6" />
              <path className="swirl-leaf" d="M55 118c-22-16-27-37-20-53 23 5 37 20 34 43-3 15-14 26-14 26Z" />
              <path className="swirl-leaf vein" d="M35 68c8 17 14 31 19 53" />
            </svg>
            <span className="hero-illustration-label mono">{c.home.illustrationLabel}</span>
          </div>
          <div className="image-frame hero-photo"><img src="/images/icecream1.jpeg" alt={c.home.imageAlt} /></div>
          <div className="hero-seal"><span>{c.home.sealLine1}<br />{c.home.sealLine2}<br />{c.home.sealLine3}</span></div>
        </div>
      </div>
      <div className="hero-bottom-note container-wide mono" aria-hidden="true">01 / a little taste of the Aegean</div>
    </section>
    <div className="ticker" aria-hidden="true"><div className="ticker-track">{[0, 1, 2, 3, 4, 5].map((group) => <span className="ticker-item" key={group}>{c.home.ticker}</span>)}</div></div>
    <section className="manifesto"><div className="container-wide manifesto-grid"><div className="section-label reveal">02 / KELA</div><div className="manifesto-copy reveal delay-1"><h2 className="display">{c.home.manifesto.split(' ').map((word, i) => <span key={word + i}>{i > 3 ? <em>{word} </em> : `${word} `}</span>)}</h2><p className="manifesto-sub">{c.home.manifestoText}</p></div></div><div className="ticker manifesto-ticker" aria-hidden="true"><div className="ticker-track">{[0, 1, 2, 3, 4, 5].map((group) => <span className="ticker-item" key={group}>{c.home.ticker}</span>)}</div></div></section>
    <section className="feature-split"><div className="container-wide feature-grid"><div className="image-frame feature-image reveal"><img src="/images/icrecream2.jpeg" alt={c.menu.toppingsDescription} /></div><div className="feature-copy reveal delay-1"><div className="section-label">{c.home.featureLabel}</div><h2 className="display">{c.home.featureTitle}</h2><p>{c.home.featureText}</p><Link href="/menu" className="btn-quiet" data-testid="link-feature-menu">{c.home.featureCta} <ArrowUpRight size={15} /></Link></div></div></section>
    <section className="gallery-strip" aria-label={c.home.galleryLabel}><figure className="image-frame reveal"><img src="/images/classic.png" alt="KELA classic cup" /></figure><figure className="image-frame reveal delay-1"><img src="/images/cone.png" alt="KELA frozen yogurt cone" /></figure><figure className="image-frame reveal delay-2" data-photo-credit={c.common.photos}><img src="/images/coffee.png" alt="KELA iced latte" /></figure></section>
    <section className="cta-band"><div className="container-wide reveal"><div className="section-label" style={{ justifyContent: 'center' }}>03 / Toronto</div><h2 className="display">{c.home.ctaTitle}</h2><p>{c.home.ctaText}</p><Link className="btn-primary" href="/menu" data-testid="link-cta-menu">{c.home.primary} <ArrowUpRight size={15} /></Link></div></section>
  </main>
}

function FrozenYogurtCarousel({ c }: { c: Copy }) {
  const photos = [
    { src: '/images/2.png', alt: 'KELA frozen yogurt cup', showCredit: true },
    { src: '/images/classic.png', alt: 'KELA classic frozen yogurt', showCredit: true },
    { src: '/images/cone.png', alt: 'KELA frozen yogurt cone', showCredit: true },
  ];
  const [activePhoto, setActivePhoto] = useState(0);
  const [previousPhoto, setPreviousPhoto] = useState(0);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const photo = photos[activePhoto];
  const oldPhoto = photos[previousPhoto];

  useEffect(() => {
    setTarget(document.querySelector<HTMLElement>('.menu-board .menu-section:first-child .menu-cards'));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPreviousPhoto(activePhoto);
      setActivePhoto((current) => (current + 1) % photos.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [activePhoto, photos.length]);

  const changePhoto = (nextPhoto: number) => {
    setPreviousPhoto(activePhoto);
    setActivePhoto(nextPhoto);
  };
  const showPrevious = () => changePhoto((activePhoto - 1 + photos.length) % photos.length);
  const showNext = () => changePhoto((activePhoto + 1) % photos.length);

  const carousel = <div className="frozen-carousel" aria-label="Frozen yogurt photos">
    <div className="image-frame topping-photo frozen-carousel-frame" data-photo-credit={c.common.photo}>
      <img className="frozen-carousel-image frozen-carousel-image--previous" src={oldPhoto.src} alt="" aria-hidden="true" />
      <img key={photo.src} className="frozen-carousel-image frozen-carousel-image--current" src={photo.src} alt={photo.alt} />
      {photo.showCredit && <span className="photo-index mono">{c.common.photo}</span>}
      <div className="frozen-carousel-controls">
        <button type="button" onClick={showPrevious} aria-label="Previous frozen yogurt photo"><ArrowLeft size={16} /></button>
        <span className="mono">0{activePhoto + 1} / 0{photos.length}</span>
        <button type="button" onClick={showNext} aria-label="Next frozen yogurt photo"><ArrowRight size={16} /></button>
      </div>
    </div>
  </div>
  return target ? createPortal(carousel, target) : null;
}

function MenuPageLegacy({ c }: { c: Copy }) {
  useReveal();
  return <main><section className="page-intro"><div className="container-wide menu-intro reveal"><div className="section-label">{c.menu.eyebrow}</div><h1 className="display">{c.menu.titleFirst}<span>{c.menu.titleSecond}</span></h1><p>{c.menu.intro}</p></div></section><section className="menu-board"><div className="container-wide"><div className="menu-section reveal"><div className="menu-section-head"><h2>{c.menu.frozen}</h2><span className="mono">01 / 03</span></div><div className="menu-cards">{c.menu.cards.map((card, index) => <article className="menu-card" key={card.name}><span className="card-number">0{index + 1}</span><h3>{card.name}</h3><p>{card.description}</p></article>)}</div></div><div className="menu-section reveal" id="toppings"><div className="topping-layout"><div className="topping-editorial"><div className="menu-section-head"><h2>{c.menu.toppings}</h2><span className="mono">02 / 03</span></div><p className="topping-description">{c.menu.toppingsDescription}</p><p className="mono topping-combination">{c.menu.combinations}</p><div>{c.menu.toppingGroups.map((group) => <div className="topping-group" key={group.name}><div className="topping-group-head"><h3>{group.name}</h3><span className="price">{group.price}</span></div><div className="topping-list">{group.items.map((item) => <span key={item}>{item}</span>)}</div></div>)}</div></div><div className="image-frame topping-photo" data-photo-credit={c.common.photo}><img src="/images/toppings4.png" alt={c.menu.toppingsDescription} /></div></div></div><div className="menu-section reveal" id="drinks"><div className="menu-section-head"><h2>{c.menu.drinks}</h2><span className="mono">03 / 03</span></div><div className="menu-cards"><article className="menu-card"><h3>{c.menu.icedLattes}</h3><p>{c.menu.icedDescription}</p><span className="price">+ {c.menu.syrups}</span></article><div className="image-frame" data-photo-credit={c.common.photo} style={{ minHeight: 280 }}><img src="/images/coffee.png" alt={c.menu.icedLattes} /></div></div></div><div className="menu-address reveal"><div><div className="eyebrow">{c.menu.comeBy}</div><h3>{c.menu.address1}</h3></div><p>{c.menu.address2}</p></div></div></section><section className="cta-band"><div className="container-wide reveal"><h2 className="display">{c.home.ctaTitle}</h2><Link className="btn-primary" href="/" data-testid="link-menu-home">{c.menu.back} <ArrowUpRight size={15} /></Link></div></section></main>;
}

function MenuPage({ c }: { c: Copy }) {
  const language = c.language === 'Español' ? 'es' : c.language === 'Ελληνικά' ? 'el' : 'en';
  const grand = grandProductCopy[language];
  const menuCopy: Copy = { ...c, menu: { ...c.menu, cards: [...c.menu.cards, grand] } };
  return <div className="menu-page-with-carousel"><FrozenYogurtCarousel c={c} /><MenuPageLegacy c={menuCopy} /></div>;
}

function StoryPage({ c }: { c: Copy }) {
  useReveal();
  return <main><section className="story-hero"><div className="container-wide story-intro reveal"><div className="section-label">{c.story.eyebrow}</div><h1 className="display">{c.story.titleFirst}<br /><em>{c.story.titleSecond}</em></h1><p>{c.story.intro}</p></div></section><section className="story-feature"><div className="container-wide story-feature-grid"><div className="image-frame portrait reveal" data-photo-credit={c.common.photo}><img src="/images/owners3.png" alt={c.story.imageAlt} /></div><div className="reveal delay-1"><div className="section-label">{c.story.who}</div><h2>{c.story.ownersTitle}</h2><p>{c.story.ownersP1}</p><p>{c.story.ownersP2}</p></div></div></section><section className="quote-block"><div className="container-wide reveal"><div className="section-label" style={{ color: 'hsl(var(--accent))', justifyContent: 'center' }}>{c.story.inspiration}</div><blockquote>{c.story.quote}</blockquote><p>{c.story.quoteDescription}</p></div></section><section className="store-section"><div className="container-wide store-grid"><div className="image-frame store-large reveal" data-photo-credit={c.common.photo}><img src="/images/local.png" alt={c.story.storeAlt} /></div><div className="image-frame store-small reveal delay-1"><img src="/images/owners2.jpeg" alt={c.story.storeAlt} /></div><div className="store-copy reveal"><div className="section-label">{c.story.store}</div><h2>{c.story.storeTitleFirst}<br /><em>{c.story.storeTitleSecond}</em></h2><p>{c.story.storeDescription}</p></div></div></section><section className="ingredients"><div className="container-wide ingredients-grid"><div className="reveal"><div className="section-label">{c.story.ingredients}</div><h2>{c.story.ingredientsTitleFirst}<br /><em>{c.story.ingredientsTitleSecond}</em></h2><p>{c.story.ingredientsDescription}</p></div><div className="image-frame ingredient-image reveal delay-1" data-photo-credit={c.common.photo}><img src="/images/local2.png" alt="KELA at 81 St. Clair Avenue East" /></div></div></section><section className="cta-band"><div className="container-wide reveal"><h2 className="display">{c.home.ctaTitle}</h2><Link className="btn-primary" href="/menu" data-testid="link-story-menu">{c.home.primary} <ArrowUpRight size={15} /></Link></div></section></main>;
}

function Router({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  const c = copy[lang];
  return <SiteShell lang={lang} setLang={setLang}><Switch><Route path="/"><HomePage c={c} /></Route><Route path="/menu"><MenuPage c={c} /></Route><Route path="/story"><StoryPage c={c} /></Route><Route component={NotFound} /></Switch><Footer c={c} /></SiteShell>;
}

function App() {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('kela-language') as Lang) || 'en');
  const setLang = (next: Lang) => { setLangState(next); localStorage.setItem('kela-language', next); };
  const direction = useMemo(() => lang === 'el' ? 'ltr' : 'ltr', [lang]);
  return <QueryClientProvider client={queryClient}><TooltipProvider><div dir={direction}><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary><Router lang={lang} setLang={setLang} /></ErrorBoundary></WouterRouter></div><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;