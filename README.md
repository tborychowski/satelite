# satelite

A desktop sidebar/dashboard concept inspired by [conky](https://github.com/brndnmtthws/conky), but much easier to configure, extend and with much more power. Built on top of [electron](http://electron.atom.io/) in javascript.

### Features
- cross-platform (it's build with electron, and tested on Ubuntu and Mac)
- plugins - it provides a set of default plugins:
   - clock - time and date
   - weather - get the weather with a forecast using yahoo rss feed
   - gmail - get the unread messages count
   - inoreader - get the unread feeds count
   - shortcuts - shortcuts to folders or apps
- it allows to easily create custom ones (javascript + html + css)
- it is node-based - so you have access to all the node-power to create custom plugins/services
- it has access to the host OS, so if you can run something in terminal - you can do here 
- themes/skins - it will allow for an infinite customisation (with simple html & css)

### Installation
```sh
git clone https://github.com/tborychowski/satelite.git
cd satelite
npm i
npm start &
```

### How does it work
- When the app starts it reads the template html (for now just `default`)
- It finds all the widgets that the template needs and injects the widgets' styles to the main html
- It then injects the template style (template should be able to override a widget css)
- Lastly it initialises all of the widgets


### Configuration
Some widgets might require a config. The structure is very simple:
```json
{
	"widgets": {
		"widget-name": {
			"option": "value"
		}
	}
}
```
See [`config-sample.json`](https://github.com/tborychowski/satelite/blob/master/config-sample.json) for more real-world examples.




### License
*MIT*

- [Satelite icon](https://www.iconfinder.com/icons/531906/antenna_building_communication_radar_satelite_icon#size=128) license is [Creative Commons (Attribution-Share Alike 3.0 Unported)](http://creativecommons.org/licenses/by-sa/3.0/)

