import yts from 'yt-search'
import fetch from 'node-fetch'

const handler = async (m, { conn, text, command }) => {
try {
if (!text) return conn.reply(m.chat, '❀ *Por favor, ingrese el título o enlace del video.*', m)

await m.react('🕒')

const videoMatch = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/))([a-zA-Z0-9_-]{11})/)
const query = videoMatch ? 'https://youtu.be/' + videoMatch[1] : text
const search = await yts(query)
const result = videoMatch ? search.videos.find(v => v.videoId === videoMatch[1]) || search.all[0] : search.all[0]

if (!result) throw '✰ *No se encontraron resultados.*'

const { title, thumbnail, timestamp, views, url, author, seconds } = result
if (seconds > 1800) throw '✰ *El contenido excede los 30 minutos.*'

const vistas = formatViews(views)
const info = `❀ *Título* » ${title}\n` +
             `❖ *Autor* » ${author.name}\n` +
             `❏ *Duración* » ${timestamp} (${vistas} vistas)\n` +
             `🜸 *Link* » ${url}`

await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: info }, { quoted: m })

const isAudio = ['play', 'yta', 'ytmp3', 'playaudio'].includes(command)
const downloadUrl = isAudio ? await getAud(url) : await getVid(url)

if (!downloadUrl) throw '✰ *No se pudo obtener el enlace de descarga, intente nuevamente.*'

if (isAudio) {
    await conn.sendMessage(m.chat, { audio: { url: downloadUrl }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
} else {
    await conn.sendMessage(m.chat, { video: { url: downloadUrl }, caption: `❀ *Archivo completado*`, fileName: `${title}.mp4`, mimetype: 'video/mp4' }, { quoted: m })
}

await m.react('✅')

} catch (e) {
console.error(e)
await m.react('✖️')
return conn.reply(m.chat, `❀ *Ocurrió un error:*\n✰ ${e.message || e}`, m)
}
}

handler.command = ['play', 'yta', 'ytmp3', 'play2', 'ytv', 'ytmp4', 'playaudio', 'mp4']
handler.tags = ['download']
handler.group = true

export default handler

async function getAud(url) {
try {
if (global.APIs?.adonix) {
     const endpoint = `${global.APIs.adonix.url}/download/ytaudio?apikey=${global.APIs.adonix.key}&url=${encodeURIComponent(url)}`
     const res = await fetch(endpoint).then(r => r.json())
     if (res.data?.url) return res.data.url
}
const fallback = await fetch(`https://api.agatz.xyz/api/ytmp3?url=${encodeURIComponent(url)}`)
const json = await fallback.json()
return json.data?.downloadUrl || json.result?.download?.url || null
} catch {
return null
}
}

async function getVid(url) {
try {
if (global.APIs?.adonix) {
    const endpoint = `${global.APIs.adonix.url}/download/ytvideo?apikey=${global.APIs.adonix.key}&url=${encodeURIComponent(url)}`
    const res = await fetch(endpoint).then(r => r.json())
    if (res.data?.url) return res.data.url
}
const fallback = await fetch(`https://api.agatz.xyz/api/ytmp4?url=${encodeURIComponent(url)}`)
const json = await fallback.json()
return json.data?.downloadUrl || json.result?.download?.url || null
} catch {
return null
}
}

function formatViews(views) {
if (!views) return "N/A"
if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`
if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
return views.toString()
}