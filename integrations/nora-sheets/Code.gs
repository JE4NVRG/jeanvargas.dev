/* Owner setup: Script Properties NORA_SECRET (32+ characters) and NORA_SPREADSHEET_ID.
 * Deploy this file as a Web App executing as the owner, with anonymous access.
 * Put its /exec URL and a private secret-file path in the server's environment.
 * HMAC authorizes writes; doGet never exposes spreadsheet contents.
 */
var NORA_HEADERS = ["Nome", "WhatsApp", "Cadastro em", "Atualizado em", "Interesse", "Resumo da Nora", "Objetivo e escopo", "Restrições", "Dúvidas pendentes", "Próximo passo", "Etapa da conversa", "Atendimento", "Responsável", "Origem", "ID do contato", "Memória autorizada", "Contato autorizado", "Idioma"];
var NORA_KEYS = ["leadId", "createdAt", "updatedAt", "name", "whatsapp", "locale", "sourcePath", "intent", "summary", "goal", "situation", "desiredSolution", "constraints", "openQuestions", "nextStep", "stage", "memoryEnabled"];
var NORA_MAX_BYTES = 32768;
var NORA_LAST_ROW = 10004;
var NORA_WINDOW_MS = 300000;

function noraResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function noraReject() {
  return noraResponse({ ok: false, error: "request_rejected" });
}

function noraExactKeys(value, keys) {
  return value !== null && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === keys.length && Object.keys(value).every(function (key) { return keys.indexOf(key) !== -1; });
}

function noraIso(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return false;
  var date = new Date(value);
  return isFinite(date.getTime()) && date.toISOString() === value;
}

function noraConstantTime(expected, provided) {
  var difference = 0;
  for (var i = 0; i < 64; i++) difference |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  return difference === 0;
}

