const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const os = require('os');
const XLSX = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist')); // Serve built React app

// Create results directory if it doesn't exist
const resultsDir = path.join(__dirname, 'exam-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Get local IP address
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}

// API endpoint to save exam results
app.post('/api/save-results', (req, res) => {
  try {
    const { studentId, studentName, results } = req.body;
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${studentId}_${studentName.replace(/\s+/g, '_')}_${timestamp}.json`;
    const filepath = path.join(resultsDir, filename);
    
    // Add server timestamp to results
    const completeResults = {
      ...results,
      serverTimestamp: new Date().toISOString(),
      savedAt: new Date().toLocaleString()
    };
    
    // Save to file
    fs.writeFileSync(filepath, JSON.stringify(completeResults, null, 2));
    
    console.log(`Results saved: ${filename}`);
    
    res.json({ 
      success: true, 
      message: 'Results saved successfully',
      filename: filename,
      filepath: filepath
    });
  } catch (error) {
    console.error('Error saving results:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save results',
      error: error.message 
    });
  }
});

// API endpoint to get all results
app.get('/api/results', (req, res) => {
  try {
    const files = fs.readdirSync(resultsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filepath = path.join(resultsDir, file);
        const stats = fs.statSync(filepath);
        const content = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        
        return {
          filename: file,
          studentId: content.studentId,
          studentName: content.studentName,
          percentage: content.percentage,
          grade: content.grade,
          completionTime: content.completionTime,
          createdAt: stats.birthtime,
          size: stats.size
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ success: true, results: files });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch results',
      error: error.message 
    });
  }
});

// API endpoint to get specific result
app.get('/api/results/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(resultsDir, filename);
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Result file not found' 
      });
    }
    
    const content = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch result',
      error: error.message 
    });
  }
});

// API endpoint to export results to Excel
app.get('/api/export-excel', (req, res) => {
  try {
    const files = fs.readdirSync(resultsDir).filter(file => file.endsWith('.json'));
    
    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No results found to export'
      });
    }

    // Read all result files
    const allResults = files.map(file => {
      const filepath = path.join(resultsDir, file);
      return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }).sort((a, b) => new Date(a.completionTime) - new Date(b.completionTime));

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Summary Results
    const summaryData = allResults.map(result => ({
      'Student ID': result.studentId,
      'Student Name': result.studentName,
      'Completion Date': new Date(result.completionTime).toLocaleDateString(),
      'Completion Time': new Date(result.completionTime).toLocaleTimeString(),
      'Total Questions': result.totalQuestions,
      'Correct Answers': result.correctAnswers,
      'Incorrect Answers': result.incorrectAnswers,
      'Unanswered': result.unanswered,
      'Percentage': `${result.percentage}%`,
      'Grade': result.grade,
      'Networking Score': result.sectionBreakdown?.find(s => s.section === 'networking')?.percentage + '%' || 'N/A',
      'Wi-Fi Quant Score': result.sectionBreakdown?.find(s => s.section === 'wifi-quant')?.percentage + '%' || 'N/A'
    }));

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    
    // Auto-size columns
    const summaryRange = XLSX.utils.decode_range(summarySheet['!ref']);
    const summaryColWidths = [];
    for (let C = summaryRange.s.c; C <= summaryRange.e.c; ++C) {
      let maxWidth = 10;
      for (let R = summaryRange.s.r; R <= summaryRange.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = summarySheet[cellAddress];
        if (cell && cell.v) {
          maxWidth = Math.max(maxWidth, cell.v.toString().length);
        }
      }
      summaryColWidths.push({ width: Math.min(maxWidth + 2, 30) });
    }
    summarySheet['!cols'] = summaryColWidths;

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Sheet 2: Section-wise Performance
    const sectionData = [];
    allResults.forEach(result => {
      if (result.sectionBreakdown) {
        result.sectionBreakdown.forEach(section => {
          sectionData.push({
            'Student ID': result.studentId,
            'Student Name': result.studentName,
            'Section': section.section === 'networking' ? 'Networking & Wi-Fi Fundamentals' : 'Wi-Fi Quantitative Assessment',
            'Total Questions': section.totalQuestions,
            'Correct Answers': section.correctAnswers,
            'Percentage': `${section.percentage}%`,
            'Completion Date': new Date(result.completionTime).toLocaleDateString()
          });
        });
      }
    });

    const sectionSheet = XLSX.utils.json_to_sheet(sectionData);
    
    // Auto-size columns for section sheet
    const sectionRange = XLSX.utils.decode_range(sectionSheet['!ref']);
    const sectionColWidths = [];
    for (let C = sectionRange.s.c; C <= sectionRange.e.c; ++C) {
      let maxWidth = 10;
      for (let R = sectionRange.s.r; R <= sectionRange.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = sectionSheet[cellAddress];
        if (cell && cell.v) {
          maxWidth = Math.max(maxWidth, cell.v.toString().length);
        }
      }
      sectionColWidths.push({ width: Math.min(maxWidth + 2, 35) });
    }
    sectionSheet['!cols'] = sectionColWidths;

    XLSX.utils.book_append_sheet(workbook, sectionSheet, 'Section Performance');

    // Sheet 3: Detailed Question Analysis
    const questionData = [];
    allResults.forEach(result => {
      if (result.detailedResults) {
        result.detailedResults.forEach((question, index) => {
          questionData.push({
            'Student ID': result.studentId,
            'Student Name': result.studentName,
            'Question Number': index + 1,
            'Section': question.section === 'networking' ? 'Networking & Wi-Fi Fundamentals' : 'Wi-Fi Quantitative Assessment',
            'Question': question.question.substring(0, 100) + (question.question.length > 100 ? '...' : ''),
            'Correct Answer': question.options[question.correctAnswer],
            'Student Answer': question.userAnswer !== null && question.userAnswer !== undefined ? question.options[question.userAnswer] : 'Not Answered',
            'Status': question.status === 'correct' ? 'Correct' : question.status === 'incorrect' ? 'Incorrect' : 'Unanswered',
            'Marked for Review': question.isMarkedForReview ? 'Yes' : 'No',
            'Difficulty': question.difficulty || 'N/A'
          });
        });
      }
    });

    const questionSheet = XLSX.utils.json_to_sheet(questionData);
    
    // Auto-size columns for question sheet
    const questionRange = XLSX.utils.decode_range(questionSheet['!ref']);
    const questionColWidths = [];
    for (let C = questionRange.s.c; C <= questionRange.e.c; ++C) {
      let maxWidth = 10;
      for (let R = questionRange.s.r; R <= questionRange.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = questionSheet[cellAddress];
        if (cell && cell.v) {
          maxWidth = Math.max(maxWidth, cell.v.toString().length);
        }
      }
      questionColWidths.push({ width: Math.min(maxWidth + 2, 50) });
    }
    questionSheet['!cols'] = questionColWidths;

    XLSX.utils.book_append_sheet(workbook, questionSheet, 'Detailed Analysis');

    // Sheet 4: Statistics
    const totalStudents = allResults.length;
    const averageScore = totalStudents > 0 ? (allResults.reduce((sum, r) => sum + r.percentage, 0) / totalStudents).toFixed(2) : 0;
    const gradeDistribution = allResults.reduce((acc, r) => {
      acc[r.grade] = (acc[r.grade] || 0) + 1;
      return acc;
    }, {});

    const statsData = [
      { 'Metric': 'Total Students', 'Value': totalStudents },
      { 'Metric': 'Average Score', 'Value': `${averageScore}%` },
      { 'Metric': 'Highest Score', 'Value': totalStudents > 0 ? `${Math.max(...allResults.map(r => r.percentage))}%` : 'N/A' },
      { 'Metric': 'Lowest Score', 'Value': totalStudents > 0 ? `${Math.min(...allResults.map(r => r.percentage))}%` : 'N/A' },
      { 'Metric': '', 'Value': '' },
      { 'Metric': 'Grade Distribution', 'Value': '' },
      ...Object.entries(gradeDistribution).map(([grade, count]) => ({
        'Metric': `Grade ${grade}`,
        'Value': `${count} students`
      }))
    ];

    const statsSheet = XLSX.utils.json_to_sheet(statsData);
    statsSheet['!cols'] = [{ width: 20 }, { width: 15 }];
    XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistics');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Candela_Exam_Results_${timestamp}.xlsx`;
    const filepath = path.join(resultsDir, filename);

    // Write Excel file
    XLSX.writeFile(workbook, filepath);

    console.log(`Excel export created: ${filename}`);

    // Send file for download
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Error sending Excel file:', err);
        res.status(500).json({
          success: false,
          message: 'Failed to download Excel file'
        });
      }
    });

  } catch (error) {
    console.error('Error creating Excel export:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Excel export',
      error: error.message
    });
  }
});

