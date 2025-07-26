const { Class,Section,Student,Sattendance,Tattendance,Uattendance  } = require('../models');
const moment = require("moment");

exports.getSectionsByClassId = async (req, res) => {
  const { classId } = req.params;

  try {
    const sections = await Section.findAll({
      where: { classId },
      attributes: ["id", "sectionName"],
    });
    res.json(sections);
  } catch (err) {
    console.error("Section fetch error:", err);
    res.status(500).json({ error: "Failed to fetch sections" });
  }
};


exports.getStudentsByClassAndSection = async (req, res) => {
  const { className, section } = req.params;

  try {
    const students = await Student.findAll({
      where: {
        className,
        section,
      },
      attributes: ["id", "name", "email", "photo", "roll"],
      order: [["roll", "ASC"]],
    });

    res.json(students);
  } catch (error) {
    console.error("Student fetch error:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

exports.getStudentsByClassId = async (req, res) => {
  try {
    const { className, section } = req.query;

    if (!className) {
      return res.status(400).json({ message: "className is required" });
    }

    const where = { className };
    if (section) {
      where.section = section;
    }

    const students = await Student.findAll({
      where,
      order: [["roll", "ASC"]],
    });

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.saveAttendance = async (req, res) => {

  const { date, classId, sectionId, records } = req.body;

  try {
    if (!Array.isArray(records)) {
      return res.status(400).json({ error: "Invalid attendance data" });
    }

    const attendanceData = records.map(rec => ({
        studentId: rec.studentId,
        classId,
        sectionId,
        date,
        status: rec.status
    }));

    await Sattendance.bulkCreate(attendanceData);

    res.status(200).json({ message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ error: "Failed to save attendance" });
  }
};


exports.getStudentAttendance = async (req, res) => {
  const { studentId } = req.params;

  try {
    const records = await Sattendance.findAll({
      where: { studentId },
      raw: true,
    });

    const attendance = {};
    const summary = {
      present: 0,
      leave: 0,
      late: 0,
      lateWithExcuse: 0,
      holiday: 0,
      weekend: 0,
      absent: 0,
    };

    const months = moment.monthsShort();

    // for (let m of months) {
    //   attendance[m] = {};
    //   for (let d = 1; d <= 31; d++) {
    //     attendance[m][d] = "N/A";
    //   }
    // }
    const statusMap = {
      "Present": "P",
      "Absent": "A",
      "Late Present": "LP",
      "Late Present With Excuse": "LPE",
      "H": "H",
      "W": "W",
    };


    for (let mIndex = 0; mIndex < months.length; mIndex++) {
      const m = months[mIndex];
      const monthNum = mIndex + 1;
      attendance[m] = {};

      for (let d = 1; d <= 31; d++) {
        const dateStr = `2025-${String(monthNum).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const date = moment(dateStr, "YYYY-MM-DD");

        if (!date.isValid() || date.month() !== mIndex) {
          continue;
        }

        if (date.day() === 0) {
          attendance[m][d] = "W";
          summary.weekend += 1;
        } else {
          attendance[m][d] = "N/A";
        }
      }
    }

    for (let rec of records) {
      const date = moment(rec.date);
      const month = date.format("MMM");
      const day = date.date();
      const status = rec.status;

      if (attendance[month]) {
        // attendance[month][day] = status;
        attendance[month][day] = statusMap[status] || status;

      }

      switch (status) {
        case "Present":
          summary.present += 1;
          break;
        case "Absent":
          summary.absent += 1;
          break;
        case "Late Present":
          summary.late += 1;
          break;
        case "Late Present With Excuse":
          summary.lateWithExcuse += 1;
          break;
        case "H":
          summary.holiday += 1;
          break;
        case "W":
          summary.weekend += 1;
          break;
        default:
          break;
      }
    }


    return res.json({ attendance, summary });

  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.saveTAttendance = async (req, res) => {

  const { date, records } = req.body;

  try {
    if (!Array.isArray(records)) {
      return res.status(400).json({ error: "Invalid attendance data" });
    }

    const attendanceData = records.map(rec => ({
        teacherId: rec.teacherId,
        date,
        status: rec.status
    }));

    await Tattendance.bulkCreate(attendanceData);

    res.status(200).json({ message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ error: "Failed to save attendance" });
  }
};

exports.getTeacherAttendance = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const records = await Tattendance.findAll({
      where: { teacherId },
      raw: true,
    });

    const attendance = {};
    const summary = {
      present: 0,
      leave: 0,
      late: 0,
      lateWithExcuse: 0,
      holiday: 0,
      weekend: 0,
      absent: 0,
    };

    const months = moment.monthsShort();

    // for (let m of months) {
    //   attendance[m] = {};
    //   for (let d = 1; d <= 31; d++) {
    //     attendance[m][d] = "N/A";
    //   }
    // }
    const statusMap = {
      "Present": "P",
      "Absent": "A",
      "Late Present": "LP",
      "Late Present With Excuse": "LPE",
      "H": "H",
      "W": "W",
    };


    for (let mIndex = 0; mIndex < months.length; mIndex++) {
      const m = months[mIndex];
      const monthNum = mIndex + 1;
      attendance[m] = {};

      for (let d = 1; d <= 31; d++) {
        const dateStr = `2025-${String(monthNum).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const date = moment(dateStr, "YYYY-MM-DD");

        if (!date.isValid() || date.month() !== mIndex) {
          continue;
        }

        if (date.day() === 0) {
          attendance[m][d] = "W";
          summary.weekend += 1;
        } else {
          attendance[m][d] = "N/A";
        }
      }
    }

    for (let rec of records) {
      const date = moment(rec.date);
      const month = date.format("MMM");
      const day = date.date();
      const status = rec.status;

      if (attendance[month]) {
        // attendance[month][day] = status;
        attendance[month][day] = statusMap[status] || status;

      }

      switch (status) {
        case "Present":
          summary.present += 1;
          break;
        case "Absent":
          summary.absent += 1;
          break;
        case "Late Present":
          summary.late += 1;
          break;
        case "Late Present With Excuse":
          summary.lateWithExcuse += 1;
          break;
        case "H":
          summary.holiday += 1;
          break;
        case "W":
          summary.weekend += 1;
          break;
        default:
          break;
      }
    }


    return res.json({ attendance, summary });

  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.saveUAttendance = async (req, res) => {

  const { date, records } = req.body;

  try {
    if (!Array.isArray(records)) {
      return res.status(400).json({ error: "Invalid attendance data" });
    }

    const attendanceData = records.map(rec => ({
        userId: rec.userId,
        date,
        status: rec.status
    }));

    await Uattendance.bulkCreate(attendanceData);

    res.status(200).json({ message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ error: "Failed to save attendance" });
  }
};


exports.getUserAttendance = async (req, res) => {
  const { userId } = req.params;

  try {
    const records = await Uattendance.findAll({
      where: { userId },
      raw: true,
    });

    const attendance = {};
    const summary = {
      present: 0,
      leave: 0,
      late: 0,
      lateWithExcuse: 0,
      holiday: 0,
      weekend: 0,
      absent: 0,
    };

    const months = moment.monthsShort();

    const statusMap = {
      "Present": "P",
      "Absent": "A",
      "Late Present": "LP",
      "Late Present With Excuse": "LPE",
      "H": "H",
      "W": "W",
    };

    for (let mIndex = 0; mIndex < months.length; mIndex++) {
      const m = months[mIndex];
      const monthNum = mIndex + 1;
      attendance[m] = {};

      for (let d = 1; d <= 31; d++) {
        const dateStr = `2025-${String(monthNum).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const date = moment(dateStr, "YYYY-MM-DD");

        if (!date.isValid() || date.month() !== mIndex) {
          continue;
        }

        if (date.day() === 0) {
          attendance[m][d] = "W";
          summary.weekend += 1;
        } else {
          attendance[m][d] = "N/A";
        }
      }
    }

    for (let rec of records) {
      const date = moment(rec.date);
      const month = date.format("MMM");
      const day = date.date();
      const status = rec.status;

      if (attendance[month]) {
        attendance[month][day] = statusMap[status] || status;

      }

      switch (status) {
        case "Present":
          summary.present += 1;
          break;
        case "Absent":
          summary.absent += 1;
          break;
        case "Late Present":
          summary.late += 1;
          break;
        case "Late Present With Excuse":
          summary.lateWithExcuse += 1;
          break;
        case "H":
          summary.holiday += 1;
          break;
        case "W":
          summary.weekend += 1;
          break;
        default:
          break;
      }
    }


    return res.json({ attendance, summary });

  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: "Server error" });
  }
};