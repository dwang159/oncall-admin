User bootstrap/editor script for oncall.
--

Listing users:

![alt text](screenshots/user_list.png "List Users")

Editing a user user:

![alt text](screenshots/user_edit.png "Edit a user")

Creating a user:

![alt text](screenshots/user_create.png "Creating a user")


###  Setup

    virtualenv env
    . env/bin/activate
    python setup.py develop


### Usage

First edit your mysql settings in `configs/config.dev.yaml`.


    . env/bin/activate
    make

Then visit http://localhost:16652 in your web browser to view/edit/create/delete oncall user accounts.
