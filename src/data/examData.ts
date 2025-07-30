import { Question, Student, ExamConfig } from '../types/exam';

// Production student database (600 students total)
export const PRODUCTION_STUDENTS: Student[] = [
  // Slot 1 Students (SET_A) - 9:00-9:45 AM
  ...Array.from({length: 100}, (_, i) => ({
    id: `A${String(i + 1).padStart(3, '0')}`,
    name: `Student A${i + 1}`,
    isActive: true,
    examSet: 'SET_A',
    slotTime: 'SLOT_1',
    hasCompletedExam: false
  })),
  
  // Slot 2 Students (SET_B) - 10:00-10:45 AM
  ...Array.from({length: 100}, (_, i) => ({
    id: `B${String(i + 1).padStart(3, '0')}`,
    name: `Student B${i + 1}`,
    isActive: true,
    examSet: 'SET_B',
    slotTime: 'SLOT_2',
    hasCompletedExam: false
  })),
  
  // Slot 3 Students (SET_C) - 11:00-11:45 AM
  ...Array.from({length: 100}, (_, i) => ({
    id: `C${String(i + 1).padStart(3, '0')}`,
    name: `Student C${i + 1}`,
    isActive: true,
    examSet: 'SET_C',
    slotTime: 'SLOT_3',
    hasCompletedExam: false
  })),
  
  // Slot 4 Students (SET_D) - 1:00-1:45 PM
  ...Array.from({length: 100}, (_, i) => ({
    id: `D${String(i + 1).padStart(3, '0')}`,
    name: `Student D${i + 1}`,
    isActive: true,
    examSet: 'SET_D',
    slotTime: 'SLOT_4',
    hasCompletedExam: false
  })),
  
  // Slot 5 Students (SET_E) - 2:00-2:45 PM
  ...Array.from({length: 100}, (_, i) => ({
    id: `E${String(i + 1).padStart(3, '0')}`,
    name: `Student E${i + 1}`,
    isActive: true,
    examSet: 'SET_E',
    slotTime: 'SLOT_5',
    hasCompletedExam: false
  })),
  
  // Slot 6 Students (SET_F) - 3:00-3:45 PM
  ...Array.from({length: 100}, (_, i) => ({
    id: `F${String(i + 1).padStart(3, '0')}`,
    name: `Student F${i + 1}`,
    isActive: true,
    examSet: 'SET_F',
    slotTime: 'SLOT_6',
    hasCompletedExam: false
  }))
];

// Testing student database - Updated with TEST100-TEST200 range
export const TESTING_STUDENTS: Student[] = [
  // Original test students (TEST001-TEST050)
  ...Array.from({length: 50}, (_, i) => ({
    id: `TEST${String(i + 1).padStart(3, '0')}`,
    name: `Test Student ${i + 1}`,
    isActive: true,
    examSet: 'SET_A',
    slotTime: 'SLOT_1',
    hasCompletedExam: false
  })),
  
  // New test users TEST100-TEST200 (101 students total)
  ...Array.from({length: 101}, (_, i) => {
    const testNumber = i + 100; // This gives us 100, 101, 102, ..., 200
    const examSets = ['SET_A', 'SET_B', 'SET_C', 'SET_D', 'SET_E', 'SET_F'];
    const slots = ['SLOT_1', 'SLOT_2', 'SLOT_3', 'SLOT_4', 'SLOT_5', 'SLOT_6'];
    const setIndex = i % 6; // Cycle through exam sets
    
    return {
      id: `TEST${testNumber}`,
      name: `Test User ${testNumber}`,
      isActive: true,
      examSet: examSets[setIndex],
      slotTime: slots[setIndex],
      hasCompletedExam: false
    };
  })
];

// Combined students list (backward compatibility)
export const STUDENTS: Student[] = [...PRODUCTION_STUDENTS, ...TESTING_STUDENTS];

