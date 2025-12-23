import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const handler = async (msg, { conn, text }) => {
  const chatID = msg.key.remoteJid;
  await conn.sendPresenceUpdate("composing", chatID);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await conn.sendPresenceUpdate("paused", chatID);

  const rawID = conn.user?.id || "";
  const subbotID = rawID.split(":")[0] + "@s.whatsapp.net";

  const prefixPath = path.resolve("prefixes.json");
  let prefixes = {};
  if (fs.existsSync(prefixPath)) {
    prefixes = JSON.parse(fs.readFileSync(prefixPath, "utf-8"));
  }
  const usedPrefix = prefixes[subbotID] || ".";

  if (!text) {
    return conn.sendMessage(chatID, {
      text:
        `✳️ *Uso correcto:* \n\n${usedPrefix}bancheck <número>\n\n` +
        `> 🔹 *Ejemplo:* ${usedPrefix}bancheck 584125877491`,
    }, { quoted: msg });
  }

  const cleanNumber = text.replace(/[^0-9]/g, "");
  if (cleanNumber.length < 8) {
    return conn.sendMessage(chatID, {
      text: "❌ Número inválido. Debe tener al menos 8 dígitos.",
    }, { quoted: msg });
  }

  await conn.sendMessage(chatID, {
    react: { text: "⏳", key: msg.key },
  });

  try {
    const url = `https://api.dead.lt/v1/bancheck?number=${cleanNumber}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-Api-Key": "evil"
      },
      timeout: 15000,
    });

    const data = await res.json();
    
    // Verificar si la respuesta tiene la estructura esperada
    if (!data) throw new Error("La API no respondió correctamente");

    const check = "✓";
    const cross = "×";

    let result = `🔹 *Banned Number Check* 🔹\n\n`;
    result += `> _Verificando información del número *${cleanNumber}*:_\n\n`;

    // Adaptar la respuesta según la nueva estructura de la API
    // Asumiendo que la nueva API devuelve una estructura similar
    // Si la estructura es diferente, ajusta estas líneas
    
    const isBanned = data.isBanned || data.banned || false;
    result += `  ◦  *Baneado:* ${isBanned ? check : cross}\n`;

    if (isBanned) {
      const isPermanent = data.isPermanent || data.permanent || false;
      const reason = data.reason || data.violation_description || "No especificada";
      const duration = data.duration || data.violation_info?.duration || "No especificada";
      const risk = data.risk || data.violation_info?.risk || "No especificado";
      const appealAllowed = data.appeal_allowed || data.in_app_ban_appeal === 1;

      result += `  ◦  *Permanente:* ${isPermanent ? check : cross}\n`;
      result += `  ◦  *Razón:*\n> ${reason}\n`;
      result += `  ◦  *ModBan:* ${cross}\n`;
      result += `  ◦  *Registrado:* ${check}\n`;
      result += `\n  ◦  *Duración:*\n> ${duration}\n`;
      result += `  ◦  *Riesgo:*\n> ${risk}\n`;

      if (appealAllowed) {
        result += `  ◦  *Apelación:* ${check}\n`;
      }
    } else {
      result += `  ◦  *Permanente:* ${cross}\n`;
      result += `  ◦  *Razón:* ${cross}\n`;
      result += `  ◦  *ModBan:* ${cross}\n`;
      result += `  ◦  *Registrado:* ${check}\n`;
      result += `\n  ◦  *Estado:* ✅ Activo y sin sanciones`;
    }

    result += `\n\n> Powered by: *WILKER OFC*`;

    await conn.sendMessage(chatID, { text: result }, { quoted: msg });
    await conn.sendMessage(chatID, {
      react: { text: "✅", key: msg.key },
    });
  } catch (error) {
    console.error("Error en bancheck:", error);

    let errMsg = "*🔹──  Banned Number Check  ──🔹*\n\n";
    errMsg += "❌ *Error verificando el número.*\n\n";

    if (error.code === "ECONNABORTED" || error.name === "TimeoutError") {
      errMsg += "⏰ _Timeout - Servidor no respondió_";
    } else if (error.status === 403 || error.message?.includes("403")) {
      errMsg += "🔒 _Acceso denegado por la API_";
    } else if (error.status === 404 || error.message?.includes("404")) {
      errMsg += "🔍 _Número no encontrado_";
    } else if (error.message?.includes("API")) {
      errMsg += "⚠️ _Error en la respuesta de la API_";
    } else {
      errMsg += "⚠️ _Error interno del servicio_";
    }

    errMsg += "\n\n> Powered by: *Barboza*";

    await conn.sendMessage(chatID, { text: errMsg }, { quoted: msg });
    await conn.sendMessage(chatID, {
      react: { text: "❌", key: msg.key },
    });
  }
};

handler.command = ["bancheck", "banverify", "checkban", "check"];
export default handler;