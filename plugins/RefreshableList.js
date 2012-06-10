Ext.apply(Ext.anims, {
	rotate: new Ext.Anim({
		autoClear: false,
		out: false,
		before: function(el) {
			var d = '';
			if (this.dir == 'ccw') {
				d = '-';
			}
			this.from = {
				'-webkit-transform': 'rotate(' + d + '' + this.fromAngle + 'deg)'
			};
			this.to = {
				'-webkit-transform': 'rotate(' + d + '' + this.toAngle + 'deg)'
			};
		}
	})
});
Ext.define("Ext.ux.kohactive.RefreshableList", {
	extend: "Ext.dataview.List",
	alias: "widget.RefreshableList",
	langPullRefresh: 'Pull down to refresh...',
	langReleaseRefresh: 'Release to refresh...',
	langLoading: 'Loading...',
	loading: false,
	onPullRefresh: function() {
		if (this.getStore()) {
			this.getStore().load();
		}
	},
	hasRendered: false,
	elOffset: 27,
	// private
	init: function(cmp) {
		this.cmp = cmp;
		this.lastUpdate = new Date();
		cmp.loadingText = undefined;
		cmp.on('painted', this.initPullHandler, this);
	},
	// private
	resetPulldown: function(offset) {
		this.prevState = this.state;
		this.state = undefined;
		this.pullTpl.overwrite(this.pullEl, {
			h: offset.y,
			m: this.langPullRefresh,
			l: this.lastUpdate
		});
		this.pullEl.setY(-this.elOffset);
		this.pullEl.hide();
		
		this.loading = false;
		if (this.prevState == 1) {
			Ext.Anim.run(this.pullEl.down('.arrow'), 'rotate', {
				dir: 'cw',
				fromAngle: 180,
				toAngle: 0
			});
		}
	},
	initPullHandler: function() {
		if (!this.hasRendered) {
			this.hasRendered = true;
			this.pullTpl = new Ext.XTemplate(
			['<div class="pullrefresh" style="height: {h}; text-align: bottom;">',
			 '<div class="msgwrap" style="height: 75px; bottom: 0px; position: relative;">',
			 '<span class="arrow {s}"></span>' + '<span class="msg">{m}</span>',
			 '<span class="lastupdate">Last Updated: {[this.formatDate(values.l)]}</span>',
			 '</div>',
			 '</div>'].join(""), {
				formatDate: function(l) {
					return Ext.Date.format(l, "g:i:s A");
				}
			});
			var scrollerArea = this.cmp.getScrollable().getElement().dom;
			this.pullEl = this.pullTpl.applyTemplate({
				h: 0,
				m: this.langPullRefresh,
				l: this.lastUpdate
			}, true);
			var myContainer = document.createElement("div");
			myContainer.innerHTML = this.pullEl;
			this.pullEl = myContainer.firstChild;
			this.cmp.element.dom.insertBefore(this.pullEl, scrollerArea);
			this.pullEl = Ext.get(this.pullEl);
			this.pullEl.setY(-this.elOffset);
			this.pullEl.hide();
			this.cmp.getScrollable().getScroller().on('scroll', this.handlePull, this);
		}
	},
	//private
	handlePull: function(a, b, c, d, e) {
		this.pullEl.show();
		var offset = {
			x: b,
			y: c * -1
		};
		var scroller = a;
		if (scroller.getDirection() === 'vertical' && !this.loading) {
			if (offset.y > 0) {
				this.pullEl.setY(offset.y - this.elOffset);
				if (offset.y > (this.elOffset * 2.7)) {
					// state 1
					if (this.state !== 1) {
						this.prevState = this.state;
						this.state = 1;
						this.pullTpl.overwrite(this.pullEl, {
							h: offset.y,
							m: this.langReleaseRefresh,
							l: this.lastUpdate
						});
						Ext.Anim.run(this.pullEl.down('.arrow'), 'rotate', {
							dir: 'ccw',
							fromAngle: 0,
							toAngle: 180
						});
					}
				} else if (!scroller.isDragging) {
					// state 3
					if (this.state !== 3) {
						this.prevState = this.state;
						this.state = 3;
						if (this.prevState == 1) {
							this.loading = true;
							this.lastUpdate = new Date();
							this.resetPulldown(offset);
							this.fireEvent('released', this, this.cmp);
						}
					}
				}
			}
		}
	},
	//private
/*
	processComplete: function() {
		this.loading = false;
		this.lastUpdate = new Date();
		this.pullTpl.overwrite(this.pullEl, {
			h: 0,
			m: this.langPullRefresh,
			l: this.lastUpdate
		});
	},
*/
	constructor: function(config) {
		this.callParent(arguments);
		this.on('released', this.onPullRefresh);
		this.init(this);
	}
});