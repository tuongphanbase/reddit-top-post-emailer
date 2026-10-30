// Fills the status panel from latest.json, which every run of the bot rewrites.
const STATUS_TEXT = {
  'ok': ['Gửi email bình thường', 'success'],
  'no new memes': ['Không có meme mới để gửi', ''],
  'no new posts': ['Không có bài mới để gửi', ''],
  'blocked by Reddit - API credentials needed': ['Bị Reddit chặn', 'warning'],
};
const NOTES = {
  'blocked by Reddit - API credentials needed':
    'Reddit chặn API ẩn danh từ máy chủ GitHub, nên lần chạy này không gửi email. ' +
    'Thêm hai secret REDDIT_CLIENT_ID và REDDIT_CLIENT_SECRET vào repo (Settings → Secrets and variables → Actions) để bot gửi lại.',
};

function timeAgo(d){
  const m = Math.floor((Date.now() - d.getTime()) / 60000);
  if(m < 1) return 'vừa xong';
  if(m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if(h < 24) return `${h} giờ trước`;
  return `${Math.floor(h / 24)} ngày trước`;
}

async function load(){
  const state = document.getElementById('state');
  let data = null;
  try{
    const res = await fetch('latest.json', {cache: 'no-store'});
    if(res.ok) data = await res.json();
  }catch(e){}
  if(!data){ state.textContent = 'Chưa có dữ liệu'; return; }
  const [label, cls] = STATUS_TEXT[data.status] || [data.status || 'Không rõ', 'warning'];
  state.textContent = label;
  state.className = `tag ${cls}`;
  document.getElementById('items').textContent = data.item_count ?? '—';
  if(data.updated_at){
    const d = new Date(data.updated_at);
    const p2 = (n) => String(n).padStart(2, '0');
    document.getElementById('updated').textContent =
      `${p2(d.getHours())}:${p2(d.getMinutes())} ${p2(d.getDate())}/${p2(d.getMonth() + 1)} · ${timeAgo(d)}`;
  }
  const note = NOTES[data.status];
  if(note){
    const el = document.getElementById('note');
    el.textContent = note;
    el.hidden = false;
  }
}
load();
