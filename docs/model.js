export const KEY='team-guzzetta-insights-v1';
export const METRICS=[{key:'contacts',label:'Nuovi contatti',short:'Contatti',unit:'count'},{key:'appointments',label:'Appuntamenti svolti',short:'Appuntamenti',unit:'count'},{key:'valuations',label:'Valutazioni effettuate',short:'Valutazioni',unit:'count'},{key:'mandates',label:'Incarichi acquisiti',short:'Incarichi',unit:'count'},{key:'offers',label:'Proposte ricevute',short:'Proposte',unit:'count'},{key:'sales',label:'Vendite concluse',short:'Vendite',unit:'count'},{key:'revenue',label:'Provvigioni lorde incassate (€)',short:'Provvigioni lorde',unit:'money'},{key:'expenses',label:'Altre spese pagate (€)',short:'Altre spese',unit:'money'}];
export const defaults={contacts:80,appointments:24,valuations:12,mandates:6,offers:4,sales:2,revenue:12000};
export const emptyTotals=()=>Object.fromEntries(METRICS.map(m=>[m.key,0]));
export function localDate(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function isDate(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T12:00:00');return Number.isFinite(d.getTime())&&localDate(d)===s;}
export function previousMonth(month){const [y,m]=month.split('-').map(Number);return localDate(new Date(y,m-2,1)).slice(0,7);}
export function totals(records,month){return records.filter(r=>r.date.startsWith(month)).reduce((a,r)=>{for(const m of METRICS)a[m.key]+=r[m.key];return a},emptyTotals());}
export function change(current,previous){return previous===0?null:(current-previous)/previous*100;}
export function validate(data){
 if(!data||data.version!==1||!Array.isArray(data.records)||!data.goals||Array.isArray(data.goals)||typeof data.goals!=='object')throw Error('Backup non valido.');
 if(new Set(data.records.map(x=>x?.id)).size!==data.records.length)throw Error('Registrazioni duplicate.');
 for(const r of data.records){if(!r||typeof r.id!=='string'||!isDate(r.date)||typeof r.notes!=='string'||r.notes.length>5000||!METRICS.every(m=>typeof r[m.key]==='number'&&Number.isFinite(r[m.key])&&r[m.key]>=0&&(m.unit==='money'||Number.isSafeInteger(r[m.key]))))throw Error('Registrazione non valida.');}
 for(const [month,g] of Object.entries(data.goals)){if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)||!g||!Object.keys(defaults).every(k=>typeof g[k]==='number'&&Number.isFinite(g[k])&&g[k]>=0&&(k==='revenue'||Number.isSafeInteger(g[k]))))throw Error('Obiettivi non validi.');}
 if(data.expenseEntries!==undefined&&(!Array.isArray(data.expenseEntries)||new Set(data.expenseEntries.map(e=>e?.id)).size!==data.expenseEntries.length||!data.expenseEntries.every(validExpense)))throw Error('Registro spese non valido.');
 if(!validNativeBusiness(data))throw Error('Anagrafiche, vendite o provvigioni non valide.');
 return data;
}
export function plan(records,goals,month,now=new Date()){
 const t=totals(records,month),g=goals[month];if(!g)return [];
 const [y,m]=month.split('-').map(Number);const days=new Date(y,m,0).getDate();const current=localDate(now).slice(0,7);const elapsed=month<current?days:month===current?now.getDate():0;const remaining=month<current?0:month===current?days-now.getDate()+1:days;
 return METRICS.filter(x=>x.key!=='expenses'&&g[x.key]>0).map(metric=>{const actual=t[metric.key],target=g[metric.key],gap=Math.max(0,target-actual),progress=actual/target,expected=elapsed/days;return {key:metric.key,label:metric.short,unit:metric.unit,actual,target,gap,progress,remaining,pace:remaining?gap/remaining:null,state:gap===0?'done':remaining===0?'closed':progress<expected?'behind':'track'};}).sort((a,b)=>({behind:0,closed:1,track:2,done:3}[a.state]-{behind:0,closed:1,track:2,done:3}[b.state])||a.progress-b.progress);
}
export function sample(now=new Date()){
 const month=localDate(now).slice(0,7),prev=previousMonth(month),records=[];
 for(const [offset,prefix] of [[1,prev],[0,month]])for(let i=1;i<=(offset?28:now.getDate());i+=3){records.push({id:`example-${prefix}-${i}`,date:`${prefix}-${String(i).padStart(2,'0')}`,contacts:5+i%4,appointments:2+i%2,valuations:i%2,mandates:i%3===1?1:0,offers:i%4===1?1:0,sales:i%9===1?1:0,revenue:i%9===1?4500:0,expenses:160+i*7,notes:'Dati dimostrativi'});}
 const clients=[{id:'demo-client-1',firstName:'Giulia',lastName:'Bianchi',address:'Via Esempio 10',city:'Palermo',postalCode:'90100',province:'PA',phone:'000 0000000',email:'giulia@example.com',source:'Social',sourceDetails:'Instagram · esempio',notes:'Anagrafica dimostrativa',isDemo:true},{id:'demo-client-2',firstName:'Marco',lastName:'Rossi',address:'Via Esempio 20',city:'Palermo',postalCode:'90100',province:'PA',phone:'000 0000000',email:'marco@example.com',source:'Conoscenze',sourceDetails:'Segnalazione · esempio',notes:'Anagrafica dimostrativa',isDemo:true}];
 const cashEntries=records.filter(r=>r.revenue>0).map((r,i)=>({id:'demo-payment-'+r.id,type:'income',date:r.date,description:'Provvigione dimostrativa',amount:r.revenue,clientId:clients[i%2].id,dealId:'',category:'Altro',frequency:'Una tantum',isDemo:true}));
 records.forEach(r=>r.revenue=0);
 return {version:1,demo:true,records,clients,deals:[],cashEntries,expenseEntries:[{id:'example-expense-1',date:month+'-01',description:'Canone ufficio',amount:850,category:'Affitto e utenze',frequency:'Mensile'},{id:'example-expense-2',date:month+'-01',description:'Abbonamento gestionale',amount:240,category:'Software e servizi',frequency:'Annuale'}],goals:{[month]:{...defaults},[prev]:{...defaults}}};
}

