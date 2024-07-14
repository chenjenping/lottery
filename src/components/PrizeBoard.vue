<template>
    <h1>抽獎</h1>
    <div id="firebaseui-auth-container"></div>
    <div class="grid grid-cols-4 gap-4 mt-4">
        <div
            v-for="item in items"
            :key="item.id"
            class="rounded bg-white"
            :class="item.class">
            <img
                class="m-2 w-28 h-28 rounded border-4"
                :class="{ 'border-red-400': (item.id === active) }"
                :src="item.image"
            >
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { initializeApp } from 'firebase/app';
    import { getDatabase, ref as fRef, onValue, update } from 'firebase/database';
    import firebaseConfig from '../config';
    import 'firebaseui/dist/firebaseui.css'
    import vueIcon from '../assets/vuejs.svg';
    import sassIcon from '../assets/sass.svg';
    import reactIcon from '../assets/react.svg';
    import pythonIcon from '../assets/python.svg';
    import nodeIcon from '../assets/node-js.svg';
    import jsIcon from '../assets/js.svg';
    import htmlIcon from '../assets/html5.svg';
    import golangIcon from '../assets/golang.svg';
    import gitIcon from '../assets/git.svg';
    import figmaIcon from '../assets/figma.svg';
    import dockerIcon from '../assets/docker.svg';
    import cssIcon from '../assets/css3-alt.svg';

    initializeApp(firebaseConfig);
    const db = getDatabase();
    const boardRef = fRef(db, 'boards/1');
    const boardLoadingRef = fRef(db, 'boards/1/loading');
    const boardUsersRef = fRef(db, 'boards/1/users');
    const boardResultRef = fRef(db, 'boards/1/result');
    let loading = false;
    let users: any = {};
    let result: any;
    let round = 1;
    let minUid: any = null;

    onValue(boardLoadingRef, (snapshot) => {
        loading = snapshot.val();
        if (loading) {
            result = Math.floor(Math.random() * 12) + 1;

            const interval = setInterval(() => {
                active.value = (active.value === 12) ? 1 : active.value + 1;
                if (active.value === 12) {
                    round++;
                }
                if (round === 3 && active.value === result) {
                    round = 1;
                    clearInterval(interval);
                    if (minUid) {
                        update(boardUsersRef, { [minUid]: null } )
                        const prize = items.filter(function (item) {
                            return item.id === result;
                        });
                        update(boardResultRef, { [minUid]: prize[0].name } );
                    }
                    update(boardRef, { loading: false });
                }
            }, 300);
        }
    });

    onValue(boardUsersRef, (snapshot) => {
        users = snapshot.val();
        let time = null;
        for (let uid in users) {
            if (!time || users[uid] < time) {
                minUid = uid;
                time = users[uid];
            }
        }
    });

    const items = [
        { 'id': 1, 'class': 'col-start-1 col-span-1', 'name': 'vue', 'image': vueIcon },
        { 'id': 2, 'class': 'col-start-2 col-span-1', 'name': 'sass', 'image': sassIcon },
        { 'id': 3, 'class': 'col-start-3 col-span-1', 'name': 'react', 'image': reactIcon },
        { 'id': 4, 'class': 'col-start-4 col-span-1', 'name': 'python', 'image': pythonIcon },
        { 'id': 12, 'class': 'col-start-1 col-span-1', 'name': 'node.js', 'image': nodeIcon },
        { 'id': 5, 'class': 'col-start-4 col-span-1', 'name': 'js', 'image': jsIcon },
        { 'id': 11, 'class': 'col-start-1 col-span-1', 'name': 'html', 'image': htmlIcon },
        { 'id': 6, 'class': 'col-start-4 col-span-1', 'name': 'golang', 'image': golangIcon },
        { 'id': 10, 'class': 'col-start-1 col-span-1', 'name': 'git', 'image': gitIcon },
        { 'id': 9, 'class': 'col-start-2 col-span-1', 'name': 'figma', 'image': figmaIcon },
        { 'id': 8, 'class': 'col-start-3 col-span-1', 'name': 'docker', 'image': dockerIcon },
        { 'id': 7, 'class': 'col-start-4 col-span-1', 'name': 'css', 'image': cssIcon }
    ];
    let active = ref(1);
</script>
