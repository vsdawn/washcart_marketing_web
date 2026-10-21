export type ServiceKind = 'wash' | 'dry' | 'iron' | 'shoe' | 'blanket' | 'curtain';

export type Service = {
  kind: ServiceKind;
  title: string;
  text: string;
  price: string;
  image: string;
  steps: { title: string; text: string }[];
};

export const services: Service[] = [
  {
    kind: 'wash',
    image: '/images/services/wash.jpg',
    title: 'Wash & Fold',
    text: 'Everyday clothes washed with premium detergents, dried and neatly folded.',
    price: 'From $1.50 / lb',
    steps: [
      { title: 'Sort & tag', text: 'Every item is tagged and sorted by colour and fabric type.' },
      { title: 'Gentle wash', text: 'Machine washed at the right temperature with skin-friendly detergent.' },
      { title: 'Tumble dry', text: 'Low-heat drying keeps fabrics soft and prevents shrinking.' },
      { title: 'Fold & pack', text: 'Neatly folded and packed in a sealed, fresh-smelling bag.' },
    ],
  },
  {
    kind: 'dry',
    image: '/images/services/dry.jpg',
    title: 'Dry Cleaning',
    text: 'Suits, sarees, gowns and delicates cleaned with eco-friendly solvents.',
    price: 'From $6 / item',
    steps: [
      { title: 'Inspect', text: 'We check fabric labels, stains and any loose buttons or damage.' },
      { title: 'Pre-treat stains', text: 'Stains are treated by hand with fabric-specific solutions.' },
      { title: 'Solvent clean', text: 'Cleaned in eco-friendly solvent that protects colour and shape.' },
      { title: 'Press & hang', text: 'Finished, pressed and delivered on a hanger with a cover.' },
    ],
  },
  {
    kind: 'iron',
    image: '/images/services/iron.jpg',
    title: 'Steam Iron',
    text: 'Crisp, wrinkle-free finish using professional steam presses.',
    price: 'From $1 / item',
    steps: [
      { title: 'Check fabric', text: 'We set heat and steam level based on the garment’s fabric.' },
      { title: 'Steam relax', text: 'Steam relaxes fibres so wrinkles release without scorching.' },
      { title: 'Press & crease', text: 'Collars, cuffs and trouser creases are pressed to a sharp finish.' },
      { title: 'Hang or fold', text: 'Delivered on hangers or folded — your choice.' },
    ],
  },
  {
    kind: 'shoe',
    image: '/images/services/shoe.jpg',
    title: 'Shoe Care',
    text: 'Deep cleaning, deodorising and restoration for sneakers and leather shoes.',
    price: 'From $12 / pair',
    steps: [
      { title: 'Remove laces', text: 'Laces and insoles are removed and cleaned separately.' },
      { title: 'Brush & scrub', text: 'Soft brushes lift dirt from uppers, midsoles and outsoles.' },
      { title: 'Deodorise', text: 'Anti-bacterial treatment removes odour from the inside.' },
      { title: 'Condition & protect', text: 'Leather is conditioned and a protective coat is applied.' },
    ],
  },
  {
    kind: 'blanket',
    image: '/images/services/blanket.jpg',
    title: 'Blanket & Duvet Care',
    text: 'Heavy blankets, quilts and duvets deep-cleaned and sanitised.',
    price: 'From $15 / piece',
    steps: [
      { title: 'Dust & shake', text: 'Loose dust and allergens are removed before washing.' },
      { title: 'Deep wash', text: 'Washed in large-capacity machines so it cleans evenly.' },
      { title: 'Sanitise', text: 'Hot-air sanitising kills dust mites and bacteria.' },
      { title: 'Fluff & pack', text: 'Dried to full fluffiness and vacuum-packed for delivery.' },
    ],
  },
  {
    kind: 'curtain',
    image: '/images/services/curtain.jpg',
    title: 'Curtain & Upholstery',
    text: 'Curtains, sofa covers and cushion covers cleaned and pressed.',
    price: 'From $8 / panel',
    steps: [
      { title: 'Measure & tag', text: 'Each panel is measured and tagged so it comes back to the right window.' },
      { title: 'Dust removal', text: 'Built-up dust is vacuumed off before cleaning.' },
      { title: 'Fabric-safe clean', text: 'Washed or dry cleaned depending on the fabric and lining.' },
      { title: 'Steam finish', text: 'Steamed straight so it hangs perfectly again.' },
    ],
  },
];

