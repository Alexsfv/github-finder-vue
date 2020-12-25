<template>
    <div class="wrapper-content wrapper-content--fixed">
            <section>
                <div class="container">

                    <div class="error">
                        <p v-if="error"> {{error}} </p>
                    </div>

                    <search @getUser="getUser"/>
                    <button v-if="!user.repos" @click="getUser" class="btn btnPrimary">SEARCH!</button>
                    <button v-else @click="getUser" class="btn btnPrimary">SEARCH AGAIN!</button>

                    <div class="user-info" v-if="user.repos">
                        <div class="user-info__main">
                            <p>Имя: <b>{{ user.name }}</b> </p>
                            <p>Количество репозиториев: <b>{{ user.repos.length }}</b> </p>
                            <p>Количество подписчиков: <b> {{ user.followers }} </b></p>
                        </div>

                        <a class="user-info__img" :href="user.profile_url" target="_blank">
                            <img v-if="user.photo" :src="user.photo" :alt="user.name + 'Avatar'">
                        </a>
                    </div>
                    <div class="sort-controls">
                        <p @click="sortRepos('name')">
                            Name  
                            <span v-if="sort.sortedBy === 'name' && sort.dir === 'asc'">&#8593;</span>
                            <span v-if="sort.sortedBy === 'name' && sort.dir === 'dec'">&#8595;</span>
                        </p>
                        <p @click="sortRepos('stargazers_count')">
                            Stars  
                            <span v-if="sort.sortedBy === 'stargazers_count' && sort.dir === 'asc'">&#8593;</span>
                            <span v-if="sort.sortedBy === 'stargazers_count' && sort.dir === 'dec'">&#8595;</span>
                        </p>
                    </div>

                    <div class="repos__wrapper" v-if="user.repos">

                        <div class="repos-item" v-for="repo in sortedRepos" :key="repo.id">
                            <div class="repos-info">
                                <a :href="repo.html_url" target="_blank">{{ repo.name }}</a>
                                <span> {{repo.stargazers_count}} ⭐</span>
                            </div>
                        </div>

                    </div>

                    <p>{{ counterRepos }}</p>
                    <button class="btn btnPrimary" @click="loadMore" :disabled="lazyLoad.isAllShowed">LOAD MORE</button>

                </div>
            </section>
        </div>
</template>

<script>
import search from '../components/Search'
import axios from 'axios'

export default {
    components: {
        search
    },
    data() {
        return {
            error: null,
            user: {
                name: null,
                followers: null,
                repos: null,
                photo: null,
                profile_url: null,
            },
            sort: {
                dir: 'asc',
                sortedBy: 'name'
            },
            lazyLoad: {
                countLoadedItems: 5,
                step: 5,
                isAllShowed: false
            }

        }
    },
    computed: {
        sortedRepos() {
            if (this.lazyLoadedRepos) {
                return this.lazyLoadedRepos.sort((repoA, repoB) => {
                const filter = this.sort.sortedBy
                const mod = this.sort.dir === 'asc' ? 1 : -1
                return repoA[filter] > repoB[filter] ? 1*mod : -1*mod
            })
            }
            return null
        },
        lazyLoadedRepos() {
            if (this.user.repos) {
                return this.user.repos.filter((repo, i) => i + 1 <= this.lazyLoad.countLoadedItems)
            }
            return null
        },
        counterRepos() {
            const repos = this.user.repos
            const countLoadedItems = this.lazyLoad.countLoadedItems
            if (repos) {
                const currentCountItems = repos.length <= countLoadedItems
                    ? repos.length
                    : countLoadedItems
                const maxCountItems = repos.length
                return `${currentCountItems} / ${maxCountItems}`
            }
            return null
        }
    },
    methods: {
        resetFields() {
            this.user = {
                name: null,
                followers: null,
                repos: null,
                photo: null,
                profile_url: null,
            },
            this.sort = {
                dir: 'asc',
                sortedBy: 'name'
            },
            this.lazyLoad = {
                countLoadedItems: 5,
                step: 5,
                isAllShowed: false,
            }
        },
        getUser() {
            this.resetFields()
            this.getRepos()
            this.getShortInfo()
        },
        getRepos() {
            axios
                .get(`https://api.github.com/users/${this.$store.getters['search/getValue']}/repos`)
                .then(res => {
                    this.error = null
                    this.user.repos = res.data
                    this.checkAllReposShowed()
                })
                .catch(e => this.errorHandler(e.response.status))
        },
        getShortInfo() {
            axios
                .get(`https://api.github.com/users/${this.$store.getters['search/getValue']}`)
                .then(( {data} ) => {
                    this.user.name = data.name
                    this.user.followers = data.followers
                    this.user.photo = data.avatar_url
                    this.user.profile_url = data.html_url
                })
                .catch(e => this.errorHandler(e.response.status))
        },
        errorHandler(code) {
            switch(code) {
                case(404): {
                    this.error = 'Cant find this user!'
                }
                case(403): {
                    this.error = 'Request limit exceeded'
                }
                default: {
                    console.log(`Code Error: ${code}`)
                }
            }
        },
        sortRepos(filter) {
            if (filter === this.sort.sortedBy) {
                this.sort.dir = this.sort.dir === 'asc' ? 'dec' : 'asc'
                return
            }
            this.sort.sortedBy = filter
        },
        loadMore() {
            const maxItems = this.user.repos.length
            if (maxItems > this.lazyLoad.countLoadedItems) {
                this.lazyLoad.countLoadedItems += this.lazyLoad.step
            }
            this.checkAllReposShowed()
        },
        checkAllReposShowed() {
            if (this.user.repos.length <= this.lazyLoad.countLoadedItems) {
                this.lazyLoad.isAllShowed = true
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    align-items: center;
    flex-direction: column;
}
button {
    margin-top: 40px;
    &[disabled] {
        cursor: default;
        background-color: rgb(100, 100, 100);
        border: none;
    }
}
.repos__wrapper {
    width: 600px;
    margin: 30px 0;
}
.repos-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #dbdbdb;
}
.error {
    margin-bottom: 20px;
    p {
        color: rgb(204, 0, 0);
    }
}
.user-info {
    display: flex;
    width: 100%;
    max-width: 600px;
    margin: 30px 0;
    padding: 25px 15px;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    background-color: rgba(206, 206, 206, 0.377);

    &__main {
        line-height: 28px;
    }

    &__img {
        max-width: 128px;
        max-height: 128px;

        img {
            max-width: 100%;
            max-height: 100%;
            border-radius: 50%;
        }
    }
}
.sort-controls {
    display: flex;
    max-width: 600px;
    width: 100%;
    margin: 20px 0;
    padding: 10px 15px;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(206, 206, 206, 0.377);
    border-radius: 10px;

    p {
        font-weight: 600;
        &:hover {
            cursor: pointer;
        }
    }
}
</style>
