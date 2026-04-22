const ServiceConfig = require('../models/ServiceConfig');

const DEFAULT_SERVICES = [
  { value: 'petrol',    label: 'Petrol Delivery',  icon: 'fuel',     desc: 'Fuel delivered to your spot',       pricing: 'per_litre', pricePerUnit: 100, enabled: true },
  { value: 'towing',    label: 'Towing Service',    icon: 'truck',    desc: 'Vehicle towed to nearest garage',   pricing: 'per_cc',    ccTiers: [{ maxCc: 199, charge: 500 }, { maxCc: 399, charge: 700 }, { maxCc: 799, charge: 800 }, { maxCc: 99999, charge: 1000 }], enabled: true },
  { value: 'mechanic',  label: 'Mechanic On Spot',  icon: 'wrench',   desc: 'Expert mechanic at your location',  pricing: 'fixed',     baseCharge: 500, enabled: true },
  { value: 'battery',   label: 'Electric Battery',  icon: 'battery',  desc: 'Battery jump-start or replacement', pricing: 'fixed',     baseCharge: 500, enabled: true },
  { value: 'autospare', label: 'Auto Spare Parts',  icon: 'settings', desc: 'Spare parts delivered instantly',   pricing: 'fixed',     baseCharge: 500, enabled: true },
];

const DEFAULT_SETTINGS = {
  ratePerKm: 10,
  unserviceableKm: 70,
  disabledKm: 700,
  onlinePaymentThresholdKm: 5,
  fixedLocation: { lat: 12.89806, lng: 77.61442 },
};

const getOrCreateConfig = async () => {
  let config = await ServiceConfig.findByPk(1);
  if (!config) {
    config = await ServiceConfig.create({
      id: 1,
      services: DEFAULT_SERVICES,
      settings: DEFAULT_SETTINGS,
    });
  }
  return config;
};

const getServicesConfig = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    const config = await getOrCreateConfig();
    res.json({ success: true, services: config.services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateServicesConfig = async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    
    // ── STRICT SAVE FIX ──
    config.services = req.body.services;
    config.changed('services', true); 
    await config.save();
    
    res.json({ success: true, services: config.services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getServicesSettings = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    const config = await getOrCreateConfig();
    res.json({ success: true, config: config.settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateServicesSettings = async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    
    // ── STRICT SAVE FIX ──
    config.settings = { ...config.settings, ...req.body.config };
    config.changed('settings', true);
    await config.save();
    
    res.json({ success: true, config: config.settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getServicesConfig, updateServicesConfig, getServicesSettings, updateServicesSettings };