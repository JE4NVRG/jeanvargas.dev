import { channelCapabilities, validateAttachmentSelection } from './channel-capabilities.js';

export const WEBCHAT_MEDIA_MAX_BYTES = 16 * 1024 * 1024;
const previewMimes = { image: new Set(['image/jpeg','image/png','image/gif','image/webp']), audio: new Set(['audio/ogg','audio/mpeg','audio/wav','audio/flac','audio/mp4','audio/webm']), video: new Set(['video/mp4','video/webm','video/quicktime']) };
const fail = message => { throw Error(message); };
export const mediaName = (value, fallback = 'Arquivo') => String(value || fallback).split(/[\\/]/).at(-1).replace(/[\u0000-\u001f\u007f<>:"|?*\u202a-\u202e\u2066-\u2069]/g, '').replace(/^\.+|[. ]+$/g, '').trim().slice(0,160) || fallback;
export const mediaSize = (bytes, locale = 'pt-BR') => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toLocaleString(locale,{maximumFractionDigits:1})} KB` : `${(bytes / 1048576).toLocaleString(locale,{maximumFractionDigits:1})} MB`;
export const previewKind = metadata => metadata.preview === true && previewMimes[metadata.kind]?.has(metadata.mime) ? metadata.kind : 'document';

export function visitorCapabilities(dto) {
  return channelCapabilities({ transport: 'elozi-webchat' }, dto || {});
}

export function widgetFile(file, capabilities, voice = false, fallbackName = voice ? 'Áudio gravado' : 'Arquivo', locale) {
  // Size/capability checks precede any byte read or local object URL creation.
  const selected = validateAttachmentSelection(file, capabilities, { voice, ...(locale === undefined ? {} : {locale}) });
  if (typeof file.slice !== 'function') fail('Escolha um arquivo válido.');
  return { ...selected, name: mediaName(file.name, fallbackName), voice: voice === true };
}

export function mediaEnvelope(file, metadata, BlobType = Blob) {
  if (!Number.isSafeInteger(file?.size) || file.size < 1 || file.size > WEBCHAT_MEDIA_MAX_BYTES) fail('O arquivo precisa ter até 16 MiB.');
  const json = new TextEncoder().encode(JSON.stringify(metadata));
  if (!json.length || json.length > 8192) fail('Os dados do arquivo ultrapassam o limite.');
  const prefix = new Uint8Array(4); new DataView(prefix.buffer).setUint32(0,json.length,false);
  return new BlobType([prefix,json,file],{type:'application/octet-stream'});
}

export function widgetAttachment(input, fallbackName = 'Arquivo') {
  if (!input || !/^[a-f0-9-]{36}$/i.test(input.id) || !['image','audio','video','document'].includes(input.kind)
      || typeof input.name !== 'string' || input.name.length > 160 || typeof input.mime !== 'string' || input.mime.length > 120
      || !Number.isSafeInteger(input.size) || input.size < 0 || !['ready','pending','unavailable'].includes(input.status) || typeof input.preview !== 'boolean'
      || input.voice !== undefined && typeof input.voice !== 'boolean'
      || Object.keys(input).some(key => !['id','kind','name','mime','size','status','preview','voice','reason'].includes(key))) fail('Arquivo do histórico inválido.');
  const metadata = { id: input.id, kind: input.kind, name: mediaName(input.name, fallbackName), mime: input.mime.split(';')[0].trim().toLowerCase(), size: input.size,
    status: input.status, preview: input.preview, voice: input.voice === true };
  if (metadata.size > WEBCHAT_MEDIA_MAX_BYTES || metadata.status === 'ready' && !metadata.size) { metadata.status = 'unavailable'; metadata.preview = false; }
  return metadata;
}

export async function privateMediaBlob(response, metadata, { BlobType = Blob, reauthorize = () => {} } = {}) {
  reauthorize();
  const declared = response.headers?.get?.('content-length'), mime = response.headers?.get?.('content-type')?.split(';')[0].trim().toLowerCase();
  if (metadata.size < 1 || metadata.size > WEBCHAT_MEDIA_MAX_BYTES || declared != null && (!/^\d+$/.test(declared) || Number(declared) !== metadata.size)
      || mime && !['application/octet-stream',metadata.mime].includes(mime)) fail('O arquivo recebido não corresponde ao histórico.');
  let blob;
  if (response.body?.getReader) {
    const reader = response.body.getReader(), chunks = []; let size = 0;
    try { for (;;) { const {done,value} = await reader.read(); reauthorize(); if (done) break; size += value.byteLength; if (size > metadata.size || size > WEBCHAT_MEDIA_MAX_BYTES) fail('O arquivo ultrapassa o limite.'); chunks.push(value); }
      blob = new BlobType(chunks,{type:previewKind(metadata) === 'document' ? 'application/octet-stream' : metadata.mime});
    } finally { try { await reader.cancel(); } catch { /* Release interrupted private download. */ } }
  } else { const received = await response.blob(); reauthorize(); blob = new BlobType([received],{type:previewKind(metadata) === 'document' ? 'application/octet-stream' : metadata.mime}); }
  reauthorize(); if (blob.size !== metadata.size || blob.size > WEBCHAT_MEDIA_MAX_BYTES) fail('O arquivo recebido não corresponde ao histórico.');
  return blob;
}

/** Same explicit permission/review lifecycle as the panel recorder, with injected window. */
export function createWebchatVoiceRecorder({ view, onFile = () => {}, onState = () => {}, onError = () => {}, messages = {} }) {
  const text = { fileName: 'Áudio', empty: 'A gravação ficou vazia. Grave novamente.', prepare: 'Não foi possível preparar a gravação.', timeout: 'O navegador não concluiu a gravação. Grave novamente.',
    finish: 'Não foi possível concluir a gravação.', unsupported: 'Este navegador não oferece gravação. Anexe um áudio.', tooLarge: 'A gravação ultrapassou 16 MiB. Grave um áudio menor.',
    record: 'Não foi possível gravar o áudio.', denied: 'O acesso ao microfone foi negado. Permita o microfone para gravar.', unavailable: 'Não foi possível acessar o microfone. Confira se ele está disponível.', ...messages };
  let active = null, generation = 0, state = 'idle', elapsedSeconds = 0;
  const supported = () => typeof view.MediaRecorder === 'function' && typeof view.navigator?.mediaDevices?.getUserMedia === 'function';
  const emit = () => onState({state,elapsedSeconds,maxSeconds:300});
  const current = session => active === session && session.generation === generation;
  const release = session => { for (const track of session.stream?.getTracks() || []) { try { track.stop(); } catch { /* Release every track. */ } } session.stream = null; };
  const timers = session => { for (const id of [session.tickTimer,session.limitTimer,session.stopTimer]) if (id !== undefined) view.clearTimeout(id); };
  function reset() { generation++; const prior=active; active=null; if(prior) { timers(prior); if(prior.recorder) { prior.recorder.ondataavailable=prior.recorder.onstop=prior.recorder.onerror=null; try { if(prior.recorder.state!=='inactive')prior.recorder.stop(); } catch {} } prior.chunks=[]; release(prior); } state='idle';elapsedSeconds=0;emit(); }
  const failure = message => { reset(); onError(message); };
  function finish(session) {
    if(!current(session))return;timers(session);release(session);const chunks=session.chunks;session.chunks=[];active=null;state='idle';elapsedSeconds=0;emit();
    if(!session.bytes){onError(text.empty);return;}
    const type=session.recorder.mimeType||session.mime||'audio/webm', extension=type.startsWith('audio/ogg')?'ogg':type.startsWith('audio/mp4')?'m4a':'webm';
    const file = typeof view.File==='function' ? new view.File(chunks,`${text.fileName}.${extension}`,{type}) : new view.Blob(chunks,{type});
    Promise.resolve().then(()=>{if(session.generation===generation)return onFile(file);}).catch(()=>{if(session.generation===generation)failure(text.prepare);});
  }
  function stop() { if(state==='requesting'){reset();return;}if(state!=='recording'||!active)return;const session=active;state='stopping';timers(session);emit();
    session.stopTimer=view.setTimeout(()=>{if(current(session))failure(text.timeout);},10000);
    try { session.recorder.stop(); } catch { failure(text.finish); } finally { release(session); }
  }
  async function start() {
    if(state!=='idle')return;if(!supported()){onError(text.unsupported);return;}
    const session={generation:++generation,chunks:[],bytes:0,stream:null};active=session;state='requesting';elapsedSeconds=0;emit();
    try { const stream=await view.navigator.mediaDevices.getUserMedia({audio:true});if(!current(session)){release({stream});return;}session.stream=stream;
      const Recorder=view.MediaRecorder;session.mime=typeof Recorder.isTypeSupported==='function'?['audio/webm;codecs=opus','audio/ogg;codecs=opus','audio/mp4'].find(mime=>Recorder.isTypeSupported(mime)):undefined;
      try{session.recorder=new Recorder(stream,session.mime?{mimeType:session.mime}:undefined);}catch{session.recorder=new Recorder(stream);}
      session.recorder.ondataavailable=event=>{if(!current(session)||!event.data?.size)return;session.bytes+=event.data.size;if(session.bytes>WEBCHAT_MEDIA_MAX_BYTES){failure(text.tooLarge);return;}session.chunks.push(event.data);};
      session.recorder.onstop=()=>finish(session);session.recorder.onerror=()=>{if(current(session))failure(text.record);};session.recorder.start(1000);if(!current(session))return;
      session.startedAt=Date.now();state='recording';const tick=()=>{if(!current(session)||state!=='recording')return;elapsedSeconds=Math.min(300,Math.floor((Date.now()-session.startedAt)/1000));emit();session.tickTimer=view.setTimeout(tick,1000);};session.tickTimer=view.setTimeout(tick,1000);session.limitTimer=view.setTimeout(stop,300000);emit();
    } catch(error) { if(current(session))failure(['NotAllowedError','PermissionDeniedError','SecurityError'].includes(error?.name)?text.denied:text.unavailable); }
  }
  return {start,stop,reset,get state(){return state;},get busy(){return state!=='idle';},get supported(){return supported();}};
}
