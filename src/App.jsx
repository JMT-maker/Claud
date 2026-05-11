import { useState, useRef, useEffect, useCallback, memo } from "react";

// ══════════ PALETTE ══════════
const D = {
  bg: '#07070f', panel: '#0d0d18', card: '#13131e', card2: '#191926',
  bdr: '#242436', bdr2: '#1c1c2c', tx: '#d2d2e0', sub: '#65658a', sub2: '#38384e',
  ac: '#e07b39', acl: '#221408', blue: '#5b8dee', bluel: '#0a1428',
  red: '#d95252', green: '#48b86a', yellow: '#d4a833', purple: '#9b72e8', teal: '#2ec4b6',
};
const PALETTE = ['#5b8dee', '#e07b39', '#4ab86a', '#9b72e8', '#d95252', '#2ec4b6', '#d4a833', '#e56b9b'];
const COL_TYPES = [{ id: 'subject', icon: '📚', label: '과목' }, { id: 'professor', icon: '👨‍🏫', label: '교수' }, { id: 'project', icon: '🗂️', label: '프로젝트' }];

// ══════════ UI LANGUAGES ══════════
const LANGS = {
  ko: {
    title: '강의 AI 분석기', newCol: '+ 새 컬렉션', save: '💾 저장', load: '📂 불러오기',
    kakaoLink: '카카오 연동', kakaoAfter: '카카오 (배포 후 사용)', logout: '로그아웃',
    newEvent: '+ New Event', noEvents: '아직 녹음이 없습니다', noEventsDesc: 'New Event로 강의를 녹음하고 AI로 분석해보세요',
    colName: '컬렉션 이름', colType: '유형', colColor: '색상', colSave: '✓ 저장', cancel: '취소',
    eventName: '이벤트 이름', eventPlaceholder: '예: 3주차 강의',
    tabInput: '📥 입력', tabNotes: '📘 학습 노트', tabManual: '📝 필기', tabTranscript: '📄 트랜스크립트', tabQuiz: '🧠 퀴즈',
    inputPlaceholder: '강의 텍스트, 트랜스크립트 등을 여기에 붙여넣으세요...',
    uploadDesc: '파일 드래그 또는 클릭 업로드', uploadSub: '텍스트(.txt .md) · 이미지 · 음성 · PDF',
    genNotes: '🤖 학습 노트 생성', generating: '⏳ 분석 중...', genDesc: '잡음 제거 → 개념 추출 → 코드 정리 중...',
    noNotes: '학습 노트가 없습니다', noNotesDesc: '입력 탭에서 텍스트 입력 또는 파일 업로드 후 생성하세요',
    regen: '🔄 재생성', quiz: '🧠 퀴즈', share: '🔗 공유', kakaoSend: '나에게 보내기', saveTxt: '💾 저장',
    quizStart: '🧠 퀴즈 만들기', quizDesc: '학습 노트 내용으로 객관식 5문제를 생성합니다',
    quizDone: '완료!', correct: '정답', myAnswer: '내 답', retry: '다시 풀기', newQuiz: '새 퀴즈',
    recMic: '🎙 마이크만', recScreen: '🖥️ 화면+마이크', recStart: '● 녹음 시작', recStop: '⏹ 중지',
    chapter: '## 챕터', noteAdd: '저장', notePlaceholder: '노트 작성 (Enter 저장, Shift+Enter 줄바꿈)...',
    audioSave: '💾 오디오 저장', notesSave: '💾 노트 저장', startWith: '시작하기 →',
    langLabel: '언어 설정',
  },
  en: {
    title: 'Lecture AI Analyzer', newCol: '+ New Collection', save: '💾 Save', load: '📂 Load',
    kakaoLink: 'Kakao Link', kakaoAfter: 'Kakao (after deploy)', logout: 'Logout',
    newEvent: '+ New Event', noEvents: 'No recordings yet', noEventsDesc: 'Start a New Event to record and analyze lectures',
    colName: 'Collection Name', colType: 'Type', colColor: 'Color', colSave: '✓ Save', cancel: 'Cancel',
    eventName: 'Event Name', eventPlaceholder: 'e.g. Week 3 Lecture',
    tabInput: '📥 Input', tabNotes: '📘 Study Notes', tabManual: '📝 Manual', tabTranscript: '📄 Transcript', tabQuiz: '🧠 Quiz',
    inputPlaceholder: 'Paste lecture text, transcripts, etc. here...',
    uploadDesc: 'Drag & drop or click to upload', uploadSub: 'Text · Images · Audio · PDF',
    genNotes: '🤖 Generate Study Notes', generating: '⏳ Analyzing...', genDesc: 'Removing noise → Extracting concepts → Organizing code...',
    noNotes: 'No study notes yet', noNotesDesc: 'Input text or upload a file in the Input tab, then generate',
    regen: '🔄 Regenerate', quiz: '🧠 Quiz', share: '🔗 Share', kakaoSend: 'Send to Me', saveTxt: '💾 Save',
    quizStart: '🧠 Create Quiz', quizDesc: 'Generate 5 multiple choice questions from your notes',
    quizDone: 'Done!', correct: 'Correct', myAnswer: 'My answer', retry: 'Retry', newQuiz: 'New Quiz',
    recMic: '🎙 Mic only', recScreen: '🖥️ Screen+Mic', recStart: '● Start', recStop: '⏹ Stop',
    chapter: '## Chapter', noteAdd: 'Save', notePlaceholder: 'Type notes (Enter to save, Shift+Enter for newline)...',
    audioSave: '💾 Save Audio', notesSave: '💾 Save Notes', startWith: 'Start →',
    langLabel: 'Language',
  },
  ja: {
    title: '講義AIアナライザー', newCol: '+ 新しいコレクション', save: '💾 保存', load: '📂 読込',
    kakaoLink: 'カカオ連携', kakaoAfter: 'カカオ (配布後)', logout: 'ログアウト',
    newEvent: '+ 新規イベント', noEvents: '録音がありません', noEventsDesc: '新規イベントで講義を録音・分析しましょう',
    colName: 'コレクション名', colType: '種類', colColor: '色', colSave: '✓ 保存', cancel: 'キャンセル',
    eventName: 'イベント名', eventPlaceholder: '例: 第3週講義',
    tabInput: '📥 入力', tabNotes: '📘 学習ノート', tabManual: '📝 手書き', tabTranscript: '📄 文字起こし', tabQuiz: '🧠 クイズ',
    inputPlaceholder: '講義テキストをここに貼り付けてください...',
    uploadDesc: 'ドラッグまたはクリックしてアップロード', uploadSub: 'テキスト · 画像 · 音声 · PDF',
    genNotes: '🤖 学習ノート生成', generating: '⏳ 分析中...', genDesc: 'ノイズ除去 → 概念抽出 → コード整理中...',
    noNotes: '学習ノートがありません', noNotesDesc: '入力タブでテキストを入力またはファイルをアップロードしてください',
    regen: '🔄 再生成', quiz: '🧠 クイズ', share: '🔗 共有', kakaoSend: '自分に送る', saveTxt: '💾 保存',
    quizStart: '🧠 クイズ作成', quizDesc: '学習ノートから5問の選択問題を生成します',
    quizDone: '完了！', correct: '正解', myAnswer: '私の答え', retry: 'もう一度', newQuiz: '新クイズ',
    recMic: '🎙 マイクのみ', recScreen: '🖥️ 画面+マイク', recStart: '● 録音開始', recStop: '⏹ 停止',
    chapter: '## チャプター', noteAdd: '保存', notePlaceholder: 'ノートを入力 (Enter保存, Shift+Enterで改行)...',
    audioSave: '💾 音声保存', notesSave: '💾 ノート保存', startWith: '開始 →',
    langLabel: '言語設定',
  },
  'zh-CN': {
    title: '讲义AI分析器', newCol: '+ 新建收藏', save: '💾 保存', load: '📂 加载',
    kakaoLink: 'Kakao连接', kakaoAfter: 'Kakao (部署后)', logout: '退出',
    newEvent: '+ 新建事件', noEvents: '暂无录音', noEventsDesc: '通过新建事件开始录制并分析讲义',
    colName: '收藏名称', colType: '类型', colColor: '颜色', colSave: '✓ 保存', cancel: '取消',
    eventName: '事件名称', eventPlaceholder: '例: 第3周讲义',
    tabInput: '📥 输入', tabNotes: '📘 学习笔记', tabManual: '📝 手写', tabTranscript: '📄 转录', tabQuiz: '🧠 测验',
    inputPlaceholder: '请将讲义文本粘贴到这里...',
    uploadDesc: '拖拽或点击上传', uploadSub: '文本 · 图片 · 音频 · PDF',
    genNotes: '🤖 生成学习笔记', generating: '⏳ 分析中...', genDesc: '去除噪音 → 提取概念 → 整理代码...',
    noNotes: '暂无学习笔记', noNotesDesc: '在输入标签中输入文本或上传文件后生成',
    regen: '🔄 重新生成', quiz: '🧠 测验', share: '🔗 分享', kakaoSend: '发给自己', saveTxt: '💾 保存',
    quizStart: '🧠 创建测验', quizDesc: '根据学习笔记生成5道选择题',
    quizDone: '完成！', correct: '正确答案', myAnswer: '我的答案', retry: '重试', newQuiz: '新测验',
    recMic: '🎙 仅麦克风', recScreen: '🖥️ 屏幕+麦克风', recStart: '● 开始录制', recStop: '⏹ 停止',
    chapter: '## 章节', noteAdd: '保存', notePlaceholder: '输入笔记 (Enter保存, Shift+Enter换行)...',
    audioSave: '💾 保存音频', notesSave: '💾 保存笔记', startWith: '开始 →',
    langLabel: '语言设置',
  },
};

