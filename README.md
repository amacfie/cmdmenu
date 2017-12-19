# About

Can't remember the syntax for stuff at the command line?
Tell `cmdmenu` what you want and it will help you find the right complete
command.

Similar to [cheat](https://github.com/chrisallenlane/cheat) but different.

# Install

    $ git clone git@github.com:amacfie/cmd-menu.git
    $ cd cmd-menu
    $ sudo npm -g install

# Usage

Example.

    $ cmdmenu -a cmd "get folder size"
    ? Select task (Use arrow keys)
    ❯ Show folder size
      Show file size
      Merge folders
    (Move up and down to reveal more choices)

press enter

    du -sh <folder>
    ? Copy? (Y/n)

Creating aliases is recommended.

    $ alias gim="cmdmenu -a git"
    $ gim <query>

Some example git queries: `list branches`, `undo commit`, `show log for single
file`

# Customizing

Task sets are stored in `tasks`, so it's easy to add more or change existing
tasks.

