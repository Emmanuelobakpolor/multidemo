import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Copy, Download, Share2, Info, QrCode } from "lucide-react";

const QuickCashReceive = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("cashapp_user");
    if (!userData) {
      navigate("/cashapp/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Cash App Dark Header */}
      <header className="bg-[#1A1A1A] border-b border-[#333333] sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate("/cashapp/dashboard")}
            className="p-1 hover:bg-[#333333] rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#FFFFFF]" />
          </button>
          <h1 className="font-bold text-lg text-[#FFFFFF]">Receive Money</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* QR Code Card - Main Focus */}
        <div className="bg-[#1A1A1A] rounded-3xl border border-[#333333] overflow-hidden mb-6">
          <div className="bg-[#00D4AA]/10 py-4 text-center border-b border-[#333333]">
            <span className="text-[#00D4AA] text-xs font-black uppercase tracking-widest">Your Cash App QR</span>
          </div>
          
          <div className="p-8 flex flex-col items-center">
            {/* Mock QR Code Container */}
            <div className="w-64 h-64 bg-[#0D0D0D] border-8 border-[#00D4AA] rounded-2xl p-4 flex items-center justify-center relative mb-6">
              <div className="grid grid-cols-2 gap-2 opacity-20">
                 <QrCode className="w-20 h-20 text-[#FFFFFF]" />
                 <QrCode className="w-20 h-20 text-[#FFFFFF]" />
                 <QrCode className="w-20 h-20 text-[#FFFFFF]" />
                 <QrCode className="w-20 h-20 text-[#FFFFFF]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-[#0D0D0D] p-2 rounded-lg shadow-md border border-[#333333]">
                    <div className="w-10 h-10 bg-[#00D4AA] rounded flex items-center justify-center text-black font-black italic text-xl">
                      C
                    </div>
                 </div>
              </div>
            </div>

            <h2 className="text-xl font-black text-[#FFFFFF] mb-1">{user.fullName || user.email.split('@')[0]}</h2>
            <p className="text-[#888888] text-sm mb-6">{user.email}</p>

            <div className="flex gap-3 w-full">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#1A1A1A] border-2 border-[#00D4AA] text-[#00D4AA] rounded-xl font-bold text-sm hover:bg-[#00D4AA]/10 transition-colors">
                <Download className="w-4 h-4" />
                Save
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#00D4AA] text-black rounded-xl font-bold text-sm shadow-md shadow-green-500/20 hover:bg-[#00C49A] transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Alternate Options */}
        <div className="space-y-4">
          <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-[#333333]">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mb-1">Cash Tag</p>
                <p className="text-lg font-mono font-bold text-[#FFFFFF] tracking-tight">${user.email.split('@')[0]}</p>
              </div>
              <button 
                onClick={() => copyToClipboard(`$${user.email.split('@')[0]}`)}
                className="p-2 bg-[#333333] text-[#00D4AA] rounded-lg hover:bg-[#00D4AA]/10 transition-colors"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            {copied && <p className="text-[10px] text-[#00D4AA] font-bold uppercase">Copied to Clipboard!</p>}
          </div>

          <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-[#333333] flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
              <Info className="w-6 h-6" />
            </div>
            <p className="text-xs text-[#888888] leading-relaxed">
              Others can send you money by scanning your QR code or entering your 
              <span className="font-bold text-[#FFFFFF]"> cash tag</span> or email.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuickCashReceive;
