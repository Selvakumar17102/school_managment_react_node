const { Mark, Subject, Exam, Student, Grade,Class,Section,MarkDistribution } = require('../models');

const db = require("../models");
const sequelize = db.sequelize;
const { QueryTypes } = require('sequelize');

exports.submitMarks = async (req, res) => {
  try {
    const { classId, examId, sectionId, subjectId, marks } = req.body;


    if (!classId || !examId || !sectionId || !subjectId || !Array.isArray(marks)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    await Mark.destroy({
      where: { classId, examId, sectionId, subjectId },
    });

    const markData = marks.map((m) => ({
      studentId: m.studentId,
      classId,
      examId,
      sectionId,
      subjectId,
      exam: m.exam,
      attendance: m.attendance,
      classTest: m.classTest,
      assignment: m.assignment,
    }));

    await Mark.bulkCreate(markData);

    res.json({ message: "Marks saved successfully" });
  } catch (error) {
    console.error("Error saving marks:", error);
    res.status(500).json({ message: "Failed to save marks" });
  }
};

exports.getStudentProfile = async (req, res) => {
  const studentId = req.params.id;

  try {
    const [results] = await sequelize.query(`
      SELECT 
        s.id,
        s.name,
        s.registerNo,
        s.roll,
        s.photo,
        c.className AS className,
        sec.sectionName AS section
      FROM Students s
      LEFT JOIN Classes c ON s.className = c.id
      LEFT JOIN Sections sec ON s.section = sec.id
      WHERE s.id = :studentId
    `, {
      replacements: { studentId },
      type: sequelize.QueryTypes.SELECT
    });

    if (!results) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(results);
  } catch (err) {
    console.error("Error fetching student profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getStudentMarkDetails = async (req, res) => {
  const studentId = req.params.id;

  const sql = `
    SELECT 
      m.examId,
      e.examName,
      m.subjectId,
      s.subjectName,
      m.exam AS examMark,
      m.attendance,
      m.classTest,
      m.assignment,
      (m.exam + m.attendance + m.classTest + m.assignment) AS totalMark,
      g.gradePoint,
      g.gradeName
    FROM marks m
    JOIN exams e ON e.id = m.examId
    JOIN subjects s ON s.id = m.subjectId
    LEFT JOIN grades g 
      ON (m.exam + m.attendance + m.classTest + m.assignment) 
      BETWEEN g.markFrom AND g.markUpto
    WHERE m.studentId = ?
    ORDER BY m.examId, m.subjectId
  `;

  try {
    const results = await sequelize.query(sql, {
      replacements: [studentId],
      type: QueryTypes.SELECT,
    });

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No marks found" });
    }

    const grouped = {};
    results.forEach((row) => {
      const exam = row.examName;
      if (!grouped[exam]) grouped[exam] = [];
      grouped[exam].push(row);
    });

    res.json(grouped);
  } catch (error) {
    console.error("Error fetching marks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createMarkdistribution = async (req, res) => {
  const t = await MarkDistribution.sequelize.transaction();
  try {
    const markdistributions = await MarkDistribution.create({
      ...req.body
    }, { transaction: t });
    await t.commit();

    res.status(201).json({
      message: "mark distributions created successfully",
      markdistributions
    });

  } catch (error) {
    await t.rollback();
    console.error("Error creating mark distributions:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.markDistributionList = async (req, res) => {
  try {
    const markDistributions = await MarkDistribution.findAll();

    res.status(200).json(markDistributions);
  } catch (error) {
    console.error("Error fetching markDistributions:", error);
    res.status(500).json({ error: "Failed to fetch markDistributions list" });
  }
};

exports.getMarkDistributionById = async (req, res) => {
    const { id } = req.params;
    try {
        const cls = await MarkDistribution.findByPk(id);
        if (!cls) return res.status(404).json({ error: "MarkDistribution not found" });
        res.json(cls);
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: "Failed to fetch MarkDistribution" });
    }
};

exports.updateMarkDistribution = async (req, res) => {
    const markDistributionId = req.params.id;
    try {
        const updated = await MarkDistribution.update(req.body, { where: { id: markDistributionId } });
        if (updated[0] === 1) {
            res.json({ message: "MarkDistribution updated successfully" });
        } else {
            res.status(404).json({ error: "MarkDistribution not found" });
        }
    } catch (error) {
        console.error("Error updating MarkDistribution:", error);
        res.status(500).json({ error: "Failed to update MarkDistribution" });
    } 
};
 