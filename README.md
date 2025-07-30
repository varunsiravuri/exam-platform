# Candela Written Test - Local Server Setup

A comprehensive technical interview assessment platform for Candela Technologies with local server hosting and result storage.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build the Application**
   ```bash
   npm run build
   ```

3. **Start the Local Server**
   ```bash
   npm start
   ```

   Or run development mode:
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open your browser and go to: `http://localhost:3001`
   - The exam interface will be available immediately

## 📱 **Simple Student Access**

### **For Students Taking the Exam:**

1. **Connect to Network**
   - Connect your device to the same Wi-Fi network as the exam server

2. **Open Browser**
   - Open any web browser (Chrome, Firefox, Safari, Edge)

3. **Go to Exam Link**
   - Type in the address bar: `http://[SERVER-IP]:3001`
   - The server will display the exact link when started

4. **Start Exam**
   - Enter your Student ID (e.g., STU001, STU002, etc.)
   - Click "Begin Interview Assessment"
   - Follow the on-screen instructions

### **Network Requirements:**
- All devices must be on the same local network
- No internet connection required
- Works on any device with a web browser

## 📁 File Storage Locations

### Exam Results Storage
All exam results are automatically saved to:
```
/exam-results/
├── STU001_Raj_2024-01-15T10-30-45-123Z.json
├── STU002_Vardhan_Siravuri_2024-01-15T11-15-22-456Z.json
└── ...
```

**File Naming Convention:**
`{StudentID}_{StudentName}_{Timestamp}.json`

### Result File Structure
Each result file contains:
```json
{
  "studentId": "STU001",
  "studentName": "Raj",
  "completionTime": "2024-01-15T10:30:45.123Z",
  "serverTimestamp": "2024-01-15T10:30:45.123Z",
  "savedAt": "1/15/2024, 10:30:45 AM",
  "totalQuestions": 60,
  "correctAnswers": 45,
  "incorrectAnswers": 10,
  "unanswered": 5,
  "percentage": 75,
  "grade": "B",
  "sectionBreakdown": [
    {
      "section": "networking",
      "totalQuestions": 40,
      "correctAnswers": 30,
      "percentage": 75
    },
    {
      "section": "wifi-quant",
      "totalQuestions": 20,
      "correctAnswers": 15,
      "percentage": 75
    }
  ],
  "detailedResults": [...]
}
```

## 🔧 Server Configuration

### Port Configuration
- Default port: `3001`
- Change port: Set environment variable `PORT=your_port`

### Network Access
- Server binds to `0.0.0.0` to accept connections from any device on the network
- Displays both localhost and network IP addresses on startup

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/save-results` | Save exam results |
| `GET` | `/api/results` | Get all results summary |
| `GET` | `/api/results/:filename` | Get specific result |
| `DELETE` | `/api/results/:filename` | Delete result file |

### Example API Usage

**Save Results:**
```bash
curl -X POST http://localhost:3001/api/save-results \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STU001",
    "studentName": "John Doe",
    "results": {...}
  }'
```

**Get All Results:**
```bash
curl http://localhost:3001/api/results
```

## 📊 Exam Configuration

### Current Setup
- **Section 1:** Networking and Wi-Fi Fundamentals (60 minutes, 40 questions)
- **Section 2:** Wi-Fi Quantitative Assessment (30 minutes, 20 questions)
- **Total Duration:** 90 minutes
- **Total Questions:** 60

### Student Database
Pre-configured students (modify in `src/data/examData.ts`):
- STU001 - Raj
- STU002 - Vardhan Siravuri
- STU003 - Deepika Balla
- STU004 - Manoj Kancharana
- STU005 - Yaswanth
- STU006 - Teja Pantham
- STU007 - Venu Madhav
- STU008 - Rudra Satish
- STU009 - Sahithi
- STU010 - Sai Kiran

## 🔒 Security Features

- **Tab Switch Detection:** Automatic warnings and session termination
- **Inactivity Monitoring:** 10-minute timeout
- **Session Management:** Secure student authentication
- **Result Integrity:** Server-side validation and storage

## 🎨 Features

- **Responsive Design:** Works on all devices
- **Accessibility:** High contrast mode, font size controls
- **Real-time Timer:** Section-based timing with warnings
- **Question Navigation:** Jump to any question, mark for review
- **Progress Tracking:** Visual progress indicators
- **Result Analytics:** Detailed performance breakdown

## 📝 Development

### Project Structure
```
├── src/
│   ├── components/          # React components
│   ├── contexts/           # React contexts
│   ├── data/              # Exam data and configuration
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── exam-results/          # Stored exam results
├── server.js             # Express server
└── package.json          # Dependencies and scripts
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run server` - Start production server
- `npm start` - Build and start production server
- `npm run lint` - Run ESLint

## 🔧 Customization

### Adding New Students
Edit `src/data/examData.ts`:
```javascript
export const STUDENTS: Student[] = [
  { id: 'STU011', name: 'New Student', isActive: true },
  // ... existing students
];
```

### Modifying Questions
Edit the `QUESTIONS` array in `src/data/examData.ts`

### Changing Exam Duration
Modify `EXAM_CONFIG` in `src/data/examData.ts`:
```javascript
export const EXAM_CONFIG: ExamConfig = {
  sections: {
    networking: {
      name: 'Networking and Wi-Fi Fundamentals',
      duration: 60, // minutes
      description: '...'
    }
  }
};
```

## 🚨 Troubleshooting

### Server Won't Start
- Check if port 3001 is available
- Ensure Node.js is installed
- Run `npm install` to install dependencies

### Students Can't Connect
- Verify all devices are on the same Wi-Fi network
- Check firewall settings on the server computer
- Try accessing from server computer first: `http://localhost:3001`

### Results Not Saving
- Verify server is running
- Check file permissions in project directory
- Look for error messages in server console

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run lint`

## 📞 Support

For technical support or questions about the exam system, please contact the development team.

---

**Powered by Candela Technologies**