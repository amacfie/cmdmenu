# About

Can't remember the syntax for stuff at the command line?
Tell `cmdmenu` what you want and it will help you find the right complete
command.

# Install

    $ git clone git@github.com:amacfie/cmd-menu.git
    $ cd cmd-menu
    $ sudo npm -g install

# Usage

    $ alias gim="cmdmenu -a git"
    $ gim <query>

Example git queries: list branches, undo commit, show log for single file

# Customizing

Task sets are stored in `tasks`, so it's easy to add more or change existing
tasks.

