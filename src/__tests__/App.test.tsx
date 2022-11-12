import { render } from '@testing-library/react'
import App from '../App'

// Mock fetchStocks and fetchStockDetails functions
jest.mock('../utils', () => ({
	fetchStocks: jest.fn(() =>
		Promise.resolve([
			{
				symbol: 'AAPL',
				name: 'Apple Inc.',
				isFavorite: false,
			},
			{
				symbol: 'MSFT',
				name: 'Microsoft Corporation',
				isFavorite: false,
			},
		]),
	),
	fetchStockDetails: jest.fn(() =>
		Promise.resolve({
			symbol: 'AAPL',
			name: 'Apple Inc.',
			price: 100,
			isFavorite: false,
		}),
	),
}))

describe('App', () => {
	it('should work as expected', () => {
		render(<App />)
	})
})
