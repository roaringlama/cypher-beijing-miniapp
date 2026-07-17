const activities = [
  { day: '18', month: 'JUL', district: '东城', time: '19:30', title: 'FUNK AFTER DARK', filters: ['POPPING', 'LOCKING'], tags: ['FUNK', 'BOOGALOO', 'ALL LEVEL'], count: '17 / 24', spots: '7 SPOTS', tone: 'acid' },
  { day: '19', month: 'JUL', district: '朝阳', time: '15:00', title: 'SUNDAY SOUL KITCHEN', filters: ['LOCKING', 'BEGINNER'], tags: ['SOUL', 'WARM-UP', 'BEGINNER'], count: '9 / 16', spots: '7 SPOTS', tone: 'orange' },
  { day: '22', month: 'JUL', district: '海淀', time: '20:00', title: 'WAX WORKS SESSION', filters: ['POPPING'], tags: ['ANIMATION', 'WAVING'], count: '11 / 12', spots: '1 SPOT', tone: 'ice' },
]

const bottomNav = (active) => `<div class="bottom-nav"><button data-go="home" class="${active === 'home' ? 'active' : ''}"><i>◉</i>FIND</button><button data-go="create" class="drop">＋</button><button data-go="profile" class="${active === 'profile' ? 'active' : ''}"><i>◎</i>ME</button></div>`

function homePage() {
  return `<section class="page home-page">
    <header class="top"><div><small>BEIJING · WED 15 JUL</small><b>CYPHER<span>///</span></b></div><button data-go="profile" class="avatar">MW<i></i></button></header>
    <div class="hero-home"><div class="record"><i>BJ</i></div><small>NOT EVERY DANCE<br>NEEDS A WINNER.</small><h1>FIND YOUR<br><em>CIRCLE.</em></h1><p>今晚不比输赢。找一首歌，进一个圈。</p></div>
    <div class="chips"><button data-filter="ALL" class="on">ALL</button><button data-filter="POPPING">POPPING</button><button data-filter="LOCKING">LOCKING</button><button data-filter="BEGINNER">BEGINNER</button></div>
    <div class="section-label"><b><i>03</i> UPCOMING DROPS</b><span>● LIVE LIST</span></div>
    <div class="activities">${activities.map((a, index) => `<button data-go="detail" data-filters="${a.filters.join(' ')}" class="event-card ${a.tone}"><div class="date"><b>${a.day}</b><span>${a.month}</span></div><div class="event-main"><small>${a.district} · ${a.time}</small><h2>${a.title}</h2><div class="tags">${a.tags.map(t => `<i>${t}</i>`).join('')}</div><footer><span>${a.count} IN</span><b>${a.spots} →</b></footer></div>${index === 0 ? '<div class="wave">∿∿∿</div>' : ''}</button>`).join('')}</div>
    <button data-go="support" class="support-mini"><span><small>KEEP THE CIRCLE MOVING</small><b>Support the Scene</b></span><i>↗</i></button>
    ${bottomNav('home')}
  </section>`
}

function detailPage() {
  return `<section class="page detail-page">
    <div class="detail-poster"><div class="detail-actions"><button data-go="home">←</button><button>↗</button></div><div class="stamp">CYPHER<br>NO. 017</div><div class="poster-copy"><small>SATURDAY NIGHT · DONGCHENG</small><h1>FUNK<br>AFTER <em>DARK</em></h1><p>70s FUNK · G-FUNK · TALKBOX</p></div><b class="scribble">JUST STEP IN ↘</b></div>
    <div class="detail-content"><div class="ticket"><div><small>WHEN</small><b>JUL 18</b><span>19:30–22:30</span></div><div><small>WHERE</small><b>东城区</b><span>鼓楼附近 · B1</span></div><div><small>CIRCLE</small><b>17 / 24</b><span>7 spots left</span></div></div>
    <div class="detail-tags"><i>FUNK</i><i>BOOGALOO</i><i>ALL LEVEL</i></div><article><small>THE VIBE</small><h3>一晚只放让身体想动的 Funk。没有赛制，没有裁判，轮到你就进圈。</h3></article>
    <div class="host"><div class="avatar red">LO</div><span><small>HOSTED BY</small><b>LOLO</b><i>Locking · Groove Keeper</i></span><em>100%<small>SHOW-UP</small></em></div>
    <div class="info-grid"><div><i>⌁</i><span><b>地址保护</b><small>报名通过后可见详细地址</small></span></div><div><i>♫</i><span><b>音乐方向</b><small>70s Funk · G-Funk</small></span></div><div><i>◎</i><span><b>新手友好</b><small>先在外圈感受也 OK</small></span></div><div><i>¥</i><span><b>场地费用</b><small>预计 ¥35/人</small></span></div></div></div>
    <div class="action-dock"><span><small>SAT · JUL 18</small><b>¥35<em> est.</em></b></span><button id="joinButton">STEP INTO THE CIRCLE →</button></div>
    <div id="joinSheet" class="preview-sheet-backdrop" hidden><div class="preview-join-sheet"><i></i><small>ONE LAST CHECK</small><h2>READY TO STEP IN?</h2><div><b>FUNK AFTER DARK</b><span>JUL 18 · 19:30–22:30</span><span>东城区 · 报名通过后可见详细地址</span></div><p>✓ 如果计划有变，我会尽早退出，把位置留给别人。</p><button id="confirmJoin">YES, I’M IN</button><button id="cancelJoin">NOT THIS TIME</button></div></div>
  </section>`
}

