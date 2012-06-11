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
        me.el.on('mousedown', me.onMouseDown, me);
        me.el.on('mouseup', me.onMouseUp, me);
        me.el.on('mousemove', me.onMouseMove, me);
        me.onSelectToolClick();
        me.getBorderColor().picker.select('#000000');
        me.getFillColor().picker.select('#000000');
        me.allGroup = me.cmp.surface.getGroup('all');
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

        me.removeHandle();
        if( group.getCount() > 0 ){
            group.setAttributes({ draggable: true});
            me.selectHandle = me.createHandle(rect);
        }

    },

    createHandle: function (rect) {
        var me = this,
            surface = me.cmp.surface,
            groupName = 'handle',
            midx = rect.x + (rect.width / 2),
            midy = rect.y + (rect.height / 2),
            x2 = rect.x + rect.width,
            y2 = rect.y + rect.height;

        me.addHandle(rect.x, rect.y, 'nw-resize');
        me.addHandle(x2, rect.y, 'ne-resize');
        me.addHandle(rect.x, y2, 'sw-resize');
        me.addHandle(x2, y2, 'se-resize');
        me.addHandle(midx , rect.y, 'n-resize');
        me.addHandle(midx , y2, 's-resize');
        me.addHandle(rect.x, midy, 'w-resize');
        me.addHandle(x2, midy, 'e-resize');

        return me.cmp.surface.getGroup(groupName);

    },

    addHandle: function (x, y, cursor) {
        var me = this,
            handle,
            sizeh = 3;
            
        handle = me.cmp.surface.add({
            type: 'rect',
            fill: '#ffffff',
            stroke: '#000000',
            'stroke-width': 1,
            x: x - sizeh,
            y: y - sizeh,
            width: sizeh * 2,
            height: sizeh * 2,
            group: 'handle',
            style: {
                cursor: cursor
            }
        }).show(true);
    },

    removeHandle: function () {
        var me = this,
            grp = me.cmp.surface.getGroup('handle');

        grp.each(function(item) {
            item.remove();
        });
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

    onMouseDown: function(e, t, opt) {
        var me = this,
            xy = e.getXY();

        me.mouseIsDown = true;
        me.originX = xy[0] - me.el.getLeft();
        me.originY = xy[1] - me.el.getTop();
        
        me.rubberBand = me.rubber.add(me.cmp.surface, me.originX, me.originY);
    },

    onMouseUp: function(e, t, opt) {
        var me = this;

        me.execute();
        me.mouseIsDown = false;
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
