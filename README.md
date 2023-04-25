# Obsidian Countdown Timer Plugin

This plugin for Obsidian (https://obsidian.md) allows you to create a countdown timer inside your markdown notes. The timer will display the remaining time until a specified event, including days, hours, minutes, and seconds.

## Features

-   Display countdown timer in markdown notes
-   Customizable event name
-   Customizable date format (supports both 24-hour and 12-hour format)
-   Error message for invalid date format

## Installation

1. Go to the Community Plugins tab in the Obsidian settings.
2. Search for "Countdown Timer" and click Install.
3. Enable the plugin in the Installed Plugins tab.

## Usage

To insert a countdown timer, add a code block to your note with the language set to `countdown`, followed by the event name and target date on separate lines.

Example:

<pre>
```countdown
My Special Event
2023-12-31 23:59
```
</pre>

The countdown timer will appear in the preview mode of the markdown note.

## Settings

In the plugin settings, you can customize the date format used for parsing the target date. The default format is "YYYY-MM-DD HH:mm", but you can change it according to your preference. The plugin uses Moment.js (https://momentjs.com/docs/#/parsing/string-format/) for date parsing, so refer to its documentation for supported formats.

## License

This plugin is released under the MIT License. For more information, please see the `LICENSE` file in the repository.

## Contributing

Contributions, bug reports, and feature requests are welcome. Please submit a pull request or create an issue on the repository's GitHub page.
