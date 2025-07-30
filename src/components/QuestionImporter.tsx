import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertTriangle } from 'lucide-react';
import { useExam } from '../contexts/ExamContext';
import * as XLSX from 'xlsx';

export function QuestionImporter() {
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const [importedQuestions, setImportedQuestions] = useState<any[]>([]);
  const { state } = useExam();

  const downloadTemplate = () => {
    // Create sample data for the template
    const templateData = [
      {
        'Question ID': 'NET001',
        'Section': 'networking',
        'Question Text': 'What is the default subnet mask for a Class C IP address?',
        'Option A': '255.255.0.0',
        'Option B': '255.255.255.0',
        'Option C': '255.0.0.0',
        'Option D': '255.255.255.255',
        'Correct Answer': 'B',
        'Difficulty': 'easy',
        'Exam Set': 'SET_A'
      },
      {
        'Question ID': 'NET002',
        'Section': 'networking',
        'Question Text': 'Which protocol is used for secure web browsing?',
        'Option A': 'HTTP',
        'Option B': 'HTTPS',
        'Option C': 'FTP',
        'Option D': 'SMTP',
        'Correct Answer': 'B',
        'Difficulty': 'easy',
        'Exam Set': 'SET_A'
      },
      {
        'Question ID': 'WQ001',
        'Section': 'wifi-quant',
        'Question Text': 'A Wi-Fi network has 8 access points, each supporting 50 concurrent users. If the network utilization is 75%, how many users are currently connected?',
        'Option A': '200',
        'Option B': '250',
        'Option C': '300',
        'Option D': '400',
        'Correct Answer': 'C',
        'Difficulty': 'medium',
        'Exam Set': 'SET_A'
      }
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Create main questions sheet
    const questionsSheet = XLSX.utils.json_to_sheet(templateData);
    
    // Set column widths
    questionsSheet['!cols'] = [
      { width: 12 }, // Question ID
      { width: 15 }, // Section
      { width: 80 }, // Question Text
      { width: 30 }, // Option A
      { width: 30 }, // Option B
      { width: 30 }, // Option C
      { width: 30 }, // Option D
      { width: 15 }, // Correct Answer
      { width: 12 }, // Difficulty
      { width: 12 }  // Exam Set
    ];

    XLSX.utils.book_append_sheet(workbook, questionsSheet, 'Questions');

    // Create instructions sheet
    const instructions = [
      { 'Field': 'Question ID', 'Description': 'Unique identifier (e.g., NET001, WQ001)', 'Required': 'Yes', 'Format': 'Text' },
      { 'Field': 'Section', 'Description': 'networking OR wifi-quant', 'Required': 'Yes', 'Format': 'Text' },
      { 'Field': 'Question Text', 'Description': 'The actual question', 'Required': 'Yes', 'Format': 'Text' },
      { 'Field': 'Option A', 'Description': 'First answer option', 'Required': 'Yes', 'Format': 'Text' },
      { 'Field': 'Option B', 'Description': 'Second answer option', 'Required': 'Yes', 'Format': 'Text' },
      { 'Field': 'Option C', 'Description': 'Third answer option', 'Required': 'Yes', 'Format': 'Text' },
      { 'Field': 'Option D', 'Description': 'Fourth answer option', 'Required': 'Yes', 'Format': 'Text' },
      { 'Field': 'Correct Answer', 'Description': 'A, B, C, or D', 'Required': 'Yes', 'Format': 'Text' },
      { 'Field': 'Difficulty', 'Description': 'easy, medium, or hard', 'Required': 'Yes', 'Format': 'Text' },
      { 'Field': 'Exam Set', 'Description': 'SET_A, SET_B, SET_C, SET_D, SET_E, or SET_F', 'Required': 'Yes', 'Format': 'Text' }
    ];

    const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
    instructionsSheet['!cols'] = [
      { width: 20 },
      { width: 50 },
      { width: 15 },
      { width: 15 }
    ];

    XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

    // Create validation rules sheet
    const validationRules = [
      { 'Rule': 'Section Values', 'Valid Options': 'networking, wifi-quant' },
      { 'Rule': 'Correct Answer', 'Valid Options': 'A, B, C, D (case sensitive)' },
      { 'Rule': 'Difficulty Levels', 'Valid Options': 'easy, medium, hard' },
      { 'Rule': 'Exam Sets', 'Valid Options': 'SET_A, SET_B, SET_C, SET_D, SET_E, SET_F' },
      { 'Rule': 'Question ID Format', 'Valid Options': 'Must be unique (e.g., NET001, WQ001, CUSTOM001)' },
      { 'Rule': 'Required Fields', 'Valid Options': 'All fields are mandatory' }
    ];

    const validationSheet = XLSX.utils.json_to_sheet(validationRules);
    validationSheet['!cols'] = [
      { width: 25 },
      { width: 60 }
    ];

    XLSX.utils.book_append_sheet(workbook, validationSheet, 'Validation Rules');

    // Save file
    XLSX.writeFile(workbook, 'Candela_Question_Template.xlsx');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus('processing');
    setImportMessage('Processing Excel file...');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Read the Questions sheet
        const questionsSheet = workbook.Sheets['Questions'];
        if (!questionsSheet) {
          throw new Error('Questions sheet not found. Please use the provided template.');
        }

        const jsonData = XLSX.utils.sheet_to_json(questionsSheet);
        
        // Validate and transform data
        const questions = jsonData.map((row: any, index: number) => {
          const rowNum = index + 2; // Excel row number (accounting for header)
          
          // Validate required fields
          const requiredFields = [
            'Question ID', 'Section', 'Question Text', 
            'Option A', 'Option B', 'Option C', 'Option D',
            'Correct Answer', 'Difficulty', 'Exam Set'
          ];
          
          for (const field of requiredFields) {
            if (!row[field] || row[field].toString().trim() === '') {
              throw new Error(`Row ${rowNum}: Missing required field "${field}"`);
            }
          }

          // Validate section
          const validSections = ['networking', 'wifi-quant'];
          if (!validSections.includes(row['Section'])) {
            throw new Error(`Row ${rowNum}: Invalid section "${row['Section']}". Must be: ${validSections.join(', ')}`);
          }

          // Validate correct answer
          const validAnswers = ['A', 'B', 'C', 'D'];
          if (!validAnswers.includes(row['Correct Answer'])) {
            throw new Error(`Row ${rowNum}: Invalid correct answer "${row['Correct Answer']}". Must be: A, B, C, or D`);
          }

          // Validate difficulty
          const validDifficulties = ['easy', 'medium', 'hard'];
          if (!validDifficulties.includes(row['Difficulty'])) {
            throw new Error(`Row ${rowNum}: Invalid difficulty "${row['Difficulty']}". Must be: ${validDifficulties.join(', ')}`);
          }

          // Validate exam set
          const validExamSets = ['SET_A', 'SET_B', 'SET_C', 'SET_D', 'SET_E', 'SET_F'];
          if (!validExamSets.includes(row['Exam Set'])) {
            throw new Error(`Row ${rowNum}: Invalid exam set "${row['Exam Set']}". Must be: ${validExamSets.join(', ')}`);
          }

          // Convert correct answer letter to index
          const correctAnswerIndex = validAnswers.indexOf(row['Correct Answer']);

          return {
            id: row['Question ID'].toString().trim(),
            section: row['Section'],
            question: row['Question Text'].toString().trim(),
            options: [
              row['Option A'].toString().trim(),
              row['Option B'].toString().trim(),
              row['Option C'].toString().trim(),
              row['Option D'].toString().trim()
            ],
            correctAnswer: correctAnswerIndex,
            difficulty: row['Difficulty'],
            examSet: row['Exam Set']
          };
        });

        // Check for duplicate Question IDs
        const questionIds = questions.map(q => q.id);
        const duplicateIds = questionIds.filter((id, index) => questionIds.indexOf(id) !== index);
        if (duplicateIds.length > 0) {
          throw new Error(`Duplicate Question IDs found: ${duplicateIds.join(', ')}`);
        }

        setImportedQuestions(questions);
        setImportStatus('success');
        setImportMessage(`Successfully imported ${questions.length} questions!`);

        // Here you would typically save the questions to your database or state
        console.log('Imported Questions:', questions);

      } catch (error) {
        setImportStatus('error');
        setImportMessage(error instanceof Error ? error.message : 'Failed to process Excel file');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className={`min-h-screen p-6 ${
      state.highContrast ? 'bg-black text-white' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`${
          state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
        } rounded-2xl p-6 mb-8`}>
          <div className="flex items-center space-x-4">
            <FileSpreadsheet size={32} className={state.highContrast ? 'text-green-400' : 'text-green-600'} />
            <div>
              <h1 className={`font-bold ${
                state.fontSize === 'small' ? 'text-2xl' : 
                state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
              }`}>
                Question Import System
              </h1>
              <p className={`${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                Import questions from Excel spreadsheet
              </p>
            </div>
          </div>
        </div>

        {/* Download Template Section */}
        <div className={`${
          state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
        } rounded-2xl p-6 mb-8`}>
          <h2 className={`font-bold mb-4 ${
            state.fontSize === 'small' ? 'text-xl' : 
            state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
          }`}>
            Step 1: Download Template
          </h2>
          
          <p className={`mb-4 ${
            state.fontSize === 'small' ? 'text-sm' : 
            state.fontSize === 'large' ? 'text-lg' : 'text-base'
          } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
            Download the Excel template with the correct format and sample questions.
          </p>

          <button
            onClick={downloadTemplate}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              state.fontSize === 'small' ? 'text-sm' : 
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
            } ${
              state.highContrast 
                ? 'bg-green-800 text-green-200 hover:bg-green-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Download size={20} />
            <span>Download Excel Template</span>
          </button>
        </div>

        {/* Excel Format Guide */}
        <div className={`${
          state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
        } rounded-2xl p-6 mb-8`}>
          <h2 className={`font-bold mb-4 ${
            state.fontSize === 'small' ? 'text-xl' : 
            state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
          }`}>
            Excel Format Requirements
          </h2>

          <div className="overflow-x-auto">
            <table className={`w-full border-collapse ${
              state.highContrast ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <thead>
                <tr className={`${
                  state.highContrast ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <th className={`border p-3 text-left font-medium ${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  } ${state.highContrast ? 'border-gray-600' : 'border-gray-200'}`}>
                    Column Name
                  </th>
                  <th className={`border p-3 text-left font-medium ${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  } ${state.highContrast ? 'border-gray-600' : 'border-gray-200'}`}>
                    Description
                  </th>
                  <th className={`border p-3 text-left font-medium ${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  } ${state.highContrast ? 'border-gray-600' : 'border-gray-200'}`}>
                    Valid Values
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { column: 'Question ID', description: 'Unique identifier for the question', values: 'NET001, WQ001, etc.' },
                  { column: 'Section', description: 'Question category', values: 'networking, wifi-quant' },
                  { column: 'Question Text', description: 'The actual question', values: 'Any text' },
                  { column: 'Option A', description: 'First answer choice', values: 'Any text' },
                  { column: 'Option B', description: 'Second answer choice', values: 'Any text' },
                  { column: 'Option C', description: 'Third answer choice', values: 'Any text' },
                  { column: 'Option D', description: 'Fourth answer choice', values: 'Any text' },
                  { column: 'Correct Answer', description: 'The correct option letter', values: 'A, B, C, or D' },
                  { column: 'Difficulty', description: 'Question difficulty level', values: 'easy, medium, hard' },
                  { column: 'Exam Set', description: 'Which exam set this belongs to', values: 'SET_A, SET_B, SET_C, SET_D, SET_E, SET_F' }
                ].map((row, index) => (
                  <tr key={index}>
                    <td className={`border p-3 font-medium ${
                      state.fontSize === 'small' ? 'text-sm' : 
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    } ${state.highContrast ? 'border-gray-600' : 'border-gray-200'}`}>
                      {row.column}
                    </td>
                    <td className={`border p-3 ${
                      state.fontSize === 'small' ? 'text-sm' : 
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    } ${state.highContrast ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'}`}>
                      {row.description}
                    </td>
                    <td className={`border p-3 font-mono ${
                      state.fontSize === 'small' ? 'text-xs' : 
                      state.fontSize === 'large' ? 'text-base' : 'text-sm'
                    } ${state.highContrast ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                      {row.values}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload Section */}
        <div className={`${
          state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
        } rounded-2xl p-6 mb-8`}>
          <h2 className={`font-bold mb-4 ${
            state.fontSize === 'small' ? 'text-xl' : 
            state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
          }`}>
            Step 2: Upload Your Questions
          </h2>

          <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
            state.highContrast ? 'border-gray-600' : 'border-gray-300'
          }`}>
            <Upload size={48} className={`mx-auto mb-4 ${
              state.highContrast ? 'text-gray-400' : 'text-gray-500'
            }`} />
            
            <p className={`mb-4 ${
              state.fontSize === 'small' ? 'text-base' : 
              state.fontSize === 'large' ? 'text-xl' : 'text-lg'
            } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
              Select your completed Excel file
            </p>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="excel-upload"
              disabled={importStatus === 'processing'}
            />
            
            <label
              htmlFor="excel-upload"
              className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors ${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${
                importStatus === 'processing'
                  ? state.highContrast ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                  : state.highContrast ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <FileSpreadsheet size={20} />
              <span>{importStatus === 'processing' ? 'Processing...' : 'Choose Excel File'}</span>
            </label>
          </div>
        </div>

        {/* Status Messages */}
        {importStatus !== 'idle' && (
          <div className={`p-4 rounded-lg mb-6 ${
            importStatus === 'success' 
              ? state.highContrast ? 'bg-green-900 border border-green-600' : 'bg-green-50 border border-green-200'
              : importStatus === 'error'
                ? state.highContrast ? 'bg-red-900 border border-red-600' : 'bg-red-50 border border-red-200'
                : state.highContrast ? 'bg-blue-900 border border-blue-600' : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-center space-x-2">
              {importStatus === 'success' ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : importStatus === 'error' ? (
                <AlertTriangle className="text-red-600" size={20} />
              ) : (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              )}
              <span className={`${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${
                importStatus === 'success' 
                  ? state.highContrast ? 'text-green-200' : 'text-green-700'
                  : importStatus === 'error'
                    ? state.highContrast ? 'text-red-200' : 'text-red-700'
                    : state.highContrast ? 'text-blue-200' : 'text-blue-700'
              }`}>
                {importMessage}
              </span>
            </div>
          </div>
        )}

        {/* Preview Imported Questions */}
        {importedQuestions.length > 0 && (
          <div className={`${
            state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
          } rounded-2xl p-6`}>
            <h2 className={`font-bold mb-4 ${
              state.fontSize === 'small' ? 'text-xl' : 
              state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
            }`}>
              Imported Questions Preview
            </h2>
            
            <p className={`mb-4 ${
              state.fontSize === 'small' ? 'text-sm' : 
              state.fontSize === 'large' ? 'text-lg' : 'text-base'
            } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
              {importedQuestions.length} questions imported successfully
            </p>

            <div className="max-h-96 overflow-y-auto">
              {importedQuestions.slice(0, 5).map((question, index) => (
                <div key={index} className={`p-4 mb-4 rounded-lg border ${
                  state.highContrast ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className={`font-medium mb-2 ${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  }`}>
                    {question.id} - {question.section}
                  </div>
                  <div className={`mb-2 ${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  }`}>
                    {question.question}
                  </div>
                  <div className={`text-xs ${
                    state.highContrast ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Correct Answer: {['A', 'B', 'C', 'D'][question.correctAnswer]} | 
                    Difficulty: {question.difficulty} | 
                    Exam Set: {question.examSet}
                  </div>
                </div>
              ))}
              {importedQuestions.length > 5 && (
                <p className={`text-center ${
                  state.fontSize === 'small' ? 'text-sm' : 
                  state.fontSize === 'large' ? 'text-lg' : 'text-base'
                } ${state.highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                  ... and {importedQuestions.length - 5} more questions
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}