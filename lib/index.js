const { Client, MessageAttachment, MessageEmbed } = require('discord.js')
const client = new Client()

const tutorialMessages = ["Let's start tutorial.\nPlease click 🆗 when ready.", 'Nice!.\nNext, foobar.', 'Finish All!']

let tutorialProcesses = []

client.on('ready', () => {
  console.log('I am ready!')
})

client.on('message', (message) => {
  const channel = message.channel
  const author = message.author
  const guild = message.guild
  const nickname = guild.member(author).displayName

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
      .setAuthor(nickname, author.avatarURL())
      .setTitle('A slick little embed')
      .setColor(0xff0000)
      .setDescription('Hello, this is a slick embed!')
      .setThumbnail(author.avatarURL())
      .setImage(author.avatarURL())
    channel.send(embed)
  }
  if (message.content === '!tutorial') {
    message.reply(tutorialMessages[0]).then((message) => {
      tutorialProcesses.push({
        messageId: message.id,
        userId: author.id,
        step: 1,
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

      const nextMessage = tutorialMessages[tutorialProcess.step]

      if (tutorialProcess.step < tutorialMessages.length - 1) {
        channel.send(`${user}, ${nextMessage}`).then((newMessage) => {
          tutorialProcess.messageId = newMessage.id
          tutorialProcess.step++

          newMessage.react('🆗')
          newMessage.react('🆖')
        })
      } else {
        channel.send(`${user}, ${nextMessage}`)
        tutorialProcesses = tutorialProcesses.filter((tutorialProcess) => message.id !== tutorialProcess.messageId || user.id !== tutorialProcess.userId)
      }
    } else if (emoji.toString() === '🆖') {
      tutorialProcesses = tutorialProcesses.filter((tutorialProcess) => message.id !== tutorialProcess.messageId || user.id !== tutorialProcess.userId)
      message.edit(`~~${message.content}~~`)
      message.reactions.removeAll()
      channel.send(`${user}, I see, abort this tutorial.`)
    } else {
      channel.send(`${user}, SOS!`)
    }
  }
})

client.login(process.env.TOKEN)
