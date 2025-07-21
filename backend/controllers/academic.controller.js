  const { Class, Teacher,Section,Subject,Syllabus,Assignment } = require('../models');

exports.createClass = async (req, res) => {
  const t = await Class.sequelize.transaction();

  try {
    const classes = await Class.create({
      ...req.body
    }, { transaction: t });
    await t.commit();

    res.status(201).json({
      message: "Class created successfully",
      classes
    });

  } catch (error) {
    await t.rollback();
    console.error("Error creating classes:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.classList = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: Teacher,
          attributes: ['id', 'name']
        }
      ]
    });
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Failed to fetch classes list" });
  }
};

exports.getClassById = async (req, res) => {
    const { id } = req.params;
    try {
        const cls = await Class.findByPk(id);
        if (!cls) return res.status(404).json({ error: "Class not found" });
        res.json(cls);
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: "Failed to fetch class" });
    }
};

exports.updateClass = async (req, res) => {
    const classId = req.params.id;
    try {
        const updated = await Class.update(req.body, { where: { id: classId } });
        if (updated[0] === 1) {
            res.json({ message: "Class updated successfully" });
        } else {
            res.status(404).json({ error: "Class not found" });
        }
    } catch (error) {
        console.error("Error updating class:", error);
        res.status(500).json({ error: "Failed to update class" });
    }
};

exports.createSection = async (req, res) => {
  const t = await Section.sequelize.transaction();
  try {
    const sections = await Section.create({
      ...req.body
    }, { transaction: t });
    await t.commit();

    res.status(201).json({
      message: "Section created successfully",
      sections
    });

  } catch (error) {
    await t.rollback();
    console.error("Error creating sections:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.sectionList = async (req, res) => {
  try {
    const sections = await Section.findAll({
      include: [
        {
          model: Class,
          attributes: ['id', 'className']
        },
        {
          model: Teacher,
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(200).json(sections);
  } catch (error) {
    console.error("Error fetching sections:", error);
    res.status(500).json({ error: "Failed to fetch sections list" });
  }
};

exports.getSectionById = async (req, res) => {
    const { id } = req.params;
    try {
        const cls = await Section.findByPk(id);
        if (!cls) return res.status(404).json({ error: "Section not found" });
        res.json(cls);
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: "Failed to fetch Section" });
    }
};

exports.updateSection = async (req, res) => {
    const sectionId = req.params.id;
    try {
        const updated = await Section.update(req.body, { where: { id: sectionId } });
        if (updated[0] === 1) {
            res.json({ message: "Section updated successfully" });
        } else {
            res.status(404).json({ error: "Section not found" });
        }
    } catch (error) {
        console.error("Error updating Section:", error);
        res.status(500).json({ error: "Failed to update Section" });
    }
};

exports.createSubject = async (req, res) => {
  const t = await Subject.sequelize.transaction();
  try {
    const Subjects = await Subject.create({
      ...req.body
    }, { transaction: t });
    await t.commit();

    res.status(201).json({
      message: "Subject created successfully",
      Subjects
    });

  } catch (error) {
    await t.rollback();
    console.error("Error creating Subjects:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.subjectList = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      include: [
        {
          model: Class,
          attributes: ['id', 'className']
        },
        {
          model: Teacher,
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({ error: "Failed to fetch subject list" });
  }
};

exports.getSubjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const cls = await Subject.findByPk(id);
        if (!cls) return res.status(404).json({ error: "Subject not found" });
        res.json(cls);
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: "Failed to fetch Subject" });
    }
};

exports.updateSubject = async (req, res) => {
    const subjectId = req.params.id;
    try {
        const updated = await Subject.update(req.body, { where: { id: subjectId } });
        if (updated[0] === 1) {
            res.json({ message: "Subject updated successfully" });
        } else {
            res.status(404).json({ error: "Subject not found" });
        }
    } catch (error) {
        console.error("Error updating Subject:", error);
        res.status(500).json({ error: "Failed to update Subject" });
    }
};

exports.createSyllabus = async (req, res) => {
  const t = await Syllabus.sequelize.transaction();
  try {
    const { classId, title, description } = req.body;

    let files = [];

    if (req.file) {
      files.push(req.file.filename);
    }

    if (req.files && Array.isArray(req.files)) {
      files = req.files.map((file) => file.filename);
    }

    const newSyllabus = await Syllabus.create(
      {
        classId,
        title,
        description,
        files,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ message: "Syllabus created", data: newSyllabus });
  } catch (error) {
    await t.rollback();
    console.error("Error creating Syllabus:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.syllabusList = async (req, res) => {
  try {
    const syllabuses = await Syllabus.findAll({
      include: [
        {
          model: Class,
          attributes: ['id', 'className']
        }
      ]
    });

    res.status(200).json(syllabuses);
  } catch (error) {
    console.error("Error fetching syllabus:", error);
    res.status(500).json({ error: "Failed to fetch syllabus list" });
  }
};

exports.getSyllabusById = async (req, res) => {
    const { id } = req.params;
    try {
        const cls = await Syllabus.findByPk(id);
        if (!cls) return res.status(404).json({ error: "Syllabus not found" });
        res.json(cls);
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: "Failed to fetch Syllabus" });
    }
};

exports.updateSyllabus = async (req, res) => {
  const syllabusId = req.params.id;

  try {
    const existing = await Syllabus.findByPk(syllabusId);
    if (!existing) {
      return res.status(404).json({ error: "Syllabus not found" });
    }

    const { classId, title, description } = req.body;

    if (req.files && req.files.length > 0 && existing.files) {
      const oldFiles = JSON.parse(existing.files);
      oldFiles.forEach((file) => {
        const filePath = path.join(__dirname, "../uploads/syllabus", file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    const fileNames = req.files ? req.files.map((file) => file.filename) : JSON.parse(existing.files);

    await existing.update({
      classId,
      title,
      description,
      files: JSON.stringify(fileNames), // save as stringified array
    });

    res.status(200).json({ message: "Syllabus updated successfully" });
  } catch (error) {
    console.error("Error updating Syllabus:", error);
    res.status(500).json({ error: "Failed to update Syllabus" });
  }
};

exports.createAssignment = async (req, res) => {
  const t = await Assignment.sequelize.transaction();
  try {

    console.log("sdsdsdsdsssssssssssssssss",req.body);


    // const { classId, title, description } = req.body;

    // let files = [];

    // if (req.file) {
    //   files.push(req.file.filename);
    // }

    // if (req.files && Array.isArray(req.files)) {
    //   files = req.files.map((file) => file.filename);
    // }

    // const newSyllabus = await Syllabus.create(
    //   {
    //     classId,
    //     title,
    //     description,
    //     files,
    //   },
    //   { transaction: t }
    // );

    // await t.commit();
    // res.status(201).json({ message: "Syllabus created", data: newSyllabus });
  } catch (error) {
    await t.rollback();
    console.error("Error creating Assignment:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};