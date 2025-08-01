const { LeaveCategory } = require('../models');

exports.createLeaveCategory = async (req, res) => {
  const t = await LeaveCategory.sequelize.transaction();
  try {
    const leaveCategories = await LeaveCategory.create({
      ...req.body
    }, { transaction: t });
    await t.commit();

    res.status(201).json({
      message: "Leave Category created successfully",
      leaveCategories
    });

  } catch (error) {
    await t.rollback();
    console.error("Error creating Leave Category:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.leaveCategoryList = async (req, res) => {
  try {
    const leaveCategories = await LeaveCategory.findAll();

    res.status(200).json(leaveCategories);
  } catch (error) {
    console.error("Error fetching leaveCategories:", error);
    res.status(500).json({ error: "Failed to fetch leaveCategories list" });
  }
};

exports.getLeaveCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const cls = await LeaveCategory.findByPk(id);
        if (!cls) return res.status(404).json({ error: "Leave Category not found" });
        res.json(cls);
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: "Failed to fetch Leave Category" });
    }
};

exports.updateLeaveCategory = async (req, res) => {
    const id = req.params.id;
    try {
        const updated = await LeaveCategory.update(req.body, { where: { id: id } });
        if (updated[0] === 1) {
            res.json({ message: "Leave Category updated successfully" });
        } else {
            res.status(404).json({ error: "Leave Category not found" });
        }
    } catch (error) {
        console.error("Error updating Leave Category:", error);
        res.status(500).json({ error: "Failed to update Leave Category" });
    }
};