const stepContent = [
  `<small>STEP 01 / 05</small><h1>WHAT’S<br>THE <em>VIBE?</em></h1><p>先给这场的气质定个调。</p><label>CYPHER NAME</label><div class="fake-input"><b>FUNK ON THE ROOF</b><small>17 / 30</small></div><label>MAIN STYLE</label><div class="style-grid"><button class="selected"><i>∿</i>POPPING</button><button><i>↯</i>LOCKING</button><button><i>◎</i>HIP-HOP</button><button><i>✦</i>WAACKING</button></div><label>FLAVOUR TAGS <small>UP TO 3</small></label><div class="pick-tags"><button class="selected">✓ Funk</button><button class="selected">✓ Boogaloo</button><button>＋ All Level</button></div>`,
  `<small>STEP 02 / 05</small><h1>WHEN DO<br>WE <em>MOVE?</em></h1><p>时间明确，大家才好留出 groove。</p><div class="big-field"><small>DATE</small><b>SAT · JUL 25</b><span>换一天 →</span></div><div class="big-field"><small>TIME</small><b>19:30 — 22:00</b><span>3 HOURS</span></div><div class="calendar"><i>MON<b>20</b></i><i>TUE<b>21</b></i><i>WED<b>22</b></i><i>THU<b>23</b></i><i>FRI<b>24</b></i><i class="selected">SAT<b>25</b></i><i>SUN<b>26</b></i></div>`,
  `<small>STEP 03 / 05</small><h1>WHERE’S<br>THE <em>SPOT?</em></h1><p>先公开区域，详细门牌可在通过后显示。</p><div class="map"><i>●</i><small>BEIJING / CHAOYANG</small></div><div class="big-field"><small>DISTRICT</small><b>朝阳区</b><span>CHANGE →</span></div><div class="big-field"><small>VENUE</small><b>十里堡 · Rooftop Room</b><span>详细地址已保护</span></div><div class="privacy">⌁ <span><b>报名后解锁门牌</b><small>只有发起者和通过报名的人能看到。</small></span></div>`,
  `<small>STEP 04 / 05</small><h1>WHO’S<br><em>COMING?</em></h1><p>设一个让圈子舒服运转的人数。</p><div class="capacity"><small>MAX CIRCLE SIZE</small><b>18</b><i><em></em></i><span>建议 12–24 人，留出每个人进圈的空间。</span></div><div class="toggle-line"><span><b>新手友好</b><small>允许先在外圈观察</small></span><i class="on"></i></div><div class="toggle-line"><span><b>发起者审核</b><small>关闭时直接加入</small></span><i></i></div><div class="promise"><small>THE CIRCLE PROMISE</small><b>尊重音乐 · 尊重空间 · 计划有变尽早退出</b></div>`,
  `<small>STEP 05 / 05</small><h1>FINAL<br><em>CHECK.</em></h1><p>确认没问题，就把这张 flyer 发出去。</p><div class="flyer"><i>CYPHER<br>DROP</i><small>SAT · JUL 25</small><b>FUNK ON<br>THE ROOF</b><span>POPPING · FUNK · BOOGALOO</span><span>十里堡 · ROOFTOP ROOM</span></div><div class="check-list"><div><small>WHEN</small><b>SAT · JUL 25 · 19:30</b></div><div><small>WHO</small><b>18 人 · 新手友好</b></div><div><small>JOIN</small><b>直接加入</b></div></div>`,
]

