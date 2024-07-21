import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

export const pusherServer = new PusherServer({
    appId: "1794195",
    key: "403e59777051aeefcdad",
    secret: "d766ae1e53a7b8301b39",
    cluster: "ap1",
    useTLS: true
})

export const pusherClient = new PusherClient("403e59777051aeefcdad", {

    cluster: "ap1",
});

