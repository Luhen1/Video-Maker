const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')

async function robot(content)
{
	console.log("> [text-robot]: Booting...")
	
	await fetchContentFromWikipedia(content)
	sanitizeContent(content)
	breakContentIntoSentences(content)


	async function fetchContentFromWikipedia(content)
	{
		console.log("> [text-robot]: Fetching information from Wikipedia! ")
		const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
		const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
		const wikipediaResponde = await wikipediaAlgorithm.pipe(content.searchTerm) //pipe function/parameters will act as to do list of all functions ex. ( pipe( ChegarEmCasa, Cagar, Comer, Dormir) ) 
		const wikipediaContent = wikipediaResponde.get()
		
		content.sourceContentOriginal = wikipediaContent.content

		console.log("> [text-robot]: Fetching done Master! Here it is!")
		/*
		 * 1. autenticacao
		 * 2. define o algorithmo
		 * 3. executa
		 * 4. captura o valor
		 */
		
	}


	function sanitizeContent(content) 
	{
		const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
		const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)
		console.log(withoutDatesInParentheses)

		content.sourceContentSanitized = withoutDatesInParentheses
		
		function removeBlankLinesAndMarkdown(text) 
		{	
			const allLines = text.split("\n")
						
			const withoutBlankLinesAndMarkdown = allLines.filter((line) => 
				{
					if (line.trim().length === 0 || line.trim().startsWith('='))
					{return false}
				return true
				})
			return withoutBlankLinesAndMarkdown.join(' ')
		}
		
		function removeDatesInParentheses(text)
		{
			return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm,'').replace(/  /g, ' ')
		}
		
	}
		function breakContentIntoSentences(content)
		{	
			content.sentences = []

			const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
			sentences.forEach((sentence) => 
			{
				content.sentences.push(
					{
						text: sentence,
						keywords: [],
						image: [],
					})
			})			
		}	
	
}
module.exports = robot // return command with ability for other files to access the variables of this file
