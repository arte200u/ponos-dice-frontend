import React, { useState, useEffect } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Users, TrendingUp, History, Gift, Copy, CheckCircle, Trophy, Award, Star, Zap } from 'lucide-react';

const API_URL = 'https://ponos-dice-backend.onrender.com';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(true);
  const [betAmount, setBetAmount] = useState(10);
  const [prediction, setPrediction] = useState('over');
  const [targetNumber, setTargetNumber] = useState(50);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [diceValue, setDiceValue] = useState(50);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('game');
  const [referrals, setReferrals] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [particles, setParticles] = useState([]);

  const balance = demoMode ? (user?.demo_balance || 10000) : (user?.balance || 0);
  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const DiceIcon = diceIcons[Math.floor(diceValue / 16.67) % 6];
  const multiplier = prediction === 'over' ? (100 / (100 - targetNumber)).toFixed(2) : (100 / targetNumber).toFixed(2);
  const winChance = prediction === 'over' ? 100 - targetNumber : targetNumber;

  useEffect(() => {
    const init = async () => {
      try {
        const tg = window.Telegram?.WebApp;
        if (tg) {
          tg.ready();
          tg.expand();
          const initData = tg.initDataUnsafe;
          const refCode = new URLSearchParams(window.location.search).get('ref') || tg.initDataUnsafe?.start_param;
          
          if (initData?.user) {
            const res = await fetch(`${API_URL}/api/auth/telegram`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                telegram_id: initData.user.id.toString(),
                username: initData.user.username || `user${initData.user.id}`,
                first_name: initData.user.first_name,
                last_name: initData.user.last_name,
                referral_code: refCode
              })
            });
            const data = await res.json();
            setUser(data.user);
            localStorage.setItem('token', data.token);
            loadHistory(data.user.telegram_id);
            loadReferrals(data.user.telegram_id);
          }
        } else {
          setUser({telegram_id: 'demo', username: 'DemoUser', balance: 0, demo_balance: 10000, referral_code: 'DEMO123', level: 'Bronze'});
        }
      } catch (e) {
        setUser({telegram_id: 'demo', username: 'DemoUser', balance: 0, demo_balance: 10000, referral_code: 'DEMO123', level: 'Bronze'});
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (activeTab === 'history' && user) {
      console.log('🔄 History tab opened, loading history for:', user.telegram_id);
      loadHistory(user.telegram_id);
    }
  }, [activeTab, user]);

  const loadHistory = async (id) => {
    try {
      console.log('📋 Loading history for:', id);
      const res = await fetch(`${API_URL}/api/game/history/${id}`);
      const data = await res.json();
      console.log('📋 History data:', data);
      setHistory(data.slice(0, 20).map(g => ({
        roll: g.roll, bet: g.bet_amount, prediction: g.prediction, target: g.target, won: g.won,
        amount: g.won ? g.win_amount : -g.bet_amount, time: new Date(g.created_at).toLocaleTimeString(),
        demo: g.demo_mode
      })));
      console.log('📋 History loaded:', data.length, 'games');
    } catch (e) {
      console.error('❌ Load history error:', e);
    }
  };

  const loadReferrals = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/game/referrals/${id}`);
      const data = await res.json();
      setReferrals(data.referrals || []);
    } catch (e) {}
  };

  const vib = (p) => {
    const tg = window.Telegram?.WebApp?.HapticFeedback;
    if (tg) {
      if (p === 'light') tg.impactOccurred('light');
      else if (p === 'success') tg.notificationOccurred('success');
      else if (p === 'error') tg.notificationOccurred('error');
    } else if (navigator.vibrate) {
      if (p === 'light') navigator.vibrate(10);
      else if (p === 'success') navigator.vibrate([10, 50, 10]);
      else if (p === 'error') navigator.vibrate([20, 100]);
    }
  };

  const rollDice = async () => {
    if (betAmount > balance || betAmount <= 0 || !user) return;
    vib('light');
    setRolling(true);
    setResult(null);
    setShowWin(false);
    
    let c = 0;
    const iv = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 100));
      if (c++ % 3 === 0) vib('light');
      if (c > 20) {
        clearInterval(iv);
        const roll = Math.floor(Math.random() * 100);
        setDiceValue(roll);
        const won = prediction === 'over' ? roll > targetNumber : roll < targetNumber;
        const amt = won ? Math.floor(betAmount * parseFloat(multiplier)) : 0;
        
        saveGame(roll, won, amt);
        
        if (won) {
          setResult({type: 'win', amount: amt});
          setShowWin(true);
          const ps = [];
          for (let i = 0; i < 20; i++) ps.push({id: Math.random(), x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 8 + 4, dur: Math.random() * 2 + 1});
          setParticles(ps);
          setTimeout(() => {setParticles([]); setShowWin(false);}, 2000);
          vib('success');
        } else {
          setResult({type: 'loss', amount: betAmount});
          vib('error');
        }
        setRolling(false);
      }
    }, 50);
  };

  const saveGame = async (roll, won, amt) => {
    try {
      console.log('💾 Saving game:', {telegram_id: user.telegram_id, roll, won, amt, demo_mode: demoMode});
      const res = await fetch(`${API_URL}/api/game/play`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          telegram_id: user.telegram_id, roll, prediction, target: targetNumber,
          bet_amount: betAmount, multiplier: parseFloat(multiplier), won, win_amount: amt, demo_mode: demoMode
        })
      });
      const data = await res.json();
      console.log('💾 Game saved:', data);
      if (data.success) {
        setUser(p => ({...p, balance: demoMode ? p.balance : data.balance, demo_balance: demoMode ? data.balance : p.demo_balance}));
        loadHistory(user.telegram_id);
      }
    } catch (e) {
      console.error('❌ Save game error:', e);
    }
  };

  const copyRef = () => {
    vib('light');
    navigator.clipboard.writeText(`https://t.me/PonosDice_bot/DiceApp?startapp=${user?.referral_code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRefSharePercent = (level) => {
    const levels = {
      'Bronze': 30,
      'Silver': 40,
      'Gold': 50,
      'Platinum': 60
    };
    return levels[level] || 30;
  };

  const getLvlIcon = (l) => {
    if (l === 'Platinum') return <Trophy size={16}/>;
    if (l === 'Gold') return <Award size={16}/>;
    if (l === 'Silver') return <Star size={16}/>;
    return <Zap size={16}/>;
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-center"><div className="animate-spin text-6xl mb-4">🎲</div><p className="text-xl">Loading...</p></div></div>;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {particles.map(p => <div key={p.id} className="absolute rounded-full bg-white pointer-events-none animate-ping" style={{left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`, animationDuration: `${p.dur}s`}}/>)}
      
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4">
        <div className="flex justify-between items-start mb-3">
          <div><h1 className="text-xl font-bold">🎲 PONOS DICE</h1><p className="text-xs text-zinc-500">@{user?.username}</p></div>
          <div className="text-right"><p className="text-xs text-zinc-500 mb-1">Balance</p><p className="text-lg font-bold">${balance.toFixed(2)}</p></div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => {vib('light'); setDemoMode(true);}} className={`flex-1 py-2.5 rounded-lg font-semibold text-sm ${demoMode ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>🎮 DEMO</button>
          <button onClick={() => {vib('light'); setDemoMode(false);}} className={`flex-1 py-2.5 rounded-lg font-semibold text-sm ${!demoMode ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>💰 REAL</button>
        </div>
        {demoMode && <button onClick={() => {vib('light'); setUser(p => ({...p, demo_balance: 10000}));}} className="w-full mt-2 py-2 bg-zinc-800 text-yellow-400 rounded-lg text-xs font-semibold border border-zinc-700">🔄 Reset ($10,000)</button>}
      </div>

      <div className="p-4 pb-20">
        {activeTab === 'game' && <div className="space-y-4">
          {demoMode && <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-center"><p className="text-yellow-400 font-semibold text-sm">🎮 Demo Mode</p></div>}
          {!demoMode && user?.balance === 0 && <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-center"><p className="text-white font-semibold mb-2">💰 Deposit Required</p><button className="w-full py-2 bg-white text-black rounded-lg font-semibold">Deposit</button></div>}
          
          <div className={`bg-zinc-900 rounded-xl p-8 border border-zinc-800 ${showWin ? 'animate-pulse' : ''}`}>
            <div className="flex flex-col items-center space-y-4">
              <div className={`${rolling ? 'animate-spin' : ''} ${showWin ? 'scale-125' : ''}`}>
                <DiceIcon size={80} className={showWin ? 'text-yellow-400' : 'text-white'} strokeWidth={1.5}/>
              </div>
              <p className={`text-5xl font-bold ${showWin ? 'text-yellow-400 scale-110' : 'text-white'}`}>{diceValue}</p>
            </div>
          </div>

          {result && <div className={`${result.type === 'win' ? 'bg-white text-black' : 'bg-zinc-900 text-white border-zinc-700'} border-2 rounded-xl p-4 text-center`}>
            <p className="font-bold text-lg">{result.type === 'win' ? '🎉 WON!' : '😔 LOST'}</p>
            <p className="font-mono font-bold text-xl">{result.type === 'win' ? '+' : '-'}${Math.abs(result.amount).toFixed(2)}</p>
          </div>}

          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <div className="flex gap-2 mb-4">
              <button onClick={() => {vib('light'); setPrediction('over');}} className={`flex-1 py-3 rounded-lg font-semibold ${prediction === 'over' ? 'bg-white text-black' : 'bg-zinc-800 text-white'}`}>OVER</button>
              <button onClick={() => {vib('light'); setPrediction('under');}} className={`flex-1 py-3 rounded-lg font-semibold ${prediction === 'under' ? 'bg-white text-black' : 'bg-zinc-800 text-white'}`}>UNDER</button>
            </div>
            <div><label className="text-sm text-zinc-400 mb-2 block">Target: {targetNumber}</label>
            <input type="range" min="1" max="99" value={targetNumber} onChange={(e) => {vib('light'); setTargetNumber(parseInt(e.target.value));}} className="w-full h-2 bg-zinc-800 rounded-lg accent-white"/></div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-zinc-800 rounded-lg p-3 text-center border border-zinc-700"><p className="text-xs text-zinc-500">Win Chance</p><p className="text-lg font-bold">{winChance}%</p></div>
              <div className="bg-zinc-800 rounded-lg p-3 text-center border border-zinc-700"><p className="text-xs text-zinc-500">Multiplier</p><p className="text-lg font-bold">{multiplier}x</p></div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <label className="text-sm text-zinc-400 mb-2 block">Bet Amount</label>
            <div className="flex gap-2">
              <input type="number" value={betAmount} onChange={(e) => setBetAmount(Math.max(0, parseFloat(e.target.value) || 0))} className="flex-1 bg-zinc-800 rounded-lg px-4 py-3 text-white font-semibold outline-none border border-zinc-700"/>
              <button onClick={() => setBetAmount(p => p * 2)} className="px-4 py-3 bg-zinc-800 rounded-lg font-semibold border border-zinc-700">2x</button>
              <button onClick={() => setBetAmount(balance)} className="px-4 py-3 bg-zinc-800 rounded-lg font-semibold border border-zinc-700">MAX</button>
            </div>
            <div className="flex gap-2 mt-2">{[10, 50, 100, 500].map(a => <button key={a} onClick={() => setBetAmount(a)} className="flex-1 py-2 bg-zinc-800 rounded-lg text-sm border border-zinc-700">${a}</button>)}</div>
          </div>

          <button onClick={rollDice} disabled={rolling || betAmount > balance || betAmount <= 0} className={`w-full py-4 rounded-xl font-bold text-lg ${rolling || betAmount > balance || betAmount <= 0 ? 'bg-zinc-800 text-zinc-600' : 'bg-white text-black active:scale-95'}`}>{rolling ? '🎲 ROLLING...' : '🎲 ROLL'}</button>
        </div>}

        {activeTab === 'history' && <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">History</h2>
            <button 
              onClick={() => {
                console.log('🔄 Manual refresh, user:', user?.telegram_id);
                loadHistory(user?.telegram_id);
              }}
              className="px-4 py-2 bg-zinc-800 rounded-lg text-sm border border-zinc-700 hover:bg-zinc-700"
            >
              🔄 Refresh
            </button>
          </div>
          {history.length === 0 ? <div className="text-center py-12 text-zinc-500"><History size={48} className="mx-auto mb-2 opacity-50"/><p>No games yet</p><p className="text-xs mt-2">User ID: {user?.telegram_id}</p></div> : 
          history.map((g, i) => <div key={i} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 mb-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Roll: {g.roll} ({g.prediction.toUpperCase()} {g.target})</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${g.demo ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                    {g.demo ? '🎮 DEMO' : '💰 REAL'}
                  </span>
                </div>
                <p className="text-sm text-zinc-500">Bet: ${g.bet} • {g.time}</p>
              </div>
              <div className={`text-right font-bold ${g.won ? 'text-white' : 'text-zinc-500'}`}>{g.won ? '+' : ''}{g.amount.toFixed(2)}<p className="text-xs text-zinc-500">{g.won ? 'WIN' : 'LOSS'}</p></div>
            </div>
          </div>)}
        </div>}

        {activeTab === 'referral' && <div className="space-y-4"><h2 className="text-xl font-bold">Referral</h2>
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2">{getLvlIcon(user?.level)}<span className="font-bold">{user?.level}</span></div><span className="text-sm text-zinc-400">50%</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800"><Users size={20} className="mb-2"/><p className="text-2xl font-bold">{referrals.length}</p><p className="text-xs text-zinc-500">Referrals</p></div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800"><Trophy size={20} className="text-yellow-400 mb-2"/><p className="text-2xl font-bold text-yellow-400">${(user?.referral_earnings || 0).toFixed(2)}</p><p className="text-xs text-zinc-500">Earned</p></div>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800"><p className="text-sm text-zinc-400 mb-2">Your Link</p>
            <div className="flex gap-2"><input value={`t.me/PonosDice_bot/DiceApp?startapp=${user?.referral_code}`} readOnly className="flex-1 bg-zinc-800 rounded-lg px-4 py-2 text-white text-xs border border-zinc-700"/>
            <button onClick={copyRef} className="px-4 py-2 bg-white text-black rounded-lg">{copied ? <CheckCircle size={20}/> : <Copy size={20}/>}</button></div>
          </div>
        </div>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-4 py-3">
        <div className="flex justify-around">
          <button onClick={() => {vib('light'); setActiveTab('game');}} className={`flex flex-col items-center gap-1 ${activeTab === 'game' ? 'text-white' : 'text-zinc-600'}`}><Dice1 size={24}/><span className="text-xs">Game</span></button>
          <button onClick={() => {vib('light'); setActiveTab('history');}} className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-white' : 'text-zinc-600'}`}><History size={24}/><span className="text-xs">History</span></button>
          <button onClick={() => {vib('light'); setActiveTab('referral');}} className={`flex flex-col items-center gap-1 ${activeTab === 'referral' ? 'text-white' : 'text-zinc-600'}`}><Gift size={24}/><span className="text-xs">Referral</span></button>
        </div>
      </div>
    </div>
  );
}

export default App;