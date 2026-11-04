/* Gymplified privacy-conscious first-party analytics */
(function(){
  const allowedFeatures = new Set(['dashboard','workouts','nutrition','progress','goals','friends','settings','body_metrics','personal_records','other']);
  let client = null, userId = null, sessionId = null;
  try {
    sessionId = sessionStorage.getItem('gymplified_analytics_session');
    if (!sessionId) { sessionId = crypto.randomUUID(); sessionStorage.setItem('gymplified_analytics_session', sessionId); }
  } catch (_) { sessionId = crypto.randomUUID(); }
  function send(eventName, feature) {
    if (!client) return;
    const payload = { event_name:eventName, user_id:userId, session_id:sessionId, feature:allowedFeatures.has(feature)?feature:null };
    client.from('analytics_events').insert(payload).then(function(r){ if(r.error) console.warn('Analytics event not recorded:',r.error.message); });
  }
  function start(){
    if (!window.supabase || !window.supabase.createClient) return;
    // Reuse the same project and persisted Supabase session as the main app.
    client = window.supabase.createClient('https://ouwvujtsrnotnwtbvqhc.supabase.co','sb_publishable_3iqgTv1xyZgxhnD8iV1uMQ_DcrlHxPj',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    client.auth.getSession().then(function(r){
      userId = r.data && r.data.session ? r.data.session.user.id : null;
      send('page_view',null); send('app_open',null); send('session_started',null);
    });
    client.auth.onAuthStateChange(function(_event,session){ userId = session ? session.user.id : null; });
    if (typeof window.showScreen === 'function') {
      const originalShowScreen = window.showScreen;
      window.showScreen = function(screenId, btn) {
        const result = originalShowScreen.apply(this,arguments);
        const map = {dashboard:'dashboard',training:'workouts',nutrition:'nutrition',prs:'personal_records',friends:'friends',settings:'settings',progress:'progress',goals:'goals'};
        send('feature_used',map[screenId] || 'other');
        return result;
      };
    }
    if (typeof window.savePRRecord === 'function') {
      const originalSavePR = window.savePRRecord;
      window.savePRRecord = function(){ const before = document.querySelectorAll('#prList .pr-card').length; const result=originalSavePR.apply(this,arguments); send('personal_record_added','personal_records'); return result; };
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();