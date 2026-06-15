import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Shutter Stories database...');

  // 1. Clean existing records
  await prisma.message.deleteMany();
  await prisma.projectStatus.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.category.deleteMany();
  await prisma.package.deleteMany();
  await prisma.service.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users (Admin & Client)
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const clientPasswordHash = await bcrypt.hash('client123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@shutterstories.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      name: 'Devan Singh (Chief Photographer)',
    },
  });

  const client = await prisma.user.create({
    data: {
      email: 'client@shutterstories.com',
      passwordHash: clientPasswordHash,
      role: 'CLIENT',
      name: 'Sophia & Liam',
    },
  });

  console.log('Users created:');
  console.log(`- Admin: admin@shutterstories.com (admin123)`);
  console.log(`- Client: client@shutterstories.com (client123)`);

  // 3. Create Categories
  const categories = [
    { name: 'Wedding Stories', slug: 'weddings' },
    { name: 'Pre-Wedding Films', slug: 'pre-weddings' },
    { name: 'Engagement Stories', slug: 'engagements' },
    { name: 'Cinematic Reels', slug: 'reels' },
    { name: 'Corporate Narrative', slug: 'corporate' },
  ];

  const createdCategories: any[] = [];
  for (const cat of categories) {
    const dbCat = await prisma.category.create({ data: cat });
    createdCategories.push(dbCat);
  }
  console.log(`Created ${createdCategories.length} categories.`);

  // Find category IDs for seeding portfolio
  const getCatId = (slug: string) => createdCategories.find(c => c.slug === slug)?.id || '';

  // 4. Create Services
  const services = [
    { name: 'Luxury Wedding Stories', description: 'Editorial fine-art wedding photography and cinematic documentary-style filmmaking that preserves raw emotions.' },
    { name: 'Pre-Wedding Cinematic Films', description: 'Story-driven pre-wedding films shot across global destinations, tailored to your romance.' },
    { name: 'High-Fashion Engagements', description: 'Premium capture of intimate engagement proposals and celebrations with editorial style.' },
    { name: 'Cinematic Reels & Short Stories', description: 'Bespoke high-impact vertical edits designed for social sharing, crafted with micro-sound design.' },
    { name: 'Corporate Narrative & Commercials', description: 'Luxury brand storytelling, corporate event coverages, and premium high-end promotional videos.' }
  ];

  for (const s of services) {
    await prisma.service.create({ data: s });
  }

  // 5. Create Packages
  const packages = [
    {
      name: 'Silver',
      price: 150000,
      description: 'Luxury photography coverage for intimate ceremonies and editorial visual stories.',
      features: '1 Lead Editorial Photographer;1 Cinematic Filmmaker;8 Hours Event Coverage;150 Digitally Retouched Photos;3-Min Cinematic Highlight Film;Online Private Gallery (6 Months Access)',
    },
    {
      name: 'Gold',
      price: 350000,
      description: 'The perfect cinematic and editorial balance for standard grand weddings.',
      features: '2 Senior Photographers;2 Cinematic Filmmakers;1 Senior drone pilot;Full Day Coverage (Up to 14 Hours);350 Retouched High-Res Photos;5-Min Cinematic Trailer;Full Length Documentary Film;Online Private Gallery (12 Months Access)',
    },
    {
      name: 'Platinum',
      price: 600000,
      description: 'The ultimate editorial visual legacy package. No limits, absolute luxury storytelling.',
      features: '3 Editorial Photographers;3 Cinematic Filmmakers;Multi-Day Coverage;4k Cinematic Aerial Drone Coverage;500+ Editorial Retouched Photos;10-Min Cinematic Trailer & 45-Min Feature Film;Hardcover Premium Layflat Storybook Album;Lifetime Access Private Portal;Pre-Wedding Story Session Included',
    },
    {
      name: 'Custom Package',
      price: 0,
      description: 'Fully tailored luxury bespoke plan matching your unique specifications.',
      features: 'Selectable Photographers;Selectable Hours;Custom Albums;Global Destination Coverages;Pre-Wedding Shoots;Custom Post-Production Colors',
    }
  ];

  const dbPkgs = [];
  for (const p of packages) {
    const dbPkg = await prisma.package.create({ data: p });
    dbPkgs.push(dbPkg);
  }
  const goldPkgId = dbPkgs.find(p => p.name === 'Gold')?.id || '';

  // 6. Create Testimonials
  const testimonials = [
    {
      clientName: 'Aishwarya & Rohan',
      clientRole: 'Udaipur Palace Wedding',
      rating: 5,
      reviewText: 'Shutter Stories did not just take photos; they created cinematic history for our family. Every frame looks like a high-fashion Vogue editorial. The team was invisible yet captured the rawest emotional moments.',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    },
    {
      clientName: 'Meera & Dev',
      clientRole: 'Lake Como Story',
      rating: 5,
      reviewText: 'We cried watching our pre-wedding cinematic film! They managed to capture the poetry in our relationship. Absolutely world-class team and professional handling.',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    },
    {
      clientName: 'Sarah & Keith',
      clientRole: 'Goa Beach Celebration',
      rating: 5,
      reviewText: 'From booking to client portal downloads, the journey was luxurious and seamless. The final photos were like dreamscapes. High-res files downloaded in clicks. Outstanding client care!',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    }
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  // 7. Create Blogs
  const blogs = [
    {
      title: 'The Art of Directing a Cinematic Wedding Film',
      content: '<p>A wedding film is not a chronological list of events. It is a cinematic tapestry of fleeting glances, heavy tears, and soft whispers. In this guide, we break down our approach to lighting, lens choices, and capturing authentic motion...</p>',
      featuredImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      category: 'Filmmaking',
      tags: 'Wedding Film,Cinematography,Behind The Scenes',
      authorId: admin.id,
      seoTitle: 'Cinematic Wedding Filmmaking Guide | Shutter Stories',
      seoDesc: 'Learn the secrets behind creating high-end luxury cinematic wedding documentaries, lens options and soundscapes.',
    },
    {
      title: 'Planning Your Luxury Destination Pre-Wedding Shoot',
      content: '<p>From Udaipur palaces to Lake Como villas, selecting the right backdrop is only the first step. Creating matching wardrobes, analyzing lighting conditions, and establishing a narrative theme is what turns images into cinematic art...</p>',
      featuredImage: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800',
      category: 'Destination',
      tags: 'Pre-Wedding,Lake Como,Travel',
      authorId: admin.id,
      seoTitle: 'Destination Pre-Wedding Planning Guide | Shutter Stories',
      seoDesc: 'Secrets to executing an editorial destination pre-wedding photo and video shoot at Udaipur, Lake Como or Bali.',
    }
  ];

  for (const b of blogs) {
    await prisma.blog.create({ data: b });
  }

  // 8. Create Portfolio Items (Mock high-quality images and video loops based on category)
  const portfolioItems = [
    // Weddings
    {
      title: 'The Royal Entrance at Udaipur',
      description: 'An editorial capture of the bride entering the palace gates under a canopy of roses.',
      mediaUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200',
      mediaType: 'IMAGE',
      categoryId: getCatId('weddings'),
      featured: true,
    },
    {
      title: 'Sunset Nuptials at Lake Como',
      description: 'The golden hour vows by the lake side, reflecting the deep emotions of Sophia and Liam.',
      mediaUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200',
      mediaType: 'IMAGE',
      categoryId: getCatId('weddings'),
      featured: true,
    },
    {
      title: 'Sacred Vows Cinematic Loop',
      description: 'Slow motion focus on the exchange of wedding bands and vows.',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-newlyweds-slow-dancing-in-a-hallway-with-glowing-lights-40089-large.mp4',
      mediaType: 'VIDEO',
      categoryId: getCatId('weddings'),
      featured: true,
    },
    {
      title: 'Glow of the Sacred Fire',
      description: 'Macro capturing of the pheras ceremony, high contrast warm lighting.',
      mediaUrl: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=1200',
      mediaType: 'IMAGE',
      categoryId: getCatId('weddings'),
      featured: false,
    },

    // Pre-Weddings
    {
      title: 'Chasing Sunsets in Cappadocia',
      description: 'A cinematic frame of Sophia and Liam with hot air balloons floating in the Turkish sky.',
      mediaUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200',
      mediaType: 'IMAGE',
      categoryId: getCatId('pre-weddings'),
      featured: true,
    },
    {
      title: 'Walk in the Pine Forest',
      description: 'A romantic couple pre-wedding cinematic shoot, capturing authentic joy and connection.',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-walking-in-a-forest-41615-large.mp4',
      mediaType: 'VIDEO',
      categoryId: getCatId('pre-weddings'),
      featured: true,
    },
    {
      title: 'Vogue Romance in Milan',
      description: 'An editorial fashion-style couple portrait near the Duomo di Milano.',
      mediaUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200',
      mediaType: 'IMAGE',
      categoryId: getCatId('pre-weddings'),
      featured: false,
    },

    // Engagements
    {
      title: 'Parisian Surprise Proposal',
      description: 'A surprise proposal near the Seine River captured in crisp black & white editorial tones.',
      mediaUrl: 'https://images.unsplash.com/photo-1519225495810-7517c24a2ed3?w=1200',
      mediaType: 'IMAGE',
      categoryId: getCatId('engagements'),
      featured: true,
    },
    {
      title: 'Exchange of Rings Closeup',
      description: 'A cinematic zoom of the engagement ring being placed onto the bride’s finger.',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-groom-putting-on-the-bride-ring-wedding-40118-large.mp4',
      mediaType: 'VIDEO',
      categoryId: getCatId('engagements'),
      featured: true,
    },
    {
      title: 'Golden Hour Proposal Frame',
      description: 'A romantic silhouette frame capturing the moment of proposal against a beautiful beach setting.',
      mediaUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200',
      mediaType: 'IMAGE',
      categoryId: getCatId('engagements'),
      featured: false,
    },

    // Reels (vertical format loops)
    {
      title: 'The Udaipur Royal Teaser',
      description: 'Cinematic vertical teaser for Instagram reels showing Royal Palace wedding highlight.',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-40081-large.mp4',
      mediaType: 'VIDEO',
      categoryId: getCatId('reels'),
      featured: true,
    },
    {
      title: 'Parisian Love Story Reel',
      description: 'Short pre-wedding highlight reel shot in slow motion, optimized for vertical screens.',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-walking-in-a-forest-41615-large.mp4',
      mediaType: 'VIDEO',
      categoryId: getCatId('reels'),
      featured: true,
    },
    {
      title: 'Behind the Scenes Filmmaking Loop',
      description: 'A Glimpse of our professional film crew staging shot selections with camera stabilizers.',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-bride-and-groom-40114-large.mp4',
      mediaType: 'VIDEO',
      categoryId: getCatId('reels'),
      featured: false,
    },

    // Corporate
    {
      title: 'Luxury Brand Exhibition',
      description: 'High-contrast event coverages highlighting the premium aesthetics of fashion launch.',
      mediaUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200',
      mediaType: 'IMAGE',
      categoryId: getCatId('corporate'),
      featured: false,
    },
    {
      title: 'Grand Opening Piano Theme',
      description: 'Premium corporate gala event highlight showcasing client entertainment.',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-piano-player-in-a-suit-40078-large.mp4',
      mediaType: 'VIDEO',
      categoryId: getCatId('corporate'),
      featured: true,
    }
  ];

  for (const item of portfolioItems) {
    await prisma.portfolio.create({ data: item });
  }
  console.log('Portfolio media items seeded.');

  // 9. Create Bookings, Invoices, Project status for the Client user (Sophia & Liam)
  const booking = await prisma.booking.create({
    data: {
      eventType: 'Luxury Wedding Stories',
      date: '2026-09-12',
      location: 'Palace Grounds, Udaipur, Rajasthan',
      packageId: goldPkgId,
      requirements: 'Multi-cam setup, drone cinematic shots, sunset photoshoot, fast teaser delivery.',
      contactName: 'Sophia & Liam',
      contactEmail: 'client@shutterstories.com',
      contactPhone: '+91 9049678380',
      status: 'APPROVED',
    },
  });

  await prisma.invoice.create({
    data: {
      bookingId: booking.id,
      amount: 350000,
      status: 'UNPAID',
      dueDate: '2026-07-01',
    },
  });

  await prisma.projectStatus.create({
    data: {
      clientId: client.id,
      bookingId: booking.id,
      phase: 'EDITING',
      percentage: 65,
      comments: 'Wedding ceremony shoots are complete! Currently color-grading the cinematic trailer and sorting the high-resolution photo gallery.',
      deliverables: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200;https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200;https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200',
    },
  });

  // 10. Seed direct messages
  const chatMessages = [
    { senderId: admin.id, receiverId: client.id, content: 'Hello Sophia & Liam! Welcome to your Shutter Stories Portal. We are extremely excited to work on your Udaipur wedding films!' },
    { senderId: client.id, receiverId: admin.id, content: 'Thank you Devan! We loved the shoot. Can we know the status of the first trailer cut?' },
    { senderId: admin.id, receiverId: client.id, content: 'The trailer is currently in editing and color-grading phases. It is looking gorgeous! We should have it ready by this Friday.' },
    { senderId: client.id, receiverId: admin.id, content: 'That is awesome. Looking forward to it!' }
  ];

  for (const msg of chatMessages) {
    await prisma.message.create({ data: msg });
  }

  // 11. Seed Analytics
  const analyticsLogs = [
    { metricName: 'VISITOR', metricValue: 340.0 },
    { metricName: 'LEAD', metricValue: 5.0 },
    { metricName: 'BOOKING', metricValue: 1.0 },
    { metricName: 'REVENUE', metricValue: 350000.0 }
  ];

  for (const record of analyticsLogs) {
    await prisma.analyticsRecord.create({ data: record });
  }

  console.log('Database seeding successfully complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
