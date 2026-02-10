const { Parser } = require("json2csv");

exports.generateCSV = (data) => {
  const fields = [
    "learner.name",     // ✅ correct
    "learner.email",    // ✅ correct
    "course.title",
    "progress",
    "enrolledAt",
  ];

  const parser = new Parser({ fields });
  return parser.parse(data);
};
