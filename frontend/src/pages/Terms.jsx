import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  FileText,
  AlertCircle,
  HelpCircle,
  Scale,
  BookOpen,
  Gavel,
  Globe,
  Mail,
  Phone
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const Terms = () => {
  const sections = [
    {
      icon: BookOpen,
      title: "1. Acceptance of Terms",
      content: `By accessing and using MESS WALLAH, you accept and agree to be bound by the absolute terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service under any circumstances.`
    },
    {
      icon: FileText,
      title: "2. Use License",
      content: `Permission is granted to temporarily download one copy of the materials on MESS WALLAH's website for personal, non-commercial transitory viewing only. This is the grant of a strict license, not a transfer of title, and under this license you may absolutely not:
      
      • Modify or manually copy the materials
      • Use the materials for any commercial purpose or for any public display
      • Attempt to reverse engineer any software contained on the website
      • Remove any copyright or other proprietary notations from the materials`
    },
    {
      icon: Users,
      title: "3. User Accounts",
      content: `When you create an account with us, you must provide information that is hyper-accurate, complete, and current at all times. You are entirely responsible for safeguarding the password and for all activities that occur under your account. You agree unconditionally not to disclose your password to any third party.`
    },
    {
      icon: Shield,
      title: "4. Property Listings",
      content: `Property owners are held legally responsible for the unwavering accuracy of their listings. MESS WALLAH does not guarantee the accuracy, completeness, or reliability of any listing information. All property descriptions, photos, and amenities must be 100% truthful and current.`
    },
    {
      icon: Scale,
      title: "5. Booking and Payments",
      content: `All bookings are subject to direct availability and confirmation by the property owner. Formal payment processing is handled securely through our encrypted platform. Cancellation policies vary by specific property and are clearly stated in each listing.`
    },
    {
      icon: AlertCircle,
      title: "6. Code of Conduct",
      content: `You agree not to use the service to:
      
      • Upload or transmit any content that is unlawful, harmful, or offensive
      • Impersonate any person or entity maliciously
      • Interfere with or disrupt the service or our backend servers
      • Attempt to gain unauthorized systemic access to any portion of the website
      • Use the service for any illegal or unauthorized purpose whatsoever`
    },
    {
      icon: Gavel,
      title: "7. Limitations of Liability",
      content: `In no event shall MESS WALLAH or its officially partnered suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on MESS WALLAH's website, even if MESS WALLAH or its authorized representative has been notified orally or in writing of the possibility of such infinite damage.`
    },
    {
      icon: Globe,
      title: "8. Governing Law",
      content: `These rigorous terms and conditions are governed by and construed strictly in accordance with the laws of India and you irrevocably submit to the exclusive, overriding jurisdiction of the courts in that State or location.`
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 pt-24 pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Immersive Background Glow */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-gray-200/50 via-blue-100/30 to-purple-100/40 dark:from-gray-800/20 dark:via-blue-900/10 dark:to-purple-900/10 -z-10 rounded-br-full"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Dynamic Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} className="inline-block mb-4">
            <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm border border-gray-200 dark:border-gray-700">
              <Scale className="w-4 h-4" /> Legal Framework
            </span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
            Terms of <span className="bg-gradient-to-r from-gray-600 to-gray-400 dark:from-gray-400 dark:to-gray-600 bg-clip-text text-transparent">Service</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Please read these absolute terms and conditions carefully before utilizing our sophisticated services.
          </motion.p>
          <motion.p variants={fadeInUp} className="text-sm text-gray-400 dark:text-gray-500 mt-4 font-mono">
            Document Version 4.2 • Last Updated: January 15, 2024
          </motion.p>
        </motion.div>

        {/* Critical Notice Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 backdrop-blur-xl rounded-3xl p-8 mb-16 shadow-lg relative overflow-hidden group"
        >
          <div className="absolute -right-10 -top-10 text-blue-100 dark:text-blue-900/30 transform rotate-12 group-hover:rotate-6 transition-transform duration-500">
            <AlertCircle className="w-48 h-48" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center shrink-0">
              <AlertCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                Mandatory Legal Agreement
              </h2>
              <p className="text-blue-800 dark:text-blue-200/80 text-lg leading-relaxed mix-blend-multiply dark:mix-blend-normal">
                These Terms of Service instantly constitute a legally binding agreement between you and MESS WALLAH. By accessing our platform, you fundamentally acknowledge that you have read, processed, and agree to be bound unconditionally by these terms.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Legal Document Flow */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="space-y-6 mb-20"
        >
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-[2rem] p-8 md:p-10 shadow-md border border-gray-100 dark:border-gray-700/50 hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-14 h-14 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                    <Icon className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                      {section.title}
                    </h2>
                    <div className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Global Footer Quick Links */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Support Section */}
          <motion.div variants={fadeInUp} className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
            <HelpCircle className="w-12 h-12 text-blue-400 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Questions about these terms?</h2>
            <p className="text-gray-300 mb-8 opacity-90 leading-relaxed">
              Our dedicated legal compliance team is strictly available to answer any complex inquiries regarding our policies.
            </p>
            <div className="space-y-3 font-mono text-sm text-gray-400">
              <p className="flex items-center gap-3"><Mail className="w-4 h-4" /> legal@messwallah.com</p>
              <p className="flex items-center gap-3"><Phone className="w-4 h-4" /> +91 1800-123-4567</p>
            </div>
          </motion.div>

          {/* Guidelines Link */}
          <motion.div variants={fadeInUp} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-gray-200 dark:border-gray-700/50 rounded-[2.5rem] p-10 shadow-xl flex flex-col justify-center items-center text-center group hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Community Guidelines
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 px-4">
              Explore the strict rules for highly respectful community interaction on our platform.
            </p>
            <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
              View Guidelines &rarr;
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
