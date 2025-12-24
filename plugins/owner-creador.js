let handler = async (m, { conn }) => {
  const name = 'Ado'
  const number = '5492644893953' // sin @
  const email = 'me.developer.wilker.ofc@gmail.com'
  const org = 'Creador de ZeroTwo'
  const note = 'Mini desarrollador de bots de WhatsApp'

  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:${name}
FN:${name}
ORG:${org}
EMAIL;type=EMAIL:${email}
TEL;type=CELL;type=VOICE;waid=${number}:${number}
NOTE:${note}
END:VCARD
`.trim()

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: name,
      contacts: [{ vcard }],
    },
  }, { quoted: m })
}

handler.help = ['creador']
handler.tags = ['info']
handler.command = ['creador', 'owner', 'creator']

export default handler