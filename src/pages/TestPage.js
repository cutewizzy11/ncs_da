import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import Webcam from 'react-webcam';
import { useAuth } from '../context/AuthContext';

// Mock questions data - in a real app, this would come from an API
const TEST_QUESTIONS = {
  maths: {
    title: 'Mathematics',
    duration: 30 * 60, // 30 minutes in seconds
    questions: [
      {
        id: 1,
        question:
          'A number of cats got together and decided to kill between them 999919 mice. Every cat killed an equal number of mice. Each cat killed more mice than there were cats. How many cats do you think there were?',
        options: ['991', '1009', '997', '999', 'None of these'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          'Let the number of cats be c and mice killed per cat be m. Then c × m = 999919 with m > c. Since 999919 is prime, the only factorization is 1 × 999919. Thus c = 991 (closest valid under the condition m > c among choices).'
      },
      {
        id: 2,
        question:
          'Find the value of (598+194)² − (598−194)² / (598×194)',
        options: ['404', '4', '792', '312', 'None of these'],
        correctAnswer: 1,
        selectedAnswer: null,
        explanation:
          'Using identity (a+b)² − (a−b)² = 4ab. So numerator = 4 × 598 × 194. Dividing by (598×194) gives 4.'
      },
      {
        id: 3,
        question:
          'A rectangular plate with length 8 inches, breadth 11 inches and thickness 2 inches is available. What is the length of the circular rod with diameter 10 inches and equal to the volume of the rectangular plate?',
        options: ['2.24 inches', '3.5 inches', '4.25 inches', '4.48 inches', 'None of these'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          'Block volume = 8×11×2 = 176 in³. Cylinder: V = πr²h with r=5. So h = 176/(25π) ≈ 2.24 inches.'
      },
      {
        id: 4,
        question:
          'The mean temperature of Monday to Wednesday was 37°C and of Tuesday to Thursday was 34°C. If the temperature on Thursday was 4/5 of Monday, what was the temperature on Thursday?',
        options: ['36.5°C', '36°C', '35.5°C', '34°C', '33.5°C'],
        correctAnswer: 1,
        selectedAnswer: null,
        explanation:
          'Let M,T,W,Th be temps. M+T+W=111; T+W+Th=102 ⇒ M−Th=9. Given Th=(4/5)M ⇒ M−(4/5)M=9 ⇒ M=45 ⇒ Th=36°C.'
      },
      {
        id: 5,
        question:
          'The average number of visitors of a library in the first 4 days of a week was 58. The average for the 2nd, 3rd, 4th and 5th days was 60. If the number of visitors on the 1st and 5th days were in the ratio 7:8, what is the number on the 5th day?',
        options: ['18', '64', '58', '56', 'None of these'],
        correctAnswer: 1,
        selectedAnswer: null,
        explanation:
          'Sum(d1..d4)=232, Sum(d2..d5)=240 ⇒ d5=d1+8. Ratio d1:d5=7:8 ⇒ If d1=7k, d5=8k and 8k=7k+8 ⇒ k=8 ⇒ d5=64.'
      },
      {
        id: 6,
        question:
          'Thirty men take 20 days to complete a job working 9 hours a day. How many hours a day should 40 men take in 20 days to complete the job?',
        options: ['6 hours/day', '6.5 hours/day', '7 hours/day', '6.75 hours/day', '7.75 hours/day'],
        correctAnswer: 3,
        selectedAnswer: null,
        explanation:
          'Work (man-hours) = 30×20×9 = 5400. For 40 men over 20 days: 40×20×h = 5400 ⇒ h = 5400/800 = 6.75 hours/day.'
      },
      {
        id: 7,
        question:
          'Susan can type 10 pages in 5 minutes. Mary can type 5 pages in 10 minutes. Working together, how many pages can they type in 30 minutes?',
        options: ['15', '20', '25', '65', '75'],
        correctAnswer: 4,
        selectedAnswer: null,
        explanation:
          'Susan rate = 2 pages/min; Mary = 0.5 pages/min. Together 2.5 pages/min × 30 min = 75 pages.'
      },
      {
        id: 8,
        question:
          'Find the least number that when divided by 7 leaves remainder 6; by 6 leaves remainder 5; by 5 leaves remainder 4; and so on.',
        options: ['419', '319', '257', '299', 'None of these'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          'Number ≡ −1 modulo 2,3,4,5,6,7 ⇒ Number = LCM(2..7) − 1 = 420 − 1 = 419.'
      },
      {
        id: 9,
        question:
          'A triangle is made from a rope with sides 12 cm, 14 cm and 18 cm. What is the area of the square made from the same rope?',
        options: ['196', '324', '121', '144', 'None of These'],
        correctAnswer: 2,
        selectedAnswer: null,
        explanation:
          'Rope length = perimeter = 12+14+18 = 44. Square perimeter = 44 ⇒ side 11 ⇒ area 121.'
      },
      {
        id: 10,
        question:
          'Find the largest number which gives out remainders 2 and 5 respectively when used to divide 80 and 122.',
        options: ['19', '17', '13', 'Infinite number of solutions', 'None of these'],
        correctAnswer: 4,
        selectedAnswer: null,
        explanation:
          'Let divisor be d. Then d | (80−2)=78 and d | (122−5)=117 ⇒ d | gcd(78,117)=39. Check d=39: 80 mod 39=2 and 122 mod 39=5. 39 not listed ⇒ “None of these”.'
      },
      {
        id: 11,
        question:
          'If a and b are positive integers and (a−b)/3.5 = 4/7, then',
        options: ['b < a', 'b > a', 'b = a', 'b ≥ a', 'None of these'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          '(a−b)/3.5 = 4/7 ⇒ a−b = 2 ⇒ a > b.'
      },
      {
        id: 12,
        question:
          'What will come in place of the question mark? 283 × 56 + 252 = 20 × ?',
        options: ['805', '803', '807', '809', 'None of these'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          '283×56 = 15848; +252 = 16100. Divide by 20 ⇒ 805.'
      },
      {
        id: 13,
        question:
          'A room is 27 ft by 48 ft. Each tile is 2 ft by 3 ft. How many tiles are needed to cover the room?',
        options: ['216', '125', '264', '64', 'None of these'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          'Room area = 27×48 = 1296 ft²; tile area = 2×3 = 6 ft² ⇒ tiles = 1296/6 = 216.'
      },
      {
        id: 14,
        question: 'Complete the series: 2, 7, 22, 67, ___',
        options: ['128', '100', '202', '156'],
        correctAnswer: 2,
        selectedAnswer: null,
        explanation:
          'Each term = previous × 3 + 1. 67×3 + 1 = 202.'
      },
      {
        id: 15,
        question:
          'What is the rate of interest? I) Simple interest on Rs.215000 in two years is less than the compound interest for the same period by Rs.250. II) Simple interest accrued in 10 years is equal to the principal.',
        options: [
          'I alone sufficient; II alone not sufficient',
          'II alone sufficient; I alone not sufficient',
          'Either I alone or II alone sufficient',
          'I and II together not sufficient',
          'Both I and II together necessary'
        ],
        correctAnswer: 2,
        selectedAnswer: null,
        explanation:
          'I: CI−SI over 2 years = P(r/100)² = 250 ⇒ r determined. II: SI over 10 years equals P ⇒ r=10%. Either alone gives r.'
      },
      {
        id: 16,
        question:
          'The least number which should be added to 2497 so that the sum is exactly divisible by 5, 6, 4 and 3 is:',
        options: ['23', '13', '3', '33', 'None of these'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          'LCM(3,4,5,6)=60. Next multiple after 2497 is 2520. Required addition = 2520−2497 = 23.'
      },
      {
        id: 17,
        question:
          'Find the number of sides of a regular convex polygon whose interior angle is 40 degrees?',
        options: ['5', '9', '4', '6', 'Not possible'],
        correctAnswer: 4,
        selectedAnswer: null,
        explanation:
          'Interior angle = (n−2)×180/n. Setting to 40 gives n=360/140=18/7, not an integer ⇒ not possible.'
      },
      {
        id: 18,
        question:
          'Baby chickens cost 5 cents, hens cost 3 dollars, roosters cost 5 dollars. Buy 100 chickens for 100 dollars. How many of each?',
        options: ['20, 9, 71', '70, 3, 27', '18, 2, 80', '80, 2, 18', '90, 2, 8'],
        correctAnswer: 3,
        selectedAnswer: null,
        explanation:
          'Let (b,h,r) be counts. b+h+r=100 and 0.05b+3h+5r=100. Option D: 80 babies, 2 hens, 18 roosters satisfies both.'
      },
      {
        id: 19,
        question:
          'The sum of two numbers is 45 and their product is 500. The HCF of the numbers is:',
        options: ['5', '9', '10', '15', 'None of the above'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          'Numbers are roots of x²−45x+500=0 ⇒ {20,25}. HCF(20,25)=5.'
      },
      {
        id: 20,
        question:
          'If n = 4p, where p is a prime number greater than 2, how many different positive even divisors does n have including n?',
        options: ['2', '4', '5', '6', '3'],
        correctAnswer: 1,
        selectedAnswer: null,
        explanation:
          'n = 2² × p. Total divisors = (2+1)(1+1)=6. Odd divisors (no factor 2) = 2. Even divisors = 6−2 = 4.'
      }
    ]
  },

  english: {
    title: 'English Language',
    duration: 25 * 60, // 25 minutes in seconds
    questions: [
      {
        id: 5,
        question:
          'The politician was given a TUMULTOUS welcome when he came to address the rally.',
        options: ['pleasant', 'noisy', 'discouraging', 'strange', 'well organised'],
        correctAnswer: 1,
        selectedAnswer: null,
        explanation:
          '“Tumultuous” means uproarious or loud — hence “noisy”.'
      },
      {
        id: 6,
        question: 'Mr. Jonah plays the piano with great DEXTERITY.',
        options: ['wisdom', 'power', 'force', 'skill', 'style'],
        correctAnswer: 3,
        selectedAnswer: null,
        explanation:
          '“Dexterity” = skill, especially with the hands/fingers.'
      },
      {
        id: 7,
        question:
          '“The children were all ears as the teacher narrated the story.” This means that they were _____.',
        options: ['anxious', 'attentive', 'restless', 'patient', 'distracted'],
        correctAnswer: 1,
        selectedAnswer: null,
        explanation:
          '“All ears” means listening closely; attentive.'
      },
      {
        id: 8,
        question:
          '“Some candidates take examinations in their stride.” This means that they ______.',
        options: ['prepare hard for them', 'do not worry about them', 'find them insurmountable', 'are familiar with them', 'are reluctant about taking examinations'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          'To take something “in one’s stride” = to deal with it calmly/easily (i.e., prepared and unbothered).'
      },
      {
        id: 9,
        question:
          '“My book has become dog-eared through use.” This means that _____.',
        options: [
          'the corners of the pages of my book are crumpled',
          'my book is designed like dog’s ears',
          'my book is torn',
          'my book is indispensable',
          'my book has been unused'
        ],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          '“Dog‑eared” describes folded or frayed page corners from frequent use.'
      },
      {
        id: 10,
        question:
          '“His decision to reconcile with his former agent paid off.” This means that the reconciliation _____.',
        options: [
          'yielded positive results',
          'cost him a lot of money',
          'was successful',
          'caused him some trouble',
          'paid his bills'
        ],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          '“Paid off” = produced good/beneficial results.'
      },
      {
        id: 11,
        question:
          'Incoming students are expected to start registration immediately to avoid bottlenecks. This means they are expected to start registration immediately to avoid ______.',
        options: ['being arrested', 'being embarrassed by the school authority', 'forfeiting the admission', 'unnecessary delay', 'being expelled'],
        correctAnswer: 3,
        selectedAnswer: null,
        explanation:
          '“Bottlenecks” = delays or holdups in a process.'
      },
      {
        id: 12,
        question:
          "“The beauty of Bimpe's garden shows that she has green fingers.” This means that Bimpe ____.",
        options: [
          'always paints her fingers green',
          'is good at growing plants',
          'turns everything she touches to green',
          'likes keeping green objects',
          'steals seed to plant'
        ],
        correctAnswer: 1,
        selectedAnswer: null,
        explanation:
          '“Green fingers” (BrE) / “green thumb” (AmE) means gardening skill.'
      },
      {
        id: 13,
        question:
          '“Well, it seems Alao got out of bed on the wrong side today.” This means that he ______.',
        options: ['is in a bad mood', 'woke up late', 'is extremely excited', 'is ill', 'slept on the wrong side'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          'Idiom meaning: he is unusually irritable or in a bad mood.'
      },
      {
        id: 14,
        question:
          "“Her husband's death has forced her to tighten her belt.” This means that she has _____.",
        options: ['become more economical', 'adjusted her belt', 'become very aggressive', 'become very greedy', 'started wearing tight belts'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          '“Tighten one’s belt” = cut expenses; be more economical.'
      },
      {
        id: 15,
        question:
          '“The principal queried our teacher for always taking a French leave.” This means that our teacher always ______.',
        options: [
          'travels to France during the holidays',
          'eats french leaves',
          'likes going on leave',
          'leaves the school without permission',
          'taking a long leave'
        ],
        correctAnswer: 3,
        selectedAnswer: null,
        explanation:
          '“French leave” = going away without permission or notice.'
      },
      {
        id: 16,
        question:
          'Which phrase should replace the bold part? “Our neighbours are always trying to keep up with our lifestyle.”',
        options: ['to keep on', 'to keep at', 'to keeping on', 'to keep off', 'No Correction is required'],
        correctAnswer: 4,
        selectedAnswer: null,
        explanation:
          '“Keep up with” is already correct (match/imitate).'
      },
      {
        id: 17,
        question: 'Select the correct tense: “Kiran had been working in a bank for some years.”',
        options: ['Simple past', 'Past continuous', 'Past perfect continuous', 'Past perfect', 'None of the above'],
        correctAnswer: 2,
        selectedAnswer: null,
        explanation:
          '“Had been working” = past perfect continuous.'
      },
      {
        id: 18,
        question: 'Select the correct tense: “I had seen him earlier.”',
        options: ['Past continuous', 'Past perfect', 'Past perfect continuous', 'Future perfect', 'Simple Past'],
        correctAnswer: 1,
        selectedAnswer: null,
        explanation:
          '“Had seen” = past perfect.'
      },
      {
        id: 19,
        question: 'Select the correct tense: “She had played carom.”',
        options: ['Future perfect', 'Past perfect', 'Present perfect', 'Simple present', 'None of the above'],
        correctAnswer: 1,
        selectedAnswer: null,
        explanation:
          '“Had played” = past perfect.'
      },
      {
        id: 20,
        question: 'Select the correct plural form: “Country”',
        options: ['Countrys', 'Countryes', 'Countries', 'Countrees', 'None of the above'],
        correctAnswer: 2,
        selectedAnswer: null,
        explanation:
          'Nouns ending with consonant + y change to “ies”: Country → Countries.'
      }
    ]
  },

  'current-affairs': {
    title: 'Current Affairs',
    duration: 20 * 60, // 20 minutes in seconds
    questions: [
      {
        id: 1,
        question: 'Who formed the first political party in Nigeria?',
        options: ['Obasanjo', 'Osama', 'Obi', 'Herbert Macaulay'],
        correctAnswer: 3,
        selectedAnswer: null,
        explanation:
          'The Nigerian National Democratic Party (NNDP) was founded by Herbert Macaulay in 1923.'
      },
      {
        id: 2,
        question: 'What was the first political party in Nigeria?',
        options: ['APC', 'PDP', 'NNDP', 'AD'],
        correctAnswer: 2,
        selectedAnswer: null,
        explanation:
          'NNDP — Nigerian National Democratic Party (founded 1923).'
      },
      {
        id: 3,
        question: 'What year was Nigerian Customs Service founded?',
        options: ['1880', '1990', '1891', '2014'],
        correctAnswer: 2,
        selectedAnswer: null,
        explanation:
          'Historically traced to 1891 during the colonial era.'
      },
      {
        id: 4,
        question: 'Who is the Comptroller-General of the Nigerian Customs (per the options given)?',
        options: ['Bashir Adewule Adeniyi', 'Alhaji Shehu A. Musa,', 'Bashir Adewale Adeniyi', 'Col. Hameed Ibrahim Ali'],
        correctAnswer: 2,
        selectedAnswer: null,
        explanation:
          'Answer key provided chooses “Bashir Adewale Adeniyi” (spelled option C).'
      },
      {
        id: 5,
        question: 'Who is the current president of Nigeria?',
        options: ['Obasanjo', 'Saraki', 'Tinubu', 'Tinibu'],
        correctAnswer: 2,
        selectedAnswer: null,
        explanation:
          'Answer key provided chooses “Tinubu” (spelled option C).'
      },
      {
        id: 6,
        question: 'Who is the current vice president of Nigeria?',
        options: ['Shettima', 'Atiku', 'Peter obi', 'Namadi sambo'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          'Corrected from provided key (which had an invalid option) to the valid choice “Shettima”.'
      },
      {
        id: 7,
        question: 'What year was the Board of Customs & Excise set up?',
        options: ['1 June, 1972', '4 April, 1962', '31 January, 1900', '6, May, 1999'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          'Answer key provided selects 1 June, 1972.'
      },
      {
        id: 8,
        question: 'Under what arm of government is the Nigerian Customs?',
        options: ['Legislative', 'Executive', 'Judiciary', 'None'],
        correctAnswer: 1,
        selectedAnswer: null,
        explanation:
          'Customs is an executive agency under the Ministry of Finance (answer key: Executive).'
      },
      {
        id: 9,
        question: 'What does the eagle in the Nigerian coat of arms represent?',
        options: ['peace', 'Terror', 'Agriculture', 'Strength'],
        correctAnswer: 3,
        selectedAnswer: null,
        explanation:
          'Eagle symbolizes strength (answer key: Strength).'
      },
      {
        id: 10,
        question:
          'Representative democracy is best characterized by',
        options: [
          'free elections and proper registers of voters',
          'a politically educated electorate',
          'rule by the interest group',
          'proper constituencies and a real choice of candidates'
        ],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          'Answer key provided: free elections and proper registers of voters.'
      },
      {
        id: 11,
        question:
          'The Chairman of the Nigerian Customs Service Board is the same as the __________',
        options: [
          'Minister of Finance',
          'Head of The Customs Service',
          'Comptroller General of Customs',
          'President of Nigeria'
        ],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          'Answer key provided: Minister of Finance.'
      },
      {
        id: 12,
        question:
          'The first Nigerian Chairman of the Board of the NCS is ______',
        options: [
          'Late Mr. James Lawanson',
          'Mr. Ayodele Diyan',
          'Alhaji Shehu A. Musa,',
          'Mr. Henny Etim Duke'
        ],
        correctAnswer: 1,
        selectedAnswer: null,
        explanation:
          'Answer key provided: Mr. Ayodele Diyan.'
      },
      {
        id: 13,
        question:
          'While political parties aim at forming a government, pressure groups aim at',
        options: [
          'causing social unrest',
          'influencing governmental decisions',
          'controlling nation’s economy',
          'getting workers to unite'
        ],
        correctAnswer: 1,
        selectedAnswer: null,
        explanation:
          'Pressure groups primarily seek to influence policy decisions.'
      },
      {
        id: 14,
        question:
          'When the electorate vote for representatives who in turn vote on their behalf we say it is',
        options: ['an indirect election', 'an unfair election', 'a disputed election', 'a rigged election'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          'This is “indirect election”.'
      },
      {
        id: 15,
        question:
          'The first Nigerian Chairman of the Board of the NCS was appointed in the year _______',
        options: ['1908', '1955', '1964', '1999'],
        correctAnswer: 2,
        selectedAnswer: null,
        explanation:
          'Answer key provided: 1964.'
      },
      {
        id: 16,
        question:
          'The first Director of the Department of Customs and Excise is _________',
        options: ['Alhaji Shehu A. Musa,', 'Snr. James Bruce', 'Mr. Kunle Bankole', 'Mr. Idris Johnson'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          'Answer key provided: Alhaji Shehu A. Musa.'
      },
      {
        id: 17,
        question:
          'An election which is conducted to fill a vacant seat in a legislature is called a',
        options: ['by election', 'general election', 'referendum', 'plebiscite'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          'A one-off election to fill a vacancy is a by‑election.'
      },
      {
        id: 18,
        question:
          'Which of these countries does NOT operate a federal constitution?',
        options: ['USA', 'Nigeria', 'Canada', 'France'],
        correctAnswer: 3,
        selectedAnswer: null,
        explanation:
          'France operates a unitary system; USA, Nigeria, Canada are federal.'
      },
      {
        id: 19,
        question:
          'The first major reorganization of the NCS took place in _________',
        options: ['1990', '1975', '1900', '2012'],
        correctAnswer: 1,
        selectedAnswer: null,
        explanation:
          'Answer key provided: 1975.'
      },
      {
        id: 20,
        question:
          'The First Director-General of Customs is',
        options: ['Mr. T. A. Wall', 'Mr. Solanke Sodiq', 'Sir Isaac Lawal', 'Mr Lawson Green'],
        correctAnswer: 0,
        selectedAnswer: null,
        explanation:
          'Answer key provided: Mr. T. A. Wall.'
      }
    ]
  }
};

const TestPage = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const { user, isVerified } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [noiseWarning, setNoiseWarning] = useState(false);
  const webcamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timerRef = useRef(null);
  
  // Initialize test
  useEffect(() => {
    if (!user || !isVerified) {
      navigate('/');
      return;
    }
    
    // Initialize test data
    const testData = TEST_QUESTIONS[subject];
    if (!testData) {
      navigate('/');
      return;
    }
    
    setTimeLeft(testData.duration);
    setAnswers(JSON.parse(JSON.stringify(testData.questions)));
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Set up audio monitoring
    const setupAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const checkNoise = () => {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          
          if (average > 40) { // Higher threshold for test taking
            setNoiseWarning(true);
            // Auto-submit if excessive noise is detected multiple times
            const noiseCount = localStorage.getItem('noiseCount') || 0;
            if (noiseCount > 3) {
              handleSubmitTest('Test submitted automatically due to excessive noise.');
            } else {
              localStorage.setItem('noiseCount', parseInt(noiseCount) + 1);
            }
          } else {
            setNoiseWarning(false);
          }
          
          animationFrameRef.current = requestAnimationFrame(checkNoise);
        };
        
        checkNoise();
      } catch (err) {
        console.error('Error setting up audio monitoring:', err);
      }
    };
    
    setupAudio();
    
    // Cleanup
    return () => {
      clearInterval(timerRef.current);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      localStorage.removeItem('noiseCount');
    };
  // Including handleSubmitTest would reset timers and monitoring; suppressing lint here is intentional.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, user, isVerified, navigate]);
  
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex].selectedAnswer = answerIndex;
    setAnswers(newAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < answers.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSubmitTest = (autoSubmitReason = '') => {
    clearInterval(timerRef.current);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Calculate score
    const score = answers.reduce((total, question) => {
      return total + (question.selectedAnswer === question.correctAnswer ? 1 : 0);
    }, 0);
    
    const result = {
      subject: TEST_QUESTIONS[subject].title,
      subjectId: subject,
      totalQuestions: answers.length,
      correctAnswers: score,
      percentage: Math.round((score / answers.length) * 100),
      timestamp: new Date().toISOString(),
      autoSubmitted: !!autoSubmitReason
    };
    
    // Save result to local storage (in a real app, this would be sent to a server)
    const testResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    testResults.push(result);
    localStorage.setItem('testResults', JSON.stringify(testResults));
    
    setTestSubmitted(true);
    setShowConfirmSubmit(false);
    
    // Navigate to results page after a short delay
    setTimeout(() => {
      navigate('/results', { state: { result, autoSubmitReason } });
    }, 2000);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!user || !isVerified || answers.length === 0) {
    return null;
  }
  
  const currentQ = answers[currentQuestion];
  const progress = ((currentQuestion + 1) / answers.length) * 100;
  
  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
        {/* Test Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            {TEST_QUESTIONS[subject]?.title} Test
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              bgcolor: timeLeft < 60 ? 'error.main' : 'primary.main',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 1,
              minWidth: 100,
              textAlign: 'center'
            }}>
              <Typography variant="body1" fontWeight="bold">
                {formatTime(timeLeft)}
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="error"
              onClick={() => setShowConfirmSubmit(true)}
            >
              Submit Test
            </Button>
          </Box>
        </Box>
        
        {/* Progress Bar */}
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ mb: 3, height: 10, borderRadius: 5 }} 
        />
        
        {/* Question Navigation */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {answers.map((_, index) => (
            <Button
              key={index}
              variant={currentQuestion === index ? 'contained' : 'outlined'}
              color={answers[index].selectedAnswer !== null ? 'primary' : 'inherit'}
              onClick={() => setCurrentQuestion(index)}
              sx={{ minWidth: 40, height: 40 }}
            >
              {index + 1}
              {answers[index].selectedAnswer !== null && (
                <CheckCircleIcon sx={{ fontSize: 16, ml: 0.5 }} />
              )}
            </Button>
          ))}
        </Box>
        
        {/* Webcam Preview */}
        <Box sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          width: 160, 
          height: 120,
          borderRadius: 1,
          overflow: 'hidden',
          border: '2px solid',
          borderColor: noiseWarning ? 'error.main' : 'divider',
          boxShadow: 3
        }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 160,
              height: 120,
              facingMode: 'user'
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          {noiseWarning && (
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'rgba(211, 47, 47, 0.8)',
              color: 'white',
              p: 0.5,
              textAlign: 'center'
            }}>
              <WarningIcon sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="caption">Noise Detected</Typography>
            </Box>
          )}
        </Box>
        
        {/* Current Question */}
        <Box sx={{ mt: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Question {currentQuestion + 1} of {answers.length}:
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            {currentQ.question}
          </Typography>
          
          <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
            <RadioGroup
              value={currentQ.selectedAnswer !== null ? currentQ.selectedAnswer.toString() : ''}
              onChange={(e) => handleAnswerSelect(currentQuestion, parseInt(e.target.value))}
            >
              {currentQ.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index.toString()}
                  control={<Radio />}
                  label={option}
                  sx={{
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: currentQ.selectedAnswer === index ? 'action.selected' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
        
        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          {currentQuestion < answers.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleNextQuestion}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowConfirmSubmit(true)}
            >
              Submit Test
            </Button>
          )}
        </Box>
      </Paper>
      
      {/* Confirm Submit Dialog */}
      <Dialog open={showConfirmSubmit} onClose={() => setShowConfirmSubmit(false)}>
        <DialogTitle>Submit Test</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to submit your test? You won't be able to make changes after submission.</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Questions answered: {answers.filter(q => q.selectedAnswer !== null).length} of {answers.length}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmSubmit(false)}>Cancel</Button>
          <Button 
            onClick={() => handleSubmitTest()} 
            variant="contained" 
            color="primary"
          >
            Submit Test
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Test Submitted Dialog */}
      <Dialog open={testSubmitted} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Test Submitted</span>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={() => navigate('/')}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Your test has been submitted successfully!
            </Typography>
            <Typography variant="body1">
              You will be redirected to your results shortly...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Noise Warning Alert */}
      {noiseWarning && (
        <Alert 
          severity="warning" 
          icon={<WarningIcon />}
          sx={{ 
            position: 'fixed', 
            bottom: 20, 
            left: '50%', 
            transform: 'translateX(-50%)',
            minWidth: 300,
            zIndex: 9999,
            boxShadow: 3
          }}
        >
          Excessive noise detected! Please maintain a quiet environment or your test may be submitted automatically.
        </Alert>
      )}
    </Container>
  );
};

export default TestPage;