export const EXPENSE_CATEGORIES=['Affitto e utenze','Pubblicità e portali','Personale e collaboratori','Software e servizi','Trasporti e trasferte','Consulenze professionali','Imposte e oneri','Formazione','Altro'];
export const EXPENSE_FREQUENCIES=['Una tantum','Giornaliera','Mensile','Annuale'];
const cents=value=>Math.round(value*100);
export function commissionSplit(gross){
 if(!Number.isFinite(gross)||gross<0||!Number.isSafeInteger(cents(gross)))throw Error('Provvigione lorda non valida.');
 const g=cents(gross),italia=Math.round(g*10/100),after=g-italia,platinum=Math.round(after*15/100);
 return {gross:g/100,italiaFee:italia/100,afterItalia:after/100,platinumFee:platinum/100,netRevenue:(after-platinum)/100};
}
export function sumCommissionSplits(amounts){
 const result={gross:0,italiaFee:0,afterItalia:0,platinumFee:0,netRevenue:0};
 for(const value of amounts){const split=commissionSplit(value);for(const key of Object.keys(result))result[key]+=cents(split[key]);}
 for(const key of Object.keys(result))result[key]/=100;return result;
}
export function financialSummary(records,expenses=[],prefix){
 const selected=records.filter(r=>r.date.startsWith(prefix)),selectedExpenses=expenses.filter(e=>e.date.startsWith(prefix));
 const split=sumCommissionSplits(selected.map(r=>r.revenue)),legacyCents=selected.reduce((n,r)=>n+cents(r.expenses),0),expenseCents=legacyCents+selectedExpenses.reduce((n,e)=>n+cents(e.amount),0),marginCents=cents(split.netRevenue)-expenseCents;
 return {revenue:split.gross,...split,expenses:expenseCents/100,otherExpenses:expenseCents/100,totalDeductions:(cents(split.italiaFee)+cents(split.platinumFee)+expenseCents)/100,margin:marginCents/100,marginPercent:split.gross===0?null:marginCents/cents(split.gross)*100,legacyExpenses:legacyCents/100,entries:selected.length+selectedExpenses.length,categories:[...EXPENSE_CATEGORIES.map(category=>({category,amount:selectedExpenses.filter(e=>e.category===category).reduce((n,e)=>n+cents(e.amount),0)/100})),{category:'Spese da registro risultati',amount:legacyCents/100}].filter(x=>x.amount>0)};
}

export function financialPeriods(records,expenses,mode,period){
 let prefixes;
 if(mode==='year'){prefixes=Array.from({length:12},(_,i)=>`${period}-${String(i+1).padStart(2,'0')}`)}
 else if(mode==='month'){const [y,m]=period.split('-').map(Number);prefixes=Array.from({length:new Date(y,m,0).getDate()},(_,i)=>`${period}-${String(i+1).padStart(2,'0')}`)}
 else prefixes=[period];
 return prefixes.map(prefix=>({period:prefix,...financialSummary(records,expenses,prefix)}));
}
export function validExpense(e){return !!e&&typeof e.id==='string'&&isDate(e.date)&&typeof e.description==='string'&&e.description.trim().length>0&&e.description.length<=250&&typeof e.amount==='number'&&Number.isFinite(e.amount)&&e.amount>0&&Number.isSafeInteger(Math.round(e.amount*100))&&EXPENSE_CATEGORIES.includes(e.category)&&EXPENSE_FREQUENCIES.includes(e.frequency);}

