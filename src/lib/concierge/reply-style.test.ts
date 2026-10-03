import assert from "node:assert/strict";
import test from "node:test";
import {parseAssistantEnvelope,buildMessages} from "./concierge";

test("formatted JSON reply preserves paragraphs, emoji and grounded briefing",()=>{
 const content="💡 Podemos começar pelo resultado.\n\n**Primeiro escopo**\n- Apresentar seus serviços.\n- Receber pedidos.\n\nQual é a prioridade?";
 const quote="Quero apresentar serviços e receber pedidos.";
 const wire=JSON.stringify({reply:content,handoff:"continue",brief:{goal:{action:"replace",value:quote},situation:{action:"keep"},desiredSolution:{action:"keep"},constraints:{action:"keep"},openQuestions:{action:"keep"}}});
 const result=parseAssistantEnvelope(wire,[{role:"user",content:quote}],undefined,"pt");
 assert.equal(result.reply,content);assert.equal(result.brief?.goal,quote);assert.equal(result.handoff,undefined);
});

test("the model response example is valid JSON in both languages",()=>{
 for(const locale of ["pt","en"] as const){const system=buildMessages(locale,[{role:"user",content:"hello"}])[0].content;const sample=system.match(/output exactly (.*?) as JSON/)![1];assert.equal(JSON.parse(sample).handoff,"continue");}
});
test("completed public reply survives a truncated metadata tail without a handoff",()=>{
 const reply="💡 A integração pode começar pelo envio.\n\nQuer comparar as opções?";
 const raw=JSON.stringify({reply,handoff:"offer_contact",brief:{goal:{action:"keep"}}}).slice(0,-1);
 const result=parseAssistantEnvelope(raw,[{role:"user",content:"Quero comparar integração de e-mail."}],undefined,"pt");assert.equal(result.reply,reply);assert.equal(result.handoff,undefined);assert.equal(result.brief,undefined);
 const invalid='{"reply":"broken '+String.fromCharCode(92)+'q", "handoff":"offer_contact"}';
 assert.match(parseAssistantEnvelope(invalid,[{role:"user",content:"hello"}],undefined,"en").reply,/couldn't organize/);
});

test("closing-brace repair preserves only visitor-grounded facts and never authorizes contact",()=>{
 const quote="Quero um site para minha consultoria.";
 const brief={goal:{action:"replace",value:quote},situation:{action:"replace",value:"Invented business context"},desiredSolution:{action:"keep"},constraints:{action:"keep"},openQuestions:{action:"keep"}};
 const wire=JSON.stringify({reply:"Podemos definir o escopo. 💡",handoff:"offer_contact",brief}).slice(0,-1);
 const parsed=parseAssistantEnvelope(wire,[{role:"user",content:quote}],undefined,"pt");
 assert.equal(parsed.brief?.goal,quote);assert.equal(parsed.brief?.situation,"");assert.equal(parsed.handoff,undefined);assert.equal(parsed.reply,"Podemos definir o escopo. 💡");
});
