const SAMPLE = {
    eventName: "2026 서울숲 가을 국화축제",
    subtitle: "10월 24일(토)부터 11월 8일(일)까지 16일간 서울숲 문화예술공원 일대에서 진행\n국화 32종 5만여 본 전시와 야간 조명쇼, 체험 프로그램 등 다채로운 볼거리 마련\n전 프로그램 무료 개방, 일부 체험 프로그램은 사전예약 필수",
    schedule: "2026년 10월 24일(토)~11월 8일(일), 서울숲 문화예술공원 일대",
    background: "서울숲은 2005년 개장 이후 도심 속 대표 생태공원으로 사랑받아 온 공간으로, 매년 가을 국화 전시를 비롯한 계절 축제가 열려 시민들의 힐링 명소로 자리매김했다.",
    programs: "국화 전시존: 문화예술공원 잔디마당 일대, 국화 32종 5만여 본 대형 조형물·테마 정원 조성\n야간 조명쇼: 매주 금·토요일 오후 6시~9시, 국화 조형물과 조명을 결합한 야간 경관 연출\n국화 플리마켓: 매일 오전 11시~오후 6시, 성동구 인근 소상공인 40여 개 팀 참여\n체험 프로그램: 국화 압화 만들기, 국화차 시음 등 매일 오전 10시~오후 5시(회당 30분)",
    participation: "전 프로그램 무료로 운영되며, 체험 프로그램은 참여 인원이 제한되어 있어 사전예약이 필요하다. 예약은 10월 10일(토) 오전 10시부터 서울시 공공서비스예약 누리집을 통해 선착순으로 접수한다.",
    info: "서울시 동부공원여가센터, 02-450-1114, parks.seoul.go.kr, 인스타그램(@seoulforest_official)",
    quote: "이가을 서울시 동부공원여가센터장, 이번 국화축제가 가을 정취를 만끽하며 지친 일상에 잠시 쉼표를 찍을 수 있는 뜻깊은 시간이 되길 바란다",
    coreMessage: "국화 향기 가득한 가을, 서울숲에서 만나는 힐링의 시간"
  };

  const FIELD_IDS = ['eventName','subtitle','schedule','background','programs','participation','info','quote','coreMessage'];
  const REQUIRED_IDS = ['eventName','schedule','programs','info','coreMessage'];

  let sampleFilled = false;
  let currentPlainText = '';

  const sampleBtn = document.getElementById('sampleBtn');
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const validationMsg = document.getElementById('validationMsg');
  const previewBody = document.getElementById('previewBody');

  sampleBtn.addEventListener('click', () => {
    if (!sampleFilled) {
      FIELD_IDS.forEach(id => { document.getElementById(id).value = SAMPLE[id]; });
      sampleBtn.textContent = '다시 작성';
      sampleFilled = true;
    } else {
      FIELD_IDS.forEach(id => { document.getElementById(id).value = ''; });
      sampleBtn.textContent = '샘플로 채우기';
      sampleFilled = false;
    }
    clearErrors();
    resetPreview();
  });

  function clearErrors(){
    REQUIRED_IDS.forEach(id => {
      document.getElementById('group-' + id).classList.remove('field-error');
    });
    validationMsg.classList.remove('show');
  }

  function resetPreview(){
    copyBtn.classList.remove('show');
    previewBody.innerHTML = '<p class="placeholder" id="previewPlaceholder">왼쪽 정보를 입력하고<br>\'보도자료 작성\'을 누르면<br>완성된 보도자료가 이곳에 표시됩니다.</p>';
    currentPlainText = '';
  }

  function hasBatchim(word){
    const ch = (word || '').trim().slice(-1);
    const code = ch.charCodeAt(0);
    if (code < 0xAC00 || code > 0xD7A3) return false;
    return (code - 0xAC00) % 28 !== 0;
  }
  function topicMarker(word){ return hasBatchim(word) ? '은' : '는'; }
  function objectMarker(word){ return hasBatchim(word) ? '을' : '를'; }

  function escapeHtml(str){
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function markSymbols(text){
    return escapeHtml(text)
      .replace(/□/g, '<span class="mark mark-sq">□</span>')
      .replace(/○/g, '<span class="mark mark-circ">○</span>');
  }

  function getData(){
    const data = {};
    FIELD_IDS.forEach(id => { data[id] = document.getElementById(id).value.trim(); });
    return data;
  }

  function validate(data){
    let firstInvalid = null;
    REQUIRED_IDS.forEach(id => {
      const group = document.getElementById('group-' + id);
      const empty = !data[id];
      group.classList.toggle('field-error', empty);
      if (empty && !firstInvalid) firstInvalid = document.getElementById(id);
    });
    return firstInvalid;
  }

  function buildPressRelease(data){
    const infoParts = data.info.split(',').map(s => s.trim()).filter(Boolean);
    const orgName = infoParts[0] || '서울시';
    const infoRest = infoParts.slice(1).join(', ');

    const titleText = `"${data.coreMessage}" — 서울시, '${data.eventName}' 개최`;

    const subtitleLines = data.subtitle
      ? data.subtitle.split('\n').map(s => s.trim()).filter(Boolean)
      : [];

    const lead = `□ ${orgName}${topicMarker(orgName)} ${data.schedule}에서 '${data.eventName}'${objectMarker(data.eventName)} 개최한다고 밝혔다. 이번 행사는 ${data.coreMessage}${objectMarker(data.coreMessage)} 위해 마련됐다.`;

    const backgroundBlock = data.background ? `□ ${data.background}` : '';

    const programLines = data.programs.split('\n').map(s => s.trim()).filter(Boolean);
    const programsBlock = `□ 축제 기간에는 다음과 같은 프로그램이 운영된다.\n` +
      programLines.map(l => `○ ${l}`).join('\n');

    const participationBlock = data.participation ? `□ ${data.participation}` : '';

    const infoBlock = infoRest
      ? `□ 자세한 사항은 ${orgName}로 문의하면 된다. (${infoRest})`
      : `□ 자세한 사항은 ${orgName}로 문의하면 된다.`;

    let quoteBlock;
    if (data.quote) {
      const qParts = data.quote.split(',').map(s => s.trim()).filter(Boolean);
      const namePart = qParts[0] || orgName;
      const commentPart = qParts.slice(1).join(', ').replace(/^["“]|["”]$/g, '').trim();
      quoteBlock = commentPart
        ? `□ ${namePart}${topicMarker(namePart)} "${commentPart}"라고 말했다.`
        : `□ ${namePart}${topicMarker(namePart)} "${data.coreMessage}"라며 시민들의 많은 관심과 참여를 당부했다.`;
    } else {
      quoteBlock = `□ ${orgName} 관계자는 "${data.coreMessage}"라며 시민들의 많은 관심과 참여를 당부했다.`;
    }

    const bodyBlocks = [lead, backgroundBlock, programsBlock, participationBlock, infoBlock, quoteBlock]
      .filter(Boolean);

    const plainText = [
      titleText,
      subtitleLines.map(l => `- ${l}`).join('\n'),
      ...bodyBlocks
    ].filter(Boolean).join('\n\n');

    return { titleText, subtitleLines, bodyBlocks, plainText };
  }

  function renderPreview(result){
    let html = `<p class="release-title">${escapeHtml(result.titleText)}</p>`;
    if (result.subtitleLines.length) {
      html += `<ul class="release-subtitle">${result.subtitleLines.map(l => `<li>${escapeHtml(l)}</li>`).join('')}</ul>`;
    }
    html += `<div class="release-body">${result.bodyBlocks.map(b => `<p>${markSymbols(b).replace(/\n/g,'<br>')}</p>`).join('')}</div>`;

    previewBody.innerHTML = html;
    previewBody.classList.remove('fade-in');
    void previewBody.offsetWidth; /* 리플로우로 애니메이션 재생 */
    previewBody.classList.add('fade-in');
    copyBtn.classList.add('show');
    currentPlainText = result.plainText;
  }

  generateBtn.addEventListener('click', () => {
    const data = getData();
    const firstInvalid = validate(data);
    if (firstInvalid) {
      validationMsg.classList.add('show');
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalid.focus();
      return;
    }
    validationMsg.classList.remove('show');
    const result = buildPressRelease(data);
    renderPreview(result);
  });

  copyBtn.addEventListener('click', async () => {
    if (!currentPlainText) return;
    try {
      await navigator.clipboard.writeText(currentPlainText);
      const original = copyBtn.textContent;
      copyBtn.textContent = '복사됨';
      setTimeout(() => { copyBtn.textContent = original; }, 1500);
    } catch (e) {
      copyBtn.textContent = '복사 실패';
      setTimeout(() => { copyBtn.textContent = '복사하기'; }, 1500);
    }
  });
