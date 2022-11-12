import { useState, useEffect } from 'react'
// import AiFillStar from 'react-icons/ai'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import './App.css'
import { fetchStocks, fetchStockDetails, IStock, IStockSymbol } from './utils'

function App() {
	const [query, setQuery] = useState('')
	const [stocks, setStocks] = useState<IStockSymbol[]>([])
	const [selectedStock, setSelectedStock] = useState<IStock>()
	const [recentSearches, setRecentSearches] = useState<string[]>([])
	const [error, setError] = useState('')

	const getStocks = async () => {
		if (query.length === 0) {
			setStocks([])
			return
		}
		try {
			const stockSymbols = await fetchStocks(query)
			setStocks(stockSymbols)
		} catch (e) {
			console.error('There was an issue fetching stocks data from query', e)
		}
	}

	const getStockDetails = async (stock: IStockSymbol) => {
		try {
			const stockDetails = await fetchStockDetails(stock)
			if (stockDetails.Note)
				setError("You've exceeded your API call limit. Please try again later.")

			setSelectedStock(stockDetails)
			setStocks([])
			setQuery('')
			setRecentSearches([stock.symbol, ...recentSearches])
		} catch (e) {
			console.error('There was an issue fetching stock details', e)
		}
	}

	useEffect(() => {
		getStocks()
	}, [query])

	useEffect(() => {
		if (recentSearches.length > 5) {
			setRecentSearches(recentSearches.slice(0, 5))
		}
	}, [recentSearches])

	return (
		<div className="App">
			<h1>Search Stock Symbols</h1>
			<div className="search-container">
				<input
					type="text"
					value={query}
					onChange={e => setQuery(e.target.value)}
					className="search-input"
				/>
			</div>
			{stocks.length > 0 && (
				<div className="results-container">
					{stocks.map(stock => (
						<div key={stock.symbol} className="result-item" onClick={() => getStockDetails(stock)}>
							{stock.symbol} - {stock.name}
						</div>
					))}
				</div>
			)}
			{error && <div className="error">{error}</div>}
			{selectedStock && !error && (
				<div className="stock-details">
					<p>{selectedStock.symbol}</p>
					<div className="stock-price-and-fave">
						<p>${selectedStock.price}</p>
						{selectedStock.isFavorite ? (
							<AiFillStar
								className="star-selected"
								onClick={() => {
									const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
									const newFavorites = favorites.filter(
										(favorite: string) => favorite !== selectedStock?.symbol,
									)
									localStorage.setItem('favorites', JSON.stringify(newFavorites))
									setSelectedStock({ ...selectedStock, isFavorite: false })
								}}
							/>
						) : (
							<AiOutlineStar
								className="star-unselected"
								onClick={() => {
									const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
									const newFavorites = [...favorites, selectedStock?.symbol]
									localStorage.setItem('favorites', JSON.stringify(newFavorites))
									setSelectedStock({ ...selectedStock, isFavorite: true })
								}}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default App
