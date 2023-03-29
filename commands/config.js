const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const bitfieldCalculator = require('discord-bitfield-calculator');

module.exports = {
  name: "config",
  debug: false,
  global: false,
  description: "Configure your server settings",
  usage: "[opt] [action] [value]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: ["MANAGE_GUILD"],
  },  
  options: [
    {
      name: "allowed_channels",
      description: "Set channels you're allowed to use the bot in",
      value: "allowed_channels",
      type: 2,
      options: [
        {
          name: "add",
          description: "Add channel",
          value: "add",
          type: 1,
          options: [{
            name: "channel",
            description: "The channel to configure",
            value: "channel",
            type: 7,
            channel_types: [0], // Restrict to text channel
            required: true,
          }]
        },
        {
          name: "remove",
          description: "Remove channel",
          value: "remove",
          type: 1,
          options: [{
            name: "channel",
            description: "The channel to configure",
            value: "channel",
            type: 7,
            channel_types: [0], // Restrict to text channel
            required: true,
          }]
        },
      ]
    },
    {
      name: "killfeed_channel",
      description: "Set the Killfeed Channel",
      value: "killfeed_channel",
      type: 1,
      options: [{
        name: "channel",
        description: "The channel to configure",
        value: "channel",
        type: 7,
        channel_types: [0], // Restrict to text channel
        required: true,
      }]
    },
    {
      name: "admin_logs_channel",
      description: "Set the Admin Logs Channel",
      value: "admin_logs_channel",
      type: 1,
      options: [{
        name: "channel",
        description: "The channel to configure",
        value: "channel",
        type: 7,
        channel_types: [0], // Restrict to text channel
        required: true,
      }]
    },
    {
      name: "welcome_channel",
      description: "Set the channel for users to gain access",
      value: "welcome_channel",
      type: 1,
      options: [{
        name: "channel",
        description: "The channel to configure",
        value: "channel",
        type: 7,
        channel_types: [0], // Restrict to text channel
        required: true,
      }]
    },
    {
      name: "active_players_channel",
      description: "Set the channel for active players update",
      value: "active_players_channel",
      type: 1,
      options: [{
        name: "channel",
        description: "The channel to configure",
        value: "channel",
        type: 7,
        channel_types: [0], // Restrict to text channel
        required: true,
      }]
    },
    {
      name: "linked_gt_role",
      description: "Access Role to give to users",
      value: "linked_gt_role",
      type: 1,
      options: [{
        name: "role",
        description: "Role to configure",
        value: "role",
        type: 8,
        required: true,
      }]
    },
    {
      name: "bot_admin_role",
      description: "Set/remove bot admin role",
      value: "bot_admin_role",
      type: 1,
      options: [
        {
          name: "action",
          description: "Add or remove a role from the exclude list.",
          value: "action",
          type: 3,
          choices: [
            { name: 'add', value: 'add' }, { name: 'remove', value: 'remove' },
          ],
          required: true,
        },
        {
          name: "role",
          description: "Role to configure",
          value: "role",
          type: 8,
          required: true,
        },
      ]
    },
    {
      name: "exclude",
      description: "Exclude roles from users to use to claim a flag.",
      value: "exclude",
      type: 1,
      options: [
        {
          name: "action",
          description: "Add or remove a role from the exclude list.",
          value: "action",
          type: 3,
          choices: [
            { name: 'add', value: 'add' }, { name: 'remove', value: 'remove' },
          ],
          required: true,
        },
        {
          name: "role",
          description: "The role to manage",
          value: "role",
          type: 8,
          required: true,
        },
      ]
    },
    {
      name: "reset",
      description: "Restore all settings to default configurations",
      value: "reset",
      type: 1,
    },
    {
      name: "view",
      description: "View current settings configuration",
      value: "view",
      type: 1,
    },
    {
      name: "starting_balance",
      description: "Set the starting balance",
      value: "starting_balance",
      type: 1,
      options: [{
        name: "amount",
        description: "The amount to set the starting balance",
        value: "amount",
        type: 10,
        min_value: 0.01,
        required: true,
      }]
    },
    {
      name: "income_role",
      description: "Add/update a role to earn income on /collect-income command",
      value: "set_income_role",
      type: 2,
      options: [
        {
          name: "set",
          description: "Set role",
          value: "set",
          type: 1,
          options: [
            {
              name: "role",
              description: "Role to set",
              value: "role",
              type: 8,
              required: true,
            },
            {
              name: "amount",
              description: "The amount to collect",
              value: 120.00,
              type: 10,
              min_value: 0.01,
              required: true,
            }
          ]
        },
        {
          name: "remove",
          description: "Remove role",
          value: "remove",
          type: 1,
          options: [{
            name: "role",
            description: "Role to remove",
            value: "role",
            type: 8,
            required: true,
          }]
        },
      ],
    },
  ],  
  SlashCommand: {
    /**
     *
     * @param {require("../structures/QuarksBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
    */
    run: async (client, interaction, args, { GuildDB }) => {      
      const permissions = bitfieldCalculator.permissions(interaction.member.permissions);
      let canUseCommand = false;

      if (permissions.includes("MANAGE_GUILD")) canUseCommand = true;
      if (GuildDB.hasBotAdmin && interaction.member.roles.filter(e => GuildDB.botAdminRoles.indexOf(e) !== -1).length > 0) canUseCommand = true;
      if (!canUseCommand) return interaction.send({ content: 'You don\'t have the permissions to use this command.' });

      if (args[0].name == 'allowed_channels') {
        const channelid = args[0].options[0].options[0].value;

        if (args[0].options[0].name == 'add') {
          const channel = client.channels.cache.get(channelid);

          const errorEmbed = new EmbedBuilder().setColor(client.config.Colors.Red)
          let error = false;

          if (!channel) {error=true;errorEmbed.setDescription(`**Error Notice:** Cannot find that channel.`);}
          if (channel.type=="voice") {error=true;errorEmbed.setDescription(`**Error Notice:** Cannot add voice channel to allowed channels.`);}
          if (error) return interaction.send({ embeds: [errorEmbed] });
                    
          client.dbo.collection("guilds").updateOne({"server.serverID":GuildDB.serverID}, {$push:{"server.allowedChannels": channelid}}, function (err, res) {
            if (err) return client.sendInternalError(interaction, err);
          });

          const successEmbed = new EmbedBuilder()
            .setColor(client.config.Colors.Green)
            .setDescription(`**Success:** Set <#${channelid}> as an allowed channel.`);

          return interaction.send({ embeds: [successEmbed] });
        } else if (args[0].options[0].name=='remove') {

          const embed = new EmbedBuilder()
            .setDescription(`**Error Notice:** <#${channelid}> is not in allowed channels.`)
            .setColor(client.config.Colors.Red)

          if (!GuildDB.allowedChannels.includes(channelid)) return interaction.send({ embeds: [embed] });

          const prompt = new EmbedBuilder()
            .setTitle(`Are you sure you want to remove this channel from allowed channels?`)
            .setColor(client.config.Colors.Default)

          const opt = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`RemoveAllowedChannels-yes-${interaction.member.user.id}`)
                .setLabel("Yes")
                .setStyle(ButtonStyle.Danger),
              new ButtonBuilder()
                .setCustomId(`RemoveAllowedChannels-no-${interaction.member.user.id}`)
                .setLabel("No")
                .setStyle(ButtonStyle.Success)
            )

          return interaction.send({ embeds: [prompt], components: [opt], flags: (1 << 6) });
          
        } else client.error('exception?');

      } else if (args[0].name == 'bot_admin_role') {
        
          if (args[0].options[0].value == 'add') {
            const roleId = args[0].options[0].options[0].value;
  
            client.dbo.collection("guilds").updateOne({"server.serverID":GuildDB.serverID},{$push: {"server.botAdminRoles": roleId}}, function(err, res) {
              if (err) return client.sendInternalError(interaction, err);
            });
      
            const successEmbed = new EmbedBuilder()
              .setDescription(`Successfully added <@&${roleId}> as a bot admin role.\nUsers with this role can use restricted commands.`)
              .setColor(client.config.Colors.Green);
      
            return interaction.send({ embeds: [successEmbed] });    

          } else if (args[0].options[0].value== 'remove') {

            if (!GuildDB.botADminRoles.includes(args[0].options[1].value)) {
              const noRole = new EmbedBuilder()
                .setColor(client.config.Colors.Yellow)
                .setDescription(`**Notice:**\n> The role <@&${args[0].options[1].value}> has not been configured as a bot admin.`);

              return interaction.send({ embeds: [noRole] });
            }

            const prompt = new EmbedBuilder()
              .setTitle(`Are you sure you want to remove this role as a bot admin?`)
              .setColor(client.config.Colors.Default)

            const opt = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId(`RemoveBotAdminRole-yes-${args[0].options[1].value}-${interaction.member.user.id}`)
                  .setLabel("Yes")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId(`RemoveBotAdminRole-no-${args[0].options[1].value}-${interaction.member.user.id}`)
                  .setLabel("No")
                  .setStyle(ButtonStyle.Success)
              )

            return interaction.send({ embeds: [prompt], components: [opt], flags: (1 << 6) });
          }

      } else if (args[0].name == 'exclude') {

        if (args[0].options[0].value == 'add') {
          client.dbo.collection('guilds').updateOne({'server.serverID': GuildDB.serverID}, {$push: {'server.excludedRoles': args[0].options[1].value}}, function(err, res) {
            if (err) return client.sendInternalError(interaction, err);
          })

          const success = new EmbedBuilder()
            .setColor(client.config.Colors.Green)
            .setDescription(`**Done!**\n> Successfully added <@&${args[0].options[1].value}> to list of excluded roles.`)

          return interaction.send({ embeds: [success] });

        } else if (args[0].options[0].value == 'remove') {
          client.dbo.collection('guilds').updateOne({'server.serverID': GuildDB.serverID}, {$pull: {'server.excludedRoles': args[0].options[1].value}}, function(err, res) {
            if (err) return client.sendInternalError(interaction, err);
          })

          const success = new EmbedBuilder()
            .setColor(client.config.Colors.Green)
            .setDescription(`**Done!**\n> Successfully removed <@&${args[0].options[1].value}> to list of excluded roles.`)

          return interaction.send({ embeds: [success] });
        }

      } else if (args[0].name == 'reset') {
        const prompt = new EmbedBuilder()
          .setTitle(`Woah!? Hold on.`)
          .setDescruotion('Are you sure you wish to remove all your configurations for this guild?')
          .setColor(client.config.Colors.Default)

        const opt = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`ResetSettings-yes-${interaction.member.user.id}`)
              .setLabel("Yes")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId(`ResetSettings-no-${interaction.member.user.id}`)
              .setLabel("No")
              .setStyle(ButtonStyle.Success)
          )

        return interaction.send({ embeds: [prompt], components: [opt], flags: (1 << 6) });

      } else if (args[0].name == 'view') {
        const channelsInfo = GuildDB.customChannelStatus ? '\n╚➤ \`/channels\` to view' : '';
        const channelColor = GuildDB.customChannelStatus ? '+ ' : '- ';
        let botAdminRoles = '';
        for (let i = 0; i < GuildDB.botAdminRoles.length; i++) {
          botAdminRoles += `\n╚➤ <@&${GuildDB.botAdminRoles[i]}>`;
        }
        const botAdminRoleColor = GuildDB.hasBotAdmin ? `+ ` : '- ';
        const excludedRolesColor = GuildDB.excludedRoles.length > 0 ? `+ ` : '- ';
        const excludedRolesInfo = GuildDB.excludedRoles.length > 0 ? '\n╚➤ \`/excluded\` to view' : '';

        const settingsEmbed = new EmbedBuilder()
          .setColor(client.config.Colors.Default)
          .setTitle('Current Guild Configurations')
          .addFields(
            { name: 'Guild ID', value: `\`\`\`arm\n${GuildDB.serverID}\`\`\``, inline: true },
            { name: 'Has Allowed Channels?', value: `\`\`\`diff\n${channelColor}${GuildDB.customChannelStatus}\`\`\`${channelsInfo}`, inline: true },
            { name: 'Has bot admin role?', value: `\`\`\`diff\n${botAdminRoleColor}${client.exists(GuildDB.botAdmin)}\`\`\`${botAdminRoles}`, inline: true },
            { name: 'Excluded roles?', value: `\`\`\`diff\n${excludedRolesColor}${GuildDB.excludedRoles.length > 0}\`\`\`${excludedRolesInfo}` },
          );

        return interaction.send({ embeds: [settingsEmbed] });
      } else if (args[0].name == 'killfeed_channel') {
        const channel = args[0].options[0].value;

          client.dbo.collection("guilds").updateOne({"server.serverID":GuildDB.serverID},{$set: {"server.killfeedChannel": channel}}, function(err, res) {
            if (err) return client.sendInternalError(interaction, err);
          });
    
          const successEmbed = new EmbedBuilder()
            .setDescription(`Successfully added <#${channel}> as the Killfeed Channel.`)
            .setColor(client.config.Colors.Green);
    
          return interaction.send({ embeds: [successEmbed] });    

      } else if (args[0].name == 'admin_logs_channel') {
        const channel = args[0].options[0].value;
  
        client.dbo.collection("guilds").updateOne({"server.serverID":GuildDB.serverID},{$set: {"server.connectionLogsChannel": channel}}, function(err, res) {
          if (err) return client.sendInternalError(interaction, err);
        });
  
        const successEmbed = new EmbedBuilder()
          .setDescription(`Successfully set <#${channel}> as the Admin Logs Channel.`)
          .setColor(client.config.Colors.Green);
  
        return interaction.send({ embeds: [successEmbed] });    

      } else if (args[0].name == 'welcome_channel') {
        const channel = args[0].options[0].value;
  
        client.dbo.collection("guilds").updateOne({"server.serverID":GuildDB.serverID},{$set: {"server.welcomeChannel": channel}}, function(err, res) {
          if (err) return client.sendInternalError(interaction, err);
        });
  
        const successEmbed = new EmbedBuilder()
          .setDescription(`Successfully set <#${channel}> as the Welcome Channel.`)
          .setColor(client.config.Colors.Green);
  
        return interaction.send({ embeds: [successEmbed] });    

      } else if (args[0].name == 'active_players_channel') {
        const channel = args[0].options[0].value;
  
        client.dbo.collection("guilds").updateOne({"server.serverID":GuildDB.serverID},{$set: {"server.activePlayersChannel": channel}}, function(err, res) {
          if (err) return client.sendInternalError(interaction, err);
        });
  
        const successEmbed = new EmbedBuilder()
          .setDescription(`Successfully set <#${channel}> as the Active Players Channel.`)
          .setColor(client.config.Colors.Green);
  
        return interaction.send({ embeds: [successEmbed] });    

      } else if (args[0].name == 'linked_gt_role') {
        const role = args[0].options[0].value;
  
        client.dbo.collection("guilds").updateOne({"server.serverID":GuildDB.serverID},{$set: {"server.linkedGamertagRole": role}}, function(err, res) {
          if (err) return client.sendInternalError(interaction, err);
        });
  
        const successEmbed = new EmbedBuilder()
          .setDescription(`Successfully set <@&${role}> to give to users who link their gamertag.`)
          .setColor(client.config.Colors.Green);
  
        return interaction.send({ embeds: [successEmbed] });    

      } else if (args[0].name == 'starting_balance') {
        client.dbo.collection("guilds").updateOne({"server.serverID": GuildDB.serverID}, {$set: {"server.startingBalance":args[0].options[0].value}}, function(err, res) {
          if (err) return client.sendInternalError(interaction, err);
        });
  
        let successEmbed = new EmbedBuilder()
          .setColor(client.config.Colors.Green)
          .setDescription(`Successfully set $${args[0].options[0].value.toFixed(2)} as starting balance`);
        
        return interaction.send({ embeds: [successEmbed] });

      } else if (args[0].name == 'income_role') {
        if (args[0].options[0].name== 'set') {
          const roleId = args[0].options[0].options[0].value

          if (args[0].options[0].options[1].value <= 0) {
            let embed = new EmbedBuilder()
              .setDescription('**Error Notice:** Amount cannot be $0 or less than $0.')
              .setColor(client.config.Colors.Red);
    
            return interaction.send({ embeds: [embed] });
          }
    
          const searchIndex = GuildDB.incomeRoles.findIndex((role) => role.role==roleId);
          if (searchIndex == -1) {
            const newIncome = {
              role: roleId,
              income: args[0].options[0].options[1].value,
            }
    
            client.dbo.collection("guilds").updateOne({"server.serverID":GuildDB.serverID}, {$push: {"server.incomeRoles":newIncome}}, function(err, res) {
              if (err) return client.sendInternalError(interaction, err);
            });
          } else {
            client.dbo.collection("guilds").updateOne({
              "server.serverID": GuildDB.serverID,
              "server.incomeRoles.role": roleId
            },
            {
              $set: {
                "server.incomeRoles.$.income": args[0].options[0].options[1].value
              }
            }, function(err, res) {
              if (err) return client.sendInternalError(interaction, err);
            });
          }
          const perform = searchIndex == -1 ? 'set' : 'updated';
    
          const successEmbed = new EmbedBuilder()
            .setDescription(`Successfully ${perform} <@&${roleId}>'s income to $${args[0].options[0].options[1].value}`)
            .setColor(client.config.Colors.Green);
    
          return interaction.send({ embeds: [successEmbed] });    

        } else if (args[0].options[0].name== 'remove') {
          const searchIndex = GuildDB.incomeRoles.findIndex((role) => role.role==roleId);
          if (searchIndex == -1) {
            const errorEmbed = new EmbedBuilder()
              .setDescription('**Error Notice:** Role not found')
              .setColor(client.config.Colors.Red);

            return interaction.send({ embeds: [errorEmbed] }); 
          } else {
            const prompt = new EmbedBuilder()
            .setTitle(`Are you sure you want to remove this role as an income?`)
            .setColor(client.config.Colors.Default)

            const opt = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId(`RemoveIncomeRole-yes-${interaction.member.user.id}`)
                  .setLabel("Yes")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId(`RemoveIncomeRole-no-${interaction.member.user.id}`)
                  .setLabel("No")
                  .setStyle(ButtonStyle.Success)
              )

            return interaction.send({ embeds: [prompt], components: [opt], flags: (1 << 6) });
          }
        }
      }
    },
  },

  Interactions: {
    
    RemoveAllowedChannels: {
      run: async (client, interaction, GuildDB) => {
        if (!queryString.endsWith(interaction.member.user.id)) {
          return ButtonInteraction.reply({
            content: "This button is not for you",
            flags: (1 << 6)
          })
        }
        let action = ''
        if (interaction.customId.split('-')[1]=='yes') {
          action = 'removed';
          client.dbo.collection("guilds").updateOne({"server.serverID":GuildDB.serverID}, {$pull:{"server.allowedChannels": channelid}}, function (err, res) {
            if (err) return client.sendInternalError(interaction, err);
          });
        } else if (interaction.customId.split('-')[1]=='no') action = 'kept';
    
        const successEmbed = new EmbedBuilder()
          .setColor(client.config.Colors.Green)
          .setTitle(`Success: You ${action} the channel.`)
    
        return interactino.update({ embeds: [successEmbed], components: [] });
      }
    },

    RemoveBotAdminRole: {
      run: async (client, interaction, GuildDB) => {
        if (!interaction.customId.endsWith(interaction.member.user.id)) {
          return ButtonInteraction.reply({
            content: "This button is not for you",
            flags: (1 << 6)
          })
        }
        let action = '';
        if (interaction.customId.split('-')[1]=='yes') {
          let role = interaction.customId.split('-')[2];
          action = 'removed';
          client.dbo.collection("guilds").updateOne({"server.serverID":GuildDB.serverID}, {$pull: {"server.botAdminRoles": role}}, function(err, res) {
            if (err) return client.sendInternalError(interaction, err);
          });
        } else if (interaction.customId.split('-')[1]=='no') action = 'kept';
    
        const successEmbed = new EmbedBuilder()
          .setColor(client.config.Colors.Green)
          .setTitle(`Successfully ${action} <@&${roleId}> as the bot admin role.`)
    
        return interaction.update({ embeds: [successEmbed], components: [] });
      }
    },

    ResetSettings: {
      run: async (client, interaction, GuildDB) => {
        if (!interaction.customId.endsWith(interaction.member.user.id)) {
          return ButtonInteraction.reply({
            content: "This button is not for you",
            flags: (1 << 6)
          })
        }
        let action = '';
        if (interaction.customId.split('-')[1]=='yes') {
          action = 'reset';
          const defaultGuildConfig = client.getDefaultSettings(GuildDB.serverID);
          client.dbo.collection("guilds").updateOne({"server.serverID":GuildDB.serverID}, {$set: {"server": defaultGuildConfig}}, function(err, res) {
            if (err) return client.sendInternalError(interaction, err);
          });
        } else if (interaction.customId.split('-')[1]=='no') action = 'kept';
    
        const successEmbed = new EmbedBuilder()
          .setColor(client.config.Colors.Green)
          .setTitle(`Successfully ${action} guild configurations.`)
    
        return interaction.update({ embeds: [successEmbed], components: [] });
      }
    }
  } 
}