// API endpoint to delete a result
app.delete('/api/results/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(resultsDir, filename);
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Result file not found' 
      });
    }
    
    fs.unlinkSync(filepath);
    console.log(`Result deleted: ${filename}`);
    
    res.json({ 
      success: true, 
      message: 'Result deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting result:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete result',
      error: error.message 
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIPAddress();
  console.log(`🚀 Candela Written Test Server Started!`);
  console.log(`📍 Local Access: http://localhost:${PORT}`);
  console.log(`🌐 Network Access: http://${localIP}:${PORT}`);
  console.log(`📁 Results stored in: ${resultsDir}`);
  console.log(`\n📋 STUDENT INSTRUCTIONS:`);
  console.log(`   1. Connect to the same Wi-Fi network as this computer`);
  console.log(`   2. Open browser and go to: http://${localIP}:${PORT}`);
  console.log(`   3. Enter your Student ID to begin the exam`);
  console.log(`\n📊 API endpoints:`);
  console.log(`   POST /api/save-results - Save exam results`);
  console.log(`   GET  /api/results - Get all results`);
  console.log(`   GET  /api/results/:filename - Get specific result`);
  console.log(`   GET  /api/export-excel - Export results to Excel`);
  console.log(`   DELETE /api/results/:filename - Delete result`);
});