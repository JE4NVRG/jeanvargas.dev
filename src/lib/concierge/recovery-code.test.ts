import {test} from "node:test";
import assert from "node:assert/strict";
import {ConciergeError,validatePayload,validateBriefContext} from "./concierge";
import {validateLead,LeadError} from "../leads/leads";

const code=`NORA-${"x".repeat(43)}`;
test("recovery credentials are rejected before reaching model history or contact records",()=>{
 assert.throws(()=>validatePayload({locale:"pt",messages:[{role:"user",content:`Meu código é ${code}`}]}),e=>e instanceof ConciergeError&&e.code==="recovery_code_in_chat");
 assert.throws(()=>validateBriefContext({goal:code,situation:"",desiredSolution:"",constraints:"",openQuestions:""}),e=>e instanceof ConciergeError&&e.code==="recovery_code_in_chat");
 assert.throws(()=>validateLead({requestId:"00000000-0000-4000-8000-000000000081",locale:"pt",name:"Ada QA",contactType:"whatsapp",contact:"+15550101555",summary:`Recuperar minha memória com ${code}`,sourcePath:"/pt",consent:true}),LeadError);
});
