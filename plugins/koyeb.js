const { izumi, PREFIX } = require('../lib/');
const config = require('../config');
const simpleGit = require('simple-git');
const git = simpleGit();

const Koyeb = require('node-koyeb-api');
const koyeb = new Koyeb(config.KOYEB_API_KEY);

izumi({
    pattern: 'setvar ?(.*)',
    fromMe: true,
    desc: 'Set koyeb environment variables',
    type: 'koyeb'
}, async (message, match, client) => {
    if (!match) return await message.send('*Need Key and Value*\n_Example: setvar PREFIX:,_');
    const [varKey, varValue] = match.split(':');
    if (varKey && varValue) {
        try {
            await koyeb.setEnv({
                key: varKey.toUpperCase(),
                value: varValue,
                serviceName: config.KOYEB_APP_NAME
            });
            await message.send(`*_Successfully Set_* *${varKey}:${varValue}*\n_ReDeploying..._`);
            await require('pm2').stop('izumi');
        } catch (error) {
            await message.send(`Error: ${error.message}`);
        }
    }
});

izumi({
    pattern: 'delvar ?(.*)',
    fromMe: true,
    desc: 'Delete koyeb environment variables',
    type: 'koyeb'
}, async (message, match, client) => {
    if (!match) return await message.send('*Need Key*\n_Example: delvar PREFIX_');
    try {
        const envVars = await koyeb.getAllEnvVars(config.KOYEB_APP_NAME);
        const varToDelete = envVars.find(v => v.key === match.toUpperCase());
        if (!varToDelete) return await message.send('*Key Not Found*');

        await koyeb.setEnv({
            key: match.toUpperCase(),
            value: '',
            serviceName: config.KOYEB_APP_NAME
        });
        await message.send(`*${match.toUpperCase()} Deleted*\n_ReDeploying..._`);
        await require('pm2').stop('izumi');
    } catch (error) {
        await message.send(`Error: ${error.message}`);
    }
});

izumi({
    pattern: 'getvar ?(.*)',
    fromMe: true,
    desc: 'Get koyeb environment variables',
    type: 'koyeb'
}, async (message, match, client) => {
    if (!match) return await message.send('*Need Key*\n_Example: getvar PREFIX_');
    try {
        const envVars = await koyeb.getAllEnvVars(config.KOYEB_APP_NAME);
        const vars = envVars.find(v => v.key === match.trim().toUpperCase());
        if (vars) {
            await message.send(`_${vars.key} : ${vars.value}_`);
        } else {
            await message.send('*Key Not Found*');
        }
    } catch (error) {
        await message.send(`Error: ${error.message}`);
    }
});

izumi({
    pattern: 'allvar ?(.*)',
    fromMe: true,
    desc: 'Get all koyeb environment variables',
    type: 'koyeb'
}, async (message, match, client) => {
    try {
        const envVars = await koyeb.getAllEnvVars(config.KOYEB_APP_NAME);
        let msg = '';
        for (let x of envVars) {
            msg += `*${x.key}* : ${x.value}\n\n`;
        }
        await message.send(msg);
    } catch (error) {
        await message.send(`Error: ${error.message}`);
    }
});