export const CRM_KEY='team-guzzetta-crm-v1';
export function projectCRM(crm){
 if(!crm||crm.version!==1||!Array.isArray(crm.clients))throw Error('Archivio gestionale non valido.');
 const deals=crm.deals||[],cash=crm.cashEntries||[];
 if(!Array.isArray(deals)||!Array.isArray(cash)||new Set(deals.map(d=>d?.id)).size!==deals.length||new Set(cash.map(c=>c?.id)).size!==cash.length)throw Error('Movimenti gestionali duplicati o non validi.');
 if(!deals.every(d=>d&&typeof d.id==='string'&&isDate(d.date)&&typeof d.title==='string'&&['In trattativa','Conclusa','Annullata'].includes(d.status)))throw Error('Vendite gestionali non valide.');
 if(!cash.every(c=>c&&typeof c.id==='string'&&isDate(c.date)&&['income','expense'].includes(c.type)&&Number.isFinite(c.amount)&&c.amount>0&&Number.isSafeInteger(Math.round(c.amount*100))&&typeof c.description==='string'&&typeof c.dealId==='string'&&(!c.dealId||deals.some(d=>d.id===c.dealId))&&EXPENSE_CATEGORIES.includes(c.category)&&EXPENSE_FREQUENCIES.includes(c.frequency)))throw Error('Pagamenti gestionali non validi.');
 const records=deals.filter(d=>d.status==='Conclusa').map(d=>({...emptyTotals(),id:'crm:sale:'+d.id,date:d.date,sales:1,notes:'Vendita dal gestionale: '+d.title,source:'crm'}));
 for(const c of cash.filter(c=>c.type==='income'))records.push({...emptyTotals(),id:'crm:cash:'+c.id,date:c.date,revenue:c.amount,notes:'Incasso dal gestionale: '+c.description,source:'crm'});
 const expenseEntries=cash.filter(c=>c.type==='expense').map(c=>({id:'crm:cash:'+c.id,date:c.date,amount:c.amount,description:c.description,category:c.category,frequency:c.frequency,source:'crm'}));
 return {records,expenseEntries,deals:deals.filter(d=>d.status==='Conclusa').length,movements:cash.length};
}
export function manualOnly(state){return {...state,records:state.records.filter(r=>!['crm','business'].includes(r.source)),expenseEntries:(state.expenseEntries||[]).filter(e=>!['crm','business'].includes(e.source))}}
export function withCRM(manual,crm){const source=projectCRM(crm),base=manualOnly(manual);return {...base,records:[...base.records,...source.records],expenseEntries:[...base.expenseEntries,...source.expenseEntries]};}

