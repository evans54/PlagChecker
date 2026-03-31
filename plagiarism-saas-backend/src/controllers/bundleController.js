const Bundle = require('../models/Bundle');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all available bundles
const getBundles = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      // Return mock bundles when database is not connected
      const mockBundles = [
        { _id: '1', name: 'Starter', uploads: 1, price: 50, description: 'Perfect for single document checks', popular: false },
        { _id: '2', name: 'Basic', uploads: 5, price: 200, description: 'Great for students with multiple assignments', popular: false },
        { _id: '3', name: 'Standard', uploads: 10, price: 350, description: 'Most popular choice for regular users', popular: true },
        { _id: '4', name: 'Professional', uploads: 20, price: 600, description: 'Ideal for heavy users and researchers', popular: false },
        { _id: '5', name: 'Premium', uploads: 50, price: 1200, description: 'Best value for institutions', popular: false },
        { _id: '6', name: 'Enterprise', uploads: 100, price: 2000, description: 'Unlimited access for organizations', popular: false }
      ];
      
      return res.json({
        success: true,
        data: {
          bundles: mockBundles
        }
      });
    }

    const bundles = await Bundle.find().sort({ price: 1 });
    
    res.json({
      success: true,
      data: {
        bundles
      }
    });
  } catch (error) {
    console.error('Get bundles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching bundles'
    });
  }
};

// Get user's current slots
const getUserSlots = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('slots');
    
    res.json({
      success: true,
      data: {
        slots: user.slots
      }
    });
  } catch (error) {
    console.error('Get user slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user slots'
    });
  }
};

// Add slots to user account (after successful payment)
const addSlots = async (req, res) => {
  try {
    const { slots } = req.body;
    
    if (!slots || slots <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid number of slots is required'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { slots: slots } },
      { new: true }
    ).select('slots');

    res.json({
      success: true,
      message: 'Slots added successfully',
      data: {
        slots: user.slots
      }
    });
  } catch (error) {
    console.error('Add slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding slots'
    });
  }
};

// Create initial bundles (admin only)
const createBundle = async (req, res) => {
  try {
    const { name, uploads, price, description, popular } = req.body;

    // Validate input
    if (!name || !uploads || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, uploads, and price are required'
      });
    }

    const bundle = new Bundle({
      name,
      uploads,
      price,
      description,
      popular: popular || false
    });

    await bundle.save();

    res.status(201).json({
      success: true,
      message: 'Bundle created successfully',
      data: {
        bundle
      }
    });
  } catch (error) {
    console.error('Create bundle error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating bundle'
    });
  }
};

// Update bundle (admin only)
const updateBundle = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, uploads, price, description, popular } = req.body;

    const bundle = await Bundle.findByIdAndUpdate(
      id,
      { name, uploads, price, description, popular },
      { new: true, runValidators: true }
    );

    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found'
      });
    }

    res.json({
      success: true,
      message: 'Bundle updated successfully',
      data: {
        bundle
      }
    });
  } catch (error) {
    console.error('Update bundle error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating bundle'
    });
  }
};

// Delete bundle (admin only)
const deleteBundle = async (req, res) => {
  try {
    const { id } = req.params;

    const bundle = await Bundle.findByIdAndDelete(id);

    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found'
      });
    }

    res.json({
      success: true,
      message: 'Bundle deleted successfully'
    });
  } catch (error) {
    console.error('Delete bundle error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting bundle'
    });
  }
};

module.exports = {
  getBundles,
  getUserSlots,
  addSlots,
  createBundle,
  updateBundle,
  deleteBundle
};
