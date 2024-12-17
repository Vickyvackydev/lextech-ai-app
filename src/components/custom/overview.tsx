import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { MessageIcon, VercelIcon } from './icons';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <Image src="/assets/logonw.svg" alt="LexTech Assistant" width={45} height={45} />
          <span>+</span>
          <MessageIcon size={32} />
        </p>
        <p className="text-lg font-bold">
        Welcome to <span className="italic">LexTech Assistant</span> – your AI-powered Nigerian judicial assistant.
      </p>
      <p className="text-md mt-2">
        <span className="font-semibold">LexTech Assistant</span> is here to serve you with expertise in Nigerian law, offering insights and decisions on legal matters with the impartiality of a <span className="italic">Nigerian judge</span>. From analyzing case law to reviewing documents and delivering judgments, LexTech upholds the principles of fairness and accuracy.
      </p>
      <p className="text-sm mt-4">
        Powered by <code className="rounded-md bg-muted px-1 py-0.5">streamText</code> for server-side processing and <code className="rounded-md bg-muted px-1 py-0.5">useChat</code> for a seamless client experience, LexTech Assistant is tailored to meet your legal needs in a professional, intuitive environment.
      </p>

      </div>
    </motion.div>
  );
};