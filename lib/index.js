const { Client, MessageAttachment, MessageEmbed } = require('discord.js')
const client = new Client()

let tutorialProcesses = []

client.on('ready', () => {
  console.log('I am ready!')
})

client.on('message', (message) => {
  const channel = message.channel
  const author = message.author

  if (message.content === '!ping') {
    channel.send('pong!')
  }
  if (message.content === '!avatar2') {
    message.reply(author.avatarURL())
  }
  if (message.content === '!avatar') {
    const attachment = new MessageAttachment(author.avatarURL())
    message.reply(attachment)
  }
  if (message.content === '!embed') {
    const embed = new MessageEmbed()
      .setTitle('A slick little embed')
      .setColor(0xff0000)
      .setDescription('Hello, this is a slick embed!')
    channel.send(embed)
  }
  if (message.content === '!tutorial') {
    message.reply("Let's start tutorial. Please click 🆗 when ready.").then((message) => {
      tutorialProcesses.push({
        messageId: message.id,
        userId: author.id,
        step: 0,
      })
      message.react('🆗')
      message.react('🆖')
    })
  }
})

client.on('messageReactionAdd', (messageReaction, user) => {
  const message = messageReaction.message
  const emoji = messageReaction.emoji
  const channel = message.channel

  const tutorialProcess = tutorialProcesses.find((tutorialProcess) => message.id === tutorialProcess.messageId && user.id === tutorialProcess.userId)

  if (tutorialProcess) {
    if (emoji.toString() === '🆗') {
      message.edit(`☑ ${message.content}`)
      message.reactions.removeAll()
      channel.send(`${user}, Nice!`).then((newMessage) => {
        tutorialProcess.messageId = newMessage.id
        tutorialProcess.step++
      })
    } else if (emoji.toString() === '🆖') {
      tutorialProcesses = tutorialProcesses.filter((tutorialProcess) => message.id !== tutorialProcess.messageId || user.id !== tutorialProcess.userId)
      message.edit(`~~${message.content}~~`)
      message.reactions.removeAll()
      channel.send(`${user}, I see. finish this tutorial.`)
    } else {
      channel.send(`${user}, SOS!`)
    }
  }
})

client.login(process.env.TOKEN)
