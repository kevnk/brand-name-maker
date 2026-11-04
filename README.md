# Brand Name Maker

Fully inspired by [Ben Pieratt](https://twitter.com/pieratt)'s [3-step process for naming a project](http://blog.pieratt.com/post/77293289254/a-3-step-process-for-naming-a-projectproduct). You should check it out first.

Live at <https://www.kevnk.com/brand-name-maker/>.

## How it works
1. **Feelings:** type a feeling you want your brand to evoke and press Enter. List 2–5.
2. **Embodiment:** pick a feeling's tab, then list persons, places, things or phrases that embody it.
3. **Characteristic:** pick an embodiment's tab, then name a specific characteristic of it.

**FINISH** shows every characteristic you wrote. **BACK** returns to a step, and **×** removes an entry.

Your work is kept in the browser's localStorage, so a reload doesn't lose it. **Clear & Start Over** saves the current work as a numbered project, then clears it. Reopen a saved project under **Load Previous Project**.

## Development
Use Node 22 (`nvm use` reads `.nvmrc`). On Node 24 and 26, `yarn serve` crashes with `No such module: http_parser` (webpack-dev-server 3), though build, test and lint still work. `yarn test` needs Node 22.15 or later.

```
yarn install
yarn serve    # dev server with hot reload: http://localhost:8080/brand-name-maker/
yarn test     # node:test + jsdom, no browser or network
yarn lint     # ESLint + eslint-plugin-vue (Vue 2 essential rules)
yarn build    # production build into dist/
```

`serve` and `build` set `NODE_OPTIONS=--openssl-legacy-provider`, which webpack 4 needs on Node 17 and later.

### Deploy
GitHub Pages serves the `gh-pages` branch. `yarn deploy` pushes the committed `dist/` folder to it with `git subtree push`, so build and commit `dist/` first:
```
yarn build
git add dist
git commit -m "Build"
yarn deploy
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/). `vue.config.js` sets `publicPath` to `/brand-name-maker/`.


### Ideas for Improvements
- Start with naming the project so you can save projects 
- Vuex so we can more easily separate components
- Use a real DB with user sign-in OR [Immortal DB](https://github.com/gruns/ImmortalDB)
- VueRouter so we can more easily navigate through steps
    - Specifically, when returning back to the site after completing a couple steps
- Rethink full UX 
    - More focus on the input 
    - Less focus on other things
- On results, integrate with [Domainr API](https://domainr.com/docs/api) to show which domains are available for each name
- On results, create "random" combinations/mix-and-match results using what they created
- Integrate with [some](https://words.bighugelabs.com/api.php) [thesaurus](https://dictionaryapi.com/products/api-collegiate-thesaurus)/[word](https://www.wordsapi.com/) [API](https://www.programmableweb.com/api/thesaurus) to list other ideas based on past input
- Create a team project to be able to share different parts of contribution
