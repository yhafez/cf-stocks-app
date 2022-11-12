# Channel Factory Stocks App

This is a simple stock search app that allows you to search for stock symbols and view their price. You can also add stocks to your favorites list and view them later. This application took me two hours to build.

To run the application, first clone the repository to your local machine

```
git clone https://github.com/yhafez/cf-stocks-app.git
```

Next, navigate to the repository in your terminal of choice. Once you are the top-level directory of the application, install the project dependencies. For best results, use pnpm, as this is the package manager I used during development.

```
pnpm install
```

In order to get the application to function properly, you must sign-up for a free API key from [Alphavantage](https://www.alphavantage.co/support/#api-key).

After signing up for a free api key, you will need to create a `.env` file at the top-level of the directory. In the .env file, add a key with the name `VITE_ALPHAVANTAGE_API_KEY` to the first line and set it's value to the API key you signed up for. It should look something like this:

```
VITE_ALPHAVANTAGE_API_KEY=yourkey
```

Finally, run `pnpm start:dev` and navigate to http://localhost:3000 to interact with the application.