function createPage() {
  const step = Math.min(4, Math.max(0, Number(new URLSearchParams(location.search).get('step') ?? 0)))
  return `<section class="page create-page"><header class="create-top"><button data-go="home">←</button><b>DROP A CYPHER</b><span>DRAFT</span></header><div class="steps">${['VIBE','WHEN','WHERE','WHO','CHECK'].map((name, i) => `<i class="${i === step ? 'active' : i < step ? 'done' : ''}"><b>${i < step ? '✓' : i + 1}</b><small>${name}</small></i>`).join('')}</div><div class="create-body">${stepContent[step]}</div><div class="create-dock"><span><b>0${step + 1}</b> / 05</span><button id="nextStep">${step === 4 ? 'DROP THIS CYPHER ↗' : 'NEXT STEP →'}</button></div></section>`
}

function profilePage() {
  return `<section class="page profile-page"><div class="profile-hero"><header><b>CYPHER<span>///</span></b><button>•••</button></header><div class="identity"><div class="portrait">MW<i></i></div><div><small>MY CIRCLE</small><h1>MOMO W.</h1><b>POPPING · CHAOYANG</b><em>CREW / DAYBREAK</em></div></div><p>“Keep it loose. Keep it honest.”</p><footer><button>@momo.moves <b>COPY</b></button><span>6 YRS MOVING</span></footer></div><div class="profile-content">
    <div class="level"><div class="level-badge"><b>LV.3</b><small>IN THE<br>CIRCLE</small></div><div class="level-data"><small>COMMUNITY ENERGY</small><b>86 <em>GROOVE PTS</em></b><i><em></em></i><span>14 pts to Groove Keeper</span></div><strong>NOT A<br>SKILL SCORE</strong></div>
    <div class="stats"><div><b>18</b><small>SHOWED UP</small></div><div><b>4</b><small>HOSTED</small></div><div><b>0</b><small>NO-SHOWS</small></div></div>
    <div class="section-label"><b><i>01</i> MY GROOVE</b><span>EDIT →</span></div><div class="groove-card"><small>PRIMARY</small><b>POPPING</b><span>FUNK · BOOGALOO · PARTY GROOVE</span></div>
    <div class="section-label"><b><i>02</i> BADGES ON DECK</b></div><div class="badges"><div><i>✓</i><b>RELIABLE<br>GROOVER</b></div><div><i>◎</i><b>EARLY<br>CIRCLE</b></div><div class="locked"><i>⌁</i><b>HOST 5<br>CYPHERS</b></div></div>
    <div class="settings"><small>FEEDBACK SETTINGS</small><div role="button" tabindex="0" data-setting="sound"><span><b>Sound hits</b><em>可替换的占位音效</em></span><i class="on"></i></div><div role="button" tabindex="0" data-setting="haptics"><span><b>Haptics</b><em>关键动作的轻震反馈</em></span><i class="on"></i></div><div role="button" tabindex="0" data-setting="motion"><span><b>Reduce motion</b><em>关闭旋转、弹跳和位移</em></span><i></i></div></div>
    <button data-go="support" class="support-profile"><span><small>SUPPORT THE SCENE</small><b>给服务器续点命</b></span><i>¥ ↗</i></button></div>${bottomNav('profile')}</section>`
}