export const CLIENT_SOURCES=['Social','Conoscenze','Capitale sociale','Immobili','Altro'];
export function clientName(c){return c?[c.firstName,c.lastName].filter(Boolean).join(' '):'Cliente da associare'}
export function validClient(c){
 if(!c||typeof c.id!=='string'||!['firstName','lastName','address','city','postalCode','province','phone','email','source','sourceDetails','notes'].every(k=>typeof c[k]==='string')||!c.firstName.trim())return false;
 if(c.legacyIncomplete===true)return c.source===''||CLIENT_SOURCES.includes(c.source);
 return ['firstName','lastName','address','phone','email'].every(k=>c[k].trim().length>0)&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)&&CLIENT_SOURCES.includes(c.source);
}
export function validNativeBusiness(data){
 const clients=data.clients??[],deals=data.deals??[],cash=data.cashEntries??[];
 if(!Array.isArray(clients)||!Array.isArray(deals)||!Array.isArray(cash)||!clients.every(validClient))return false;
 if([clients,deals,cash].some(list=>new Set(list.map(x=>x?.id)).size!==list.length))return false;
 const hasClient=id=>id===''||clients.some(c=>c.id===id);
 return deals.every(d=>d&&typeof d.id==='string'&&typeof d.title==='string'&&d.title.trim()&&typeof d.clientId==='string'&&hasClient(d.clientId)&&isDate(d.date)&&['In trattativa','Conclusa','Annullata'].includes(d.status)&&Number.isFinite(d.commission)&&d.commission>=0)&&cash.every(c=>c&&typeof c.id==='string'&&isDate(c.date)&&['income','expense'].includes(c.type)&&Number.isFinite(c.amount)&&c.amount>0&&Number.isSafeInteger(Math.round(c.amount*100))&&typeof c.description==='string'&&c.description.trim()&&c.description.length<=250&&typeof c.clientId==='string'&&hasClient(c.clientId)&&(c.type==='expense'||c.clientId!==''||c.legacyUnassigned===true)&&typeof c.dealId==='string'&&(!c.dealId||deals.some(d=>d.id===c.dealId&&(!d.clientId||!c.clientId||d.clientId===c.clientId)))&&EXPENSE_CATEGORIES.includes(c.category)&&EXPENSE_FREQUENCIES.includes(c.frequency));
}
export function withBusiness(raw){
 const base=manualOnly(raw);if(!validNativeBusiness(base))throw Error('Anagrafiche o movimenti non validi.');
 const records=(base.deals||[]).filter(d=>d.status==='Conclusa').map(d=>({...emptyTotals(),id:'business:sale:'+d.id,date:d.date,sales:1,notes:'Vendita: '+d.title,source:'business'}));
 for(const c of(base.cashEntries||[]).filter(c=>c.type==='income'))records.push({...emptyTotals(),id:'business:cash:'+c.id,date:c.date,revenue:c.amount,notes:'Provvigione: '+c.description,source:'business'});
 const expenses=(base.cashEntries||[]).filter(c=>c.type==='expense').map(c=>({id:'business:cash:'+c.id,date:c.date,amount:c.amount,description:c.description,category:c.category,frequency:c.frequency,source:'business'}));
 return {...base,records:[...base.records,...records],expenseEntries:[...base.expenseEntries,...expenses]};
}
export function revenueAttribution(raw,prefix){
 const payments=(raw.cashEntries||[]).filter(c=>c.type==='income'&&c.date.startsWith(prefix)),clients=raw.clients||[];
 const breakdown=list=>sumCommissionSplits(list.map(p=>p.amount));
 const byClient=[...clients.map(c=>{const paid=payments.filter(p=>p.clientId===c.id),split=breakdown(paid);return {clientId:c.id,name:clientName(c),source:c.source||'Da completare',sourceDetails:c.sourceDetails,amount:split.gross,...split,count:paid.length}}),(()=>{const paid=payments.filter(p=>!p.clientId),split=breakdown(paid);return {clientId:'',name:'Cliente da associare',source:'Da completare',sourceDetails:'',amount:split.gross,...split,count:paid.length}})()].filter(c=>c.count>0);
 const historical=manualOnly(raw).records.filter(r=>r.date.startsWith(prefix)),unattributedBreakdown=sumCommissionSplits(historical.map(r=>r.revenue));
 const aggregate=rows=>{const result={gross:0,italiaFee:0,afterItalia:0,platinumFee:0,netRevenue:0};for(const c of rows)for(const k of Object.keys(result))result[k]+=cents(c[k]);for(const k of Object.keys(result))result[k]/=100;return result;};
 const bySource=[...CLIENT_SOURCES,'Da completare'].map(source=>{const split=aggregate(byClient.filter(c=>c.source===source));return {source,amount:split.gross,...split}}).filter(s=>s.amount>0);
 if(unattributedBreakdown.gross>0)bySource.push({source:'Incassi storici senza cliente',amount:unattributedBreakdown.gross,...unattributedBreakdown});
 const totalBreakdown=aggregate([...byClient,unattributedBreakdown]);
 return {byClient,bySource,unattributed:unattributedBreakdown.gross,unattributedBreakdown,total:totalBreakdown.gross,netTotal:totalBreakdown.netRevenue,totalBreakdown};
}

export function migrateLegacyCRM(raw,crm){
 projectCRM(crm);const next=manualOnly(structuredClone(raw));next.clients=next.clients||[];next.deals=next.deals||[];next.cashEntries=next.cashEntries||[];
 for(const c of crm.clients){const id='legacy:crm:'+c.id;if(!next.clients.some(x=>x.id===id))next.clients.push({id,firstName:String(c.name||'Cliente importato'),lastName:'',address:'',city:String(c.city||''),postalCode:'',province:'',phone:String(c.phone||''),email:String(c.email||''),source:'',sourceDetails:'',notes:String(c.notes||''),legacyIncomplete:true});}
 for(const d of crm.deals||[]){const id='legacy:crm:'+d.id;if(!next.deals.some(x=>x.id===id))next.deals.push({id,title:d.title,clientId:d.clientId?'legacy:crm:'+d.clientId:'',date:d.date,status:d.status,commission:Number(d.commission)||0});}
 for(const c of crm.cashEntries||[]){const id='legacy:crm:'+c.id,deal=next.deals.find(d=>d.id==='legacy:crm:'+c.dealId),clientId=deal?.clientId||'';if(!next.cashEntries.some(x=>x.id===id))next.cashEntries.push({...c,id,dealId:deal?.id||'',clientId,legacyUnassigned:!clientId});}
 next.legacyImported=true;if(!validNativeBusiness(next))throw Error('Dati precedenti non importabili: nessun archivio modificato.');return next;
}
