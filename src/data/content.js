// ─────────────────────────────────────────────────────────────
//  All café content lives here. Edit this file to update the site.
//  Photos: drop files into /public/photos with the exact names below.
//  If a photo is missing, the site shows an illustration instead.
// ─────────────────────────────────────────────────────────────

export const INFO = {
  name: 'Summer Bistro Café',
  phone: '+918340000135',
  phoneDisplay: '+91 83400 00135',
  whatsapp: '918340000135',
  address: "Metro Pillar No. 1552, Road No. 5, Women's Welfare Housing Society, Jubilee Hills, Hyderabad",
  shortAddress: 'Road No. 5, Jubilee Hills',
  costForTwo: '₹1,200 – 1,600 for two',
  mapsEmbed: 'https://www.google.com/maps?q=Summer+Bistro+Jubilee+Hills+Hyderabad&output=embed',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Summer+Bistro+Jubilee+Hills+Hyderabad',
  instagram: 'https://www.instagram.com/', // TODO: replace with the café's Instagram profile
  zomato: 'https://www.zomato.com/hyderabad/summer-bistro-jubilee-hills/order',
  swiggy: 'https://www.swiggy.com/restaurants/hyderabad/jubilee-hills/summer-bistro-1107324/dineout',
  district: 'https://www.district.in/dining/hyderabad/summer-bistro-jubilee-hills',
};

export const FAVOURITES = [
  {
    name: 'Iced Latte',
    pair: 'Espresso × Cold milk',
    desc: 'A double shot poured over ice and cold milk. Our most-talked-about drink — and for good reason.',
    tag: 'Most loved',
    photo: '/photos/iced-latte.jpg',
    art: 'iced',
    color: '#A9DBEA',
  },
  {
    name: 'Photo-Print Latte',
    pair: 'Latte × Your photo',
    desc: 'Show us a picture and we print it right onto the foam. Instagram, meet coffee.',
    tag: 'Signature',
    photo: '/photos/photo-print-latte.jpg',
    art: 'print',
    color: '#F6B7B0',
  },
  {
    name: 'Matcha Latte',
    pair: 'Matcha × Milk',
    desc: 'Bright, earthy matcha whisked silky-smooth. Hot for the mornings, iced for the afternoons.',
    photo: '/photos/matcha-latte.jpg',
    art: 'matcha',
    color: '#C3DC8C',
  },
  {
    name: 'Lotus Biscoff Cheesecake',
    pair: 'Biscoff × Cream cheese',
    desc: 'Creamy baked cheesecake on a crunchy Biscoff base with a caramel-cookie crown.',
    tag: 'Dessert fave',
    photo: '/photos/biscoff-cheesecake.jpg',
    art: 'cake',
    color: '#FFC94A',
  },
  {
    name: 'Puff Pizza',
    pair: 'Flaky pastry × Molten cheese',
    desc: 'Our playful take on pizza — buttery puff pastry, rich tomato sauce and plenty of melted cheese.',
    photo: '/photos/puff-pizza.jpg',
    art: 'pizza',
    color: '#F9A66C',
  },
  {
    name: 'Chicken Aglio Olio',
    pair: 'Spaghetti × Garlic & chilli',
    desc: 'Spaghetti tossed in garlic, olive oil and chilli flakes with tender chicken. Simple. Perfect.',
    tag: 'Bestseller',
    photo: '/photos/aglio-olio.jpg',
    art: 'pasta',
    color: '#F6E3C6',
  },
];

