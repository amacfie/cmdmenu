# About

Can't remember the syntax for stuff at the command line?
Make cheatsheets and search them with `cmdmenu`.

Similar to [cheat](https://github.com/chrisallenlane/cheat) but different.


# Install

    $ git clone git@github.com:amacfie/cmd-menu.git
    $ cd cmd-menu
    $ sudo npm -g install


# Usage

1. Create/get/customize JSON task files. Examples of the file format are
  [here](https://github.com/amacfie/cmdmenu_tasks).
  Each task has a description and a list of keywords to help you search for it.

2. Make an alias for each task file.
    ```bash
    $ alias shm="cmdmenu -f ~/cmdmenu_tasks/ubuntu_general.json"
    $ alias gim="cmdmenu -f ~/cmdmenu_tasks/git.json"
    ```

3. Get task syntax at the command line.

    ```
    $ gim get folder size
    ? Select task (Use arrow keys)
    ❯ Show folder size
      Show file size
      Merge folders
    (Move up and down to reveal more choices)
    ```
    press enter

    ```
    du -sh <folder>
    ? Copy? (Y/n)
    ```

