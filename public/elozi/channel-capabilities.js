import {tForLocale, normalizeLocale, getLocale} from './i18n.js';
import {mediaText} from './locales-media.js';

const LIMIT = 16 * 1024 * 1024;
const KINDS = ['image', 'audio', 'video', 'document'];
const PREVIEW_MIMES = new Set(['image/jpeg','image/png','image/gif','image/webp','audio/ogg','audio/mpeg','audio/wav','audio/flac','audio/mp4','audio/webm','video/mp4','video/webm','video/quicktime']);
const reject = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };
const mimeOf = value => String(value || 'application/octet-stream').split(';')[0].trim().toLowerCase();

/** Product controls are independent: receiving a photo does not enable uploads or voice. */
export function channelCapabilities(channel, mediaSettings = {}, availability) {
  const transport = channel?.transport, native = ['baileys','telegram-bot','telegram-user'].includes(transport), meta = ['meta-instagram','meta-messenger'].includes(transport);
  const webchat = transport === 'elozi-webchat' && mediaSettings.mediaSupported === true;
  const uploadKinds = native ? [...KINDS] : (transport === 'meta-messenger' || webchat) && mediaSettings.mediaSupported === true ? KINDS.filter(kind => mediaSettings.mediaKinds?.includes(kind)) : [];
  const uploadMimes = native || webchat && !Array.isArray(mediaSettings.mediaMimes) ? null : Array.isArray(mediaSettings.mediaMimes) ? [...new Set(mediaSettings.mediaMimes.map(mimeOf))] : [];
  return conversationCapabilities({ uploadKinds, uploadMimes, textSupported: true, maxMediaBytes: uploadKinds.length ? Math.min(LIMIT, Number.isSafeInteger(mediaSettings.mediaMaxBytes) && mediaSettings.mediaMaxBytes > 0 ? mediaSettings.mediaMaxBytes : LIMIT) : 0,
    captionMaxLength: native ? 1024 : webchat ? Math.min(1024, Number.isSafeInteger(mediaSettings.captionMaxLength) && mediaSettings.captionMaxLength >= 0 ? mediaSettings.captionMaxLength : 1024) : 0,
    audioCaptionSupported: ['telegram-bot','telegram-user'].includes(transport) || webchat, voice: native || webchat && uploadKinds.includes('audio') && mediaSettings.voiceSupported === true, avatar: native, quote: !meta, forward: transport!=='telegram-user'&&channel?.kind!=='telegram_user'&&(native || transport === 'elozi-webchat'),
    maxTextLength: meta ? 1000 : 4000, maxTextBytes: meta ? 4000 : null, unicodeLength: meta,
    aiAllowed:transport!=='telegram-user'&&channel?.kind!=='telegram_user',
    ...(transport==='telegram-user'||channel?.kind==='telegram_user'?{aiReason:'Conversas da conta Telegram pessoal estão disponíveis para atendimento humano. Uso por IA exige consentimento específico dos participantes.'}:{}) }, availability, transport);
}

/** Apply only the selected conversation's Telegram permissions, never channel-wide state. */
export function conversationCapabilities(capabilities, availability, transport) {
  const group = availability?.group;
  if (!['telegram-bot','telegram-user'].includes(transport) || !group) return capabilities;
  const permissionNames = ['text', 'photos', 'audios', 'documents', 'videos', 'voiceNotes'];
  const permissions = Object.fromEntries(permissionNames.map(name => [name, group.canSend === false ? false : typeof group.sendPermissions?.[name] === 'boolean' ? group.sendPermissions[name] : null]));
  const supported = { image: ['photos', 'documents'], audio: ['audios', 'voiceNotes', 'documents'], video: ['videos', 'documents'], document: ['documents'] };
  const uploadKinds = capabilities.uploadKinds.filter(kind => supported[kind]?.some(name => permissions[name] !== false));
  return { ...capabilities, textSupported: permissions.text !== false, uploadKinds, maxMediaBytes: uploadKinds.length ? capabilities.maxMediaBytes : 0,
    voice: capabilities.voice && permissions.voiceNotes !== false, telegramSendPermissions: permissions };
}

export function textLength(text, capabilities) { return capabilities?.unicodeLength ? [...String(text)].length : String(text).length; }

export function validateAttachmentSelection(file, capabilities, { voice = false, sizeUnknown = false, locale = getLocale() } = {}) {
  const i18nText = source => mediaText(locale, source);
  if (!capabilities?.uploadKinds?.length) reject(capabilities?.telegramSendPermissions ? i18nText('O bot não tem permissão para enviar arquivos neste grupo.') : i18nText('Esta conexão ainda não permite enviar arquivos.'), capabilities?.telegramSendPermissions ? 409 : 400);
  if (voice && capabilities.voice !== true) reject(i18nText('Esta conexão não permite enviar gravações de voz.'));
  if (!Number.isSafeInteger(file?.size) || file.size < 1) reject(i18nText('Este arquivo está vazio. Escolha outro.'));
  if (file.size > capabilities.maxMediaBytes) reject(i18nText('O arquivo ultrapassa o limite desta conexão.'), 413);
  const mime = mimeOf(file.type), kind = PREVIEW_MIMES.has(mime) ? mime.split('/')[0] : 'document';
  if (voice && kind !== 'audio') reject(i18nText('Escolha uma gravação de áudio válida.'));
  if (!capabilities.uploadKinds.includes(kind) || Array.isArray(capabilities.uploadMimes) && !capabilities.uploadMimes.includes(mime)) reject(i18nText('Este formato de arquivo não é aceito pela conexão selecionada.'), capabilities.telegramSendPermissions ? 409 : 400);
  if (capabilities.telegramSendPermissions) {
    const candidates = voice ? ['voiceNotes'] : kind === 'image' ? ['image/jpeg', 'image/png'].includes(mime) && sizeUnknown ? ['photos', 'documents'] : [['image/jpeg', 'image/png'].includes(mime) && file.size <= 10_000_000 ? 'photos' : 'documents']
      : kind === 'video' ? [mime === 'video/mp4' ? 'videos' : 'documents']
      : kind === 'audio' ? mime === 'audio/ogg' ? ['voiceNotes', 'documents'] : [['audio/mpeg', 'audio/mp4'].includes(mime) ? 'audios' : 'documents'] : ['documents'];
    if (candidates.every(name => capabilities.telegramSendPermissions[name] === false)) reject(i18nText('O bot não tem permissão para enviar este tipo de arquivo neste grupo.'), 409);
  }
  return { kind, mime };
}

export function assertChannelText(value, capabilities, { attachment = false, audio = false, locale = getLocale() } = {}) {
  const language = normalizeLocale(locale), i18nText = source => mediaText(language, source);
  if (typeof value !== 'string') reject(i18nText('Informe uma mensagem de texto.'));
  const text = value.trim(), limit = attachment ? capabilities.captionMaxLength : capabilities.maxTextLength;
  if (!attachment && capabilities.textSupported === false) reject(i18nText('O bot não tem permissão para enviar texto neste grupo.'), 409);
  if (attachment && text && (!limit || audio && !capabilities.audioCaptionSupported)) reject(i18nText('Envie este arquivo sem legenda nesta conexão.'));
  if (!attachment && !text || textLength(text, capabilities) > limit) reject(tForLocale(language, 'A mensagem pode ter até {0} caracteres.', {0:limit.toLocaleString(language)}));
  if (!attachment && capabilities.maxTextBytes && new TextEncoder().encode(text).byteLength > capabilities.maxTextBytes) reject(i18nText('O texto ultrapassa o limite de bytes desta conexão.'));
  return text;
}
