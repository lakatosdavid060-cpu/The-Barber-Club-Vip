import { adminDb } from '@/lib/firebase-admin';
import { currentWeekId, hashCode, jsonError } from '@/lib/vip';
import { randomUUID } from 'node:crypto';

export async function POST(request: Request) {
 try {
  const body = await request.json(); const name = String(body.name || '').trim().replace(/\s+/g,' '); const code = String(body.code || '').trim().toUpperCase();
  if (name.length < 2 || name.length > 70 || !/^LUX-[A-F0-9]{4}-[A-F0-9]{4}$/.test(code)) return Response.json({error:'Add meg a neved és az érvényes VIP-kódot.'},{status:400});
  const db=adminDb(); const codeRef=db.ref(`luxuryVip/codes/${hashCode(code)}`); const redemptionId=randomUUID();
  const result=await codeRef.transaction(current=>{if(!current||current.status!=='unused')return;return {...current,status:'redeemed',redeemedAt:Date.now(),redemptionId,name};});
  if(!result.committed) return Response.json({error:'Ez a VIP-kód érvénytelen vagy már felhasználták.'},{status:409});
  const weekId=currentWeekId(); const weekRef=db.ref(`luxuryVip/weeks/${weekId}`); const entryId=randomUUID();
  const entryResult=await weekRef.transaction(current=>{current=current||{entries:{},draw:{status:'open'}};if(current.draw?.status!=='open')return;current.entries=current.entries||{};current.entries[entryId]={name,createdAt:Date.now(),redemptionId};return current;});
  if(!entryResult.committed){await codeRef.transaction(current=>current?.redemptionId===redemptionId?{...current,status:'unused',redeemedAt:null,redemptionId:null,name:null}:undefined);return Response.json({error:'A heti sorsolás már lezárult. Kérd a szalonban a kód cseréjét.'},{status:409});}
  await db.ref(`luxuryVip/guestIndex/${redemptionId}`).set({name,weekId,createdAt:Date.now()});
  return Response.json({ok:true,weekId});
 } catch(e){return jsonError(e);}
}
