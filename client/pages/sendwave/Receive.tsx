import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Copy, Download, Share2, Info, QrCode } from "lucide-react";

const GCashReceive = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("sendwave_user");
    if (!userData) {
      navigate("/sendwave/login");
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
    <div className="min-h-screen bg-[#F4F7FA]">
      {/* GCash Blue Header */}
      <header className="bg-[#007DFE] text-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate("/sendwave/dashboard")}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-lg">Receive Money</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* QR Code Card - The Main Focus */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
          <div className="bg-[#007DFE]/5 py-4 text-center border-b border-slate-50">
            <span className="text-[#007DFE] text-xs font-black uppercase tracking-widest">Your GCash QR</span>
          </div>
          
          <div className="p-8 flex flex-col items-center">
            {/* Mock QR Code Container */}
            <div className="w-64 h-64 bg-white border-8 border-[#007DFE] rounded-2xl p-4 flex items-center justify-center relative mb-6">
              <div className="grid grid-cols-2 gap-2 opacity-20">
                 <QrCode className="w-20 h-20 text-slate-800" />
                 <QrCode className="w-20 h-20 text-slate-800" />
                 <QrCode className="w-20 h-20 text-slate-800" />
                 <QrCode className="w-20 h-20 text-slate-800" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-white p-2 rounded-lg shadow-md border border-slate-100">
                    <div className="w-10 h-10 bg-[#007DFE] rounded flex items-center justify-center text-white font-black italic text-xl">G</div>
                 </div>
              </div>
            </div>

            <h2 className="text-xl font-black text-slate-800 mb-1">{user.fullName || user.username}</h2>
            <p className="text-slate-500 text-sm mb-6">{user.mobileNumber || "0912 345 6789"}</p>

            <div className="flex gap-3 w-full">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-[#007DFE] text-[#007DFE] rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                <Download className="w-4 h-4" />
                Save
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#007DFE] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-600 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Alternate Options */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">GCash Number</p>
                <p className="text-lg font-mono font-bold text-slate-800 tracking-tight">{user.mobileNumber}</p>
              </div>
              <button 
                onClick={() => copyToClipboard(user.mobileNumber)}
                className="p-2 bg-slate-50 text-[#007DFE] rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            {copied && <p className="text-[10px] text-green-500 font-bold uppercase">Copied to Clipboard!</p>}
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
              <Info className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Others can send you money by scanning your QR code or entering your 
              <span className="font-bold text-slate-700"> GCash number</span>.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default GCashReceive;