// ══════════ AI PROMPTS ══════════
const SYS_NOTES = `당신은 대학 강의 노트 정리 전문가입니다.
규칙: 교수님 잡담·추임새·반복 내용 완전 삭제. 코드·명령어는 코드블록으로. 코드는 순서대로 정리.
반드시 아래 마크다운 형식으로만 출력:
# 📘 학습 노트
## ✅ 핵심 요약
1. (주제)
2. (주요 내용)
3. (결론)
## 📌 주요 개념
1. **개념명**: 설명
## 💻 코드 및 실습
### 실습명
\`\`\`언어
코드
\`\`\`
> 설명
## ⭐ 강조 사항
- 중요 내용
## 📋 To-Do
- [ ] 과제`;

const SYS_QUIZ = `강의 내용으로 객관식 5문제 생성. 순수 JSON 배열만 반환:
[{"q":"질문","options":["A","B","C","D"],"answer":0}]`;

const KAKAO_KEY = '6e6d7995b670a926cf1f93574f302e04';

// ══════════ HELPERS ══════════
const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const nowTs = () => new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const today = () => new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
const fmtSz = b => b > 1e6 ? (b / 1e6).toFixed(1) + 'MB' : (b / 1e3).toFixed(0) + 'KB';
const trunc = (t, n = 8000) => t.length > n ? t.slice(0, n) + '\n...(생략)' : t;

const isVercelEnv = typeof window !== 'undefined' &&
  !window.location.hostname.includes('claude.ai') &&
  !window.location.hostname.includes('anthropic.com');
const isEmbedded = typeof window !== 'undefined' && window.self !== window.top;

const loadKakaoSDK = () => new Promise(resolve => {
  if (window.Kakao) { resolve(); return; }
  const s = document.createElement('script');
  s.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
  s.onload = () => { window.Kakao.init(KAKAO_KEY); resolve(); };
  document.head.appendChild(s);
});

const saveFile = async (content, filename, mimeType = 'text/plain') => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType + ';charset=utf-8' });
  if (isVercelEnv && 'showSaveFilePicker' in window) {
    try {
      const h = await window.showSaveFilePicker({ suggestedName: filename, types: [{ description: 'File', accept: { [mimeType]: ['.' + filename.split('.').pop()] } }] });
      const w = await h.createWritable(); await w.write(blob); await w.close(); return;
    } catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(a.href);
};

const callAPI = async (messages, system, maxTokens = 3000) => {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: maxTokens, ...(system && { system }), messages }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(`API ${res.status}: ${e?.error?.message || res.statusText}`); }
  const d = await res.json();
  return (d.content?.find(b => b.type === 'text')?.text || '').replace(/```json|```/g, '').trim();
};

const INIT_COLS = [
  {
    id: 'c1', name: '알고리즘', type: 'subject', icon: '📚', color: '#5b8dee', events: [
      {
        id: 'e1', title: '1주차: 시간복잡도', date: '2025.03.05', duration: 3240,
        notes: [{ id: 'n1', type: 'chapter', text: '시간복잡도란?', ts: '09:02:14', important: false },
        { id: 'n2', type: 'note', text: '빅오 표기법: 최악 케이스 성능 표현', ts: '09:05:22', important: true }],
        transcript: '', rawInput: '', notes_md: '', quiz: []
      }
    ]
  },
  { id: 'c2', name: '머신러닝', type: 'subject', icon: '📚', color: '#9b72e8', events: [] },
  { id: 'c3', name: '캡스톤 프로젝트', type: 'project', icon: '🗂️', color: '#e07b39', events: [] },
];

// ══════════ MARKDOWN ══════════
function MdView({ md }) {
  if (!md) return null;
  const lines = md.split('\n'); const out = []; let inCode = false, lang = '', cLines = [];
  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (!inCode) { inCode = true; lang = line.slice(3).trim(); cLines = []; }
      else { out.push(<pre key={i} style={{ background: '#0a0d14', color: '#79c0ff', borderRadius: 8, padding: '12px 15px', fontSize: 12, fontFamily: 'monospace', overflowX: 'auto', margin: '8px 0', whiteSpace: 'pre-wrap', wordBreak: 'break-all', border: `1px solid ${D.bdr}` }}>{lang && <div style={{ color: D.sub, fontSize: 10, marginBottom: 6 }}>{lang}</div>}{cLines.join('\n')}</pre>); inCode = false; cLines = []; }
      return;
    }
    if (inCode) { cLines.push(line); return; }
    if (line.startsWith('# ')) out.push(<h2 key={i} style={{ margin: '4px 0 12px', fontSize: 18 }}>{line.slice(2)}</h2>);
    else if (line.startsWith('## ')) out.push(<h3 key={i} style={{ margin: '16px 0 8px', fontSize: 15, color: D.ac, borderBottom: `1px solid ${D.bdr}`, paddingBottom: 5 }}>{line.slice(3)}</h3>);
    else if (line.startsWith('### ')) out.push(<h4 key={i} style={{ margin: '12px 0 6px', fontSize: 13, color: D.blue }}>{line.slice(4)}</h4>);
    else if (line.startsWith('> ')) out.push(<div key={i} style={{ borderLeft: `3px solid ${D.bdr}`, paddingLeft: 10, color: D.sub, fontSize: 12, margin: '4px 0' }}>{line.slice(2)}</div>);
    else if (line.startsWith('- [ ] ')) out.push(<div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', margin: '4px 0' }}><input type="checkbox" style={{ marginTop: 3, accentColor: D.ac }} /><span style={{ fontSize: 13 }}>{line.slice(6)}</span></div>);
    else if (line.startsWith('- ')) out.push(<div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', margin: '4px 0' }}><span style={{ color: D.ac, flexShrink: 0, marginTop: 2 }}>•</span><span style={{ fontSize: 13 }}>{line.slice(2)}</span></div>);
    else if (/^\d+\.\s/.test(line)) { const m = line.match(/^(\d+)\.\s(.*)/); if (m) { const b = m[2].match(/^\*\*(.+?)\*\*:?\s*(.*)/); out.push(<div key={i} style={{ display: 'flex', gap: 8, margin: '5px 0' }}><span style={{ color: D.ac, fontWeight: 700, flexShrink: 0, minWidth: 18 }}>{m[1]}.</span><span style={{ fontSize: 13 }}>{b ? <><b style={{ color: D.blue }}>{b[1]}</b>{b[2] ? ': ' + b[2] : ''}  </> : m[2]}</span></div>); } }
    else if (line.trim()) out.push(<p key={i} style={{ margin: '4px 0', fontSize: 13, lineHeight: 1.65 }}>{line}</p>);
    else out.push(<div key={i} style={{ height: 6 }} />);
  });
  return <div>{out}</div>;
}

// ══════════ ISOLATED TEXTAREA — 타이핑 버그 근본 해결 ══════════
// 부모 state와 완전히 분리된 컴포넌트로 만들어 리렌더링 차단
const IsolatedTextarea = memo(({ initialValue, onBlur, placeholder }) => {
  const [val, setVal] = useState(initialValue || '');
  // initialValue가 외부에서 바뀔 때만 동기화 (파일 업로드 등)
  const prevInit = useRef(initialValue);
  useEffect(() => {
    if (initialValue !== prevInit.current) {
      setVal(initialValue || '');
      prevInit.current = initialValue;
    }
  }, [initialValue]);
  return (
    <textarea
      value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={() => onBlur(val)}
      placeholder={placeholder}
      style={{
        width: '100%', minHeight: 200, background: D.card2, border: `1px solid ${D.bdr}`,
        borderRadius: 10, padding: 14, color: D.tx, fontSize: 13, resize: 'vertical',
        lineHeight: 1.7, marginTop: 7, display: 'block', fontFamily: 'inherit', outline: 'none'
      }}
    />
  );
});

