
import type { Product, Category, Order } from './types';
import {
  Cpu,
  Unplug,
  DraftingCompass,
  RollerCoaster,
  Car,
  Lightbulb,
  Webhook,
  Recycle,
  Shirt,
  Flame,
  Wind,
  Droplets,
  Building,
  GlassWater,
  Leaf,
  Container,
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const categories: Category[] = [
  { id: 'metal-scrap', name: 'Metal Scrap', icon: Recycle },
  { id: 'plastic-regrind', name: 'Plastic Regrind', icon: RollerCoaster },
  { id: 'textile-remnants', name: 'Textile Remnants', icon: Shirt },
  { id: 'chemical-solvents', name: 'Used Solvents', icon: Droplets },
  { id: 'fly-ash', name: 'Fly Ash', icon: Wind },
  { id: 'slag', name: 'Slag', icon: Flame },
  { id: 'e-waste', name: 'E-Waste', icon: Unplug },
  { id: 'construction-demolition', name: 'C&D Waste', icon: Building },
  { id: 'glass-cullet', name: 'Glass Cullet', icon: GlassWater },
  { id: 'packaging-waste', name: 'Packaging Waste', icon: Container },
];

export const products: Product[] = [
  {
    id: 'aluminum-scrap-6061-1',
    name: 'Aluminum 6061 Scrap',
    category: 'Metal Scrap',
    description:
      'High-quality aluminum 6061 scrap from CNC machining operations. Clean, unmixed, and free of contaminants. Ideal for recycling into new aluminum products.',
    price: 8500.0,
    priceUnit: 'ton',
    license: 'LIC-IND-AL-2023-001',
    companyRegistrationNumber: 'U27100MH2001PTC130456',
    currency: 'INR',
    images: [
        PlaceHolderImages.find(p => p.id === 'aluminum-scrap-1')!.imageUrl,
        PlaceHolderImages.find(p => p.id === 'aluminum-scrap-2')!.imageUrl,
        PlaceHolderImages.find(p => p.id === 'aluminum-scrap-3')!.imageUrl
    ],
    quantity: 10,
    specifications: [
      { name: 'Alloy', value: '6061' },
      { name: 'Form', value: 'Turnings and chips' },
      { name: 'Purity', value: '99.5%+' },
    ],
    factory: { id: 'factory-a', name: 'Innovate Machining Co.' },
    reviews: [
        { id: 'rev-1', author: 'Rajesh Kumar', avatar: 'https://i.pravatar.cc/150?u=rajesh', rating: 5, comment: 'Excellent quality scrap, very clean. Perfect for our foundry.' },
        { id: 'rev-2', author: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?u=priya', rating: 4, comment: 'Good material, but shipment was slightly delayed. Overall satisfied.' },
        { id: 'rev-extra-1', author: 'Manoj Tiwari', avatar: 'https://i.pravatar.cc/150?u=manoj', rating: 5, comment: 'Consistently high quality. Our go-to supplier for aluminum scrap.' },
        { id: 'rev-extra-11', author: 'Anjali Desai', avatar: 'https://i.pravatar.cc/150?u=anjali', rating: 5, comment: 'Very happy with the purchase. The material is exactly as described.' },
        { id: 'rev-extra-12', author: 'Sanjay Gupta', avatar: 'https://i.pravatar.cc/150?u=sanjay', rating: 4, comment: 'Good value for the price. We will be ordering again.' }
    ],
    details: `
### History
Aluminum 6061 is a precipitation-hardened aluminum alloy, containing magnesium and silicon as its major alloying elements. Originally developed in 1935, it's one of the most common alloys of aluminum for general-purpose use. Its good mechanical properties and excellent corrosion resistance make it a staple in manufacturing. The scrap generated is a direct result of subtractive manufacturing processes like CNC machining.

### Common Uses
Recycled 6061 scrap is a valuable commodity. After being melted down and purified, it can be used to produce:
- **New Billet Stock:** For further machining into new parts.
- **Automotive Components:** Such as chassis, panels, and engine parts.
- **Architectural Applications:** Including window frames, door frames, and roofing.
- **Consumer Goods:** Like bicycle frames, scuba tanks, and electronics casings.
`
  },
  {
    id: 'abs-plastic-regrind-2',
    name: 'ABS Plastic Regrind',
    category: 'Plastic Regrind',
    description:
      'Black ABS regrind from injection molding overruns. Consistent particle size and quality. Suitable for manufacturing non-critical components, casings, or as a blend.',
    price: 3000.0,
    priceUnit: 'ton',
    license: 'LIC-IND-PL-2023-002',
    companyRegistrationNumber: 'U25209DL2005PTC139688',
    currency: 'INR',
    images: [
        PlaceHolderImages.find(p => p.id === 'abs-regrind-1')!.imageUrl,
        PlaceHolderImages.find(p => p.id === 'abs-regrind-2')!.imageUrl,
        PlaceHolderImages.find(p => p.id === 'abs-regrind-3')!.imageUrl
    ],
    quantity: 25,
    specifications: [
      { name: 'Material', value: 'Acrylonitrile Butadiene Styrene (ABS)' },
      { name: 'Color', value: 'Black' },
      { name: 'Form', value: 'Regrind (5-8mm)' },
      { name: 'Source', value: 'Post-industrial automotive parts' },
    ],
    factory: { id: 'factory-b', name: 'PlastiForm Industries' },
    reviews: [
        { id: 'rev-3', author: 'Amit Singh', avatar: 'https://i.pravatar.cc/150?u=amit', rating: 4, comment: 'Consistent quality and good value for money.' },
        { id: 'rev-extra-2', author: 'Rina Das', avatar: 'https://i.pravatar.cc/150?u=rina', rating: 4, comment: 'Good for non-cosmetic parts. Helps us reduce costs.' },
        { id: 'rev-extra-13', author: 'Arun Verma', avatar: 'https://i.pravatar.cc/150?u=arun', rating: 3, comment: 'Some impurities found, but acceptable for the price.' },
        { id: 'rev-extra-14', author: 'Meena Kumari', avatar: 'https://i.pravatar.cc/150?u=meena', rating: 5, comment: 'Fast delivery and the material works great in our molding machines.' }
    ],
    details: `
### History
ABS (Acrylonitrile Butadiene Styrene) is a common thermoplastic polymer. Its development began in the 1940s, and it became commercially available in the 1950s. It's known for its impact resistance and toughness. This regrind is a by-product of injection molding, where excess material, known as "runner" or "sprue," is ground down for reuse.

### Common Uses
ABS regrind is a cost-effective alternative to virgin plastic for a variety of applications:
- **Internal Components:** Used for parts not visible to the end-user.
- **Housings & Casings:** For electronics or small appliances where aesthetics are less critical.
- **Blended Material:** Mixed with virgin ABS to reduce costs without significantly impacting performance for certain applications.
- **Prototyping:** Ideal for creating test parts and prototypes.
`
  },
  {
    id: 'denim-textile-remnants-4',
    name: 'Denim Textile Remnants',
    category: 'Textile Remnants',
    description:
      'Assorted sizes of denim fabric remnants from jean manufacturing. Ideal for crafting, quilting, or production of smaller textile goods. 100% cotton.',
    price: 1500.0,
    priceUnit: 'kg',
    license: 'LIC-IND-TX-2023-004',
    companyRegistrationNumber: 'L17111TN1985PLC011520',
    currency: 'INR',
    images: [
        PlaceHolderImages.find(p => p.id === 'denim-remnants-1')!.imageUrl,
        PlaceHolderImages.find(p => p.id === 'denim-remnants-2')!.imageUrl,
        PlaceHolderImages.find(p => p.id === 'denim-remnants-3')!.imageUrl
    ],
    quantity: 100,
    specifications: [
      { name: 'Material', value: '100% Cotton Denim' },
      { name: 'Weight', value: '10-14 oz' },
      { name: 'Size', value: 'Varies (scraps and end-of-roll)' },
    ],
    factory: { id: 'factory-d', name: 'WeaveTech Solutions' },
    reviews: [
      { id: 'rev-extra-3', author: 'Creative Crafts Ltd.', avatar: 'https://i.pravatar.cc/150?u=crafts', rating: 5, comment: 'Fantastic for making unique bags and accessories. Love the variety.' },
      { id: 'rev-extra-4', author: 'Eco Threads', avatar: 'https://i.pravatar.cc/150?u=eco', rating: 4, comment: 'Good quality denim, though sizes are very inconsistent as expected.' },
      { id: 'rev-extra-16', author: 'Fashion Upcyclers', avatar: 'https://i.pravatar.cc/150?u=fashion', rating: 5, comment: 'A treasure trove for our upcycling projects! Will buy again.' },
      { id: 'rev-extra-17', author: 'Student Designers', avatar: 'https://i.pravatar.cc/150?u=design', rating: 4, comment: 'Great for student projects, very affordable.' },
      { id: 'rev-extra-18', author: 'DIY Hub', avatar: 'https://i.pravatar.cc/150?u=diy', rating: 4, comment: 'A good mix of light and heavy weight denim.' }
    ],
    details: `
### History
Denim, a sturdy cotton twill fabric, has been produced for centuries, famously used for workwear by American gold miners in the 19th century. The process of manufacturing jeans creates significant off-cuts and remnants. These by-products are pure, unused fabric.

### Common Uses
- **Upcycled Fashion:** Used to create patches, pockets, or entire new garments like skirts and jackets.
- **Accessories:** Perfect for making bags, hats, wallets, and belts.
- **Home Decor:** Can be crafted into pillows, rugs, and upholstery.
- **Insulation:** Can be processed into shoddy and used as a natural fiber insulation material.
`
  },
  {
    id: 'steel-slag-aggregate-5',
    name: 'Steel Slag Aggregate',
    category: 'Slag',
    description:
      'Electric Arc Furnace (EAF) steel slag. A hard, dense aggregate suitable for use in construction, road base, and asphalt. Excellent binding properties.',
    price: 950.0,
    priceUnit: 'ton',
    license: 'LIC-IND-ST-2023-005',
    companyRegistrationNumber: 'U27100WB1999PTC088934',
    currency: 'INR',
    images: [PlaceHolderImages.find(p => p.id === 'steel-slag-1')!.imageUrl],
    quantity: 200,
    specifications: [
      { name: 'Source', value: 'Electric Arc Furnace' },
      { name: 'Size', value: '0-75mm (graded)' },
      { name: 'Density', value: 'Approx. 1.6 t/m³' },
    ],
    factory: { id: 'factory-e', name: 'MegaSteel Works' },
    reviews: [
        { id: 'rev-6', author: 'Anil Mehta', avatar: 'https://i.pravatar.cc/150?u=anil', rating: 5, comment: 'Very strong and effective for road base. Will buy again.' },
        { id: 'rev-extra-19', author: 'Infra Builders', avatar: 'https://i.pravatar.cc/150?u=infra', rating: 5, comment: 'Cost-effective and environmentally friendly solution for our projects.' },
        { id: 'rev-extra-20', author: 'Civic Contractors', avatar: 'https://i.pravatar.cc/150?u=civic', rating: 4, comment: 'Good material, but requires careful handling due to sharp edges.' }
    ],
    details: `
### History
Slag is a by-product of smelting ores to purify metals. Steel slag, specifically, is produced during the separation of the molten steel from impurities. For years it was considered waste, but its excellent mechanical properties have made it a valuable construction material.

### Common Uses
- **Road Construction:** Used as a granular base or in asphalt mixes, providing superior durability and skid resistance.
- **Concrete Aggregate:** Can replace natural stone aggregate in concrete, enhancing strength.
- **Soil Stabilization:** Its chemical properties can help improve the stability of certain soils.
- **Railway Ballast:** Its high density and toughness make it ideal for supporting railway tracks.
`
  },
  {
    id: 'pcb-trim-e-waste-6',
    name: 'PCB Trim & Offcuts',
    category: 'E-Waste',
    description:
      'Trimmings and offcuts from FR-4 printed circuit board manufacturing. Contains copper, fiberglass, and trace amounts of precious metals. For specialized e-waste recyclers.',
    price: 6000.0,
    priceUnit: 'kg',
    license: 'LIC-IND-EW-2023-006',
    companyRegistrationNumber: 'U32109KA2004PTC034986',
    currency: 'INR',
    images: [
        PlaceHolderImages.find(p => p.id === 'pcb-ewaste-1')!.imageUrl,
        PlaceHolderImages.find(p => p.id === 'pcb-ewaste-2')!.imageUrl,
        PlaceHolderImages.find(p => p.id === 'pcb-ewaste-3')!.imageUrl
    ],
    quantity: 5,
    specifications: [
      { name: 'Board Material', value: 'FR-4' },
      { name: 'Contains', value: 'Copper, Fiberglass, Resin' },
      { name: 'Form', value: 'Irregular shapes and sizes' },
    ],
    factory: { id: 'factory-c', name: 'CircuitWorks Global' },
    reviews: [
        { id: 'rev-7', author: 'Geeta Iyer', avatar: 'https://i.pravatar.cc/150?u=geeta', rating: 4, comment: 'Good source for copper recovery.' },
        { id: 'rev-extra-21', author: 'Precious Metal Recyclers', avatar: 'https://i.pravatar.cc/150?u=pmr', rating: 5, comment: 'High yield of precious metals from this e-waste. Very profitable.' },
        { id: 'rev-extra-22', author: 'E-Cycle Solutions', avatar: 'https://i.pravatar.cc/150?u=ecycle', rating: 4, comment: 'Clean material, makes our recycling process much more efficient.' }
    ],
    details: `
### History
Printed Circuit Boards (PCBs) are the foundation of modern electronics. FR-4 is a glass-reinforced epoxy laminate material, and it's the most common base for PCBs. Manufacturing PCBs involves etching and cutting, which produces these offcuts. They are a concentrated source of metals.

### Common Uses
This material is not for general use, but for specialized recycling facilities that can perform:
- **Metal Recovery:** Chemical and smelting processes are used to extract copper, gold, silver, and palladium.
- **Energy Recovery:** The resin content can be incinerated in controlled environments to produce energy.
- **Composite Material:** In some experimental applications, the ground material is used as a filler in other composites.
`
  },
  {
    id: 'used-acetone-solvent-7',
    name: 'Used Acetone Solvent',
    category: 'Used Solvents',
    description:
      'Used acetone from industrial cleaning processes. Contains minor impurities. Can be re-distilled for reuse or used as a fuel source. Sold in 200L drums.',
    price: 980.0,
    priceUnit: 'kg',
    license: 'LIC-IND-CH-2023-007',
    companyRegistrationNumber: 'U24110GJ1973PLC002345',
    currency: 'INR',
    images: [PlaceHolderImages.find(p => p.id === 'acetone-drum-1')!.imageUrl],
    quantity: 0,
    specifications: [
      { name: 'Chemical', value: 'Acetone (approx. 90%)' },
      { name: 'Impurities', value: 'Oils, particulates' },
      { name: 'Packaging', value: '200L Steel Drums' },
    ],
    factory: { id: 'factory-b', name: 'PlastiForm Industries' },
    reviews: [
        { id: 'rev-extra-5', author: 'ReChem Solutions', avatar: 'https://i.pravatar.cc/150?u=rechem', rating: 3, comment: 'Requires significant distillation before reuse, but price is fair for the quality.' },
        { id: 'rev-extra-23', author: 'Fuel Blenders Inc.', avatar: 'https://i.pravatar.cc/150?u=fuel', rating: 4, comment: 'Good calorific value for our fuel blends.' },
        { id: 'rev-extra-30', author: 'ChemRecycle', avatar: 'https://i.pravatar.cc/150?u=chem', rating: 4, comment: 'Good for basic solvent recovery. Will purchase again.'}
    ],
    details: `
### History
Acetone is a widely used solvent in many industries for cleaning and as a chemical intermediate. Once used, it becomes contaminated. Disposing of used solvents is expensive and environmentally harmful. Recycling it is a far better alternative.

### Common Uses
- **Solvent Recovery:** The primary use is distillation to recover purified acetone, which can be reused in industrial processes.
- **Blended Fuels:** Its high flammability allows it to be used as a component in alternative fuels for kilns and furnaces.
- **Paint Stripper:** Can be used as a cheap, effective paint stripper for less sensitive applications.
`
  },
  {
    id: 'coal-fly-ash-8',
    name: 'Coal Fly Ash',
    category: 'Fly Ash',
    description:
      'Class F fly ash from a coal-fired power plant. A pozzolanic material excellent for use as a partial replacement for Portland cement in concrete production.',
    price: 820.0,
    priceUnit: 'ton',
    license: 'LIC-IND-FA-2023-008',
    companyRegistrationNumber: 'L40101DL1975GOI007966',
    currency: 'INR',
    images: [PlaceHolderImages.find(p => p.id === 'fly-ash-1')!.imageUrl],
    quantity: 500,
    specifications: [
      { name: 'Class', value: 'F' },
      { name: 'Source', value: 'Coal-fired Power Generation' },
      { name: 'Use', value: 'Concrete Additive, Geopolymer' },
    ],
    factory: { id: 'factory-f', name: 'PowerGen Corp' },
    reviews: [
        { id: 'rev-8', author: 'Deepak Rao', avatar: 'https://i.pravatar.cc/150?u=deepak', rating: 5, comment: 'High quality fly ash, improves the concrete strength significantly.' },
        { id: 'rev-extra-6', author: 'InfraBuild Concrete', avatar: 'https://i.pravatar.cc/150?u=infrabuild', rating: 5, comment: 'Excellent pozzolanic activity. We use it in all our high-strength mixes.' },
        { id: 'rev-extra-24', author: 'Green Concrete Co.', avatar: 'https://i.pravatar.cc/150?u=green', rating: 5, comment: 'Reduces our carbon footprint and improves workability. Great product.' }
    ],
    details: `
### History
Fly ash is a fine powder that is a by-product of burning pulverized coal in electric generation power plants. It was once considered a waste product and disposed of in landfills, but research in the 20th century revealed its valuable pozzolanic properties.

### Common Uses
- **Concrete Production:** Replaces a portion of Portland cement, improving concrete's workability, strength, and durability while reducing its carbon footprint.
- **Soil Stabilization:** Used to improve the load-bearing capacity of soil for road construction.
- **Bricks and Blocks:** Used to manufacture lightweight bricks and blocks.
`
  },
  {
    id: 'crushed-concrete-aggregate-9',
    name: 'Crushed Concrete Aggregate',
    category: 'C&D Waste',
    description:
      'Recycled concrete aggregate from demolition projects. Screened and graded for use as a base layer for roads, foundations, and landscaping.',
    price: 800.0,
    priceUnit: 'ton',
    license: 'LIC-IND-CD-2023-009',
    companyRegistrationNumber: 'U45201DL2008PTC179929',
    currency: 'INR',
    images: [PlaceHolderImages.find(p => p.id === 'crushed-concrete-1')!.imageUrl],
    quantity: 1000,
    specifications: [
      { name: 'Material', value: 'Recycled Concrete' },
      { name: 'Size', value: '20-40mm graded' },
      { name: 'Compliance', value: 'IS 383' },
      { name: 'Source', value: 'Urban Demolition Sites' },
    ],
    factory: { id: 'factory-g', name: 'Reclaim Aggregates' },
    reviews: [
      { id: 'rev-extra-7', author: 'GreenPath Construction', avatar: 'https://i.pravatar.cc/150?u=greenpath', rating: 5, comment: 'Great sustainable alternative to virgin aggregate. Quality is consistent.' },
      { id: 'rev-extra-25', author: 'EcoLandscapers', avatar: 'https://i.pravatar.cc/150?u=ecoland', rating: 4, comment: 'Perfect for drainage layers in our landscaping projects.' },
      { id: 'rev-extra-31', author: 'RoadBuilders Inc.', avatar: 'https://i.pravatar.cc/150?u=road', rating: 4, comment: 'Good compaction properties. A reliable, eco-friendly choice.'}
    ],
    details: `
### History
As cities evolve, old buildings are demolished, generating massive amounts of concrete waste. For decades, this was sent to landfills. Today, it is crushed and recycled into an aggregate, providing a sustainable alternative to quarrying new rock.

### Common Uses
- **Road Base:** The most common use, providing a stable foundation for new roads and pavements.
- **Pipe Bedding:** Used as a stable base for laying underground pipes.
- **Landscaping:** Used for creating driveways, paths, and as a drainage material.
`
  },
  {
    id: 'mixed-color-glass-cullet-10',
    name: 'Mixed-Color Glass Cullet',
    category: 'Glass Cullet',
    description:
      'Clean, furnace-ready glass cullet from a bottling plant. Mixed colors (flint, amber, green). Ideal for fiberglass production or as a supplementary material in glass manufacturing.',
    price: 3500.0,
    priceUnit: 'ton',
    license: 'LIC-IND-GL-2023-010',
    companyRegistrationNumber: 'L26100MH1944PLC004153',
    currency: 'INR',
    images: [PlaceHolderImages.find(p => p.id === 'glass-cullet-1')!.imageUrl],
    quantity: 40,
    specifications: [
      { name: 'Composition', value: 'Soda-Lime Glass' },
      { name: 'Color', value: 'Mixed (Flint, Amber, Green)' },
      { name: 'Contaminants', value: 'Less than 0.1% (paper, metal)' },
      { name: 'Size', value: '10-50mm pieces' },
    ],
    factory: { id: 'factory-h', name: 'Beverage Bottlers Inc.' },
    reviews: [
      { id: 'rev-extra-8', author: 'Insulation Makers Ltd.', avatar: 'https://i.pravatar.cc/150?u=insulation', rating: 4, comment: 'Good quality cullet for our fiberglass insulation. Some minor sorting required.' },
      { id: 'rev-extra-26', author: 'Art Glass Studio', avatar: 'https://i.pravatar.cc/150?u=artglass', rating: 4, comment: 'Interesting mix of colors for our decorative glass projects.' },
      { id: 'rev-extra-32', author: 'Creative Recyclers', avatar: 'https://i.pravatar.cc/150?u=creative', rating: 5, comment: 'Clean cullet, very little contamination. Highly recommend.'}
    ],
    details: `
### History
Glass is infinitely recyclable. Cullet is the term for recycled glass. Using cullet in glass production saves energy because it melts at a lower temperature than raw materials. This mixed-color cullet comes from a bottling facility, a major source of clean, high-quality recycled glass.

### Common Uses
- **New Glass Containers:** Although mixed-color is usually used for amber or green glass.
- **Fiberglass Production:** A major end-market for recycled glass.
- **Abrasives:** Crushed glass is used for sandblasting.
- **Decorative Applications:** Used in landscaping, countertops, and flooring.
`
  },
  {
    id: 'cardboard-packaging-scrap-12',
    name: 'Cardboard Packaging Scrap',
    category: 'Packaging Waste',
    description:
      'Baled corrugated cardboard (OCC) from a large distribution center. Clean, dry, and free of plastic or other contaminants. Ready for pulping.',
    price: 900.0,
    priceUnit: 'ton',
    license: 'LIC-IND-PK-2023-012',
    companyRegistrationNumber: 'U21010DL2002PTC117531',
    currency: 'INR',
    images: [PlaceHolderImages.find(p => p.id === 'cardboard-bales-1')!.imageUrl],
    quantity: 300,
    specifications: [
      { name: 'Material', value: 'Old Corrugated Cardboard (OCC)' },
      { name: 'Grade', value: '#11' },
      { name: 'Bale Weight', value: 'Approx. 500 kg' },
    ],
    factory: { id: 'factory-j', name: 'Logistics Hub Express' },
    reviews: [
      { id: 'rev-extra-10', author: 'PaperMill Recyclers', avatar: 'https://i.pravatar.cc/150?u=papermill', rating: 5, comment: 'Excellent quality OCC bales. Very clean and well-compacted.' },
      { id: 'rev-extra-28', author: 'Packaging Solutions', avatar: 'https://i.pravatar.cc/150?u=packsol', rating: 4, comment: 'Good quality recycled material for our new boxes.' },
      { id: 'rev-extra-29', author: 'Green Packaging', avatar: 'https://i.pravatar.cc/150?u=greenpack', rating: 5, comment: 'Consistent supply and quality. Highly recommended.' }
    ],
    details: `
### History
The rise of e-commerce and global trade has led to a massive increase in the use of corrugated cardboard boxes. Old Corrugated Cardboard (OCC) is one of the most recycled materials in the world. This scrap comes directly from a distribution hub, making it a very clean and desirable source.

### Common Uses
- **New Paper Products:** The primary use is to be pulped and reformed into new paper products, especially linerboard for new cardboard boxes.
- **Molded Pulp Packaging:** Used to create protective packaging like egg cartons or electronics trays.
- **Animal Bedding:** Shredded cardboard can be used as a highly absorbent animal bedding.
`
  },
];

export const orders: Order[] = [
    { id: 'ORD-001', productName: 'Aluminum 6061 Scrap', customerName: 'John Doe', date: '2023-10-26', status: 'Delivered', total: 10000 },
    { id: 'ORD-002', productName: 'ABS Plastic Regrind', customerName: 'Jane Smith', date: '2023-10-25', status: 'Shipped', total: 4500 },
    { id: 'ORD-004', productName: 'Denim Textile Remnants', customerName: 'Mary Johnson', date: '2023-10-23', status: 'Delivered', total: 2500 },
    { id: 'ORD-005', productName: 'Steel Slag Aggregate', customerName: 'David Williams', date: '2023-10-22', status: 'Cancelled', total: 3500 },
    { id: 'ORD-006', productName: 'PCB Trim & Offcuts', customerName: 'Sarah Brown', date: '2023-10-21', status: 'Shipped', total: 8000 },
];

export const salesData = [
  { month: 'Jan', sales: 250000 },
  { month: 'Feb', sales: 280000 },
  { month: 'Mar', sales: 190000 },
  { month: 'Apr', sales: 410000 },
  { month: 'May', sales: 450000 },
  { month: 'Jun', sales: 250000 },
  { month: 'Jul', sales: 600000 },
  { month: 'Aug', sales: 690000 },
  { month: 'Sep', sales: 400000 },
  { month: 'Oct', sales: 340000 },
  { month: 'Nov', sales: 560000 },
  { month: 'Dec', sales: 890000 },
];

function generateDailySalesData(): { date: string; sales: number }[] {
  const data = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2023-12-31');
  let currentDate = startDate;

  // Monthly base sales to follow the user-provided trend
  const monthlyTargets = [
    250000, 280000, 190000, 410000, 450000, 250000, 
    600000, 690000, 400000, 340000, 560000, 890000
  ];
  
  // A rough estimate of days in each month
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  while (currentDate <= endDate) {
    const month = currentDate.getMonth();
    const dayOfWeek = currentDate.getDay(); // 0 for Sunday, 6 for Saturday

    // Use monthly target to calculate an average daily sale for that month
    const dailyAverage = monthlyTargets[month] / daysInMonth[month];

    // Add weekly seasonality (e.g., lower sales on weekends)
    let weeklyFactor = 1.0;
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
      weeklyFactor = 0.7;
    } else if (dayOfWeek === 5) { // Friday
      weeklyFactor = 1.2;
    }

    // Add some random noise for realism
    const randomFactor = 0.8 + Math.random() * 0.4; // between 0.8 and 1.2

    const sales = Math.floor(dailyAverage * weeklyFactor * randomFactor);

    data.push({
      date: currentDate.toISOString().split('T')[0],
      sales: sales,
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
}

export const dailySalesData = generateDailySalesData();

export const productSalesData = [
  { name: 'Al. Scrap', sales: 120000, fill: "var(--color-chart-1)" },
  { name: 'ABS Regrind', sales: 98000, fill: "var(--color-chart-2)" },
  { name: 'Denim', sales: 79000, fill: "var(--color-chart-4)" },
  { name: 'Slag', sales: 65000, fill: "var(--color-chart-5)" },
  { name: 'E-Waste', sales: 45000, fill: "var(--color-chart-1)" },
];