export const faqCategories = ['All', 'Orders', 'Services', 'Delivery', 'Payments'] as const;

export type FaqCategory = Exclude<(typeof faqCategories)[number], 'All'>;

export const faqs: { q: string; a: string; category: FaqCategory }[] = [
  {
    category: 'Delivery',
    q: 'How does pickup and delivery work?',
    a: 'Book a slot in the Cleanova app or website. Our partner picks up your bag from your doorstep and delivers it back cleaned, usually within 24–48 hours.',
  },
  {
    category: 'Orders',
    q: 'Is there a minimum order amount?',
    a: 'The minimum order is $15. Orders above $30 get free pickup and delivery.',
  },
  {
    category: 'Services',
    q: 'What is the turnaround time for dry cleaning?',
    a: 'Dry cleaning typically takes 48–72 hours. Express 24-hour service is available for most garments at a small extra charge.',
  },
  {
    category: 'Services',
    q: 'Can you clean shoes made of suede or leather?',
    a: 'Yes. Our shoe care team handles sneakers, leather, suede and canvas, using separate products and methods for each material.',
  },
  {
    category: 'Services',
    q: 'How do you wash heavy blankets and duvets?',
    a: 'Blankets and duvets are washed in large-capacity machines, sanitised with hot air to remove dust mites, then dried until fully fluffy.',
  },
  {
    category: 'Services',
    q: 'Can you remove tough stains?',
    a: 'Our team pre-treats every stain by hand using fabric-specific solutions. Most stains come out completely; if one can’t be removed safely, we’ll tell you before going further.',
  },
  {
    category: 'Delivery',
    q: 'Can I track my order in real time?',
    a: 'Yes. The Cleanova app shows live tracking from pickup to the care centre and back to your door, with notifications at every step.',
  },
  {
    category: 'Orders',
    q: 'What if an item is damaged or lost?',
    a: 'Every item is tagged and tracked. In the rare case something goes wrong, contact support within 48 hours of delivery and we will compensate as per our care policy.',
  },
  {
    category: 'Orders',
    q: 'Can I reschedule or cancel a pickup?',
    a: 'You can reschedule or cancel for free up to 1 hour before your pickup slot, right from the app.',
  },
  {
    category: 'Payments',
    q: 'Which payment methods do you accept?',
    a: 'We accept all major credit and debit cards, digital wallets and cash on delivery.',
  },
  {
    category: 'Payments',
    q: 'When am I charged for my order?',
    a: 'Items are counted and weighed at the care centre, and you are charged only after we confirm the final bill in the app.',
  },
];

// Bengaluru areas we serve. `lines` controls how the name wraps inside the map circles.
export const serviceAreas: { name: string; lines: string[] }[] = [
  { name: 'Arekere', lines: ['Arekere'] },
  { name: 'BTM Layout', lines: ['BTM', 'Layout'] },
  { name: 'Koramangala', lines: ['Koramangala'] },
  { name: 'HSR Layout', lines: ['HSR', 'Layout'] },
  { name: 'Bellandur', lines: ['Bellandur'] },
  { name: 'Marathahalli', lines: ['Marathahalli'] },
  { name: 'Whitefield', lines: ['Whitefield'] },
  { name: 'Indiranagar', lines: ['Indiranagar'] },
  { name: 'Jayanagar', lines: ['Jayanagar'] },
  { name: 'JP Nagar', lines: ['JP Nagar'] },
  { name: 'Electronic City Phase I', lines: ['Electronic', 'City Phase I'] },
  { name: 'Electronic City Phase II', lines: ['Electronic', 'City Phase II'] },
];

// WhatsApp number in international format, digits only (country code + number, no "+" or spaces).
export const WHATSAPP_NUMBER = '917019065181';
export const whatsappLink = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
export const WHATSAPP_URL = whatsappLink('Hi Cleanova! I would like to book a laundry pickup.');

