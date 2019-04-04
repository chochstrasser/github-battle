var axios = require('axios')

var id = "YOUR_CLIENT_ID"
var sec = "YOUR_SECRET_ID"
var params = "?client_id=" + id + "&client_secret=" + sec;

const getProfile = username => {
    return axios.get('https://api.github.com/users/' + username + params)
        .then(user => {
            return user.data
        })
}

const getRepos = username => {
    return axios.get('https://api.github.com/users/' + username + '/repos' + params + '&per_page=100')
}

const getStarCount = repos => {
    var reducer = (count, repo) => {
        return count + repo.stargazers_count
    }
    return repos.data.reduce(reducer, 0)
}

const calculateScore = (profile, repos) => {
    var followers = profile.followers
    var totalStars = getStarCount(repos)

    return (followers * 3) + totalStars
}

const handleError = error => {
    console.warn(error)
    return null;
}

const getUserData = player => {
    return axios.all(
        [
            getProfile(player),
            getRepos(player)
        ]
    ).then(data => {
        var profile = data[0]
        var repos = data[1]

        return {
            profile: profile,
            score: calculateScore(profile, repos)
        }
    })
}

const sortPlayers = players => {
    return players.sort((a,b) => {
        return b.score - a.score
    })
}

module.exports = {
    battle: function (players) {
        return axios.all(players.map(getUserData))
            .then(sortPlayers)
            .catch(handleError)
    },
    
    fetchPopularRepos: function (language) {
        var encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=starts:>1+language:' + language + '&sort=stars&order=desc&type=Repositories')

        return axios.get(encodedURI)
            .then(response => {
                return response.data.items
            })
    }
}