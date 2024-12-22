const RawMaterial = require('../models/rawMaterial.model');

exports.createMaterial = async (req, res) => {
  try {
    const { material_type, quantity, supplier_id } = req.body;
    
    if (!material_type || !quantity || !supplier_id) {
      return res.status(400).json({ error: 'Material type, quantity, and supplier ID are required' });
    }

    const result = await RawMaterial.create({
      material_type,
      quantity,
      supplier_id
    });

    res.status(201).json({
      message: 'Raw material added successfully',
      materialId: result.insertId
    });
  } catch (error) {
    console.error('Error creating raw material:', error);
    res.status(500).json({ error: 'Error adding raw material' });
  }
};

exports.getMaterialsBySupplier = async (req, res) => {
  try {
    const supplier_id = req.user.supplierId;
    const materials = await RawMaterial.getAllBySupplier(supplier_id);
    res.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Error fetching materials' });
  }
};

exports.getMaterialStats = async (req, res) => {
  try {
    const supplier_id = req.user.supplierId;
    const stats = await RawMaterial.getStatsBySupplier(supplier_id);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching material stats:', error);
    res.status(500).json({ error: 'Error fetching material statistics' });
  }
}; 