// Placeholder partner profiles (dummy names, stats and reviews) — replace with real partners before launch.
export type Partner = {
  slug: string;
  name: string;
  specialty: string;
  area: string;
  rating: number;
  reviews: number;
  years: number;
  orders: string;
  tags: string[];
  review: { text: string; by: string };
  topRated?: boolean;
};

export const partners: Partner[] = [
  {
    slug: 'mohan-rao',
    name: 'Mohan Rao',
    specialty: 'Dry Clean Specialist',
    area: 'Koramangala',
    rating: 4.9,
    reviews: 1284,
    years: 12,
    orders: '3.2k',
    tags: ['Suits & blazers', 'Silk sarees', 'Bridal wear'],
    review: { text: 'My wedding sherwani came back looking brand new. Truly careful work.', by: 'Ananya S.' },
    topRated: true,
  },
  {
    slug: 'lakshmi-narayan',
    name: 'Lakshmi Narayan',
    specialty: 'Saree & Silk Care Expert',
    area: 'Jayanagar',
    rating: 4.9,
    reviews: 967,
    years: 15,
    orders: '2.6k',
    tags: ['Kanjeevaram', 'Hand wash', 'Zari care'],
    review: { text: 'Trusted her with my mother’s Kanjeevaram — not a thread out of place.', by: 'Divya R.' },
    topRated: true,
  },
  {
    slug: 'arjun-shetty',
    name: 'Arjun Shetty',
    specialty: 'Shoe Care Specialist',
    area: 'Indiranagar',
    rating: 4.8,
    reviews: 742,
    years: 8,
    orders: '1.9k',
    tags: ['Sneakers', 'Leather', 'Suede'],
    review: { text: 'Restored my white sneakers perfectly. Looked straight out of the box.', by: 'Rahul M.' },
  },
  {
    slug: 'priya-menon',
    name: 'Priya Menon',
    specialty: 'Stain Removal Expert',
    area: 'HSR Layout',
    rating: 4.9,
    reviews: 1105,
    years: 10,
    orders: '2.8k',
    tags: ['Wine & oil', 'Ink', 'Delicates'],
    review: { text: 'Got a turmeric stain out of a cream kurta. I had given up on it!', by: 'Meera K.' },
    topRated: true,
  },
  {
    slug: 'ravi-kumar',
    name: 'Ravi Kumar',
    specialty: 'Steam Press Master',
    area: 'BTM Layout',
    rating: 4.8,
    reviews: 2310,
    years: 18,
    orders: '5.4k',
    tags: ['Formal shirts', 'Trousers', 'Uniforms'],
    review: { text: 'Sharpest creases in town. My office shirts have never looked better.', by: 'Karthik V.' },
  },
  {
    slug: 'farhan-ali',
    name: 'Farhan Ali',
    specialty: 'Blanket & Duvet Care',
    area: 'Whitefield',
    rating: 4.7,
    reviews: 538,
    years: 7,
    orders: '1.2k',
    tags: ['Duvets', 'Quilts', 'Sanitising'],
    review: { text: 'Heavy razai came back soft, fresh and fluffy. Great service.', by: 'Sneha P.' },
  },
  {
    slug: 'kavya-reddy',
    name: 'Kavya Reddy',
    specialty: 'Curtain & Upholstery Specialist',
    area: 'Electronic City',
    rating: 4.8,
    reviews: 611,
    years: 9,
    orders: '1.5k',
    tags: ['Curtains', 'Sofa covers', 'Cushions'],
    review: { text: 'Took down, cleaned and re-hung all our curtains in a day. Spotless.', by: 'Vikram N.' },
  },
  {
    slug: 'suresh-gowda',
    name: 'Suresh Gowda',
    specialty: 'Wash & Fold Lead',
    area: 'Marathahalli',
    rating: 4.8,
    reviews: 1892,
    years: 11,
    orders: '4.7k',
    tags: ['Daily wear', 'Kids’ clothes', 'Express 24h'],
    review: { text: 'Always on time and folded so neatly. Weekly laundry is sorted.', by: 'Pooja T.' },
  },
];
