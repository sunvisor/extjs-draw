/**
* 
* File:    Rect.js
* Auther:  sunvisor
* Date:    2012-01-06
* Copyright (C) Sunvisor 2012 All right reserved.
**/
Ext.define('Draw.controller.rubber.Rect', {
    
    extend: 'Ext.app.Controller',
    
    init: function () {
        var me = this;
        
    },

    add: function(surface, x, y) {
        var me = this;

        me.sprite = Ext.create('Ext.draw.Sprite', {
            surface: surface,
            type: 'rect',
            stroke: '#666',
            'stroke-width': 1,
            x: x,
            y: y,
            width: 0,
            height: 0
        });
        me.originX = x;
        me.originY = y;
        return me.sprite;
    },

    drag: function(x, y) {
        var me = this,
            w, h;

        w = Math.abs(x - me.originX);
        h = Math.abs(y - me.originY);
        x = x < me.originX ? x : me.originX;
        y = y < me.originY ? y : me.originY;
        
        me.sprite.setAttributes({
            width: w,
            height: h,
            x: x,
            y: y
        }, true);

    }
    
});