// ══════════ APP ══════════
export default function App() {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      try {
        // 실제 키인 '6e6d7995b670a926cf1f93574f302e04'를 넣었습니다.
        window.Kakao.init('6e6d7995b670a926cf1f93574f302e04');
        console.log('카카오 SDK 초기화 성공');
      } catch (e) {
        console.error('카카오 초기화 실패:', e);
      }
    }
  }, []);

  const [lang, setLang] = useState('ko');
  const T = useCallback((k) => LANGS[lang]?.[k] ?? LANGS.ko[k], [lang]);

  const [view, setView] = useState('home');
  const [cols, setCols] = useState(INIT_COLS);
  const [colId, setColId] = useState(null);
  const [evtId, setEvtId] = useState(null);
  const [evtTab, setEvtTab] = useState('input');

  const [showNC, setShowNC] = useState(false);
  const [showNE, setShowNE] = useState(false);
  const [ncName, setNcName] = useState('');
  const [ncType, setNcType] = useState('subject');
  const [ncColor, setNcColor] = useState('#5b8dee');
  const [neName, setNeName] = useState('');

  const [recMode, setRecMode] = useState('mic');
  const [recOn, setRecOn] = useState(false);
  const [recSec, setRecSec] = useState(0);
  const [caption, setCaption] = useState('');
  const recOnRef = useRef(false);

  // 파일 업로드로 인한 rawInput 변경만 추적 (IsolatedTextarea에 전달용)
  const [fileRawInput, setFileRawInput] = useState('');

  const [aiLoad, setAiLoad] = useState(false);
  const [aiError, setAiError] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [qDone, setQDone] = useState(false);
  const [evtFiles, setEvtFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [showSlides, setShowSlides] = useState(false);
  const [dragOn, setDragOn] = useState(false);
  const [shareToast, setShareToast] = useState('');
  const [kakaoReady, setKakaoReady] = useState(false);
  const [kakaoUser, setKakaoUser] = useState(null);

  // 필기 탭 state — if 블록 내 useState 금지 (Rules of Hooks)
  const [chIn, setChIn] = useState('');
  const [showCh, setShowCh] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTx, setEditTx] = useState('');

  const mrRef = useRef(null), chunkRef = useRef([]), strmRef = useRef(null);
  const recIvRef = useRef(null), secRef = useRef(0), srRef = useRef(null);
  const accRef = useRef(''), noteRef = useRef(null), fileRef = useRef(null), saveJsonRef = useRef(null);
  const notesEnd = useRef(null);
  // rawInput을 ref로 관리 — IsolatedTextarea의 onBlur에서 갱신
  const rawInputRef = useRef('');

  useEffect(() => { recOnRef.current = recOn; }, [recOn]);
  useEffect(() => {
    const e = cols.find(c => c.id === colId)?.events?.find(ev => ev.id === evtId);
    rawInputRef.current = e?.rawInput || '';
    setFileRawInput(e?.rawInput || '');
  }, [evtId, colId]);
  useEffect(() => { notesEnd.current?.scrollIntoView({ behavior: 'smooth' }); },
    [cols.find(c => c.id === colId)?.events?.find(e => e.id === evtId)?.notes?.length]);

  useEffect(() => {
    if (isEmbedded) return;
    loadKakaoSDK().then(() => setKakaoReady(true));
  }, []);

  const getCol = useCallback(() => cols.find(c => c.id === colId), [cols, colId]);
  const getEvt = useCallback(() => getCol()?.events?.find(e => e.id === evtId), [getCol, evtId]);
  const updEvt = useCallback(upd => setCols(p => p.map(c => c.id === colId
    ? { ...c, events: c.events.map(e => e.id === evtId ? { ...e, ...upd } : e) } : c)), [colId, evtId]);

  // ── Collections ─────────────────────────────────────────────
  const mkCol = () => {
    if (!ncName.trim()) return;
    const icon = COL_TYPES.find(t => t.id === ncType)?.icon || '📁';
    setCols(p => [...p, { id: 'c' + Date.now(), name: ncName, type: ncType, icon, color: ncColor, events: [] }]);
    setNcName(''); setNcType('subject'); setNcColor('#5b8dee'); setShowNC(false);
  };
  const saveColsJson = () => saveFile(JSON.stringify(cols, null, 2), `collections_${today()}.json`, 'application/json');
  const loadColsJson = e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => { try { setCols(JSON.parse(ev.target.result)); } catch { } }; r.readAsText(f); e.target.value = ''; };

  // ── Events ──────────────────────────────────────────────────
  const mkEvt = () => {
    const title = neName.trim() || `강의 ${today()}`;
    const e = { id: 'e' + Date.now(), title, date: today(), duration: 0, notes: [], transcript: '', rawInput: '', notes_md: '', quiz: [] };
    setCols(p => p.map(c => c.id === colId ? { ...c, events: [e, ...c.events] } : c));
    setEvtId(e.id); setShowNE(false); setView('event'); setEvtTab('input');
    setAiError(''); setQuiz(null); setEvtFiles([]); setActiveFile(null); setRecSec(0); setCaption('');
    rawInputRef.current = ''; setFileRawInput('');
    setChIn(''); setShowCh(false); setEditId(null); setEditTx(''); setNoteVal('');
  };
  const openEvt = (cid, eid) => {
    setColId(cid); setEvtId(eid); setView('event'); setEvtTab('input');
    setAiError(''); setQuiz(null); setEvtFiles([]); setActiveFile(null);
    setChIn(''); setShowCh(false); setEditId(null); setEditTx(''); setNoteVal('');
  };
  const delEvt = eid => setCols(p => p.map(c => c.id === colId ? { ...c, events: c.events.filter(e => e.id !== eid) } : c));

  // ── Recording ────────────────────────────────────────────────
  const startRec = async () => {
    setAiError('');
    if (!navigator.mediaDevices) { setAiError('⚠ Chrome/Edge에서 실행해주세요.'); return; }
    try {
      let finalStream;
      if (recMode === 'screen_mic') {
        const ds = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        let ms = null; try { ms = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (_) { }
        const ac = new AudioContext(), dest = ac.createMediaStreamDestination();
        if (ds.getAudioTracks().length) ac.createMediaStreamSource(new MediaStream(ds.getAudioTracks())).connect(dest);
        if (ms) ac.createMediaStreamSource(ms).connect(dest);
        finalStream = new MediaStream([...ds.getVideoTracks(), ...dest.stream.getAudioTracks()]);
        ds.getVideoTracks()[0].onended = () => { ms?.getTracks().forEach(t => t.stop()); stopRec(); };
      } else { finalStream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
      strmRef.current = finalStream; chunkRef.current = [];
      const mime = recMode === 'screen_mic' ? (MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm') : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '');
      const mr = new MediaRecorder(finalStream, mime ? { mimeType: mime } : {});
      mr.ondataavailable = e => { if (e.data.size > 0) chunkRef.current.push(e.data); };
      mr.onstop = () => { const blob = new Blob(chunkRef.current, { type: recMode === 'screen_mic' ? 'video/webm' : 'audio/webm' }); updEvt({ audioBlob: URL.createObjectURL(blob), duration: secRef.current, transcript: accRef.current.trim() }); };
      mr.start(500); mrRef.current = mr;
      accRef.current = ''; secRef.current = 0; setRecSec(0);
      recIvRef.current = setInterval(() => { secRef.current++; setRecSec(s => s + 1); }, 1000);
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        const r = new SR(); r.continuous = true; r.interimResults = true; r.lang = 'ko-KR';
        r.onresult = e => {
          let fin = '', interim = ''; for (let i = e.resultIndex; i < e.results.length; i++) { if (e.results[i].isFinal) fin += e.results[i][0].transcript + ' '; else interim = e.results[i][0].transcript; }
          accRef.current += fin; setCaption((accRef.current + interim).trim().split(' ').slice(-16).join(' ')); updEvt({ transcript: accRef.current.trim() });
        };
        r.onend = () => { if (recOnRef.current) r.start(); }; r.start(); srRef.current = r;
      }
      setRecOn(true);
    } catch (err) {
      if (err.name === 'NotAllowedError') setAiError('🚫 권한 거부. 브라우저 🔒 → 마이크 허용 후 새로고침해주세요.');
      else if (isEmbedded) setAiError('⚠ 녹음은 Vercel 배포 후 정상 작동합니다.');
      else setAiError(`녹화 오류(${err.name}): ${err.message}`);
    }
  };
  const stopRec = () => { clearInterval(recIvRef.current); mrRef.current?.stop(); srRef.current?.stop(); strmRef.current?.getTracks().forEach(t => t.stop()); setRecOn(false); setCaption(''); };

  // ── Notes ────────────────────────────────────────────────────
  const [noteVal, setNoteVal] = useState('');
  const addNote = () => {
    const txt = noteVal.trim();
    if (!txt) return;
    updEvt({ notes: [...(getEvt()?.notes || []), { id: 'n' + Date.now(), type: 'note', text: txt, ts: nowTs(), important: false }] });
    setNoteVal('');
    noteRef.current?.focus();
  };
  const addCh = (chIn, setChIn, setShowCh) => { if (!chIn.trim()) return; updEvt({ notes: [...(getEvt()?.notes || []), { id: 'ch' + Date.now(), type: 'chapter', text: chIn.trim(), ts: nowTs(), important: false }] }); setChIn(''); setShowCh(false); };
  const toggleImp = nid => updEvt({ notes: getEvt().notes.map(n => n.id === nid ? { ...n, important: !n.important } : n) });
  const delNote = nid => updEvt({ notes: getEvt().notes.filter(n => n.id !== nid) });

  // ── File Upload ──────────────────────────────────────────────
  const processFiles = fl => {
    Array.from(fl).forEach(file => {
      const isText = /\.(txt|md|csv|json)$/i.test(file.name) || file.type.startsWith('text/');
      const isImg = file.type.startsWith('image/');
      const r = new FileReader();
      if (isText) {
        r.onload = ev => {
          const next = (rawInputRef.current ? rawInputRef.current + '\n\n' : '') + '=== ' + file.name + ' ===\n' + ev.target.result;
          rawInputRef.current = next;
          setFileRawInput(next); // IsolatedTextarea 동기화
          updEvt({ rawInput: next });
          setEvtFiles(p => [...p, { id: 'f' + Date.now(), name: file.name, type: 'text', size: file.size }]);
        };
        r.readAsText(file, 'utf-8');
      } else {
        r.onload = ev => { const url = ev.target.result; const entry = { id: 'f' + Date.now(), name: file.name, type: isImg ? 'image' : 'file', size: file.size, url }; setEvtFiles(p => [...p, entry]); if (isImg) { setActiveFile(entry.id); setShowSlides(true); } };
        r.readAsDataURL(file);
      }
    });
  };

  // ── AI ───────────────────────────────────────────────────────
  const genNotes = async () => {
    const currentRaw = rawInputRef.current;
    updEvt({ rawInput: currentRaw });
    const evt = getEvt(); if (!evt) return;
    const transcript = evt.transcript || '';
    const notesText = evt.notes.map(n => `${n.type === 'chapter' ? '[섹션] ' : ''}[${n.ts}]${n.important ? '⭐' : ''} ${n.text}`).join('\n');
    const combined = [
      currentRaw && `=== 업로드 텍스트 ===\n${trunc(currentRaw, 8000)}`,
      transcript && `=== 실시간 녹음 텍스트 ===\n${trunc(transcript, 4000)}`,
      notesText && `=== 필기 노트 ===\n${trunc(notesText, 2000)}`,
    ].filter(Boolean).join('\n\n');
    if (!combined.trim()) { setAiError('분석할 내용이 없습니다.'); return; }
    setAiLoad(true); setAiError(''); setEvtTab('notes_md');
    try { const result = await callAPI([{ role: 'user', content: `다음 강의 내용을 학습 노트로 정리해주세요:\n\n${combined}` }], SYS_NOTES, 3000); updEvt({ notes_md: result, rawInput: currentRaw }); }
    catch (e) { const m = e.message || ''; setAiError(m.includes('429') ? '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' : 'AI 오류: ' + m); setEvtTab('input'); }
    setAiLoad(false);
  };
  const genQuiz = async () => {
    const evt = getEvt(); if (!evt) return;
    const content = trunc((evt.notes_md || evt.rawInput || evt.transcript || ''), 8000);
    if (!content.trim()) { setAiError('먼저 학습 노트를 생성하세요.'); return; }
    setAiLoad(true); setAiError(''); setEvtTab('quiz'); setQuiz(null); setQIdx(0); setQDone(false);
    try { const raw = await callAPI([{ role: 'user', content: `강의 내용 기반 객관식 5문제:\n${content}` }], SYS_QUIZ, 1200); setQuiz(JSON.parse(raw).map(x => ({ ...x, userAnswer: null }))); }
    catch (e) { setAiError('퀴즈 오류: ' + e.message); }
    setAiLoad(false);
  };

  // ── Kakao ────────────────────────────────────────────────────
  const kakaoLogin = async () => {
    if (isEmbedded) { setShareToast('⚠ 카카오 로그인은 Vercel 배포 후 사용 가능합니다'); setTimeout(() => setShareToast(''), 3000); return; }
    if (!kakaoReady) { setShareToast('⏳ SDK 로딩 중...'); return; }
    window.Kakao.Auth.login({
      scope: 'talk_message',
      success: () => { window.Kakao.API.request({ url: '/v2/user/me', success: res => { setKakaoUser({ nickname: res.kakao_account?.profile?.nickname || '사용자', img: res.kakao_account?.profile?.thumbnail_image_url || null }); setShareToast(`✅ ${res.kakao_account?.profile?.nickname || '사용자'}님 로그인 완료!`); setTimeout(() => setShareToast(''), 2500); } }); },
      fail: err => { setShareToast('❌ 로그인 실패: ' + (err.error_description || err)); setTimeout(() => setShareToast(''), 3000); },
    });
  };
  const kakaoLogout = () => { if (!window.Kakao?.Auth?.getAccessToken()) { setKakaoUser(null); return; } window.Kakao.Auth.logout(() => { setKakaoUser(null); setShareToast('카카오 로그아웃'); setTimeout(() => setShareToast(''), 2000); }); };
  const sendKakao = async () => {
    if (!kakaoUser) { setShareToast('먼저 카카오 로그인을 해주세요.'); setTimeout(() => setShareToast(''), 2500); return; }
    const evt = getEvt(); if (!evt?.notes_md) { setShareToast('❌ 먼저 학습 노트를 생성하세요.'); setTimeout(() => setShareToast(''), 2500); return; }
    const preview = evt.notes_md.replace(/#{1,4}\s/g, '').replace(/\*\*/g, '').replace(/- \[ \] /g, '☐ ').slice(0, 800);
    window.Kakao.API.request({
      url: '/v2/api/talk/memo/default/send',
      data: { template_object: { object_type: 'text', text: `📘 ${evt.title}\n📅 ${evt.date}\n\n${preview}${evt.notes_md.length > 800 ? '\n...(일부 생략)' : ''}`, link: { mobile_web_url: 'https://claude.ai', web_url: 'https://claude.ai' }, button_title: '자세히 보기' } },
      success: () => { setShareToast('✅ 카카오톡 나에게 보내기 완료!'); setTimeout(() => setShareToast(''), 3000); },
      fail: err => { setShareToast('❌ 전송 실패: ' + (err.message || JSON.stringify(err))); setTimeout(() => setShareToast(''), 3500); },
    });
  };
  const shareNotes = async () => {
    const evt = getEvt(); if (!evt?.notes_md) { setShareToast('❌ 먼저 학습 노트를 생성하세요.'); setTimeout(() => setShareToast(''), 2500); return; }
    const payload = JSON.stringify({ title: evt.title, date: evt.date, md: evt.notes_md });
    const b64 = btoa(unescape(encodeURIComponent(payload)));
    const shareUrl = `${window.location.origin}${window.location.pathname}#notes=${b64}`;
    try { await navigator.clipboard.writeText(shareUrl); setShareToast('🔗 공유 링크가 클립보드에 복사됐습니다!'); }
    catch { try { await navigator.clipboard.writeText(evt.notes_md); setShareToast('📋 노트 텍스트가 복사됐습니다!'); } catch { setShareToast('❌ 복사 실패'); } }
    setTimeout(() => setShareToast(''), 3000);
  };

  // ── Export ───────────────────────────────────────────────────
  const exportNotes = async () => {
    const e = getEvt(); if (!e) return;
    const lines = [`# ${e.title}`, `날짜: ${e.date}`, `녹음: ${fmt(e.duration || recSec)}`, ''];
    if (e.notes_md) lines.push('', e.notes_md);
    else { e.notes.forEach(n => n.type === 'chapter' ? lines.push('', '## ' + n.text, '') : lines.push(`[${n.ts}]${n.important ? '⭐' : ''} ${n.text}`)); if (rawInputRef.current) lines.push('', '---', '## 입력 텍스트', '', rawInputRef.current); }
    await saveFile(lines.join('\n'), `${e.title}.txt`);
  };
  const dlAudio = async () => { const e = getEvt(); if (!e?.audioBlob) return; const res = await fetch(e.audioBlob); const blob = await res.blob(); await saveFile(blob, `${e.title}.webm`, 'video/webm'); };

  // ══════════ UI ATOMS ══════════
  const Btn = ({ onClick, ch, bg = D.ac, tc = '#fff', pad = '8px 18px', fs = 13, dis = false, full = false, st = {} }) => (
    <button onClick={onClick} disabled={dis} style={{ background: bg, color: tc, border: 'none', borderRadius: 8, padding: pad, cursor: dis ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: fs, opacity: dis ? .5 : 1, transition: 'all .15s', width: full ? '100%' : 'auto', ...st }}>{ch}</button>
  );
  const Ghost = ({ onClick, ch, pad = '7px 14px', fs = 12, st = {} }) => (
    <button onClick={onClick} style={{ background: D.card2, color: D.sub, border: `1px solid ${D.bdr}`, borderRadius: 7, padding: pad, cursor: 'pointer', fontWeight: 600, fontSize: fs, ...st }}>{ch}</button>
  );
  const Lbl = ({ ch }) => <span style={{ fontSize: 10, color: D.sub, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>{ch}</span>;
  const Modal = ({ onClose, children }) => (
    <div style={{ position: 'fixed', inset: 0, background: '#00000090', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600 }} onClick={onClose}>
      <div style={{ background: D.card, border: `1px solid ${D.bdr}`, borderRadius: 16, padding: 28, width: 420, maxWidth: '92vw' }} onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );

  const CSS = `
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.1}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    @keyframes waveBar0{from{transform:scaleY(0.3)}to{transform:scaleY(1)}}
    @keyframes waveBar1{from{transform:scaleY(0.5)}to{transform:scaleY(0.2)}}
    @keyframes waveBar2{from{transform:scaleY(0.8)}to{transform:scaleY(0.4)}}
    @keyframes waveBar3{from{transform:scaleY(0.2)}to{transform:scaleY(0.9)}}
    *{box-sizing:border-box} ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-track{background:${D.bg}} ::-webkit-scrollbar-thumb{background:${D.bdr};border-radius:3px}
    input,textarea,select{font-family:inherit} button:active{opacity:.8}
  `;

  // ══════════ HOME ══════════
  if (view === 'home') return (
    <div style={{ minHeight: '100vh', background: D.bg, color: D.tx, fontFamily: "'Segoe UI',system-ui,sans-serif", fontSize: 14 }}>
      <style>{CSS}</style>
      <div style={{ background: D.panel, borderBottom: `1px solid ${D.bdr}`, padding: '11px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 200, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 17, color: D.ac }}>{T('title')}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* 언어 선택 */}
          <div style={{ display: 'flex', background: D.card2, borderRadius: 8, padding: 3, gap: 2, border: `1px solid ${D.bdr}` }}>
            {Object.keys(LANGS).map(l => (
              <button key={l} onClick={() => setLang(l)}
                style={{
                  padding: '5px 10px', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  background: lang === l ? D.ac : 'transparent', color: lang === l ? '#fff' : D.sub, transition: 'all .15s'
                }}>
                {l === 'ko' ? '🇰🇷 KO' : l === 'en' ? '🇺🇸 EN' : l === 'ja' ? '🇯🇵 JA' : '🇨🇳 ZH'}
              </button>
            ))}
          </div>
          {/* 카카오 */}
          {!kakaoUser ? (
            <button onClick={kakaoLogin} style={{ display: 'flex', alignItems: 'center', gap: 7, background: isEmbedded ? D.card2 : '#FEE500', color: isEmbedded ? D.sub : '#3C1E1E', border: `1px solid ${isEmbedded ? D.bdr : '#FEE500'}`, borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
              <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png" style={{ width: 16, height: 16, opacity: isEmbedded ? .4 : 1 }} alt="K" />
              {isEmbedded ? T('kakaoAfter') : T('kakaoLink')}
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#FEE500', borderRadius: 8, padding: '6px 12px' }}>
              {kakaoUser.img && <img src={kakaoUser.img} style={{ width: 20, height: 20, borderRadius: '50%' }} alt="p" />}
              <span style={{ fontSize: 12, fontWeight: 700, color: '#3C1E1E' }}>{kakaoUser.nickname}</span>
              <button onClick={kakaoLogout} style={{ background: 'transparent', border: 'none', color: '#3C1E1E', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>{T('logout')}</button>
            </div>
          )}
          <Ghost ch={T('load')} onClick={() => saveJsonRef.current?.click()} />
          <Ghost ch={T('save')} onClick={saveColsJson} />
          <Btn ch={T('newCol')} onClick={() => setShowNC(true)} />
        </div>
        <input ref={saveJsonRef} type="file" accept=".json" style={{ display: 'none' }} onChange={loadColsJson} />
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
          {cols.map((col, ci) => (
            <div key={col.id} onClick={() => { setColId(col.id); setView('collection'); }}
              style={{ background: D.card, border: `1px solid ${D.bdr}`, borderTop: `3px solid ${col.color}`, borderRadius: 13, padding: 18, cursor: 'pointer', animation: `fadeUp .3s ${ci * .05}s both` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 28 }}>{col.icon}</div>
                <button onClick={e => { e.stopPropagation(); setCols(p => p.filter(c => c.id !== col.id)); }} style={{ background: 'transparent', border: 'none', color: D.sub2, cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '2px 6px' }}>×</button>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{col.name}</div>
              <div style={{ fontSize: 11, color: D.sub, marginBottom: 12 }}>{COL_TYPES.find(t => t.id === col.type)?.label} · {col.events.length}개 녹음</div>
              <Btn ch={T('newEvent')} bg={col.color} pad="6px 12px" fs={12} onClick={e => { e.stopPropagation(); setColId(col.id); setShowNE(true); setNeName(''); }} />
            </div>
          ))}
          <div onClick={() => setShowNC(true)} style={{ background: 'transparent', border: `2px dashed ${D.bdr}`, borderRadius: 13, padding: 18, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 155, color: D.sub, gap: 8 }}>
            <div style={{ fontSize: 30 }}>+</div><div style={{ fontWeight: 600, fontSize: 13 }}>{T('newCol').replace('+ ', '')}</div>
          </div>
        </div>
      </div>

      {showNC && <Modal onClose={() => setShowNC(false)}>
        <h3 style={{ margin: '0 0 18px', fontSize: 16 }}>새 컬렉션</h3>
        <Lbl ch={T('colName')} /><br />
        <input value={ncName} onChange={e => setNcName(e.target.value)} onKeyDown={e => e.key === 'Enter' && mkCol()} placeholder="예: 알고리즘"
          style={{ width: '100%', background: D.card2, border: `1px solid ${D.bdr}`, borderRadius: 8, padding: '9px 13px', color: D.tx, fontSize: 13, marginTop: 5, marginBottom: 14 }} />
        <Lbl ch={T('colType')} />
        <div style={{ display: 'flex', gap: 7, margin: '6px 0 14px' }}>
          {COL_TYPES.map(t => <button key={t.id} onClick={() => setNcType(t.id)} style={{ flex: 1, padding: '8px', border: `1px solid ${ncType === t.id ? D.ac : D.bdr}`, borderRadius: 8, background: ncType === t.id ? D.acl : D.card2, color: ncType === t.id ? D.ac : D.sub, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>{t.icon} {t.label}</button>)}
        </div>
        <Lbl ch={T('colColor')} />
        <div style={{ display: 'flex', gap: 8, margin: '6px 0 20px', flexWrap: 'wrap' }}>
          {PALETTE.map(c => <div key={c} onClick={() => setNcColor(c)} style={{ width: 24, height: 24, borderRadius: '50%', background: c, cursor: 'pointer', border: ncColor === c ? `3px solid ${D.tx}` : '3px solid transparent' }} />)}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Ghost onClick={() => setShowNC(false)} ch={T('cancel')} st={{ flex: 1 }} />
          <Btn onClick={mkCol} ch={T('colSave')} st={{ flex: 2 }} />
        </div>
      </Modal>}

      {showNE && <Modal onClose={() => setShowNE(false)}>
        <h3 style={{ margin: '0 0 18px', fontSize: 16 }}>🎙 {T('newEvent').replace('+ ', '')}</h3>
        <Lbl ch={T('eventName')} /><br />
        <input value={neName} onChange={e => setNeName(e.target.value)} onKeyDown={e => e.key === 'Enter' && mkEvt()} placeholder={T('eventPlaceholder')}
          style={{ width: '100%', background: D.card2, border: `1px solid ${D.bdr}`, borderRadius: 8, padding: '9px 13px', color: D.tx, fontSize: 13, marginTop: 5, marginBottom: 20 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Ghost onClick={() => setShowNE(false)} ch={T('cancel')} st={{ flex: 1 }} />
          <Btn onClick={mkEvt} ch={T('startWith')} st={{ flex: 2 }} />
        </div>
      </Modal>}

      {shareToast && <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: D.card, border: `1px solid ${D.ac}`, borderRadius: 10, padding: '12px 22px', fontSize: 13, fontWeight: 600, color: D.tx, zIndex: 500, boxShadow: '0 4px 24px #00000060', animation: 'fadeUp .2s' }}>{shareToast}</div>}
    </div>
  );

  // ══════════ COLLECTION ══════════
  if (view === 'collection') {
    const col = getCol(); if (!col) { setView('home'); return null; }
    return (
      <div style={{ minHeight: '100vh', background: D.bg, color: D.tx, fontFamily: "'Segoe UI',system-ui,sans-serif", fontSize: 14 }}>
        <style>{CSS}</style>
        <div style={{ background: D.panel, borderBottom: `1px solid ${D.bdr}`, padding: '11px 18px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 200 }}>
          <button onClick={() => setView('home')} style={{ background: 'transparent', border: 'none', color: D.sub, cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '3px 6px' }}>←</button>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color, flexShrink: 0 }} />
          <div style={{ fontWeight: 700, fontSize: 15 }}>{col.icon} {col.name}</div>
          <div style={{ flex: 1 }} />
          <Btn ch={T('newEvent')} bg={col.color} pad="8px 18px" onClick={() => { setShowNE(true); setNeName(''); }} />
        </div>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '22px 18px' }}>
          {col.events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '70px 20px', color: D.sub }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>🎙</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{T('noEvents')}</div>
              <div style={{ fontSize: 12, marginBottom: 18 }}>{T('noEventsDesc')}</div>
              <Btn ch={T('newEvent')} bg={col.color} onClick={() => { setShowNE(true); setNeName(''); }} />
            </div>
          ) : col.events.map((evt, i) => (
            <div key={evt.id} onClick={() => openEvt(col.id, evt.id)}
              style={{ background: D.card, border: `1px solid ${D.bdr}`, borderRadius: 12, padding: 16, marginBottom: 9, cursor: 'pointer', animation: `fadeUp .2s ${i * .03}s both`, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 9, background: col.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🎙</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.title}</div>
                <div style={{ fontSize: 11, color: D.sub, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <span>{evt.date}</span><span>{fmt(evt.duration)}</span>
                  <span>📝 {evt.notes.length}</span>
                  {evt.notes.filter(n => n.important).length > 0 && <span style={{ color: D.yellow }}>⭐ {evt.notes.filter(n => n.important).length}</span>}
                  {evt.notes_md && <span style={{ color: D.purple }}>🤖 완성</span>}
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); delEvt(evt.id); }} style={{ background: 'transparent', border: 'none', color: D.sub2, cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '4px' }}>×</button>
            </div>
          ))}
        </div>
        {showNE && <Modal onClose={() => setShowNE(false)}>
          <h3 style={{ margin: '0 0 18px', fontSize: 16 }}>🎙 {T('newEvent').replace('+ ', '')}</h3>
          <Lbl ch={T('eventName')} /><br />
          <input value={neName} onChange={e => setNeName(e.target.value)} onKeyDown={e => e.key === 'Enter' && mkEvt()} placeholder={T('eventPlaceholder')}
            style={{ width: '100%', background: D.card2, border: `1px solid ${D.bdr}`, borderRadius: 8, padding: '9px 13px', color: D.tx, fontSize: 13, marginTop: 5, marginBottom: 20 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <Ghost onClick={() => setShowNE(false)} ch={T('cancel')} st={{ flex: 1 }} />
            <Btn onClick={mkEvt} ch={T('startWith')} bg={col.color} st={{ flex: 2 }} />
          </div>
        </Modal>}
      </div>
    );
  }

  // ══════════ EVENT ══════════
  if (view === 'event') {
    const evt = getEvt(), col = getCol(); if (!evt || !col) { setView('home'); return null; }
    const acFile = evtFiles.find(f => f.id === activeFile);
    const TABS = [{ id: 'input', label: T('tabInput') }, { id: 'notes_md', label: T('tabNotes') }, { id: 'manual', label: T('tabManual') }, { id: 'transcript', label: T('tabTranscript') }, { id: 'quiz', label: T('tabQuiz') }];

    return (
      <div style={{ height: '100vh', background: D.bg, color: D.tx, fontFamily: "'Segoe UI',system-ui,sans-serif", fontSize: 14, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <style>{CSS}</style>

        {/* Header */}
        <div style={{ background: D.panel, borderBottom: `1px solid ${D.bdr}`, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
          <button onClick={() => { if (recOn) stopRec(); setView('collection'); }} style={{ background: 'transparent', border: 'none', color: D.sub, cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '3px 5px' }}>←</button>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.color, flexShrink: 0 }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.title}</div>
            <div style={{ fontSize: 10, color: D.sub }}>{col.name} · {evt.date}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {evt.audioBlob && <Ghost ch={T('audioSave')} pad="5px 10px" fs={11} onClick={dlAudio} />}
            <Ghost ch={T('notesSave')} pad="5px 10px" fs={11} onClick={exportNotes} />
          </div>
        </div>

        {/* Rec Bar */}
        <div style={{ background: D.card, borderBottom: `1px solid ${D.bdr}`, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
          {!recOn ? (<>
            <div style={{ display: 'flex', background: D.card2, borderRadius: 8, padding: 3, gap: 2 }}>
              {[['mic', T('recMic')], ['screen_mic', T('recScreen')]].map(([m, l]) => (
                <button key={m} onClick={() => setRecMode(m)} style={{ padding: '6px 12px', border: 'none', borderRadius: 6, cursor: 'pointer', background: recMode === m ? D.red : 'transparent', color: recMode === m ? '#fff' : D.sub, fontWeight: 600, fontSize: 12 }}>{l}</button>
              ))}
            </div>
            <Btn ch={T('recStart')} bg={D.red} pad="8px 18px" onClick={startRec} />
          </>) : (<>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: D.red, animation: 'blink 1s infinite' }} />
                <span style={{ fontSize: 11, color: D.red, fontWeight: 800 }}>● REC</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '.06em' }}>{fmt(recSec)}</div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ height: 4, background: D.bdr2, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: `linear-gradient(90deg,${D.red},${D.ac})`, borderRadius: 4, width: `${Math.min((recSec / 10800) * 100, 100)}%`, transition: 'width 1s linear' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: D.sub, marginTop: 2 }}>
                  <span>{fmt(recSec)} 경과</span>
                  <span>~{recMode === 'screen_mic' ? ((recSec / 60) * 10).toFixed(0) : ((recSec / 60) * 1).toFixed(1)} MB</span>
                </div>
              </div>
              {evt.notes.filter(n => n.type === 'note').length > 0 && <span style={{ fontSize: 11, color: D.green }}>📌 {evt.notes.filter(n => n.type === 'note').length}</span>}
            </div>
            <Btn ch={T('recStop')} bg={D.bdr} tc={D.tx} pad="7px 16px" onClick={stopRec} />
          </>)}
        </div>

        {/* Caption */}
        {recOn && (
          <div style={{ background: '#110a04', borderBottom: `1px solid ${D.ac}22`, padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, minHeight: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
              {[0.5, 1, 0.7, 1, 0.4, 0.8, 0.6, 1, 0.3, 0.9, 0.5, 0.7].map((h, i) => (
                <div key={i} style={{ width: 3, borderRadius: 2, background: D.ac, opacity: .7, height: `${6 + h * 14}px`, animation: `waveBar${i % 4} ${0.5 + h * 0.4}s ease-in-out infinite alternate` }} />
              ))}
            </div>
            <div style={{ fontSize: 12, color: caption ? D.ac : D.sub2, flex: 1 }}>{caption || '음성 대기 중...'}</div>
          </div>
        )}

        {/* Error */}
        {aiError && (
          <div style={{ background: '#1a0505', border: `1px solid ${D.red}44`, color: D.red, padding: '9px 16px', fontSize: 12, flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            ⚠ {aiError}<button onClick={() => setAiError('')} style={{ background: 'transparent', border: 'none', color: D.red, cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 3, padding: '8px 12px', borderBottom: `1px solid ${D.bdr}`, background: D.card, flexShrink: 0, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setEvtTab(t.id)}
              style={{ padding: '7px 13px', border: 'none', borderRadius: 7, cursor: 'pointer', fontWeight: 600, fontSize: 12, background: evtTab === t.id ? D.ac : 'transparent', color: evtTab === t.id ? '#fff' : D.sub, transition: 'all .15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflow: 'auto', padding: '16px 18px' }}>

            {/* INPUT */}
            {evtTab === 'input' && (
              <div>
                <Lbl ch="✍ 텍스트 입력" />
                {/* IsolatedTextarea — 부모 리렌더링과 완전히 격리 */}
                <IsolatedTextarea
                  initialValue={fileRawInput}
                  placeholder={T('inputPlaceholder')}
                  onBlur={val => { rawInputRef.current = val; updEvt({ rawInput: val }); }}
                />
                {rawInputRef.current && <div style={{ fontSize: 11, color: D.sub, marginTop: 4, textAlign: 'right' }}>{rawInputRef.current.length.toLocaleString()}자</div>}

                <div onDragOver={e => { e.preventDefault(); setDragOn(true); }} onDragLeave={() => setDragOn(false)}
                  onDrop={e => { e.preventDefault(); setDragOn(false); processFiles(e.dataTransfer.files); }}
                  onClick={() => fileRef.current?.click()}
                  style={{ border: `2px dashed ${dragOn ? D.ac : D.bdr}`, borderRadius: 12, padding: '22px 20px', textAlign: 'center', cursor: 'pointer', background: dragOn ? D.acl : D.panel, margin: '12px 0', transition: 'all .2s' }}>
                  <div style={{ fontSize: 26, marginBottom: 5 }}>📂</div>
                  <div style={{ fontSize: 12, color: D.sub }}>{T('uploadDesc')}</div>
                  <div style={{ fontSize: 11, color: D.sub2, marginTop: 2 }}>{T('uploadSub')}</div>
                </div>
                <input ref={fileRef} type="file" multiple accept="image/*,audio/*,.txt,.pdf,.md,.csv,.json" style={{ display: 'none' }} onChange={e => { processFiles(e.target.files); e.target.value = ''; }} />

                {evtFiles.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <Lbl ch={`업로드 (${evtFiles.length})`} />
                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {evtFiles.map(f => (
                        <div key={f.id} style={{ background: D.card2, border: `1px solid ${D.bdr}`, borderRadius: 8, padding: '8px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
                          {f.type === 'image' ? <img src={f.url} alt="" style={{ width: 40, height: 30, objectFit: 'cover', borderRadius: 5, flexShrink: 0 }} /> : <div style={{ width: 40, height: 30, background: D.bdr, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>📄</div>}
                          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div><div style={{ fontSize: 10, color: D.sub }}>{f.type} · {fmtSz(f.size)}</div></div>
                          <button onClick={() => setEvtFiles(p => p.filter(x => x.id !== f.id))} style={{ background: 'transparent', border: 'none', color: D.sub2, cursor: 'pointer', fontSize: 16 }}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Btn ch={aiLoad ? T('generating') : T('genNotes')} full dis={aiLoad} onClick={genNotes} st={{ padding: '13px', fontSize: 15 }} />
                {aiLoad && <div style={{ textAlign: 'center', padding: '18px', color: D.sub, fontSize: 13 }}>
                  <div style={{ width: 28, height: 28, border: `3px solid ${D.bdr}`, borderTop: `3px solid ${D.ac}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 10px' }} />
                  {T('genDesc')}
                </div>}
              </div>
            )}

            {/* NOTES_MD */}
            {evtTab === 'notes_md' && (
              evt.notes_md ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                    <Lbl ch="AI 생성 학습 노트" />
                    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                      <Ghost ch={T('regen')} onClick={genNotes} />
                      <Ghost ch={T('quiz')} onClick={genQuiz} />
                      <Ghost ch={T('share')} onClick={shareNotes} />
                      <button onClick={sendKakao} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#FEE500', color: '#3C1E1E', border: 'none', borderRadius: 7, padding: '7px 12px', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
                        <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png" style={{ width: 14, height: 14 }} alt="K" />
                        {T('kakaoSend')}
                      </button>
                      <Ghost ch={T('saveTxt')} onClick={exportNotes} />
                    </div>
                  </div>
                  <div style={{ background: D.card2, border: `1px solid ${D.bdr}`, borderRadius: 12, padding: 20 }}><MdView md={evt.notes_md} /></div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: D.sub }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📘</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{T('noNotes')}</div>
                  <div style={{ fontSize: 12, marginBottom: 20 }}>{T('noNotesDesc')}</div>
                  <Btn ch={T('tabInput')} bg={D.card2} tc={D.tx} onClick={() => setEvtTab('input')} st={{ border: `1px solid ${D.bdr}` }} />
                </div>
              )
            )}

            {/* MANUAL */}
            {evtTab === 'manual' && (<>
              {showCh && (
                <div style={{ background: D.card2, border: `1px solid ${D.blue}`, borderRadius: 10, padding: 11, marginBottom: 11, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: D.blue, fontWeight: 700, fontSize: 13 }}>##</span>
                  <input value={chIn} onChange={e => setChIn(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addCh(chIn, setChIn, setShowCh); if (e.key === 'Escape') setShowCh(false); }} autoFocus placeholder="챕터 제목..."
                    style={{ flex: 1, background: 'transparent', border: 'none', color: D.tx, fontSize: 13, fontWeight: 600 }} />
                  <Btn ch="추가" bg={D.blue} pad="5px 11px" fs={12} onClick={() => addCh(chIn, setChIn, setShowCh)} />
                  <Ghost ch="✕" onClick={() => setShowCh(false)} pad="5px 8px" fs={12} />
                </div>
              )}
              {evt.notes.length === 0 && <div style={{ textAlign: 'center', padding: '35px', color: D.sub }}><div style={{ fontSize: 30, marginBottom: 8 }}>📝</div><div style={{ fontSize: 13 }}>아래 입력창에서 실시간 필기를 시작하세요</div></div>}
              {evt.notes.map(note => (
                <div key={note.id}>
                  {note.type === 'chapter' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0 7px', padding: '8px 11px', background: D.bluel, border: `1px solid ${D.blue}33`, borderRadius: 8 }}>
                      <span style={{ color: D.blue, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>##</span>
                      {editId === note.id ? <input value={editTx} onChange={e => setEditTx(e.target.value)} onKeyDown={e => e.key === 'Enter' && (updEvt({ notes: getEvt().notes.map(n => n.id === note.id ? { ...n, text: editTx } : n) }), setEditId(null))} autoFocus style={{ flex: 1, background: 'transparent', border: 'none', color: D.tx, fontSize: 13, fontWeight: 700 }} />
                        : <span style={{ flex: 1, fontWeight: 700, color: D.blue, fontSize: 13 }}>{note.text}</span>}
                      <span style={{ fontSize: 10, color: D.sub, flexShrink: 0 }}>{note.ts}</span>
                      <button onClick={() => { setEditId(note.id); setEditTx(note.text); }} style={{ background: 'transparent', border: 'none', color: D.sub, cursor: 'pointer', fontSize: 11, padding: '2px 5px' }}>✏</button>
                      <button onClick={() => delNote(note.id)} style={{ background: 'transparent', border: 'none', color: D.sub2, cursor: 'pointer', fontSize: 14, padding: '2px 4px' }}>×</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, padding: '6px 2px', borderBottom: `1px solid ${D.bdr2}` }}>
                      <span style={{ fontSize: 10, color: D.sub, fontFamily: 'monospace', whiteSpace: 'nowrap', marginTop: 3, minWidth: 60, flexShrink: 0 }}>{note.ts}</span>
                      <button onClick={() => toggleImp(note.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, lineHeight: 1, color: note.important ? D.yellow : D.sub2, flexShrink: 0, padding: '2px 3px' }}>⭐</button>
                      {editId === note.id ? <textarea value={editTx} onChange={e => setEditTx(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); updEvt({ notes: getEvt().notes.map(n => n.id === note.id ? { ...n, text: editTx } : n) }); setEditId(null); } }} autoFocus style={{ flex: 1, background: D.card2, border: `1px solid ${D.bdr}`, borderRadius: 6, padding: '5px 8px', color: D.tx, fontSize: 12, resize: 'vertical', minHeight: 40, fontFamily: 'inherit' }} />
                        : <div style={{ flex: 1, fontSize: 13, lineHeight: 1.65 }}>{note.text}</div>}
                      <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                        <button onClick={() => { setEditId(note.id); setEditTx(note.text); }} style={{ background: 'transparent', border: 'none', color: D.sub2, cursor: 'pointer', fontSize: 11, padding: '2px 4px' }}>✏</button>
                        <button onClick={() => delNote(note.id)} style={{ background: 'transparent', border: 'none', color: D.sub2, cursor: 'pointer', fontSize: 14, padding: '2px 4px' }}>×</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={notesEnd} />
            </>)}

            {/* TRANSCRIPT */}
            {evtTab === 'transcript' && (
              <div>
                {evt.audioBlob && <div style={{ marginBottom: 14 }}><audio src={evt.audioBlob} controls style={{ width: '100%', height: 32 }} /></div>}
                <Lbl ch="실시간 변환 텍스트" />
                <div style={{ background: D.card2, border: `1px solid ${D.bdr}`, borderRadius: 10, padding: 16, minHeight: 200, fontSize: 13, lineHeight: 1.85, color: evt.transcript ? D.tx : D.sub, marginTop: 8, whiteSpace: 'pre-wrap' }}>
                  {evt.transcript || '녹음 중 실시간으로 텍스트가 변환됩니다...'}
                </div>
              </div>
            )}

            {/* QUIZ */}
            {evtTab === 'quiz' && (
              aiLoad ? <div style={{ textAlign: 'center', padding: '50px', color: D.sub }}><div style={{ width: 30, height: 30, border: `3px solid ${D.bdr}`, borderTop: `3px solid ${D.teal}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />퀴즈 생성 중...</div>
                : !quiz ? <div style={{ textAlign: 'center', padding: '50px 20px', color: D.sub }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🧠</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{T('tabQuiz')}</div>
                  <div style={{ fontSize: 12, marginBottom: 18 }}>{T('quizDesc')}</div>
                  <Btn ch={T('quizStart')} bg={D.teal} onClick={genQuiz} />
                </div>
                  : qDone ? (
                    <div style={{ textAlign: 'center', padding: '24px' }}>
                      <div style={{ fontSize: 44, marginBottom: 10 }}>🎉</div>
                      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{T('quizDone')}</div>
                      <div style={{ color: D.sub, marginBottom: 16 }}>{quiz.filter(q => q.userAnswer === q.answer).length} / {quiz.length} {T('correct')}</div>
                      {quiz.map((q, i) => (
                        <div key={i} style={{ textAlign: 'left', background: D.card2, borderRadius: 10, padding: 13, marginBottom: 7, borderLeft: `3px solid ${q.userAnswer === q.answer ? D.green : D.red}` }}>
                          <div style={{ fontWeight: 600, marginBottom: 5, fontSize: 13 }}>{i + 1}. {q.q}</div>
                          <div style={{ fontSize: 12, color: D.sub }}>{T('myAnswer')}: {q.options[q.userAnswer]}</div>
                          {q.userAnswer !== q.answer && <div style={{ fontSize: 12, color: D.green }}>{T('correct')}: {q.options[q.answer]}</div>}
                        </div>
                      ))}
                      <div style={{ display: 'flex', gap: 9, justifyContent: 'center', marginTop: 16 }}>
                        <Ghost ch={T('retry')} onClick={() => { setQuiz(quiz.map(q => ({ ...q, userAnswer: null }))); setQIdx(0); setQDone(false); }} />
                        <Btn ch={T('newQuiz')} bg={D.teal} onClick={genQuiz} />
                      </div>
                    </div>
                  ) : (() => {
                    const q = quiz[qIdx];
                    return (
                      <div style={{ maxWidth: 540, margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                          <Lbl ch={`${qIdx + 1} / ${quiz.length}`} />
                          <div style={{ display: 'flex', gap: 4 }}>
                            {quiz.map((_, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i === qIdx ? D.teal : i < qIdx ? (quiz[i].userAnswer === quiz[i].answer ? D.green : D.red) : D.bdr }} />)}
                          </div>
                        </div>
                        <div style={{ background: D.card2, border: `1px solid ${D.bdr}`, borderRadius: 11, padding: 18, marginBottom: 14, fontSize: 14, fontWeight: 600, lineHeight: 1.5 }}>{q.q}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                          {q.options.map((opt, oi) => (
                            <button key={oi} onClick={() => { const nq = quiz.map((x, i) => i === qIdx ? { ...x, userAnswer: oi } : x); setQuiz(nq); setTimeout(() => { if (qIdx < quiz.length - 1) setQIdx(i => i + 1); else setQDone(true); }, 350); }}
                              style={{ padding: '11px 15px', border: `1px solid ${q.userAnswer === oi ? (oi === q.answer ? D.green : D.red) : D.bdr}`, borderRadius: 9, background: q.userAnswer === oi ? (oi === q.answer ? D.green + '22' : D.red + '22') : D.card2, color: q.userAnswer === oi ? (oi === q.answer ? D.green : D.red) : D.tx, cursor: 'pointer', textAlign: 'left', fontSize: 13, fontWeight: q.userAnswer === oi ? 700 : 400, transition: 'all .15s' }}>
                              <span style={{ color: D.sub, marginRight: 8 }}>{['A', 'B', 'C', 'D'][oi]}.</span>{opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()
            )}
          </div>

          {/* Slides */}
          {showSlides && evtFiles.filter(f => f.type === 'image').length > 0 && (
            <div style={{ width: 230, flexShrink: 0, borderLeft: `1px solid ${D.bdr}`, background: D.panel, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '9px 11px', borderBottom: `1px solid ${D.bdr}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <Lbl ch="슬라이드" />
                <button onClick={() => setShowSlides(false)} style={{ background: 'transparent', border: 'none', color: D.sub, cursor: 'pointer', fontSize: 16 }}>×</button>
              </div>
              {acFile?.type === 'image' && <div style={{ padding: 8, borderBottom: `1px solid ${D.bdr2}`, flexShrink: 0 }}><img src={acFile.url} alt="" style={{ width: '100%', borderRadius: 7, border: `1px solid ${D.bdr}` }} /></div>}
              <div style={{ flex: 1, overflow: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {evtFiles.filter(f => f.type === 'image').map(f => (
                  <div key={f.id} onClick={() => setActiveFile(f.id)} style={{ background: activeFile === f.id ? D.acl : D.card2, border: `1px solid ${activeFile === f.id ? D.ac : D.bdr2}`, borderRadius: 8, overflow: 'hidden', cursor: 'pointer' }}>
                    <img src={f.url} alt="" style={{ width: '100%', height: 70, objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '4px 7px', fontSize: 10, color: D.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Note Input Bottom Bar */}
        {evtTab === 'manual' && (
          <div style={{ background: D.card2, borderTop: `1px solid ${D.bdr}`, padding: '10px 14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <textarea ref={noteRef} value={noteVal} onChange={e => setNoteVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addNote(); } }}
                  placeholder={T('notePlaceholder')}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: D.tx, fontSize: 13, resize: 'none', lineHeight: 1.6, minHeight: 36, maxHeight: 90, fontFamily: 'inherit', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0, paddingBottom: 2 }}>
                <button onClick={() => setShowCh(true)} style={{ background: D.bluel, border: `1px solid ${D.blue}44`, color: D.blue, borderRadius: 7, padding: '6px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>{T('chapter')}</button>
                <Btn ch={T('noteAdd')} pad="7px 14px" fs={12} onClick={addNote} />
              </div>
            </div>
            {recOn && <div style={{ fontSize: 10, color: D.sub, marginTop: 3 }}>⏱ {fmt(recSec)}</div>}
          </div>
        )}

        {shareToast && <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: D.card, border: `1px solid ${D.ac}`, borderRadius: 10, padding: '12px 22px', fontSize: 13, fontWeight: 600, color: D.tx, zIndex: 500, boxShadow: '0 4px 24px #00000060', animation: 'fadeUp .2s' }}>{shareToast}</div>}
      </div>
    );
  }
  return null;
}
