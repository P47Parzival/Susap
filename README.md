# Susap - AI-Powered Mock Interview Platform

A cutting-edge interview preparation platform leveraging AI voice agents and advanced language models to provide realistic interview experiences.

![Susap Banner](https://github.com/user-attachments/assets/1c0131c7-9f2d-4e3b-b47c-9679e76d8f9a)

## 🚀 Key Features

- **AI Voice Interviews**: Realistic conversations with Vapi AI-powered voice agents
- **Smart Feedback**: Real-time performance analysis and detailed feedback using Google Gemini
- **Comprehensive Dashboard**: Track progress and manage interview sessions
- **Secure Authentication**: Firebase-powered user management
- **Responsive Design**: Seamless experience across all devices

## 🛠️ Technology Stack

[![Next.js](https://img.shields.io/badge/-Next.JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/-Firebase-black?style=for-the-badge&logoColor=white&logo=firebase&color=DD2C00)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4)](https://tailwindcss.com/)
[![Vapi](https://img.shields.io/badge/-Vapi-white?style=for-the-badge&color=5dfeca)](https://vapi.ai/)

- **Frontend**: Next.js 14, TailwindCSS, shadcn/ui
- **Backend**: Firebase, Google Gemini API
- **Voice AI**: Vapi AI
- **Validation**: Zod
- **Authentication**: Firebase Auth

## ⚡ Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/susap.git
   cd susap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create `.env.local` and add:
   ```env
   NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_token
   NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_workflow_id
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
   # Add other Firebase config variables
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🎯 Core Features

### Interview Experience
- Dynamic conversation flow with AI voice agents
- Industry-specific interview questions
- Real-time voice interaction
- Natural language processing

### Performance Analytics
- Detailed feedback on responses
- Communication skills assessment
- Technical knowledge evaluation
- Improvement suggestions

### User Dashboard
- Interview history tracking
- Performance metrics
- Progress visualization
- Session recordings

## 🔒 Security

- Secure authentication flow
- Protected API endpoints
- Encrypted data storage
- GDPR-compliant data handling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vapi AI](https://vapi.ai) for voice agent technology
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI language model
- [Firebase](https://firebase.google.com) for backend services

---

<div align="center">
  <strong>Built with ❤️ for the future of interview preparation</strong>
</div>
