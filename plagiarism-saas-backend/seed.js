const mongoose = require('mongoose');
const Bundle = require('./src/models/Bundle');
require('dotenv').config();

// Sample bundles data
const bundles = [
  {
    name: 'Starter',
    uploads: 1,
    price: 50,
    description: 'Perfect for single document checks',
    popular: false
  },
  {
    name: 'Basic',
    uploads: 5,
    price: 200,
    description: 'Great for students with multiple assignments',
    popular: false
  },
  {
    name: 'Standard',
    uploads: 10,
    price: 350,
    description: 'Most popular choice for regular users',
    popular: true
  },
  {
    name: 'Professional',
    uploads: 20,
    price: 600,
    description: 'Ideal for heavy users and researchers',
    popular: false
  },
  {
    name: 'Premium',
    uploads: 50,
    price: 1200,
    description: 'Best value for institutions',
    popular: false
  },
  {
    name: 'Enterprise',
    uploads: 100,
    price: 2000,
    description: 'Unlimited access for organizations',
    popular: false
  }
];

// Seed function
async function seedBundles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/plagiarism-saas');
    console.log('✅ Connected to MongoDB');

    // Clear existing bundles
    await Bundle.deleteMany({});
    console.log('🗑️ Cleared existing bundles');

    // Insert new bundles
    const insertedBundles = await Bundle.insertMany(bundles);
    console.log(`✅ Inserted ${insertedBundles.length} bundles`);

    // Display inserted bundles
    console.log('\n📦 Inserted bundles:');
    insertedBundles.forEach(bundle => {
      console.log(`- ${bundle.name}: ${bundle.uploads} uploads for KES ${bundle.price}`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed function
seedBundles();
