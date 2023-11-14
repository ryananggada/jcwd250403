const { Op } = require('sequelize');
const { Category } = require('../models');

exports.addCategory = async (req, res) => {
  const { location } = req.body;

  try {
    const result = await Category.create({
      location,
    });

    return res.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.editCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { location } = req.body;

  try {
    const category = await Category.findOne({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return res.status(404).json({
        ok: false,
        message: 'Category not found.',
      });
    }

    category.location = location;
    await category.save();

    return res.json({
      ok: true,
      data: {
        location: category.location,
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    Category.destroy({ where: { id: categoryId } }).then(function (rowDeleted) {
      if (rowDeleted === 1) {
        return res.json({
          ok: true,
          message: 'Category successfully deleted.',
        });
      }
      return res.status(404).json({
        ok: false,
        message: 'Category not found.',
      });
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getAllCategories = async (req, res) => {
  const { page, sort = '', search = '' } = req.query;

  try {
    if (page || sort || search) {
      const categories = await Category.findAndCountAll({
        where: {
          location: { [Op.like]: `%${search}%` },
        },
        order: [['location', sort ? sort : 'ASC']],
        offset: 5 * ((page ? page : 1) - 1),
        limit: 5,
      });

      return res.json({
        ok: true,
        count: categories.count,
        data: categories.rows,
      });
    }

    const categories = await Category.findAll();
    return res.json({ ok: true, data: categories });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getSingleCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await Category.findOne({ where: { id: categoryId } });

    if (!category) {
      return res.status(404).json({ ok: false, data: 'Category not found.' });
    }

    return res.json({ ok: true, data: category });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};
