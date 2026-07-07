const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({}).sort({ name: 1 });
    res.json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a department
// @route   POST /api/departments
// @access  Private (Admin)
const createDepartment = async (req, res, next) => {
  try {
    const { name, description, headOfDept } = req.body;

    if (!name) {
      res.statusCode = 400;
      throw new Error('Please enter a department name');
    }

    const deptExists = await Department.findOne({ name });
    if (deptExists) {
      res.statusCode = 400;
      throw new Error('Department already exists');
    }

    const department = await Department.create({
      name,
      description,
      headOfDept,
    });

    res.status(201).json({
      success: true,
      department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a department
// @route   PUT /api/departments/:id
// @access  Private (Admin)
const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      res.statusCode = 404;
      throw new Error('Department not found');
    }

    department.name = req.body.name || department.name;
    department.description = req.body.description !== undefined ? req.body.description : department.description;
    department.headOfDept = req.body.headOfDept !== undefined ? req.body.headOfDept : department.headOfDept;

    const updatedDept = await department.save();

    res.json({
      success: true,
      department: updatedDept,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      res.statusCode = 404;
      throw new Error('Department not found');
    }

    await department.deleteOne();

    res.json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