// Updated exam configuration with new scoring system
export const EXAM_CONFIG: ExamConfig = {
  sections: {
    networking: {
      name: 'Networking and Wi-Fi Fundamentals',
      duration: 45, // Total 45 minutes for entire exam
      description: 'Computer networking fundamentals, Wi-Fi protocols, wireless technologies, and network security (40 questions)'
    },
    'wifi-quant': {
      name: 'Wi-Fi Quantitative Assessment',
      duration: 0, // No separate time limit - part of the 45-minute total
      description: 'Quantitative aptitude and logical reasoning questions incorporating Wi-Fi terminology, networking concepts, and wireless technology scenarios (20 questions)'
    }
  },
  totalQuestions: 60, // 40 + 20 = 60 total questions
  warningThreshold: 5, // Warning at 5 minutes remaining
  longQuestionThreshold: 5, // Warning if spending more than 5 minutes on one question
  inactivityTimeout: 10, // 10 minutes of inactivity timeout
  scoring: {
    correctAnswer: 1, // +1 for correct answer
    wrongAnswer: -0.25, // -0.25 for wrong answer
    unanswered: 0 // 0 for unanswered questions
  }
};

// Questions database (keeping original structure)
export const QUESTIONS: Question[] = [
  // Networking and Wi-Fi Fundamentals Questions (40 total)
  
  // Easy Questions (15)
  {
    id: 'NET001',
    section: 'networking',
    question: 'What is the default subnet mask for a Class C IP address?',
    options: ['255.255.0.0', '255.255.255.0', '255.0.0.0', '255.255.255.255'],
    correctAnswer: 1,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'NET002',
    section: 'networking',
    question: 'Which protocol is used for secure web browsing?',
    options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
    correctAnswer: 1,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'NET003',
    section: 'networking',
    question: 'What does OSI stand for in networking?',
    options: ['Open Systems Interconnection', 'Operating System Interface', 'Open Source Initiative', 'Optical Signal Interface'],
    correctAnswer: 0,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'NET004',
    section: 'networking',
    question: 'Which port number is typically used for SSH?',
    options: ['21', '22', '23', '25'],
    correctAnswer: 1,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'NET005',
    section: 'networking',
    question: 'What does Wi-Fi stand for?',
    options: ['Wireless Fidelity', 'Wireless Frequency', 'Wide Frequency', 'Wireless Function'],
    correctAnswer: 0,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'NET006',
    section: 'networking',
    question: 'Which frequency band is commonly used by Wi-Fi 802.11n?',
    options: ['2.4 GHz only', '5 GHz only', 'Both 2.4 GHz and 5 GHz', '6 GHz only'],
    correctAnswer: 2,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'NET007',
    section: 'networking',
    question: 'What does DNS stand for?',
    options: ['Domain Name System', 'Dynamic Network Service', 'Data Network Security', 'Digital Name Server'],
    correctAnswer: 0,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'NET008',
    section: 'networking',
    question: 'Which device operates at the Physical layer of the OSI model?',
    options: ['Router', 'Switch', 'Hub', 'Bridge'],
    correctAnswer: 2,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'NET009',
    section: 'networking',
    question: 'What is the standard port for HTTP?',
    options: ['80', '443', '21', '25'],
    correctAnswer: 0,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'NET010',
    section: 'networking',
    question: 'Which Wi-Fi security protocol is considered most secure?',
    options: ['WEP', 'WPA', 'WPA2', 'WPA3'],
    correctAnswer: 3,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'NET011',
    section: 'networking',
    question: 'What is the maximum theoretical speed of 802.11ac?',
    options: ['54 Mbps', '150 Mbps', '600 Mbps', '1.3 Gbps'],
    correctAnswer: 3,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'NET012',
    section: 'networking',
    question: 'Which topology connects all devices to a central hub?',
    options: ['Bus', 'Ring', 'Star', 'Mesh'],
    correctAnswer: 2,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'NET013',
    section: 'networking',
    question: 'What does SSID stand for in Wi-Fi networks?',
    options: ['Service Set Identifier', 'Secure Socket ID', 'System Service ID', 'Signal Strength Indicator'],
    correctAnswer: 0,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'NET014',
    section: 'networking',
    question: 'Which protocol is used for email retrieval?',
    options: ['SMTP', 'POP3', 'HTTP', 'FTP'],
    correctAnswer: 1,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'NET015',
    section: 'networking',
    question: 'What is the range of a typical Wi-Fi router indoors?',
    options: ['10-20 meters', '30-50 meters', '100-150 meters', '200-300 meters'],
    correctAnswer: 1,
    difficulty: 'easy',
    examSet: 'SET_A'
  },

  // Medium Questions (15)
  {
    id: 'NET016',
    section: 'networking',
    question: 'What is the purpose of ARP in networking?',
    options: ['Address Resolution Protocol - maps IP to MAC addresses', 'Authentication and Registration Protocol', 'Automatic Routing Protocol', 'Application Request Protocol'],
    correctAnswer: 0,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'NET017',
    section: 'networking',
    question: 'Which layer of the OSI model handles encryption?',
    options: ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Presentation Layer'],
    correctAnswer: 3,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'NET018',
    section: 'networking',
    question: 'What is the difference between 2.4 GHz and 5 GHz Wi-Fi bands?',
    options: ['2.4 GHz has longer range, 5 GHz has higher speed', '5 GHz has longer range, 2.4 GHz has higher speed', 'Both have same range and speed', '2.4 GHz is newer technology'],
    correctAnswer: 0,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'NET019',
    section: 'networking',
    question: 'Which command is used to test network connectivity?',
    options: ['ping', 'tracert', 'netstat', 'ipconfig'],
    correctAnswer: 0,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'NET020',
    section: 'networking',
    question: 'What is the purpose of a subnet mask?',
    options: ['To encrypt data', 'To identify network and host portions of an IP address', 'To route packets', 'To resolve domain names'],
    correctAnswer: 1,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'NET021',
    section: 'networking',
    question: 'Which Wi-Fi standard introduced MIMO technology?',
    options: ['802.11a', '802.11g', '802.11n', '802.11ac'],
    correctAnswer: 2,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'NET022',
    section: 'networking',
    question: 'What is the maximum number of hosts in a /24 subnet?',
    options: ['254', '255', '256', '253'],
    correctAnswer: 0,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'NET023',
    section: 'networking',
    question: 'Which device operates at Layer 3 of the OSI model?',
    options: ['Hub', 'Switch', 'Router', 'Repeater'],
    correctAnswer: 2,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'NET024',
    section: 'networking',
    question: 'What is the purpose of DHCP?',
    options: ['Domain name resolution', 'Dynamic IP address assignment', 'Data encryption', 'Network monitoring'],
    correctAnswer: 1,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'NET025',
    section: 'networking',
    question: 'Which Wi-Fi channel width provides the highest throughput?',
    options: ['20 MHz', '40 MHz', '80 MHz', '160 MHz'],
    correctAnswer: 3,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'NET026',
    section: 'networking',
    question: 'What is a MAC address?',
    options: ['Media Access Control - physical address of network interface', 'Message Authentication Code', 'Multiple Access Channel', 'Managed Access Control'],
    correctAnswer: 0,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'NET027',
    section: 'networking',
    question: 'Which cable type is immune to electromagnetic interference?',
    options: ['Coaxial', 'Twisted Pair', 'Fiber Optic', 'Ethernet'],
    correctAnswer: 2,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'NET028',
    section: 'networking',
    question: 'What is the purpose of NAT?',
    options: ['Network Address Translation - maps private to public IP addresses', 'Network Access Token', 'Network Authentication Tool', 'Network Analysis Tool'],
    correctAnswer: 0,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'NET029',
    section: 'networking',
    question: 'Which Wi-Fi security feature prevents unauthorized access points?',
    options: ['WPS', 'MAC filtering', 'Rogue AP detection', 'Channel bonding'],
    correctAnswer: 2,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'NET030',
    section: 'networking',
    question: 'What does MU-MIMO stand for in Wi-Fi technology?',
    options: ['Multi-User Multiple Input Multiple Output', 'Maximum User MIMO', 'Managed User MIMO', 'Multiple Unified MIMO'],
    correctAnswer: 0,
    difficulty: 'medium',
    examSet: 'SET_A'
  },

  // Hard Questions (10)
  {
    id: 'NET031',
    section: 'networking',
    question: 'What is the maximum transmission unit (MTU) for Ethernet?',
    options: ['1024 bytes', '1500 bytes', '2048 bytes', '4096 bytes'],
    correctAnswer: 1,
    difficulty: 'hard',
    examSet: 'SET_A'
  },
  {
    id: 'NET032',
    section: 'networking',
    question: 'Which Wi-Fi 6 feature improves efficiency in dense environments?',
    options: ['OFDMA', 'QAM-256', 'Beamforming', 'Channel bonding'],
    correctAnswer: 0,
    difficulty: 'hard',
    examSet: 'SET_A'
  },
  {
    id: 'NET033',
    section: 'networking',
    question: 'In OSPF, what is the purpose of the Designated Router (DR)?',
    options: ['To encrypt routing updates', 'To reduce LSA flooding in broadcast networks', 'To authenticate routing peers', 'To compress routing tables'],
    correctAnswer: 1,
    difficulty: 'hard',
    examSet: 'SET_A'
  },
  {
    id: 'NET034',
    section: 'networking',
    question: 'What is the difference between stateful and stateless firewalls?',
    options: ['Stateful tracks connection state, stateless examines each packet independently', 'Stateless tracks connection state, stateful examines each packet independently', 'Both track connection state', 'Both examine packets independently'],
    correctAnswer: 0,
    difficulty: 'hard',
    examSet: 'SET_A'
  },
  {
    id: 'NET035',
    section: 'networking',
    question: 'Which Wi-Fi 6E feature utilizes the 6 GHz band?',
    options: ['Extended range', 'Reduced interference', 'Higher power output', 'Backward compatibility'],
    correctAnswer: 1,
    difficulty: 'hard',
    examSet: 'SET_A'
  },
  {
    id: 'NET036',
    section: 'networking',
    question: 'What is the purpose of BSS Coloring in Wi-Fi 6?',
    options: ['Visual network identification', 'Interference mitigation', 'Security enhancement', 'Power management'],
    correctAnswer: 1,
    difficulty: 'hard',
    examSet: 'SET_A'
  },
  {
    id: 'NET037',
    section: 'networking',
    question: 'Which protocol is used for secure tunneling in VPNs?',
    options: ['IPSec', 'L2TP', 'PPTP', 'All of the above'],
    correctAnswer: 3,
    difficulty: 'hard',
    examSet: 'SET_A'
  },
  {
    id: 'NET038',
    section: 'networking',
    question: 'What is the maximum number of spatial streams in 802.11ac Wave 2?',
    options: ['4', '6', '8', '12'],
    correctAnswer: 2,
    difficulty: 'hard',
    examSet: 'SET_A'
  },
  {
    id: 'NET039',
    section: 'networking',
    question: 'Which QoS mechanism provides guaranteed bandwidth in Wi-Fi networks?',
    options: ['WMM', 'EDCA', 'HCCA', 'All of the above'],
    correctAnswer: 3,
    difficulty: 'hard',
    examSet: 'SET_A'
  },
  {
    id: 'NET040',
    section: 'networking',
    question: 'What is the purpose of Target Wake Time (TWT) in Wi-Fi 6?',
    options: ['Faster connection establishment', 'Power efficiency for IoT devices', 'Improved security', 'Better range'],
    correctAnswer: 1,
    difficulty: 'hard',
    examSet: 'SET_A'
  },

  // Wi-Fi Quantitative Assessment Questions (20 total)
  
  {
    id: 'WQ001',
    section: 'wifi-quant',
    question: 'A Wi-Fi network has 8 access points, each supporting 50 concurrent users. If the network utilization is 75%, how many users are currently connected?',
    options: ['200', '250', '300', '400'],
    correctAnswer: 2,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'WQ002',
    section: 'wifi-quant',
    question: 'If a wireless signal has a power of 100 mW and experiences a 3 dB loss, what is the resulting power?',
    options: ['25 mW', '50 mW', '75 mW', '97 mW'],
    correctAnswer: 1,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'WQ003',
    section: 'wifi-quant',
    question: 'A company needs to cover 4 floors with Wi-Fi. Each floor requires 6 access points. If each access point costs $200 and installation costs $50 per AP, what is the total cost?',
    options: ['$4,800', '$5,400', '$6,000', '$6,600'],
    correctAnswer: 2,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'WQ004',
    section: 'wifi-quant',
    question: 'In a sequence of Wi-Fi channel numbers: 1, 6, 11, 1, 6, 11, what is the next number?',
    options: ['1', '6', '11', '16'],
    correctAnswer: 0,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'WQ005',
    section: 'wifi-quant',
    question: 'If a Wi-Fi router transmits at 20 dBm and the cable loss is 2 dB, what is the effective radiated power?',
    options: ['18 dBm', '20 dBm', '22 dBm', '40 dBm'],
    correctAnswer: 0,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'WQ006',
    section: 'wifi-quant',
    question: 'A wireless network administrator needs to calculate bandwidth allocation. If 100 users each require 2 Mbps, and the total available bandwidth is 300 Mbps, what percentage of bandwidth will be utilized?',
    options: ['50%', '60%', '66.7%', '75%'],
    correctAnswer: 2,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'WQ007',
    section: 'wifi-quant',
    question: 'Complete the pattern: 2.4, 5, 6, 2.4, 5, 6, ?',
    options: ['2.4', '5', '6', '60'],
    correctAnswer: 0,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'WQ008',
    section: 'wifi-quant',
    question: 'If a Wi-Fi signal strength decreases by 6 dB every time the distance doubles, and the initial signal is -30 dBm at 1 meter, what is the signal strength at 4 meters?',
    options: ['-42 dBm', '-48 dBm', '-54 dBm', '-60 dBm'],
    correctAnswer: 1,
    difficulty: 'hard',
    examSet: 'SET_A'
  },
  {
    id: 'WQ009',
    section: 'wifi-quant',
    question: 'A network has 3 access points with throughputs of 150 Mbps, 300 Mbps, and 450 Mbps respectively. What is the average throughput?',
    options: ['250 Mbps', '275 Mbps', '300 Mbps', '325 Mbps'],
    correctAnswer: 2,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'WQ010',
    section: 'wifi-quant',
    question: 'If ROUTER is coded as SPVUFS in a wireless configuration system, how would ACCESS be coded?',
    options: ['BDDFTT', 'BDDETT', 'BDDFSS', 'BCCFSS'],
    correctAnswer: 0,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'WQ011',
    section: 'wifi-quant',
    question: 'A Wi-Fi survey shows signal strengths of -45 dBm, -52 dBm, -38 dBm, and -61 dBm. What is the range (difference between highest and lowest values)?',
    options: ['16 dB', '23 dB', '26 dB', '29 dB'],
    correctAnswer: 1,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'WQ012',
    section: 'wifi-quant',
    question: 'If 5 wireless engineers can configure 15 access points in 3 hours, how many access points can 8 engineers configure in 4 hours?',
    options: ['24', '28', '32', '36'],
    correctAnswer: 2,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'WQ013',
    section: 'wifi-quant',
    question: 'In a Wi-Fi network, if the ratio of 2.4 GHz to 5 GHz clients is 3:5 and there are 24 clients on 2.4 GHz, how many clients are on 5 GHz?',
    options: ['30', '35', '40', '45'],
    correctAnswer: 2,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'WQ014',
    section: 'wifi-quant',
    question: 'Which number should come next in the series: 802.11a, 802.11b, 802.11g, 802.11n, ?',
    options: ['802.11o', '802.11p', '802.11ac', '802.11x'],
    correctAnswer: 2,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'WQ015',
    section: 'wifi-quant',
    question: 'A wireless site survey reveals that 25% of the area has excellent signal strength, 40% has good signal, 30% has fair signal, and the rest has poor signal. What percentage has poor signal?',
    options: ['5%', '10%', '15%', '20%'],
    correctAnswer: 0,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'WQ016',
    section: 'wifi-quant',
    question: 'If a Wi-Fi network upgrade costs $50,000 and provides 25% improvement in performance, what is the cost per percentage point of improvement?',
    options: ['$1,500', '$2,000', '$2,500', '$3,000'],
    correctAnswer: 1,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'WQ017',
    section: 'wifi-quant',
    question: 'Complete the analogy: Router : Network :: Access Point : ?',
    options: ['Internet', 'Wireless', 'Cable', 'Switch'],
    correctAnswer: 1,
    difficulty: 'easy',
    examSet: 'SET_A'
  },
  {
    id: 'WQ018',
    section: 'wifi-quant',
    question: 'A Wi-Fi controller manages 20 access points. If each AP can handle 100 concurrent users and the controller operates at 80% capacity, how many total users can be supported?',
    options: ['1,400', '1,600', '1,800', '2,000'],
    correctAnswer: 1,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'WQ019',
    section: 'wifi-quant',
    question: 'If the power consumption of a Wi-Fi access point increases by 15% when operating in high-density mode, and the normal consumption is 12 watts, what is the high-density consumption?',
    options: ['13.2 watts', '13.8 watts', '14.4 watts', '15.0 watts'],
    correctAnswer: 1,
    difficulty: 'medium',
    examSet: 'SET_A'
  },
  {
    id: 'WQ020',
    section: 'wifi-quant',
    question: 'In a wireless mesh network, if each node can connect to 3 other nodes, and there are 8 nodes total, what is the maximum number of possible connections?',
    options: ['21', '24', '28', '32'],
    correctAnswer: 2,
    difficulty: 'hard',
    examSet: 'SET_A'
  }
];

