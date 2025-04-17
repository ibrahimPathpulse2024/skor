"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useHandleLogout } from "../utils/auth";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLogout = useHandleLogout();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  const menuVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "100%", transition: { duration: 0.2 } },
  };

  const fadeVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  return (
    <header className="relative">
      {/* Main Header */}
      <div className="w-full h-full px-6 py-4 bg-[#1e1a18]/60 border-b border-white/20 backdrop-blur-md">
        <div className="flex justify-between items-center relative">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={46}
              height={28}
              className="w-[46px] h-7"
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-8">
            <Link href="/profile">
              <motion.p
                whileHover={{ scale: 1.05, color: "#ee5d4b" }}
                className="font-chakra text-white font-bold transition-colors"
              >
                PROFILE
              </motion.p>
            </Link>
            <Link href="/staking">
              <motion.p
                whileHover={{ scale: 1.05, color: "#ee5d4b" }}
                className="font-chakra text-white font-bold transition-colors"
              >
                STAKING
              </motion.p>
            </Link>

            <Link href="/nfts">
              <motion.p
                whileHover={{ scale: 1.05, color: "#ee5d4b" }}
                className="font-chakra text-white font-bold transition-colors"
              >
                NFTS
              </motion.p>
            </Link>
          </div>

          {/* Logout Button - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <Image src="/logout.svg" alt="Logout" width={20} height={20} />
              <span className="font-chakra">Logout</span>
            </motion.button>
          </div>

          <motion.button
            className="md:hidden"
            onClick={toggleMenu}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={isMenuOpen ? "open" : "closed"}
              variants={{
                closed: { rotate: 0 },
                open: { rotate: 90 },
              }}
            >
              <Image src="/menu.svg" alt="Menu" width={24} height={24} />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={fadeVariants}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              variants={menuVariants}
              className="absolute right-0 top-0 h-full w-[300px] bg-[#1e1a18] border-l border-white/20 p-6 flex flex-col"
            >
              <div className="flex justify-end mb-8">
                <motion.button
                  onClick={toggleMenu}
                  whileHover={{ scale: 1.1 }}
                  className="text-white hover:text-[#ee5d4b] transition-colors"
                >
                  ✕
                </motion.button>
              </div>

              <nav className="flex-1 flex flex-col gap-4">
                <Link href="/profile">
                  <motion.p
                    whileHover={{ x: 10 }}
                    className="font-chakra text-white text-xl hover:text-[#ee5d4b] transition-colors"
                  >
                    PROFILE
                  </motion.p>
                </Link>
                <Link href="/staking">
                  <motion.p
                    whileHover={{ x: 10 }}
                    className="font-chakra text-white text-xl hover:text-[#ee5d4b] transition-colors"
                  >
                    STAKING
                  </motion.p>
                </Link>

                <Link href="/nfts">
                  <motion.p
                    whileHover={{ scale: 1.05, color: "#ee5d4b" }}
                    className="font-chakra text-white font-bold transition-colors"
                  >
                    NFTS
                  </motion.p>
                </Link>
              </nav>

              {/* Logout at Bottom */}
              <div className="mt-auto pt-6 border-t border-white/20">
                <button onClick={handleLogout}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 text-gray-400 hover:text-white w-full"
                  >
                    <Image
                      src="/logout.svg"
                      alt="Logout"
                      width={20}
                      height={20}
                    />
                    <span className="font-chakra">Logout</span>
                  </motion.button>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
