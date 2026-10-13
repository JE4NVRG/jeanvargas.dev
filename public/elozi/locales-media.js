import {registerTranslations, tForLocale} from './i18n.js';

// Shared client validation copy. Safe to load on a public visitor page.
export const mediaTranslations = Object.freeze({
  'O bot não tem permissão para enviar arquivos neste grupo.': 'The bot has no permission to send files in this group.',
  'Esta conexão ainda não permite enviar arquivos.': 'This connection does not support sending files yet.',
  'Esta conexão não permite enviar gravações de voz.': 'This connection does not support sending voice recordings.',
  'Este arquivo está vazio. Escolha outro.': 'This file is empty. Choose another.',
  'O arquivo ultrapassa o limite desta conexão.': "The file exceeds this connection's limit.",
  'Escolha uma gravação de áudio válida.': 'Choose a valid audio recording.',
  'Este formato de arquivo não é aceito pela conexão selecionada.': 'This file format is not supported by the selected connection.',
  'O bot não tem permissão para enviar este tipo de arquivo neste grupo.': 'The bot has no permission to send this file type in this group.',
  'Informe uma mensagem de texto.': 'Enter a text message.',
  'O bot não tem permissão para enviar texto neste grupo.': 'The bot has no permission to send text in this group.',
  'Envie este arquivo sem legenda nesta conexão.': 'Send this file without a caption on this connection.',
  'A mensagem pode ter até {0} caracteres.': 'The message can contain up to {0} characters.',
  'O texto ultrapassa o limite de bytes desta conexão.': "The text exceeds this connection's byte limit."
});

registerTranslations(mediaTranslations);
export const mediaText = (locale, source, parameters) => tForLocale(locale, source, parameters);
