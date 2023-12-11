const { Op, Sequelize } = require('sequelize');
const fs = require('fs/promises');
const path = require('path');
const {
  Property,
  Category,
  Tenant,
  Room,
  AvailableDate,
} = require('../models');

exports.addProperty = async (req, res) => {
  const { name, categoryId, description } = req.body;
  const tenantId = req.profile.id;
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
  const { name, categoryId, description } = req.body;
  const tenantId = req.profile.id;

  try {
    const property = await Property.findOne({ where: { id: propertyId } });
    if (!property) {
      return res
        .status(404)
        .json({ ok: false, message: 'Property not found.' });
    }

    if (property.tenantId !== tenantId) {
      return res.status(400).json({
        ok: false,
        message: 'Only tenant with the same ID can edit this property.',
      });
    }

    property.name = name;
    property.categoryId = categoryId;
    property.description = description;
    if (req.file) {
      const oldPropertyPicture = path.join(
        __dirname,
        '..',
        'public',
        property.picture
      );

      try {
        await fs.unlink(oldPropertyPicture);
      } catch (error) {
        return res.status(500).json({ ok: false, message: String(error) });
      }

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
  const tenantId = req.profile.id;

  try {
    const propertyToDelete = await Property.findOne({
      where: { id: propertyId },
    });

    if (propertyToDelete.tenantId !== tenantId) {
      return res.status(400).json({
        ok: false,
        message: 'Only tenant with the same ID can delete this property.',
      });
    }

    if (!propertyToDelete) {
      return res.status(404).json({
        ok: false,
        message: 'Property not found.',
      });
    }

    const rowDeleted = await Property.destroy({ where: { id: propertyId } });

    if (rowDeleted === 1) {
      const oldPropertyPicture = path.join(
        __dirname,
        '..',
        'public',
        propertyToDelete.picture
      );

      try {
        await fs.unlink(oldPropertyPicture);
      } catch (error) {
        return res.status(500).json({ ok: false, message: String(error) });
      }

      return res.json({
        ok: true,
        message: 'Property successfully deleted.',
      });
    }
    return res.status(404).json({
      ok: false,
      message: 'Property not found.',
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getAllProperties = async (req, res) => {
  const { page, sort = '', search = '' } = req.query;
  const tenantId = req.profile.id;

  try {
    if (page || sort || search) {
      const properties = await Property.findAndCountAll({
        where: {
          name: { [Op.like]: `%${search}%` },
          tenantId,
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
      where: { tenantId },
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
        { model: Category, as: 'category', attributes: ['id', 'location'] },
        { model: Tenant, as: 'tenant', attributes: ['id', 'name'] },
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

exports.getPropertiesFromLowestPrice = async (req, res) => {
  const {
    page,
    startDate = new Date(),
    sort = '',
    search = '',
    location = '',
  } = req.query;

  try {
    let orderBy = '';
    let orderDirection = '';
    if (sort === 'name-asc') {
      orderBy = 'name';
      orderDirection = 'ASC';
    } else if (sort === 'name-desc') {
      orderBy = 'name';
      orderDirection = 'DESC';
    } else if (sort === 'price-asc') {
      orderBy = 'minPrice';
      orderDirection = 'ASC';
    } else if (sort === 'price-desc') {
      orderBy = 'minPrice';
      orderDirection = 'DESC';
    }

    const properties = await Property.findAndCountAll({
      attributes: [
        'id',
        'name',
        'picture',
        [Sequelize.fn('MIN', Sequelize.col('rooms.price')), 'minPrice'],
      ],
      include: [
        {
          model: Room,
          as: 'rooms',
          attributes: [],

          include: [
            {
              model: AvailableDate,
              as: 'availableDates',
              attributes: [],
              where: {
                date: { [Op.eq]: startDate },
              },
            },
          ],
        },
        {
          model: Category,
          as: 'category',
          attributes: [],
          where: {
            location: location,
          },
        },
      ],
      where: {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
      group: ['Property.id'],
      having: Sequelize.literal('MIN(rooms.price) IS NOT NULL'),
      order: [[orderBy, orderDirection]],
    });

    const paginatedProperties = properties.rows.slice(
      6 * ((page ? page : 1) - 1),
      6 * ((page ? page : 1) - 1) + 6
    );

    return res.json({
      ok: true,
      count: properties.count.length,
      data: paginatedProperties,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};
