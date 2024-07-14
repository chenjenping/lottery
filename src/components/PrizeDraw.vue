<template>
    <div class="w-80">
        <div id="firebaseui-auth-container"></div>
        <button
            v-if="canDraw"
            @click="draw"
            class="px-4 py-2 w-full font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm"
        >
            抽獎
        </button>
        <p v-else>等候中</p>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { initializeApp } from 'firebase/app';
    import { getAuth, GoogleAuthProvider } from 'firebase/auth';
    import { getDatabase, ref as fRef, onValue, update } from 'firebase/database';
    import * as firebaseui from 'firebaseui'
    import firebaseConfig from '../config';
    import 'firebaseui/dist/firebaseui.css'

    const canDraw = ref(false);
    initializeApp(firebaseConfig);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const db = getDatabase();
    const boardRef = fRef(db, 'boards/1');
    const boardLoadingRef = fRef(db, 'boards/1/loading')
    const boardUsersRef = fRef(db, 'boards/1/users')
    const boardResultRef = fRef(db, 'boards/1/result')
    let login: any;
    let users: any;
    let loading = true;
    let drew = false;
    const ui = new firebaseui.auth.AuthUI(auth);
    const uiConfig = {
        signInOptions: [
            provider.providerId
        ],
        signInFlow: 'popup',
        signInSuccessUrl: import.meta.env.VITE_REDIRECT_URL + '/draw'
    };
    auth.onAuthStateChanged(function (user) {
        if (user) {
            login = user;
            onValue(boardUsersRef, (snapshot) => {
                users = snapshot.val() ?? {};
                if (!drew && !users[user.uid]) {
                    update(boardUsersRef, { [user.uid]: Date.now() });
                }
                let min = true;
                const time = users[user.uid];
                for (const uid in users) {
                    if (users[uid] < time) {
                        min = false;
                    }
                }
                if (!loading && time && min) {
                    canDraw.value = true;
                }
            });
        } else {
            ui.start('#firebaseui-auth-container', uiConfig);
        }
    });

    onValue(boardLoadingRef, (snapshot) => {
        loading = snapshot.val();
    });

    onValue(boardResultRef, (snapshot) => {
        const result: any = snapshot.val() ?? {};
        if (result[login.uid]) {
            alert('恭喜您抽中 ' + result[login.uid] + '!');
            update(boardRef, { result: null });
        }
    });

    function draw() {
        canDraw.value = false;
        drew = true;
        update(boardRef, { loading: true });
    }
</script>