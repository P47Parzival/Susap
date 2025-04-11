import { motion } from 'framer-motion';
import { Users, Notebook as Robot, Video, Brain, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function FallingParticle({ delay }: { delay: number }) {
  const randomX = Math.random() * 100 - 50; // Random X position between -50 and 50
  
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-indigo-400/30"
      initial={{ 
        x: randomX,
        y: -20,
        opacity: 0 
      }}
      animate={{ 
        y: 200,
        opacity: [0, 1, 1, 0],
        x: randomX + (Math.random() * 50 - 25)
      }}
      transition={{ 
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeIn"
      }}
    />
  );
}

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <FallingParticle key={i} delay={i * 0.3} />
      ))}
    </div>
  );
}

function FloatingElement({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      animate={{ 
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32 relative">
        <ParticleField />
        <nav className="flex justify-between items-center mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-2xl font-bold text-indigo-600"
          >
            <Users className="h-8 w-8" />
            Susap
          </motion.div>
          <Link to="/mock-test">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </motion.button>
          </Link>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.h1 
              className="text-5xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Master Group Discussions with AI-Powered Practice
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Practice interviews and group discussions in real-time with our AI moderator. 
              Get instant feedback and improve your communication skills.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              Start Practicing <ChevronRight className="h-5 w-5" />
            </motion.button>
          </motion.div>

          <div className="relative">
            <FloatingElement delay={0.2}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800"
                  alt="Group Discussion"
                  className="rounded-2xl shadow-2xl"
                />
              </motion.div>
            </FloatingElement>
            
            <FloatingElement delay={0.4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-10 -left-10 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3"
              >
                <Robot className="h-10 w-10 text-indigo-600" />
                <div>
                  <p className="font-semibold">AI Moderator</p>
                  <p className="text-sm text-gray-600">Always available</p>
                </div>
              </motion.div>
            </FloatingElement>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose InterviewPro?</h2>
            <p className="text-xl text-gray-600">Practice makes perfect with our cutting-edge features</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Video className="h-8 w-8 text-indigo-600" />,
                title: "Real-time Sessions",
                description: "Join live discussion rooms with other participants and practice together"
              },
              {
                icon: <Robot className="h-8 w-8 text-indigo-600" />,
                title: "AI Moderation",
                description: "Get instant feedback and guidance from our intelligent AI moderator"
              },
              {
                icon: <Brain className="h-8 w-8 text-indigo-600" />,
                title: "Skill Analysis",
                description: "Detailed insights and improvement suggestions after each session"
              }
            ].map((feature, index) => (
              <FloatingElement key={index} delay={index * 0.2}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-indigo-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </motion.div>
              </FloatingElement>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-indigo-600 text-white py-20 relative overflow-hidden"
      >
        <ParticleField />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            Ready to Improve Your Skills?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8"
          >
            Join thousands of users who are mastering group discussions
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Now
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default LandingPage;