import crypto from 'crypto';
const S=process.env.PRIMAL_HMAC_SECRET||'';
const F=process.env.FLOW_WEBHOOK_SECRET||'';
const K=process.env.RESEND_API_KEY||'';
export default async function handler(req,res){
    if(req.method!=='POST')return res.status(405).json({error:'POST only'});
    const h=req.headers['x-flow-secret'];
    if(h!==F)return res.status(401).json({error:'Unauthorized'});
    const b=req.body||{};
    const n=String(b.order_number||'').replace('#','');
    const t=Math.floor(new Date(b.order_created_at).getTime()/1000);
    if(!n||!t||!b.customer_email)return res.status(400).json({error:'missing',got:Object.keys(b)});
    const sig=crypto.createHmac('sha256',S).update(n+'|'+t).digest('hex');
    const url='https://primalgens.com/pages/primal-club-acceso-38755-aprobado?o='+n+'&t='+t+'&s='+sig;
    const fn=b.customer_first_name||'';
    const html='<div style="background:#050505;color:#f2f0eb;padding:40px;font-family:Arial;text-align:center;border-radius:12px;max-width:560px;margin:20px auto"><div style="color:#C8A96E;font-size:26px;letter-spacing:3px;font-weight:bold;margin-bottom:20px">ACCESO PRIMAL CLUB</div><p style="color:#a09d96">Hola '+fn+',</p><p style="color:#a09d96">Tu protocolo personalizado ya esta listo.</p><a href="'+url+'" style="display:inline-block;background:#C8A96E;color:#050505;padding:16px 40px;border-radius:10px;font-weight:bold;text-decoration:none;letter-spacing:2px;margin:20px 0">ACCEDER A MI PLAN</a><p style="color:#6b6862;font-size:11px">Valido 31 dias. Renueva con cada pago mensual.</p></div>';
    try{
        const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':'Bearer '+K,'Content-Type':'application/json'},body:JSON.stringify({from:'PRIMAL <help@primalgens.com>',to:b.customer_email,subject:'Tu acceso PRIMAL CLUB - Pedido #'+n,html:html})});
        const d=await r.json();
        if(!r.ok)return res.status(500).json({error:'resend',status:r.status,details:d});
        return res.status(200).json({success:true,email_id:d.id,sent_to:b.customer_email});
    }catch(e){
        return res.status(500).json({error:'catch',message:e.message});
    }
}
