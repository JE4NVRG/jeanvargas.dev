import { assertChannelText } from './channel-capabilities.js';
import { visitorCapabilities, widgetFile, mediaEnvelope, widgetAttachment, privateMediaBlob, createWebchatVoiceRecorder, previewKind, mediaSize } from './webchat-media.js';

const mounted = new WeakMap();
const MEDIA_TIMEOUT_MS = 180_000, MEDIA_URLS_MAX = 4, MEDIA_DOWNLOADS_MAX = 2;
const copy = {
  'pt-BR': {
    launcher: 'Fale com a equipe', title: 'Atendimento', origin: 'Uma conversa com nossa equipe', close: 'Fechar conversa',
    intro: 'Conte o que você precisa. Sua mensagem chega à equipe deste site.', name: 'Como podemos chamar você?', start: 'Iniciar conversa', capabilities: 'Confira as opções disponíveis ao iniciar.',
    history: 'Mensagens da conversa', protected: 'Conversa protegida por sessão temporária.', text: 'Mensagem para a equipe', placeholder: 'Escreva sua mensagem…', textLimit: 'Até 4.000 caracteres · texto',
    attachments: 'Anexos indisponíveis', attachmentsLabel: 'Anexos indisponíveis neste chat', chooseFile: 'Escolher um arquivo', fileReview: 'Arquivo para revisão',
    record: 'Gravar áudio', stopRecord: 'Parar gravação', cancelRecord: 'Descartar gravação', send: 'Enviar', sending: 'Enviando…', retry: 'Tentar novamente', credit: brand => `Atendimento por ${brand}`,
    voiceReady: 'Áudio pronto. Revise a gravação antes de enviar.', voicePermission: 'Aguardando permissão do microfone…', voiceRecording: 'Gravando', voicePreparing: 'Preparando áudio para revisão…',
    attach: 'Anexar arquivo', attachLabel: 'Anexar um arquivo de até 16 MiB', captionLimit: limit => `Legenda opcional · até ${limit} caracteres`,
    mediaCapabilities: 'Texto e um arquivo por mensagem, até 16 MiB.', textCapabilities: 'Este atendimento recebe somente texto.', preview: name => `Prévia de ${name}`,
    recordedAudio: 'Áudio gravado', selectedFile: 'Arquivo selecionado', file: 'Arquivo', removeFile: 'Retirar arquivo', removeFileLabel: 'Retirar arquivo selecionado',
    removedFile: 'Arquivo retirado. Seu texto continua no campo.', invalidFile: 'Confira o arquivo: um por mensagem, até 16 MiB, em um formato aceito pela conexão.',
    you: 'Você', assistant: 'Assistente virtual', team: 'Equipe', preparingFile: 'Preparando arquivo…', unavailableFile: 'Arquivo indisponível.',
    saveFile: 'Salvar arquivo', saveFileLabel: name => `Salvar arquivo: ${name}`, loadingFile: 'Carregando…', loadFile: { image: 'Carregar foto', audio: 'Carregar áudio', video: 'Carregar vídeo', document: 'Carregar arquivo' },
    mediaError: 'Não foi possível carregar este arquivo. Tente novamente.', downloadsBusy: 'Aguarde os arquivos em carregamento antes de abrir outro.',
    expired: 'A sessão terminou. Inicie outra conversa para continuar.', expiredFile: 'A sessão terminou ou o arquivo ficou indisponível. Inicie novamente para conferir.', expiredChat: 'A sessão terminou ou o atendimento ficou indisponível. Inicie novamente para conferir.',
    disconnected: 'Conexão interrompida. Voltaremos a conferir as mensagens.', closed: 'Este atendimento foi encerrado.', invalidName: 'Informe seu nome com até 80 caracteres.', opening: 'Abrindo sua conversa…', opened: 'A equipe receberá suas mensagens por este site.',
    startLimit: 'Há muitas conversas sendo abertas. Aguarde um minuto.', startError: 'Não foi possível abrir o atendimento. Tente novamente.', expiredDraft: 'A sessão terminou. Sua mensagem continua no campo para revisão.',
    invalidCaption: limit => `Confira a legenda: até ${limit} caracteres e um arquivo aceito.`, invalidText: 'Escreva uma mensagem de até 4.000 caracteres.', prepareError: 'Não foi possível preparar este arquivo. Confira o tamanho e o nome.',
    sendingMessage: 'Enviando mensagem…', replayed: 'Mensagem já recebida pela equipe.', received: 'Mensagem recebida pela equipe.', expiredSend: 'A sessão terminou. Sua mensagem foi preservada; confira antes de iniciar outra conversa.',
    invalidMessage: 'Confira a mensagem e o arquivo antes de tentar novamente.', sendLimit: 'Aguarde um minuto e tente novamente.', uncertainSend: 'Envio sem confirmação. Tente novamente para conferir a mesma mensagem.', singleFile: 'Escolha um arquivo por mensagem.',
    email: 'E-mail para retorno (opcional)', privacy: 'Usaremos seu e-mail somente para responder a este atendimento.', invalidEmail: 'Confira o endereço de e-mail.', saveEmail: 'Salvar e-mail', emailSaved: 'E-mail de retorno salvo.', emailError: 'Não foi possível salvar o e-mail. Tente novamente.',
    typing: 'Assistente está escrevendo…', handoff: 'Sua conversa foi encaminhada para uma pessoa da equipe.', feedback: 'Este atendimento ajudou?', useful: 'Útil', notUseful: 'Não útil', feedbackSaved: 'Obrigado pela avaliação.', feedbackError: 'Não foi possível salvar a avaliação. Tente novamente.', identityExpired: 'Sua identificação expirou. Confira a conexão antes de continuar.',
    voice: {}
  },
  en: {
    launcher: 'Chat with our team', title: 'Support', origin: 'A conversation with our team', close: 'Close conversation',
    intro: 'Tell us what you need. Your message will reach this site’s team.', name: 'What should we call you?', start: 'Start conversation', capabilities: 'Check the available options when you start.',
    history: 'Conversation messages', protected: 'Conversation protected by a temporary session.', text: 'Message to the team', placeholder: 'Write your message…', textLimit: 'Up to 4,000 characters · text',
    attachments: 'Attachments unavailable', attachmentsLabel: 'Attachments unavailable in this chat', chooseFile: 'Choose a file', fileReview: 'File for review',
    record: 'Record audio', stopRecord: 'Stop recording', cancelRecord: 'Discard recording', send: 'Send', sending: 'Sending…', retry: 'Try again', credit: brand => `Support by ${brand}`,
    voiceReady: 'Audio ready. Review the recording before sending.', voicePermission: 'Waiting for microphone permission…', voiceRecording: 'Recording', voicePreparing: 'Preparing audio for review…',
    attach: 'Attach file', attachLabel: 'Attach a file up to 16 MiB', captionLimit: limit => `Optional caption · up to ${limit} characters`,
    mediaCapabilities: 'Text and one file per message, up to 16 MiB.', textCapabilities: 'This chat accepts text only.', preview: name => `Preview of ${name}`,
    recordedAudio: 'Recorded audio', selectedFile: 'Selected file', file: 'File', removeFile: 'Remove file', removeFileLabel: 'Remove selected file',
    removedFile: 'File removed. Your text is still in the field.', invalidFile: 'Check the file: one per message, up to 16 MiB, in a format accepted by this connection.',
    you: 'You', assistant: 'Virtual assistant', team: 'Team', preparingFile: 'Preparing file…', unavailableFile: 'File unavailable.',
    saveFile: 'Save file', saveFileLabel: name => `Save file: ${name}`, loadingFile: 'Loading…', loadFile: { image: 'Load photo', audio: 'Load audio', video: 'Load video', document: 'Load file' },
    mediaError: 'Unable to load this file. Try again.', downloadsBusy: 'Wait for the current files to finish loading before opening another.',
    expired: 'Your session has ended. Start another conversation to continue.', expiredFile: 'Your session has ended or the file is unavailable. Start again to check.', expiredChat: 'Your session has ended or support is unavailable. Start again to check.',
    disconnected: 'Connection interrupted. We will check for messages again.', closed: 'This conversation has ended.', invalidName: 'Enter your name using up to 80 characters.', opening: 'Opening your conversation…', opened: 'The team will receive your messages through this site.',
    startLimit: 'Too many conversations are being opened. Wait a minute.', startError: 'Unable to open support. Try again.', expiredDraft: 'Your session has ended. Your message is still in the field for review.',
    invalidCaption: limit => `Check the caption: up to ${limit} characters and an accepted file.`, invalidText: 'Write a message using up to 4,000 characters.', prepareError: 'Unable to prepare this file. Check its size and name.',
    sendingMessage: 'Sending message…', replayed: 'The team has already received this message.', received: 'The team has received your message.', expiredSend: 'Your session has ended. Your message was preserved; review it before starting another conversation.',
    invalidMessage: 'Check the message and file before trying again.', sendLimit: 'Wait a minute and try again.', uncertainSend: 'Send unconfirmed. Try again to check the same message.', singleFile: 'Choose one file per message.',
    email: 'Email for a reply (optional)', privacy: 'We will use your email only to respond to this support conversation.', invalidEmail: 'Check the email address.', saveEmail: 'Save email', emailSaved: 'Reply email saved.', emailError: 'Unable to save the email. Try again.',
    typing: 'The assistant is typing…', handoff: 'Your conversation has been passed to a member of the team.', feedback: 'Was this support helpful?', useful: 'Helpful', notUseful: 'Not helpful', feedbackSaved: 'Thank you for your feedback.', feedbackError: 'Unable to save your feedback. Try again.', identityExpired: 'Your identification has expired. Check the connection before continuing.',
    voice: { fileName: 'Audio', empty: 'The recording is empty. Record again.', prepare: 'Unable to prepare the recording.', timeout: 'The browser did not finish the recording. Record again.',
      finish: 'Unable to finish the recording.', unsupported: 'This browser does not support recording. Attach an audio file.', tooLarge: 'The recording exceeded 16 MiB. Record a shorter audio clip.',
      record: 'Unable to record audio.', denied: 'Microphone access was denied. Allow microphone access to record.', unavailable: 'Unable to access the microphone. Check that it is available.' }
  }
};
function widgetLocale(value) {
  if (typeof value !== 'string') return 'pt-BR';
  const language = value.trim().toLowerCase();
  return /^en(?:-[a-z0-9]{2,8})*$/.test(language) ? 'en' : 'pt-BR';
}
const identifier = value => typeof value === 'string' && /^[A-Za-z0-9_-]{1,120}$/.test(value);
const messageId = value => typeof value === 'string' && /^[A-Za-z0-9_-]{16,100}$/.test(value);
const safeText = (value, max = 160) => typeof value === 'string' && !/[\x00-\x1f\x7f]/.test(value) ? value.trim().slice(0, max) : '';
const validEmail = value => typeof value === 'string' && value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
function publicImage(value) {
  try { const url = new URL(value); return typeof value==='string'&&value.length<=1000&&url.protocol === 'https:' && !url.username && !url.password&&!url.hash ? url.href : ''; } catch { return ''; }
}
function safeWidget(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const colors = source => Object.fromEntries(['panel','header','field','border','text','muted','primary','primaryText','accent'].filter(key => /^#[0-9a-f]{6}$/i.test(source?.[key])).map(key => [key, source[key]]));
  const translations = source => Object.fromEntries(['pt-BR', 'en'].map(key => [key, safeText(source?.[key], 800)]));
  return { displayName: safeText(value.displayName, 80), theme: value.theme === 'dark' ? 'dark' : 'light', colors: colors(value.colors), lightColors: colors(value.lightColors),
    radius: Number.isSafeInteger(value.radius) && value.radius >= 0 && value.radius <= 24 ? value.radius : null, avatarUrl: publicImage(value.avatarUrl), logoUrl: publicImage(value.logoUrl), openButtonLabel: safeText(value.openButtonLabel, 80),
    credit: { visible: value.credit?.visible !== false, text: safeText(value.credit?.text) }, greeting: translations(value.greeting), verifiedGreeting: translations(value.verifiedGreeting), handoffMessage: translations(value.handoffMessage),
    emailPrompt: value.emailPrompt === true, attachmentsEnabled: value.attachmentsEnabled !== false, voiceEnabled: value.voiceEnabled !== false, feedbackEnabled: value.feedbackEnabled === true };
}
function apiOrigin(value) {
  const url = new URL(value), local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.origin !== value || url.username || url.password || !(url.protocol === 'https:' || url.protocol === 'http:' && local)) throw Error('Origem da API do widget inválida.');
  return url.origin;
}
const styles = `
:host{position:fixed;right:20px;bottom:20px;z-index:2147483000;display:block;font-family:Manrope,"Segoe UI",sans-serif;color:#193149;--widget-accent:#27644b}
*{box-sizing:border-box} [hidden]{display:none!important} button,input,textarea{font:inherit} button{cursor:pointer} button:disabled{cursor:default;opacity:.65}
button:focus-visible,input:focus-visible,textarea:focus-visible,a:focus-visible{outline:3px solid #5eb68d;outline-offset:3px}
.launcher{display:flex;align-items:center;gap:10px;min-height:48px;max-width:280px;padding:12px 18px;border:1px solid #ffffff40;border-radius:28px;background:var(--widget-accent);color:#fff;font-size:14px;font-weight:700;box-shadow:0 8px 24px #19314924}
.launcher span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.symbol{font-size:20px;line-height:1}
.panel{display:flex;flex-direction:column;width:360px;height:min(620px,calc(100dvh - 40px));max-height:calc(100dvh - 40px);overflow:hidden;border:1px solid #dce6ec;border-radius:16px;background:#fff;box-shadow:0 16px 48px #19314926}
.header{display:flex;align-items:center;gap:12px;padding:15px 16px;background:var(--widget-accent);color:#fff}.heading{min-width:0;flex:1}.heading h2{font-size:15px;line-height:1.5;margin:0;overflow-wrap:anywhere}.heading p{font-size:11px;line-height:1.5;margin:2px 0 0;opacity:.88}.close{width:44px;height:44px;border:0;border-radius:8px;background:#ffffff14;color:#fff;font-size:25px;flex-shrink:0}
.intro{display:flex;flex-direction:column;gap:13px;padding:22px 18px}.intro p{margin:0;font-size:13px;line-height:1.65;color:#60778b}.intro label{font-size:12px;font-weight:700}.intro input{width:100%;min-height:44px;margin-top:7px;padding:10px 12px;border:1px solid #c9d9df;border-radius:8px;font-size:16px;color:#193149}
.primary{min-height:44px;padding:9px 14px;border:0;border-radius:8px;background:var(--widget-accent);color:#fff;font-size:13px;font-weight:700}
.timeline{display:flex;flex-direction:column;gap:12px;flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;list-style:none;margin:0;padding:18px 14px;background:#f4f7f9}.entry{max-width:88%;align-self:flex-start;overflow-wrap:anywhere}.entry.customer{align-self:flex-end}.entry p{margin:0;padding:10px 12px;border:1px solid #e1e9ed;border-radius:11px 11px 11px 3px;background:#fff;white-space:pre-wrap;font-size:13px;line-height:1.6}.entry.customer p{background:#e8f5ee;border-color:#d5e9dd;border-radius:11px 11px 3px 11px}.entry small{display:block;margin:4px 2px 0;font-size:10px;color:#60778b}
.status{flex-shrink:0;margin:0;padding:8px 15px;color:#60778b;background:#fff;font-size:11px;line-height:1.5;border-top:1px solid #e4ecef;overflow-wrap:anywhere}.status.error{color:#9e382f;background:#fff6f3}
.composer{flex-shrink:1;min-height:0;max-height:calc(100% - 110px);overflow-y:auto;overscroll-behavior:contain;padding:12px 13px;border-top:1px solid #dce6ec;background:#fff}.composer label{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}.composer textarea{display:block;width:100%;min-height:60px;max-height:120px;resize:vertical;padding:9px 10px;border:1px solid #c9d9df;border-radius:8px;font-size:16px;line-height:1.5;color:#193149}.footer{display:flex;align-items:center;gap:8px;margin-top:8px}.footer small{flex:1;font-size:10px;line-height:1.5;color:#60778b}.attachments{font-size:10px;color:#60778b;background:transparent;border:0;padding:0;text-align:left}.credit{text-align:center;margin:0;padding:7px;font-size:10px;color:#60778b;background:#fafcfd}
.media-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:5px}.media-tools button,.media-card button,.media-card .save-file,.selection button{min-height:44px;padding:8px 10px;border:1px solid #c9d9df;border-radius:7px;background:#fff;color:#193149;font-size:12px}.media-card .save-file{display:inline-flex;align-items:center;text-decoration:none}.media-card,.selection{padding:9px;border:1px solid #dce6ec;border-radius:9px;background:#fff;font-size:11px;line-height:1.5}.selection{margin-bottom:8px}.media-card strong,.selection strong{display:block;overflow-wrap:anywhere;font-size:12px}.media-preview{margin:7px 0}.media-preview img,.media-preview video{display:block;width:100%;max-height:180px;object-fit:contain;border-radius:6px}.media-preview audio{width:100%;max-width:280px}.media-info,.record-status{font-size:11px;color:#60778b}.media-card button+button{margin-left:5px}.record-status{flex-basis:100%;margin:0}.media-card .error{color:#9e382f}
.header{flex-shrink:0}.footer{position:sticky;bottom:0;background:#fff;padding-top:4px;z-index:1}
.selection{display:grid;grid-template-columns:56px minmax(0,1fr) 72px;gap:2px 8px;align-items:center}.selection strong{grid-column:2;grid-row:1}.selection>.media-info{grid-column:2;grid-row:2}.selection>.media-preview{grid-column:1;grid-row:1/3;margin:0}.selection img,.selection video{width:56px;max-height:56px;object-fit:contain}.selection>button{grid-column:3;grid-row:1/3;padding:5px;font-size:11px}.selection:has(audio)>.media-preview{grid-column:1/-1;grid-row:3;margin-top:4px}.selection:has(audio) audio{max-width:none;height:40px}
:host{--widget-panel:#fff;--widget-header:var(--widget-accent);--widget-field:#fff;--widget-border:#dce6ec;--widget-text:#193149;--widget-muted:#60778b;--widget-primary:var(--widget-accent);--widget-primary-text:#fff;--widget-header-text:#fff;--widget-radius:16px;--widget-history:#f4f7f9;--widget-customer:#e8f5ee;color:var(--widget-text)}
.panel{background:var(--widget-panel);border-color:var(--widget-border);border-radius:var(--widget-radius)}.header{background:var(--widget-header);color:var(--widget-header-text)}.launcher,.primary{background:var(--widget-primary);color:var(--widget-primary-text)}.launcher{border-color:var(--widget-border)}
.intro p,.status,.footer small,.attachments,.credit,.entry small,.media-info,.record-status,.support-notice{color:var(--widget-muted)}.intro input,.composer textarea,.reply-contact input{background:var(--widget-field);color:var(--widget-text);border-color:var(--widget-border)}.timeline{background:var(--widget-history)}.entry p,.media-card,.selection,.media-tools button,.media-card button,.media-card .save-file,.selection button{background:var(--widget-field);color:var(--widget-text);border-color:var(--widget-border)}.entry.customer p{background:var(--widget-customer);border-color:var(--widget-border)}
.composer,.status,.credit,.footer{background:var(--widget-panel);border-color:var(--widget-border)}button:focus-visible,input:focus-visible,textarea:focus-visible,a:focus-visible{outline-color:var(--widget-accent)}
.brand-image{width:36px;height:36px;object-fit:contain;flex-shrink:0;border-radius:8px}.launcher .brand-image{width:24px;height:24px}.greeting,.support-notice{margin:0;padding:12px 16px;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.greeting{color:var(--widget-text);border-bottom:1px solid var(--widget-border)}.typing{font-size:12px;color:var(--widget-muted);padding:8px 15px;margin:0}.reply-contact,.feedback{padding:12px 15px;border-top:1px solid var(--widget-border);font-size:12px;flex-shrink:0}.reply-contact label{display:block}.reply-contact input{display:block;width:100%;min-height:44px;margin:7px 0;padding:9px 10px;border:1px solid var(--widget-border);border-radius:8px;font-size:16px}.reply-contact small{display:block;line-height:1.5;color:var(--widget-muted);margin-bottom:8px}.feedback p{margin:0 0 8px}.feedback button{min-height:44px;margin-right:8px;padding:8px 12px;border:1px solid var(--widget-border);border-radius:8px;background:var(--widget-field);color:var(--widget-text)}.feedback button[aria-pressed=true]{border-color:var(--widget-accent)}
@media(max-width:480px){:host{left:12px;right:12px;bottom:12px}.panel{width:100%;height:min(640px,calc(100dvh - 24px));max-height:calc(100dvh - 24px)}.launcher{margin-left:auto}.intro{padding:18px 15px}.header{padding:12px}.timeline{padding:14px 11px}}
@media(prefers-reduced-motion:no-preference){.launcher:hover{transform:translateY(-1px);transition:transform .15s}.panel{animation:widget-open .16s ease-out}@keyframes widget-open{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}}
`;

/** A page-scoped visitor widget: capability stays in this closure, never a URL.
 * locale overrides the page lang; unsupported values fall back to pt-BR.
 * The first mount for a page/origin/tenant/channel wins until destroy().
 */
export function createWebchatWidget({ document: doc = globalThis.document, window: view = doc?.defaultView,
  fetchImpl = view?.fetch?.bind(view), apiOrigin: api, tenantId, channelId, pollMs = 3000, requestTimeoutMs = 10_000, nonce = '', locale, getIdentityToken } = {}) {
  const origin = apiOrigin(api);
  if (!doc?.body || !view || typeof fetchImpl !== 'function' || !identifier(tenantId) || !identifier(channelId)
    || !Number.isSafeInteger(pollMs) || pollMs < 1000 || pollMs > 3000 || !Number.isSafeInteger(requestTimeoutMs) || requestTimeoutMs < 1000 || requestTimeoutMs > 15_000) throw Error('Configuração do widget inválida.');
  const context = JSON.stringify([origin, tenantId, channelId]);
  const pageMounts = mounted.get(doc) || new Map(); mounted.set(doc, pageMounts);
  const existing = pageMounts.get(context);
  if (existing?.host.isConnected !== false && existing?.host.dataset.eloziWidget === context) return existing;
  existing?.destroy();
  const language = widgetLocale(locale === undefined ? doc.documentElement?.lang : locale), text = copy[language];
  const formatNumber = value => value.toLocaleString(language);
  const host = doc.createElement('div'); host.dataset.eloziWidget = context; host.setAttribute('lang', language);
  const root = host.attachShadow({ mode: 'open' });
  const element = (tag, id, className, content) => {
    const node = doc.createElement(tag); if (id) node.id = id; if (className) node.className = className;
    if (content !== undefined) node.textContent = content; return node;
  };
  const style = element('style'); style.textContent = styles; if (nonce) style.setAttribute('nonce', nonce); root.append(style);
  const launcher = element('button', 'widget-launcher', 'launcher'); launcher.type = 'button'; launcher.setAttribute('aria-haspopup', 'dialog'); launcher.setAttribute('aria-expanded', 'false'); launcher.setAttribute('aria-controls', 'widget-panel');
  const symbol = element('span', '', 'symbol', '◌'); symbol.setAttribute('aria-hidden', 'true'); const launcherLabel = element('span', 'widget-launcher-label', '', text.launcher), launcherImage = element('img', 'widget-launcher-image', 'brand-image'); launcherImage.alt = ''; launcherImage.hidden = true; launcherImage.referrerPolicy = 'no-referrer'; launcher.append(symbol, launcherImage, launcherLabel);
  const panel = element('section', 'widget-panel', 'panel'); panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'false'); panel.setAttribute('aria-labelledby', 'widget-title');
  const header = element('header', '', 'header'), heading = element('div', '', 'heading'), title = element('h2', 'widget-title', '', text.title);
  const originLabel = element('p', 'widget-origin', '', text.origin); heading.append(title, originLabel);
  const avatar = element('img', 'widget-avatar', 'brand-image'); avatar.alt = ''; avatar.hidden = true; avatar.referrerPolicy = 'no-referrer';
  const closeButton = element('button', 'widget-close', 'close', '×'); closeButton.type = 'button'; closeButton.setAttribute('aria-label', text.close); header.append(avatar, heading, closeButton);
  const greeting = element('p', 'widget-greeting', 'greeting'); greeting.hidden = true;
  const intro = element('form', 'widget-intro', 'intro'); intro.append(element('p', '', '', text.intro));
  const nameLabel = element('label', '', '', text.name), name = element('input', 'widget-name'); name.name = 'name'; name.maxLength = 80; name.required = true; name.autocomplete = 'given-name'; nameLabel.append(name);
  const emailLabel = element('label', 'widget-email-label', '', text.email), email = element('input', 'widget-email'); email.name = 'email'; email.type = 'email'; email.maxLength = 254; email.autocomplete = 'email'; email.setAttribute('aria-describedby', 'widget-email-privacy'); emailLabel.append(email); emailLabel.hidden = true;
  const emailPrivacy = element('p', 'widget-email-privacy', '', text.privacy); emailPrivacy.hidden = true;
  const startButton = element('button', 'widget-start', 'primary', text.start), introCapabilities = element('p', 'widget-capabilities', '', text.capabilities); startButton.type = 'submit'; intro.append(nameLabel, emailLabel, emailPrivacy, startButton, introCapabilities);
  const timeline = element('ol', 'widget-history', 'timeline'); timeline.setAttribute('role', 'log'); timeline.setAttribute('aria-label', text.history); timeline.setAttribute('aria-live', 'polite'); timeline.hidden = true;
  const status = element('p', 'widget-status', 'status', text.protected); status.setAttribute('role', 'status');
  const composer = element('form', 'widget-composer', 'composer'); composer.hidden = true;
  const textLabel = element('label', '', '', text.text); textLabel.setAttribute('for', 'widget-text');
  const textarea = element('textarea', 'widget-text'); textarea.name = 'text'; textarea.maxLength = 4000; textarea.rows = 2; textarea.placeholder = text.placeholder; textarea.setAttribute('aria-describedby', 'widget-text-limit');
  const footer = element('div', '', 'footer'), limits = element('small', 'widget-text-limit', '', text.textLimit);
  const attachments = element('button', 'widget-attachments', 'attachments', text.attachments); attachments.type = 'button'; attachments.disabled = true; attachments.setAttribute('aria-label', text.attachmentsLabel);
  const fileInput=element('input','widget-file');fileInput.type='file';fileInput.hidden=true;fileInput.setAttribute('aria-label',text.chooseFile);
  const selection=element('div','widget-selection','selection');selection.hidden=true;selection.setAttribute('role','group');selection.setAttribute('aria-label',text.fileReview);
  const voiceButton=element('button','widget-voice','',text.record),stopVoice=element('button','widget-voice-stop','',text.stopRecord),cancelVoice=element('button','widget-voice-cancel','',text.cancelRecord);
  for(const button of [voiceButton,stopVoice,cancelVoice])button.type='button';stopVoice.hidden=cancelVoice.hidden=true;
  const voiceStatus=element('p','widget-voice-status','record-status');voiceStatus.setAttribute('role','status');voiceStatus.setAttribute('aria-live','polite');
  const tools=element('div','','media-tools');tools.append(attachments,voiceButton,stopVoice,cancelVoice,voiceStatus);
  const sendButton = element('button', 'widget-send', 'primary', text.send); sendButton.type = 'submit'; footer.append(limits, sendButton); composer.append(selection,textLabel,textarea,fileInput,tools,footer);
  // The credit names the company brand once the server sends it (white label); until then, or without a
  // brand, there is no credit at all.
  const credit = element('p', 'widget-credit', 'credit'); credit.hidden = true;
  const typing = element('p', 'widget-typing', 'typing', text.typing); typing.hidden = true; typing.setAttribute('role', 'status');
  const handoff = element('p', 'widget-handoff', 'support-notice'); handoff.hidden = true; handoff.setAttribute('role', 'status');
  const replyContact = element('form', 'widget-contact', 'reply-contact'); replyContact.hidden = true;
  const replyLabel = element('label', '', '', text.email), replyEmail = element('input', 'widget-reply-email'); replyEmail.type = 'email'; replyEmail.maxLength = 254; replyEmail.autocomplete = 'email'; replyEmail.required = true; replyEmail.setAttribute('aria-describedby', 'widget-contact-privacy'); replyLabel.append(replyEmail);
  const contactPrivacy = element('small', 'widget-contact-privacy', '', text.privacy), contactSave = element('button', 'widget-contact-save', 'primary', text.saveEmail); contactSave.type = 'submit'; replyContact.append(replyLabel, contactPrivacy, contactSave);
  const feedback = element('section', 'widget-feedback', 'feedback'); feedback.hidden = true; feedback.setAttribute('aria-label', text.feedback); feedback.append(element('p', '', '', text.feedback));
  const useful = element('button', 'widget-useful', '', text.useful), notUseful = element('button', 'widget-not-useful', '', text.notUseful); for (const button of [useful, notUseful]) { button.type = 'button'; button.setAttribute('aria-pressed', 'false'); } feedback.append(useful, notUseful);
  panel.append(header, greeting, intro, timeline, typing, handoff, replyContact, feedback, status, composer, credit); root.append(panel, launcher); doc.body.append(host);
  const state = { opened: false, destroyed: false, sequence: 0, session: null, cursor: null, pending: null, selected: null, capabilities: visitorCapabilities({}), starting: false, sending: false, polling: false, timer: null, seen: new Set(), widget: null, contact: null, assistant: null, conversationStatus: null, feedback: null, identityLoading: false, identityRefreshing: false, contactSaving: false, feedbackSaving: false };
  const controllers = new Set(), endpoint = `${origin}/api/public/webchat/${encodeURIComponent(tenantId)}/${encodeURIComponent(channelId)}`;
  const BlobType=view.Blob||globalThis.Blob,urls=view.URL||globalThis.URL,mediaCards=new Map();
  let removalObserver;
  const current = sequence => !state.destroyed && state.opened && sequence === state.sequence && host.isConnected !== false && host.dataset.eloziWidget === context;
  const visible=()=>{if(!state.destroyed&&(host.isConnected===false||host.dataset.eloziWidget!==context)){destroy();return false;}return state.opened&&!state.destroyed&&doc.visibilityState!=='hidden';};
  const notice = (value, error = false) => { status.textContent = value; status.className = error ? 'status error' : 'status'; };
  const recorder=createWebchatVoiceRecorder({view,messages:text.voice,onFile:file=>{if(visible()&&state.session&&!state.pending&&selectFile(file,true))notice(text.voiceReady);},onError:message=>notice(message,true),onState:({state:voiceState,elapsedSeconds})=>{
    voiceStatus.textContent=voiceState==='requesting'?text.voicePermission:voiceState==='recording'?`${text.voiceRecording} · ${String(Math.floor(elapsedSeconds/60)).padStart(2,'0')}:${String(elapsedSeconds%60).padStart(2,'0')} / 05:00`:voiceState==='stopping'?text.voicePreparing:'';controls();
  }});
  function controls(){
    startButton.disabled=state.starting||state.identityLoading;sendButton.disabled=state.sending||recorder.busy||state.identityRefreshing;textarea.readOnly=Boolean(state.pending);sendButton.textContent=state.sending?text.sending:state.pending?text.retry:text.send;
    const media=state.capabilities.uploadKinds.length>0;
    attachments.hidden=state.widget?.attachmentsEnabled===false;
    attachments.disabled=!media||!state.session||state.sending||Boolean(state.pending)||recorder.busy;fileInput.disabled=attachments.disabled;
    attachments.textContent=media?text.attach:text.attachments;attachments.setAttribute('aria-label',media?text.attachLabel:text.attachmentsLabel);
    voiceButton.hidden=!state.capabilities.voice||recorder.busy;voiceButton.disabled=!state.session||!recorder.supported||state.sending||Boolean(state.pending)||Boolean(state.selected)||recorder.busy;
    stopVoice.hidden=recorder.state!=='recording';cancelVoice.hidden=!recorder.busy;
    textarea.maxLength=state.selected?state.capabilities.captionMaxLength:4000;limits.textContent=state.selected?text.captionLimit(formatNumber(state.capabilities.captionMaxLength)):text.textLimit;
    const remove=selection.querySelector?.('#widget-remove-file');if(remove)remove.disabled=Boolean(state.pending)||state.sending;
    contactSave.disabled=state.contactSaving;replyEmail.readOnly=state.contactSaving;useful.disabled=notUseful.disabled=state.feedbackSaving;
  }
  function settings(dto){
    if(dto?.brand!==undefined||dto?.name!==undefined)branding(dto);
    if(dto?.widget!==undefined){const config=safeWidget(dto.widget);if(config)state.widget=config;}
    if(dto?.mediaSupported!==undefined)state.capabilities=visitorCapabilities(dto);
    if(state.widget?.attachmentsEnabled===false)state.capabilities={...state.capabilities,uploadKinds:[],voice:false};
    if(state.widget?.voiceEnabled===false)state.capabilities={...state.capabilities,voice:false};
    introCapabilities.textContent=state.capabilities.uploadKinds.length?text.mediaCapabilities:text.textCapabilities;
    if(dto?.contact!==undefined){const value=dto.contact;state.contact=value&&typeof value==='object'?{verified:value.verified===true,name:safeText(value.name,80),email:validEmail(value.email)?value.email:'',externalId:safeText(value.externalId,160)}:null;}
    if(dto?.assistant!==undefined){const value=dto.assistant;state.assistant=value&&typeof value==='object'?{state:['idle','pending','running','sending','handoff','done'].includes(value.state)?value.state:'idle',typing:value.typing===true,handoffReason:safeText(value.handoffReason,80),requestEmail:value.requestEmail===true}:null;}
    if(dto?.conversationStatus!==undefined)state.conversationStatus=['open','waiting','closed','resolved'].includes(dto.conversationStatus)?dto.conversationStatus:null;
    if(dto?.feedback!==undefined)state.feedback=['useful','not_useful'].includes(dto.feedback?.rating)?dto.feedback.rating:null;
    paintWidget();supportState();if(!state.capabilities.voice)recorder.reset();controls();
  }
  function paintWidget(){
    const config=state.widget;if(!config)return;
    const dark=config.theme==='dark';host.style.setProperty('color-scheme',dark?'dark':'light');
    const palette={panel:dark?'#0c0c0d':'#ffffff',header:dark?'#131316':config.colors.accent||'#27644b',field:dark?'#18181b':'#ffffff',border:dark?'#2a2a2e':'#dce6ec',text:dark?'#f4f1ea':'#193149',muted:dark?'#918f89':'#60778b',primary:dark?'#f4f1ea':config.colors.accent||'#27644b',primaryText:dark?'#000000':'#ffffff',accent:dark?'#c0a8e1':'#27644b',...config.colors,...(!dark?config.lightColors:{})};
    for(const [key,value] of Object.entries(palette))host.style.setProperty('--widget-'+key.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase()),value);
    host.style.setProperty('--widget-header-text',dark||config.colors.header||config.lightColors.header?palette.text:'#ffffff');host.style.setProperty('--widget-history',palette.panel);host.style.setProperty('--widget-customer',palette.field);if(config.radius!==null)host.style.setProperty('--widget-radius',`${config.radius}px`);
    if(config.displayName)title.textContent=config.displayName;if(config.openButtonLabel)launcherLabel.textContent=config.openButtonLabel;
    for(const [image,url] of [[avatar,config.avatarUrl||config.logoUrl],[launcherImage,config.logoUrl||config.avatarUrl]]){if(url){image.src=url;image.hidden=false;}else{image.removeAttribute('src');image.hidden=true;}}
    symbol.hidden=!launcherImage.hidden;
    if(config.credit.text)credit.textContent=config.credit.text;credit.hidden=!config.credit.visible||!credit.textContent;
    const verified=state.contact?.verified===true,firstName=safeText(state.contact?.name,80).split(/\s+/)[0]||'';
    const salutation=(verified?config.verifiedGreeting[language]:config.greeting[language])||config.greeting[language];greeting.textContent=salutation.replaceAll('{firstName}',firstName);greeting.hidden=!greeting.textContent;
    emailLabel.hidden=emailPrivacy.hidden=!config.emailPrompt||verified;nameLabel.hidden=verified;name.required=!verified;
  }
  function supportState(){
    const assistant=state.assistant,transferred=Boolean(assistant?.handoffReason)||assistant?.state==='handoff';
    typing.hidden=!state.session||transferred||!(assistant?.typing||['pending','running','sending'].includes(assistant?.state));
    handoff.hidden=!state.session||!transferred||Array.from(timeline.children).some(entry=>entry.handoffNotice===true);handoff.textContent=state.widget?.handoffMessage[language]||text.handoff;
    replyContact.hidden=!state.session||state.contact?.verified===true||Boolean(state.contact?.email)||!state.widget?.emailPrompt||!(assistant?.requestEmail||transferred);
    feedback.hidden=!state.session||!state.widget?.feedbackEnabled||state.conversationStatus!=='closed';
    useful.setAttribute('aria-pressed',String(state.feedback==='useful'));notUseful.setAttribute('aria-pressed',String(state.feedback==='not_useful'));
  }
  function clearSaveLink(entry){entry?.saveLink?.removeAttribute('href');entry?.saveLink?.removeAttribute('download');if(entry)entry.saveLink=null;}
  function revoke(entry){entry?.controller?.abort();entry?.player?.pause?.();entry?.player?.removeAttribute?.('src');entry?.player?.load?.();clearSaveLink(entry);if(entry?.url){urls.revokeObjectURL(entry.url);entry.url=null;}}
  function localURL(blob){const loaded=[...mediaCards.values()].filter(entry=>entry.url),selected=state.selected?.url?1:0;while(loaded.length+selected>=MEDIA_URLS_MAX){const oldest=loaded.shift();revoke(oldest);renderCard(oldest);}return urls.createObjectURL(blob);}
  function preview(container,metadata,url){const kind=previewKind(metadata);if(kind==='document')return null;const player=element(kind==='image'?'img':kind);player.src=url;player.setAttribute('src',url);if(kind==='image'){player.alt=text.preview(metadata.name);player.loading='lazy';}else{player.controls=true;player.preload='metadata';if(kind==='video')player.playsInline=true;}player.setAttribute('aria-label',metadata.name);container.append(player);return player;}
  function renderSelection(){selection.replaceChildren();selection.hidden=!state.selected;if(!state.selected)return;const item=state.selected;
    selection.append(element('strong','','',item.metadata.name),element('small','','media-info',`${mediaSize(item.file.size,language)} · ${item.metadata.voice?text.recordedAudio:text.selectedFile}`));const area=element('div','','media-preview');selection.append(area);
    if(item.metadata.kind!=='document'){item.url||=localURL(item.file);item.player=preview(area,{...item.metadata,preview:true},item.url);}
    const remove=element('button','widget-remove-file','',text.removeFile);remove.type='button';remove.setAttribute('aria-label',text.removeFileLabel);remove.addEventListener('click',()=>{if(state.pending||state.sending)return;revoke(state.selected);state.selected=null;fileInput.value='';renderSelection();controls();notice(text.removedFile);});selection.append(remove);controls();
  }
  function selectFile(file,voice=false){if(!visible()||!state.session||state.pending||state.sending)return false;
    try{const metadata=widgetFile(file,state.capabilities,voice,voice?text.recordedAudio:text.file,language);revoke(state.selected);state.selected={file,metadata,url:null};renderSelection();controls();return true;}catch{notice(text.invalidFile,true);return false;}}
  function releaseMedia(clearFiles=false){recorder.reset();revoke(state.selected);for(const entry of mediaCards.values()){revoke(entry);entry.loading=false;renderCard(entry);}if(clearFiles){state.selected=null;state.pending=null;fileInput.value='';mediaCards.clear();selection.replaceChildren();selection.hidden=true;}}
  function stopPolling() {
    if (state.timer !== null) view.clearTimeout(state.timer); state.timer = null;
    for (const entry of controllers) if (entry.kind === 'history') {entry.controller.abort();view.clearTimeout(entry.timer);}
  }
  async function request(kind, body, sequence, {binary=false,download=null,owner=null,publicRequest=false}={}) {
    const controller = new view.AbortController(), entry = { controller, kind }; controllers.add(entry);
    if(owner)owner.controller=controller;
    const session=state.session;
    const guard=()=>{if(host.isConnected===false||host.dataset.eloziWidget!==context){destroy();throw Error('Contexto do widget alterado.');}if(controller.signal.aborted||(publicRequest?state.destroyed:!current(sequence))||!publicRequest&&session&&state.session!==session||owner&&mediaCards.get(owner.metadata.id)!==owner)throw Error('Contexto do widget alterado.');if(!publicRequest&&session&&session.expiresAt<=Date.now())throw Object.assign(Error('Sessão expirada.'),{status:401});};
    const timer = view.setTimeout(() => controller.abort(), binary||download?MEDIA_TIMEOUT_MS:requestTimeoutMs);
    entry.timer=timer;
    try {
      guard();
      const response = await fetchImpl(`${endpoint}/${kind}`, { method: 'POST', mode: 'cors', credentials: 'omit', redirect: 'error',
        referrerPolicy:'no-referrer',headers: { 'Content-Type': binary?'application/octet-stream':'application/json',...(binary?{Authorization:`Bearer ${session.token}`}:{}) },body:binary?body:JSON.stringify(body),signal:controller.signal });
      guard();
      if (!response.ok) {let code;try{const error=await response.json();if(['identity_expired','identity_invalid'].includes(error?.code))code=error.code;}catch{}guard();throw Object.assign(Error('Solicitação do widget recusada.'), { status: response.status, code });}
      const result=download?await privateMediaBlob(response,download,{BlobType,reauthorize:guard}):await response.json();
      guard();
      return result;
    } finally { controller.abort();view.clearTimeout(timer); controllers.delete(entry);if(owner?.controller===controller)owner.controller=null; }
  }
  function endSession(message) {
    stopPolling();state.sequence++;for(const entry of controllers){entry.controller.abort();view.clearTimeout(entry.timer);}state.session=null;state.contact=null;state.assistant=null;state.conversationStatus=null;state.feedback=null;releaseMedia(true);state.capabilities=visitorCapabilities({});state.seen.clear();state.cursor=null;timeline.replaceChildren();timeline.hidden=true;intro.hidden=false;composer.hidden=true;paintWidget();supportState();
    notice(message, true); controls();
  }
  function branding(value) {
    const brand = typeof value?.brand?.name === 'string' ? value.brand.name.trim().slice(0, 80) : '';
    credit.textContent = brand ? text.credit(brand) : ''; credit.hidden = !brand;
    if (typeof value?.brand?.name === 'string' && value.brand.name.trim()) title.textContent = value.brand.name.slice(0, 80);
    else if (typeof value?.name === 'string' && value.name.trim()) title.textContent = value.name.slice(0, 80);
    if (typeof value?.name === 'string' && value.name.trim()) {
      let site = ''; try { site = new URL(view.location?.origin).hostname; } catch {}
      originLabel.textContent = value.name.slice(0, 80) + (site ? ` · ${site}` : '');
    }
    if (typeof value?.brand?.accent === 'string' && /^#[0-9a-f]{6}$/i.test(value.brand.accent)) host.style.setProperty('--widget-accent', value.brand.accent);
  }
  function appendMessages(messages) {
    if (!Array.isArray(messages) || messages.length > 100) throw Error('Histórico do widget inválido.');
    const follow = timeline.scrollHeight - timeline.scrollTop - timeline.clientHeight < 64;
    for (const item of messages) {
      if (!messageId(item?.id) || !['customer', 'human', 'agent'].includes(item.kind) || typeof item.text !== 'string') throw Error('Mensagem do widget inválida.');
      if(item.attachments!==undefined&&(!Array.isArray(item.attachments)||item.attachments.length>1))throw Error('Arquivos do histórico inválidos.');
      const files=(item.attachments||[]).map(file=>widgetAttachment(file,text.file));
      if (state.seen.has(item.id)) continue;
      state.seen.add(item.id);
      const entry = element('li', '', `entry ${item.kind === 'customer' ? 'customer' : 'attendant'}`);
      // The gateway reserves this ID namespace for its persisted handoff acknowledgement.
      entry.handoffNotice=item.kind==='agent'&&/^handoff_[0-9a-f]{32}$/.test(item.id)&&Boolean(item.text.trim());
      entry.append(element('p','','',item.text.slice(0,4000)));entry.mediaIds=[];
      for(const metadata of files){if(mediaCards.has(metadata.id))throw Error('Referência de arquivo repetida no histórico.');const card=element('div','','media-card'),record={metadata,card,url:null,loading:false};entry.mediaIds.push(metadata.id);mediaCards.set(metadata.id,record);renderCard(record);entry.append(card);}
      entry.append(element('small','','',item.kind==='customer'?text.you:item.kind==='agent'?text.assistant:text.team));timeline.append(entry);
      while(timeline.children.length>250){const oldest=timeline.firstElementChild;for(const id of oldest.mediaIds||[]){revoke(mediaCards.get(id));mediaCards.delete(id);}oldest.remove();}
      if (state.seen.size > 5000) state.seen.delete(state.seen.values().next().value);
    }
    if (follow) timeline.scrollTop = timeline.scrollHeight;
    supportState();
  }
  function renderCard(entry){const {metadata,card}=entry;clearSaveLink(entry);card.replaceChildren();card.append(element('strong','','',metadata.name),element('small','','media-info',mediaSize(metadata.size,language)));const area=element('div','','media-preview');card.append(area);if(entry.url)entry.player=preview(area,metadata,entry.url);
    if(metadata.status!=='ready'){card.append(element('p','','media-info',metadata.status==='pending'?text.preparingFile:text.unavailableFile));return;}
    if(entry.url){const url=entry.url,save=element('a','','save-file',text.saveFile);save.href=url;save.download=metadata.name;save.rel='noopener noreferrer';save.referrerPolicy='no-referrer';save.setAttribute('aria-label',text.saveFileLabel(metadata.name));entry.saveLink=save;
      // A fresh native click saves bytes already validated in RAM, without a second fetch.
      save.addEventListener('click',event=>{if(!visible()||!state.session||state.session.expiresAt<=Date.now()||mediaCards.get(metadata.id)!==entry||entry.url!==url||entry.saveLink!==save){event.preventDefault();if(state.session?.expiresAt<=Date.now())endSession(text.expired);}});card.append(save);
    }else{const load=element('button','', '',entry.loading?text.loadingFile:text.loadFile[previewKind(metadata)]);load.type='button';load.disabled=entry.loading;load.setAttribute('aria-label',`${load.textContent}: ${metadata.name}`);load.addEventListener('click',()=>loadMedia(entry));card.append(load);}
    if(entry.error)card.append(element('p','','error',text.mediaError));
  }
  async function loadMedia(entry){if(!visible()||!state.session||entry.url||entry.loading||mediaCards.get(entry.metadata.id)!==entry)return;const sequence=state.sequence,session=state.session;
    if(!entry.url&&[...mediaCards.values()].filter(value=>value.loading).length>=MEDIA_DOWNLOADS_MAX){notice(text.downloadsBusy);return;}
    try{if(!entry.url){entry.loading=true;entry.error=false;renderCard(entry);const blob=await request(`media/${entry.metadata.id}`,{token:session.token},sequence,{download:entry.metadata,owner:entry});
      if(!current(sequence)||state.session!==session||mediaCards.get(entry.metadata.id)!==entry)return;
      entry.url=localURL(blob);entry.loading=false;renderCard(entry);
    }
    }catch(error){if(current(sequence)&&mediaCards.get(entry.metadata.id)===entry){if([401,403].includes(error.status))endSession(text.expiredFile);else{entry.error=true;entry.loading=false;renderCard(entry);}}}finally{entry.loading=false;}
  }
  function schedule() { if (visible() && state.session && state.timer === null) state.timer = view.setTimeout(() => { state.timer = null; void poll(); }, pollMs); }
  async function poll() {
    if (host.isConnected === false) { destroy(); return; }
    if (!visible() || !state.session || state.polling) return;
    if (state.session.expiresAt <= Date.now()) { endSession(text.expired); return; }
    const sequence = state.sequence; state.polling = true;
    try {
      for (let pages = 0; pages < 5 && visible(); pages++) {
        const response = await request('history', { token: state.session.token, ...(state.cursor ? { after: state.cursor } : {}), limit: 100 }, sequence);
        settings(response);
        appendMessages(response.messages);
        if (response.nextCursor !== null && response.nextCursor !== undefined) {
          if (!messageId(response.nextCursor) || response.messages.at(-1)?.id !== response.nextCursor) throw Error('Página do widget inválida.');
          state.cursor = response.nextCursor;
        }
        if (!response.hasMore) break;
        if (!response.messages.length) throw Error('Página do widget inválida.');
      }
    } catch (error) {
      if (host.isConnected === false) { destroy(); return; }
      if (current(sequence) && visible()) {
        if(error.code==='identity_expired'){await refreshIdentity(sequence);}
        else if ([401, 403, 404].includes(error.status)) endSession(text.expiredChat);
        else if (!state.sending && !state.pending) notice(state.conversationStatus==='closed'?text.closed:text.disconnected,state.conversationStatus!=='closed');
      }
    } finally { state.polling = false; schedule(); }
  }
  async function identityToken(sequence) {
    if(typeof getIdentityToken!=='function'||!current(sequence))return null;
    const controller=new view.AbortController(),entry={controller,kind:'identity-callback'};controllers.add(entry);
    let timer;
    try{
      const aborted=new Promise(resolve=>{controller.signal.addEventListener('abort',()=>resolve(null),{once:true});timer=view.setTimeout(()=>controller.abort(),requestTimeoutMs);entry.timer=timer;});
      const value=await Promise.race([Promise.resolve().then(()=>current(sequence)&&!controller.signal.aborted?getIdentityToken():null).catch(()=>null),aborted]);
      return current(sequence)&&!controller.signal.aborted&&typeof value==='string'&&value.length<=8192&&/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)?value:null;
    }finally{controller.abort();view.clearTimeout(timer);controllers.delete(entry);}
  }
  async function identifyOnOpen(sequence){
    if(typeof getIdentityToken!=='function'||state.session||state.identityLoading||state.starting)return;
    const owner={sequence};state.identityOwner=owner;state.identityLoading=true;controls();let jwt;
    try{jwt=await identityToken(sequence);if(current(sequence)&&state.identityOwner===owner&&jwt)await start(jwt);}
    finally{jwt=null;if(state.identityOwner===owner){state.identityOwner=null;state.identityLoading=false;controls();}}
  }
  async function refreshIdentity(sequence){
    if(!current(sequence)||!state.session||!state.contact?.verified||state.identityRefreshing)return false;
    const session=state.session,externalId=state.contact.externalId;state.identityRefreshing=true;state.refreshSequence=sequence;controls();let jwt;
    try{
      jwt=await identityToken(sequence);if(!current(sequence)||state.session!==session)return false;
      if(!jwt){endSession(text.identityExpired);return false;}
      const result=await request('identity',{token:session.token,identityToken:jwt},sequence);
      if(result.contact?.verified!==true||safeText(result.contact.externalId,160)!==externalId){endSession(text.identityExpired);return false;}
      settings(result);return true;
    }catch{if(current(sequence)&&state.session===session)endSession(text.identityExpired);return false;}
    finally{jwt=null;if(state.refreshSequence===sequence){state.identityRefreshing=false;controls();}}
  }
  async function start(jwt = null) {
    if (!visible() || state.starting || state.session || !jwt&&state.identityLoading) return;
    const visitor = name.value.trim();
    if (!jwt&&(!visitor || visitor.length > 80 || /[\x00-\x1f\x7f]/.test(visitor))) { notice(text.invalidName, true); name.focus(); return; }
    const visitorEmail=state.widget?.emailPrompt?email.value.trim():'';
    if(!jwt&&visitorEmail&&!validEmail(visitorEmail)){notice(text.invalidEmail,true);email.focus();return;}
    const sequence = state.sequence; state.startSequence=sequence;state.starting = true; controls(); notice(text.opening);
    try {
      const challenge = await request('challenge', {}, sequence); branding(challenge);settings(challenge);
      if (typeof challenge.challenge !== 'string') throw Error('Abertura do widget inválida.');
      const result = await request('session', { challenge: challenge.challenge, locale:language, ...(jwt?{identityToken:jwt}:{name:visitor,...(visitorEmail?{email:visitorEmail}:{})}) }, sequence);
      const expiresAt = Date.parse(result.expiresAt);
      if (typeof result.token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(result.token) || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) throw Error('Sessão do widget inválida.');
      if(jwt&&result.contact?.verified!==true){state.contact=null;paintWidget();notice(text.protected);return;}
      releaseMedia(true);state.session={token:result.token,expiresAt};settings(result);state.cursor=null;state.seen.clear();timeline.replaceChildren();
      intro.hidden = true; timeline.hidden = false; composer.hidden = false; notice(text.opened); textarea.focus(); void poll();
    } catch (error) { if (current(sequence)) {if(jwt&&['identity_invalid','identity_expired'].includes(error.code)){state.contact=null;paintWidget();notice(text.protected);}else notice(error.status === 429 ? text.startLimit : text.startError, true);} }
    finally { if(state.startSequence===sequence){state.starting = false; controls();} }
  }
  async function saveContact(){
    if(!visible()||!state.session||replyContact.hidden||state.contactSaving)return;
    const address=replyEmail.value.trim();if(!validEmail(address)){notice(text.invalidEmail,true);replyEmail.focus();return;}
    const sequence=state.sequence;state.contactSaving=true;state.contactSequence=sequence;controls();
    try{const result=await request('contact',{token:state.session.token,email:address},sequence);settings(result);if(!state.contact?.email)throw Error('Contato sem confirmação.');notice(text.emailSaved);}
    catch(error){if(current(sequence)){if(error.code==='identity_expired')await refreshIdentity(sequence);else if([401,403,404].includes(error.status))endSession(text.expiredChat);else notice(text.emailError,true);}}
    finally{if(state.contactSequence===sequence){state.contactSaving=false;controls();}}
  }
  async function saveFeedback(rating){
    if(!visible()||!state.session||feedback.hidden||state.feedbackSaving)return;
    const sequence=state.sequence;state.feedbackSaving=true;state.feedbackSequence=sequence;controls();
    try{const result=await request('feedback',{token:state.session.token,rating},sequence);settings(result);state.feedback=rating;supportState();notice(text.feedbackSaved);}
    catch(error){if(current(sequence)){if(error.code==='identity_expired')await refreshIdentity(sequence);else if([401,403,404].includes(error.status))endSession(text.expiredChat);else notice(text.feedbackError,true);}}
    finally{if(state.feedbackSequence===sequence){state.feedbackSaving=false;controls();}}
  }
  async function loadConfig(){
    if(state.destroyed||state.configLoaded||state.configLoading)return;
    state.configLoading=true;
    try{const result=await request('config',{},state.sequence,{publicRequest:true});settings(result);state.configLoaded=true;}
    catch{/* Optional public configuration never replaces the existing visitor flow with an error. */}
    finally{state.configLoading=false;}
  }
  async function sendMessage() {
    if (!visible() || !state.session || state.sending || recorder.busy) return;
    if (state.session.expiresAt <= Date.now()) { endSession(text.expiredDraft); return; }
    if (!state.pending) {
      const content=textarea.value.trim(),selected=state.selected;
      try{assertChannelText(content,state.capabilities,{attachment:Boolean(selected),audio:selected?.metadata.kind==='audio',locale:language});if(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(content))throw Error();if(selected)widgetFile(selected.file,state.capabilities,selected.metadata.voice,undefined,language);}catch{notice(selected?text.invalidCaption(state.capabilities.captionMaxLength):text.invalidText,true);return;}
      const metadata={clientMessageId:view.crypto.randomUUID(),text:content,...(selected?{name:selected.metadata.name,mime:selected.metadata.mime,voice:selected.metadata.voice}:{})};
      try{state.pending=Object.freeze(selected?{...metadata,body:mediaEnvelope(selected.file,metadata,BlobType)}:metadata);}catch{notice(text.prepareError,true);return;}
    }
    const sequence = state.sequence, pending = state.pending; state.sending = true; controls(); notice(text.sendingMessage);
    try {
      const result=pending.body?await request('media',pending.body,sequence,{binary:true}):await request('messages',{token:state.session.token,...pending},sequence);
      if (!messageId(result.messageId)) throw Error('Recibo do widget inválido.');
      settings(result);
      if(state.pending===pending){state.pending=null;revoke(state.selected);state.selected=null;fileInput.value='';renderSelection();textarea.value='';}
      notice(result.replayed ? text.replayed : text.received); void poll();
    } catch (error) {
      if (current(sequence)) {
        if(error.code==='identity_expired'){if(await refreshIdentity(sequence))notice(text.uncertainSend,true);}
        else if ([401, 403, 404].includes(error.status)) endSession(text.expiredSend);
        else if ([400,413].includes(error.status)) { state.pending = null; notice(text.invalidMessage, true); }
        else notice(error.status === 429 ? text.sendLimit : text.uncertainSend, true);
      }
    } finally { state.sending = false; controls(); }
  }
  function open() {
    if(!state.destroyed&&(host.isConnected===false||host.dataset.eloziWidget!==context)){destroy();return;}
    if (state.destroyed || state.opened) return;
    state.opened = true; state.sequence++; launcher.hidden = true; panel.hidden = false; launcher.setAttribute('aria-expanded', 'true');
    void loadConfig();
    if (state.session && state.session.expiresAt <= Date.now()) endSession(text.expired);
    if (state.pending) notice(text.uncertainSend, true);
    renderSelection();controls();
    (state.session ? textarea : name).focus(); if(!state.session)void identifyOnOpen(state.sequence);void poll();
  }
  function close(returnFocus = true) {
    if (!state.opened) return;
    state.opened=false;state.sequence++;state.identityOwner=null;state.identityLoading=false;state.startSequence=null;state.starting=false;state.refreshSequence=null;state.identityRefreshing=false;state.contactSequence=null;state.contactSaving=false;state.feedbackSequence=null;state.feedbackSaving=false;stopPolling();for(const entry of controllers)if(entry.kind!=='config'){entry.controller.abort();view.clearTimeout(entry.timer);}releaseMedia();
    launcher.hidden = false; panel.hidden = true; launcher.setAttribute('aria-expanded', 'false'); if (returnFocus) launcher.focus();
  }
  function visibility(){if(doc.visibilityState==='hidden'){stopPolling();recorder.reset();}else if(state.opened)void poll();}
  function destroy() {
    const logoutToken=state.contact?.verified?state.session?.token:null;
    close(false);state.destroyed=true;state.sequence++;for(const entry of controllers){entry.controller.abort();view.clearTimeout(entry.timer);}state.session=null;state.contact=null;state.assistant=null;state.feedback=null;getIdentityToken=null;releaseMedia(true);state.seen.clear();name.value=email.value=replyEmail.value=textarea.value='';timeline.replaceChildren();removalObserver?.disconnect();
    doc.removeEventListener('visibilitychange', visibility); host.remove(); if (pageMounts.get(context)?.host === host) pageMounts.delete(context);
    if(logoutToken)try{const signal=(view.AbortSignal||globalThis.AbortSignal)?.timeout?.(requestTimeoutMs);Promise.resolve(fetchImpl(`${endpoint}/logout`,{method:'POST',mode:'cors',credentials:'omit',redirect:'error',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:logoutToken}),keepalive:true,...(signal?{signal}:{})})).catch(()=>{});}catch{}
  }
  launcher.addEventListener('click', open); closeButton.addEventListener('click', close);
  attachments.addEventListener('click',()=>{if(!attachments.disabled)fileInput.click?.();});
  fileInput.addEventListener('change',()=>{if(!fileInput.disabled&&fileInput.files?.length>1)notice(text.singleFile,true);else if(!fileInput.disabled&&fileInput.files?.[0])selectFile(fileInput.files[0]);fileInput.value='';});
  voiceButton.addEventListener('click',()=>{if(!voiceButton.disabled)void recorder.start();});stopVoice.addEventListener('click',()=>recorder.stop());cancelVoice.addEventListener('click',()=>recorder.reset());
  intro.addEventListener('submit', async event => { event.preventDefault(); await start(); });
  replyContact.addEventListener('submit',async event=>{event.preventDefault();await saveContact();});
  useful.addEventListener('click',()=>saveFeedback('useful'));notUseful.addEventListener('click',()=>saveFeedback('not_useful'));
  composer.addEventListener('submit', async event => { event.preventDefault(); await sendMessage(); });
  textarea.addEventListener('keydown', async event => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.isComposing && !event.defaultPrevented) { event.preventDefault(); await sendMessage(); } });
  root.addEventListener('keydown', event => { if (event.key === 'Escape' && state.opened && !event.isComposing && !event.defaultPrevented) { event.preventDefault(); event.stopPropagation(); close(); } });
  doc.addEventListener('visibilitychange', visibility);
  if (view.MutationObserver) { removalObserver = new view.MutationObserver(() => { if (host.isConnected === false || host.dataset.eloziWidget !== context) destroy(); }); removalObserver.observe(doc.body, { childList: true });removalObserver.observe(host,{attributes:true,attributeFilter:['data-elozi-widget']}); }
  const widget = { host, open, close, destroy }; pageMounts.set(context, widget);void loadConfig();return widget;
}

if (typeof document !== 'undefined') {
  for (const script of document.querySelectorAll('script[data-tenant-id][data-channel-id]')) {
    if (new URL(script.src, document.baseURI).href !== import.meta.url || script.dataset.eloziMounted === 'true') continue;
    try {
      const origin = new URL(script.src, document.baseURI).origin, tenantId = script.dataset.tenantId, channelId = script.dataset.channelId;
      const locale = script.dataset.locale ?? script.dataset.language;
      createWebchatWidget({ apiOrigin: origin, tenantId, channelId, nonce: script.nonce || '', ...(locale === undefined ? {} : { locale }) });
      script.dataset.eloziMounted = 'true';
    } catch { /* Invalid or incomplete embeds remain inactive. */ }
  }
}