// Utility functions
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getQuestionsBySection(section: string): Question[] {
  return shuffleArray(QUESTIONS.filter(q => q.section === section));
}

export function validateStudent(studentId: string): Student | null {
  return STUDENTS.find(student => student.id === studentId && student.isActive) || null;
}

// Calculate score with new scoring system (+1, -0.25, 0)
export function calculateScore(answers: Record<string, any>, questions: Question[]): {
  totalScore: number;
  maxScore: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  percentage: number;
} {
  let totalScore = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let unanswered = 0;

  questions.forEach(question => {
    const answer = answers[question.id];
    
    if (!answer || answer.selectedOption === null || answer.selectedOption === undefined) {
      // Unanswered: 0 points
      totalScore += EXAM_CONFIG.scoring.unanswered;
      unanswered++;
    } else if (answer.selectedOption === question.correctAnswer) {
      // Correct: +1 point
      totalScore += EXAM_CONFIG.scoring.correctAnswer;
      correctAnswers++;
    } else {
      // Wrong: -0.25 points
      totalScore += EXAM_CONFIG.scoring.wrongAnswer;
      wrongAnswers++;
    }
  });

  const maxScore = questions.length * EXAM_CONFIG.scoring.correctAnswer;
  const percentage = Math.max(0, Math.round((totalScore / maxScore) * 100));

  return {
    totalScore,
    maxScore,
    correctAnswers,
    wrongAnswers,
    unanswered,
    percentage
  };
}

// Check if student ID is for testing
export function isTestingStudent(studentId: string): boolean {
  return studentId.startsWith('TEST');
}

// Get student by ID from appropriate list
export function getStudentById(studentId: string): Student | null {
  if (isTestingStudent(studentId)) {
    return TESTING_STUDENTS.find(s => s.id === studentId) || null;
  }
  return PRODUCTION_STUDENTS.find(s => s.id === studentId) || null;
}