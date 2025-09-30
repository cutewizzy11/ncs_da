# Nigeria Customs Service (NCS) Computer Based Test (CBT) System

A comprehensive web-based examination platform for conducting secure, proctored online tests for Nigeria Customs Service recruitment and training programs.

## Features

- **Secure Candidate Authentication** using National Identification Number (NIN)
- **Facial Verification** to ensure test taker identity
- **Noise Detection** to maintain test integrity
- **Real-time Monitoring** with webcam feed
- **Multiple Test Subjects** with time limits
  - Mathematics (30 minutes)
  - English Language (25 minutes)
  - Current Affairs (20 minutes)
- **Responsive Design** works on desktop and tablet devices
- **Instant Results** with detailed performance analysis

## Technologies Used

- **Frontend**: React.js with Material-UI
- **State Management**: React Context API
- **Routing**: React Router
- **Webcam Integration**: react-webcam
- **Audio Processing**: Web Audio API
- **Styling**: CSS3 with CSS Variables

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or Yarn
- Modern web browser with camera and microphone access

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ncs-cbt-system.git
   cd ncs-cbt-system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running Locally

1. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

This will create a `build` directory with optimized production build files.

## Deployment

### Netlify

1. Push your code to a GitHub repository
2. Log in to [Netlify](https://www.netlify.com/)
3. Click "New site from Git"
4. Select your repository and branch
5. Set the build command to `npm run build` and publish directory to `build`
6. Click "Deploy site"

### Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

## Usage

1. **Candidate Login**
   - Enter your 11-digit NIN (National Identification Number)
   - Complete the facial verification process

2. **Test Instructions**
   - Read the test instructions carefully
   - Ensure your environment meets the requirements
   - Start the test when ready

3. **Taking the Test**
   - Answer all questions within the time limit
   - Navigate between questions using the question numbers
   - Submit your test when finished

4. **View Results**
   - See your score immediately after submission
   - Review correct and incorrect answers
   - Print or save your results

## Security Considerations

- All sensitive data should be handled securely
- Implement proper CORS policies in production
- Use HTTPS for all communications
- Store only necessary user data
- Implement rate limiting and other security measures

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Nigeria Customs Service
- Material-UI Team
- Create React App Team
- All contributors
