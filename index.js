// Orquestrador
const readline = require('readline-sync')
const Parser = require('rss-parser')
const TREND_URL = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=BR'
const robots = { text: require("./robots/text.js") }
async function start()
{
	const content = {}
	
	content.searchTerm = await askAndReturnSearchTerm()
	content.prefix = askAndReturnPrefix()

	await robots.text(content)
	
	async function askAndReturnSearchTerm()
	{ 
		const response = readline.question("Type a wikipedia search term or G to fetch google trends") 
		return (response.toUpperCase() === 'G') ? await askAndReturnTrend() : response
	}

	async function askAndReturnTrend() 
	{
		console.log("Please wait...")
		const trends = await getGoogleTrends()
		const choice = readline.keyInSelect(trends, "Choose you trend: ")

		return trends[choice]
	}

	async function getGoogleTrends()
	{
		const parser = new Parser()
		const trends = await parser.parseURL(TREND_URL)
		return trends.items.map(({title}) => title)
	}
			
	function askAndReturnPrefix()
	{
		const prefixes = ["Who is", "What is", "The history of"]
		const selectedPrefixIndex = readline.keyInSelect(prefixes, "Choose one option: ")
		const selectedPrefixText = prefixes[selectedPrefixIndex]

		return selectedPrefixText
	}
	
	console.log(content)
}

start()
