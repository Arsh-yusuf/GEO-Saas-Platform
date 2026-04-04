import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Cpu } from "lucide-react";
import AuditForm from "../components/AuditForm";
import ResultCard from "../components/ResultCard";
import { auditWebsite } from "../services/api";
import type { AuditResponse } from "../types/audit";

const Home: React.FC = () => {
  const [data, setData] = useState<AuditResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleAudit = async (url: string) => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      const result = await auditWebsite(url);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Quantum connection failed. Target URL inaccessible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '60px 20px', minHeight: '100vh' }}>
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '60px' }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Cpu className="neon-text-cyan" size={32} />
          <span style={{ 
            textTransform: 'uppercase', 
            letterSpacing: '4px', 
            fontSize: '14px', 
            fontWeight: 800, 
            color: 'var(--neon-cyan)',
            opacity: 0.8
          }}>
            System: Active
          </span>
        </div>
        <h1 style={{ 
          fontSize: 'clamp(40px, 8vw, 72px)', 
          fontWeight: 800, 
          lineHeight: 1,
          marginBottom: '20px',
          background: 'linear-gradient(to right, #fff, #888)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          GEO <span className="neon-text-pink">Audit</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          Analyze search visibility and generate state-of-the-art 
          <span className="neon-text-cyan" style={{ fontWeight: 600 }}> JSON-LD </span> 
          schemas for the next generation of AI search engines.
        </p>
      </motion.div>

      <AuditForm onSubmit={handleAudit} isLoading={loading} />

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card"
            style={{ 
              maxWidth: '600px', 
              margin: '0 auto 40px', 
              padding: '20px', 
              borderColor: 'rgba(255, 0, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <ShieldAlert className="neon-text-pink" size={24} />
            <p style={{ color: '#ff4444', fontWeight: 500 }}>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: '40px' }}>
        <ResultCard data={data} />
      </div>

      {/* Decorative background elements */}
      <div style={{ 
        position: 'fixed', 
        top: '10%', 
        left: '5%', 
        width: '300px', 
        height: '300px', 
        background: 'var(--neon-cyan)', 
        filter: 'blur(150px)', 
        opacity: 0.05, 
        zIndex: -1 
      }} />
      <div style={{ 
        position: 'fixed', 
        bottom: '10%', 
        right: '5%', 
        width: '400px', 
        height: '400px', 
        background: 'var(--neon-pink)', 
        filter: 'blur(200px)', 
        opacity: 0.05, 
        zIndex: -1 
      }} />
    </div>
  );
};

export default Home;