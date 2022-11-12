import { useState, useEffect } from 'react'
// import AiFillStar from 'react-icons/ai'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import './App.css'
import { fetchStocks, fetchStockDetails, IStock, IStockSymbol } from './utils'

function App() {
	const [query, setQuery] = useState('')
	const [stocks, setStocks] = useState<IStockSymbol[]>([])
	const [selectedStock, setSelectedStock] = useState<IStock>()
	const [recentSearches, setRecentSearches] = useState<IStock[]>([])
	const [favorites, setFavorites] = useState<IStock[]>([])
	const [error, setError] = useState('')

	const handleFavorite = (stock: IStock) => {
		const isFavorite = favorites.find(fav => fav.symbol === stock.symbol)
		if (isFavorite) {
			setFavorites(favorites.filter(fav => fav.symbol !== stock.symbol))
		} else {
			setFavorites([...favorites, stock])
		}
	}

	const getStocks = async () => {
		if (query.length === 0) {
			setStocks([])
			return
		}

		const recentSearch = recentSearches.find(search => search.symbol === query)
		if (recentSearch) {
			setSelectedStock(recentSearch)
			setStocks([])
			return
		}
		const favorite = favorites.find(fav => fav.symbol === query)
		if (favorite) {
			setSelectedStock(favorite)
			setStocks([])
			return
		}

		try {
			const stockSymbols = await fetchStocks(query)
			if (stockSymbols.Note) {
				setError("You've exceeded your API call limit. Please try again later.")
				setStocks([])
				return
			}
			setStocks(stockSymbols)
		} catch (e) {
			console.error('There was an issue fetching stocks data from query', e)
		}
	}

	const getStockDetails = async (symbol: string, isFavorite: boolean) => {
		try {
			const stockDetails = await fetchStockDetails(symbol, isFavorite)
			if (stockDetails.Note) {
				setError("You've exceeded your API call limit. Please try again later.")
				setStocks([])
				return
			}

			setSelectedStock(stockDetails)
			setStocks([])
			setQuery('')
			setRecentSearches(prev => {
				const isDuplicate = prev.some(item => item.symbol === stockDetails.symbol)
				if (isDuplicate) return prev
				return [stockDetails, ...prev]
			})
		} catch (e) {
			console.error('There was an issue fetching stock details', e)
		}
	}

	useEffect(() => {
		const recentSearches = localStorage.getItem('recentSearches')
		if (recentSearches) {
			console.log('recentSearches', JSON.parse(recentSearches))
			setRecentSearches(JSON.parse(recentSearches))
		}

		const favorites = localStorage.getItem('favorites')
		if (favorites) {
			setFavorites(JSON.parse(favorites))
		}
	}, [])

	useEffect(() => {
		getStocks()
	}, [query])

	useEffect(() => {
		if (!recentSearches.length) return
		if (recentSearches.length > 5) {
			setRecentSearches(recentSearches.slice(0, 5))
		}
		localStorage.setItem('recentSearches', JSON.stringify(recentSearches))
	}, [recentSearches])

	useEffect(() => {
		if (!favorites.length) return
		localStorage.setItem('favorites', JSON.stringify(favorites))
	}, [favorites])

	return (
		<div className="app-container">
			<div className="recent-searches-container">
				<h2>Recent Searches</h2>
				{recentSearches.map(search => (
					<div
						key={search.symbol}
						className="recent-search-item"
						onClick={() => getStockDetails(search.symbol, search.isFavorite)}
					>
						{search.symbol} - {search.price}
						{favorites.find(fav => fav.symbol === search.symbol) ? (
							<AiFillStar className="star-selected" onClick={() => handleFavorite(search)} />
						) : (
							<AiOutlineStar className="star-unselected" onClick={() => handleFavorite(search)} />
						)}
					</div>
				))}
			</div>
			<div className="search-container">
				<h1>Search Stock Symbols</h1>
				<div className="search-input-container">
					<input
						type="text"
						value={query}
						onChange={e => {
							setError('')
							setSelectedStock(undefined)
							setQuery(e.target.value)
						}}
						className="search-input"
					/>
				</div>
				{stocks.length > 0 && (
					<div className="results-container">
						{stocks.map(stock => (
							<div
								key={stock.symbol}
								className="result-item"
								onClick={() => getStockDetails(stock.symbol, stock.isFavorite)}
							>
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
							{favorites.find(fav => fav.symbol === selectedStock.symbol) ? (
								<AiFillStar
									className="star-selected"
									onClick={() => handleFavorite(selectedStock)}
								/>
							) : (
								<AiOutlineStar
									className="star-unselected"
									onClick={() => handleFavorite(selectedStock)}
								/>
							)}
						</div>
					</div>
				)}
			</div>
			<div className="favorites-container">
				<h2>Favorites</h2>
				{favorites.map(favorite => (
					<div
						key={favorite.symbol}
						className="favorite-item"
						onClick={() => getStockDetails(favorite.symbol, favorite.isFavorite)}
					>
						{favorite.symbol} - {favorite.price}
						<AiFillStar className="star-selected" onClick={() => handleFavorite(favorite)} />
					</div>
				))}
			</div>
		</div>
	)
}

export default App
