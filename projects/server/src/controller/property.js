const { Op } = require('sequelize');
const { Property, Category, Tenant } = require('../models');

exports.addProperty = async (req, res) => {
  const { name, categoryId, tenantId, description } = req.body;
  const picture = req.file;

  try {
    const property = await Property.create({
      name,
      categoryId,
      tenantId,
      description,
      picture: picture.filename,
    });

    res.json({
      ok: true,
      data: property,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.editProperty = async (req, res) => {
  const propertyId = req.params.id;
  const { name, categoryId, tenantId, description } = req.body;

  try {
    const property = await Property.findOne({ where: { id: propertyId } });
    if (!property) {
      return res
        .status(404)
        .json({ ok: false, message: 'Property not found.' });
    }

    property.name = name;
    property.categoryId = categoryId;
    property.tenantId = tenantId;
    property.description = description;
    if (req.file) {
      property.picture = req.file.filename;
    }
    await property.save();

    return res.json({ ok: true, data: property });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.deleteProperty = async (req, res) => {
  const propertyId = req.params.id;

  try {
    Property.destroy({ where: { id: propertyId } }).then(function (rowDeleted) {
      if (rowDeleted === 1) {
        return res.json({
          ok: true,
          message: 'Property successfully deleted.',
        });
      }
      return res.status(404).json({
        ok: false,
        message: 'Property not found.',
      });
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getAllProperties = async (req, res) => {
  const { page, sort = '', search = '' } = req.query;

  try {
    if (page || sort || search) {
      const properties = await Property.findAndCountAll({
        where: {
          name: { [Op.like]: `%${search}%` },
        },
        order: [['name', sort ? sort : 'ASC']],
        offset: 5 * ((page ? page : 1) - 1),
        limit: 5,
        attributes: { exclude: ['categoryId', 'tenantId'] },
        include: [
          { model: Category, as: 'category' },
          { model: Tenant, as: 'tenant' },
        ],
      });

      return res.json({
        ok: true,
        count: properties.count,
        data: properties.rows,
      });
    }

    const properties = await Property.findAll({
      attributes: { exclude: ['categoryId', 'tenantId'] },
      include: [
        { model: Category, as: 'category' },
        { model: Tenant, as: 'tenant' },
      ],
    });
    return res.json({ ok: true, data: properties });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getSingleProperty = async (req, res) => {
  const propertyId = req.params.id;

  try {
    const property = await Property.findOne({
      where: { id: propertyId },
      attributes: { exclude: ['categoryId', 'tenantId'] },
      include: [
        { model: Category, as: 'category' },
        { model: Tenant, as: 'tenant' },
      ],
    });

    if (!property) {
      return res.status(404).json({
        ok: false,
        message: 'Property not found.',
      });
    }

    return res.json({ ok: true, data: property });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};
