/*\
title: $:/plugins/EvidentlyCube/TaskList/cleanup.js
type: application/javascript
module-type: startup

Cleans up data after a TaskList is removed
\*/

(function(){

/*jslint node: false, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "evidentlycube-tasklist-cleanup";
exports.before = ["startup"];
exports.after = ["load-modules"];
exports.synchronous = true;

exports.startup = function() {

	if ($tw.node) {
		return;
	}

	var isBusy = false;

	$tw.hooks.addHook("th-deleting-tiddler", function(tiddler) {
		if (
			!tiddler
			|| tiddler.fields.tags.indexOf('TaskList') === -1
			|| tiddler.fields.title.substr(-5) === '.edit'
			|| isBusy
		) {
			return;
		}

		isBusy = true;

		var title = tiddler.fields.title;
		var editTitle = title + '.edit';
		var fields =  $tw.wiki.filterTiddlers("[all[tiddlers]tag[TaskList/Field]]");
		var items =  $tw.wiki.filterTiddlers("[all[tiddlers]tag[TaskList/Item]]");

		for (let i = 0; i < fields.length; i++) {
			var fieldTiddler = $tw.wiki.getTiddler(fields[i]);

			if (fieldTiddler.fields.parent === title || fieldTiddler.fields.parent === editTitle) {
				$tw.wiki.deleteTiddler(fieldTiddler.fields.title);
			}
		}

		for (let i = 0; i < items.length; i++) {
			var itemTiddler = $tw.wiki.getTiddler(items[i]);

			if (itemTiddler.fields.parent === title) {
				$tw.wiki.deleteTiddler(itemTiddler.fields.title);
			}
		}

		$tw.wiki.deleteTiddler(editTitle);

		isBusy = false;
	});
};

})();
