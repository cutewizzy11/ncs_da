// Test questions data
export const TEST_QUESTIONS = {
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
/**
 * Calculates test results based on provided answers
 * @param {Array} answers - Array of question objects with selected answers
 * @returns {Object} - Results including score, percentage, and pass/fail status
 */
export const calculateResults = (answers) => {
  if (!Array.isArray(answers) || answers.length === 0) {
    return {
      totalQuestions: 0,
      correctAnswers: 0,
      percentage: 0,
      passed: false,
      score: 0,
      maxScore: 0,
      questionsAnswered: 0
    };
  }

  const totalQuestions = answers.length;
  const questionsAnswered = answers.filter(q => q.selectedAnswer !== null).length;
  const correctAnswers = answers.reduce((count, question) => {
    return count + (question.selectedAnswer === question.correctAnswer ? 1 : 0);
  }, 0);
  
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const passMark = 50; // 50% pass mark
  
  return {
    totalQuestions,
    correctAnswers,
    questionsAnswered,
    unansweredQuestions: totalQuestions - questionsAnswered,
    percentage,
    passed: percentage >= passMark,
    passMark,
    score: correctAnswers,
    maxScore: totalQuestions,
    scorePercentage: percentage,
    isPassingScore: percentage >= passMark,
    timestamp: new Date().toISOString()
  };
};

/**
 * Formats time in seconds to MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string (MM:SS)
 */
export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) {
    return '00:00';
  }
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Parses a time string in MM:SS format to seconds
 * @param {string} timeString - Time string in MM:SS format
 * @returns {number} - Time in seconds
 */
export const parseTimeToSeconds = (timeString) => {
  if (!timeString || typeof timeString !== 'string') return 0;
  
  const [minutes, seconds] = timeString.split(':').map(Number);
  return (minutes * 60) + (seconds || 0);
};

// Shuffle array (Fisher-Yates algorithm)
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Gets a random subset of questions for a given subject
 * @param {string} subject - The subject to get questions for
 * @param {number} count - Number of questions to return
 * @param {boolean} includeExplanations - Whether to include answer explanations
 * @returns {Array} - Array of randomly selected questions
 */
export const getRandomQuestions = (subject, count, includeExplanations = false) => {
  const subjectQuestions = TEST_QUESTIONS[subject]?.questions || [];
  
  if (subjectQuestions.length === 0) {
    console.warn(`No questions found for subject: ${subject}`);
    return [];
  }
  
  // If we want all questions or if there are fewer questions than requested
  if (count === 0 || subjectQuestions.length <= count) {
    return includeExplanations 
      ? [...subjectQuestions] 
      : subjectQuestions.map(({ explanation, ...rest }) => rest);
  }
  
  // Get random questions without duplicates
  const shuffled = shuffleArray([...subjectQuestions]);
  const selected = shuffled.slice(0, count);
  
  return includeExplanations 
    ? selected 
    : selected.map(({ explanation, ...rest }) => rest);
};

/**
 * Gets all questions for a subject
 * @param {string} subject - The subject to get questions for
 * @param {boolean} includeExplanations - Whether to include answer explanations
 * @returns {Array} - Array of all questions for the subject
 */
export const getAllQuestions = (subject, includeExplanations = false) => {
  const questions = TEST_QUESTIONS[subject]?.questions || [];
  return includeExplanations 
    ? [...questions] 
    : questions.map(({ explanation, ...rest }) => rest);
};

/**
 * Gets test duration for a subject in minutes
 * @param {string} subject - The subject to get duration for
 * @returns {number} - Duration in minutes
 */
export const getTestDuration = (subject) => {
  return TEST_QUESTIONS[subject]?.duration / 60 || 0;
};

/**
 * Gets test title for a subject
 * @param {string} subject - The subject to get title for
 * @returns {string} - Test title
 */
export const getTestTitle = (subject) => {
  return TEST_QUESTIONS[subject]?.title || 'Untitled Test';
};

/**
 * Validates a Nigerian National Identification Number (NIN)
 * @param {string} nin - The NIN to validate
 * @returns {Object} - Validation result with status and message
 */
export const validateNIN = (nin) => {
  // Trim whitespace and convert to string
  const cleanNIN = String(nin).trim();
  
  // Check if empty
  if (!cleanNIN) {
    return { 
      isValid: false, 
      message: 'NIN cannot be empty' 
    };
  }
  
  // Check length (should be 11 digits)
  if (cleanNIN.length !== 11) {
    return { 
      isValid: false, 
      message: 'NIN must be 11 digits long' 
    };
  }
  
  // Check if all characters are digits
  if (!/^\d+$/.test(cleanNIN)) {
    return { 
      isValid: false, 
      message: 'NIN can only contain numbers' 
    };
  }
  
  // Check if it's a test NIN (starts with 999)
  if (cleanNIN.startsWith('999')) {
    return { 
      isValid: true, 
      message: 'Valid test NIN',
      isTestNIN: true
    };
  }
  
  // Basic checksum validation (Luhn algorithm variant)
  const digits = cleanNIN.split('').map(Number);
  let sum = 0;
  
  for (let i = 0; i < 10; i++) {
    let digit = digits[i];
    if (i % 2 === 0) { // 0-based, so even indices are odd positions
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  const isValid = checkDigit === digits[10];
  
  return {
    isValid,
    message: isValid ? 'Valid NIN' : 'Invalid NIN checksum',
    isTestNIN: false
  };
};
