import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, 
  Check, 
  Layout, 
  List, 
  Image as ImageIcon, 
  Code2
} from "lucide-react";
import type { AuditResponse } from "../types/audit";

interface Props {
  data: AuditResponse | null;
}

const ResultCard: React.FC<Props> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data.json_ld, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', width: '100%', maxWidth: '1200px', margin: '0 auto' }}
    >
      {/* Header Info */}
      <motion.div variants={itemVariants} style={{ gridColumn: 'span 12' }} className="glass-card neon-border">
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Layout className="neon-text-cyan" size={24} />
            <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px', fontWeight: 700, color: 'var(--neon-cyan)' }}>
              Audit Report
            </span>
          </div>
          <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>{data.title || "Untitled Page"}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6' }}>
            {data.meta_description && data.meta_description !== "No Description" 
              ? data.meta_description 
              : "No meta description found. Optimization recommended."}
          </p>
        </div>
      </motion.div>

      {/* Headings Module */}
      <motion.div variants={itemVariants} style={{ gridColumn: 'span 7' }} className="glass-card">
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <List className="neon-text-cyan" size={20} />
            <h3 style={{ fontSize: '18px' }}>Content Structure</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.headings.map((h, i) => (
              <div 
                key={i} 
                style={{ 
                  padding: '12px 16px', 
                  background: 'rgba(255,255,255,0.03)', 
                  borderRadius: '8px',
                  borderLeft: '2px solid var(--neon-cyan)',
                  fontSize: '14px',
                  color: 'var(--text-secondary)'
                }}
              >
                {h}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Visual Asset Module */}
      <motion.div variants={itemVariants} style={{ gridColumn: 'span 5' }} className="glass-card">
        <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <ImageIcon className="neon-text-pink" size={20} />
            <h3 style={{ fontSize: '18px' }}>Primary Asset</h3>
          </div>
          <div style={{ 
            flex: 1, 
            borderRadius: '12px', 
            overflow: 'hidden', 
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px'
          }}>
            {data.image ? (
              <img src={data.image} alt="Audit preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <ImageIcon size={48} opacity={0.2} style={{ marginBottom: '12px' }} />
                <p>No preview visual found</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* JSON-LD Stage */}
      <motion.div variants={itemVariants} style={{ gridColumn: 'span 12' }} className="glass-card">
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Code2 className="neon-text-cyan" size={20} />
              <h3 style={{ fontSize: '18px' }}>Recommended JSON-LD Schema</h3>
            </div>
            <button 
              onClick={copyToClipboard}
              style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--glass-border)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-cyan)' }}
                  >
                    <Check size={14} /> Copied!
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Copy size={14} /> Copy Code
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
          <div style={{ 
            background: 'rgba(0,0,0,0.4)', 
            borderRadius: '12px', 
            padding: '24px', 
            fontFamily: 'monospace',
            border: '1px solid var(--glass-border)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--neon-cyan)' }} />
            <pre style={{ 
              margin: 0, 
              color: 'var(--neon-cyan)', 
              fontSize: '14px', 
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {JSON.stringify(data.json_ld, null, 2)}
            </pre>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultCard;