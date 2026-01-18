import React, { useState, useEffect } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Users, History, Gift, Copy, CheckCircle, Trophy, Award, Star, Zap, TrendingUp, DollarSign, Percent } from 'lucide-react';

const API_URL = 'https://ponos-dice-backend.onrender.com';

// Translations
const translations = {
  en: {
    balance: 'Balance',
    demo: 'DEMO',
    real: 'REAL',
    reset: 'Reset ($10,000)',
    demoMode: 'Demo Mode',
    depositRequired: 'Deposit Required',
    deposit: 'Deposit',
    needDeposit: 'You need to deposit crypto to play in real mode',
    rollResult: 'Roll Result',
    youWon: 'YOU WON!',
    youLost: 'YOU LOST',
    over: 'OVER',
    under: 'UNDER',
    target: 'Target',
    winChance: 'Win Chance',
    multiplier: 'Multiplier',
    betAmount: 'Bet Amount',
    roll: 'ROLL',
    rolling: 'ROLLING...',
    game: 'Game',
    history: 'History',
    referral: 'Referral',
    noGames: 'No games yet',
    referralProgram: 'Referral Program',
    level: 'Level',
    earnFrom: 'You earn',
    fromLosses: "from every referral's",
    loss: 'loss',
    totalReferrals: 'Referrals',
    totalInvited: 'Total invited',
    earned: 'Earned',
    totalCommission: 'Total commission',
    howItWorks: 'How it works',
    shareLink: 'Share your referral link with friends',
    theyPlay: 'They sign up and play games',
    whenLose: 'When they',
    youEarn: 'you earn',
    instantly: 'instantly!',
    example: 'Example:',
    refLoses: 'Referral loses',
    youGet: 'You get',
    levelRewards: 'Level Rewards',
    yourLink: 'Your Referral Link',
    shareEarn: 'Share and earn commission from every loss!',
    yourReferrals: 'Your Referrals',
    noRefs: 'No referrals yet',
    startEarning: 'Share your link and start earning!',
    yourCut: 'your cut',
    wagered: 'Wagered',
    lost: 'Lost',
    games: 'Games',
    referrals: 'referrals'
  },
  ru: {
    balance: 'Баланс',
    demo: 'ДЕМО',
    real: 'РЕАЛ',
    reset: 'Сброс ($10,000)',
    demoMode: 'Демо режим',
    depositRequired: 'Нужен депозит',
    deposit: 'Пополнить',
    needDeposit: 'Вам нужно внести крипту для игры в реальном режиме',
    rollResult: 'Результат',
    youWon: 'ВЫ ВЫИГРАЛИ!',
    youLost: 'ВЫ ПРОИГРАЛИ',
    over: 'ВЫШЕ',
    under: 'НИЖЕ',
    target: 'Цель',
    winChance: 'Шанс выигрыша',
    multiplier: 'Множитель',
    betAmount: 'Сумма ставки',
    roll: 'БРОСИТЬ',
    rolling: 'БРОСАЮ...',
    game: 'Игра',
    history: 'История',
    referral: 'Рефералы',
    noGames: 'Игр пока нет',
    referralProgram: 'Реферальная программа',
    level: 'Уровень',
    earnFrom: 'Вы получаете',
    fromLosses: 'от каждого',
    loss: 'проигрыша реферала',
    totalReferrals: 'Рефералов',
    totalInvited: 'Всего приглашено',
    earned: 'Заработано',
    totalCommission: 'Всего комиссии',
    howItWorks: 'Как это работает',
    shareLink: 'Поделитесь реферальной ссылкой с друзьями',
    theyPlay: 'Они регистрируются и играют',
    whenLose: 'Когда они',
    youEarn: 'вы получаете',
    instantly: 'мгновенно!',
    example: 'Пример:',
    refLoses: 'Реферал проиграл',
    youGet: 'Вы получаете',
    levelRewards: 'Награды за уровень',
    yourLink: 'Ваша реферальная ссылка',
    shareEarn: 'Делитесь и зарабатывайте комиссию с каждого проигрыша!',
    yourReferrals: 'Ваши рефералы',
    noRefs: 'Рефералов пока нет',
    startEarning: 'Поделитесь ссылкой и начните зарабатывать!',
    yourCut: 'ваша доля',
    wagered: 'Поставлено',
    lost: 'Проиграно',
    games: 'Игр',
    referrals: 'рефералов'
  },
  ua: {
    balance: 'Баланс',
    demo: 'ДЕМО',
    real: 'РЕАЛ',
    reset: 'Скинути ($10,000)',
    demoMode: 'Демо режим',
    depositRequired: 'Потрібен депозит',
    deposit: 'Поповнити',
    needDeposit: 'Вам потрібно внести крипту для гри в реальному режимі',
    rollResult: 'Результат',
    youWon: 'ВИ ВИГРАЛИ!',
    youLost: 'ВИ ПРОГРАЛИ',
    over: 'ВИЩЕ',
    under: 'НИЖЧЕ',
    target: 'Ціль',
    winChance: 'Шанс виграшу',
    multiplier: 'Множник',
    betAmount: 'Сума ставки',
    roll: 'КИНУТИ',
    rolling: 'КИДАЮ...',
    game: 'Гра',
    history: 'Історія',
    referral: 'Реферали',
    noGames: 'Ігор поки немає',
    referralProgram: 'Реферальна програма',
    level: 'Рівень',
    earnFrom: 'Ви отримуєте',
    fromLosses: 'від кожного',
    loss: 'програшу реферала',
    totalReferrals: 'Рефералів',
    totalInvited: 'Всього запрошено',
    earned: 'Заробіток',
    totalCommission: 'Всього комісії',
    howItWorks: 'Як це працює',
    shareLink: 'Поділіться реферальним посиланням з друзями',
    theyPlay: 'Вони реєструються та грають',
    whenLose: 'Коли вони',
    youEarn: 'ви отримуєте',
    instantly: 'миттєво!',
    example: 'Приклад:',
    refLoses: 'Реферал програв',
    youGet: 'Ви отримуєте',
    levelRewards: 'Нагороди за рівень',
    yourLink: 'Ваше реферальне посилання',
    shareEarn: 'Діліться та заробляйте комісію з кожного програшу!',
    yourReferrals: 'Ваші реферали',
    noRefs: 'Рефералів поки немає',
    startEarning: 'Поділіться посиланням та почніть заробляти!',
    yourCut: 'ваша частка',
    wagered: 'Поставлено',
    lost: 'Програно',
    games: 'Ігор',
    referrals: 'рефералів'
  }
};

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
  const [language, setLanguage] = useState('en');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const t = translations[language];

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
      loadHistory(user.telegram_id);
    }
    if (activeTab === 'referral' && user) {
      loadReferrals(user.telegram_id);
    }
  }, [activeTab, user]);

  const loadHistory = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/game/history/${id}`);
      const data = await res.json();
      setHistory(data.slice(0, 20).map(g => ({
        roll: g.roll, bet: g.bet_amount, prediction: g.prediction, target: g.target, won: g.won,
        amount: g.won ? g.win_amount : -g.bet_amount, time: new Date(g.created_at).toLocaleTimeString(),
        demo: g.demo_mode
      })));
    } catch (e) {}
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

  const playSound = (type) => {
    if (!soundEnabled) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'click') {
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'roll') {
      oscillator.frequency.value = 400;
      oscillator.type = 'square';
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } else if (type === 'win') {
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'lose') {
      oscillator.frequency.value = 400;
      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  };

  const rollDice = async () => {
    if (betAmount > balance || betAmount <= 0 || !user) return;
    playSound('click');
    vib('light');
    setRolling(true);
    setResult(null);
    setShowWin(false);
    
    let c = 0;
    const iv = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 100));
      if (c++ % 3 === 0) {
        vib('light');
        playSound('roll');
      }
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
          playSound('win');
          vib('success');
        } else {
          setResult({type: 'loss', amount: betAmount});
          playSound('lose');
          vib('error');
        }
        setRolling(false);
      }
    }, 50);
  };

  const saveGame = async (roll, won, amt) => {
    try {
      const res = await fetch(`${API_URL}/api/game/play`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          telegram_id: user.telegram_id, roll, prediction, target: targetNumber,
          bet_amount: betAmount, multiplier: parseFloat(multiplier), won, win_amount: amt, demo_mode: demoMode
        })
      });
      const data = await res.json();
      if (data.success) {
        setUser(p => ({...p, balance: demoMode ? p.balance : data.balance, demo_balance: demoMode ? data.balance : p.demo_balance}));
        loadHistory(user.telegram_id);
      }
    } catch (e) {}
  };

  const copyRef = () => {
    vib('light');
    navigator.clipboard.writeText(`https://t.me/PonosDice_bot/DiceApp?startapp=${user?.referral_code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRefSharePercent = (level) => {
    const levels = {'Bronze': 30, 'Silver': 40, 'Gold': 50, 'Platinum': 60};
    return levels[level] || 30;
  };

  const getLvlIcon = (l) => {
    if (l === 'Platinum') return <Trophy size={16}/>;
    if (l === 'Gold') return <Award size={16}/>;
    if (l === 'Silver') return <Star size={16}/>;
    return <Zap size={16}/>;
  };

  const getLvlColor = (l) => {
    if (l === 'Platinum') return 'from-blue-500/20 to-cyan-500/20 border-blue-500/50';
    if (l === 'Gold') return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50';
    if (l === 'Silver') return 'from-gray-400/20 to-gray-500/20 border-gray-400/50';
    return 'from-orange-500/20 to-red-500/20 border-orange-500/50';
  };

  const totalRefEarnings = referrals.reduce((sum, ref) => sum + ((ref.total_lost || 0) * getRefSharePercent(user?.level) / 100), 0);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-center"><div className="animate-spin text-6xl mb-4">🎲</div><p className="text-xl">Loading...</p></div></div>;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {particles.map(p => <div key={p.id} className="absolute rounded-full bg-white pointer-events-none animate-ping" style={{left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`, animationDuration: `${p.dur}s`}}/>)}
      
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4">
        <div className="flex justify-between items-start mb-3">
          <div><h1 className="text-xl font-bold">🎲 PONOS DICE</h1><p className="text-xs text-zinc-500">@{user?.username}</p></div>
          <div className="text-right"><p className="text-xs text-zinc-500 mb-1">{t.balance}</p><p className="text-lg font-bold">${balance.toFixed(2)}</p></div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-1 bg-zinc-800 p-1 rounded-lg border border-zinc-700">
            {['en', 'ru', 'ua'].map(lang => (
              <button key={lang} onClick={() => {playSound('click'); setLanguage(lang);}} className={`px-3 py-1 rounded text-xs font-semibold ${language === lang ? 'bg-white text-black' : 'text-zinc-400'}`}>
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={() => {playSound('click'); setSoundEnabled(!soundEnabled);}} className={`px-3 py-1 rounded-lg text-sm border ${soundEnabled ? 'bg-white text-black border-white' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => {playSound('click'); vib('light'); setDemoMode(true);}} className={`flex-1 py-2.5 rounded-lg font-semibold text-sm ${demoMode ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>🎮 {t.demo}</button>
          <button onClick={() => {playSound('click'); vib('light'); setDemoMode(false);}} className={`flex-1 py-2.5 rounded-lg font-semibold text-sm ${!demoMode ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>💰 {t.real}</button>
        </div>
        {demoMode && <button onClick={() => {playSound('click'); vib('light'); setUser(p => ({...p, demo_balance: 10000}));}} className="w-full mt-2 py-2 bg-zinc-800 text-yellow-400 rounded-lg text-xs font-semibold border border-zinc-700">🔄 {t.reset}</button>}
      </div>

      <div className="p-4 pb-20">
        {activeTab === 'game' && <div className="space-y-4">
          {demoMode && <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-center"><p className="text-yellow-400 font-semibold text-sm">🎮 {t.demoMode}</p></div>}
          {!demoMode && user?.balance === 0 && <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-center"><p className="text-white font-semibold mb-2">💰 {t.depositRequired}</p><p className="text-sm text-zinc-400 mb-3">{t.needDeposit}</p><button className="w-full py-2 bg-white text-black rounded-lg font-semibold">{t.deposit}</button></div>}
          
          <div className={`bg-zinc-900 rounded-xl p-8 border border-zinc-800 ${showWin ? 'animate-pulse' : ''}`}>
            <div className="flex flex-col items-center space-y-4">
              <div className={`${rolling ? 'animate-spin' : ''} ${showWin ? 'scale-125' : ''}`}>
                <DiceIcon size={80} className={showWin ? 'text-yellow-400' : 'text-white'} strokeWidth={1.5}/>
              </div>
              <div className="text-center">
                <p className={`text-5xl font-bold ${showWin ? 'text-yellow-400 scale-110' : 'text-white'}`}>{diceValue}</p>
                <p className="text-sm text-zinc-500 mt-1">{t.rollResult}</p>
              </div>
            </div>
          </div>

          {result && <div className={`${result.type === 'win' ? 'bg-white text-black' : 'bg-zinc-900 text-white border-zinc-700'} border-2 rounded-xl p-4 text-center`}>
            <p className="font-bold text-lg">{result.type === 'win' ? `🎉 ${t.youWon}` : `😔 ${t.youLost}`}</p>
            <p className="font-mono font-bold text-xl">{result.type === 'win' ? '+' : '-'}${Math.abs(result.amount).toFixed(2)}</p>
          </div>}

          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <div className="flex gap-2 mb-4">
              <button onClick={() => {playSound('click'); vib('light'); setPrediction('over');}} className={`flex-1 py-3 rounded-lg font-semibold ${prediction === 'over' ? 'bg-white text-black' : 'bg-zinc-800 text-white'}`}>{t.over}</button>
              <button onClick={() => {playSound('click'); vib('light'); setPrediction('under');}} className={`flex-1 py-3 rounded-lg font-semibold ${prediction === 'under' ? 'bg-white text-black' : 'bg-zinc-800 text-white'}`}>{t.under}</button>
            </div>
            <div><label className="text-sm text-zinc-400 mb-2 block">{t.target}: {targetNumber}</label>
            <input type="range" min="1" max="99" value={targetNumber} onChange={(e) => {vib('light'); setTargetNumber(parseInt(e.target.value));}} className="w-full h-2 bg-zinc-800 rounded-lg accent-white"/></div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-zinc-800 rounded-lg p-3 text-center border border-zinc-700"><p className="text-xs text-zinc-500">{t.winChance}</p><p className="text-lg font-bold">{winChance}%</p></div>
              <div className="bg-zinc-800 rounded-lg p-3 text-center border border-zinc-700"><p className="text-xs text-zinc-500">{t.multiplier}</p><p className="text-lg font-bold">{multiplier}x</p></div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <label className="text-sm text-zinc-400 mb-2 block">{t.betAmount}</label>
            <div className="flex gap-2">
              <input type="number" value={betAmount} onChange={(e) => setBetAmount(Math.max(0, parseFloat(e.target.value) || 0))} className="flex-1 bg-zinc-800 rounded-lg px-4 py-3 text-white font-semibold outline-none border border-zinc-700"/>
              <button onClick={() => {playSound('click'); setBetAmount(p => p * 2);}} className="px-4 py-3 bg-zinc-800 rounded-lg font-semibold border border-zinc-700">2x</button>
              <button onClick={() => {playSound('click'); setBetAmount(balance);}} className="px-4 py-3 bg-zinc-800 rounded-lg font-semibold border border-zinc-700">MAX</button>
            </div>
            <div className="flex gap-2 mt-2">{[10, 50, 100, 500].map(a => <button key={a} onClick={() => {playSound('click'); setBetAmount(a);}} className="flex-1 py-2 bg-zinc-800 rounded-lg text-sm border border-zinc-700">${a}</button>)}</div>
          </div>

          <button onClick={rollDice} disabled={rolling || betAmount > balance || betAmount <= 0} className={`w-full py-4 rounded-xl font-bold text-lg ${rolling || betAmount > balance || betAmount <= 0 ? 'bg-zinc-800 text-zinc-600' : 'bg-white text-black active:scale-95'}`}>{rolling ? `🎲 ${t.rolling}` : `🎲 ${t.roll}`}</button>
        </div>}

        {activeTab === 'history' && <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">History</h2>
            <button onClick={() => loadHistory(user?.telegram_id)} className="px-4 py-2 bg-zinc-800 rounded-lg text-sm border border-zinc-700">🔄</button>
          </div>
          {history.length === 0 ? <div className="text-center py-12 text-zinc-500"><History size={48} className="mx-auto mb-2 opacity-50"/><p>No games yet</p></div> : 
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

        {activeTab === 'referral' && <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">💎 Referral Program</h2>
          
          <div className={`bg-gradient-to-r ${getLvlColor(user?.level)} border rounded-xl p-5`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getLvlIcon(user?.level)}
                <span className="font-bold text-lg">{user?.level} Level</span>
              </div>
              <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full">
                <Percent size={16} className="text-yellow-400"/>
                <span className="text-lg font-bold text-yellow-400">{getRefSharePercent(user?.level)}%</span>
              </div>
            </div>
            <p className="text-sm text-zinc-300">You earn <span className="font-bold text-white">{getRefSharePercent(user?.level)}%</span> from every referral's <span className="font-bold text-red-400">loss</span></p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <Users size={20} className="text-blue-400"/>
                <p className="text-xs text-zinc-500">Referrals</p>
              </div>
              <p className="text-3xl font-bold">{referrals.length}</p>
              <p className="text-xs text-zinc-600 mt-1">Total invited</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={20} className="text-green-400"/>
                <p className="text-xs text-zinc-500">Earned</p>
              </div>
              <p className="text-3xl font-bold text-green-400">${totalRefEarnings.toFixed(2)}</p>
              <p className="text-xs text-zinc-600 mt-1">Total commission</p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-yellow-400"/>
              <h3 className="font-semibold">How it works</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-yellow-400">1.</span>
                <p className="text-zinc-400">Share your referral link with friends</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-400">2.</span>
                <p className="text-zinc-400">They sign up and play games</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-400">3.</span>
                <p className="text-zinc-400">When they <span className="font-bold text-red-400">lose</span>, you earn <span className="font-bold text-green-400">{getRefSharePercent(user?.level)}%</span> instantly!</p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-xs text-yellow-400">
                <span className="font-bold">Example:</span> Referral loses $100 → You get <span className="font-bold">${getRefSharePercent(user?.level)}</span> to your balance!
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Trophy size={18} className="text-yellow-400"/>
              Level Rewards
            </h3>
            <div className="space-y-2">
              {[
                {name: 'Bronze', range: '0-5', percent: 30, color: 'text-orange-400', bg: 'bg-orange-500/10'},
                {name: 'Silver', range: '6-15', percent: 40, color: 'text-gray-300', bg: 'bg-gray-500/10'},
                {name: 'Gold', range: '16-30', percent: 50, color: 'text-yellow-400', bg: 'bg-yellow-500/10'},
                {name: 'Platinum', range: '31+', percent: 60, color: 'text-blue-300', bg: 'bg-blue-500/10'}
              ].map((lvl, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${lvl.bg} border border-zinc-800`}>
                  <div className="flex items-center gap-2">
                    {getLvlIcon(lvl.name)}
                    <div>
                      <p className={`font-semibold ${lvl.color}`}>{lvl.name}</p>
                      <p className="text-xs text-zinc-500">{lvl.range} referrals</p>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${lvl.color}`}>{lvl.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <p className="text-sm text-zinc-400 mb-2 flex items-center gap-2">
              <Gift size={16}/>
              Your Referral Link
            </p>
            <div className="flex gap-2">
              <input value={`t.me/PonosDice_bot/DiceApp?startapp=${user?.referral_code}`} readOnly className="flex-1 bg-zinc-800 rounded-lg px-4 py-2 text-white text-xs border border-zinc-700"/>
              <button onClick={copyRef} className="px-4 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors">
                {copied ? <CheckCircle size={20}/> : <Copy size={20}/>}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">💰 Share and earn commission from every loss!</p>
          </div>

          {referrals.length > 0 && <div>
            <h3 className="font-semibold mb-3">Your Referrals ({referrals.length})</h3>
            {referrals.map((ref, i) => {
              const refEarned = (ref.total_lost || 0) * getRefSharePercent(user?.level) / 100;
              return (
                <div key={i} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 mb-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">@{ref.username}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${ref.level === 'Platinum' ? 'bg-blue-500/20 text-blue-300' : ref.level === 'Gold' ? 'bg-yellow-500/20 text-yellow-400' : ref.level === 'Silver' ? 'bg-gray-500/20 text-gray-300' : 'bg-orange-500/20 text-orange-400'}`}>
                          {ref.level}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">+${refEarned.toFixed(2)}</p>
                      <p className="text-xs text-zinc-500">your cut</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-zinc-800 rounded p-2">
                      <p className="text-zinc-500">Wagered</p>
                      <p className="font-semibold text-white">${ref.total_wagered?.toFixed(0) || '0'}</p>
                    </div>
                    <div className="bg-zinc-800 rounded p-2">
                      <p className="text-zinc-500">Lost</p>
                      <p className="font-semibold text-red-400">${ref.total_lost?.toFixed(0) || '0'}</p>
                    </div>
                    <div className="bg-zinc-800 rounded p-2">
                      <p className="text-zinc-500">Games</p>
                      <p className="font-semibold text-white">{ref.games_played || 0}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>}

          {referrals.length === 0 && <div className="text-center py-12 text-zinc-500 bg-zinc-900 rounded-xl border border-zinc-800">
            <Users size={48} className="mx-auto mb-2 opacity-50"/>
            <p className="font-semibold mb-1">No referrals yet</p>
            <p className="text-xs">Share your link and start earning!</p>
          </div>}
        </div>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-4 py-3">
        <div className="flex justify-around">
          <button onClick={() => {vib('light'); setActiveTab('game');}} className={`flex flex-col items-center gap-1 ${activeTab === 'game' ? 'text-white' : 'text-zinc-600'}`}>
            <Dice1 size={24}/><span className="text-xs">Game</span>
          </button>
          <button onClick={() => {vib('light'); setActiveTab('history');}} className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-white' : 'text-zinc-600'}`}>
            <History size={24}/><span className="text-xs">History</span>
          </button>
          <button onClick={() => {vib('light'); setActiveTab('referral');}} className={`flex flex-col items-center gap-1 ${activeTab === 'referral' ? 'text-white' : 'text-zinc-600'}`}>
            <Gift size={24}/><span className="text-xs">Referral</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;