function supportPage() {
  return `<section class="page support-page"><div class="support-hero"><header><button data-go="profile">←</button><span>● TEST MODE</span><i></i></header><div class="big-record"><i>CB</i></div><div class="speaker left"><i></i><i></i></div><div class="speaker right"><i></i><i></i></div><div class="support-copy"><small>FOR THE PEOPLE KEEPING IT MOVING</small><h1>SUPPORT<br>THE <em>SCENE.</em></h1><p>核心功能永远免费。你支持的是平台维护，<br>不是舞者排名，也不会购买任何特权。</p></div></div><div class="support-content"><div class="mock-notice"><b>!</b><span><strong>MOCK PAYMENT · 不会真实扣款</strong><small>Checkpoint A 交互演示，未接入微信支付。</small></span></div>
    <div class="section-label support-label"><b><i>01</i> PICK A BOOST</b><span>只给服务器续命，不给舞力加分</span></div><div class="amounts">${[1,5,10,20].map(n => `<button data-amount="${n}" class="${n === 5 ? 'selected' : ''}"><small>¥</small><b>${n}</b><span>${n === 5 ? 'KEEP IT ON' : n === 10 ? 'FUEL THE GROOVE' : 'A LITTLE LOVE'}</span></button>`).join('')}</div><button class="custom"><b>＋</b><span><strong>CUSTOM AMOUNT</strong><small>¥1–¥500 · MOCK ONLY</small></span><i>→</i></button>
    <div class="section-label support-label"><b><i>02</i> LEAVE A NOTE</b><span>如果你愿意，会展示在墙上</span></div><div class="note"><b>Keep the circle moving! 🪩</b><small>27 / 60</small><i>GOOD<br>VIBES</i></div><div class="option" role="button" tabindex="0" data-option="anonymous"><span><b>匿名支持</b><small>墙上显示 A friend of the scene</small></span><i></i></div><div class="option" role="button" tabindex="0" data-option="wall"><span><b>出现在 Supporters Wall</b><small>不显示金额，不做排行榜</small></span><i class="on"></i></div>
    <div class="impact"><small>WHERE IT GOES</small><div><span><b>52%</b><small>SERVER<br>+ TOOLS</small></span><span><b>31%</b><small>DESIGN<br>+ BUILD</small></span><span><b>17%</b><small>SCENE<br>OPS</small></span></div><em>示意比例，正式上线前按真实运营情况披露。</em></div></div>
    <div class="support-dock"><span><small>MOCK TOTAL</small><b id="mockTotal">¥5.00</b></span><button id="supportButton">SUPPORT THE SCENE →</button></div></section>`
}

const pages = { home: homePage, detail: detailPage, create: createPage, profile: profilePage, support: supportPage }
const params = new URLSearchParams(location.search)
const page = pages[params.get('page')] ? params.get('page') : 'home'
if (params.get('capture') === '1') document.body.classList.add('capture')
document.getElementById('screen').innerHTML = pages[page]()
document.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => { location.href = `?page=${button.dataset.go}${params.get('capture') === '1' ? '&capture=1' : ''}` }))
document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('on', item === button))
  document.querySelectorAll('.event-card').forEach((card) => {
    const filter = button.dataset.filter
    card.hidden = filter !== 'ALL' && !card.dataset.filters.includes(filter)
  })
}))
document.getElementById('joinButton')?.addEventListener('click', () => { document.getElementById('joinSheet').hidden = false })
document.getElementById('cancelJoin')?.addEventListener('click', () => { document.getElementById('joinSheet').hidden = true })
document.getElementById('confirmJoin')?.addEventListener('click', () => {
  const button = document.getElementById('joinButton')
  button.textContent = 'YOU’RE IN ✓'
  button.classList.add('joined')
  document.getElementById('joinSheet').hidden = true
})
document.getElementById('nextStep')?.addEventListener('click', () => { const step = Number(params.get('step') ?? 0); location.href = `?page=create&step=${step === 4 ? 0 : step + 1}${params.get('capture') === '1' ? '&capture=1' : ''}` })
document.querySelectorAll('[data-amount]').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('[data-amount]').forEach(b => b.classList.remove('selected')); button.classList.add('selected'); document.getElementById('mockTotal').textContent = `¥${button.dataset.amount}.00` }))
document.querySelectorAll('[data-setting]').forEach((control) => control.addEventListener('click', () => {
  control.querySelector('i').classList.toggle('on')
  if (control.dataset.setting === 'motion') document.body.classList.toggle('preview-reduced-motion', control.querySelector('i').classList.contains('on'))
}))
document.querySelectorAll('[data-option]').forEach((control) => control.addEventListener('click', () => control.querySelector('i').classList.toggle('on')))
document.getElementById('supportButton')?.addEventListener('click', (event) => { event.currentTarget.textContent = 'MOCK SUPPORT COMPLETE ✓'; event.currentTarget.classList.add('joined') })
