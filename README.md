# "Hackertron 3000" Game

This is a basic game I wrote to stay updated on React 18. The game plays a lot like Wordle, but the original concept
is actually based on Bethesda Softworks' 2015 Post-Apocalypse Open World Role Playing Game, [Fallout 4](https://fallout.bethesda.net/en/games/fallout-4).

In Fallout 4, players navigate the ruins of Boston trying to solve a mystery, interacting with different factions and making decisions. One of the mini-games that I thought was very well done was the computer hacking mini-game. Most of Bethesda/Zenimax's mini-games are fairly well done, but the hacking game using logic to pick the correct word was especially fun.

## Features

### localStorage

The code uses localStorage to store user's game stats - win/loss ratio and total score for now.

## Future Plans

If there's enough interest, I'm considering the following:
- Add a timer constraint, so you only have 2 minutes to complete the puzzle.
- Convert "points" to "currency" and add a "store" that uses the currency to buy power ups, e.g. you have to start with Novice (4-letter) puzzles and earn enough points to purchase 5-letter puzzles, the ability to buy additional power ups
- Convert to installable PWA for web, or ReactNative for mobile.
- Add the ability to create an account and save user stats on my server (LAMP stack).

## Generation of Framework and Files

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Word Generation

The words used in the puzzle were generated using [ChatGPT 3.5](https://openai.com/). For some reason, ChatGPT 3.5 (I didn't attempt it in newer versions) struggled to generate lists of words with a particular word length, or not adding duplicate words, despite me specifying that in the query. I wanted to leave room open to add words, so I dumped the output into a file called 'raw-words.json' in src/scriptAssets.

To add words, simply add them in the JS Array format to that file, then navigate to the 'src/cliScripts' folder in a commnad line tool and type `node validate-words.mjs`.

## Available NPM Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
