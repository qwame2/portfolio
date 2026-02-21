'use client';

import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera } from '@react-three/drei';
import { 
  motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionTemplate, useMotionValue,
  useAnimation, useInView
} from 'framer-motion';
import { 
  Github, Linkedin, Mail, ChevronDown, Code, Server,
  Smartphone, Router, Shield, Terminal, MapPin, ArrowRight, Zap, ExternalLink,
  Play, X, Maximize2, Minimize2, Monitor, Smartphone as PhoneIcon, Globe,
  Eye, Code2, Database, Cpu, Layers, Cloud, Sparkles,
  Phone, CheckCircle, AlertCircle
} from 'lucide-react';

// --- SIMPLIFIED THREE.JS COMPONENTS (Fixed for hydration) ---

function TechShape({ position, color, speed, rotationSpeed, size = 1 }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if(meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed;
      meshRef.current.rotation.y += delta * rotationSpeed * 0.7;
      meshRef.current.rotation.z += delta * rotationSpeed * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[size, 0]} />
        <meshBasicMaterial 
          color={color} 
          wireframe 
          transparent 
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
}

function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} />
        
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1} 
        />
        
        <TechShape position={[4, 2, -5]} color="#06b6d4" speed={2} rotationSpeed={0.2} />
        <TechShape position={[-4, -2, -5]} color="#a855f7" speed={3} rotationSpeed={0.3} />
        <TechShape position={[0, 3, -8]} color="#ffffff" speed={1.5} rotationSpeed={0.1} />
        
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
}

// --- CONTACT FORM COMPONENT ---
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      // Using Formspree to send email to emmadom148@gmail.com
      // Replace 'YOUR_FORMSPREE_FORM_ID' with your actual Formspree form ID
      const response = await fetch('https://formspree.io/f/meekzovp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New Contact Form Message from ${formData.name}`,
          _replyto: formData.email
        }),
      });
      
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
      console.error('Contact form error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-mono text-cyan-400">NAME</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={2}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
            placeholder="Your Name"
            disabled={status === 'loading'}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-mono text-cyan-400">EMAIL</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
            placeholder="you@company.com"
            disabled={status === 'loading'}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-mono text-cyan-400">MESSAGE</label>
        <textarea
          rows={4}
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          minLength={10}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
          placeholder="How can I help you?"
          disabled={status === 'loading'}
        />
      </div>
      
      {/* Status Messages */}
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Message sent successfully!</p>
            <p className="text-green-300/70">I'll get back to you within 24 hours.</p>
          </div>
        </motion.div>
      )}
      
      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Failed to send message</p>
            <p className="text-red-300/70">{errorMessage}</p>
          </div>
        </motion.div>
      )}
      
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
      >
        {status === 'loading' ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            SENDING...
          </>
        ) : (
          <>
            SEND MESSAGE
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
      
      <div className="text-xs text-gray-500 text-center pt-2">
        <p>Messages will be sent directly to emmadom148@gmail.com</p>
      </div>
    </form>
  );
}

// --- ANIMATED MOCKUP COMPONENTS ---

