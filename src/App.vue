<template>
    <div class="wrapper">

        <header>
            <div class="navbar">
                <div class="container">

                    <div class="navbar-content">
                        <div class="logo">GitHub Finder</div>
                        <!-- <ul class="navbar-list">

                            <li
                                v-for="(link, i) in links"
                                class="navbar-item"
                                :key="i + link.url"
                            >
                                <router-link :to="link.url" class="navbar-link">{{ link.title }}</router-link>
                            </li>

                        </ul> -->
                    </div>

                </div>
            </div>
        </header>

        <router-view></router-view>

    </div>
</template>

<script>
export default {
    data() {
        return {
            links: [
                { title: 'Home', url: '/' },
                { title: 'Example', url: '/example' },
            ]
        }
    }
}
</script>

<style lang="scss">
.navbar-link {
    &.router-link-exact-active {
        color: #5247e7;
    }
}

</style>
