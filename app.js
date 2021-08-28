const Discord = require('discord.js');
const client = new Discord.Client();
const jsonfile = require('jsonfile');
const filepath = "trackbot/data.json"

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//TODO static HTML send

client.on('message', msg => {
	if(msg.author.bot && msg.embeds[0] != undefined && (msg.author.tag == "Rythm#3722" || msg.author.tag == "Rythm 2#2000")){
		let title = msg.embeds[0].title;
		if(title != null && (title.startsWith("Now Playing"))){
			let requestedByFull = msg.embeds[0].description.split("`Requested by:` ")[1].split("\n\n`Up Next:` ")[0];
			let requestedBy;
			if(requestedByFull.endsWith(")")){
				requestedBy = requestedByFull.split("(")[1].split(")")[0];
			} else {
				requestedBy = requestedByFull;
			}
			let songTitle = msg.embeds[0].description.substr(0, msg.embeds[0].description.lastIndexOf("]")).replace("[", "");
			console.log(songTitle);

			jsonfile.readFile(filepath, function(err, obj){
				if (err) throw err;

				let totalPlays = obj.totalPlays;
				let totalUnique = obj.totalUnique;

				if(!obj.songs.some(e => e.title == songTitle)){
					obj.songs.push({title: songTitle, requestedBy: [{name: requestedBy, count: 1}], totalCount: 1});
					totalUnique++;
					const embed = new Discord.MessageEmbed()
						.setColor('#2ecc71')
						.setTitle('Music Tracked!')
						.setURL('http://www.namaikati.vguza')
						.setAuthor('TrackMan', 'https://i.redd.it/a604rad7j4651.png', 'http://www.maikatienegur.com')
						.setDescription('You are playing this for the first time!')
						.addFields({name: 'Track Name', value: songTitle, inline: true}, 
						{name: 'Requested By', value: requestedBy, inline: true})
					msg.channel.send(embed);
				} else {
					let totCount = 0;
					let index = obj.songs.findIndex(song => song.title == songTitle)
					if(obj.songs[index].requestedBy.some(e => e.name == requestedBy)){
						let userIdx = obj.songs[index].requestedBy.findIndex(e => e.name == requestedBy);
						obj.songs[index].requestedBy[userIdx].count++;
						obj.songs[index].totalCount++;
						totCount = obj.songs[index].totalCount;
					} else {
						obj.songs[index].requestedBy.push({name: requestedBy, count: 1});
						obj.songs[index].totalCount++;
						totCount = obj.songs[index].totalCount;
					}
					const embed = new Discord.MessageEmbed()
						.setColor('#2ecc71')
						.setTitle('Music Tracked!')
						.setURL('http://www.namaikati.vguza')
						.setAuthor('TrackMan', 'https://i.redd.it/a604rad7j4651.png', 'http://niggasbeblack.com')
						.setDescription('MusicMan is happy')
						.addFields({name: 'Track Name', value: songTitle, inline: true}, 
						{name: 'Requested By', value: requestedBy, inline: true}, 
						{name: 'Total Count', value: totCount, inline: true})
					msg.channel.send(embed);
				}
				obj.totalPlays = totalPlays+1;
				obj.totalUnique = totalUnique;
				jsonfile.writeFile(filepath, obj, function(err){
					if(err) throw err;
				})
			})
		}
	} else if(!msg.author.bot && msg.content.startsWith('!')){
		command = msg.content.substring('1');
		if(command == 'stats'){
			jsonfile.readFile(filepath, function(err, obj){
				if(err) throw err;
				let most = 0;
				let mostSong = '';
				let totalPlays = obj.totalPlays
				let totalUnique = obj.totalUnique

				for(let i = 0; i < obj.songs.length; i++){
					if(obj.songs[i].totalCount > most){
						most = obj.songs[i].totalCount;
						mostSong = obj.songs[i].title;
						console.log(most)
						console.log(mostSong)
					}
				}

				console.log(obj.totalPlays)
				console.log(obj.totalUnique)


				const embed = new Discord.MessageEmbed()
					.setColor('#2ecc71')
					.setTitle('Stats for TrackMan')
					.setAuthor('TrackMan', 'https://i.redd.it/a604rad7j4651.png', 'https://www.blackpeoplemeet.com/')
					.setDescription('These are your stats:')
					// .addFields({name: 'Total Songs Played', value: `${totalPlays == null ? "4upi se" : totalPlays}`}, 
					// {name: 'Total Unique Songs Played', value: `${totalUnique == null ? "4upi se" : totalUnique}`},
					// {name: 'Most Played Song', value: mostSong}, 
					// {name: 'Most Played Count', value: most})
					// .addField('Total songs played', totalPlays, false).addField('Total Unique Songs Played', "negur v kashon", false).addField('Most Played Song', mostSong, true).addField('Most Played Count', most, true)
					.addFields({name: "Total Played", value: `${totalPlays == null ? "NEMA INFO" : totalPlays}`, inline: true})
					.addFields({name: "Unique Songs Played", value: `${totalUnique == null ? "NEMA INFO" : totalUnique}`, inline: true})
					.addFields({name: "Most Played Song", value: `${mostSong == "" ? "NEMA INFO" : mostSong}`})
					.addFields({name: "Most Played Count", value: `${most == 0 ? "NEMA INFO" : most}`, inline: true})
				msg.channel.send(embed);
			}
		)}
	  }
});

client.login('<insert bot token here>');