function DeviceMockup({ type = "desktop", screenshot, title, active = false, onClick }) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const variants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "backOut"
      }
    }
  };

  const deviceClasses = {
    desktop: {
      container: "w-full max-w-2xl mx-auto",
      frame: "relative rounded-lg border-8 border-gray-900 bg-gray-900 shadow-2xl",
      screen: "relative overflow-hidden bg-gradient-to-br from-gray-900 to-black",
      notch: "",
      button: "absolute bottom-4 right-4 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center"
    },
    tablet: {
      container: "w-full max-w-md mx-auto",
      frame: "relative rounded-xl border-8 border-gray-800 bg-gray-800 shadow-2xl",
      screen: "relative overflow-hidden bg-gradient-to-br from-gray-900 to-black",
      notch: "absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gray-900 rounded-b-lg",
      button: "absolute bottom-4 right-4 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"
    },
    mobile: {
      container: "w-full max-w-xs mx-auto",
      frame: "relative rounded-3xl border-8 border-gray-800 bg-gray-800 shadow-2xl",
      screen: "relative overflow-hidden bg-gradient-to-br from-gray-900 to-black",
      notch: "absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-b-xl",
      button: "absolute bottom-4 right-4 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"
    }
  };

  const device = deviceClasses[type];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 25 }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={`${device.container} cursor-pointer`}
    >
      <div className={device.frame}>
        {/* Device Notch */}
        {device.notch && <div className={device.notch} />}
        
        {/* Screen */}
        <div className={`aspect-[16/9] ${device.screen}`}>
          {/* Mockup Browser/App Bar */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-gray-900 to-gray-800 z-10 flex items-center px-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 text-center text-xs text-gray-400 truncate px-4">
              {title}
            </div>
          </div>
          
          {/* Screenshot/Content */}
          <div className="absolute inset-0 top-8 overflow-hidden">
            {screenshot ? (
              <img 
                src={screenshot} 
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700"
                style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
                <div className="text-center">
                  <Monitor className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-500 text-sm">{title} Preview</p>
                </div>
              </div>
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>
        
        {/* Interactive Button */}
        <motion.div 
          className={device.button}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          {active ? (
            <Maximize2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <Eye className="w-4 h-4 text-gray-400" />
          )}
        </motion.div>
        
        {/* Glow Effect when Active */}
        {active && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-xl -z-10"
          />
        )}
      </div>
      
      {/* Floating Info Badge */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-center"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
          <Monitor className="w-3 h-3" />
          {type.toUpperCase()} VIEW
        </span>
      </motion.div>
    </motion.div>
  );
}

function ProjectMockupCarousel() {
  const [activeProject, setActiveProject] = useState(0);
  const [activeDevice, setActiveDevice] = useState('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const projects = [
    {
      id: 1,
      title: "Digital Tax System",
      description: "Government tax management platform with real-time analytics",
      screenshots: {
        desktop: "/taximage.png",
        tablet: "/taximage.png",
        mobile: "/taximage.png"
      },
      tech: ['Laravel', 'MySQL', 'Tailwind', 'PHP'],
      features: ['Real-time Dashboards', 'Role-based Access', 'Secure Transactions'],
      color: "from-cyan-500 to-blue-600"
    },
    {
      id: 2,
      title: "GETFund Watch AI",
      description: "AI-powered recognition system for educational fund management",
      screenshots: {
        desktop: "/adomCam.png",
        tablet: "/adomCam.png",
        mobile: "/adomCam.png"
      },
      tech: ['Python', 'TensorFlow', 'OpenCV', 'PyQt5', 'YOLOv5'],
      features: ['Face Recognition', 'Real-time Alerts', 'Offline Operation'],
      color: "from-purple-500 to-pink-600"
    },
    {
      id: 3,
      title: "Military Inventory System",
      description: "Secure military asset tracking and management system",
      screenshots: {
        desktop: "/GM.png",
        tablet: "/GM.png",
        mobile: "/GM.png"
      },
      tech: ['Laravel', 'PHP', 'JavaScript', 'Bootstrap','Mysql'],
      features: ['Asset Tracking', 'Maintenance Scheduling', 'Secure Access'],
      color: "from-green-500 to-emerald-600"
    },
    {
      id: 4,
      title: "TowFlow Platform",
      description: "Vehicle towing and water delivery service platform",
      screenshots: {
        desktop: "/mobile.png",
        tablet: "/mobile.png",
        mobile: "/mobile.png"
      },
      tech: ['React', 'Node.js', 'PostgreSQL', 'googlemap'],
      features: ['Live Tracking', 'Payment Gateway', 'Driver Dispatch'],
      color: "from-orange-500 to-red-600"
    },
    {
      id: 5,
      title: "ChurchStream",
      description: "A church streaming app that streams ongoing live feed on multiple social media at the sametime",
      screenshots: {
        desktop: "/electron.png",
        tablet: "/electron.png",
        mobile: "/electron.png"
      },
      tech: ['Electron', 'Node.js'],
      features: ['Multiple feeds, Multiple Streaming', 'Edit live feeds'],
      color: "from-orange-500 to-red-600"
    },
    {
      id: 6,
      title: "The Church of Christ (SM) Website",
      description: "A church web platform built with Django that provides a digital church library, interactive online Bible games, church location map, podcast streaming, and multi-platform live streaming integration.",
      screenshots: {
        desktop: "/church.png",
        tablet: "/church.png",
        mobile: "/church.png"
      },
      tech: ['Python', 'Django', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS'],
      features: [
        'Digital Church Library',
        'Online Bible Games',
        'Interactive Church Map',
        'Podcast Streaming',
               
      ],
      color: "from-orange-500 to-red-600"
    }
  ];

  const activeProjectData = projects[activeProject];

  const nextProject = () => {
    setActiveProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setActiveProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Remove auto-rotation to prevent hydration issues
  useEffect(() => {
    const interval = setInterval(() => {
      nextProject();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative py-20">
      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={activeProjectData.screenshots[activeDevice]} 
                alt={activeProjectData.title}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 p-3 rounded-full bg-black/50 backdrop-blur border border-white/20 hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Title and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <motion.h3 
              key={activeProject}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold mb-2"
            >
              {activeProjectData.title}
            </motion.h3>
            <motion.p 
              key={`desc-${activeProject}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 max-w-2xl"
            >
              {activeProjectData.description}
            </motion.p>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              onClick={prevProject}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </motion.button>
            <motion.span 
              className="font-mono text-sm"
              key={activeProject}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {String(activeProject + 1).padStart(2, '0')}/{String(projects.length).padStart(2, '0')}
            </motion.span>
            <motion.button
              onClick={nextProject}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Mockup Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Mockup Device */}
          <div className="relative">
            <DeviceMockup
              type={activeDevice}
              screenshot={activeProjectData.screenshots[activeDevice]}
              title={activeProjectData.title}
              active={true}
              onClick={() => setIsFullscreen(true)}
            />
            
            {/* Device Type Selector */}
            <div className="flex justify-center gap-4 mt-8">
              {['desktop', 'tablet', 'mobile'].map((device) => (
                <motion.button
                  key={device}
                  onClick={() => setActiveDevice(device)}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm transition-all ${
                    activeDevice === device 
                      ? 'bg-white/10 border border-white/20' 
                      : 'bg-white/5 border border-transparent hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {device === 'desktop' && <Monitor className="w-4 h-4" />}
                  {device === 'tablet' && <PhoneIcon className="w-4 h-4" />}
                  {device === 'mobile' && <Smartphone className="w-4 h-4" />}
                  <span className="capitalize">{device}</span>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Project Details */}
          <div className="space-y-8">
            {/* Tech Stack */}
            <div>
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                Technology Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeProjectData.tech.map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 text-sm font-mono"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
            
            {/* Features */}
            <div>
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Key Features
              </h4>
              <div className="space-y-3">
                {activeProjectData.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeProjectData.color}`} />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Live Preview Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsFullscreen(true)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 font-bold flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              <Play className="w-5 h-5" />
              View Full Preview
              <Maximize2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Project Dots Navigation */}
      <div className="flex justify-center gap-3 mt-16">
        {projects.map((project, index) => (
          <button
            key={project.id}
            onClick={() => setActiveProject(index)}
            className="group relative"
          >
            <div className={`w-3 h-3 rounded-full transition-all ${
              activeProject === index 
                ? `bg-gradient-to-r ${project.color} scale-125` 
                : 'bg-white/20 group-hover:bg-white/40'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
}

// --- UTILITY COMPONENTS ---

function SpotlightCard({ children, className = "", spotlightColor = "rgba(0, 255, 255, 0.15)" }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`relative group border border-white/10 bg-white/[0.02] overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

function ParallaxPhoto() {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-1 border border-white/10 backdrop-blur-sm"
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            
            <img 
              src="/portfolio.png" 
              alt="Emmanuel Adomako" 
              className="object-cover w-full h-full opacity-90 hover:opacity-100 transition-opacity duration-500 scale-105 hover:scale-110" 
            />
        <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl transform translate-z-20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-mono text-green-400">ONLINE</span>
          </div>
          <p className="text-sm font-medium text-white">Full Stack Developer</p>
        </div>
      </div>

      <motion.div 
        animate={{ y: [0, -10, 0] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -right-6 w-16 h-16 bg-black/80 backdrop-blur border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20"
      >
        <Code size={28} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/2 -left-8 w-14 h-14 bg-black/80 backdrop-blur border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/20"
      >
        <Server size={24} />
      </motion.div>
    </motion.div>
  );
}

function NoiseOverlay() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay">
      <svg className="w-full h-full">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}

function TechBadge({ name }) {
  return (
    <span className="px-3 py-1 text-xs font-mono text-cyan-200/80 bg-cyan-500/10 border border-cyan-500/20 rounded-md hover:bg-cyan-500/20 transition-colors cursor-default">
      {name}
    </span>
  );
}

// --- MAIN COMPONENT ---

export default function Portfolio() {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const heroTextY = useTransform(scrollY, [0, 500], [0, 100]);
  const heroImageY = useTransform(scrollY, [0, 500], [0, -50]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollTo = (id) => {
    if (mounted) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.2 }
    );
    
    const sections = document.querySelectorAll('section');
    sections.forEach((s) => observer.observe(s));
    
    return () => observer.disconnect();
  }, [mounted]);

  const navItems = ['Home', 'About', 'Skills', 'Projects', 'Contact'];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      <ThreeBackground />
      <NoiseOverlay />
      
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10" />

      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-cyan-500 z-50 origin-left" style={{ scaleX }} />

      <nav className="fixed top-0 inset-x-0 z-40 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-bold tracking-tighter cursor-pointer flex items-center gap-2"
            onClick={() => scrollTo('home')}
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black font-bold">
              EA
            </div>
            <span className="hidden sm:block font-mono text-sm text-gray-400">EMMANUEL.DEV</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
            {navItems.map((item) => {
              const id = item.toLowerCase();
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`relative px-4 py-1.5 text-sm font-medium transition-colors rounded-full ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-pill" 
                      className="absolute inset-0 bg-white/10 rounded-full" 
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} 
                    />
                  )}
                  {item}
                </button>
              );
            })}
          </div>

          <button 
            className="md:hidden p-2 text-gray-400" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-current transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-black/95 pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button 
                  key={item} 
                  onClick={() => scrollTo(item.toLowerCase())}
                  className="text-2xl font-bold text-gray-400 hover:text-white text-left py-4 border-b border-white/10"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        
        <section id="home" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
            
            <motion.div style={{ y: heroTextY }} className="order-2 lg:order-1 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                AVAILABLE FOR NEW PROJECTS
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-tight"
              >
                <span className="text-white">FULL STACK</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  SPECIALIST
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
              >
                I'm <span className="text-white font-semibold">Emmanuel Adomako</span>. A versatile developer with a proven ability to build secure, scalable applications and robust IT infrastructure.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <button 
                  onClick={() => scrollTo('projects')}
                  className="group relative px-8 py-4 bg-white text-black font-bold rounded-lg overflow-hidden transition-transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    View My Work <ArrowRight size={18} />
                  </span>
                </button>
                <button 
                  onClick={() => scrollTo('contact')}
                  className="px-8 py-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors font-medium text-gray-300 hover:text-white"
                >
                  Contact Me
                </button>
              </motion.div>
            </motion.div>

            <motion.div 
              style={{ y: heroImageY }} 
              className="order-1 lg:order-2 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl -z-10" />
              <ParallaxPhoto />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-xs font-mono">SCROLL</span>
            <ChevronDown className="animate-bounce" size={20} />
          </motion.div>
        </section>

        {/* ENHANCED PROJECTS SECTION WITH ANIMATED MOCKUPS */}
        <section id="projects" className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent" />
          
          <div className="relative z-10">
            <div className="text-center mb-20 px-4 sm:px-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 mb-6"
              >
                <Globe className="w-5 h-5 text-cyan-400" />
                <span className="font-mono text-cyan-400 text-sm">INTERACTIVE DEMOS</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter mb-6"
              >
                <span className="text-white">Project</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  Showcase
                </span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 max-w-2xl mx-auto text-lg"
              >
                Interactive mockups of my featured projects. Click to explore different device views and full-screen previews.
              </motion.p>
            </div>
            
            <ProjectMockupCarousel />
          </div>
        </section>

        <section id="about" className="py-32 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-8 flex items-center gap-3">
                  <Terminal className="text-cyan-500" />
                  Experience & Focus
                </h2>
                <div className="prose prose-invert text-gray-400 text-lg leading-relaxed space-y-6">
                  <p>
                    I am a <span className="text-white">Full Stack Developer</span> and IT Specialist with practical experience in frontend and backend development. My background includes critical roles in system administration and troubleshooting complex network issues.
                  </p>
                  <p>
                    Currently, I focus on building <span className="text-cyan-400">secure, scalable applications</span> using modern frameworks like React, Node.js, and Laravel, ensuring operational efficiency and superior user experience.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-8">
                    {['Network Security', 'Web Development', 'System Admin', 'Mobile Apps'].map((tag) => (
                      <span key={tag} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/5 text-sm">
                        <Shield size={14} className="text-cyan-500" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <SpotlightCard className="rounded-2xl p-8 h-full bg-black/50 backdrop-blur-xl border-white/10">
                  <h3 className="text-xl font-bold mb-6 text-white">Professional Timeline</h3>
                  <div className="space-y-8 border-l border-white/10 pl-6 ml-2">
                    {[
                      { 
                        year: 'Nov 2023 - Present', 
                        role: 'IT Support & Software Developer', 
                        company: 'Ghana Armed Forces',
                        desc: 'Developing web/mobile apps and managing network infrastructure for military operations.'
                      },
                      { 
                        year: 'Sep 2020 - Dec 2020', 
                        role: 'IT Support & Developer Intern', 
                        company: 'Korle-Bu Teaching Hospital',
                        desc: 'Supported hospital management system and configured network security protocols.'
                      },
                    ].map((item, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-cyan-950 border border-cyan-500" />
                        <div className="text-cyan-400 font-mono text-sm mb-1">{item.year}</div>
                        <div className="font-bold text-white mb-1">{item.role}</div>
                        <div className="text-xs font-semibold text-gray-300 mb-2">{item.company}</div>
                        <div className="text-sm text-gray-500">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="py-32 px-4 sm:px-6 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Technical Competencies</h2>
              <p className="text-gray-400">A versatile toolset spanning development and infrastructure.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Frontend',
                  icon: <Code />,
                  skills: ['React', 'TypeScript', 'JavaScript', 'Bootstrap', 'HTML/CSS/TailwindCSS']
                },
                {
                  title: 'Backend',
                  icon: <Server />,
                  skills: ['Node.js', 'PHP (Laravel)', 'CodeIgniter 4', 'Python', 'Django/Flask']
                },
                {
                  title: 'Mobile & App',
                  icon: <Smartphone />,
                  skills: ['Java', 'Android Studio', 'Mobile Dev', 'PyQt5 (Desktop)', 'React Native']
                },
                {
                  title: 'Infrastructure',
                  icon: <Router />,
                  skills: ['MySQL', 'PostgreSQL', 'Cisco CCNA', 'Network Admin']
                }
              ].map((category, i) => (
                <SpotlightCard key={i} className="rounded-xl p-6 bg-black/40">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-6 text-cyan-400">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-4">{category.title}</h3>
                  <div className="space-y-3">
                    {category.skills.map((skill, j) => (
                      <div key={j} className="group">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400 group-hover:text-white transition-colors">{skill}</span>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '90%' }} 
                            transition={{ duration: 1, delay: 0.1 * j }}
                            className="h-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-32 px-4 sm:px-6 bg-gradient-to-b from-transparent to-cyan-900/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-8">Let's Connect</h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Based in Accra, Ghana. I'm open to freelance projects and full-time opportunities.
            </p>
            
            <SpotlightCard className="rounded-3xl p-8 md:p-12 bg-black/50 backdrop-blur-md inline-block w-full max-w-2xl text-left">
              <ContactForm />
              
              <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-8">
                {[
                  { icon: <Mail size={20} />, text: 'emmadom148@gmail.com', href: 'mailto:emmadom148@gmail.com' },
                  { icon: <Github size={20} />, text: 'github.com/qwame2', href: 'https://github.com/qwame2' },
                  { icon: <MapPin size={20} />, text: 'Accra, Ghana', href: '#' },
                  { icon: <Smartphone size={20} />, text: '+233 554131837', href: '#' }
                ].map((link, i) => (
                  <a 
                    key={i} 
                    href={link.href}
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    {link.icon} <span className="text-sm font-mono">{link.text}</span>
                  </a>
                ))}
              </div>
            </SpotlightCard>
          </div>
        </section>

        <footer className="py-8 border-t border-white/10 text-center text-gray-500 text-sm font-mono">
          <p>&copy; {new Date().getFullYear()} Emmanuel Adomako. All Rights Reserved.</p>
        </footer>
      </main>
    </div>
  );
}