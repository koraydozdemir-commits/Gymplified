// --- POOL OF 100 MOTIVATIONAL QUOTES ---
const MOTIVATIONAL_QUOTES = [
  { text: "He who conquers himself is the mightiest warrior.", author: "Sun Tzu" },
  { text: "The resistance that you fight physically in the gym and the resistance that you fight in life can only build a strong character.", author: "Arnold Schwarzenegger" },
  { text: "In the midst of chaos, there is also opportunity.", author: "Sun Tzu" },
  { text: "Strength does not come from winning. Your struggles develop your strengths.", author: "Arnold Schwarzenegger" },
  { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.", author: "Sun Tzu" },
  { text: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca" },
  { text: "The worst thing I can be is the same as everybody else. I hate that.", author: "Arnold Schwarzenegger" },
  { text: "At dawn, when you have trouble getting out of bed, tell yourself: 'I have to go to work — as a human being.'", author: "Marcus Aurelius" },
  { text: "Don't stop when you're tired, stop when you're done.", author: "David Goggins" },
  { text: "Ponder and deliberate before you make a move.", author: "Sun Tzu" },
  { text: "Where the mind goes the body will follow.", author: "Arnold Schwarzenegger" },
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "Everybody wants to be a bodybuilder, but nobody wants to lift no heavy-ass weights.", author: "Ronnie Coleman" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca" },
  { text: "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.'", author: "Muhammad Ali" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", author: "Bruce Lee" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
  { text: "When you think you're done, you're only at 40% of your body's capability.", author: "David Goggins" },
  { text: "He who is not courageous enough to take risks will accomplish nothing in life.", author: "Muhammad Ali" },
  { text: "Knowing is not enough, we must apply. Willing is not enough, we must do.", author: "Bruce Lee" },
  { text: "No man is free who is not master of himself.", author: "Epictetus" },
  { text: "Rest at the end, not in the middle.", author: "Kobe Bryant" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Energy can be harnessed and willingness can be cultivated.", author: "Sun Tzu" },
  { text: "It is hard to fail, but it is worse never to have tried to succeed.", author: "Theodore Roosevelt" },
  { text: "Discipline equals freedom.", author: "Jocko Willink" },
  { text: "If you're going through hell, keep going.", author: "Winston Churchill" },
  { text: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.", author: "Bruce Lee" },
  { text: "Continuous effort — not strength or intelligence — is the key to unlocking our potential.", author: "Winston Churchill" },
  { text: "Veni, vidi, vici. (I came, I saw, I conquered.)", author: "Julius Caesar" },
  { text: "There is nothing impossible to him who will try.", author: "Alexander the Great" },
  { text: "Discipline is doing what you hate to do, but doing it like you love it.", author: "Mike Tyson" },
  { text: "Blood, sweat and respect. First two you give, last one you earn.", author: "Dwayne Johnson" },
  { text: "Be humble. Be hungry. And always be the hardest worker in the room.", author: "Dwayne Johnson" },
  { text: "There is nothing outside of yourself that can ever enable you to get better, stronger, richer, quicker, or cleverer. Everything is within.", author: "Miyamoto Musashi" },
  { text: "Do nothing that is of no use.", author: "Miyamoto Musashi" },
  { text: "Concentration, focus, and total dedication. That is what separates the winners.", author: "Dorian Yates" },
  { text: "Set your goals high, and don't stop till you get there.", author: "Jay Cutler" },
  { text: "If you want to build bigger muscles, you must push them past their limit.", author: "Franco Columbu" },
  { text: "If I'm going to do something, I'm going to do it 100%.", author: "Lou Ferrigno" },
  { text: "The squatter doesn't negotiate with the weight.", author: "Tom Platz" },
  { text: "Don't count on motivation. Count on discipline.", author: "Jocko Willink" },
  { text: "Overcome the weakness of your mind.", author: "Jocko Willink" },
  { text: "Winners never quit and quitters never win.", author: "Vince Lombardi" },
  { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
  { text: "The dictionary is the only place where success comes before work.", author: "Vince Lombardi" },
  { text: "I've failed over and over and over again in my life. And that is why I succeed.", author: "Michael Jordan" },
  { text: "Some people want it to happen, some wish it would happen, others make it happen.", author: "Michael Jordan" },
  { text: "Obstacles don't have to stop you. If you run into a wall, don't turn around and give up. Figure out how to climb it.", author: "Michael Jordan" },
  { text: "I've grown most not from victories, but from setbacks.", author: "Serena Williams" },
  { text: "Your love makes me strong. Your hate makes me unstoppable.", author: "Cristiano Ronaldo" },
  { text: "Dedication, hard work all the time, and belief.", author: "Cristiano Ronaldo" },
  { text: "I don't think limits.", author: "Usain Bolt" },
  { text: "Easy is not an option. No days off. Never quit.", author: "Usain Bolt" },
  { text: "There is a difference between a fighter and a martial artist. A martial artist trains for mastery.", author: "Georges St-Pierre" },
  { text: "Hard work, discipline, and staying humble.", author: "Khabib Nurmagomedov" },
  { text: "Impossible is a word to be found only in the dictionary of fools.", author: "Napoleon Bonaparte" },
  { text: "Courage isn't having the strength to go on; it is going on when you don't have strength.", author: "Napoleon Bonaparte" },
  { text: "I will prepare and someday my chance will come.", author: "Abraham Lincoln" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "What does not kill me makes me stronger.", author: "Friedrich Nietzsche" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Mastering others is strength. Mastering yourself is true power.", author: "Lao Tzu" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The first and greatest victory is to conquer yourself.", author: "Plato" },
  { text: "No man has the right to be an amateur in the matter of physical training. It is a shame for a man to grow old without seeing the beauty and strength of which his body is capable.", author: "Socrates" },
  { text: "If you want to improve, be content to be thought foolish and stupid.", author: "Epictetus" },
  { text: "Whether you think you can, or you think you can't — you're right.", author: "Henry Ford" },
  { text: "When something is important enough, you do it even if the odds are not in your favor.", author: "Elon Musk" },
  { text: "If you're afraid to fail, then you're probably going to fail.", author: "Kobe Bryant" },
  { text: "Whatever it takes.", author: "Rich Piana" },
  { text: "We're all gonna make it, brahs.", author: "Zyzz" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "First say to yourself what you would be, and then do what you have to do.", author: "Epictetus" },
  { text: "As long as you live, keep learning how to live.", author: "Seneca" },
  { text: "Reject your sense of injury and the injury itself disappears.", author: "Marcus Aurelius" },
  { text: "To know your Enemy, you must become your Enemy.", author: "Sun Tzu" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Success isn't owned. It's leased, and rent is due every day.", author: "J.J. Watt" },
  { text: "Clear your mind of can't.", author: "Samuel Johnson" },
  { text: "Small deeds done are better than great deeds planned.", author: "Peter Marshall" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent van Gogh" },
  { text: "Light weight, baby!", author: "Ronnie Coleman" },
  { text: "If you don't find the time, if you don't do the work, you don't get the results.", author: "Arnold Schwarzenegger" },
  { text: "Be like water, my friend.", author: "Bruce Lee" },
  { text: "Great things come from hard work and perseverance. No excuses.", author: "Kobe Bryant" },
  { text: "The credit belongs to the man who is actually in the arena.", author: "Theodore Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "I am not afraid of an army of lions led by a sheep; I am afraid of an army of sheep led by a lion.", author: "Alexander the Great" },
  { text: "Everyone has a plan until they get punched in the mouth.", author: "Mike Tyson" },
  { text: "Success isn't always about greatness. It's about consistency.", author: "Dwayne Johnson" },
  { text: "You must understand that there is more than one path to the top of the mountain.", author: "Miyamoto Musashi" },
  { text: "You are in danger of living a life so comfortable and soft, that you will die without ever realizing your true potential.", author: "David Goggins" },
  { text: "The mind is the ultimate battleground.", author: "David Goggins" },
  { text: "It's not bragging if you can back it up.", author: "Muhammad Ali" }
];

// --- APP STATE & STORAGE ---
const STORAGE_KEY = 'gymplified_app_v2';
// Water limits and units. Amounts are always stored in millilitres/litres; fl oz is display-only.
const WATER_ENTRY_MAX_ML = 5000;
const WATER_PRESET_MAX = 6;
const WATER_GOAL_MIN_L = 0.5, WATER_GOAL_MAX_L = 10;
const ML_PER_US_FL_OZ = 29.5735295625;
const DEFAULT_WATER_PRESETS = [150, 250, 500, 750];
// Workout flow. Set types: warm-ups never count towards volume or PRs.
const SET_TYPES = ['normal', 'warmup', 'drop', 'failure'];
const SET_TYPE_INFO = { normal: { short: '', label: 'Normal set' }, warmup: { short: 'W', label: 'Warm-up set' }, drop: { short: 'D', label: 'Drop set' }, failure: { short: 'F', label: 'Set to failure' } };
const REST_SECONDS_MAX = 600, REST_DEFAULT_SECONDS = 90;
const EX_FAV_MAX = 100;
// Display units. Stored values stay canonical: kg, km and cm.
const KG_PER_LB = 0.45359237, KM_PER_MI = 1.609344, CM_PER_IN = 2.54;
const BACKUP_REMINDER_DAYS = 30;
// Gamification
const STREAK_FREEZE_MAX = 2, STREAK_FREEZE_EVERY = 7, STREAK_NUDGE_HOUR = 18, XP_LOG_MAX = 60;
const EMPTY_PROFILE = { heightCm: 0, weightKg: 0, age: 0, sex: '', goal: '', activity: '' };
// What accepted friends may see. Everything is shared unless switched off; 'leaderboard: false' is private mode.
const DEFAULT_PRIVACY = { leaderboard: true, workouts: true, volume: true, streak: true, level: true, prs: true };

const cleanState = {
  cal: 0,
  calTarget: 2500,
  protein: 0,
  carbs: 0,
  fat: 0,
  nutritionTargets: { protein: 0, carbs: 0, fat: 0 },
  customFoods: [],
  routines: [],
  water: 0,
  workouts: [],
  foods: [],
  prs: [],
  deluxe: { plans: [], profileFlair: true, accent: 'gold', theme: 'dark' },
  settings: {
    theme: 'dark',
    color: 'gold',
    scale: 'md',
    font: 'default',
    contrast: 'normal',
    motion: 'normal',
    waterUnit: 'ml',
    restSeconds: 90,
    restBeep: true,
    restNotify: false,
    weightUnit: 'kg',
    distanceUnit: 'km',
    heightUnit: 'cm',
    weekStart: 'mon'
  }
};

let state = bootState();

// --- TOAST NOTIFICATIONS ---
function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 20);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

// --- PERSISTENCE & SETTINGS ---
let cloudSyncUserId=null,cloudSyncLoadingUserId=null,cloudSaveTimer=null,cloudSaveBusy=false,cloudSavePending=false,stateRevision=0,cloudSyncErrorShown=false;
const ACCOUNT_OWNER_KEY='gymplified_account_owner_v1',ACCOUNT_STATE_PREFIX='gymplified_account_state_v1:';
let pendingLegacyAccountId=null,clearLegacyBackupAfterSync=false;
function hasLocalProgress(snapshot){return !!(snapshot&&(['workouts','foods','prs','sessions','routines','customEx','customFoods','waterEntries'].some(k=>Array.isArray(snapshot[k])&&snapshot[k].length)||Number(snapshot.game&&snapshot.game.xp)>0||Object.keys(snapshot.dailyHistory||{}).length));}
function saveAccountLocalSnapshot(userId){if(!userId)return;try{const raw=localStorage.getItem(STORAGE_KEY);if(raw)localStorage.setItem(ACCOUNT_STATE_PREFIX+userId,raw);}catch(error){console.warn('Could not cache this account locally:',error);}}
function prepareLocalAccountState(userId){
 if(!userId)return false;
 let owner='',cloudOnly=false;
 try{owner=localStorage.getItem(ACCOUNT_OWNER_KEY)||'';}catch(_){}
 if(!owner&&state.accountOwnerId)owner=state.accountOwnerId;
 if(owner&&owner!==userId){
  saveAccountLocalSnapshot(owner);
  let cached=null,unassigned=null;
  try{cached=localStorage.getItem(ACCOUNT_STATE_PREFIX+userId);unassigned=localStorage.getItem(ACCOUNT_STATE_PREFIX+'unassigned');}catch(_){}
  if(cached){
   try{state=sanitizeStateSnapshot(JSON.parse(cached));}
   catch(error){console.warn('Saved account cache was invalid; using cloud copy:',error);state=blankAccountState();cloudOnly=true;}
  }else if(unassigned){
   try{state=sanitizeStateSnapshot(JSON.parse(unassigned));stateRevision++;persistLocalState(false);pendingLegacyAccountId=userId;return true;}
   catch(error){console.warn('Unassigned recovery copy was invalid:',error);state=blankAccountState();cloudOnly=true;}
  }else{state=blankAccountState();cloudOnly=true;}
  stateRevision++;persistLocalState(false);
 }else if(!owner&&!hasLocalProgress(state)){
  let cached=null,unassigned=null;
  try{cached=localStorage.getItem(ACCOUNT_STATE_PREFIX+userId);unassigned=localStorage.getItem(ACCOUNT_STATE_PREFIX+'unassigned');}catch(_){}
  if(cached){
   try{state=sanitizeStateSnapshot(JSON.parse(cached));stateRevision++;persistLocalState(false);}
   catch(error){console.warn('Could not restore this account local cache:',error);cloudOnly=true;}
  }else if(unassigned){
   try{state=sanitizeStateSnapshot(JSON.parse(unassigned));stateRevision++;persistLocalState(false);pendingLegacyAccountId=userId;return true;}
   catch(error){console.warn('Unassigned recovery copy was invalid:',error);cloudOnly=true;}
  }else cloudOnly=true;
 }else if(!owner&&hasLocalProgress(state)){
  try{localStorage.setItem(ACCOUNT_STATE_PREFIX+'unassigned',JSON.stringify(state));}
  catch(error){console.warn('Could not preserve unassigned local progress:',error);}
  pendingLegacyAccountId=userId;return true;
 }
 state.accountOwnerId=userId;
 try{localStorage.setItem(ACCOUNT_OWNER_KEY,userId);}catch(_){}
 persistLocalState(false);
 return cloudOnly?'cloud':false;
}
function releaseLocalAccountState(userId){if(pendingLegacyAccountId===userId){try{localStorage.setItem(ACCOUNT_STATE_PREFIX+'unassigned',JSON.stringify(state));}catch(_){}pendingLegacyAccountId=null;}else if(userId)saveAccountLocalSnapshot(userId);state=blankAccountState();stateRevision++;persistLocalState(false);try{localStorage.removeItem(ACCOUNT_OWNER_KEY);}catch(_){} }
function markRecordDeleted(kind,item){if(!item||!item.id)return;const value=kind+':'+String(item.id);state.deletedRecordIds=Array.isArray(state.deletedRecordIds)?state.deletedRecordIds:[];if(!state.deletedRecordIds.includes(value))state.deletedRecordIds.push(value);}
function persistLocalState(markDirty=true){if(markDirty)stateRevision++;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch(error){console.error('Gymplified local save failed:',error);showToast('Could not save on this device. Free storage space, then export a backup and try again.');return false;}}
function saveState(){rewards();persistLocalState();queueCloudStateSave();renderAll();}

/* Cross-device progress sync. The database merges independent records atomically by ID. */
function resetCloudSaveQueue(){if(cloudSaveTimer)clearTimeout(cloudSaveTimer);cloudSaveTimer=null;cloudSavePending=false;}
function queueCloudStateSave(){if(!sb||!currentUser||cloudSyncUserId!==currentUser.id)return;cloudSavePending=true;if(cloudSaveTimer)clearTimeout(cloudSaveTimer);cloudSaveTimer=setTimeout(flushCloudStateSave,500);}
function mergeSyncedSnapshot(snapshot){
 const next=sanitizeStateSnapshot(snapshot),today=dayKey();
 const archive=(day,key,items)=>{if(!items.length)return;const target=next.dailyHistory[day]||(next.dailyHistory[day]={cal:0,protein:0,carbs:0,fat:0,water:0,workouts:[],foods:[],waterEntries:[]});const map=new Map((target[key]||[]).map(x=>[x.id,x]));items.forEach(x=>map.set(x.id,Object.assign({},map.get(x.id)||{},x)));target[key]=Array.from(map.values());};
 const oldW=new Map(),oldF=new Map(),oldH=new Map();
 next.workouts.forEach(x=>{if(x.day!==today){if(!oldW.has(x.day))oldW.set(x.day,[]);oldW.get(x.day).push(x);}});
 next.foods.forEach(x=>{if(x.day!==today){if(!oldF.has(x.day))oldF.set(x.day,[]);oldF.get(x.day).push(x);}});
 next.waterEntries.forEach(x=>{if(x.day!==today){if(!oldH.has(x.day))oldH.set(x.day,[]);oldH.get(x.day).push(x);}});
 oldW.forEach((v,k)=>archive(k,'workouts',v));oldF.forEach((v,k)=>archive(k,'foods',v));oldH.forEach((v,k)=>archive(k,'waterEntries',v));
 next.workouts=next.workouts.filter(x=>x.day===today);next.foods=next.foods.filter(x=>x.day===today);next.waterEntries=next.waterEntries.filter(x=>x.day===today);
 const removed=new Set(next.deletedRecordIds||[]);
 ['workouts','foods','prs','sessions','routines','customEx','customFoods','waterEntries'].forEach(key=>{next[key]=next[key].filter(x=>!removed.has(key+':'+x.id));});
 next.waterLog=next.waterEntries.map(x=>x.amount);next.water=next.waterEntries.reduce((n,x)=>n+x.amount,0);
 if(next.foods.length){next.cal=next.foods.reduce((n,x)=>n+x.cal,0);next.protein=next.foods.reduce((n,x)=>n+x.protein,0);next.carbs=next.foods.reduce((n,x)=>n+x.carbs,0);next.fat=next.foods.reduce((n,x)=>n+x.fat,0);}
 next.game.day=today;Object.keys(next.dailyHistory).sort().slice(0,-365).forEach(k=>delete next.dailyHistory[k]);
 return next;
}
function migrateAccountSnapshot(snapshot){state=mergeSyncedSnapshot(snapshot);persistLocalState(false);}
async function flushCloudStateSave(){
 cloudSaveTimer=null;if(!cloudSavePending||!sb||!currentUser||cloudSyncUserId!==currentUser.id)return;
 if(cloudSaveBusy){cloudSaveTimer=setTimeout(flushCloudStateSave,250);return;}
 cloudSaveBusy=true;cloudSavePending=false;
 const userId=currentUser.id,revision=stateRevision;
 let snapshot;
 try{const clean=sanitizeStateSnapshot(state);if(clean.accountOwnerId!==userId)throw new Error('Local progress belongs to a different account; cloud upload was blocked.');snapshot=JSON.parse(JSON.stringify(clean));}
 catch(error){cloudSaveBusy=false;console.error('Could not prepare state for cloud sync:',error);showToast('Progress could not be prepared for cloud sync. Your device copy is still saved.');return;}
 try{
  const result=await sb.rpc('gymplified_merge_user_app_state',{p_state:snapshot});
  if(result.error)throw result.error;
  cloudSyncErrorShown=false;
  if(result.data&&currentUser&&currentUser.id===userId&&revision===stateRevision){state=mergeSyncedSnapshot(result.data);persistLocalState(false);renderAll();}
 }catch(error){
  console.warn('Gymplified cloud progress sync failed:',error.message||error);
  if(!cloudSyncErrorShown){showToast('Cloud sync failed. Your device copy is saved; reconnect and try again.');cloudSyncErrorShown=true;}
 }finally{cloudSaveBusy=false;if(cloudSavePending&&sb&&currentUser&&currentUser.id===userId)cloudSaveTimer=setTimeout(flushCloudStateSave,100);}
}
async function syncUserAppState(cloudOnly=false){
 if(!sb||!currentUser||cloudSyncUserId===currentUser.id||cloudSyncLoadingUserId===currentUser.id)return;
 const id=currentUser.id,revision=stateRevision;cloudSyncLoadingUserId=id;
 try{
  let result;
  if(cloudOnly)result=await sb.rpc('gymplified_get_user_app_state');
  else{state.accountOwnerId=id;const snapshot=JSON.parse(JSON.stringify(sanitizeStateSnapshot(state)));snapshot.accountOwnerId=id;result=await sb.rpc('gymplified_merge_user_app_state',{p_state:snapshot});}
  if(result.error)throw result.error;
  if(!cloudOnly&&(!result.data||typeof result.data!=='object'))throw new Error('Cloud sync returned an invalid progress snapshot.');
  if(currentUser&&currentUser.id===id){
   if(revision===stateRevision){
    if(result.data&&typeof result.data==='object')migrateAccountSnapshot(result.data);
    else{state=blankAccountState();state.accountOwnerId=id;state.game.day=dayKey();persistLocalState(false);}
    applySettings();renderAll();initPicker();
   }
   cloudSyncUserId=id;cloudSyncErrorShown=false;
   try{localStorage.setItem(ACCOUNT_OWNER_KEY,id);localStorage.setItem(ACCOUNT_STATE_PREFIX+id,JSON.stringify(state));if(clearLegacyBackupAfterSync){localStorage.removeItem(ACCOUNT_STATE_PREFIX+'unassigned');clearLegacyBackupAfterSync=false;}}catch(_){}
   if(revision!==stateRevision)queueCloudStateSave();
  }
 }catch(error){
  if(currentUser&&currentUser.id===id)cloudSyncUserId=null;console.warn('Gymplified cloud progress could not be loaded:',error.message||error);
  if(!cloudSyncErrorShown){showToast('Could not sync your account yet. Your device data is preserved; try again when online.');cloudSyncErrorShown=true;}
 }finally{if(cloudSyncLoadingUserId===id)cloudSyncLoadingUserId=null;}
}



function applySettings() {
  const s = state.settings || cleanState.settings;
  document.documentElement.setAttribute('data-theme', s.theme || 'dark');
  document.documentElement.setAttribute('data-color', s.color || 'gold');
  document.documentElement.setAttribute('data-scale', s.scale || 'md');
  document.documentElement.setAttribute('data-font', s.font || 'default');
  document.documentElement.setAttribute('data-contrast', s.contrast || 'normal');
  document.documentElement.setAttribute('data-motion', s.motion || 'normal');

  // Sync inputs in Settings Screen
  if(document.getElementById('themeSelect')) document.getElementById('themeSelect').value = s.theme || 'dark';
  if(document.getElementById('scaleSelect')) document.getElementById('scaleSelect').value = s.scale || 'md';
  if(document.getElementById('fontSelect')) document.getElementById('fontSelect').value = s.font || 'default';
  if(document.getElementById('contrastToggle')) document.getElementById('contrastToggle').value = s.contrast || 'normal';
  if(document.getElementById('motionToggle')) document.getElementById('motionToggle').value = s.motion || 'normal';

  // Active color dot highlight
  document.querySelectorAll('.color-dot').forEach(dot => {
    dot.classList.remove('active');
  });
}

function toggleQuickTheme() {
  state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
  saveState();
  showToast(`Switched to ${state.settings.theme} mode`);
}

// --- NAVIGATION ---
function showScreen(screenId, btn) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  if (btn) {
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  markNav(); scrollTo(0,0); announceScreen(screenId,true); if(screenId==='friends')renderFriends(); if(screenId==='settings'&&currentUser)loadSupportTickets();
  if(screenId === 'prs') { nextQuote(); }
  if(screenId === 'deluxe'){ renderDeluxeUI(); if(currentUser) refreshDeluxeAccess(); }
}

// --- MOTIVATIONAL QUOTE ENGINE ---
function getRandomQuote() {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
}

function nextQuote() {
  const quoteBox = document.getElementById('quoteBox');
  if(!quoteBox) return;
  quoteBox.classList.add('changing');
  setTimeout(() => {
    const q = getRandomQuote();
    document.getElementById('quoteText').textContent = `"${q.text}"`;
    document.getElementById('quoteAuthor').textContent = q.author;
    quoteBox.classList.remove('changing');
  }, 200);
}

// --- ESTIMATED 1RM CALCULATOR (Epley Formula) ---
function calculate1RM(weight, reps) {
  weight=Number(weight);reps=Math.max(1,Math.round(Number(reps)||1));
  if(!Number.isFinite(weight)||weight<=0)return 0;
  // Kept at 0.001 kg so converted (lb) displays do not pick up kg rounding.
  if(reps===1)return Math.round(weight*1000)/1000;
  return Math.round(weight*(1+reps/30)*1000)/1000;
}
function format1RM(weight,reps){const n=calculate1RM(weight,reps);return n>0?fmtWeight(n):'—';}

// --- RENDERING LOGIC ---
function renderDashboard() {
  document.getElementById('dashCal').textContent = state.cal.toLocaleString();
  document.getElementById('dashCalTarget').textContent = state.calTarget.toLocaleString();
  const pct = Math.min(100, Math.round((state.cal / state.calTarget) * 100));
  document.getElementById('dashCalBar').style.width = pct + '%';
  document.getElementById('dashCalPct').textContent = pct + '%';
  const remain = Math.max(0, state.calTarget - state.cal);
  document.getElementById('dashCalRemain').textContent = remain.toLocaleString() + ' kcal remaining';

  document.getElementById('dashProtein').textContent = state.protein + 'g';
  document.getElementById('dashCarbs').textContent = state.carbs + 'g';
  document.getElementById('dashFat').textContent = state.fat + 'g';

  renderWaterSummary();
  renderWorkoutHero();
  renderHydrationNudge();

  document.getElementById('dashWorkoutCount').textContent = state.workouts.length + ' Exercises';

  const container = document.getElementById('dashWorkoutsContainer');
  if (state.workouts.length === 0) {
    container.innerHTML = `
      <div class="empty-box">
        <p>No workouts logged today. Add exercises using the direct log or Training tab.</p>
        <button class="btn btn-primary" onclick="showScreen('training', document.querySelector('nav button[data-screen="training"]'))">Open Training Log</button>
      </div>`;
  } else {
    container.innerHTML = state.workouts.map((w, i) => `
      <div class="item-row">
        <div class="row-idx">${String(i + 1).padStart(2, '0')}</div>
        <div>
          <strong style="display:block; font-size:calc(14px * var(--text-scale, 1));">${esc(w.name)}</strong>
          <span style="font-size:calc(12px * var(--text-scale, 1)); color:var(--muted);">${esc(w.muscle)} · ${esc(fmtWeight(w.weight))} · ${w.sets} sets × ${w.reps} reps</span>
        </div>
        <button class="check-btn ${w.done ? 'done' : ''}" aria-pressed="${!!w.done}" aria-label="Mark ${esc(w.name)} done" onclick="toggleWorkoutDone(${i})">${w.done ? '✓' : ''}</button>
      </div>
    `).join('');
  }
}

function renderPRs() {
  const container = document.getElementById('prListContainer');
  if (!state.prs || state.prs.length === 0) {
    container.innerHTML = `
      <div class="empty-box">
        <p>No Personal Records saved yet. Record your heavy lifts using the form above.</p>
      </div>`;
    return;
  }

  container.innerHTML = `<div class="pr-grid">` + state.prs.map((pr, i) => {
    const est1RM = calculate1RM(pr.weight, pr.reps);
    return `
      <div class="pr-card">
        <div class="pr-card-badge">🏆 EST. 1RM: ${esc(fmtWeight(est1RM).toUpperCase())}</div>
        <div class="pr-title">${esc(pr.name)}</div>
        <div class="pr-metric">${kgToDisplay(Number(pr.weight)||0)} <span style="font-size:calc(14px * var(--text-scale, 1)); color:var(--muted);">${weightUnit().toUpperCase()}</span> × ${Number(pr.reps)||1} <span style="font-size:calc(14px * var(--text-scale, 1)); color:var(--muted);">REPS</span></div>
        <div class="pr-subtext">Achieved: ${esc(pr.date || 'Today')}</div>
        <button class="btn btn-icon-only" style="position:absolute; bottom:8px; right:8px; color:var(--danger);" onclick="deletePR(${i})" title="Delete PR" aria-label="Delete PR for ${esc(pr.name)}">✕</button>
      </div>
    `;
  }).join('') + `</div>`;
}

function renderNutrition() {
  const foods=state.foods||[],targets=state.nutritionTargets||{protein:0,carbs:0,fat:0};
  const set=(id,v)=>{const e=$(id);if(e)e.textContent=v;};
  const bar=(id,v,t,label)=>{const e=$(id);if(!e)return;const pct=t>0?Math.min(100,Math.max(0,v/t*100)):0;e.style.width=pct+'%';if(label)setBar(id,Math.round(pct),label);};
  set('nutritionDate',new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'}));
  set('nutritionCal',Math.round(state.cal||0).toLocaleString());set('nutritionCalTarget',(state.calTarget||2500).toLocaleString());
  const cp=Math.min(100,Math.round((state.cal/(state.calTarget||2500))*100));
  bar('nutritionCalBar',state.cal,state.calTarget||2500,'Calories eaten today');set('nutritionCalLeft',Math.max(0,(state.calTarget||2500)-state.cal).toLocaleString()+' kcal remaining');set('nutritionCalPercent',cp+'%');
  [['Protein','protein',state.protein],['Carbs','carbs',state.carbs],['Fat','fat',state.fat]].forEach(([label,key,val])=>{
    const target=Number(targets[key])||0;set('nutrition'+label,(Number(val)||0).toFixed(1).replace(/\.0$/,'')+'g');
    bar(key+'Track',Number(val)||0,target,label+' towards target');set(key+'Meta',target>0?(Number(val)||0).toFixed(1).replace(/\.0$/,'')+' / '+target+'g':'Set a target');
  });
  ['protein','carbs','fat'].forEach(k=>{const e=$('target'+k.charAt(0).toUpperCase()+k.slice(1));if(e&&document.activeElement!==e)e.value=targets[k]||0;});
  set('foodEntryCount',foods.length+' '+(foods.length===1?'item':'items'));
  renderQuickAdd();renderMacroPercents();renderNutritionWeek();renderWaterPanel();
  const diary=$('foodDiary'),yesterday=yesterdayFoods();
  diary.innerHTML=(foods.length?'':'<div class="nutrition-empty">Your food diary is empty.<br><span class="sub">Search, scan a barcode or tap a recent food to add your first meal.</span></div>')+FOOD_MEALS.map(meal=>{
    const items=foods.map((f,i)=>({f,i})).filter(x=>(x.f.meal||'Snacks')===meal),hadYesterday=yesterday.some(f=>(f.meal||'Snacks')===meal);
    const total=items.reduce((a,x)=>{a.cal+=Number(x.f.cal)||0;a.p+=Number(x.f.protein)||0;a.c+=Number(x.f.carbs)||0;a.f+=Number(x.f.fat)||0;return a;},{cal:0,p:0,c:0,f:0});
    const actions='<div class="meal-actions"><button type="button" class="btn" data-food-action="add-to-meal" data-meal="'+meal+'" aria-label="Add food to '+meal.toLowerCase()+'">+ Add</button>'+(hadYesterday?'<button type="button" class="btn" data-food-action="copy-yesterday" data-meal="'+meal+'" aria-label="Copy yesterday\'s '+meal.toLowerCase()+'">⧉ Yesterday</button>':'')+(items.length?'<button type="button" class="btn" data-food-action="save-recipe" data-meal="'+meal+'" aria-label="Save '+meal.toLowerCase()+' as a recipe">★ Save as recipe</button>':'')+'</div>';
    return '<div class="meal-group"><div class="meal-group-head"><div><strong>'+esc(meal)+'</strong><small>'+(items.length?Math.round(total.cal)+' kcal · P '+total.p.toFixed(1)+'g · C '+total.c.toFixed(1)+'g · F '+total.f.toFixed(1)+'g':'Nothing logged')+'</small></div>'+actions+'</div>'+
      items.map(({f,i})=>'<div class="food-entry"><div><div class="food-entry-name">'+esc(f.name)+'</div><div class="food-entry-meta">'+(f.portion?esc(f.portion)+' · ':'')+(f.grams?Number(f.grams)+' g · ':'')+Math.round(f.cal)+' kcal</div><div class="food-entry-macros"><span><b>'+Number(f.protein||0).toFixed(1)+'g</b> protein</span><span><b>'+Number(f.carbs||0).toFixed(1)+'g</b> carbs</span><span><b>'+Number(f.fat||0).toFixed(1)+'g</b> fat</span></div></div><div class="food-entry-actions"><button type="button" class="btn" data-food-action="delete" data-index="'+i+'" style="color:var(--danger)" aria-label="Delete '+esc(f.name)+'">Delete</button></div></div>').join('')+'</div>';
  }).join('');
}

function renderAll() {
  applySettings();
  renderDashboard();
  renderPRs();
  renderTrainingLog();
  renderNutrition();
  renderExtras();
  syncSettingsControls();renderBackupReminder();renderOnboarding();renderCustomExerciseList();
  if(typeof renderDeluxeUI==='function')renderDeluxeUI();

  const now = new Date();
  document.getElementById('currentDate').textContent = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  if(!document.getElementById('inputPRDate').value) {
    document.getElementById('inputPRDate').value = dayKey();
  }
}

// --- PR ACTIONS ---
function savePRRecord() {
  const name = document.getElementById('inputPRName').value.trim();
  const weight = Math.min(2000, Math.round(displayToKg(Math.max(0, parseFloat(document.getElementById('inputPRWeight').value) || 0)) * 1000) / 1000);
  const reps = Math.max(1, parseInt(document.getElementById('inputPRReps').value) || 1);
  const date = document.getElementById('inputPRDate').value;

  if (!name) {
    showToast('Please enter an exercise name for your PR');
    return;
  }

  state.prs.push({ id:newRecordId('pr'),name,weight,reps,date:safeStateDay(date,dayKey()) });
  document.getElementById('inputPRName').value = '';
  saveState();
  showToast(`PR saved: ${name} (${fmtWeight(weight)})`);
}

function deletePR(index) {
  markRecordDeleted('prs',state.prs[index]);state.prs.splice(index, 1);
  saveState();
  showToast('Personal Record removed');
}

function clearAllPRs() {
  if (confirm('Are you sure you want to clear all Personal Records?')) {
    (state.prs||[]).forEach(x=>markRecordDeleted('prs',x));state.prs = [];
    saveState();
    showToast('All PRs cleared');
  }
}

// --- WORKOUT ACTIONS ---
function saveDirectExercise() {
  const name = $('inputExName').value.trim();
  const muscle = $('inputExMuscle').value || 'chest';
  const weight = Math.max(0,Number($('inputExWeight').value)||0);
  const sets = Math.max(1,Math.min(30,parseInt($('inputExSets').value,10)||3));
  const reps = Math.max(1,Math.min(1000,parseInt($('inputExReps').value,10)||10));
  if(!name){showToast('Please enter an exercise or machine name');return;}
  const workout=syncW({name,muscle:cap(muscle),setList:Array.from({length:sets},()=>({kg:weight,reps,done:false}))});
  if(!Array.isArray(state.workouts))state.workouts=[];
  state.workouts.push(workout);
  $('inputExName').value='';
  persistLocalState();queueCloudStateSave();
  try{renderTrainingLog();}catch(e){console.error('Training log render failed',e);showToast('Exercise saved, but the workout list could not refresh. Please reload.');}
  try{renderDashboard();}catch(e){console.warn(e);}
  showToast('Added '+name+' · '+sets+' editable sets');
}

function deleteWorkout(index) {
  markRecordDeleted('workouts',state.workouts[index]);state.workouts.splice(index, 1);
  saveState();
  showToast('Exercise removed');
}

function clearAllWorkouts() {
  if (confirm('Clear all logged exercises for today?')) {
    (state.workouts||[]).forEach(x=>markRecordDeleted('workouts',x));state.workouts = [];
    saveState();
    showToast('Workout log cleared');
  }
}

// --- NUTRITION 2.0: searchable foods, portions and meal diary ---
let selectedFoodId=null;
function saveCustomFood(){
  const name=$('customFoodName').value.trim(),cal=Number($('customFoodCal').value),protein=Number($('customFoodProtein').value),carbs=Number($('customFoodCarbs').value),fat=Number($('customFoodFat').value);
  if(!name)return showToast('Enter a food name');
  if(['customFoodCal','customFoodProtein','customFoodCarbs','customFoodFat'].some(k=>$(k).value.trim()===''))return showToast('Fill in all nutrition values per 100g');
  if(![cal,protein,carbs,fat].every(Number.isFinite)||cal<0||cal>1000||protein<0||protein>100||carbs<0||carbs>100||fat<0||fat>100)return showToast('Check the nutrition values per 100g');
  if((state.customFoods||[]).length>=500)return showToast('You can keep up to 500 custom foods and recipes');
  const id=newRecordId('custom-food');
  state.customFoods.push({id,name,cal,protein,carbs,fat,kind:'food'});saveState();
  $('customFoodName').value='';['customFoodCal','customFoodProtein','customFoodCarbs','customFoodFat'].forEach(k=>$(k).value='');chooseFood(id);showToast('Custom food saved');
}
function saveNutritionTargets(){
  const p=Number($('targetProtein').value),c=Number($('targetCarbs').value),f=Number($('targetFat').value);
  if(![p,c,f].every(Number.isFinite)||p<0||p>500||c<0||c>800||f<0||f>300)return showToast('Use valid macro targets (0 or higher)');
  state.nutritionTargets={protein:p,carbs:c,fat:f};saveState();renderNutrition();showToast('Macro targets saved');
}
function saveFoodEntry(){showToast('Choose a food from the new food search');}
function deleteFood(index){
  const f=state.foods[index];if(!f)return;markRecordDeleted('foods',f);
  state.cal=Math.max(0,state.cal-(Number(f.cal)||0));state.protein=Math.max(0,state.protein-(Number(f.protein)||0));state.carbs=Math.max(0,state.carbs-(Number(f.carbs)||0));state.fat=Math.max(0,state.fat-(Number(f.fat)||0));
  state.foods.splice(index,1);saveState();renderAll();showToast('Food removed from diary');
}
function clearFoodLogs(){
  if(!confirm('Clear every food entry logged today?'))return;
  (state.foods||[]).forEach(x=>markRecordDeleted('foods',x));state.foods=[];state.cal=state.protein=state.carbs=state.fat=0;saveState();renderAll();showToast('Today’s food diary cleared');
}


function resetWater() {
  (state.waterEntries||[]).forEach(x=>markRecordDeleted('waterEntries',x));
  state.water = 0; state.waterLog = []; state.waterEntries=[];
  saveState();
  showToast('Water tracker reset');
}

function openLogModal() {
  showScreen('training', document.querySelector('nav button[data-screen="training"]'));
  const search=$('exSearch');
  if(search){search.scrollIntoView({behavior:reducedMotion()?'auto':'smooth',block:'center'});setTimeout(()=>search.focus({preventScroll:true}),180);}
}

function openCalorieModal() {
  showScreen('nutrition', document.querySelector('nav button[data-screen="nutrition"]'));
  setTimeout(()=>document.getElementById('foodSearch')?.focus(),50);
}

// --- SETTINGS HUB ---
function changeTheme(val) { state.settings.theme = val; saveState(); showToast(`Theme updated`); }
function changeColor(val, el) { 
  state.settings.color = val; 
  document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
  if (el) el.classList.add('active');
  saveState(); 
  showToast(`Accent palette updated`);
}
function changeScale(val) { state.settings.scale = val; saveState(); }
function changeFont(val) { state.settings.font = val; saveState(); }
function changeContrast(val) { state.settings.contrast = val; saveState(); }
function changeMotion(val) { state.settings.motion = val; saveState(); }

// Full-state CSV backup. JSON values inside quoted CSV cells preserve nested objects and arrays.
function csvCell(value){let text=String(value==null?'':value);if(/^[\\s]*[=+@-]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';}
function parseGymCSV(text){
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){
    const c=text[i],n=text[i+1];
    if(quoted){if(c==='"'&&n==='"'){cell+='"';i++;}else if(c==='"')quoted=false;else cell+=c;}
    else if(c==='"')quoted=true;
    else if(c===','){row.push(cell);cell='';}
    else if(c==='\n'){row.push(cell);rows.push(row);row=[];cell='';}
    else if(c!=='\r')cell+=c;
  }
  if(quoted)throw new Error('The CSV contains an unfinished quoted field.');
  if(cell.length||row.length){row.push(cell);rows.push(row);}
  return rows;
}
function exportGymplifiedCSV(){
  try{
    const rows=[['Date','Workout Name','Exercise Name','Set Order','Weight (kg)','Reps','Duration (seconds)','Distance (km)','Notes','Gymplified Backup']];
    const workouts=(state.sessions||[]).slice().reverse();
    workouts.forEach((session)=>{
      const exercises=Array.isArray(session.exercises)?session.exercises:[];
      if(exercises.length){
        exercises.forEach(ex=>(ex.sets||[]).forEach((set,i)=>rows.push([session.date,session.name||'Workout',ex.name,i+1,set.weight??set.kg??'',set.reps??'',set.duration??'',set.distance??'',set.notes||'',''])));
      }else rows.push([session.date,session.name||'Workout','','','','','','','', '']);
    });
    (state.workouts||[]).forEach(ex=>(ex.setList||[]).forEach((set,i)=>rows.push([dayKey(),'Current workout',ex.name,i+1,set.kg,set.reps,'','','',''])));
    if(rows.length===1)rows.push([dayKey(),'Gymplified backup','','','','','','','','']);
    // Preserve the complete Gymplified app state in a single metadata cell, while keeping ordinary set rows compatible with common gym-app imports.
    rows[1][9]=JSON.stringify({format:'gymplified-backup',version:2,state:state});
    const csv='\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='gymplified-workout-backup-'+dayKey()+'.csv';document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
    $('csvBackupStatus').textContent='Workout CSV exported. Includes standard exercise/set columns plus a private Gymplified restore payload.';
    showToast('Gymplified CSV backup exported');
  }catch(err){console.error(err);showToast('Could not export your backup');}
}
function gymHeader(value){return String(value||'').toLowerCase().trim().replace(/[\uFEFF]/g,'').replace(/[^a-z0-9]+/g,' ').trim();}
function gymPick(row,headers,names){
  for(const name of names){const i=headers.indexOf(gymHeader(name));if(i>=0&&row[i]!=null&&String(row[i]).trim()!=='')return String(row[i]).trim();}
  return '';
}
function gymNumber(value,label,rowNumber,allowBlank){
  if(value==null||String(value).trim()===''){if(allowBlank)return 0;throw new Error('Missing '+label+' on CSV row '+rowNumber+'.');}
  let s=String(value).trim().replace(/[\s£€$]/g,'').replace(/(?:kg|kgs|lbs?|reps?)$/i,'');
  if(!s)return 0;
  if(s.includes(',')&&s.includes('.')){
    if(s.lastIndexOf(',')>s.lastIndexOf('.'))s=s.replace(/\./g,'').replace(',','.');
    else s=s.replace(/,/g,'');
  }else if(s.includes(',')){
    const tail=s.length-s.lastIndexOf(',')-1;
    s=tail>0&&tail<=2?s.replace(',','.'):s.replace(/,/g,'');
  }
  if(!/^\+?\d+(?:\.\d+)?$/.test(s))throw new Error('Invalid '+label+' "'+value+'" on CSV row '+rowNumber+'.');
  const n=Number(s);
  if(!Number.isFinite(n)||n<0)throw new Error('Invalid '+label+' on CSV row '+rowNumber+'.');
  return n;
}
function gymDate(value,rowNumber){
  if(!value)throw new Error('Missing workout date on CSV row '+rowNumber+'.');
  const s=String(value).trim();
  let m=s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[ T].*)?$/);
  if(m){
    const y=Number(m[1]),mo=Number(m[2]),d=Number(m[3]),test=new Date(Date.UTC(y,mo-1,d));
    if(test.getUTCFullYear()!==y||test.getUTCMonth()!==mo-1||test.getUTCDate()!==d)throw new Error('Invalid workout date "'+value+'" on CSV row '+rowNumber+'.');
    return m[1]+'-'+String(mo).padStart(2,'0')+'-'+String(d).padStart(2,'0');
  }
  m=s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})(?:[ T].*)?$/);
  if(m){
    const first=Number(m[1]),second=Number(m[2]),y=Number(m[3]);if(first<=12&&second<=12&&first!==second)throw new Error('Ambiguous date "'+value+'" on CSV row '+rowNumber+'. Use YYYY-MM-DD to avoid importing the wrong day.');const d=first>12?first:second>12?second:first,mo=first>12?second:second>12?first:second,test=new Date(Date.UTC(y,mo-1,d));
    if(test.getUTCFullYear()!==y||test.getUTCMonth()!==mo-1||test.getUTCDate()!==d)throw new Error('Invalid workout date "'+value+'" on CSV row '+rowNumber+'.');
    return String(y)+'-'+String(mo).padStart(2,'0')+'-'+String(d).padStart(2,'0');
  }
  const parsed=new Date(s);
  if(Number.isNaN(parsed.getTime()))throw new Error('Unrecognised workout date "'+value+'" on CSV row '+rowNumber+'.');
  return dayKey(parsed);
}
function gymDuration(value,rowNumber){
  if(!value)return 0;
  const s=String(value).trim(),m=s.match(/^(\d+):([0-5]?\d)(?::([0-5]?\d))?$/);
  if(m){const seconds=m[3]!=null?Number(m[1])*3600+Number(m[2])*60+Number(m[3]):Number(m[1])*60+Number(m[2]);if(seconds>86400)throw new Error('Duration is over 24 hours on CSV row '+rowNumber+'.');return seconds;}
  const n=gymNumber(value,'duration',rowNumber,true);
  if(n>86400)throw new Error('Duration is over 24 hours on CSV row '+rowNumber+'.');
  return n;
}
function gymWorkoutSignature(w){
  return JSON.stringify([String(w.date||''),String(w.name||'').trim().toLowerCase(),String(w.sourceWorkoutId||''),String(w.startedAt||''),Number(w.mins)||0,(w.exercises||[]).map(e=>[
    String(e.name||'').trim().toLowerCase(),String(e.notes||''),
    (e.sets||[]).map(s=>[Number(s.kg??s.weight)||0,Number(s.reps)||0,Number(s.duration)||0,Number(s.distance)||0,String(s.notes||''),Number(s.order)||0])
  ])]);
}
function gymImportRows(rows,fileName){
  if(!Array.isArray(rows)||!rows.length||rows.length<2)throw new Error('This CSV has no workout rows.');
  if(rows.length>50001)throw new Error('This CSV contains too many rows (50,000 maximum).');
  const headers=rows[0].map(gymHeader);
  if(!headers.length||headers.length>100)throw new Error('The CSV header is invalid or contains too many columns.');
  const backupIndex=headers.indexOf('gymplified backup');
  if(backupIndex>=0){
    const payload=rows.slice(1).map(r=>r[backupIndex]).find(v=>v&&v.trim());
    if(payload){
      let parsed;try{parsed=JSON.parse(payload);}catch(e){throw new Error('The Gymplified backup payload is damaged.');}
      if(parsed.format==='gymplified-backup'&&parsed.state&&parsed.version>=2)return{type:'backup',state:validateBackupData(parsed.state)};
    }
  }
  const nameKeys=['exercise name','exercise','exercise title','movement','activity name','exercise name english'];
  const dateKeys=['date','start time','workout date','workout start','performed at','datetime','timestamp'];
  const weightKeys=['weight kg','weight (kg)','weight','weight lifted','load','kg','weight lbs','weight (lbs)','weight lb','weight in lbs','load lbs','load lb'];
  const weightUnitKeys=['weight unit','unit','units','load unit'];
  const repKeys=['reps','repetitions','rep'];
  const setKeys=['set order','set number','set','set #','set no','set index'];
  const workoutKeys=['workout name','workout','session name','routine name'];
  const workoutIdKeys=['workout id','session id','workout uuid','session uuid'];
  const durationKeys=['duration seconds','seconds','duration','time','duration min','duration (min)','duration minutes','minutes'];
  const distanceKeys=['distance km','distance (km)','distance','km','distance miles','distance (mi)','distance mi','miles'];
  const distanceUnitKeys=['distance unit','distance units'];
  const notesKeys=['notes','comment','comments'];
  const dateHeader=headers.find(h=>dateKeys.map(gymHeader).includes(h));
  if(!dateHeader)throw new Error('Could not find a workout date column. Include a Date or Workout Date column.');
  if(!headers.some(h=>nameKeys.map(gymHeader).includes(h)))throw new Error('Could not find an Exercise or Exercise Name column. Choose a workout-history CSV export.');
  const grouped=new Map(),seenRows=new Set();let accepted=0,lastDate='',lastWorkoutName='',lastWorkoutId='';
  rows.slice(1).forEach((row,idx)=>{
    const rowNumber=idx+2;
    if(!row||!row.some(v=>String(v||'').trim()))return;
    if(row.length>headers.length&&row.slice(headers.length).some(v=>String(v||'').trim()))throw new Error('Unexpected extra CSV columns on row '+rowNumber+'.');
    const exercise=gymPick(row,headers,nameKeys);if(!exercise)return;
    const rawDate=gymPick(row,headers,dateKeys);
    const date=rawDate?gymDate(rawDate,rowNumber):lastDate;
    if(!date)throw new Error('Missing workout date on CSV row '+rowNumber+'.');
    lastDate=date;
    const rawWeight=gymPick(row,headers,weightKeys);
    const rawWeightHeader=headers.find(h=>weightKeys.map(gymHeader).includes(h))||'';
    const rawWeightUnit=gymPick(row,headers,weightUnitKeys),unitIsLb=/^(?:lb|lbs|pound|pounds)$/i.test(rawWeightUnit),unitIsKg=/^(?:kg|kgs|kilogram|kilograms)$/i.test(rawWeightUnit),headerIsLb=/\blb/.test(rawWeightHeader),headerIsKg=/\bkg/.test(rawWeightHeader);
    if(rawWeight&&/^(?:weight|weight lifted|load)$/.test(rawWeightHeader)&&!unitIsLb&&!unitIsKg)throw new Error('Weight units are unclear on CSV row '+rowNumber+'. Rename the column to Weight (kg) or Weight (lbs), or add a Weight Unit column containing kg or lbs.');
    if((headerIsKg&&unitIsLb)||(headerIsLb&&unitIsKg))throw new Error('Weight column and weight unit disagree on CSV row '+rowNumber+'.');
    let weightKg=gymNumber(rawWeight,'weight',rowNumber,true);
    if(headerIsLb||(!headerIsKg&&unitIsLb))weightKg=weightKg*0.45359237;
    weightKg=Math.round(weightKg*100)/100;
    if(weightKg>1000)throw new Error('Weight exceeds 1,000 kg on CSV row '+rowNumber+'.');
    const rawReps=gymPick(row,headers,repKeys);
    const reps=rawReps?gymNumber(rawReps,'reps',rowNumber,false):0;
    if(reps>1000)throw new Error('Reps exceed 1,000 on CSV row '+rowNumber+'.');
    const rawDuration=gymPick(row,headers,durationKeys),durationHeader=headers.find(h=>durationKeys.map(gymHeader).includes(h))||'';
    let duration=gymDuration(rawDuration,rowNumber);if(/\bmin(?:ute)?s?\b/.test(durationHeader))duration*=60;
    const rawDistance=gymPick(row,headers,distanceKeys),distanceHeader=headers.find(h=>distanceKeys.map(gymHeader).includes(h))||'',rawDistanceUnit=gymPick(row,headers,distanceUnitKeys),distanceIsMi=/^(?:mi|mile|miles)$/i.test(rawDistanceUnit),distanceIsKm=/^(?:km|kilometer|kilometers)$/i.test(rawDistanceUnit),headerIsMi=/\bmi\b|mile/.test(distanceHeader),headerIsKm=/\bkm\b|kilometer/.test(distanceHeader);
    if(rawDistance&&distanceHeader==='distance'&&!distanceIsMi&&!distanceIsKm)throw new Error('Distance units are unclear on CSV row '+rowNumber+'. Rename the column to Distance (km) or Distance (mi), or add a Distance Unit column.');
    if((headerIsKm&&distanceIsMi)||(headerIsMi&&distanceIsKm))throw new Error('Distance column and distance unit disagree on CSV row '+rowNumber+'.');
    let distance=gymNumber(rawDistance,'distance',rowNumber,true);
    if(headerIsMi||(!headerIsKm&&distanceIsMi))distance*=1.609344;
    if(distance>1000)throw new Error('Distance exceeds 1,000 km on CSV row '+rowNumber+'.');
    if(!reps&&!duration&&!distance)throw new Error('CSV row '+rowNumber+' has no reps, duration or distance. Check the column mapping.');
    const rawSetOrder=gymPick(row,headers,setKeys);
    const setOrder=rawSetOrder?Math.round(gymNumber(rawSetOrder,'set number',rowNumber,false)):idx+1;
    if(setOrder<1||setOrder>1000)throw new Error('Invalid set number on CSV row '+rowNumber+'.');
    const rawWorkoutName=gymPick(row,headers,workoutKeys),workoutName=rawWorkoutName||lastWorkoutName||'Imported workout';
    lastWorkoutName=workoutName;
    const workoutId=gymPick(row,headers,workoutIdKeys)||lastWorkoutId;
    if(workoutId)lastWorkoutId=workoutId;
    const notes=gymPick(row,headers,notesKeys);
    const key=date+'|'+workoutName.toLowerCase()+'|'+workoutId;
    if(!grouped.has(key))grouped.set(key,{date,name:workoutName,sourceWorkoutId:workoutId,mins:0,vol:0,sets:0,reps:0,ex:0,names:[],exercises:[],_map:{},_rows:new Set()});
    const w=grouped.get(key),exerciseKey=exercise.trim().toLowerCase();
    if(!w._map[exerciseKey]){w._map[exerciseKey]={name:exercise,sets:[]};w.exercises.push(w._map[exerciseKey]);w.names.push(exercise);w.ex++;}
    const setKey=[exerciseKey,setOrder,weightKg,reps,duration,distance,notes].join('|');
    if(w._rows.has(setKey)||seenRows.has(key+'|'+setKey))return;
    w._rows.add(setKey);seenRows.add(key+'|'+setKey);
    w._map[exerciseKey].sets.push({kg:weightKg,weight:weightKg,reps:Math.round(reps),done:true,duration,distance,notes,order:setOrder});
    w.vol+=weightKg*reps;w.sets++;w.reps+=reps;w.mins=Math.max(w.mins,Math.round(duration/60));accepted++;
  });
  const imported=Array.from(grouped.values()).map(w=>{delete w._map;delete w._rows;delete w.sourceWorkoutId;w.vol=Math.round(w.vol);return w;}).filter(w=>w.sets>0);
  if(!accepted||!imported.length)throw new Error('No valid exercise/set rows were found in this CSV.');
  return{type:'external',workouts:imported,rows:accepted,fileName};
}
function importGymplifiedCSV(input){
  const file=input.files&&input.files[0];if(!file)return;
  const status=$('csvBackupStatus');
  if(file.size>15*1024*1024){showToast('CSV file is too large (15 MB maximum)');input.value='';return;}
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const rows=parseGymCSV(String(reader.result||'').replace(/^\uFEFF/,''));
      const result=gymImportRows(rows,file.name);
      if(result.type==='backup'){
        if(!confirm('Restore this validated Gymplified backup? Existing Gymplified data on this device and in your synced account will be replaced.')){input.value='';return;}
        const restored=validateBackupData(result.state);
        restored.resetAt=Date.now();restored.deletedRecordIds=[];restored.accountOwnerId=currentUser?currentUser.id:'';
        state=restored;persistLocalState();queueCloudStateSave();applySettings();renderAll();initPicker();initGoals();
        status.textContent='Validated Gymplified backup restored · '+file.name;showToast('Gymplified data restored');
      }else{
        const existing=new Set((state.sessions||[]).map(gymWorkoutSignature));
        const fresh=[],seen=new Set();
        result.workouts.forEach(w=>{
          const signature=gymWorkoutSignature(w);
          if(existing.has(signature)||seen.has(signature))return;
          seen.add(signature);fresh.push(w);
        });
        if(!fresh.length){status.textContent='All '+result.workouts.length+' workouts already appear in your history.';showToast('No new workouts to import');input.value='';return;}
        const newSetCount=fresh.reduce((n,w)=>n+w.sets,0);
        if((state.sessions||[]).length+fresh.length>5000)throw new Error('This import would exceed the 5,000-workout history limit. Export a backup before importing more history.');
        if(!confirm('Import '+fresh.length+' new workout(s) containing '+newSetCount+' sets from '+file.name+'? Existing Gymplified data will be kept.')){input.value='';return;}
        const additions=fresh.map(w=>{
          const copy=JSON.parse(JSON.stringify(w));
          copy.id=newRecordId('session');
          copy.exercises=(copy.exercises||[]).map((ex,i)=>Object.assign({},ex,{
            id:newRecordId('session-ex'),
            sets:(ex.sets||[]).map(set=>Object.assign({},set,{id:newRecordId('session-set')}))
          }));
          return copy;
        });
        const prMap=new Map((state.prs||[]).map(p=>[String(p.name||'').trim().toLowerCase(),p]));
        const updatedPRs=(state.prs||[]).slice();
        additions.forEach(w=>{
          w.exercises.forEach(ex=>{
            const best=ex.sets.reduce((a,b)=>b.kg>a.kg?b:a,{kg:0,reps:0});
            if(best.kg<=0)return;
            const key=ex.name.trim().toLowerCase(),old=prMap.get(key);
            if(!old||best.kg>Number(old.weight)||best.kg===Number(old.weight)&&best.reps>Number(old.reps||0)){
              const pr={id:old&&old.id?old.id:newRecordId('pr'),name:ex.name,weight:best.kg,reps:best.reps||1,date:safeStateDay(w.date,dayKey())};
              if(old){const ix=updatedPRs.indexOf(old);if(ix>=0)updatedPRs[ix]=pr;}else updatedPRs.push(pr);
              prMap.set(key,pr);
            }
          });
        });
        state.sessions=(state.sessions||[]).concat(additions);
        state.prs=updatedPRs;
        saveState();status.textContent='Imported '+additions.length+' new workout(s) and '+newSetCount+' sets. Duplicate workouts and repeated CSV rows were skipped; existing history was preserved.';showToast('Workout history imported safely');
      }
    }catch(err){console.error(err);status.textContent=err.message||'Could not import this CSV.';showToast(err.message||'CSV import failed');}
    input.value='';
  };
  reader.onerror=()=>{status.textContent='Could not read this file.';input.value='';showToast('Could not read CSV file');};
  reader.readAsText(file);
}
function closeAccountDialogs(){['deleteAccountDialog','resetProgressDialog'].forEach(id=>{const dialog=$(id);if(dialog&&dialog.open)dialog.close();});}
function updateDeleteAccountConfirm(){const input=$('deleteAccountConfirm'),button=$('confirmDeleteAccountButton');if(button)button.disabled=!input||input.value.trim()!=='DELETE';}
function deleteGymplifiedAccount(){
 if(!currentUser||!sb)return showToast('Sign in to manage your account');
 const input=$('deleteAccountConfirm');if(input)input.value='';updateDeleteAccountConfirm();
 const dialog=$('deleteAccountDialog');if(dialog)dialog.showModal();
}
async function confirmDeleteGymplifiedAccount(){
 if(!currentUser||!sb)return showToast('Sign in to manage your account');
 if(!$('deleteAccountConfirm')||$('deleteAccountConfirm').value.trim()!=='DELETE')return;
 const button=$('confirmDeleteAccountButton');button.disabled=true;button.textContent='Deleting…';
 try{
  const result=await sb.functions.invoke('gymplified-delete-account',{body:{confirmation:'DELETE'}});
  if(result.error)throw result.error;
  const deletedUserId=currentUser.id;await sb.auth.signOut().catch(()=>{});
  resetCloudSaveQueue();cloudSyncUserId=null;cloudSyncLoadingUserId=null;currentUser=null;currentProfile=null;
  localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(ACCOUNT_STATE_PREFIX+deletedUserId);localStorage.removeItem(ACCOUNT_OWNER_KEY);state=bootState();closeAccountDialogs();renderFriends();
  showToast('Your Gymplified account has been deleted');
 }catch(error){showToast(error&&error.message?error.message:'Could not delete your account. Please contact support.');}
 finally{button.disabled=false;button.textContent='Delete permanently';}
}
function resetAllData(){const dialog=$('resetProgressDialog');if(dialog)dialog.showModal();}
function confirmResetAllData(){
 const tombstones=Array.isArray(state.deletedRecordIds)?state.deletedRecordIds.slice():[];
 [['workouts',state.workouts],['foods',state.foods],['prs',state.prs],['sessions',state.sessions],['routines',state.routines],['customEx',state.customEx],['customFoods',state.customFoods]].forEach(([kind,items])=>(items||[]).forEach(item=>{if(item&&item.id){const value=kind+':'+item.id;if(!tombstones.includes(value))tombstones.push(value);}}));
 state=Object.assign(JSON.parse(JSON.stringify(cleanState)),{deletedRecordIds:tombstones,resetAt:Date.now(),dailyHistory:{},game:{xp:0,total:0,waterWon:'',claimed:{},badges:[],day:dayKey()}});
 closeAccountDialogs();saveState();showToast('Your Gymplified progress was reset');
}



// ===== v3: gamification, goals, accessibility =====
const $ = id => document.getElementById(id);
function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function jsArg(value){return esc(JSON.stringify(String(value==null?'':value)));}

function safeRecordId(value,fallback){const id=String(value==null?'':value).trim();return /^[A-Za-z0-9_-]{1,120}$/.test(id)?id:fallback;}
function newRecordId(prefix){try{if(window.crypto&&crypto.randomUUID)return prefix+'-'+crypto.randomUUID();}catch(e){}return prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10);}
function safeStateText(value,fallback,max){return String(value==null?fallback:value).replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max)||fallback;}
function safeStateNumber(value,min,max,fallback=0){const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback;}
function safeStateDay(value,fallback){const s=String(value||'');if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return fallback;const d=new Date(s+'T12:00:00');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===s?s:fallback;}
// A signed-in account with no cloud copy yet starts from a fully shaped blank state (game, sessions, settings…), never the bare template.
function blankAccountState(){return sanitizeStateSnapshot(JSON.parse(JSON.stringify(cleanState)));}
function sanitizeStateSnapshot(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Backup must contain a JSON object.');
 const today=dayKey(),rawGame=raw.game&&typeof raw.game==='object'?raw.game:{},gameDay=safeStateDay(rawGame.day,today);
 const list=(v,max)=>Array.isArray(v)?v.slice(0,max):[];
 const cleanSets=(source,count,weight,reps)=>{
  const a=list(source,50);
  if(!a.length){const n=Math.max(1,Math.min(20,Math.round(Number(count)||3)));return Array.from({length:n},(_,i)=>({id:'legacy-set-'+i,kg:safeStateNumber(weight,0,1000,0),reps:safeStateNumber(reps,1,1000,10),done:false}));}
  return a.filter(x=>x&&typeof x==='object'&&!Array.isArray(x)).map((x,i)=>({id:safeRecordId(x.id,'legacy-set-'+i),kg:safeStateNumber(x.kg,0,1000,0),reps:safeStateNumber(x.reps,0,1000,10),done:!!x.done,type:SET_TYPES.includes(x.type)?x.type:'normal',auto:!!x.auto&&!x.done,duration:safeStateNumber(x.duration,0,86400,0),distance:safeStateNumber(x.distance,0,1000,0),notes:safeStateText(x.notes,'',500),order:safeStateNumber(x.order,0,1000,i+1)}));
 };
 const cleanPlanTarget=p=>p&&typeof p==='object'&&!Array.isArray(p)?{sets:Math.round(safeStateNumber(p.sets,1,20,3)),reps:Math.round(safeStateNumber(p.reps,1,100,8)),kg:safeStateNumber(p.kg,0,1000,0),name:safeStateText(p.name,'',50),day:safeStateText(p.day,'',30)}:null;
 const cleanPlanOutcome=p=>p&&typeof p==='object'&&!Array.isArray(p)?{planned:Math.round(safeStateNumber(p.planned,0,100,0)),completed:Math.round(safeStateNumber(p.completed,0,100,0)),name:safeStateText(p.name,'',50),day:safeStateText(p.day,'',30)}:null;
 const cleanWorkout=(x,i,day)=>{if(!x||typeof x!=='object'||Array.isArray(x))return null;const name=safeStateText(x.name||x.exercise,'Exercise',80);return{id:safeRecordId(x.id,'legacy-workout-'+i+'-'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,24)),name,muscle:safeStateText(x.muscle,'',40),day:safeStateDay(x.day,day),setList:cleanSets(x.setList,x.sets,x.weight,x.reps),xp:safeStateNumber(x.xp,0,1,0),plan:cleanPlanTarget(x.plan)};};
 const cleanFood=(x,i,day)=>{if(!x||typeof x!=='object'||Array.isArray(x))return null;const meals=['Breakfast','Lunch','Dinner','Snacks'];return{id:safeRecordId(x.id,'legacy-food-'+i),name:safeStateText(x.name,'Food',100),meal:meals.includes(x.meal)?x.meal:'Snacks',day:safeStateDay(x.day,day),grams:safeStateNumber(x.grams,0,10000,0),portion:safeStateText(x.portion,'',60),cal:safeStateNumber(x.cal,0,100000,0),protein:safeStateNumber(x.protein,0,10000,0),carbs:safeStateNumber(x.carbs,0,10000,0),fat:safeStateNumber(x.fat,0,10000,0),createdAt:safeStateNumber(x.createdAt,0,Number.MAX_SAFE_INTEGER,Date.now()),xp:safeStateNumber(x.xp,0,1,0)};};
 const cleanWater=(x,i,day)=>{if(typeof x==='number')return{id:'legacy-water-'+i,amount:safeStateNumber(x,0,10,0),day,createdAt:0};if(!x||typeof x!=='object'||Array.isArray(x))return null;return{id:safeRecordId(x.id,'legacy-water-'+i),amount:safeStateNumber(x.amount,0,10,0),day:safeStateDay(x.day,day),createdAt:safeStateNumber(x.createdAt,0,Number.MAX_SAFE_INTEGER,0)};};
 const cleanPrList=v=>list(v,100).filter(p=>p&&typeof p==='object'&&!Array.isArray(p)).map(p=>({name:safeStateText(p.name,'Exercise',80),kg:safeStateNumber(p.kg,0,1000,0),reps:safeStateNumber(p.reps,0,1000,0)}));
 const cleanSession=(x,i)=>{if(!x||typeof x!=='object'||Array.isArray(x))return null;const exercises=list(x.exercises,100).map((ex,j)=>{if(!ex||typeof ex!=='object'||Array.isArray(ex))return null;const sets=list(ex.sets,50).filter(s=>s&&typeof s==='object'&&!Array.isArray(s)).map((s,k)=>({id:safeRecordId(s.id,'legacy-sset-'+j+'-'+k),kg:safeStateNumber(s.kg??s.weight,0,1000,0),reps:safeStateNumber(s.reps,0,1000,0),type:SET_TYPES.includes(s.type)?s.type:'normal',duration:safeStateNumber(s.duration,0,86400,0),distance:safeStateNumber(s.distance,0,1000,0),notes:safeStateText(s.notes,'',500),order:safeStateNumber(s.order,0,1000,k+1)}));return{id:safeRecordId(ex.id,'legacy-sex-'+j),name:safeStateText(ex.name||ex.exercise,'Exercise',80),muscle:safeStateText(ex.muscle,'',40),notes:safeStateText(ex.notes,'',500),sets};}).filter(Boolean);const date=safeStateDay(x.date,today);return{id:safeRecordId(x.id,'legacy-session-'+i+'-'+date),date,name:safeStateText(x.name,'Workout',100),sourceWorkoutId:safeStateText(x.sourceWorkoutId,'',120),notes:safeStateText(x.notes,'',1000),startedAt:safeStateText(x.startedAt,'',40),finishedAt:safeStateText(x.finishedAt,'',40),mins:safeStateNumber(x.mins,0,1440,0),vol:safeStateNumber(x.vol,0,100000000,0),sets:safeStateNumber(x.sets,0,10000,0),reps:safeStateNumber(x.reps,0,100000,0),ex:safeStateNumber(x.ex,0,100,exercises.length),names:list(x.names,100).map(n=>safeStateText(n,'Exercise',80)),prs:cleanPrList(x.prs),xp:safeStateNumber(x.xp,0,100000,0),plan:cleanPlanOutcome(x.plan),exercises};};
 const workouts=list(raw.workouts,1000).map((x,i)=>cleanWorkout(x,i,gameDay)).filter(Boolean);
 const foods=list(raw.foods,5000).map((x,i)=>cleanFood(x,i,gameDay)).filter(Boolean);
 const prs=list(raw.prs,2000).filter(x=>x&&typeof x==='object'&&!Array.isArray(x)).map((x,i)=>({id:safeRecordId(x.id,'legacy-pr-'+i),name:safeStateText(x.name,'Exercise',80),weight:safeStateNumber(x.weight,0,2000,0),reps:safeStateNumber(x.reps,1,1000,1),date:safeStateDay(x.date,today),xp:safeStateNumber(x.xp,0,1,0)}));
 const customEx=list(raw.customEx,500).filter(x=>x&&typeof x==='object'&&!Array.isArray(x)).map((x,i)=>({id:safeRecordId(x.id,'custom-ex-'+i),name:safeStateText(x.name||x.title,'Custom exercise',80),eq:safeStateText(x.eq||x.equipment,'Other',40),pm:safeStateText(x.pm||x.muscle,'chest',40),sec:list(x.sec,12).map(v=>safeStateText(v,'',40)),type:['weights','bodyweight','timed'].includes(x.type)?x.type:'weights',custom:true}));
 const customFoods=list(raw.customFoods,500).filter(x=>x&&typeof x==='object'&&!Array.isArray(x)).map((x,i)=>({id:safeRecordId(x.id,'custom-food-'+i),name:safeStateText(x.name,'Custom food',80),cal:safeStateNumber(x.cal,0,1000,0),protein:safeStateNumber(x.protein,0,100,0),carbs:safeStateNumber(x.carbs,0,100,0),fat:safeStateNumber(x.fat,0,100,0),kind:x.kind==='recipe'?'recipe':'food',barcode:/^\d{8,14}$/.test(String(x.barcode||''))?String(x.barcode):'',servingG:safeStateNumber(x.servingG,0,3000,0),servingLabel:safeStateText(x.servingLabel,'',40)}));
 const routines=list(raw.routines,100).filter(x=>x&&typeof x==='object'&&!Array.isArray(x)).map((x,i)=>({id:safeRecordId(x.id,'legacy-routine-'+i),name:safeStateText(x.name,'Saved routine',80),createdAt:safeStateText(x.createdAt,'',40),exercises:list(x.exercises,100).filter(w=>w&&typeof w==='object'&&!Array.isArray(w)).map((w,j)=>({id:safeRecordId(w.id,'routine-ex-'+i+'-'+j),name:safeStateText(w.name||w.exercise,'Exercise',80),muscle:safeStateText(w.muscle,'',40),setList:cleanSets(w.setList,w.sets,w.weight,w.reps)}))}));
 const rawWater=list(raw.waterEntries,10000),legacyWater=list(raw.waterLog,10000);
 const waterEntries=(rawWater.length?rawWater:legacyWater).map((x,i)=>cleanWater(x,i,gameDay)).filter(Boolean);
 if(!waterEntries.length&&safeStateNumber(raw.water,0,20,0)>0)waterEntries.push({id:'legacy-water-total-'+gameDay,amount:safeStateNumber(raw.water,0,20,0),day:gameDay,createdAt:0});
 const history={},dailyHistory={};
 if(raw.history&&typeof raw.history==='object'&&!Array.isArray(raw.history))Object.keys(raw.history).filter(k=>safeStateDay(k,'')===k).sort().slice(-365).forEach(k=>{const x=raw.history[k]||{};history[k]={cal:safeStateNumber(x.cal,0,100000,0),water:safeStateNumber(x.water,0,20,0),done:safeStateNumber(x.done,0,1000,0)};});
 if(raw.dailyHistory&&typeof raw.dailyHistory==='object'&&!Array.isArray(raw.dailyHistory))Object.keys(raw.dailyHistory).filter(k=>safeStateDay(k,'')===k).sort().slice(-365).forEach(k=>{const x=raw.dailyHistory[k]||{};dailyHistory[k]={cal:safeStateNumber(x.cal,0,100000,0),protein:safeStateNumber(x.protein,0,10000,0),carbs:safeStateNumber(x.carbs,0,10000,0),fat:safeStateNumber(x.fat,0,10000,0),water:safeStateNumber(x.water,0,20,0),workouts:list(x.workouts,1000).map((w,i)=>cleanWorkout(w,i,k)).filter(Boolean),foods:list(x.foods,5000).map((f,i)=>cleanFood(f,i,k)).filter(Boolean),waterEntries:list(x.waterEntries,10000).map((w,i)=>cleanWater(w,i,k)).filter(Boolean)};});
 const settings=raw.settings&&typeof raw.settings==='object'?raw.settings:{};
 const game={xp:safeStateNumber(rawGame.xp,0,1000000000,0),total:safeStateNumber(rawGame.total,0,10000000,0),waterWon:safeStateText(rawGame.waterWon,'',10),claimed:{},badges:[...new Set(list(rawGame.badges,200).map(x=>safeStateText(x,'',40)).filter(Boolean))].slice(0,100),day:gameDay,streakFreezes:Math.round(safeStateNumber(rawGame.streakFreezes,0,STREAK_FREEZE_MAX,0)),frozenDays:[...new Set(list(rawGame.frozenDays,2000).filter(k=>safeStateDay(k,'')===k))].sort().slice(-90),freezeTier:Math.round(safeStateNumber(rawGame.freezeTier,0,10000,0)),bestDaily:Math.round(safeStateNumber(rawGame.bestDaily,0,100000,0)),weekXp:rawGame.weekXp&&typeof rawGame.weekXp==='object'&&safeStateDay(rawGame.weekXp.week,'')?{week:rawGame.weekXp.week,xp:Math.round(safeStateNumber(rawGame.weekXp.xp,0,100000,0))}:null,streakNow:rawGame.streakNow&&typeof rawGame.streakNow==='object'&&safeStateDay(rawGame.streakNow.day,'')?{day:rawGame.streakNow.day,n:Math.round(safeStateNumber(rawGame.streakNow.n,0,100000,0))}:null,daily:rawGame.daily&&typeof rawGame.daily==='object'&&safeStateDay(rawGame.daily.day,'')===today?{day:today,ex:Math.round(safeStateNumber(rawGame.daily.ex,0,1000,0)),meal:Math.round(safeStateNumber(rawGame.daily.meal,0,1000,0)),pr:Math.round(safeStateNumber(rawGame.daily.pr,0,1000,0)),session:Math.round(safeStateNumber(rawGame.daily.session,0,1000,0))}:{day:today,ex:0,meal:0,pr:0,session:0}};
 // Quest claims are date-stamped (d_YYYY-MM-DD_id / w_YYYY-MM-DD_id). Old ones are dropped before the size cap so current claims always survive.
 const claimCutoff=(()=>{const d=new Date(today+'T12:00:00');d.setDate(d.getDate()-8);return dayKey(d);})();
 if(rawGame.claimed&&typeof rawGame.claimed==='object'&&!Array.isArray(rawGame.claimed))Object.keys(rawGame.claimed).filter(k=>/^[a-zA-Z0-9_-]{1,60}$/.test(k)).filter(k=>{const m=/^[dw]_(\d{4}-\d{2}-\d{2})_/.exec(k);return !m||m[1]>=claimCutoff;}).slice(0,200).forEach(k=>{game.claimed[k]=!!rawGame.claimed[k];});
 const state=Object.assign(JSON.parse(JSON.stringify(cleanState)),{cal:safeStateNumber(raw.cal,0,100000,0),calTarget:safeStateNumber(raw.calTarget,500,10000,2500),protein:safeStateNumber(raw.protein,0,10000,0),carbs:safeStateNumber(raw.carbs,0,10000,0),fat:safeStateNumber(raw.fat,0,10000,0),nutritionTargets:{protein:safeStateNumber(raw.nutritionTargets&&raw.nutritionTargets.protein,0,1000,0),carbs:safeStateNumber(raw.nutritionTargets&&raw.nutritionTargets.carbs,0,2000,0),fat:safeStateNumber(raw.nutritionTargets&&raw.nutritionTargets.fat,0,1000,0)},water:safeStateNumber(raw.water,0,20,0),waterEntries,waterLog:waterEntries.filter(x=>x.day===today).map(x=>x.amount),workouts,foods,prs,sessions:list(raw.sessions,5000).map(cleanSession).filter(Boolean),customEx,customFoods,routines,lastSession:list(raw.lastSession,1000).map((x,i)=>cleanWorkout(x,i,gameDay)).filter(Boolean),game,history,dailyHistory,presets:[...new Set(list(raw.presets,10).map(x=>Math.round(safeStateNumber(x,1,WATER_ENTRY_MAX_ML,250))).filter(x=>x>0))].slice(0,WATER_PRESET_MAX),lastWaterMl:Math.round(safeStateNumber(raw.lastWaterMl,0,WATER_ENTRY_MAX_ML,0)),weeklyGoal:safeStateNumber(raw.weeklyGoal,1,14,3),waterGoal:safeStateNumber(raw.waterGoal,WATER_GOAL_MIN_L,WATER_GOAL_MAX_L,2.5),lastKg:{},session:raw.session&&typeof raw.session==='object'?{start:safeStateNumber(raw.session.start,0,Number.MAX_SAFE_INTEGER,Date.now()),xpStart:safeStateNumber(raw.session.xpStart,0,1000000000,safeStateNumber(rawGame.xp,0,1000000000,0))}:null,lastSummary:raw.lastSummary&&typeof raw.lastSummary==='object'?{id:safeStateText(raw.lastSummary.id,'',120),plan:cleanPlanOutcome(raw.lastSummary.plan),prs:cleanPrList(raw.lastSummary.prs),muscles:list(raw.lastSummary.muscles,20).map(n=>safeStateText(n,'',40)).filter(Boolean),xp:safeStateNumber(raw.lastSummary.xp,0,100000,0),date:safeStateDay(raw.lastSummary.date,today),mins:safeStateNumber(raw.lastSummary.mins,0,1440,0),vol:safeStateNumber(raw.lastSummary.vol,0,100000000,0),sets:safeStateNumber(raw.lastSummary.sets,0,10000,0),reps:safeStateNumber(raw.lastSummary.reps,0,100000,0),ex:safeStateNumber(raw.lastSummary.ex,0,100,0),names:list(raw.lastSummary.names,100).map(n=>safeStateText(n,'Exercise',80))}:null,recent:list(raw.recent,20).filter(x=>x&&typeof x==='object').map(x=>({name:safeStateText(x.name,'Food',100),cal:safeStateNumber(x.cal,0,100000,0),protein:safeStateNumber(x.protein,0,10000,0),carbs:safeStateNumber(x.carbs,0,10000,0),fat:safeStateNumber(x.fat,0,10000,0),grams:safeStateNumber(x.grams,0,10000,0),portion:safeStateText(x.portion,'',60)})),friends:list(raw.friends,100).map(x=>safeStateText(x,'',100)).filter(Boolean),lbOn:!!raw.lbOn,accountOwnerId:safeStateText(raw.accountOwnerId,'',80),resetAt:safeStateNumber(raw.resetAt,0,Number.MAX_SAFE_INTEGER,0),deletedRecordIds:list(raw.deletedRecordIds,10000).map(x=>safeStateText(x,'',180)).filter(x=>/^(workouts|foods|prs|sessions|routines|customEx|customFoods|waterEntries):[A-Za-z0-9_-]{1,120}$/.test(x))});
 // Favourite exercises are an id -> 0/1 map (not an array) so un-favouriting survives the server-side merge.
 state.exFav={};
 if(raw.exFav&&typeof raw.exFav==='object'&&!Array.isArray(raw.exFav))Object.keys(raw.exFav).filter(k=>/^[A-Za-z0-9_-]{1,120}$/.test(k)).slice(0,400).forEach(k=>{state.exFav[k]=raw.exFav[k]?1:0;});
 const rawDeluxe=raw.deluxe&&typeof raw.deluxe==='object'?raw.deluxe:{};
 state.deluxe={
  plans:list(rawDeluxe.plans,100).filter(p=>p&&typeof p==='object'&&!Array.isArray(p)).map((p,i)=>({
   id:safeRecordId(p.id,'deluxe-plan-'+i),name:safeStateText(p.name,'Training plan',50),
   createdAt:safeStateText(p.createdAt,'',40),
   days:list(p.days,7).filter(d=>d&&typeof d==='object').map((d,j)=>({
    day:safeStateText(d.day,'Day '+(j+1),30),
    exercises:list(d.exercises,50).filter(e=>e&&typeof e==='object').map((e,k)=>({
     name:safeStateText(e.name,'Exercise',80),sets:safeStateNumber(e.sets,1,20,3),
     reps:safeStateNumber(e.reps,1,100,8),kg:safeStateNumber(e.kg,0,1000,0)
    }))
   }))
  })),
  profileFlair:rawDeluxe.profileFlair!==false,
  accent:['gold','violet','blue','emerald','crimson','amber'].includes(rawDeluxe.accent)?rawDeluxe.accent:'gold',
  theme:rawDeluxe.theme==='light'?'light':'dark'
 };
 if(settings.theme==='light'||settings.theme==='dark')state.settings.theme=settings.theme;
 if(['gold','blue','emerald','slate','crimson','amber','violet'].includes(settings.color))state.settings.color=settings.color;
 if(['sm','md','lg','xl'].includes(settings.scale))state.settings.scale=settings.scale;
 if(['default','accessible'].includes(settings.font))state.settings.font=settings.font;
 if(['normal','high'].includes(settings.contrast))state.settings.contrast=settings.contrast;
 if(['normal','reduced'].includes(settings.motion))state.settings.motion=settings.motion;
 if(['normal','wide'].includes(settings.spacing))state.settings.spacing=settings.spacing;
 if(['ml','floz'].includes(settings.waterUnit))state.settings.waterUnit=settings.waterUnit;
 if(settings.restSeconds!=null)state.settings.restSeconds=Math.round(safeStateNumber(settings.restSeconds,0,REST_SECONDS_MAX,REST_DEFAULT_SECONDS));
 if(typeof settings.restBeep==='boolean')state.settings.restBeep=settings.restBeep;
 if(typeof settings.restNotify==='boolean')state.settings.restNotify=settings.restNotify;
 if(['kg','lb'].includes(settings.weightUnit))state.settings.weightUnit=settings.weightUnit;
 if(['km','mi'].includes(settings.distanceUnit))state.settings.distanceUnit=settings.distanceUnit;
 if(['cm','ftin'].includes(settings.heightUnit))state.settings.heightUnit=settings.heightUnit;
 if(['mon','sun'].includes(settings.weekStart))state.settings.weekStart=settings.weekStart;
 const rawProfile=raw.profile&&typeof raw.profile==='object'&&!Array.isArray(raw.profile)?raw.profile:{};
 const profileRange=(value,min,max)=>{const n=Number(value);return Number.isFinite(n)&&n>=min&&n<=max?n:0;};
 state.profile={heightCm:profileRange(rawProfile.heightCm,50,260),weightKg:profileRange(rawProfile.weightKg,20,400),age:Math.round(profileRange(rawProfile.age,13,100)),sex:['male','female'].includes(rawProfile.sex)?rawProfile.sex:'',goal:['cut','maintain','bulk'].includes(rawProfile.goal)?rawProfile.goal:'',activity:['sedentary','light','moderate','active','very'].includes(rawProfile.activity)?rawProfile.activity:''};
 state.onboarded=!!raw.onboarded;
 const rawPrivacy=raw.privacy&&typeof raw.privacy==='object'&&!Array.isArray(raw.privacy)?raw.privacy:{};
 state.privacy={};Object.keys(DEFAULT_PRIVACY).forEach(k=>{state.privacy[k]=rawPrivacy[k]!==false;});
 if(foods.some(x=>x.day===today)){const a=foods.filter(x=>x.day===today);state.cal=a.reduce((n,x)=>n+x.cal,0);state.protein=a.reduce((n,x)=>n+x.protein,0);state.carbs=a.reduce((n,x)=>n+x.carbs,0);state.fat=a.reduce((n,x)=>n+x.fat,0);}
 if(waterEntries.some(x=>x.day===today))state.water=waterEntries.filter(x=>x.day===today).reduce((n,x)=>n+x.amount,0);
 return state;
}
function validateBackupData(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||!Array.isArray(raw.workouts))throw new Error('This is not a Gymplified backup.');
 const fields=['workouts','foods','prs','sessions','routines','customEx','customFoods','lastSession','waterLog','waterEntries'];
 fields.forEach(k=>{if(raw[k]!=null&&!Array.isArray(raw[k]))throw new Error('Invalid backup field: '+k);});
 if(JSON.stringify(raw).length>10*1024*1024)throw new Error('Backup is larger than 10 MB.');
  if(Array.isArray(raw.sessions)&&raw.sessions.length>5000)throw new Error('This backup contains more than 5,000 workout sessions. Export or split the backup before restoring it.');
 const check=(items,key,label)=>{(items||[]).forEach((x,i)=>{if(!x||typeof x!=='object'||Array.isArray(x))throw new Error('Invalid '+label+' record '+(i+1)+'.');if(key&&x[key]!=null&&!Array.isArray(x[key]))throw new Error('Invalid '+label+' '+key+' list.');});};
 check(raw.workouts,'setList','workout');check(raw.sessions,'exercises','session');check(raw.routines,'exercises','routine');
 (raw.workouts||[]).forEach((w,i)=>(w.setList||[]).forEach((s,j)=>{if(!s||typeof s!=='object'||!Number.isFinite(Number(s.kg))||!Number.isFinite(Number(s.reps)))throw new Error('Invalid set '+(j+1)+' in workout '+(i+1)+'.');}));
 return sanitizeStateSnapshot(raw);
}

function dayKey(d=new Date()){return new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);}
function bootState(){
  let o=null; try{const stored=localStorage.getItem(STORAGE_KEY);if(stored)o=sanitizeStateSnapshot(JSON.parse(stored));}catch(e){console.warn('Gymplified found invalid local data and loaded a safe empty state:',e);}
  const b=JSON.parse(JSON.stringify(cleanState));
  const t=Object.assign(b,o&&typeof o==='object'?o:{});
  t.settings=Object.assign(b.settings,(o&&o.settings)||{});
  ['workouts','foods','prs','waterLog','recent','lastSession','customFoods','routines'].forEach(k=>{if(!Array.isArray(t[k]))t[k]=[];});
  // Migrate the former default blue accent to the new Gymplified gold identity.
  if(!o||!o.settings||!o.settings.color||o.settings.color==="blue")t.settings.color="gold";
  t.deluxe=Object.assign({plans:[],profileFlair:true,accent:'gold',theme:'dark'},t.deluxe||{});
  t.deluxe.plans=Array.isArray(t.deluxe.plans)?t.deluxe.plans:[];
  t.nutritionTargets=Object.assign({protein:0,carbs:0,fat:0},t.nutritionTargets||{});
  t.calTarget=t.calTarget>0?t.calTarget:2500; t.waterGoal=t.waterGoal>0?t.waterGoal:2.5;
  t.presets=Array.isArray(t.presets)&&t.presets.length?t.presets:DEFAULT_WATER_PRESETS.slice();t.lastWaterMl=Number(t.lastWaterMl)||0;
  t.history=t.history||{};t.dailyHistory=t.dailyHistory||{};t.exFav=t.exFav&&typeof t.exFav==='object'&&!Array.isArray(t.exFav)?t.exFav:{};t.profile=Object.assign({},EMPTY_PROFILE,t.profile&&typeof t.profile==='object'?t.profile:{});t.onboarded=!!t.onboarded;t.privacy=Object.assign({},DEFAULT_PRIVACY,t.privacy&&typeof t.privacy==='object'?t.privacy:{});
  t.game=Object.assign({xp:0,total:0,waterWon:'',claimed:{},badges:[],day:'',streakFreezes:0,frozenDays:[],freezeTier:0,bestDaily:0},t.game||{}); delete t.game.streak;delete t.game.best;delete t.game.lastDay;delete t.game.freezes;
  const d=dayKey();
  if(t.game.day&&t.game.day!==d){
    const oldDay=t.game.day,previous=t.dailyHistory[oldDay]||{workouts:[],foods:[],waterEntries:[]};
    const mergeArchive=(a,b)=>{const map=new Map();(a||[]).concat(b||[]).forEach((x,i)=>{const id=x&&x.id?x.id:'legacy-'+i;map.set(id,Object.assign({},map.get(id)||{},x));});return Array.from(map.values());};
    t.dailyHistory[oldDay]={cal:t.cal,protein:t.protein,carbs:t.carbs,fat:t.fat,water:t.water,workouts:mergeArchive(previous.workouts,t.workouts),foods:mergeArchive(previous.foods,t.foods),waterEntries:mergeArchive(previous.waterEntries,t.waterEntries)};
    t.history[oldDay]={cal:t.cal,water:t.water,done:t.workouts.filter(w=>w.done).length};
    Object.keys(t.history).sort().slice(0,-365).forEach(k=>delete t.history[k]);
    Object.keys(t.dailyHistory).sort().slice(0,-365).forEach(k=>delete t.dailyHistory[k]);
    if(t.workouts.length)t.lastSession=t.workouts.map(w=>Object.assign({},w,{done:false,xp:0}));
    t.cal=t.protein=t.carbs=t.fat=0;t.water=0;t.workouts=[];t.foods=[];t.waterLog=[];t.waterEntries=[];t.game.claimed={};t._rolloverPending=true;
  }
  t.game.day=d;t.workouts.forEach(ensureSets);t.lastSession.forEach(ensureSets);["sessions","customEx"].forEach(k=>{if(!Array.isArray(t[k]))t[k]=[];});t.weeklyGoal=t.weeklyGoal>0?t.weeklyGoal:3;t.lastKg=t.lastKg||{};t.session=t.session||null;t.lastSummary=t.lastSummary||null;t.friends=Array.isArray(t.friends)?t.friends.filter(x=>typeof x==="string").slice(0,100):[];t.lbOn=!!t.lbOn;return t;
}
// ===== Batch 4: gamification — daily streak, freezes, quests, badges, levels, XP log =====
const lvl=x=>Math.floor(Math.sqrt(x/50))+1;
const LEVEL_TITLES=[[1,'Rookie'],[3,'Regular'],[5,'Lifter'],[8,'Athlete'],[12,'Veteran'],[16,'Elite'],[20,'Champion'],[30,'Legend']];
function levelTitle(level){let title=LEVEL_TITLES[0][1];LEVEL_TITLES.forEach(([from,name])=>{if(level>=from)title=name;});return title;}
const dBetween=(a,b)=>Math.round((new Date(b)-new Date(a))/864e5);
function shiftDay(key,delta){const d=new Date(key+'T12:00:00');d.setDate(d.getDate()+delta);return dayKey(d);}
function normalizeGame(g){
 if(!g.claimed||typeof g.claimed!=='object')g.claimed={};if(!Array.isArray(g.badges))g.badges=[];
 if(!Array.isArray(g.frozenDays))g.frozenDays=[];g.streakFreezes=Math.max(0,Math.min(STREAK_FREEZE_MAX,Math.round(Number(g.streakFreezes)||0)));g.freezeTier=Math.max(0,Math.round(Number(g.freezeTier)||0));g.bestDaily=Math.max(0,Math.round(Number(g.bestDaily)||0));
 const today=dayKey();if(!g.daily||g.daily.day!==today)g.daily={day:today,ex:0,meal:0,pr:0,session:0};
 return g;
}

// --- D1/D3: activity days and streaks ---
// A day counts when there was a completed exercise or workout, a logged meal, or the water goal was reached.
function sessionDaySet(){return new Set((state.sessions||[]).map(s=>s&&s.date).filter(Boolean));}
function todayIsActive(){const today=dayKey();return state.workouts.some(w=>w.done||(w.setList||[]).some(x=>x.done))||state.foods.length>0||(state.water>0&&state.water>=state.waterGoal)||(state.sessions||[]).some(s=>s.date===today);}
const isActive=todayIsActive;
function historyDayIsActive(key,sessionDays){const h=state.history&&state.history[key];return !!(h&&(h.done>0||h.cal>0||(h.water>0&&h.water>=state.waterGoal)))||(sessionDays||sessionDaySet()).has(key);}
// Pure: counts active days back from today; frozen days bridge a gap without adding to the count.
function computeDailyStreak(isActiveDay,isFrozenDay,todayKey,todayActive){
 let streak=todayActive?1:0,day=shiftDay(todayKey,-1);
 for(let guard=0;guard<3700;guard++){if(isActiveDay(day))streak++;else if(!isFrozenDay(day))break;day=shiftDay(day,-1);}
 return streak;
}
// Pure: which missed days (at most the freezes owned) should be frozen to keep a live streak. [] when nothing to do.
function planFreezeUse(isActiveDay,isFrozenDay,todayKey,freezes){
 const gap=[];let day=shiftDay(todayKey,-1);
 while(gap.length<=STREAK_FREEZE_MAX&&!isActiveDay(day)&&!isFrozenDay(day)){gap.push(day);day=shiftDay(day,-1);}
 if(!gap.length||gap.length>freezes)return [];
 return computeDailyStreak(isActiveDay,isFrozenDay,shiftDay(day,1),false)>0?gap:[];
}
function dailyStreak(){const days=sessionDaySet(),frozen=new Set(state.game.frozenDays||[]);return computeDailyStreak(k=>historyDayIsActive(k,days),k=>frozen.has(k),dayKey(),todayIsActive());}
function waterStreak(){const today=dayKey(),hit=k=>{const h=state.history&&state.history[k];return !!(h&&h.water>0&&h.water>=state.waterGoal);};return computeDailyStreak(hit,()=>false,today,state.water>0&&state.water>=state.waterGoal);}
function settleStreak(){
 const g=normalizeGame(state.game),today=dayKey(),days=sessionDaySet(),active=k=>historyDayIsActive(k,days),frozen=k=>g.frozenDays.includes(k);
 const use=planFreezeUse(active,frozen,today,g.streakFreezes);
 if(use.length){g.streakFreezes-=use.length;g.frozenDays=g.frozenDays.concat(use).sort().slice(-90);showToast('❄ Streak freeze used for '+use.length+' missed day'+(use.length===1?'':'s'));}
 const streak=dailyStreak(),tier=Math.floor(streak/STREAK_FREEZE_EVERY);
 if(streak>g.bestDaily)g.bestDaily=streak;
 // The friends leaderboard reads this; the server treats it as lapsed after two days without an update.
 if(!g.streakNow||g.streakNow.day!==today||g.streakNow.n!==streak)g.streakNow={day:today,n:streak};
 if(tier<g.freezeTier)g.freezeTier=tier;
 else if(tier>g.freezeTier){g.freezeTier=tier;if(g.streakFreezes<STREAK_FREEZE_MAX){g.streakFreezes++;celebrate({icon:'❄',title:'Streak freeze earned',text:'A '+streak+'-day streak earned you a freeze. It is used automatically if you miss a day. You can hold '+STREAK_FREEZE_MAX+'.'});}}
 return streak;
}

// --- D8/D9: XP, daily limits and a transparent XP log (kept on this device) ---
const XP_DAILY_CAPS={ex:15,meal:8,pr:5,session:3};
function xpAllowance(kind){const g=normalizeGame(state.game);if(g.daily[kind]>=XP_DAILY_CAPS[kind])return false;g.daily[kind]=(g.daily[kind]||0)+1;return true;}
function xpLogKey(){return 'gymplified_xp_log_v1:'+(state.accountOwnerId||'local');}
function readXpLog(){try{const a=JSON.parse(localStorage.getItem(xpLogKey())||'[]');return Array.isArray(a)?a.filter(x=>x&&Number.isFinite(Number(x.t))&&Number.isFinite(Number(x.n))).slice(0,XP_LOG_MAX):[];}catch(e){return [];}}
function xpLogAdd(n,why){try{const log=readXpLog();log.unshift({t:Date.now(),n:Number(n)||0,why:String(why||'').slice(0,80)});localStorage.setItem(xpLogKey(),JSON.stringify(log.slice(0,XP_LOG_MAX)));}catch(e){}}
function gainXP(n,why){
 const g=state.game,before=lvl(g.xp);g.xp+=n;xpLogAdd(n,why);
 // XP earned this leaderboard week (Monday start), read by the friends leaderboard.
 const week=leaderboardWeekKey();if(!g.weekXp||g.weekXp.week!==week)g.weekXp={week,xp:0};g.weekXp.xp=Math.min(100000,g.weekXp.xp+n);showToast('+'+n+' XP · '+why);
 const after=lvl(g.xp);if(after>before){celebrate({icon:'🎉',title:'Level '+after+' — '+levelTitle(after),text:'You reached level '+after+'. '+(50*after*after-g.xp)+' XP to level '+(after+1)+'.'});confetti();}
}

// --- D5: celebration dialog (native <dialog>: focus is trapped, Esc closes, focus returns) ---
let celebrationQueue=[];
function celebrate(item){celebrationQueue.push(item);if(celebrationQueue.length<=2)showToast(item.icon+' '+item.title);scheduleCelebration();}
let celebrationTimer=null;
function scheduleCelebration(){clearTimeout(celebrationTimer);celebrationTimer=setTimeout(showCelebration,350);}
function showCelebration(){
 const dialog=$('celebrationDialog');
 // Never interrupt a workout in progress or another open dialog: the queue is shown afterwards.
 if(!dialog||!celebrationQueue.length||state.session||dialog.open||document.querySelector('dialog[open]')||typeof dialog.showModal!=='function')return;
 const items=celebrationQueue.splice(0,celebrationQueue.length),one=items.length===1;
 $('celebrationIcon').textContent=one?items[0].icon:'🎉';
 $('celebrationTitle').textContent=one?items[0].title:items.length+' new achievements';
 $('celebrationText').textContent=one?items[0].text:'';
 $('celebrationList').innerHTML=one?'':items.map(x=>'<li><span aria-hidden="true">'+esc(x.icon)+'</span> <strong>'+esc(x.title)+'</strong><br><span class="sub">'+esc(x.text)+'</span></li>').join('');
 try{dialog.showModal();}catch(e){return;}
 confetti();
}

// --- D7: daily and weekly quests ---
const QUESTS=[
 {id:'ex3',t:'Complete 3 exercises',n:3,v:()=>state.workouts.filter(w=>w.done).length},
 {id:'h2o',t:'Reach your water goal',n:1,v:()=>state.water>=state.waterGoal?1:0},
 {id:'meal2',t:'Log 2 meals',n:2,v:()=>state.foods.length}];
const DAILY_QUEST_XP=25,WEEKLY_QUEST_XP=60;
function weekStats(){
 const today=dayKey(),start=wkKey(new Date()),days=sessionDaySet(),stats={trainDays:0,sets:0,waterDays:0,foodDays:0,proteinDays:0,activeDays:0,prs:0};
 const proteinTarget=Number(state.nutritionTargets&&state.nutritionTargets.protein)||0;
 for(let key=start;key<=today;key=shiftDay(key,1)){
  const live=key===today,h=live?{cal:state.cal,water:state.water}:(state.history&&state.history[key])||{},protein=live?state.protein:Number(((state.dailyHistory||{})[key]||{}).protein)||0;
  if(days.has(key))stats.trainDays++;
  if(h.water>0&&h.water>=state.waterGoal)stats.waterDays++;
  if(h.cal>0||(live&&state.foods.length>0))stats.foodDays++;
  if(proteinTarget>0&&protein>=proteinTarget)stats.proteinDays++;
  if(live?todayIsActive():historyDayIsActive(key,days))stats.activeDays++;
 }
 (state.sessions||[]).forEach(s=>{if(s.date>=start&&s.date<=today)stats.sets+=Number(s.sets)||0;});
 (state.prs||[]).forEach(p=>{if(p.date>=start&&p.date<=today)stats.prs++;});
 return stats;
}
const WEEKLY_QUEST_POOL=[
 {id:'sets',t:()=>'Complete 40 sets',n:()=>40,v:w=>w.sets},
 {id:'water4',t:()=>'Reach your water goal on 4 days',n:()=>4,v:w=>w.waterDays},
 {id:'food5',t:()=>'Log food on 5 days',n:()=>5,v:w=>w.foodDays},
 {id:'protein5',t:()=>'Hit your protein target on 5 days',n:()=>5,v:w=>w.proteinDays,when:()=>Number(state.nutritionTargets&&state.nutritionTargets.protein)>0},
 {id:'active6',t:()=>'Be active on 6 days',n:()=>6,v:w=>w.activeDays},
 {id:'pr1',t:()=>'Set a new personal record',n:()=>1,v:w=>w.prs}];
const WEEKLY_TRAIN_QUEST={id:'train',t:()=>'Train on '+state.weeklyGoal+' day'+(state.weeklyGoal===1?'':'s'),n:()=>state.weeklyGoal,v:w=>w.trainDays};
// Pure: the weekly goal quest plus two that rotate with the week.
function pickWeeklyQuests(pool,weekKey,count){
 const index=Math.floor(new Date(weekKey+'T12:00:00').getTime()/(7*864e5)),out=[];
 for(let i=0;i<pool.length&&out.length<count;i++)out.push(pool[(index+i)%pool.length]);
 return out;
}
function weeklyQuests(){return [WEEKLY_TRAIN_QUEST].concat(pickWeeklyQuests(WEEKLY_QUEST_POOL.filter(q=>!q.when||q.when()),wkKey(new Date()),2));}
function questKey(scope,id){return scope+'_'+(scope==='w'?wkKey(new Date()):dayKey())+'_'+id;}
function pruneQuestClaims(g){const today=dayKey(),week=wkKey(new Date());Object.keys(g.claimed).forEach(k=>{const m=/^([dw])_(\d{4}-\d{2}-\d{2})_/.exec(k);if(!m||(m[1]==='d'&&m[2]!==today)||(m[1]==='w'&&m[2]!==week))delete g.claimed[k];});}
function formatCountdown(ms){const mins=Math.max(0,Math.floor(ms/6e4)),d=Math.floor(mins/1440),h=Math.floor(mins%1440/60),m=mins%60;return d?d+'d '+h+'h':h?h+'h '+m+'m':m+'m';}
function msToMidnight(now=new Date()){const end=new Date(now);end.setHours(24,0,0,0);return end-now;}
function msToWeekEnd(now=new Date()){const end=new Date(now);end.setHours(0,0,0,0);end.setDate(end.getDate()-daysSinceWeekStart(end)+7);return end-now;}

// --- D6: badges with progress ---
function lifetimeVolume(){return (state.sessions||[]).reduce((n,s)=>n+(Number(s.vol)||0),0);}
function sessionsStartedBetween(fromHour,toHour){return (state.sessions||[]).filter(s=>{if(!s.startedAt)return false;const h=new Date(s.startedAt).getHours();return Number.isFinite(h)&&h>=fromHour&&h<toHour;}).length;}
function bestPrMonth(){const c={};(state.prs||[]).forEach(p=>{const k=String(p.date||'').slice(0,7);if(k)c[k]=(c[k]||0)+1;});return Math.max(0,...Object.values(c));}
function distinctExercises(){const names=new Set();(state.sessions||[]).forEach(s=>(s.exercises||[]).forEach(e=>names.add(String(e.name||'').trim().toLowerCase())));names.delete('');return names.size;}
function foodDaysLogged(){return Object.values(state.history||{}).filter(h=>h&&h.cal>0).length+(state.foods.length>0?1:0);}
const tonnes=kg=>fmtVolume(kg);
const BADGES=[
 {id:'first',icon:'🏁',name:'First exercise',desc:'Complete an exercise',target:1,value:()=>state.game.total},
 {id:'ws',icon:'🏋️',name:'First workout session',desc:'Finish a workout',target:1,value:()=>state.sessions.length},
 {id:'ws10',icon:'🔟',name:'10 workouts',desc:'Finish 10 workouts',target:10,value:()=>state.sessions.length},
 {id:'ws50',icon:'🥉',name:'50 workouts',desc:'Finish 50 workouts',target:50,value:()=>state.sessions.length},
 {id:'ws100',icon:'🥈',name:'100 workouts',desc:'Finish 100 workouts',target:100,value:()=>state.sessions.length},
 {id:'ws250',icon:'🥇',name:'250 workouts',desc:'Finish 250 workouts',target:250,value:()=>state.sessions.length},
 {id:'pr',icon:'🏆',name:'First PR',desc:'Set a personal record',target:1,value:()=>state.prs.length},
 {id:'pr10',icon:'📈',name:'10 PRs',desc:'Set 10 personal records',target:10,value:()=>state.prs.length},
 {id:'pr25',icon:'🚀',name:'25 PRs',desc:'Set 25 personal records',target:25,value:()=>state.prs.length},
 {id:'pr5m',icon:'⚡',name:'PR spree',desc:'Set 5 PRs in one calendar month',target:5,value:bestPrMonth},
 {id:'vol10',icon:'🪨',name:'10 tonnes lifted',desc:'Lift 10,000 kg in total',target:10000,value:lifetimeVolume,fmt:tonnes},
 {id:'vol50',icon:'⛰️',name:'50 tonnes lifted',desc:'Lift 50,000 kg in total',target:50000,value:lifetimeVolume,fmt:tonnes},
 {id:'vol100',icon:'🏔️',name:'100 tonnes lifted',desc:'Lift 100,000 kg in total',target:100000,value:lifetimeVolume,fmt:tonnes},
 {id:'w2',icon:'🗓',name:'2-week training streak',desc:'Hit your weekly goal 2 weeks running',target:2,value:()=>weekInfo().st},
 {id:'w4',icon:'🔥',name:'4-week training streak',desc:'Hit your weekly goal 4 weeks running',target:4,value:()=>weekInfo().st},
 {id:'w8',icon:'🏅',name:'8-week training streak',desc:'Hit your weekly goal 8 weeks running',target:8,value:()=>weekInfo().st},
 {id:'w12',icon:'👑',name:'12-week training streak',desc:'Hit your weekly goal 12 weeks running',target:12,value:()=>weekInfo().st},
 {id:'d7',icon:'📆',name:'7-day activity streak',desc:'Be active 7 days in a row',target:7,value:()=>Math.max(state.game.bestDaily||0,dailyStreak())},
 {id:'d30',icon:'🗻',name:'30-day activity streak',desc:'Be active 30 days in a row',target:30,value:()=>Math.max(state.game.bestDaily||0,dailyStreak())},
 {id:'d100',icon:'💯',name:'100-day activity streak',desc:'Be active 100 days in a row',target:100,value:()=>Math.max(state.game.bestDaily||0,dailyStreak())},
 {id:'h2o',icon:'💧',name:'Hydrated',desc:'Reach your water goal',target:1,value:()=>state.game.waterWon?1:0},
 {id:'h2o7',icon:'🚰',name:'7-day water streak',desc:'Reach your water goal 7 days in a row',target:7,value:waterStreak},
 {id:'h2o30',icon:'🌊',name:'30-day water streak',desc:'Reach your water goal 30 days in a row',target:30,value:waterStreak},
 {id:'h2o100',icon:'🐳',name:'100-day water streak',desc:'Reach your water goal 100 days in a row',target:100,value:waterStreak},
 {id:'food30',icon:'🥗',name:'Food logger',desc:'Log food on 30 days',target:30,value:foodDaysLogged},
 {id:'early',icon:'🌅',name:'Early bird',desc:'Finish 5 workouts started before 7 am',target:5,value:()=>sessionsStartedBetween(0,7)},
 {id:'night',icon:'🌙',name:'Night owl',desc:'Finish 5 workouts started after 9 pm',target:5,value:()=>sessionsStartedBetween(21,24)},
 {id:'explore',icon:'🧭',name:'Explorer',desc:'Log 25 different exercises',target:25,value:distinctExercises},
 {id:'l5',icon:'⭐',name:'Level 5',desc:'Reach level 5',target:5,value:()=>lvl(state.game.xp)},
 {id:'l10',icon:'🌟',name:'Level 10',desc:'Reach level 10',target:10,value:()=>lvl(state.game.xp)},
 {id:'l20',icon:'✨',name:'Level 20',desc:'Reach level 20',target:20,value:()=>lvl(state.game.xp)},
 {id:'fr',icon:'🤝',name:'First friend',desc:'Add a friend',target:1,value:()=>Math.max(state.friends.length,acceptedFriendCount)}];
function badgeProgress(b){let v=0;try{v=Number(b.value())||0;}catch(e){}return Math.max(0,Math.min(b.target,v));}

function rewards(){
  const g=normalizeGame(state.game);
  // Claims are date-stamped so a stale claim synced from another day can never block today's quest.
  QUESTS.forEach(q=>{if(g.claimed[q.id])g.claimed[questKey('d',q.id)]=1;});pruneQuestClaims(g);
  state.workouts.forEach(w=>{if(w.done&&!w.xp){w.xp=1;if(xpAllowance('ex')){g.total++;gainXP(20,'Exercise done');}}});
  state.foods.forEach(f=>{if(!f.xp){f.xp=1;if(xpAllowance('meal'))gainXP(5,'Meal logged');state.recent=[f].concat(state.recent.filter(r=>r.name!==f.name)).slice(0,12).map(r=>({name:r.name,cal:r.cal,protein:r.protein,carbs:r.carbs,fat:r.fat,grams:Number(r.grams)||0,portion:r.portion||''}));}});
  state.prs.forEach(p=>{if(!p.xp){p.xp=1;if(xpAllowance('pr')){gainXP(50,'New PR 🏆');confetti();}}});
  if(state.water>=state.waterGoal&&g.waterWon!==dayKey()){g.waterWon=dayKey();gainXP(30,'Water goal');}
  QUESTS.forEach(q=>{const k=questKey('d',q.id);if(q.v()>=q.n&&!g.claimed[k]){g.claimed[k]=1;gainXP(DAILY_QUEST_XP,'Daily quest: '+q.t);}});
  const week=weekStats();
  weeklyQuests().forEach(q=>{const k=questKey('w',q.id);if(q.v(week)>=q.n()&&!g.claimed[k]){g.claimed[k]=1;gainXP(WEEKLY_QUEST_XP,'Weekly quest: '+q.t());}});
  settleStreak();
  BADGES.forEach(b=>{if(!g.badges.includes(b.id)&&badgeProgress(b)>=b.target){g.badges.push(b.id);celebrate({icon:b.icon,title:'Badge unlocked: '+b.name,text:b.desc+'.'});}});
}

// --- D1/D2/D4/D6/D7/D8 rendering ---
let streakNudgeDismissedDay='';
function streakAtRisk(now=new Date()){return now.getHours()>=STREAK_NUDGE_HOUR&&!todayIsActive()&&dailyStreak()>0&&streakNudgeDismissedDay!==dayKey(now);}
function renderStreakNudge(){
 const el=$('streakNudge');if(!el)return;const due=streakAtRisk();el.hidden=!due;
 if(due){const s=dailyStreak(),f=state.game.streakFreezes||0;$('streakNudgeText').textContent='Your '+s+'-day streak ends at midnight. Log a workout, a meal or reach your water goal to keep it.'+(f?' You have '+f+' streak freeze'+(f===1?'':'s')+', so one missed day is covered.':'');}
}
function gamePanelMarkup(){
 const g=normalizeGame(state.game),L=lvl(g.xp),lo=50*(L-1)**2,hi=50*L*L,xp=Math.round((g.xp-lo)/(hi-lo)*100),wi=weekInfo(),streak=dailyStreak(),frozen=new Set(g.frozenDays),days=sessionDaySet();
 const strip=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const k=dayKey(d),on=i===0?todayIsActive():historyDayIsActive(k,days),ice=!on&&frozen.has(k),label=d.toLocaleDateString(undefined,{weekday:'long'})+(on?': active':ice?': streak freeze used':': no activity');
  strip.push('<span class="wd '+(on?'on':ice?'frozen':'')+'" role="img" aria-label="'+label+'" title="'+label+'">'+(ice?'❄':on?'✓':d.toLocaleDateString(undefined,{weekday:'narrow'}))+'</span>');}
 const quest=(done,text,value,target,xp)=>'<div class="quest '+(done?'ok':'')+'"><span>'+(done?'✅ ':'⬜ ')+esc(text)+'</span><span>'+Math.min(value,target)+'/'+target+' · '+(done?'earned':'+'+xp+' XP')+'</span></div>';
 const week=weekStats(),unlocked=BADGES.filter(b=>g.badges.includes(b.id)).length,log=readXpLog();
 return '<div class="section-title"><span>Your Progress</span></div><div class="stat-row">'+
  '<div class="stat"><b>🔥 '+streak+'</b><span>day streak'+(g.bestDaily>streak?' · best '+g.bestDaily:'')+'</span></div>'+
  '<div class="stat"><b>❄ '+g.streakFreezes+'/'+STREAK_FREEZE_MAX+'</b><span>streak freezes</span></div>'+
  '<div class="stat"><b>🗓 '+wi.n+'/'+wi.g+'</b><span>weekly goal · '+wi.st+'-week streak</span></div>'+
  '<div class="stat"><b>Lv '+L+'</b><span>'+esc(levelTitle(L))+' · '+g.xp.toLocaleString()+' XP</span></div></div>'+
  '<div class="progress-bar" role="progressbar" aria-label="XP to next level" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+xp+'"><i style="width:'+xp+'%"></i></div>'+
  '<div class="meta-row"><span>'+(hi-g.xp)+' XP to level '+(L+1)+' ('+esc(levelTitle(L+1))+')</span><span>'+xp+'%</span></div>'+
  '<p class="sub streak-help">Your day streak grows with any workout, logged meal or water goal. Every '+STREAK_FREEZE_EVERY+' days earns a freeze (up to '+STREAK_FREEZE_MAX+') that covers a missed day automatically. Rest days never break your weekly streak — it only needs your weekly goal.</p>'+
  weeklyRecapMarkup()+'<div class="sub-h">Last 7 days</div><div class="week">'+strip.join('')+'</div>'+
  '<div class="sub-h">Daily quests <span class="quest-reset">resets in '+formatCountdown(msToMidnight())+'</span></div>'+QUESTS.map(q=>quest(!!g.claimed[questKey('d',q.id)]||q.v()>=q.n,q.t,q.v(),q.n,DAILY_QUEST_XP)).join('')+
  '<div class="sub-h">Weekly quests <span class="quest-reset">resets in '+formatCountdown(msToWeekEnd())+'</span></div>'+weeklyQuests().map(q=>quest(!!g.claimed[questKey('w',q.id)]||q.v(week)>=q.n(),q.t(),q.v(week),q.n(),WEEKLY_QUEST_XP)).join('')+
  '<details class="game-details" id="badgeGallery"><summary>Badges · '+unlocked+' of '+BADGES.length+' unlocked</summary><div class="badge-grid">'+BADGES.map(b=>{const got=g.badges.includes(b.id),v=got?b.target:badgeProgress(b),pct=Math.round(v/b.target*100),show=x=>b.fmt?b.fmt(x):Number(x).toLocaleString();
    return '<div class="badge-card'+(got?' got':'')+'"><div class="badge-icon" aria-hidden="true">'+b.icon+'</div><div class="badge-body"><strong>'+esc(b.name)+'</strong><span class="sub">'+esc(b.desc)+'</span><div class="progress-bar" role="progressbar" aria-label="'+esc(b.name)+' progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><i style="width:'+pct+'%"></i></div><span class="badge-state">'+(got?'✓ Unlocked':'🔒 Locked · '+esc(show(v))+' / '+esc(show(b.target)))+'</span></div></div>';}).join('')+'</div></details>'+
  '<details class="game-details" id="xpHistory"><summary>How XP is earned · recent history</summary><p class="sub">Exercise done 20 · meal 5 · PR 50 · water goal 30 · workout 40 · weekly goal 50 · daily quest '+DAILY_QUEST_XP+' · weekly quest '+WEEKLY_QUEST_XP+'. Each record earns XP once. Per day, XP is given for up to '+XP_DAILY_CAPS.ex+' exercises, '+XP_DAILY_CAPS.meal+' meals, '+XP_DAILY_CAPS.pr+' PRs and '+XP_DAILY_CAPS.session+' workouts. Level N needs 50 × (N−1)² XP.</p>'+
   (log.length?'<ul class="xp-log">'+log.slice(0,25).map(x=>'<li><strong>+'+Number(x.n)+' XP</strong> <span>'+esc(x.why)+'</span> <time class="sub">'+esc(new Date(Number(x.t)).toLocaleString(undefined,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}))+'</time></li>').join('')+'</ul><p class="sub">History is kept on this device.</p>':'<p class="sub">No XP earned on this device yet.</p>')+'</details>';
}
function renderGamePanel(){
 const host=$('gamePanel');if(!host)return;
 const open=['badgeGallery','xpHistory'].filter(id=>$(id)&&$(id).open),focusId=document.activeElement&&host.contains(document.activeElement)?document.activeElement.closest('details')?.id:'';
 host.innerHTML=gamePanelMarkup();
 open.forEach(id=>{if($(id))$(id).open=true;});
 if(focusId&&$(focusId))$(focusId).querySelector('summary')?.focus({preventScroll:true});
 renderStreakNudge();
}
function initGameControls(){
 $('celebrationDialog')?.addEventListener('close',()=>{if(celebrationQueue.length)scheduleCelebration();});
 $('celebrationClose')?.addEventListener('click',()=>$('celebrationDialog').close());
 $('streakNudge')?.addEventListener('click',e=>{const a=e.target.closest('button')?.dataset.nudgeAction;if(!a)return;if(a==='train')goToTraining();else{streakNudgeDismissedDay=dayKey();renderStreakNudge();}});
}

function reducedMotion(){return !!(state.settings&&state.settings.motion==='reduced')||matchMedia('(prefers-reduced-motion:reduce)').matches;}
function confetti(){if(reducedMotion())return;
  for(let i=0;i<36;i++){const e=document.createElement('i');e.className='cf';e.textContent=['🎉','✨','💪','🔥'][i%4];e.setAttribute('aria-hidden','true');e.style.cssText='left:'+Math.random()*100+'vw;animation-delay:'+Math.random()*.4+'s';document.body.appendChild(e);setTimeout(()=>e.remove(),2500);}}
function waterUnit(){return state.settings&&state.settings.waterUnit==='floz'?'floz':'ml';}
function waterUnitLabel(){return waterUnit()==='floz'?'fl oz':'ml';}
function waterMlToDisplay(ml){return waterUnit()==='floz'?Math.round(ml/ML_PER_US_FL_OZ*10)/10:Math.round(ml);}
function waterDisplayToMl(value){return waterUnit()==='floz'?value*ML_PER_US_FL_OZ:value;}
function formatWaterAmount(ml){return waterMlToDisplay(ml).toLocaleString()+' '+waterUnitLabel();}
function waterTotalUnitLabel(){return waterUnit()==='floz'?'fl oz':'L';}
function formatWaterTotal(litres){return waterUnit()==='floz'?(Math.round(litres*1000/ML_PER_US_FL_OZ*10)/10).toLocaleString():Number(litres).toFixed(2);}
function waterEntryMaxDisplay(){return waterUnit()==='floz'?Math.floor(WATER_ENTRY_MAX_ML/ML_PER_US_FL_OZ):WATER_ENTRY_MAX_ML;}
function waterEntryMinDisplay(){return waterUnit()==='floz'?0.1:1;}
function waterEntryRangeText(){return waterEntryMinDisplay()+'–'+waterEntryMaxDisplay().toLocaleString()+' '+waterUnitLabel();}
function parseWaterEntryMl(raw){const v=parseFloat(raw);if(!(v>=waterEntryMinDisplay()&&v<=waterEntryMaxDisplay()))return 0;return Math.max(1,Math.min(WATER_ENTRY_MAX_ML,Math.round(waterDisplayToMl(v))));}
function addWater(l){l=+l;if(!(l>0))return;const entry={id:newRecordId('water'),amount:+l.toFixed(3),day:dayKey(),createdAt:Date.now()};state.waterEntries=Array.isArray(state.waterEntries)?state.waterEntries:[];state.waterEntries.push(entry);state.water=+(state.water+l).toFixed(3);state.waterLog=state.waterEntries.filter(x=>x.day===dayKey()).map(x=>x.amount);state.lastWaterMl=Math.max(1,Math.min(WATER_ENTRY_MAX_ML,Math.round(l*1000)));saveState();showToast('Added '+formatWaterAmount(l*1000));}
function addCustomWater(){const field=$('customWater'),ml=parseWaterEntryMl(field&&field.value);if(!ml)return showToast('Enter '+waterEntryRangeText());addWater(ml/1000);if($('customWater'))$('customWater').value='';}
function undoWater(){const entry=(state.waterEntries||[]).filter(x=>x.day===dayKey()).pop();if(!entry)return showToast('Nothing to undo');markRecordDeleted('waterEntries',entry);state.waterEntries=state.waterEntries.filter(x=>x.id!==entry.id);state.water=state.waterEntries.filter(x=>x.day===dayKey()).reduce((n,x)=>n+x.amount,0);state.waterLog=state.waterEntries.filter(x=>x.day===dayKey()).map(x=>x.amount);saveState();showToast('Undid '+formatWaterAmount(entry.amount*1000));}
function markNav(){document.querySelectorAll('nav button').forEach(b=>b.setAttribute('aria-current',b.classList.contains('active')?'page':'false'));}
function setBar(id,p,label){const b=$(id)&&$(id).parentElement;if(!b)return;b.setAttribute('role','progressbar');b.setAttribute('aria-label',label);b.setAttribute('aria-valuemin','0');b.setAttribute('aria-valuemax','100');b.setAttribute('aria-valuenow',p);}
function weeklyRecapData(){
 // Calendar weeks, starting on the user's chosen week start day.
 const now=new Date(),start=new Date(now);start.setHours(0,0,0,0);start.setDate(start.getDate()-daysSinceWeekStart(start));
 const prevStart=new Date(start);prevStart.setDate(prevStart.getDate()-7);
 const valid=(state.sessions||[]).filter(x=>x&&x.date&&/^\d{4}-\d{2}-\d{2}$/.test(String(x.date)));
 // Compare day keys so a workout logged today before noon is included.
 const startKey=dayKey(start),prevKey=dayKey(prevStart),todayKey=dayKey(now);
 const current=valid.filter(x=>x.date>=startKey&&x.date<=todayKey);
 const previous=valid.filter(x=>x.date>=prevKey&&x.date<startKey);
 const sum=(arr,key)=>arr.reduce((n,x)=>n+(Number(x[key])||0),0);
 return {current,previous,sets:sum(current,'sets'),volume:sum(current,'vol'),minutes:sum(current,'mins'),goal:state.weeklyGoal||3,weekCount:weekInfo().n};
}
function weeklyRecapText(){const w=weeklyRecapData();return 'My Gymplified weekly recap\n'+w.current.length+' workouts completed\\n'+w.sets+' sets completed\\n'+fmtVolume(w.volume)+' total volume\\n'+w.minutes+' minutes training\\n'+w.weekCount+'/'+w.goal+' weekly workout goal';}
async function shareWeeklyRecap(){const recap=weeklyRecapText();try{if(navigator.share)await navigator.share({title:'My Gymplified weekly recap',text:recap});else if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(recap);showToast('Weekly recap copied');}else showToast('Sharing is not available on this device');}catch(e){if(e&&e.name!=='AbortError')showToast('Could not share recap');}}
function weeklyRecapMarkup(){
 const w=weeklyRecapData(),delta=w.current.length-w.previous.length;
 const comparison=delta>0?'↑ '+delta+' more than last week':delta<0?'↓ '+Math.abs(delta)+' fewer than last week':'Same number as last week';
 return '<div class="sub-h">Your weekly recap · this week (from '+(weekStartsSunday()?'Sunday':'Monday')+')</div>'+
 '<div class="stat-row"><div class="stat"><b>'+w.current.length+'</b><span>workouts</span></div><div class="stat"><b>'+w.sets+'</b><span>sets completed</span></div><div class="stat"><b>'+volumeNumber(w.volume)+'</b><span>'+weightUnit()+' volume</span></div><div class="stat"><b>'+w.minutes+'</b><span>minutes</span></div></div>'+
 '<div class="meta-row"><span>'+comparison+'</span><span>'+w.weekCount+'/'+w.goal+' weekly goal</span></div><div class="row-wrap" style="margin-top:10px"><button class="btn" type="button" onclick="shareWeeklyRecap()">Share weekly recap</button></div>';
}
function renderRoutineLibrary(){
 const host=$('routineLibrary');if(!host)return;
 state.routines=(Array.isArray(state.routines)?state.routines:[]).filter(r=>r&&typeof r==='object').map((r,i)=>({id:String(r.id||'legacy-routine-'+i),name:String(r.name||'Saved routine'),exercises:Array.isArray(r.exercises)?r.exercises:[]}));
 const routines=state.routines;
 host.innerHTML=routines.length?'<div class="sub-h">Saved routines</div><div class="row-wrap">'+routines.map((r,i)=>'<span class="badge">'+esc(r.name)+' · '+r.exercises.length+' exercises <button class="btn" style="padding:0 10px;margin-left:5px" onclick="loadSavedRoutine('+i+')">Load</button> <button class="btn btn-icon-only" style="padding:0" aria-label="Delete '+esc(r.name)+'" onclick="deleteSavedRoutine('+i+')">×</button></span>').join('')+'</div>':'<p class="sub" style="margin-top:8px">Save your favourite workout combinations here so you can reuse them anytime.</p>';
}
function saveCurrentRoutine(){
 if(!state.workouts.length)return showToast('Add exercises before saving a routine');
 if(!canSaveRoutine())return showToast('Free accounts keep up to '+FREE_ROUTINE_LIMIT+' saved routines. Delete one, or unlock Deluxe for unlimited routines.');
 const suggested='Routine '+((state.routines||[]).length+1),name=(prompt('Name this workout routine',suggested)||'').trim().slice(0,40);if(!name)return;
 state.routines=Array.isArray(state.routines)?state.routines:[];
 const exercises=state.workouts.map(w=>({name:w.name,muscle:w.muscle,setList:(w.setList||[]).map(x=>({kg:Number(x.kg)||0,reps:Number(x.reps)||1,done:false}))}));
 state.routines.unshift({id:newRecordId('routine'),name,exercises:exercises.map(ex=>Object.assign({},ex,{id:newRecordId('routine-ex'),setList:ex.setList.map(set=>Object.assign({id:newRecordId('routine-set')},set))})),createdAt:new Date().toISOString()});state.routines=state.routines.slice(0,deluxeEnabled()?100:30);saveState();showToast('Routine saved');
}
function loadSavedRoutine(index){
 const routine=(state.routines||[])[index];if(!routine)return;
 if(state.workouts.length&&!confirm('Replace your current workout with "'+routine.name+'"?'))return;
 (state.workouts||[]).forEach(x=>markRecordDeleted('workouts',x));
 state.workouts=routine.exercises.map(w=>syncW({name:w.name,muscle:w.muscle,setList:(w.setList||[]).map(x=>({kg:Number(x.kg)||0,reps:Number(x.reps)||1,done:false}))}));
 saveState();showToast(routine.name+' loaded');
}
function deleteSavedRoutine(index){const routine=(state.routines||[])[index];if(!routine||!confirm('Delete saved routine "'+routine.name+'"?'))return;markRecordDeleted('routines',routine);state.routines.splice(index,1);saveState();showToast('Routine deleted');}
function renderWaterSummary(){
  const goal=state.waterGoal>0?state.waterGoal:2.5,wp=Math.min(100,Math.round(state.water/goal*100));
  $('dashWater').textContent=formatWaterTotal(state.water);$('dashWaterGoal').textContent=formatWaterTotal(goal);$('dashWaterUnit').textContent=waterTotalUnitLabel();
  $('dashWaterBar').style.width=wp+'%';$('waterMeta').textContent='Goal: '+formatWaterTotal(goal)+' '+waterTotalUnitLabel()+' · '+wp+'%';
  setBar('dashWaterBar',wp,'Hydration progress');
}
function renderWaterButtons(){
  const host=$('waterBtns');if(!host)return;
  const typed=$('customWater')?$('customWater').value:'',hadFocus=document.activeElement===$('customWater');
  const presets=state.presets,last=Number(state.lastWaterMl)||0,floz=waterUnit()==='floz';
  host.innerHTML=presets.map(p=>'<button class="btn" type="button" data-water-ml="'+Number(p)+'">+'+esc(formatWaterAmount(p))+'</button>').join('')+
   (last>0&&!presets.includes(last)?'<button class="btn" type="button" data-water-ml="'+last+'" aria-label="Add last used amount, '+esc(formatWaterAmount(last))+'">↻ Last: '+esc(formatWaterAmount(last))+'</button>':'')+
   '<input type="number" id="customWater" inputmode="decimal" min="'+waterEntryMinDisplay()+'" max="'+waterEntryMaxDisplay()+'" step="'+(floz?'0.1':'1')+'" placeholder="'+waterUnitLabel()+'" aria-label="Custom water amount in '+(floz?'US fluid ounces':'millilitres')+'"><button class="btn" type="button" data-water-action="custom">Add</button><button class="btn" type="button" data-water-action="undo" aria-label="Undo last water entry">↶ Undo</button>';
  if(typed)$('customWater').value=typed;if(hadFocus)$('customWater').focus();
}
function initWaterControls(){
  const host=$('waterBtns');
  if(host){
    host.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!host.contains(b))return;
      if(b.dataset.waterMl)addWater(Number(b.dataset.waterMl)/1000);else if(b.dataset.waterAction==='custom')addCustomWater();else if(b.dataset.waterAction==='undo')undoWater();});
    host.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='customWater'){e.preventDefault();addCustomWater();}});
  }
  $('waterResetBtn')?.addEventListener('click',resetWater);
  const panel=$('waterSettings');
  if(panel){
    panel.addEventListener('click',e=>{const b=e.target.closest('button[data-water-setting]');if(!b)return;const i=Number(b.dataset.index),a=b.dataset.waterSetting;
      if(a==='save-goal')saveWaterGoal();else if(a==='add-preset')addWaterPreset();else if(a==='remove')removeWaterPreset(i);else if(a==='up')moveWaterPreset(i,-1);else if(a==='down')moveWaterPreset(i,1);});
    panel.addEventListener('keydown',e=>{if(e.key!=='Enter')return;if(e.target.id==='waterPresetNew'){e.preventDefault();addWaterPreset();}else if(e.target.id==='waterGoalInput'){e.preventDefault();saveWaterGoal();}});
  }
}
function initWaterSettings(focusSelector){
  const panel=$('waterSettings');if(!panel)return;
  const floz=waterUnit()==='floz',presets=state.presets,goal=floz?Math.round(state.waterGoal*1000/ML_PER_US_FL_OZ):state.waterGoal;
  const goalMin=floz?Math.ceil(WATER_GOAL_MIN_L*1000/ML_PER_US_FL_OZ):WATER_GOAL_MIN_L,goalMax=floz?Math.floor(WATER_GOAL_MAX_L*1000/ML_PER_US_FL_OZ):WATER_GOAL_MAX_L;
  panel.innerHTML='<h3>Water</h3><p>Set your daily goal and the quick-add amounts shown on the dashboard. Change the water unit under Units.</p>'+
   '<div class="form-grid">'+
   '<div class="field"><label for="waterGoalInput">Daily water goal ('+(floz?'fl oz':'litres')+')</label><input type="number" id="waterGoalInput" inputmode="decimal" step="'+(floz?'1':'0.1')+'" min="'+goalMin+'" max="'+goalMax+'" value="'+goal+'"></div>'+
   '</div><div class="row-wrap" style="margin-bottom:16px"><button class="btn btn-primary" type="button" data-water-setting="save-goal">Save water goal</button></div>'+
   '<div class="sub-h" id="waterPresetHeading">Quick-add amounts ('+presets.length+' of '+WATER_PRESET_MAX+')</div>'+
   '<div role="list" aria-labelledby="waterPresetHeading">'+presets.map((p,i)=>{const label=esc(formatWaterAmount(p));return '<div class="water-preset-row" role="listitem"><strong>'+label+'</strong>'+
     '<button class="btn btn-icon-only" type="button" data-water-setting="up" data-index="'+i+'" aria-label="Move '+label+' up"'+(i===0?' disabled':'')+'>↑</button>'+
     '<button class="btn btn-icon-only" type="button" data-water-setting="down" data-index="'+i+'" aria-label="Move '+label+' down"'+(i===presets.length-1?' disabled':'')+'>↓</button>'+
     '<button class="btn btn-icon-only" type="button" data-water-setting="remove" data-index="'+i+'" aria-label="Remove '+label+'"'+(presets.length<=1?' disabled':'')+' style="color:var(--danger)">✕</button></div>';}).join('')+'</div>'+
   '<div class="row-wrap" style="margin-top:12px"><input type="number" id="waterPresetNew" inputmode="decimal" min="'+waterEntryMinDisplay()+'" max="'+waterEntryMaxDisplay()+'" step="'+(floz?'0.1':'1')+'" placeholder="'+waterUnitLabel()+'" aria-label="New quick-add amount in '+(floz?'US fluid ounces':'millilitres')+'" style="width:120px"'+(presets.length>=WATER_PRESET_MAX?' disabled':'')+'>'+
   '<button class="btn" type="button" data-water-setting="add-preset"'+(presets.length>=WATER_PRESET_MAX?' disabled':'')+'>+ Add amount</button></div>';
  if(focusSelector){const target=panel.querySelector(focusSelector);if(target&&!target.disabled)target.focus();else panel.querySelector('#waterPresetNew:not(:disabled),button[data-water-setting="up"]:not(:disabled),button[data-water-setting="down"]:not(:disabled)')?.focus();}
}
function setWaterUnit(unit){state.settings.waterUnit=unit==='floz'?'floz':'ml';saveState();initWaterSettings();showToast('Water shown in '+(waterUnit()==='floz'?'US fluid ounces':'millilitres'));}
function saveWaterGoal(){
  const v=parseFloat($('waterGoalInput').value),litres=waterUnit()==='floz'?v*ML_PER_US_FL_OZ/1000:v;
  if(!(litres>=WATER_GOAL_MIN_L&&litres<=WATER_GOAL_MAX_L))return showToast('Water goal must be '+formatWaterTotal(WATER_GOAL_MIN_L)+'–'+formatWaterTotal(WATER_GOAL_MAX_L)+' '+waterTotalUnitLabel());
  state.waterGoal=+litres.toFixed(3);saveState();initWaterSettings('#waterGoalInput');showToast('Water goal saved');
}
function addWaterPreset(){
  if(state.presets.length>=WATER_PRESET_MAX)return showToast('You can keep up to '+WATER_PRESET_MAX+' quick amounts');
  const ml=parseWaterEntryMl($('waterPresetNew').value);if(!ml)return showToast('Enter '+waterEntryRangeText());
  if(state.presets.includes(ml))return showToast(formatWaterAmount(ml)+' is already a quick amount');
  state.presets=state.presets.concat(ml);saveState();initWaterSettings('#waterPresetNew');showToast('Added '+formatWaterAmount(ml)+' quick amount');
}
function removeWaterPreset(index){
  if(state.presets.length<=1)return showToast('Keep at least one quick amount');if(!(index>=0&&index<state.presets.length))return;
  const removed=state.presets[index];state.presets=state.presets.filter((_,i)=>i!==index);saveState();
  initWaterSettings('button[data-water-setting="remove"][data-index="'+Math.min(index,state.presets.length-1)+'"]');showToast('Removed '+formatWaterAmount(removed));
}
function moveWaterPreset(index,delta){
  const to=index+delta;if(!(index>=0&&index<state.presets.length&&to>=0&&to<state.presets.length))return;
  const next=state.presets.slice();next.splice(to,0,next.splice(index,1)[0]);state.presets=next;saveState();
  initWaterSettings('button[data-water-setting="'+(delta<0?'up':'down')+'"][data-index="'+to+'"]');
}
function renderExtras(){
  renderWaterSummary();setBar('dashCalBar',Math.min(100,Math.round(state.cal/state.calTarget*100)),'Calorie progress');
  renderWaterButtons();
  renderGamePanel();
  const c=state.settings.color;document.querySelectorAll('.color-dot').forEach(d=>{const on=(d.getAttribute('onclick')||'').includes("'"+c+"'");d.classList.toggle('active',on);d.setAttribute('aria-pressed',on);});
  document.documentElement.setAttribute('data-spacing',state.settings.spacing||'normal');
  const dl=$('recentFoods');if(dl)dl.innerHTML=state.recent.map(r=>'<option value="'+esc(r.name)+'">').join('');
  markNav();
}
function initGoals(){renderPrivacySettings();renderCustomExerciseList();syncSettingsControls();renderProfilePanel();renderBackupReminder();renderOnboarding();initWaterSettings();}
function exportData(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.download='gymplified-backup-'+dayKey()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);markBackupDone();showToast('Backup exported');}
function importData(file){
 if(!file)return;if(file.size>10*1024*1024)return showToast('Backup is larger than 10 MB.');
 const reader=new FileReader();
 reader.onload=()=>{
  try{
   const imported=validateBackupData(JSON.parse(reader.result));
   if(!confirm('Replace current Gymplified data with this validated backup?'))return;
   imported.resetAt=Date.now();imported.deletedRecordIds=[];state=imported;persistLocalState();queueCloudStateSave();applySettings();renderAll();initPicker();initGoals();
   showToast('Backup validated and restored');
  }catch(error){console.error('Gymplified backup validation failed:',error);showToast(error.message||'That file is not a valid Gymplified backup.');}
 };
 reader.onerror=()=>showToast('Could not read this backup file.');
 reader.readAsText(file);
}
addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('input,select,textarea')||e.ctrlKey||e.metaKey||e.altKey)return;
  const map={1:'dashboard',2:'prs',3:'training',4:'nutrition',5:'friends',6:'settings'};const target=map[e.key]&&document.querySelector('nav button[data-screen="'+map[e.key]+'"]');if(target)target.click();else if(e.key==='w'||e.key==='W')addWater((state.presets[1]||state.presets[0])/1000);});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&state.game.day!==dayKey()){state=bootState();saveState();}else if(!document.hidden&&currentUser)queueCloudStateSave();});
window.addEventListener('online',()=>{if(currentUser)queueCloudStateSave();});
document.addEventListener('click',e=>{if(!e.target.closest('.nutrition-search-field'))$('foodSuggestions')?.classList.remove('open');});

// ===== v4: sessions + exercise library =====
const MC={ch:'chest',la:'lats',sh:'shoulders',bi:'biceps',tr:'triceps',ab:'abs',qu:'quadriceps',ha:'hamstrings',ca:'calves',gl:'glutes',tp:'traps',fo:'forearms'};
const cap=x=>x.charAt(0).toUpperCase()+x.slice(1);
const slug=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const mkEx=(n,eq,pm,sec,c)=>({id:(c?'c-':'')+slug(n),name:n,eq,pm,sec,custom:!!c});
const LIB={
Machine:'Leg Press:qu:gl,ha;Hack Squat Machine:qu:gl;Leg Extension:qu;Seated Leg Curl:ha:ca;Lying Leg Curl:ha;Standing Calf Raise:ca;Seated Calf Raise:ca;Hip Abductor:gl;Hip Adductor:qu;Glute Kickback Machine:gl:ha;Smith Machine Squat:qu:gl;Chest Press Machine:ch:tr,sh;Incline Chest Press Machine:ch:sh,tr;Pec Deck Fly:ch:sh;Smith Machine Bench Press:ch:tr,sh;Shoulder Press Machine:sh:tr;Lateral Raise Machine:sh;Reverse Pec Deck:sh:tp;Lat Pulldown:la:bi;Seated Row Machine:la:bi,tp;Low Row Machine:la:tp;Assisted Pull-Up Machine:la:bi;Back Extension:ha:gl;Shrug Machine:tp;Bicep Curl Machine:bi;Triceps Extension Machine:tr;Dip Machine:tr:ch;Ab Crunch Machine:ab;Torso Rotation:ab;Pendulum Squat:qu:gl;Belt Squat:qu:gl,ha;V-Squat Machine:qu:gl;Horizontal Leg Press:qu:gl,ha;Single-Leg Leg Press:qu:gl;Leg Press Calf Raise:ca;Donkey Calf Raise Machine:ca;Kneeling Leg Curl:ha:ca;Standing Leg Curl:ha:ca;Glute Drive Machine:gl:ha;Reverse Hyperextension:gl:ha;Preacher Curl Machine:bi:fo;Iso-Lateral Chest Press:ch:tr,sh;Decline Chest Press Machine:ch:tr;Iso-Lateral Row:la:bi,tp;Iso-Lateral Lat Pulldown:la:bi;T-Bar Row Machine:la:tp,bi;Pullover Machine:la:ch;Assisted Dip Machine:tr:ch,sh;Seated Chest Fly Machine:ch:sh',
Barbell:'Barbell Back Squat:qu:gl,ha;Front Squat:qu:gl,ab;Barbell Lunge:qu:gl;Conventional Deadlift:ha:gl,la,tp;Romanian Deadlift:ha:gl;Sumo Deadlift:gl:qu,ha;Good Morning:ha:gl;Hip Thrust:gl:ha;Barbell Calf Raise:ca;Flat Bench Press:ch:tr,sh;Incline Bench Press:ch:sh,tr;Decline Bench Press:ch:tr;Close-Grip Bench Press:tr:ch;Overhead Press:sh:tr,tp;Barbell Row:la:bi,tp;Pendlay Row:la:tp;Barbell Shrug:tp;Barbell Curl:bi:fo;Skull Crushers:tr;Barbell Preacher Curl:bi:fo;Reverse-Grip Barbell Curl:bi:fo;Wide-Grip Barbell Curl:bi;Barbell Drag Curl:bi;JM Press:tr;Barbell Pullover:la:ch;Seal Row:la:bi,tp;Meadows Row:la:bi,tp;Deficit Deadlift:ha:gl,la;Paused Squat:qu:gl,ha;Barbell Glute Bridge:gl:ha;Barbell Step-Up:qu:gl;Barbell Reverse Lunge:qu:gl;Barbell Split Squat:qu:gl;Barbell Wrist Curl:fo;Behind-the-Back Wrist Curl:fo;Landmine T-Bar Row:la:tp,bi;Landmine Press:sh:ch,tr;Landmine Squat:qu:gl;Zercher Squat:qu:gl,ab;Box Squat:qu:gl,ha;Push Press:sh:tr,qu;Power Clean:gl:ha,tp,qu;Rack Pull:tp:gl,ha,fo;Floor Press:ch:tr;Snatch-Grip Deadlift:ha:gl,tp,la;Barbell Upright Row:sh:tp;Yates Row:la:bi,tp',
Dumbbell:'Goblet Squat:qu:gl;Bulgarian Split Squat:qu:gl;Dumbbell Lunge:qu:gl;Dumbbell Romanian Deadlift:ha:gl;Dumbbell Bench Press:ch:tr,sh;Incline Dumbbell Press:ch:sh;Dumbbell Fly:ch;Dumbbell Shoulder Press:sh:tr;Arnold Press:sh:tr;Lateral Raise:sh;Front Raise:sh;Rear Delt Fly:sh:tp;One-Arm Dumbbell Row:la:bi;Dumbbell Curl:bi:fo;Hammer Curl:bi:fo;Incline Dumbbell Curl:bi;Concentration Curl:bi;Overhead Triceps Extension:tr;Triceps Kickback:tr;Dumbbell Shrug:tp:fo;Wrist Curl:fo;Dumbbell Preacher Curl:bi:fo;Dumbbell Spider Curl:bi;Zottman Curl:bi:fo;Cross-Body Hammer Curl:bi:fo;Drag Curl:bi;Bayesian Dumbbell Curl:bi;Dumbbell Tate Press:tr;Dumbbell JM Press:tr;Dumbbell Pullover:la:ch;Chest-Supported Dumbbell Row:la:bi,tp;Incline Bench Rear Delt Raise:sh:tp;Lean-Away Lateral Raise:sh;Dumbbell Y-Raise:sh;Dumbbell Squeeze Press:ch:tr;Dumbbell Reverse Fly:sh:tp;Dumbbell Step-Up:qu:gl;Dumbbell Sumo Squat:qu:gl;Dumbbell Single-Leg RDL:ha:gl;Dumbbell Hip Thrust:gl:ha;Dumbbell Calf Raise:ca;Dumbbell Reverse Lunge:qu:gl;Dumbbell Floor Press:ch:tr;Incline Dumbbell Fly:ch:sh;Decline Dumbbell Press:ch:tr;Dumbbell Close-Grip Press:tr:ch;Dumbbell Upright Row:sh:tp;Dumbbell Skull Crusher:tr;Renegade Row:la:ab,bi;Farmer\'s Carry:fo:tp,ab;Dumbbell Deadlift:ha:gl,qu;Dumbbell Front Squat:qu:gl;Dumbbell Lateral Lunge:qu:gl;Dumbbell Walking Lunge:qu:gl;Kroc Row:la:bi,fo;Single-Arm Dumbbell Overhead Press:sh:tr,ab;Reverse Wrist Curl:fo',
Cable:'Cable Triceps Pushdown:tr;Rope Pushdown:tr;Cable Biceps Curl:bi;Cable Row:la:bi;Straight-Arm Pulldown:la:tr;Face Pull:sh:tp;Cable Lateral Raise:sh;Cable Fly:ch:sh;Cable Crunch:ab;Cable Woodchop:ab;Cable Pull-Through:gl:ha;Cable Preacher Curl:bi:fo;Bayesian Cable Curl:bi:fo;High Cable Curl:bi;Low Cable Curl:bi;Cross-Body Cable Curl:bi:fo;Cable Hammer Curl:bi:fo;Overhead Cable Triceps Extension:tr;Single-Arm Cable Pushdown:tr;Cable Kickback:tr;Cable Y-Raise:sh;Cable Reverse Fly:sh:tp;Cable Upright Row:sh:tp;Cable Lateral Raise Behind Body:sh;Cable Chest Press:ch:tr,sh;Low-to-High Cable Fly:ch:sh;High-to-Low Cable Fly:ch;Single-Arm Cable Row:la:bi;Chest-Supported Cable Row:la:bi,tp;Wide-Grip Cable Row:la:tp;Kneeling Lat Pulldown:la:bi;Single-Arm Lat Pulldown:la:bi;Cable Shrug:tp;Cable Lunge:qu:gl;Cable Leg Extension:qu;Cable Leg Curl:ha;Cable Glute Kickback:gl;Cable Hip Abduction:gl;Cable Standing Calf Raise:ca;Cable Crossover:ch:sh;Cable Front Raise:sh;Cable Romanian Deadlift:ha:gl;Cable Hip Adduction:qu;Cable Wrist Curl:fo;Cable Reverse Curl:fo:bi;Cable Pallof Press:ab;Close-Grip Cable Pulldown:la:bi',
'EZ-Bar':'EZ-Bar Preacher Curl:bi:fo;EZ-Bar Reverse Preacher Curl:bi:fo;EZ-Bar Spider Curl:bi;EZ-Bar Reverse Curl:fo:bi;EZ-Bar Skull Crusher:tr;EZ-Bar French Press:tr;EZ-Bar Upright Row:sh:tp;EZ-Bar Front Raise:sh;EZ-Bar Curl:bi:fo',
'Smith Machine':'Smith Machine Incline Bench Press:ch:sh,tr;Smith Machine Decline Bench Press:ch:tr;Smith Machine Shoulder Press:sh:tr;Smith Machine Romanian Deadlift:ha:gl;Smith Machine Hip Thrust:gl:ha;Smith Machine Bulgarian Split Squat:qu:gl;Smith Machine Calf Raise:ca;Smith Machine Bent-Over Row:la:bi,tp;Smith Machine Shrug:tp;Smith Machine Close-Grip Bench Press:tr:ch;Smith Machine Upright Row:sh:tp;Smith Machine Reverse Lunge:qu:gl',
Kettlebell:'Kettlebell Swing:gl:ha;Kettlebell Goblet Squat:qu:gl;Kettlebell Clean:sh:gl;Kettlebell Clean and Press:sh:tr,gl;Kettlebell Snatch:sh:gl;Kettlebell Turkish Get-Up:ab:sh;Kettlebell Windmill:ab:sh;Kettlebell Suitcase Carry:ab:fo;Kettlebell Deadlift:ha:gl;Kettlebell Reverse Lunge:qu:gl;Kettlebell Press:sh:tr;Kettlebell Row:la:bi;Kettlebell Front Squat:qu:gl,ab;Kettlebell High Pull:tp:sh,gl;Kettlebell Halo:sh:ab;Kettlebell Farmer\'s Carry:fo:tp,ab;Kettlebell Single-Leg Deadlift:ha:gl;Kettlebell Thruster:qu:sh,gl;Kettlebell Floor Press:ch:tr',
Band:'Band Pull-Apart:sh:tp;Band Face Pull:sh:tp;Band Bicep Curl:bi:fo;Band Triceps Pushdown:tr;Band Overhead Triceps Extension:tr;Band Lateral Raise:sh;Band Seated Row:la:bi;Band Lat Pulldown:la:bi;Band Chest Press:ch:tr,sh;Band Chest Fly:ch:sh;Band Squat:qu:gl;Band Good Morning:ha:gl;Band Romanian Deadlift:ha:gl;Band Glute Kickback:gl:ha;Band Lateral Walk:gl;Band Clamshell:gl;Band Pallof Press:ab;Band Overhead Press:sh:tr;Band-Assisted Pull-Up:la:bi;Band Upright Row:sh:tp',
Bodyweight:'Pull-Up:la:bi;Chin-Up:bi:la;Inverted Row:la:bi;Push-Up:ch:tr,sh;Dips:tr:ch,sh;Pike Push-Up:sh:tr;Plank:ab;Crunch:ab;Hanging Leg Raise:ab;Russian Twist:ab;Mountain Climbers:ab:sh;Bodyweight Squat:qu:gl;Walking Lunge:qu:gl;Glute Bridge:gl:ha;Calf Raise (Bodyweight):ca;Burpees:qu:ch,sh;Dead Hang:fo:la;Nordic Hamstring Curl:ha:gl;Pistol Squat:qu:gl;Side Plank:ab;Hollow Body Hold:ab;Ab Wheel Rollout:ab:la,sh;L-Sit:ab:tr;Sit-Up:ab;Lying Leg Raise:ab;Captain\'s Chair Leg Raise:ab;Dead Bug:ab;Bench Dips:tr:ch,sh;Diamond Push-Up:tr:ch;Decline Push-Up:ch:sh,tr;Incline Push-Up:ch:tr,sh;Single-Leg Glute Bridge:gl:ha;Bodyweight Step-Up:qu:gl;Jump Squat:qu:gl,ca;Wall Sit:qu:gl;Superman Hold:gl:ha;Neutral-Grip Pull-Up:la:bi;Muscle-Up:la:tr,ch;Handstand Push-Up:sh:tr;Bear Crawl:sh:ab,qu'};
const EX=[];Object.keys(LIB).forEach(eq=>LIB[eq].split(';').forEach(t=>{const p=t.split(':');EX.push(mkEx(p[0],eq,MC[p[1]],(p[2]?p[2].split(','):[]).map(c=>MC[c]),false));}));
function normalizeCustomExercise(x,i){
 if(!x||typeof x!=='object')return null;
 const validMuscles=Object.values(MC);
 const pm=validMuscles.includes(x.pm)?x.pm:(validMuscles.includes(x.muscle)?x.muscle:'chest');
 const sec=(Array.isArray(x.sec)?x.sec:[]).filter(m=>validMuscles.includes(m)&&m!==pm);
 const name=String(x.name||x.title||'Custom exercise').trim().slice(0,80)||'Custom exercise';
 return {id:safeRecordId(x.id,'c-'+slug(name)+'-'+i),name,eq:safeStateText(x.eq||x.equipment,'Other',40),pm,sec,type:['weights','bodyweight','timed'].includes(x.type)?x.type:'weights',custom:true};
}
const allEx=()=>EX.concat((Array.isArray(state.customEx)?state.customEx:[]).map((x,i)=>normalizeCustomExercise(x,i)).filter(Boolean));
function syncW(w){w.id=safeRecordId(w.id,newRecordId('workout'));w.setList.forEach(x=>{x.id=safeRecordId(x.id,newRecordId('set'));});w.sets=w.setList.length;w.weight=Math.max(0,...w.setList.map(x=>x.kg));w.reps=w.setList.length?w.setList[0].reps:0;w.done=w.setList.length>0&&w.setList.every(x=>x.done);return w;}
function ensureSets(w){
 if(!w||typeof w!=='object')w={};
 w.id=safeRecordId(w.id,newRecordId('workout'));w.name=safeStateText(w.name||w.exercise,'Exercise',80);
 w.muscle=String(w.muscle||'');
 if(!Array.isArray(w.setList)||!w.setList.length){
  const count=Math.max(1,Math.min(20,Number(w.sets)||3));
  w.setList=Array.from({length:count},()=>({kg:Number(w.weight)||0,reps:Number(w.reps)||10,done:!!w.done}));
 }else{
  w.setList=w.setList.filter(x=>x&&typeof x==='object').map(x=>({
   id:safeRecordId(x.id,newRecordId('set')),
   kg:Number.isFinite(Number(x.kg))?Math.max(0,Math.min(1000,Number(x.kg))):0,
   reps:Number.isFinite(Number(x.reps))?Math.max(1,Math.min(1000,Math.round(Number(x.reps)))):10,
   done:!!x.done,
   type:SET_TYPES.includes(x.type)?x.type:'normal',
   auto:!!x.auto&&!x.done
  }));
  if(!w.setList.length)w.setList=[{kg:0,reps:10,done:false}];
 }
 return syncW(w);
}
const vol=w=>w.setList.filter(setCountsForVolume).reduce((a,x)=>a+x.kg*x.reps,0);
const prevWk=k=>{const d=new Date(k+'T12:00');d.setDate(d.getDate()-7);return dayKey(d);};
const wkKey=d=>{const x=new Date(d);x.setDate(x.getDate()-daysSinceWeekStart(x));return dayKey(x);};
function weekInfo(){const c={};state.sessions.forEach(x=>{const k=wkKey(x.date+'T12:00');c[k]=(c[k]||0)+1;});const g=state.weeklyGoal,cur=wkKey(new Date()),n=c[cur]||0;let k=n>=g?cur:prevWk(cur),st=0;while((c[k]||0)>=g&&st<520){st++;k=prevWk(k);}return{n,g,st};}
const clock=()=>{const t=Math.floor((Date.now()-state.session.start)/1000),h=Math.floor(t/3600),m=Math.floor(t%3600/60),q=t%60;return (h?h+':':'')+String(m).padStart(h?2:1,'0')+':'+String(q).padStart(2,'0');};
setInterval(()=>{if(!state.session)return;const text=clock();['sessClock','sessionChipClock','heroClock'].forEach(id=>{const e=$(id);if(e)e.textContent=text;});},1000);
function localDateTimeValue(timestamp){const d=new Date(Number(timestamp)||Date.now());const offset=d.getTimezoneOffset()*60000;return new Date(d.getTime()-offset).toISOString().slice(0,16);}
function editSessionStart(value){if(!state.session||!value)return;const parsed=new Date(value).getTime();if(!Number.isFinite(parsed)||parsed>Date.now()+60000){showToast('Choose a valid start time');renderTrainingLog();return;}state.session.start=parsed;saveState();showToast('Workout start time updated');}
function startSession(){if(state.session)return;const field=$('plannedSessionStart'),chosen=field&&field.value?new Date(field.value).getTime():Date.now();if(!Number.isFinite(chosen)||chosen>Date.now()+60000){showToast('Choose a valid start date and time');return;}state.session={start:chosen,xpStart:Number(state.game.xp)||0};saveState();showToast('Workout started — good luck! 💪');}
function cancelSession(){if(confirm('Cancel this workout without saving stats?')){state.session=null;saveState();scheduleCelebration();}}
function endSession(){if(!state.session)return;let v=0,st=0,r=0,ex=0;const names=[];
  state.workouts.forEach(w=>{const d=w.setList.filter(x=>x.done);if(d.length){ex++;names.push(w.name);}d.forEach(x=>{st++;r+=x.reps;if(setCountsForVolume(x))v+=x.kg*x.reps;});});
  if(!st){if(confirm('No sets are ticked off yet. End without saving?')){state.session=null;saveState();}return;}
  if((state.sessions||[]).length>=5000){showToast('Your workout history has reached 5,000 sessions. Export a backup before logging another completed workout.');return;}
  const finishedAt=Date.now(),startedAt=Number(state.session.start)||finishedAt;
  const sum={id:newRecordId('session'),date:dayKey(new Date(startedAt)),name:'Workout',startedAt:new Date(startedAt).toISOString(),finishedAt:new Date(finishedAt).toISOString(),mins:Math.max(1,Math.round((finishedAt-startedAt)/6e4)),vol:Math.round(v*10)/10,sets:st,reps:r,ex,names};
  sum.exercises=state.workouts.map(w=>({id:newRecordId('session-ex'),name:w.name,muscle:w.muscle,sets:w.setList.filter(x=>x.done).map(x=>({id:newRecordId('session-set'),kg:Number(x.kg)||0,reps:Number(x.reps)||0,type:setTypeOf(x),duration:Number(x.duration)||0,distance:Number(x.distance)||0,notes:String(x.notes||''),order:Number(x.order)||0}))})).filter(x=>x.sets.length);
  // PRs are judged against history before this session is added to it.
  sum.prs=detectSessionPRs(sum.exercises);sum.plan=planOutcome(state.workouts);sum.muscles=[...new Set(sum.exercises.map(e=>String(e.muscle||'').trim().toLowerCase()).filter(Boolean))];sum.xp=0;
  const xpStart=Number.isFinite(Number(state.session.xpStart))?Number(state.session.xpStart):Number(state.game.xp)||0;
  sum.prs.forEach(pr=>state.prs.push({id:newRecordId('pr'),name:pr.name,weight:pr.kg,reps:pr.reps,date:sum.date}));
  state.sessions.unshift(sum);state.lastSummary=sum;state.session=null;state.lastSession=state.workouts.map(w=>Object.assign({},w,{done:false,xp:0,setList:w.setList.map(x=>Object.assign({},x,{done:false}))}));state.workouts.forEach(w=>{w.done=false;(w.setList||[]).forEach(x=>{x.done=false;});});
  if(xpAllowance('session'))gainXP(40,'Workout complete');if(weekInfo().n===state.weeklyGoal)gainXP(50,'Weekly goal hit! 🗓');
  rewards();sum.xp=Math.max(0,(Number(state.game.xp)||0)-xpStart);stopRest();confetti();saveState();showSessionSummary();scheduleCelebration();}
function editHistoryTime(index,value){const session=state.sessions[index];if(!session||!value)return;const timestamp=new Date(value).getTime();if(!Number.isFinite(timestamp)){showToast('Enter a valid workout date and time');return;}session.startedAt=new Date(timestamp).toISOString();session.date=dayKey(new Date(timestamp));if(session.finishedAt){const elapsed=Math.max(1,Math.round((new Date(session.finishedAt).getTime()-timestamp)/60000));session.mins=elapsed;}saveState();showToast('Workout date and time updated');}
function editHistoryDuration(index,value){const session=state.sessions[index];if(!session)return;const mins=Math.max(1,Math.min(1440,parseInt(value,10)||1));session.mins=mins;if(session.startedAt)session.finishedAt=new Date(new Date(session.startedAt).getTime()+mins*60000).toISOString();saveState();showToast('Workout duration updated');}
function sessionSetSummary(set,index){const parts=[],type=setTypeOf(set);if(Number(set.kg)>0||Number(set.reps)>0)parts.push(esc(fmtWeight(set.kg,2))+' × '+esc(set.reps));if(Number(set.duration)>0){const seconds=Math.round(Number(set.duration));parts.push(seconds>=60?Math.floor(seconds/60)+'m '+(seconds%60)+'s':seconds+'s');}if(Number(set.distance)>0)parts.push(fmtDistance(set.distance));if(set.notes)parts.push('Note: '+esc(set.notes));return 'Set '+(index+1)+(type!=='normal'?' ('+esc(SET_TYPE_INFO[type].label.replace(/ set$/,'').toLowerCase())+')':'')+': '+(parts.join(' · ')||'Recorded');}
function reuseRoutine(){if(!state.lastSession.length)return showToast('No previous routine yet');state.workouts=state.workouts.concat(state.lastSession.map(w=>{const c=JSON.parse(JSON.stringify(w));c.setList.forEach(x=>x.done=false);c.xp=0;return syncW(c);}));saveState();showToast('Routine loaded');}
function applySetField(x,field,value){if(value===''||value==null)return false;const n=Number(value);if(!Number.isFinite(n)||n<0)return false;x[field]=field==='reps'?Math.max(1,Math.min(1000,Math.round(n)||1)):Math.min(1000,Math.round(displayToKg(n)*1000)/1000);x.auto=false;return true;}
// Field edits save and refresh totals only; the inputs are never re-rendered while the user is typing or tabbing.
function setVal(i,j,k,v,el){const w=state.workouts[i],x=w&&w.setList[j];if(!x)return;applySetField(x,k,v);syncW(w);flushDraftSave();persistLocalState();queueCloudStateSave();
 const row=el&&el.closest('.setrow');if(row){row.classList.remove('set-auto');row.querySelectorAll('input[data-set-field]').forEach(input=>{if(input.value===''||input===el)input.value=input.dataset.setField==='kg'?kgToDisplay(x.kg,2):x.reps;});}
 updateTrainingTotals();}
function toggleSet(i,j){const w=state.workouts[i],x=w&&w.setList[j];if(!x)return;x.done=!x.done;if(x.done){x.auto=false;state.lastKg[w.name]=x.kg;}syncW(w);flushDraftSave();saveState();
 if(x.done){try{navigator.vibrate&&navigator.vibrate(15);}catch(e){}if(restSetting()>0)startRest(restSetting());}}
function addSet(i){const w=state.workouts[i];if(!w)return;if(w.setList.length>=50)return showToast('An exercise can have up to 50 sets');const l=w.setList[w.setList.length-1]||{kg:0,reps:10};const type=setTypeOf(l);w.setList.push({kg:l.kg,reps:l.reps,type:type==='warmup'?'normal':type,done:false,auto:true});syncW(w);refreshTraining();}
function removeSet(i,j){const w=state.workouts[i];if(!w)return;if(w.setList.length<=1)return showToast('Keep one set, or remove the exercise');w.setList.splice(j,1);syncW(w);flushDraftSave();saveState();}
function toggleWorkoutDone(i){const w=state.workouts[i],v=!w.done;w.setList.forEach(x=>{x.done=v;if(v)x.auto=false;});syncW(w);saveState();}
function previousExercisePerformance(name){
 const key=String(name||'').trim().toLowerCase();
 for(const session of (Array.isArray(state.sessions)?state.sessions:[])){
  const exercises=Array.isArray(session&&session.exercises)?session.exercises:[];
  const ex=exercises.find(x=>String(x&&x.name||'').trim().toLowerCase()===key);
  if(ex&&Array.isArray(ex.sets)&&ex.sets.length){
   const sets=ex.sets.filter(x=>x&&Number.isFinite(Number(x.kg))&&Number.isFinite(Number(x.reps))&&Number(x.kg)>=0&&Number(x.reps)>0);
   if(sets.length)return {sets,date:String(session.date||'')};
  }
 }
 return null;
}
function bestPreviousSet(sets){return (sets||[]).reduce((best,x)=>!best||calculate1RM(x.kg,x.reps)>calculate1RM(best.kg,best.reps)?x:best,null);}
function applyPreviousBest(i){const w=state.workouts[i],p=previousExercisePerformance(w&&w.name);if(!w||!p)return showToast('No previous performance for this exercise yet');const best=bestPreviousSet(p.sets.filter(x=>setTypeOf(x)!=='warmup'))||bestPreviousSet(p.sets);if(!best)return;w.setList.forEach(x=>{if(x.done)return;x.kg=Number(best.kg);x.reps=Number(best.reps);x.auto=false;});syncW(w);flushDraftSave();saveState();showToast('Previous best applied to remaining sets');}
function setEstimateMarkup(i,j,x){return '<div class="set-estimate" id="setEstimate-'+i+'-'+j+'">Est. 1RM: '+format1RM(x.kg,x.reps)+'</div>';}
function updateSetEstimate(i,j,field,value){const x=state.workouts[i]?.setList?.[j];if(!x)return;if(applySetField(x,field,value))scheduleDraftSave();const el=$('setEstimate-'+i+'-'+j);if(el)el.textContent='Est. 1RM: '+format1RM(x.kg,x.reps);}
function exerciseHistoryMarkup(name){
 const key=String(name||'').trim().toLowerCase();
 const rows=[];
 (state.sessions||[]).forEach(session=>(session.exercises||[]).filter(ex=>String(ex.name||'').trim().toLowerCase()===key).forEach(ex=>rows.push({date:session.date,sets:ex.sets||[]})));
 if(!rows.length)return '<p class="sub">No saved exercise history yet. Finish a workout with this exercise to start building your history.</p>';
 return '<div class="exercise-history-list">'+rows.slice(0,12).map(row=>'<div class="quest"><span><strong>'+esc(row.date)+'</strong><br><small class="sub">'+row.sets.length+' sets</small></span><span>'+row.sets.map(sessionSetSummary).join(' · ')+'</span></div>').join('')+'</div>';
}
function closeExerciseHistory(){const host=$('exerciseHistoryPanel');if(host){host.innerHTML='';host.dataset.exercise='';}}
function viewExerciseHistoryById(id){const x=allEx().find(e=>e.id===id);if(x)viewExerciseHistory(x.name);}
function viewExerciseHistoryForSession(sessionIndex,exerciseIndex){const x=state.sessions[sessionIndex]?.exercises?.[exerciseIndex];if(x)viewExerciseHistory(x.name);}
function viewExerciseHistory(name){openExerciseSheet(name);}
function addEx(id){
 const x=allEx().find(e=>e.id===String(id));
 if(!x){showToast('Exercise not found. Please refresh and try again.');return;}
 if(!Array.isArray(state.workouts))state.workouts=[];
 if(!state.lastKg||typeof state.lastKg!=='object')state.lastKg={};
 // Sets start as greyed suggestions copied from the last session (set.auto). They only become
 // real values when the user ticks the set, types a value or taps "Use suggested values".
 const suggested=suggestedSetsFor(x.name);
 const workout=syncW({name:x.name,muscle:cap(x.pm),setList:suggested.sets});
 state.workouts.push(workout);
 // Persist this workout directly. The general saveState() also runs rewards and
 // every app renderer; an unrelated dashboard/rewards error must not block logging.
 persistLocalState();queueCloudStateSave();
 try{renderTrainingLog();}catch(error){console.error('Workout list refresh failed:',error);}
 try{renderDashboard();}catch(error){console.warn('Dashboard refresh failed:',error);}
 showToast(x.name+(suggested.fromHistory?' added · last session prefilled':' added · 3 editable sets'));
 try{renderPicker();}catch(error){console.warn('Exercise picker refresh failed:',error);}
 try{previewEx(id);}catch(error){console.warn('Exercise preview refresh failed:',error);}
}
function addCustom(){const n=$('cName').value.trim().slice(0,60);if(!n)return showToast('Enter an exercise name');
  if(!allEx().some(x=>x.name.toLowerCase()===n.toLowerCase()))state.customEx.push(mkEx(n,$('cEquip').value,$('cMuscle').value,[],true));
  const x=allEx().find(e=>e.name.toLowerCase()===n.toLowerCase());$('cName').value='';addEx(x.id);renderPicker();}
let muscleMapTemplatePromise=null;
let muscleMapRenderVersion=0;
const MUSCLE_MAP_ALIASES={
 chest:'pectoralis_major',lats:'latissimus_dorsi',shoulders:'deltoid',
 biceps:'biceps_brachii',forearms:'forearm_muscles',abs:'rectus_abdominis',
 quads:'quadriceps',calves:'gastrocnemius',glutes:'gluteus_maximus',
 traps:'trapezius'
};
function muscleMapKeys(name){
 const key=String(name||'').trim().toLowerCase();
 if(key==='traps')return ['trapezius','traps'];
 return [MUSCLE_MAP_ALIASES[key]||key].filter(Boolean);
}
function loadMuscleMapTemplate(){
 if(!muscleMapTemplatePromise)muscleMapTemplatePromise=fetch('./assets/muscle-map-template.svg').then(response=>{
  if(!response.ok)throw new Error('Could not load anatomical muscle illustration');
  return response.text();
 }).then(source=>{
  const doc=new DOMParser().parseFromString(source,'image/svg+xml'),svg=doc.documentElement;
  if(doc.querySelector('parsererror')||svg.localName!=='svg')throw new Error('Invalid anatomical SVG');
  return svg;
 }).catch(error=>{muscleMapTemplatePromise=null;throw error;});
 return muscleMapTemplatePromise;
}
async function renderMuscleMap(exercise){
 const mount=$('muscleMapMount');if(!mount)return;
 const request=++muscleMapRenderVersion;
 try{
  const template=await loadMuscleMapTemplate();
  if(request!==muscleMapRenderVersion)return;
  const svg=template.cloneNode(true);
  svg.removeAttribute('width');svg.removeAttribute('height');
  svg.style.width='100%';svg.style.height='auto';svg.style.maxHeight='none';
  svg.setAttribute('role','img');
  svg.setAttribute('aria-label',exercise?exercise.name+' muscle groups highlighted, front and back':'Front and back anatomical muscle map');
  const primary=new Set(muscleMapKeys(exercise&&exercise.pm));
  const secondary=new Set((exercise&&exercise.sec||[]).flatMap(muscleMapKeys));
  svg.querySelectorAll('[data-muscle]').forEach(path=>{
   const raw=path.getAttribute('data-muscle')||'';
   const base=raw.replace(/_(left|right)$/,'');
   if(primary.has(raw)||primary.has(base))path.classList.add('active');
   else if(secondary.has(raw)||secondary.has(base))path.classList.add('secondary');
  });
  const style=document.createElementNS('http://www.w3.org/2000/svg','style');
  style.textContent='#layer2 path.active{fill:#e6b93f!important;fill-opacity:.96!important;stroke:#9a7019!important;stroke-opacity:1!important;stroke-width:.8!important}#layer2 path.secondary{fill:#c18d27!important;fill-opacity:.72!important;stroke:#9a7019!important;stroke-opacity:.9!important;stroke-width:.65!important}';
  svg.insertBefore(style,svg.firstChild);
  mount.replaceChildren(svg);
 }catch(error){
  if(request!==muscleMapRenderVersion)return;
  mount.innerHTML='<p class="sub">The muscle illustration could not be loaded. Please refresh the app to try again.</p>';
  console.error(error);
 }
}
function previewEx(id){const x=id&&allEx().find(e=>e.id===id),b=$('exPreview');
  renderMuscleMap(x);
  if(!x){b.innerHTML='<p class="sub">Select an exercise to highlight its primary and supporting muscles.</p>';return;}
  const prev=previousExercisePerformance(x.name),last=prev&&prev.sets.length?prev.sets[prev.sets.length-1]:null;
  b.innerHTML='<strong>'+esc(x.name)+'</strong> <span class="sub">'+esc(x.eq)+(x.custom?' · custom':'')+'</span><div class="tag-list" style="margin-top:8px"><span class="tag primary">'+esc(x.pm)+'</span>'+x.sec.map(m=>'<span class="tag">'+esc(m)+'</span>').join('')+'</div>'+(last?'<p class="sub" style="margin-top:10px">Last time · '+esc(prev.date)+' · '+esc(fmtWeight(last.kg,2))+' × '+esc(last.reps)+' reps</p>':'<p class="sub" style="margin-top:10px">No previous performance logged yet.</p>')+'<button type="button" class="btn" style="margin-top:10px" data-ex-details="'+esc(x.name)+'">Details, history &amp; alternatives</button>';}
function initPicker(){const mo=Object.values(MC).map(m=>'<option value="'+m+'">'+cap(m)+'</option>').join(''),eo=Object.keys(LIB).map(e=>'<option>'+e+'</option>').join('');
  $('exMuscle').innerHTML='<option value="">All muscles</option>'+mo;$('exEquip').innerHTML='<option value="">All equipment</option>'+eo;$('cMuscle').innerHTML=mo;$('cEquip').innerHTML=eo+'<option>Other</option>';renderPicker();previewEx(null);}
function renderTrainingLog(){
 if(!Array.isArray(state.workouts))state.workouts=[];
 state.workouts=state.workouts.filter(w=>w&&typeof w==='object').map(w=>ensureSets(w));
 if(!Array.isArray(state.sessions))state.sessions=[];
 renderRoutineLibrary();const wi=weekInfo(),sb=$('sessBar');
  sb.innerHTML=state.session?'<div class="row-wrap"><div class="stat"><b id="sessClock">'+clock()+'</b><span>workout in progress</span></div><label class="sub" style="display:grid;gap:5px">Started at <input type="datetime-local" value="'+localDateTimeValue(state.session.start)+'" onchange="editSessionStart(this.value)" aria-label="Edit workout start date and time"></label><button class="btn btn-primary" onclick="endSession()">■ Finish workout</button><button class="btn" onclick="cancelSession()">Cancel</button></div>':'<div class="row-wrap"><button class="btn btn-primary" onclick="startSession()">▶ Start workout</button><label class="sub" style="display:grid;gap:5px">Set start date & time <input id="plannedSessionStart" type="datetime-local" value="'+localDateTimeValue(Date.now())+'" aria-label="Choose workout start date and time"></label><span class="sub">🔥 '+wi.st+'-week streak · '+wi.n+'/'+wi.g+' workouts this week</span></div>';
  $('liveStats').innerHTML=liveStatsMarkup();
  const listHost=$('trainingLogList'),focused=document.activeElement&&listHost.contains(document.activeElement)?document.activeElement:null;
  const focusKey=focused&&focused.dataset.i!==undefined?(focused.dataset.setAction?'[data-set-action="'+focused.dataset.setAction+'"]':focused.dataset.setField?'[data-set-field="'+focused.dataset.setField+'"]':focused.dataset.exCardAction?'[data-ex-card-action="'+focused.dataset.exCardAction+'"]':'')+'[data-i="'+focused.dataset.i+'"]'+(focused.dataset.j!==undefined?'[data-j="'+focused.dataset.j+'"]':''):'';
  listHost.innerHTML=state.workouts.length?state.workouts.map(exerciseCardMarkup).join(''):'<div class="empty-box"><p>No exercises yet. Search the library above and tap “+ Add”.</p></div>';
  if(focusKey&&focusKey[0]==='['&&!focusKey.startsWith('[data-i')){const again=listHost.querySelector(focusKey);if(again)again.focus({preventScroll:true});}
  $('sessionSummary').innerHTML=sessionSummaryMarkup();
  syncRestSettingsUI();renderSessionChrome();
  $('sessionHistory').innerHTML=state.sessions.length?state.sessions.map((x,i)=>'<details class="history-session" style="border:1px solid var(--line);border-radius:8px;padding:12px;margin:8px 0"><summary style="cursor:pointer;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><strong>'+esc(x.date)+' · '+(x.mins||0)+' min</strong><span class="sub">'+(x.ex||0)+' exercises · '+fmtVolume(x.vol||0)+' · '+(x.sets||0)+' sets</span></summary><div style="margin-top:12px"><div class="row-wrap" style="padding:10px 0;border-bottom:1px solid var(--line)"><label class="sub" style="display:grid;gap:5px">Workout date & start time<input type="datetime-local" value="'+localDateTimeValue(x.startedAt?new Date(x.startedAt).getTime():new Date((x.date||dayKey())+'T12:00').getTime())+'" onchange="editHistoryTime('+i+',this.value)"></label><label class="sub" style="display:grid;gap:5px">Duration (minutes)<input type="number" min="1" max="1440" value="'+(x.mins||1)+'" onchange="editHistoryDuration('+i+',this.value)"></label></div>'+((x.exercises||[]).length?(x.exercises||[]).map((ex,exIndex)=>'<div style="padding:10px 0;border-top:1px solid var(--line)"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><strong>'+esc(ex.name)+'</strong><button class="btn" onclick="viewExerciseHistoryForSession('+i+','+exIndex+');event.preventDefault()">Exercise history</button></div><div class="sub" style="margin-top:5px">'+(ex.sets||[]).map(sessionSetSummary).join(' · ')+'</div></div>').join(''):'<p class="sub">This older workout summary was saved before detailed exercise history was available.</p>')+'</div></details>').join(''):'<p class="sub">Finished workouts will appear here.</p>';}

// ===== Batch 2: workout flow (rest timer, prefill, set types, recovery, search, hero, summary) =====
function setCountsForVolume(x){return !!(x&&x.done&&x.type!=='warmup');}
function setTypeOf(x){return SET_TYPES.includes(x&&x.type)?x.type:'normal';}
function formatClockSeconds(total){total=Math.max(0,Math.round(total));const m=Math.floor(total/60),s=total%60;return m+':'+String(s).padStart(2,'0');}
function goToTraining(){showScreen('training',document.querySelector('nav button[data-screen="training"]'));}
function sessionTotals(){let volume=0,setsDone=0,setsTotal=0,reps=0;(state.workouts||[]).forEach(w=>(w.setList||[]).forEach(x=>{setsTotal++;if(x.done){setsDone++;reps+=Number(x.reps)||0;if(setCountsForVolume(x))volume+=(Number(x.kg)||0)*(Number(x.reps)||0);}}));return{volume,setsDone,setsTotal,reps,exercises:(state.workouts||[]).length};}

// --- B1/B2: rest timer (device-local, survives reload, driven by an end timestamp) ---
const REST_TIMER_KEY='gymplified_rest_timer_v1';
let restTimer=null,restTick=null,restAudio=null,restDoneTimeout=null;
function restSetting(){const n=Number(state.settings&&state.settings.restSeconds);return Number.isFinite(n)?Math.max(0,Math.min(REST_SECONDS_MAX,Math.round(n))):REST_DEFAULT_SECONDS;}
function saveRestTimer(){try{if(restTimer)localStorage.setItem(REST_TIMER_KEY,JSON.stringify(restTimer));else localStorage.removeItem(REST_TIMER_KEY);}catch(e){}}
function unlockRestAudio(){if(!state.settings||state.settings.restBeep===false)return;try{const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;if(!restAudio)restAudio=new Ctx();if(restAudio.state==='suspended')restAudio.resume();}catch(e){}}
function restBeep(){try{if(!restAudio||restAudio.state!=='running')return;[0,0.28].forEach(offset=>{const o=restAudio.createOscillator(),g=restAudio.createGain(),t=restAudio.currentTime+offset;o.type='sine';o.frequency.value=880;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.25,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+0.2);o.connect(g);g.connect(restAudio.destination);o.start(t);o.stop(t+0.22);});}catch(e){}}
function restNotification(){
 try{
  if(!('Notification' in window)||Notification.permission!=='granted')return;
  const options={body:'Time for your next set.',tag:'gymplified-rest',icon:'./apple-touch-icon.png'};
  if(navigator.serviceWorker&&navigator.serviceWorker.ready)navigator.serviceWorker.ready.then(reg=>reg.showNotification('Rest over',options)).catch(()=>{try{new Notification('Rest over',options);}catch(e){}});
  else new Notification('Rest over',options);
 }catch(e){}
}
function startRest(seconds){
 seconds=Math.max(5,Math.min(REST_SECONDS_MAX,Math.round(Number(seconds)||0)));
 unlockRestAudio();clearTimeout(restDoneTimeout);
 restTimer={endsAt:Date.now()+seconds*1000,total:seconds};saveRestTimer();runRestTimer();
}
function rest(n){startRest(n);}
function runRestTimer(){clearInterval(restTick);restTick=setInterval(tickRest,250);tickRest();}
function tickRest(){if(!restTimer)return;const left=Math.ceil((restTimer.endsAt-Date.now())/1000);if(left<=0)finishRest();else renderRestTimer(left);}
function adjustRest(delta){
 if(!restTimer)return;
 restTimer.endsAt=Math.max(Date.now()+1000,restTimer.endsAt+delta*1000);
 const left=Math.ceil((restTimer.endsAt-Date.now())/1000);restTimer.total=Math.min(REST_SECONDS_MAX+60,Math.max(left,restTimer.total+delta));
 saveRestTimer();renderRestTimer(left);
}
function stopRest(){clearInterval(restTick);restTick=null;clearTimeout(restDoneTimeout);restTimer=null;saveRestTimer();renderRestTimer(0);}
function finishRest(){
 clearInterval(restTick);restTick=null;restTimer=null;saveRestTimer();
 const bar=$('restBar'),out=$('timerOut');
 if(out)out.textContent='Go! 💪';
 if(bar){bar.hidden=false;bar.classList.add('done');$('restBarTime').textContent='Go!';$('restBarLabel').textContent='Rest over';$('restBarFill').style.width='100%';}
 clearTimeout(restDoneTimeout);restDoneTimeout=setTimeout(()=>{if(!restTimer)renderRestTimer(0);},6000);
 try{navigator.vibrate&&navigator.vibrate([200,100,200]);}catch(e){}
 if(state.settings.restBeep!==false)restBeep();
 if(state.settings.restNotify&&document.hidden)restNotification();
 showToast('Rest over — next set!');
}
function renderRestTimer(left){
 const bar=$('restBar'),out=$('timerOut');
 if(!restTimer){if(bar){bar.hidden=true;bar.classList.remove('done');}if(out&&out.textContent!=='Go! 💪')out.textContent='–';else if(out&&!left&&!restDoneTimeout)out.textContent='–';return;}
 const text=formatClockSeconds(left);
 if(out)out.textContent=text;
 if(bar){bar.hidden=false;bar.classList.remove('done');$('restBarTime').textContent=text;$('restBarLabel').textContent='Rest';$('restBarFill').style.width=Math.max(0,Math.min(100,(1-left/restTimer.total)*100))+'%';}
}
function restoreRestTimer(){
 try{const saved=JSON.parse(localStorage.getItem(REST_TIMER_KEY)||'null');
  if(saved&&Number(saved.endsAt)>Date.now()&&Number(saved.total)>0){restTimer={endsAt:Number(saved.endsAt),total:Math.min(REST_SECONDS_MAX+60,Number(saved.total))};runRestTimer();}
  else localStorage.removeItem(REST_TIMER_KEY);
 }catch(e){}
}
function syncRestSettingsUI(){
 const select=$('restAutoSelect');if(!select)return;
 const seconds=restSetting(),preset=[0,60,90,120].includes(seconds),custom=$('restCustomSeconds');
 if(document.activeElement!==select)select.value=preset&&!select.dataset.custom?String(seconds):'custom';
 $('restCustomWrap').hidden=select.value!=='custom';
 if(custom&&document.activeElement!==custom)custom.value=seconds||REST_DEFAULT_SECONDS;
 $('restBeepToggle').checked=state.settings.restBeep!==false;
 $('restNotifyToggle').checked=!!state.settings.restNotify&&'Notification' in window&&Notification.permission==='granted';
}
function saveWorkoutSettings(){persistLocalState();queueCloudStateSave();syncRestSettingsUI();}
function setRestNotify(on){
 const done=value=>{state.settings.restNotify=value;saveWorkoutSettings();};
 if(!on)return done(false);
 if(!('Notification' in window)){showToast('Notifications are not supported in this browser');return done(false);}
 if(Notification.permission==='granted')return done(true);
 if(Notification.permission==='denied'){showToast('Notifications are blocked for this site in your browser settings');return done(false);}
 try{Promise.resolve(Notification.requestPermission()).then(result=>{if(result!=='granted')showToast('Notification permission was not granted');done(result==='granted');}).catch(()=>done(false));}catch(e){done(false);}
}

// --- B3/B4: set rows, prefill from last time, set types ---
function suggestedSetsFor(name){
 let previous=null;try{previous=previousExercisePerformance(name);}catch(e){console.warn('Previous exercise data unavailable:',e);}
 if(previous&&previous.sets.length)return {fromHistory:true,sets:previous.sets.slice(0,20).map(s=>({kg:Number(s.kg)||0,reps:Math.max(1,Math.round(Number(s.reps))||1),type:setTypeOf(s),done:false,auto:true}))};
 return {fromHistory:false,sets:[0,1,2].map(()=>({kg:0,reps:10,type:'normal',done:false,auto:true}))};
}
function setRowMarkup(w,i,j,x){
 const type=setTypeOf(x),info=SET_TYPE_INFO[type],auto=!!x.auto&&!x.done,n=j+1,at=' data-i="'+i+'" data-j="'+j+'"';
 const shown=kgToDisplay(x.kg,2),hint=auto?', suggested '+shown+' '+weightUnitName()+' for '+Number(x.reps)+' reps':'';
 return '<div class="setrow'+(type!=='normal'?' set-'+type:'')+(auto?' set-auto':'')+'">'+
  '<button type="button" class="set-type-btn" data-set-action="type"'+at+' aria-label="Set '+n+' type: '+info.label+'. Change set type" title="'+info.label+' — tap to change">'+(info.short||n)+'</button>'+
  '<input type="number" inputmode="decimal" min="0" step="0.5" value="'+(auto?'':shown)+'" placeholder="'+(auto&&shown>0?shown:weightUnit())+'" data-set-field="kg"'+at+' aria-label="'+esc(w.name)+' set '+n+' weight in '+weightUnitName()+hint+'">'+
  '<input type="number" inputmode="numeric" min="1" step="1" value="'+(auto?'':Number(x.reps))+'" placeholder="'+(auto?Number(x.reps):'reps')+'" data-set-field="reps"'+at+' aria-label="'+esc(w.name)+' set '+n+' reps'+hint+'">'+
  '<button type="button" class="check-btn '+(x.done?'done':'')+'" data-set-action="done"'+at+' aria-pressed="'+!!x.done+'" aria-label="Set '+n+' done'+(auto?' — accept suggested values':'')+'">'+(x.done?'✓':'')+'</button>'+
  '<button type="button" class="btn btn-icon-only" data-set-action="remove"'+at+' aria-label="Remove set '+n+'">−</button>'+setEstimateMarkup(i,j,x)+'</div>';
}
function exerciseCardMarkup(w,i){
 const previous=previousExercisePerformance(w.name),best=previous?bestPreviousSet(previous.sets.filter(s=>setTypeOf(s)!=='warmup')):null;
 const lastLine=previous?'Last time · '+esc(previous.date)+': '+previous.sets.slice(0,8).map(s=>{const t=setTypeOf(s);return (t!=='normal'?SET_TYPE_INFO[t].short+' ':'')+esc(fmtWeight(s.kg,2))+' × '+esc(Number(s.reps));}).join(', ')+(best?' · best '+format1RM(best.kg,best.reps)+' e1RM':''):'No previous performance yet. Estimated 1RM updates as you enter weight and reps.';
 const pending=w.setList.some(x=>x.auto&&!x.done);
 return '<div class="panel" style="margin-bottom:12px"><div class="section-title"><span>'+(i+1)+'. '+esc(w.name)+' <small class="sub">'+esc(w.muscle)+'</small></span><span class="row-wrap"><button type="button" class="btn" data-ex-card-action="details" data-i="'+i+'" aria-label="Details for '+esc(w.name)+'">ⓘ<span class="card-btn-label"> Details</span></button>'+(w.setList.some(s=>s.done)?'':'<button type="button" class="btn" data-ex-card-action="swap" data-i="'+i+'" aria-label="Swap '+esc(w.name)+' for another exercise">⇄<span class="card-btn-label"> Swap</span></button>')+'<button type="button" class="btn" data-ex-card-action="add-set" data-i="'+i+'">+ Set</button><button type="button" class="btn btn-icon-only" style="color:var(--danger)" aria-label="Remove '+esc(w.name)+'" data-ex-card-action="remove" data-i="'+i+'">✕</button></span></div>'+
  '<div class="setrow sub" aria-hidden="true"><span>Set</span><span>'+weightUnit()+'</span><span>Reps</span><span>Done</span><span></span></div>'+
  planLineMarkup(w)+w.setList.map((x,j)=>setRowMarkup(w,i,j,x)).join('')+
  '<div class="set-tools"><small>'+lastLine+'</small><span class="row-wrap">'+(pending?'<button type="button" class="btn" data-ex-card-action="accept" data-i="'+i+'">✓ Use suggested values</button>':'')+(best?'<button type="button" class="btn" data-ex-card-action="best" data-i="'+i+'">↺ Use previous best</button>':'')+'</span></div>'+
  '<div class="sub" style="margin-top:6px">Volume: <span id="exVolume-'+i+'">'+volumeNumber(vol(w))+'</span> '+weightUnit()+' <span class="sub">· warm-up sets (W) are not counted</span></div></div>';
}
function liveStatsMarkup(){const t=sessionTotals();return t.exercises?'<div class="stat-row"><div class="stat"><b>'+volumeNumber(t.volume)+'</b><span>'+weightUnit()+' volume</span></div><div class="stat"><b>'+t.setsDone+'/'+t.setsTotal+'</b><span>sets done</span></div><div class="stat"><b>'+t.reps+'</b><span>reps done</span></div><div class="stat"><b>'+t.exercises+'</b><span>exercises</span></div></div>':'';}
// Targeted refresh used while typing: totals only, never the set inputs themselves.
function updateTrainingTotals(){
 const live=$('liveStats');if(live)live.innerHTML=liveStatsMarkup();
 (state.workouts||[]).forEach((w,i)=>{const el=$('exVolume-'+i);if(el)el.textContent=volumeNumber(vol(w));});
 renderSessionChrome();
}
let draftSaveTimer=null;
function flushDraftSave(){if(!draftSaveTimer)return;clearTimeout(draftSaveTimer);draftSaveTimer=null;persistLocalState();queueCloudStateSave();}
function scheduleDraftSave(){clearTimeout(draftSaveTimer);draftSaveTimer=setTimeout(()=>{draftSaveTimer=null;persistLocalState();queueCloudStateSave();},400);}
function refreshTraining(){flushDraftSave();persistLocalState();queueCloudStateSave();try{renderTrainingLog();}catch(e){console.error('Workout list refresh failed:',e);}try{renderDashboard();}catch(e){console.warn('Dashboard refresh failed:',e);}}
function cycleSetType(i,j){const x=state.workouts[i]?.setList?.[j];if(!x)return;x.type=SET_TYPES[(SET_TYPES.indexOf(setTypeOf(x))+1)%SET_TYPES.length];refreshTraining();showToast('Set '+(j+1)+': '+SET_TYPE_INFO[x.type].label);}
function acceptSuggestedSets(i){const w=state.workouts[i];if(!w)return;w.setList.forEach(x=>{x.auto=false;});syncW(w);refreshTraining();showToast('Suggested values applied');}

// --- B5/B6/G1: session chrome (header chip, resume banner, dashboard hero) ---
let resumeBannerOpen=false;
function renderSessionChrome(){
 const active=!!state.session,t=sessionTotals(),chip=$('sessionChip');
 document.documentElement.classList.toggle('session-active',active);
 if(chip){chip.hidden=!active;if(active){$('sessionChipClock').textContent=clock();$('sessionChipMeta').textContent=fmtVolume(t.volume)+' · '+t.setsDone+' '+(t.setsDone===1?'set':'sets');chip.setAttribute('aria-label','Workout in progress: '+volumeNumber(t.volume)+' '+weightUnitName()+', '+t.setsDone+' sets done. Open workout');}}
 const banner=$('resumeBanner');
 if(banner){if(!active)resumeBannerOpen=false;banner.hidden=!(active&&resumeBannerOpen);if(!banner.hidden)$('resumeBannerText').textContent='Started '+new Date(state.session.start).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})+' · '+t.setsDone+' of '+t.setsTotal+' sets done. Everything you logged was saved.';}
 renderWorkoutHero();
}
function todaysFinishedSession(){const today=dayKey();return (state.sessions||[]).find(s=>s&&s.date===today)||null;}
function renderWorkoutHero(){
 const host=$('workoutHero');if(!host)return;
 const t=sessionTotals(),done=todaysFinishedSession(),wi=weekInfo();
 let title,sub,buttons;
 if(state.session){title='Workout in progress';sub='<span id="heroClock">'+clock()+'</span> · '+t.setsDone+'/'+t.setsTotal+' sets · '+fmtVolume(t.volume);buttons='<button type="button" class="btn btn-primary hero-btn" data-hero-action="resume">▶ Resume workout</button>';}
 else if(done){title='Done today ✓';sub=(done.mins||0)+' min · '+fmtVolume(done.vol||0)+' · '+(done.sets||0)+' sets · '+wi.n+'/'+wi.g+' workouts this week';buttons='<button type="button" class="btn btn-primary hero-btn" data-hero-action="summary">View summary</button><button type="button" class="btn" data-hero-action="start">Start another workout</button>';}
 else{const today=deluxeEnabled()&&!(state.workouts||[]).length?planDayForDate(state.deluxe&&state.deluxe.plans,new Date()):null;title='Ready to train?';sub=wi.n+'/'+wi.g+' workouts this week · '+wi.st+'-week streak'+(today?' · today\'s plan: '+esc(today.plan.name)+' — '+esc(today.day.day):'');buttons=(today?'<button type="button" class="btn btn-primary hero-btn" data-hero-action="plan">▶ Start today\'s plan</button><button type="button" class="btn" data-hero-action="start">Start an empty workout</button>':'<button type="button" class="btn btn-primary hero-btn" data-hero-action="start">▶ Start workout</button>');}
 host.innerHTML='<div><div class="eyebrow">Today\'s workout</div><h2 class="hero-title">'+title+'</h2><p class="sub">'+sub+'</p></div><div class="row-wrap">'+buttons+'</div>';
}
function startWorkoutNow(){
 if(!state.session){state.session={start:Date.now(),xpStart:Number(state.game.xp)||0};saveState();showToast('Workout started — good luck! 💪');}
 goToTraining();
}
function summaryFromSession(s){
 const plan=s.plan||null;
 const muscles=[...new Set((s.exercises||[]).map(e=>String(e.muscle||'').trim().toLowerCase()).filter(Boolean))];
 return {id:s.id||'',date:s.date,mins:s.mins||0,vol:s.vol||0,sets:s.sets||0,reps:s.reps||0,ex:s.ex||0,names:(s.names||[]).slice(),prs:(s.prs||[]).map(p=>({name:p.name,kg:p.kg,reps:p.reps})),muscles,xp:s.xp||0,plan};
}
function showSessionSummary(){goToTraining();const el=$('sessionSummary');if(el&&el.firstElementChild){el.scrollIntoView({behavior:reducedMotion()?'auto':'smooth',block:'start'});el.firstElementChild.focus({preventScroll:true});}}
function viewTodaySummary(){const s=todaysFinishedSession();if(!s)return showToast('No finished workout today yet');state.lastSummary=summaryFromSession(s);saveState();showSessionSummary();}

// --- G3: post-workout summary ---
function exerciseRecordE1RM(name){
 const key=String(name||'').trim().toLowerCase();let best=0;
 (state.sessions||[]).forEach(s=>(s.exercises||[]).forEach(e=>{if(String(e.name||'').trim().toLowerCase()!==key)return;(e.sets||[]).forEach(x=>{if(setTypeOf(x)!=='warmup')best=Math.max(best,calculate1RM(x.kg,x.reps));});}));
 (state.prs||[]).forEach(p=>{if(String(p.name||'').trim().toLowerCase()===key)best=Math.max(best,calculate1RM(p.weight,p.reps));});
 return best;
}
// A PR is a best non-warm-up set that beats an existing record for that exercise (first-ever logs are not PRs).
function detectSessionPRs(exercises){
 const out=[];
 (exercises||[]).forEach(e=>{const top=bestPreviousSet((e.sets||[]).filter(x=>setTypeOf(x)!=='warmup'&&Number(x.kg)>0&&Number(x.reps)>0));if(!top)return;const before=exerciseRecordE1RM(e.name);if(before>0&&calculate1RM(top.kg,top.reps)>before)out.push({name:e.name,kg:Number(top.kg),reps:Number(top.reps)});});
 return out;
}
function workoutSummaryText(m){
 const lines=['My Gymplified workout · '+m.date,(m.mins||0)+' min · '+fmtVolume(m.vol||0)+' total volume',(m.sets||0)+' sets · '+(m.reps||0)+' reps · '+(m.ex||0)+' exercises'];
 if((m.prs||[]).length)lines.push('New PRs: '+m.prs.map(p=>p.name+' '+fmtWeight(p.kg,2)+' × '+p.reps).join(', '));
 if((m.muscles||[]).length)lines.push('Muscles worked: '+m.muscles.join(', '));
 return lines.join('\n');
}
async function shareWorkoutSummary(){
 const m=state.lastSummary;if(!m)return;const text=workoutSummaryText(m);
 try{if(navigator.share){await navigator.share({title:'Gymplified workout',text});return;}}catch(e){if(e&&e.name==='AbortError')return;}
 try{await navigator.clipboard.writeText(text);showToast('Workout summary copied');}catch(e){showToast('Sharing is not available in this browser');}
}
function sessionSummaryMarkup(){
 const m=state.lastSummary;if(!m)return '';
 const wi=weekInfo(),i=(state.sessions||[]).findIndex(s=>s.id&&s.id===m.id),p=state.sessions[(i>=0?i:0)+1],prs=m.prs||[],muscles=m.muscles||[];
 const stat=(value,label)=>'<div class="stat"><b>'+value+'</b><span>'+label+'</span></div>';
 return '<div class="panel summary-panel" tabindex="-1" role="region" aria-label="Workout summary" style="margin-bottom:20px"><div class="section-title"><span>🎉 Workout complete</span><span class="row-wrap"><button type="button" class="btn btn-primary" data-summary-action="share">Share</button><button type="button" class="btn" data-summary-action="dismiss">Dismiss</button></span></div>'+
  '<div class="stat-row">'+stat(Number(m.mins)+' min','duration')+stat(fmtVolume(m.vol),'total volume')+stat(Number(m.sets),'sets')+stat(Number(m.reps),'reps')+stat(Number(m.ex),'exercises')+stat('+'+Number(m.xp||0),'XP earned')+'</div>'+
  '<div class="sub-h">PRs hit</div>'+(prs.length?'<div class="tag-list">'+prs.map(x=>'<span class="tag primary">🏆 '+esc(x.name)+' · '+esc(fmtWeight(x.kg,2))+' × '+esc(Number(x.reps))+'</span>').join('')+'</div>':'<p class="sub">No new PRs this time — beat a previous best set to earn one.</p>')+
  (m.plan&&m.plan.planned?'<div class="sub-h">Plan</div><p class="plan-result">📋 '+esc(m.plan.name||'Plan')+(m.plan.day?' · '+esc(m.plan.day):'')+': <strong>'+Number(m.plan.completed)+' of '+Number(m.plan.planned)+'</strong> exercise'+(m.plan.planned===1?'':'s')+' done as planned'+(m.plan.completed===m.plan.planned?' ✓':'')+'</p>':'')+
  '<div class="sub-h">Muscles worked</div>'+(muscles.length?'<div class="tag-list">'+muscles.map(x=>'<span class="tag">'+esc(x)+'</span>').join('')+'</div>':'<p class="sub">No muscle groups recorded.</p>')+
  '<p class="sub" style="margin-top:12px">'+(p&&p.vol?(m.vol>=p.vol?'▲ ':'▼ ')+Math.abs(Math.round((m.vol-p.vol)/p.vol*100))+'% volume vs your previous session · ':'')+wi.n+'/'+wi.g+' workouts this week · '+esc((m.names||[]).join(', '))+'</p></div>';
}

// --- B21/B22: forgiving exercise search, favourites and recents ---
const EX_SYNONYMS=[['romanian deadlift','rdl'],['overhead press','ohp'],['overhead press','military press'],['dumbbell','db'],['barbell','bb'],['kettlebell','kb'],['bodyweight','bw'],['pull up','pullup'],['chin up','chinup'],['push up','pushup'],['push up','press up'],['sit up','situp'],['pulldown','pull down'],['pushdown','push down'],['triceps','tricep'],['biceps','bicep'],['shoulders','delts'],['shoulders','delt'],['quadriceps','quads'],['quadriceps','quad'],['hamstrings','hams'],['chest','pecs'],['glutes','glute'],['calves','calf'],['leg curl','hamstring curl'],['skull crusher','skullcrusher'],['skull crushers','skullcrushers'],['fly','flye'],['fly','flyes'],['fly','flys'],['bench press','benchpress'],['hip thrust','hip thruster'],['ez bar','ezbar'],['band','resistance band'],['farmers carry','farmer walk'],['farmers carry','farmers walk'],['cable crossover','cable cross over'],['glute drive','glute drive machine'],['lats','lat']]
 .sort((a,b)=>b[1].length-a[1].length);
function exNormalize(text){
 let s=' '+String(text||'').toLowerCase().replace(/['’]/g,'').replace(/[^a-z0-9]+/g,' ').trim()+' ';
 EX_SYNONYMS.forEach(([canonical,alias])=>{const from=' '+alias+' ';while(s.includes(from))s=s.replace(from,' '+canonical+' ');});
 return s.trim();
}
function exStem(token){return token.length>3&&token.endsWith('s')&&!token.endsWith('ss')?token.slice(0,-1):token;}
function exEditDistance(a,b,max){
 if(Math.abs(a.length-b.length)>max)return max+1;
 let before=null,prev=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){const row=[i];let low=i;
  for(let j=1;j<=b.length;j++){let v=Math.min(prev[j]+1,row[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));if(before&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])v=Math.min(v,before[j-2]+1);row[j]=v;low=Math.min(low,v);}
  if(low>max)return max+1;before=prev;prev=row;}
 return prev[b.length];
}
function exTokenScore(q,t){
 if(q===t)return 3;if(exStem(q)===exStem(t))return 2.8;
 if(q.length>=2&&t.startsWith(q))return 2;if(q.length>=3&&t.includes(q))return 1.5;
 if(q.length>=4){const max=q.length>=8?2:1;if(exEditDistance(q,t,max)<=max)return 1;if(q.length>=5&&t.length>q.length&&exEditDistance(q,t.slice(0,q.length),1)<=1)return 0.8;}
 return 0;
}
const exSearchIndex=new Map();
function exIndexFor(x){
 const key=x.id+'|'+x.name+'|'+x.eq+'|'+x.pm;let entry=exSearchIndex.get(key);
 if(!entry){const name=exNormalize(x.name),extra=exNormalize(x.eq+' '+x.pm+' '+(Array.isArray(x.sec)?x.sec:[]).join(' '));entry={name,nameTokens:name.split(' ').filter(Boolean),extraTokens:extra.split(' ').filter(Boolean),compact:name.replace(/ /g,'')};exSearchIndex.set(key,entry);}
 return entry;
}
// Returns 0 for no match; higher is better. Text relevance first, then exact name, favourites and recent use.
function exMatchScore(x,query){
 const q=exNormalize(query);if(!q)return 1;
 const idx=exIndexFor(x),tokens=q.split(' ');let total=0,matched=true;
 for(const token of tokens){let best=0;for(const t of idx.nameTokens)best=Math.max(best,exTokenScore(token,t));for(const t of idx.extraTokens)best=Math.max(best,exTokenScore(token,t)*0.5);if(!best){matched=false;break;}total+=best;}
 const compact=q.replace(/ /g,'');
 if(!matched){if(compact.length>=3&&idx.compact.includes(compact))total=1.5*tokens.length;else return 0;}
 total=total/tokens.length;
 if(idx.name===q)total+=100;else if(idx.name.startsWith(q))total+=3;else if(idx.compact===compact)total+=100;
 return total;
}
function recentExerciseRanks(){
 const ranks=new Map(),add=name=>{const key=String(name||'').trim().toLowerCase();if(key&&!ranks.has(key))ranks.set(key,ranks.size);};
 (state.workouts||[]).slice().reverse().forEach(w=>add(w.name));
 for(const s of (state.sessions||[]).slice(0,30)){(s.exercises||[]).forEach(e=>add(e.name));if(ranks.size>=40)break;}
 return ranks;
}
function isFavEx(id){return !!(state.exFav&&state.exFav[id]);}
function searchExercises(list,query,favourites,recents){
 return list.map(x=>{const text=exMatchScore(x,query);if(!text)return null;const rank=recents.get(x.name.trim().toLowerCase());return {x,score:text+(favourites(x.id)?0.6:0)+(rank!==undefined?Math.max(0.1,0.5-rank*0.02):0)};}).filter(Boolean)
  .sort((a,b)=>b.score-a.score||a.x.name.localeCompare(b.x.name)).map(r=>r.x);
}
function toggleFavEx(id){
 if(!state.exFav||typeof state.exFav!=='object')state.exFav={};
 const on=!state.exFav[id];if(on&&Object.values(state.exFav).filter(Boolean).length>=EX_FAV_MAX)return showToast('You can keep up to '+EX_FAV_MAX+' favourites');
 state.exFav[id]=on?1:0;persistLocalState();queueCloudStateSave();renderPicker();
 const row=[...document.querySelectorAll('#exResults .ex-row')].find(r=>r.dataset.exId===id);row?.querySelector('.ex-fav-btn')?.focus();
 const x=allEx().find(e=>e.id===id);showToast((x?x.name:'Exercise')+(on?' added to favourites':' removed from favourites'));
}
function exRowMarkup(x){
 const fav=isFavEx(x.id);
 return '<div class="ex-row" role="listitem" data-ex-id="'+esc(x.id)+'"><button type="button" class="ex-fav-btn" data-ex-action="fav" aria-pressed="'+fav+'" aria-label="'+(fav?'Remove '+esc(x.name)+' from favourites':'Add '+esc(x.name)+' to favourites')+'">'+(fav?'★':'☆')+'</button><button type="button" class="ex-preview-button" data-ex-action="preview" aria-label="Preview '+esc(x.name)+'"><strong>'+esc(x.name)+'</strong><br><span class="sub">'+esc(x.eq)+' · '+esc(x.pm)+(x.sec.length?' + '+x.sec.map(esc).join(', '):'')+'</span></button><button type="button" class="btn btn-primary" data-ex-action="add" aria-label="Add '+esc(x.name)+'">+ Add</button></div>';
}
function renderPicker(){
 const raw=$('exSearch').value,q=raw.trim(),m=$('exMuscle').value,e=$('exEquip').value,recents=recentExerciseRanks();
 const pool=allEx().filter(x=>(!m||x.pm===m||(Array.isArray(x.sec)&&x.sec.includes(m)))&&(!e||x.eq===e));
 const section=label=>'<div class="ex-section" role="listitem">'+label+'</div>';
 let html='',count=0;
 if(exNormalize(q)){const r=searchExercises(pool,q,isFavEx,recents);count=r.length;html=r.slice(0,80).map(exRowMarkup).join('');}
 else{
  const byName=(a,b)=>a.name.localeCompare(b.name),favs=pool.filter(x=>isFavEx(x.id)).sort(byName);
  const recent=pool.filter(x=>!isFavEx(x.id)&&recents.has(x.name.trim().toLowerCase())).sort((a,b)=>recents.get(a.name.trim().toLowerCase())-recents.get(b.name.trim().toLowerCase())).slice(0,8);
  const pinned=new Set(favs.concat(recent).map(x=>x.id)),others=pool.filter(x=>!pinned.has(x.id)).sort(byName);
  count=pool.length;
  html=(favs.length?section('★ Favourites')+favs.map(exRowMarkup).join(''):'')+(recent.length?section('Recent')+recent.map(exRowMarkup).join(''):'')+((favs.length||recent.length)&&others.length?section('All exercises'):'')+others.slice(0,80).map(exRowMarkup).join('');
 }
 $('exResults').innerHTML=count?html:'<div class="empty-box"><p>No match for “'+esc(q)+'”. Add it as a custom exercise below.</p></div>';
 $('customBox').open=!count;if(!count&&!$('cName').value)$('cName').value=raw.trim().slice(0,60);
}

// --- listeners (no inline handlers) ---
function initWorkoutControls(){
 const list=$('trainingLogList');
 if(list){
  list.addEventListener('click',e=>{
   const b=e.target.closest('button');if(!b||!list.contains(b))return;const i=Number(b.dataset.i),j=Number(b.dataset.j);
   if(b.dataset.setAction==='type')cycleSetType(i,j);else if(b.dataset.setAction==='done')toggleSet(i,j);else if(b.dataset.setAction==='remove')removeSet(i,j);
   else if(b.dataset.exCardAction==='add-set')addSet(i);else if(b.dataset.exCardAction==='remove')deleteWorkout(i);else if(b.dataset.exCardAction==='accept')acceptSuggestedSets(i);else if(b.dataset.exCardAction==='details')openExerciseSheet(state.workouts[i]&&state.workouts[i].name);else if(b.dataset.exCardAction==='swap')openExerciseSheet(state.workouts[i]&&state.workouts[i].name,{swapIndex:i});else if(b.dataset.exCardAction==='best')applyPreviousBest(i);
  });
  list.addEventListener('input',e=>{const f=e.target.dataset&&e.target.dataset.setField;if(f)updateSetEstimate(Number(e.target.dataset.i),Number(e.target.dataset.j),f,e.target.value);});
  list.addEventListener('change',e=>{const f=e.target.dataset&&e.target.dataset.setField;if(f)setVal(Number(e.target.dataset.i),Number(e.target.dataset.j),f,e.target.value,e.target);});
 }
 const results=$('exResults');
 if(results){
  let lastPreview='';const preview=e=>{const b=e.target.closest&&e.target.closest('.ex-preview-button');const row=b&&b.closest('[data-ex-id]');if(row&&row.dataset.exId!==lastPreview){lastPreview=row.dataset.exId;previewEx(lastPreview);}};
  results.addEventListener('click',e=>{const b=e.target.closest('button[data-ex-action]'),row=b&&b.closest('[data-ex-id]');if(!row)return;const id=row.dataset.exId;if(b.dataset.exAction==='fav')toggleFavEx(id);else if(b.dataset.exAction==='add')addEx(id);else{lastPreview=id;previewEx(id);}});
  results.addEventListener('focusin',preview);results.addEventListener('mouseover',preview);
 }
 $('restBar')?.addEventListener('click',e=>{const a=e.target.closest('button')?.dataset.restAction;if(a==='minus')adjustRest(-15);else if(a==='plus')adjustRest(15);else if(a==='skip')stopRest();});
 $('restAutoSelect')?.addEventListener('change',e=>{const v=e.target.value;if(v==='custom'){e.target.dataset.custom='1';state.settings.restSeconds=Math.max(5,restSetting()||REST_DEFAULT_SECONDS);}else{delete e.target.dataset.custom;state.settings.restSeconds=Number(v)||0;}saveWorkoutSettings();showToast(restSetting()?'Rest timer starts automatically: '+formatClockSeconds(restSetting()):'Automatic rest timer off');});
 $('restCustomSeconds')?.addEventListener('change',e=>{const v=Math.round(Number(e.target.value));if(!(v>=5&&v<=REST_SECONDS_MAX)){showToast('Custom rest must be 5–'+REST_SECONDS_MAX+' seconds');e.target.value=restSetting()||REST_DEFAULT_SECONDS;return;}state.settings.restSeconds=v;saveWorkoutSettings();showToast('Rest timer set to '+formatClockSeconds(v));});
 $('restBeepToggle')?.addEventListener('change',e=>{state.settings.restBeep=e.target.checked;if(e.target.checked)unlockRestAudio();saveWorkoutSettings();});
 $('restNotifyToggle')?.addEventListener('change',e=>setRestNotify(e.target.checked));
 $('sessionChip')?.addEventListener('click',goToTraining);
 $('resumeBanner')?.addEventListener('click',e=>{const a=e.target.closest('button')?.dataset.resumeAction;if(!a)return;resumeBannerOpen=false;renderSessionChrome();if(a==='resume')goToTraining();});
 $('workoutHero')?.addEventListener('click',e=>{const a=e.target.closest('button')?.dataset.heroAction;if(a==='start')startWorkoutNow();else if(a==='resume')goToTraining();else if(a==='summary')viewTodaySummary();});
 $('sessionSummary')?.addEventListener('click',e=>{const a=e.target.closest('button')?.dataset.summaryAction;if(a==='share')shareWorkoutSummary();else if(a==='dismiss'){state.lastSummary=null;saveState();}});
 // B5: never lose typed sets — flush pending edits when the tab is hidden or closed.
 addEventListener('pagehide',flushDraftSave);document.addEventListener('visibilitychange',()=>{if(document.hidden)flushDraftSave();else if(restTimer)tickRest();});
 resumeBannerOpen=!!state.session;restoreRestTimer();syncRestSettingsUI();renderSessionChrome();
}

// ===== Batch 3: units, week start, profile, onboarding, settings sections, backup reminders =====
// Units are display-only: weights are stored in kg, distances in km, heights in cm.
function weightUnit(){return state.settings&&state.settings.weightUnit==='lb'?'lb':'kg';}
function weightUnitName(){return weightUnit()==='lb'?'pounds':'kilograms';}
function kgToDisplay(kg,dp=1){const lb=weightUnit()==='lb',f=10**(lb?Math.min(dp,1):dp);return Math.round((Number(kg)||0)/(lb?KG_PER_LB:1)*f)/f;}
function displayToKg(value){return weightUnit()==='lb'?value*KG_PER_LB:value;}
function fmtWeight(kg,dp=1){return kgToDisplay(kg,dp).toLocaleString(undefined,{maximumFractionDigits:dp})+' '+weightUnit();}
function volumeNumber(kg){return Math.round((Number(kg)||0)/(weightUnit()==='lb'?KG_PER_LB:1)).toLocaleString();}
function fmtVolume(kg){return volumeNumber(kg)+' '+weightUnit();}
function distanceUnit(){return state.settings&&state.settings.distanceUnit==='mi'?'mi':'km';}
function fmtDistance(km){return ((Number(km)||0)/(distanceUnit()==='mi'?KM_PER_MI:1)).toFixed(2)+' '+distanceUnit();}
function heightUnit(){return state.settings&&state.settings.heightUnit==='ftin'?'ftin':'cm';}
function cmToFeetInches(cm){const total=Math.round((Number(cm)||0)/CM_PER_IN);return {ft:Math.floor(total/12),inches:total%12};}
function feetInchesToCm(ft,inches){return ((Number(ft)||0)*12+(Number(inches)||0))*CM_PER_IN;}
function fmtHeight(cm){if(!(cm>0))return '—';if(heightUnit()==='ftin'){const h=cmToFeetInches(cm);return h.ft+' ft '+h.inches+' in';}return Math.round(cm)+' cm';}
// C4: week start (Monday or Sunday) used by streaks, the weekly recap and weekly charts.
function weekStartsSunday(){return !!(state.settings&&state.settings.weekStart==='sun');}
function daysSinceWeekStart(date){return weekStartsSunday()?date.getDay():(date.getDay()+6)%7;}
function applyUnitLabels(){document.querySelectorAll('[data-weight-unit]').forEach(el=>{el.textContent=weightUnit();});}

// --- C5: optional profile and calorie estimate ---
const ACTIVITY_LEVELS={sedentary:{label:'Sedentary (little exercise)',factor:1.2},light:{label:'Light (1–3 days a week)',factor:1.375},moderate:{label:'Moderate (3–5 days a week)',factor:1.55},active:{label:'Active (6–7 days a week)',factor:1.725},very:{label:'Very active (physical job or twice a day)',factor:1.9}};
const GOAL_OPTIONS={cut:{label:'Lose fat (cut)',factor:0.85},maintain:{label:'Maintain',factor:1},bulk:{label:'Build muscle (bulk)',factor:1.1}};
// Mifflin-St Jeor estimate × activity × goal. Returns 0 when the profile is incomplete. An estimate, not advice.
function suggestCalories(profile){
 const p=profile||{},w=Number(p.weightKg),h=Number(p.heightCm),a=Number(p.age);
 if(!(w>0&&h>0&&a>0)||!ACTIVITY_LEVELS[p.activity])return 0;
 const offset=p.sex==='male'?5:p.sex==='female'?-161:-78;
 const maintenance=(10*w+6.25*h-5*a+offset)*ACTIVITY_LEVELS[p.activity].factor;
 const target=maintenance*(GOAL_OPTIONS[p.goal]||GOAL_OPTIONS.maintain).factor;
 return Math.max(1200,Math.min(6000,Math.round(target/50)*50));
}
function renderProfilePanel(){
 const host=$('profilePanel');if(!host)return;
 const p=state.profile||{},ftin=heightUnit()==='ftin',h=cmToFeetInches(p.heightCm),options=(map,current,empty)=>'<option value="">'+empty+'</option>'+Object.keys(map).map(k=>'<option value="'+k+'"'+(current===k?' selected':'')+'>'+map[k].label+'</option>').join('');
 const estimate=suggestCalories(p);
 host.innerHTML='<h3>Profile &amp; calorie estimate</h3><p>All optional. Used only to estimate a daily calorie target you can accept or ignore.</p><div class="form-grid">'+
  (ftin?'<div class="field"><label for="profileHeightFt">Height (ft)</label><input type="number" id="profileHeightFt" inputmode="numeric" min="1" max="8" step="1" value="'+(p.heightCm>0?h.ft:'')+'"></div><div class="field"><label for="profileHeightIn">Height (in)</label><input type="number" id="profileHeightIn" inputmode="numeric" min="0" max="11" step="1" value="'+(p.heightCm>0?h.inches:'')+'"></div>'
       :'<div class="field"><label for="profileHeightCm">Height (cm)</label><input type="number" id="profileHeightCm" inputmode="decimal" min="50" max="260" step="0.5" value="'+(p.heightCm>0?Math.round(p.heightCm*10)/10:'')+'"></div>')+
  '<div class="field"><label for="profileWeight">Bodyweight ('+weightUnit()+')</label><input type="number" id="profileWeight" inputmode="decimal" min="0" step="0.1" value="'+(p.weightKg>0?kgToDisplay(p.weightKg,1):'')+'"></div>'+
  '<div class="field"><label for="profileAge">Age</label><input type="number" id="profileAge" inputmode="numeric" min="13" max="100" step="1" value="'+(p.age>0?p.age:'')+'"></div>'+
  '<div class="field"><label for="profileSex">Formula basis</label><select id="profileSex"><option value="">Prefer not to say (average)</option><option value="male"'+(p.sex==='male'?' selected':'')+'>Male</option><option value="female"'+(p.sex==='female'?' selected':'')+'>Female</option></select></div>'+
  '<div class="field"><label for="profileGoal">Goal</label><select id="profileGoal">'+options(GOAL_OPTIONS,p.goal,'Not set')+'</select></div>'+
  '<div class="field"><label for="profileActivity">Activity level</label><select id="profileActivity">'+options(ACTIVITY_LEVELS,p.activity,'Not set')+'</select></div></div>'+
  '<div class="row-wrap"><button class="btn btn-primary" type="button" data-settings-action="save-profile">Save profile</button><button class="btn" type="button" data-settings-action="clear-profile">Clear profile</button></div>'+
  '<div class="calorie-estimate" role="status">'+(estimate?'<span><strong>Estimated target: '+estimate.toLocaleString()+' kcal/day</strong><br><span class="sub">Estimate only, from a standard formula. Your current target is '+Number(state.calTarget).toLocaleString()+' kcal — change it any time.</span></span>'+(estimate!==state.calTarget?'<button class="btn" type="button" data-settings-action="use-estimate">Use '+estimate.toLocaleString()+' kcal</button>':''):'<span class="sub">Add height, bodyweight, age and activity level to see an estimated calorie target.</span>')+'</div>';
}
function saveBodyProfile(){
 const num=id=>{const el=$(id);return el&&el.value!==''?Number(el.value):0;};
 const heightCm=heightUnit()==='ftin'?feetInchesToCm(num('profileHeightFt'),num('profileHeightIn')):num('profileHeightCm'),weightKg=displayToKg(num('profileWeight')),age=Math.round(num('profileAge'));
 if(heightCm&&!(heightCm>=50&&heightCm<=260))return showToast('Height must be between '+fmtHeight(50)+' and '+fmtHeight(260));
 if(weightKg&&!(weightKg>=20&&weightKg<=400))return showToast('Bodyweight must be between '+fmtWeight(20)+' and '+fmtWeight(400));
 if(age&&!(age>=13&&age<=100))return showToast('Age must be between 13 and 100');
 state.profile={heightCm:Math.round(heightCm*10)/10||0,weightKg:Math.round(weightKg*100)/100||0,age:age||0,sex:['male','female'].includes($('profileSex').value)?$('profileSex').value:'',goal:GOAL_OPTIONS[$('profileGoal').value]?$('profileGoal').value:'',activity:ACTIVITY_LEVELS[$('profileActivity').value]?$('profileActivity').value:''};
 saveState();renderProfilePanel();showToast('Profile saved');
}

// --- J2: backup reminders (device-local; a backup is a file on this device) ---
const BACKUP_AT_KEY='gymplified_last_backup_at',BACKUP_SNOOZE_KEY='gymplified_backup_snooze_until';
function readLocalNumber(key){try{return Number(localStorage.getItem(key))||0;}catch(e){return 0;}}
function lastBackupAt(){return readLocalNumber(BACKUP_AT_KEY);}
function backupAgeDays(now=Date.now()){const at=lastBackupAt();return at?Math.floor((now-at)/864e5):-1;}
function backupStatusText(){const days=backupAgeDays();return days<0?'You have not exported a backup on this device yet.':days===0?'Last backup: today.':'Last backup: '+days+' day'+(days===1?'':'s')+' ago.';}
// Remind after 30 days, or once there is real history that has never been backed up.
function backupReminderDue(now=Date.now()){
 if(readLocalNumber(BACKUP_SNOOZE_KEY)>now)return false;
 const days=backupAgeDays(now);
 return days<0?(state.sessions||[]).length>=3:days>=BACKUP_REMINDER_DAYS;
}
function markBackupDone(){try{localStorage.setItem(BACKUP_AT_KEY,String(Date.now()));localStorage.removeItem(BACKUP_SNOOZE_KEY);}catch(e){}renderBackupReminder();}
function snoozeBackupReminder(){try{localStorage.setItem(BACKUP_SNOOZE_KEY,String(Date.now()+7*864e5));}catch(e){}renderBackupReminder();showToast('We will remind you again in a week');}
function renderBackupReminder(){
 const banner=$('backupReminder'),status=$('backupStatus');
 if(status)status.textContent=backupStatusText();
 if(!banner)return;const due=backupReminderDue();banner.hidden=!due;
 if(due){const days=backupAgeDays();$('backupReminderText').textContent=days<0?'You have workout history but no backup yet. Export one so you can restore or move your data.':'Your last backup was '+days+' days ago. Export a fresh one to keep your data safe.';}
}

// --- C6: first-run onboarding (inline card, never blocks the app) ---
let onboardingStep=0,onboardingDraft=null;
function onboardingNeeded(){return !state.onboarded&&!hasLocalProgress(state);}
function renderOnboarding(){
 const host=$('onboardingPanel');if(!host)return;
 if(!onboardingNeeded()&&!onboardingDraft){host.hidden=true;host.innerHTML='';return;}
 if(!onboardingDraft)onboardingDraft={goal:(state.profile&&state.profile.goal)||'',weightUnit:weightUnit(),distanceUnit:distanceUnit(),waterUnit:waterUnit(),weeklyGoal:state.weeklyGoal||3};
 const d=onboardingDraft,choice=(group,value,label)=>'<button type="button" class="btn onboarding-choice" data-onboarding-set="'+group+'" data-value="'+value+'" aria-pressed="'+(String(d[group])===String(value))+'">'+label+'</button>';
 const steps=[
  '<h2 class="hero-title">What is your main goal?</h2><p class="sub">You can change this any time in Settings.</p><div class="row-wrap" role="group" aria-label="Main goal">'+choice('goal','cut','Lose fat')+choice('goal','maintain','Stay in shape')+choice('goal','bulk','Build muscle')+'</div>',
  '<h2 class="hero-title">Which units do you use?</h2><p class="sub">Units only change how numbers are shown.</p><div class="onboarding-units"><div class="row-wrap" role="group" aria-label="Weight unit"><span class="sub">Weight</span>'+choice('weightUnit','kg','kg')+choice('weightUnit','lb','lb')+'</div><div class="row-wrap" role="group" aria-label="Distance unit"><span class="sub">Distance</span>'+choice('distanceUnit','km','km')+choice('distanceUnit','mi','miles')+'</div><div class="row-wrap" role="group" aria-label="Water unit"><span class="sub">Water</span>'+choice('waterUnit','ml','ml')+choice('waterUnit','floz','fl oz')+'</div></div>',
  '<h2 class="hero-title">How many workouts a week?</h2><p class="sub">This is your weekly goal. Rest days never break a weekly streak.</p><div class="row-wrap" role="group" aria-label="Workouts per week">'+[2,3,4,5,6].map(n=>choice('weeklyGoal',n,String(n))).join('')+'</div>'];
 host.hidden=false;
 host.innerHTML='<div class="eyebrow">Welcome · step '+(onboardingStep+1)+' of '+steps.length+'</div>'+steps[onboardingStep]+
  '<div class="row-wrap onboarding-nav">'+(onboardingStep>0?'<button type="button" class="btn" data-onboarding-action="back">Back</button>':'')+'<button type="button" class="btn btn-primary" data-onboarding-action="next">'+(onboardingStep===steps.length-1?'Finish':'Next')+'</button><button type="button" class="btn onboarding-skip" data-onboarding-action="skip">Skip setup</button></div>';
}
function finishOnboarding(apply){
 const d=onboardingDraft;
 if(apply&&d){
  if(GOAL_OPTIONS[d.goal])state.profile=Object.assign({},state.profile,{goal:d.goal});
  state.settings.weightUnit=d.weightUnit==='lb'?'lb':'kg';state.settings.distanceUnit=d.distanceUnit==='mi'?'mi':'km';state.settings.waterUnit=d.waterUnit==='floz'?'floz':'ml';
  state.weeklyGoal=Math.max(1,Math.min(14,Math.round(Number(d.weeklyGoal))||3));
 }
 state.onboarded=true;onboardingDraft=null;onboardingStep=0;saveState();initGoals();
 showToast(apply?'You are set up. Add your height and weight in Settings for a calorie estimate.':'Setup skipped — you can change everything in Settings');
}

// --- J1: settings sections and jump links ---
function openSettingsSection(id){
 if(!document.getElementById('settings').classList.contains('active'))showScreen('settings',document.querySelector('nav button[data-screen="settings"]'));
 const section=document.getElementById(id);if(!section)return;
 section.scrollIntoView({behavior:reducedMotion()?'auto':'smooth',block:'start'});
 const heading=section.querySelector('h2');if(heading)heading.focus({preventScroll:true});
}
function syncSettingsControls(){
 const set=(id,value)=>{const el=$(id);if(el&&document.activeElement!==el)el.value=value;};
 set('weightUnitSelect',weightUnit());set('distanceUnitSelect',distanceUnit());set('heightUnitSelect',heightUnit());set('waterUnitSelect',waterUnit());set('weekStartSelect',weekStartsSunday()?'sun':'mon');
 set('gCal',state.calTarget);set('gWeek',state.weeklyGoal);set('gSpacing',state.settings.spacing||'normal');
 applyUnitLabels();
}
function saveCalorieTarget(){const c=parseInt($('gCal').value,10);if(!(c>=500&&c<=10000))return showToast('Calories must be 500–10000');state.calTarget=c;saveState();renderProfilePanel();showToast('Calorie target saved');}
function saveWeeklyGoal(){const wk=parseInt($('gWeek').value,10);if(!(wk>=1&&wk<=14))return showToast('Weekly goal must be 1–14');state.weeklyGoal=wk;saveState();showToast('Weekly goal saved');}
function setUnitSetting(key,value){
 const allowed={weightUnit:['kg','lb'],distanceUnit:['km','mi'],heightUnit:['cm','ftin'],weekStart:['mon','sun']};
 if(!allowed[key]||!allowed[key].includes(value))return;
 state.settings[key]=value;saveState();initGoals();
 showToast({weightUnit:'Weights shown in '+weightUnit(),distanceUnit:'Distances shown in '+distanceUnit(),heightUnit:'Height shown in '+(heightUnit()==='ftin'?'feet and inches':'centimetres'),weekStart:'Weeks start on '+(weekStartsSunday()?'Sunday':'Monday')}[key]);
}
function initSettingsControls(){
 const settings=$('settings');
 if(settings){
  settings.addEventListener('click',e=>{
   const jump=e.target.closest('a[data-settings-jump]');if(jump){e.preventDefault();openSettingsSection(jump.dataset.settingsJump);return;}
   const a=e.target.closest('button[data-settings-action]')?.dataset.settingsAction;if(!a)return;
   if(a==='save-calories')saveCalorieTarget();else if(a==='save-weekly')saveWeeklyGoal();else if(a==='save-profile')saveBodyProfile();
   else if(a==='clear-profile'){state.profile={heightCm:0,weightKg:0,age:0,sex:'',goal:'',activity:''};saveState();renderProfilePanel();showToast('Profile cleared');}
   else if(a==='use-estimate'){const n=suggestCalories(state.profile);if(n){state.calTarget=n;saveState();initGoals();showToast('Calorie target set to '+n.toLocaleString()+' kcal');}}
   else if(a==='export-backup')exportData();else if(a==='import-backup')$('importFile').click();
   else if(a==='open-account')showScreen('friends',document.querySelector('nav button[data-screen="friends"]'));
  });
  settings.addEventListener('change',e=>{
   const id=e.target.id,map={weightUnitSelect:'weightUnit',distanceUnitSelect:'distanceUnit',heightUnitSelect:'heightUnit',weekStartSelect:'weekStart'};
   if(map[id])setUnitSetting(map[id],e.target.value);
   else if(id==='waterUnitSelect')setWaterUnit(e.target.value);
   else if(id==='gSpacing'){state.settings.spacing=e.target.value==='wide'?'wide':'normal';saveState();}
   else if(id==='importFile'){importData(e.target.files[0]);e.target.value='';}
  });
 }
 $('restSettingsLink')?.addEventListener('click',()=>openSettingsSection('set-training'));
 $('backupReminder')?.addEventListener('click',e=>{const a=e.target.closest('button')?.dataset.backupAction;if(a==='export')exportData();else if(a==='snooze')snoozeBackupReminder();});
 $('onboardingPanel')?.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.onboardingSet){onboardingDraft[b.dataset.onboardingSet]=b.dataset.value;renderOnboarding();$('onboardingPanel').querySelector('[data-onboarding-set="'+b.dataset.onboardingSet+'"][data-value="'+b.dataset.value+'"]')?.focus();return;}
  const a=b.dataset.onboardingAction;
  if(a==='skip')finishOnboarding(false);else if(a==='back'){onboardingStep=Math.max(0,onboardingStep-1);renderOnboarding();}
  else if(a==='next'){if(onboardingStep>=2)finishOnboarding(true);else{onboardingStep++;renderOnboarding();}$('onboardingPanel').querySelector('.hero-title')?.setAttribute('tabindex','-1');$('onboardingPanel').querySelector('.hero-title')?.focus();}
 });
}

// ===== Batch 5: friends leaderboard, privacy, friend profiles, activity feed =====
// All numbers about friends come from Supabase functions that return aggregates only
// (supabase/migrations/20261111090000_...). Friends' raw progress is never downloaded.
const PRIVACY_FIELDS=[
 {key:'leaderboard',label:'Show me on friends\' leaderboards',hint:'Off = private mode. Your activity feed and profile still follow the settings below.'},
 {key:'workouts',label:'Workouts',hint:'How many workouts you finish, and workout posts in the feed.'},
 {key:'volume',label:'Training volume',hint:'Total weight lifted.'},
 {key:'streak',label:'Day streak',hint:''},
 {key:'level',label:'Level, XP and badges',hint:''},
 {key:'prs',label:'Personal records',hint:'Your recent PRs on your profile and in the feed.'}];
function privacyShares(key){return !(state.privacy&&state.privacy[key]===false);}
// The leaderboard week always starts on Monday so that friends compare the same week.
function leaderboardWeekKey(d=new Date()){const x=new Date(d);x.setHours(12,0,0,0);x.setDate(x.getDate()-(x.getDay()+6)%7);return dayKey(x);}
function msToLeaderboardReset(now=new Date()){const end=new Date(now);end.setHours(0,0,0,0);end.setDate(end.getDate()-(end.getDay()+6)%7+7);return end-now;}
const LEADERBOARD_TABS=[
 {key:'workouts',label:'Workouts',field:'workouts',show:v=>v+' workout'+(v===1?'':'s')},
 {key:'volume',label:'Volume',field:'volume_kg',show:v=>fmtVolume(v)},
 {key:'xp',label:'XP',field:'week_xp',show:v=>Number(v).toLocaleString()+' XP'},
 {key:'streak',label:'Streak',field:'streak',show:v=>v+' day'+(v===1?'':'s')}];
// Pure: highest first; ties share a rank; people hiding the metric go last without a rank.
function rankLeaderboard(rows,field){
 const shown=rows.filter(r=>r[field]!==null&&r[field]!==undefined).sort((a,b)=>Number(b[field])-Number(a[field])||String(a.display_name||a.username||'').localeCompare(String(b.display_name||b.username||'')));
 let rank=0,prev=null;
 const ranked=shown.map((r,i)=>{if(Number(r[field])!==prev){rank=i+1;prev=Number(r[field]);}return Object.assign({},r,{rank});});
 return ranked.concat(rows.filter(r=>r[field]===null||r[field]===undefined).map(r=>Object.assign({},r,{rank:null})));
}
let leaderboardRows=null,leaderboardTab='workouts',leaderboardError='',feedItems=null,feedError='',acceptedFriendCount=0,friendProfileTrigger=null;
function personName(p){return p.display_name||p.username||'Friend';}
async function loadFriendsCircle(){
 if(!currentUser||!sb)return;
 try{await flushCloudStateSave();}catch(e){}
 const [board,feed]=await Promise.all([
  sb.rpc('gymplified_friend_leaderboard',{p_week_start:leaderboardWeekKey()}),
  sb.rpc('gymplified_friend_feed',{p_since:shiftDay(dayKey(),-14)})]);
 leaderboardError=board.error?socialError(board.error):'';leaderboardRows=board.error?[]:(board.data||[]);
 feedError=feed.error?socialError(feed.error):'';feedItems=feed.error?[]:(feed.data||[]);
 renderLeaderboard();renderFeed();
}
function renderLeaderboard(){
 const host=$('friendLeaderboard');if(!host)return;
 if(!currentUser){host.hidden=true;return;}host.hidden=false;
 const tab=LEADERBOARD_TABS.find(t=>t.key===leaderboardTab)||LEADERBOARD_TABS[0];
 const tabs='<div class="lb-tabs" role="tablist" aria-label="Rank by">'+LEADERBOARD_TABS.map(t=>'<button type="button" role="tab" class="lb-tab" id="lbTab-'+t.key+'" data-lb-tab="'+t.key+'" aria-selected="'+(t.key===tab.key)+'" aria-controls="lbList" tabindex="'+(t.key===tab.key?0:-1)+'">'+t.label+'</button>').join('')+'</div>';
 let body;
 if(leaderboardRows===null)body='<p class="sub">Loading this week\'s leaderboard…</p>';
 else if(leaderboardError)body='<p class="account-message">'+esc(leaderboardError)+'</p><button class="btn" type="button" data-friends-action="reload">Try again</button>';
 else{
  const ranked=rankLeaderboard(leaderboardRows,tab.field),me=leaderboardRows.find(r=>r.is_self);
  body=(leaderboardRows.length<2?'<p class="sub">Add friends to compete. Only you and your accepted friends appear here — never strangers.</p>':'')+
   '<ol class="lb-list" id="lbList" role="tabpanel" aria-labelledby="lbTab-'+tab.key+'">'+ranked.map(r=>{const value=r[tab.field],hidden=value===null||value===undefined;
    return '<li><button type="button" class="lb-row'+(r.is_self?' me':'')+'" data-friend-profile="'+esc(r.user_id)+'" aria-label="'+esc((r.rank?'Rank '+r.rank+': ':'')+personName(r)+(r.is_self?' (you)':'')+', '+(hidden?'not shared':tab.show(value))+'. Open profile')+'">'+
     '<span class="lb-rank" aria-hidden="true">'+(r.rank?(r.rank<=3?['🥇','🥈','🥉'][r.rank-1]:r.rank):'–')+'</span>'+avatarMarkup(r,true)+
     '<span class="lb-name"><strong>'+esc(personName(r))+(r.is_self?' (you)':'')+'</strong><small>@'+esc(r.username||'')+(r.is_self&&r.is_private?' · hidden from friends':'')+'</small></span>'+
     '<span class="lb-value'+(hidden?' sub':'')+'" aria-hidden="true">'+(hidden?'Not shared':esc(tab.show(value)))+'</span></button></li>';}).join('')+'</ol>'+
   (me&&me.is_private?'<p class="sub">You are in private mode, so friends do not see you here. Change this in Settings → Privacy.</p>':'');
 }
 host.innerHTML='<div class="section-title"><span>This week\'s leaderboard</span><span class="sub">Resets Monday · '+formatCountdown(msToLeaderboardReset())+'</span></div>'+tabs+body+
  '<p class="sub lb-privacy-link"><a href="#set-privacy" data-settings-jump="set-privacy">What friends can see about you</a></p>';
}
function relativeDay(key){const today=dayKey();if(key===today)return 'Today';if(key===shiftDay(today,-1))return 'Yesterday';const d=new Date(key+'T12:00:00');return Number.isFinite(d.getTime())?d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'}):'';}
function feedText(item){
 const d=item.detail||{};
 if(item.kind==='pr')return 'set a PR: '+String(d.name||'Exercise')+' '+fmtWeight(Number(d.weight_kg)||0,2)+' × '+(Number(d.reps)||0);
 const parts=[];if(Number(d.mins)>0)parts.push(d.mins+' min');if(Number(d.exercises)>0)parts.push(d.exercises+' exercise'+(d.exercises===1?'':'s'));if(d.volume_kg!==null&&d.volume_kg!==undefined)parts.push(fmtVolume(d.volume_kg));
 return 'completed a workout'+(parts.length?' · '+parts.join(' · '):'');
}
const REACTIONS=[{key:'fire',emoji:'🔥',name:'Fire'},{key:'muscle',emoji:'💪',name:'Strong'}];
function renderFeed(){
 const host=$('friendFeed');if(!host)return;
 if(!currentUser){host.hidden=true;return;}host.hidden=false;
 let body;
 if(feedItems===null)body='<p class="sub">Loading activity…</p>';
 else if(feedError)body='<p class="account-message">'+esc(feedError)+'</p>';
 else if(!feedItems.length)body='<p class="sub">No activity in the last two weeks yet. Finished workouts and new PRs from you and your friends appear here.</p>';
 else body='<ul class="feed-list">'+feedItems.map(item=>{
  const owner=esc(item.owner_id),key=esc(item.activity_key),who=item.is_self?'You':personName(item);
  const reactions=REACTIONS.map(r=>{const n=Number(item[r.key+'_count'])||0,mine=!!item['my_'+r.key];
   return item.is_self?(n?'<span class="feed-count" role="img" aria-label="'+n+' '+r.name+' reaction'+(n===1?'':'s')+'">'+r.emoji+' '+n+'</span>':''):'<button type="button" class="btn feed-react'+(mine?' on':'')+'" data-react="'+r.key+'" data-owner="'+owner+'" data-key="'+key+'" aria-pressed="'+mine+'" aria-label="'+r.name+' reaction'+(mine?' (yours)':'')+', '+n+'">'+r.emoji+' '+n+'</button>';}).join('');
  return '<li class="feed-item"><button type="button" class="feed-avatar" data-friend-profile="'+owner+'" aria-label="Open '+esc(who)+'\'s profile">'+avatarMarkup(item,true)+'</button><div class="feed-body"><p><strong>'+esc(who)+'</strong> '+(item.kind==='pr'?'🏆 ':'')+esc(feedText(item))+'</p><small class="sub">'+esc(relativeDay(item.occurred_on))+'</small></div><div class="feed-reactions">'+reactions+'</div></li>';}).join('')+'</ul>';
 host.innerHTML='<div class="section-title"><span>Friend activity</span><span class="sub">Last 14 days</span></div>'+body;
}
async function toggleReaction(button){
 if(!sb||!currentUser||button.disabled)return;button.disabled=true;
 const owner=button.dataset.owner,key=button.dataset.key,kind=button.dataset.react;
 try{
  const r=await sb.rpc('gymplified_toggle_reaction',{p_owner:owner,p_activity_key:key,p_reaction:kind});if(r.error)throw r.error;
  const item=(feedItems||[]).find(x=>x.owner_id===owner&&x.activity_key===key);
  if(item){const was=!!item['my_'+kind];item['my_'+kind]=!!r.data;item[kind+'_count']=Math.max(0,(Number(item[kind+'_count'])||0)+(r.data===was?0:r.data?1:-1));}
  renderFeed();$('friendFeed').querySelector('[data-react="'+kind+'"][data-owner="'+CSS.escape(owner)+'"][data-key="'+CSS.escape(key)+'"]')?.focus();
 }catch(e){showToast(socialError(e));button.disabled=false;}
}
function badgeById(id){return BADGES.find(b=>b.id===id);}
async function openFriendProfile(userId,trigger){
 const dialog=$('friendProfileDialog');if(!dialog||!sb||!currentUser)return;
 friendProfileTrigger=trigger||null;
 $('friendProfileBody').innerHTML='<p class="sub">Loading profile…</p>';$('friendProfileTitle').textContent='Profile';
 try{if(!dialog.open)dialog.showModal();}catch(e){return;}
 const r=await sb.rpc('gymplified_friend_profile',{p_friend:userId,p_week_start:leaderboardWeekKey()});
 if(!dialog.open)return;
 if(r.error){$('friendProfileBody').innerHTML='<p class="account-message">'+esc(socialError(r.error))+'</p>';return;}
 const p=r.data||{},has=k=>Object.prototype.hasOwnProperty.call(p,k),hidden='<span class="sub">Not shared</span>';
 $('friendProfileTitle').textContent=personName(p)+(p.is_self?' (you)':'');
 const stat=(label,value)=>'<div class="stat"><b>'+value+'</b><span>'+label+'</span></div>';
 const badges=(has('badges')?(p.badges||[]):[]).map(badgeById).filter(Boolean);
 $('friendProfileBody').innerHTML='<div class="friend-profile-head">'+avatarMarkup(p,false)+'<div><div class="sub">@'+esc(p.username||'')+'</div>'+(has('level')?'<strong>Level '+Number(p.level)+' · '+esc(levelTitle(Number(p.level)))+'</strong>':'')+'</div></div>'+
  '<div class="stat-row">'+stat('day streak',has('streak')?'🔥 '+Number(p.streak):hidden)+stat('workouts this week',has('workouts_week')?Number(p.workouts_week):hidden)+stat('volume this week',has('volume_week_kg')?esc(fmtVolume(p.volume_week_kg)):hidden)+stat('workouts in total',has('workouts_total')?Number(p.workouts_total):hidden)+'</div>'+
  '<div class="sub-h">Badges</div>'+(has('badges')?(badges.length?'<ul class="friend-badges">'+badges.map(b=>'<li><span aria-hidden="true">'+b.icon+'</span> '+esc(b.name)+'</li>').join('')+'</ul>':'<p class="sub">No badges yet.</p>'):'<p class="sub">Not shared.</p>')+
  '<div class="sub-h">Recent personal records</div>'+(has('recent_prs')?((p.recent_prs||[]).length?'<ul class="friend-prs">'+p.recent_prs.map(x=>'<li><strong>'+esc(x.name||'Exercise')+'</strong> '+esc(fmtWeight(Number(x.weight_kg)||0,2))+' × '+Number(x.reps||0)+' <span class="sub">'+esc(relativeDay(String(x.date||'')))+'</span></li>').join('')+'</ul>':'<p class="sub">No PRs yet.</p>'):'<p class="sub">Not shared.</p>');
}
function renderPrivacySettings(){
 const host=$('friendPrivacy');if(!host)return;
 host.innerHTML='<h3>What friends can see</h3><p>Only accepted friends ever see these, and only as totals — never your detailed logs. Strangers see nothing.</p>'+
  PRIVACY_FIELDS.map(f=>'<label class="privacy-row" for="privacy-'+f.key+'"><input type="checkbox" id="privacy-'+f.key+'" data-privacy-key="'+f.key+'"'+(privacyShares(f.key)?' checked':'')+'><span><strong>'+esc(f.label)+'</strong>'+(f.hint?'<small class="sub">'+esc(f.hint)+'</small>':'')+'</span></label>').join('');
}
function initFriendsControls(){
 const screen=$('friends');
 if(screen){
  screen.addEventListener('click',e=>{
   const tab=e.target.closest('[data-lb-tab]');if(tab){leaderboardTab=tab.dataset.lbTab;renderLeaderboard();$('lbTab-'+leaderboardTab)?.focus();return;}
   const react=e.target.closest('button[data-react]');if(react){toggleReaction(react);return;}
   const profile=e.target.closest('[data-friend-profile]');if(profile){openFriendProfile(profile.dataset.friendProfile,profile);return;}
   const jump=e.target.closest('a[data-settings-jump]');if(jump){e.preventDefault();openSettingsSection(jump.dataset.settingsJump);return;}
   if(e.target.closest('[data-friends-action="reload"]'))loadFriendsCircle();
  });
  screen.addEventListener('keydown',e=>{
   const tab=e.target.closest&&e.target.closest('[data-lb-tab]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
   e.preventDefault();const i=LEADERBOARD_TABS.findIndex(t=>t.key===tab.dataset.lbTab),n=LEADERBOARD_TABS.length;
   leaderboardTab=LEADERBOARD_TABS[e.key==='Home'?0:e.key==='End'?n-1:(i+(e.key==='ArrowRight'?1:-1)+n)%n].key;renderLeaderboard();$('lbTab-'+leaderboardTab)?.focus();
  });
 }
 $('friendPrivacy')?.addEventListener('change',e=>{const key=e.target.dataset&&e.target.dataset.privacyKey;if(!key)return;state.privacy=Object.assign({},state.privacy,{[key]:e.target.checked});saveState();showToast(e.target.checked?'Shared with friends':'Hidden from friends');});
 const dialog=$('friendProfileDialog');
 $('friendProfileClose')?.addEventListener('click',()=>dialog.close());
 dialog?.addEventListener('close',()=>{const t=friendProfileTrigger;friendProfileTrigger=null;if(t&&document.contains(t))t.focus();});
}

// ===== Batch 6: nutrition and hydration =====
// F4: food reference table. Values per 100 g (per 100 ml for drinks) are general approximations;
// brands and preparation vary. Format: name|category|kcal|protein|carbs|fat|servings (label=grams;…)|ml
const FOOD_TABLE=`Chicken breast (cooked)|Protein|165|31|0|3.6|1 breast=170
Chicken thigh (cooked, skinless)|Protein|209|26|0|10.9|1 thigh=100
Turkey breast|Protein|135|29|0|1.6|1 portion=120
Lean beef mince (5%)|Protein|137|21|0|5|1 portion=125
Beef steak (sirloin, cooked)|Protein|200|28|0|9.5|1 steak=200
Pork loin (cooked)|Protein|196|27|0|9|1 chop=150
Ham (sliced)|Protein|145|21|1.5|6|1 slice=30
Bacon (cooked)|Protein|541|37|1.4|42|1 rasher=10
Salmon|Protein|208|20.4|0|13.4|1 fillet=125
Tuna in spring water|Protein|116|25.5|0|0.8|1 can, drained=112
Cod (cooked)|Protein|105|23|0|0.9|1 fillet=150
Prawns (cooked)|Protein|99|24|0.2|0.3|1 portion=100
Egg|Protein|143|12.6|0.7|9.5|1 large egg=50;2 large eggs=100
Egg white|Protein|52|10.9|0.7|0.2|1 egg white=33
Tofu (firm)|Protein|144|17.3|2.8|8.7|1 portion=100
Tempeh|Protein|192|20.3|7.6|10.8|1 portion=100
Lentils (cooked)|Protein|116|9|20.1|0.4|1 cup=198
Chickpeas (cooked)|Protein|164|8.9|27.4|2.6|1 cup=164
Black beans (cooked)|Protein|132|8.9|23.7|0.5|1 cup=172
Kidney beans (cooked)|Protein|127|8.7|22.8|0.5|1 cup=177
Baked beans|Protein|78|4.7|12.5|0.2|half a can=207
Edamame|Protein|121|11.9|8.9|5.2|1 cup=155
Greek yogurt (plain, 0%)|Dairy|59|10.3|3.6|0.4|1 pot=170
Greek yogurt (full fat)|Dairy|97|9|4|5|1 pot=170
Natural yogurt|Dairy|61|3.5|4.7|3.3|1 pot=125
Skyr|Dairy|63|11|4|0.2|1 pot=150
Cottage cheese|Dairy|98|11.1|3.4|4.3|half a tub=150
Milk (semi-skimmed)|Dairy|50|3.5|4.8|1.8|1 glass=250;1 cup=240|ml
Milk (whole)|Dairy|64|3.3|4.7|3.6|1 glass=250;1 cup=240|ml
Milk (skimmed)|Dairy|35|3.5|5|0.1|1 glass=250;1 cup=240|ml
Oat drink|Dairy|46|1|6.7|1.5|1 glass=250|ml
Soy drink (unsweetened)|Dairy|33|3.3|0.3|1.8|1 glass=250|ml
Cheddar cheese|Dairy|403|25|1.3|33|1 slice=20
Mozzarella|Dairy|300|22|2.2|22|1 ball=125
Feta|Dairy|264|14.2|4.1|21.3|1 portion=30
Parmesan|Dairy|392|35.8|3.2|25.8|1 tbsp grated=5
Cream cheese|Dairy|342|5.9|4.1|34.2|1 tbsp=15
Butter|Dairy|717|0.9|0.1|81|1 tsp=5;1 tbsp=14
Rice (cooked)|Carbs|130|2.7|28|0.3|1 cup=158
Brown rice (cooked)|Carbs|123|2.7|25.6|1|1 cup=195
Pasta (cooked)|Carbs|158|5.8|30.9|0.9|1 cup=140
Pasta (dry)|Carbs|371|13|75|1.5|1 portion=75
Oats (dry)|Carbs|389|16.9|66.3|6.9|1 serving=40;1 cup=81
Porridge (made with water)|Carbs|71|2.5|12|1.5|1 bowl=234
Granola|Carbs|471|10.5|64|20|1 serving=45
Cornflakes|Carbs|357|7.5|84|0.4|1 serving=30
Potato (boiled)|Carbs|87|1.9|20.1|0.1|1 medium=170
Potato (baked)|Carbs|93|2.5|21.2|0.1|1 medium=173
French fries|Carbs|312|3.4|41|15|1 medium portion=117
Sweet potato (baked)|Carbs|90|2|20.7|0.2|1 medium=150
Wholemeal bread|Carbs|247|13|41|4.2|1 slice=36
White bread|Carbs|266|7.6|49|3.3|1 slice=30
Sourdough bread|Carbs|272|10.8|51.9|2.4|1 slice=50
Bagel|Carbs|257|10|50|1.5|1 bagel=105
Tortilla wrap (flour)|Carbs|306|8.2|50|7.9|1 wrap=62
Pitta bread|Carbs|275|9.1|55.7|1.2|1 pitta=60
Couscous (cooked)|Carbs|112|3.8|23.2|0.2|1 cup=157
Quinoa (cooked)|Carbs|120|4.4|21.3|1.9|1 cup=185
Egg noodles (cooked)|Carbs|138|4.5|25|2.1|1 cup=160
Rice cakes|Carbs|387|8|81|2.8|1 cake=9
Banana|Fruit & veg|89|1.1|22.8|0.3|1 medium=118
Apple|Fruit & veg|52|0.3|13.8|0.2|1 medium=182
Orange|Fruit & veg|47|0.9|11.8|0.1|1 medium=131
Pear|Fruit & veg|57|0.4|15.2|0.1|1 medium=178
Grapes|Fruit & veg|69|0.7|18.1|0.2|1 cup=151
Strawberries|Fruit & veg|32|0.7|7.7|0.3|1 cup=152
Blueberries|Fruit & veg|57|0.7|14.5|0.3|1 cup=148
Raspberries|Fruit & veg|52|1.2|11.9|0.7|1 cup=123
Mango|Fruit & veg|60|0.8|15|0.4|1 cup=165
Pineapple|Fruit & veg|50|0.5|13.1|0.1|1 cup=165
Kiwi|Fruit & veg|61|1.1|14.7|0.5|1 fruit=69
Watermelon|Fruit & veg|30|0.6|7.6|0.2|1 cup=152
Dates (dried)|Fruit & veg|282|2.5|75|0.4|1 date=7
Raisins|Fruit & veg|299|3.1|79.2|0.5|1 tbsp=9
Dried apricots|Fruit & veg|241|3.4|62.6|0.5|1 apricot=8
Broccoli|Fruit & veg|34|2.8|6.6|0.4|1 cup=91
Carrot|Fruit & veg|41|0.9|9.6|0.2|1 medium=61
Spinach|Fruit & veg|23|2.9|3.6|0.4|1 cup=30
Tomato|Fruit & veg|18|0.9|3.9|0.2|1 medium=123
Cucumber|Fruit & veg|15|0.7|3.6|0.1|half a cucumber=150
Lettuce|Fruit & veg|15|1.4|2.9|0.2|1 cup=47
Red pepper|Fruit & veg|31|1|6|0.3|1 medium=119
Onion|Fruit & veg|40|1.1|9.3|0.1|1 medium=110
Mushrooms|Fruit & veg|22|3.1|3.3|0.3|1 cup=70
Courgette|Fruit & veg|17|1.2|3.1|0.3|1 medium=196
Green beans|Fruit & veg|31|1.8|7|0.2|1 cup=100
Peas (cooked)|Fruit & veg|84|5.4|15.6|0.2|1 cup=160
Sweetcorn|Fruit & veg|86|3.3|19|1.4|1 cup=154
Avocado|Fruit & veg|160|2|8.5|14.7|half an avocado=68
Almonds|Snacks|579|21.2|21.6|49.9|1 handful=30
Peanuts|Snacks|567|25.8|16.1|49.2|1 handful=30
Cashews|Snacks|553|18.2|30.2|43.9|1 handful=30
Walnuts|Snacks|654|15.2|13.7|65.2|1 handful=30
Peanut butter|Snacks|588|25|20|50|1 tbsp=16
Hummus|Snacks|166|7.9|14.3|9.6|2 tbsp=30
Dark chocolate|Snacks|598|7.8|45.9|42.6|1 square=10
Milk chocolate|Snacks|535|7.7|59.4|29.7|1 bar=45
Crisps|Snacks|536|6.6|53|34.6|1 bag=25
Cheese pizza|Meals|266|11.4|33.3|9.7|1 slice=107
Olive oil|Other|884|0|0|100|1 tsp=4.5;1 tbsp=13.5
Whey protein powder|Other|400|80|8|6|1 scoop=30
Honey|Other|304|0.3|82.4|0|1 tsp=7;1 tbsp=21
Sugar|Other|387|0|100|0|1 tsp=4
Jam|Other|278|0.4|69|0.1|1 tbsp=20
Ketchup|Other|101|1|27.4|0.1|1 tbsp=17
Mayonnaise|Other|680|1|0.6|75|1 tbsp=14
Orange juice|Drinks|45|0.7|10.4|0.2|1 glass=250|ml
Cola|Drinks|42|0|10.6|0|1 can=330|ml
Lager|Drinks|43|0.5|3.6|0|1 bottle=330;1 pint=568|ml
Red wine|Drinks|85|0.1|2.6|0|1 glass=175|ml
Black coffee|Drinks|1|0.1|0|0|1 mug=240|ml`;
// Pure: parse the table into food records.
function parseFoodTable(text){
 return text.split('\n').filter(Boolean).map((line,i)=>{const p=line.split('|');
  return {id:'base-'+slug(p[0]),name:p[0],category:p[1],cal:+p[2],protein:+p[3],carbs:+p[4],fat:+p[5],
   servings:(p[6]||'').split(';').filter(Boolean).map(s=>{const k=s.lastIndexOf('=');return {label:s.slice(0,k),grams:+s.slice(k+1)};}),unit:p[7]==='ml'?'ml':'g',custom:false};});
}
const FOODS_BASE=parseFoodTable(FOOD_TABLE);
const FOOD_MEALS=['Breakfast','Lunch','Dinner','Snacks'];
function mealForTime(d=new Date()){const m=d.getHours()*60+d.getMinutes();return m<10*60+30?'Breakfast':m<15*60?'Lunch':m<21*60?'Dinner':'Snacks';}
function customFoodRecord(f){
 const servings=[];
 if(Number(f.servingG)>0)servings.push({label:f.kind==='recipe'?'1 serving':(f.servingLabel||'1 serving'),grams:Number(f.servingG)});
 return Object.assign({},f,{category:f.kind==='recipe'?'My recipes':f.barcode?'Scanned foods':'My foods',custom:true,servings,unit:'g'});
}
function foodLibrary(){return FOODS_BASE.concat((state.customFoods||[]).map(customFoodRecord));}
function findFood(id){return foodLibrary().find(f=>f.id===id);}
// Pure: ranks foods for a query; prefix and whole-word matches first.
function searchFoods(list,query){
 const q=String(query||'').trim().toLowerCase();if(!q)return list.slice();
 const words=q.split(/\s+/);
 return list.map(f=>{const hay=(f.name+' '+f.category).toLowerCase();if(!words.every(w=>hay.includes(w)))return null;
   const name=f.name.toLowerCase();return {f,score:(name.startsWith(q)?3:0)+(name.split(/[\s(),]+/).some(w=>w.startsWith(words[0]))?1:0)+(f.custom?0.5:0)};})
  .filter(Boolean).sort((a,b)=>b.score-a.score||a.f.name.localeCompare(b.f.name)).map(x=>x.f);
}
function renderFoodSearch(){
 const q=$('foodSearch').value||'',box=$('foodSuggestions'),list=searchFoods(foodLibrary(),q).slice(0,14);
 box.innerHTML=list.length?list.map(f=>'<button type="button" class="food-suggestion" role="option" data-food-id="'+esc(f.id)+'"><span>'+esc(f.name)+(f.custom?' <small>· '+esc(f.category.toLowerCase())+'</small>':'')+'</span><small>'+Math.round(f.cal)+' kcal / 100'+f.unit+'</small></button>').join(''):'<div class="nutrition-empty">No foods found. Scan a barcode or add it as a custom food below.</div>';
 box.classList.add('open');
}
function renderPortionUnits(f){
 const sel=$('foodUnit');if(!sel)return;
 const base=f&&f.unit==='ml'?'ml':'grams';
 sel.innerHTML='<option value="1">'+base+'</option>'+(f?f.servings:[]).map(s=>'<option value="'+Number(s.grams)+'">'+esc(s.label)+' ('+Number(s.grams)+(f.unit==='ml'?' ml':' g')+')</option>').join('');
}
function chooseFood(id){
 const f=findFood(id);if(!f)return;selectedFoodId=id;$('foodSearch').value=f.name;$('foodSuggestions').classList.remove('open');
 $('foodSelectedHint').textContent=f.category+' · values per 100'+f.unit+(f.custom?'':' · general reference values');
 renderPortionUnits(f);
 if(f.servings.length){$('foodUnit').value=String(f.servings[0].grams);$('foodGrams').value=1;}else{$('foodUnit').value='1';$('foodGrams').value=100;}
 renderFoodPreview();
}
function portionGrams(){const amount=Number($('foodGrams').value),unit=Number($('foodUnit')?$('foodUnit').value:1)||1;return Math.round(amount*unit*10)/10;}
function portionLabel(f){const amount=Number($('foodGrams').value),unit=Number($('foodUnit').value)||1;if(unit===1)return '';const s=f.servings.find(x=>x.grams===unit);return s?(amount===1?'':amount+' × ')+s.label:'';}
function renderFoodPreview(){
 const f=selectedFoodId&&findFood(selectedFoodId),g=portionGrams(),p=$('foodPreview'),b=$('addFoodButton');
 if(!f||!(g>0)){p.innerHTML='<span class="sub">Select a food and enter a portion greater than 0.</span>';b.disabled=true;return;}
 const factor=g/100,fmt=n=>(n*factor).toFixed(1).replace(/\.0$/,''),label=portionLabel(f);
 p.innerHTML='<strong>'+esc(f.name)+' · '+(label?esc(label)+' · ':'')+g+(f.unit==='ml'?' ml':' g')+'</strong><div class="food-preview-grid"><span><b>'+Math.round(f.cal*factor)+'</b> kcal</span><span><b>'+fmt(f.protein)+'</b>g protein</span><span><b>'+fmt(f.carbs)+'</b>g carbs</span><span><b>'+fmt(f.fat)+'</b>g fat</span></div>';b.disabled=!(g<=3000);
 if(g>3000)p.insertAdjacentHTML('beforeend','<p class="sub">A single entry can be at most 3,000 g.</p>');
}
function clearFoodPicker(){selectedFoodId=null;$('foodSearch').value='';$('foodSuggestions').classList.remove('open');$('foodSelectedHint').textContent='Choose from common foods, scan a barcode or add your own below.';$('foodPreview').innerHTML='<span class="sub">Select a food to see its nutrition breakdown.</span>';renderPortionUnits(null);$('foodGrams').value=100;$('addFoodButton').disabled=true;}
function rememberRecent(entry){
 state.recent=[{name:entry.name,cal:entry.cal,protein:entry.protein,carbs:entry.carbs,fat:entry.fat,grams:Number(entry.grams)||0,portion:entry.portion||''}].concat((state.recent||[]).filter(x=>x.name!==entry.name)).slice(0,12);
}
function logFood(entry){
 entry=Object.assign({id:newRecordId('food'),day:dayKey(),createdAt:Date.now()},entry);
 state.foods.push(entry);state.cal+=entry.cal;state.protein+=entry.protein;state.carbs+=entry.carbs;state.fat+=entry.fat;rememberRecent(entry);
 return entry;
}
function addSelectedFood(){
 const f=selectedFoodId&&findFood(selectedFoodId),grams=portionGrams();
 if(!f)return showToast('Choose a food first');if(!(grams>0&&grams<=3000))return showToast('Enter a portion between 1 and 3,000 '+(f.unit==='ml'?'ml':'g'));
 const scale=grams/100;
 logFood({name:f.name,grams,portion:portionLabel(f),meal:$('foodMeal').value,cal:Math.round(f.cal*scale),protein:+(f.protein*scale).toFixed(1),carbs:+(f.carbs*scale).toFixed(1),fat:+(f.fat*scale).toFixed(1)});
 saveState();showToast('Added '+f.name);clearFoodPicker();
}

// --- F3: copy yesterday, copy a meal, add again from recents ---
function yesterdayFoods(){const k=shiftDay(dayKey(),-1),h=(state.dailyHistory||{})[k];return h&&Array.isArray(h.foods)?h.foods.filter(f=>f&&f.name):[];}
// Pure: today's copies of earlier entries (new ids, today's date, same meal and portion).
function copyFoodEntries(items,meal,makeId,day,now){
 return items.filter(f=>!meal||(f.meal||'Snacks')===meal).map(f=>({id:makeId(),name:f.name,grams:Number(f.grams)||0,portion:f.portion||'',meal:FOOD_MEALS.includes(f.meal)?f.meal:'Snacks',day,createdAt:now,cal:Number(f.cal)||0,protein:Number(f.protein)||0,carbs:Number(f.carbs)||0,fat:Number(f.fat)||0}));
}
function copyYesterday(meal){
 const copies=copyFoodEntries(yesterdayFoods(),meal,()=>newRecordId('food'),dayKey(),Date.now());
 if(!copies.length)return showToast(meal?'Nothing logged for '+meal.toLowerCase()+' yesterday':'Nothing logged yesterday');
 copies.forEach(c=>{state.foods.push(c);state.cal+=c.cal;state.protein+=c.protein;state.carbs+=c.carbs;state.fat+=c.fat;});
 saveState();showToast('Copied '+copies.length+' item'+(copies.length===1?'':'s')+' from yesterday'+(meal?"'s "+meal.toLowerCase():''));
}
function addRecentAgain(index){
 const r=(state.recent||[])[index];if(!r)return;
 logFood({name:r.name,grams:Number(r.grams)||0,portion:r.portion||'',meal:$('foodMeal').value,cal:Number(r.cal)||0,protein:Number(r.protein)||0,carbs:Number(r.carbs)||0,fat:Number(r.fat)||0});
 saveState();showToast('Added '+r.name+' again to '+$('foodMeal').value.toLowerCase());
}
function renderQuickAdd(){
 const host=$('foodQuickAdd');if(!host)return;
 const recent=(state.recent||[]).slice(0,8),y=yesterdayFoods();
 host.innerHTML=(recent.length?'<div class="sub-h">Add again</div><div class="row-wrap">'+recent.map((r,i)=>'<button type="button" class="btn quick-food" data-recent-index="'+i+'" aria-label="Add '+esc(r.name)+' again, '+Math.round(r.cal)+' kilocalories">+ '+esc(r.name)+' <small>'+Math.round(r.cal)+' kcal</small></button>').join('')+'</div>':'')+
  (y.length?'<div class="row-wrap" style="margin-top:10px"><button type="button" class="btn" data-food-action="copy-yesterday">⧉ Copy all of yesterday ('+y.length+')</button></div>':'');
}

// --- F5: saved meals become recipes (a custom food with a serving size) ---
let recipeMeal=null;
function openSaveRecipe(meal){
 const items=(state.foods||[]).filter(f=>(f.meal||'Snacks')===meal);
 if(!items.length)return;
 if(items.some(f=>!(Number(f.grams)>0)))return showToast('Some items in this meal have no portion size, so it cannot be saved as a recipe');
 recipeMeal=meal;$('recipeName').value=(meal+' '+new Date().toLocaleDateString(undefined,{month:'short',day:'numeric'})).slice(0,60);$('recipeServings').value=1;
 $('recipeSummary').textContent=items.length+' item'+(items.length===1?'':'s')+' · '+Math.round(items.reduce((n,f)=>n+(Number(f.cal)||0),0))+' kcal in total';
 $('recipeDialog').showModal();
}
// Pure: per-100 g values and serving size for a set of logged entries.
function buildRecipe(items,servings){
 const t=items.reduce((a,f)=>({g:a.g+(Number(f.grams)||0),cal:a.cal+(Number(f.cal)||0),protein:a.protein+(Number(f.protein)||0),carbs:a.carbs+(Number(f.carbs)||0),fat:a.fat+(Number(f.fat)||0)}),{g:0,cal:0,protein:0,carbs:0,fat:0});
 if(!(t.g>0))return null;const per=n=>Math.round(n/t.g*1000)/10;
 return {cal:per(t.cal),protein:per(t.protein),carbs:per(t.carbs),fat:per(t.fat),servingG:Math.round(t.g/Math.max(1,servings)*10)/10,totalG:t.g};
}
function saveRecipe(){
 const name=$('recipeName').value.trim().slice(0,60),servings=Math.round(Number($('recipeServings').value));
 if(!name)return showToast('Give the recipe a name');if(!(servings>=1&&servings<=20))return showToast('Servings must be 1–20');
 const r=buildRecipe((state.foods||[]).filter(f=>(f.meal||'Snacks')===recipeMeal),servings);if(!r)return;
 if(r.cal>1000||r.protein>100||r.carbs>100||r.fat>100)return showToast('These values look wrong for a recipe. Check the portions.');
 if((state.customFoods||[]).length>=500)return showToast('You can keep up to 500 custom foods and recipes');
 state.customFoods.push({id:newRecordId('recipe'),name,kind:'recipe',cal:r.cal,protein:r.protein,carbs:r.carbs,fat:r.fat,servingG:r.servingG});
 $('recipeDialog').close();saveState();showToast('Recipe saved: '+name+' · '+servings+' serving'+(servings===1?'':'s'));
}

// --- F6: macro targets in grams and percent ---
// Pure: grams from a calorie target and a percentage split (protein/carbs 4 kcal/g, fat 9 kcal/g).
function macroGramsFromPercent(kcal,p,c,f){return {protein:Math.round(kcal*p/100/4),carbs:Math.round(kcal*c/100/4),fat:Math.round(kcal*f/100/9)};}
function macroPercent(grams,perGram,kcal){return kcal>0?Math.round(grams*perGram/kcal*100):0;}
function renderMacroPercents(){
 const t=state.nutritionTargets||{},kcal=Number(state.calTarget)||0,host=$('macroPercentLine');if(!host)return;
 const p=macroPercent(t.protein||0,4,kcal),c=macroPercent(t.carbs||0,4,kcal),f=macroPercent(t.fat||0,9,kcal);
 host.textContent='Of your '+kcal.toLocaleString()+' kcal target: protein '+p+'%, carbs '+c+'%, fat '+f+'%'+(p+c+f?' (total '+(p+c+f)+'%)':'')+'.';
 const est=suggestCalories(state.profile),e=$('calorieEstimateLine');
 if(e)e.innerHTML=est?'Estimated from your profile: <strong>'+est.toLocaleString()+' kcal/day</strong>'+(est!==kcal?' <button type="button" class="btn" data-food-action="use-estimate">Use it</button>':' (your current target)')+'<br><span class="sub">An estimate from a standard formula, not advice.</span>':'<a href="#set-nutrition" data-settings-jump="set-nutrition">Add your profile</a> for an estimated calorie target, or <a href="#set-nutrition" data-settings-jump="set-nutrition">change your target</a>.';
}
function applyMacroPercents(){
 const p=Number($('pctProtein').value),c=Number($('pctCarbs').value),f=Number($('pctFat').value);
 if(![p,c,f].every(n=>Number.isFinite(n)&&n>=0&&n<=100))return showToast('Use percentages from 0 to 100');
 if(Math.round(p+c+f)!==100)return showToast('The three percentages must add up to 100 (now '+Math.round(p+c+f)+')');
 const g=macroGramsFromPercent(Number(state.calTarget)||0,p,c,f);
 if(g.protein>500||g.carbs>800||g.fat>300)return showToast('That split gives targets above the allowed maximum');
 state.nutritionTargets=g;saveState();showToast('Targets set: '+g.protein+' g protein, '+g.carbs+' g carbs, '+g.fat+' g fat');
}

// --- F7: weekly nutrition summary ---
// Pure: days[] = [{day, cal, protein}] for this week so far.
function weeklyNutritionSummary(days,proteinTarget){
 const logged=days.filter(d=>d.cal>0),avg=logged.length?Math.round(logged.reduce((n,d)=>n+d.cal,0)/logged.length):0;
 const avgProtein=logged.length?Math.round(logged.reduce((n,d)=>n+d.protein,0)/logged.length):0;
 const hit=proteinTarget>0?logged.filter(d=>d.protein>=proteinTarget).length:null;
 return {daysSoFar:days.length,logged:logged.length,avgCal:avg,avgProtein,proteinHit:hit};
}
function nutritionWeekDays(){
 const out=[],today=dayKey();
 for(let k=wkKey(new Date());k<=today;k=shiftDay(k,1)){
  if(k===today){out.push({day:k,cal:Number(state.cal)||0,protein:Number(state.protein)||0});continue;}
  const d=(state.dailyHistory||{})[k],h=(state.history||{})[k];
  out.push({day:k,cal:Number(d&&d.cal)||Number(h&&h.cal)||0,protein:Number(d&&d.protein)||0});
 }
 return out;
}
function renderNutritionWeek(){
 const host=$('nutritionWeek');if(!host)return;
 const target=Number(state.nutritionTargets&&state.nutritionTargets.protein)||0,s=weeklyNutritionSummary(nutritionWeekDays(),target);
 const stat=(v,l)=>'<div class="stat"><b>'+v+'</b><span>'+l+'</span></div>';
 host.innerHTML='<div class="section-title"><span>This week</span><span class="sub">From '+(weekStartsSunday()?'Sunday':'Monday')+'</span></div><div class="stat-row">'+
  stat(s.logged+'/'+s.daysSoFar,'days with food logged')+stat(s.logged?s.avgCal.toLocaleString():'—','average kcal on logged days')+stat(s.logged?s.avgProtein+' g':'—','average protein')+
  stat(s.proteinHit===null?'—':s.proteinHit+'/'+s.logged,s.proteinHit===null?'set a protein target to track':'days protein target hit')+'</div>';
}

// --- F8: hydration nudge (in-app only) ---
let hydrationNudgeDismissedAt=0;
function lastDrinkAt(){const today=dayKey();return (state.waterEntries||[]).filter(x=>x.day===today).reduce((m,x)=>Math.max(m,Number(x.createdAt)||0),0);}
// Pure: hours since the last drink, or null when no nudge is due.
function hydrationNudgeHours(now,lastAt,water,goal,dismissedAt){
 const h=now.getHours();if(h<9||h>=21||water>=goal)return null;
 const ref=lastAt||new Date(now).setHours(9,0,0,0),hours=(now.getTime()-ref)/36e5;
 if(hours<2||dismissedAt>Math.max(lastAt,now.getTime()-2*36e5))return null;
 return Math.floor(hours);
}
function renderHydrationNudge(){
 const el=$('hydrationNudge');if(!el)return;
 const last=lastDrinkAt(),hours=hydrationNudgeHours(new Date(),last,state.water,state.waterGoal,hydrationNudgeDismissedAt);
 el.hidden=hours===null;if(hours===null)return;
 const amount=(state.presets||[])[1]||(state.presets||[])[0]||250;
 $('hydrationNudgeText').textContent=(last?'Your last drink was '+hours+' hour'+(hours===1?'':'s')+' ago.':'No water logged yet today.')+' You are at '+formatWaterTotal(state.water)+' of '+formatWaterTotal(state.waterGoal)+' '+waterTotalUnitLabel()+'.';
 $('hydrationNudgeAdd').dataset.waterMl=String(amount);$('hydrationNudgeAdd').textContent='+ '+formatWaterAmount(amount);
}

// --- F9: water history chart and per-entry undo ---
let waterRange=7;
function waterHistory(days){
 const out=[],today=dayKey();
 for(let i=days-1;i>=0;i--){const k=shiftDay(today,-i),h=(state.history||{})[k],d=(state.dailyHistory||{})[k];out.push({day:k,litres:i===0?Number(state.water)||0:Number(h&&h.water)||Number(d&&d.water)||0});}
 return out;
}
function renderWaterPanel(){
 const host=$('waterPanel');if(!host)return;
 const data=waterHistory(waterRange),goal=Number(state.waterGoal)||2.5,max=Math.max(goal*1.25,...data.map(d=>d.litres)),hits=data.filter(d=>d.litres>=goal).length;
 const unit=waterTotalUnitLabel(),today=dayKey(),entries=(state.waterEntries||[]).filter(x=>x.day===today).slice().sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
 const label=d=>{const dt=new Date(d.day+'T12:00:00');return dt.toLocaleDateString(undefined,waterRange===7?{weekday:'short'}:{day:'numeric'});};
 host.innerHTML='<div class="section-title"><span>Water</span><span class="row-wrap" role="group" aria-label="Water history range"><button type="button" class="btn range-btn" data-water-range="7" aria-pressed="'+(waterRange===7)+'">7 days</button><button type="button" class="btn range-btn" data-water-range="30" aria-pressed="'+(waterRange===30)+'">30 days</button></span></div>'+
  '<p class="sub">Goal reached (✓) on '+hits+' of the last '+waterRange+' days. Dashed line: your '+formatWaterTotal(goal)+' '+unit+' goal.</p>'+
  '<div class="water-chart'+(waterRange===30?' wide':'')+'" role="list" aria-label="Water per day, last '+waterRange+' days" style="--goal:'+Math.round(goal/max*100)+'%">'+data.map(d=>{const pct=Math.round(d.litres/max*100),hit=d.litres>=goal,when=new Date(d.day+'T12:00:00').toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'});
   return '<div class="water-col" role="listitem" aria-label="'+esc(when+': '+formatWaterTotal(d.litres)+' '+unit+(hit?', goal reached':''))+'">'+(hit?'<span class="water-hit" aria-hidden="true">✓</span>':'')+'<span class="water-bar'+(hit?' hit':'')+'" style="height:'+pct+'%"></span><small aria-hidden="true">'+esc(label(d))+'</small></div>';}).join('')+'</div>'+
  '<div class="sub-h">Today\'s drinks</div>'+(entries.length?'<ul class="water-entries">'+entries.map(x=>'<li><span><strong>'+esc(formatWaterAmount(x.amount*1000))+'</strong> <span class="sub">'+(x.createdAt?esc(new Date(x.createdAt).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})):'earlier')+'</span></span><button type="button" class="btn" data-water-remove="'+esc(x.id)+'" aria-label="Remove '+esc(formatWaterAmount(x.amount*1000))+' logged '+(x.createdAt?esc(new Date(x.createdAt).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})):'earlier')+'">Remove</button></li>').join('')+'</ul>':'<p class="sub">No water logged yet today.</p>');
}
function removeWaterEntry(id){
 const entry=(state.waterEntries||[]).find(x=>x.id===id);if(!entry)return;
 markRecordDeleted('waterEntries',entry);state.waterEntries=state.waterEntries.filter(x=>x.id!==id);
 const today=state.waterEntries.filter(x=>x.day===dayKey());state.water=+today.reduce((n,x)=>n+x.amount,0).toFixed(3);state.waterLog=today.map(x=>x.amount);
 saveState();showToast('Removed '+formatWaterAmount(entry.amount*1000));
}

// --- F1: barcode scan → Open Food Facts ---
// Only the barcode number is sent to Open Food Facts. Results are saved as your own custom food.
const OFF_PRODUCT_URL='https://world.openfoodfacts.org/api/v2/product/';
let scanStream=null,scanTimer=null,scanBusy=false,scanFound=null;
function barcodeScanSupported(){return 'BarcodeDetector' in window&&!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia);}
function validBarcode(code){return /^\d{8,14}$/.test(String(code||''));}
// Pure: Open Food Facts product JSON → per-100 g food values, or null when unusable.
function offProductToFood(json,code){
 if(!json||json.status!==1||!json.product)return null;
 const p=json.product,n=p.nutriments||{},num=v=>{const x=Number(v);return Number.isFinite(x)&&x>=0?x:null;};
 let kcal=num(n['energy-kcal_100g']);if(kcal===null&&num(n.energy_100g)!==null)kcal=Math.round(num(n.energy_100g)/4.184);
 const protein=num(n.proteins_100g),carbs=num(n.carbohydrates_100g),fat=num(n.fat_100g);
 if(kcal===null||protein===null||carbs===null||fat===null)return null;
 if(kcal>1000||protein>100||carbs>100||fat>100)return null;
 const name=String(p.product_name||'').replace(/[\u0000-\u001f\u007f]/g,' ').trim(),brand=String(p.brands||'').split(',')[0].trim();
 const servingG=num(p.serving_quantity);
 return {name:((name||'Scanned product')+(brand&&!name.toLowerCase().includes(brand.toLowerCase())?' ('+brand+')':'')).slice(0,80),cal:Math.round(kcal*10)/10,protein:Math.round(protein*10)/10,carbs:Math.round(carbs*10)/10,fat:Math.round(fat*10)/10,barcode:String(code),servingG:servingG&&servingG<=3000?Math.round(servingG*10)/10:0,servingLabel:servingG?'1 serving':''};
}
function setScanStatus(text){const el=$('scanStatus');if(el)el.textContent=text;}
async function openScanner(){
 const dialog=$('scanDialog');scanFound=null;$('scanResult').innerHTML='';$('scanManual').value='';
 dialog.showModal();
 if(!barcodeScanSupported()){$('scanVideoWrap').hidden=true;setScanStatus('This browser cannot scan with the camera. Type the number under the barcode instead.');$('scanManual').focus();return;}
 $('scanVideoWrap').hidden=false;setScanStatus('Starting the camera…');
 try{
  scanStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false});
  if(!dialog.open){stopScanner();return;}
  const video=$('scanVideo');video.srcObject=scanStream;await video.play();
  const detector=new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e']});
  setScanStatus('Point the camera at a barcode.');
  const tick=async()=>{if(!scanStream)return;try{const codes=await detector.detect(video);const hit=codes.find(c=>validBarcode(c.rawValue));if(hit){stopScanner();lookupBarcode(hit.rawValue);return;}}catch(e){}scanTimer=setTimeout(tick,250);};
  tick();
 }catch(e){$('scanVideoWrap').hidden=true;setScanStatus(e&&e.name==='NotAllowedError'?'Camera access was not allowed. Type the barcode number instead.':'The camera could not start. Type the barcode number instead.');}
}
function stopScanner(){clearTimeout(scanTimer);scanTimer=null;if(scanStream){scanStream.getTracks().forEach(t=>t.stop());scanStream=null;}const v=$('scanVideo');if(v)v.srcObject=null;}
async function lookupBarcode(code){
 code=String(code||'').replace(/\s+/g,'');
 if(!validBarcode(code))return setScanStatus('A barcode number has 8 to 14 digits.');
 const known=(state.customFoods||[]).find(f=>f.barcode===code);
 if(known){$('scanDialog').close();chooseFood(known.id);showToast('Found in your scanned foods');return;}
 if(scanBusy)return;scanBusy=true;setScanStatus('Looking up '+code+' on Open Food Facts…');$('scanResult').innerHTML='';
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),10000);
 try{
  const res=await fetch(OFF_PRODUCT_URL+encodeURIComponent(code)+'.json?fields=product_name,brands,nutriments,serving_quantity',{signal:ctrl.signal,headers:{Accept:'application/json'}});
  const json=res.ok||res.status===404?await res.json().catch(()=>null):null;
  if(!res.ok&&res.status!==404)throw new Error('HTTP '+res.status);
  const food=offProductToFood(json,code);
  if(!food){setScanStatus(json&&json.status===1?'This product has no complete nutrition values per 100 g. Add it as a custom food instead.':'Barcode '+code+' was not found on Open Food Facts. Add it as a custom food instead.');return;}
  scanFound=food;
  $('scanResult').innerHTML='<div class="food-preview"><strong>'+esc(food.name)+'</strong><div class="food-preview-grid"><span><b>'+Math.round(food.cal)+'</b> kcal</span><span><b>'+food.protein+'</b>g protein</span><span><b>'+food.carbs+'</b>g carbs</span><span><b>'+food.fat+'</b>g fat</span></div><p class="sub">Per 100 g, from Open Food Facts (community data — check the label).</p></div><button type="button" class="btn btn-primary" data-scan-action="use">Use this food</button>';
  setScanStatus('Found it.');$('scanResult').querySelector('button')?.focus();
 }catch(e){setScanStatus(e&&e.name==='AbortError'?'Open Food Facts did not answer in time. Try again or add a custom food.':'Could not reach Open Food Facts. Check your connection or add a custom food.');}
 finally{clearTimeout(timer);scanBusy=false;}
}
function useScannedFood(){
 if(!scanFound)return;
 if((state.customFoods||[]).length>=500)return showToast('You can keep up to 500 custom foods and recipes');
 const food=Object.assign({id:newRecordId('scan'),kind:'food'},scanFound);state.customFoods.push(food);scanFound=null;
 $('scanDialog').close();saveState();chooseFood(food.id);showToast('Saved to your scanned foods. Now set your portion.');$('foodGrams').focus();
}

function initNutritionControls(){
 const screen=$('nutrition');
 if(screen){
  screen.addEventListener('click',e=>{
   const food=e.target.closest('[data-food-id]');if(food){chooseFood(food.dataset.foodId);$('foodGrams').focus();return;}
   const recent=e.target.closest('[data-recent-index]');if(recent){addRecentAgain(Number(recent.dataset.recentIndex));return;}
   const range=e.target.closest('[data-water-range]');if(range){waterRange=Number(range.dataset.waterRange)===30?30:7;renderWaterPanel();$('waterPanel').querySelector('[data-water-range="'+waterRange+'"]')?.focus();return;}
   const remove=e.target.closest('[data-water-remove]');if(remove){removeWaterEntry(remove.dataset.waterRemove);return;}
   const jump=e.target.closest('a[data-settings-jump]');if(jump){e.preventDefault();openSettingsSection(jump.dataset.settingsJump);return;}
   const b=e.target.closest('[data-food-action]');if(!b)return;const a=b.dataset.foodAction,meal=b.dataset.meal;
   if(a==='copy-yesterday')copyYesterday(meal||'');else if(a==='add-to-meal'){$('foodMeal').value=meal;$('foodSearch').focus();renderFoodSearch();}
   else if(a==='save-recipe')openSaveRecipe(meal);else if(a==='scan')openScanner();else if(a==='apply-percent')applyMacroPercents();
   else if(a==='use-estimate'){const n=suggestCalories(state.profile);if(n){state.calTarget=n;saveState();showToast('Calorie target set to '+n.toLocaleString()+' kcal');}}
   else if(a==='delete'){deleteFood(Number(b.dataset.index));}
  });
  const search=$('foodSearch');search.addEventListener('input',renderFoodSearch);search.addEventListener('focus',renderFoodSearch);
  search.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();$('foodSuggestions').querySelector('button')?.focus();}else if(e.key==='Escape')$('foodSuggestions').classList.remove('open');});
  $('foodSuggestions').addEventListener('keydown',e=>{const items=[...$('foodSuggestions').querySelectorAll('button')],i=items.indexOf(document.activeElement);if(i<0)return;if(e.key==='ArrowDown'){e.preventDefault();items[Math.min(items.length-1,i+1)].focus();}else if(e.key==='ArrowUp'){e.preventDefault();(i?items[i-1]:search).focus();}else if(e.key==='Escape'){$('foodSuggestions').classList.remove('open');search.focus();}});
  $('foodGrams').addEventListener('input',renderFoodPreview);$('foodUnit').addEventListener('change',renderFoodPreview);
 }
 const scan=$('scanDialog');
 if(scan){
  scan.addEventListener('close',()=>{stopScanner();$('scanButton')?.focus();});
  scan.addEventListener('click',e=>{const a=e.target.closest('[data-scan-action]')?.dataset.scanAction;if(a==='lookup')lookupBarcode($('scanManual').value);else if(a==='use')useScannedFood();else if(a==='close')scan.close();});
  $('scanManual').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();lookupBarcode($('scanManual').value);}});
 }
 const recipe=$('recipeDialog');
 if(recipe){recipe.addEventListener('click',e=>{const a=e.target.closest('[data-recipe-action]')?.dataset.recipeAction;if(a==='save')saveRecipe();else if(a==='cancel')recipe.close();});}
 $('hydrationNudge')?.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.waterMl)addWater(Number(b.dataset.waterMl)/1000);else{hydrationNudgeDismissedAt=Date.now();renderHydrationNudge();}});
 setInterval(renderHydrationNudge,60000);
 $('foodMeal').value=mealForTime();
 renderPortionUnits(null);
}

// ===== Batch 7: accessibility =====
const SCREEN_TITLES={dashboard:'Dashboard',prs:'Personal Records',training:'Training Log',nutrition:'Nutrition',friends:'Friends',deluxe:'Deluxe',settings:'Settings'};
// I6: a screen change updates the page title and moves focus to the screen's heading, so screen
// readers announce where the user landed and keyboard users start at the top of the new screen.
function announceScreen(id,moveFocus){
 document.title=(SCREEN_TITLES[id]||'Gymplified')+' · Gymplified';
 if(!moveFocus)return;
 const heading=document.querySelector('#'+id+' h1');
 if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
}
// I7: native <dialog> already traps focus and closes on Esc; this returns focus to whatever opened it.
let focusBeforeDialog=null;
document.addEventListener('focusin',e=>{if(!e.target.closest||!e.target.closest('dialog'))focusBeforeDialog=e.target;});
document.addEventListener('close',e=>{
 if(!(e.target instanceof HTMLDialogElement))return;
 const back=focusBeforeDialog;
 setTimeout(()=>{const a=document.activeElement;if(back&&document.contains(back)&&!document.querySelector('dialog[open]')&&(!a||a===document.body||e.target.contains(a)))back.focus({preventScroll:true});},0);
},true);
function initAccessibilityControls(){
 $('deluxeModalClose')?.addEventListener('click',closeDeluxeModal);
 document.querySelectorAll('.screen h1').forEach(h=>h.setAttribute('tabindex','-1'));
 announceScreen((document.querySelector('.screen.active')||{}).id||'dashboard',false);
}

// ===== Batch 8: exercise library, custom exercises, detail sheet, swaps, form tips =====
// B27: short form tips in our own words. General guidance, not personalised coaching.
const FORM_TIPS={
 'barbell-back-squat':'Brace your midsection before you go down and keep your whole foot on the floor. Let your knees follow your toes, then stand up by pushing the floor away.',
 'front-squat':'Keep your elbows high so the bar stays on your shoulders. Sit straight down and keep your chest tall.',
 'goblet-squat':'Hold the weight close to your chest and sit down between your heels. Keep your chest up the whole time.',
 'paused-squat':'Hold the bottom position still for a full second without relaxing, then drive up.',
 'box-squat':'Sit back to the box under control, stay braced while you touch it, and stand without rocking.',
 'conventional-deadlift':'Start with the bar over the middle of your foot and take the slack out before it leaves the floor. Keep the bar close and push the floor away.',
 'sumo-deadlift':'Take a wide stance with your knees pushed out over your toes. Keep your chest up and push through the floor.',
 'romanian-deadlift':'Soften your knees and push your hips back while the bar slides down your thighs. Stop at a strong hamstring stretch, then bring your hips forward.',
 'dumbbell-romanian-deadlift':'Push your hips back and keep the dumbbells close to your legs. Stop at a strong hamstring stretch, then stand tall.',
 'flat-bench-press':'Pull your shoulder blades back and down and keep your feet planted. Lower the bar under control to your lower chest, then press up.',
 'incline-bench-press':'Keep your shoulder blades pinned to the bench. Lower the bar to your upper chest and press up over your shoulders.',
 'dumbbell-bench-press':'Keep your wrists stacked over your elbows. Lower until your elbows are just below the bench, then press up and slightly in.',
 'overhead-press':'Squeeze your glutes and brace so your lower back stays neutral. Move your head back to let the bar pass, then push your head through once it clears.',
 'dumbbell-shoulder-press':'Start with the dumbbells at shoulder height and press up without arching your back. Lower them slowly to the same start position.',
 'barbell-row':'Hinge forward with a flat back and pull the bar to your lower ribs. Lead with your elbows and avoid jerking the weight up.',
 'one-arm-dumbbell-row':'Support yourself on the bench and keep your back flat. Pull the dumbbell towards your hip rather than straight up.',
 'pull-up':'Start from a full hang and pull your chest towards the bar. Keep your body still and lower all the way down.',
 'chin-up':'With palms facing you, pull until your chin clears the bar. Lower all the way without swinging.',
 'lat-pulldown':'Lean back only slightly and pull the bar to your upper chest. Think about driving your elbows down to your sides.',
 'cable-row':'Sit tall and pull the handle to your stomach. Squeeze your shoulder blades together, then let them stretch forward slowly.',
 'hip-thrust':'Rest your upper back on the bench with your feet flat. Push through your heels and squeeze your glutes at the top without arching your lower back.',
 'bulgarian-split-squat':'Keep most of your weight on the front foot. Lower straight down until your back knee nearly touches the floor.',
 'dumbbell-lunge':'Step far enough that your front knee stays over your foot. Push through the front heel to come back.',
 'walking-lunge':'Take controlled steps and keep your chest up. Let your back knee come close to the floor on each step.',
 'leg-press':'Keep your lower back against the pad. Lower until your knees are bent about 90 degrees without your hips lifting, and avoid snapping your knees straight at the top.',
 'leg-extension':'Line your knees up with the machine pivot. Lift with control and pause briefly at the top.',
 'seated-leg-curl':'Keep your hips down in the seat. Curl all the way, then let the pad return slowly.',
 'push-up':'Keep a straight line from head to heels. Lower your chest close to the floor with your elbows angled back, not flared out.',
 'dips':'Keep your shoulders down, away from your ears. Lower until your upper arms are about level with the floor, then press up.',
 'barbell-curl':'Keep your elbows at your sides and avoid swinging. Lower the bar slowly all the way down.',
 'dumbbell-curl':'Keep your elbows still and turn your palms up as you lift. Lower slowly to a straight arm.',
 'hammer-curl':'Keep your thumbs pointing up and your elbows by your sides. Lower with control.',
 'cable-triceps-pushdown':'Pin your elbows to your sides and move only your forearms. Straighten your arms fully at the bottom.',
 'skull-crushers':'Keep your upper arms still and bend only at the elbows. Lower the bar towards your forehead slowly.',
 'lateral-raise':'Raise the weights out to your sides with a slight bend in your elbows, stopping around shoulder height. Lead with your elbows, not your hands.',
 'face-pull':'Pull the rope towards your face with your elbows high. Finish with your hands beside your ears.',
 'standing-calf-raise':'Use the full range: a deep stretch at the bottom and a pause on your toes at the top.',
 'plank':'Squeeze your glutes and brace your stomach so your hips do not sag. Keep breathing steadily.',
 'hanging-leg-raise':'Avoid swinging; curl your pelvis up as you lift your legs. Lower slowly.',
 'kettlebell-swing':'It is a hip hinge, not a squat: snap your hips forward to float the bell. Your arms guide it while your hips do the work.',
 'glute-bridge':'Push through your heels and lift until your body is straight from shoulders to knees. Squeeze your glutes at the top.',
 'farmer-s-carry':'Stand tall, brace your stomach and walk with short, steady steps. Keep your shoulders down and back.',
 'nordic-hamstring-curl':'Lower yourself as slowly as you can while keeping your hips straight. Use your hands to catch yourself and push back up.'
};
const EX_TYPES={weights:'Weights',bodyweight:'Bodyweight',timed:'Timed or distance'};
function exerciseByName(name){const key=String(name||'').trim().toLowerCase();return allEx().find(e=>e.name.toLowerCase()===key)||null;}

// --- B26: alternatives that train the same main muscle ---
// Pure: score shared muscles, prefer different equipment (the usual reason to swap), then name.
function suggestAlternatives(target,list,count=5){
 if(!target||!target.pm)return [];
 const sec=new Set(target.sec||[]);
 return list.filter(c=>c.id!==target.id&&c.name.toLowerCase()!==target.name.toLowerCase())
  .map(c=>{let score=0;if(c.pm===target.pm)score+=4;else if((c.sec||[]).includes(target.pm))score+=1;else return null;
   (c.sec||[]).forEach(m=>{if(sec.has(m))score+=1;});if(c.eq!==target.eq)score+=1;return {c,score};})
  .filter(Boolean).sort((a,b)=>b.score-a.score||a.c.name.localeCompare(b.c.name)).slice(0,count).map(x=>x.c);
}

// --- B25: history, records and a sparkline for one exercise ---
function exerciseSessions(name){
 const key=String(name||'').trim().toLowerCase(),rows=[];
 (state.sessions||[]).forEach(s=>(s.exercises||[]).forEach(e=>{if(String(e.name||'').trim().toLowerCase()!==key)return;
  const work=(e.sets||[]).filter(x=>setTypeOf(x)!=='warmup');const best=bestPreviousSet(work.filter(x=>Number(x.kg)>0&&Number(x.reps)>0));
  rows.push({date:s.date,sets:e.sets||[],best,e1rm:best?calculate1RM(best.kg,best.reps):0,volume:work.reduce((n,x)=>n+(Number(x.kg)||0)*(Number(x.reps)||0),0)});}));
 return rows; // newest first, like state.sessions
}
// Pure: SVG polyline points for values (oldest first) in a w x h box with padding.
function sparklinePoints(values,w,h,pad=4){
 if(!values.length)return '';
 const min=Math.min(...values),max=Math.max(...values),span=max-min;
 return values.map((v,i)=>{const x=values.length===1?w/2:pad+i*(w-2*pad)/(values.length-1),y=span?h-pad-(v-min)/span*(h-2*pad):h/2;return x.toFixed(1)+','+y.toFixed(1);}).join(' ');
}
function sparklineMarkup(rows){
 const points=rows.filter(r=>r.e1rm>0).slice(0,12).reverse();
 if(points.length<2)return '<p class="sub">Log this exercise in two or more workouts to see a progress line.</p>';
 const values=points.map(r=>r.e1rm),first=values[0],last=values[values.length-1],w=280,h=64,pts=sparklinePoints(values,w,h);
 const summary='Best estimated 1RM went from '+fmtWeight(first)+' to '+fmtWeight(last)+' over the last '+values.length+' workouts';
 return '<figure class="sparkline"><svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+esc(summary)+'"><polyline points="'+pts+'" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>'+pts.split(' ').map((p,i)=>'<circle cx="'+p.split(',')[0]+'" cy="'+p.split(',')[1]+'" r="'+(i===values.length-1?4:2.5)+'" fill="currentColor"/>').join('')+'</svg><figcaption class="sub">'+esc(summary)+' ('+(last>=first?'+':'')+esc(fmtWeight(last-first))+').</figcaption></figure>';
}

// --- B25: the sheet ---
let sheetState=null; // {name, mode:'view'|'edit', swapIndex}
async function renderMuscleMapInto(mountId,exercise){
 const mount=$(mountId);if(!mount)return;
 try{
  const template=await loadMuscleMapTemplate();const svg=template.cloneNode(true);
  svg.removeAttribute('width');svg.removeAttribute('height');svg.style.width='100%';svg.style.height='auto';
  svg.setAttribute('role','img');svg.setAttribute('aria-label',(exercise?exercise.name+': ':'')+'muscles worked, front and back');
  const primary=new Set(muscleMapKeys(exercise&&exercise.pm)),secondary=new Set((exercise&&exercise.sec||[]).flatMap(muscleMapKeys));
  svg.querySelectorAll('[data-muscle]').forEach(path=>{const raw=path.getAttribute('data-muscle')||'',base=raw.replace(/_(left|right)$/,'');if(primary.has(raw)||primary.has(base))path.classList.add('active');else if(secondary.has(raw)||secondary.has(base))path.classList.add('secondary');});
  const style=document.createElementNS('http://www.w3.org/2000/svg','style');
  style.textContent='#layer2 path.active{fill:#e6b93f!important;fill-opacity:.96!important;stroke:#9a7019!important;stroke-width:.8!important}#layer2 path.secondary{fill:#c18d27!important;fill-opacity:.72!important;stroke:#9a7019!important;stroke-width:.65!important}';
  svg.insertBefore(style,svg.firstChild);mount.replaceChildren(svg);
 }catch(e){mount.innerHTML='<p class="sub">The muscle illustration could not be loaded.</p>';}
}
function openExerciseSheet(name,opts){
 const dialog=$('exerciseSheet');if(!dialog)return;
 sheetState={name:String(name||''),mode:(opts&&opts.mode)||'view',swapIndex:opts&&Number.isInteger(opts.swapIndex)?opts.swapIndex:null,confirmDelete:false};
 renderExerciseSheet();
 if(!dialog.open)dialog.showModal();
 ($('cxName')&&sheetState.mode==='edit'?$('cxName'):$('exerciseSheetTitle')).focus({preventScroll:true});
}
function renderExerciseSheet(){
 const dialog=$('exerciseSheet');if(!dialog||!sheetState)return;
 const x=exerciseByName(sheetState.name),name=x?x.name:sheetState.name,body=$('exerciseSheetBody');
 $('exerciseSheetTitle').textContent=name;
 if(sheetState.mode==='edit'&&x&&x.custom){body.innerHTML=customExerciseFormMarkup(x);return;}
 const rows=exerciseSessions(name),best=rows.reduce((b,r)=>r.e1rm>(b?b.e1rm:0)?r:b,null),heaviest=rows.flatMap(r=>r.sets.filter(s=>setTypeOf(s)!=='warmup').map(s=>({kg:Number(s.kg)||0,reps:Number(s.reps)||0,date:r.date}))).reduce((b,s)=>!b||s.kg>b.kg?s:b,null);
 const prE1rm=exerciseRecordE1RM(name),tip=x&&FORM_TIPS[x.id.replace(/^c-/,'')]||'',swap=sheetState.swapIndex!==null&&state.workouts[sheetState.swapIndex]&&!state.workouts[sheetState.swapIndex].setList.some(s=>s.done);
 const alts=x?suggestAlternatives(x,allEx()):[];
 body.innerHTML='<p class="sub">'+(x?esc(x.eq)+(x.custom?' · your custom exercise'+(x.type?' · '+esc(EX_TYPES[x.type]||''):''):''):'Not in the exercise library')+'</p>'+
  (x?'<div class="tag-list" style="margin:8px 0 12px"><span class="tag primary">'+esc(x.pm)+'</span>'+x.sec.map(m=>'<span class="tag">'+esc(m)+'</span>').join('')+'</div>':'')+
  '<div class="sheet-grid"><div class="sheet-map" id="sheetMuscleMap"></div><div>'+
   (tip?'<div class="form-tip"><strong>Form tip</strong><p>'+esc(tip)+'</p><small class="sub">General guidance, not personal coaching.</small></div>':'')+
   '<div class="stat-row">'+'<div class="stat"><b>'+(prE1rm?esc(fmtWeight(prE1rm)):'—')+'</b><span>best estimated 1RM</span></div><div class="stat"><b>'+(heaviest&&heaviest.kg?esc(fmtWeight(heaviest.kg,2))+' × '+heaviest.reps:'—')+'</b><span>heaviest set</span></div><div class="stat"><b>'+rows.length+'</b><span>workouts logged</span></div></div>'+
   sparklineMarkup(rows)+'</div></div>'+
  '<div class="sub-h">Last 5 times</div>'+(rows.length?'<ul class="sheet-history">'+rows.slice(0,5).map(r=>'<li><strong>'+esc(relativeDay(r.date)||r.date)+'</strong><span>'+(r.best?esc(fmtWeight(r.best.kg,2))+' × '+Number(r.best.reps)+' best':'')+' · '+r.sets.length+' set'+(r.sets.length===1?'':'s')+(r.volume?' · '+esc(fmtVolume(r.volume)):'')+'</span></li>').join('')+'</ul>':'<p class="sub">No finished workouts with this exercise yet.</p>')+
  (rows.length>5?'<details class="sheet-more"><summary>All history</summary>'+exerciseHistoryMarkup(name)+'</details>':'')+
  (alts.length?'<div class="sub-h">'+(swap?'Swap for':'Alternatives')+' · same main muscle</div><ul class="sheet-alts">'+alts.map(a=>'<li><span><strong>'+esc(a.name)+'</strong><small class="sub">'+esc(a.eq)+' · '+esc(a.pm)+(a.sec.length?' + '+a.sec.map(esc).join(', '):'')+'</small></span><span class="row-wrap"><button type="button" class="btn" data-sheet-action="view" data-name="'+esc(a.name)+'" aria-label="Details for '+esc(a.name)+'">Details</button>'+(swap?'<button type="button" class="btn btn-primary" data-sheet-action="swap" data-name="'+esc(a.name)+'" aria-label="Swap '+esc(name)+' for '+esc(a.name)+'">Swap</button>':'<button type="button" class="btn btn-primary" data-sheet-action="add" data-name="'+esc(a.name)+'" aria-label="Add '+esc(a.name)+' to today">+ Add</button>')+'</span></li>').join('')+'</ul>':'')+
  (x&&x.custom?'<div class="row-wrap sheet-manage"><button type="button" class="btn" data-sheet-action="edit">✎ Edit or merge</button></div>':'');
 renderMuscleMapInto('sheetMuscleMap',x);
}
function customExerciseFormMarkup(x){
 const muscles=Object.values(MC),equipment=Object.keys(LIB).concat('Other'),same=allEx().filter(e=>!e.custom&&e.pm===x.pm).sort((a,b)=>a.name.localeCompare(b.name)),others=allEx().filter(e=>!e.custom&&e.pm!==x.pm).sort((a,b)=>a.name.localeCompare(b.name));
 const opt=(v,l,sel)=>'<option value="'+esc(v)+'"'+(sel?' selected':'')+'>'+esc(l)+'</option>';
 return '<form class="custom-ex-form" data-custom-id="'+esc(x.id)+'">'+
  '<label for="cxName">Name</label><input id="cxName" maxlength="60" value="'+esc(x.name)+'" required>'+
  '<div class="form-grid"><div class="field"><label for="cxEquip">Equipment</label><select id="cxEquip">'+equipment.map(e=>opt(e,e,e===x.eq)).join('')+'</select></div>'+
  '<div class="field"><label for="cxType">Type</label><select id="cxType">'+Object.keys(EX_TYPES).map(k=>opt(k,EX_TYPES[k],(x.type||'weights')===k)).join('')+'</select></div>'+
  '<div class="field"><label for="cxPrimary">Main muscle</label><select id="cxPrimary">'+muscles.map(m=>opt(m,cap(m),m===x.pm)).join('')+'</select></div></div>'+
  '<fieldset class="cx-secondary"><legend>Supporting muscles</legend>'+muscles.map(m=>'<label><input type="checkbox" value="'+m+'"'+(x.sec.includes(m)?' checked':'')+'> '+cap(m)+'</label>').join('')+'</fieldset>'+
  '<p class="sub">Renaming also updates your past workouts, records and routines that use this exercise.</p>'+
  '<div class="row-wrap"><button type="submit" class="btn btn-primary">Save changes</button><button type="button" class="btn" data-sheet-action="cancel-edit">Cancel</button></div>'+
  '<div class="sub-h">Merge into a library exercise</div><p class="sub">Use this if your custom exercise is the same as one in the library. Your history moves to the library exercise and the custom one is removed.</p>'+
  '<div class="row-wrap"><label class="sr" for="cxMergeTarget">Library exercise to merge into</label><select id="cxMergeTarget"><option value="">Choose an exercise…</option><optgroup label="Same main muscle">'+same.map(e=>opt(e.name,e.name+' ('+e.eq+')',false)).join('')+'</optgroup><optgroup label="Other exercises">'+others.map(e=>opt(e.name,e.name+' ('+e.eq+')',false)).join('')+'</optgroup></select><button type="button" class="btn" data-sheet-action="merge">Merge</button></div>'+
  '<div class="sub-h">Delete</div><p class="sub">Deleting removes it from the library. Workouts you already logged keep their history.</p>'+
  '<button type="button" class="btn" data-sheet-action="delete" style="color:var(--danger);border-color:var(--danger)">'+(sheetState.confirmDelete?'Tap again to delete permanently':'Delete exercise')+'</button></form>';
}

// --- B24: custom exercise management ---
// Pure-ish: renames an exercise everywhere it is referenced by name. Returns how many records changed.
function renameExerciseEverywhere(target,from,to,muscle){
 const key=String(from||'').trim().toLowerCase();if(!key||!to)return 0;let n=0;
 const fix=o=>{if(o&&typeof o.name==='string'&&o.name.trim().toLowerCase()===key){o.name=to;if(muscle&&'muscle' in o)o.muscle=muscle;n++;}};
 (target.workouts||[]).forEach(fix);(target.lastSession||[]).forEach(fix);(target.prs||[]).forEach(fix);
 (target.sessions||[]).forEach(s=>{(s.exercises||[]).forEach(fix);if(Array.isArray(s.names))s.names=s.names.map(x=>String(x).trim().toLowerCase()===key?to:x);(s.prs||[]).forEach(fix);});
 (target.routines||[]).forEach(r=>(r.exercises||[]).forEach(fix));
 ((target.deluxe&&target.deluxe.plans)||[]).forEach(p=>(p.days||[]).forEach(d=>(d.exercises||[]).forEach(fix)));
 Object.values(target.dailyHistory||{}).forEach(d=>(d.workouts||[]).forEach(fix));
 if(target.lastSummary){(target.lastSummary.prs||[]).forEach(fix);if(Array.isArray(target.lastSummary.names))target.lastSummary.names=target.lastSummary.names.map(x=>String(x).trim().toLowerCase()===key?to:x);}
 if(target.lastKg)Object.keys(target.lastKg).forEach(k=>{if(k.trim().toLowerCase()===key){target.lastKg[to]=target.lastKg[k];if(k!==to)delete target.lastKg[k];}});
 return n;
}
function customIndexById(id){return (state.customEx||[]).findIndex(c=>c&&(c.id===id||normalizeCustomExercise(c,0).id===id));}
function saveCustomExerciseEdit(form){
 const id=form.dataset.customId,i=customIndexById(id);if(i<0)return;
 const old=normalizeCustomExercise(state.customEx[i],i),name=$('cxName').value.trim().slice(0,60),pm=$('cxPrimary').value,sec=[...form.querySelectorAll('.cx-secondary input:checked')].map(c=>c.value).filter(m=>m!==pm);
 if(!name)return showToast('Enter a name');
 const clash=allEx().find(e=>e.name.toLowerCase()===name.toLowerCase()&&e.id!==old.id);if(clash)return showToast('“'+name+'” already exists'+(clash.custom?'':' in the library — use Merge instead'));
 state.customEx[i]=Object.assign({},state.customEx[i],{id:old.id,name,eq:$('cxEquip').value,type:EX_TYPES[$('cxType').value]?$('cxType').value:'weights',pm,sec,custom:true});
 const moved=name!==old.name?renameExerciseEverywhere(state,old.name,name,cap(pm)):0;
 sheetState.name=name;sheetState.mode='view';saveState();renderExerciseSheet();showToast('Saved'+(moved?' · '+moved+' logged item'+(moved===1?'':'s')+' renamed':''));
}
function mergeCustomExercise(){
 const i=customIndexById($('exerciseSheet').querySelector('form[data-custom-id]')?.dataset.customId);if(i<0)return;
 const custom=normalizeCustomExercise(state.customEx[i],i),target=exerciseByName($('cxMergeTarget').value);
 if(!target||target.custom)return showToast('Choose a library exercise to merge into');
 const moved=renameExerciseEverywhere(state,custom.name,target.name,cap(target.pm));
 markRecordDeleted('customEx',state.customEx[i]);state.customEx.splice(i,1);
 if(state.exFav&&state.exFav[custom.id]){state.exFav[custom.id]=0;state.exFav[target.id]=1;}
 sheetState={name:target.name,mode:'view',swapIndex:null,confirmDelete:false};saveState();renderExerciseSheet();showToast('Merged into '+target.name+(moved?' · '+moved+' logged item'+(moved===1?'':'s')+' moved':''));
}
function deleteCustomExercise(){
 if(!sheetState)return;
 if(!sheetState.confirmDelete){sheetState.confirmDelete=true;renderExerciseSheet();$('exerciseSheet').querySelector('[data-sheet-action="delete"]')?.focus();return;}
 const i=customIndexById($('exerciseSheet').querySelector('form[data-custom-id]')?.dataset.customId);if(i<0)return;
 const custom=normalizeCustomExercise(state.customEx[i],i);markRecordDeleted('customEx',state.customEx[i]);state.customEx.splice(i,1);if(state.exFav)state.exFav[custom.id]=0;
 $('exerciseSheet').close();saveState();showToast('Deleted '+custom.name+'. Logged workouts keep their history.');
}
function swapWorkoutExercise(index,name){
 if(index===null||index===undefined)return;
 const w=state.workouts[index],x=exerciseByName(name);if(!w||!x)return;
 if(w.setList.some(s=>s.done))return showToast('Sets are already ticked for this exercise; add the new one instead');
 const old=w.name;w.name=x.name;w.muscle=cap(x.pm);w.setList=suggestedSetsFor(x.name).sets;syncW(w);
 $('exerciseSheet').close();refreshTraining();showToast('Swapped '+old+' for '+x.name);
}
function renderCustomExerciseList(){
 const host=$('customExercisePanel');if(!host)return;
 const list=allEx().filter(e=>e.custom).sort((a,b)=>a.name.localeCompare(b.name));
 host.innerHTML='<h3>Your custom exercises</h3><p>Edit, merge into a library exercise or delete the exercises you created.</p>'+
  (list.length?'<ul class="custom-ex-list">'+list.map(e=>'<li><span><strong>'+esc(e.name)+'</strong><small class="sub">'+esc(e.eq)+' · '+esc(e.pm)+'</small></span><button type="button" class="btn" data-custom-manage="'+esc(e.name)+'" aria-label="Manage '+esc(e.name)+'">Manage</button></li>').join('')+'</ul>':'<p class="sub">None yet. Create one from “Can’t find it? Add a custom exercise” on the Training screen.</p>');
}
function initLibraryControls(){
 const dialog=$('exerciseSheet');
 if(dialog){
  dialog.addEventListener('click',e=>{const b=e.target.closest('[data-sheet-action]');if(!b)return;const a=b.dataset.sheetAction,n=b.dataset.name;
   if(a==='close')dialog.close();else if(a==='view'){sheetState={name:n,mode:'view',swapIndex:sheetState.swapIndex,confirmDelete:false};renderExerciseSheet();$('exerciseSheetTitle').focus();}
   else if(a==='add'){const x=exerciseByName(n);if(x){dialog.close();addEx(x.id);}}
   else if(a==='swap')swapWorkoutExercise(sheetState.swapIndex,n);
   else if(a==='edit'){sheetState.mode='edit';sheetState.confirmDelete=false;renderExerciseSheet();$('cxName')?.focus();}
   else if(a==='cancel-edit'){sheetState.mode='view';renderExerciseSheet();$('exerciseSheetTitle').focus();}
   else if(a==='merge')mergeCustomExercise();else if(a==='delete')deleteCustomExercise();});
  dialog.addEventListener('submit',e=>{const f=e.target.closest('form.custom-ex-form');if(!f)return;e.preventDefault();saveCustomExerciseEdit(f);});
  // The close event is queued, so it can arrive after the sheet was reopened; only reset when it is really closed.
  dialog.addEventListener('close',()=>{if(!dialog.open)sheetState=null;});
 }
 $('customExercisePanel')?.addEventListener('click',e=>{const b=e.target.closest('[data-custom-manage]');if(b)openExerciseSheet(b.dataset.customManage,{mode:'edit'});});
 $('exPreview')?.addEventListener('click',e=>{const b=e.target.closest('[data-ex-details]');if(b)openExerciseSheet(b.dataset.exDetails);});
}

// ===== Batch 9: Deluxe entitlement, purchase, restore, free-tier limits, planner upgrades =====
// Deluxe comes from the server (public.deluxe_entitlements via the gymplified-deluxe function).
// The ?demo=1 developer unlock still exists for testing and is never shown to normal visitors.
const DELUXE_PRICE_LABEL='€9.99';
const FREE_ROUTINE_LIMIT=5;
const DELUXE_CACHE_PREFIX='gymplified_deluxe_access_v1:';
let deluxeAccess={checked:false,deluxe:false,salesOpen:false,userId:''};
function readDeluxeCache(uid){try{const c=JSON.parse(localStorage.getItem(DELUXE_CACHE_PREFIX+uid)||'null');return c&&typeof c.deluxe==='boolean'?c:null;}catch(e){return null;}}
function writeDeluxeCache(uid,value){try{localStorage.setItem(DELUXE_CACHE_PREFIX+uid,JSON.stringify({deluxe:!!value.deluxe,salesOpen:!!value.salesOpen,at:Date.now()}));}catch(e){}}
async function callDeluxe(action){
 if(!sb||!currentUser)throw new Error('Sign in to continue');
 const r=await sb.functions.invoke('gymplified-deluxe',{body:{action}});
 if(r.error)throw r.error;if(r.data&&r.data.error)throw new Error(r.data.error);
 return r.data||{};
}
// The server answer always wins. A cached answer is only used when the server cannot be reached
// (offline), so a paying user keeps Deluxe in the gym without signal.
async function refreshDeluxeAccess(){
 if(!sb||!currentUser){deluxeAccess={checked:true,deluxe:false,salesOpen:false,userId:''};renderDeluxeUI();return deluxeAccess;}
 const uid=currentUser.id;
 try{const d=await callDeluxe('status');deluxeAccess={checked:true,deluxe:!!d.deluxe,salesOpen:!!d.salesOpen,userId:uid};writeDeluxeCache(uid,deluxeAccess);}
 catch(e){const c=readDeluxeCache(uid);deluxeAccess={checked:true,deluxe:!!(c&&c.deluxe),salesOpen:!!(c&&c.salesOpen),userId:uid,offline:true};}
 if(currentUser&&currentUser.id===uid){renderDeluxeUI();try{renderWorkoutHero();}catch(e){}}
 return deluxeAccess;
}
function deluxeOwned(){return !!(deluxeAccess.deluxe&&currentUser&&deluxeAccess.userId===currentUser.id);}
function deluxeDemoOn(){if(!deluxeDemoAllowed())return false;try{return localStorage.getItem(DELUXE_DEMO_KEY)==='1';}catch(e){return false;}}
async function buyDeluxe(button){
 if(!currentUser){showToast('Sign in or create an account first — Deluxe is linked to your account');showScreen('friends',document.querySelector('nav button[data-screen="friends"]'));return;}
 if(button)button.disabled=true;
 try{const d=await callDeluxe('checkout');if(d.alreadyOwned){await refreshDeluxeAccess();showToast('Deluxe is already unlocked on your account');return;}if(!d.url)throw new Error('Checkout is not available right now');location.assign(d.url);}
 catch(e){showToast(e.message||'Checkout is not available right now');}
 finally{if(button)button.disabled=false;}
}
async function restoreDeluxe(button){
 if(!currentUser){showToast('Sign in with the account you used to buy Deluxe');showScreen('friends',document.querySelector('nav button[data-screen="friends"]'));return;}
 if(button)button.disabled=true;
 try{const d=await callDeluxe('restore');await refreshDeluxeAccess();showToast(d.deluxe?(d.restored?'Purchase found — Deluxe restored':'Deluxe is unlocked on your account'):'No Deluxe purchase was found for this account');}
 catch(e){showToast(e.message||'Could not check purchases right now');}
 finally{if(button)button.disabled=false;}
}
// Coming back from Stripe Checkout. The webhook may take a few seconds, so check a few times.
async function handleDeluxeReturn(){
 let params;try{params=new URLSearchParams(location.search);}catch(e){return;}
 const result=params.get('deluxe');if(!result)return;
 params.delete('deluxe');params.delete('session_id');
 try{history.replaceState(null,'',location.pathname+(params.toString()?'?'+params.toString():'')+location.hash);}catch(e){}
 if(result==='cancel'){showToast('Checkout cancelled — you have not been charged');return;}
 if(result!=='success')return;
 showScreen('deluxe',document.querySelector('nav button[data-screen="deluxe"]'));showToast('Payment received. Unlocking Deluxe…');
 for(let i=0;i<8;i++){
  if(!currentUser)await new Promise(r=>setTimeout(r,1500));
  if(currentUser){const a=await refreshDeluxeAccess();if(a.deluxe){celebrate({icon:'✨',title:'Deluxe unlocked',text:'Thank you! Deluxe is now part of your account on every device.'});return;}}
  await new Promise(r=>setTimeout(r,2000));
 }
 showToast('Your payment is still being confirmed. Tap “Restore purchase” in a minute.');
}
function canSaveRoutine(){return deluxeEnabled()||(state.routines||[]).length<FREE_ROUTINE_LIMIT;}

// --- H5: planner upgrades ---
let deluxeEditingPlanId=null;
function renderPlannerExerciseList(){const list=$('deluxeExerciseList');if(list&&!list.childElementCount)list.innerHTML=allEx().map(x=>'<option value="'+esc(x.name)+'"></option>').join('');}
function moveDraftDay(i,delta){const j=i+delta;if(!(i>=0&&j>=0&&i<deluxePlanDraft.length&&j<deluxePlanDraft.length))return;const d=deluxePlanDraft.splice(i,1)[0];deluxePlanDraft.splice(j,0,d);renderDeluxePlanDraft();
 // Keep keyboard focus on the moved day; at the top/bottom edge the same-direction button is disabled, so fall back to the other one.
 const box=$('deluxePlanDraft'),pick=a=>box.querySelector('[data-plan-action="'+a+'"][data-i="'+j+'"]:not(:disabled)');(pick(delta<0?'up':'down')||pick(delta<0?'down':'up'))?.focus();}
function editDeluxePlan(index){
 const plan=state.deluxe?.plans?.[index];if(!plan)return;
 deluxePlanDraft=JSON.parse(JSON.stringify(plan.days||[]));deluxeEditingPlanId=plan.id;$('deluxePlanName').value=plan.name;renderDeluxePlanDraft();
 $('deluxePlanName').focus();showToast('Editing '+plan.name+' — save to keep your changes');
}
// Pure: today's day in a plan, matched by weekday name in the day label (e.g. "Day 1 · Monday").
function planDayForDate(plans,date){
 const weekday=new Date(date).toLocaleDateString('en-GB',{weekday:'long'}).toLowerCase();
 for(const plan of plans||[])for(const day of plan.days||[])if(String(day.day||'').toLowerCase().includes(weekday)&&(day.exercises||[]).length)return {plan,day};
 return null;
}
function loadPlanDay(plan,day,startNow){
 (state.workouts||[]).forEach(x=>markRecordDeleted('workouts',x));
 state.workouts=(day.exercises||[]).map(e=>{const x=exerciseByName(e.name);return syncW({name:e.name,muscle:x?cap(x.pm):'',plan:{sets:e.sets,reps:e.reps,kg:e.kg,name:plan.name,day:day.day},setList:Array.from({length:e.sets},()=>({kg:e.kg,reps:e.reps,done:false}))});});
 if(startNow&&!state.session)state.session={start:Date.now(),xpStart:Number(state.game.xp)||0};
 saveState();showToast(day.day+' loaded'+(startNow?' — workout started':''));goToTraining();
}
// Pure: how many planned exercises reached their planned sets and reps (warm-ups do not count).
function planOutcome(workouts){
 const planned=(workouts||[]).filter(w=>w.plan&&w.plan.sets>0);
 const completed=planned.filter(w=>(w.setList||[]).filter(s=>s.done&&setTypeOf(s)!=='warmup'&&Number(s.reps)>=Number(w.plan.reps)).length>=Number(w.plan.sets)).length;
 return planned.length?{planned:planned.length,completed,name:planned[0].plan.name||'',day:planned[0].plan.day||''}:null;
}
function planLineMarkup(w){
 if(!w.plan)return '';const done=(w.setList||[]).filter(s=>s.done&&setTypeOf(s)!=='warmup').length;
 return '<div class="plan-line"><span>📋 Planned '+Number(w.plan.sets)+' × '+Number(w.plan.reps)+(Number(w.plan.kg)>0?' · '+esc(fmtWeight(w.plan.kg,2)):'')+'</span><span>'+Math.min(done,Number(w.plan.sets))+'/'+Number(w.plan.sets)+' sets done'+(done>=Number(w.plan.sets)?' ✓':'')+'</span></div>';
}
function initDeluxeControls(){
 $('deluxeBuyBtn')?.addEventListener('click',e=>buyDeluxe(e.currentTarget));
 $('deluxeRestoreBtn')?.addEventListener('click',e=>restoreDeluxe(e.currentTarget));
 $('deluxePlanDraft')?.addEventListener('click',e=>{const b=e.target.closest('[data-plan-action]');if(!b)return;const i=Number(b.dataset.i);if(b.dataset.planAction==='up')moveDraftDay(i,-1);else if(b.dataset.planAction==='down')moveDraftDay(i,1);});
 $('deluxePlanLibrary')?.addEventListener('click',e=>{const b=e.target.closest('[data-plan-edit]');if(b)editDeluxePlan(Number(b.dataset.planEdit));});
 $('workoutHero')?.addEventListener('click',e=>{if(!e.target.closest('[data-hero-action="plan"]'))return;const today=planDayForDate(state.deluxe&&state.deluxe.plans,new Date());if(today)loadPlanDay(today.plan,today.day,true);});
 handleDeluxeReturn();
}

// ===== Gymplified accounts + real friend connections =====
const SUPABASE_URL='https://ouwvujtsrnotnwtbvqhc.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_3iqgTv1xyZgxhnD8iV1uMQ_DcrlHxPj';
let sb=null,currentUser=null,currentProfile=null,authMode='signup',friendRequests=[],friendProfiles={},searchTimer=null,socialBusy=false,pendingVerificationEmail='';
window.getGymplifiedSupabaseClient=function(){return sb;};
function avatarMarkup(p,small){
 const c='account-avatar'+(small?' small':'');
 let safeUrl='';
 try{
  const url=new URL(p&&p.avatar_url||'');
  if(url.origin==='https://ouwvujtsrnotnwtbvqhc.supabase.co'&&url.pathname.startsWith('/storage/v1/object/public/avatars/')&&/\.(?:jpe?g|png|webp)$/i.test(url.pathname))safeUrl=url.href;
 }catch(_){}
 if(safeUrl)return '<img class="'+c+'" src="'+esc(safeUrl)+'" alt="'+esc(p.display_name||p.username||'Profile picture')+'">';
 return '<div class="'+c+'">'+esc(String(p?(p.display_name||p.username||'?'):'?').trim().charAt(0).toUpperCase()||'?')+'</div>';
}
function socialError(e){const m=e&&(e.message||e.error_description)?(e.message||e.error_description):'Something went wrong. Please try again.';showToast(m.length>110?m.slice(0,107)+'…':m);return m;}
async function initSocial(){
 const host=$('friendStatus');if(!window.supabase||!window.supabase.createClient){host.textContent='Account services could not load. Refresh and try again.';return;}
 sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 const r=await sb.auth.getSession();if(r.error)socialError(r.error);currentUser=r.data&&r.data.session?r.data.session.user:null;
 if(currentUser&&!currentUser.email_confirmed_at){await sb.auth.signOut();currentUser=null;authMode='signup';renderAuthPanel('Please verify your email address before using your Gymplified account.');}
 if(currentUser){const syncMode=prepareLocalAccountState(currentUser.id);await loadMyProfile();if(syncMode===true)showLegacyLocalDataDialog();else await syncUserAppState(syncMode==='cloud');loadSupportTickets();}renderFriends();refreshDeluxeAccess();
 sb.auth.onAuthStateChange(function(_event,session){setTimeout(async function(){const nextUser=session?session.user:null;if(nextUser&&!nextUser.email_confirmed_at){await sb.auth.signOut();currentUser=null;renderAuthPanel('Please verify your email address before using Gymplified.');return;}const changed=(currentUser&&currentUser.id)!==(nextUser&&nextUser.id);let syncMode=false;if(changed){resetCloudSaveQueue();cloudSyncUserId=null;cloudSyncLoadingUserId=null;if(currentUser&&nextUser){if(pendingLegacyAccountId===currentUser.id){try{localStorage.setItem(ACCOUNT_STATE_PREFIX+'unassigned',JSON.stringify(state));}catch(_){}pendingLegacyAccountId=null;}else saveAccountLocalSnapshot(currentUser.id);}if(nextUser)syncMode=prepareLocalAccountState(nextUser.id);else if(currentUser)releaseLocalAccountState(currentUser.id);}currentUser=nextUser;currentProfile=null;if(currentUser){await loadMyProfile();if(changed&&syncMode!==true)await syncUserAppState(syncMode==='cloud');if(syncMode===true)showLegacyLocalDataDialog();loadSupportTickets();}else{resetCloudSaveQueue();cloudSyncUserId=null;$('supportTicketList').innerHTML='<p class="sub">Sign in to see your support requests.</p>';renderAll();}friendRequests=[];friendProfiles={};renderFriends();refreshDeluxeAccess();},0);});
}
async function loadMyProfile(){if(!currentUser){currentProfile=null;return;}const r=await sb.from('profiles').select('id,username,display_name,avatar_url,created_at').eq('id',currentUser.id).maybeSingle();if(r.error){socialError(r.error);return;}currentProfile=r.data;}

let supportCurrentTicketId=null;
function supportStatusLabel(status){return ({open:'Open',in_progress:'In progress',waiting_on_user:'Waiting for you',resolved:'Resolved'})[status]||status;}
async function loadSupportTickets(){
 const host=$('supportTicketList');if(!host)return;if(!sb||!currentUser){host.innerHTML='<p class="sub">Sign in to create and view support requests.</p>';return;}
 host.innerHTML='<p class="sub">Loading your requests…</p>';
 try{const r=await sb.from('support_tickets').select('id,subject,category,status,created_at,updated_at').eq('user_id',currentUser.id).order('updated_at',{ascending:false}).limit(20);if(r.error)throw r.error;
 if(!r.data.length){host.innerHTML='<p class="sub">No support requests yet. If something is wrong, send us a message above.</p>';return;}
 host.innerHTML=r.data.map(t=>'<div class="item-row" style="align-items:center;gap:12px"><div style="flex:1;min-width:0"><strong>'+esc(t.subject)+'</strong><div class="sub">'+esc(supportStatusLabel(t.status))+' · '+new Date(t.updated_at).toLocaleDateString()+'</div></div><button class="btn" type="button" onclick="openSupportTicket('+jsArg(t.id)+')">View</button></div>').join('');
 }catch(e){host.innerHTML='<p class="sub">Could not load your requests. Please try again.</p>';console.warn('Support tickets:',e);}
}
async function submitSupportTicket(event){
 event.preventDefault();if(!sb||!currentUser){$('supportFormStatus').textContent='Please sign in before contacting support.';return;}
 const subject=$('supportSubject').value.trim(),category=$('supportCategory').value,message=$('supportMessage').value.trim(),button=$('supportSubmit');
 if(subject.length<4||message.length<10){$('supportFormStatus').textContent='Please add a subject and a little more detail.';return;}
 button.disabled=true;$('supportFormStatus').textContent='Sending…';
 try{const r=await sb.rpc('gymplified_create_support_ticket',{p_subject:subject,p_category:category,p_message:message});if(r.error)throw r.error;const ticketId=r.data;
 $('supportForm').reset();$('supportFormStatus').textContent='Your request has been sent. You can follow replies below.';await loadSupportTickets();await openSupportTicket(ticketId);showToast('Support request sent');
 }catch(e){$('supportFormStatus').textContent=e.message||'Could not send your request. Please try again.';}
 finally{button.disabled=false;}
}
async function openSupportTicket(id){
 const host=$('supportConversation');supportCurrentTicketId=id;host.innerHTML='<p class="sub">Loading conversation…</p>';
 try{const t=await sb.from('support_tickets').select('id,subject,status,created_at').eq('id',id).eq('user_id',currentUser.id).single();if(t.error)throw t.error;
 const m=await sb.from('support_ticket_messages').select('id,author_role,message,created_at').eq('ticket_id',id).order('created_at',{ascending:true});if(m.error)throw m.error;
 host.innerHTML='<div class="panel" style="margin-top:12px"><div class="section-title">'+esc(t.data.subject)+' <span class="sub">'+esc(supportStatusLabel(t.data.status))+'</span></div>'+m.data.map(x=>'<div style="padding:10px 12px;border:1px solid var(--line);border-radius:10px;margin:8px 0"><div class="sub">'+(x.author_role==='admin'?'Gymplified Support':'You')+' · '+new Date(x.created_at).toLocaleString()+'</div><div style="white-space:pre-wrap;margin-top:6px;font-size:calc(13px * var(--text-scale, 1))">'+esc(x.message)+'</div></div>').join('')+(t.data.status==='resolved'?'<p class="sub">This request is marked resolved. Create a new request if you need more help.</p>':'<div class="field"><label for="supportReplyText">Reply</label><textarea id="supportReplyText" rows="3" maxlength="5000" placeholder="Add more information…"></textarea></div><button class="btn btn-primary" type="button" onclick="replyToSupportTicket()">Send reply</button>')+'</div>';
 }catch(e){host.innerHTML='<p class="sub">Could not open this support request.</p>';console.warn(e);}
}
async function replyToSupportTicket(){
 if(!supportCurrentTicketId||!currentUser)return;const box=$('supportReplyText'),message=box&&box.value.trim();if(!message||message.length<2)return;
 const b=$('supportConversation').querySelector('button');if(b)b.disabled=true;
 try{const r=await sb.from('support_ticket_messages').insert({ticket_id:supportCurrentTicketId,user_id:currentUser.id,message});if(r.error)throw r.error;await loadSupportTickets();await openSupportTicket(supportCurrentTicketId);}
 catch(e){showToast(e.message||'Could not send your reply');if(b)b.disabled=false;}
}

function renderAuthPanel(message){
 const up=authMode==='signup';
 $('friendStatus').innerHTML='<div class="section-title">Your Gymplified account</div><p class="account-hint">Create your profile, connect with friends and sync your progress across devices. We verify email addresses to help protect accounts.</p>'+
 '<div class="account-tabs"><button class="btn '+(up?'active':'')+'" onclick="switchAuthMode(\'signup\')">Create account</button><button class="btn '+(!up?'active':'')+'" onclick="switchAuthMode(\'login\')">Log in</button></div>'+
 '<form class="account-form" onsubmit="handleAuthSubmit(event)">'+
 (up?'<div class="field"><label for="authUsername">Username</label><input id="authUsername" name="username" required minlength="3" maxlength="20" pattern="[A-Za-z0-9_]+" autocomplete="username" placeholder="e.g. johnny_fitness"><div class="account-hint">3–20 characters. Letters, numbers and underscores only.</div></div><div class="field"><label for="authDisplayName">Display name</label><input id="authDisplayName" name="displayName" maxlength="32" placeholder="How should friends see you?"></div>':'')+
 '<div class="field"><label for="authEmail">Email address</label><input id="authEmail" name="email" type="email" required autocomplete="email" placeholder="you@example.com"></div><div class="field"><label for="authPassword">Password</label><input id="authPassword" name="password" type="password" required minlength="8" autocomplete="'+(up?'new-password':'current-password')+'" placeholder="At least 8 characters"></div>'+
 '<button class="btn btn-primary" id="authSubmit" type="submit">'+(up?'Create account':'Log in')+'</button><p class="account-message" id="authMessage" role="status">'+esc(message||'')+'</p><button class="btn" id="resendVerification" type="button" onclick="resendSignupConfirmation()" style="display:none;margin-top:8px">Resend verification email</button></form>'+
 '<p class="account-hint">When you sign in, your workouts, nutrition, personal records and goals sync securely across your devices.</p>';
}
function switchAuthMode(mode){authMode=mode==='login'?'login':'signup';renderAuthPanel('');}
async function handleAuthSubmit(event){
 event.preventDefault();if(!sb||socialBusy)return;const form=event.currentTarget,email=form.email.value.trim(),password=form.password.value;
 const username=form.username?form.username.value.trim().toLowerCase():'';const displayName=form.displayName?form.displayName.value.trim():username;
 const msg=$('authMessage'),button=$('authSubmit'),resend=$('resendVerification');socialBusy=true;button.disabled=true;button.textContent=authMode==='signup'?'Creating account…':'Logging in…';pendingVerificationEmail=email;if(resend)resend.style.display='none';
 try{
  if(authMode==='signup'){
   if(!/^[a-z0-9_]{3,20}$/.test(username))throw new Error('Choose a username with 3–20 letters, numbers or underscores.');
   const check=await sb.from('profiles').select('id').eq('username',username).maybeSingle();if(check.error)throw check.error;if(check.data)throw new Error('That username is already taken. Try another one.');
   const r=await sb.auth.signUp({email,password,options:{data:{username,display_name:(displayName||username).slice(0,32)},emailRedirectTo:window.location.origin+window.location.pathname}});
   if(r.error)throw r.error;
   if(!r.data.session||!r.data.user?.email_confirmed_at){if(r.data.session)await sb.auth.signOut();msg.textContent='Check your inbox for a verification email from Gymplified. You must confirm your address before you can log in. Check your spam folder too.';if(resend)resend.style.display='inline-flex';}
   else showToast('Welcome to Gymplified!');
  }else{
   const r=await sb.auth.signInWithPassword({email,password});
   if(r.error){if(/email not confirmed|email_not_confirmed/i.test(r.error.message||'')){msg.textContent='Your email address has not been verified yet. Check your inbox, or resend the verification email below.';if(resend)resend.style.display='inline-flex';return;}throw r.error;}
   if(!r.data.user?.email_confirmed_at){await sb.auth.signOut();msg.textContent='Please verify your email address before logging in.';if(resend)resend.style.display='inline-flex';return;}
   showToast('Logged in successfully');
  }
 }catch(e){msg.textContent=socialError(e);if(/confirm|verify/i.test(e.message||'')&&resend)resend.style.display='inline-flex';}finally{socialBusy=false;if(button.isConnected){button.disabled=false;button.textContent=authMode==='signup'?'Create account':'Log in';}}
}
async function resendSignupConfirmation(){
 if(!sb||!pendingVerificationEmail){$('authMessage').textContent='Enter your email address first.';return;}
 const b=$('resendVerification');b.disabled=true;b.textContent='Sending…';
 try{const r=await sb.auth.resend({type:'signup',email:pendingVerificationEmail,options:{emailRedirectTo:window.location.origin+window.location.pathname}});if(r.error)throw r.error;$('authMessage').textContent='If that account needs verification, a fresh email has been sent. Check your inbox and spam folder.';}
 catch(e){$('authMessage').textContent=e.message||'Could not resend the verification email. Please wait a moment and try again.';}
 finally{b.disabled=false;b.textContent='Resend verification email';}
}

function renderAccountPanel(){
 const p=currentProfile||{username:currentUser.email?currentUser.email.split('@')[0]:'member',display_name:'Gymplified member'};
 $('friendStatus').innerHTML='<div class="section-title">Your profile <span class="sub">ACCOUNT</span></div><div class="account-head">'+avatarMarkup(p,false)+
 '<div style="flex:1;min-width:180px"><strong style="font:700 19px var(--font-heading)">'+esc(p.display_name||p.username)+'</strong>'+(deluxeEnabled()&&state.deluxe&&state.deluxe.profileFlair?'<span class="deluxe-pill" style="margin-left:6px">DELUXE</span>':'')+'<div class="sub">@'+esc(p.username)+'</div><div class="account-hint">'+esc(currentUser.email||'')+'</div></div>'+
 '<div class="account-actions"><button class="btn" onclick="$(\'avatarFile\').click()">Change picture</button><button class="btn" onclick="signOutAccount()">Sign out</button></div></div>'+
 '<input type="file" id="avatarFile" accept="image/png,image/jpeg,image/webp" hidden onchange="uploadAvatar(this.files[0])">'+
 '<div class="account-grid"><div class="account-card"><div class="field"><label for="profileUsername">Username</label><input id="profileUsername" value="'+esc(p.username||'')+'" maxlength="20" autocomplete="username"></div><div class="field"><label for="profileDisplayName">Display name</label><input id="profileDisplayName" value="'+esc(p.display_name||'')+'" maxlength="32"></div><button class="btn btn-primary" onclick="saveProfile()">Save profile</button></div>'+
 '<div class="account-card"><strong>Profile picture</strong><p class="account-hint" style="margin:8px 0">Upload a JPG, PNG or WebP image. Maximum file size: 3 MB.</p><p class="account-hint">Your username is how other people can find you. Your email address is never shown in search results.</p></div></div>';
}
async function saveProfile(){
 if(!currentUser||socialBusy)return;const username=$('profileUsername').value.trim().toLowerCase(),displayName=$('profileDisplayName').value.trim();
 if(!/^[a-z0-9_]{3,20}$/.test(username))return showToast('Username must be 3–20 letters, numbers or underscores.');
 if(!displayName||displayName.length>32)return showToast('Display name must be 1–32 characters.');
 socialBusy=true;try{const c=await sb.from('profiles').select('id').eq('username',username).neq('id',currentUser.id).maybeSingle();if(c.error)throw c.error;if(c.data)throw new Error('That username is already taken.');
 const r=await sb.from('profiles').update({username,display_name:displayName,updated_at:new Date().toISOString()}).eq('id',currentUser.id);if(r.error)throw r.error;await loadMyProfile();renderFriends();showToast('Profile updated');
 }catch(e){socialError(e);}finally{socialBusy=false;}
}
async function uploadAvatar(file){
 if(!file||!currentUser)return;
 const types={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
 if(!types[file.type])return showToast('Choose a JPG, PNG or WebP image.');
 if(file.size<=0||file.size>3*1024*1024)return showToast('Image must be smaller than 3 MB.');
 try{
  const bytes=new Uint8Array(await file.slice(0,12).arrayBuffer());
  const jpeg=bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff;
  const png=bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47&&bytes[4]===0x0d&&bytes[5]===0x0a&&bytes[6]===0x1a&&bytes[7]===0x0a;
  const webp=String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';
  if(!((file.type==='image/jpeg'&&jpeg)||(file.type==='image/png'&&png)||(file.type==='image/webp'&&webp)))return showToast('The selected file does not match its image type.');
  const storage=sb.storage.from('avatars'),path=currentUser.id+'/avatar-'+newRecordId('v')+'.'+types[file.type];
  const uploaded=await storage.upload(path,file,{upsert:false,contentType:file.type,cacheControl:'60'});
  if(uploaded.error)throw uploaded.error;
  const url=storage.getPublicUrl(path).data.publicUrl+'?v='+Date.now();
  const update=await sb.from('profiles').update({avatar_url:url,updated_at:new Date().toISOString()}).eq('id',currentUser.id);
  if(update.error){await storage.remove([path]).catch(()=>{});throw update.error;}
  await loadMyProfile();renderFriends();
  const old=await storage.list(currentUser.id,{limit:100,search:'avatar'});
  if(!old.error&&Array.isArray(old.data)){
   const obsolete=old.data.map(x=>x.name).filter(name=>/^avatar(?:-|\.)[^/]*\.(?:jpe?g|png|webp)$/i.test(name)&&name!==path.split('/').pop()).map(name=>currentUser.id+'/'+name);
   if(obsolete.length){const removed=await storage.remove(obsolete);if(removed.error)console.warn('Old avatar cleanup failed:',removed.error.message);}
  }
  showToast('Profile picture updated');
 }catch(error){socialError(error);}
}
async function signOutAccount(){const r=await sb.auth.signOut();if(r.error)socialError(r.error);else showToast('Signed out');}
async function fetchSocialData(){
 if(!currentUser)return;const r=await sb.from('friend_requests').select('id,requester_id,receiver_id,status,created_at').or('requester_id.eq.'+currentUser.id+',receiver_id.eq.'+currentUser.id).order('created_at',{ascending:false});if(r.error)throw r.error;friendRequests=r.data||[];
 const ids=Array.from(new Set(friendRequests.flatMap(function(x){return[x.requester_id,x.receiver_id];}))).filter(function(id){return id!==currentUser.id;});if(!ids.length){friendProfiles={};return;}
 const p=await sb.from('profiles').select('id,username,display_name,avatar_url').in('id',ids);if(p.error)throw p.error;friendProfiles={};(p.data||[]).forEach(function(x){friendProfiles[x.id]=x;});
}
function renderFriends(){
 if(!currentUser){$('friendConnections').style.display='none';$('friendSearchPanel').style.display='none';leaderboardRows=null;feedItems=null;renderLeaderboard();renderFeed();renderAuthPanel('');return;}
 $('friendConnections').style.display='block';$('friendSearchPanel').style.display='block';renderAccountPanel();
 renderLeaderboard();renderFeed();loadFriendsCircle().catch(function(e){leaderboardError=feedError=socialError(e);leaderboardRows=leaderboardRows||[];feedItems=feedItems||[];renderLeaderboard();renderFeed();});
 fetchSocialData().then(function(){
  const incoming=friendRequests.filter(function(x){return x.receiver_id===currentUser.id&&x.status==='pending';});
  const outgoing=friendRequests.filter(function(x){return x.requester_id===currentUser.id&&x.status==='pending';});
  const accepted=friendRequests.filter(function(x){return x.status==='accepted';});acceptedFriendCount=accepted.length;
  const row=function(p,actions,note){if(!p)return '';return '<div class="profile-row">'+avatarMarkup(p,true)+'<div class="profile-info"><strong>'+esc(p.display_name||p.username)+'</strong><small>@'+esc(p.username)+(note?' · '+esc(note):'')+'</small></div>'+(actions||'')+'</div>';};
  let html='<div class="section-title">Your connections</div><div class="account-section-title">Friends ('+accepted.length+')</div>';
  html+=accepted.length?accepted.map(function(x){const id=x.requester_id===currentUser.id?x.receiver_id:x.requester_id;return row(friendProfiles[id],'<button class="btn" style="color:var(--danger)" onclick="removeFriend('+jsArg(x.id)+')">Remove</button>');}).join(''):'<p class="account-hint">No friends yet. Search for a username to send your first request.</p>';
  html+='<div class="account-section-title">Incoming requests ('+incoming.length+')</div>';
  html+=incoming.length?incoming.map(function(x){return row(friendProfiles[x.requester_id],'<button class="btn btn-primary" onclick="respondFriendRequest('+jsArg(x.id)+',true)">Accept</button><button class="btn" onclick="respondFriendRequest('+jsArg(x.id)+',false)">Decline</button>');}).join(''):'<p class="account-hint">No new friend requests.</p>';
  html+='<div class="account-section-title">Sent requests ('+outgoing.length+')</div>';
  html+=outgoing.length?outgoing.map(function(x){return row(friendProfiles[x.receiver_id],'<button class="btn" onclick="removeFriend('+jsArg(x.id)+')">Cancel</button>','Pending');}).join(''):'<p class="account-hint">You have no pending sent requests.</p>';
  $('friendConnections').innerHTML=html;
 }).catch(function(e){$('friendConnections').innerHTML='<p class="account-message">'+esc(socialError(e))+'</p>';});
}
async function searchFriends(query){
 clearTimeout(searchTimer);const q=String(query||'').trim().replace(/^@/,'');const out=$('searchOut');if(!q){out.innerHTML='';return;}if(!currentUser){out.innerHTML='<p class="account-hint">Log in to search for friends.</p>';return;}
 searchTimer=setTimeout(async function(){out.innerHTML='<p class="account-hint">Searching…</p>';try{
  const term=q.replace(/[^a-zA-Z0-9 _-]/g,'').trim();if(!term){out.innerHTML='<p class="account-hint">Search using letters or numbers.</p>';return;}const r=await sb.from('profiles').select('id,username,display_name,avatar_url').or('username.ilike.%'+term+'%,display_name.ilike.%'+term+'%').neq('id',currentUser.id).limit(12);if(r.error)throw r.error;
  const known=new Set(friendRequests.map(function(x){return x.requester_id===currentUser.id?x.receiver_id:x.requester_id;}));const matches=(r.data||[]).filter(function(x){return !known.has(x.id);});
  out.innerHTML=matches.length?matches.map(function(p){return '<div class="profile-row">'+avatarMarkup(p,true)+'<div class="profile-info"><strong>'+esc(p.display_name)+'</strong><small>@'+esc(p.username)+'</small></div><button class="btn btn-primary" onclick="sendFriendRequest('+jsArg(p.id)+')">Add friend</button></div>';}).join(''):'<p class="account-hint">No matching usernames found.</p>';
 }catch(e){out.innerHTML='<p class="account-message">'+esc(socialError(e))+'</p>'; }},250);
}
async function sendFriendRequest(id){
 if(!currentUser)return showToast('Log in first.');try{const old=friendRequests.find(function(x){return(x.requester_id===currentUser.id&&x.receiver_id===id)||(x.requester_id===id&&x.receiver_id===currentUser.id);});if(old)return showToast('A request or friendship already exists.');
 const r=await sb.from('friend_requests').insert({requester_id:currentUser.id,receiver_id:id});if(r.error)throw r.error;showToast('Friend request sent');$('friendSearch').value='';$('searchOut').innerHTML='';await fetchSocialData();renderFriends();
 }catch(e){socialError(e);}
}
async function respondFriendRequest(id,accept){
 try{if(accept){const r=await sb.from('friend_requests').update({status:'accepted',accepted_at:new Date().toISOString()}).eq('id',id);if(r.error)throw r.error;showToast('Friend request accepted');}
 else{const r=await sb.from('friend_requests').delete().eq('id',id);if(r.error)throw r.error;showToast('Friend request declined');}await fetchSocialData();renderFriends();
 }catch(e){socialError(e);}
}
async function removeFriend(id){
 if(!confirm('Remove this friend or cancel this request?'))return;try{const r=await sb.from('friend_requests').delete().eq('id',id);if(r.error)throw r.error;await fetchSocialData();renderFriends();showToast('Connection removed');}catch(e){socialError(e);}
}
// ===== Installable app / offline shell =====
let deferredInstallPrompt=null;
function isGymplifiedInstalled(){
 return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true;
}
function updateInstallUI(){
 const app=document.querySelector('.app'),button=$('installAppButton');
 if(isGymplifiedInstalled()){app&&app.classList.add('is-installed');return;}
 app&&app.classList.remove('is-installed');
 if(button){const long=deferredInstallPrompt?'Install app':'Add to Home Screen';button.innerHTML='<span class="top-label-long">'+long+'</span><span class="top-label-short">Install</span>';button.setAttribute('aria-label',long);}
}
function closeInstallHelp(){const panel=$('installHelp');if(panel)panel.hidden=true;}
function installGymplified(){
 if(isGymplifiedInstalled()){showToast('Gymplified is already installed');return;}
 if(deferredInstallPrompt){
  const prompt=deferredInstallPrompt;deferredInstallPrompt=null;prompt.prompt();
  prompt.userChoice.then(function(choice){if(choice&&choice.outcome==='accepted')showToast('Gymplified added to your apps');updateInstallUI();}).catch(updateInstallUI);
  return;
 }
 const panel=$('installHelp'),intro=$('installHelpIntro'),steps=$('installSteps');
 const ua=navigator.userAgent||'',isApple=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 const isSafari=isApple&&!/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
 if(isApple){
  intro.textContent=isSafari?'Install directly from Safari:':'For the best iPhone/iPad install experience, open this page in Safari, then use Share → Add to Home Screen.';
  steps.innerHTML='<li>Open this page in <strong>Safari</strong>.</li><li>Tap the <strong>Share</strong> button (square with an upward arrow).</li><li>Scroll down and choose <strong>Add to Home Screen</strong>.</li><li>Keep “Open as Web App” enabled if shown, then tap <strong>Add</strong>.</li>';
 }else{
  intro.textContent='Install Gymplified from your browser menu:';
  steps.innerHTML='<li>Open the browser menu (⋮).</li><li>Choose <strong>Install app</strong> or <strong>Add to Home Screen</strong>.</li><li>Confirm the install, then launch Gymplified from its new app icon.</li>';
 }
 panel.hidden=false;panel.scrollIntoView({behavior:reducedMotion()?'auto':'smooth',block:'nearest'});
}
window.addEventListener('beforeinstallprompt',function(event){event.preventDefault();deferredInstallPrompt=event;updateInstallUI();});
window.addEventListener('appinstalled',function(){deferredInstallPrompt=null;closeInstallHelp();updateInstallUI();showToast('Gymplified installed');});
window.addEventListener('online',function(){showToast('You are back online');if(sb&&currentUser)queueCloudStateSave();});
window.addEventListener('offline',function(){showToast('Offline mode · your on-device logs still work');});
if('serviceWorker' in navigator){
 window.addEventListener('load',function(){
  navigator.serviceWorker.register('./sw.js',{scope:'./'}).then(function(reg){reg.update().catch(function(){});})
   .catch(function(err){console.warn('Gymplified offline support unavailable:',err);});
 });
}
updateInstallUI();
window.addEventListener('pageshow',updateInstallUI);


/* ===== Gymplified Deluxe: real, data-driven tools ===== */
let deluxePlanDraft=[];
// TODO(H3): this is NOT a paywall. Before any payment goes live, Deluxe entitlement must come from a
// server-side column (e.g. profiles.deluxe_until / profiles.deluxe_lifetime) enforced in RLS/RPC.
// Until then the local demo flag is only honoured behind the ?demo=1 developer flag.
const DELUXE_DEMO_KEY='gymplified_deluxe_demo';
function deluxeDemoAllowed(){try{return new URLSearchParams(location.search).get('demo')==='1';}catch(e){return false;}}
// A4: Deluxe is unlocked by the server entitlement; the local demo flag only works behind ?demo=1.
function deluxeEnabled(){return deluxeOwned()||deluxeDemoOn();}
function deluxeDownload(filename,content,type){
 const blob=new Blob([content],{type:type||'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function deluxeAllSessions(){return (Array.isArray(state.sessions)?state.sessions:[]).slice().filter(s=>s&&Array.isArray(s.exercises)).sort((a,b)=>String(a.date).localeCompare(String(b.date)));}
function deluxeSessionVolume(s){return (s.exercises||[]).reduce((n,e)=>n+(e.sets||[]).reduce((v,x)=>v+(x.type==='warmup'?0:(Number(x.kg)||0)*(Number(x.reps)||0)),0),0);}
function deluxeWeekStart(date){const d=new Date(date+'T12:00:00');d.setDate(d.getDate()-daysSinceWeekStart(d));return dayKey(d);}
function deluxeRecentWeeks(count){
 const out=[],now=new Date();
 for(let i=count-1;i>=0;i--){const d=new Date(now);d.setDate(d.getDate()-daysSinceWeekStart(d)-i*7);const key=dayKey(d);out.push({key,label:d.toLocaleDateString(undefined,{month:'short',day:'numeric'}),sessions:deluxeAllSessions().filter(s=>deluxeWeekStart(s.date)===key)});}
 return out.map(w=>Object.assign(w,{volume:w.sessions.reduce((n,s)=>n+deluxeSessionVolume(s),0),workouts:w.sessions.length,sets:w.sessions.reduce((n,s)=>n+(Number(s.sets)||0),0)}));
}
function renderDeluxeUI(){
 const owned=deluxeOwned(),demo=!owned&&deluxeDemoOn(),enabled=owned||demo,open=deluxeAccess.salesOpen,signedIn=!!currentUser;
 const status=$('deluxeStatus'),toggle=$('deluxeDemoToggle'),locked=$('deluxeLockedNotice'),tools=$('deluxeTools'),demoBox=$('deluxeDemoControls'),demoBtn=$('deluxeDemoUnlockBtn');
 const set=(id,text)=>{const el=$(id);if(el)el.textContent=text;};
 if(status){status.textContent=owned?'✓ DELUXE UNLOCKED':demo?'✓ DEMO UNLOCKED':open?'ONE-TIME '+DELUXE_PRICE_LABEL:!signedIn?'SIGN IN TO BUY':'COMING SOON';status.classList.toggle('is-unlocked',enabled);}
 if($('deluxeBuyBtn'))$('deluxeBuyBtn').hidden=owned||!(open||!signedIn);
 if($('deluxeRestoreBtn'))$('deluxeRestoreBtn').hidden=owned||!(open||!signedIn);
 set('deluxePriceNote',owned?'one-time · paid':open||!signedIn?'one-time · no subscription':'one-time · coming soon');
 set('deluxeHeroText',owned?'Thank you for supporting Gymplified. Deluxe is part of your account on every device.':'Handy extras on top of the full free tracker. Everything you need to log and improve stays free.');
 set('deluxeSalesNote',owned?'Deluxe is linked to your account. Sign in on any device to use it.':!signedIn?'Deluxe is linked to your Gymplified account. Sign in to buy it or restore an earlier purchase.':open?'One-time payment of '+DELUXE_PRICE_LABEL+' through Stripe. No subscription. Bought it before? Tap Restore purchase.':'Deluxe is not on sale yet. No payment is taken on this page.');
 // TODO(owner/legal): add the approved EU/UK withdrawal-right and refund wording here and in terms.html before sales open.
 set('deluxeLockedTitle',open?'Unlock Deluxe to use these tools.':'Deluxe tools are locked.');
 set('deluxeLockedText',open?'A one-time '+DELUXE_PRICE_LABEL+' purchase unlocks them on your account.':!signedIn?'Sign in to see whether Deluxe is available for your account.':'Deluxe is not on sale yet, so these tools cannot be unlocked.');
 if(toggle)toggle.textContent=demo?'Demo unlocked on this device':deluxeAccess.offline&&owned?'Offline — using your saved Deluxe status':'';
 if(demoBox)demoBox.hidden=!deluxeDemoAllowed();if(demoBtn)demoBtn.textContent=deluxeDemoOn()?'Turn off demo unlock':'Enable demo unlock';
 if(locked)locked.hidden=enabled;if(tools)tools.hidden=!enabled;
 document.querySelectorAll('.deluxe-feature .lock').forEach(el=>el.textContent=enabled?'✨':'🔒');
 if(enabled){renderDeluxeAnalytics();renderDeluxePerformanceOptions();renderDeluxePlanLibrary();renderDeluxeCustomisation();renderPlannerExerciseList();}
}
function updateDeluxeUI(){renderDeluxeUI();}
function toggleDeluxeDemo(){
 if(!deluxeDemoAllowed()){showToast('Deluxe is currently preview-only');return;}
 try{localStorage.setItem(DELUXE_DEMO_KEY,deluxeDemoOn()?'0':'1');renderDeluxeUI();showToast(deluxeDemoOn()?'Deluxe demo unlocked on this device':'Deluxe demo lock restored');}
 catch(e){showToast('Could not save demo setting on this device');}
}
function openDeluxeDemo(){if(!deluxeEnabled()){previewDeluxeFeature('Gymplified Deluxe');return;}renderDeluxeAnalytics();$('deluxeTools')?.scrollIntoView({behavior:reducedMotion()?'auto':'smooth',block:'start'});}
const DELUXE_PREVIEW_COPY={
 'Advanced analytics':'Explore weekly volume trends, strength progression, estimated 1RM charts and exercise comparisons.',
 'Smart training insights':'Review muscle-group workload, training balance and recovery signals based on your workout history.',
 'Workout planner':'Create structured training blocks, organise weekly sessions and track plan completion.',
 'Performance lab':'Compare personal records, best sets and estimated one-rep max changes for each exercise.',
 'Complete data tools':'Generate detailed workout reports and manage comprehensive backups and exports.',
 'Deluxe customisation':'Unlock exclusive Deluxe profile flair, premium themes and additional appearance settings.',
 'Gymplified Deluxe':'Gymplified Deluxe is a €9.99 one-time upgrade with handy extras. The free tracker stays complete.'
};
function previewDeluxeFeature(name){
 if(deluxeEnabled()){
  const smooth=reducedMotion()?'auto':'smooth';
  const actions={'Advanced analytics':()=>renderDeluxeAnalytics(),'Smart training insights':()=>{$('deluxeInsights')?.scrollIntoView({behavior:smooth,block:'center'});},'Workout planner':()=>{$('deluxePlanName')?.focus();},'Performance lab':()=>{$('deluxeExerciseSelect')?.focus();},'Complete data tools':()=>{$('deluxeExportStatus')?.scrollIntoView({behavior:smooth,block:'center'});},'Deluxe customisation':()=>{$('deluxeAccent')?.focus();}};
  if(actions[name]){actions[name]();return;}
 }
 $('deluxeModalTitle').textContent=name;
 $('deluxeModalText').textContent=(DELUXE_PREVIEW_COPY[name]||'This tool is part of Gymplified Deluxe.')+(deluxeAccess.salesOpen?' Unlock Deluxe with a one-time '+DELUXE_PRICE_LABEL+' purchase to use it.':' Deluxe is not on sale yet.');
 const dialog=$('deluxeModal');if(dialog&&!dialog.open)dialog.showModal();
}
function closeDeluxeModal(){const dialog=$('deluxeModal');if(dialog&&dialog.open)dialog.close();}
$('deluxeDemoUnlockBtn')?.addEventListener('click',toggleDeluxeDemo);
function renderDeluxeAnalytics(){
 if(!deluxeEnabled())return;
 const sessions=deluxeAllSessions(),weeks=deluxeRecentWeeks(8),recent=weeks.slice(-4),previous=weeks.slice(0,4);
 const recentVol=recent.reduce((n,w)=>n+w.volume,0),previousVol=previous.reduce((n,w)=>n+w.volume,0);
 const change=previousVol?((recentVol-previousVol)/previousVol*100):null;
 $('deluxeVolumeMetric').textContent=recentVol?fmtVolume(recentVol):'—';
 $('deluxeVolumeCompare').textContent=change===null?'Log and finish workouts to build a trend':(change>=0?'↑ ':'↓ ')+Math.abs(change).toFixed(1)+'% vs previous 4 weeks';
 const since=Date.now()-28*86400000,month=sessions.filter(s=>new Date((s.date||'')+'T23:59:59').getTime()>=since);
 $('deluxeWorkoutMetric').textContent=month.length;
 $('deluxeWorkoutCompare').textContent=month.reduce((n,s)=>n+(Number(s.sets)||0),0)+' completed sets · last 28 days';
 const bests=[];
 sessions.forEach(s=>(s.exercises||[]).forEach(e=>(e.sets||[]).forEach(set=>{const rm=calculate1RM(set.kg,set.reps);if(rm>0)bests.push(rm);})));
 (state.prs||[]).forEach(p=>{const rm=calculate1RM(p.weight,p.reps);if(rm>0)bests.push(rm);});
 $('deluxeStrengthMetric').textContent=bests.length?fmtWeight(Math.max(...bests)):'—';
 $('deluxeStrengthCompare').textContent=bests.length?'Highest saved estimated 1RM':'Add a PR or complete a workout';
 const max=Math.max(1,...weeks.map(w=>w.volume));
 $('deluxeVolumeChart').innerHTML=weeks.map(w=>'<span class="deluxe-bar" style="height:'+Math.max(3,w.volume/max*100)+'%" title="'+esc(w.label)+': '+esc(fmtVolume(w.volume))+'"></span>').join('');
 $('deluxeVolumeLabels').innerHTML='<span>'+esc(weeks[0].label)+'</span><span>'+esc(weeks[weeks.length-1].label)+'</span>';
 const muscles={};month.forEach(s=>(s.exercises||[]).forEach(e=>{const k=String(e.muscle||'Other').trim()||'Other';muscles[k]=(muscles[k]||0)+(e.sets||[]).length;}));
 const muscleRows=Object.entries(muscles).sort((a,b)=>b[1]-a[1]).slice(0,8),muscleMax=Math.max(1,...muscleRows.map(x=>x[1]));
 $('deluxeMuscleBreakdown').innerHTML=muscleRows.length?muscleRows.map(([name,n])=>'<div style="margin:10px 0"><div class="meta-row"><strong>'+esc(name)+'</strong><span>'+n+' sets</span></div><div class="progress-bar"><i style="width:'+(n/muscleMax*100)+'%"></i></div></div>').join(''):'<p class="sub">Finish workouts with exercises to see your muscle-group workload.</p>';
 const insights=[];
 if(sessions.length<3)insights.push('Log at least three completed workouts to unlock more useful trend comparisons.');
 else{
  if(change!==null)insights.push(change>10?'Your recorded training volume is rising compared with the previous four weeks. Keep progression gradual.':change< -10?'Your recorded training volume is lower than the previous four weeks. Check whether this matches your current training plan.':'Your training volume is relatively steady across the two four-week periods.');
  const under=muscleRows.filter(x=>x[1]===Math.min(...muscleRows.map(y=>y[1])));if(under.length&&muscleRows.length>1)insights.push('Least represented logged muscle group: '+under[0][0]+'. This is a logging-based balance prompt, not a prescription.');
  const recentCutoff=Date.now()-48*3600000,recentMuscles=[];
  sessions.filter(s=>new Date(s.finishedAt||((s.date||'')+'T23:59:59')).getTime()>=recentCutoff).forEach(s=>(s.exercises||[]).forEach(e=>{const m=String(e.muscle||'').trim();if(m&&!recentMuscles.includes(m))recentMuscles.push(m);}));
  if(recentMuscles.length)insights.push('Recently logged in the last 48 hours: '+recentMuscles.join(', ')+'. Use your own recovery needs to decide when to train these areas again.');
  const latest=sessions[sessions.length-1],days=Math.floor((Date.now()-new Date((latest.date||'')+'T12:00:00').getTime())/86400000);
  if(Number.isFinite(days))insights.push(days===0?'You have a workout logged today.':days===1?'Your last completed workout was yesterday.':days+' days since your last completed workout.');
 }
 $('deluxeInsights').innerHTML=insights.map(x=>'<div class="deluxe-insight">• '+esc(x)+'</div>').join('');
}
function renderDeluxePerformanceOptions(){
 const select=$('deluxeExerciseSelect');if(!select)return;
 const names=new Set();deluxeAllSessions().forEach(s=>(s.exercises||[]).forEach(e=>names.add(e.name)));
 (state.prs||[]).forEach(p=>names.add(p.name));
 const old=select.value,sorted=Array.from(names).filter(Boolean).sort();
 select.innerHTML=sorted.length?sorted.map(n=>'<option value="'+esc(n)+'">'+esc(n)+'</option>').join(''):'<option value="">No exercise history yet</option>';
 if(sorted.includes(old))select.value=old;renderDeluxePerformance();
}
function renderDeluxePerformance(){
 const select=$('deluxeExerciseSelect');if(!select)return;const name=select.value;
 const rows=[];
 deluxeAllSessions().forEach(s=>(s.exercises||[]).filter(e=>e.name===name).forEach(e=>{const sets=(e.sets||[]).map(x=>({kg:Number(x.kg)||0,reps:Number(x.reps)||0,rm:calculate1RM(x.kg,x.reps)})).filter(x=>x.rm>0);if(sets.length)rows.push({date:s.date,sets,best:Math.max(...sets.map(x=>x.rm))});}));
 (state.prs||[]).filter(p=>p.name===name).forEach(p=>rows.push({date:p.date,sets:[{kg:p.weight,reps:p.reps,rm:calculate1RM(p.weight,p.reps)}],best:calculate1RM(p.weight,p.reps)}));
 rows.sort((a,b)=>String(a.date).localeCompare(String(b.date)));
 const all=rows.flatMap(x=>x.sets),best=all.length?Math.max(...all.map(x=>x.rm)):0,first=rows.length?rows[0].best:0;
 $('deluxeExerciseBest').textContent=best?fmtWeight(best):'—';
 $('deluxeExerciseChange').textContent=first&&best?((best-first)>=0?'+':'')+fmtWeight(best-first):'—';
 $('deluxePerformanceRows').innerHTML=rows.length?'<table class="deluxe-table"><thead><tr><th>Date</th><th>Best set</th><th>Est. 1RM</th></tr></thead><tbody>'+rows.slice().reverse().map(r=>{const x=r.sets.reduce((a,b)=>!a||b.rm>a.rm?b:a,null);return '<tr><td>'+esc(r.date)+'</td><td>'+esc(fmtWeight(x.kg,2))+' × '+x.reps+'</td><td>'+esc(fmtWeight(x.rm))+'</td></tr>';}).join('')+'</tbody></table>':'<p class="sub">No saved sets for this exercise yet. Finish a workout or record a personal best.</p>';
}
function addDeluxePlanExercise(){
 const name=$('deluxePlanExercise').value.trim(),sets=Number($('deluxePlanSets').value),reps=Number($('deluxePlanReps').value),kg=Math.round(displayToKg(Number($('deluxePlanKg').value))*1000)/1000;
 if(!name)return showToast('Enter an exercise name for your plan');
 if(!exerciseByName(name))showToast('“'+name+'” is not in the library; it is added as typed');
 if(!(sets>=1&&sets<=20&&reps>=1&&reps<=100&&kg>=0&&kg<=1000))return showToast('Check the planned sets, reps and weight');
 const day=$('deluxePlanDay').value;
 let target=deluxePlanDraft.find(x=>x.day===day);if(!target){target={day,exercises:[]};deluxePlanDraft.push(target);}
 target.exercises.push({name,sets,reps,kg});$('deluxePlanExercise').value='';renderDeluxePlanDraft();
}
function renderDeluxePlanDraft(){
 const host=$('deluxePlanDraft');if(!host)return;
 host.innerHTML=deluxePlanDraft.length?deluxePlanDraft.map((d,i)=>'<div class="deluxe-plan-row"><div class="plan-day-head"><strong>'+esc(d.day)+'</strong><span class="row-wrap"><button type="button" class="btn btn-icon-only" data-plan-action="up" data-i="'+i+'" aria-label="Move '+esc(d.day)+' earlier"'+(i===0?' disabled':'')+'>↑</button><button type="button" class="btn btn-icon-only" data-plan-action="down" data-i="'+i+'" aria-label="Move '+esc(d.day)+' later"'+(i===deluxePlanDraft.length-1?' disabled':'')+'>↓</button></span></div>'+d.exercises.map((e,j)=>'<div style="display:flex;justify-content:space-between;gap:8px;margin-top:6px"><span>'+esc(e.name)+' · '+e.sets+' × '+e.reps+' · '+esc(fmtWeight(e.kg,2))+'</span><button class="btn" onclick="removeDeluxeDraftExercise('+i+','+j+')">Remove</button></div>').join('')+'</div>').join(''):'<p class="sub">Your plan is empty. Add exercises to start building it.</p>';
}
function removeDeluxeDraftExercise(i,j){if(deluxePlanDraft[i]){deluxePlanDraft[i].exercises.splice(j,1);if(!deluxePlanDraft[i].exercises.length)deluxePlanDraft.splice(i,1);renderDeluxePlanDraft();}}
function saveDeluxePlan(){
 const name=$('deluxePlanName').value.trim();if(!name)return showToast('Give your training plan a name');
 if(!deluxePlanDraft.length)return showToast('Add at least one exercise to your plan');
 state.deluxe=state.deluxe||{plans:[]};state.deluxe.plans=Array.isArray(state.deluxe.plans)?state.deluxe.plans:[];
 const days=JSON.parse(JSON.stringify(deluxePlanDraft)),existing=deluxeEditingPlanId?state.deluxe.plans.findIndex(p=>p.id===deluxeEditingPlanId):-1;
 if(existing>=0)state.deluxe.plans[existing]=Object.assign({},state.deluxe.plans[existing],{name,days});
 else state.deluxe.plans.unshift({id:newRecordId('deluxe-plan'),name,createdAt:new Date().toISOString(),days});
 state.deluxe.plans=state.deluxe.plans.slice(0,50);deluxePlanDraft=[];deluxeEditingPlanId=null;$('deluxePlanName').value='';renderDeluxePlanLibrary();renderDeluxePlanDraft();saveState();showToast('Deluxe training plan saved');
}
function renderDeluxePlanLibrary(){
 const host=$('deluxePlanLibrary');if(!host)return;const plans=state.deluxe&&Array.isArray(state.deluxe.plans)?state.deluxe.plans:[];
 host.innerHTML=plans.length?'<div class="sub-h">Saved plans</div>'+plans.map((p,i)=>'<div class="deluxe-plan-row"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><strong>'+esc(p.name)+'</strong><span class="sub">'+p.days.reduce((n,d)=>n+d.exercises.length,0)+' planned exercises</span></div><div class="row-wrap" style="margin-top:9px"><button class="btn btn-primary" onclick="loadDeluxePlan('+i+')">Load a day</button><button type="button" class="btn" data-plan-edit="'+i+'">Edit</button><button class="btn" onclick="deleteDeluxePlan('+i+')">Delete</button></div></div>').join(''):'<p class="sub">Your saved training plans will appear here.</p>';
 renderDeluxePlanDraft();
}
let deluxePendingPlanIndex=null;
function loadDeluxePlan(index){
 const plan=state.deluxe?.plans?.[index];if(!plan)return;
 const days=plan.days||[];if(!days.length)return showToast('This plan has no days to load');
 const select=$('deluxePlanDaySelect'),dialog=$('deluxePlanDayDialog');if(!select||!dialog)return;
 select.innerHTML=days.map((d,i)=>'<option value="'+i+'">'+esc(d.day)+'</option>').join('');
 $('deluxePlanDayDescription').textContent=state.workouts.length?'Loading a day will replace the exercises currently in your Training Log.':'Choose which day to add to your Training Log.';
 deluxePendingPlanIndex=index;dialog.showModal();
}
function showLegacyLocalDataDialog(){const dialog=$('legacyLocalDataDialog');if(dialog&&!dialog.open)dialog.showModal();}
function downloadLegacyLocalBackup(){try{const raw=localStorage.getItem(ACCOUNT_STATE_PREFIX+'unassigned');if(!raw)return showToast('No recovery copy is available');const a=document.createElement('a'),url=URL.createObjectURL(new Blob([raw],{type:'application/json'}));a.href=url;a.download='gymplified-local-recovery-'+dayKey()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast('Recovery copy downloaded');}catch(error){showToast('Could not download the recovery copy');}}
async function resolveLegacyLocalData(merge){const id=pendingLegacyAccountId;if(!id||!currentUser||currentUser.id!==id)return;const dialog=$('legacyLocalDataDialog');if(dialog&&dialog.open)dialog.close();pendingLegacyAccountId=null;if(!merge)state=blankAccountState();else clearLegacyBackupAfterSync=true;state.accountOwnerId=id;try{localStorage.setItem(ACCOUNT_OWNER_KEY,id);}catch(_){}persistLocalState(false);await syncUserAppState(!merge);loadSupportTickets();renderAll();}
function closeDeluxePlanDayDialog(){const dialog=$('deluxePlanDayDialog');if(dialog&&dialog.open)dialog.close();deluxePendingPlanIndex=null;}
function confirmLoadDeluxePlan(){
 const plan=state.deluxe?.plans?.[deluxePendingPlanIndex],select=$('deluxePlanDaySelect');
 if(!plan||!select)return closeDeluxePlanDayDialog();
 const selected=(plan.days||[])[Number(select.value)];if(!selected)return showToast('Choose a valid training day');
 closeDeluxePlanDayDialog();loadPlanDay(plan,selected,false);
}
function deleteDeluxePlan(index){
 const plans=state.deluxe?.plans;if(!plans||!plans[index]||!confirm('Delete this training plan?'))return;
 plans.splice(index,1);saveState();renderDeluxePlanLibrary();
}
function deluxeCSVCell(value){const s=String(value==null?'':value);return '"'+s.replace(/"/g,'""')+'"';}
function exportDeluxeCSV(){
 const rows=[['Workout date','Exercise','Muscle group','Set number','Weight '+weightUnit(),'Reps','Estimated 1RM '+weightUnit()]];
 deluxeAllSessions().forEach(s=>(s.exercises||[]).forEach(e=>(e.sets||[]).forEach((set,i)=>rows.push([s.date,e.name,e.muscle||'',i+1,kgToDisplay(set.kg,2),set.reps,kgToDisplay(calculate1RM(set.kg,set.reps),1)]))));
 if(rows.length===1)return showToast('No completed workout sets to export yet');
 deluxeDownload('gymplified-deluxe-workouts-'+dayKey()+'.csv','\uFEFF'+rows.map(row=>row.map(deluxeCSVCell).join(',')).join('\r\n'),'text/csv;charset=utf-8');
 $('deluxeExportStatus').textContent='Workout CSV exported · '+(rows.length-1)+' sets.';
}
function exportDeluxeReport(){
 const sessions=deluxeAllSessions();if(!sessions.length)return showToast('Complete a workout before generating your report');
 const totalVolume=sessions.reduce((n,s)=>n+deluxeSessionVolume(s),0),totalSets=sessions.reduce((n,s)=>n+(Number(s.sets)||0),0);
 const lines=['GYMPLIFIED DELUXE — TRAINING REPORT','Generated: '+new Date().toLocaleString(),'','SUMMARY','Completed workouts: '+sessions.length,'Completed sets: '+totalSets,'Total logged volume: '+fmtVolume(totalVolume),'','WORKOUT HISTORY'];
 sessions.slice().reverse().forEach(s=>{lines.push('',s.date+' · '+(s.mins||0)+' min · '+fmtVolume(deluxeSessionVolume(s)));(s.exercises||[]).forEach(e=>lines.push('  '+e.name+' ('+(e.muscle||'muscle not specified')+'): '+(e.sets||[]).map(x=>fmtWeight(x.kg,2)+' × '+x.reps+' reps').join(', ')));});
 deluxeDownload('gymplified-deluxe-report-'+dayKey()+'.txt',lines.join('\n'),'text/plain;charset=utf-8');
 $('deluxeExportStatus').textContent='Progress report generated from '+sessions.length+' completed workouts.';
}
function saveDeluxeCustomisation(){
 const accent=$('deluxeAccent').value,theme=$('deluxeTheme').value,flair=$('deluxeProfileFlair').checked;
 state.deluxe=state.deluxe||{};state.deluxe.accent=accent;state.deluxe.theme=theme;state.deluxe.profileFlair=flair;
 state.settings.color=accent;state.settings.theme=theme;saveState();showToast('Deluxe appearance saved');
}
function renderDeluxeCustomisation(){
 const d=state.deluxe||{};if($('deluxeAccent'))$('deluxeAccent').value=d.accent||'gold';
 if($('deluxeTheme'))$('deluxeTheme').value=d.theme||'dark';
 if($('deluxeProfileFlair'))$('deluxeProfileFlair').checked=d.profileFlair!==false;
}

// Boot initial render
initPicker();
initSocial();
initWaterControls();
initWorkoutControls();
initSettingsControls();
initGameControls();
initFriendsControls();
initNutritionControls();
initAccessibilityControls();
initLibraryControls();
initDeluxeControls();
initGoals();
if(state._rolloverPending){delete state._rolloverPending;saveState();}
renderAll();
