# Brand Name Maker

Fully inspired by [Ben Pieratt](https://twitter.com/pieratt)'s [3-step process for naming a project](http://blog.pieratt.com/post/77293289254/a-3-step-process-for-naming-a-projectproduct). You should check it out first.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Deploy `/dist` as subtree to `gh-page` branch
```
yarn run deploy
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


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