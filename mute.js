const Discord = require("discord.js");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {

  //!mute @user 1s/m/h/d

  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!tomute) return message.channel.send("Please tag user to mute!");
  if(!message.member.roles.find("name", "Swearsie Police")) return message.channel.send('You need the \`Swearsie Police\` role to use this command.');
  if(tomute.hasPermission("MANAGE_MESSAGES")) return message.channel.send("I cant mute this user");
  if (tomute.id === message.author.id) return message.channel.send("You cannot mute yourself!");
  let muterole = message.guild.roles.find(`name`, "Jesus Mute");

  if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "Jesus Mute",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }

  let mutetime = args[1];
  if(!mutetime) return message.channel.send("You didn't specify a time!");

  await(tomute.addRole(muterole.id));
  message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);

  setTimeout(function(){
    tomute.removeRole(muterole.id);
    message.channel.send(`<@${tomute.id}> has been unmuted!`);
  }, ms(mutetime));

  message.delete();

}

module.exports.help = {
  name: "mute"
}
