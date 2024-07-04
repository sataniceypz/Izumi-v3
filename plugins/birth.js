const { izumi, mode,timeCalculator } = require('../lib/');
izumi({
  pattern: 'birth ?(.*)',
  fromMe: mode,
  desc: 'get birth day details',
  type: 'info'
}, async (message, match) => {
  try {
    let [day, month, year] = match.split('-').map(Number);
    if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) {
      return await message.send('eg .age 18-03-2005', { quoted: message.data });
    }

    if (new Date(year, month - 1, day) == 'Invalid Date') {
      return await message.send('_Date must be in dd-mm-yy format_', { quoted: message.data });
    }

    const birthDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    if (birthDate > currentDate) {
      return await message.send('_Given date is invalid or future_', { quoted: message.data });
    }

    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const nextBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (currentDate > nextBirthday) {
      nextBirthday.setFullYear(currentDate.getFullYear() + 1);
    }

    const millisecondsInDay = 1000 * 60 * 60 * 24;
    const remainingDays = Math.round((nextBirthday - currentDate) / millisecondsInDay);

    const ageInSeconds = Math.floor((currentDate - birthDate) / 1000);
    const remainingInSeconds = Math.floor((nextBirthday - currentDate) / 1000);

    const result = `
*SHORT DETAILS ABOUT YOUR BIRTH*
*________________________________*
🎉 *BORN ON* ➔ ${day}-${month}-${year}
🎂 *NEXT BDAY* ➔ ${nextBirthday.getDate()}-${nextBirthday.getMonth() + 1}-${nextBirthday.getFullYear()}
🎈 *AGE*  ➔ ${age} years
🎉 *YOUR NEXT BIRTHDAY AFTER* ➔ ${timeCalculator(remainingInSeconds)}
🥳 *REMAINING DAYS* ➔ ${remainingDays}
💐 *YOU PASSED* ➔ ${timeCalculator(ageInSeconds)}
🎁 *DAYS* ➔ ${Math.floor(ageInSeconds / 86400)}
🎁 *HOURS* ➔ ${Math.floor(ageInSeconds / 3600)}
🎁 *MINUTES* ➔ ${Math.floor(ageInSeconds / 60)}
🎁 *SECONDS* ➔ ${ageInSeconds}
`.trim().toUpperCase();

    await message.reply(result);
  } catch (e) {
    await message.reply("_Invalid input_");
  }
});