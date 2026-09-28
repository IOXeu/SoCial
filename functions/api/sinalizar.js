/**
 * ============================================================================
 * 🛡️ SoCialBr — /functions/api/sinalizar.js (Cloudflare Pages Functions)
 * Sinalizador em Tempo Real integrado ao Firebase Cloud Messaging (FCM v1)
 * ============================================================================
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  // Cabeçalhos de segurança CORS para permitir a comunicação com o app
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  try {
    // 1. Captura o aviso do celular do remetente
    const body = await request.json();
    const { grupoId, tipoMidia } = body;

    if (!grupoId || !tipoMidia) {
      return new Response(JSON.stringify({ error: "Parâmetros ausentes." }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // 2. Verifica as credenciais secretas salvas no painel do Pages
    if (!env.FIREBASE_SERVICE_ACCOUNT) {
      throw new Error("Variável FIREBASE_SERVICE_ACCOUNT não encontrada no painel da Cloudflare.");
    }

    const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
    const projectId = serviceAccount.project_id;

    // 3. Gera o token OAuth2 em tempo real na memória
    const accessToken = await generateOAuth2Token(serviceAccount);

    // 4. Monta o pacote de alta prioridade para o Firebase acordar o celular de destino
    const fcmPayload = {
      message: {
        topic: `grupo_${grupoId}`,
        data: {
          alerta: "novo_arquivo_seguro",
          grupoId: String(grupoId),
          tipo: String(tipoMidia) // "foto" ou "audio"
        },
        android: { priority: "high" },
        apns: { headers: { "apns-priority": "10" } }
      }
    };

    // 5. Envia para a API oficial v1 da Google
    const fcmUrl = `https://googleapis.com{projectId}/messages:send`;
    const fcmResponse = await fetch(fcmUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(fcmPayload)
    });

    const fcmResult = await fcmResponse.json();

    if (!fcmResponse.ok) {
      return new Response(JSON.stringify({ error: "Erro no Google Firebase.", details: fcmResult }), {
        status: fcmResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ sinalizado: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Falha interna no Pages Functions.", motivo: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}

// Responde a requisições OPTIONS de verificação do navegador
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
  });
}

/**
 * Função utilitária interna para assinar o JWT OAuth2 da Google
 */
async function generateOAuth2Token(serviceAccount) {
  const encodeBase64Url = (str) => btoa(str).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const header = encodeBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;

  const payload = encodeBase64Url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: "https://googleapis.com",
    aud: serviceAccount.token_uri,
    iat: iat,
    exp: exp
  }));

  const message = `${header}.${payload}`;
  const encoder = new TextEncoder();
  const messageBuffer = encoder.encode(message);

  const pemBody = serviceAccount.private_key
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");

  const binaryKey = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, messageBuffer);
  const signature = encodeBase64Url(String.fromCharCode(...new Uint8Array(signatureBuffer)));
  
  const res = await fetch(serviceAccount.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${message}.${signature}`
  });

  const data = await res.json();
  return data.access_token;
}
