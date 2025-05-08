"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Gift,
  Heart,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import HeroLayout from "../HeroLayout";

const predefinedPledges = [
  {
    amount: 10,
    label: "$10",
    description: "Provides notebooks & pens.",
    icon: <Gift size={20} />,
  },
  {
    amount: 25,
    label: "$25",
    description: "Buys a school uniform.",
    icon: <Gift size={20} />,
  },
  {
    amount: 50,
    label: "$50",
    description: "Feeds a child for a month.",
    icon: <Gift size={20} />,
  },
  {
    amount: 100,
    label: "$100",
    description: "School supplies for a year.",
    icon: <Gift size={20} />,
  },
];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeIn" } },
};

const sentenceVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      staggerChildren: 0.04,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20, rotateX: -90, transformOrigin: "50% 50% -10px" },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

const subtitleVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.3 },
  },
};

const sectionIntroVariants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.4 },
  },
};

const staggerContainerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
};

const pledgeButtonVariants = {
  initial: { opacity: 0, scale: 0.8, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
  hover: { scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)" },
  tap: { scale: 0.95 },
};

const formElementVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const messageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const footerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.8 },
  },
};

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(25);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [finalAmount, setFinalAmount] = useState<number>(25);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [donationStatus, setDonationStatus] = useState<
    "success" | "error" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const pageTitle = "Support Our Cause";
  const pageSubtitle =
    "Your generous contribution empowers us to continue our mission and bring positive change to the lives of African children. Every donation, big or small, makes a significant impact.";

  useEffect(() => {
    if (customAmount) {
      const parsedAmount = parseFloat(customAmount);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        setFinalAmount(parsedAmount);
        setSelectedAmount(null);
      } else if (customAmount === "" && selectedAmount !== null) {
        setFinalAmount(selectedAmount);
      } else if (customAmount === "" && selectedAmount === null) {
        setFinalAmount(0);
      }
    } else if (selectedAmount !== null) {
      setFinalAmount(selectedAmount);
    } else {
      setFinalAmount(0);
    }
  }, [selectedAmount, customAmount]);

  const handlePledgeSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setDonationStatus(null);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
      if (value) setSelectedAmount(null);
      setDonationStatus(null);
    }
  };

  const handleDonate = async () => {
    if (finalAmount <= 0) {
      setErrorMessage("Please select or enter a valid donation amount.");
      setDonationStatus("error");
      return;
    }

    setIsProcessing(true);
    setDonationStatus(null);
    setErrorMessage("");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (Math.random() > 0.1) {
      setDonationStatus("success");
      setSelectedAmount(25);
      setCustomAmount("");
      setFinalAmount(25);
    } else {
      setDonationStatus("error");
      setErrorMessage(
        "Donation processing failed. Please try again or contact support."
      );
    }
    setIsProcessing(false);
  };

  return (
    <HeroLayout>
      <motion.div
        className="min-h-screen bg-slate-50 text-slate-800 selection:bg-sky-200 selection:text-sky-800"
        style={{
          backgroundImage:
            "linear-gradient(rgba(248,250,252,0.95), rgba(248,250,252,0.95)), url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='inspiration-geometry' fill='%23a7c9e8' fill-opacity='0.06'%3E%3Cpath d='M10 0L0 10L10 20L20 10zM20 10L10 20L20 30L30 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <header className="py-12 md:py-20 text-center overflow-hidden">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 mb-6 inline-block"
            variants={sentenceVariants}
            initial="hidden"
            animate="visible"
          >
            {pageTitle.split("").map((char, index) => (
              <motion.span
                key={char + "-" + index}
                variants={letterVariants}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto px-4"
            variants={subtitleVariants}
            initial="initial"
            animate="animate"
          >
            {pageSubtitle}
          </motion.p>
        </header>

        <motion.main
          className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 max-w-2xl"
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="bg-white p-6 md:p-10 rounded-xl shadow-xl"
            variants={sectionIntroVariants}
          >
            <motion.h2
              variants={formElementVariants}
              className="text-2xl md:text-3xl font-bold text-slate-700 mb-2 text-center flex items-center justify-center"
            >
              <Heart size={28} className="mr-3 text-pink-500" /> Make a Donation
            </motion.h2>
            <motion.p
              variants={formElementVariants}
              className="text-slate-500 text-center mb-8"
            >
              Choose an amount or enter your own.
            </motion.p>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8"
              variants={staggerContainerVariants}
            >
              {predefinedPledges.map((pledge) => (
                <motion.button
                  key={pledge.amount}
                  variants={pledgeButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handlePledgeSelect(pledge.amount)}
                  className={`p-4 rounded-lg border-2 text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400
                    ${
                      selectedAmount === pledge.amount
                        ? "bg-teal-500 border-teal-500 text-white shadow-lg"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50"
                    }`}
                >
                  <span className="block text-xl font-bold">
                    {pledge.label}
                  </span>
                  {/* <span className="text-xs mt-1 hidden sm:block opacity-80">{pledge.description}</span> */}
                </motion.button>
              ))}
            </motion.div>

            <motion.div className="mb-6" variants={formElementVariants}>
              <label
                htmlFor="customAmount"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Or Enter a Custom Amount:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  id="customAmount"
                  name="customAmount"
                  inputMode="decimal"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  onFocus={() => {
                    setSelectedAmount(null);
                    setDonationStatus(null);
                  }}
                  placeholder="e.g., 75.00"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1
                    ${
                      customAmount && !selectedAmount
                        ? "border-teal-500 ring-teal-400 bg-white"
                        : "border-slate-300 hover:border-slate-400 focus:border-teal-500 focus:ring-teal-400 bg-white"
                    }`}
                />
              </div>
            </motion.div>

            <motion.div
              className="text-center mb-8"
              variants={formElementVariants}
            >
              <p className="text-slate-600">You are donating:</p>
              <motion.p
                key={finalAmount}
                initial={{ opacity: 0.8, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-sky-600"
              >
                ${finalAmount > 0 ? finalAmount.toFixed(2) : "0.00"}
              </motion.p>
            </motion.div>

            <motion.button
              onClick={handleDonate}
              disabled={isProcessing || finalAmount <= 0}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              variants={formElementVariants}
              whileHover={
                !isProcessing && finalAmount > 0
                  ? { scale: 1.03, transition: { duration: 0.15 } }
                  : {}
              }
              whileTap={
                !isProcessing && finalAmount > 0
                  ? { scale: 0.98, transition: { duration: 0.1 } }
                  : {}
              }
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />{" "}
                  Processing...
                </>
              ) : (
                <>
                  Donate Now <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {donationStatus === "success" && (
                <motion.div
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="mt-6 p-4 bg-green-50 border border-green-300 text-green-700 rounded-lg flex items-center"
                >
                  <CheckCircle2 size={20} className="mr-3 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">
                      Thank you for your generous donation!
                    </span>{" "}
                    Your support makes a real difference.
                  </div>
                </motion.div>
              )}
              {donationStatus === "error" && (
                <motion.div
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="mt-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg flex items-center"
                >
                  <AlertTriangle size={20} className="mr-3 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Donation Error:</span>{" "}
                    {errorMessage}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              variants={formElementVariants}
              className="mt-10 text-center text-xs text-slate-500"
            >
              <p>
                All donations are processed securely. We respect your privacy.
              </p>
              <p>
                The African Child NGO is a registered non-profit organization.
              </p>
            </motion.div>
          </motion.div>
        </motion.main>

        <motion.footer
          variants={footerVariants}
          initial="initial"
          animate="animate"
          className="text-center py-10 text-slate-500 text-sm border-t border-slate-200 mt-12"
        >
          <p>
            &copy; {new Date().getFullYear()} The African Child NGO. All rights
            reserved.
          </p>
          <p>Together, we can build a brighter future.</p>
        </motion.footer>
      </motion.div>
    </HeroLayout>
  );
}
