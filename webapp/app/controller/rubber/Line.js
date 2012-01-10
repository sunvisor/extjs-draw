/**
* 
* File:    Line.js
* Auther:  sunvisor
* Date:    2012-01-06
* Copyright (C) Sunvisor 2012 All right reserved.
**/
Ext.define('Draw.controller.rubber.Line', {
    
    extend: 'Ext.app.Controller',
    
    init: function () {
        var me = this;
        
    },

    add: function(surface, x, y) {
        var me = this;

        me.sprite = Ext.create('Ext.draw.Sprite', {
            surface: surface,
            type: 'path',
            stroke: '#666',
            'stroke-width': 1,
            path: Ext.String.format('M{0} {1} L{0} {1}', x, y)
        });
        me.originX = x;
        me.originY = y;
        return me.sprite;
    },

    drag: function(x, y) {
        var me = this;

        me.sprite.setAttributes({
            path: Ext.String.format('M{0} {1} L{2} {3}', me.originX, me.originY, x, y)
        }, true);

    }
    
});
