import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (email) {
      navigate("/register", { state: { email } });
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.2 }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      <div className="h-screen">

        {/* Background Image with Parallax */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img
            src="https://i.pinimg.com/736x/36/d3/92/36d39247289fa60ad6c51a6d5b29f7cc.jpg"
            alt="Background"
            className="w-full h-screen object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 to-black/80" />
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex items-center justify-between px-4 py-6 md:px-12"
        >
          <motion.h1 
            whileHover={{ scale: 1.05 }}
            className="text-2xl md:text-4xl font-bold text-red-600"
          >
            MOVIE BOX
          </motion.h1>

          <div className="flex gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="px-4 py-2 text-white hover:text-gray-300 transition"
              >
                Sign In
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Register
              </Link>
            </motion.div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="relative z-10 flex flex-col items-center justify-center px-4 py-16 text-white text-center h-[80vh]">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold max-w-4xl mb-4"
          >
            Unlimited movies, TV shows, and more.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl mb-6"
          >
            Watch anywhere. Cancel anytime.
          </motion.p>

          <motion.form
            onSubmit={handleGetStarted}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="w-full max-w-2xl"
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-lg mb-4"
            >
              Ready to watch? Enter your email to create or sign in to your
              account.
            </motion.p>

            <div className="flex flex-col md:flex-row gap-4">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-black/70 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white"
                required
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                type="submit"
                className="px-8 py-3 bg-red-600 text-white text-xl font-semibold rounded hover:bg-red-700 transition whitespace-nowrap"
              >
                Get Started
              </motion.button>
            </div>
          </motion.form>

          {/* Animated scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1 h-2 bg-white rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* Features */}
      <section className="relative z-10 bg-black/80 py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-16">

          {/* Feature 1 */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-1 text-white"
            >
              <motion.h3 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Enjoy on your TV
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl"
              >
                Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV,
                Blu-ray players, and more.
              </motion.p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-1"
            >
              <img
                src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png"
                alt="TV"
                className="w-full"
              />
            </motion.div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row-reverse items-center gap-8"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-1 text-white"
            >
              <motion.h3 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Download your shows to watch offline
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl"
              >
                Save your favorites easily and always have something to watch.
              </motion.p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-1"
            >
              <img
                src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/mobile-0819.jpg"
                alt="Mobile"
                className="w-full"
              />
            </motion.div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-1 text-white"
            >
              <motion.h3 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Watch everywhere
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl"
              >
                Stream on your phone, tablet, laptop, and TV without paying
                more.
              </motion.p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-1"
            >
              <img
                src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/device-pile.png"
                alt="Devices"
                className="w-full"
              />
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-black/90 text-gray-400 py-8 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="flex flex-wrap gap-6 mb-4"
          >
            {["FAQ", "Help Center", "Terms of Use", "Privacy Policy"].map((item) => (
              <motion.div
                key={item}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.1 }}
              >
                <Link to={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="hover:underline">
                  {item}
                </Link>
              </motion.div>
            ))}
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm"
          >
            © 2024 Movie Box
          </motion.p>
        </div>
      </motion.footer>

    </div>
  );
};

export default LandingPage;