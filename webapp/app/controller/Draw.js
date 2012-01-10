/**
 * My Controller
 * File:    Draw.js
 * Auther:  sunvisor
 * Date:    2012-01-04
 * Copyright (C) Sunvisor 2012 All right reserved.
 */
Ext.define('Draw.controller.Draw', {

    extend: 'Ext.app.Controller',

    views: [
        'DrawPanel'
    ],

    refs: [
        {
            ref: 'DrawPanel',
            selector : 'drawpanel'
        }, {
            ref: 'DrawCompo',
            selector : 'draw'
        }, {
            ref: 'FillColor',
            selector: 'colormenu[itemId=fillColorMenu]'
        }, {
            ref: 'BorderColor',
            selector: 'colormenu[itemId=borderColorMenu]'
        }
    ],

    init: function() {
        var me = this;
        
        me.control({
            'drawpanel button[itemId=selectTool]': { click: me.onSelectToolClick },
            'drawpanel button[itemId=lineTool]': { click: me.onLineToolClick },
            'drawpanel button[itemId=rectTool]': { click: me.onRectToolClick },
            'drawpanel button[itemId=textTool]': { click: me.onTextToolClick }
        });
    },

    onLaunch: function () {
        var me = this;

        me.cmp = me.getDrawCompo();
        me.el = me.cmp.getEl();
        me.el.on('click', me.onClick, me);
        me.el.on('mousemove', me.onMouseMove, me);
        me.onSelectToolClick();
        me.getBorderColor().picker.select('#000000');
        me.getFillColor().picker.select('#000000');
        me.allGroup = me.cmp.surface.getGroup('all');
        me.selectedSprite = me.cmp.surface.add({
            type: 'rect',
            stroke: '#066',
            'stroke-width': 1
        });
        me.selectedSprite.hide();
    },

    onSelectToolClick: function () {
        var me = this;

        me.rubber = me.getController('rubber.Rect');
        me.cursor = 'default';
        me.el.setStyle({
            cursor: me.cursor
        });
        me.execute = function () {
            var rect = me.rubberBand.getBBox();

            me.rubberBand.remove();
            // select operation
            me.selectSprites(rect);
        };
    },

    selectSprites: function(rect) {
        var me = this,
            target = me.cmp.surface.getGroup('all'),
            selected = me.cmp.surface.getGroup('selected');

        selected.clear();
        target.each(function (item) {
            if( me.isInRect(item.getBBox(), rect)) {
                selected.add(item);
            }
        });
        me.showSelected();

    },

    isInRect: function(t, s) {
        var result = t.x >= s.x &&
                     t.y >= s.y &&
                     (t.x + t.width) <= (s.x + s.width) &&
                     (t.y + t.height) <= (s.y + s.height);
        return result;
    },

    showSelected: function() {
        var me = this,
            sprite,
            group = me.cmp.surface.getGroup('selected'),
            rect = group.getBBox();

        if( group.getCount() > 0 ){
            me.selectedSprite.setAttributes({
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height 
            });
            me.selectedSprite.show(true);
        } else {
            me.selectedSprite.hide(true);
        }

    },

    onLineToolClick: function () {
        var me = this;

        me.rubber = me.getController('rubber.Line');
        me.cursor = 'crosshair';
        me.el.setStyle({
            cursor: me.cursor
        });
        me.execute = function () {
            me.rubberBand.setAttributes({
                stroke: '#' + me.getBorderColor().picker.getValue()
            }, true);
            me.allGroup.add(me.rubberBand);
        };
    },

    onRectToolClick: function() {
        var me = this;

        me.rubber = me.getController('rubber.Rect');
        me.cursor = 'crosshair';
        me.el.setStyle({
            cursor: me.cursor
        });
        me.execute = function () {
            me.rubberBand.setAttributes({
                stroke: '#' + me.getBorderColor().picker.getValue(),
                fill: '#' + me.getFillColor().picker.getValue()
            }, true);
            me.allGroup.add(me.rubberBand);
        };
    },
    
    onTextToolClick: function () {
        var me = this;

        me.rubber = me.getController('rubber.Rect');
        me.on('execute', function () {
            // add text sprite
        });
    },

    onClick: function(e, t, opt) {
        var me = this,
            xy = e.getXY();

        if( !me.mouseIsDown ){
            me.mouseIsDown = true;
            me.originX = xy[0] - me.el.getLeft();
            me.originY = xy[1] - me.el.getTop();
            
            me.rubberBand = me.rubber.add(me.cmp.surface, me.originX, me.originY);
        } else {
            me.execute();
            me.mouseIsDown = false;
        }

    },

    onMouseMove: function(e, t, opt) {
        var me = this,
            xy, x, y;

        if( me.mouseIsDown ){
            xy = e.getXY();
            x = xy[0] - me.el.getLeft();
            y = xy[1] - me.el.getTop();
            me.rubber.drag(x, y);
        }
    }

});
