import Grades from "../models/Grades.js";
import UserLink from "../models/UserLink.js";

export const migrateGradesData = async (req, res) => {
  try {
    const grades = await Grades.find({
      $or: [
        { semesters: { $exists: false } },
        { semesters: { $size: 0 } }
      ],
      $and: [
        { $or: [{ semester: { $exists: true } }, { sgpa: { $exists: true } }] }
      ]
    });

    let migratedCount = 0;

    for (const gradeDoc of grades) {
      if (gradeDoc.semesters && gradeDoc.semesters.length > 0) {
        continue;
      }

      if (!gradeDoc.semesters) {
        gradeDoc.semesters = [];
      }

      if (gradeDoc.semester || gradeDoc.sgpa) {
        const semesterNum = gradeDoc.semester
          ? (typeof gradeDoc.semester === 'string'
              ? parseInt(gradeDoc.semester.replace(/\D/g, ''), 10) || 1
              : gradeDoc.semester)
          : 1;

        const existingSemester = gradeDoc.semesters.find(s => s.semester === semesterNum);

        if (!existingSemester) {
          gradeDoc.semesters.push({
            semester: semesterNum,
            subjects: [], 
            sgpa: gradeDoc.sgpa || 0,
          });
        }

        if (!gradeDoc.cgpa) {
          gradeDoc.cgpa = gradeDoc.sgpa || 0;
        }
      }

      await gradeDoc.save();
      migratedCount++;
    }

    res.json({
      message: `Migration completed. ${migratedCount} documents migrated.`,
      migratedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addOrUpdateGrades = async (req, res) => {
  try {
    const { studentId, semester, sgpa, subjects } = req.body;
    const examHeadId = req.user._id;

    if (!studentId || !semester || sgpa === undefined) {
      return res.status(400).json({
        message: "studentId, semester, and sgpa are required",
      });
    }

    const userLink = await UserLink.findOne({
      student: studentId,
      examHead: examHeadId,
    });

    if (!userLink) {
      return res
        .status(403)
        .json({ message: "Not authorized to manage grades for this student" });
    }

    if (subjects && !Array.isArray(subjects)) {
      return res.status(400).json({
        message: "subjects must be an array",
      });
    }

    if (subjects && subjects.length > 0) {
      for (const subject of subjects) {
        if (!subject.name || !subject.grade || !subject.credits) {
          return res.status(400).json({
            message: "Each subject must have name, grade, and credits",
          });
        }
      }
    }

    let gradesDoc = await Grades.findOne({ student: studentId });

    if (!gradesDoc) {
      gradesDoc = new Grades({ student: studentId, semesters: [] });
    }

    if (!gradesDoc.semesters) {
      gradesDoc.semesters = [];
    }

    const semesterNum = typeof semester === 'string'
      ? parseInt(semester.replace(/\D/g, ''), 10) || 1
      : semester;

    let semesterIndex = gradesDoc.semesters.findIndex(s => s.semester === semesterNum);

    if (semesterIndex === -1) {
      gradesDoc.semesters.push({
        semester: semesterNum,
        subjects: subjects || [],
        sgpa: sgpa,
      });
    } else {
      gradesDoc.semesters[semesterIndex].sgpa = sgpa;
      if (subjects && subjects.length > 0) {
        gradesDoc.semesters[semesterIndex].subjects = subjects;
      }
    }

    const calculateCGPA = (semesters) => {
      if (!semesters || semesters.length === 0) return 0;

      let totalWeightedPoints = 0;
      let totalCredits = 0;

      semesters.forEach(sem => {
        if (sem.subjects && sem.subjects.length > 0) {
          let semesterPoints = 0;
          let semesterCredits = 0;

          sem.subjects.forEach(subject => {
            const gradePoint = gradeToPoint(subject.grade);
            semesterPoints += gradePoint * subject.credits;
            semesterCredits += subject.credits;
          });

          if (semesterCredits > 0) {
            const calculatedSGPA = semesterPoints / semesterCredits;
            totalWeightedPoints += calculatedSGPA * semesterCredits;
            totalCredits += semesterCredits;
          }
        } else {
          const semesterCredits = 22; 
          totalWeightedPoints += sem.sgpa * semesterCredits;
          totalCredits += semesterCredits;
        }
      });

      return totalCredits > 0 ? Math.round((totalWeightedPoints / totalCredits) * 100) / 100 : 0;
    };

    const gradeToPoint = (grade) => {
      const gradeMap = {
        'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6,
        'C+': 5, 'C': 4, 'D+': 3, 'D': 2, 'F': 0,
        'S': 10, 'A': 8, 'B': 6, 'C': 4, 'D': 2, 'E': 0
      };
      return gradeMap[grade] || 0;
    };

    gradesDoc.cgpa = calculateCGPA(gradesDoc.semesters);

    await gradesDoc.save();

    res.json({
      message: "Grades updated successfully",
      grades: gradesDoc,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentGrades = async (req, res) => {
  try {
    const studentId = req.user._id;
    const grades = await Grades.findOne({ student: studentId });

    if (!grades) {
      return res.json({ grades: null });
    }

    res.json({ grades });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChildGrades = async (req, res) => {
  try {
    const { studentId } = req.params;
    const parentId = req.user._id;

    const userLink = await UserLink.findOne({
      student: studentId,
      parent: parentId,
    });

    if (!userLink) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this student's grades" });
    }

    const grades = await Grades.findOne({ student: studentId });

    if (!grades) {
      return res.json({ grades: null });
    }

    res.json({ grades });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






