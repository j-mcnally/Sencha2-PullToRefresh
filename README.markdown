THIS WORKS WITH PR2 & PR3


Usage
=====

Add the following to your list view Ext.define code:

```javascript

extend:"Ext.ux.kohactive.RefreshableList",

```

Installation
============

copy the plugins folder to your project and include the js file in your index.html

```html

<link rel="stylesheet" href="plugins/css/pull_styles.css" type="text/css" media="screen"/>
<script src="plugins/RefreshableList.js" type="text/javascript"></script> 

```
Optional
========

Your can overide the config parameter

```javascript

onPullRefresh: function() {
	//your refresh logic here.
}

```

Shout Outs
==========
Based on VinylFox's Sencha Touch 1.x extension

https://github.com/VinylFox/Ext.ux.touch.ListPullRefresh