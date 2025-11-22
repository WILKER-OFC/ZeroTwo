import moment from "moment-timezone"
import fetch from "node-fetch"

const { prepareWAMessageMedia, generateWAMessageFromContent, proto } = (await import("@whiskeysockets/baileys")).default

let handler = async (m, { conn, usedPrefix }) => {
  try {
    let menu = {}
    for (let plugin of Object.values(global.plugins)) {
      if (!plugin || !plugin.help) continue
      let taglist = plugin.tags || []
      for (let tag of taglist) {
        if (!menu[tag]) menu[tag] = []
        menu[tag].push(plugin)
      }
    }

    let uptimeSec = process.uptime()
    let hours = Math.floor(uptimeSec / 3600)
    let minutes = Math.floor((uptimeSec % 3600) / 60)
    let seconds = Math.floor(uptimeSec % 60)
    let uptimeStr = `${hours}h ${minutes}m ${seconds}s`

    let botNameToShow = typeof global.botname === "string" ? global.botname : "Bot"
    let bannerUrl = global.banner

    if (Array.isArray(bannerUrl)) bannerUrl = bannerUrl[0]
    if (typeof bannerUrl !== "string") bannerUrl = ""

    let rolBot = conn.user.jid === global.conn.user.jid ? 'Principal 🅥' : 'Sub-Bot 🅑'

    let txt = `✿ *¡Hola! Soy ${botNameToShow}* ${rolBot}\n\n`
    txt += `✎ *Actividad:* ${uptimeStr}\n`
    txt += `✎ *Sistema:* Multi Device\n`
    txt += `✎ *Fecha:* ${moment().tz('America/Bogota').format('DD/MM/YYYY')}\n\n`
    txt += `↺ *Lista de comandos disponibles:*\n`

    let orderedTags = Object.keys(menu).sort((a, b) => {
      let countA = menu[a].reduce((acc, p) => acc + (Array.isArray(p.help) ? p.help.length : 0), 0)
      let countB = menu[b].reduce((acc, p) => acc + (Array.isArray(p.help) ? p.help.length : 0), 0)
      return countB - countA
    })

    for (let tag of orderedTags) {
      txt += `\n┏━━━━━━━━━━━━━━━━━━┓\n`
      txt += `┃ ᰔᩚ *${tag.toUpperCase()}* \n`
      for (let plugin of menu[tag]) {
        if (!Array.isArray(plugin.help)) continue
        for (let cmd of plugin.help) {
          if (Array.isArray(cmd)) cmd = cmd[0]
          if (!cmd) continue
          txt += `┃ *❑* ${usedPrefix}${cmd}\n`
        }
      }
      txt += `┗━━━━━━━━━━━━━━━━━━\n`
    }

    let mediaMessage = null
    let thumbnailBuffer = null

    if (bannerUrl) {
      try {
        const res = await fetch(bannerUrl)
        const buffer = await res.buffer()
        thumbnailBuffer = buffer

        mediaMessage = await prepareWAMessageMedia({ image: buffer }, { upload: conn.waUploadToServer })
      } catch (e) {
        console.error(e)
      }
    }

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: { 
              text: "> *꒷︶꒷꒥꒷‧₊˚૮꒰˵•ᵜ•˵꒱ა‧₊˚꒷︶꒷꒥꒷*" 
            },
            footer: { 
              text: txt 
            },
            header: {
              hasMediaAttachment: !!mediaMessage,
              imageMessage: mediaMessage ? mediaMessage.imageMessage : null
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "☆ Canal",
                    url: "https://chat.whatsapp.com/JcMa6Incw3g4YmNo4iim3Q?mode=hqrt3",
                    merchant_url: "https://chat.whatsapp.com/JcMa6Incw3g4YmNo4iim3Q?mode=hqrt3"
                  })
                }
              ],
              messageParamsJson: ""
            },
            contextInfo: {
              mentionedJid: [m.sender],
              isForwarded: true, 
              forwardingScore: 9999999,
              externalAdReply: {
                title: "⋆˚❏ 𝖬𝖾𝗇𝗎 𝖽𝖾 𝖼𝗈𝗆𝖺𝗇𝖽𝗈𝗌",
                body: "Invitación al grupo oficial",
                thumbnail: thumbnailBuffer,
                thumbnailUrl: "https://chat.whatsapp.com/JcMa6Incw3g4YmNo4iim3Q?mode=hqrt3",
                sourceUrl: "https://chat.whatsapp.com/JcMa6Incw3g4YmNo4iim3Q?mode=hqrt3",
                mediaType: 1,
                renderLargerThumbnail: true
              }
            }
          }
        }
      }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, {})

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "✿ *Ocurrió un error al generar el menú.*", m)
  }
}

handler.command = ['help', 'menu']
export default handler