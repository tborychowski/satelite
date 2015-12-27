function getHtml (item) {
	if (typeof item === 'string') item = { path: item };

	var cls = 'link';
	if (item.cmd) {
		cls += ' cmd';
		item.path = item.cmd;
	}
	item.name = item.name || item.path.replace(/\/$/, '').split('/').pop();
	item.path = item.path || item.cmd || '';
	item.icon = item.icon || 'ion-folder';

	return '<li><a class="' + cls + '" href="' + item.path + '" title="' + item.path + '">' +
			'<i class="' + item.icon + '"></i><span class="name">' + item.name + '</span>' +
		'</a></li>';
}


function getGroupsHtml (groups) {
	return groups.map(function (group) {
		group = group || {};
		if (typeof group === 'string' || group.path || group.cmd) group = { items: [group]};
		var name = group.name ? '<h1>' + group.name + '</h1>' : '';

		return name + '<ul>' + group.items.map(getHtml).join('') + '</ul>';
	}).join('');

}


function Widget (el, params, config) {
	this.el = el;
	this.size = params.size;
	this.config = config;
	this.render();
}


Widget.prototype.render = function () {
	// console.log(this.config);
	if (!Array.isArray(this.config)) this.config = [this.config];
	var newHtml = getGroupsHtml.call(this, this.config);
	if (this.oldHtml !== newHtml) this.el.innerHTML = this.oldHtml = newHtml;
};


Widget.prototype.tick = function () {
	this.render();
};


module.exports = Widget;
