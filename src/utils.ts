export interface IStockSymbolData {
	'1. symbol': string
	'2. name': string
	'3. type': string
	'4. region': string
	'5. marketOpen': string
	'6. marketClose': string
	'7. timezone': string
	'8. currency': string
	'9. matchScore': string
}

export interface IStockSymbol {
	symbol: string
	name: string
	isFavorite: boolean
}

export interface IStock {
	symbol: string
	price: string
	isFavorite: boolean
}

export const fetchStocks = async (query: string) => {
	const response = await fetch(
		`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${
			import.meta.env.VITE_ALPHAVANTAGE_API_KEY
		}`,
	)
	const data = await response.json()
	const stockSymbols = data.bestMatches.map((stock: IStockSymbolData) => ({
		symbol: stock['1. symbol'],
		name: stock['2. name'],
		isFavorite:
			JSON.parse(localStorage.getItem('favorites') || '[]').includes(stock['1. symbol']) || false,
	}))
	return stockSymbols
}

export const fetchStockDetails = async (stock: IStockSymbol) => {
	const response = await fetch(
		`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${
			import.meta.env.VITE_ALPHAVANTAGE_API_KEY
		}`,
	)
	const data = await response.json()
	if (data.Note) return data
	const stockDetails = data['Global Quote']
	return {
		symbol: stockDetails['01. symbol'],
		price: stockDetails['05. price'],
		isFavorite: stock.isFavorite,
	}
}
