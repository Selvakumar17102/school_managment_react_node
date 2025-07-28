const { Exam } = require('../models');

exports.createExam = async (req, res) => {
  const t = await Exam.sequelize.transaction();
  try {
    const exams = await Exam.create({
      ...req.body
    }, { transaction: t });
    await t.commit();

    res.status(201).json({
      message: "Exam created successfully",
      exams
    });

  } catch (error) {
    await t.rollback();
    console.error("Error creating exams:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.examList = async (req, res) => {
  try {
    const exams = await Exam.findAll();

    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ error: "Failed to fetch exams list" });
  }
};

exports.getExamById = async (req, res) => {
    const { id } = req.params;
    try {
        const cls = await Exam.findByPk(id);
        if (!cls) return res.status(404).json({ error: "Exam not found" });
        res.json(cls);
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: "Failed to fetch Exam" });
    }
};

exports.updateExam = async (req, res) => {
    const examId = req.params.id;
    try {
        const updated = await Exam.update(req.body, { where: { id: examId } });
        if (updated[0] === 1) {
            res.json({ message: "Exam updated successfully" });
        } else {
            res.status(404).json({ error: "Exam not found" });
        }
    } catch (error) {
        console.error("Error updating Exam:", error);
        res.status(500).json({ error: "Failed to update Exam" });
    }
};
