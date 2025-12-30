import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
let q = m.quoted ? m.quoted : m
if (!q.mimetype || (!q.mimetype.includes("audio") && !q.mimetype.includes("video"))) {
return m.reply("❀ Por favor, responde al audio del cual deseas buscar el título.")
}
let buffer = await q.download()
try {
await m.react('🕒')
let data = await whatmusic(buffer)
if (!data.length) {
await m.react('✖️')
return m.reply("✧ No se encontraron datos de la canción")
}
let cap = "*乂 ¡SHAZAM - MUSIC! 乂*\n\n"
for (let result of data) {
const enlaces = Array.isArray(result.url) ? result.url.filter(x => x) : []
cap += `✐ Título » ${result.title}\n`
cap += `✦ Artista » ${result.artist}\n`
cap += `ⴵ Duración » ${result.duration}\n`
cap += `🜸 Enlaces » ${enlaces.map(i => `\n${i}`).join("\n")}\n`
if (enlaces.length) cap += "••••••••••••••••••••••••••••••••••••••\n"
}
await conn.relayMessage(m.chat, {
extendedTextMessage: {
text: cap,
contextInfo: {
externalAdReply: {
title: '✧ Whats • Music ✧',
body: dev,
mediaType: 1,
previewType: 0,
renderLargerThumbnail: true,
thumbnail: await (await fetch('https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742781294508.jpeg')).buffer(),
sourceUrl: redes
}}}}, { quoted: m })
await m.react('✔️')
} catch (error) {
await m.react('✖️')
m.reply(`⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n` + error.message)
}}

handler.help = ["whatmusic"]
handler.tags = ["tools"]
handler.command = ["whatmusic", "shazam"]
handler.group = true

export default handler

async function whatmusic(buffer) {
const apiUrl = 'https://api-adonix.ultraplus.click/tools/whatmusic?apikey=WilkerKeydukz9l6871'
    
try {
const formData = new FormData()
const blob = new Blob([buffer], { type: 'audio/mpeg' })
formData.append('audio', blob, 'audio.mp3')

const response = await fetch(apiUrl, {
method: 'POST',
body: formData
})

if (!response.ok) {
throw new Error(`Error en la API: ${response.status}`)
}

const res = await response.json()

// Adaptar la respuesta de la nueva API al formato esperado
if (!res || !res.status || res.status !== true || !res.result) {
return []
}

const result = res.result
const musicData = []

if (result.title || result.artist) {
const enlaces = []
if (result.youtube && result.youtube.url) {
enlaces.push(result.youtube.url)
}
if (result.spotify && result.spotify.url) {
enlaces.push(result.spotify.url)
}
if (result.deezer && result.deezer.url) {
enlaces.push(result.deezer.url)
}

musicData.push({
title: result.title || "Desconocido",
artist: result.artist || "Desconocido",
duration: toTime(result.duration_ms || 0),
url: enlaces
})
}

return musicData

} catch (error) {
console.error('Error en whatmusic:', error)
return []
}
}

function toTime(ms) {
if (!ms || typeof ms !== "number") return "00:00"
let m = Math.floor(ms / 60000)
let s = Math.floor((ms % 60000) / 1000)
return [m, s].map(v => v.toString().padStart(2, "0")).join(":")
}