<template>
    <div class="terminal">
        terminal {{ txt }}

        <div @click="onConnect()">连接</div>
        <div @click="onMessage()">发消息</div>
        <div @click="onClose()">关闭</div>
    </div>
</template>

<script>
export default {
    name: 'Terminal',
    data() {
        return {
            txt: '999'
        }
    },
    created() {
        let that = this;
        let namespace = '/test';
        // var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);
        var socket = io.connect(location.protocol + '//' + '169.254.100.201' + ':' + '5000' + namespace);

        socket.on('connect', function() {
            socket.emit('my_event', {data: 'I\'m connected!'});
        });

        socket.on('my_response', function(msg) {
            // $('#log').append('<br>' + $('<div/>').text('Received #' + msg.count + ': ' + msg.data).html());
            that.txt = that.txt + msg.data;
        });
    },
    mounted() {

    },
    methods: {
        // onConnect: function() {
        //     socket.on('connect', function() {
        //         socket.emit('my_event', {data: 'I\'m connected!'});
        //     });

        //     that.onMessage()
        // },
        onMessage: function() {
            socket.on('my_response', function(msg) {
                // $('#log').append('<br>' + $('<div/>').text('Received #' + msg.count + ': ' + msg.data).html());
                that.txt = that.txt + msg.data;
            });
        },
        onClose: function() {
            socket.emit('disconnect_request');
        },
        onSocket: function() {
            console.log('onSocket')
        }
    }
}
</script>

<style>
.terminal {
    background-color: red;
}
</style>


