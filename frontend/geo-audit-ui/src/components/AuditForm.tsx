import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Zap } from "lucide-react";

interface Props {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const AuditForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || isLoading) return;
    onSubmit(url);
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit} 
      className="glass-card"
      style={{ padding: '24px', display: 'flex', gap: '12px', width: '100%', maxWidth: '800px', margin: '0 auto 40px' }}
    >
      <div style={{ position: 'relative', flex: 1 }}>
        <Search 
          size={18} 
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
          className="neon-text-cyan"
        />
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input-neon"
          style={{ paddingLeft: '48px' }}
          disabled={isLoading}
        />
      </div>
      <button 
        type="submit" 
        className="btn-primary" 
        disabled={isLoading || !url}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: (isLoading || !url) ? 0.6 : 1 }}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Zap size={18} />
          </motion.div>
        ) : (
          <Zap size={18} />
        )}
        {isLoading ? "Analyzing..." : "Run Audit"}
      </button>
    </motion.form>
  );
};

export default AuditForm;