const PDFDocument = require('pdfkit');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');

// @desc    Generate Certificate
// @route   GET /api/certificates/:courseId
// @access  Private/Student
const generateCertificate = async (req, res) => {
    const courseId = req.params.courseId;
    const student = req.user;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const progress = await Progress.findOne({ student: student._id, course: courseId });
    const allChapters = await Chapter.find({ course: courseId });

    const isComplete = progress && progress.completedChapters.length === allChapters.length && allChapters.length > 0;

    if (!isComplete) {
        return res.status(400).json({ message: 'Course not 100% complete' });
    }

    const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${courseId}.pdf`);

    doc.pipe(res);

    // --- Design Constants ---
    const width = doc.page.width;
    const height = doc.page.height;
    const margin = 40;

    // 1. Background & Border
    // Outer Border (Dark Blue)
    doc.rect(margin, margin, width - (margin * 2), height - (margin * 2))
        .lineWidth(5)
        .stroke('#1a365d'); // Indigo-900 like color

    // Inner Border (Gold)
    doc.rect(margin + 5, margin + 5, width - (margin * 2 + 10), height - (margin * 2 + 10))
        .lineWidth(2)
        .stroke('#d69e2e'); // Gold color

    // 2. Header
    doc.moveDown(2);
    doc.font('Helvetica-Bold')
        .fontSize(40)
        .fillColor('#1a365d')
        .text('CERTIFICATE OF COMPLETION', { align: 'center', characterSpacing: 2 });

    // Decorative Line under header
    doc.moveTo(width / 2 - 150, 160)
        .lineTo(width / 2 + 150, 160)
        .lineWidth(1)
        .stroke('#d69e2e');

    // 3. Subheader
    doc.moveDown(2);
    doc.font('Times-Italic')
        .fontSize(20)
        .fillColor('#4a5568')
        .text('This is to certify that', { align: 'center' });

    // 4. Student Name (Hero)
    doc.moveDown(1);
    doc.font('Helvetica-Bold')
        .fontSize(50)
        .fillColor('#2d3748') // Dark Gray
        .text(student.name, { align: 'center' });

    // Underline for name
    const nameWidth = doc.widthOfString(student.name);
    // Approximate centering logic for underline if needed, or just let text stand alone.
    // Let's add a small line below name for style
    // doc.moveTo((width - nameWidth) / 2, doc.y).lineTo((width + nameWidth) / 2, doc.y).stroke('#d69e2e');

    // 5. Body Text
    doc.moveDown(1);
    doc.font('Times-Roman')
        .fontSize(20)
        .fillColor('#4a5568')
        .text('has successfully completed the course', { align: 'center' });

    // 6. Course Title
    doc.moveDown(1);
    doc.font('Helvetica-Bold')
        .fontSize(35)
        .fillColor('#1a365d')
        .text(course.title, { align: 'center' });

    // 7. Footer / Signature Section
    const bottomY = height - 130;

    // Date
    doc.fontSize(15)
        .font('Times-Roman')
        .fillColor('#2d3748')
        .text(new Date().toLocaleDateString(), 100, bottomY);

    doc.moveTo(100, bottomY - 5)
        .lineTo(250, bottomY - 5)
        .lineWidth(1)
        .stroke('#cbd5e0');

    doc.fontSize(12)
        .text('Date', 100, bottomY + 20);

    // Signature (Simulated)
    doc.fontSize(25)
        .font('ZapfDingbats') // Or just cursive-like font if available, standard PDFKit usually has limited decorative fonts
        .fillColor('#1a365d')
        .text('Mentor Studio', width - 300, bottomY - 10);

    doc.moveTo(width - 300, bottomY - 5)
        .lineTo(width - 100, bottomY - 5)
        .lineWidth(1)
        .stroke('#cbd5e0');

    doc.fontSize(12)
        .font('Times-Roman')
        .fillColor('#2d3748')
        .text('Instructor Signature', width - 300, bottomY + 20);

    // Logo / Badge (Circle for now)
    doc.circle(width / 2, height - 100, 40)
        .lineWidth(2)
        .stroke('#d69e2e');

    doc.font('Helvetica-Bold')
        .fontSize(30)
        .fillColor('#d69e2e')
        .text('✓', width / 2 - 12, height - 110);

    doc.end();
};

module.exports = { generateCertificate };