// veg: true = veg, false = non-veg, undefined = no marker
// price: add a number (e.g. 349) to show a price
export const MENU = [
  {
    category: 'Coffee & Matcha',
    blurb: 'Pulled fresh, any hour of the day.',
    items: [
      { name: 'Iced Latte', desc: 'Double espresso over ice and cold milk.', veg: true, tag: 'Bestseller', art: 'iced', photo: '/photos/iced-latte.jpg' },
      { name: 'Cold Coffee', desc: 'Thick, creamy and blended — a Summer Bistro classic.', veg: true, tag: 'Must try', art: 'iced', photo: '/photos/cold-coffee.jpg' },
      { name: 'Photo-Print Latte', desc: 'Your favourite photo, printed on the foam.', veg: true, tag: 'Signature', art: 'print', photo: '/photos/photo-print-latte.jpg' },
      { name: 'Matcha Latte', desc: 'Smooth whisked matcha with milk — hot or iced.', veg: true, art: 'matcha', photo: '/photos/matcha-latte.jpg' },
    ],
  },
  {
    category: 'Starters',
    blurb: 'Small plates, big cravings.',
    items: [
      { name: 'Chicken Tenders', desc: 'Crispy golden strips with a house dip.', veg: false, tag: 'Popular', art: 'tenders', photo: '/photos/chicken-tenders.jpg' },
      { name: 'Jalapeño Sticks', desc: 'Cheesy, crunchy and just the right amount of heat.', veg: true, art: 'tenders', photo: '/photos/jalapeno-sticks.jpg' },
      { name: 'Cajun Chicken', desc: 'Chicken bites tossed in smoky Cajun spice.', veg: false, art: 'tenders', photo: '/photos/cajun-chicken.jpg' },
      { name: 'Garlic Bread', desc: 'Toasted, buttery and loaded with garlic.', veg: true, art: 'bread', photo: '/photos/garlic-bread.jpg' },
    ],
  },
  {
    category: 'Pizza & Pasta',
    blurb: 'Comfort food, Italian-ish.',
    items: [
      { name: 'Puff Pizza', desc: 'Flaky puff pastry base, rich sauce, molten cheese.', tag: 'Fan favourite', art: 'pizza', photo: '/photos/puff-pizza.jpg' },
      { name: 'Chicken Spaghetti Aglio Olio', desc: 'Garlic, olive oil, chilli flakes and tender chicken.', veg: false, tag: 'Bestseller', art: 'pasta', photo: '/photos/aglio-olio.jpg' },
      { name: 'White Sauce Pasta', desc: 'Creamy, cheesy béchamel pasta — pure comfort.', veg: true, art: 'pasta', photo: '/photos/white-sauce-pasta.jpg' },
    ],
  },
  {
    category: 'Bowls & Burgers',
    blurb: 'Hearty plates for the 3 AM crowd.',
    items: [
      { name: 'Mexican Rice Bowl', desc: 'Seasoned rice with beans, salsa and all the fixings.', art: 'bowl', photo: '/photos/mexican-rice-bowl.jpg' },
      { name: 'Burgers', desc: "Stacked, juicy and built for late-night cravings — ask for today's line-up.", art: 'burger', photo: '/photos/burger.jpg' },
    ],
  },
  {
    category: 'Desserts',
    blurb: 'Save room. Seriously.',
    items: [
      { name: 'Lotus Biscoff Cheesecake', desc: 'Creamy cheesecake on a Biscoff crumb with caramel-cookie topping.', veg: true, tag: 'Must try', art: 'cake', photo: '/photos/biscoff-cheesecake.jpg' },
    ],
  },
];

export const FEATURES = [
  {
    no: '01',
    title: 'Open 24 / 7',
    text: "Breakfast at 4 AM, dinner at midnight. We never flip the sign — come whenever the craving hits. Hyderabad's only café that truly never sleeps.",
    art: 'clock',
    color: '#FFC94A',
  },
  {
    no: '02',
    title: 'Garden & waterfall',
    text: 'Lush greenery, a gentle waterfall and open-air tables — plus air-conditioned and lounge seating when the city heats up.',
    art: 'garden',
    color: '#C3DC8C',
  },
  {
    no: '03',
    title: 'Coffee with your face on it',
    text: "Send us a photo and watch it appear on your latte foam. Birthdays, dates, besties — it's the most shareable cup in town.",
    art: 'print',
    color: '#F6B7B0',
  },
  {
    no: '04',
    title: 'Work, watch, hang out',
    text: 'Free Wi-Fi, comfy corners, a private dining room and live sports screenings. Bring the laptop — or the whole gang.',
    art: 'lounge',
    color: '#A9DBEA',
  },
];

export const STATS = [
  { value: 24, suffix: '/7', label: 'Hours we never close', decimals: 0 },
  { value: 4.3, suffix: '★', label: 'Swiggy Dineout rating', decimals: 1 },
  { value: 1.9, suffix: 'K+', label: 'Ratings on District', decimals: 1 },
  { value: 365, suffix: '', label: 'Days a year, open', decimals: 0 },
];

export const GALLERY = [
  { photo: '/photos/gallery-1.jpg', art: 'print', color: '#F6B7B0', caption: 'Latte art selfies' },
  { photo: '/photos/gallery-2.jpg', art: 'garden', color: '#C3DC8C', caption: 'Garden tables' },
  { photo: '/photos/gallery-3.jpg', art: 'pizza', color: '#F9A66C', caption: '3 AM pizza runs' },
  { photo: '/photos/gallery-4.jpg', art: 'night', color: '#232C5A', caption: 'Midnight coffee' },
  { photo: '/photos/gallery-5.jpg', art: 'iced', color: '#A9DBEA', caption: 'Iced & happy' },
  { photo: '/photos/gallery-6.jpg', art: 'cake', color: '#FFC94A', caption: 'Sweet endings' },
  { photo: '/photos/gallery-7.jpg', art: 'matcha', color: '#C3DC8C', caption: "Matcha o'clock" },
  { photo: '/photos/gallery-8.jpg', art: 'lounge', color: '#F6E3C6', caption: 'Lounge corners' },
  { photo: '/photos/gallery-9.jpg', art: 'pasta', color: '#F6E3C6', caption: 'Pasta night' },
];

export const MARQUEE = [
  'Open 24/7',
  'Iced lattes',
  'Photo-print coffee',
  'Matcha bar',
  'Garden & waterfall',
  'Pizzas & pastas',
  'Biscoff cheesecake',
  'Free Wi-Fi',
];