function noraValidLead(lead, timestamp) {
  var control = /[\u0000-\u001f\u007f-\u009f]/;
  if (!noraExactKeys(lead, NORA_KEYS) || typeof lead.leadId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(lead.leadId)) return false;
  if (!noraIso(lead.createdAt) || !noraIso(lead.updatedAt) || lead.createdAt > lead.updatedAt || Date.parse(lead.updatedAt) > Date.parse(timestamp) + NORA_WINDOW_MS) return false;
  if (typeof lead.name !== "string" || !lead.name.trim() || lead.name.length > 100 || control.test(lead.name)) return false;
  if (typeof lead.whatsapp !== "string" || (lead.whatsapp !== "" && !/^\+[1-9]\d{7,14}$/.test(lead.whatsapp))) return false;
  if (["pt", "en"].indexOf(lead.locale) === -1 || typeof lead.memoryEnabled !== "boolean") return false;
  if (typeof lead.sourcePath !== "string" || lead.sourcePath.length > 256 || !/^\/(pt|en)(?:\/[^?#\u0000-\u001f\u007f-\u009f]*)?$/.test(lead.sourcePath) || lead.sourcePath.indexOf("\\") !== -1) return false;
  if (["nora_demo", "assistant_project", "contact_request"].indexOf(lead.intent) === -1 || ["demo", "exploring", "contact_requested"].indexOf(lead.stage) === -1) return false;
  return ["summary", "goal", "situation", "desiredSolution", "constraints", "openQuestions", "nextStep"].every(function (key) {
    return typeof lead[key] === "string" && lead[key].length <= (key === "summary" ? 1500 : 500) && !control.test(lead[key].replace(/\n/g, ""));
  });
}

function noraCell(value) {
  return /^[\s\uFEFF]*[=+\-@]/.test(value) ? "'" + value : value;
}

function noraRow(lead) {
  var interests = { nora_demo: "Demonstração da Nora", assistant_project: "Projeto de assistente", contact_request: "Pedido de contato" };
  var stages = { demo: "Demonstração", exploring: "Em conversa", contact_requested: "Contato solicitado" };
  var scope = [["Objetivo", lead.goal], ["Contexto", lead.situation], ["Solução desejada", lead.desiredSolution]].filter(function (part) { return part[1]; }).map(function (part) { return part[0] + ": " + part[1]; }).join("\n");
  return [noraCell(lead.name), noraCell(lead.whatsapp), new Date(lead.createdAt), new Date(lead.updatedAt), interests[lead.intent], noraCell(lead.summary), noraCell(scope), noraCell(lead.constraints), noraCell(lead.openQuestions), noraCell(lead.nextStep), stages[lead.stage], "Novo", "", noraCell(lead.sourcePath), noraCell(lead.leadId), lead.memoryEnabled ? "Sim" : "Não", "Sim", lead.locale];
}

function noraSave(lead, spreadsheetId) {
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Contatos");
  if (!sheet || sheet.getMaxColumns() < NORA_HEADERS.length || sheet.getMaxRows() < 4) throw new Error("request_rejected");
  var headers = sheet.getRange(4, 1, 1, NORA_HEADERS.length).getValues()[0];
  if (headers.every(function (value) { return value === ""; }) && sheet.getLastRow() <= 4) sheet.getRange(4, 1, 1, NORA_HEADERS.length).setValues([NORA_HEADERS]);
  else if (headers.some(function (value, i) { return value !== NORA_HEADERS[i]; })) throw new Error("request_rejected");
  var available = Math.min(NORA_LAST_ROW, sheet.getMaxRows()) - 4;
  var ids = available > 0 ? sheet.getRange(5, 15, available, 1).getValues() : [];
  var found = [];
  ids.forEach(function (value, i) { if (value[0] === lead.leadId) found.push(i + 5); });
  if (found.length > 1) throw new Error("request_rejected");
  var row = found.length ? found[0] : Math.max(5, sheet.getLastRow() + 1);
  if (row > NORA_LAST_ROW) throw new Error("request_rejected");
  var values = noraRow(lead);
  if (found.length) {
    var existing = sheet.getRange(row, 1, 1, NORA_HEADERS.length).getValues()[0];
    var created = existing[2], updated = existing[3];
    if (!(created instanceof Date) || !(updated instanceof Date) || !isFinite(created.getTime()) || !isFinite(updated.getTime()) || created.toISOString() !== lead.createdAt) throw new Error("request_rejected");
    if (updated.getTime() >= Date.parse(lead.updatedAt)) return { ok: true, leadId: lead.leadId, updatedAt: updated.toISOString(), row: row };
    sheet.getRange(row, 2).setNumberFormat("@");
    sheet.getRange(row, 15).setNumberFormat("@");
    // Keep L/M untouched, including owner formulas. D commits the revision last.
    sheet.getRange(row, 1, 1, 3).setValues([values.slice(0, 3)]);
    sheet.getRange(row, 5, 1, 7).setValues([values.slice(4, 11)]);
    sheet.getRange(row, 14, 1, 5).setValues([values.slice(13, 18)]);
    sheet.getRange(row, 4).setValue(values[3]);
  } else {
    if (row > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), row - sheet.getMaxRows());
    sheet.getRange(row, 2).setNumberFormat("@");
    sheet.getRange(row, 15).setNumberFormat("@");
    sheet.getRange(row, 1, 1, NORA_HEADERS.length).setValues([values]);
  }
  SpreadsheetApp.flush();
  // Fit only the received contact; preserve the owner's column widths and manual fields.
  try {
    sheet.getRange(row, 1, 1, NORA_HEADERS.length).setWrap(true);
    sheet.autoResizeRows(row, 1);
  } catch (formatError) { /* A formatting failure must not reject a saved contact. */ }
  return { ok: true, leadId: lead.leadId, updatedAt: lead.updatedAt, row: row };
}

function doPost(event) {
  var lock;
  var acquired = false;
  try {
    if (!event || !event.postData || typeof event.postData.contents !== "string" || !/^application\/json(?:\s*;|$)/i.test(event.postData.type || "") || Number(event.contentLength) > NORA_MAX_BYTES) return noraReject();
    var body = event.postData.contents;
    if (body.length > NORA_MAX_BYTES || Utilities.newBlob(body).getBytes().length > NORA_MAX_BYTES) return noraReject();
    var envelope = JSON.parse(body);
    if (!noraExactKeys(envelope, ["timestamp", "payload", "signature"]) || !noraIso(envelope.timestamp) || Math.abs(Date.now() - Date.parse(envelope.timestamp)) > NORA_WINDOW_MS || typeof envelope.payload !== "string" || typeof envelope.signature !== "string" || !/^[0-9a-f]{64}$/.test(envelope.signature)) return noraReject();
    var properties = PropertiesService.getScriptProperties();
    var secret = properties.getProperty("NORA_SECRET");
    var spreadsheetId = properties.getProperty("NORA_SPREADSHEET_ID");
    if (typeof secret !== "string" || secret.length < 32 || secret.length > 4096 || /[\u0000-\u001f\u007f-\u009f]/.test(secret) || secret.trim() !== secret || typeof spreadsheetId !== "string" || !/^[A-Za-z0-9_-]{20,200}$/.test(spreadsheetId)) return noraReject();
    var digest = Utilities.computeHmacSha256Signature(envelope.timestamp + "\n" + envelope.payload, secret, Utilities.Charset.UTF_8).map(function (byte) { return ("0" + (byte & 255).toString(16)).slice(-2); }).join("");
    if (!noraConstantTime(digest, envelope.signature)) return noraReject();
    var lead = JSON.parse(envelope.payload);
    if (!noraValidLead(lead, envelope.timestamp)) return noraReject();
    lock = LockService.getScriptLock();
    acquired = lock.tryLock(3000);
    if (!acquired) return noraReject();
    return noraResponse(noraSave(lead, spreadsheetId));
  } catch (error) { return noraReject(); }
  finally { if (acquired) lock.releaseLock(); }
}

function doGet() {
  return noraReject();
}
