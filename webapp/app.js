/**
* Application Class
* File:    app.js
* Auther:  sunvisor
* Date:    2012-01-04
* Copyright (C) Sunvisor 2012 All right reserved.
**/
Ext.Loader.setConfig({
    enabled: true
});
Ext.application({
    name: 'Draw',
    autoCreateViewport: true,

    controllers: [
        'Draw',
        'rubber.Rect'
    ],

    launch: function() {

    }
});
