import React from 'react';
import PropTypes from 'prop-types';
import { fetchPopularRepos } from '../utils/api';
import Loading from './Loading';

// Stateless functional component
const SelectLanguage = ({ selectedLanguage, onSelect }) => {
    const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python', 'C#', 'PHP']
    return (
        <ul className='languages'>
            {languages.map(lang => {
                return (
                    <li 
                        style={lang === selectedLanguage ? { color: '#d0021b' } : null}
                        onClick={() => onSelect(lang)}
                        key={lang}>
                        {lang}
                    </li>
                )
            })}
        </ul>
    )
}

const RepoGrid = ({ repos }) => {
    return (
        <ul className='popular-list'>
            {repos.map(({ name, owner: { avatar_url, login }, html_url, stargazers_count }, index) => (
                <li key={name} className='popular-item'>
                    <div className='popular-rank'>
                        #{index + 1}
                        <ul className='space-list-items'>
                            <li>
                                <img 
                                    className='avatar'
                                    src={avatar_url}
                                    alt={'Avatar for ' + login}
                                />
                            </li>
                            <li>
                                <a href={html_url}>
                                    {name}
                                </a>
                            </li>
                            <li>@{login}</li>
                            <li>{stargazers_count} stars</li>
                        </ul>
                    </div>
                </li>
            ))}
        </ul>
    )
}

RepoGrid.propTypes = {
    repos: PropTypes.array.isRequired,
}

SelectLanguage.propTypes = {
    selectedLanguage: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
}

class Popular extends React.Component {
    state = {
        selectedLanguage: 'All',
        repos: null
    }

    componentDidMount () {
        this.updateLanguage(this.state.selectedLanguage)
    }

    updateLanguage =  async lang => {
        this.setState(() => ({
            selectedLanguage: lang,
            repos: null
        }))
        const repos = await fetchPopularRepos(lang);
        this.setState(() => ({ repos }));
    }

    render() {
        const { selectedLanguage, repos } = this.state
        return (
            <div>
                <SelectLanguage
                    selectedLanguage={selectedLanguage}
                    onSelect={this.updateLanguage}
                />
                { !repos ? <Loading /> : <RepoGrid repos={repos} /> }
            </div>
        )
    }
}

export default Popular;