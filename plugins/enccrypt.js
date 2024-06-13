const {
 	izumi,mode
 } = require("../lib/");
 izumi({
 	pattern: 'minify ?(.*)',
 	fromMe: mode,
 	desc: 'code minifier',
 	type: 'generator'
 }, async (message, match, client) => {
 	match = match || message.reply_message.text
 	try {
 		var UglifyJS = require("uglify-js");
 		var result = await UglifyJS.minify(match)
 		if (!result.error) return await message.reply(result.code)
 		await message.reply(result.error)
 		console.log(result)
 	} catch (e) {
 		message.reply(`${result.error}`)
 	};
 });
izumi(	{pattern: 'obfuscate ?(.*)',		fromMe: mode,	desc: 'javascript obfuscator',		type: 'generator' 	},async (message, match) => {
const data = {}

data.value = {
    compact: true,
    config: '',
    controlFlowFlattening: false,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: false,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: false,
    domainLock: [],
    domainLockRedirectUrl: 'about:blank',
    exclude: [],
    forceTransformStrings: [],
    identifierNamesCache: null,
    identifierNamesGenerator: 'hexadecimal',
    identifiersPrefix: '',
    identifiersDictionary: [],
    ignoreImports: false,
    inputFileName: '',
    log: true,
    numbersToExpressions: false,
    optionsPreset: 'default',
    renameGlobals: false,
    renameProperties: false,
    renamePropertiesMode: 'safe',
    reservedNames: [],
    reservedStrings: [],
    stringArrayRotate: true,
    seed: 707066159,
    selfDefending: false,
    stringArrayShuffle: true,
    simplify: true,
    sourceMap: false,
    sourceMapBaseUrl: '',
    sourceMapFileName: '',
    sourceMapMode: 'separate',
    sourceMapSourcesMode: 'sources-content',
    splitStrings: false,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayCallsTransform: false,
    stringArrayCallsTransformThreshold: 0.5,
    stringArrayEncoding: [ 'none' ],
    stringArrayIndexesType: [ 'hexadecimal-number' ],
    stringArrayIndexShift: true,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersCount: 1,
    stringArrayWrappersParametersMaxCount: 2,
    stringArrayWrappersType: 'variable',
    stringArrayThreshold: 0.75,
    target: 'browser',
    transformObjectKeys: false,
    unicodeEscapeSequence: false
  }
    
data.code = message.reply_message.text
const axios = require("axios");
var clientServerOptions = {
url: apiUrl + 'api/javascript-obfuscator',
data: JSON.stringify(data),
method: 'POST',
headers: {'Content-Type': 'application/json'}
}

const res = await axios.request(clientServerOptions)
await message.send(res.data.code)
});