const { EmbedBuilder } = require("@discordjs/builders")

/**
 * Process a sheet json so that only relevant skills to the characters are shown in the embed
 * @param {JSON} sheet the sheet that needs to be sorted
 * @returns {String} Sorted skills to be presented at the Sheet Embed
 */
function skillSorter(sheet) {
    let sortedSkill = ""

    for (const skillCategory in sheet.skill){
        for(const skills in sheet.skill[skillCategory]){
            const skillSpecs = sheet.skill[skillCategory][skills]
            if(skillSpecs.rank > 2){
                sortedSkill += `${skillSpecs.name} : ${skillSpecs.rank} \n`
            }
        }
    }
    return sortedSkill
}

/**
 * Process a sheet json to be displayed in an embed
 * @param {JSON} theSheet the JSON that contains the character's statistics
 * @returns {sheet} Embed object that will be displayed in discord
 */
function characterSheet(theSheet) {
    const skills = skillSorter(theSheet)
    const characterSheet = new EmbedBuilder()
            .setColor(0xad0303)
            .setTitle(theSheet.name)
            .setDescription(
                `**Role:** ${theSheet.role}
                **HP:** ${theSheet.current_hp} / ${theSheet.base_hp}
                **INTL:** ${theSheet.stats.int} **REFX:** ${theSheet.stats.ref}
                **DEXT:** ${theSheet.stats.dex} **TECH:** ${theSheet.stats.tech}
                **COOL:** ${theSheet.stats.cool} **WILL:** ${theSheet.stats.will}
                **LUCK:** ${theSheet.stats.base_luck} **MOVE:** ${theSheet.stats.move}
                **BODY:** ${theSheet.stats.body} **EMPT:** ${theSheet.stats.base_emp}
                `
            )
            .addFields({name: "Skills", value: skills})

    return characterSheet
}

module.exports.characterSheet = characterSheet 